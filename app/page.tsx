import AccountBar from "@/components/AccountBar";
import TierBoard from "@/components/TierBoard";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="flex items-start justify-between mb-12 flex-wrap gap-6">
        <div>
          <h1 className="font-display text-6xl sm:text-7xl leading-none tracking-tight text-bone">
            BP<span className="text-crimson-bright">TIERS</span>
          </h1>
          <p className="text-ash text-sm mt-2 tracking-wide">
            Community-tested PvP rankings — Minecraft Bedrock Edition
          </p>
        </div>
        <AccountBar />
      </header>

      <TierBoard />

      <footer className="mt-16 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-ash">
        <span>BPTiers is an independent, community-run project.</span>
        <Link href="/mod" className="hover:text-bone transition-colors">
          Mod Menu
        </Link>
      </footer>
    </main>
  );
}
