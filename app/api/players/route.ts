import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";
import { CATEGORIES, TIERS } from "@/lib/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const players = await prisma.player.findMany({
    orderBy: [{ category: "asc" }, { tier: "asc" }, { ign: "asc" }],
  });
  return NextResponse.json({ players });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { ign, category, tier, region } = body ?? {};

  if (typeof ign !== "string" || !ign.trim()) {
    return NextResponse.json({ error: "A player IGN is required." }, { status: 400 });
  }
  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }
  if (!TIERS.includes(tier)) {
    return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
  }

  const cleanIgn = ign.trim();
  const cleanRegion =
    typeof region === "string" && region.trim() ? region.trim() : null;

  // Same name = same person: reuse the spelling already on file so casing /
  // stray spaces never create a second player.
  const existingForName = await prisma.player.findMany({
    where: { ign: { equals: cleanIgn, mode: "insensitive" } },
  });

  const canonicalIgn = existingForName[0]?.ign ?? cleanIgn;
  const duplicates = existingForName.filter((p) => p.category === category);

  if (duplicates.length > 0) {
    // Collapse any accidental duplicates in this gamemode down to one row.
    const [keep, ...extra] = duplicates;
    if (extra.length > 0) {
      await prisma.player.deleteMany({ where: { id: { in: extra.map((p) => p.id) } } });
    }
    const player = await prisma.player.update({
      where: { id: keep.id },
      data: {
        ign: canonicalIgn,
        tier,
        region: cleanRegion ?? keep.region,
        addedBy: session?.user?.email ?? keep.addedBy,
      },
    });
    return NextResponse.json({ player, merged: true });
  }

  const player = await prisma.player.create({
    data: {
      ign: canonicalIgn,
      category,
      tier,
      region: cleanRegion ?? existingForName.find((p) => p.region)?.region ?? null,
      addedBy: session?.user?.email ?? null,
    },
  });

  return NextResponse.json({ player }, { status: 201 });
}
