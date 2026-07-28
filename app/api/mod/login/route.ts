import { NextRequest, NextResponse } from "next/server";
import { checkModCode, issueModSessionCookie } from "@/lib/mod-auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : "";

  if (!checkModCode(code)) {
    return NextResponse.json({ ok: false, error: "Incorrect code." }, { status: 401 });
  }

  issueModSessionCookie();
  return NextResponse.json({ ok: true });
}
