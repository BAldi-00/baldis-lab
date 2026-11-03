// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Cocktail Components
// src/components/cocktail/CocktailCard.tsx  (CocktailCard · FavButton · RatingStars)
//
// Cards link to the statically generated /cocktails/[slug] pages: no modal
// state, prefetched on hover, shareable URLs.
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import { CocktailArt } from './CocktailArt';
import { Icon }        from '@/components/ui/Icon';
import { useApp }      from '@/context/AppContext';
import { cocktailHref } from '@/lib/data';
import type { Cocktail } from '@/lib/data';
import { DIFF_LABEL }  from '@/lib/utils';

// ── FAVORITE BUTTON ───────────────────────────────────────────────────────────

export function FavButton({ id, className = '' }: { id: number; className?: string }) {
  const { favorites, toggleFav } = useApp();
  const on = favorites.has(id);
  return (
    <button
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFav(id); }}
      aria-label={on ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
      aria-pressed={on}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors active:scale-90 ${on ? 'border-accent/50 bg-accent text-on-accent' : 'border-white/15 bg-black/35 text-white/85 hover:text-white'} ${className}`}
    >
      <Icon name="heart" size={16} fill={on} />
    </button>
  );
}

// ── RATING STARS ──────────────────────────────────────────────────────────────

export function RatingStars({ id, size = 22 }: { id: number; size?: number }) {
  const { ratings, rateCocktail } = useApp();
  const [hover, setHover] = useState(0);
  const current = ratings[id] ?? 0;
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} onMouseEnter={() => setHover(s)} onClick={() => rateCocktail(id, s === current ? 0 : s)}
          aria-label={`${s} stelle`}
          className={`transition-transform hover:scale-110 ${(hover || current) >= s ? 'text-accent' : 'text-line/20'}`}>
          <Icon name="star" size={size} fill={(hover || current) >= s} />
        </button>
      ))}
      {current > 0 && <span className="ml-2 text-sm text-muted">{current}/5</span>}
    </div>
  );
}

// ── COCKTAIL CARD ─────────────────────────────────────────────────────────────

function CocktailCardImpl({ cocktail: c, priority = false }: { cocktail: Cocktail; priority?: boolean }) {
  return (
    <Link href={cocktailHref(c)} className={`group card card-hover block overflow-hidden ${priority ? '' : 'cv-auto'}`}>
      <div className="relative">
        <CocktailArt cocktail={c} className="aspect-[4/4.2] w-full transition-transform duration-500 group-hover:scale-[1.03]" />
        <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
          {c.cat}
        </span>
        <FavButton id={c.id} className="absolute right-3 top-3" />
      </div>
      <div className="p-4 pt-3.5">
        <h3 className="font-display text-[22px] leading-tight text-text">{c.name}</h3>
        <p className="mt-1 line-clamp-1 text-[13px] text-muted">{c.ings.map(i => i.name).join(' · ')}</p>
        <div className="mt-3 flex items-center gap-2 whitespace-nowrap text-[12px] text-muted sm:gap-3">
          <span className="font-semibold text-accent">{c.abv > 0 ? `${c.abv}%` : '0%'}</span>
          <span className="h-1 w-1 rounded-full bg-line/20" />
          <span>{c.time} min</span>
          <span className="hidden h-1 w-1 rounded-full bg-line/20 sm:block" />
          <span className="hidden sm:inline">{DIFF_LABEL[c.diff]}</span>
        </div>
      </div>
    </Link>
  );
}

export const CocktailCard = memo(CocktailCardImpl);

// ── COMPACT ROW (lists, sidebars) ─────────────────────────────────────────────

export function CocktailRow({ cocktail: c, note }: { cocktail: Cocktail; note?: React.ReactNode }) {
  return (
    <Link href={cocktailHref(c)} className="group flex items-center gap-3 rounded-2xl border border-line/[0.07] bg-surface/50 p-2 pr-4 transition-colors hover:border-accent/40">
      <CocktailArt cocktail={c} className="h-16 w-14 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-lg leading-tight">{c.name}</div>
        <div className="truncate text-xs text-muted">{note ?? `${c.cat} · ${c.abv}%`}</div>
      </div>
      <Icon name="arrow" size={16} className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
    </Link>
  );
}
