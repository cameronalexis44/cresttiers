export const CATEGORIES = [
  "DiamondSMP",
  "DiamondPot",
  "NetheriteSMP",
  "NetheritePot",
  "Mace",
  "SpearMace",
  "UHC",
  "Sword",
  "Axe",
  "Cart",
  "Crystal",
  "SMP",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  DiamondSMP: "Diamond SMP",
  DiamondPot: "Diamond Pot",
  NetheriteSMP: "Netherite SMP",
  NetheritePot: "Netherite Pot",
  Mace: "Mace",
  SpearMace: "Spear Mace",
  UHC: "UHC",
  Sword: "Sword",
  Axe: "Axe",
  Cart: "Cart",
  Crystal: "Crystal",
  SMP: "SMP",
};

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
