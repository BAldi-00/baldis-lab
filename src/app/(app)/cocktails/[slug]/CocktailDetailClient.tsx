// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Cocktail Detail (interactive parts)
// src/app/(app)/cocktails/[slug]/CocktailDetailClient.tsx
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CocktailArt }  from '@/components/cocktail/CocktailArt';
import { CocktailCard, FavButton, RatingStars } from '@/components/cocktail/CocktailCard';
import { Icon }         from '@/components/ui/Icon';
import { useApp }       from '@/context/AppContext';
import { COCKTAILS, GLASSES, slugifyName } from '@/lib/data';
import type { Cocktail } from '@/lib/data';
import { DIFF_LABEL }   from '@/lib/utils';
import { canon, findIngredient, techniqueOf } from '@/lib/mix';

const TECH_LABEL = { shake: 'Shakerato', stir: 'Mescolato', build: 'Costruito', blend: 'Frullato' } as const;
const SERVES = [1, 2, 4, 6];

export default function CocktailDetailClient({ cocktail: c }: { cocktail: Cocktail }) {
  const { pushHistory, cabinet } = useApp();
  const [serves, setServes] = useState(1);
  const [unit,   setUnit]   = useState<'ml' | 'oz'>('ml');
  const [copied, setCopied] = useState(false);

  useEffect(() => { pushHistory(c.id); }, [c.id, pushHistory]);

  const gDef = GLASSES[c.glass] ?? GLASSES.oldfashioned;
  const steps = c.method.split(/(?<=\.)\s+/).filter(Boolean);
  const owned = c.ings.filter(i => { const ing = findIngredient(i.name); return ing && cabinet.has(ing.id); }).length;

  const related = useMemo(() => COCKTAILS
    .filter(x => x.id !== c.id)
    .map(x => ({ x, score: x.tags.filter(t => c.tags.includes(t)).length + (x.cat === c.cat ? 1 : 0) }))
    .filter(r => r.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(r => r.x), [c]);

  const fmt = (ml: number) => {
    const v = ml * serves;
    if (unit === 'oz') return `${(v / 29.57).toFixed(v / 29.57 < 1 ? 2 : 1)} oz`;
    return v < 5 ? `${v} dash` : `${v} ml`;
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: c.name, text: c.desc, url });
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    } catch {}
  };

  return (
    <div className="wrap pb-10 pt-8">
      <nav className="flex items-center gap-2 text-sm text-muted">
        <Link href="/cocktails" className="hover:text-accent">Cocktail</Link>
        <span className="opacity-40">/</span>
        <Link href={`/cocktails?cat=${encodeURIComponent(c.cat)}`} className="hover:text-accent">{c.cat}</Link>
        <span className="opacity-40">/</span>
        <span className="text-text">{c.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        {/* ── Art ── */}
        <div className="mx-auto w-full max-w-[520px] lg:sticky lg:top-24 lg:max-w-none lg:self-start">
          <div className="relative">
            <CocktailArt cocktail={c} className="aspect-[4/5] w-full rounded-[28px] border border-line/10" />
            <FavButton id={c.id} className="absolute right-4 top-4 h-11 w-11" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {([
              ['ABV', c.abv > 0 ? `${c.abv}%` : '0%'],
              ['Kcal', `~${c.cal}`],
              ['Tempo', `${c.time}′`],
              ['Livello', DIFF_LABEL[c.diff]],
            ] as const).map(([k, v]) => (
              <div key={k} className="card px-3 py-3 text-center">
                <div className="stat-label">{k}</div>
                <div className="mt-1 font-display text-xl">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recipe ── */}
        <div>
          <div className="eyebrow">{c.origin} · {c.year}</div>
          <h1 className="mt-3 font-display text-[clamp(44px,6vw,76px)] font-light leading-[0.95] tracking-[-0.02em]">{c.name}</h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">{c.desc}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="chip" data-active="true"><Icon name="glass" size={14} /> {gDef.name}</span>
            <span className="chip"><Icon name={techniqueOf(c) === 'shake' ? 'shake' : 'stir'} size={14} /> {TECH_LABEL[techniqueOf(c)]}</span>
            {c.tags.slice(0, 4).map(t => <span key={t} className="chip capitalize">{t}</span>)}
          </div>

          {/* Ingredients */}
          <section className="card mt-9 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl">Ingredienti</h2>
              <div className="flex items-center gap-1.5">
                {SERVES.map(n => (
                  <button key={n} onClick={() => setServes(n)} data-active={serves === n} className="chip px-2.5 py-1 text-xs">×{n}</button>
                ))}
                <span className="mx-1 h-4 w-px bg-line/15" />
                <button onClick={() => setUnit(unit === 'ml' ? 'oz' : 'ml')} className="chip px-2.5 py-1 text-xs">{unit === 'ml' ? 'ml → oz' : 'oz → ml'}</button>
              </div>
            </div>
            <ul className="mt-4 divide-y divide-line/[0.07]">
              {c.ings.map((ing, i) => {
                const p = findIngredient(ing.name);
                const have = p && cabinet.has(p.id);
                return (
                  <li key={i} className="flex items-center gap-3 py-3">
                    <span className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-white/20" style={{ background: ing.color }} />
                    <span className="flex-1 text-[15px]">{canon(ing.name)}</span>
                    {have && <span className="text-[11px] font-medium uppercase tracking-wider text-accent/80">nel tuo bar</span>}
                    <span className="w-20 text-right font-display text-lg tabular-nums">{fmt(ing.amount)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-accent/[0.07] px-4 py-3 text-sm">
              <span className="text-muted">Guarnizione</span>
              <span className="ml-auto text-right">{c.garnish}</span>
            </div>
            <p className="mt-3 text-xs text-muted">Nel tuo bar hai {owned} ingredienti su {c.ings.length}. <Link href="/cabinet" className="text-accent hover:underline">Aggiorna il bar</Link></p>
          </section>

          {/* Method */}
          <section className="mt-9">
            <h2 className="font-display text-2xl">Preparazione</h2>
            <ol className="mt-4 grid gap-3">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/40 font-display text-accent">{i + 1}</span>
                  <p className="pt-1 text-[15px] leading-relaxed text-text/90">{s}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={`/simulator?c=${slugifyName(c.name)}`} className="btn-primary px-6 py-3"><Icon name="flask" size={17} /> Preparalo nel Lab</Link>
            <button onClick={share} className="btn-ghost px-6 py-3"><Icon name="share" size={16} /> {copied ? 'Link copiato' : 'Condividi'}</button>
          </div>

          <section className="mt-9 border-t border-line/[0.07] pt-6">
            <div className="stat-label mb-3">La tua valutazione</div>
            <RatingStars id={c.id} size={26} />
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <div className="eyebrow">Potrebbe piacerti</div>
          <h2 className="mt-2 font-display text-4xl">Della stessa famiglia</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map(r => <CocktailCard key={r.id} cocktail={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
