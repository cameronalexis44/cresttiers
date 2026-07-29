"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, CATEGORY_LABELS, TIERS } from "@/lib/constants";
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
  DiamondSMP: "\u{1F48E}",
  DiamondPot: "\u{1F9EA}",
  NetheriteSMP: "\u{1F5FF}",
  NetheritePot: "\u{2697}\u{FE0F}",
  Mace: "\u{1F528}",
  SpearMace: "\u{1F3F9}",
  UHC: "\u{2764}\u{FE0F}",
  Sword: "\u{2694}\u{FE0F}",
  Axe: "\u{1FA93}",
  Cart: "\u{1F6E0}\u{FE0F}",
  Crystal: "\u{1F52E}",
  SMP: "\u{1F3D5}\u{FE0F}",
};

function iconFor(tab: string) {
  return TAB_ICONS[tab] ?? "\u{1F3AE}";
}

function labelFor(tab: string) {
  if (tab === "Overall") return "Overall";
  return CATEGORY_LABELS?.[tab] ?? tab;
}

export default function TierTabs({ players }: { players: PlayerRow[] }) {
  const [active, setActive] = useState<string>("Overall");
  const [selectedIgn, setSelectedIgn] = useState<string | null>(null);

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

  if (selectedIgn) {
    return (
      <PlayerProfile
        ign={selectedIgn}
        players={players}
        onBack={() => setSelectedIgn(null)}
      />
    );
  }

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
                  ? "border-transparent bg-gradient-to-br from-azure via-azure-deep to-crimson text-bone shadow-glow-blue"
                  : "border-white/10 bg-panel/60 text-ash hover:text-bone hover:border-azure-bright"
              }`}
            >
              <span aria-hidden className="text-lg leading-none">
                {iconFor(tab)}
              </span>
              {labelFor(tab)}
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
                onClick={() => setSelectedIgn(entry.ign)}
              />
            ))}
          </div>
        )
      ) : inCategory.length === 0 ? (
        <EmptyState label={`No players ranked in ${labelFor(active)} yet.`} />
      ) : (
        <div className="space-y-2">
          {inCategory.map((p, i) => (
            <Row
              key={p.id}
              rank={i + 1}
              ign={p.ign}
              region={p.region}
              subtitle={labelFor(p.category)}
              tier={p.tier as Tier}
              onClick={() => setSelectedIgn(p.ign)}
            />
          ))}
        </div>
      )}
    </>
  );
}

function PlayerProfile({
  ign,
  players,
  onBack,
}: {
  ign: string;
  players: PlayerRow[];
  onBack: () => void;
}) {
  const key = ign.toLowerCase();
  const entries = players.filter((p) => p.ign.toLowerCase() === key);
  const region = entries.find((e) => e.region)?.region ?? null;
  const byCategory = new Map<string, string>();
  for (const e of entries) byCategory.set(e.category, e.tier);
  const tiers = entries.map((e) => e.tier as Tier);
  const score = computeOverall(tiers);

  return (
    <div>
      <button
        onClick={onBack}
        className="notch-sm mb-6 inline-flex items-center gap-2 border border-azure/40 bg-azure/10 px-3 py-2 text-xs uppercase tracking-widest text-azure-bright transition-colors hover:text-bone hover:border-crimson-bright hover:bg-crimson/10"
      >
        &larr; Back to rankings
      </button>

      <div className="notch bg-panel/80 border border-white/10 p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-azure-bright via-white/40 to-crimson-bright" />
        <p className="text-xs uppercase tracking-widest text-ash">Player</p>
        <h2 className="font-display text-3xl text-duotone mt-1">
          {ign}
          {region ? (
            <span className="text-ash text-lg font-normal"> &middot; {region}</span>
          ) : null}
        </h2>
        <p className="text-sm text-ash mt-2">
          Overall {score.tier} {TIER_EMOJI[score.tier]} &middot; {score.ranked} gamemode
          {score.ranked === 1 ? "" : "s"} ranked &middot; {score.points} pts
        </p>
      </div>

      <div className="space-y-2">
        {CATEGORIES.map((cat) => {
          const tier = byCategory.get(cat);
          const ranked = Boolean(tier);
          return (
            <div
              key={cat}
              className="notch-sm flex items-center justify-between gap-4 bg-panel/60 border border-white/10 px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span aria-hidden className="text-lg leading-none">
                  {iconFor(cat)}
                </span>
                <p className="text-bone font-semibold truncate">{labelFor(cat)}</p>
              </div>
              <div className="text-right shrink-0">
                {ranked ? (
                  <>
                    <p className="text-lg leading-none">
                      {TIER_EMOJI[tier as Tier]}
                    </p>
                    <p className="text-xs text-ash mt-1">{tier}</p>
                  </>
                ) : (
                  <p className="text-xs text-ash">Unranked</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({
  rank,
  ign,
  region,
  subtitle,
  tier,
  onClick,
}: {
  rank: number;
  ign: string;
  region: string | null;
  subtitle: string;
  tier: Tier;
  onClick?: () => void;
}) {
  const Wrapper: any = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      className={`notch-sm flex w-full items-center justify-between gap-4 bg-panel/60 border border-white/10 px-4 py-3 text-left ${
        onClick ? "transition-all hover:border-azure-bright hover:bg-panel hover:shadow-glow-red" : ""
      }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <span className="font-display text-2xl text-azure-bright w-10 shrink-0 drop-shadow-[0_0_10px_rgba(96,165,250,0.55)]">
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
    </Wrapper>
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
