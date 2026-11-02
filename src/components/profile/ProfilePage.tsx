// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Secondary Pages
// src/components/encyclopedia/EncyclopediaPage.tsx
// src/components/cabinet/CabinetPage.tsx
// src/components/profile/ProfilePage.tsx
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useState }     from 'react';
import { useRouter }    from 'next/navigation';
import { GlassSVG }     from '@/components/glass/GlassSVG';
import { MiniGlass }    from '@/components/glass/GlassSVG';
import { CocktailCard } from '@/components/cocktail/CocktailCard';
import { useApp }       from '@/context/AppContext';
import { GLASSES, INGREDIENTS, COCKTAILS } from '@/lib/data';
import type { Cocktail } from '@/lib/data';

// ══════════════════════════════════════════════════════════════════════════════
// ENCYCLOPEDIA PAGE
// ══════════════════════════════════════════════════════════════════════════════

type EncTab = 'ingredienti' | 'tecniche' | 'bicchieri';

const ENC_INGREDIENTS = [
  { name:'Campari',       cat:'Bitter',            origin:'Milano, 1860',  abv:25, color:'#C0392B', desc:'Bitter italiano con blend segreto di erbe e frutti. Intenso, amaro, iconico.', notes:'Rabarbaro, arancia, vaniglia, erbe aromatiche' },
  { name:'Aperol',        cat:'Bitter',            origin:'Padova, 1919',  abv:11, color:'#E67E22', desc:'Il bitter più leggero d\'Italia. Arancio, rabarbaro e genziana in perfetto equilibrio.', notes:'Arancia, rabarbaro, genziana, chinchona' },
  { name:'Gin London Dry',cat:'Gin',               origin:'Londra, 1800s', abv:40, color:'rgba(210,235,255,0.6)', desc:'Il classico gin inglese. Ginepro dominante, la base di innumerevoli cocktail.', notes:'Ginepro, coriandolo, angelica, scorza di agrumi' },
  { name:'Bourbon',       cat:'Whisky',            origin:'Kentucky, 1800s',abv:45, color:'#C07830', desc:'Whisky americano prodotto con almeno il 51% di mais. Dolce, caldo, vanigliato.', notes:'Vaniglia, caramello, quercia tostata, spezie dolci' },
  { name:'Tequila Blanco',cat:'Tequila',           origin:'Jalisco, Messico',abv:38,color:'rgba(255,248,200,0.55)',desc:'100% agave blu, imbottigliata subito dopo la distillazione. Fresca e erbacea.', notes:'Agave, pepe verde, agrumi, erbaceo, terroso' },
  { name:'Vermut Rosso',  cat:'Vino Aromatizzato', origin:'Torino, 1786',  abv:16, color:'#8B2020', desc:'Vino aromatizzato con erbe, radici e spezie. L\'ingrediente segreto del Negroni.', notes:'Artemisia, vaniglia, caramello, spezie orientali' },
  { name:'Rum Bianco',    cat:'Rum',               origin:'Caraibi, 1600s',abv:37.5,color:'rgba(255,248,225,0.5)',desc:'Rum trasparente, giovane e vivace. La base di Daiquiri, Mojito e Cuba Libre.', notes:'Canna da zucchero, cocco, frutta tropicale, dolce' },
  { name:'Kahlúa',        cat:'Liquore al Caffè',  origin:'Messico, 1936', abv:20, color:'#1A0800', desc:'Il liquore al caffè messicano per eccellenza. Perfetto nell\'Espresso Martini.', notes:'Caffè arabica, vaniglia, zucchero di canna, cioccolato' },
];

const TECHNIQUES = [
  { name:'Shaking',     icon:'🤝', desc:'Agitazione energica in shaker con ghiaccio. Raffredda, diluisce e aera il cocktail. Ideale per drink con succhi, sciroppi o panna.' },
  { name:'Stirring',    icon:'🔄', desc:'Mescolatura delicata con cucchiaino da bar su ghiaccio. Per cocktail "all spirit" che richiedono limpidezza e texture setosa.' },
  { name:'Muddling',    icon:'🪵', desc:'Pestatura di frutta, erbe aromatiche o zucchero per estrarne aromi ed essenze. Base del Mojito e Caipirinha.' },
  { name:'Building',    icon:'🏗️', desc:'Costruzione diretta nel bicchiere di servizio. Per cocktail semplici come Gin Tonic, Cuba Libre, Americano.' },
  { name:'Double Strain',icon:'🫗',desc:'Filtraggio doppio per cocktail shakerati, usando sia il colino dello shaker che un colino fine. Rimuove tutti i frammenti di ghiaccio e polpa.' },
  { name:'Dry Shake',   icon:'💨', desc:'Agitazione energica senza ghiaccio per emulsionare ingredienti proteici come l\'albume d\'uovo. Crea schiuma densa e cremosa.' },
  { name:'Float',       icon:'🌊', desc:'Versamento delicato di un ingrediente sopra un altro senza mescolare, usando il dorso di un cucchiaio. Crea effetti visivi stratificati.' },
  { name:'Flaming',     icon:'🔥', desc:'Tecnica spettacolare di fiammata della scorza di agrumi per caramellare gli oli essenziali. Aggiunge note tostate al cocktail.' },
];

interface EncyclopediaPageProps { t?: never }

export function EncyclopediaPage(_: EncyclopediaPageProps) {
  const { t } = useApp();
  const [tab, setTab] = useState<EncTab>('ingredienti');

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '90px 20px 60px' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 40, color: t.text, marginBottom: 8 }}>📚 Enciclopedia</h1>
      <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 14, color: t.textMuted, marginBottom: 28 }}>La conoscenza del bartender professionista</p>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {(['ingredienti', 'tecniche', 'bicchieri'] as EncTab[]).map(tb => (
          <button key={tb} onClick={() => setTab(tb)}
            style={{ background: tab === tb ? t.goldSoft : 'none', border: `1px solid ${tab === tb ? t.gold : t.border}`, borderRadius: 8, padding: '8px 20px', cursor: 'pointer', color: tab === tb ? t.gold : t.textMuted, fontFamily: 'Raleway, sans-serif', fontSize: 13, fontWeight: tab === tb ? 600 : 400, textTransform: 'capitalize', letterSpacing: '0.04em', transition: 'all 0.2s' }}>
            {tb}
          </button>
        ))}
      </div>

      {/* Ingredienti */}
      {tab === 'ingredienti' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 18 }}>
          {ENC_INGREDIENTS.map(ing => (
            <div key={ing.name} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22, borderLeft: `3px solid ${ing.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: ing.color, flexShrink: 0 }} />
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, color: t.text, flex: 1 }}>{ing.name}</h3>
                <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, color: t.gold, background: t.tag, padding: '2px 8px', borderRadius: 10 }}>{ing.abv}%</span>
              </div>
              <div style={{ fontSize: 10, color: t.textSub, fontFamily: 'Raleway, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{ing.cat} · {ing.origin}</div>
              <p style={{ fontSize: 13, color: t.textMuted, fontFamily: 'Raleway, sans-serif', lineHeight: 1.65, marginBottom: 10 }}>{ing.desc}</p>
              <div style={{ fontSize: 12, color: t.gold, fontFamily: 'Raleway, sans-serif', fontStyle: 'italic' }}>🌿 {ing.notes}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tecniche */}
      {tab === 'tecniche' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
          {TECHNIQUES.map(tc => (
            <div key={tc.name} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{tc.icon}</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: t.text, marginBottom: 8 }}>{tc.name}</h3>
              <p style={{ fontSize: 14, color: t.textMuted, fontFamily: 'Raleway, sans-serif', lineHeight: 1.65 }}>{tc.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Bicchieri */}
      {tab === 'bicchieri' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 18 }}>
          {Object.values(GLASSES).map(g => (
            <div key={g.id} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <GlassSVG gDef={g} layers={[]} size={100} />
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: t.text, marginBottom: 4 }}>{g.name}</h3>
                <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: 12, color: t.textMuted }}>Capacità: ~{g.capacity}ml</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BAR CABINET PAGE
// ══════════════════════════════════════════════════════════════════════════════

// ── CabinetPage — no props, reads everything from context ────────────────────
export function CabinetPage() {
  const router = useRouter();
  const { t, theme, favorites, toggleFav } = useApp();
  const [owned, setOwned] = useState<Set<number>>(new Set([1,3,4,6,12,14,15,21,26,27,28]));
  const toggle = (id: number) =>
    setOwned(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  // Find cocktails makeable with owned ingredients (missing ≤ 1)
  const suggestions = COCKTAILS.filter(c => {
    const ingNames = INGREDIENTS.filter(i => owned.has(i.id)).map(i => i.name.toLowerCase());
    const hits = c.ings.filter(ci =>
      ingNames.some(n => n.includes(ci.name.toLowerCase().split(' ')[0]) || ci.name.toLowerCase().includes(n.split(' ')[0]))
    ).length;
    return hits >= c.ings.length - 1;
  }).slice(0, 4);

  const ING_CATS_LIST = ['Bitter','Gin','Vodka','Rum','Tequila','Whisky','Vino','Liquori','Succhi','Sciroppi','Soft Drinks','Altro'];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '90px 20px 60px' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 40, color: t.text, marginBottom: 8 }}>🗄 Bar Cabinet</h1>
      <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 14, color: t.textMuted, marginBottom: 28 }}>
        Gestisci il tuo bar personale · <strong style={{ color: t.gold }}>{owned.size}</strong> ingredienti disponibili
      </p>

      <div className="cabinet-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        {/* Left: Inventory */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: t.text, marginBottom: 18 }}>I miei ingredienti</h3>
          {ING_CATS_LIST.map(cat => {
            const catIngs = INGREDIENTS.filter(i => i.cat === cat);
            if (!catIngs.length) return null;
            return (
              <div key={cat} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: t.gold, fontFamily: 'Raleway, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>{cat}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {catIngs.map(i => (
                    <button key={i.id} onClick={() => toggle(i.id)}
                      style={{ background: owned.has(i.id) ? t.goldSoft : 'none', border: `1px solid ${owned.has(i.id) ? t.gold : t.border}`, borderRadius: 20, padding: '4px 12px', cursor: 'pointer', color: owned.has(i.id) ? t.gold : t.textMuted, fontFamily: 'Raleway, sans-serif', fontSize: 12, fontWeight: owned.has(i.id) ? 600 : 400, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5 }}>
                      {owned.has(i.id) && <span style={{ width: 6, height: 6, borderRadius: '50%', background: i.color, flexShrink: 0 }} />}
                      {i.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Suggestions + AI prompt */}
        <div>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: t.text, marginBottom: 4 }}>Puoi preparare</h3>
            <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13, color: t.textMuted, marginBottom: 18 }}>Cocktail realizzabili con il tuo inventario attuale</p>
            {suggestions.length > 0 ? suggestions.map(c => (
              <div key={c.id} className="cab-suggestion" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: t.input, border: `1px solid ${t.border}`, borderRadius: 10, marginBottom: 8, cursor: 'pointer', transition: 'all 0.2s' }}>
                <MiniGlass cocktail={c} gDef={GLASSES[c.glass] ?? GLASSES.oldfashioned} size={38} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: t.text }}>{c.name}</div>
                  <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: 12, color: t.textMuted }}>{c.ings.length} ingredienti · {c.abv}% vol</div>
                </div>
                <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 12, color: t.gold }}>→</span>
              </div>
            )) : (
              <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13, color: t.textMuted, fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
                Aggiungi ingredienti per ricevere suggerimenti.
              </p>
            )}
          </div>

          {/* AI CTA */}
          <div style={{ background: `linear-gradient(135deg,rgba(${t.goldRgb},0.12),rgba(${t.goldRgb},0.04))`, border: `1px solid rgba(${t.goldRgb},0.25)`, borderRadius: 14, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, color: t.text, marginBottom: 8 }}>Chiedi all'AI Bartender</h3>
            <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13, color: t.textMuted, marginBottom: 16, lineHeight: 1.65 }}>Descrivi i tuoi ingredienti e ricevi suggerimenti personalizzati.</p>
            <button onClick={() => router.push('/ai')} style={{ background: `linear-gradient(135deg,${t.copper},${t.gold})`, border: 'none', color: theme === 'day' ? '#2a1808' : '#0a0810', cursor: 'pointer', fontFamily: 'Raleway, sans-serif', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 11, padding: '11px 24px', borderRadius: 4 }}>
              Chiedi ora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROFILE PAGE
// ══════════════════════════════════════════════════════════════════════════════

interface AuthUser { email: string; displayName: string; }

// ── ProfilePage — no props, reads everything from context ────────────────────
export function ProfilePage() {
  const router = useRouter();
  const { t, user, favorites, ratings, history, logout, openModal } = useApp();
  const favCocktails   = COCKTAILS.filter(c => favorites.has(c.id));
  const ratedCocktails = COCKTAILS.filter(c => ratings[c.id]);
  const histCocktails  = history.slice(0, 8).map(id => COCKTAILS.find(c => c.id === id)).filter((c): c is Cocktail => Boolean(c));

  const avgRating = Object.values(ratings).length
    ? (Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length).toFixed(1)
    : null;

  const StatBox = ({ label, value }: { label: string; value: string | number }) => (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18, textAlign: 'center' }}>
      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, color: t.gold, fontWeight: 600 }}>{value}</div>
      <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>{label}</div>
    </div>
  );

  if (!user) return (
    <div style={{ maxWidth: 500, margin: '120px auto', padding: '0 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>🍸</div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, color: t.text, marginBottom: 12 }}>Accedi al tuo Profilo</h2>
      <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 15, color: t.textMuted, lineHeight: 1.7, marginBottom: 28 }}>
        Salva i tuoi cocktail preferiti, tieni traccia delle tue valutazioni e gestisci il tuo bar cabinet.
      </p>
    </div>
  );

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '90px 20px 60px' }}>
      {/* User header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40, flexWrap: 'wrap' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg,${t.copper},${t.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, border: `2px solid ${t.gold}` }}>
          🍸
        </div>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, color: t.text, marginBottom: 4 }}>{user.displayName}</h1>
          <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13, color: t.textMuted }}>{user.email}</div>
        </div>
        <button onClick={logout} style={{ marginLeft: 'auto', background: 'none', border: `1px solid ${t.border}`, borderRadius: 8, padding: '8px 18px', cursor: 'pointer', color: t.textMuted, fontFamily: 'Raleway, sans-serif', fontSize: 12 }}>
          Esci
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14, marginBottom: 36 }}>
        <StatBox label="Preferiti"    value={favorites.size} />
        <StatBox label="Valutati"     value={Object.keys(ratings).length} />
        <StatBox label="Visti"        value={history.length} />
        <StatBox label="Stella Media" value={avgRating ? `${avgRating}★` : '—'} />
      </div>

      {/* Recent history */}
      {histCocktails.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: t.text, marginBottom: 16 }}>Recentemente Visti</h3>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {histCocktails.map(c => (
              <div key={c.id} onClick={() => openModal(c)} className="cocktail-card" style={{ flexShrink: 0, cursor: 'pointer', background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <MiniGlass cocktail={c} gDef={GLASSES[c.glass] ?? GLASSES.oldfashioned} size={32} />
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, color: t.text }}>{c.name}</div>
                  <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, color: t.textMuted }}>{c.cat}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Favorites grid */}
      {favCocktails.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: t.text }}>♥ I Tuoi Preferiti</h3>
            <button onClick={() => router.push('/cocktails')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.gold, fontFamily: 'Raleway, sans-serif', fontSize: 13, textDecoration: 'underline' }}>Vedi tutti →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
            {favCocktails.slice(0, 4).map(c => <CocktailCard key={c.id} cocktail={c} t={t} onClick={() => openModal(c)} />)}
          </div>
        </section>
      )}

      {/* Ratings list */}
      {ratedCocktails.length > 0 && (
        <section>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: t.text, marginBottom: 16 }}>★ Le Tue Valutazioni</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ratedCocktails.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: '10px 16px' }}>
                <MiniGlass cocktail={c} gDef={GLASSES[c.glass] ?? GLASSES.oldfashioned} size={36} />
                <span style={{ flex: 1, fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: t.text }}>{c.name}</span>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: ratings[c.id] >= s ? '#FFD700' : 'rgba(255,215,0,0.2)', fontSize: 16 }}>★</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {favCocktails.length === 0 && ratedCocktails.length === 0 && histCocktails.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🍸</div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: t.textMuted, fontStyle: 'italic' }}>Inizia a esplorare i cocktail!</div>
        </div>
      )}
    </div>
  );
}
