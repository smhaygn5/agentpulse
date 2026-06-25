import { NextResponse, type NextRequest } from "next/server";

/**
 * Content-Security-Policy.
 *
 * Production: strict, nonce-based with 'strict-dynamic' (no eval, no inline).
 * Development: relaxed — Next.js dev/HMR and React Fast Refresh require
 * 'unsafe-eval' and inline scripts, and the dev server talks over websockets.
 * Locking those down in dev breaks the client bundle (the "eval() is not
 * supported" error), which is why interactive UI (e.g. the wallet button)
 * stops updating. Static security headers live in next.config.ts.
 */
export function proxy(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const directives = [
    `default-src 'self'`,
    isDev
      ? `script-src 'self' 'unsafe-eval' 'unsafe-inline'`
      : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    // 'self' for our API; Arc testnet RPC for wallet/chain reads (viem).
    // Dev also needs ws: for HMR.
    isDev
      ? `connect-src 'self' https://rpc.testnet.arc.network ws:`
      : `connect-src 'self' https://rpc.testnet.arc.network`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ];
  // upgrade-insecure-requests would force ws:// -> wss:// and break local HMR.
  if (!isDev) directives.push(`upgrade-insecure-requests`);

  const csp = directives.join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
