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

async function getAvatars(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.playerAvatar.findMany({
      select: { ign: true, dataUrl: true },
    });
    return Object.fromEntries(rows.map((r) => [r.ign, r.dataUrl]));
  } catch {
    return {};
  }
}

export default async function HomePage() {
  const [players, avatars] = await Promise.all([getPlayers(), getAvatars()]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <header className="mb-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-ash">
              <span className="h-1.5 w-1.5 rounded-full bg-azure-bright shadow-glow-blue" />
              Bedrock PvP
              <span className="h-1.5 w-1.5 rounded-full bg-crimson-bright shadow-glow-red" />
            </p>
            <h1 className="font-display text-5xl sm:text-6xl text-duotone drop-shadow-[0_0_30px_rgba(37,99,235,0.25)]">
              BPTIERS
            </h1>
            <p className="mt-3 text-sm text-ash">
              Community-maintained tier rankings across{" "}
              <span className="text-bone">{CATEGORIES.length}</span> gamemodes.
            </p>
          </div>
          <Link
            href="/mod"
            className="notch-sm border border-azure/40 bg-azure/10 px-3 py-2 text-xs uppercase tracking-widest text-azure-bright hover:text-bone hover:border-crimson-bright hover:bg-crimson/10 transition-colors"
          >
            Mod menu
          </Link>
        </div>
        <div className="mt-6 h-px w-full bg-gradient-to-r from-azure-bright/60 via-white/10 to-crimson-bright/60" />
      </header>

      <TierTabs players={players} avatars={avatars} />
    </main>
  );
}
