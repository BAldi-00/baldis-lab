// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Simulator ("Laboratorio")
// src/components/simulator/SimulatorPage.tsx
//
// What the simulator models:
//  • liquid level from the real volume of each glass profile (lib/glass.ts)
//  • ice displacement, overflow protection
//  • unmixed liquids settle by density; stirring/shaking blends them and adds
//    melt-water (20% / 27%), which lowers the ABV like it does at the bar
//  • live recipe recognition + a guided mode that checks your doses
// Rendering is a single SVG with CSS-only animation; the only rAF loop runs
// while you are actually holding the pour button.
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Glass, iceDisplacement } from '@/components/glass/Glass';
import type { IceKind, RimKind, GlassLayer } from '@/components/glass/Glass';
import { artLayers } from '@/lib/art';
import { Icon } from '@/components/ui/Icon';
import { SHAPES } from '@/lib/glass';
import { GLASSES, INGREDIENTS, INGREDIENT_CATEGORIES, COCKTAILS, getCocktailBySlug, cocktailHref } from '@/lib/data';
import type { GlassId, Ingredient, Cocktail } from '@/lib/data';
import {
  blendColors, canon, family, drinkStats, matchRecipes, physics, techniqueOf, DILUTION,
} from '@/lib/mix';
import type { MixMethod } from '@/lib/mix';

// ── TYPES & OPTIONS ───────────────────────────────────────────────────────────

interface SimPart { name: string; amount: number; color: string; mixed: boolean; }
interface Snapshot { parts: SimPart[]; water: number; }

const POUR_RATE = 40;   // ml per second while holding
const HOLD_MS   = 220;  // press longer than this = continuous pour
const WATER     = 'rgba(235,245,255,0.18)';

const ICE_OPTIONS: { id: IceKind; label: string }[] = [
  { id: null, label: 'Senza' }, { id: 'cubes', label: 'Cubetti' }, { id: 'rock', label: 'Blocco' },
  { id: 'sphere', label: 'Sfera' }, { id: 'crushed', label: 'Tritato' }, { id: 'stick', label: 'Stick' },
];

const GARNISHES = [
  'Nessuna', 'Fetta di lime', 'Scorza di lime', 'Fetta di limone', 'Scorza di limone',
  "Fetta d'arancia", "Scorza d'arancia", 'Ciliegia', 'Menta', 'Oliva', 'Ananas',
  'Ombrellino', 'Chicchi di caffè', 'Cetriolo', 'Fragola', 'Basilico', 'Cannella',
];

/** Pick the simulator garnish closest to a recipe's garnish text. */
function garnishFor(text: string): string {
  const g = text.toLowerCase();
  const peel = g.includes('scorza');
  for (const k of ['ombrellino', 'oliva', 'ciliegia', 'menta', 'ananas', 'cetriolo', 'fragola', 'basilico', 'cannella'] as const) {
    if (g.includes(k)) return GARNISHES.find(x => x.toLowerCase().includes(k))!;
  }
  if (g.includes('caffè')) return 'Chicchi di caffè';
  if (g.includes('arancia')) return peel ? "Scorza d'arancia" : "Fetta d'arancia";
  if (/\blime\b/.test(g)) return peel ? 'Scorza di lime' : 'Fetta di lime';
  if (g.includes('limone')) return peel ? 'Scorza di limone' : 'Fetta di limone';
  return 'Nessuna';
}

const GLASS_ORDER: GlassId[] = ['oldfashioned', 'highball', 'collins', 'coupe', 'martini', 'margarita', 'wine', 'flute', 'hurricane', 'whisky', 'shot'];

const addTo = (parts: SimPart[], ing: { name: string; color: string }, ml: number): SimPart[] => {
  const i = parts.findIndex(p => p.name === ing.name && !p.mixed);
  if (i === -1) return [...parts, { name: ing.name, amount: ml, color: ing.color, mixed: false }];
  const next = parts.slice();
  next[i] = { ...next[i], amount: next[i].amount + ml };
  return next;
};

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function SimulatorPage() {
  const params = useSearchParams();

  const [glassId, setGlassId] = useState<GlassId>('oldfashioned');
  const [parts,   setParts]   = useState<SimPart[]>([]);
  const [water,   setWater]   = useState(0);
  const [ice,     setIce]     = useState<IceKind>(null);
  const [garnish, setGarnish] = useState('Nessuna');
  const [rim,     setRim]     = useState<RimKind>(null);
  const [straw,   setStraw]   = useState(false);
  const [pour,    setPour]    = useState<string | null>(null);
  const [mixing,  setMixing]  = useState<MixMethod | null>(null);
  const [target,  setTarget]  = useState<Cocktail | null>(null);
  const [toast,   setToast]   = useState<string | null>(null);
  const [cat,     setCat]     = useState<string>('Tutti');
  const [search,  setSearch]  = useState('');
  const [undo,    setUndo]    = useState<Snapshot[]>([]);
  const [autoPouring, setAutoPouring] = useState(false);

  const gDef     = GLASSES[glassId];
  const capacity = gDef.capacity;
  const liquid   = parts.reduce((s, p) => s + p.amount, 0) + water;
  const disp     = iceDisplacement(ice, capacity);
  const free     = capacity - disp - liquid;

  // Refs read by the pour loop
  const freeRef = useRef(free);
  freeRef.current = free;
  // Set on every (re)mount: StrictMode and Fast Refresh run the cleanup and
  // then the effect again on the same refs, and a flag left at false would
  // drop every timer below (pour stream and bar spoon stuck on screen).
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  // ── Toast ──
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const say = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  // ── Undo ──
  const snapshot = useCallback(() => {
    setUndo(u => [...u.slice(-29), { parts, water }]);
  }, [parts, water]);

  const doUndo = () => {
    const last = undo[undo.length - 1];
    if (!last) return;
    setParts(last.parts); setWater(last.water); setUndo(u => u.slice(0, -1));
  };

  const reset = () => {
    stopPour();
    snapshot();
    setParts([]); setWater(0); setIce(null); setGarnish('Nessuna'); setRim(null); setStraw(false);
  };

  // ── Pouring: tap = default dose, hold = continuous ──
  const press = useRef<{ ing: Ingredient; timer?: ReturnType<typeof setTimeout>; raf?: number; streaming: boolean } | null>(null);

  function stopPour() {
    const p = press.current;
    if (p) { clearTimeout(p.timer); if (p.raf) cancelAnimationFrame(p.raf); }
    press.current = null;
    setPour(null);
  }

  const quickAdd = (ing: Ingredient) => {
    const ml = Math.min(ing.ml, freeRef.current);
    if (ml <= 0.5) { say('Il bicchiere è pieno'); return; }
    snapshot();
    setParts(p => addTo(p, ing, ml));
    setPour(ing.color);
    setTimeout(() => alive.current && setPour(c => (c === ing.color ? null : c)), 450);
    if (ml < ing.ml) say(`Spazio finito: versati solo ${Math.round(ml)} ml`);
  };

  const onPressStart = (ing: Ingredient, e: React.PointerEvent) => {
    if (autoPouring || mixing) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    stopPour();
    const p: NonNullable<typeof press.current> = { ing, streaming: false };
    press.current = p;
    p.timer = setTimeout(() => {
      if (freeRef.current <= 0.5) { say('Il bicchiere è pieno'); return; }
      p.streaming = true;
      snapshot();
      setPour(ing.color);
      let last = performance.now();
      const tick = (now: number) => {
        if (press.current !== p) return;
        const ml = Math.min((POUR_RATE * (now - last)) / 1000, freeRef.current);
        last = now;
        if (ml <= 0) { say('Il bicchiere è pieno'); stopPour(); return; }
        setParts(prev => addTo(prev, ing, ml));
        p.raf = requestAnimationFrame(tick);
      };
      p.raf = requestAnimationFrame(tick);
    }, HOLD_MS);
  };

  const onPressEnd = () => {
    const p = press.current;
    if (!p) return;
    if (!p.streaming) { clearTimeout(p.timer); press.current = null; quickAdd(p.ing); }
    else stopPour();
  };

  // ── Mixing ──
  const mix = useCallback((method: MixMethod, silent = false) => {
    const unmixed = parts.filter(p => !p.mixed);
    if (!unmixed.length) { if (!silent) say(parts.length ? 'È già tutto miscelato' : 'Prima versa qualcosa'); return; }
    if (method === 'shake' && unmixed.some(p => physics(p.name).fizzy) && !silent) {
      say('Attenzione: shakerare le bollicine le fa sgasare');
    }
    snapshot();
    setMixing(method);
    setTimeout(() => {
      if (!alive.current) return;
      setMixing(null);
      setParts(prev => {
        const merged: SimPart[] = [];
        for (const p of prev) {
          const m = merged.find(x => x.name === p.name);
          if (m) m.amount += p.amount; else merged.push({ ...p, mixed: true });
        }
        return merged;
      });
      // Melt-water only comes from ice: shaking always uses a tin full of it;
      // stirring dilutes if there's ice in the glass, or if the drink is served
      // "up" (coupe, martini…), i.e. stirred in a mixing glass and strained.
      const servedUp = SHAPES[glassId].ice === 'none';
      const dilutes = method === 'shake' || !!ice || servedUp;
      const newly = unmixed.reduce((s, p) => s + p.amount, 0);
      if (dilutes) setWater(w => w + Math.max(0, Math.min(newly * DILUTION[method], freeRef.current)));
    }, 1300);
  }, [parts, say, snapshot, glassId, ice]);

  const removePart = (i: number) => { snapshot(); setParts(p => p.filter((_, j) => j !== i)); };
  const adjustPart = (i: number, d: number) => {
    if (d > 0 && free < d) { say('Non c’è più spazio'); return; }
    snapshot();
    setParts(p => p.map((x, j) => (j === i ? { ...x, amount: Math.max(1, x.amount + d) } : x)));
  };

  const changeGlass = (id: GlassId) => {
    setGlassId(id);
    const over = liquid + iceDisplacement(ice, GLASSES[id].capacity) - GLASSES[id].capacity;
    if (over > 1) say(`Attenzione: ${Math.round(over)} ml non ci stanno in questo bicchiere`);
  };

  const changeIce = (k: IceKind) => {
    setIce(k);
    const over = liquid + iceDisplacement(k, capacity) - capacity;
    if (over > 1) say('Con questo ghiaccio il drink trabocca');
  };

  // ── Guided mode ──
  const loadTarget = useCallback((c: Cocktail | null) => {
    setTarget(c);
    if (!c) return;
    setGlassId(c.glass);
    const a = artLayers(c);
    setIce(a.ice);
    setRim(a.rim);
  }, []);

  useEffect(() => {
    const slug = params.get('c');
    const c = slug ? getCocktailBySlug(slug) : null;
    if (c) loadTarget(c);
  }, [params, loadTarget]);

  const autoPour = async () => {
    if (!target || autoPouring) return;
    setAutoPouring(true);
    stopPour();
    snapshot();
    setParts([]); setWater(0);
    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
    await wait(200);
    for (const ing of target.ings) {
      if (!alive.current) return;
      const color = ing.color;
      setPour(color);
      const steps = 8;
      for (let s = 0; s < steps; s++) {
        setParts(p => addTo(p, { name: canon(ing.name), color }, ing.amount / steps));
        await wait(55);
      }
      setPour(null);
      await wait(160);
    }
    const tech = techniqueOf(target);
    // Building in the glass mixes spirits, juices and sodas as they go in;
    // only heavy syrups (grenadine) sink. Same rule as the recipe art.
    if (tech === 'build') setParts(p => p.map(x => (physics(x.name).density < 1.25 ? { ...x, mixed: true } : x)));
    setGarnish(garnishFor(target.garnish));
    setAutoPouring(false);
    if (tech === 'shake' || tech === 'stir') say(tech === 'shake' ? 'Ora shakeralo!' : 'Ora mescolalo!');
  };

  // ── Derived render data ──
  const layers: GlassLayer[] = useMemo(() => {
    const mixed = parts.filter(p => p.mixed);
    const blocks: (GlassLayer & { d: number })[] = [];
    if (mixed.length || water > 0) {
      const all = [...mixed, ...(water > 0 ? [{ name: 'Acqua', amount: water, color: WATER }] : [])];
      const vol = all.reduce((s, p) => s + p.amount, 0);
      blocks.push({
        color: blendColors(all),
        amount: vol,
        d: all.reduce((s, p) => s + physics(p.name).density * p.amount, 0) / (vol || 1),
      });
    }
    for (const p of parts.filter(x => !x.mixed)) blocks.push({ color: p.color, amount: p.amount, d: physics(p.name).density });
    return blocks.sort((a, b) => b.d - a.d).map(({ color, amount }) => ({ color, amount }));
  }, [parts, water]);

  const fizzy   = parts.some(p => physics(p.name).fizzy);
  const stats   = drinkStats(parts, water);
  const matches = useMemo(() => matchRecipes(parts), [parts]);
  const best    = matches[0];
  const fillPct = Math.min(100, Math.round(((liquid + (liquid > 0 ? disp : 0)) / capacity) * 100));

  const ingredients = useMemo(() => {
    const q = search.trim().toLowerCase();
    return INGREDIENTS.filter(i => (cat === 'Tutti' || i.cat === cat) && (!q || i.name.toLowerCase().includes(q)));
  }, [cat, search]);

  const targetRows = target?.ings.map(i => {
    const name = canon(i.name);
    const poured = parts.filter(p => family(p.name) === family(name)).reduce((s, p) => s + p.amount, 0);
    const ok = Math.abs(poured - i.amount) <= Math.max(2, i.amount * 0.15);
    return { name, poured, want: i.amount, color: i.color, ok, over: poured > i.amount * 1.15 + 2 };
  }) ?? [];
  const targetDone = targetRows.length > 0 && targetRows.every(r => r.ok);
  const sortedCocktails = useMemo(() => [...COCKTAILS].sort((a, b) => a.name.localeCompare(b.name, 'it')), []);

  return (
    <div className="wrap pb-10 pt-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Laboratorio</div>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">Crea il tuo drink</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={doUndo} disabled={!undo.length || autoPouring} className="btn-ghost"><Icon name="undo" size={16} /> Annulla</button>
          <button onClick={reset} disabled={autoPouring} className="btn-ghost"><Icon name="reset" size={16} /> Svuota</button>
        </div>
      </header>

      <div className="mt-8 grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)_330px]">
        {/* ── STAGE ─────────────────────────────────────────────────── */}
        <section className="order-1 min-w-0 lg:order-2">
          <div className="card relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0"
              style={{ background: `radial-gradient(60% 50% at 50% 62%, ${layers.length ? blendColors(layers) : 'rgba(255,255,255,.04)'}, transparent 70%)`, opacity: 0.35 }} />
            <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-b from-transparent to-line/[0.06]" />

            <div className="relative flex items-start justify-between p-4 sm:p-5">
              <div>
                <div className="font-display text-xl">{gDef.name}</div>
                <div className="text-xs text-muted">{capacity} ml</div>
              </div>
              <div className="text-right">
                <div className="font-display text-xl tabular-nums">{Math.round(liquid)} <span className="text-sm text-muted">ml</span></div>
                <div className={`text-xs ${fillPct >= 98 ? 'text-accent-2' : 'text-muted'}`}>{fillPct}% pieno</div>
              </div>
            </div>

            {toast && (
              <div className="absolute left-1/2 top-16 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-text px-4 py-2 text-sm font-medium text-bg shadow-lg" style={{ animation: 'toast-in .25s ease both' }}>
                {toast}
              </div>
            )}

            <div className="relative flex h-[280px] items-end justify-center sm:h-[460px]">
              <Glass
                glass={glassId} layers={layers} capacity={capacity}
                ice={ice} garnish={garnish === 'Nessuna' ? null : garnish} rim={rim} straw={straw}
                fizzy={fizzy} pour={pour} mixing={mixing}
                className="h-full w-full max-w-[420px] pb-4"
                title={best && best.score > 0.75 ? best.cocktail.name : 'Il tuo drink'}
              />
              {/* Fill meter */}
              <div className="absolute bottom-8 right-5 top-4 w-1.5 overflow-hidden rounded-full bg-line/10" aria-hidden>
                <div className="absolute inset-x-0 bottom-0 rounded-full bg-accent transition-[height] duration-200" style={{ height: `${fillPct}%` }} />
              </div>
            </div>

            {/* Tools */}
            <div className="relative grid gap-3 border-t border-line/[0.07] bg-bg/40 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => mix('stir')} disabled={!!mixing || autoPouring} className="btn-primary px-4 py-2">
                  <Icon name="stir" size={16} /> {mixing === 'stir' ? 'Mescolo…' : 'Mescola'}
                </button>
                <button onClick={() => mix('shake')} disabled={!!mixing || autoPouring} className="btn-ghost px-4 py-2">
                  <Icon name="shake" size={16} /> {mixing === 'shake' ? 'Shakero…' : 'Shakera'}
                </button>
                <span className="mx-1 hidden h-6 w-px bg-line/10 sm:block" />
                <button onClick={() => setStraw(s => !s)} data-active={straw} className="chip"><Icon name="straw" size={14} /> Cannuccia</button>
                <button onClick={() => setRim(r => (r === 'salt' ? null : 'salt'))} data-active={rim === 'salt'} className="chip">Bordo sale</button>
                <button onClick={() => setRim(r => (r === 'sugar' ? null : 'sugar'))} data-active={rim === 'sugar'} className="chip">Bordo zucchero</button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="stat-label w-16">Ghiaccio</span>
                {ICE_OPTIONS.map(o => (
                  <button key={String(o.id)} onClick={() => changeIce(o.id)} data-active={ice === o.id} className="chip px-3 py-1">{o.label}</button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="stat-label w-16">Garnish</span>
                <select value={garnish} onChange={e => setGarnish(e.target.value)} className="input w-auto cursor-pointer rounded-full py-1.5 text-sm">
                  {GARNISHES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Glass picker */}
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
            {GLASS_ORDER.map(id => (
              <button key={id} onClick={() => changeGlass(id)} aria-pressed={glassId === id}
                className={`flex w-[76px] shrink-0 flex-col items-center rounded-2xl border px-1 pb-2 pt-1 transition-colors ${glassId === id ? 'border-accent/60 bg-accent/10 text-accent' : 'border-line/[0.07] text-muted hover:border-line/20 hover:text-text'}`}>
                <Glass glass={id} layers={[]} capacity={GLASSES[id].capacity} className="h-14 w-14" title={GLASSES[id].name} />
                <span className="w-full truncate text-center text-[11px]">{GLASSES[id].name.replace(/^(Coppa|Calice da) (.)/, (_, _p, ch: string) => ch.toUpperCase())}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── INGREDIENTS ──────────────────────────────────────────── */}
        <aside className="order-2 min-w-0 lg:order-1">
          <div className="card flex flex-col p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">
            <h2 className="font-display text-2xl">Bottigliera</h2>
            <p className="mt-1 text-xs text-muted">Tocca per la dose standard · tieni premuto per versare</p>
            <label className="relative mt-3 shrink-0">
              <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca…" className="input rounded-full py-2 pl-9 text-sm" />
            </label>
            <div className="no-scrollbar -mx-1 mt-3 flex shrink-0 gap-1.5 overflow-x-auto px-1 pb-1">
              {INGREDIENT_CATEGORIES.map(c => (
                <button key={c} onClick={() => setCat(c)} data-active={cat === c} className="chip px-3 py-1 text-xs">{c}</button>
              ))}
            </div>
            <ul className="-mx-2 mt-2 max-h-[360px] overflow-y-auto lg:max-h-none lg:flex-1">
              {ingredients.map(ing => (
                <li key={ing.id}>
                  <button
                    onPointerDown={e => onPressStart(ing, e)}
                    onPointerUp={onPressEnd}
                    onPointerCancel={stopPour}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); quickAdd(ing); } }}
                    onContextMenu={e => e.preventDefault()}
                    disabled={autoPouring || !!mixing}
                    className="flex w-full touch-none select-none items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-line/5 active:bg-accent/10"
                  >
                    <span className="h-7 w-3 shrink-0 rounded-full ring-1 ring-line/25" style={{ background: ing.color }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{ing.name}</span>
                      <span className="block text-[11px] text-muted">{ing.abv > 0 ? `${ing.abv}% vol` : 'analcolico'}</span>
                    </span>
                    <span className="rounded-full border border-line/10 px-2 py-0.5 text-[11px] tabular-nums text-muted">+{ing.ml}</span>
                  </button>
                </li>
              ))}
              {!ingredients.length && <li className="px-2 py-6 text-center text-sm text-muted">Nessun ingrediente</li>}
            </ul>
          </div>
        </aside>

        {/* ── INFO ─────────────────────────────────────────────────── */}
        <aside className="order-3 grid min-w-0 content-start gap-4">
          {/* Stats */}
          <div className="card grid grid-cols-2 gap-px overflow-hidden bg-line/[0.07] p-0">
            {([
              ['Gradazione', `${stats.abv}%`],
              ['Calorie', `${stats.kcal}`],
              ['Alcol', `${stats.alcohol} g`],
              ['Diluizione', `${stats.water} ml`],
            ] as const).map(([k, v]) => (
              <div key={k} className="bg-surface p-4">
                <div className="stat-label">{k}</div>
                <div className="stat-value mt-1 tabular-nums">{v}</div>
              </div>
            ))}
          </div>

          {/* Recognition */}
          {parts.length > 0 && (
            <div className="card p-4">
              {best && best.score >= 0.62 ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="eyebrow">Riconosciuto</span>
                    <span className="text-sm font-semibold tabular-nums text-accent">{Math.round(best.score * 100)}%</span>
                  </div>
                  <Link href={cocktailHref(best.cocktail)} className="mt-1 block font-display text-3xl hover:text-accent">{best.cocktail.name}</Link>
                  {best.missing.length > 0 && <p className="mt-1 text-sm text-muted">Manca: {best.missing.join(', ')}</p>}
                  {best.extra.length > 0 && <p className="mt-0.5 text-sm text-muted">In più: {best.extra.join(', ')}</p>}
                </>
              ) : (
                <>
                  <span className="eyebrow">Creazione originale</span>
                  <p className="mt-1 text-sm text-muted">{matches.length ? 'Si avvicina a:' : 'Nessuna ricetta simile nel ricettario.'}</p>
                </>
              )}
              {matches.slice(best && best.score >= 0.62 ? 1 : 0).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {matches.slice(best && best.score >= 0.62 ? 1 : 0).map(m => (
                    <Link key={m.cocktail.id} href={cocktailHref(m.cocktail)} className="chip text-xs">
                      {m.cocktail.name} <span className="opacity-60">{Math.round(m.score * 100)}%</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Composition */}
          <div className="card p-4">
            <h2 className="font-display text-2xl">Nel bicchiere</h2>
            {parts.length === 0 && water === 0 ? (
              <p className="mt-2 text-sm text-muted">Ancora vuoto. Scegli un ingrediente dalla bottigliera.</p>
            ) : (
              <ul className="mt-3 grid gap-1.5">
                {parts.map((p, i) => (
                  <li key={`${p.name}-${p.mixed}`} className="flex items-center gap-2.5 rounded-xl bg-bg/40 py-1.5 pl-3 pr-1.5">
                    <span className="h-3 w-3 shrink-0 rounded-full ring-1 ring-line/25" style={{ background: p.color }} />
                    <span className="min-w-0 flex-1 truncate text-sm">{p.name}{p.mixed && <span className="ml-1.5 text-[10px] uppercase tracking-wider text-muted">mix</span>}</span>
                    <button onClick={() => adjustPart(i, -5)} className="btn-icon h-7 w-7" aria-label="Meno 5 ml"><Icon name="minus" size={13} /></button>
                    <span className="w-12 text-center text-sm tabular-nums">{Math.round(p.amount)} ml</span>
                    <button onClick={() => adjustPart(i, 5)} className="btn-icon h-7 w-7" aria-label="Più 5 ml"><Icon name="plus" size={13} /></button>
                    <button onClick={() => removePart(i)} className="btn-icon h-7 w-7 border-transparent" aria-label={`Rimuovi ${p.name}`}><Icon name="close" size={13} /></button>
                  </li>
                ))}
                {water > 0 && (
                  <li className="flex items-center gap-2.5 px-3 py-1 text-sm text-muted">
                    <span className="h-3 w-3 rounded-full ring-1 ring-line/25" style={{ background: WATER }} />
                    <span className="flex-1">Acqua di diluizione</span>
                    <span className="tabular-nums">{Math.round(water)} ml</span>
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Guided mode */}
          <div className="card p-4">
            <h2 className="font-display text-2xl">Segui una ricetta</h2>
            <select value={target?.id ?? ''} onChange={e => loadTarget(COCKTAILS.find(c => c.id === +e.target.value) ?? null)}
              className="input mt-3 cursor-pointer text-sm">
              <option value="">Scegli un cocktail…</option>
              {sortedCocktails.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {target && (
              <>
                <ul className="mt-3 grid gap-2">
                  {targetRows.map(r => (
                    <li key={r.name}>
                      <div className="flex items-center justify-between text-sm">
                        <span className={r.ok ? 'text-accent' : ''}>{r.ok && <Icon name="check" size={13} className="mr-1 inline" />}{r.name}</span>
                        <span className={`tabular-nums ${r.over ? 'text-accent-2' : 'text-muted'}`}>{Math.round(r.poured)} / {r.want} ml</span>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-line/10">
                        <div className="h-full rounded-full transition-[width] duration-200" style={{ width: `${Math.min(100, (r.poured / r.want) * 100)}%`, background: r.over ? 'rgb(var(--accent-2))' : 'rgb(var(--accent))' }} />
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted">
                  {targetDone ? 'Dosi perfette. ' : ''}Tecnica: {{ shake: 'shakera', stir: 'mescola', build: 'costruisci nel bicchiere', blend: 'frulla con ghiaccio' }[techniqueOf(target)]} · {target.garnish}
                </p>
                <div className="mt-3 flex gap-2">
                  <button onClick={autoPour} disabled={autoPouring} className="btn-ghost flex-1 py-2 text-sm">
                    {autoPouring ? 'Verso…' : 'Versa per me'}
                  </button>
                  <Link href={cocktailHref(target)} className="btn-quiet py-2 text-sm">Ricetta</Link>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
