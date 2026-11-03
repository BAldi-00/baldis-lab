// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Themes
// src/lib/themes.ts
//
// Two themes, pure CSS: each is a set of custom properties applied through
// <html data-theme="…">. Switching only flips that attribute, so no React
// tree re-renders. Token values live in globals.css.
// ─────────────────────────────────────────────────────────────────────────────

export type ThemeId = 'night' | 'day';

export const THEME_IDS: ThemeId[] = ['night', 'day'];

export const isThemeId = (v: unknown): v is ThemeId =>
  typeof v === 'string' && (THEME_IDS as string[]).includes(v);
