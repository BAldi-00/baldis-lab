// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Home Page
// src/components/home/HomePage.tsx
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { CocktailArt }  from '@/components/cocktail/CocktailArt';
import { CocktailCard } from '@/components/cocktail/CocktailCard';
import { Icon }         from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import { COCKTAILS, GLASSES, COCKTAIL_CATEGORIES, getCocktailById } from '@/lib/data';

const FEATURED_IDS = [1, 5, 3, 6, 2, 9, 8, 4];

const TOOLS: { icon: IconName; title: string; desc: string; href: string; cta: string }[] = [
  { icon: 'flask',   title: 'Laboratorio', href: '/simulator', cta: 'Apri il Lab',
    desc: 'Versa, mescola, shakera. Livelli calcolati sul volume reale del bicchiere, ABV con diluizione, riconoscimento automatico della ricetta.' },
  { icon: 'sparkle', title: 'AI Bartender', href: '/ai', cta: 'Chiedi',
    desc: 'Dimmi cosa hai in frigo o che serata vuoi: ti propongo il drink giusto, con dosi e tecnica.' },
  { icon: 'cabinet', title: 'Il mio bar', href: '/cabinet', cta: 'Organizza',
    desc: 'Segna le bottiglie che hai: vedi subito cosa puoi preparare e cosa ti manca per il prossimo.' },
];

export default function HomePage() {
  const hero = getCocktailById(1)!;
  const featured = FEATURED_IDS.map(id => getCocktailById(id)!).filter(Boolean);
  const categories = COCKTAIL_CATEGORIES.filter(c => c !== 'Tutti' && c !== 'Preferiti');

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="wrap grid items-center gap-10 pb-16 pt-10 md:grid-cols-[1.1fr_1fr] md:pt-16 lg:gap-16">
        <div className="animate-fade-up">
          <div className="eyebrow">Laboratorio digitale di mixology</div>
          <h1 className="mt-5 font-display text-[clamp(52px,8vw,104px)] font-light leading-[0.92] tracking-[-0.02em]">
            Il bancone<br />
            è <em className="font-normal italic text-accent">tuo</em>.
          </h1>
          <p className="mt-7 max-w-[34rem] text-[17px] leading-relaxed text-muted">
            {COCKTAILS.length} ricette classiche e contemporanee, un simulatore che rispetta la fisica
            del bicchiere e un bartender AI sempre disponibile.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/simulator" className="btn-primary px-6 py-3">
              <Icon name="flask" size={17} /> Apri il Laboratorio
            </Link>
            <Link href="/cocktails" className="btn-ghost px-6 py-3">Sfoglia le ricette</Link>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line/10 pt-6">
            {[
              [String(COCKTAILS.length), 'ricette'],
              [String(Object.keys(GLASSES).length), 'bicchieri'],
              ['6', 'temi'],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-4xl">{v}</dd>
                <dd className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Link href="/cocktails/negroni" className="group relative mx-auto block w-full max-w-[460px]">
          <CocktailArt cocktail={hero} className="aspect-[4/5] w-full rounded-[28px] border border-line/10" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between rounded-2xl bg-black/45 p-4 text-white">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">Firenze, {hero.year}</div>
              <div className="font-display text-3xl">{hero.name}</div>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:translate-x-1">
              <Icon name="arrow" />
            </span>
          </div>
        </Link>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <section className="wrap">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {categories.map(c => (
            <Link key={c} href={`/cocktails?cat=${encodeURIComponent(c)}`} className="chip">{c}</Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED ─────────────────────────────────────────────────────── */}
      <section className="wrap mt-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Selezione</div>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">I grandi classici</h2>
          </div>
          <Link href="/cocktails" className="btn-quiet hidden sm:inline-flex">Tutte le ricette <Icon name="arrow" size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {featured.map((c, i) => <CocktailCard key={c.id} cocktail={c} priority={i < 4} />)}
        </div>
      </section>

      {/* ── TOOLS ────────────────────────────────────────────────────────── */}
      <section className="wrap mt-24">
        <div className="eyebrow">Strumenti</div>
        <h2 className="mt-2 max-w-xl font-display text-4xl sm:text-5xl">Tutto quello che serve dietro il bancone</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TOOLS.map((f, i) => (
            <Link key={f.href} href={f.href} className="card card-hover group flex flex-col p-7">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent"><Icon name={f.icon} size={22} /></span>
                <span className="font-display text-sm text-muted">0{i + 1}</span>
              </div>
              <h3 className="mt-6 font-display text-3xl">{f.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{f.desc}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                {f.cta} <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
