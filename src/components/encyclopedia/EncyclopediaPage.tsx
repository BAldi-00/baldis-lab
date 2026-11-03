// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Encyclopedia
// src/components/encyclopedia/EncyclopediaPage.tsx
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Glass } from '@/components/glass/Glass';
import { GLASSES, COCKTAILS } from '@/lib/data';
import type { GlassId } from '@/lib/data';

type Tab = 'ingredienti' | 'tecniche' | 'bicchieri';

const ENC_INGREDIENTS = [
  { name: 'Campari',        cat: 'Bitter',            origin: 'Milano, 1860',     abv: 25,   color: '#C0392B', desc: 'Bitter italiano con un blend segreto di erbe e frutti. Intenso, amaro, iconico.', notes: 'Rabarbaro, arancia amara, vaniglia, erbe' },
  { name: 'Aperol',         cat: 'Bitter',            origin: 'Padova, 1919',     abv: 11,   color: '#E67E22', desc: 'Il bitter più leggero d’Italia: arancia, rabarbaro e genziana in equilibrio.', notes: 'Arancia, rabarbaro, genziana, china' },
  { name: 'Gin London Dry', cat: 'Gin',               origin: 'Londra, 1800',     abv: 40,   color: '#cfe3f5', desc: 'Il classico gin inglese. Ginepro dominante, base di innumerevoli cocktail.', notes: 'Ginepro, coriandolo, angelica, agrumi' },
  { name: 'Bourbon',        cat: 'Whisky',            origin: 'Kentucky, 1800',   abv: 45,   color: '#C07830', desc: 'Whisky americano da almeno 51% di mais, invecchiato in botti nuove tostate.', notes: 'Vaniglia, caramello, rovere tostato, spezie' },
  { name: 'Tequila Blanco', cat: 'Tequila',           origin: 'Jalisco, Messico', abv: 38,   color: '#f2ecc4', desc: '100% agave blu, imbottigliata subito dopo la distillazione. Fresca ed erbacea.', notes: 'Agave cotta, pepe verde, agrumi' },
  { name: 'Vermut Rosso',   cat: 'Vino aromatizzato', origin: 'Torino, 1786',     abv: 16,   color: '#8B2020', desc: 'Vino aromatizzato con erbe, radici e spezie. L’anima del Negroni e del Manhattan.', notes: 'Artemisia, vaniglia, caramello, spezie' },
  { name: 'Rum Bianco',     cat: 'Rum',               origin: 'Caraibi, 1600',    abv: 37.5, color: '#f3eedd', desc: 'Rum giovane e vivace. Base di Daiquiri, Mojito e Cuba Libre.', notes: 'Canna da zucchero, cocco, frutta tropicale' },
  { name: 'Kahlúa',         cat: 'Liquore al caffè',  origin: 'Messico, 1936',    abv: 20,   color: '#3a1a08', desc: 'Il liquore al caffè per eccellenza. Indispensabile nell’Espresso Martini.', notes: 'Arabica, vaniglia, zucchero di canna' },
];

const TECHNIQUES = [
  { name: 'Shake',         desc: 'Agitazione energica nello shaker con ghiaccio, 10–15 secondi. Raffredda, diluisce (~25%) e aera. Per drink con succhi, sciroppi, panna o uovo.' },
  { name: 'Stir',          desc: 'Mescolatura nel mixing glass con il bar spoon, 20–30 secondi. Diluisce ~20% mantenendo il drink limpido e setoso. Per cocktail di soli distillati.' },
  { name: 'Build',         desc: 'Costruzione direttamente nel bicchiere di servizio, ghiaccio prima e top di soda per ultimo. Gin Tonic, Cuba Libre, Spritz.' },
  { name: 'Muddle',        desc: 'Pestare frutta, erbe o zucchero per estrarre oli ed essenze. Con la menta premi appena: se la strappi diventa amara.' },
  { name: 'Double strain', desc: 'Filtrare con lo strainer dello shaker e un colino fine insieme, per eliminare schegge di ghiaccio e polpa.' },
  { name: 'Dry shake',     desc: 'Shakerare senza ghiaccio per emulsionare l’albume, poi di nuovo con ghiaccio. Schiuma densa e stabile.' },
  { name: 'Float',         desc: 'Versare lentamente sul dorso di un cucchiaio per far galleggiare un liquido meno denso sopra un altro.' },
  { name: 'Flame',         desc: 'Spremere una scorza d’arancia vicino a una fiamma sopra il drink: gli oli caramellano e profumano la superficie.' },
];

export function EncyclopediaPage() {
  const [tab, setTab] = useState<Tab>('ingredienti');
  const glasses = Object.values(GLASSES);

  return (
    <div className="wrap pb-10 pt-10">
      <div className="eyebrow">Conoscenza</div>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Enciclopedia</h1>
      <p className="mt-3 max-w-xl text-muted">Quello che un bartender sa prima ancora di prendere lo shaker.</p>

      <div className="mt-8 flex gap-1.5" role="tablist">
        {(['ingredienti', 'tecniche', 'bicchieri'] as Tab[]).map(t => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} data-active={tab === t} className="chip px-5 py-2 capitalize">{t}</button>
        ))}
      </div>

      {tab === 'ingredienti' && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ENC_INGREDIENTS.map(ing => (
            <article key={ing.name} className="card p-6">
              <div className="flex items-center justify-between">
                <span className="h-10 w-10 rounded-full ring-1 ring-white/15" style={{ background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,.5), ${ing.color} 45%)` }} />
                <span className="text-sm font-semibold text-accent">{ing.abv}%</span>
              </div>
              <h3 className="mt-5 font-display text-2xl">{ing.name}</h3>
              <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">{ing.cat} · {ing.origin}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{ing.desc}</p>
              <p className="mt-4 border-t border-line/[0.07] pt-3 text-sm italic text-text/80">{ing.notes}</p>
            </article>
          ))}
        </div>
      )}

      {tab === 'tecniche' && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {TECHNIQUES.map((t, i) => (
            <article key={t.name} className="card flex gap-5 p-6">
              <span className="font-display text-4xl text-accent/70">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="font-display text-2xl">{t.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{t.desc}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === 'bicchieri' && (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {glasses.map(g => {
            const count = COCKTAILS.filter(c => c.glass === g.id).length;
            return (
              <article key={g.id} className="card flex flex-col p-5">
                <Glass glass={g.id as GlassId} layers={[]} capacity={g.capacity} className="mx-auto h-40 w-full" title={g.name} />
                <h3 className="mt-3 font-display text-2xl">{g.name}</h3>
                <div className="text-xs text-muted">{g.capacity} ml</div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{g.description}</p>
                {count > 0 && (
                  <Link href={`/simulator`} className="mt-3 text-xs font-semibold text-accent">{count} ricette lo usano</Link>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
