import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// This client bypasses Row Level Security. It must NEVER be imported into
// any file that runs in the browser - only inside "use server" action files.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
