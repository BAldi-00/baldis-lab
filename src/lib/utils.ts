// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Utilities & Hooks
// src/lib/utils.ts  +  src/hooks/ (combined for brevity)
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useState, useEffect, useRef } from 'react';
import type { Cocktail, Ingredient } from './data';

// ── COLOR UTILITIES ───────────────────────────────────────────────────────────

interface RgbaColor { r: number; g: number; b: number; a: number; }

export function parseColor(s: string): RgbaColor {
  if (!s) return { r: 160, g: 130, b: 80, a: 0.85 };
  const m = s.match(/rgba?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)(?:,\s*([\d.]+))?\)/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] != null ? +m[4] : 0.9 };
  const h = s.replace('#', '');
  if (h.length === 6) return {
    r: parseInt(h.slice(0,2), 16),
    g: parseInt(h.slice(2,4), 16),
    b: parseInt(h.slice(4,6), 16),
    a: 0.9,
  };
  return { r: 160, g: 130, b: 80, a: 0.85 };
}

interface ColorLayer { color: string; amount: number; }

export function blendColors(layers: ColorLayer[]): string {
  if (!layers.length) return 'rgba(160,130,80,0)';
  const total = layers.reduce((s, l) => s + l.amount, 0);
  let r = 0, g = 0, b = 0, a = 0;
  for (const layer of layers) {
    const w = layer.amount / total;
    const c = parseColor(layer.color);
    r += c.r * w; g += c.g * w; b += c.b * w; a += c.a * w;
  }
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${Math.min(a, 0.95).toFixed(2)})`;
}

// ── COCKTAIL STATS ────────────────────────────────────────────────────────────

interface SimLayer { name: string; amount: number; }
interface CocktailStats { vol: number; abv: string; cal: number; }

export function calcStats(layers: SimLayer[], ingredients: Ingredient[]): CocktailStats {
  const vol = layers.reduce((s, l) => s + l.amount, 0);
  const alcoholMl = layers.reduce((s, l) => {
    const ing = ingredients.find(i => i.name === l.name);
    return s + l.amount * ((ing?.abv ?? 0) / 100);
  }, 0);
  const abv  = vol > 0 ? (alcoholMl / vol * 100) : 0;
  const cal  = layers.reduce((s, l) => {
    const ing = ingredients.find(i => i.name === l.name);
    return s + l.amount * (((ing?.abv ?? 0) / 100) * 0.789 * 7 + ((ing?.abv ?? 0) > 0 ? 0.04 : 0.1));
  }, 0);
  return { vol: Math.round(vol), abv: abv.toFixed(1), cal: Math.round(cal) };
}

// ── COCKTAIL RECOGNITION ──────────────────────────────────────────────────────

export function matchCocktail(layers: SimLayer[], recipes: Cocktail[]): Cocktail | null {
  if (!layers.length) return null;
  const names = layers.map(l => l.name.toLowerCase());
  let best: Cocktail | null = null;
  let bestScore = 0;
  for (const c of recipes) {
    const cNames = c.ings.map(i => i.name.toLowerCase());
    const hits = cNames.filter(n =>
      names.some(u => u.includes(n.split(' ')[0]) || n.includes(u.split(' ')[0]))
    ).length;
    const score = hits / Math.max(cNames.length, names.length);
    if (score > bestScore && score >= 0.58) { bestScore = score; best = c; }
  }
  return best;
}

// ── HOOKS ─────────────────────────────────────────────────────────────────────

/**
 * Smooth animated value using requestAnimationFrame.
 * Starts at 0, animates toward `target` with ease-in-out cubic.
 */
export function useAnimVal(target: number, ms = 700): number {
  const [val, setVal]  = useState(0);
  const cur            = useRef(0);
  const raf            = useRef<number>(0);

  useEffect(() => {
    const from = cur.current;
    const to   = target;
    if (Math.abs(from - to) < 0.001) return;
    const t0 = performance.now();
    const go = (now: number) => {
      const t    = Math.min((now - t0) / ms, 1);
      const ease = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
      const v    = from + (to - from) * ease;
      cur.current = v;
      setVal(v);
      if (t < 1) raf.current = requestAnimationFrame(go);
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(go);
    return () => cancelAnimationFrame(raf.current);
  }, [target, ms]);

  return val;
}

/**
 * Persistent favorites set (in-memory; replace body with Supabase calls for prod).
 */
export function useFavorites() {
  const [favs, setFavs] = useState<Set<number>>(new Set());
  const toggle = (id: number) =>
    setFavs(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return { favorites: favs, toggleFav: toggle, isFav: (id: number) => favs.has(id) };
}

/**
 * View history tracker (last 20 cocktail IDs, most recent first).
 */
export function useHistory() {
  const [history, setHistory] = useState<number[]>([]);
  const push = (id: number) =>
    setHistory(prev => [id, ...prev.filter(x => x !== id)].slice(0, 20));
  return { history, push };
}

/**
 * Debounced value — delays updating `value` until user stops typing.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

// ── FORMAT HELPERS ────────────────────────────────────────────────────────────

export const formatAbv  = (n: number) => n > 0 ? `${n}% Vol` : 'Analcolico';
export const formatTime = (min: number) => min < 60 ? `${min} min` : `${Math.floor(min/60)}h ${min%60}m`;
export const formatCal  = (n: number) => `~${n} kcal`;
export const slugify    = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ── AGE VERIFICATION ──────────────────────────────────────────────────────────

export function isOver18(day: number, month: number, year: number): boolean {
  if (!day || !month || !year || year < 1900) return false;
  const birth = new Date(year, month - 1, day);
  const age   = (Date.now() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return age >= 18;
}
