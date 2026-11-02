// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Cocktail Components
// src/components/cocktail/CocktailCard.tsx
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useState } from 'react';
import { GlassSVG, MiniGlass } from '@/components/glass/GlassSVG';
import { GLASSES }               from '@/lib/data';
import type { Cocktail }          from '@/lib/data';
import type { Theme }             from '@/lib/themes';

// ── RATING STARS ──────────────────────────────────────────────────────────────

interface RatingStarsProps {
  cocktailId: number;
  ratings:    Record<number, number>;
  onRate:     (id: number, stars: number) => void;
  t:          Theme;
  size?:      number;
}

export function RatingStars({ cocktailId, ratings, onRate, t, size = 18 }: RatingStarsProps) {
  const [hover,   setHover]   = useState(0);
  const current = ratings[cocktailId] ?? 0;

  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[1,2,3,4,5].map(s => (
        <span
          key={s}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onRate(cocktailId, s === current ? 0 : s)}
          style={{
            fontSize: size, cursor: 'pointer', lineHeight: 1, userSelect: 'none',
            color: (hover || current) >= s ? '#FFD700' : 'rgba(255,215,0,0.2)',
            transition: 'color 0.15s',
          }}
        >
          ★
        </span>
      ))}
      {current > 0 && (
        <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, color: t.textMuted, marginLeft: 4 }}>
          {current}/5
        </span>
      )}
    </div>
  );
}

// ── COCKTAIL CARD ─────────────────────────────────────────────────────────────

interface CocktailCardProps {
  cocktail:    Cocktail;
  t:           Theme;
  onClick:     () => void;
  favorites?:  Set<number>;
  onToggleFav?: (id: number) => void;
}

export function CocktailCard({ cocktail, t, onClick, favorites, onToggleFav }: CocktailCardProps) {
  const gDef  = GLASSES[cocktail.glass] ?? GLASSES.oldfashioned;
  const isFav = favorites?.has(cocktail.id) ?? false;
  const diffDots = ['●','●','●'].map((d, i) => (
    <span key={i} style={{ color: i < cocktail.diff ? t.gold : t.textSub, fontSize: 10 }}>{d}</span>
  ));

  return (
    <div
      className="cocktail-card"
      onClick={onClick}
      style={{
        background: t.card, border: `1px solid ${t.border}`,
        borderRadius: 14, padding: 20, cursor: 'pointer',
        transition: 'all 0.3s', overflow: 'hidden', position: 'relative',
      }}
    >
      {/* Top gradient bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg,transparent,${cocktail.color},transparent)`,
      }} />

      {/* Favorite button */}
      {onToggleFav && (
        <button
          onClick={e => { e.stopPropagation(); onToggleFav(cocktail.id); }}
          style={{
            position: 'absolute', top: 14, right: 14,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 17, lineHeight: 1, padding: 4,
            color: isFav ? '#FF4466' : t.textSub,
            filter: isFav ? 'drop-shadow(0 0 4px #FF4466)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {isFav ? '♥' : '♡'}
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, paddingRight: onToggleFav ? 20 : 0 }}>
          <div style={{
            fontSize: 10, letterSpacing: '0.15em', color: t.textSub,
            fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase',
            marginBottom: 6, fontWeight: 600,
          }}>
            {cocktail.cat}
          </div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: t.text, marginBottom: 6, lineHeight: 1.1 }}>
            {cocktail.name}
          </h3>
          <div style={{ fontSize: 11, color: t.textMuted, fontFamily: 'Raleway, sans-serif', fontStyle: 'italic', marginBottom: 12 }}>
            {cocktail.origin}
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <MiniGlass cocktail={cocktail} gDef={gDef} size={48} />
        </div>
      </div>

      <p style={{
        fontSize: 13, color: t.textMuted, fontFamily: 'Raleway, sans-serif', lineHeight: 1.6,
        marginBottom: 14, display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {cocktail.desc}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            cocktail.abv > 0 ? `${cocktail.abv}% Vol` : 'Analcolico',
            `${cocktail.time} min`,
          ].map((label, i) => (
            <span key={i} style={{
              background: t.tag, color: t.gold, fontSize: 11,
              padding: '3px 9px', borderRadius: 12,
              fontFamily: 'Raleway, sans-serif', fontWeight: 600,
            }}>
              {label}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 2 }}>{diffDots}</div>
      </div>
    </div>
  );
}

// ── RECIPE EXPORT CARD ────────────────────────────────────────────────────────

interface RecipeExportCardProps {
  cocktail: Cocktail;
  t:        Theme;
  onClose:  () => void;
}

export function RecipeExportCard({ cocktail, t, onClose }: RecipeExportCardProps) {
  const gDef = GLASSES[cocktail.glass] ?? GLASSES.oldfashioned;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 360, borderRadius: 20, overflow: 'hidden',
          background: 'linear-gradient(160deg,#0E0820 0%,#080810 60%,#0A0E1E 100%)',
          border: '1px solid rgba(201,168,76,0.3)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
        }}
      >
        <div style={{ height: 3, background: `linear-gradient(90deg,transparent,${cocktail.color},transparent)` }} />
        <div style={{ padding: '28px 28px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(201,168,76,0.6)', fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', marginBottom: 4 }}>
                {cocktail.cat}
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 34, color: '#F5EDD8', lineHeight: 1, fontWeight: 600 }}>
                {cocktail.name}
              </h2>
              <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, color: 'rgba(245,237,216,0.4)', fontStyle: 'italic', marginTop: 4 }}>
                {cocktail.origin}
              </div>
            </div>
            <GlassSVG gDef={gDef} layers={cocktail.ings} size={80} />
          </div>

          {/* Ingredients */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#C9A84C', fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', marginBottom: 10 }}>Ingredienti</div>
            {cocktail.ings.map((ing, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: ing.color, border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }} />
                <span style={{ flex: 1, fontFamily: 'Raleway, sans-serif', fontSize: 13, color: 'rgba(245,237,216,0.85)' }}>{ing.name}</span>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, color: '#C9A84C', fontWeight: 600 }}>{ing.amount} ml</span>
              </div>
            ))}
          </div>

          {/* Garnish */}
          <div style={{ padding: '10px 12px', background: 'rgba(201,168,76,0.07)', borderRadius: 8, marginBottom: 18, fontFamily: 'Raleway, sans-serif', fontSize: 12, color: 'rgba(245,237,216,0.7)' }}>
            🍊 <em>{cocktail.garnish}</em>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {([['ABV', cocktail.abv > 0 ? `${cocktail.abv}%` : '0%'], ['Tempo', `${cocktail.time}min`], ['Cal', `~${cocktail.cal}`]] as [string,string][]).map(([k, v]) => (
              <div key={k} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 8, padding: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.15em', color: 'rgba(245,237,216,0.4)', fontFamily: 'Raleway, sans-serif', marginBottom: 3 }}>{k}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, color: '#C9A84C', fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '12px 28px', borderTop: '1px solid rgba(201,168,76,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 13, color: 'rgba(201,168,76,0.5)', letterSpacing: '0.08em' }}>BALDI'S LAB</span>
          <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 10, color: 'rgba(245,237,216,0.3)' }}>📷 Screenshot per condividere</span>
        </div>
      </div>
      <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,237,216,0.4)', fontSize: 24 }}>✕</button>
    </div>
  );
}

// ── COCKTAIL MODAL ────────────────────────────────────────────────────────────

interface CocktailModalProps {
  cocktail:    Cocktail;
  t:           Theme;
  onClose:     () => void;
  favorites?:  Set<number>;
  onToggleFav?: (id: number) => void;
  ratings?:    Record<number, number>;
  onRate?:     (id: number, stars: number) => void;
}

export function CocktailModal({
  cocktail, t, onClose,
  favorites   = new Set(),
  onToggleFav,
  ratings     = {},
  onRate,
}: CocktailModalProps) {
  const gDef        = GLASSES[cocktail.glass] ?? GLASSES.oldfashioned;
  const isFav       = favorites.has(cocktail.id);
  const [showExport, setShowExport] = useState(false);

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 20, maxWidth: 700, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '36px 32px', position: 'relative', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>

        {/* Top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderRadius: '20px 20px 0 0', background: `linear-gradient(90deg,transparent,${cocktail.color},transparent)` }} />

        {/* Controls */}
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, fontSize: 22 }}>✕</button>
        {onToggleFav && (
          <button onClick={() => onToggleFav(cocktail.id)} style={{ position: 'absolute', top: 16, right: 52, background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: isFav ? '#FF4466' : t.textMuted, transition: 'all 0.2s' }}>
            {isFav ? '♥' : '♡'}
          </button>
        )}

        {/* Content */}
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', color: t.gold, fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>
              {cocktail.cat} · {cocktail.origin}
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 44, color: t.text, marginBottom: 12, lineHeight: 1 }}>
              {cocktail.name}
            </h2>
            <p style={{ fontSize: 15, color: t.textMuted, fontFamily: 'Raleway, sans-serif', lineHeight: 1.7, marginBottom: 24 }}>
              {cocktail.desc}
            </p>

            {/* Ingredients */}
            <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: t.text, marginBottom: 12 }}>Ingredienti</h4>
            {cocktail.ings.map((ing, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: ing.color, border: '1px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 14, color: t.text, flex: 1 }}>{ing.name}</span>
                <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13, color: t.gold, fontWeight: 600 }}>{ing.amount} ml</span>
              </div>
            ))}

            {/* Method */}
            <div style={{ marginTop: 20, marginBottom: 16 }}>
              <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: t.text, marginBottom: 8 }}>Metodo</h4>
              <p style={{ fontSize: 14, color: t.textMuted, fontFamily: 'Raleway, sans-serif', lineHeight: 1.7 }}>{cocktail.method}</p>
            </div>

            <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13, color: t.textMuted, fontStyle: 'italic' }}>
              🍊 Garnish: {cocktail.garnish}
            </div>
          </div>

          {/* Right: glass + stats */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <GlassSVG gDef={gDef} layers={cocktail.ings} ice="cubes" size={160} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%' }}>
              {([['ABV', `${cocktail.abv}%`], ['Cal', `~${cocktail.cal}`], ['Tempo', `${cocktail.time} min`], ['Diff', ['•','••','•••'][cocktail.diff-1]]] as [string,string][]).map(([k, v]) => (
                <div key={k} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: t.textSub, fontFamily: 'Raleway, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 16, color: t.gold, fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 20 }}>
          {cocktail.tags.map(tag => (
            <span key={tag} style={{ background: t.tag, color: t.gold, fontSize: 11, padding: '4px 12px', borderRadius: 20, fontFamily: 'Raleway, sans-serif', fontWeight: 500 }}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Rating */}
        {onRate && (
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', color: t.gold, fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>
              La Tua Valutazione
            </div>
            <RatingStars cocktailId={cocktail.id} ratings={ratings} onRate={onRate} t={t} size={22} />
          </div>
        )}

        {/* Export button */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => setShowExport(true)} style={{ background: t.goldSoft, border: `1px solid ${t.gold}`, borderRadius: 8, padding: '10px 24px', cursor: 'pointer', color: t.gold, fontFamily: 'Raleway, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 8 }}>
            📤 Condividi Ricetta
          </button>
        </div>
      </div>

      {showExport && <RecipeExportCard cocktail={cocktail} t={t} onClose={() => setShowExport(false)} />}
    </div>
  );
}
