// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Glass geometry
// src/lib/glass.ts
//
// Each glass is a solid of revolution described by its inner profile:
// [y, radius] pairs from the rim down to the bottom of the bowl, in a
// 100×130 SVG space. From that profile we can draw the glass AND compute the
// real liquid level for a given volume (a V-shaped martini glass is half
// full by volume at ~80% of its height; a tumbler fills linearly).
// ─────────────────────────────────────────────────────────────────────────────

import type { GlassId } from './data';

export const VIEW_W = 100;
export const VIEW_H = 130;
export const CX = 50;

export interface GlassShape {
  profile: [number, number][];      // [y, r] rim → bottom (inner bowl)
  base?:   { top: number; bottom: number; r: number };   // solid glass base (tumblers)
  stem?:   { top: number; bottom: number; w: number };
  foot?:   { y: number; r: number };
  ice:     'rock' | 'cubes' | 'tall' | 'none';            // default ice look
  tumbler?: boolean;   // straight outer wall running down to a thick glass bottom
  /** Outer silhouette [y, r] below the bowl, down to the bottom of a solid
   *  glass base (Glencairn): bowl → short solid neck → flared foot. */
  pedestal?: [number, number][];
}

export const SHAPES: Record<GlassId, GlassShape> = {
  oldfashioned: {
    profile: [[44, 33], [100, 30], [104, 29]],
    base: { top: 104, bottom: 114, r: 30 },
    ice: 'rock',
    tumbler: true,
  },
  highball: {
    profile: [[12, 23], [108, 21], [111, 20]],
    base: { top: 111, bottom: 118, r: 21 },
    ice: 'cubes',
    tumbler: true,
  },
  collins: {
    profile: [[6, 19], [111, 18], [113, 17]],
    base: { top: 113, bottom: 119, r: 18 },
    ice: 'tall',
    tumbler: true,
  },
  shot: {
    profile: [[66, 18], [106, 14], [108, 13]],
    base: { top: 108, bottom: 118, r: 14 },
    ice: 'none',
    tumbler: true,
  },
  martini: {
    profile: [[30, 43], [76, 2.5], [78, 0.5]],
    stem: { top: 78, bottom: 120, w: 2.4 },
    foot: { y: 121, r: 26 },
    ice: 'none',
  },
  coupe: {
    profile: [[46, 40], [50, 39.6], [56, 37], [62, 32], [67, 24], [71, 13], [73, 2]],
    stem: { top: 73, bottom: 120, w: 2.4 },
    foot: { y: 121, r: 25 },
    ice: 'none',
  },
  margarita: {
    profile: [[30, 45], [36, 42], [43, 32], [49, 20], [53, 13], [58, 11], [64, 10], [69, 7], [72, 2]],
    stem: { top: 72, bottom: 120, w: 2.6 },
    foot: { y: 121, r: 26 },
    ice: 'none',
  },
  wine: {
    profile: [[24, 26], [32, 30], [44, 33], [56, 31.5], [66, 26], [74, 15], [78, 2]],
    stem: { top: 78, bottom: 120, w: 2.2 },
    foot: { y: 121, r: 24 },
    ice: 'cubes',
  },
  flute: {
    profile: [[8, 13], [30, 14.5], [50, 14], [64, 11.5], [74, 6], [78, 1.5]],
    stem: { top: 78, bottom: 120, w: 2 },
    foot: { y: 121, r: 19 },
    ice: 'none',
  },
  hurricane: {
    profile: [[10, 25], [22, 21], [34, 16.5], [46, 17.5], [60, 24], [72, 25.5], [84, 21], [92, 12], [96, 2]],
    stem: { top: 96, bottom: 112, w: 4 },
    foot: { y: 114, r: 22 },
    ice: 'cubes',
  },
  // Glencairn (114 mm tall, 46 mm mouth, ~65 mm belly, 52 mm foot): a tulip
  // bowl that tapers into a near-vertical chimney with a slight flare at the
  // lip, sitting on a solid glass neck and a thick round foot.
  whisky: {
    profile: [[30, 18.2], [33, 17.4], [38, 17], [44, 17.6], [52, 19.8], [62, 22.8], [72, 24.7], [80, 25], [87, 23.6], [92, 20], [95.5, 14], [97.5, 6], [98, 1]],
    pedestal: [[92, 20.5], [95.5, 16.8], [99, 13.4], [102, 11.4], [105, 11], [108, 12.6], [111, 16.5], [113, 20.5], [114.5, 21.6], [119.5, 21.6], [121, 20.6]],
    ice: 'none',
  },
};

// ── PATHS ─────────────────────────────────────────────────────────────────────

const f = (n: number) => Math.round(n * 100) / 100;

/** Smooth polyline: straight to the first midpoint, quadratic through every corner. */
function smooth(pts: [number, number][]): string {
  if (pts.length < 3) return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)},${f(y)}`).join(' ');
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    d += ` Q${f(x)},${f(y)} ${f((x + nx) / 2)},${f((y + ny) / 2)}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return d + ` L${f(lx)},${f(ly)}`;
}

/** Closed bowl outline (used as liquid clip and glass body). */
export function bowlPath(s: GlassShape): string {
  const left  = s.profile.map(([y, r]) => [CX - r, y] as [number, number]);
  const right = [...s.profile].reverse().map(([y, r]) => [CX + r, y] as [number, number]);
  const pts = [...left, ...right];
  return smooth(pts) + ' Z';
}

/**
 * Outline of the glass for drawing (not for the liquid clip):
 * - `stroke` is open at the top, so no line crosses the rim ellipse;
 * - tumblers get a straight outer wall that runs down to the bottom of the
 *   thick glass base, instead of a bowl that tucks in above a separate block.
 */
export function outlinePaths(s: GlassShape): { fill: string; stroke: string } {
  if (s.tumbler && s.base) {
    const [y0, r0] = s.profile[0], [y1, r1] = s.profile[1];
    const bb = s.base.bottom, c = 3;
    const rb = r0 + ((r1 - r0) * (bb - y0)) / (y1 - y0);      // wall extended to the base
    const rc = r0 + ((r1 - r0) * (bb - c - y0)) / (y1 - y0);
    const d = `M${f(CX - r0)},${f(y0)} L${f(CX - rc)},${f(bb - c)} Q${f(CX - rb)},${f(bb)} ${f(CX - rb + c)},${f(bb)}`
      + ` L${f(CX + rb - c)},${f(bb)} Q${f(CX + rb)},${f(bb)} ${f(CX + rc)},${f(bb - c)} L${f(CX + r0)},${f(y0)}`;
    return { fill: d + ' Z', stroke: d };
  }
  if (s.pedestal) {
    const yb = s.pedestal[s.pedestal.length - 1][0];
    const side = [...s.profile.filter(([y]) => y < s.pedestal![0][0]), ...s.pedestal];
    const left  = side.map(([y, r]) => [CX - r, y] as [number, number]);
    const right = [...side].reverse().map(([y, r]) => [CX + r, y] as [number, number]);
    // the foot's bottom sags a little: it is the near half of an ellipse
    const d = smooth([...left, [CX, yb + 1.4], ...right]);
    return { fill: d + ' Z', stroke: d };
  }
  const bowl = bowlPath(s);
  return { fill: bowl, stroke: bowl.replace(/ Z$/, '') };
}

/** One side of the bowl wall, for the specular highlight stroke. */
export function sidePath(s: GlassShape, side: -1 | 1, inset = 3): string {
  const pts = s.profile
    .slice(0, -1)
    .map(([y, r]) => [CX + side * Math.max(0, r - inset), y + 4] as [number, number]);
  return smooth(pts);
}

// ── VOLUME ────────────────────────────────────────────────────────────────────

/** Inner radius at height y (linear between profile points). */
export function radiusAt(s: GlassShape, y: number): number {
  const p = s.profile;
  if (y <= p[0][0]) return p[0][1];
  for (let i = 0; i < p.length - 1; i++) {
    const [y1, r1] = p[i], [y2, r2] = p[i + 1];
    if (y >= y1 && y <= y2) return r1 + (r2 - r1) * ((y - y1) / (y2 - y1 || 1));
  }
  return p[p.length - 1][1];
}

const tables = new Map<GlassShape, { ys: number[]; vols: number[] }>();

/** Cumulative volume table, bottom → rim, sampled every 0.5 units. */
function table(s: GlassShape) {
  let t = tables.get(s);
  if (t) return t;
  const top = s.profile[0][0];
  const bottom = s.profile[s.profile.length - 1][0];
  const ys: number[] = [bottom], vols: number[] = [0];
  let v = 0;
  for (let y = bottom; y > top; y -= 0.5) {
    const y2 = Math.max(top, y - 0.5);
    const r1 = radiusAt(s, y), r2 = radiusAt(s, y2);
    v += (Math.PI * (y - y2) * (r1 * r1 + r1 * r2 + r2 * r2)) / 3;
    ys.push(y2); vols.push(v);
  }
  t = { ys, vols };
  tables.set(s, t);
  return t;
}

/** Y coordinate of the liquid surface when the bowl is `frac` (0..1) full by volume. */
export function levelY(s: GlassShape, frac: number): number {
  const { ys, vols } = table(s);
  const target = Math.max(0, Math.min(1, frac)) * vols[vols.length - 1];
  for (let i = 1; i < vols.length; i++) {
    if (vols[i] >= target) {
      const k = (target - vols[i - 1]) / (vols[i] - vols[i - 1] || 1);
      return ys[i - 1] + (ys[i] - ys[i - 1]) * k;
    }
  }
  return ys[ys.length - 1];
}

export const rimY    = (s: GlassShape) => s.profile[0][0];
export const bottomY = (s: GlassShape) => s.profile[s.profile.length - 1][0];
export const rimR    = (s: GlassShape) => s.profile[0][1];

/** Where the glass meets the table, and how wide it is there (for the shadow). */
export function standOn(s: GlassShape): { y: number; r: number } {
  if (s.foot) return { y: s.foot.y, r: s.foot.r };
  if (s.pedestal) return { y: s.pedestal[s.pedestal.length - 1][0], r: Math.max(...s.pedestal.map(([, r]) => r)) };
  if (s.base) return { y: s.base.bottom, r: s.base.r };
  return { y: bottomY(s), r: rimR(s) };
}
