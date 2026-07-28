"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    await signIn("email", { email: email.trim(), redirect: false });
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <p className="text-sm text-ash">
        Check <span className="text-bone">{email}</span> for a sign-in link.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="notch-sm bg-panel border border-white/10 px-3 py-2 text-sm text-bone placeholder:text-ash/60 focus:border-crimson-bright outline-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="notch-sm bg-crimson px-4 py-2 text-sm font-semibold tracking-wide hover:bg-crimson-bright transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Sign in"}
      </button>
    </form>
  );
}
