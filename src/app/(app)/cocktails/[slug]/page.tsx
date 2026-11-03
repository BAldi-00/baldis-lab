// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Cocktail Detail Page (SSG)
// src/app/(app)/cocktails/[slug]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCocktailBySlug, COCKTAILS, slugifyName } from '@/lib/data';
import CocktailDetailClient from './CocktailDetailClient';

export const dynamicParams = false;

/** Pre-render one page per cocktail at build time */
export function generateStaticParams() {
  return COCKTAILS.map(c => ({ slug: slugifyName(c.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCocktailBySlug(slug);
  if (!c) return { title: 'Cocktail non trovato' };
  return {
    title: `${c.name} — ricetta`,
    description: c.desc,
    alternates: { canonical: `/cocktails/${slug}` },
    openGraph: { type: 'article', title: c.name, description: c.desc },
    twitter: { card: 'summary', title: `${c.name} · Baldi's Lab`, description: c.desc },
  };
}

export default async function CocktailDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCocktailBySlug(slug);
  if (!c) notFound();

  // Google Recipe rich results (must be a <script>, not a meta tag)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: c.name,
    description: c.desc,
    prepTime: `PT${c.time}M`,
    recipeYield: '1 cocktail',
    recipeCategory: c.cat,
    keywords: c.tags.join(', '),
    recipeIngredient: c.ings.map(i => `${i.amount} ml ${i.name}`),
    recipeInstructions: [{ '@type': 'HowToStep', text: c.method }],
    nutrition: { '@type': 'NutritionInformation', calories: `${c.cal} calories` },
    author: { '@type': 'Organization', name: "Baldi's Lab" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <CocktailDetailClient cocktail={c} />
    </>
  );
}
