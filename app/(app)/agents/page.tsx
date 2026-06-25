"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { AGENTS } from "@/lib/mock/agents";
import { tierFor, riskTone } from "@/lib/reputation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentAvatar } from "@/components/agents/agent-avatar";
import { Sparkline } from "@/components/charts/sparkline";
import { cn } from "@/lib/utils";

const TONE_TEXT: Record<string, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  primary: "text-primary",
};

export default function AgentsPage() {
  const [query, setQuery] = useState("");
  const agents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AGENTS.filter(
      (a) =>
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.symbol.toLowerCase().includes(q) ||
        a.address.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Agents</h1>
          <p className="mt-1 text-sm text-muted">
            {AGENTS.length} agents tracked across the ARC ecosystem.
          </p>
        </div>
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agent, token or repo…"
            className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm focus:border-primary/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((a) => {
          const tier = tierFor(a.trustScore);
          return (
            <Link key={a.id} href={`/agents/${a.id}`}>
              <Card className="p-5 transition-colors hover:border-border-strong">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <AgentAvatar name={a.name} hue={a.avatarHue} size={44} />
                    <div>
                      <p className="font-semibold">{a.name}</p>
                      <p className="font-mono text-[0.625rem] uppercase text-muted">
                        {a.category}
                      </p>
                    </div>
                  </div>
                  <Badge tone={riskTone(a.riskLevel)}>{a.riskLevel}</Badge>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="eyebrow">Trust Score</p>
                    <p className={cn("text-3xl font-bold tabular-nums", TONE_TEXT[tier.tone])}>
                      {a.trustScore}
                    </p>
                  </div>
                  <Sparkline
                    data={a.trend7d}
                    width={110}
                    height={40}
                    color={`var(--${tier.tone})`}
                  />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
