// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Glass renderer
// src/components/glass/Glass.tsx
//
// A single SVG that draws any glass with liquid layers, ice, garnish, rim,
// straw, pour stream and bubbles. Pure render: no timers, no rAF loop — all
// motion is CSS keyframes, so an idle glass costs nothing.
//
// Glass edges and reflections come from CSS tokens (globals.css → GLASS
// TOKENS): light edges on dark backgrounds, dark edges in the day theme, so
// an empty glass is always visible. `tone="dark"` forces the night look for
// art that sits on its own dark backdrop.
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { memo, useId } from 'react';
import type { GlassId } from '@/lib/data';
import {
  SHAPES, CX, bowlPath, outlinePaths, sidePath, radiusAt, levelY, rimY, rimR, bottomY, standOn,
} from '@/lib/glass';
import { parseColor, rgba } from '@/lib/mix';
import { GarnishInside, GarnishOutside, parseGarnish } from './Garnish';
import type { GarnishKind } from './Garnish';

export type IceKind = 'cubes' | 'rock' | 'sphere' | 'crushed' | 'stick' | null;
export type RimKind = 'salt' | 'sugar' | null;

export interface GlassLayer { color: string; amount: number; }

export interface GlassProps {
  glass:     GlassId;
  layers:    GlassLayer[];         // bottom → top
  capacity:  number;               // ml at the brim
  ice?:      IceKind;
  garnish?:  string | null;
  rim?:      RimKind;
  straw?:    boolean;
  fizzy?:    boolean;
  pour?:     string | null;        // colour of the stream being poured
  mixing?:   'shake' | 'stir' | null;
  tone?:     'auto' | 'dark';
  className?: string;
  title?:    string;
}

/**
 * ml of liquid displaced by the ice, as a share of the glass: a glass filled
 * with cubes is ~40% ice, one big rock or sphere ~30%, a Collins spear ~25%.
 * Shared by the simulator and the recipe art, so the same drink sits at the
 * same level everywhere.
 */
export function iceDisplacement(ice: IceKind, capacity: number): number {
  if (!ice) return 0;
  return capacity * { cubes: 0.4, rock: 0.3, sphere: 0.3, crushed: 0.35, stick: 0.25 }[ice];
}

// Frame each glass tightly: leave ~36 units above the rim for garnishes,
// so short glasses (rocks, shot) are drawn as large as tall ones.
const viewBoxFor = (rim: number) => {
  const y = Math.max(-30, rim - 36);
  return `-14 ${y} 128 ${136 - y}`;
};

// Deterministic pseudo-random, so cards render identically on server and client
// (rounded: Math.sin may differ in the last bit between Node and the browser)
const rand = (i: number) => {
  const x = (Math.round(Math.sin(i * 127.1 + 311.7) * 1e6) / 1e6) * 43758.5453;
  return Math.round((x - Math.floor(x)) * 1e6) / 1e6;
};

interface IceBlock { x: number; y: number; w: number; h: number; rot: number; clear?: boolean }

/**
 * A block of ice seen slightly from above: front face, top face and right
 * side, with glints along the edges. `clear` blocks (big rocks, spears) are
 * cut from clear ice; small freezer cubes have a cloudy core.
 * (x, y) is the top-left of the bounding box, which is (w + d) × (h + k).
 */
function Ice({ x, y, w, h, rot, clear }: IceBlock) {
  const d = Math.min(w, h) * 0.3, k = d * 0.55;
  const fy = y + k;                                   // top of the front face
  const cx = x + (w + d) / 2, cy = y + (h + k) / 2;
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`} strokeLinejoin="round">
      <path d={`M${x} ${fy} L${x + d} ${y} L${x + w + d} ${y} L${x + w + d} ${y + h} L${x + w} ${fy + h} L${x} ${fy + h} Z`}
        fill="rgba(225,240,255,.16)" stroke="none" />
      <path d={`M${x} ${fy} L${x + d} ${y} L${x + w + d} ${y} L${x + w} ${fy} Z`} fill="rgba(255,255,255,.4)" stroke="none" />
      <path d={`M${x + w} ${fy} L${x + w + d} ${y} L${x + w + d} ${y + h} L${x + w} ${fy + h} Z`} fill="rgba(190,215,240,.14)" stroke="none" />
      {!clear && <rect x={x + w * 0.22} y={fy + h * 0.22} width={w * 0.56} height={h * 0.56} rx={Math.min(w, h) * 0.2} fill="rgba(255,255,255,.16)" stroke="none" />}
      <path d={`M${x} ${fy} L${x + w} ${fy} L${x + w} ${fy + h}`} fill="none" stroke="rgba(255,255,255,.75)" strokeWidth={0.45} />
      <path d={`M${x + 1} ${fy + h * 0.18} L${x + 1} ${fy + h * 0.5}`} stroke="rgba(255,255,255,.9)" strokeWidth={0.9} strokeLinecap="round" />
      <path d={`M${x + d * 0.6 + w * 0.15} ${y + k * 0.45} L${x + d * 0.6 + w * 0.5} ${y + k * 0.45}`} stroke="#fff" strokeWidth={0.7} strokeLinecap="round" />
      {/* outline last, so it sits over the faces */}
      <path d={`M${x} ${fy} L${x + d} ${y} L${x + w + d} ${y} L${x + w + d} ${y + h} L${x + w} ${fy + h} L${x} ${fy + h} Z`} fill="none" />
    </g>
  );
}

const bodyStop = (offset: string, k: number) => (
  <stop offset={offset} className="g-stop" style={{ stopOpacity: `calc(var(--g-body-a) * ${k})` }} />
);

function GlassImpl({
  glass, layers, capacity, ice = null, garnish = null, rim = null,
  straw = false, fizzy = false, pour = null, mixing = null, tone = 'auto', className = '', title,
}: GlassProps) {
  const uid = useId().replace(/:/g, '');
  const s = SHAPES[glass] ?? SHAPES.oldfashioned;
  const top = rimY(s), bot = bottomY(s), rr = rimR(s);
  const bowl = bowlPath(s);
  const outline = outlinePaths(s);

  const liquid = layers.reduce((a, l) => a + l.amount, 0);
  const disp = liquid > 0 ? iceDisplacement(ice, capacity) : 0;
  const totalFrac = Math.min(1, (liquid + disp) / capacity);
  const surface = liquid > 0 ? levelY(s, totalFrac) : bot;
  const surfR = radiusAt(s, surface);

  // Layer boundaries → gradient stops (offset 0 = bottom, 1 = rim)
  const span = bot - top;
  const stops: { o: number; c: string }[] = [];
  let acc = 0;
  layers.forEach(l => {
    const y0 = levelY(s, ((acc / liquid) * (liquid + disp)) / capacity);
    acc += l.amount;
    const y1 = levelY(s, ((acc / liquid) * (liquid + disp)) / capacity);
    const o0 = (bot - y0) / span, o1 = (bot - y1) / span;
    const soft = Math.min(0.02, (o1 - o0) / 3);
    stops.push({ o: o0 + soft, c: l.color }, { o: o1 - soft, c: l.color });
  });
  const topColor = layers.length ? parseColor(layers[layers.length - 1].color) : null;

  // The rim prop (simulator toggle) wins over a crust named in the garnish text
  const kinds: GarnishKind[] = parseGarnish(garnish).filter(k => !rim || (k !== 'salt' && k !== 'sugar'));
  if (rim) kinds.push(rim);
  const gctx = { s, uid, surface, surfR, liquid };

  // Ice geometry. Ice floats: the top of the stack pokes out of the liquid,
  // and the rest is packed down to the bottom of the glass.
  const iceTop = liquid > 0 ? surface : bot - 18;
  const r0 = radiusAt(s, (iceTop + bot) / 2);
  const blocks: IceBlock[] = [];
  if (ice === 'rock') {
    // one big clear cube: floats if there is enough liquid, else rests on the bottom
    const w = Math.min(r0 * 1.1, 30), h = w;
    const full = h + h * 0.3 * 0.55;
    blocks.push({ x: CX - (w + w * 0.3) / 2, y: Math.min(iceTop - full * 0.2, bot - full + 1), w, h, rot: -3, clear: true });
  } else if (ice === 'cubes') {
    const w = Math.max(8, Math.min(14, r0 * 0.62));
    const bw = w * 1.3, bh = w * 1.165;            // bounding box of one cube
    for (let row = 0, y = iceTop - bh * 0.3; row < 8; row++, y += bh * 0.84) {
      const yy = Math.min(y, bot - bh + 1.5);
      const rr = radiusAt(s, yy + bh * 0.6);
      if (rr < w * 0.55 || (row > 0 && y > bot - bh * 0.55)) break;
      const cols = Math.max(1, Math.min(3, Math.floor((rr * 1.9) / bw)));
      const x0 = CX - (cols * bw) / 2 + (row % 2 ? 1 : -1) * w * 0.15;
      for (let c = 0; c < cols; c++) {
        const i = row * 3 + c;
        blocks.push({ x: x0 + c * bw + (rand(i) - 0.5) * 2, y: yy + (rand(i + 20) - 0.5) * 2.5, w, h: w, rot: (rand(i + 50) - 0.5) * 22 });
      }
      if (yy < y) break;                            // reached the bottom
    }
    blocks.reverse();                               // draw the deepest first
  } else if (ice === 'stick') {
    // Collins spear: one long clear column from just above the surface to the bottom
    const w = r0 * 0.85;
    blocks.push({ x: CX - (w * 1.3) / 2, y: iceTop - 6, w, h: Math.max(10, bot - iceTop + 4), rot: 0, clear: true });
  }

  const bubbles = fizzy && liquid > 0 ? Array.from({ length: 10 }, (_, i) => ({
    x: CX + (rand(i) - 0.5) * radiusAt(s, bot - 4) * 1.4,
    y: bot - 3 - rand(i + 9) * 8,
    r: 0.5 + rand(i + 3) * 0.8,
    dur: 2.2 + rand(i + 5) * 2.4,
    delay: -rand(i + 7) * 4,
  })) : [];

  const stand = standOn(s);
  const footY = stand.y;
  const shadowR = stand.r * 1.25;

  return (
    <svg viewBox={viewBoxFor(top)} className={`${tone === 'dark' ? 'glass-dark' : 'glass-auto'} ${className}`} role="img" aria-label={title ?? 'Bicchiere'}>
      <defs>
        <clipPath id={`b${uid}`}><path d={bowl} /></clipPath>
        <clipPath id={`o${uid}`}><path d={outline.fill} /></clipPath>
        <clipPath id={`pb${uid}`}><rect x={0} y={bot - 14} width={100} height={16} /></clipPath>
        <clipPath id={`l${uid}`}><rect x={0} y={surface} width={100} height={bot - surface + 2} /></clipPath>
        <linearGradient id={`liq${uid}`} gradientUnits="userSpaceOnUse" x1="0" y1={bot} x2="0" y2={top}>
          {stops.length ? stops.map((st, i) => (
            <stop key={i} offset={Math.max(0, Math.min(1, st.o))} stopColor={st.c} />
          )) : <stop offset="0" stopColor="transparent" />}
        </linearGradient>
        <linearGradient id={`sh${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0"    stopColor="#000" stopOpacity=".38" />
          <stop offset=".22"  stopColor="#000" stopOpacity=".05" />
          <stop offset=".38"  stopColor="#fff" stopOpacity=".16" />
          <stop offset=".62"  stopColor="#000" stopOpacity="0" />
          <stop offset="1"    stopColor="#000" stopOpacity=".4" />
        </linearGradient>
        <linearGradient id={`gb${uid}`} x1="0" y1="0" x2="1" y2="0">
          {bodyStop('0', 1)}{bodyStop('.25', 0.2)}{bodyStop('.8', 0.15)}{bodyStop('1', 0.8)}
        </linearGradient>
        <radialGradient id={`ice${uid}`} cx=".38" cy=".34" r=".7">
          <stop offset="0"   stopColor="#fff" stopOpacity=".45" />
          <stop offset=".6"  stopColor="#e6f2ff" stopOpacity=".18" />
          <stop offset="1"   stopColor="#cfe3f7" stopOpacity=".3" />
        </radialGradient>
        <radialGradient id={`sd${uid}`}>
          <stop offset="0" className="g-shadow" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Floor shadow */}
      <ellipse cx={CX} cy={footY + 3} rx={shadowR} ry={shadowR * 0.16} fill={`url(#sd${uid})`} />

      <g className={mixing === 'shake' ? 'anim-shake' : undefined}>
        {/* Straw behind the liquid so it reads as submerged */}
        {straw && (
          <g strokeLinecap="round">
            <line x1={CX + rr * 0.35} y1={top - 26} x2={CX - radiusAt(s, bot) * 0.35} y2={bot - 3} stroke="#d64045" strokeWidth={3.4} />
            <line x1={CX + rr * 0.35} y1={top - 26} x2={CX - radiusAt(s, bot) * 0.35} y2={bot - 3} stroke="#fff" strokeWidth={3.4} strokeDasharray="3 3" opacity={0.85} />
          </g>
        )}

        {/* Liquid */}
        {liquid > 0 && (
          <g clipPath={`url(#b${uid})`}>
            <rect x={0} y={surface} width={100} height={bot - surface + 2} fill={`url(#liq${uid})`} style={{ transition: 'y .25s ease, height .25s ease' }} />
            <rect x={CX - rr - 2} y={surface} width={rr * 2 + 4} height={bot - surface + 2} fill={`url(#sh${uid})`} />
            {bubbles.length > 0 && (
              <g clipPath={`url(#l${uid})`}>
                {bubbles.map((b, i) => (
                  <circle key={i} className="bubble" cx={b.x} cy={b.y} r={b.r} fill="rgba(255,255,255,.75)"
                    style={{ animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }} />
                ))}
              </g>
            )}
          </g>
        )}

        {/* Ice */}
        {ice && (
          <g clipPath={`url(#b${uid})`} className="g-ice" strokeWidth={0.6}>
            {blocks.map((b, i) => <Ice key={i} {...b} />)}
            {ice === 'sphere' && (() => {
              const R = Math.min(r0 * 0.8, 17);
              const cy = Math.min(iceTop - R * 0.4 + R, bot - R - 1);
              return (
                <g>
                  <circle cx={CX} cy={cy} r={R} fill={`url(#ice${uid})`} />
                  <path d={`M${CX - R * 0.2} ${cy + R * 0.85} A${R * 0.9} ${R * 0.9} 0 0 0 ${CX + R * 0.85} ${cy + R * 0.15}`} fill="none" stroke="rgba(255,255,255,.6)" strokeWidth={0.8} strokeLinecap="round" />
                  <ellipse cx={CX - R * 0.38} cy={cy - R * 0.42} rx={R * 0.3} ry={R * 0.15} fill="rgba(255,255,255,.7)" stroke="none" transform={`rotate(-35 ${CX - R * 0.38} ${cy - R * 0.42})`} />
                </g>
              );
            })()}
            {ice === 'crushed' && (() => {
              // irregular shards through the whole drink, heaped a little above the surface
              const top = iceTop - 4, h = Math.max(6, bot - top - 2);
              const n = Math.max(18, Math.min(90, Math.round((h * radiusAt(s, top + h / 2)) / 9)));
              return Array.from({ length: n }, (_, i) => {
                const yy = top + rand(i) * h;
                const x = CX + (rand(i + 40) - 0.5) * 1.8 * radiusAt(s, yy);
                const sz = 2.4 + rand(i + 80) * 3;
                const pts = Array.from({ length: 5 }, (_, j) => {
                  const a = (j / 5) * Math.PI * 2 + rand(i * 7 + j) * 0.9;
                  const r = sz * (0.6 + rand(i * 11 + j) * 0.5);
                  return `${(x + Math.cos(a) * r).toFixed(2)},${(yy + Math.sin(a) * r * 0.85).toFixed(2)}`;
                }).join(' ');
                return (
                  <g key={i}>
                    <polygon points={pts} fill={i % 3 ? 'rgba(235,245,255,.26)' : 'rgba(255,255,255,.42)'} strokeWidth={0.4} strokeLinejoin="round" />
                    {i % 4 === 0 && <circle cx={x - sz * 0.3} cy={yy - sz * 0.3} r={0.5} fill="#fff" stroke="none" />}
                  </g>
                );
              });
            })()}
          </g>
        )}

        {/* Surface meniscus */}
        {liquid > 0 && topColor && (
          <ellipse cx={CX} cy={surface} rx={surfR} ry={Math.max(0.8, surfR * 0.09)} className="g-edge" strokeWidth={0.35}
            fill={rgba({ r: Math.min(255, topColor.r + 40), g: Math.min(255, topColor.g + 40), b: Math.min(255, topColor.b + 40), a: Math.min(1, topColor.a + 0.1) })} />
        )}

        {/* Floating garnishes (crema + coffee beans, muddled mint) */}
        <g clipPath={`url(#b${uid})`}><GarnishInside kinds={kinds} ctx={gctx} /></g>

        {/* Bar spoon while stirring */}
        {mixing === 'stir' && (
          <g className="anim-stir">
            <line x1={CX + 4} y1={top - 30} x2={CX} y2={bot - 4} stroke="#b9b3aa" strokeWidth={1.6} strokeLinecap="round" />
            <circle cx={CX + 4} cy={top - 30} r={2} fill="#b9b3aa" />
          </g>
        )}

        {/* Glass body: filled outline + open stroke (no line across the rim) */}
        <path d={outline.fill} fill={`url(#gb${uid})`} />
        {s.tumbler && s.base && (
          <g>
            {/* thick glass bottom, inside the same outer wall */}
            <rect x={0} y={bot} width={100} height={s.base.bottom - bot + 1} className="g-solid" strokeWidth={0} clipPath={`url(#o${uid})`} />
            <path d={`M${CX - radiusAt(s, bot) + 0.5} ${bot - 0.6} Q${CX} ${bot + 1.6} ${CX + radiusAt(s, bot) - 0.5} ${bot - 0.6}`}
              fill="none" className="g-edge" strokeWidth={0.6} opacity={0.7} />
          </g>
        )}
        {s.pedestal && (() => {
          const foot = s.pedestal[s.pedestal.length - 3];   // top corner of the foot
          return (
            <g>
              {/* solid glass: everything inside the outline that is not bowl */}
              <path d={`${outline.fill} ${bowl}`} fillRule="evenodd" className="g-solid" strokeWidth={0} />
              <path d={bowl} fill="none" className="g-edge" strokeWidth={0.6} opacity={0.7} clipPath={`url(#pb${uid})`} />
              <path d={`M${CX - foot[1]} ${foot[0]} A${foot[1]} ${foot[1] * 0.12} 0 0 0 ${CX + foot[1]} ${foot[0]}`}
                fill="none" className="g-edge" strokeWidth={0.6} opacity={0.6} />
              <path d={`M${CX - 8} ${bot + 4} Q${CX - 9.5} ${bot + 9} ${CX - 8.5} ${bot + 12}`} fill="none" className="g-hi" strokeWidth={1} strokeLinecap="round" opacity={0.6} />
            </g>
          );
        })()}
        <path d={outline.stroke} fill="none" className="g-edge" strokeWidth={0.9} strokeLinejoin="round" />
        <path clipPath={`url(#b${uid})`} d={sidePath(s, -1)} fill="none" className="g-hi" strokeWidth={1.5} strokeLinecap="round" opacity={0.75} />
        <path clipPath={`url(#b${uid})`} d={sidePath(s, 1, 4)} fill="none" className="g-hi" strokeWidth={0.7} strokeLinecap="round" opacity={0.5} />
        <ellipse cx={CX} cy={top} rx={rr} ry={Math.max(1.2, rr * 0.09)} fill="none" className="g-edge" strokeWidth={0.9} />

        {s.stem && (
          <rect x={CX - s.stem.w / 2} y={s.stem.top} width={s.stem.w} height={s.stem.bottom - s.stem.top} rx={s.stem.w / 2}
            className="g-solid" strokeWidth={0.5} />
        )}
        {s.foot && (
          <ellipse cx={CX} cy={s.foot.y} rx={s.foot.r} ry={s.foot.r * 0.13} className="g-solid" strokeWidth={0.8} />
        )}

        {/* Rim garnishes: wheels, twists, sprigs, picks, crusts */}
        <GarnishOutside kinds={kinds} ctx={gctx} />

        {/* Pour stream */}
        {pour && (
          <g>
            <rect className="pour-stream" x={CX - 1.6} y={-34} width={3.2} height={surface + 34} rx={1.6} fill={pour} />
            <ellipse className="pour-ripple" cx={CX} cy={surface} rx={6} ry={1.4} fill="none" stroke="rgba(255,255,255,.7)" strokeWidth={0.6} />
          </g>
        )}
      </g>
    </svg>
  );
}

export const Glass = memo(GlassImpl);
