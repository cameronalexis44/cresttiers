# Copy this file to .env.local for local testing, and add the same
# values in Vercel > Project Settings > Environment Variables when deploying.

# Supabase > Settings > API > Project URL
NEXT_PUBLIC_SUPABASE_URL=

# Supabase > Settings > API > Project API keys > anon public
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase > Settings > API > Project API keys > service_role (SECRET - never expose to the browser)
SUPABASE_SERVICE_ROLE_KEY=

# Make up your own secret phrase. Whoever enters this on the site becomes the first admin.
ADMIN_INVITE_CODE=change-me-to-something-secret
