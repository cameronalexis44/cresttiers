import TierList from "@/components/TierList";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-void">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="notch-sm flex h-9 w-9 items-center justify-center bg-crimson">
              <span className="font-display text-lg font-bold text-bone">C</span>
            </div>
            <div className="leading-tight">
              <h1 className="font-display text-xl font-bold tracking-wide text-bone">
                CrestTiers
              </h1>
              <p className="font-mono text-[11px] uppercase tracking-widest text-ash">
                Competitive PvP Rankings
              </p>
            </div>
          </div>
          <a
            href="/mod"
            className="notch-sm border border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-widest text-ash transition-colors hover:border-crimson-bright hover:text-bone"
          >
            Mod Menu
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-crimson-bright">
          Season Rankings
        </p>
        <h2 className="mt-2 max-w-2xl text-balance font-display text-3xl font-bold leading-tight text-bone md:text-4xl">
          The definitive competitive Minecraft PvP tier list.
        </h2>
        <p className="mt-3 max-w-xl text-pretty leading-relaxed text-ash">
          Player rankings from HT1 down to LT5 across every gamemode, with an
          overall tier computed from performance in each category.
        </p>
      </section>

      <TierList />

      <footer className="mx-auto max-w-6xl px-4 py-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ash">
          CrestTiers — All rankings maintained by the moderation team.
        </p>
      </footer>
    </main>
  );
}
