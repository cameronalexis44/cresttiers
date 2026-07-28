"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, TIERS } from "@/lib/constants";
import type { Tier } from "@/lib/constants";
import { TIER_EMOJI, computeOverall } from "@/lib/scoring";

export type PlayerRow = {
  id: string;
  ign: string;
  category: string;
  tier: string;
  region: string | null;
};

const TABS = ["Overall", ...CATEGORIES] as const;

const TAB_ICONS: Record<string, string> = {
  Overall: "\u{1F3C6}",
  Crystal: "\u{1F52E}",
  Sword: "\u{2694}\u{FE0F}",
  Mace: "\u{1F528}",
  Axe: "\u{1FA93}",
  NethPot: "\u{1F9EA}",
  Diapot: "\u{1F48E}",
  UHC: "\u{2764}\u{FE0F}",
  SMP: "\u{1F3D5}\u{FE0F}",
  Hydro: "\u{1F30A}",
  Bedwars: "\u{1F6CF}\u{FE0F}",
  Pot: "\u{1F9EA}",
  Vanilla: "\u{1F33F}",
  Elytra: "\u{1FAB6}",
  Bow: "\u{1F3F9}",
  Speed: "\u{1F4A8}",
  Creeper: "\u{1F4A5}",
  Manhunt: "\u{1F3C3}",
  OGVanilla: "\u{1F33F}",
};

function iconFor(tab: string) {
  return TAB_ICONS[tab] ?? "\u{1F3AE}";
}

export default function TierTabs({ players }: { players: PlayerRow[] }) {
  const [active, setActive] = useState<string>("Overall");

  const overall = useMemo(() => {
    const byPlayer = new Map<
      string,
      { ign: string; region: string | null; tiers: Tier[] }
    >();
    for (const p of players) {
      const key = p.ign.toLowerCase();
      const entry = byPlayer.get(key) ?? {
        ign: p.ign,
        region: p.region,
        tiers: [],
      };
      entry.tiers.push(p.tier as Tier);
      if (!entry.region && p.region) entry.region = p.region;
      byPlayer.set(key, entry);
    }
    return [...byPlayer.values()]
      .map((e) => ({ ...e, score: computeOverall(e.tiers) }))
      .sort((a, b) => b.score.points - a.score.points);
  }, [players]);

  const inCategory = useMemo(() => {
    return players
      .filter((p) => p.category === active)
      .sort((a, b) => TIERS.indexOf(a.tier as Tier) - TIERS.indexOf(b.tier as Tier));
  }, [players, active]);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`notch-sm flex min-w-[84px] flex-col items-center gap-1 border px-3 py-2 text-xs uppercase tracking-widest transition-colors ${
                isActive
                  ? "border-crimson-bright bg-crimson text-bone"
                  : "border-white/10 bg-panel/60 text-ash hover:text-bone hover:border-crimson-bright"
              }`}
            >
              <span aria-hidden className="text-lg leading-none">
                {iconFor(tab)}
              </span>
              {tab}
            </button>
          );
        })}
      </div>

      {active === "Overall" ? (
        overall.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {overall.map((entry, i) => (
              <Row
                key={entry.ign}
                rank={i + 1}
                ign={entry.ign}
                region={entry.region}
                subtitle={`${entry.score.ranked} gamemode${
                  entry.score.ranked === 1 ? "" : "s"
                } ranked \u00B7 ${entry.score.points} pts`}
                tier={entry.score.tier}
              />
            ))}
          </div>
        )
      ) : inCategory.length === 0 ? (
        <EmptyState label={`No players ranked in ${active} yet.`} />
      ) : (
        <div className="space-y-2">
          {inCategory.map((p, i) => (
            <Row
              key={p.id}
              rank={i + 1}
              ign={p.ign}
              region={p.region}
              subtitle={p.category}
              tier={p.tier as Tier}
            />
          ))}
        </div>
      )}
    </>
  );
}

function Row({
  rank,
  ign,
  region,
  subtitle,
  tier,
}: {
  rank: number;
  ign: string;
  region: string | null;
  subtitle: string;
  tier: Tier;
}) {
  return (
    <div className="notch-sm flex items-center justify-between gap-4 bg-panel/60 border border-white/10 px-4 py-3">
      <div className="flex items-center gap-4 min-w-0">
        <span className="font-display text-2xl text-crimson-bright w-10 shrink-0">
          {rank}
        </span>
        <div className="min-w-0">
          <p className="text-bone font-semibold truncate">
            {ign}
            {region ? (
              <span className="text-ash font-normal"> &middot; {region}</span>
            ) : null}
          </p>
          <p className="text-xs text-ash truncate">{subtitle}</p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-lg leading-none">{TIER_EMOJI[tier]}</p>
        <p className="text-xs text-ash mt-1">{tier}</p>
      </div>
    </div>
  );
}

function EmptyState({
  label = "No players ranked yet. Mods can add players from the mod menu.",
}: {
  label?: string;
}) {
  return (
    <div className="notch bg-panel border border-white/10 p-8 text-center">
      <p className="text-ash text-sm">{label}</p>
    </div>
  );
}
