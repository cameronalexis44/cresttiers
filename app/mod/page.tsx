import { hasValidModSession } from "@/lib/mod-auth";
import ModGate from "@/components/ModGate";
import ModDashboard from "@/components/ModDashboard";

export default function ModPage() {
  const unlocked = hasValidModSession();
  return unlocked ? <ModDashboard /> : <ModGate />;
}
