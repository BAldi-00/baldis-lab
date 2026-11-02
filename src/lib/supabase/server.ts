// src/lib/supabase/server.ts
// Server-side Supabase client for Server Components, API Routes, Server Actions.
// Must create a NEW instance per request — never cache across requests.
import { createServerClient } from '@supabase/ssr';
import { cookies }            from 'next/headers';
import { createClient }       from '@supabase/supabase-js';
import type { Database }      from '@/types/database';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Silently ignore: cookies can't be set inside RSC render.
            // The middleware handles session refresh, so this is safe.
          }
        },
      },
    }
  );
}

/** Service-role client — bypasses RLS. SERVER-ONLY. Never import in client code. */
export function createSupabaseAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,      // SECRET — never expose
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
