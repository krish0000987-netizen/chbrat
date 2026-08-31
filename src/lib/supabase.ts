import { createClient } from '@supabase/supabase-js';

// Vite exposes only VITE_ prefixed vars to browser
const _url = (import.meta as any).env.VITE_SUPABASE_URL as string | undefined
  || (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const _anonKey = ((import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)
  || ((import.meta as any).env.VITE_SUPABASE_ANON_KEY as string | undefined);

const url = _url || 'https://rvfnauieyvomeftwrbxn.supabase.co';
const anonKey = _anonKey || 'sb_publishable__o0ts74iGN8rnOJd0Y_mEA_YFXHlUkT';

if (!_url || !_anonKey) {
  console.warn('[supabase] Missing VITE env — using built-in publishable key fallback');
}

export const supabase = createClient(url, anonKey);

// Server-side helper using @supabase/server (Node/Edge)
// Usage in Edge Functions: import { createServerClient } from '@supabase/server'
export async function getSupabaseServerClient() {
  // For Vite dev, fallback to same client with secret if available (server-only)
  // In real Edge Functions, env is injected automatically - no install needed
  try {
    // dynamic import to avoid bundling secret in client
    const mod = await import('@supabase/server' as any);
    return mod;
  } catch {
    return null;
  }
}
