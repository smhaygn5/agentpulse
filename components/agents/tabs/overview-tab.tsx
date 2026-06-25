import { Sparkles } from "lucide-react";
import type { Agent } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Heatmap } from "@/components/charts/heatmap";
import { MiniBarChart } from "@/components/charts/mini-bar-chart";

export function OverviewTab({ agent }: { agent: Agent }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">AI Analysis</h3>
            </div>

            <div>
              <p className="eyebrow text-success">Strengths</p>
              <ol className="mt-2 space-y-2">
                {agent.ai.strengths.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-strong">
                    <span className="font-mono text-xs text-primary">
                      0{i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <p className="eyebrow text-warning">Risks</p>
              <p className="mt-2 text-sm text-muted-strong">{agent.ai.risks}</p>
            </div>

            <div className="rounded-lg border border-border bg-bg-elevated p-4">
              <p className="eyebrow">AI Recommendation</p>
              <p className="mt-2 text-sm italic text-muted-strong">
                &ldquo;{agent.ai.recommendation}&rdquo;
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="p-5">
            <p className="eyebrow">Asset Health Metrics</p>
            <div className="mt-4 space-y-4">
              <Metric label="Uptime Velocity" value="99.98%" pct={99} tone="success" />
              <Metric
                label="Latency Alpha"
                value="124ms"
                pct={62}
                tone="primary"
              />
            </div>
          </Card>
          <Card className="p-5">
            <p className="eyebrow">Social Sentiment</p>
            <div className="mt-6 flex items-end justify-center">
              <MiniBarChart
                data={[14, 18, 22, 30, 40, 26, 20]}
                width={220}
                height={90}
                color="var(--success)"
              />
            </div>
            <p className="mt-3 text-center text-xs text-muted">
              Peak activity during Governance Vote
            </p>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-5">
          <p className="eyebrow">Agent Intelligence Meta</p>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Model Architecture" value="Pulse-GPT4-Custom" />
            <Row label="Training Epochs" value="1,402" />
            <Row label="Self-Correction Rate" value="91.2%" />
            <Row label="Neural Drift Index" value="Low (0.02)" tone="success" />
          </dl>
        </Card>
        <Card className="p-5">
          <p className="eyebrow">Network Heatmap</p>
          <Heatmap rows={agent.developer.activityHeatmap.slice(0, 3)} className="mt-4" />
          <div className="mt-3 flex justify-between font-mono text-[0.625rem] text-muted">
            <span>Less Activity</span>
            <span>High Traffic</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  pct,
  tone,
}: {
  label: string;
  value: string;
  pct: number;
  tone: "success" | "primary";
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: `var(--${tone})` }}
        />
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-0">
      <dt className="text-muted">{label}</dt>
      <dd className={`font-medium ${tone ? `text-${tone}` : ""}`}>{value}</dd>
    </div>
  );
}
