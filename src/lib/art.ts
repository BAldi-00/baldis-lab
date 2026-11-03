// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — How a recipe looks in the glass
// src/lib/art.ts
//
// Pure function (server- and client-safe): liquid layers, ice, carbonation
// and rim crust for a recipe, read from its ingredients and method text.
// Used by the cocktail illustrations and by the simulator's guided mode.
// ─────────────────────────────────────────────────────────────────────────────

import type { IceKind, GlassLayer } from '@/components/glass/Glass';
import { SHAPES } from './glass';
import type { Cocktail } from './data';
import { blendColors, physics, techniqueOf, servedIce, DILUTION } from './mix';

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
  // A single big rock is for stirred, spirit-forward drinks (Old Fashioned,
  // Negroni) or when the recipe asks for it; built and shaken drinks in the
  // same tumbler (Americano, sours) go on ordinary cubes.
  const bigRock = tech === 'stir' || /(grande|grosso) cubo|cubo (grande|grosso)|blocco/i.test(c.method);
  const shapeIce = shape.ice === 'rock' && !bigRock ? 'cubes'
    : ({ rock: 'rock', cubes: 'cubes', tall: 'stick', none: 'cubes' } as const)[shape.ice];
  // Stemmed "up" glasses only get ice when the recipe builds the drink in them:
  // "mescola su ghiaccio" for a Manhattan means the mixing glass.
  const servedUp = shape.ice === 'none' && (tech === 'stir' || tech === 'shake');
  const ice: IceKind =
    tech === 'blend' || served === 'crushed' ? 'crushed'
    : servedUp ? null
    : served === 'yes' || (served !== 'no' && ['oldfashioned', 'highball', 'collins', 'hurricane'].includes(c.glass)) ? shapeIce
    : null;
  // Egg white shaken into a sour leaves a white foam cap
  const foam = c.ings.some(i => /albume/i.test(i.name));
  const rim = g.includes('sale') ? 'salt' as const : (g.includes('zucchero') && g.includes('bordo')) ? 'sugar' as const : null;

  return { layers, ice, fizzy, rim, foam };
}
