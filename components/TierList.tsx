"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, TIERS, type Category, type Tier } from "@/lib/constants";
import { TIER_EMOJI, computeOverall } from "@/lib/scoring";

type Player = {
  id: string;
  ign: string;
  category: string;
  tier: string;
  region: string | null;
};

type View = "Overall" | Category;

const TIER_ACCENT: Record<string, string> = {
  HT1: "text-crimson-bright",
  LT1: "text-crimson",
  HT2: "text-bone",
  LT2: "text-bone",
  HT3: "text-ash",
  LT3: "text-ash",
  HT4: "text-ash",
  LT4: "text-ash",
  HT5: "text-ash",
  LT5: "text-ash",
};

function tierRank(tier: string) {
  const i = (TIERS as readonly string[]).indexOf(tier);
  return i === -1 ? TIERS.length : i;
}

export default function TierList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>("Overall");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/players", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load players");
        const data = await res.json();
        if (active) setPlayers(data.players ?? []);
      } catch {
        if (active) setError("Couldn't load rankings. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const overall = useMemo(() => {
    const byIgn = new Map<
      string,
      { ign: string; region: string | null; tiers: Tier[] }
    >();
    for (const p of players) {
      const entry =
        byIgn.get(p.ign) ?? { ign: p.ign, region: p.region, tiers: [] };
      entry.tiers.push(p.tier as Tier);
      if (!entry.region && p.region) entry.region = p.region;
      byIgn.set(p.ign, entry);
    }
    return [...byIgn.values()]
      .map((e) => ({ ...e, ...computeOverall(e.tiers) }))
      .sort((a, b) => b.points - a.points || a.ign.localeCompare(b.ign));
  }, [players]);

  const byCategory = useMemo(() => {
    if (view === "Overall") return [];
    return players
      .filter((p) => p.category === view)
      .sort(
        (a, b) => tierRank(a.tier) - tierRank(b.tier) || a.ign.localeCompare(b.ign)
      );
  }, [players, view]);

  const tabs: View[] = ["Overall", ...CATEGORIES];

  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setView(t)}
            className={`notch-sm px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${
              view === t
                ? "bg-crimson text-bone"
                : "border border-white/10 text-ash hover:text-bone"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && (
        <p className="py-12 text-center font-mono text-sm text-ash">
          Loading rankings…
        </p>
      )}
      {error && (
        <p className="py-12 text-center font-mono text-sm text-crimson-bright">
          {error}
        </p>
      )}

      {!loading && !error && view === "Overall" && (
        <ol className="mt-6 space-y-2">
          {overall.length === 0 && (
            <li className="py-12 text-center font-mono text-sm text-ash">
              No players ranked yet.
            </li>
          )}
          {overall.map((p, i) => (
            <li
              key={p.ign}
              className="notch flex items-center gap-4 border border-white/10 bg-panel px-4 py-3"
            >
              <span className="w-8 shrink-0 text-center font-mono text-sm text-ash">
                #{i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-semibold text-bone">
                  {p.ign}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-widest text-ash">
                  {p.ranked} ranked{p.region ? ` · ${p.region}` : ""}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-display text-lg font-bold ${TIER_ACCENT[p.tier] ?? "text-bone"}`}
                >
                  {TIER_EMOJI[p.tier]} {p.tier}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-widest text-ash">
                  {p.points} pts
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}

      {!loading && !error && view !== "Overall" && (
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {byCategory.length === 0 && (
            <li className="py-12 text-center font-mono text-sm text-ash sm:col-span-2">
              No players ranked in {view} yet.
            </li>
          )}
          {byCategory.map((p) => (
            <li
              key={p.id}
              className="notch flex items-center justify-between gap-4 border border-white/10 bg-panel px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-display font-semibold text-bone">
                  {p.ign}
                </p>
                {p.region && (
                  <p className="font-mono text-[11px] uppercase tracking-widest text-ash">
                    {p.region}
                  </p>
                )}
              </div>
              <p
                className={`shrink-0 font-display text-lg font-bold ${TIER_ACCENT[p.tier] ?? "text-bone"}`}
              >
                {TIER_EMOJI[p.tier as Tier]} {p.tier}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
