// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Runtime config flags
// src/lib/config.ts
//
// Supabase is optional: with the placeholder values from .env.example every
// Supabase call would hang on a DNS lookup for "your-project.supabase.co",
// which made each navigation wait on the middleware. We detect that case and
// run fully local (localStorage) instead.
// ─────────────────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const SUPABASE_ENABLED =
  /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(SUPABASE_URL) &&
  !SUPABASE_URL.includes('your-project') &&
  SUPABASE_KEY.length > 40 &&
  !SUPABASE_KEY.startsWith('your-');
