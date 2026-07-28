"use client";

import { useState, useMemo } from "react";
import { CATEGORIES, TIER_ORDER, TIER_LABEL, tierColor, totalPoints } from "@/lib/tiers";
import GameIcon from "@/lib/gameIcons";

export default function TierBoard({ players }) {
  const [activeTab, setActiveTab] = useState("overall");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return players;
    return players.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [players, search]);

  return (
    <>
      <nav className="tabs">
        <button className={activeTab === "overall" ? "active" : ""} onClick={() => setActiveTab("overall")}>
          <GameIcon type="overall" />
          <span>Overall</span>
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.key} className={activeTab === c.key ? "active" : ""} onClick={() => setActiveTab(c.key)}>
            <GameIcon type={c.key} />
            <span>{c.label}</span>
          </button>
        ))}
      </nav>

      <main>
        <div className="toolbar">
          <input
            type="text"
            placeholder="Search a player..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {activeTab === "overall" ? (
          <OverallView players={filtered} />
        ) : (
          <CategoryView players={filtered} catKey={activeTab} />
        )}
      </main>
    </>
  );
}

function OverallView({ players }) {
  const ranked = [...players]
    .map((p) => ({ ...p, points: totalPoints(p) }))
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));

  if (ranked.length === 0) {
    return <div className="empty">No players yet. Check back once an admin adds some.</div>;
  }

  return (
    <div className="cards">
      {ranked.map((p, i) => {
        const best = CATEGORIES
          .map((c) => p.tiers?.[c.key])
          .filter(Boolean)
          .sort((a, b) => (TIER_ORDER.indexOf(a) - TIER_ORDER.indexOf(b)))[0] || "Unranked";
        return (
          <div className="card" key={p.id} style={{ borderLeftColor: tierColor(best) }}>
            <div className="rank-crest" style={{ background: tierColor(best) }}>#{i + 1}</div>
            <div>
              <div className="name">{p.name}</div>
              <div className="meta">{p.region || "—"} · {p.points} pts</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CategoryView({ players, catKey }) {
  const groups = TIER_ORDER.map((tier) => ({
    tier,
    members: players.filter((p) => p.tiers?.[catKey] === tier),
  })).filter((g) => g.members.length > 0);

  if (groups.length === 0) {
    return <div className="empty">No one is ranked in this category yet.</div>;
  }

  return (
    <>
      {groups.map(({ tier, members }) => (
        <div className="tier-group" key={tier}>
          <div className="tier-head">
            <span className="tier-chip" style={{ background: tierColor(tier) }}>{TIER_LABEL[tier]}</span>
            <div className="tier-line" />
          </div>
          <div className="cards">
            {members.map((p) => (
              <div className="card" key={p.id} style={{ borderLeftColor: tierColor(tier) }}>
                <div className="rank-crest" style={{ background: tierColor(tier) }}>{tier}</div>
                <div>
                  <div className="name">{p.name}</div>
                  <div className="meta">{p.region || "—"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
