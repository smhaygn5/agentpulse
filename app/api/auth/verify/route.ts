import { NextResponse, type NextRequest } from "next/server";
import { parseSiweMessage } from "viem/siwe";
import { recoverMessageAddress } from "viem";
import { z } from "zod";
import { ARC_TESTNET } from "@/lib/chain";
import {
  NONCE_COOKIE,
  SESSION_COOKIE,
  SESSION_MAX_AGE_S,
  createSessionToken,
} from "@/lib/security/session";
import { rateLimit, clientIp } from "@/lib/security/rate-limit";

const bodySchema = z.object({
  message: z.string().max(4000),
  signature: z.string().regex(/^0x[a-fA-F0-9]+$/),
});

/**
 * Verify a SIWE signature and mint a session.
 *
 * Checks (defence in depth): nonce matches the httpOnly cookie, domain is our
 * host, chain is Arc testnet, message not expired, and the recovered signer
 * equals the claimed address. Only then is a signed session cookie set.
 */
export async function POST(request: NextRequest) {
  const limit = rateLimit(`auth:${clientIp(request.headers)}`);
  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const { message, signature } = parsed.data;

  const fields = parseSiweMessage(message);
  const nonceCookie = request.cookies.get(NONCE_COOKIE)?.value;
  if (!fields.address || !fields.nonce || !nonceCookie || fields.nonce !== nonceCookie) {
    return NextResponse.json({ error: "Invalid or expired nonce" }, { status: 401 });
  }

  const host = request.headers.get("host");
  if (fields.domain && host && fields.domain !== host) {
    return NextResponse.json({ error: "Domain mismatch" }, { status: 401 });
  }
  if (fields.chainId !== ARC_TESTNET.id) {
    return NextResponse.json({ error: "Unsupported chain" }, { status: 401 });
  }
  if (fields.expirationTime && new Date(fields.expirationTime).getTime() < Date.now()) {
    return NextResponse.json({ error: "Message expired" }, { status: 401 });
  }

  let recovered: string;
  try {
    recovered = await recoverMessageAddress({
      message,
      signature: signature as `0x${string}`,
    });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  if (recovered.toLowerCase() !== fields.address.toLowerCase()) {
    return NextResponse.json({ error: "Signature mismatch" }, { status: 401 });
  }

  const res = NextResponse.json({ address: recovered });
  res.cookies.set(SESSION_COOKIE, createSessionToken(recovered), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  });
  res.cookies.delete(NONCE_COOKIE);
  return res;
}
