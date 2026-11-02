// src/app/api/cabinet/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(_req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('bar_cabinet')
    .select('ingredient_id, quantity_ml, brand, added_at')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cabinet: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { ingredientId, quantityMl, brand } = await req.json() as { ingredientId: number; quantityMl?: number; brand?: string };
  const { error } = await supabase.from('bar_cabinet').upsert({
    user_id: user.id, ingredient_id: ingredientId,
    quantity_ml: quantityMl ?? null, brand: brand ?? null,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ added: true, ingredientId });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { ingredientId } = await req.json() as { ingredientId: number };
  await supabase.from('bar_cabinet').delete()
    .eq('user_id', user.id).eq('ingredient_id', ingredientId);
  return NextResponse.json({ removed: true, ingredientId });
}
