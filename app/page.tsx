import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/constants";
import TierTabs from "@/components/TierTabs";
import type { PlayerRow } from "@/components/TierTabs";

export const dynamic = "force-dynamic";

async function getPlayers(): Promise<PlayerRow[]> {
  try {
    return await prisma.player.findMany({
      select: { id: true, ign: true, category: true, tier: true, region: true },
      orderBy: { ign: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const players = await getPlayers();

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <header className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl sm:text-6xl text-bone">
            CrestTiers
          </h1>
          <p className="mt-2 text-sm text-ash">
            Bedrock PvP tier rankings across {CATEGORIES.length} gamemodes.
          </p>
        </div>
        <Link
          href="/mod"
          className="notch-sm border border-white/10 px-3 py-2 text-xs uppercase tracking-widest text-ash hover:text-bone hover:border-crimson-bright transition-colors"
        >
          Mod menu
        </Link>
      </header>

      <TierTabs players={players} />
    </main>
  );
}
