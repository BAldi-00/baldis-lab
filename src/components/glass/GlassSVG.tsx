// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Glass SVG Components
// src/components/glass/GlassSVG.tsx
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useMemo } from 'react';
import { useAnimVal } from '@/lib/utils';
import type { GlassDef, Cocktail } from '@/lib/data';

// ── TYPES ─────────────────────────────────────────────────────────────────────

export interface LiquidLayer {
  name:   string;
  amount: number;  // ml
  color:  string;  // CSS color
}

export type IceType = 'cubes' | 'crushed' | 'sphere' | 'stick' | null;

interface GlassSVGProps {
  gDef:    GlassDef;
  layers?: LiquidLayer[];
  ice?:    IceType;
  salt?:   boolean;
  pour?:   string | null;   // CSS color of current pour stream
  garnish?: string | null;  // garnish label string
  size?:   number;          // rendered SVG width in px
}

// ── GARNISH RENDERER ──────────────────────────────────────────────────────────

function GarnishSVG({ garnish, gDef }: { garnish: string; gDef: GlassDef }) {
  const pts = gDef.bowlPts.split(' ').map(p => p.split(',').map(Number));
  const rx  = pts[1][0];
  const ry  = pts[1][1];
  const cx  = gDef.cx;
  const g   = garnish.toLowerCase();

  if (g.includes('lime') || g.includes('fetta lime')) return (
    <g>
      <circle cx={rx - 5} cy={ry - 9} r={9}  fill="#4A8E00" opacity={0.9} />
      <circle cx={rx - 5} cy={ry - 9} r={7}  fill="#7DB000" opacity={0.95} />
      {[0,1,2,3,4,5].map(i => (
        <line key={i} x1={rx-5} y1={ry-9}
          x2={rx-5+Math.cos(i*Math.PI/3)*6.5}
          y2={ry-9+Math.sin(i*Math.PI/3)*6.5}
          stroke="#3A7200" strokeWidth={0.5} opacity={0.7}/>
      ))}
    </g>
  );

  if (g.includes('arancia') || g.includes('fetta arancia')) return (
    <g>
      <circle cx={rx - 5} cy={ry - 9} r={9}  fill="#B85000" opacity={0.85} />
      <circle cx={rx - 5} cy={ry - 9} r={7}  fill="#FF8C00" opacity={0.95} />
      {[0,1,2,3,4,5,6].map(i => (
        <line key={i} x1={rx-5} y1={ry-9}
          x2={rx-5+Math.cos(i*Math.PI*2/7)*6.5}
          y2={ry-9+Math.sin(i*Math.PI*2/7)*6.5}
          stroke="#CC5500" strokeWidth={0.5} opacity={0.6}/>
      ))}
    </g>
  );

  if (g.includes('ciliegia')) return (
    <g>
      <path d={`M${cx} ${ry-4} Q${cx+6} ${ry-14} ${cx+2} ${ry-20}`}
        stroke="#2D5A1B" strokeWidth={1.2} fill="none" strokeLinecap="round"/>
      <circle cx={cx+2} cy={ry-20} r={5.5} fill="#8B0000"/>
      <ellipse cx={cx+4} cy={ry-22} rx={2} ry={1.2} fill="rgba(255,255,255,0.3)"/>
    </g>
  );

  if (g.includes('menta')) return (
    <g>
      {([-5,0,5] as const).map((ox, i) => (
        <ellipse key={i} cx={cx+ox} cy={ry-9-i*2} rx={4} ry={6.5}
          fill="#2E8B57" opacity={0.92}
          transform={`rotate(${ox*10},${cx+ox},${ry-9-i*2})`}/>
      ))}
    </g>
  );

  if (g.includes('ombrellino')) return (
    <g>
      <path d={`M${cx-12} ${ry-18} A12,5 0 0,0 ${cx+12} ${ry-18}`} fill="#FF6B00" stroke="#CC4400" strokeWidth={0.8}/>
      <path d={`M${cx-12} ${ry-18} A12,5 0 0,0 ${cx}     ${ry-13}`} fill="#FFD700"/>
      <path d={`M${cx}    ${ry-13} A12,5 0 0,0 ${cx+12}  ${ry-18}`} fill="#FF1493"/>
      <line x1={cx} y1={ry-18} x2={cx} y2={ry-4} stroke="#8B4513" strokeWidth={1.2} strokeLinecap="round"/>
    </g>
  );

  if (g.includes('sale') || g.includes('zucchero')) return (
    <line x1={pts[0][0]-3} y1={ry-3} x2={pts[1][0]+3} y2={ry-3}
      stroke="rgba(255,255,255,0.65)" strokeWidth={4} strokeDasharray="2 2" strokeLinecap="round"/>
  );

  return null;
}

// ── MAIN GLASS SVG ────────────────────────────────────────────────────────────

export function GlassSVG({
  gDef,
  layers   = [],
  ice      = null,
  salt     = false,
  pour     = null,
  garnish  = null,
  size     = 180,
}: GlassSVGProps) {
  const total   = layers.reduce((s, l) => s + l.amount, 0);
  const fill    = useAnimVal(Math.min(total / (gDef.capacity * 0.88), 1));

  const [,, W, H] = gDef.viewBox.split(' ').map(Number);
  const svgH      = size * (H / W);
  const glH       = gDef.bottomY - gDef.rimY;
  const fillH     = glH * fill;
  const surY      = gDef.bottomY - fillH;
  const tot2      = Math.max(total, 0.001);

  // Stack liquid layers bottom-to-top
  const sLayers = useMemo(() => {
    let stackY = gDef.bottomY;
    return layers.map(l => {
      const lh = glH * (l.amount / tot2) * fill;
      const ly = stackY - lh;
      stackY   = ly;
      return { ...l, sy: ly, sh: Math.max(lh, 0.5) };
    });
  }, [layers, fill, glH, tot2, gDef.bottomY]);

  const eff  = layers.some(l => /prosecco|soda|tonica|tonic|ginger/i.test(l.name));
  const uid  = gDef.id;
  const pts  = gDef.bowlPts.split(' ').map(p => p.split(',').map(Number));

  return (
    <svg
      viewBox={gDef.viewBox}
      width={size}
      height={svgH}
      style={{ overflow: 'visible', filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.5))' }}
    >
      <defs>
        <clipPath id={`cl-${uid}`}>
          <polygon points={gDef.bowlPts} />
        </clipPath>
        <linearGradient id={`sh-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.22)" />
          <stop offset="22%"  stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.07)" />
        </linearGradient>
        <linearGradient id={`su-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0)"    />
          <stop offset="50%"  stopColor="rgba(255,255,255,0.32)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)"    />
        </linearGradient>
      </defs>

      {/* ── LIQUID LAYERS ──────────────────────────────────────── */}
      <g clipPath={`url(#cl-${uid})`}>
        {sLayers.map((l, i) => (
          <rect key={i} x={0} y={l.sy} width={W} height={l.sh}
            fill={l.color} opacity={0.93} />
        ))}

        {/* Surface shimmer */}
        {fill > 0.02 && (
          <rect x={0} y={surY - 1} width={W} height={3}
            fill={`url(#su-${uid})`} />
        )}

        {/* Effervescence bubbles */}
        {eff && fill > 0.05 && [0.28, 0.5, 0.7].map((xr, i) => (
          <line key={i}
            x1={W*xr}  y1={gDef.bottomY - fillH*0.08}
            x2={W*xr + (i===1 ? 1.5 : -1)} y2={surY + 2}
            stroke="rgba(255,255,255,0.2)" strokeWidth={0.7}
            strokeDasharray="1.5 4"
            style={{ animation: `bdash ${1.4+i*0.35}s linear ${i*0.3}s infinite` }}
          />
        ))}

        {/* Ice: cubes */}
        {ice === 'cubes' && fill > 0.08 &&
          [[0.15,0.72],[0.38,0.52],[0.62,0.68]].map(([xr,yr], i) => (
            <rect key={i}
              x={W*xr} y={gDef.bottomY - fillH*yr}
              width={W*0.14} height={W*0.12} rx={2}
              fill="rgba(210,235,255,0.3)" stroke="rgba(255,255,255,0.52)" strokeWidth={0.7}
            />
          ))
        }

        {/* Ice: crushed */}
        {ice === 'crushed' && fill > 0.08 &&
          [[0.12,0.3],[0.28,0.5],[0.44,0.18],[0.6,0.4],[0.72,0.22],[0.2,0.65],[0.5,0.55]]
          .map(([xr,yr], i) => (
            <ellipse key={i}
              cx={W*(xr+0.06)} cy={gDef.bottomY - fillH*(0.1+yr*0.8)}
              rx={W*(0.04+(i%3)*0.01)} ry={W*0.025}
              fill="rgba(210,235,255,0.28)" stroke="rgba(255,255,255,0.42)" strokeWidth={0.6}
            />
          ))
        }

        {/* Ice: sphere */}
        {ice === 'sphere' && fill > 0.08 && (
          <circle
            cx={gDef.cx} cy={gDef.bottomY - fillH*0.52}
            r={Math.min(W*0.14, fillH*0.4)}
            fill="rgba(210,235,255,0.22)" stroke="rgba(255,255,255,0.45)" strokeWidth={0.8}
          />
        )}

        {/* Ice: stick */}
        {ice === 'stick' && fill > 0.08 && (
          <rect
            x={gDef.cx - 3} y={surY + 4}
            width={6} height={fillH*0.72} rx={3}
            fill="rgba(210,235,255,0.28)" stroke="rgba(255,255,255,0.4)" strokeWidth={0.7}
          />
        )}
      </g>

      {/* ── GLASS OUTLINE ─────────────────────────────────────── */}
      <polygon points={gDef.bowlPts}
        fill="rgba(255,255,255,0.012)"
        stroke="rgba(255,255,255,0.42)"
        strokeWidth={1.5} strokeLinejoin="round"
      />
      {/* Sheen overlay */}
      <polygon points={gDef.bowlPts}
        fill={`url(#sh-${uid})`}
        clipPath={`url(#cl-${uid})`}
      />
      {/* Rim highlight */}
      <line
        x1={pts[0][0]} y1={pts[0][1]}
        x2={pts[1][0]} y2={pts[1][1]}
        stroke="rgba(255,255,255,0.62)" strokeWidth={2} strokeLinecap="round"
      />

      {/* Salt / sugar rim */}
      {salt && (
        <line
          x1={pts[0][0]-3} y1={pts[0][1]-3}
          x2={pts[1][0]+3} y2={pts[1][1]-3}
          stroke="rgba(255,255,255,0.68)" strokeWidth={4}
          strokeDasharray="2 2" strokeLinecap="round"
        />
      )}

      {/* Stem + base */}
      {gDef.stemD && (
        <path d={gDef.stemD}
          stroke="rgba(255,255,255,0.28)" strokeWidth={1.5}
          fill="none" strokeLinecap="round"
        />
      )}
      {gDef.baseD && (
        <path d={gDef.baseD}
          fill="rgba(255,255,255,0.025)"
          stroke="rgba(255,255,255,0.22)" strokeWidth={1}
        />
      )}

      {/* Pour stream animation */}
      {pour && fill > 0 && (
        <line
          x1={gDef.cx} y1={gDef.rimY - 20}
          x2={gDef.cx} y2={surY + 2}
          stroke={pour} strokeWidth={4} strokeLinecap="round" opacity={0.88}
          style={{ animation: 'pourS 0.8s ease-out forwards' }}
        />
      )}

      {/* Garnish */}
      {garnish && <GarnishSVG garnish={garnish} gDef={gDef} />}
    </svg>
  );
}

// ── MINI GLASS (static, for cards) ───────────────────────────────────────────

interface MiniGlassProps {
  cocktail: Pick<Cocktail, 'id' | 'glass' | 'ings'>;
  gDef:     GlassDef;
  size?:    number;
}

export function MiniGlass({ cocktail, gDef, size = 52 }: MiniGlassProps) {
  const [,, W, H] = gDef.viewBox.split(' ').map(Number);
  const svgH      = size * (H / W);
  const fs        = gDef.rimY    + (gDef.bottomY - gDef.rimY) * 0.10;
  const fe        = gDef.bottomY - (gDef.bottomY - gDef.rimY) * 0.06;
  const uid       = `mc-${cocktail.id}`;

  return (
    <svg viewBox={gDef.viewBox} width={size} height={svgH}
      style={{ overflow: 'visible', filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.45))' }}>
      <defs>
        <clipPath id={uid}>
          <polygon points={gDef.bowlPts} />
        </clipPath>
        <linearGradient id={`mg-${cocktail.id}`} x1="0" y1="1" x2="0" y2="0">
          {cocktail.ings.length > 1
            ? cocktail.ings.map((ing, i) => (
                <stop key={i}
                  offset={`${(i / (cocktail.ings.length - 1)) * 100}%`}
                  stopColor={ing.color} stopOpacity="0.92" />
              ))
            : <stop offset="0%" stopColor={cocktail.ings[0]?.color ?? '#888'} stopOpacity="0.92" />
          }
        </linearGradient>
      </defs>
      <g clipPath={`url(#${uid})`}>
        <rect x={0} y={fs} width={W} height={fe - fs}
          fill={`url(#mg-${cocktail.id})`} />
        <rect x={0} y={fs} width={W} height={2.5}
          fill="rgba(255,255,255,0.28)" />
      </g>
      <polygon points={gDef.bowlPts}
        fill="rgba(255,255,255,0.015)"
        stroke="rgba(255,255,255,0.48)" strokeWidth={1.5}
      />
      {gDef.stemD && (
        <path d={gDef.stemD} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} fill="none" />
      )}
      {gDef.baseD && (
        <path d={gDef.baseD} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
      )}
    </svg>
  );
}
