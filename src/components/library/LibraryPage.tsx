// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Library Page
// src/components/library/LibraryPage.tsx
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useState, useMemo } from 'react';
import { CocktailCard }      from '@/components/cocktail/CocktailCard';
import { useApp }            from '@/context/AppContext';
import { COCKTAILS, GLASSES, COCKTAIL_CATEGORIES, FLAVOR_TAGS } from '@/lib/data';
import { useDebounce }       from '@/lib/utils';
import type { GlassId, FlavorTag, CocktailCategory } from '@/lib/data';

// ── FILTER TYPES ──────────────────────────────────────────────────────────────

type AbvBucket = 'analcolico' | 'light' | 'mid' | 'strong' | 'vstrong' | null;

const ABV_FILTERS: { id: AbvBucket; label: string }[] = [
  { id: null,        label: 'Tutti'         },
  { id: 'analcolico',label: '0% Analcolico' },
  { id: 'light',     label: '1–13%'         },
  { id: 'mid',       label: '14–22%'        },
  { id: 'strong',    label: '23–30%'        },
  { id: 'vstrong',   label: '31%+'          },
];

function matchAbv(abv: number, bucket: AbvBucket): boolean {
  if (!bucket)                return true;
  if (bucket === 'analcolico') return abv === 0;
  if (bucket === 'light')      return abv > 0  && abv <= 13;
  if (bucket === 'mid')        return abv >= 14 && abv <= 22;
  if (bucket === 'strong')     return abv >= 23 && abv <= 30;
  if (bucket === 'vstrong')    return abv > 30;
  return true;
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────
// No props — reads t/favorites/openModal from AppContext. Rendered from
// src/app/(app)/cocktails/page.tsx
// (Internal filter state — search, category, abv, flavors, diff, glass —
//  stays local to this component since it's UI-only, not shared app state.)

export default function LibraryPage() {
  const { t, favorites, toggleFav, openModal } = useApp();

  const [search,   setSearch]   = useState('');
  const [cat,      setCat]      = useState<CocktailCategory>('Tutti');
  const [abvF,     setAbvF]     = useState<AbvBucket>(null);
  const [flavors,  setFlavors]  = useState<FlavorTag[]>([]);
  const [diffF,    setDiffF]    = useState<1|2|3|null>(null);
  const [glassF,   setGlassF]   = useState<GlassId | null>(null);
  const [showAdv,  setShowAdv]  = useState(false);

  const debouncedSearch = useDebounce(search, 200);

  const toggleFlavor = (f: FlavorTag) =>
    setFlavors(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const clearAll = () => { setAbvF(null); setFlavors([]); setDiffF(null); setGlassF(null); };

  const activeFilters =
    (abvF ? 1 : 0) + flavors.length + (diffF ? 1 : 0) + (glassF ? 1 : 0);

  // ── FILTERED LIST ──────────────────────────────────────────────────────────

  const filtered = useMemo(() => COCKTAILS.filter(c => {
    if (cat === 'Preferiti') return favorites.has(c.id);
    const q = debouncedSearch.toLowerCase();
    return (
      (cat === 'Tutti' || c.cat === cat) &&
      (!q || c.name.toLowerCase().includes(q) || c.tags.some(tg => tg.includes(q))) &&
      matchAbv(c.abv, abvF) &&
      (flavors.length === 0 || flavors.every(f => c.tags.includes(f))) &&
      (!diffF  || c.diff  === diffF) &&
      (!glassF || c.glass === glassF)
    );
  }), [debouncedSearch, cat, abvF, flavors, diffF, glassF, favorites]);

  // ── RENDER ──────────────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '90px 20px 60px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 40, color: t.text }}>🍸 Cocktail</h1>
        {favorites.size > 0 && (
          <span
            style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13, color: t.gold, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}
            onClick={() => setCat('Preferiti')}
          >
            ♥ {favorites.size} preferiti
          </span>
        )}
      </div>
      <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 14, color: t.textMuted, marginBottom: 20 }}>
        {COCKTAILS.length} ricette · mostrando {filtered.length}
      </p>

      {/* Search + filter toggle */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Cerca cocktail, ingrediente o tag..."
          style={{ flex: '1 1 240px', background: t.input, border: `1px solid ${t.inpBdr}`, borderRadius: 8, padding: '10px 14px', color: t.text, fontFamily: 'Raleway, sans-serif', fontSize: 14, outline: 'none' }}
        />
        <button
          onClick={() => setShowAdv(!showAdv)}
          style={{ background: showAdv || activeFilters > 0 ? t.goldSoft : 'none', border: `1px solid ${showAdv || activeFilters > 0 ? t.gold : t.border}`, borderRadius: 8, padding: '10px 16px', cursor: 'pointer', color: showAdv || activeFilters > 0 ? t.gold : t.textMuted, fontFamily: 'Raleway, sans-serif', fontSize: 12, fontWeight: 500, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          ⚙ Filtri{activeFilters > 0 ? ` (${activeFilters})` : ''}
        </button>
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {COCKTAIL_CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{ background: cat === c ? t.goldSoft : 'none', border: `1px solid ${cat === c ? t.gold : t.border}`, borderRadius: 20, padding: '5px 14px', cursor: 'pointer', color: cat === c ? t.gold : t.textMuted, fontFamily: 'Raleway, sans-serif', fontSize: 12, fontWeight: cat === c ? 600 : 400, transition: 'all 0.2s' }}
          >
            {c === 'Preferiti' ? '♥ Preferiti' : c}
          </button>
        ))}
      </div>

      {/* Advanced filter panel */}
      {showAdv && (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>

            {/* ABV */}
            <div style={{ flex: '1 1 200px' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', color: t.gold, fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>Gradazione</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ABV_FILTERS.map(f => (
                  <button
                    key={String(f.id)}
                    onClick={() => setAbvF(abvF === f.id ? null : f.id)}
                    style={{ background: abvF === f.id ? t.goldSoft : 'none', border: `1px solid ${abvF === f.id ? t.gold : t.border}`, borderRadius: 20, padding: '4px 12px', cursor: 'pointer', color: abvF === f.id ? t.gold : t.textMuted, fontFamily: 'Raleway, sans-serif', fontSize: 11, transition: 'all 0.15s' }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Flavor */}
            <div style={{ flex: '1 1 280px' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', color: t.gold, fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>Profilo di Sapore</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {FLAVOR_TAGS.map(f => (
                  <button
                    key={f}
                    onClick={() => toggleFlavor(f)}
                    style={{ background: flavors.includes(f) ? t.goldSoft : 'none', border: `1px solid ${flavors.includes(f) ? t.gold : t.border}`, borderRadius: 20, padding: '4px 12px', cursor: 'pointer', color: flavors.includes(f) ? t.gold : t.textMuted, fontFamily: 'Raleway, sans-serif', fontSize: 11, textTransform: 'capitalize', transition: 'all 0.15s' }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty + Glass */}
            <div style={{ flex: '1 1 200px', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.15em', color: t.gold, fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>Difficoltà</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {([1, 2, 3] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setDiffF(diffF === d ? null : d)}
                      style={{ background: diffF === d ? t.goldSoft : 'none', border: `1px solid ${diffF === d ? t.gold : t.border}`, borderRadius: 8, padding: '5px 12px', cursor: 'pointer', color: diffF === d ? t.gold : t.textMuted, fontSize: 12, transition: 'all 0.15s' }}
                    >
                      {'●'.repeat(d)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.15em', color: t.gold, fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>Bicchiere</div>
                <select
                  value={glassF ?? ''}
                  onChange={e => setGlassF((e.target.value as GlassId) || null)}
                  style={{ background: t.input, border: `1px solid ${t.inpBdr}`, borderRadius: 8, padding: '5px 10px', color: t.text, fontFamily: 'Raleway, sans-serif', fontSize: 12, outline: 'none', cursor: 'pointer' }}
                >
                  <option value="">Tutti</option>
                  {Object.values(GLASSES).map(g => (
                    <option key={g.id} value={g.id} style={{ background: '#0a0810' }}>{g.emoji} {g.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {activeFilters > 0 && (
            <button onClick={clearAll} style={{ marginTop: 14, background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, fontFamily: 'Raleway, sans-serif', fontSize: 12, textDecoration: 'underline', textUnderlineOffset: 2, padding: 0 }}>
              ✕ Cancella tutti i filtri ({activeFilters})
            </button>
          )}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: t.textMuted, fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontStyle: 'italic' }}>
          {cat === 'Preferiti' ? 'Nessun preferito. Clicca ♡ su un cocktail.' : 'Nessun cocktail trovato.'}
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
        {filtered.map(c => (
          <CocktailCard
            key={c.id} cocktail={c} t={t}
            onClick={() => openModal(c)}
            favorites={favorites} onToggleFav={toggleFav}
          />
        ))}
      </div>
    </div>
  );
}
