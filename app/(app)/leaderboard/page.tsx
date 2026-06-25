"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { AGENTS } from "@/lib/mock/agents";
import type { AgentCategory } from "@/lib/types";
import { tierFor } from "@/lib/reputation";
import { shortenAddress } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentAvatar } from "@/components/agents/agent-avatar";
import { cn } from "@/lib/utils";

const FILTERS: ("All" | AgentCategory)[] = [
  "All",
  "AI Agents",
  "DeFi",
  "Infrastructure",
  "Gaming",
  "Trading",
];

const TONE_TEXT: Record<string, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  primary: "text-primary",
};

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AGENTS.filter(
      (a) =>
        (filter === "All" || a.category === filter) &&
        (!q ||
          a.name.toLowerCase().includes(q) ||
          a.symbol.toLowerCase().includes(q) ||
          a.address.toLowerCase().includes(q)),
    );
  }, [filter, query]);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-primary">● Live Network Performance</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">
          Reputation Leaderboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Real-time trust scores and performance metrics for the autonomous agent
          economy. Validated by ARC consensus.
        </p>
        <Badge tone="neutral" className="mt-3">
          Sample data — real on-chain ranking lands in v2
        </Badge>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                filter === f
                  ? "bg-primary text-white"
                  : "border border-border text-muted hover:text-text",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or hash…"
            className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm focus:border-primary/50 focus:outline-none"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {["Rank", "Agent", "Trust Score", "Category", "24h Trend"].map((h) => (
                  <th key={h} className="px-5 py-3 font-mono text-[0.625rem] uppercase tracking-wide text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const tier = tierFor(a.trustScore);
                return (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-surface-2/50">
                    <td className="px-5 py-4 font-mono font-semibold tabular-nums">
                      {String(a.rank).padStart(2, "0")}
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/agents/${a.id}`} className="flex items-center gap-3">
                        <AgentAvatar name={a.name} hue={a.avatarHue} size={36} />
                        <div>
                          <p className="font-medium">{a.name}</p>
                          <p className="font-mono text-[0.625rem] text-muted">
                            {shortenAddress(a.address)}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-lg font-bold tabular-nums", TONE_TEXT[tier.tone])}>
                          {a.trustScore}
                        </span>
                        {a.trustScore >= 95 && <Badge tone="success">High Trust</Badge>}
                        {a.trustScore >= 80 && a.trustScore < 95 && (
                          <Badge tone="success">Trusted</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted">{a.category}</td>
                    <td className={cn("px-5 py-4 font-mono tabular-nums", a.trend24hPct >= 0 ? "text-success" : "text-danger")}>
                      {a.trend24hPct >= 0 ? "+" : ""}
                      {a.trend24hPct}%
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted">
                    No agents match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
