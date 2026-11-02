// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — App Context
// src/context/AppContext.tsx
//
// Client-side shared state, consumed by src/app/(app)/layout.tsx and every
// page underneath it. Replaces the old single-component SPA approach
// (BaldisLabApp.tsx) with a Context Provider so that individual routes
// (src/app/(app)/*/page.tsx) can be real, separate Next.js pages while
// still sharing theme / favorites / ratings / history / auth state.
//
// Persistence is localStorage for now (guest-friendly). Sprint 7 swaps this
// for Supabase-backed persistence behind the same hook API, so consuming
// components do not need to change.
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { THEMES } from '@/lib/themes';
import type { Theme, ThemeId } from '@/lib/themes';
import type { Cocktail } from '@/lib/data';

// ── TYPES ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  email:       string;
  displayName: string;
  provider?:   'google' | 'apple' | 'email';
}

interface AppContextValue {
  // Theme
  theme:        ThemeId;
  t:            Theme;
  setTheme:     (id: ThemeId) => void;

  // Age gate
  ageOk:        boolean;
  verifyAge:    () => void;

  // Auth (mock for now — Sprint 7 wires real Supabase Auth behind this same API)
  user:         AuthUser | null;
  login:        (u: AuthUser) => void;
  logout:       () => void;
  showAuth:     boolean;
  openAuth:     () => void;
  closeAuth:    () => void;

  // Favorites
  favorites:    Set<number>;
  toggleFav:    (id: number) => void;

  // Ratings
  ratings:      Record<number, number>;
  rateCocktail: (id: number, stars: number) => void;

  // History
  history:      number[];
  pushHistory:  (id: number) => void;

  // Cocktail detail modal (used by cards on Home/Library when not navigating to /cocktails/[slug])
  modal:        Cocktail | null;
  openModal:    (c: Cocktail) => void;
  closeModal:   () => void;

  // Hydration flag — avoids SSR/client localStorage mismatch flashes
  hydrated:     boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

// ── LOCALSTORAGE HELPERS ──────────────────────────────────────────────────────

const LS_KEYS = {
  ageOk:     'bl_age_ok',
  theme:     'bl_theme',
  favorites: 'bl_favorites',
  ratings:   'bl_ratings',
  history:   'bl_history',
} as const;

function loadLS<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function saveLS(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── PROVIDER ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme,     setThemeState] = useState<ThemeId>('night');
  const [ageOk,     setAgeOk]      = useState(false);
  const [hydrated,  setHydrated]   = useState(false);
  const [favorites, setFavorites]  = useState<Set<number>>(new Set());
  const [ratings,   setRatings]    = useState<Record<number, number>>({});
  const [history,   setHistory]    = useState<number[]>([]);
  const [user,      setUser]       = useState<AuthUser | null>(null);
  const [showAuth,  setShowAuth]   = useState(false);
  const [modal,     setModal]      = useState<Cocktail | null>(null);

  // Hydrate once on mount (client-only)
  useEffect(() => {
    setAgeOk(loadLS(LS_KEYS.ageOk, false));
    setThemeState(loadLS(LS_KEYS.theme, 'night'));
    setFavorites(new Set(loadLS<number[]>(LS_KEYS.favorites, [])));
    setRatings(loadLS(LS_KEYS.ratings, {}));
    setHistory(loadLS(LS_KEYS.history, []));
    setHydrated(true);

    // ── Supabase Auth: sync user state ────────────────────────────────────────
    // Lazy import so the browser client is only instantiated client-side.
    import('@/lib/supabase/browser').then(({ getSupabaseBrowserClient }) => {
      const supabase = getSupabaseBrowserClient();

      // Check existing session on mount
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setUser({
            email:       user.email!,
            displayName: (user.user_metadata?.display_name as string | undefined)
                         ?? user.email!.split('@')[0],
          });
        }
      });

      // Listen for sign-in / sign-out events
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            email:       session.user.email!,
            displayName: (session.user.user_metadata?.display_name as string | undefined)
                         ?? session.user.email!.split('@')[0],
          });
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on change (skip the initial pre-hydration render)
  useEffect(() => { if (hydrated) saveLS(LS_KEYS.theme, theme); },               [theme, hydrated]);
  useEffect(() => { if (hydrated) saveLS(LS_KEYS.favorites, [...favorites]); },  [favorites, hydrated]);
  useEffect(() => { if (hydrated) saveLS(LS_KEYS.ratings, ratings); },           [ratings, hydrated]);
  useEffect(() => { if (hydrated) saveLS(LS_KEYS.history, history); },           [history, hydrated]);

  const setTheme = useCallback((id: ThemeId) => setThemeState(id), []);

  const verifyAge = useCallback(() => {
    setAgeOk(true);
    saveLS(LS_KEYS.ageOk, true);
  }, []);

  const toggleFav = useCallback((id: number) => {
    setFavorites(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const rateCocktail = useCallback((id: number, stars: number) => {
    setRatings(prev => {
      if (stars === 0) {
        const { [id]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: stars };
    });
  }, []);

  const pushHistory = useCallback((id: number) => {
    setHistory(prev => [id, ...prev.filter(x => x !== id)].slice(0, 20));
  }, []);

  const openModal  = useCallback((c: Cocktail) => { setModal(c); pushHistory(c.id); }, [pushHistory]);
  const closeModal = useCallback(() => setModal(null), []);

  const login = useCallback(async (u: AuthUser) => {
    const { getSupabaseBrowserClient } = await import('@/lib/supabase/browser');
    const supabase = getSupabaseBrowserClient();

    if (u.provider === 'google') {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      // Google OAuth redirects the page — execution stops here
      return;
    }

    if (u.provider === 'apple') {
      await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      return;
    }

    // Email / password (u.provider === 'email')
    // In the real flow, AuthModal collects the password and passes it separately.
    // For Sprint 7 we keep the email-only mock until the UI is updated in Sprint 8.
    setUser({ email: u.email, displayName: u.displayName });
    setShowAuth(false);
    // Sprint 8: replace with:
    // const { error } = await supabase.auth.signInWithPassword({ email: u.email, password: u.password });
    // if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    const { getSupabaseBrowserClient } = await import('@/lib/supabase/browser');
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    // onAuthStateChange will set user to null automatically
  }, []);

  const value: AppContextValue = {
    theme, t: THEMES[theme], setTheme,
    ageOk, verifyAge,
    user, login, logout, showAuth, openAuth: () => setShowAuth(true), closeAuth: () => setShowAuth(false),
    favorites, toggleFav,
    ratings, rateCocktail,
    history, pushHistory,
    modal, openModal, closeModal,
    hydrated,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ── HOOK ──────────────────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp() must be used within <AppProvider>');
  return ctx;
}
