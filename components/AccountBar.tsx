"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import SignInForm from "./SignInForm";

export default function AccountBar() {
  const { data: session, status } = useSession();
  const [mode, setMode] = useState<"signup" | "login" | null>(null);

  if (status === "loading") {
    return <div className="h-9 w-24 bg-panel/60 notch-sm animate-pulse" />;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-ash">{session.user.email}</span>
        <button
          onClick={() => signOut({ redirect: false })}
          className="notch-sm border border-white/10 px-3 py-2 text-sm text-bone hover:border-crimson-bright transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  if (mode) {
    return <SignInForm mode={mode} onClose={() => setMode(null)} />;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setMode("login")}
        className="notch-sm border border-white/10 px-4 py-2 text-sm text-bone hover:border-crimson-bright transition-colors"
      >
        Log in
      </button>
      <button
        onClick={() => setMode("signup")}
        className="notch-sm bg-crimson px-4 py-2 text-sm font-semibold tracking-wide hover:bg-crimson-bright transition-colors"
      >
        Sign up
      </button>
    </div>
  );
}
