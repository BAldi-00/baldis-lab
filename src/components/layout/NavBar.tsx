// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Layout Components
// src/components/layout/NavBar.tsx  (NavBar · ThemeToggle · Footer · AgeGate · AuthModal)
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useEffect, useRef, useState } from 'react';
import Link             from 'next/link';
import { usePathname }  from 'next/navigation';
import { isOver18 }     from '@/lib/utils';
import { useApp }       from '@/context/AppContext';
import { Icon }         from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';

const NAV_LINKS: { href: string; label: string; icon: IconName }[] = [
  { href: '/cocktails',    label: 'Cocktail',     icon: 'glass'   },
  { href: '/simulator',    label: 'Laboratorio',  icon: 'flask'   },
  { href: '/ai',           label: 'AI Bartender', icon: 'sparkle' },
  { href: '/cabinet',      label: 'Il mio bar',   icon: 'cabinet' },
  { href: '/encyclopedia', label: 'Enciclopedia', icon: 'book'    },
];

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display text-[22px] leading-none tracking-tight ${className}`}>
      Baldi&rsquo;s <em className="font-normal italic text-accent">Lab</em>
    </span>
  );
}

// ── THEME TOGGLE ──────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, setTheme } = useApp();
  const next = theme === 'night' ? 'day' : 'night';
  return (
    <button className="btn-icon" onClick={() => setTheme(next)}
      aria-label={next === 'day' ? 'Passa al tema giorno' : 'Passa al tema notte'} title={next === 'day' ? 'Tema giorno' : 'Tema notte'}>
      <Icon name={theme === 'night' ? 'sun' : 'moon'} />
    </button>
  );
}

// ── NAVBAR ────────────────────────────────────────────────────────────────────

export function NavBar() {
  const { user, openAuth } = useApp();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-line/[0.07] bg-bg/90">
      <div className="wrap flex h-16 items-center gap-6">
        <Link href="/home" aria-label="Home"><Logo /></Link>

        <div className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className={`rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors ${isActive(l.href) ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle />
          {user ? (
            <Link href="/profile" aria-label="Profilo"
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold uppercase text-on-accent ${isActive('/profile') ? 'ring-2 ring-accent/50 ring-offset-2 ring-offset-bg' : ''}`}>
              {user.displayName.slice(0, 1)}
            </Link>
          ) : (
            <button onClick={openAuth} className="btn-primary hidden px-4 py-2 sm:inline-flex">Accedi</button>
          )}
          <button className="btn-icon lg:hidden" onClick={() => setOpen(o => !o)} aria-label="Menu" aria-expanded={open}>
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line/[0.07] bg-bg lg:hidden">
          <div className="wrap grid gap-1 py-3">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] ${isActive(l.href) ? 'bg-accent/10 text-accent' : 'text-text'}`}>
                <Icon name={l.icon} className="opacity-70" /> {l.label}
              </Link>
            ))}
            {user ? (
              <Link href="/profile" className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] text-text">
                <Icon name="user" className="opacity-70" /> Profilo
              </Link>
            ) : (
              <button onClick={openAuth} className="btn-primary mt-2">Accedi o registrati</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line/[0.07]">
      <div className="wrap flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo />
          <p className="mt-2 max-w-sm text-sm text-muted">100 ricette, un laboratorio virtuale e un bartender AI. Bevi responsabilmente.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          {NAV_LINKS.map(l => <Link key={l.href} href={l.href} className="hover:text-text">{l.label}</Link>)}
        </div>
      </div>
    </footer>
  );
}

// ── AGE GATE ──────────────────────────────────────────────────────────────────

export function AgeGate({ onVerify }: { onVerify: () => void }) {
  const [dd, setDd] = useState('');
  const [mm, setMm] = useState('');
  const [yy, setYy] = useState('');
  const [err, setErr] = useState('');
  const mmRef = useRef<HTMLInputElement>(null);
  const yyRef = useRef<HTMLInputElement>(null);

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    const d = +dd, m = +mm, y = +yy;
    if (!d || !m || !y || d > 31 || m > 12 || y < 1900 || y > new Date().getFullYear()) {
      setErr('Inserisci una data di nascita valida.');
      return;
    }
    if (!isOver18(d, m, y)) { setErr('Devi avere almeno 18 anni per accedere.'); return; }
    onVerify();
  };

  const field = 'input text-center font-display text-2xl tracking-wider';

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <form onSubmit={verify} className="card w-full max-w-md p-8 text-center animate-fade-up sm:p-10">
        <Logo className="text-3xl" />
        <div className="divider my-7" />
        <h1 className="font-display text-2xl">Quanti anni hai?</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Questo sito parla di alcol. Per entrare devi avere almeno <strong className="text-text">18 anni</strong>.
        </p>

        <div className="mt-7 grid grid-cols-[1fr_1fr_1.6fr] gap-2.5">
          {/* Digits beyond a field's length spill into the next one, so a date
              typed or pasted in one go ("01011990") fills all three fields */}
          <input className={field} inputMode="numeric" placeholder="GG" value={dd} aria-label="Giorno"
            onChange={e => {
              const v = e.target.value.replace(/\D/g, '');
              setDd(v.slice(0, 2));
              if (v.length > 2) { setMm(v.slice(2, 4)); setYy(v.slice(4, 8)); (v.length > 4 ? yyRef : mmRef).current?.focus(); }
              else if (v.length === 2) mmRef.current?.focus();
            }} />
          <input ref={mmRef} className={field} inputMode="numeric" placeholder="MM" value={mm} aria-label="Mese"
            onChange={e => {
              const v = e.target.value.replace(/\D/g, '');
              setMm(v.slice(0, 2));
              if (v.length > 2) setYy(v.slice(2, 6));
              if (v.length >= 2) yyRef.current?.focus();
            }} />
          <input ref={yyRef} className={field} inputMode="numeric" placeholder="AAAA" maxLength={4} value={yy} aria-label="Anno"
            onChange={e => setYy(e.target.value.replace(/\D/g, ''))} />
        </div>

        {err && <p className="mt-3 text-sm text-accent-2">{err}</p>}

        <button type="submit" className="btn-primary mt-6 w-full py-3">Entra nel Lab</button>
        <p className="mt-5 text-xs text-muted">Baldi&rsquo;s Lab promuove il consumo consapevole.</p>
      </form>
    </main>
  );
}

// ── AUTH MODAL ────────────────────────────────────────────────────────────────

export function AuthModal({ onClose }: { onClose: () => void }) {
  const { login, authEnabled } = useApp();
  const [mode,  setMode]  = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [name,  setName]  = useState('');
  const [err,   setErr]   = useState('');
  const [busy,  setBusy]  = useState(false);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email) || pass.length < 6) {
      setErr('Serve un’email valida e una password di almeno 6 caratteri.');
      return;
    }
    setBusy(true);
    const error = await login({ provider: 'email', mode, email, password: pass, displayName: name });
    setBusy(false);
    if (error) setErr(error);
  };

  const social = async (provider: 'google' | 'apple') => {
    const error = await login({ provider });
    if (error) setErr(error);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5" onClick={onClose}>
      <form onSubmit={submit} onClick={e => e.stopPropagation()}
        className="card relative w-full max-w-md bg-surface p-8 shadow-2xl animate-fade-up">
        <button type="button" onClick={onClose} className="btn-icon absolute right-4 top-4" aria-label="Chiudi"><Icon name="close" /></button>

        <Logo className="text-2xl" />
        <h2 className="mt-5 font-display text-3xl">{mode === 'login' ? 'Bentornato' : 'Crea il tuo account'}</h2>
        <p className="mt-1.5 text-sm text-muted">Salva preferiti, valutazioni e il tuo bar personale.</p>

        {authEnabled && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button type="button" className="btn-ghost" onClick={() => social('google')}>Google</button>
              <button type="button" className="btn-ghost" onClick={() => social('apple')}>Apple</button>
            </div>
            <div className="my-5 flex items-center gap-3 text-xs text-muted"><span className="divider flex-1" />oppure<span className="divider flex-1" /></div>
          </>
        )}

        <div className={`grid gap-2.5 ${authEnabled ? '' : 'mt-6'}`}>
          {mode === 'register' && <input className="input" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />}
          <input className="input" type="email" autoComplete="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder="Password (min. 6 caratteri)" value={pass} onChange={e => setPass(e.target.value)} />
        </div>

        {err && <p className="mt-3 text-sm text-accent-2">{err}</p>}

        <button type="submit" disabled={busy} className="btn-primary mt-5 w-full py-3">
          {busy ? 'Un attimo…' : mode === 'login' ? 'Accedi' : 'Registrati'}
        </button>

        {!authEnabled && (
          <p className="mt-3 text-center text-xs text-muted">Modalità locale: i dati restano salvati in questo browser.</p>
        )}

        <p className="mt-5 text-center text-sm text-muted">
          {mode === 'login' ? 'Non hai un account? ' : 'Hai già un account? '}
          <button type="button" className="font-semibold text-accent hover:underline" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}>
            {mode === 'login' ? 'Registrati' : 'Accedi'}
          </button>
        </p>
      </form>
    </div>
  );
}
