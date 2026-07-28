import type { Tier } from "@/lib/constants";

// MCTiers-style point values per tier — used to compute a player's Overall tier
// from their tier across every gamemode category.
export const TIER_POINTS: Record<Tier, number> = {
  HT1: 60,
  LT1: 45,
  HT2: 30,
  LT2: 20,
  HT3: 10,
  LT3: 7,
  HT4: 4,
  LT4: 2,
  HT5: 1,
  LT5: 0,
};

// Small badge shown next to a tier — a compact visual identifier, tier label sits below it.
export const TIER_EMOJI: Record<Tier, string> = {
  HT1: "👑",
  LT1: "🔥",
  HT2: "⭐",
  LT2: "✨",
  HT3: "🔶",
  LT3: "🔸",
  HT4: "🔹",
  LT4: "🔻",
  HT5: "⚪",
  LT5: "⚫",
};

// Midpoints between each tier's point value, so an average score maps back
// onto the same HT1..LT5 scale used for individual categories.
const OVERALL_THRESHOLDS: [number, Tier][] = [
  [52.5, "HT1"],
  [37.5, "LT1"],
  [25, "HT2"],
  [15, "LT2"],
  [8.5, "HT3"],
  [5.5, "LT3"],
  [3, "HT4"],
  [1.5, "LT4"],
  [0.5, "HT5"],
  [-Infinity, "LT5"],
];

export function tierForAverage(avg: number): Tier {
  for (const [min, tier] of OVERALL_THRESHOLDS) {
    if (avg >= min) return tier;
  }
  return "LT5";
}

export function computeOverall(tiers: Tier[]) {
  if (tiers.length === 0) {
    return { tier: "LT5" as Tier, points: 0, average: 0, ranked: 0 };
  }
  const points = tiers.reduce((sum, t) => sum + TIER_POINTS[t], 0);
  const average = points / tiers.length;
  return { tier: tierForAverage(average), points, average, ranked: tiers.length };
}
