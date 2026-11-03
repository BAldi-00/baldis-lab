// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Garnishes
// src/components/glass/Garnish.tsx
//
// Illustrated garnishes, drawn in their own local space and placed on the
// rim of any glass. Parsed from the recipe text ("Scorza d'arancia",
// "Menta + Lime + Ombrellino"…). Shaded with gradients so each one reads at
// a glance at card size: wheels show pith and segments, twists spiral, the
// cherry is glossy, mint has veined leaves.
// ─────────────────────────────────────────────────────────────────────────────

import type { GlassShape } from '@/lib/glass';
import { CX, rimY, rimR } from '@/lib/glass';

export type GarnishKind =
  | 'lime-wheel' | 'lemon-wheel' | 'orange-wheel' | 'grapefruit-wheel'
  | 'lime-twist' | 'lemon-twist' | 'orange-twist' | 'grapefruit-twist'
  | 'cherry' | 'mint' | 'basil' | 'olive' | 'pineapple' | 'umbrella'
  | 'coffee' | 'cucumber' | 'strawberry' | 'cinnamon' | 'salt' | 'sugar'
  | 'berries-red' | 'berries-dark' | 'peach' | 'flower'
  | 'foam' | 'drops' | 'nutmeg';

const CITRUS = {
  lime:       { rind: '#3f7d12', rind2: '#6aa52a', flesh: '#c8e86a', flesh2: '#8fc231' },
  lemon:      { rind: '#d9a90b', rind2: '#f6d23a', flesh: '#fff3a6', flesh2: '#f5d849' },
  orange:     { rind: '#d4560a', rind2: '#f3861f', flesh: '#ffc067', flesh2: '#f58a1f' },
  grapefruit: { rind: '#d9603a', rind2: '#f59a5c', flesh: '#ffb3a3', flesh2: '#f0656a' },
} as const;

const SURFACE: GarnishKind[] = ['foam', 'drops', 'nutmeg', 'coffee'];
type Citrus = keyof typeof CITRUS;

/** Recipe garnish text → list of garnishes to draw (max 3, most visible first). */
export function parseGarnish(text: string | null | undefined): GarnishKind[] {
  if (!text) return [];
  const out: GarnishKind[] = [];
  const add = (k: GarnishKind) => { if (!out.includes(k)) out.push(k); };
  for (const raw of text.toLowerCase().split(/[+,]| e /)) {
    const t = raw.split(/ o /)[0].trim();     // "Oliva o Scorza limone" → first option only
    if (!t || t.includes('nessun')) continue;
    const citrus: Citrus | null =
      t.includes('pompelmo') ? 'grapefruit' : t.includes('arancia') ? 'orange'
      : t.includes('limone') ? 'lemon' : /\blime\b/.test(t) ? 'lime' : null;
    if (t.includes('sale')) add('salt');
    else if (t.includes('zucchero') && (t.includes('bordo') || t.includes('rim'))) add('sugar');
    else if (t.includes('schiuma')) add('foam');
    else if (t.includes('angostura') || t.includes('gocce')) add('drops');
    else if (t.includes('noce moscata') || t.includes('cacao')) add('nutmeg');
    else if (citrus) add(`${citrus}-${/scorza|twist|peel|zest|spirale/.test(t) ? 'twist' : 'wheel'}` as GarnishKind);
    else if (t.includes('lampon') || t.includes('ribes')) add('berries-red');
    else if (/\bmor[ae]\b|mirtill/.test(t)) add('berries-dark');
    else if (t.includes('pesca')) add('peach');
    else if (t.includes('fiore') || t.includes('orchidea')) add('flower');
    else if (t.includes('ciliegi') || t.includes('cherry') || t.includes('amarena')) add('cherry');
    else if (t.includes('menta')) add('mint');
    else if (t.includes('basilico')) add('basil');
    else if (t.includes('oliv')) add('olive');
    else if (t.includes('ananas')) add('pineapple');
    else if (t.includes('ombrellino')) add('umbrella');
    else if (t.includes('caffè') || t.includes('caffe') || t.includes('chicchi')) add('coffee');
    else if (t.includes('cetriolo')) add('cucumber');
    else if (t.includes('fragol')) add('strawberry');
    else if (t.includes('cannella')) add('cinnamon');
    else if (t.includes('zucchero')) add('sugar');
  }
  // Surface effects (foam, drops, crema) don't compete for room on the rim
  return [...out.filter(k => !SURFACE.includes(k)).slice(0, 3), ...out.filter(k => SURFACE.includes(k))];
}

// Trig results can differ in the last bit between Node and the browser,
// which breaks hydration: round them so server and client markup match.
const r6 = (n: number) => Math.round(n * 1e6) / 1e6;
const cos = (a: number) => r6(Math.cos(a));
const sin = (a: number) => r6(Math.sin(a));

// Deterministic jitter (SSR-safe)
const rand = (i: number) => { const x = r6(Math.sin(i * 91.7 + 13.3)) * 43758.5453; return r6(x - Math.floor(x)); };

// ── PIECES (local coordinates, roughly 20×20 around the origin) ──────────────

function Wheel({ id, c, cucumber = false }: { id: string; c: typeof CITRUS[Citrus] | null; cucumber?: boolean }) {
  const n = cucumber ? 0 : 10;
  const rind = cucumber ? '#24501c' : c!.rind, rind2 = cucumber ? '#3d7a2c' : c!.rind2;
  const flesh = cucumber ? '#e4f3c6' : c!.flesh, flesh2 = cucumber ? '#b9dc8f' : c!.flesh2;
  return (
    <g>
      <defs>
        <radialGradient id={`wf${id}`} cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor={flesh} /><stop offset="1" stopColor={flesh2} />
        </radialGradient>
        <linearGradient id={`wr${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={rind2} /><stop offset="1" stopColor={rind} />
        </linearGradient>
      </defs>
      <circle r={10.4} fill="rgba(0,0,0,.25)" transform="translate(.8 1)" />
      <circle r={10} fill={`url(#wr${id})`} />
      <circle r={8.9} fill={cucumber ? '#cfe8a8' : '#fbf3dc'} />
      <circle r={8.1} fill={`url(#wf${id})`} />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        return <line key={i} x1={0} y1={0} x2={cos(a) * 8.1} y2={sin(a) * 8.1} stroke="#fbf3dc" strokeWidth={0.75} />;
      })}
      {!cucumber && Array.from({ length: n }, (_, i) => {
        const a = ((i + 0.5) / n) * Math.PI * 2;
        return <ellipse key={i} cx={cos(a) * 5.2} cy={sin(a) * 5.2} rx={1.3} ry={0.5} fill="#fff" opacity={0.35} transform={`rotate(${(a * 180) / Math.PI} ${cos(a) * 5.2} ${sin(a) * 5.2})`} />;
      })}
      {cucumber && Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return <ellipse key={i} cx={cos(a) * 3.4} cy={sin(a) * 3.4} rx={1.1} ry={0.6} fill="#f7fbe9" stroke="#9cc37a" strokeWidth={0.2} transform={`rotate(${(a * 180) / Math.PI} ${cos(a) * 3.4} ${sin(a) * 3.4})`} />;
      })}
      <circle r={cucumber ? 1.6 : 1.1} fill={cucumber ? '#d4ebb5' : '#fbf3dc'} />
      <ellipse cx={-3.5} cy={-4.5} rx={4} ry={2} fill="#fff" opacity={0.22} transform="rotate(-35 -3.5 -4.5)" />
      {/* slit where it sits on the rim */}
      <line x1={0} y1={3.5} x2={0} y2={10} stroke="rgba(0,0,0,.35)" strokeWidth={0.8} />
    </g>
  );
}

/** Spiral peel hanging from the rim (helix: front turns bright, back turns dark). */
function Twist({ c }: { c: typeof CITRUS[Citrus] }) {
  const segs: { d: string; front: boolean }[] = [];
  const N = 60, turns = 2.2, len = 24, amp = 3.4;
  const pt = (i: number) => {
    const t = (i / N) * turns * Math.PI * 2;
    return [sin(t) * amp * (1 - i / N * 0.35), (i / N) * len, cos(t)] as const;
  };
  for (let i = 0; i < N; i++) {
    const [x1, y1, z] = pt(i), [x2, y2] = pt(i + 1);
    segs.push({ d: `M${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)}`, front: z > 0 });
  }
  return (
    <g strokeLinecap="round">
      {segs.filter(s => !s.front).map((s, i) => <path key={`b${i}`} d={s.d} stroke={c.rind} strokeWidth={2.4} opacity={0.85} />)}
      {/* the part lying across the rim */}
      <path d="M-11 -0.6 Q-5 -2.2 0 0" stroke={c.rind2} strokeWidth={2.8} fill="none" />
      <path d="M-11 -1.2 Q-5 -2.8 0 -0.6" stroke="#fff6dc" strokeWidth={0.7} fill="none" opacity={0.7} />
      {segs.filter(s => s.front).map((s, i) => <path key={`f${i}`} d={s.d} stroke={c.rind2} strokeWidth={2.9} />)}
      {segs.filter(s => s.front).map((s, i) => <path key={`h${i}`} d={s.d} stroke="#fff3c8" strokeWidth={0.7} opacity={0.6} transform="translate(-.5 -.3)" />)}
    </g>
  );
}

function Cherry({ id }: { id: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`ch${id}`} cx="35%" cy="32%" r="70%">
          <stop offset="0" stopColor="#ff6b7a" /><stop offset=".35" stopColor="#c4001f" /><stop offset="1" stopColor="#4a000c" />
        </radialGradient>
      </defs>
      <path d="M0.5 -4 C 1.5 -10, 5 -15, 10 -17" stroke="#4d6b1f" strokeWidth={1} fill="none" strokeLinecap="round" />
      <path d="M0.5 -4 C 1.5 -10, 5 -15, 10 -17" stroke="#8fb34a" strokeWidth={0.35} fill="none" strokeLinecap="round" transform="translate(-.3 0)" />
      <ellipse cx={0.8} cy={5.4} rx={5} ry={1.2} fill="rgba(0,0,0,.25)" />
      <circle r={5.2} fill={`url(#ch${id})`} />
      <path d="M-1.4 -4.6 Q0.4 -3.6 2 -4.6" stroke="#3a0008" strokeWidth={0.6} fill="none" />
      <ellipse cx={-2} cy={-2.2} rx={1.8} ry={1.1} fill="#fff" opacity={0.75} transform="rotate(-30 -2 -2.2)" />
      <circle cx={2.4} cy={1.6} r={0.6} fill="#fff" opacity={0.35} />
    </g>
  );
}

function Leaf({ id, len, rot, x, y, basil = false }: { id: string; len: number; rot: number; x: number; y: number; basil?: boolean }) {
  const w = basil ? len * 0.42 : len * 0.34;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 C ${w} ${-len * 0.25}, ${w * 0.9} ${-len * 0.75}, 0 ${-len} C ${-w * 0.9} ${-len * 0.75}, ${-w} ${-len * 0.25}, 0 0 Z`}
        fill={`url(#lf${id})`} stroke={basil ? '#16461c' : '#1b5e2e'} strokeWidth={0.3} />
      <path d={`M0 -0.5 L0 ${-len * 0.9}`} stroke="#b6e3a8" strokeWidth={0.35} opacity={0.8} />
      {[0.3, 0.5, 0.7].map(f => (
        <g key={f} stroke="#b6e3a8" strokeWidth={0.25} opacity={0.6}>
          <path d={`M0 ${-len * f} l${w * 0.6} ${-len * 0.12}`} /><path d={`M0 ${-len * f} l${-w * 0.6} ${-len * 0.12}`} />
        </g>
      ))}
    </g>
  );
}

function Sprig({ id, basil = false }: { id: string; basil?: boolean }) {
  const L = basil ? 9 : 8;
  return (
    <g>
      <defs>
        <linearGradient id={`lf${id}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={basil ? '#1f6b2a' : '#1f7a3a'} /><stop offset="1" stopColor={basil ? '#4ea64a' : '#4cc06a'} />
        </linearGradient>
      </defs>
      <path d="M0 6 C 0.5 0, -0.5 -8, 0.5 -16" stroke="#2c6b2f" strokeWidth={0.9} fill="none" />
      <Leaf id={id} basil={basil} len={L} rot={-62} x={0} y={2} />
      <Leaf id={id} basil={basil} len={L} rot={58} x={0.2} y={0} />
      <Leaf id={id} basil={basil} len={L * 0.9} rot={-38} x={0.2} y={-6} />
      <Leaf id={id} basil={basil} len={L * 0.9} rot={34} x={0.4} y={-7} />
      <Leaf id={id} basil={basil} len={L * 0.7} rot={-14} x={0.4} y={-12} />
      <Leaf id={id} basil={basil} len={L * 0.65} rot={16} x={0.5} y={-12.5} />
    </g>
  );
}

function Olives({ id }: { id: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`ol${id}`} cx="35%" cy="35%" r="70%">
          <stop offset="0" stopColor="#c6d25a" /><stop offset=".6" stopColor="#7d8f22" /><stop offset="1" stopColor="#4b5a10" />
        </radialGradient>
      </defs>
      <line x1={0} y1={0} x2={-20} y2={36} stroke="#d8c08a" strokeWidth={1} strokeLinecap="round" />
      <circle cx={0} cy={0} r={1.5} fill="#b3262a" />
      {[[-11, 19.5], [-16, 28.5]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(-60)`}>
          <ellipse rx={4.6} ry={3.5} fill={`url(#ol${id})`} />
          <circle cx={-3.6} cy={0} r={1.4} fill="#c62d1f" />
          <ellipse cx={-0.5} cy={-1.6} rx={1.8} ry={0.7} fill="#fff" opacity={0.45} />
        </g>
      ))}
    </g>
  );
}

function Pineapple({ id }: { id: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`pf${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0a0" /><stop offset="1" stopColor="#f4b414" />
        </linearGradient>
      </defs>
      {/* leaves */}
      {[[-3, -12, -18], [0, -15, 0], [3, -12, 20]].map(([x, y, r], i) => (
        <path key={i} d={`M0 0 Q ${x * 0.3} ${y * 0.5} ${x} ${y} Q ${x * 0.2 + 1.2} ${y * 0.5} 1.2 0 Z`} fill={i === 1 ? '#3f8a2e' : '#57a23c'} transform={`translate(-1 -1) rotate(${r})`} />
      ))}
      {/* wedge: flesh + rind */}
      <path d="M-11 -2 L 11 -2 Q 11 9 0 13 Q -11 9 -11 -2 Z" fill={`url(#pf${id})`} stroke="#d99a14" strokeWidth={0.4} />
      <path d="M-11 -2 L 11 -2 L 11 0.5 L -11 0.5 Z" fill="#fff6c8" opacity={0.7} />
      <path d="M-11 -2 Q -11 9 0 13 Q 11 9 11 -2 Q 9 7 0 10.5 Q -9 7 -11 -2 Z" fill="#9c6b1a" />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M${-8 + i * 3.2} ${4 + Math.abs(i - 2.5) * -0.6} l1.4 1.6 l1.4 -1.6`} stroke="#5d7d1c" strokeWidth={0.5} fill="none" />
      ))}
      <line x1={0} y1={-2} x2={0} y2={-6} stroke="rgba(0,0,0,.3)" strokeWidth={0.6} />
    </g>
  );
}

function Umbrella() {
  const cols = ['#ff5d73', '#ffd166', '#06b6d4', '#ff5d73', '#ffd166', '#06b6d4'];
  const R = 14, H = 6;
  return (
    <g>
      <line x1={0} y1={0} x2={0} y2={30} stroke="#c49a5b" strokeWidth={1.1} strokeLinecap="round" />
      {cols.map((c, i) => {
        const a0 = Math.PI + (i / cols.length) * Math.PI, a1 = Math.PI + ((i + 1) / cols.length) * Math.PI;
        const p = (a: number) => `${(cos(a) * R).toFixed(2)} ${(sin(a) * H + H).toFixed(2)}`;
        return <path key={i} d={`M0 -${H * 0.2} L ${p(a0)} L ${p(a1)} Z`} fill={c} stroke="rgba(0,0,0,.15)" strokeWidth={0.2} />;
      })}
      <path d={`M${-R} ${H} Q 0 ${H + 2.4} ${R} ${H}`} stroke="rgba(255,255,255,.8)" strokeWidth={0.8} fill="none" strokeDasharray="1 0.8" />
      <circle cx={0} cy={-H * 0.2} r={0.9} fill="#fff" />
    </g>
  );
}

function Strawberry({ id }: { id: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`st${id}`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#ff6b6b" /><stop offset=".6" stopColor="#d7192d" /><stop offset="1" stopColor="#8a0a18" />
        </radialGradient>
      </defs>
      <path d="M-7 -3 C -8 4, -3 11, 0 13 C 3 11, 8 4, 7 -3 C 4 -5.5, -4 -5.5, -7 -3 Z" fill={`url(#st${id})`} />
      {Array.from({ length: 14 }, (_, i) => (
        <ellipse key={i} cx={(rand(i) - 0.5) * 10} cy={-1 + rand(i + 20) * 10} rx={0.35} ry={0.6} fill="#ffd86b" opacity={0.9} />
      ))}
      {[-50, -15, 20, 55].map((r, i) => (
        <path key={i} d="M0 -4 Q 2 -6 5 -6.5 Q 2.5 -4.5 0 -3.5 Z" fill="#3f8f3a" transform={`rotate(${r} 0 -4)`} />
      ))}
      <line x1={0} y1={6} x2={0} y2={13} stroke="rgba(0,0,0,.3)" strokeWidth={0.6} />
    </g>
  );
}

function Cinnamon() {
  return (
    <g>
      <rect x={-1.8} y={0} width={3.6} height={30} rx={1.2} fill="#8b4a1e" />
      <rect x={-1.8} y={0} width={1.3} height={30} rx={0.6} fill="#a8622e" />
      <ellipse cx={0} cy={0} rx={1.8} ry={0.8} fill="#6d3512" />
      <path d="M-1 0 a1 .5 0 1 1 1.2 .2" stroke="#c88552" strokeWidth={0.3} fill="none" />
    </g>
  );
}

function Berries({ id, dark }: { id: string; dark: boolean }) {
  const [hi, mid, lo] = dark ? ['#7a4a8a', '#3a1446', '#1a0620'] : ['#ff7a8a', '#d61f45', '#7c0a22'];
  const drupe = (cx: number, cy: number, r: number) => (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={`url(#br${id})`} />
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return <circle key={i} cx={cx + cos(a) * r * 0.55} cy={cy + sin(a) * r * 0.55} r={r * 0.34} fill={`url(#br${id})`} stroke={lo} strokeWidth={0.15} />;
      })}
      <circle cx={cx - r * 0.35} cy={cy - r * 0.4} r={r * 0.22} fill="#fff" opacity={0.45} />
    </g>
  );
  return (
    <g>
      <defs>
        <radialGradient id={`br${id}`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor={hi} /><stop offset=".6" stopColor={mid} /><stop offset="1" stopColor={lo} />
        </radialGradient>
      </defs>
      <line x1={-13} y1={-2} x2={13} y2={2} stroke="#d8c08a" strokeWidth={0.9} strokeLinecap="round" />
      {drupe(-5, -0.8, 3.6)}{drupe(3.2, 0.6, 3.6)}
    </g>
  );
}

function Peach({ id }: { id: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`pe${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd08a" /><stop offset="1" stopColor="#f39a4a" />
        </linearGradient>
      </defs>
      <path d="M-11 -2 Q 0 16 11 -2 Q 0 6 -11 -2 Z" fill={`url(#pe${id})`} />
      <path d="M-11 -2 Q 0 16 11 -2" stroke="#d9452f" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d="M-7 1 Q 0 6 7 1" stroke="#fff3d6" strokeWidth={0.6} fill="none" opacity={0.7} />
    </g>
  );
}

function Flower() {
  return (
    <g>
      <path d="M0 0 C 2 6, 1 12, 3 18" stroke="#3f8a2e" strokeWidth={0.9} fill="none" />
      {[0, 72, 144, 216, 288].map(r => (
        <ellipse key={r} cx={0} cy={-4.6} rx={2.8} ry={4.8} fill={r % 144 === 0 ? '#d63c8f' : '#ee6db3'} transform={`rotate(${r})`} />
      ))}
      {[0, 72, 144, 216, 288].map(r => (
        <line key={r} x1={0} y1={0} x2={0} y2={-6} stroke="#9c2a6a" strokeWidth={0.35} transform={`rotate(${r})`} />
      ))}
      <circle r={1.8} fill="#ffd34d" />
    </g>
  );
}

// ── PLACEMENT ─────────────────────────────────────────────────────────────────

interface Ctx { s: GlassShape; uid: string; surface: number; surfR: number; liquid: number; }

/** Garnishes that float in the drink: drawn inside the bowl clip. */
export function GarnishInside({ kinds, ctx }: { kinds: GarnishKind[]; ctx: Ctx }) {
  if (!ctx.liquid) return null;
  const { surface, surfR, uid } = ctx;
  const ry = Math.max(0.8, surfR * 0.09);
  return (
    <>
      {kinds.includes('foam') && (
        <g>
          <rect x={0} y={surface - 0.4} width={100} height={4.5} fill="#f6f1e6" opacity={0.95} />
          <ellipse cx={CX} cy={surface} rx={surfR} ry={ry} fill="#fffdf7" />
        </g>
      )}
      {kinds.includes('drops') && [-0.35, 0, 0.32].map((f, i) => (
        <ellipse key={i} cx={CX + f * surfR} cy={surface + (i - 1) * ry * 0.3} rx={1.3} ry={0.55} fill="#7a1010" opacity={0.9} />
      ))}
      {kinds.includes('nutmeg') && Array.from({ length: 22 }, (_, i) => (
        <circle key={i} cx={CX + (rand(i + 40) - 0.5) * surfR * 1.5} cy={surface + (rand(i + 70) - 0.5) * ry * 1.4} r={0.25 + rand(i) * 0.3} fill="#7a4a24" />
      ))}
      {kinds.includes('coffee') && (
        <g>
          {/* crema on top of an espresso drink */}
          <rect x={0} y={surface - 0.4} width={100} height={3.2} fill="#c99a68" opacity={0.92} />
          <ellipse cx={CX} cy={surface} rx={surfR} ry={Math.max(0.8, surfR * 0.09)} fill="#e0bd8f" />
          {[-5.5, 0, 5.5].map((dx, i) => (
            <g key={i} transform={`translate(${CX + dx} ${surface - 0.5}) rotate(${[-20, 10, 35][i]})`}>
              <defs>
                <radialGradient id={`cb${uid}${i}`} cx="35%" cy="35%" r="70%">
                  <stop offset="0" stopColor="#7a4424" /><stop offset="1" stopColor="#2a1208" />
                </radialGradient>
              </defs>
              <ellipse rx={2.4} ry={1.5} fill={`url(#cb${uid}${i})`} />
              <path d="M-1.8 0 Q -0.6 -0.6 0 0 T 1.8 0" stroke="#d6a77a" strokeWidth={0.35} fill="none" />
            </g>
          ))}
        </g>
      )}
      {kinds.includes('mint') && [[-0.45, 6, -30], [0.3, 12, 40], [-0.1, 18, 10]].map(([fx, dy, r], i) => (
        <ellipse key={i} cx={CX + fx * surfR} cy={surface + dy} rx={1.4} ry={2.6} fill="#2f8a45" opacity={0.75} transform={`rotate(${r} ${CX + fx * surfR} ${surface + dy})`} />
      ))}
    </>
  );
}

/** Garnishes on the rim and above it: drawn after the glass body. */
export function GarnishOutside({ kinds, ctx }: { kinds: GarnishKind[]; ctx: Ctx }) {
  const { s, uid } = ctx;
  const top = rimY(s), rr = rimR(s);
  const k = Math.max(0.9, Math.min(1.25, rr / 24));
  const ry = Math.max(1.2, rr * 0.09);
  let slot = 0;   // 0 → right side of the rim, 1 → left side, 2 → centre
  const nextSlot = () => slot++;
  const rimX = (side: number) => (side === 0 ? CX + rr - 1 : side === 1 ? CX - rr + 1 : CX + rr * 0.15);
  const items: React.ReactNode[] = [];

  for (const kind of kinds) {
    const id = `${uid}${kind}`;
    if (kind === 'salt' || kind === 'sugar') {
      const col = kind === 'salt' ? '#f7f9fb' : '#f3e1b6';
      items.push(
        <g key={kind}>
          <path d={`M${CX - rr - 0.3} ${top} A ${rr + 0.3} ${ry + 0.3} 0 0 0 ${CX + rr + 0.3} ${top} L ${CX + rr + 0.2} ${top + 3} A ${rr + 0.2} ${ry + 0.3} 0 0 1 ${CX - rr - 0.2} ${top + 3} Z`}
            fill={col} opacity={0.55} />
          {Array.from({ length: 90 }, (_, i) => {
            const a = rand(i) * Math.PI;
            const x = CX + cos(a) * (rr + 0.3), y = top + sin(a) * ry + rand(i + 300) * 3.2 - 0.6;
            const w = 0.5 + rand(i + 600) * 0.7;
            return <rect key={i} x={x - w / 2} y={y - w / 2} width={w} height={w} fill={col} stroke="rgba(80,70,60,.45)" strokeWidth={0.12} transform={`rotate(${rand(i + 900) * 90} ${x} ${y})`} />;
          })}
        </g>
      );
      continue;
    }
    if (kind.endsWith('-wheel') || kind === 'cucumber') {
      const side = nextSlot() % 2;
      const c = kind === 'cucumber' ? null : CITRUS[kind.split('-')[0] as Citrus];
      items.push(
        <g key={kind} transform={`translate(${rimX(side) + (side ? -2 : 2) * k} ${top - 6 * k}) scale(${k}) rotate(${side ? -8 : 8})`}>
          <Wheel id={id} c={c} cucumber={kind === 'cucumber'} />
        </g>
      );
      continue;
    }
    if (kind.endsWith('-twist')) {
      const side = nextSlot() % 2;
      const c = CITRUS[kind.split('-')[0] as Citrus];
      items.push(
        <g key={kind} transform={`translate(${rimX(side) + (side ? -0.5 : 0.5)} ${top}) scale(${side ? -k : k} ${k})`}>
          <Twist c={c} />
        </g>
      );
      continue;
    }
    if (kind === 'cherry') {
      items.push(
        <g key={kind} transform={`translate(${CX - rr * 0.25} ${top - 4 * k}) scale(${k})`}><Cherry id={id} /></g>
      );
      continue;
    }
    if (kind === 'mint' || kind === 'basil') {
      items.push(
        <g key={kind} transform={`translate(${CX - rr * 0.42} ${top - 2}) scale(${k * 1.1})`}><Sprig id={id} basil={kind === 'basil'} /></g>
      );
      continue;
    }
    if (kind === 'olive') {
      items.push(
        <g key={kind} transform={`translate(${CX + rr + 4} ${top - 16 * k}) scale(${k})`}><Olives id={id} /></g>
      );
      continue;
    }
    if (kind === 'pineapple') {
      const side = nextSlot() % 2;
      items.push(
        <g key={kind} transform={`translate(${rimX(side) + (side ? -2 : 2)} ${top - 4 * k}) scale(${k}) rotate(${side ? -10 : 10})`}><Pineapple id={id} /></g>
      );
      continue;
    }
    if (kind === 'umbrella') {
      items.push(
        <g key={kind} transform={`translate(${CX + rr * 0.55} ${top - 22 * k}) rotate(18) scale(${k})`}><Umbrella /></g>
      );
      continue;
    }
    if (kind === 'strawberry') {
      const side = nextSlot() % 2;
      items.push(
        <g key={kind} transform={`translate(${rimX(side)} ${top - 7 * k}) scale(${k}) rotate(${side ? -12 : 12})`}><Strawberry id={id} /></g>
      );
      continue;
    }
    if (kind === 'berries-red' || kind === 'berries-dark') {
      items.push(
        <g key={kind} transform={`translate(${CX - rr * 0.2} ${top - 3 * k}) scale(${k}) rotate(-8)`}><Berries id={id} dark={kind === 'berries-dark'} /></g>
      );
      continue;
    }
    if (kind === 'peach') {
      const side = nextSlot() % 2;
      items.push(
        <g key={kind} transform={`translate(${rimX(side)} ${top - 3 * k}) scale(${k}) rotate(${side ? -20 : 20})`}><Peach id={id} /></g>
      );
      continue;
    }
    if (kind === 'flower') {
      const side = nextSlot() % 2;
      items.push(
        <g key={kind} transform={`translate(${rimX(side) + (side ? 2 : -2)} ${top - 5 * k}) scale(${k * 1.1})`}><Flower /></g>
      );
      continue;
    }
    if (kind === 'cinnamon') {
      items.push(
        <g key={kind} transform={`translate(${CX + rr * 0.3} ${top - 18}) rotate(14)`}><Cinnamon /></g>
      );
    }
  }
  return <>{items}</>;
}
