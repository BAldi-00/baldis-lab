// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Mixing logic
// src/lib/mix.ts
//
// Everything the simulator, cabinet and cocktail art need to reason about a
// drink: canonical ingredient names (recipes say "Gin" or "Soda", the pantry
// says "Gin London Dry" / "Soda Water"), physical properties (density for
// layering, sugar calories, carbonation), stats with dilution, colour
// blending and recipe recognition.
// ─────────────────────────────────────────────────────────────────────────────

import { INGREDIENTS, COCKTAILS } from './data';
import type { Ingredient, Cocktail } from './data';

// ── CANONICAL NAMES ───────────────────────────────────────────────────────────

const ALIASES: Record<string, string> = {
  'gin':              'Gin London Dry',
  'soda':             'Soda Water',
  'zucchero':         'Sciroppo',
  'sciroppo zucchero':'Sciroppo',
  'vodka vaniglia':   'Vodka',
  'cocco':            'Crema di Cocco',
  'tonica':           'Acqua Tonica',
  'caffè':            'Espresso',
};

const BY_NAME = new Map(INGREDIENTS.map(i => [i.name.toLowerCase(), i]));

/** Map any ingredient label to the pantry ingredient name it refers to. */
export function canon(name: string): string {
  const k = name.trim().toLowerCase();
  if (BY_NAME.has(k)) return BY_NAME.get(k)!.name;
  if (ALIASES[k]) return ALIASES[k];
  return name.trim();
}

// Bottles that are interchangeable in a recipe (any gin makes a Gin Tonic)
const FAMILY: Record<string, string> = {
  'Gin Premium':  'Gin London Dry',
  'Vodka Citrus': 'Vodka',
  'Cointreau':    'Triple Sec',
};

/** Canonical name, folded to its interchangeable family. */
export const family = (name: string): string => { const c = canon(name); return FAMILY[c] ?? c; };

export function findIngredient(name: string): Ingredient | undefined {
  return BY_NAME.get(canon(name).toLowerCase());
}

// ── PHYSICAL PROPERTIES ───────────────────────────────────────────────────────

interface Physics { density: number; kcalPerMl: number; fizzy: boolean; }

// Non-alcohol calories per ml (sugar, fat) and density by category
const CAT_PHYSICS: Record<string, Physics> = {
  'Gin':           { density: 0.95, kcalPerMl: 0,    fizzy: false },
  'Vodka':         { density: 0.95, kcalPerMl: 0,    fizzy: false },
  'Rum':           { density: 0.95, kcalPerMl: 0,    fizzy: false },
  'Tequila':       { density: 0.95, kcalPerMl: 0,    fizzy: false },
  'Whisky':        { density: 0.95, kcalPerMl: 0,    fizzy: false },
  'Brandy':        { density: 0.96, kcalPerMl: 0.05, fizzy: false },
  'Bitter':        { density: 1.06, kcalPerMl: 1.0,  fizzy: false },
  'Vino':          { density: 1.02, kcalPerMl: 0.4,  fizzy: false },
  'Liquori':       { density: 1.10, kcalPerMl: 1.4,  fizzy: false },
  'Succhi':        { density: 1.04, kcalPerMl: 0.45, fizzy: false },
  'Sciroppi':      { density: 1.32, kcalPerMl: 2.6,  fizzy: false },
  'Soft Drinks':   { density: 1.00, kcalPerMl: 0.35, fizzy: true  },
  'Erbe & Frutta': { density: 1.00, kcalPerMl: 0.3,  fizzy: false },
  'Altro':         { density: 1.02, kcalPerMl: 0.5,  fizzy: false },
};

const OVERRIDES: Record<string, Partial<Physics>> = {
  'Prosecco':       { density: 0.99, kcalPerMl: 0.15, fizzy: true },
  'Soda Water':     { kcalPerMl: 0 },
  'Acqua Tonica':   { kcalPerMl: 0.34 },
  'Panna':          { density: 0.99, kcalPerMl: 3.4 },
  'Crema di Cocco': { density: 1.05, kcalPerMl: 2.3 },
  'Albume':         { density: 1.03, kcalPerMl: 0.5 },
  'Espresso':       { density: 1.01, kcalPerMl: 0.02 },
  'Kahlúa':         { density: 1.16, kcalPerMl: 2.0 },
  'Granatina':      { density: 1.35 },
  'Blue Curaçao':   { density: 1.09 },
  'Lime':           { kcalPerMl: 0.25 },
  'Limone':         { kcalPerMl: 0.22 },
};

const FALLBACK: Physics = { density: 1.0, kcalPerMl: 0.3, fizzy: false };

export function physics(name: string): Physics {
  const ing = findIngredient(name);
  if (!ing) return FALLBACK;
  return { ...(CAT_PHYSICS[ing.cat] ?? FALLBACK), ...OVERRIDES[ing.name] };
}

export const abvOf = (name: string) => findIngredient(name)?.abv ?? 0;

// ── COLOURS ───────────────────────────────────────────────────────────────────

export interface Rgba { r: number; g: number; b: number; a: number; }

export function parseColor(s: string): Rgba {
  const m = s.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] != null ? +m[4] : 1 };
  let h = s.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (h.length === 6) {
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 0.92 };
  }
  return { r: 200, g: 170, b: 120, a: 0.8 };
}

export const rgba = (c: Rgba, a = c.a) =>
  `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${a.toFixed(2)})`;

/**
 * Blend liquids by volume, the way pigments in water behave: clear liquids
 * (gin, vodka, soda) don't whiten the drink, they only make it more
 * transparent. So hue comes from the coloured parts, weighted by opacity²,
 * while overall opacity is diluted by every clear ml.
 */
export function blendColors(parts: { color: string; amount: number }[]): string {
  let r = 0, g = 0, b = 0, w = 0, vol = 0, coloured = 0, paleA = 0;
  for (const p of parts) {
    if (p.amount <= 0) continue;
    const c = parseColor(p.color);
    const pale = Math.min(c.r, c.g, c.b) > 175;
    const weight = p.amount * c.a * c.a * (pale ? 0.06 : 1);
    r += c.r * weight; g += c.g * weight; b += c.b * weight; w += weight;
    vol += p.amount;
    if (pale) paleA += c.a * p.amount; else coloured += p.amount;
  }
  if (!w) return 'rgba(220,235,255,0.25)';
  // Dyes stay vivid even when diluted: a spritz is 1/3 Aperol and still bright orange
  const a = coloured
    ? 0.42 + 0.52 * Math.sqrt(coloured / vol)
    : Math.max(0.2, (paleA / vol) * 0.6);
  return rgba({ r: r / w, g: g / w, b: b / w, a: Math.min(0.94, a) });
}

// ── STATS ─────────────────────────────────────────────────────────────────────

export interface Part { name: string; amount: number; color?: string; }

export type MixMethod = 'stir' | 'shake';

/** Melt-water added by technique, as a share of the mixed volume */
export const DILUTION: Record<MixMethod, number> = { stir: 0.2, shake: 0.27 };

export interface DrinkStats {
  vol:     number;   // ml including dilution water
  water:   number;   // ml of dilution
  abv:     number;   // %
  kcal:    number;
  alcohol: number;   // grams of ethanol
}

export function drinkStats(parts: Part[], water = 0): DrinkStats {
  const liquid = parts.reduce((s, p) => s + p.amount, 0);
  const alcMl  = parts.reduce((s, p) => s + p.amount * abvOf(p.name) / 100, 0);
  const sugar  = parts.reduce((s, p) => s + p.amount * physics(p.name).kcalPerMl, 0);
  const vol    = liquid + water;
  const grams  = alcMl * 0.789;
  return {
    vol: Math.round(vol),
    water: Math.round(water),
    abv: vol > 0 ? Math.round((alcMl / vol) * 1000) / 10 : 0,
    kcal: Math.round(grams * 7 + sugar),
    alcohol: Math.round(grams * 10) / 10,
  };
}

// ── RECIPE RECOGNITION ────────────────────────────────────────────────────────

export interface RecipeMatch {
  cocktail: Cocktail;
  score:    number;      // 0..1
  missing:  string[];    // recipe ingredients not in the glass
  extra:    string[];    // ingredients in the glass not in the recipe
}

function shares(parts: Part[]): Map<string, number> {
  const total = parts.reduce((s, p) => s + p.amount, 0) || 1;
  const m = new Map<string, number>();
  for (const p of parts) {
    const k = family(p.name);
    m.set(k, (m.get(k) ?? 0) + p.amount / total);
  }
  return m;
}

/**
 * Score every recipe against what is in the glass: 70% ingredient overlap
 * (Jaccard on canonical names), 30% how close the proportions are.
 * Trace ingredients (bitters, < 3% of the drink) count half, so a missing
 * dash of Angostura doesn't hide an otherwise perfect Old Fashioned.
 */
export function matchRecipes(parts: Part[], limit = 3): RecipeMatch[] {
  if (!parts.length) return [];
  const mine = shares(parts);
  const out: RecipeMatch[] = [];

  for (const c of COCKTAILS) {
    const theirs = shares(c.ings);
    const keys = new Set([...mine.keys(), ...theirs.keys()]);
    let inter = 0, union = 0, diff = 0;
    const missing: string[] = [], extra: string[] = [];

    for (const k of keys) {
      const a = mine.get(k) ?? 0, b = theirs.get(k) ?? 0;
      const weight = Math.max(a, b) < 0.03 ? 0.5 : 1;
      union += weight;
      if (a && b) { inter += weight; diff += Math.abs(a - b); }
      else if (b) missing.push(k);
      else extra.push(k);
    }

    const overlap = inter / union;
    const ratio = inter ? Math.max(0, 1 - diff) : 0;
    const score = overlap * 0.7 + ratio * 0.3;
    if (score >= 0.45) out.push({ cocktail: c, score, missing, extra });
  }

  return out.sort((x, y) => y.score - x.score).slice(0, limit);
}

// ── PANTRY ────────────────────────────────────────────────────────────────────

/** Recipe ingredients that are not in the given pantry (by ingredient id). */
export function missingFromPantry(c: Cocktail, owned: Set<number>): string[] {
  const have = new Set(INGREDIENTS.filter(i => owned.has(i.id)).map(i => family(i.name)));
  return c.ings.filter(i => !have.has(family(i.name))).map(i => canon(i.name));
}

/** Ice in the serving glass, read from the method ("su ghiaccio" vs "doppio colino"). */
export function servedIce(c: Cocktail): 'crushed' | 'yes' | 'no' | 'unknown' {
  const m = c.method.toLowerCase();
  if (/tritato|crushed/.test(m)) return 'crushed';
  if (/(colino|filtra)[^.]*su ghiaccio|ghiaccio fresco/.test(m)) return 'yes';
  if (/colino|filtra|strain/.test(m)) return 'no';
  if (!m.includes('ghiaccio')) return 'unknown';
  // Ice in the serving glass ("su ghiaccio", "riempi il bicchiere con ghiaccio",
  // "aggiungi bourbon e ghiaccio"), not in the shaker ("shaker con ghiaccio").
  return /(su|sul|nel) ghiaccio|ghiaccio nel (bicchiere|calice|mug|tumbler)|metti (il )?ghiaccio|riempi[^.]*ghiaccio|aggiungi[^.]*ghiaccio/.test(m) ? 'yes' : 'no';
}

/** Methods a recipe implies, read from its tags and method text. */
export function techniqueOf(c: Cocktail): 'shake' | 'stir' | 'build' | 'blend' {
  const s = (c.tags.join(' ') + ' ' + c.method).toLowerCase().replace(/non mescolare[^.]*/g, '');
  if (s.includes('blend') || s.includes('frulla')) return 'blend';
  if (s.includes('shake') || s.includes('agita') || s.includes('shaker')) return 'shake';
  if (s.includes('stirred') || s.includes('mescola')) return 'stir';
  return 'build';
}
