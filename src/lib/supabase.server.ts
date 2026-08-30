// Server-only Supabase client using secret key - DO NOT import in browser components
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

// Example with @supabase/server for auth verification (Edge Functions / API routes)
// import { createServerClient } from '@supabase/server';
// export const verifyUser = async (req: Request) => {
//   const supabase = createServerClient(
//     process.env.SUPABASE_URL!,
//     process.env.SUPABASE_PUBLISHABLE_KEY!,
//     { request: req }
//   );
//   const { data: { user } } = await supabase.auth.getUser();
//   return user;
// };
