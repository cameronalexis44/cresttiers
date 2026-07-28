import Link from "next/link";
import { signIn, signUp } from "./actions";

export default function LoginPage({ searchParams }) {
  const mode = searchParams?.mode === "signup" ? "signup" : "login";
  const error = searchParams?.error;

  return (
    <main>
      <div className="auth-card">
        <div className="brand" style={{ marginBottom: 18 }}>
          <div className="crest"><span>CT</span></div>
          <div>
            <h1 className="pixel" style={{ fontSize: 13, margin: 0 }}>CRESTTIERS</h1>
          </div>
        </div>

        <div className="auth-tabs">
          <Link href="/login?mode=login" className={mode === "login" ? "active" : ""}>Log in</Link>
          <Link href="/login?mode=signup" className={mode === "signup" ? "active" : ""}>Sign up</Link>
        </div>

        {error && <p className="error-msg" style={{ marginBottom: 12 }}>{error}</p>}

        {mode === "login" ? (
          <form action={signIn}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required />
            <button className="primary" type="submit" style={{ marginTop: 8 }}>Log in</button>
          </form>
        ) : (
          <form action={signUp}>
            <label htmlFor="username">Display name</label>
            <input id="username" name="username" type="text" required />
            <label htmlFor="email2">Email</label>
            <input id="email2" name="email" type="email" required />
            <label htmlFor="password2">Password</label>
            <input id="password2" name="password" type="password" required minLength={6} />
            <button className="primary" type="submit" style={{ marginTop: 8 }}>Create account</button>
          </form>
        )}

        <p style={{ marginTop: 16 }}><Link href="/">&larr; Back to rankings</Link></p>
      </div>
    </main>
  );
}
