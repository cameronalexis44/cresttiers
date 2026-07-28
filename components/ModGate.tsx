"use client";

import { useState } from "react";
import SignInForm from "./SignInForm";

export default function ModGate({
  signedIn,
  email,
}: {
  signedIn: boolean;
  email: string | null;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-sm mx-auto mt-24 text-center">
      <h1 className="font-display text-4xl text-bone mb-1">Mod Menu</h1>

      {signedIn ? (
        <p className="text-ash text-sm mb-6">
          Signed in as <span className="text-bone">{email}</span>, but this account
          doesn&apos;t have mod access.
        </p>
      ) : (
        <p className="text-ash text-sm mb-6">
          Sign in with an approved email address to continue.
        </p>
      )}

      {!signedIn &&
        (showForm ? (
          <SignInForm mode="login" onClose={() => setShowForm(false)} />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="notch-sm bg-crimson px-4 py-3 font-semibold tracking-wide hover:bg-crimson-bright transition-colors"
          >
            Log in
          </button>
        ))}
    </div>
  );
}
