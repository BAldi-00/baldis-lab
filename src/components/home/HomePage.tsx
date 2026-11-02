// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Home Page + Ambient Decor
// src/components/home/HomePage.tsx
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useRouter }    from 'next/navigation';
import { GlassSVG }     from '@/components/glass/GlassSVG';
import { CocktailCard } from '@/components/cocktail/CocktailCard';
import { useApp }       from '@/context/AppContext';
import { GLASSES, COCKTAILS } from '@/lib/data';
import type { ThemeId } from '@/lib/themes';

// ── AMBIENT DECOR (seasonal floating glyphs) ─────────────────────────────────

interface AmbientDecorProps { theme: ThemeId; }

export function AmbientDecor({ theme }: AmbientDecorProps) {
  const configs: Record<string, { chars: string[]; count: number; opacity: number; color: string }> = {
    winter:    { chars: ['❄','✦','❅','·'], count: 14, opacity: 0.22, color: 'rgba(168,216,240,' },
    halloween: { chars: ['◆','⬡','✦','◇'], count: 10, opacity: 0.18, color: 'rgba(255,107,0,'  },
    christmas: { chars: ['✦','★','❄','·'], count: 12, opacity: 0.20, color: 'rgba(255,215,0,'  },
    summer:    { chars: ['✦','○','◆','·'], count: 8,  opacity: 0.16, color: 'rgba(255,179,71,' },
  };

  const cfg = configs[theme];
  if (!cfg) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {Array.from({ length: cfg.count }, (_, i) => {
        const x     = (i * 17 + 5) % 92;
        const y     = (i * 23 + 12) % 88;
        const size  = 9 + (i % 4) * 5;
        const dur   = 3.5 + (i % 4);
        const delay = i * 0.38;
        return (
          <div key={i} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            color: `${cfg.color}${cfg.opacity})`, fontSize: size,
            animation: `floatGlass ${dur}s ease-in-out ${delay}s infinite`,
            userSelect: 'none', fontFamily: 'serif',
          }}>
            {cfg.chars[i % cfg.chars.length]}
          </div>
        );
      })}
    </div>
  );
}

// ── FEATURE CARDS DATA (real routes) ──────────────────────────────────────────

const FEATURES = [
  { icon: '🤖', title: 'AI Bartender', desc: "Chiedi all'intelligenza artificiale di creare il cocktail perfetto per te.",        cta: 'Prova ora',  href: '/ai' },
  { icon: '🧪', title: 'Simulatore',    desc: 'Costruisci visivamente il tuo cocktail con animazioni in tempo reale.',              cta: 'Apri il Lab', href: '/simulator' },
  { icon: '📚', title: 'Enciclopedia',  desc: 'Tecniche, ingredienti, storia. Tutto ciò che serve per diventare un maestro.',        cta: 'Scopri',      href: '/encyclopedia' },
];

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
// No props needed — reads theme/favorites/modal straight from AppContext,
// navigates via the real Next.js router. Rendered from
// src/app/(app)/home/page.tsx

export default function HomePage() {
  const router = useRouter();
  const { t, theme, favorites, toggleFav, openModal } = useApp();

  const heroLayers = [
    { name: 'Gin',          amount: 30, color: 'rgba(210,235,255,0.6)' },
    { name: 'Campari',      amount: 30, color: '#C0392B'               },
    { name: 'Vermut Rosso', amount: 30, color: '#8B2020'               },
  ];

  return (
    <div>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '80px 24px 40px', maxWidth: 1300, margin: '0 auto',
        gap: 40, flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1 1 420px', minWidth: 280 }}>
          <div style={{
            fontSize: 11, letterSpacing: '0.25em', color: t.gold,
            fontFamily: 'Raleway, sans-serif', fontWeight: 600,
            textTransform: 'uppercase', marginBottom: 20, opacity: 0.85,
          }}>
            Laboratorio Digitale di Mixology
          </div>

          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(60px,8vw,100px)', lineHeight: 0.9, fontWeight: 600, marginBottom: 8, color: t.text }}>
            BALDI'S
          </h1>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(60px,8vw,100px)', lineHeight: 0.9, fontWeight: 300, marginBottom: 32, color: t.gold, fontStyle: 'italic' }}>
            LAB
          </h1>

          <div style={{ width: 60, height: 1, background: t.gold, marginBottom: 32, opacity: 0.6 }} />

          <p style={{ fontSize: 17, lineHeight: 1.7, color: t.textMuted, maxWidth: 460, marginBottom: 36, fontFamily: 'Raleway, sans-serif', fontWeight: 300 }}>
            Un laboratorio premium dove la scienza incontra l'arte.
            Crea, esplora e perfeziona ogni cocktail con strumenti da professionista.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/simulator')}
              style={{
                background: `linear-gradient(135deg,${t.copper},${t.gold})`, border: 'none',
                color: theme === 'night' ? '#0a0810' : '#2a1808', cursor: 'pointer',
                fontFamily: 'Raleway, sans-serif', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', fontSize: 12, padding: '14px 32px', borderRadius: 4,
                boxShadow: `0 4px 24px rgba(${t.goldRgb},0.35)`, transition: 'all 0.3s',
              }}
            >
              Apri il Laboratory
            </button>
            <button
              onClick={() => router.push('/cocktails')}
              style={{
                background: 'none', border: `1px solid ${t.gold}`, color: t.gold, cursor: 'pointer',
                fontFamily: 'Raleway, sans-serif', fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', fontSize: 12, padding: '14px 32px', borderRadius: 4,
                transition: 'all 0.3s',
              }}
            >
              Esplora i Cocktail
            </button>
          </div>
        </div>

        {/* Hero glass */}
        <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ animation: 'floatGlass 4s ease-in-out infinite' }}>
            <GlassSVG gDef={GLASSES.oldfashioned} layers={heroLayers} ice="cubes" size={220} />
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, color: t.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', fontStyle: 'italic' }}>
            Negroni
          </div>
        </div>
      </section>

      {/* ── FEATURED COCKTAILS ─────────────────────────────────────────── */}
      <section style={{ padding: '60px 24px', maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 38, fontWeight: 600, color: t.text, letterSpacing: '0.02em' }}>
            Cocktail in Evidenza
          </h2>
          <button
            onClick={() => router.push('/cocktails')}
            style={{ background: 'none', border: 'none', color: t.gold, cursor: 'pointer', fontFamily: 'Raleway, sans-serif', fontSize: 13, letterSpacing: '0.06em', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            Vedi tutti →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
          {COCKTAILS.slice(0, 8).map(c => (
            <CocktailCard key={c.id} cocktail={c} t={t} onClick={() => openModal(c)} favorites={favorites} onToggleFav={toggleFav} />
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────── */}
      <section style={{ padding: '60px 24px 80px', maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ width: 50, height: 1, background: t.gold, margin: '0 auto 20px', opacity: 0.5 }} />
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 38, fontWeight: 600, color: t.text, textAlign: 'center', marginBottom: 48, letterSpacing: '0.02em' }}>
          Strumenti da Professionista
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
          {FEATURES.map(f => (
            <div
              key={f.href}
              className="feat-card"
              onClick={() => router.push(f.href)}
              style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: '36px 28px', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer' }}
            >
              <div style={{ fontSize: 44, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: t.text, marginBottom: 12 }}>{f.title}</h3>
              <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 14, color: t.textMuted, lineHeight: 1.65, marginBottom: 20 }}>{f.desc}</p>
              <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.gold }}>{f.cta} →</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
