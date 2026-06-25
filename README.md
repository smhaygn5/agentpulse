# AgentPulse

**AI Agent Reputation Scanner for the Circle Arc ecosystem.** Enter an agent
name, token address, or GitHub repo and get a unified **Trust Score (0–100)**
aggregated from developer activity, on-chain behavior, community signals, and
security indicators — with an explainable report.

> Target chain: **Circle Arc** (EVM L1, currently testnet; gas paid in USDC).
> Wallet: MetaMask. See [ROADMAP.md](ROADMAP.md) for what's next.

## Stack

Next.js 16 (App Router, RSC) · TypeScript · Tailwind CSS v4 · wagmi v3 / viem ·
SIWE auth · Vitest + Playwright.

## Trust Score

```
Trust = 0.40·Developer + 0.30·Onchain + 0.20·Community + 0.10·Security
```

Deterministic and versioned — see [lib/scoring/engine.ts](lib/scoring/engine.ts).
Tiers: 0–20 Critical · 21–40 Weak · 41–60 Developing · 61–80 Strong · 81–100 Trusted.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in secrets (see below)
npm run dev                  # http://localhost:3000
```

### Environment (`.env.local`, git-ignored)

| Var | Required | Purpose |
| --- | --- | --- |
| `SESSION_SECRET` | prod | HMAC secret for SIWE session cookies (`openssl rand -base64 32`) |
| `GITHUB_TOKEN` | optional | Enables live GitHub scans (read-only public repo scope) |
| `NEXT_PUBLIC_APP_NAME` | optional | Display name (defaults to "AgentPulse") |
| `ARCSCAN_API_KEY`, `ARC_RPC_API_KEY`, `ANTHROPIC_API_KEY`, `UPSTASH_*`, `DATABASE_URL` | later | Faz-2 data/AI/persistence |

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run test       # vitest unit tests
npm run e2e        # playwright e2e (needs: npx playwright install chromium)
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## Deployment

See [DEPLOY.md](DEPLOY.md) (Vercel).

## Security

Strict CSP (nonce in prod), HSTS, X-Frame-Options, zod input validation,
per-IP rate limiting, SSRF-locked GitHub adapter, server-only secrets, SIWE
with nonce/domain/chain/expiry checks and HMAC session cookies.
