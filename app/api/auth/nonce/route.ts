import { NextResponse } from "next/server";
import { generateSiweNonce } from "viem/siwe";
import { NONCE_COOKIE } from "@/lib/security/session";

/** Issue a single-use SIWE nonce and bind it to an httpOnly cookie. */
export async function GET() {
  const nonce = generateSiweNonce();
  const res = NextResponse.json({ nonce });
  res.cookies.set(NONCE_COOKIE, nonce, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 300,
  });
  return res;
}
