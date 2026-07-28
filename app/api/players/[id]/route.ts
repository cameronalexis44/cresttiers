import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hasValidModSession } from "@/lib/mod-auth";
import { CATEGORIES, TIERS } from "@/lib/constants";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!hasValidModSession()) {
    return NextResponse.json({ error: "Mod access required." }, { status: 403 });
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
  if (!hasValidModSession()) {
    return NextResponse.json({ error: "Mod access required." }, { status: 403 });
  }

  await prisma.player.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
