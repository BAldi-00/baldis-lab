// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Bar Cabinet ("Il mio bar")
// src/components/cabinet/CabinetPage.tsx
//
// Saved per browser through AppContext. Matching uses canonical ingredient
// names, so "Gin" in a recipe is satisfied by "Gin London Dry" in the bar.
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { CocktailRow } from '@/components/cocktail/CocktailCard';
import { Icon } from '@/components/ui/Icon';
import { useApp } from '@/context/AppContext';
import { COCKTAILS, INGREDIENTS, INGREDIENT_CATEGORIES } from '@/lib/data';
import { missingFromPantry, findIngredient } from '@/lib/mix';

export function CabinetPage() {
  const { cabinet, toggleOwned, setCabinet } = useApp();

  const { ready, almost, unlock } = useMemo(() => {
    const ready: typeof COCKTAILS = [];
    const almost: { c: (typeof COCKTAILS)[number]; miss: string }[] = [];
    const unlockCount = new Map<string, number>();
    for (const c of COCKTAILS) {
      const miss = missingFromPantry(c, cabinet);
      if (miss.length === 0) ready.push(c);
      else if (miss.length === 1) {
        almost.push({ c, miss: miss[0] });
        unlockCount.set(miss[0], (unlockCount.get(miss[0]) ?? 0) + 1);
      }
    }
    // The single bottle that would unlock the most new recipes
    const unlock = [...unlockCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    return { ready, almost, unlock };
  }, [cabinet]);

  const cats = INGREDIENT_CATEGORIES.filter(c => c !== 'Tutti');

  return (
    <div className="wrap pb-10 pt-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Il mio bar</div>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">Cosa hai in casa?</h1>
          <p className="mt-3 max-w-xl text-muted">Segna le bottiglie che hai. Ti diciamo cosa puoi preparare adesso e cosa ti conviene comprare.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCabinet([])} className="btn-quiet text-sm">Svuota</button>
          <button onClick={() => setCabinet(INGREDIENTS.map(i => i.id))} className="btn-ghost text-sm">Seleziona tutto</button>
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* Inventory */}
        <section className="card p-5 sm:p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl">Bottiglie e dispensa</h2>
            <span className="text-sm text-muted"><strong className="text-accent">{cabinet.size}</strong> / {INGREDIENTS.length}</span>
          </div>
          <div className="mt-5 grid gap-5">
            {cats.map(cat => {
              const list = INGREDIENTS.filter(i => i.cat === cat);
              if (!list.length) return null;
              return (
                <div key={cat}>
                  <div className="stat-label mb-2">{cat}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {list.map(i => (
                      <button key={i.id} onClick={() => toggleOwned(i.id)} data-active={cabinet.has(i.id)} className="chip">
                        <span className="h-2.5 w-2.5 rounded-full ring-1 ring-line/25" style={{ background: i.color }} />
                        {i.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Results */}
        <div className="grid content-start gap-6">
          <section>
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-3xl">Puoi preparare</h2>
              <span className="text-sm text-muted">{ready.length}</span>
            </div>
            {ready.length ? (
              <div className="mt-4 grid gap-2">{ready.map(c => <CocktailRow key={c.id} cocktail={c} />)}</div>
            ) : (
              <p className="mt-3 text-sm text-muted">Ancora niente: aggiungi qualche bottiglia a sinistra.</p>
            )}
          </section>

          {unlock.length > 0 && (
            <section className="card p-5">
              <div className="eyebrow">Prossimo acquisto</div>
              <ul className="mt-3 grid gap-2">
                {unlock.map(([name, n]) => {
                  const ing = findIngredient(name);
                  return (
                    <li key={name} className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full ring-1 ring-line/25" style={{ background: ing?.color ?? '#999' }} />
                      <span className="flex-1">{name}</span>
                      <span className="text-sm text-muted">+{n} {n === 1 ? 'ricetta' : 'ricette'}</span>
                      {ing && <button onClick={() => toggleOwned(ing.id)} className="btn-icon h-7 w-7" aria-label={`Aggiungi ${name}`}><Icon name="plus" size={13} /></button>}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {almost.length > 0 && (
            <section>
              <h2 className="font-display text-3xl">Ti manca un ingrediente</h2>
              <div className="mt-4 grid gap-2">
                {almost.slice(0, 12).map(({ c, miss }) => <CocktailRow key={c.id} cocktail={c} note={`Manca: ${miss}`} />)}
              </div>
            </section>
          )}

          <Link href="/ai" className="card card-hover flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent"><Icon name="sparkle" /></span>
            <span className="flex-1">
              <span className="block font-display text-xl">Chiedi all&rsquo;AI Bartender</span>
              <span className="block text-sm text-muted">Idee su misura con quello che hai.</span>
            </span>
            <Icon name="arrow" className="text-muted" />
          </Link>
        </div>
      </div>
    </div>
  );
}
