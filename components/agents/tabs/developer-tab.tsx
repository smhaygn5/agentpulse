import type { Agent } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { MiniBarChart } from "@/components/charts/mini-bar-chart";
import { Sparkline } from "@/components/charts/sparkline";
import { Heatmap } from "@/components/charts/heatmap";
import { formatCompact } from "@/lib/utils";

export function DeveloperTab({ agent }: { agent: Agent }) {
  const d = agent.developer;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Commits" value={formatCompact(d.commits)} />
        <MetricCard label="Contributors" value={d.contributors} />
        <MetricCard label="Releases" value={d.releases} />
        <MetricCard label="Open Issues" value={d.openIssues} />
        <MetricCard label="Closed Issues" value={d.closedIssues} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold">Commit Activity (Last 12 Months)</h3>
          <Sparkline
            data={d.commitTrend}
            width={680}
            height={180}
            color="var(--primary)"
            className="mt-4 w-full"
          />
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold">Release Frequency</h3>
          <div className="mt-6 flex justify-center">
            <MiniBarChart
              data={d.releaseByQuarter}
              width={220}
              height={150}
              color="var(--success)"
            />
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Avg. PR Merge Time</span>
              <span className="font-semibold">{d.avgPrMergeHours} Hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Test Coverage</span>
              <span className="font-semibold text-success">{d.testCoverage}%</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold">Activity Intensity</h3>
        <Heatmap rows={d.activityHeatmap} className="mt-4" />
      </Card>
    </div>
  );
}
