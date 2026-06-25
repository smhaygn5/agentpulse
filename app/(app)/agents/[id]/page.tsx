import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, ShieldCheck, Share2, TrendingUp } from "lucide-react";
import { AGENTS, getAgent } from "@/lib/mock/agents";
import { tierFor, type ScoreDimension } from "@/lib/reputation";
import { shortenAddress } from "@/lib/utils";
import { arcScanUrl } from "@/lib/chain";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AgentAvatar } from "@/components/agents/agent-avatar";
import { TrustScoreRing } from "@/components/charts/trust-score-ring";
import { MiniBarChart } from "@/components/charts/mini-bar-chart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/agents/tabs/overview-tab";
import { DeveloperTab } from "@/components/agents/tabs/developer-tab";
import { CommunityTab } from "@/components/agents/tabs/community-tab";
import { OnchainTab } from "@/components/agents/tabs/onchain-tab";
import { SecurityTab } from "@/components/agents/tabs/security-tab";

// Pre-render every known agent; re-validate hourly so live scores stay fresh
// once real data sources are wired in.
export const revalidate = 3600;

export function generateStaticParams() {
  return AGENTS.map((a) => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const agent = getAgent(id);
  return { title: agent ? `${agent.name} — Reputation` : "Agent" };
}

const SUB_SCORES: { key: ScoreDimension; label: string; bars: number[] }[] = [
  { key: "developer", label: "Developer Score", bars: [3, 4, 3, 5, 4, 6, 7] },
  { key: "community", label: "Community Score", bars: [2, 4, 5, 4, 6, 5, 7] },
  { key: "onchain", label: "Onchain Score", bars: [4, 3, 5, 4, 5, 6, 5] },
  { key: "security", label: "Security Score", bars: [3, 5, 4, 6, 5, 6, 7] },
];

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = getAgent(id);
  if (!agent) notFound();

  const tier = tierFor(agent.trustScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <AgentAvatar name={agent.name} hue={agent.avatarHue} size={56} />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{agent.name}</h1>
              <Badge tone="primary">Rank #{agent.rank}</Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Last scanned{" "}
                {agent.lastScannedMinsAgo}m ago
              </span>
              <span className="flex items-center gap-1 text-success">
                <ShieldCheck className="h-3.5 w-3.5" /> Fully Audited
              </span>
              <a
                href={arcScanUrl("token", agent.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono hover:text-primary"
              >
                {shortenAddress(agent.address)} ↗
              </a>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button size="sm">Monitor Agent</Button>
        </div>
      </div>

      {/* Score panel */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-6">
          <p className="eyebrow self-start">Global Trust Reputation</p>
          <TrustScoreRing score={agent.trustScore} size={200} className="mt-2" />
          <div className="mt-2 flex items-center gap-2">
            <Badge tone={tier.tone}>{tier.label}</Badge>
          </div>
          <p className="mt-2 flex items-center gap-1 text-sm text-success">
            <TrendingUp className="h-3.5 w-3.5" /> +12% since launch
          </p>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {SUB_SCORES.map((sub) => {
            const value = agent.scores[sub.key];
            const subTier = tierFor(value);
            return (
              <Card key={sub.key} className="p-5">
                <div className="flex items-start justify-between">
                  <p className="eyebrow">{sub.label}</p>
                  <span className="text-xs text-muted">
                    {value >= 50 ? "▲" : "▼"} {(value / 20).toFixed(1)}%
                  </span>
                </div>
                <p className="mt-2 text-3xl font-bold tabular-nums">{value}</p>
                <MiniBarChart
                  data={sub.bars}
                  width={140}
                  height={40}
                  color={`var(--${subTier.tone})`}
                  className="mt-3"
                />
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="developer">Developer Analysis</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="onchain">Onchain</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab agent={agent} />
        </TabsContent>
        <TabsContent value="developer">
          <DeveloperTab agent={agent} />
        </TabsContent>
        <TabsContent value="community">
          <CommunityTab agent={agent} />
        </TabsContent>
        <TabsContent value="onchain">
          <OnchainTab agent={agent} />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab agent={agent} />
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted">
        Trust scores are informational only and not financial advice.
      </p>
    </div>
  );
}
