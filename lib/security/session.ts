import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stateless, HMAC-signed session for SIWE auth. The cookie holds
 * `address.exp.signature`; we verify the signature with a constant-time
 * compare and check expiry. No DB needed for the MVP.
 *
 * SESSION_SECRET must be set in production; dev falls back to a fixed insecure
 * value so the app runs out of the box (never use that value in prod).
 */
/**
 * Resolve the signing secret lazily so module evaluation never throws at build
 * time. In production a real SESSION_SECRET is required; dev gets a fixed
 * insecure fallback so the app runs out of the box.
 */
function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "dev-insecure-session-secret";
  throw new Error("SESSION_SECRET must be set in production.");
}

export const SESSION_COOKIE = "ap_session";
export const NONCE_COOKIE = "ap_nonce";
export const SESSION_MAX_AGE_S = 60 * 60 * 24 * 7; // 7 days

export interface Session {
  address: string;
  exp: number;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createSessionToken(address: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_S;
  const payload = `${address.toLowerCase()}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): Session | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [address, expStr, sig] = parts;
  const expected = sign(`${address}.${expStr}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return null;
  return { address, exp };
}
