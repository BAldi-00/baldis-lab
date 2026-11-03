// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — App Context
// src/context/AppContext.tsx
//
// Client-side shared state for every (app) route: theme, favorites, ratings,
// history, bar cabinet and auth. Persisted in localStorage (guest-friendly);
// Supabase auth is used only when real credentials are configured.
//
// Pages render immediately on the server — there is no "wait for hydration"
// blank screen any more; stored values are merged in after mount.
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isThemeId } from '@/lib/themes';
import type { ThemeId } from '@/lib/themes';
import { SUPABASE_ENABLED } from '@/lib/config';

// ── TYPES ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  email:       string;
  displayName: string;
  provider?:   'google' | 'apple' | 'email';
}

export interface LoginRequest {
  provider:     'google' | 'apple' | 'email';
  mode?:        'login' | 'register';
  email?:       string;
  password?:    string;
  displayName?: string;
}

interface AppContextValue {
  theme:        ThemeId;
  setTheme:     (id: ThemeId) => void;

  user:         AuthUser | null;
  login:        (req: LoginRequest) => Promise<string | null>;   // returns an error message or null
  logout:       () => Promise<void>;
  showAuth:     boolean;
  openAuth:     () => void;
  closeAuth:    () => void;
  authEnabled:  boolean;

  favorites:    Set<number>;
  toggleFav:    (id: number) => void;

  ratings:      Record<number, number>;
  rateCocktail: (id: number, stars: number) => void;

  history:      number[];
  pushHistory:  (id: number) => void;

  cabinet:      Set<number>;
  toggleOwned:  (id: number) => void;
  setCabinet:   (ids: number[]) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ── LOCALSTORAGE ──────────────────────────────────────────────────────────────

const LS = {
  theme:     'bl_theme',
  favorites: 'bl_favorites',
  ratings:   'bl_ratings',
  history:   'bl_history',
  cabinet:   'bl_cabinet',
  user:      'bl_user',
} as const;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

function save(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// A sensible starter bar: gin, campari, vermouth, rum, lime, syrup, soda…
const DEFAULT_CABINET = [2, 4, 6, 8, 12, 14, 15, 21, 23, 26, 27, 28];

const toUser = (u: { email?: string; user_metadata?: Record<string, unknown> }): AuthUser => ({
  email: u.email ?? '',
  displayName: (u.user_metadata?.display_name as string | undefined) ?? (u.email ?? 'ospite').split('@')[0],
});

// ── PROVIDER ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme,     setThemeState] = useState<ThemeId>('night');
  const [ready,     setReady]      = useState(false);
  const [favorites, setFavorites]  = useState<Set<number>>(() => new Set());
  const [ratings,   setRatings]    = useState<Record<number, number>>({});
  const [history,   setHistory]    = useState<number[]>([]);
  const [cabinet,   setCabinetSt]  = useState<Set<number>>(() => new Set(DEFAULT_CABINET));
  const [user,      setUser]       = useState<AuthUser | null>(null);
  const [showAuth,  setShowAuth]   = useState(false);

  // Merge stored state once, after the server-rendered page is on screen
  useEffect(() => {
    const th = load<unknown>(LS.theme, 'night');
    if (isThemeId(th)) setThemeState(th);
    setFavorites(new Set(load<number[]>(LS.favorites, [])));
    setRatings(load(LS.ratings, {}));
    setHistory(load(LS.history, []));
    setCabinetSt(new Set(load<number[]>(LS.cabinet, DEFAULT_CABINET)));
    if (!SUPABASE_ENABLED) setUser(load<AuthUser | null>(LS.user, null));
    setReady(true);

    if (!SUPABASE_ENABLED) return;
    let unsub: (() => void) | undefined;
    import('@/lib/supabase/browser').then(({ getSupabaseBrowserClient }) => {
      const sb = getSupabaseBrowserClient();
      sb.auth.getUser().then(({ data }) => { if (data.user) setUser(toUser(data.user)); });
      const { data } = sb.auth.onAuthStateChange((_e, session) => {
        setUser(session?.user ? toUser(session.user) : null);
      });
      unsub = () => data.subscription.unsubscribe();
    });
    return () => unsub?.();
  }, []);

  // Persist after the initial merge
  useEffect(() => { if (ready) save(LS.favorites, [...favorites]); }, [favorites, ready]);
  useEffect(() => { if (ready) save(LS.ratings, ratings); },         [ratings, ready]);
  useEffect(() => { if (ready) save(LS.history, history); },         [history, ready]);
  useEffect(() => { if (ready) save(LS.cabinet, [...cabinet]); },    [cabinet, ready]);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    document.documentElement.dataset.theme = id;
    save(LS.theme, id);
  }, []);

  const toggleFav = useCallback((id: number) => {
    setFavorites(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }, []);

  const rateCocktail = useCallback((id: number, stars: number) => {
    setRatings(prev => {
      const next = { ...prev };
      if (stars === 0) delete next[id]; else next[id] = stars;
      return next;
    });
  }, []);

  const pushHistory = useCallback((id: number) => {
    setHistory(prev => (prev[0] === id ? prev : [id, ...prev.filter(x => x !== id)].slice(0, 20)));
  }, []);

  const toggleOwned = useCallback((id: number) => {
    setCabinetSt(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }, []);

  const setCabinet = useCallback((ids: number[]) => setCabinetSt(new Set(ids)), []);

  const login = useCallback(async (req: LoginRequest): Promise<string | null> => {
    if (!SUPABASE_ENABLED) {
      if (req.provider !== 'email') return 'Accesso social non configurato: usa email e password.';
      const u: AuthUser = {
        email: req.email ?? '',
        displayName: req.displayName || (req.email ?? 'ospite').split('@')[0],
        provider: 'email',
      };
      setUser(u);
      save(LS.user, u);
      setShowAuth(false);
      return null;
    }

    const { getSupabaseBrowserClient } = await import('@/lib/supabase/browser');
    const sb = getSupabaseBrowserClient();

    if (req.provider !== 'email') {
      const { error } = await sb.auth.signInWithOAuth({
        provider: req.provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      return error?.message ?? null;
    }

    const creds = { email: req.email ?? '', password: req.password ?? '' };
    const { error } = req.mode === 'register'
      ? await sb.auth.signUp({ ...creds, options: { data: { display_name: req.displayName } } })
      : await sb.auth.signInWithPassword(creds);
    if (error) return error.message;
    setShowAuth(false);
    return null;
  }, []);

  const logout = useCallback(async () => {
    if (SUPABASE_ENABLED) {
      const { getSupabaseBrowserClient } = await import('@/lib/supabase/browser');
      await getSupabaseBrowserClient().auth.signOut();
    }
    setUser(null);
    save(LS.user, null);
  }, []);

  const openAuth  = useCallback(() => setShowAuth(true), []);
  const closeAuth = useCallback(() => setShowAuth(false), []);

  const value = useMemo<AppContextValue>(() => ({
    theme, setTheme,
    user, login, logout, showAuth, openAuth, closeAuth, authEnabled: SUPABASE_ENABLED,
    favorites, toggleFav,
    ratings, rateCocktail,
    history, pushHistory,
    cabinet, toggleOwned, setCabinet,
  }), [theme, setTheme, user, login, logout, showAuth, openAuth, closeAuth,
       favorites, toggleFav, ratings, rateCocktail, history, pushHistory,
       cabinet, toggleOwned, setCabinet]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp() must be used within <AppProvider>');
  return ctx;
}
