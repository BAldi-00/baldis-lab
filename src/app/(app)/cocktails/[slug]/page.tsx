// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Cocktail Detail Page (SSG)
// src/app/(app)/cocktails/[slug]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getCocktailBySlug,
  COCKTAILS,
  slugifyName,
} from '@/lib/data';
import CocktailDetailClient from './CocktailDetailClient';

// ── STATIC GENERATION ─────────────────────────────────────────────────────────

/** Called at build time — pre-renders one page per cocktail */
export function generateStaticParams() {
  return COCKTAILS.map(c => ({ slug: slugifyName(c.name) }));
}

/** Per-page metadata for SEO */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  const c = getCocktailBySlug(slug);

  if (!c) {
    return { title: 'Cocktail non trovato' };
  }

  return {
    title: `${c.name} — Ricetta | Baldi's Lab`,
    description: c.desc,

    openGraph: {
      type: 'article',
      title: c.name,
      description: c.desc,
      images: [`/og/cocktails/${slug}.png`],
    },

    twitter: {
      card: 'summary_large_image',
      title: `${c.name} · Baldi's Lab`,
      description: c.desc,
    },

    // JSON-LD structured data → Google Recipe rich results
    other: {
      'script:ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: c.name,
        description: c.desc,
        prepTime: `PT${c.time}M`,
        recipeYield: '1 cocktail',
        recipeCategory: c.cat,
        keywords: c.tags.join(', '),
        recipeIngredient: c.ings.map(
          i => `${i.amount} ml ${i.name}`
        ),
        recipeInstructions: [
          {
            '@type': 'HowToStep',
            text: c.method,
          },
        ],
        nutrition: {
          '@type': 'NutritionInformation',
          calories: `${c.cal} calories`,
        },
        author: {
          '@type': 'Organization',
          name: "Baldi's Lab",
        },
      }),
    },
  };
}

// ── SERVER COMPONENT ──────────────────────────────────────────────────────────

export default async function CocktailDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const cocktail = getCocktailBySlug(slug);

  if (!cocktail) {
    notFound();
  }

  return <CocktailDetailClient cocktail={cocktail} />;
}
