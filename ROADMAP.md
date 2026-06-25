# AgentPulse — Roadmap

Trust layer for the AI agent economy on **Circle Arc** (EVM L1, testnet; gas in USDC).

## Shipped (MVP — Faz 0–5)

- **Design system & shell** — dark "AgentPulse" UI, sidebar/topbar/mobile tab bar, full component library (`/styleguide`).
- **Pages** — Dashboard, Agents + detail (Overview/Developer/Community/Onchain/Security tabs), Leaderboard, Alerts, Analytics, Settings.
- **Scoring engine** — deterministic, versioned `Trust = 0.40·Dev + 0.30·Onchain + 0.20·Community + 0.10·Security` (`lib/scoring`).
- **Live data** — real GitHub developer signals via `/api/scan` (token server-side, SSRF-safe, rate-limited). Other sources mock behind chain-agnostic adapters.
- **Wallet** — MetaMask + Arc testnet (chain 5042002, USDC gas) via wagmi/viem + EIP-6963.
- **Auth** — Sign-In With Ethereum (nonce → sign → verify → HMAC session cookie); Pro-gated `/api/watchlist`.
- **Security** — strict prod CSP (nonce), HSTS/X-Frame-Options, zod validation, rate limiting, no XSS sinks, server-only secrets.
- **Quality** — Vitest unit tests (scoring/validation/session/adapters), Playwright e2e, dynamic OG share cards, ISR.

## v2 — Data depth

- **On-chain adapter (Arc)** — ArcScan + Arc RPC: holders, liquidity, volume, retention, concentration → real Onchain score.
- **Security adapter** — contract verification, ownership, liquidity-lock, honeypot simulation against Arc.
- **Community adapter** — X/Discord/Telegram signals (or alternatives, given X API cost).
- **AI analysis** — Claude (`claude-haiku-4-5` for cost / `claude-opus-4-8` for depth) generating strengths/risks/verdict from structured scores; output rendered as sanitized text.

## v2 — Persistence & Pro

- **Database** (Postgres + Prisma) — agents, score snapshots (7D/24H trends), user watchlists.
- **Score history** — store every snapshot with `scoreVersion` for auditable, reproducible trends.
- **Alerts backend** — watchlist thresholds → email/webhook (Pro), Vercel Cron re-indexing.
- **Public API + webhooks** — Pro entitlement checks, API keys, real-time Rep-Drop webhooks.

## v3 — Ecosystem

- **On-chain attestations** — publish trust scores as on-chain attestations on Arc.
- **Agent-to-Agent reliability** — reputation graph for agents evaluating agents (success rate, verified tasks, economic trust).
- **Multi-chain** — extend adapters beyond Arc as the agent economy spans chains.
- **Mini App** — Base/Farcaster MiniKit surface reusing the same scoring core.

## Known constraints

- Arc is testnet; no token / mainnet yet (mainnet expected ~summer 2026). On-chain adapters mature with the network.
- MetaMask `addEthereumChain` requires `decimals: 18` though Arc gas is USDC/6 — handled in `lib/wagmi.ts`.
- Project currently lives under OneDrive → exclude `.next` from sync or move the repo to avoid `EPERM` build locks.
