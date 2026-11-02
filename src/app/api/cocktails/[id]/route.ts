// src/app/api/cocktails/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCocktailById } from '@/lib/data';

export const revalidate = 3600;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const cocktailId = parseInt(id, 10);

  if (isNaN(cocktailId)) {
    return NextResponse.json(
      { error: 'ID non valido.' },
      { status: 400 }
    );
  }

  const cocktail = getCocktailById(cocktailId);

  if (!cocktail) {
    return NextResponse.json(
      { error: 'Cocktail non trovato.' },
      { status: 404 }
    );
  }

  return NextResponse.json(cocktail);
}
