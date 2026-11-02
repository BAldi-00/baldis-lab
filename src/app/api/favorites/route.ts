// src/app/api/favorites/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

async function getAuthUser(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

// GET /api/favorites — list user's favorites
export async function GET(_req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('favorites')
    .select('cocktail_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ favorites: data ?? [] });
}

// POST /api/favorites — add a favorite  { cocktailId: number }
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { cocktailId } = await req.json() as { cocktailId: number };
  if (!cocktailId) return NextResponse.json({ error: 'cocktailId required' }, { status: 400 });

  const { error } = await supabase
    .from('favorites')
    .upsert({ user_id: user.id, cocktail_id: cocktailId });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ favorited: true, cocktailId });
}

// DELETE /api/favorites — remove a favorite  { cocktailId: number }
export async function DELETE(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { cocktailId } = await req.json() as { cocktailId: number };
  await supabase.from('favorites').delete()
    .eq('user_id', user.id).eq('cocktail_id', cocktailId);

  return NextResponse.json({ favorited: false, cocktailId });
}
