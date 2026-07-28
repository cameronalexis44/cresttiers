import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only client using the service role key. This bypasses Row Level
// Security, so it must NEVER be imported into a "use client" component and
// the key must never be prefixed with NEXT_PUBLIC_.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
