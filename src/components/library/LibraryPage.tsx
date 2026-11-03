// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Library Page
// src/components/library/LibraryPage.tsx
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CocktailCard } from '@/components/cocktail/CocktailCard';
import { Icon }         from '@/components/ui/Icon';
import { useApp }       from '@/context/AppContext';
import { COCKTAILS, GLASSES, COCKTAIL_CATEGORIES, FLAVOR_TAGS } from '@/lib/data';
import type { GlassId, FlavorTag, CocktailCategory, Cocktail } from '@/lib/data';
import { useDebounce } from '@/lib/utils';
import { missingFromPantry } from '@/lib/mix';

type AbvBucket = 'zero' | 'light' | 'mid' | 'strong' | null;
type SortKey = 'name' | 'abv-asc' | 'abv-desc' | 'year' | 'diff';

const ABV_FILTERS: { id: AbvBucket; label: string; test: (n: number) => boolean }[] = [
  { id: 'zero',   label: 'Analcolici', test: n => n === 0 },
  { id: 'light',  label: 'Leggeri ≤13%', test: n => n > 0 && n <= 13 },
  { id: 'mid',    label: 'Medi 14–22%', test: n => n >= 14 && n <= 22 },
  { id: 'strong', label: 'Forti 23%+', test: n => n >= 23 },
];

const SORTS: { id: SortKey; label: string; fn: (a: Cocktail, b: Cocktail) => number }[] = [
  { id: 'name',     label: 'A–Z',            fn: (a, b) => a.name.localeCompare(b.name, 'it') },
  { id: 'abv-asc',  label: 'Più leggeri',    fn: (a, b) => a.abv - b.abv },
  { id: 'abv-desc', label: 'Più forti',      fn: (a, b) => b.abv - a.abv },
  { id: 'year',     label: 'Più storici',    fn: (a, b) => a.year - b.year },
  { id: 'diff',     label: 'Più facili',     fn: (a, b) => a.diff - b.diff },
];

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function LibraryPage() {
  const { favorites, cabinet } = useApp();
  const router = useRouter();
  const params = useSearchParams();
  const initialCat = params.get('cat');

  const [search,  setSearch]  = useState(params.get('q') ?? '');
  const [cat,     setCatSt]   = useState<CocktailCategory>(
    (COCKTAIL_CATEGORIES as readonly string[]).includes(initialCat ?? '') ? initialCat as CocktailCategory : 'Tutti');
  const [abvF,    setAbvF]    = useState<AbvBucket>(null);
  const [flavors, setFlavors] = useState<FlavorTag[]>([]);
  const [glassF,  setGlassF]  = useState<GlassId | null>(null);
  const [canMake, setCanMake] = useState(false);
  const [sort,    setSort]    = useState<SortKey>('name');
  const [showAdv, setShowAdv] = useState(false);
  const q = useDebounce(search, 150);

  const setCat = (c: CocktailCategory) => {
    setCatSt(c);
    router.replace(c === 'Tutti' ? '/cocktails' : `/cocktails?cat=${encodeURIComponent(c)}`, { scroll: false });
  };

  const toggleFlavor = (f: FlavorTag) =>
    setFlavors(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const activeFilters = (abvF ? 1 : 0) + flavors.length + (glassF ? 1 : 0) + (canMake ? 1 : 0);
  const clearAll = () => { setAbvF(null); setFlavors([]); setGlassF(null); setCanMake(false); };

  const filtered = useMemo(() => {
    const nq = norm(q.trim());
    const abvTest = ABV_FILTERS.find(f => f.id === abvF)?.test;
    const list = COCKTAILS.filter(c =>
      (cat === 'Tutti' || (cat === 'Preferiti' ? favorites.has(c.id) : c.cat === cat)) &&
      (!nq || norm(c.name).includes(nq) || c.tags.some(t => norm(t).includes(nq)) || c.ings.some(i => norm(i.name).includes(nq))) &&
      (!abvTest || abvTest(c.abv)) &&
      flavors.every(f => c.tags.includes(f)) &&
      (!glassF || c.glass === glassF) &&
      (!canMake || missingFromPantry(c, cabinet).length === 0)
    );
    return list.sort(SORTS.find(s => s.id === sort)!.fn);
  }, [q, cat, abvF, flavors, glassF, canMake, sort, favorites, cabinet]);

  const glassesInUse = useMemo(() => Object.values(GLASSES).filter(g => COCKTAILS.some(c => c.glass === g.id)), []);

  return (
    <div className="wrap pb-10 pt-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Ricettario</div>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">Cocktail</h1>
        </div>
        <p className="text-sm text-muted">{filtered.length} di {COCKTAILS.length} ricette</p>
      </header>

      {/* Search + controls */}
      <div className="sticky top-16 z-30 -mx-5 mt-8 border-b border-line/[0.07] bg-bg/95 px-5 py-3 sm:mx-0 sm:rounded-2xl sm:border sm:px-3">
        <div className="flex gap-2">
          <label className="relative flex-1">
            <Icon name="search" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca per nome, ingrediente o gusto…"
              className="input rounded-full pl-10" aria-label="Cerca cocktail" />
          </label>
          <button onClick={() => setShowAdv(s => !s)} className={`btn-ghost shrink-0 px-4 ${showAdv || activeFilters ? 'border-accent/60 text-accent' : ''}`} aria-expanded={showAdv}>
            <Icon name="filter" size={16} /> <span className="hidden sm:inline">Filtri</span>{activeFilters > 0 && ` · ${activeFilters}`}
          </button>
          <select value={sort} onChange={e => setSort(e.target.value as SortKey)} aria-label="Ordina"
            className="input hidden w-auto shrink-0 cursor-pointer rounded-full pr-8 sm:block">
            {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
          {COCKTAIL_CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} data-active={cat === c} className="chip">
              {c === 'Preferiti' && <Icon name="heart" size={13} fill={cat === c} />}{c}
              {c === 'Preferiti' && favorites.size > 0 && <span className="opacity-60">{favorites.size}</span>}
            </button>
          ))}
        </div>

        {showAdv && (
          <div className="mt-3 grid gap-5 border-t border-line/[0.07] pt-4 md:grid-cols-[1fr_1.4fr_1fr]">
            <div>
              <div className="stat-label mb-2">Gradazione</div>
              <div className="flex flex-wrap gap-1.5">
                {ABV_FILTERS.map(f => (
                  <button key={f.id} onClick={() => setAbvF(abvF === f.id ? null : f.id)} data-active={abvF === f.id} className="chip">{f.label}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="stat-label mb-2">Profilo</div>
              <div className="flex flex-wrap gap-1.5">
                {FLAVOR_TAGS.map(f => (
                  <button key={f} onClick={() => toggleFlavor(f)} data-active={flavors.includes(f)} className="chip capitalize">{f}</button>
                ))}
              </div>
            </div>
            <div className="grid content-start gap-3">
              <div>
                <div className="stat-label mb-2">Bicchiere</div>
                <select value={glassF ?? ''} onChange={e => setGlassF((e.target.value as GlassId) || null)} className="input cursor-pointer py-2">
                  <option value="">Tutti</option>
                  {glassesInUse.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <button onClick={() => setCanMake(v => !v)} data-active={canMake} className="chip justify-center py-2">
                <Icon name="cabinet" size={14} /> Solo quelli che posso fare
              </button>
              <select value={sort} onChange={e => setSort(e.target.value as SortKey)} className="input cursor-pointer py-2 sm:hidden" aria-label="Ordina">
                {SORTS.map(s => <option key={s.id} value={s.id}>Ordina: {s.label}</option>)}
              </select>
            </div>
            {activeFilters > 0 && (
              <button onClick={clearAll} className="btn-quiet justify-self-start px-0 text-sm md:col-span-3">Azzera filtri</button>
            )}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-3xl italic text-muted">
            {cat === 'Preferiti' ? 'Nessun preferito, per ora.' : 'Nessun cocktail trovato.'}
          </p>
          <p className="mt-2 text-sm text-muted">
            {cat === 'Preferiti' ? 'Tocca il cuore su una ricetta per salvarla qui.' : 'Prova a togliere qualche filtro.'}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((c, i) => <CocktailCard key={c.id} cocktail={c} priority={i < 8} />)}
        </div>
      )}
    </div>
  );
}
