import { NextResponse, type NextRequest } from "next/server";
import { fetchGithubDeveloper, githubConfigured } from "@/lib/sources/github";
import { scoreDeveloper, SCORE_VERSION } from "@/lib/scoring/engine";
import { githubRepo } from "@/lib/security/validation";
import { rateLimit, clientIp } from "@/lib/security/rate-limit";

/**
 * GET /api/scan?repo=owner/repo — live developer reputation for a real GitHub
 * repository. Powers the dashboard "Live GitHub Scan" card.
 *
 * Security: repo is zod-validated (host-locked, SSRF-safe), requests are
 * rate-limited per IP, and the GitHub token stays server-side.
 */
export async function GET(request: NextRequest) {
  const limit = rateLimit(`scan:${clientIp(request.headers)}`);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const raw = request.nextUrl.searchParams.get("repo") ?? "";
  const parsed = githubRepo.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Provide a valid owner/repo or github.com URL" },
      { status: 400 },
    );
  }

  if (!githubConfigured()) {
    return NextResponse.json(
      {
        live: false,
        message:
          "GITHUB_TOKEN is not configured. Add it to .env.local to enable live scans.",
      },
      { status: 200 },
    );
  }

  const signals = await fetchGithubDeveloper(parsed.data);
  if (!signals) {
    return NextResponse.json(
      { error: "Repository not found or GitHub request failed" },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      live: true,
      repo: parsed.data,
      version: SCORE_VERSION,
      developerScore: scoreDeveloper(signals),
      signals,
    },
    { headers: { "Cache-Control": "private, max-age=300" } },
  );
}
