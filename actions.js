import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, getCurrentProfile } from "@/lib/supabase/server";
import BecomeAdminForm from "./BecomeAdminForm";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { user, profile } = await getCurrentProfile();

  if (!user) {
    redirect("/login?mode=login&error=" + encodeURIComponent("Sign in first, then come back to /admin."));
  }

  if (profile?.role !== "admin") {
    return (
      <main>
        <div className="panel" style={{ maxWidth: 420, margin: "60px auto" }}>
          <h2>Not an admin yet</h2>
          <p className="sub">Enter your invite code to become an admin.</p>
          <BecomeAdminForm />
          <p style={{ marginTop: 16 }}><Link href="/">&larr; Back to rankings</Link></p>
        </div>
      </main>
    );
  }

  const supabase = createClient();
  const { data: players } = await supabase
    .from("players")
    .select("id, name, region, tiers")
    .order("name");
  const { data: admins } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("role", "admin")
    .order("username");

  return (
    <main>
      <p style={{ marginBottom: 16 }}><Link href="/">&larr; Back to rankings</Link></p>
      <AdminPanel players={players || []} admins={admins || []} currentUserId={user.id} />
    </main>
  );
}
