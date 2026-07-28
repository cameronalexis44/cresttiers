"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInForm({
  mode,
  onClose,
}: {
  mode: "signup" | "login";
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setErrorMsg(null);
    try {
      const result = await signIn("email", { email: email.trim(), redirect: false });
      if (result?.error) {
        setStatus("error");
        setErrorMsg(
          "Couldn't send the sign-in email. This usually means EMAIL_SERVER isn't set up correctly on the server."
        );
      } else {
        setStatus("sent");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong reaching the server. Check the deployment logs.");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-sm text-ash">
        Check <span className="text-bone">{email}</span> for a sign-in link.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-ash hidden sm:inline">
        {mode === "signup" ? "Create account —" : "Log in —"}
      </span>
      <input
        type="email"
        required
        autoFocus
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
        {status === "sending" ? "Sending…" : "Send link"}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="text-xs text-ash hover:text-bone transition-colors"
      >
        Cancel
      </button>
      {status === "error" && errorMsg && (
        <p className="w-full text-xs text-crimson-bright">{errorMsg}</p>
      )}
    </form>
  );
}
