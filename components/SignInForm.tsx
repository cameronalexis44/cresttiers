"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInForm({
  mode = "login",
  onClose,
}: {
  mode?: "login" | "signup";
  onClose?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setMessage(null);

    const res = await signIn("email", {
      email: email.trim(),
      redirect: false,
      callbackUrl: "/mod",
    });

    if (res?.error) {
      setStatus("error");
      setMessage("Couldn't send the link. Try again.");
    } else {
      setStatus("sent");
      setMessage("Check your inbox for a sign-in link.");
    }
  }

  if (status === "sent") {
    return (
      <div className="notch bg-panel border border-white/10 p-5 text-left">
        <p className="text-sm text-bone">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-3 text-xs text-ash hover:text-bone transition-colors"
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
      <label className="block text-xs uppercase tracking-wider text-ash">
        {mode === "signup" ? "Create your account" : "Email address"}
      </label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full notch-sm bg-void border border-white/10 px-3 py-2 text-sm text-bone placeholder:text-ash/60 focus:border-crimson-bright outline-none"
      />
      <button
        type="submit"
        disabled={status === "sending" || !email.trim()}
        className="w-full notch-sm bg-crimson px-4 py-2 text-sm font-semibold tracking-wide hover:bg-crimson-bright transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send sign-in link"}
      </button>
      {message && <p className="text-crimson-bright text-sm">{message}</p>}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-ash hover:text-bone transition-colors"
        >
          Cancel
        </button>
      )}
    </form>
  );
}
