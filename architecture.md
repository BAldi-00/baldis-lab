# BALDI'S LAB — Architecture Document
_Version 3.0 · Post-Sprint 7 · Full-Stack + Cross-Platform_

> **Stato attuale vs. visione**: questo documento descrive sia ciò che è
> **già costruito e funzionante** (Sprint 1–7: web app Next.js 15 in `src/`,
> struttura flat, Supabase Auth reale, 100 cocktail) sia la **visione futura**
> per mobile/desktop (Sprint 8–9: monorepo `apps/web` + `apps/mobile` +
> `apps/desktop`). Le sezioni 3 e 7 — App Router e API Routes — riflettono
> al 100% la struttura reale consegnata in `src/`. Le sezioni 10–11 (Mobile,
> Desktop) sono roadmap non ancora implementata. Vedi `README.md` per la
> mappa file-per-file di ciò che esiste oggi.

---

## 1. Visione Tecnica

Baldi's Lab è progettato come una **piattaforma multi-target** che condivide business logic, design system e dati tra:

| Target | Stack | Sprint |
|--------|-------|--------|
| **Web App** | Next.js 15 + Supabase | Sprint 1–4 |
| **PWA** | Web App + manifest + SW | Sprint 4 |
| **Mobile iOS/Android** | React Native + Expo | Sprint 5 |
| **Desktop** | Tauri 2 (wrapper Web App) | Sprint 6 |

---

## 2. Monorepo Structure

```
baldis-lab/
├── apps/
│   ├── web/                        # Next.js 15 App Router
│   ├── mobile/                     # React Native + Expo (Sprint 5)
│   └── desktop/                    # Tauri 2 (Sprint 6)
├── packages/
│   ├── design-tokens/              # Shared colors, fonts, spacing
│   ├── cocktail-engine/            # Business logic (color mixing, recognition)
│   ├── ui/                         # Shared headless components
│   └── db/                         # Supabase client + generated types
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   └── 003_functions_views.sql
│   ├── functions/
│   │   ├── ai-bartender/           # Edge Function (Anthropic API proxy)
│   │   └── cocktail-suggest/       # Cabinet → suggestions
│   └── seed.sql
└── docs/
    ├── architecture.md             # This file
    ├── design-system.md
    ├── api.md
    └── roadmap.md
```

---

## 3. Web App — Next.js 15 App Router

```
apps/web/
├── app/
│   ├── layout.tsx                  # Root layout (fonts, providers, AgeGate)
│   ├── page.tsx                    # Home — redirect based on auth state
│   │
│   ├── (auth)/                     # Auth group — no navbar
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── verify-age/page.tsx
│   │
│   ├── (app)/                      # Main app group — with navbar
│   │   ├── layout.tsx              # NavBar + Footer + Providers
│   │   ├── home/page.tsx
│   │   ├── cocktails/
│   │   │   ├── page.tsx            # Library (SSR with filters)
│   │   │   └── [slug]/page.tsx     # Cocktail detail (SSG)
│   │   ├── simulator/page.tsx      # Client-side only
│   │   ├── ai/page.tsx             # AI Bartender (streaming)
│   │   ├── encyclopedia/
│   │   │   ├── page.tsx
│   │   │   ├── ingredients/[slug]/page.tsx
│   │   │   └── techniques/[slug]/page.tsx
│   │   ├── cabinet/page.tsx        # Auth-protected
│   │   └── profile/
│   │       ├── page.tsx
│   │       └── [username]/page.tsx
│   │
│   └── api/
│       ├── cocktails/
│       │   ├── route.ts            # GET /api/cocktails (search + filter)
│       │   └── [id]/route.ts
│       ├── ai/
│       │   └── route.ts            # POST /api/ai (Anthropic proxy, streaming)
│       ├── favorites/route.ts
│       ├── ratings/route.ts
│       └── cabinet/route.ts
│
├── components/
│   ├── glass/
│   │   ├── GlassSVG.tsx            # Core animated glass
│   │   ├── MiniGlass.tsx           # Static card version
│   │   ├── GarnishSVG.tsx          # Garnish renderer
│   │   └── types.ts
│   │
│   ├── simulator/
│   │   ├── SimulatorPage.tsx
│   │   ├── IngredientPanel.tsx
│   │   ├── GlassSelector.tsx
│   │   ├── IceSelector.tsx
│   │   ├── GarnishSelector.tsx
│   │   ├── StatsPanel.tsx
│   │   ├── LayerDisplay.tsx
│   │   └── RecipeExportCard.tsx
│   │
│   ├── cocktail/
│   │   ├── CocktailCard.tsx
│   │   ├── CocktailModal.tsx
│   │   ├── CocktailGrid.tsx        # Grid + virtualization
│   │   ├── RecipeExportCard.tsx
│   │   └── CocktailRating.tsx
│   │
│   ├── library/
│   │   ├── LibraryPage.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx         # Advanced filters
│   │   └── CategoryPills.tsx
│   │
│   ├── ai/
│   │   ├── AIPage.tsx
│   │   ├── ChatBubble.tsx
│   │   ├── ChatInput.tsx
│   │   └── QuickSuggestions.tsx
│   │
│   ├── layout/
│   │   ├── NavBar.tsx
│   │   ├── NavBar.mobile.tsx
│   │   ├── Footer.tsx
│   │   ├── AgeGate.tsx
│   │   └── ThemeProvider.tsx
│   │
│   ├── encyclopedia/
│   │   ├── IngredientCard.tsx
│   │   ├── TechniqueCard.tsx
│   │   └── GlassGuide.tsx
│   │
│   └── cabinet/
│       ├── CabinetPage.tsx
│       ├── IngredientToggle.tsx
│       └── CabinetSuggestions.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   ├── server.ts               # Server Supabase client (cookies)
│   │   └── middleware.ts           # Auth middleware
│   │
│   ├── cocktail-engine/            # Pure functions (no side effects)
│   │   ├── colorMix.ts             # Blend layer colors
│   │   ├── stats.ts                # ABV, calories calculation
│   │   ├── recognition.ts          # Match user mix → cocktail
│   │   └── animation.ts            # useAnimVal hook + rAF utilities
│   │
│   ├── ai/
│   │   ├── bartender.ts            # Anthropic API calls
│   │   └── prompts.ts              # System prompts
│   │
│   └── utils/
│       ├── format.ts               # Number, date, unit formatting
│       ├── seo.ts                  # generateMetadata helpers
│       └── share.ts                # Recipe share card generation
│
├── hooks/
│   ├── useAnimVal.ts               # rAF smooth animation
│   ├── useTheme.ts                 # Theme state + persistence
│   ├── useFavorites.ts             # Optimistic favorites
│   ├── useBarCabinet.ts            # Cabinet CRUD
│   ├── useSearch.ts                # Debounced search
│   └── useAgeVerified.ts           # Age gate persistence
│
├── types/
│   ├── cocktail.ts
│   ├── ingredient.ts
│   ├── glass.ts
│   ├── user.ts
│   └── database.ts                 # Generated by Supabase CLI
│
├── styles/
│   ├── globals.css                 # Reset + CSS custom properties
│   └── themes.ts                   # Theme token objects (TS)
│
├── public/
│   ├── manifest.json               # PWA manifest
│   ├── sw.js                       # Service Worker (auto-generated)
│   ├── icons/                      # PWA icons (16 sizes)
│   └── og/                         # OpenGraph images
│
├── middleware.ts                   # Auth + age gate redirect
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 4. Shared Packages

### `packages/design-tokens/`
```typescript
// colors.ts
export const THEMES = {
  night:     { gold: '#C9A84C', bg: '...', ... },
  day:       { gold: '#8A6518', bg: '...', ... },
  summer:    { gold: '#FFB347', bg: '...', ... },
  winter:    { gold: '#A8D8F0', bg: '...', ... },
  halloween: { gold: '#FF6B00', bg: '...', ... },
  christmas: { gold: '#FFD700', bg: '...', ... },
} as const;

// typography.ts
export const FONTS = {
  display: '"Cormorant Garamond", serif',
  ui:      '"Raleway", sans-serif',
};

// spacing.ts
export const RADIUS = { sm: 8, md: 14, lg: 20, xl: 28 };
```

### `packages/cocktail-engine/`
```typescript
// colorMix.ts
export function blendColors(layers: Layer[]): RgbaColor { ... }
export function parseColor(css: string): RgbaColor { ... }

// stats.ts
export function calculateAbv(layers: Layer[]): number { ... }
export function calculateCalories(layers: Layer[]): number { ... }

// recognition.ts
export function matchCocktail(layers: Layer[], recipes: Recipe[]): Recipe | null { ... }
```

---

## 5. API Routes

### `POST /api/ai`
```typescript
// Streaming response via Anthropic claude-sonnet-4
// Protected: rate limited (10 req/min per user)
// Body: { messages: ChatMessage[], context?: string }
// Returns: text/event-stream
```

### `GET /api/cocktails`
```typescript
// Query: q, category, glass, minAbv, maxAbv, difficulty, tags[], page, limit
// Returns: { cocktails: Cocktail[], total: number, hasMore: boolean }
// Cache: 1h (ISR)
```

### `POST /api/favorites`
```typescript
// Body: { cocktailId: number }
// Auth: required
// Returns: { favorited: boolean }
```

---

## 6. Supabase Edge Functions

### `ai-bartender/index.ts`
```typescript
// Proxies Anthropic API (keeps key server-side)
// Validates JWT, rate limits, logs usage
// Streams response back to client
```

### `cocktail-suggest/index.ts`
```typescript
// Reads user's bar_cabinet
// Returns makeable cocktails ranked by completeness %
// Called on Cabinet page load
```

---

## 7. Authentication Flow

```
User visits app
      │
      ▼
AgeGate (client-side, localStorage flag after verify)
      │ age ok
      ▼
Has JWT token? ──No──→ Continue as guest (read-only)
      │ Yes
      ▼
Supabase Auth → user_profiles record
      │
      ├─ favorites synced to DB
      ├─ bar_cabinet synced to DB
      ├─ custom_cocktails saved to DB
      └─ view_history saved to DB
```

### Supported Providers
```typescript
// supabase/config.toml
[auth.external.google]     enabled = true
[auth.external.apple]      enabled = true
[auth]                     email_confirm_required = true
```

---

## 8. SEO Strategy

```typescript
// app/(app)/cocktails/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const cocktail = await getCocktail(params.slug);
  return {
    title: `${cocktail.name} — Ricetta | Baldi's Lab`,
    description: cocktail.description,
    openGraph: {
      images: [`/og/${cocktail.slug}.png`],  // Generated at build time
      type: 'article',
    },
    other: {
      'script:ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: cocktail.name,
        recipeIngredient: cocktail.ingredients.map(i => `${i.amount_ml}ml ${i.name}`),
        recipeInstructions: cocktail.method,
        estimatedCost: { '@type': 'MonetaryAmount', currency: 'EUR' },
      })
    }
  };
}
```

### Target Lighthouse Scores
| Metric | Target |
|--------|--------|
| Performance | ≥ 92 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| PWA | ✅ |

---

## 9. PWA Configuration

```json
// public/manifest.json
{
  "name": "Baldi's Lab — Mixology Studio",
  "short_name": "Baldi's Lab",
  "description": "Il tuo laboratorio digitale di mixology premium",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#08080f",
  "theme_color": "#C9A84C",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "categories": ["food", "lifestyle", "entertainment"],
  "screenshots": [
    { "src": "/og/home.png", "sizes": "1280x720", "type": "image/png" }
  ]
}
```

---

## 10. Mobile App (Sprint 5) — React Native + Expo

```
apps/mobile/
├── app/                            # Expo Router (file-based)
│   ├── (tabs)/
│   │   ├── index.tsx               # Home
│   │   ├── simulator.tsx
│   │   ├── cocktails.tsx
│   │   ├── ai.tsx
│   │   └── profile.tsx
│   └── cocktail/[id].tsx
│
├── components/
│   ├── GlassSVG.native.tsx         # React Native SVG version
│   └── ...                         # Shared via packages/ui
│
├── store/
│   ├── useThemeStore.ts            # Zustand
│   ├── useFavoritesStore.ts
│   └── useCabinetStore.ts
│
└── app.json                        # Expo config (iOS + Android)
```

### Shared Logic Strategy
```
packages/cocktail-engine/  ← 100% shared (pure TS)
packages/design-tokens/    ← 100% shared
components/glass/          ← Web: SVG | Native: react-native-svg
hooks/use*.ts              ← ~80% shared (no DOM APIs)
```

---

## 11. Desktop App (Sprint 6) — Tauri 2

```
apps/desktop/
├── src-tauri/
│   ├── src/
│   │   ├── main.rs                 # Tauri entry point
│   │   └── commands/
│   │       ├── storage.rs          # Local SQLite via rusqlite
│   │       └── export.rs           # PDF/PNG export (native)
│   ├── tauri.conf.json
│   └── Cargo.toml
└── (loads Web App via webview)
```

#### Desktop-specific features
- Offline mode (SQLite local cache via Tauri commands)
- Native PDF export (Rust backend)
- System tray integration
- Native notifications for "Cocktail of the Day"

---

## 12. Deployment

```yaml
# Recommended stack
Web App:     Vercel (Edge Runtime + ISR)
Database:    Supabase (PostgreSQL 16, pgvector ready)
CDN/Assets:  Cloudflare R2 (cocktail images)
AI Proxy:    Supabase Edge Functions
Monitoring:  Sentry + Vercel Analytics
```

---

## 13. Roadmap

| Sprint | Focus | Est. |
|--------|-------|------|
| ✅ 1 | Core UI, Simulator SVG, AI Bartender, Library | done |
| ✅ 2 | 6 Temi, AgeGate, 35 cocktail, Favorites, Garnish | done |
| ✅ 3 | 60 cocktail, Filtri Avanzati, RecipeExport, Schema SQL | done |
| ✅ 4 | Auth UI, Rating Stars, Profilo, 17 file modulari | done |
| ✅ 5 | 80 cocktail, data.ts completo, API routes, PWA | done |
| ✅ 6 | 100 cocktail, Export PNG reale (Canvas) | done |
| ✅ R | Refactor architetturale: routing reale, file separati, AI proxy sicuro | done |
| ✅ 7 | Supabase Auth reale, middleware, OAuth, API routes attive | done |
| 🔲 8 | Email/password completo, Tauri Desktop, Premium tier | 3 wk |
| 🔲 9 | Simulatore 3D (Three.js), Testing E2E, Performance, Launch | 3 wk |
