import { NextResponse, type NextRequest } from "next/server";

/**
 * Content-Security-Policy.
 *
 * Trade-off note: a nonce + 'strict-dynamic' policy only works when every page
 * is dynamically rendered, because a per-request nonce can't be injected into
 * statically prerendered (SSG/ISR) HTML. This app is mostly static for
 * performance, so we use `script-src 'self' 'unsafe-inline'` in production
 * instead. That still blocks cross-origin script injection and, combined with
 * `object-src 'none'`, `base-uri 'self'` and `frame-ancestors 'none'`, gives a
 * solid policy. We have no HTML-injection sinks (no dangerouslySetInnerHTML),
 * so the residual inline-script risk is low. (Revisit with force-dynamic +
 * nonce if a stricter policy is ever required.)
 *
 * Dev additionally needs 'unsafe-eval' and ws: for HMR / React Fast Refresh.
 * Static security headers (HSTS, X-Frame-Options, …) live in next.config.ts.
 */
export function proxy(_request: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";

  const directives = [
    `default-src 'self'`,
    isDev
      ? `script-src 'self' 'unsafe-eval' 'unsafe-inline'`
      : `script-src 'self' 'unsafe-inline'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    // 'self' for our API; Arc testnet RPC for wallet/chain reads (viem).
    isDev
      ? `connect-src 'self' https://rpc.testnet.arc.network ws:`
      : `connect-src 'self' https://rpc.testnet.arc.network`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ];
  if (!isDev) directives.push(`upgrade-insecure-requests`);

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", directives.join("; "));
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
