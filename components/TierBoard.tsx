"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, TIERS, type Category, type Tier } from "@/lib/constants";
import { CATEGORY_ICONS, Trophy } from "@/components/icons";
import { TIER_EMOJI } from "@/lib/scoring";
import PlayerDetail, { type OverallPlayer } from "@/components/PlayerDetail";

type Player = {
  id: string;
  ign: string;
  category: string;
  tier: string;
  region: string | null;
};

type Tab = "Overall" | Category;

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
  const [tab, setTab] = useState<Tab>("Overall");
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [overall, setOverall] = useState<OverallPlayer[] | null>(null);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [selected, setSelected] = useState<OverallPlayer | null>(null);

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

    fetch("/api/players/overall")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setOverall(data.players ?? []);
      })
      .catch(() => {
        if (!cancelled) setOverall([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const regions = useMemo(() => {
    const set = new Set<string>();
    (overall ?? []).forEach((p) => p.region && set.add(p.region));
    return ["All", ...Array.from(set).sort()];
  }, [overall]);

  const filteredOverall = useMemo(() => {
    return (overall ?? [])
      .filter((p) => (region === "All" ? true : p.region === region))
      .filter((p) => p.ign.toLowerCase().includes(search.trim().toLowerCase()));
  }, [overall, region, search]);

  const categoryPlayers = useMemo(() => {
    if (tab === "Overall") return [];
    return (players ?? [])
      .filter((p) => p.category === tab)
      .filter((p) => p.ign.toLowerCase().includes(search.trim().toLowerCase()));
  }, [players, tab, search]);

  function openPlayer(ign: string) {
    const found = (overall ?? []).find((p) => p.ign.toLowerCase() === ign.toLowerCase());
    if (found) setSelected(found);
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setTab("Overall")}
          className={`notch-sm flex flex-col items-center gap-1.5 px-4 py-3 min-w-[84px] border transition-colors ${
            tab === "Overall"
              ? "bg-crimson border-crimson-bright text-bone"
              : "border-white/10 text-ash hover:text-bone hover:border-white/30"
          }`}
        >
          <Trophy className="w-6 h-6" />
          <span className="text-xs font-semibold tracking-wide">Overall</span>
        </button>
        {CATEGORIES.map((c) => {
          const Icon = CATEGORY_ICONS[c];
          return (
            <button
              key={c}
              onClick={() => setTab(c)}
              className={`notch-sm flex flex-col items-center gap-1.5 px-4 py-3 min-w-[84px] border transition-colors ${
                c === tab
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

      {/* Search + region filter */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search player…"
          className="notch-sm bg-panel border border-white/10 px-3 py-2 text-sm text-bone placeholder:text-ash/60 focus:border-crimson-bright outline-none flex-1 min-w-[180px]"
        />
        {tab === "Overall" && (
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="notch-sm bg-panel border border-white/10 px-3 py-2 text-sm text-bone focus:border-crimson-bright outline-none"
          >
            {regions.map((r) => (
              <option key={r} value={r} className="bg-panel">
                {r === "All" ? "All Regions" : r}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Overall tab: single ranked vertical list */}
      {tab === "Overall" && (
        <div className="space-y-2">
          {overall === null ? (
            <span className="text-xs text-ash animate-pulse">Loading…</span>
          ) : filteredOverall.length === 0 ? (
            <span className="text-xs text-ash">No players match.</span>
          ) : (
            filteredOverall.map((p, i) => (
              <button
                key={p.ign}
                onClick={() => openPlayer(p.ign)}
                className={`w-full flex items-center gap-4 border-l-2 bg-panel/60 px-4 py-3 text-left hover:bg-panel transition-colors ${tierGlow[p.overallTier]}`}
              >
                <span className="text-ash text-sm w-6 shrink-0">{i + 1}</span>
                <span className="flex flex-col items-center leading-none w-10 shrink-0">
                  <span className="text-xl">{TIER_EMOJI[p.overallTier]}</span>
                  <span className="text-[10px] font-semibold text-bone mt-1">
                    {p.overallTier}
                  </span>
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm text-bone truncate">{p.ign}</span>
                  {p.region && <span className="block text-xs text-ash">{p.region}</span>}
                </span>
                <span className="text-xs text-ash shrink-0">{p.points} pts</span>
              </button>
            ))
          )}
        </div>
      )}

      {/* Gamemode tabs: tier sections, players listed vertically within each */}
      {tab !== "Overall" && (
        <div className="space-y-3">
          {TIERS.map((tier) => {
            const rows = categoryPlayers.filter((p) => p.tier === tier);
            return (
              <div key={tier} className={`border-l-2 bg-panel/60 ${tierGlow[tier]}`}>
                <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                  <span className="text-lg">{TIER_EMOJI[tier as Tier]}</span>
                  <span className="font-display text-2xl leading-none text-bone">{tier}</span>
                </div>
                <div className="px-4 pb-3 space-y-1.5">
                  {players === null ? (
                    <span className="text-xs text-ash animate-pulse">Loading…</span>
                  ) : rows.length === 0 ? (
                    <span className="text-xs text-ash">No players ranked yet.</span>
                  ) : (
                    rows.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => openPlayer(p.ign)}
                        className="w-full flex items-center justify-between notch-sm bg-void border border-white/10 px-3 py-2 text-sm text-bone hover:border-crimson-bright transition-colors text-left"
                      >
                        <span>{p.ign}</span>
                        {p.region && <span className="text-ash text-xs">{p.region}</span>}
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && <PlayerDetail player={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
