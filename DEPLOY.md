# Deploying AgentPulse to Vercel

A dedicated git repo is already initialized in this folder (branch `main`) with
an initial commit. `.env.local` is git-ignored and was **not** committed.

## 1. Push to GitHub

Create an empty repo on GitHub (no README/license), then:

```bash
git remote add origin https://github.com/<you>/agentpulse.git
git push -u origin main
```

(Or use the GitHub CLI: `gh repo create agentpulse --private --source=. --push`.)

## 2. Import into Vercel

1. https://vercel.com → **Add New… → Project** → import your `agentpulse` repo.
2. Framework preset is auto-detected as **Next.js**. Leave build settings default
   (`next build`). No `vercel.json` needed.

## 3. Set environment variables (Vercel → Settings → Environment Variables)

Add these for **Production** (and Preview if you want):

| Name | Value |
| --- | --- |
| `SESSION_SECRET` | **Required.** Copy the value from your local `.env.local` (the line generated during setup), or make a new one: `openssl rand -base64 32`. |
| `GITHUB_TOKEN` | Your read-only GitHub token (enables live scans). Same value as local. |
| `NEXT_PUBLIC_APP_NAME` | `AgentPulse` (optional) |

> Never paste secrets into the repo or chat — set them only in Vercel's env UI.
> `SESSION_SECRET` must be present in production or session auth will error.

## 4. Deploy

Vercel deploys automatically on push to `main`. Each PR/branch gets a preview URL.

## 5. Post-deploy checks

- Open the production URL → Dashboard loads, dark theme, "Live GitHub Scan" works.
- DevTools → Network → response headers include a strict
  `Content-Security-Policy` (nonce-based, no `unsafe-eval`) and `Strict-Transport-Security`.
- Connect MetaMask → Switch to Arc Testnet → Sign in (SIWE) → "Signed in ✓".
- `GET /api/watchlist` returns **401** when signed out, data when signed in.

## Notes

- **Prod CSP nonce:** production uses a strict nonce + `strict-dynamic` CSP. If
  any first-party script is blocked after deploy, confirm Next.js is forwarding
  the middleware nonce to its script tags (see [proxy.ts](proxy.ts)); this is the
  one thing to verify live. Dev intentionally relaxes the CSP.
- **OneDrive:** if you keep developing inside OneDrive, exclude `.next` from sync
  (or move the repo out) to avoid intermittent `EPERM` build locks.
- **Later (Faz-2):** add `DATABASE_URL` (Neon/Supabase), `UPSTASH_*` (shared
  rate-limit), `ANTHROPIC_API_KEY` (AI analysis), Arc data-source keys.
