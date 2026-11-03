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
  SHAPES, CX, bowlPath, outlinePaths, sidePath, radiusAt, levelY, rimY, rimR, bottomY,
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

/** ml of liquid displaced by each kind of ice (capped for small glasses). */
export function iceDisplacement(ice: IceKind, capacity: number): number {
  const ml = { cubes: 60, rock: 55, sphere: 65, crushed: capacity * 0.35, stick: 45 }[ice ?? 'cubes'];
  return ice ? Math.min(ml, capacity * 0.35) : 0;
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

  // Ice geometry, packed from the surface downwards
  const iceTop = liquid > 0 ? surface - 2 : bot - 18;
  const r0 = radiusAt(s, (iceTop + bot) / 2);
  const cubes: { x: number; y: number; w: number; rot: number }[] = [];
  if (ice === 'cubes' || ice === 'rock') {
    const w = ice === 'rock' ? Math.min(r0 * 1.25, 34) : Math.max(9, Math.min(16, r0 * 0.78));
    const count = ice === 'rock' ? 1 : 5;
    for (let i = 0; i < count; i++) {
      const y = iceTop + i * w * 0.82;
      if (y + w > bot - 1 && i > 0) break;
      const off = ice === 'rock' ? 0 : [-0.38, 0.32, -0.05, 0.4, -0.3][i] * r0;
      cubes.push({ x: CX + off - w / 2, y: Math.min(y, bot - w - 1), w, rot: [-8, 12, -4, 7, -12][i] });
    }
  }

  const bubbles = fizzy && liquid > 0 ? Array.from({ length: 10 }, (_, i) => ({
    x: CX + (rand(i) - 0.5) * radiusAt(s, bot - 4) * 1.4,
    y: bot - 3 - rand(i + 9) * 8,
    r: 0.5 + rand(i + 3) * 0.8,
    dur: 2.2 + rand(i + 5) * 2.4,
    delay: -rand(i + 7) * 4,
  })) : [];

  const footY = s.foot?.y ?? s.base?.bottom ?? bot;
  const shadowR = (s.foot?.r ?? s.base?.r ?? rr) * 1.25;
  const iceFill = 'rgba(230,242,255,.22)';

  return (
    <svg viewBox={viewBoxFor(top)} className={`${tone === 'dark' ? 'glass-dark' : 'glass-auto'} ${className}`} role="img" aria-label={title ?? 'Bicchiere'}>
      <defs>
        <clipPath id={`b${uid}`}><path d={bowl} /></clipPath>
        <clipPath id={`o${uid}`}><path d={outline.fill} /></clipPath>
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
            {cubes.map((c, i) => (
              <g key={i} transform={`rotate(${c.rot} ${c.x + c.w / 2} ${c.y + c.w / 2})`}>
                <rect x={c.x} y={c.y} width={c.w} height={c.w} rx={c.w * 0.14} fill={iceFill} />
                <path d={`M${c.x + c.w * 0.18} ${c.y + c.w * 0.25} L${c.x + c.w * 0.5} ${c.y + c.w * 0.18}`} stroke="rgba(255,255,255,.9)" strokeWidth={0.9} strokeLinecap="round" />
              </g>
            ))}
            {ice === 'sphere' && (() => {
              const R = Math.min(r0 * 0.8, 17);
              const cy = Math.min(iceTop + R * 0.75, bot - R - 1);
              return (
                <g>
                  <circle cx={CX} cy={cy} r={R} fill={iceFill} />
                  <ellipse cx={CX - R * 0.35} cy={cy - R * 0.4} rx={R * 0.3} ry={R * 0.16} fill="rgba(255,255,255,.55)" stroke="none" transform={`rotate(-30 ${CX - R * 0.35} ${cy - R * 0.4})`} />
                </g>
              );
            })()}
            {ice === 'stick' && (
              <rect x={CX - r0 * 0.45} y={iceTop} width={r0 * 0.9} height={Math.max(8, bot - iceTop - 3)} rx={3} fill={iceFill} />
            )}
            {ice === 'crushed' && Array.from({ length: 26 }, (_, i) => {
              const yy = iceTop + rand(i) * Math.max(6, bot - iceTop - 4);
              const rw = radiusAt(s, yy) * 0.9;
              const x = CX + (rand(i + 40) - 0.5) * 2 * rw;
              const w = 3 + rand(i + 80) * 4;
              return <rect key={i} x={x - w / 2} y={yy} width={w} height={w * 0.8} rx={1} fill="rgba(235,245,255,.3)" transform={`rotate(${rand(i + 9) * 90} ${x} ${yy})`} />;
            })}
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
        <path d={outline.stroke} fill="none" className="g-edge" strokeWidth={0.9} strokeLinejoin="round" />
        <path clipPath={`url(#b${uid})`} d={sidePath(s, -1)} fill="none" className="g-hi" strokeWidth={1.5} strokeLinecap="round" opacity={0.75} />
        <path clipPath={`url(#b${uid})`} d={sidePath(s, 1, 4)} fill="none" className="g-hi" strokeWidth={0.7} strokeLinecap="round" opacity={0.5} />
        <ellipse cx={CX} cy={top} rx={rr} ry={Math.max(1.2, rr * 0.09)} fill="none" className="g-edge" strokeWidth={0.9} />

        {s.base && !s.tumbler && (
          <path
            d={`M${CX - s.base.r} ${s.base.top} L${CX + s.base.r} ${s.base.top} L${CX + s.base.r} ${s.base.bottom - 3} Q${CX + s.base.r} ${s.base.bottom} ${CX + s.base.r - 3} ${s.base.bottom} L${CX - s.base.r + 3} ${s.base.bottom} Q${CX - s.base.r} ${s.base.bottom} ${CX - s.base.r} ${s.base.bottom - 3} Z`}
            className="g-solid" strokeWidth={0.8} />
        )}
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
