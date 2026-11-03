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
import { GLASSES } from '@/lib/data';
import type { Cocktail } from '@/lib/data';
import { parseColor } from '@/lib/mix';
import { artLayers } from '@/lib/art';

interface Props {
  cocktail:   Cocktail;
  className?: string;
  /** Rounded tinted backdrop behind the glass */
  backdrop?:  boolean;
}

function CocktailArtImpl({ cocktail: c, className = '', backdrop = true }: Props) {
  const { layers, ice, fizzy, rim, foam } = useMemo(() => artLayers(c), [c]);
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
        garnish={foam ? `${c.garnish} + schiuma` : c.garnish}
        title={c.name}
        tone="dark"
        className="absolute inset-x-0 bottom-[6%] mx-auto h-[86%] w-full"
      />
    </div>
  );
}

export const CocktailArt = memo(CocktailArtImpl);
