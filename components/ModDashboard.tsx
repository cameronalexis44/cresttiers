"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { CATEGORIES, TIERS } from "@/lib/constants";
import AvatarManager from "@/components/AvatarManager";

type Player = {
  id: string;
  ign: string;
  category: string;
  tier: string;
  region: string | null;
};

export default function ModDashboard() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [ign, setIgn] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [tier, setTier] = useState<string>(TIERS[0]);
  const [region, setRegion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadPlayers() {
    setLoading(true);
    const res = await fetch("/api/players");
    const data = await res.json();
    setPlayers(data.players ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadPlayers();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!ign.trim()) return;
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ign, category, tier, region }),
    });
    setSubmitting(false);
    if (res.ok) {
      setIgn("");
      setRegion("");
      loadPlayers();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/players/${id}`, { method: "DELETE" });
    loadPlayers();
  }

  async function handleLogout() {
    await signOut({ redirect: false });
    router.refresh();
  }

  const uniqueIgns = [...new Set(players.map((p) => p.ign))].sort((a, b) =>
    a.localeCompare(b),
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-5xl text-bone">Mod Menu</h1>
        <button
          onClick={handleLogout}
          className="notch-sm border border-white/10 px-3 py-2 text-sm text-ash hover:text-bone hover:border-crimson-bright transition-colors"
        >
          Sign out
        </button>
      </div>

      <form
        onSubmit={handleAdd}
        className="notch bg-panel border border-white/10 p-5 mb-10 space-y-3"
      >
        <p className="text-sm text-ash mb-1">Add a player</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <input
            value={ign}
            onChange={(e) => setIgn(e.target.value)}
            placeholder="Bedrock IGN"
            className="col-span-2 notch-sm bg-void border border-white/10 px-3 py-2 text-sm text-bone placeholder:text-ash/60 focus:border-crimson-bright outline-none"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="notch-sm bg-void border border-white/10 px-3 py-2 text-sm text-bone outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="notch-sm bg-void border border-white/10 px-3 py-2 text-sm text-bone outline-none"
          >
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Region (optional)"
            className="col-span-2 sm:col-span-4 notch-sm bg-void border border-white/10 px-3 py-2 text-sm text-bone placeholder:text-ash/60 focus:border-crimson-bright outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !ign.trim()}
          className="notch-sm bg-crimson px-4 py-2 text-sm font-semibold tracking-wide hover:bg-crimson-bright transition-colors disabled:opacity-50"
        >
          {submitting ? "Adding…" : "Add player"}
        </button>
        {error && <p className="text-crimson-bright text-sm">{error}</p>}
      </form>

      <AvatarManager igns={uniqueIgns} />

      <p className="text-sm text-ash mb-3">
        {loading ? "Loading players…" : `${players.length} player${players.length === 1 ? "" : "s"} ranked`}
      </p>
      <div className="space-y-2">
        {players.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between notch-sm bg-panel/60 border border-white/10 px-4 py-2.5"
          >
            <div className="text-sm text-bone">
              <span className="font-semibold">{p.ign}</span>{" "}
              <span className="text-ash">
                · {p.category} · {p.tier}
                {p.region ? ` · ${p.region}` : ""}
              </span>
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              className="text-xs text-ash hover:text-crimson-bright transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
