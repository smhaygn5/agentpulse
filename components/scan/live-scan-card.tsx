"use client";

import { useState } from "react";
import { Code2, Loader2, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreBar } from "@/components/ui/score-bar";
import { tierFor } from "@/lib/reputation";

interface ScanResult {
  live: boolean;
  message?: string;
  repo?: string;
  developerScore?: number;
  signals?: {
    commitsLast30d: number;
    contributors: number;
    releasesLast90d: number;
    openIssues: number;
    closedIssues: number;
  };
}

export function LiveScanCard() {
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  async function scan(e: React.FormEvent) {
    e.preventDefault();
    if (!repo.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/scan?repo=${encodeURIComponent(repo.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Scan failed");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  const tier = result?.developerScore != null ? tierFor(result.developerScore) : null;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Live GitHub Scan</h2>
        </div>
        <span className="eyebrow">Real developer reputation</span>
      </div>

      <form onSubmit={scan} className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="owner/repo  (e.g. vercel/next.js)"
            className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm focus:border-primary/50 focus:outline-none"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Scan"}
        </Button>
      </form>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}

      {result && !result.live && (
        <p className="mt-3 text-sm text-warning">{result.message}</p>
      )}

      {result?.live && result.signals && tier && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-muted">{result.repo}</span>
            <Badge tone="success">Live</Badge>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Developer Score</p>
              <p className={`text-4xl font-bold tabular-nums text-${tier.tone}`}>
                {result.developerScore}
              </p>
            </div>
            <Badge tone={tier.tone}>{tier.label}</Badge>
          </div>
          <ScoreBar value={result.developerScore!} />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
            <Stat label="Commits (30d)" value={result.signals.commitsLast30d} />
            <Stat label="Contributors" value={result.signals.contributors} />
            <Stat label="Releases (90d)" value={result.signals.releasesLast90d} />
            <Stat label="Open Issues" value={result.signals.openIssues} />
            <Stat label="Closed Issues" value={result.signals.closedIssues} />
          </dl>
        </div>
      )}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-1">
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold tabular-nums">{value.toLocaleString()}</dd>
    </div>
  );
}
