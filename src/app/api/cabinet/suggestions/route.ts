// src/app/api/cabinet/suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const revalidate = 300; // cache 5 min per user

export async function GET(_req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ suggestions: [] });

  const { data, error } = await supabase
    .from('v_cabinet_suggestions')
    .select('cocktail_id, name, glass_type, abv, completeness_pct')
    .eq('user_id', user.id)
    .order('completeness_pct', { ascending: false })
    .limit(10);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ suggestions: data ?? [] });
}
