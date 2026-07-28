import Link from "next/link";
import { createClient, getCurrentProfile } from "@/lib/supabase/server";
import { signOut } from "./login/actions";
import TierBoard from "./TierBoard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createClient();
  const { data: players } = await supabase
    .from("players")
    .select("id, name, region, tiers")
    .order("name");

  const { user, profile } = await getCurrentProfile();

  return (
    <>
      <header className="top">
        <div className="brand">
          <div className="crest"><span>BP</span></div>
          <div>
            <h1 className="pixel">BPTIERS</h1>
            <p>a PvP ranking board — ranked by category, no combat XP required</p>
          </div>
        </div>
        <div className="idbar">
          {user ? (
            <>
              <span className={"pill" + (profile?.role === "admin" ? " admin" : "")}>
                {profile?.username || user.email}
              </span>
              {profile?.role === "admin" && (
                <Link href="/admin" className="button-link"><button className="primary">Admin panel</button></Link>
              )}
              <form action={signOut}>
                <button className="ghost" type="submit">Sign out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login?mode=login" className="button-link"><button>Log in</button></Link>
              <Link href="/login?mode=signup" className="button-link"><button className="primary">Sign up</button></Link>
            </>
          )}
        </div>
      </header>

      <TierBoard players={players || []} />

      <p className="footer-note">
        Rankings are community-maintained. Points: HT1 100 · LT1 90 · HT2 75 · LT2 60 · HT3 45 · LT3 30 · HT4 20 · LT4 10 · HT5 5 · LT5 1
      </p>
    </>
  );
}
