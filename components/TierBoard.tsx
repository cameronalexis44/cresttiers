"use client";

import { useEffect, useState } from "react";
import { CATEGORIES, TIERS, type Category } from "@/lib/constants";
import { CATEGORY_ICONS } from "@/components/icons";

type Player = {
  id: string;
  ign: string;
  category: string;
  tier: string;
  region: string | null;
};

const tierGlow: Record<string, string> = {
  HT1: "border-crimson-bright shadow-[0_0_18px_-4px_rgba(255,54,82,0.6)]",
  LT1: "border-crimson-bright",
  HT2: "border-crimson",
  LT2: "border-crimson",
  HT3: "border-crimson/70",
  LT3: "border-crimson/70",
  HT4: "border-crimson/50",
  LT4: "border-crimson/50",
  HT5: "border-crimson/30",
  LT5: "border-crimson/30",
};

export default function TierBoard() {
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [players, setPlayers] = useState<Player[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/players")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPlayers(data.players ?? []);
      })
      .catch(() => {
        if (!cancelled) setPlayers([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryPlayers = (players ?? []).filter((p) => p.category === category);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((c) => {
          const Icon = CATEGORY_ICONS[c];
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`notch-sm flex flex-col items-center gap-1.5 px-4 py-3 min-w-[84px] border transition-colors ${
                c === category
                  ? "bg-crimson border-crimson-bright text-bone"
                  : "border-white/10 text-ash hover:text-bone hover:border-white/30"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-semibold tracking-wide">{c}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {TIERS.map((tier) => {
          const rows = categoryPlayers.filter((p) => p.tier === tier);
          return (
            <div
              key={tier}
              className={`flex items-stretch gap-4 border-l-2 bg-panel/60 ${tierGlow[tier]}`}
            >
              <div className="font-display text-3xl leading-none px-4 py-3 min-w-[84px] flex items-center text-bone">
                {tier}
              </div>
              <div className="flex-1 flex flex-wrap items-center gap-2 py-3 pr-4">
                {players === null ? (
                  <span className="text-xs text-ash animate-pulse">Loading…</span>
                ) : rows.length === 0 ? (
                  <span className="text-xs text-ash">
                    No players ranked yet in {category} {tier}.
                  </span>
                ) : (
                  rows.map((p) => (
                    <span
                      key={p.id}
                      className="notch-sm bg-void border border-white/10 px-3 py-1.5 text-sm text-bone"
                    >
                      {p.ign}
                      {p.region ? (
                        <span className="text-ash ml-1.5 text-xs">· {p.region}</span>
                      ) : null}
                    </span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
