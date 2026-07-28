/**
 * Email allow-list for admin (Mod Menu) access.
 *
 * Set ADMIN_EMAILS in your environment to a comma-separated list of the
 * exact email addresses allowed into /mod, e.g.:
 *   ADMIN_EMAILS="you@example.com,teammate@example.com"
 *
 * Access requires BOTH:
 *   1. Being signed in via the existing magic-link email sign-in
 *   2. That signed-in email appearing in this list
 */
function parseAllowList(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const allowList = parseAllowList();
  if (allowList.size === 0) return false;
  return allowList.has(email.trim().toLowerCase());
}
