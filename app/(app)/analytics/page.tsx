import type { Metadata } from "next";
import { AGENTS } from "@/lib/mock/agents";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { Sparkline } from "@/components/charts/sparkline";
import { MiniBarChart } from "@/components/charts/mini-bar-chart";
import { Donut } from "@/components/charts/donut";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  const byCategory = AGENTS.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {});
  const categoryColors: Record<string, string> = {
    "AI Agents": "var(--primary)",
    DeFi: "var(--success)",
    Infrastructure: "var(--warning)",
    Gaming: "var(--danger)",
    Trading: "var(--muted)",
  };
  const segments = Object.entries(byCategory).map(([label, value]) => ({
    label,
    value,
    color: categoryColors[label] ?? "var(--muted)",
  }));

  const riskCounts = {
    Low: AGENTS.filter((a) => a.riskLevel === "Low").length,
    Medium: AGENTS.filter((a) => a.riskLevel === "Medium").length,
    High: AGENTS.filter((a) => a.riskLevel === "High").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Analytics</h1>
        <p className="mt-1 text-sm text-muted">
          Ecosystem-wide reputation intelligence across the ARC network.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Tracked Agents" value="12,402" delta="+42 today" />
        <MetricCard
          label="Avg Trust Score"
          value="72"
          chart={<Sparkline data={[60, 62, 61, 65, 68, 70, 72]} width={160} color="var(--success)" />}
        />
        <MetricCard label="Total TVL" value="$142.8M" delta="+3.1%" />
        <MetricCard label="Network Health" value="99.98%" deltaTone="success" delta="Healthy" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center p-5">
          <h3 className="self-start font-semibold">Agents by Category</h3>
          <Donut className="mt-4" centerLabel={`${AGENTS.length}`} centerSub="Agents" segments={segments} />
          <ul className="mt-4 w-full space-y-1.5 text-sm">
            {segments.map((s) => (
              <li key={s.label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label}
                </span>
                <span className="font-medium">{s.value}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold">Network Trust Trend (90d)</h3>
          <Sparkline
            data={[58, 60, 59, 63, 65, 64, 68, 70, 69, 72, 74, 72]}
            width={680}
            height={200}
            color="var(--primary)"
            className="mt-4 w-full"
          />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold">Risk Distribution</h3>
          <div className="mt-4 space-y-3">
            {(["Low", "Medium", "High"] as const).map((level) => {
              const tone = level === "Low" ? "success" : level === "Medium" ? "warning" : "danger";
              const pct = Math.round((riskCounts[level] / AGENTS.length) * 100);
              return (
                <div key={level}>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">{level} Risk</span>
                    <span className="font-medium">{riskCounts[level]} agents</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: `var(--${tone})` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold">Daily Scan Volume</h3>
          <div className="mt-6 flex justify-center">
            <MiniBarChart
              data={[28, 34, 30, 42, 38, 48, 52, 46, 58, 64]}
              width={420}
              height={140}
              color="var(--primary)"
              highlightLast={false}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
