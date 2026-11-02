// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Cocktail Detail Client Component
// src/app/(app)/cocktails/[slug]/CocktailDetailClient.tsx
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import Link          from 'next/link';
import { useState }  from 'react';
import { GlassSVG }  from '@/components/glass/GlassSVG';
import { CocktailCard } from '@/components/cocktail/CocktailCard';
import { RecipeExportCard } from '@/components/cocktail/CocktailCard';
import { RatingStars } from '@/components/cocktail/CocktailCard';
import { useApp }    from '@/context/AppContext';
import { GLASSES, COCKTAILS } from '@/lib/data';
import type { Cocktail } from '@/lib/data';

interface Props { cocktail: Cocktail; }

export default function CocktailDetailClient({ cocktail: initial }: Props) {
  const { t, favorites, toggleFav, ratings, rateCocktail, openModal } = useApp();
  const [cocktail,    setCocktail]   = useState(initial);
  const [showExport,  setShowExport] = useState(false);

  const gDef  = GLASSES[cocktail.glass] ?? GLASSES.oldfashioned;
  const isFav = favorites.has(cocktail.id);

  // Related cocktails (≥2 shared tags)
  const related = COCKTAILS
    .filter(c => c.id !== cocktail.id)
    .filter(c => c.tags.filter(tag => cocktail.tags.includes(tag)).length >= 2)
    .slice(0, 3);

  const diffLabel = ['', '● Facile', '●● Medio', '●●● Avanzato'][cocktail.diff];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '90px 24px 60px' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 36, fontFamily: 'Raleway, sans-serif', fontSize: 13, color: t.textSub }}>
        <Link href="/cocktails" style={{ color: t.gold, textDecoration: 'none' }}>Cocktail</Link>
        <span>/</span>
        <span>{cocktail.name}</span>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 48, alignItems: 'start' }}>

        {/* ── LEFT: info ── */}
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.2em', color: t.gold, fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>
                {cocktail.cat} · {cocktail.origin}
              </div>
              <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 56, color: t.text, lineHeight: 1, marginBottom: 16 }}>
                {cocktail.name}
              </h1>
            </div>
            {/* Favorite button */}
            <button
              onClick={() => toggleFav(cocktail.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 28, color: isFav ? '#FF4466' : t.textSub, filter: isFav ? 'drop-shadow(0 0 6px #FF4466)' : 'none', transition: 'all 0.2s', flexShrink: 0, marginTop: 4 }}
            >
              {isFav ? '♥' : '♡'}
            </button>
          </div>

          {/* Description */}
          <p style={{ fontSize: 18, color: t.textMuted, fontFamily: 'Raleway, sans-serif', lineHeight: 1.75, marginBottom: 36, maxWidth: 580 }}>
            {cocktail.desc}
          </p>

          {/* Stat row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
            {[
              ['ABV',        cocktail.abv > 0 ? `${cocktail.abv}%` : 'Analcolico'],
              ['Anno',       String(cocktail.year)],
              ['Tempo',      `${cocktail.time} min`],
              ['Calorie',    `~${cocktail.cal} kcal`],
              ['Difficoltà', diffLabel],
            ].map(([k, v]) => (
              <div key={k} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: '12px 18px', minWidth: 90, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: t.textSub, fontFamily: 'Raleway, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: t.gold, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Ingredients */}
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, color: t.text, marginBottom: 16 }}>Ingredienti</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
            {cocktail.ings.map((ing, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: t.card, border: `1px solid ${t.border}`, borderRadius: 10 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: ing.color, border: '1px solid rgba(255,255,255,0.25)', flexShrink: 0 }} />
                <span style={{ flex: 1, fontFamily: 'Raleway, sans-serif', fontSize: 15, color: t.text }}>{ing.name}</span>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: t.gold, fontWeight: 600 }}>{ing.amount} ml</span>
              </div>
            ))}
            <div style={{ padding: '12px 16px', background: t.tag, border: `1px solid ${t.border}`, borderRadius: 10, fontFamily: 'Raleway, sans-serif', fontSize: 14, color: t.textMuted, fontStyle: 'italic' }}>
              🍊 Guarnizione: {cocktail.garnish}
            </div>
          </div>

          {/* Method */}
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, color: t.text, marginBottom: 12 }}>Metodo</h2>
          <p style={{ fontSize: 16, color: t.textMuted, fontFamily: 'Raleway, sans-serif', lineHeight: 1.75, marginBottom: 32, maxWidth: 580 }}>{cocktail.method}</p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {cocktail.tags.map(tag => (
              <span key={tag} style={{ background: t.tag, color: t.gold, fontSize: 12, padding: '5px 14px', borderRadius: 20, fontFamily: 'Raleway, sans-serif', fontWeight: 500 }}>#{tag}</span>
            ))}
          </div>

          {/* Rating */}
          <div style={{ padding: '20px 24px', background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, marginBottom: 32 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', color: t.gold, fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>La Tua Valutazione</div>
            <RatingStars cocktailId={cocktail.id} ratings={ratings} onRate={rateCocktail} t={t} size={28} />
          </div>

          {/* Export button */}
          <button
            onClick={() => setShowExport(true)}
            style={{ background: t.goldSoft, border: `1px solid ${t.gold}`, borderRadius: 8, padding: '12px 28px', cursor: 'pointer', color: t.gold, fontFamily: 'Raleway, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            📤 Condividi Ricetta
          </button>
        </div>

        {/* ── RIGHT: glass + related ── */}
        <div style={{ position: 'sticky', top: 90 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <GlassSVG gDef={gDef} layers={cocktail.ings} ice="cubes" garnish={cocktail.garnish !== 'Nessuno' ? cocktail.garnish : null} size={220} />
          </div>

          {/* Related cocktails */}
          {related.length > 0 && (
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.2em', color: t.gold, fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>Potrebbe Piacerti</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {related.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setCocktail(c)}
                    className="cocktail-card"
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <GlassSVG gDef={GLASSES[c.glass] ?? GLASSES.oldfashioned} layers={c.ings} size={40} />
                    <div>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: t.text, lineHeight: 1.1 }}>{c.name}</div>
                      <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, color: t.textMuted, marginTop: 2 }}>{c.cat} · {c.abv}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showExport && <RecipeExportCard cocktail={cocktail} t={t} onClose={() => setShowExport(false)} />}
    </div>
  );
}
