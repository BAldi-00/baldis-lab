// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Recipe-book bartender
// src/lib/bartender.ts
//
// Answers the AI Bartender page without any external API, from the site's
// own data: recipes by name, what to make with the bottles you list, drinks
// matching a mood ("estivo", "dolce", "forte", "analcolico"…), techniques
// and ingredients from the encyclopedia. Used when ANTHROPIC_API_KEY is not
// configured, and as a fallback if the Claude call fails.
// ─────────────────────────────────────────────────────────────────────────────

import { COCKTAILS, INGREDIENTS, GLASSES } from './data';
import type { Cocktail } from './data';
import { canon, family } from './mix';
import { ENC_INGREDIENTS, TECHNIQUES } from './knowledge';

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Everyday words → the pantry bottle they usually mean
const GENERIC: Record<string, string> = {
  gin: 'Gin London Dry', rum: 'Rum Bianco', tequila: 'Tequila Blanco', whisky: 'Bourbon', whiskey: 'Bourbon',
  vermut: 'Vermut Rosso', vermouth: 'Vermut Rosso', soda: 'Soda Water', tonica: 'Acqua Tonica', zucchero: 'Sciroppo',
  'ginger beer': 'Ginger Beer', 'succo di limone': 'Limone', 'succo di lime': 'Lime', caffe: 'Espresso',
};

const TECH_WORDS: Record<string, string[]> = {
  'Shake':         ['shake', 'shakera', 'shaker', 'agitare', 'agita'],
  'Stir':          ['stir', 'mescola', 'mixing glass', 'bar spoon'],
  'Build':         ['build', 'costruito', 'costruire'],
  'Muddle':        ['muddle', 'pestare', 'pesta', 'pestello'],
  'Double strain': ['double strain', 'doppio colino', 'doppio filtraggio', 'strain'],
  'Dry shake':     ['dry shake', 'albume', 'schiuma'],
  'Float':         ['float', 'strati', 'stratific', 'galleggia'],
  'Flame':         ['flame', 'fiamm', 'flambe'],
};

type Mood = { test: (c: Cocktail) => boolean; label: string };
const MOODS: [RegExp, Mood][] = [
  [/analcol|senza alcol|zero alcol|virgin|guid/, { label: 'analcolico', test: c => c.abv === 0 }],
  [/estiv|estate|fresc|rinfresc|caldo/,          { label: 'fresco', test: c => c.tags.includes('fresco') || c.tags.includes('tropicale') || c.cat === 'Longdrink' }],
  [/dolc/,                                        { label: 'dolce', test: c => c.tags.includes('dolce') }],
  [/amar|bitter/,                                 { label: 'amaro', test: c => c.tags.includes('amaro') }],
  [/agrum|aspro|acid|sour/,                       { label: 'agrumato', test: c => c.tags.includes('agrumato') || c.tags.includes('sour') || c.cat === 'Sour' }],
  [/tropical|tiki|esotic/,                        { label: 'tropicale', test: c => c.tags.includes('tropicale') || c.cat === 'Tropical' }],
  [/cremos|vellutat/,                             { label: 'cremoso', test: c => c.tags.includes('cremoso') }],
  [/dopo cena|digestiv|after dinner|caffe/,       { label: 'dopo cena', test: c => c.cat === 'After Dinner' || c.tags.includes('caffè') }],
  [/aperitiv/,                                    { label: 'aperitivo', test: c => c.cat === 'Aperitivo' || c.tags.includes('aperitivo') }],
  [/frizzant|bollicin|spritz/,                    { label: 'frizzante', test: c => c.tags.includes('frizzante') || c.tags.includes('fizz') }],
  [/forte|deciso|alcolic|carico/,                 { label: 'forte', test: c => c.abv >= 25 }],
  [/legger|poco alcol|soft/,                      { label: 'leggero', test: c => c.abv > 0 && c.abv <= 12 }],
  [/facil|semplic|veloc|princip/,                 { label: 'facile', test: c => c.diff === 1 }],
  [/elegant|classic|raffinat/,                    { label: 'classico', test: c => c.tags.includes('classico') || c.tags.includes('elegante') }],
];

function recipe(c: Cocktail) {
  return `${c.name} — ${GLASSES[c.glass]?.name ?? c.glass}, ${c.abv > 0 ? `${c.abv}%` : 'analcolico'}\n` +
    c.ings.map(i => `• ${i.amount < 5 ? `${i.amount} dash` : `${i.amount} ml`} ${canon(i.name)}`).join('\n') +
    `\n${c.method}\nGuarnizione: ${c.garnish}.`;
}

// Stable but varied picks: the same question gives the same answer,
// different questions don't all return the first three recipes.
function rotate<T>(list: T[], seed: string): T[] {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const k = list.length ? h % list.length : 0;
  return [...list.slice(k), ...list.slice(0, k)];
}

export function bartenderAnswer(question: string): string {
  const q = norm(question).trim();
  const word = (w: string) => new RegExp(`(^|[^a-z])${esc(w)}([^a-z]|$)`).test(q);

  if (!q) return 'Dimmi cosa hai in casa o che drink cerchi.';
  if (/^(ciao|salve|buonasera|buongiorno|hey|ehi)\b/.test(q) && q.length < 25) {
    return 'Ciao! Dimmi che bottiglie hai (es. "gin, Campari e vermut"), che gusto cerchi (fresco, dolce, amaro, analcolico…) o il nome di un cocktail.';
  }

  // 1. A cocktail by name (longest name first: "Negroni Sbagliato" before "Negroni")
  const named = [...COCKTAILS].sort((a, b) => b.name.length - a.name.length).find(c => q.includes(norm(c.name)));
  if (named && !/differenz|meglio|oppure| vs /.test(q)) {
    const tip = named.diff === 3 ? '\n\nÈ un drink da esperti: misura con il jigger e assaggia prima di servire.' : '';
    return `Ecco come si prepara.\n\n${recipe(named)}${tip}`;
  }

  // 2. Techniques ("differenza tra shake e stir", "come si fa il dry shake")
  const techs = TECHNIQUES.filter(t => TECH_WORDS[t.name]?.some(w => q.includes(w)));
  if (techs.length && /come|cos|differenz|quando|perche|spiega|tecnica|che vuol dire/.test(q)) {
    return techs.slice(0, 3).map(t => `${t.name}: ${t.desc}`).join('\n\n');
  }

  // 3. Bottles the user has
  const have = new Set(INGREDIENTS.filter(i => word(norm(i.name))).map(i => i.name));
  for (const [generic, name] of Object.entries(GENERIC)) {
    const family = name.split(' ')[0];
    if (word(generic) && ![...have].some(h => h.startsWith(family))) have.add(name);
  }

  // 4. Mood / style
  const moods = MOODS.filter(([re]) => re.test(q)).map(([, m]) => m);

  // "Cos'è il Campari?" → encyclopedia
  if (have.size === 1 && !moods.length && /cos|che cos|parlami|dimmi|origine|storia/.test(q)) {
    const name = [...have][0];
    const enc = ENC_INGREDIENTS.find(e => e.name === name);
    const uses = COCKTAILS.filter(c => c.ings.some(i => canon(i.name) === name)).slice(0, 5).map(c => c.name);
    return `${name}${enc ? ` (${enc.cat}, ${enc.origin}, ${enc.abv}%): ${enc.desc}\nNote: ${enc.notes}.` : '.'}` +
      (uses.length ? `\n\nLo trovi in: ${uses.join(', ')}.` : '');
  }

  // "Senza alcol" is a hard requirement; the other moods are preferences that
  // can be relaxed (and alcohol-strength moods make no sense without alcohol).
  const zero = moods.find(m => m.label === 'analcolico');
  const soft = moods.filter(m => m !== zero && !(zero && (m.label === 'forte' || m.label === 'leggero')));
  const base = COCKTAILS.filter(c => !zero || zero.test(c));
  let pool = base.filter(c => soft.every(m => m.test(c)));
  if (!pool.length) pool = base.filter(c => soft.some(m => m.test(c)));
  if (!pool.length) pool = base;
  if (zero) moods.splice(0, moods.length, zero, ...soft);

  if (have.size) {
    const scored = pool
      .map(c => {
        const names = c.ings.map(i => family(i.name));
        const mine = new Set([...have].map(family));
        const missing = names.filter(n => !mine.has(n));
        return { c, hit: names.length - missing.length, missing };
      })
      .filter(x => x.hit > 0 && x.missing.length <= 1)
      .sort((a, b) => a.missing.length - b.missing.length || b.hit - a.hit);
    const now = scored.filter(x => !x.missing.length);
    const pick = (now.length ? now : scored).slice(0, 3);
    if (!pick.length) {
      return `Con ${[...have].join(', ')} non trovo un drink completo nel ricettario. Aggiungi una bottiglia (un bitter, un vermut o una soda aprono molte strade) e riprova.`;
    }
    const head = now.length
      ? `Con ${[...have].join(', ')} puoi preparare subito:`
      : `Con ${[...have].join(', ')} ti manca poco:`;
    return `${head}\n\n${pick.map(x => recipe(x.c) + (x.missing.length ? `\n(Ti manca solo: ${x.missing[0]})` : '')).join('\n\n')}`;
  }

  if (moods.length) {
    const pick = rotate(pool, q).slice(0, 3);
    if (pick.length) return `Per qualcosa di ${moods.map(m => m.label).join(' e ')} ti consiglio:\n\n${pick.map(recipe).join('\n\n')}`;
  }

  return 'Non ho capito bene. Prova così:\n• "Ho gin, lime e soda: cosa preparo?"\n• "Un drink fresco e poco alcolico"\n• "Ricetta del Mojito"\n• "Differenza tra shake e stir"';
}
