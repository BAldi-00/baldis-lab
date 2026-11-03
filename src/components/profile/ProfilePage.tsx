// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Profile
// src/components/profile/ProfilePage.tsx
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import Link from 'next/link';
import { CocktailCard, CocktailRow } from '@/components/cocktail/CocktailCard';
import { Icon } from '@/components/ui/Icon';
import { useApp } from '@/context/AppContext';
import { COCKTAILS, getCocktailById } from '@/lib/data';
import type { Cocktail } from '@/lib/data';

export function ProfilePage() {
  const { user, favorites, ratings, history, cabinet, logout, openAuth } = useApp();
  const favs  = COCKTAILS.filter(c => favorites.has(c.id));
  const rated = COCKTAILS.filter(c => ratings[c.id]).sort((a, b) => ratings[b.id] - ratings[a.id]);
  const seen  = history.slice(0, 8).map(getCocktailById).filter((c): c is Cocktail => Boolean(c));
  const vals  = Object.values(ratings);
  const avg   = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '—';

  return (
    <div className="wrap pb-10 pt-10">
      <header className="flex flex-wrap items-center gap-5">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent font-display text-3xl uppercase text-on-accent">
          {user ? user.displayName.slice(0, 1) : <Icon name="user" size={26} />}
        </span>
        <div className="flex-1">
          <h1 className="font-display text-4xl sm:text-5xl">{user ? user.displayName : 'Il tuo profilo'}</h1>
          <p className="text-sm text-muted">{user ? user.email : 'Stai navigando come ospite: i dati sono salvati in questo browser.'}</p>
        </div>
        {user
          ? <button onClick={logout} className="btn-ghost"><Icon name="logout" size={16} /> Esci</button>
          : <button onClick={openAuth} className="btn-primary">Accedi</button>}
      </header>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {([['Preferiti', favorites.size], ['Valutati', vals.length], ['Media voti', avg], ['Nel bar', cabinet.size]] as const).map(([k, v]) => (
          <div key={k} className="card p-5">
            <div className="stat-label">{k}</div>
            <div className="mt-1 font-display text-4xl">{v}</div>
          </div>
        ))}
      </div>

      {seen.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-3xl">Visti di recente</h2>
          <div className="no-scrollbar mt-5 flex gap-3 overflow-x-auto pb-2">
            {seen.map(c => <div key={c.id} className="w-64 shrink-0"><CocktailRow cocktail={c} /></div>)}
          </div>
        </section>
      )}

      <section className="mt-14">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-3xl">Preferiti</h2>
          {favs.length > 4 && <Link href="/cocktails?cat=Preferiti" className="btn-quiet text-sm">Vedi tutti <Icon name="arrow" size={15} /></Link>}
        </div>
        {favs.length ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {favs.slice(0, 4).map(c => <CocktailCard key={c.id} cocktail={c} />)}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">Nessun preferito. <Link href="/cocktails" className="text-accent hover:underline">Sfoglia le ricette</Link> e tocca il cuore.</p>
        )}
      </section>

      {rated.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-3xl">Le tue valutazioni</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {rated.map(c => (
              <CocktailRow key={c.id} cocktail={c} note={<span className="text-accent">{'★'.repeat(ratings[c.id])}<span className="text-line/20">{'★'.repeat(5 - ratings[c.id])}</span></span>} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
