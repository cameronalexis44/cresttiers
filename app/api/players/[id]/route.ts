import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";
import { CATEGORIES, TIERS } from "@/lib/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { ign, category, tier, region } = body ?? {};

  const data: Record<string, unknown> = {};
  if (typeof ign === "string" && ign.trim()) data.ign = ign.trim();
  if (category !== undefined) {
    if (!CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }
    data.category = category;
  }
  if (tier !== undefined) {
    if (!TIERS.includes(tier)) {
      return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
    }
    data.tier = tier;
  }
  if (region !== undefined) data.region = region?.trim() || null;

  const player = await prisma.player.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({ player });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  await prisma.player.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
