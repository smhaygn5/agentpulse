import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";

/** Return the current authenticated address (or null). */
export async function GET() {
  const session = await getSession();
  return NextResponse.json({ address: session?.address ?? null });
}
