import type { Metadata } from "next";
import { Cinzel, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BPTIERS \u2014 Bedrock PvP Tier List",
  description:
    "Community-maintained Bedrock PvP tier rankings across Crystal, Sword, Mace, Axe, NethPot, UHC, SMP and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-void text-bone antialiased">{children}</body>
    </html>
  );
}
