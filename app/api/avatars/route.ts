import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Max size of the stored data URL (~600KB of base64 => ~450KB png)
const MAX_DATA_URL = 600_000;

export async function GET() {
  try {
    const avatars = await prisma.playerAvatar.findMany();
    return NextResponse.json({ avatars });
  } catch {
    return NextResponse.json({ avatars: [] });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { ign, dataUrl } = body ?? {};

  if (typeof ign !== "string" || !ign.trim()) {
    return NextResponse.json({ error: "A player IGN is required." }, { status: 400 });
  }
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
    return NextResponse.json({ error: "A PNG image is required." }, { status: 400 });
  }
  if (dataUrl.length > MAX_DATA_URL) {
    return NextResponse.json({ error: "Image is too large (max ~400KB)." }, { status: 400 });
  }

  const key = ign.trim().toLowerCase();

  const avatar = await prisma.playerAvatar.upsert({
    where: { ign: key },
    create: {
      ign: key,
      displayIgn: ign.trim(),
      dataUrl,
      updatedBy: session?.user?.email ?? null,
    },
    update: {
      displayIgn: ign.trim(),
      dataUrl,
      updatedBy: session?.user?.email ?? null,
    },
  });

  return NextResponse.json({ avatar }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const ign = req.nextUrl.searchParams.get("ign");
  if (!ign) {
    return NextResponse.json({ error: "An IGN is required." }, { status: 400 });
  }
  await prisma.playerAvatar.deleteMany({ where: { ign: ign.trim().toLowerCase() } });
  return NextResponse.json({ ok: true });
}
