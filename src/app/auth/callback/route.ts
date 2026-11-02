// src/app/auth/callback/route.ts
// Handles the OAuth redirect from Google / Apple (Supabase Auth PKCE flow).
// Supabase redirects here with ?code=... after the user consents.
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get('code');
  const next  = searchParams.get('next') ?? '/home';
  const error = searchParams.get('error');

  // Handle OAuth errors (user denied access, etc.)
  if (error) {
    console.error('[auth/callback] OAuth error:', error, searchParams.get('error_description'));
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, origin));
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      console.error('[auth/callback] Exchange error:', exchangeError);
      return NextResponse.redirect(new URL('/login?error=exchange_failed', origin));
    }
  }

  // Set the age-gate cookie (if they logged in, they've implicitly confirmed they're 18+
  // because the login page requires ticking an age confirmation checkbox)
  const response = NextResponse.redirect(new URL(next, origin));
  response.cookies.set('bl_age_ok', '1', {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: false,             // accessible by JS for the AgeGate component check
    sameSite: 'lax',
  });
  return response;
}
