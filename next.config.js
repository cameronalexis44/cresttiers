export const TIER_ORDER = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"];

export const TIER_LABEL = {
  HT1: "High Tier 1", LT1: "Low Tier 1",
  HT2: "High Tier 2", LT2: "Low Tier 2",
  HT3: "High Tier 3", LT3: "Low Tier 3",
  HT4: "High Tier 4", LT4: "Low Tier 4",
  HT5: "High Tier 5", LT5: "Low Tier 5",
};

export const POINTS = {
  HT1: 100, LT1: 90, HT2: 75, LT2: 60, HT3: 45,
  LT3: 30, HT4: 20, LT4: 10, HT5: 5, LT5: 1, Unranked: 0,
};

export const CATEGORIES = [
  { key: "sword", label: "Sword" },
  { key: "axe", label: "Axe" },
  { key: "pot", label: "Pot" },
  { key: "uhc", label: "UHC" },
  { key: "smp", label: "SMP" },
  { key: "mace", label: "Mace" },
];

export const REGIONS = ["NA", "EU", "AS", "OCE", "SA", "AF", "—"];

const TIER_GROUP_COLOR = { 1: "var(--t1)", 2: "var(--t2)", 3: "var(--t3)", 4: "var(--t4)", 5: "var(--t5)" };

export function tierColor(tier) {
  if (!tier || tier === "Unranked") return "var(--surface-2)";
  return TIER_GROUP_COLOR[tier[2]];
}

export function totalPoints(player) {
  return CATEGORIES.reduce((sum, c) => sum + (POINTS[player.tiers?.[c.key]] || 0), 0);
}
