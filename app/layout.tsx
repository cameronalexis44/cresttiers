import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CrestTiers — Competitive Minecraft PvP Tier List",
  description:
    "The definitive competitive Minecraft PvP tier list. Rankings across Crystal, Sword, Mace, Axe, NethPot, UHC, SMP, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} bg-void`}>
      <body className="font-display bg-void text-bone antialiased">
        {children}
      </body>
    </html>
  );
}
