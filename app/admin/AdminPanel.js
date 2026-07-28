"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, TIER_ORDER, REGIONS } from "@/lib/tiers";
import {
  addPlayer, deletePlayer, renamePlayer, setPlayerRegion, setPlayerTier,
  promoteAdmin, removeAdmin,
} from "./actions";

export default function AdminPanel({ players, admins, currentUserId }) {
  const [tab, setTab] = useState("players");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [adminError, setAdminError] = useState("");

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function handleAddPlayer(formData) {
    await addPlayer(formData);
    refresh();
  }

  async function handlePromote(formData) {
    setAdminError("");
    const result = await promoteAdmin(formData);
    if (result?.error) setAdminError(result.error);
    refresh();
  }

  return (
    <section className="panel">
      <h2>ADMIN PANEL</h2>
      <p className="sub">Manage players, tiers, and who else can administer this board.</p>

      <div className="admin-tabs">
        <a className={tab === "players" ? "active" : ""} onClick={() => setTab("players")} style={{ cursor: "pointer" }}>
          Manage players
        </a>
        <a className={tab === "admins" ? "active" : ""} onClick={() => setTab("admins")} style={{ cursor: "pointer" }}>
          Manage admins
        </a>
      </div>

      {tab === "players" ? (
        <>
          <form action={handleAddPlayer} className="new-row">
            <input type="text" name="name" placeholder="Player name" required />
            <select name="region" defaultValue="—">
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <button className="primary" type="submit">Add player</button>
          </form>

          <div style={{ overflowX: "auto" }}>
            <table className="mgmt">
              <thead>
                <tr>
                  <th>Name</th><th>Region</th>
                  {CATEGORIES.map((c) => <th key={c.key}>{c.label}</th>)}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {players.length === 0 && (
                  <tr><td colSpan={9} style={{ color: "var(--muted)", padding: 16 }}>No players yet — add one above.</td></tr>
                )}
                {players.map((p) => (
                  <PlayerRow key={p.id} player={p} onChanged={refresh} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="admins-list">
            {admins.length === 0 && <span style={{ color: "var(--muted)" }}>No admins yet.</span>}
            {admins.map((a) => (
              <div className="admin-item" key={a.id}>
                <span>{a.username} {a.id === currentUserId && <span className="pill admin">you</span>}</span>
                <button
                  className="danger"
                  onClick={async () => {
                    if (confirm(`Remove admin access for ${a.username}?`)) {
                      await removeAdmin(a.id);
                      refresh();
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          {adminError && <p className="error-msg" style={{ marginBottom: 10 }}>{adminError}</p>}
          <form action={handlePromote} className="add-admin-row">
            <input type="text" name="username" placeholder="Username to promote" required />
            <button className="primary" type="submit">Make admin</button>
          </form>
        </>
      )}
    </section>
  );
}

function PlayerRow({ player, onChanged }) {
  const [name, setName] = useState(player.name);

  return (
    <tr>
      <td>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={async () => {
            if (name.trim() && name !== player.name) {
              await renamePlayer(player.id, name);
              onChanged();
            }
          }}
        />
      </td>
      <td>
        <select
          defaultValue={player.region || "—"}
          onChange={async (e) => { await setPlayerRegion(player.id, e.target.value); onChanged(); }}
        >
          {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </td>
      {CATEGORIES.map((c) => (
        <td key={c.key}>
          <select
            defaultValue={player.tiers?.[c.key] || "Unranked"}
            onChange={async (e) => { await setPlayerTier(player.id, c.key, e.target.value); onChanged(); }}
          >
            {["Unranked", ...TIER_ORDER].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </td>
      ))}
      <td>
        <button
          className="danger"
          onClick={async () => {
            if (confirm(`Remove ${player.name} from the board?`)) {
              await deletePlayer(player.id);
              onChanged();
            }
          }}
        >
          Remove
        </button>
      </td>
    </tr>
  );
}
