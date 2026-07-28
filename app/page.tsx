import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/constants";
import type { Tier } from "@/lib/constants";
import { TIER_EMOJI, computeOverall } from "@/lib/scoring";

export const dynamic = "force-dynamic";

type PlayerRow = {
  id: string;
  ign: string;
  category: string;
  tier: string;
  region: string | null;
};

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

  const byPlayer = new Map<
    string,
    { ign: string; region: string | null; tiers: Record<string, Tier> }
  >();

  for (const p of players) {
    const key = p.ign.toLowerCase();
    const entry =
      byPlayer.get(key) ?? { ign: p.ign, region: p.region, tiers: {} };
    entry.tiers[p.category] = p.tier as Tier;
    if (!entry.region && p.region) entry.region = p.region;
    byPlayer.set(key, entry);
  }

  const ranked = [...byPlayer.values()]
    .map((entry) => ({
      ...entry,
      overall: computeOverall(Object.values(entry.tiers)),
    }))
    .sort((a, b) => b.overall.points - a.overall.points);

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <header className="mb-12 flex items-end justify-between gap-4">
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

      {ranked.length === 0 ? (
        <div className="notch bg-panel border border-white/10 p-8 text-center">
          <p className="text-ash text-sm">
            No players ranked yet. Mods can add players from the mod menu.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {ranked.map((entry, i) => (
            <div
              key={entry.ign}
              className="notch-sm flex items-center justify-between gap-4 bg-panel/60 border border-white/10 px-4 py-3"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-display text-2xl text-crimson-bright w-10 shrink-0">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-bone font-semibold truncate">
                    {entry.ign}
                    {entry.region ? (
                      <span className="text-ash font-normal"> · {entry.region}</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-ash truncate">
                    {Object.entries(entry.tiers)
                      .map(([cat, tier]) => `${cat} ${tier}`)
                      .join("  ·  ") || "Unranked"}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg leading-none">
                  {TIER_EMOJI[entry.overall.tier]}
                </p>
                <p className="text-xs text-ash mt-1">
                  Overall {entry.overall.tier}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
