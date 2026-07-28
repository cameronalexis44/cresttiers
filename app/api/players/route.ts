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

  const player = await prisma.player.create({
    data: {
      ign: ign.trim(),
      category,
      tier,
      region: typeof region === "string" && region.trim() ? region.trim() : null,
      addedBy: session?.user?.email ?? null,
    },
  });

  return NextResponse.json({ player }, { status: 201 });
}
