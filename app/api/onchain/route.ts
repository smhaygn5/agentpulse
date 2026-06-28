import { NextResponse, type NextRequest } from "next/server";
import { fetchArcOnchain } from "@/lib/sources/onchain-arc";
import { evmAddress } from "@/lib/security/validation";
import { rateLimit, clientIp } from "@/lib/security/rate-limit";

/**
 * GET /api/onchain?address=0x... — real on-chain facts for an address on the
 * Arc testnet, read from the free public RPC. Address is zod-validated and the
 * request is rate-limited.
 */
export async function GET(request: NextRequest) {
  const limit = rateLimit(`onchain:${clientIp(request.headers)}`);
  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const raw = request.nextUrl.searchParams.get("address") ?? "";
  const parsed = evmAddress.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Provide a valid 0x… address" }, { status: 400 });
  }

  try {
    const data = await fetchArcOnchain(parsed.data);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "private, max-age=120" },
    });
  } catch {
    return NextResponse.json(
      { error: "Arc RPC request failed. Check the address or try again." },
      { status: 502 },
    );
  }
}
