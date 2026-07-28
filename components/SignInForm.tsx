"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInForm({
  mode = "login",
  onClose,
}: {
  mode?: "login" | "register";
  onClose?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setError(null);
    try {
      const res = await signIn("email", {
        email: email.trim(),
        redirect: false,
        callbackUrl: "/mod",
      });
      if (res?.error) {
        setStatus("error");
        setError("Couldn't send the sign-in link. Please try again.");
      } else {
        setStatus("sent");
      }
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="notch bg-panel border border-white/10 p-5 text-left">
        <p className="text-sm text-bone mb-2">Check your inbox</p>
        <p className="text-sm text-ash">
          We sent a sign-in link to{" "}
          <span className="text-bone">{email}</span>. Open it on this device to
          continue.
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 text-xs text-ash hover:text-bone transition-colors"
          >
            Back
          </button>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="notch bg-panel border border-white/10 p-5 space-y-3 text-left"
    >
      <label htmlFor="signin-email" className="block text-sm text-ash">
        {mode === "register" ? "Create your account" : "Email address"}
      </label>
      <input
        id="signin-email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full notch-sm bg-void border border-white/10 px-3 py-2 text-sm text-bone placeholder:text-ash/60 focus:border-crimson-bright outline-none"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={status === "sending" || !email.trim()}
          className="notch-sm bg-crimson px-4 py-2 text-sm font-semibold tracking-wide hover:bg-crimson-bright transition-colors disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send sign-in link"}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-ash hover:text-bone transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
      {error && <p className="text-crimson-bright text-sm">{error}</p>}
    </form>
  );
}
