import { NextResponse } from "next/server";
import { clearModSessionCookie } from "@/lib/mod-auth";

export async function POST() {
  clearModSessionCookie();
  return NextResponse.json({ ok: true });
}
