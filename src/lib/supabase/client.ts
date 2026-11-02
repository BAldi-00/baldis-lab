// src/lib/supabase/client.ts
// Re-exports for convenience — import from here or from the specific files directly.
export { getSupabaseBrowserClient } from './browser';
export { createSupabaseServerClient, createSupabaseAdminClient } from './server';
export type { Database } from '@/types/database';
