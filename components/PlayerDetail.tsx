"use client";

import { TIER_EMOJI } from "@/lib/scoring";
import type { Tier } from "@/lib/constants";

export type OverallPlayer = {
  ign: string;
  region: string | null;
  overallTier: Tier;
  points: number;
  average: number;
  categories: { category: string; tier: Tier }[];
};

export default function PlayerDetail({
  player,
  onClose,
}: {
  player: OverallPlayer;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/70 px-4 py-10 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="notch w-full max-w-md bg-panel border border-white/10 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-4xl leading-none text-bone">{player.ign}</h2>
            {player.region && (
              <p className="text-ash text-xs mt-1.5 tracking-wide">{player.region}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="notch-sm border border-white/10 w-8 h-8 flex items-center justify-center text-ash hover:text-bone hover:border-crimson-bright transition-colors shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="notch-sm bg-void border border-white/10 px-4 py-4 mb-6 flex items-center gap-4">
          <div className="flex flex-col items-center leading-none">
            <span className="text-3xl">{TIER_EMOJI[player.overallTier]}</span>
            <span className="text-xs font-semibold text-bone mt-1.5">{player.overallTier}</span>
          </div>
          <div>
            <p className="text-xs text-ash tracking-wide">Overall Tier</p>
            <p className="text-sm text-bone mt-0.5">
              {player.points} pts across {player.categories.length}{" "}
              {player.categories.length === 1 ? "gamemode" : "gamemodes"}
            </p>
          </div>
        </div>

        <p className="text-xs text-ash tracking-wide mb-3">Ranked gamemodes</p>
        <div className="space-y-2">
          {player.categories.length === 0 ? (
            <p className="text-sm text-ash">Not ranked in any gamemode yet.</p>
          ) : (
            player.categories
              .slice()
              .sort((a, b) => a.category.localeCompare(b.category))
              .map((c) => (
                <div
                  key={c.category}
                  className="flex items-center justify-between border-l-2 border-crimson/50 bg-void/60 px-4 py-2.5"
                >
                  <span className="text-sm text-bone">{c.category}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-base">{TIER_EMOJI[c.tier]}</span>
                    <span className="text-xs font-semibold text-ash">{c.tier}</span>
                  </span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
