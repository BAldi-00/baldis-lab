// src/middleware.ts
// Runs on every request BEFORE the page renders.
// Responsibilities:
//   1. Refresh the Supabase session (required for SSR — keeps JWT fresh).
//   2. Age gate: redirect to /verify-age if the age cookie is not set.
//   3. Auth guard: redirect /cabinet and /profile to /login if not authenticated.

import { NextResponse }       from 'next/server';
import type { NextRequest }   from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Routes that require the user to be logged in
const AUTH_REQUIRED = ['/cabinet', '/profile'];

// Routes excluded from middleware entirely
const EXCLUDED_PREFIXES = [
  '/_next/static', '/_next/image',
  '/favicon.ico', '/icons/', '/og/', '/manifest.json',
  '/api/',                   // API routes handle their own auth
  '/verify-age',             // age gate itself — never redirect
  '/login',                  // login page
  '/auth/',                  // OAuth callback
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip excluded paths immediately
  if (EXCLUDED_PREFIXES.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ── 1. Supabase session refresh ────────────────────────────────────────────
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()  { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          // Mirror cookies onto the mutated request
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          // Re-create the response so the set-cookies propagate to the browser
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: call getUser() (not getSession()) to validate the JWT with the
  // Supabase server — getSession() trusts client-side storage which can be spoofed.
  const { data: { user } } = await supabase.auth.getUser();

  // ── 2. Age gate ────────────────────────────────────────────────────────────
  const ageOk = request.cookies.get('bl_age_ok')?.value === '1';
  if (!ageOk && pathname !== '/verify-age') {
    return NextResponse.redirect(new URL('/verify-age', request.url));
  }

  // ── 3. Auth guard ──────────────────────────────────────────────────────────
  if (AUTH_REQUIRED.some(p => pathname.startsWith(p)) && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  // Match everything except Next.js internals and static assets
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
