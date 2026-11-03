// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Cocktail Art
// src/components/cocktail/CocktailArt.tsx
//
// The "photo" of each cocktail, drawn from its recipe: right glass, real
// proportions, mixed or layered by technique, ice and garnish from the
// recipe text, lit on a dark bar top tinted by the drink's colour.
// ~4 KB of SVG per drink instead of a 200 KB photo, crisp at any size.
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { memo, useMemo } from 'react';
import { Glass } from '@/components/glass/Glass';
import type { IceKind, GlassLayer } from '@/components/glass/Glass';
import { SHAPES } from '@/lib/glass';
import { GLASSES } from '@/lib/data';
import type { Cocktail } from '@/lib/data';
import { blendColors, physics, techniqueOf, servedIce, parseColor, DILUTION } from '@/lib/mix';

export function artLayers(c: Cocktail) {
  const tech = techniqueOf(c);
  const fizzy = c.ings.some(i => physics(i.name).fizzy);
  let layers: GlassLayer[];

  if (tech === 'build') {
    // Pouring into the glass mixes spirits, juices and sodas; only heavy
    // syrups (grenadine in a Sunrise) sink and stay as a layer at the bottom.
    const heavy = c.ings.filter(i => physics(i.name).density >= 1.25);
    const rest  = c.ings.filter(i => physics(i.name).density < 1.25);
    layers = [
      ...heavy.map(i => ({ color: i.color, amount: i.amount })),
      ...(rest.length ? [{ color: blendColors(rest), amount: rest.reduce((s, i) => s + i.amount, 0) }] : []),
    ];
  } else {
    const dil = tech === 'blend' ? 0.3 : DILUTION[tech];
    const vol = c.ings.reduce((s, i) => s + i.amount, 0);
    layers = [{
      color: blendColors([...c.ings, { color: 'rgba(235,245,255,0.18)', amount: vol * dil }]),
      amount: vol * (1 + dil),
    }];
  }

  const shape = SHAPES[c.glass] ?? SHAPES.oldfashioned;
  const g = c.garnish.toLowerCase();
  const served = servedIce(c);
  const shapeIce = ({ rock: 'rock', cubes: 'cubes', tall: 'stick', none: 'cubes' } as const)[shape.ice];
  const ice: IceKind =
    tech === 'blend' || served === 'crushed' ? 'crushed'
    : served === 'yes' || (served !== 'no' && ['oldfashioned', 'highball', 'collins'].includes(c.glass)) ? shapeIce
    : null;
  const rim = g.includes('sale') ? 'salt' as const : (g.includes('zucchero') && g.includes('bordo')) ? 'sugar' as const : null;

  return { layers, ice, fizzy, rim };
}

interface Props {
  cocktail:   Cocktail;
  className?: string;
  /** Rounded tinted backdrop behind the glass */
  backdrop?:  boolean;
}

function CocktailArtImpl({ cocktail: c, className = '', backdrop = true }: Props) {
  const { layers, ice, fizzy, rim } = useMemo(() => artLayers(c), [c]);
  const total = layers.reduce((s, l) => s + l.amount, 0);
  const capacity = GLASSES[c.glass]?.capacity ?? 300;
  // Show the drink as served: between 55% and 85% of the glass
  const shown = Math.max(total * 1.15, Math.min(capacity, total / 0.55));
  const tint = parseColor(c.color);
  const t = `${tint.r},${tint.g},${tint.b}`;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={backdrop ? {
        background: `radial-gradient(70% 55% at 50% 58%, rgba(${t},.38), rgba(${t},.06) 60%, transparent 75%),
                     linear-gradient(180deg, #16120f 0%, #0d0b09 74%, #221c17 74.3%, #0b0908 100%)`,
      } : undefined}
    >
      <Glass
        glass={c.glass}
        layers={layers}
        capacity={shown}
        ice={ice}
        fizzy={fizzy}
        rim={rim}
        garnish={c.garnish}
        title={c.name}
        className="absolute inset-x-0 bottom-[6%] mx-auto h-[86%] w-full"
      />
    </div>
  );
}

export const CocktailArt = memo(CocktailArtImpl);
