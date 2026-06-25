import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AGENTS } from "@/lib/mock/agents";
import { ALERTS } from "@/lib/mock/alerts";
import { riskTone } from "@/lib/reputation";
import { formatCompact } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/metric-card";
import { MiniBarChart } from "@/components/charts/mini-bar-chart";
import { AgentAvatar } from "@/components/agents/agent-avatar";
import { LiveScanCard } from "@/components/scan/live-scan-card";

export default function DashboardPage() {
  const total = 12402;
  const avgTrust = Math.round(
    AGENTS.reduce((s, a) => s + a.trustScore, 0) / AGENTS.length,
  );
  const highRisk = AGENTS.filter((a) => a.riskLevel === "High").length + 138;
  const trending = AGENTS.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
          Pulse Dashboard
        </h1>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Agents Tracked" value={total.toLocaleString()} />
        <MetricCard
          label="Avg Trust Score"
          value={`${avgTrust} / 100`}
          chart={
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-success"
                style={{ width: `${avgTrust}%` }}
              />
            </div>
          }
        />
        <MetricCard
          label="High Risk Agents"
          value={highRisk}
          delta="+5%"
          deltaTone="danger"
        />
        <MetricCard
          label="Trending Now"
          value={<span className="text-base">{trending[0].name}</span>}
          sub={`· ${trending[1].name}`}
        />
      </div>

      <LiveScanCard />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trending Reputation table */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between p-5 pb-3">
            <h2 className="text-lg font-semibold">Trending Reputation</h2>
            <Link
              href="/agents"
              className="font-mono text-[0.625rem] uppercase tracking-wide text-primary hover:underline"
            >
              View all agents
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-border text-left">
                  {["Agent", "Trust Score", "Risk", "7D Trend", "Last Update"].map(
                    (h) => (
                      <th key={h} className="px-5 py-2.5 font-mono text-[0.625rem] uppercase tracking-wide text-muted">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {AGENTS.slice(0, 6).map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-border last:border-0 hover:bg-surface-2/50"
                  >
                    <td className="px-5 py-3">
                      <Link href={`/agents/${a.id}`} className="flex items-center gap-3">
                        <AgentAvatar name={a.name} hue={a.avatarHue} size={32} />
                        <span className="font-medium">{a.name}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-3 tabular-nums font-semibold">
                      {a.trustScore}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={riskTone(a.riskLevel)}>{a.riskLevel}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <MiniBarChart
                        data={a.trend7d}
                        width={80}
                        height={28}
                        color={`var(--${riskTone(a.riskLevel)})`}
                      />
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted">
                      {a.lastScannedMinsAgo}m ago
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent alerts */}
        <Card>
          <div className="flex items-center justify-between p-5 pb-3">
            <h2 className="text-lg font-semibold">Recent Alerts</h2>
          </div>
          <CardContent className="space-y-4 pt-0">
            {ALERTS.slice(0, 4).map((al) => (
              <div key={al.id} className="border-l-2 border-border pl-3">
                <p className="font-mono text-[0.625rem] uppercase tracking-wide text-muted">
                  {al.timeAgo}
                </p>
                <p className="mt-1 text-sm">
                  <span className="font-medium text-text">{al.agent}</span>{" "}
                  <span className="text-muted">{al.body.slice(0, 80)}…</span>
                </p>
              </div>
            ))}
            <Link
              href="/alerts"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all alerts <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Network status */}
      <Card className="p-5">
        <p className="eyebrow text-primary">Pulse Network Status</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {[
            ["Global Sync", "Healthy", "text-success"],
            ["Nodes Active", "1,024", "text-text"],
            ["Uptime", "99.98%", "text-text"],
          ].map(([label, value, cls]) => (
            <div key={label} className="flex items-center justify-between border-b border-border pb-2 sm:border-0">
              <span className="text-sm text-muted">{label}</span>
              <span className={`text-sm font-semibold ${cls}`}>{value}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          Indexing {formatCompact(1200000)} events across the ARC ecosystem.
        </p>
      </Card>
    </div>
  );
}
