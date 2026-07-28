"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ModGate() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/mod/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError("Incorrect code.");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-24 text-center">
      <h1 className="font-display text-4xl text-bone mb-1">Mod Menu</h1>
      <p className="text-ash text-sm mb-6">Enter the access code to continue.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Access code"
          className="w-full notch-sm bg-panel border border-white/10 px-4 py-3 text-center text-bone placeholder:text-ash/60 focus:border-crimson-bright outline-none"
        />
        <button
          type="submit"
          disabled={loading || !code}
          className="w-full notch-sm bg-crimson px-4 py-3 font-semibold tracking-wide hover:bg-crimson-bright transition-colors disabled:opacity-50"
        >
          {loading ? "Checking…" : "Unlock"}
        </button>
        {error && <p className="text-crimson-bright text-sm">{error}</p>}
      </form>
    </div>
  );
}
