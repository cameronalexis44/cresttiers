import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import ModGate from "@/components/ModGate";
import ModDashboard from "@/components/ModDashboard";

export default async function ModPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;

  if (isAdminEmail(email)) {
    return <ModDashboard />;
  }

  return <ModGate signedIn={Boolean(session?.user)} email={email} />;
}
