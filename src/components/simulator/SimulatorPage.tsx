// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Simulator Page (Canvas 2D Ultra-Realistico)
// src/components/simulator/SimulatorPage.tsx
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { GLASSES, INGREDIENTS, COCKTAILS } from '@/lib/data';
import { calcStats, matchCocktail } from '@/lib/utils';
import type { GlassId } from '@/lib/data';

export type IceType = null | 'cubes' | 'crushed' | 'sphere' | 'stick';

interface SimLayer {
  name: string;
  amount: number;
  color: string;
}

const ICE_OPTIONS: { id: IceType; label: string; emoji: string }[] = [
  { id: null, label: 'Nessuno', emoji: '🚫' },
  { id: 'cubes', label: 'Cubetti', emoji: '🧊' },
  { id: 'crushed', label: 'Crushed', emoji: '❄️' },
  { id: 'sphere', label: 'Sfera', emoji: '⚪' },
  { id: 'stick', label: 'Stick', emoji: '➖' },
];

const GARNISH_OPTIONS = [
  'Nessuno', 'Scorza Arancia', 'Scorza Lime', 'Fetta Lime',
  'Fetta Arancia', 'Menta', 'Ciliegia', 'Ombrellino', 'Sale', 'Zucchero',
];

function blendColors(layers: SimLayer[]): string {
  if (layers.length === 0) return 'transparent';
  let r = 0, g = 0, b = 0, total = 0;
  layers.forEach(l => {
    let hex = l.color.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    r += ((num >> 16) & 255) * l.amount;
    g += ((num >> 8) & 255) * l.amount;
    b += (num & 255) * l.amount;
    total += l.amount;
  });
  return `rgba(${Math.round(r / total)}, ${Math.round(g / total)}, ${Math.round(b / total)}, 0.90)`;
}

// ── COMPONENTE CANVAS 2D ULTRA-REALISTICO ────────────────────────────────────

interface GlassCanvasProps {
  glassId: GlassId;
  layers: SimLayer[];
  ice: IceType;
  salt: boolean;
  garnish: string;
  pourColor: string | null;
  hasStraw: boolean;
  isMixed: boolean;
  isMixingAnim: boolean;
}

function GlassCanvas({
  glassId,
  layers,
  ice,
  salt,
  garnish,
  pourColor,
  hasStraw,
  isMixed,
  isMixingAnim,
}: GlassCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const mixAngleRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 280;
    const height = 340;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let wavePhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      wavePhase += 0.06;
      if (isMixingAnim) mixAngleRef.current += 0.15;

      const centerX = width / 2;
      const bottomY = height - 45;

      let topW = 60;
      let botW = 45;
      let glassH = 180;
      let stemH = 0;

      if (glassId === 'highball' || glassId === 'collins') {
        topW = 52; botW = 48; glassH = 220;
      } else if (glassId === 'coupe' || glassId === 'martini') {
        topW = 85; botW = 14; glassH = 95; stemH = 105;
      } else if (glassId === 'flute') {
        topW = 32; botW = 18; glassH = 160; stemH = 85;
      } else if (glassId === 'whisky' || glassId === 'oldfashioned') {
        topW = 62; botW = 56; glassH = 145;
      }

      const glassTopY = bottomY - glassH - stemH;
      const glassBotY = bottomY - stemH;

      // Ombra proiettata alla base
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(centerX, bottomY + 10, botW + 12, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fill();
      ctx.restore();

      const getGlassPath = () => {
        const path = new Path2D();
        path.moveTo(centerX - topW, glassTopY);
        path.lineTo(centerX - botW, glassBotY - 8);
        path.quadraticCurveTo(centerX - botW, glassBotY, centerX, glassBotY);
        path.quadraticCurveTo(centerX + botW, glassBotY, centerX + botW, glassBotY - 8);
        path.lineTo(centerX + topW, glassTopY);
        path.closePath();
        return path;
      };

      const glassPath = getGlassPath();

      // Rendering Liquido interno
      const totalVol = layers.reduce((acc, l) => acc + l.amount, 0);
      const capacity = GLASSES[glassId]?.capacity || 300;
      const fillRatio = Math.min(0.92, totalVol / capacity);

      if (totalVol > 0) {
        ctx.save();
        ctx.clip(glassPath);

        const liquidTopY = glassBotY - (glassH * fillRatio);

        if (isMixed || isMixingAnim) {
          ctx.fillStyle = blendColors(layers);
          ctx.beginPath();
          ctx.rect(centerX - topW - 20, liquidTopY, (topW + 20) * 2, glassBotY - liquidTopY);
          ctx.fill();
        } else {
          let currentY = glassBotY;
          const availableH = glassBotY - liquidTopY;

          layers.forEach((layer) => {
            const layerH = (layer.amount / totalVol) * availableH;
            const nextY = currentY - layerH;

            ctx.fillStyle = layer.color;
            ctx.beginPath();
            ctx.rect(0, nextY - 0.5, width, layerH + 1);
            ctx.fill();

            currentY = nextY;
          });
        }

        // Superficie con vortice o onda
        const surfW = botW + (topW - botW) * fillRatio;
        ctx.beginPath();
        const vortexDepth = isMixingAnim ? Math.sin(mixAngleRef.current) * 6 : 0;
        ctx.ellipse(centerX, liquidTopY + vortexDepth, surfW, 4 + Math.sin(wavePhase) * 1.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();

        // Ghiaccio immerso
        if (ice) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.lineWidth = 1.5;

          if (ice === 'cubes') {
            for (let i = 0; i < 3; i++) {
              const ix = centerX + (i - 1) * 20;
              const iy = liquidTopY + 18 + i * 10;
              if (iy < glassBotY - 12) {
                ctx.save();
                ctx.translate(ix, iy);
                ctx.rotate((i * 35 * Math.PI) / 180);
                ctx.rect(-11, -11, 22, 22);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
              }
            }
          } else if (ice === 'sphere') {
            ctx.beginPath();
            ctx.arc(centerX, liquidTopY + 28, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        }

        // Cannuccia (Immersa con rifrazione)
        if (hasStraw) {
          ctx.save();
          ctx.strokeStyle = '#e11d48';
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(centerX + 14, liquidTopY);
          ctx.lineTo(centerX - 8, glassBotY - 10);
          ctx.stroke();
          ctx.restore();
        }

        ctx.restore();
      }

      // Cannuccia (Parte superiore fuori dal liquido)
      if (hasStraw) {
        ctx.save();
        ctx.strokeStyle = '#e11d48';
        ctx.lineWidth = 4.5;
        const liquidTopY = totalVol > 0 ? glassBotY - (glassH * fillRatio) : glassBotY;
        ctx.beginPath();
        ctx.moveTo(centerX + 8, glassTopY - 22);
        ctx.lineTo(centerX + (totalVol > 0 ? 14 : 8), liquidTopY);
        ctx.moveTo(centerX + 8, glassTopY - 22);
        ctx.lineTo(centerX + 26, glassTopY - 42);
        ctx.stroke();
        ctx.restore();
      }

      // Getto di versamento
      if (pourColor) {
        ctx.save();
        ctx.fillStyle = pourColor;
        ctx.beginPath();
        const liquidTopY = totalVol > 0 ? glassBotY - (glassH * fillRatio) : glassBotY;
        ctx.rect(centerX - 2.5, 0, 5, liquidTopY);
        ctx.fill();
        ctx.restore();
      }

      // Vetro Esterno e Riflessi
      ctx.save();
      if (stemH > 0) {
        ctx.beginPath();
        ctx.moveTo(centerX, glassBotY);
        ctx.lineTo(centerX, bottomY);
        ctx.lineWidth = 5.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(centerX, bottomY, topW * 0.65, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 2.5;
      ctx.stroke(glassPath);

      // Condensa sul vetro con ghiaccio
      if (ice && totalVol > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        for (let i = 0; i < 16; i++) {
          const cx = centerX - botW + ((i * 17) % (botW * 2));
          const cy = glassBotY - ((i * 13) % (glassH * fillRatio));
          ctx.beginPath();
          ctx.arc(cx, cy, 1.2 + (i % 2), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      // Bordo Salato/Zuccherato
      if (salt) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        for (let i = 0; i < 36; i++) {
          const angle = (i / 36) * Math.PI * 2;
          const sx = centerX + Math.cos(angle) * (topW + 1);
          const sy = glassTopY + Math.sin(angle) * 3;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Guarnizioni
      if (garnish && garnish !== 'Nessuno') {
        ctx.save();
        const gx = centerX + topW - 6;
        const gy = glassTopY + 2;

        if (garnish.includes('Lime') || garnish.includes('Arancia')) {
          ctx.translate(gx, gy);
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, Math.PI * 2);
          ctx.fillStyle = garnish.includes('Lime') ? '#84cc16' : '#f97316';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (garnish === 'Menta') {
          ctx.translate(gx - 8, gy - 8);
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.ellipse(0, 0, 12, 6, -0.4, 0, Math.PI * 2);
          ctx.fill();
        } else if (garnish === 'Ciliegia') {
          ctx.translate(gx, gy + 8);
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fillStyle = '#be123c';
          ctx.fill();
        }
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [glassId, layers, ice, salt, garnish, pourColor, hasStraw, isMixed, isMixingAnim]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 280, height: 340, display: 'block', margin: '0 auto' }}
    />
  );
}

// ── COMPONENTE PRINCIPALE ───────────────────────────────────────────────────

export default function SimulatorPage() {
  const { t } = useApp();
  const [glassId, setGlassId] = useState<GlassId>('oldfashioned');
  const [layers, setLayers] = useState<SimLayer[]>([]);
  const [ice, setIce] = useState<IceType>(null);
  const [garnish, setGarnish] = useState('Nessuno');
  const [salt, setSalt] = useState(false);
  const [pour, setPour] = useState<string | null>(null);
  const [ingCat, setIngCat] = useState('Tutti');
  const [search, setSearch] = useState('');
  const [amounts, setAmounts] = useState<Record<number, number>>({});

  const [hasStraw, setHasStraw] = useState(false);
  const [isMixed, setIsMixed] = useState(false);
  const [isMixingAnim, setIsMixingAnim] = useState(false);

  // Ref per tracciare il timer del versamento continuo
  const pourIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const gDef = GLASSES[glassId];
  const stats = calcStats(layers, INGREDIENTS);
  const match = matchCocktail(layers, COCKTAILS);

  const filteredIngs = INGREDIENTS.filter(i =>
    (ingCat === 'Tutti' || i.cat === ingCat) &&
    (!search || i.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Funzione per avviare il versamento continuo
  const startPouring = (ing: typeof INGREDIENTS[0]) => {
    setPour(ing.color);

    const stepPour = () => {
      setLayers(prev => {
        const ex = prev.find(l => l.name === ing.name);
        return ex
          ? prev.map(l => l.name === ing.name ? { ...l, amount: l.amount + 1 } : l)
          : [...prev, { name: ing.name, amount: 1, color: ing.color }];
      });
    };

    // Primo versamento immediato
    stepPour();

    // Versamento continuo (1ml ogni 35ms)
    if (pourIntervalRef.current) clearInterval(pourIntervalRef.current);
    pourIntervalRef.current = setInterval(stepPour, 35);
  };

  // Funzione per fermare il versamento
  const stopPouring = () => {
    if (pourIntervalRef.current) {
      clearInterval(pourIntervalRef.current);
      pourIntervalRef.current = null;
    }
    setPour(null);
  };

  // Pulizia del timer al smontaggio del componente
  useEffect(() => {
    return () => {
      if (pourIntervalRef.current) clearInterval(pourIntervalRef.current);
    };
  }, []);

  // Aggiunta rapida della quantità specifica (singolo click sul pulsante +)
  const addIngQuick = useCallback((ing: typeof INGREDIENTS[0]) => {
    const amt = amounts[ing.id] ?? ing.ml;
    setLayers(prev => {
      const ex = prev.find(l => l.name === ing.name);
      return ex
        ? prev.map(l => l.name === ing.name ? { ...l, amount: l.amount + amt } : l)
        : [...prev, { name: ing.name, amount: amt, color: ing.color }];
    });
    setPour(ing.color);
    setTimeout(() => setPour(null), 600);
  }, [amounts]);

  const removeLayer = (name: string) => setLayers(prev => prev.filter(l => l.name !== name));
  const adjustLayer = (name: string, delta: number) =>
    setLayers(prev => prev.map(l => l.name === name ? { ...l, amount: Math.max(5, l.amount + delta) } : l));

  const handleMix = () => {
    if (layers.length === 0 || isMixingAnim) return;
    setIsMixingAnim(true);
    setTimeout(() => {
      setIsMixed(true);
      setIsMixingAnim(false);
    }, 1200);
  };

  const reset = () => {
    stopPouring();
    setLayers([]);
    setIce(null);
    setSalt(false);
    setGarnish('Nessuno');
    setHasStraw(false);
    setIsMixed(false);
  };

  const pct = Math.min(100, Math.round(
    layers.reduce((s, l) => s + l.amount, 0) / (gDef.capacity * 0.88) * 100
  ));

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '90px 20px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 40, color: t.text, marginBottom: 4 }}>🧪 Laboratory</h1>
          <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 14, color: t.textMuted }}>Costruisci il tuo cocktail ingrediente per ingrediente</p>
        </div>
        <button onClick={reset} style={{ background: 'none', border: `1px solid ${t.border}`, color: t.textMuted, cursor: 'pointer', borderRadius: 8, padding: '8px 18px', fontFamily: 'Raleway, sans-serif', fontSize: 13 }}>↺ Reset</button>
      </div>

      {match && layers.length > 0 && (
        <div style={{ background: `linear-gradient(135deg,rgba(${t.goldRgb},0.15),rgba(${t.goldRgb},0.06))`, border: `1px solid rgba(${t.goldRgb},0.35)`, borderRadius: 12, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>✨</span>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: t.gold, fontWeight: 600 }}>Stai preparando un {match.name}!</div>
            <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13, color: t.textMuted }}>{match.desc}</div>
          </div>
        </div>
      )}

      <div className="sim-grid" style={{ display: 'grid', gridTemplateColumns: '260px 1fr 220px', gap: 20, alignItems: 'start' }}>
        <div>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.15em', color: t.gold, fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>Bicchiere</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {(Object.values(GLASSES)).map(g => (
                <button key={g.id} onClick={() => { setGlassId(g.id); reset(); }}
                  style={{ background: glassId === g.id ? t.goldSoft : 'none', border: `1px solid ${glassId === g.id ? t.gold : t.border}`, borderRadius: 8, padding: '8px 6px', cursor: 'pointer', color: glassId === g.id ? t.gold : t.textMuted, fontFamily: 'Raleway, sans-serif', fontSize: 11, fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, transition: 'all 0.2s' }}>
                  <span style={{ fontSize: 18 }}>{g.emoji}</span>
                  <span>{g.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.15em', color: t.gold, fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>Ingredienti</div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca..."
              style={{ width: '100%', background: t.input, border: `1px solid ${t.inpBdr}`, borderRadius: 6, padding: '7px 10px', color: t.text, fontFamily: 'Raleway, sans-serif', fontSize: 13, outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
              {['Tutti', 'Gin', 'Vodka', 'Rum', 'Whisky', 'Tequila', 'Bitter', 'Liquori', 'Succhi', 'Soft Drinks'].map(c => (
                <button key={c} onClick={() => setIngCat(c)}
                  style={{ background: ingCat === c ? t.goldSoft : 'none', border: `1px solid ${ingCat === c ? t.gold : t.border}`, borderRadius: 20, padding: '2px 8px', cursor: 'pointer', color: ingCat === c ? t.gold : t.textSub, fontFamily: 'Raleway, sans-serif', fontSize: 10, fontWeight: 500 }}>
                  {c}
                </button>
              ))}
            </div>
            <div style={{ maxHeight: 340, overflowY: 'auto' }}>
              {filteredIngs.map(ing => (
                <div key={ing.id} className="ing-row" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 4px', borderBottom: `1px solid ${t.border}`, borderRadius: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: ing.color, border: '1px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: 12, color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ing.name}</div>
                    {ing.abv > 0 && <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: 10, color: t.textSub }}>{ing.abv}% vol</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input type="number" value={amounts[ing.id] ?? ing.ml} min={5} max={250} step={5}
                      onChange={e => setAmounts(prev => ({ ...prev, [ing.id]: +e.target.value }))}
                      style={{ width: 34, background: t.input, border: `1px solid ${t.inpBdr}`, borderRadius: 4, padding: '2px 3px', color: t.gold, fontFamily: 'Raleway, sans-serif', fontSize: 11, textAlign: 'center', outline: 'none' }} />
                    
                    {/* Pulsante per aggiunta rapida (click) */}
                    <button onClick={() => addIngQuick(ing)} title="Aggiungi quantità impostata" style={{ background: t.goldSoft, border: `1px solid ${t.gold}`, borderRadius: 4, padding: '3px 6px', cursor: 'pointer', color: t.gold, fontSize: 13, lineHeight: 1, fontWeight: 600, flexShrink: 0 }}>+</button>

                    {/* Pulsante per Versamento Continuo (Pressione prolungata su Mobile / Mouse) */}
                    <button
                      onPointerDown={(e) => {
                        e.preventDefault();
                        startPouring(ing);
                      }}
                      onPointerUp={stopPouring}
                      onPointerLeave={stopPouring}
                      onPointerCancel={stopPouring}
                      title="Tieni premuto per versare a flusso continuo"
                      style={{
                        background: t.goldSoft,
                        border: `1px solid ${t.gold}`,
                        borderRadius: 4,
                        padding: '3px 6px',
                        cursor: 'pointer',
                        color: t.gold,
                        fontSize: 11,
                        lineHeight: 1,
                        fontWeight: 600,
                        flexShrink: 0,
                        touchAction: 'none',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                      }}
                    >
                      🧪
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <GlassCanvas
            glassId={glassId}
            layers={layers}
            ice={ice}
            salt={salt}
            garnish={garnish}
            pourColor={pour}
            hasStraw={hasStraw}
            isMixed={isMixed}
            isMixingAnim={isMixingAnim}
          />

          <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 280 }}>
            <button
              onClick={handleMix}
              disabled={layers.length < 2 || isMixed || isMixingAnim}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: isMixed ? t.goldSoft : t.card,
                border: `1px solid ${t.gold}`,
                borderRadius: 8,
                color: t.gold,
                fontSize: 12,
                fontWeight: 600,
                cursor: layers.length < 2 || isMixed ? 'not-allowed' : 'pointer',
                opacity: layers.length < 2 ? 0.5 : 1,
              }}
            >
              {isMixingAnim ? 'Mescolando...' : isMixed ? '✓ Miscelato' : '🥄 Mischia'}
            </button>

            <button
              onClick={() => setHasStraw(prev => !prev)}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: hasStraw ? t.goldSoft : t.card,
                border: `1px solid ${hasStraw ? t.gold : t.border}`,
                borderRadius: 8,
                color: hasStraw ? t.gold : t.textMuted,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🥤 {hasStraw ? 'Togli Cannuccia' : 'Cannuccia'}
            </button>
          </div>

          <div style={{ width: 280 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, color: t.textSub }}>Capienza</span>
              <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, color: t.gold, fontWeight: 600 }}>{pct}%</span>
            </div>
            <div style={{ height: 4, background: `rgba(${t.goldRgb},0.12)`, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,${t.copper},${t.gold})`, borderRadius: 2, transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {layers.length > 0 && (
            <div style={{ width: '100%', maxWidth: 300 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.15em', color: t.gold, fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10, textAlign: 'center' }}>Composizione</div>
              {layers.map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, marginBottom: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, border: '1px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontFamily: 'Raleway, sans-serif', fontSize: 13, color: t.text }}>{l.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button onClick={() => adjustLayer(l.name, -5)} style={{ background: t.input, border: `1px solid ${t.border}`, borderRadius: 3, width: 20, height: 20, cursor: 'pointer', color: t.textMuted, fontSize: 14, lineHeight: 1 }}>−</button>
                    <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 12, color: t.gold, minWidth: 36, textAlign: 'center', fontWeight: 600 }}>{l.amount}ml</span>
                    <button onClick={() => adjustLayer(l.name, 5)} style={{ background: t.input, border: `1px solid ${t.border}`, borderRadius: 3, width: 20, height: 20, cursor: 'pointer', color: t.textMuted, fontSize: 14, lineHeight: 1 }}>+</button>
                    <button onClick={() => removeLayer(l.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textSub, fontSize: 14, marginLeft: 2, padding: 0, lineHeight: 1 }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.15em', color: t.gold, fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>Ghiaccio</div>
            {ICE_OPTIONS.map(i => (
              <button key={String(i.id)} onClick={() => setIce(i.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: ice === i.id ? t.goldSoft : 'none', border: `1px solid ${ice === i.id ? t.gold : t.border}`, borderRadius: 7, padding: '7px 10px', cursor: 'pointer', marginBottom: 5, color: ice === i.id ? t.gold : t.textMuted, fontFamily: 'Raleway, sans-serif', fontSize: 13, fontWeight: ice === i.id ? 600 : 400, transition: 'all 0.2s' }}>
                <span style={{ fontSize: 16 }}>{i.emoji}</span> {i.label}
              </button>
            ))}
          </div>

          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.15em', color: t.gold, fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>Guarnizione</div>
            <select value={garnish} onChange={e => setGarnish(e.target.value)}
              style={{ width: '100%', background: t.input, border: `1px solid ${t.inpBdr}`, borderRadius: 6, padding: '8px 10px', color: t.text, fontFamily: 'Raleway, sans-serif', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
              {GARNISH_OPTIONS.map(g => <option key={g} value={g} style={{ background: '#1a1025' }}>{g}</option>)}
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginTop: 10 }}>
              <input type="checkbox" checked={salt} onChange={e => setSalt(e.target.checked)} style={{ accentColor: t.gold }} />
              <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13, color: t.textMuted }}>Bordo Salato / Zuccherato</span>
            </label>
          </div>

          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.15em', color: t.gold, fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>Statistiche</div>
            {([
              ['Volume', `${stats.vol} ml / ${gDef.capacity} ml`],
              ['ABV', `${stats.abv}%`],
              ['Calorie', `~${stats.cal} kcal`],
              ['Bicchiere', gDef.name],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${t.border}` }}>
                <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 12, color: t.textMuted }}>{k}</span>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, color: t.gold, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}