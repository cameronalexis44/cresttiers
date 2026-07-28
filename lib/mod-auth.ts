import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "bptiers_mod_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function getSecret() {
  // Falls back to NEXTAUTH_SECRET if a dedicated one isn't set.
  const secret = process.env.MOD_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("Missing NEXTAUTH_SECRET or MOD_SESSION_SECRET env var");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

/**
 * Checks a submitted passcode against MOD_ACCESS_CODE. Never echoes the
 * real code back to the client — only a signed session token is returned.
 */
export function checkModCode(submitted: string): boolean {
  const expected = process.env.MOD_ACCESS_CODE || "";
  if (!expected || !submitted) return false;
  const a = Buffer.from(submitted);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function issueModSessionCookie() {
  const issuedAt = Date.now().toString();
  const token = `${issuedAt}.${sign(issuedAt)}`;
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearModSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export function hasValidModSession(): boolean {
  const cookie = cookies().get(COOKIE_NAME)?.value;
  if (!cookie) return false;
  const [issuedAt, sig] = cookie.split(".");
  if (!issuedAt || !sig) return false;
  const expectedSig = sign(issuedAt);
  if (sig.length !== expectedSig.length) return false;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return false;
  const age = (Date.now() - Number(issuedAt)) / 1000;
  return age >= 0 && age <= MAX_AGE_SECONDS;
}
