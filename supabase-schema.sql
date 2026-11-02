-- ═══════════════════════════════════════════════════════════════════════════
-- BALDI'S LAB — Supabase Database Schema v1.0
-- Sprint 3 · Supports: Web App, Future Mobile & Desktop
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";         -- Full-text trigram search
CREATE EXTENSION IF NOT EXISTS "unaccent";         -- Accent-insensitive search

-- ─────────────────────────────────────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TYPE app_theme     AS ENUM ('night','day','summer','winter','halloween','christmas');
CREATE TYPE glass_type    AS ENUM ('martini','highball','oldfashioned','wine','coupe','margarita');
CREATE TYPE difficulty    AS ENUM ('easy','medium','hard');
CREATE TYPE ing_category  AS ENUM ('Bitter','Gin','Vodka','Rum','Tequila','Whisky','Vino',
                                    'Liquori','Succhi','Sciroppi','Soft Drinks','Altro','Erbe');
CREATE TYPE account_tier  AS ENUM ('free','pro','professional','enterprise');
CREATE TYPE business_type AS ENUM ('bar','restaurant','hotel','catering','private');

-- ─────────────────────────────────────────────────────────────────────────────
-- USER PROFILES  (extends auth.users)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.user_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT UNIQUE NOT NULL CHECK (length(username) BETWEEN 3 AND 30
                    AND username ~ '^[a-zA-Z0-9_.-]+$'),
  display_name    TEXT NOT NULL CHECK (length(display_name) BETWEEN 1 AND 60),
  avatar_url      TEXT,
  bio             TEXT CHECK (length(bio) <= 300),
  preferred_theme app_theme DEFAULT 'night',
  age_verified    BOOLEAN DEFAULT FALSE NOT NULL,
  tier            account_tier DEFAULT 'free' NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER trg_user_profiles_updated
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ─────────────────────────────────────────────────────────────────────────────
-- INGREDIENTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.ingredients (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL UNIQUE,
  name_en         TEXT,                                   -- English name for i18n
  category        ing_category NOT NULL,
  abv             NUMERIC(5,2) DEFAULT 0 CHECK (abv >= 0 AND abv <= 100),
  color_hex       TEXT NOT NULL DEFAULT '#888888',        -- Display color
  color_opacity   NUMERIC(3,2) DEFAULT 0.9,
  description     TEXT,
  origin          TEXT,
  year_created    INTEGER,
  flavor_notes    TEXT[],                                 -- ['vaniglia','caramello','quercia']
  is_effervescent BOOLEAN DEFAULT FALSE,
  calories_per_ml NUMERIC(6,2),                          -- kcal per ml
  is_alcoholic    BOOLEAN GENERATED ALWAYS AS (abv > 0) STORED,
  slug            TEXT UNIQUE GENERATED ALWAYS AS (lower(regexp_replace(name,' ','-','g'))) STORED,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER trg_ingredients_updated
  BEFORE UPDATE ON public.ingredients
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Full-text search index
CREATE INDEX idx_ingredients_search ON public.ingredients
  USING GIN (to_tsvector('italian', coalesce(name,'') || ' ' || coalesce(description,'')));

-- ─────────────────────────────────────────────────────────────────────────────
-- COCKTAILS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.cocktails (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL UNIQUE,
  name_en         TEXT,
  category        TEXT NOT NULL,
  glass_type      glass_type NOT NULL,
  abv             NUMERIC(5,2) DEFAULT 0,
  difficulty      difficulty DEFAULT 'easy',
  time_minutes    INTEGER DEFAULT 5 CHECK (time_minutes > 0),
  calories        INTEGER,
  year_created    INTEGER,
  origin          TEXT,
  description     TEXT,
  method          TEXT,
  garnish         TEXT,
  color_hex       TEXT DEFAULT '#888888',
  gradient_css    TEXT,                                   -- CSS gradient string
  is_alcoholic    BOOLEAN GENERATED ALWAYS AS (abv > 0) STORED,
  is_published    BOOLEAN DEFAULT TRUE,
  is_seasonal     BOOLEAN DEFAULT FALSE,
  season_theme    app_theme,                              -- if seasonal, which theme
  slug            TEXT UNIQUE GENERATED ALWAYS AS (lower(regexp_replace(name,' ','-','g'))) STORED,
  view_count      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER trg_cocktails_updated
  BEFORE UPDATE ON public.cocktails
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE INDEX idx_cocktails_category    ON public.cocktails(category);
CREATE INDEX idx_cocktails_glass       ON public.cocktails(glass_type);
CREATE INDEX idx_cocktails_abv         ON public.cocktails(abv);
CREATE INDEX idx_cocktails_difficulty  ON public.cocktails(difficulty);
CREATE INDEX idx_cocktails_published   ON public.cocktails(is_published);
CREATE INDEX idx_cocktails_search ON public.cocktails
  USING GIN (to_tsvector('italian', coalesce(name,'') || ' ' || coalesce(description,'')));

-- ─────────────────────────────────────────────────────────────────────────────
-- COCKTAIL INGREDIENTS  (join table — ordered)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.cocktail_ingredients (
  id             SERIAL PRIMARY KEY,
  cocktail_id    INTEGER NOT NULL REFERENCES public.cocktails(id) ON DELETE CASCADE,
  ingredient_id  INTEGER NOT NULL REFERENCES public.ingredients(id),
  amount_ml      NUMERIC(8,2) NOT NULL CHECK (amount_ml > 0),
  unit           TEXT DEFAULT 'ml',                       -- ml | dash | piece | g
  display_order  INTEGER DEFAULT 0,
  is_optional    BOOLEAN DEFAULT FALSE,
  notes          TEXT,                                    -- 'float on top', 'frozen'
  UNIQUE(cocktail_id, ingredient_id)
);
CREATE INDEX idx_ci_cocktail    ON public.cocktail_ingredients(cocktail_id);
CREATE INDEX idx_ci_ingredient  ON public.cocktail_ingredients(ingredient_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- COCKTAIL TAGS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.cocktail_tags (
  cocktail_id  INTEGER NOT NULL REFERENCES public.cocktails(id) ON DELETE CASCADE,
  tag          TEXT NOT NULL CHECK (length(tag) BETWEEN 2 AND 30),
  PRIMARY KEY (cocktail_id, tag)
);
CREATE INDEX idx_tags_tag ON public.cocktail_tags(tag);

-- ─────────────────────────────────────────────────────────────────────────────
-- COCKTAIL VARIANTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.cocktail_variants (
  id              SERIAL PRIMARY KEY,
  parent_id       INTEGER NOT NULL REFERENCES public.cocktails(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  change_notes    TEXT,                                   -- 'Replace gin with mezcal'
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- FAVORITES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.favorites (
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cocktail_id  INTEGER NOT NULL REFERENCES public.cocktails(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, cocktail_id)
);
CREATE INDEX idx_favorites_user     ON public.favorites(user_id);
CREATE INDEX idx_favorites_cocktail ON public.favorites(cocktail_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- RATINGS  (1–5 stars)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.ratings (
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cocktail_id  INTEGER NOT NULL REFERENCES public.cocktails(id) ON DELETE CASCADE,
  stars        SMALLINT NOT NULL CHECK (stars BETWEEN 1 AND 5),
  review       TEXT CHECK (length(review) <= 500),
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, cocktail_id)
);
CREATE INDEX idx_ratings_cocktail ON public.ratings(cocktail_id);

-- Denormalized avg_rating on cocktails (updated via trigger)
ALTER TABLE public.cocktails ADD COLUMN avg_rating NUMERIC(3,2) DEFAULT NULL;
ALTER TABLE public.cocktails ADD COLUMN rating_count INTEGER DEFAULT 0;

CREATE OR REPLACE FUNCTION sync_cocktail_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.cocktails SET
    avg_rating   = (SELECT ROUND(AVG(stars)::NUMERIC,2) FROM public.ratings WHERE cocktail_id = COALESCE(NEW.cocktail_id,OLD.cocktail_id)),
    rating_count = (SELECT COUNT(*) FROM public.ratings WHERE cocktail_id = COALESCE(NEW.cocktail_id,OLD.cocktail_id))
  WHERE id = COALESCE(NEW.cocktail_id,OLD.cocktail_id);
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_ratings_sync
  AFTER INSERT OR UPDATE OR DELETE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION sync_cocktail_rating();

-- ─────────────────────────────────────────────────────────────────────────────
-- CUSTOM COCKTAILS  (user-created in Simulator)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.custom_cocktails (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 80),
  description  TEXT,
  glass_type   glass_type NOT NULL,
  ice_type     TEXT CHECK (ice_type IN ('cubes','crushed','sphere','stick','none')),
  garnish      TEXT,
  salt_rim     BOOLEAN DEFAULT FALSE,
  is_public    BOOLEAN DEFAULT FALSE,
  abv          NUMERIC(5,2),
  calories     INTEGER,
  share_token  TEXT UNIQUE DEFAULT encode(gen_random_bytes(8),'hex'),
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_custom_user   ON public.custom_cocktails(user_id);
CREATE INDEX idx_custom_public ON public.custom_cocktails(is_public) WHERE is_public = TRUE;
CREATE TRIGGER trg_custom_updated
  BEFORE UPDATE ON public.custom_cocktails
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ─────────────────────────────────────────────────────────────────────────────
-- CUSTOM COCKTAIL LAYERS  (ordered ingredient list)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.custom_cocktail_layers (
  id               SERIAL PRIMARY KEY,
  custom_cocktail_id UUID NOT NULL REFERENCES public.custom_cocktails(id) ON DELETE CASCADE,
  ingredient_id    INTEGER REFERENCES public.ingredients(id),
  custom_name      TEXT,                                  -- if ingredient not in DB
  amount_ml        NUMERIC(8,2) NOT NULL CHECK (amount_ml > 0),
  color_hex        TEXT,
  display_order    INTEGER DEFAULT 0
);
CREATE INDEX idx_ccl_cocktail ON public.custom_cocktail_layers(custom_cocktail_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- BAR CABINET  (personal inventory)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.bar_cabinet (
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient_id  INTEGER NOT NULL REFERENCES public.ingredients(id),
  quantity_ml    NUMERIC(8,1),                            -- NULL = just "have it"
  brand          TEXT,
  notes          TEXT,
  added_at       TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, ingredient_id)
);
CREATE INDEX idx_cabinet_user ON public.bar_cabinet(user_id);
CREATE TRIGGER trg_cabinet_updated
  BEFORE UPDATE ON public.bar_cabinet
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ─────────────────────────────────────────────────────────────────────────────
-- VIEWING HISTORY
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.view_history (
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cocktail_id  INTEGER NOT NULL REFERENCES public.cocktails(id) ON DELETE CASCADE,
  viewed_at    TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, cocktail_id)
);
CREATE INDEX idx_history_user ON public.view_history(user_id, viewed_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- PROFESSIONAL ACCOUNTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.professional_profiles (
  user_id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name   TEXT NOT NULL,
  business_type   business_type NOT NULL,
  address         TEXT,
  city            TEXT,
  country         TEXT DEFAULT 'IT',
  website         TEXT,
  instagram       TEXT,
  is_verified     BOOLEAN DEFAULT FALSE,
  tier            account_tier DEFAULT 'professional',
  staff_count     INTEGER DEFAULT 1,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable RLS on all user tables
ALTER TABLE public.user_profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_cocktails      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_cocktail_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bar_cabinet           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.view_history          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;

-- user_profiles: own row only
CREATE POLICY "Users read own profile"   ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- favorites: own data only
CREATE POLICY "Users manage own favorites" ON public.favorites
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ratings: read all public, write own
CREATE POLICY "Anyone reads ratings"     ON public.ratings FOR SELECT USING (TRUE);
CREATE POLICY "Users manage own ratings" ON public.ratings
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- custom_cocktails: own + public read
CREATE POLICY "Users manage own customs" ON public.custom_cocktails
  USING (auth.uid() = user_id OR is_public = TRUE)
  WITH CHECK (auth.uid() = user_id);

-- bar_cabinet: own data only
CREATE POLICY "Users manage own cabinet" ON public.bar_cabinet
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Cocktails & ingredients are public (read-only for users, admin-only for write)
ALTER TABLE public.cocktails             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cocktail_ingredients  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cocktail_tags         ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read cocktails"    ON public.cocktails FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can read ingredients"  ON public.ingredients FOR SELECT USING (TRUE);
CREATE POLICY "Public can read ci"           ON public.cocktail_ingredients FOR SELECT USING (TRUE);
CREATE POLICY "Public can read tags"         ON public.cocktail_tags FOR SELECT USING (TRUE);

-- ─────────────────────────────────────────────────────────────────────────────
-- USEFUL VIEWS
-- ─────────────────────────────────────────────────────────────────────────────

-- Full cocktail view (joins ingredients)
CREATE VIEW public.v_cocktails_full AS
SELECT
  c.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id',   ci.ingredient_id,
        'name', i.name,
        'amount_ml', ci.amount_ml,
        'unit', ci.unit,
        'color', i.color_hex,
        'opacity', i.color_opacity,
        'order', ci.display_order,
        'optional', ci.is_optional
      ) ORDER BY ci.display_order
    ) FILTER (WHERE ci.id IS NOT NULL),
    '[]'
  ) AS ingredients,
  COALESCE(
    array_agg(ct.tag ORDER BY ct.tag) FILTER (WHERE ct.tag IS NOT NULL),
    '{}'
  ) AS tags
FROM public.cocktails c
LEFT JOIN public.cocktail_ingredients ci ON ci.cocktail_id = c.id
LEFT JOIN public.ingredients i ON i.id = ci.ingredient_id
LEFT JOIN public.cocktail_tags ct ON ct.cocktail_id = c.id
GROUP BY c.id;

-- Cabinet cocktail suggestions (what can I make?)
CREATE VIEW public.v_cabinet_suggestions AS
SELECT
  u.user_id,
  c.id AS cocktail_id,
  c.name,
  c.glass_type,
  c.abv,
  c.difficulty,
  COUNT(DISTINCT ci.ingredient_id) AS total_ingredients,
  COUNT(DISTINCT cab.ingredient_id) AS owned_ingredients,
  ROUND(
    COUNT(DISTINCT cab.ingredient_id)::NUMERIC / COUNT(DISTINCT ci.ingredient_id) * 100
  )::INTEGER AS completeness_pct
FROM public.bar_cabinet u
CROSS JOIN public.cocktails c
JOIN public.cocktail_ingredients ci ON ci.cocktail_id = c.id
LEFT JOIN public.bar_cabinet cab
  ON cab.user_id = u.user_id AND cab.ingredient_id = ci.ingredient_id
WHERE c.is_published = TRUE
GROUP BY u.user_id, c.id, c.name, c.glass_type, c.abv, c.difficulty
HAVING COUNT(DISTINCT cab.ingredient_id) >= COUNT(DISTINCT ci.ingredient_id) - 1
ORDER BY completeness_pct DESC;

-- ─────────────────────────────────────────────────────────────────────────────
-- FUNCTIONS
-- ─────────────────────────────────────────────────────────────────────────────

-- Search cocktails (trigram + tag + category)
CREATE OR REPLACE FUNCTION public.search_cocktails(
  q TEXT,
  p_category TEXT DEFAULT NULL,
  p_glass glass_type DEFAULT NULL,
  p_min_abv NUMERIC DEFAULT NULL,
  p_max_abv NUMERIC DEFAULT NULL,
  p_difficulty difficulty DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS SETOF public.cocktails LANGUAGE sql STABLE AS $$
  SELECT c.* FROM public.cocktails c
  WHERE c.is_published = TRUE
    AND (q IS NULL OR q = '' OR
         to_tsvector('italian', c.name||' '||coalesce(c.description,'')) @@ plainto_tsquery('italian', q)
         OR c.name ILIKE '%' || q || '%')
    AND (p_category IS NULL OR c.category = p_category)
    AND (p_glass IS NULL OR c.glass_type = p_glass)
    AND (p_min_abv IS NULL OR c.abv >= p_min_abv)
    AND (p_max_abv IS NULL OR c.abv <= p_max_abv)
    AND (p_difficulty IS NULL OR c.difficulty = p_difficulty)
  ORDER BY
    CASE WHEN q IS NOT NULL AND q != '' THEN
      ts_rank(to_tsvector('italian', c.name||' '||coalesce(c.description,'')),
              plainto_tsquery('italian', q))
    ELSE 0 END DESC,
    c.view_count DESC
  LIMIT p_limit OFFSET p_offset;
$$;

-- Increment view count (called from frontend)
CREATE OR REPLACE FUNCTION public.increment_view_count(p_cocktail_id INTEGER)
RETURNS VOID LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE public.cocktails SET view_count = view_count + 1 WHERE id = p_cocktail_id;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE BUCKETS (Supabase Storage)
-- ─────────────────────────────────────────────────────────────────────────────
-- Run in Supabase Dashboard → Storage
-- INSERT INTO storage.buckets (id, name, public) VALUES ('cocktail-images', 'cocktail-images', TRUE);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('ingredient-images', 'ingredient-images', TRUE);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('user-avatars', 'user-avatars', TRUE);

-- ─────────────────────────────────────────────────────────────────────────────
-- SEED: initial categories metadata
-- ─────────────────────────────────────────────────────────────────────────────
-- (Run seed.sql separately for full ingredient and cocktail data)
-- See: supabase/seed.sql
