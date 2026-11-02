// src/app/api/cocktails/route.ts
// GET /api/cocktails?q=negroni&category=Classic&minAbv=20&page=1&limit=20
import { NextRequest, NextResponse } from 'next/server';
import { COCKTAILS } from '@/lib/data';

export const revalidate = 3600; // ISR: revalidate every hour

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const q          = (searchParams.get('q') ?? '').toLowerCase();
  const category   = searchParams.get('category') ?? '';
  const minAbv     = searchParams.get('minAbv')     ? +searchParams.get('minAbv')!  : null;
  const maxAbv     = searchParams.get('maxAbv')     ? +searchParams.get('maxAbv')!  : null;
  const difficulty = searchParams.get('difficulty') ? +searchParams.get('difficulty')! : null;
  const tags       = searchParams.getAll('tags');
  const page       = +(searchParams.get('page')  ?? 1);
  const limit      = +(searchParams.get('limit') ?? 20);
  const offset     = (page - 1) * limit;

  // Filter in-memory (Sprint 7: move to Supabase .rpc('search_cocktails', ...) for scale)
  const filtered = COCKTAILS.filter(c => {
    if (q       && !c.name.toLowerCase().includes(q) && !c.tags.some(t => t.includes(q))) return false;
    if (category && c.cat !== category)                    return false;
    if (minAbv !== null && c.abv < minAbv)                 return false;
    if (maxAbv !== null && c.abv > maxAbv)                 return false;
    if (difficulty && c.diff !== difficulty)                return false;
    if (tags.length && !tags.every(t => c.tags.includes(t))) return false;
    return true;
  });

  return NextResponse.json({
    cocktails: filtered.slice(offset, offset + limit),
    total:     filtered.length,
    page,
    limit,
    hasMore:   offset + limit < filtered.length,
  });
}
