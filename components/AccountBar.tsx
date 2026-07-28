"use client";

import { useSession, signOut } from "next-auth/react";
import SignInForm from "./SignInForm";

export default function AccountBar() {
  const { data: session, status } = useSession();

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

  return <SignInForm />;
}
