export const CATEGORIES = [
  "Crystal",
  "Sword",
  "Axe",
  "Pot",
  "NethPot",
  "UHC",
  "SMP",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const TIERS = [
  "HT1",
  "LT1",
  "HT2",
  "LT2",
  "HT3",
  "LT3",
  "HT4",
  "LT4",
  "HT5",
  "LT5",
] as const;

export type Tier = (typeof TIERS)[number];
