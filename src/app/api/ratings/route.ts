// src/app/api/ratings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

// POST /api/ratings  { cocktailId: number, stars: 0-5, review?: string }
// stars = 0 → delete rating
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { cocktailId, stars, review } = await req.json() as { cocktailId: number; stars: number; review?: string };
  if (stars < 0 || stars > 5) return NextResponse.json({ error: 'stars must be 0-5' }, { status: 400 });

  if (stars === 0) {
    await supabase.from('ratings').delete()
      .eq('user_id', user.id).eq('cocktail_id', cocktailId);
    return NextResponse.json({ rated: false, cocktailId });
  }

  const { error } = await supabase.from('ratings').upsert({
    user_id: user.id, cocktail_id: cocktailId, stars, review: review ?? null,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ rated: true, stars, cocktailId });
}

// GET /api/ratings — all ratings for the current user
export async function GET(_req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('ratings').select('cocktail_id, stars, review, updated_at')
    .eq('user_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ratings: data ?? [] });
}
