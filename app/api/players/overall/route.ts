import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeOverall } from "@/lib/scoring";
import type { Tier } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const players = await prisma.player.findMany({
    orderBy: [{ ign: "asc" }],
  });

  const byIgn = new Map<
    string,
    { ign: string; region: string | null; entries: { category: string; tier: Tier }[] }
  >();

  for (const p of players) {
    const key = p.ign.toLowerCase();
    if (!byIgn.has(key)) {
      byIgn.set(key, { ign: p.ign, region: p.region, entries: [] });
    }
    const entry = byIgn.get(key)!;
    if (!entry.region && p.region) entry.region = p.region;
    entry.entries.push({ category: p.category, tier: p.tier as Tier });
  }

  const overall = Array.from(byIgn.values()).map((p) => {
    const summary = computeOverall(p.entries.map((e) => e.tier));
    return {
      ign: p.ign,
      region: p.region,
      overallTier: summary.tier,
      points: summary.points,
      average: summary.average,
      categories: p.entries,
    };
  });

  overall.sort((a, b) => b.points - a.points || a.ign.localeCompare(b.ign));

  return NextResponse.json({ players: overall });
}
