// src/middleware.ts
// Runs on every page request BEFORE the page renders, so it must stay cheap.
// Responsibilities:
//   1. Age gate: redirect to /verify-age if the age cookie is not set.
//   2. Refresh the Supabase session — only when Supabase is configured AND the
//      visitor actually has a Supabase auth cookie. Guests never pay for a
//      network round-trip here (this used to run getUser() on every request,
//      even with placeholder credentials, which was the main source of lag).

import { NextResponse }       from 'next/server';
import type { NextRequest }   from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_ENABLED }   from '@/lib/config';

// Routes reachable without the age cookie
const AGE_EXEMPT = ['/verify-age', '/auth/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Age gate ────────────────────────────────────────────────────────────
  const ageOk = request.cookies.get('bl_age_ok')?.value === '1';
  if (!ageOk && !AGE_EXEMPT.some(p => pathname.startsWith(p))) {
    const url = new URL('/verify-age', request.url);
    if (pathname !== '/' && pathname !== '/home') url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // ── 2. Supabase session refresh (logged-in users only) ─────────────────────
  const hasAuthCookie = request.cookies.getAll().some(c => c.name.startsWith('sb-'));
  if (!SUPABASE_ENABLED || !hasAuthCookie) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  await supabase.auth.getUser();
  return response;
}

export const config = {
  // Pages only: skip Next internals, API routes and any file with an extension
  // (sw.js, workbox, manifest, icons…) so static assets are never redirected.
  matcher: ['/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$).*)'],
};
