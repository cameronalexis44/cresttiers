"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { becomeAdminWithCode } from "./actions";

export default function BecomeAdminForm() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(formData) {
    setError("");
    const result = await becomeAdminWithCode(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit}>
      {error && <p className="error-msg" style={{ marginBottom: 10 }}>{error}</p>}
      <label htmlFor="code">Invite code</label>
      <input id="code" name="code" type="password" required style={{ marginBottom: 10 }} />
      <button className="primary" type="submit">Become admin</button>
    </form>
  );
}
