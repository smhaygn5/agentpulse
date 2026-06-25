import "server-only";
import type { DeveloperSource } from "./types";
import type { RawDeveloperSignals } from "@/lib/scoring/engine";
import { mockSources } from "./mock";

/**
 * Real GitHub developer-activity adapter (Faz 3).
 *
 * Security pattern reused by every real adapter:
 *  - reads its key from a server-only env var (never NEXT_PUBLIC_)
 *  - validates/normalizes the user-supplied `repo` to owner/name and only ever
 *    calls api.github.com (SSRF-safe — never an arbitrary host)
 *  - degrades gracefully (returns null / mock) instead of throwing.
 */
const GITHUB_API = "https://api.github.com";
const REPO_RE = /^[\w.-]+\/[\w.-]+$/;

export function normalizeRepo(input?: string): string | null {
  if (!input) return null;
  let repo = input.trim();
  const m = repo.match(/^https?:\/\/github\.com\/([\w.-]+\/[\w.-]+)/i);
  if (m) repo = m[1];
  repo = repo.replace(/\.git$/, "");
  if (!REPO_RE.test(repo)) return null;
  // Reject "." / ".." segments so the path can't be normalized into a
  // different api.github.com endpoint (defense-in-depth).
  if (repo.split("/").some((seg) => seg === "." || seg === "..")) return null;
  return repo;
}

export function githubConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 3600 }, // cache GETs for an hour
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return res.json() as Promise<T>;
}

/**
 * Fetch real developer signals for a repo. Returns null when the token is not
 * configured, the repo is invalid, or GitHub errors — callers decide the
 * fallback. This is the function the /api/scan endpoint uses directly.
 */
export async function fetchGithubDeveloper(
  repoInput: string,
): Promise<RawDeveloperSignals | null> {
  if (!githubConfigured()) return null;
  const repo = normalizeRepo(repoInput);
  if (!repo) return null;

  try {
    const since = new Date(Date.now() - 30 * 86400_000).toISOString();
    const ninetyDaysAgo = Date.now() - 90 * 86400_000;

    const [repoMeta, commits, contributors, releases, closedSearch] =
      await Promise.all([
        gh<{ open_issues_count: number }>(`/repos/${repo}`),
        gh<unknown[]>(`/repos/${repo}/commits?since=${since}&per_page=100`),
        gh<unknown[]>(`/repos/${repo}/contributors?per_page=100`),
        gh<{ published_at: string | null }[]>(`/repos/${repo}/releases?per_page=100`),
        gh<{ total_count: number }>(
          `/search/issues?q=${encodeURIComponent(`repo:${repo} type:issue state:closed`)}&per_page=1`,
        ).catch(() => ({ total_count: 0 })),
      ]);

    const releasesLast90d = Array.isArray(releases)
      ? releases.filter(
          (r) => r.published_at && new Date(r.published_at).getTime() >= ninetyDaysAgo,
        ).length
      : 0;

    return {
      commitsLast30d: Array.isArray(commits) ? commits.length : 0,
      contributors: Array.isArray(contributors) ? contributors.length : 0,
      releasesLast90d,
      openIssues: repoMeta.open_issues_count ?? 0,
      closedIssues: closedSearch.total_count ?? 0,
    };
  } catch {
    return null;
  }
}

export const githubDeveloperSource: DeveloperSource = {
  async fetchDeveloper(ref): Promise<RawDeveloperSignals> {
    const live = ref.repo ? await fetchGithubDeveloper(ref.repo) : null;
    // Fall back to the seeded snapshot when live data is unavailable.
    return live ?? mockSources.developer.fetchDeveloper(ref);
  },
};
