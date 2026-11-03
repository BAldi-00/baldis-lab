// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Themes
// src/lib/themes.ts
//
// Themes are pure CSS: each one is a set of custom properties applied through
// <html data-theme="…">. Switching theme only flips that attribute, so no
// React tree re-renders. The token values live in globals.css; this file only
// lists the themes for the picker and the browser chrome colour.
// ─────────────────────────────────────────────────────────────────────────────

export type ThemeId = 'night' | 'day' | 'summer' | 'winter' | 'halloween' | 'christmas';

export interface ThemeMeta {
  id:     ThemeId;
  label:  string;
  swatch: [string, string];  // [background, accent] for the picker dot
}

export const THEMES: ThemeMeta[] = [
  { id: 'night',     label: 'Notte',     swatch: ['#0f0d0b', '#e3a857'] },
  { id: 'day',       label: 'Giorno',    swatch: ['#f6f0e6', '#8c2f39'] },
  { id: 'summer',    label: 'Estate',    swatch: ['#0b1a1f', '#ff7a59'] },
  { id: 'winter',    label: 'Inverno',   swatch: ['#0b1020', '#9fd4f5'] },
  { id: 'halloween', label: 'Halloween', swatch: ['#120a14', '#ff7a1a'] },
  { id: 'christmas', label: 'Natale',    swatch: ['#0a1510', '#e8c35a'] },
];

export const THEME_IDS = THEMES.map(t => t.id);

export const isThemeId = (v: unknown): v is ThemeId =>
  typeof v === 'string' && (THEME_IDS as string[]).includes(v);
