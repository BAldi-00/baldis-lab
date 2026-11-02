// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — App Group Layout
// src/app/(app)/layout.tsx
//
// This is the single real layout file for the entire authenticated/main app.
// It wraps all (app)/* pages in the AppProvider context, renders the shared
// NavBar, AgeGate, CocktailModal and AuthModal (driven by context state), and
// applies the per-theme background + ambient decorations.
//
// There is NO BaldisLabApp.tsx SPA wrapper here — each page is a real
// separate Next.js route under src/app/(app)/*/page.tsx.
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { AppProvider, useApp } from '@/context/AppContext';
import { NavBar, AgeGate, AuthModal } from '@/components/layout/NavBar';
import { CocktailModal }    from '@/components/cocktail/CocktailCard';
import { AmbientDecor }     from '@/components/home/HomePage';
import { COCKTAILS }        from '@/lib/data';

// ── INNER (needs context) ─────────────────────────────────────────────────────

function AppShell({ children }: { children: React.ReactNode }) {
  const {
    t, theme, setTheme,
    ageOk, verifyAge,
    user, openAuth, closeAuth, showAuth, login, logout,
    modal, closeModal, favorites, toggleFav, ratings, rateCocktail,
    hydrated,
  } = useApp();

  // NOTE: fonts are loaded once, server-side, via the <link> tag in the
  // root layout (src/app/layout.tsx) — no client-side injection needed here.

  // Block render until client-side state is hydrated (avoids flash)
  if (!hydrated) return null;

  // Age gate intercepts every route until verified
  if (!ageOk) return <AgeGate onVerify={verifyAge} />;

  const grainStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 1, opacity: theme === 'day' ? 0.018 : 0.04,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundSize: '128px 128px',
  };

  return (
    <div
      style={{
        minHeight: '100vh', background: t.bg, color: t.text,
        fontFamily: 'Raleway, sans-serif', position: 'relative', overflowX: 'hidden',
        transition: 'background 0.5s ease, color 0.3s ease',
        ['--gold-rgb' as string]: t.goldRgb,
        ['--gold-color' as string]: t.gold,
      }}
    >
      <div style={grainStyle} />
      <AmbientDecor theme={theme} />

      {/* Ambient orbs */}
      <div style={{ position: 'fixed', top: -200, left: '30%', width: 600, height: 600, borderRadius: '50%', pointerEvents: 'none', zIndex: 0, background: `radial-gradient(circle,rgba(${t.goldRgb},0.07) 0%,transparent 70%)` }} />
      <div style={{ position: 'fixed', bottom: -150, right: '10%', width: 400, height: 400, borderRadius: '50%', pointerEvents: 'none', zIndex: 0, background: `radial-gradient(circle,rgba(${t.goldRgb},0.04) 0%,transparent 70%)` }} />

      {/* Real NavBar — uses Next.js Link/usePathname internally */}
      <NavBar t={t} theme={theme} setTheme={setTheme} user={user} onAuthClick={openAuth} />

      {/* Page content — each page is a separate file under src/app/(app)/ */}
      <main style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 2, borderTop: `1px solid ${t.border}`, padding: '28px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, color: t.textSub, letterSpacing: '0.08em' }}>BALDI'S LAB</span>
        <span style={{ color: t.border }}>·</span>
        <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, color: t.textSub, letterSpacing: '0.06em' }}>
          {COCKTAILS.length} COCKTAIL · 6 BICCHIERI · AI BARTENDER
        </span>
        <span style={{ color: t.border }}>·</span>
        <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, color: t.textSub }}>🔞 Bevi responsabilmente</span>
      </footer>

      {/* Global overlays — driven by context state, available on every page */}
      {modal && (
        <CocktailModal
          cocktail={modal} t={t} onClose={closeModal}
          favorites={favorites} onToggleFav={toggleFav}
          ratings={ratings} onRate={rateCocktail}
        />
      )}
      {showAuth && (
        <AuthModal t={t} theme={theme} onClose={closeAuth} onLogin={login} />
      )}
    </div>
  );
}

// ── LAYOUT EXPORT (wraps AppProvider around the shell) ────────────────────────

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <AppShell>{children}</AppShell>
    </AppProvider>
  );
}
