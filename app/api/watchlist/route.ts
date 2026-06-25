import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";

/**
 * Example Pro-gated resource. Server-side authz: no valid SIWE session -> 401.
 * (Persistence + real Pro entitlement check land with the database in Faz 5.)
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Sign in with your wallet to access the watchlist." },
      { status: 401 },
    );
  }
  return NextResponse.json({ address: session.address, items: [] });
}
