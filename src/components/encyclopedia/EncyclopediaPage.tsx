// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Encyclopedia
// src/components/encyclopedia/EncyclopediaPage.tsx
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Glass } from '@/components/glass/Glass';
import { GLASSES, COCKTAILS } from '@/lib/data';
import type { GlassId } from '@/lib/data';
import { ENC_INGREDIENTS, TECHNIQUES } from '@/lib/knowledge';

type Tab = 'ingredienti' | 'tecniche' | 'bicchieri';

export function EncyclopediaPage() {
  const [tab, setTab] = useState<Tab>('ingredienti');
  const glasses = Object.values(GLASSES);

  return (
    <div className="wrap pb-10 pt-10">
      <div className="eyebrow">Conoscenza</div>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Enciclopedia</h1>
      <p className="mt-3 max-w-xl text-muted">Quello che un bartender sa prima ancora di prendere lo shaker.</p>

      <div className="mt-8 flex gap-1.5" role="tablist">
        {(['ingredienti', 'tecniche', 'bicchieri'] as Tab[]).map(t => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} data-active={tab === t} className="chip px-5 py-2 capitalize">{t}</button>
        ))}
      </div>

      {tab === 'ingredienti' && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ENC_INGREDIENTS.map(ing => (
            <article key={ing.name} className="card p-6">
              <div className="flex items-center justify-between">
                <span className="h-10 w-10 rounded-full ring-1 ring-line/25" style={{ background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,.5), ${ing.color} 45%)` }} />
                <span className="text-sm font-semibold text-accent">{ing.abv}%</span>
              </div>
              <h3 className="mt-5 font-display text-2xl">{ing.name}</h3>
              <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">{ing.cat} · {ing.origin}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{ing.desc}</p>
              <p className="mt-4 border-t border-line/[0.07] pt-3 text-sm italic text-text/80">{ing.notes}</p>
            </article>
          ))}
        </div>
      )}

      {tab === 'tecniche' && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {TECHNIQUES.map((t, i) => (
            <article key={t.name} className="card flex gap-5 p-6">
              <span className="font-display text-4xl text-accent/70">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="font-display text-2xl">{t.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{t.desc}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === 'bicchieri' && (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {glasses.map(g => {
            const count = COCKTAILS.filter(c => c.glass === g.id).length;
            return (
              <article key={g.id} className="card flex flex-col p-5">
                <Glass glass={g.id as GlassId} layers={[]} capacity={g.capacity} className="mx-auto h-40 w-full" title={g.name} />
                <h3 className="mt-3 font-display text-2xl">{g.name}</h3>
                <div className="text-xs text-muted">{g.capacity} ml</div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{g.description}</p>
                {count > 0 && (
                  <Link href={`/simulator`} className="mt-3 text-xs font-semibold text-accent">{count} ricette lo usano</Link>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
