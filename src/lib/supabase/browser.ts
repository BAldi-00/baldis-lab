// src/lib/supabase/browser.ts
// Browser-side Supabase client — singleton pattern so only one GoTrue instance exists.
// Import this in Client Components ('use client') only.
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

let _client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (_client) return _client;
  _client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return _client;
}
