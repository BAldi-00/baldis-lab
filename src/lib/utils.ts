// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Utilities & Hooks
// src/lib/utils.ts
// (Mixing maths — colours, stats, recipe matching — lives in lib/mix.ts.)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';

/** Debounced value — delays updating `value` until the user stops typing. */
export function useDebounce<T>(value: T, delay = 300): T {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

// ── FORMAT HELPERS ────────────────────────────────────────────────────────────

export const formatAbv = (n: number) => (n > 0 ? `${n}%` : 'Analcolico');
export const slugify   = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const DIFF_LABEL = ['', 'Facile', 'Media', 'Esperto'] as const;

// ── AGE VERIFICATION ──────────────────────────────────────────────────────────

/** Calendar-exact: true from the 18th birthday onwards. */
export function isOver18(day: number, month: number, year: number): boolean {
  if (!day || !month || !year || year < 1900) return false;
  const birth = new Date(year, month - 1, day);
  if (birth.getMonth() !== month - 1) return false;   // e.g. 31/02
  const now = new Date();
  let age = now.getFullYear() - year;
  if (now.getMonth() < month - 1 || (now.getMonth() === month - 1 && now.getDate() < day)) age--;
  return age >= 18;
}
