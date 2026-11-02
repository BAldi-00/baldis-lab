// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Layout Components
// src/components/layout/NavBar.tsx  |  AgeGate.tsx  |  AuthModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useState } from 'react';
import Link             from 'next/link';
import { usePathname }  from 'next/navigation';
import { THEMES }       from '@/lib/themes';
import { isOver18 }     from '@/lib/utils';
import type { Theme, ThemeId } from '@/lib/themes';

// ── NAV LINKS (real routes, matching src/app/(app)/*/page.tsx) ───────────────

const NAV_LINKS: { href: string; label: string }[] = [
  { href: '/simulator',    label: 'Laboratory'    },
  { href: '/cocktails',    label: 'Cocktails'     },
  { href: '/ai',           label: 'AI Bartender'  },
  { href: '/encyclopedia', label: 'Enciclopedia'  },
  { href: '/cabinet',      label: 'Bar Cabinet'   },
];

// ── NAVBAR ────────────────────────────────────────────────────────────────────

interface NavBarProps {
  t:           Theme;
  theme:       ThemeId;
  setTheme:    (t: ThemeId) => void;
  user?:       { displayName: string; email: string } | null;
  onAuthClick: () => void;
}

export function NavBar({ t, theme, setTheme, user = null, onAuthClick }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  const allLinks = user
    ? [...NAV_LINKS, { href: '/profile', label: '👤 Profilo' }]
    : NAV_LINKS;

  const linkStyle = (active: boolean): React.CSSProperties => ({
    background:  active ? t.goldSoft : 'none',
    padding:     '6px 12px',
    borderRadius: 6,
    color:       active ? t.gold : t.textMuted,
    fontFamily:  'Raleway, sans-serif',
    fontWeight:  active ? 600 : 400,
    fontSize:    12,
    letterSpacing: '0.04em',
    transition:  'all 0.2s',
    whiteSpace:  'nowrap',
    textDecoration: 'none',
  });

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: t.nav, borderBottom: `1px solid ${t.border}`,
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
    }}>
      <div style={{
        maxWidth: 1300, margin: '0 auto', padding: '0 24px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/home" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 600, color: t.gold, letterSpacing: '0.08em' }}>BALDI'S</span>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 300, color: t.text,  letterSpacing: '0.08em' }}> LAB</span>
        </Link>

        {/* Desktop nav */}
        <div className="nav-desktop" style={{ display: 'flex', gap: 4 }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} style={linkStyle(isActive(l.href))}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Theme selector */}
          <select
            value={theme}
            onChange={e => setTheme(e.target.value as ThemeId)}
            style={{
              background: t.card, border: `1px solid ${t.border}`, borderRadius: 8,
              padding: '6px 10px', cursor: 'pointer', color: t.gold, fontSize: 11,
              fontFamily: 'Raleway, sans-serif', fontWeight: 500, outline: 'none',
              maxWidth: 120, transition: 'all 0.2s',
            }}
          >
            {Object.values(THEMES).map(th => (
              <option key={th.id} value={th.id} style={{ background: '#0a0810', color: '#F5EDD8' }}>
                {th.label}
              </option>
            ))}
          </select>

          {/* Auth / Profile */}
          {user ? (
            <Link
              href="/profile"
              title={user.displayName}
              style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg,${t.copper},${t.gold})`,
                border: `2px solid ${isActive('/profile') ? t.gold : t.border}`,
                cursor: 'pointer', fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', textDecoration: 'none',
              }}
            >
              🍸
            </Link>
          ) : (
            <button
              onClick={onAuthClick}
              style={{
                background: `linear-gradient(135deg,${t.copper},${t.gold})`,
                border: 'none', borderRadius: 8, padding: '8px 14px',
                cursor: 'pointer', color: theme === 'day' ? '#2a1808' : '#0a0810',
                fontFamily: 'Raleway, sans-serif', fontWeight: 700,
                fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
            >
              ACCEDI
            </button>
          )}

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setOpen(!open)}
            className="nav-hamburger"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.text, fontSize: 20, padding: 4 }}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="nav-mobile-menu"
          style={{ padding: '12px 24px 16px', borderTop: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: 4 }}
        >
          {allLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                background: isActive(l.href) ? t.goldSoft : 'none',
                textAlign: 'left', padding: '10px 14px', borderRadius: 6,
                color: isActive(l.href) ? t.gold : t.text,
                fontFamily: 'Raleway, sans-serif', fontWeight: 500, fontSize: 14,
                transition: 'all 0.2s', textDecoration: 'none', display: 'block',
              }}
            >
              {l.label}
            </Link>
          ))}
          {!user && (
            <button
              onClick={() => { onAuthClick(); setOpen(false); }}
              style={{
                background: `linear-gradient(135deg,${t.copper},${t.gold})`,
                border: 'none', borderRadius: 8, padding: '11px 14px',
                cursor: 'pointer', color: theme === 'day' ? '#2a1808' : '#0a0810',
                textAlign: 'left', marginTop: 6,
                fontFamily: 'Raleway, sans-serif', fontWeight: 700, fontSize: 13,
              }}
            >
              🔑 Accedi / Registrati
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

// ── AGE GATE ──────────────────────────────────────────────────────────────────

interface AgeGateProps {
  onVerify: () => void;
}

export function AgeGate({ onVerify }: AgeGateProps) {
  const [dd, setDd] = useState('');
  const [mm, setMm] = useState('');
  const [yy, setYy] = useState('');
  const [err, setErr] = useState('');

  const verify = () => {
    const d = parseInt(dd), m = parseInt(mm), y = parseInt(yy);
    if (!isOver18(d, m, y)) {
      setErr('Devi avere almeno 18 anni per accedere.');
      return;
    }
    onVerify();
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: 8, padding: '12px', color: '#F5EDD8',
    fontFamily: 'Cormorant Garamond, serif', fontSize: 22, textAlign: 'center',
    outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      background: 'radial-gradient(ellipse at 18% 60%, #150b2a 0%, #060610 55%, #0a0e1e 100%)',
    }}>
      {/* Ambient rings */}
      {[160, 280, 400, 520].map(r => (
        <div key={r} style={{
          position: 'absolute', width: r, height: r, borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.08)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        }} />
      ))}

      <div style={{
        position: 'relative', maxWidth: 420, width: '100%',
        background: 'rgba(14,8,24,0.95)', border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: 20, padding: '48px 36px', textAlign: 'center',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
      }}>
        {/* Logo */}
        <div style={{ width: 48, height: 1, background: '#C9A84C', margin: '0 auto 28px', opacity: 0.6 }} />
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 600, color: '#C9A84C', letterSpacing: '0.1em', marginBottom: 4 }}>BALDI'S LAB</div>
        <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, letterSpacing: '0.3em', color: 'rgba(245,237,216,0.4)', textTransform: 'uppercase', marginBottom: 36 }}>Premium Mixology Platform</div>

        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, color: '#F5EDD8', marginBottom: 8 }}>Verifica dell'Età</div>
        <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13, color: 'rgba(245,237,216,0.5)', lineHeight: 1.65, marginBottom: 28 }}>
          Questo sito tratta contenuti relativi all'alcol.<br />
          Devi avere <strong style={{ color: '#C9A84C' }}>18 anni compiuti</strong> per accedere.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.6fr', gap: 10, marginBottom: 8 }}>
          {([['GG', dd, setDd, 2], ['MM', mm, setMm, 2], ['AAAA', yy, setYy, 4]] as [string, string, typeof setDd, number][]).map(([ph, val, set, mx]) => (
            <input
              key={ph} placeholder={ph} value={val} maxLength={mx}
              onChange={e => set(e.target.value.replace(/\D/g, ''))}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#C9A84C')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(201,168,76,0.3)')}
            />
          ))}
        </div>

        {err && <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 12, color: '#FF6B6B', marginBottom: 12 }}>{err}</p>}

        <button
          onClick={verify}
          style={{
            width: '100%', marginTop: 10,
            background: 'linear-gradient(135deg,#B07340,#C9A84C)', border: 'none',
            borderRadius: 8, padding: 14, cursor: 'pointer',
            fontFamily: 'Raleway, sans-serif', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', fontSize: 12, color: '#0a0810',
            boxShadow: '0 4px 20px rgba(201,168,76,0.35)',
          }}
        >
          Confermo di avere 18+ anni
        </button>

        <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, color: 'rgba(245,237,216,0.3)', marginTop: 20, lineHeight: 1.6 }}>
          Bevi responsabilmente. Baldi's Lab promuove il consumo consapevole degli alcolici.
        </p>
      </div>
    </div>
  );
}

// ── AUTH MODAL ────────────────────────────────────────────────────────────────

export interface AuthUser {
  email:       string;
  displayName: string;
  provider?:   'google' | 'apple' | 'email';
}

interface AuthModalProps {
  t:       Theme;
  theme:   ThemeId;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
}

export function AuthModal({ t, theme, onClose, onLogin }: AuthModalProps) {
  const [mode,  setMode]  = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [name,  setName]  = useState('');
  const [err,   setErr]   = useState('');

  const submit = () => {
    if (!email.includes('@') || pass.length < 6) {
      setErr('Email valida e password di almeno 6 caratteri.');
      return;
    }
    onLogin({ email, displayName: name || email.split('@')[0], provider: 'email' });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(201,168,76,0.25)', borderRadius: 8,
    padding: '12px 14px', color: '#F5EDD8',
    fontFamily: 'Raleway, sans-serif', fontSize: 14,
    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 420, position: 'relative',
          background: 'radial-gradient(160deg,#0E0820 0%,#080810 100%)',
          border: '1px solid rgba(201,168,76,0.28)', borderRadius: 20, padding: '40px 36px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,237,216,0.4)', fontSize: 22 }}>✕</button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 600, color: '#C9A84C', letterSpacing: '0.1em' }}>BALDI'S LAB</div>
          <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, letterSpacing: '0.25em', color: 'rgba(245,237,216,0.35)', textTransform: 'uppercase', marginTop: 3 }}>
            {mode === 'login' ? 'Accedi al tuo account' : 'Crea il tuo account'}
          </div>
        </div>

        {/* Social providers */}
        {(['🌐  Continua con Google', '🍎  Continua con Apple'] as const).map((label, i) => (
          <button
            key={i}
            onClick={() => onLogin({ email: `user@${i === 0 ? 'google' : 'apple'}.com`, displayName: i === 0 ? 'Utente Google' : 'Utente Apple', provider: i === 0 ? 'google' : 'apple' })}
            style={{
              width: '100%', marginBottom: 10, padding: 12,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, cursor: 'pointer', color: '#F5EDD8',
              fontFamily: 'Raleway, sans-serif', fontSize: 13, fontWeight: 500,
            }}
          >
            {label}
          </button>
        ))}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.15)' }} />
          <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, color: 'rgba(245,237,216,0.3)', letterSpacing: '0.1em' }}>oppure</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.15)' }} />
        </div>

        {/* Form fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {mode === 'register' && (
            <input placeholder="Nome visualizzato" value={name} onChange={e => setName(e.target.value)} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#C9A84C')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(201,168,76,0.25)')} />
          )}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#C9A84C')}
            onBlur={e  => (e.target.style.borderColor = 'rgba(201,168,76,0.25)')} />
          <input type="password" placeholder="Password (min. 6 caratteri)" value={pass} onChange={e => setPass(e.target.value)}
            style={inputStyle} onKeyDown={e => e.key === 'Enter' && submit()}
            onFocus={e => (e.target.style.borderColor = '#C9A84C')}
            onBlur={e  => (e.target.style.borderColor = 'rgba(201,168,76,0.25)')} />
        </div>

        {err && <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 12, color: '#FF6B6B', marginBottom: 10 }}>{err}</p>}

        <button
          onClick={submit}
          style={{
            width: '100%', padding: 13,
            background: 'linear-gradient(135deg,#B07340,#C9A84C)', border: 'none',
            borderRadius: 8, cursor: 'pointer', color: '#0a0810',
            fontFamily: 'Raleway, sans-serif', fontWeight: 700, fontSize: 13,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
          }}
        >
          {mode === 'login' ? 'Accedi' : 'Registrati'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 16, fontFamily: 'Raleway, sans-serif', fontSize: 12, color: 'rgba(245,237,216,0.4)' }}>
          {mode === 'login' ? (
            <>Non hai un account?{' '}
              <span onClick={() => setMode('register')} style={{ color: '#C9A84C', cursor: 'pointer', textDecoration: 'underline' }}>Registrati</span>
            </>
          ) : (
            <>Hai già un account?{' '}
              <span onClick={() => setMode('login')} style={{ color: '#C9A84C', cursor: 'pointer', textDecoration: 'underline' }}>Accedi</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
