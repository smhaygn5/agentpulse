import type { Agent } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { Donut } from "@/components/charts/donut";
import { Sparkline } from "@/components/charts/sparkline";
import { formatCompact } from "@/lib/utils";

export function CommunityTab({ agent }: { agent: Agent }) {
  const c = agent.community;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <MetricCard label="X Followers" value={formatCompact(c.xFollowers)} />
        <MetricCard
          label="Growth Rate"
          value={`${c.growthRatePct > 0 ? "+" : ""}${c.growthRatePct}%/wk`}
          deltaTone={c.growthRatePct >= 0 ? "success" : "danger"}
        />
        <MetricCard label="Engagement" value={`${c.engagementPct}%`} />
        <MetricCard label="Discord" value={c.discordActivity} />
        <MetricCard label="Telegram" value={c.telegramActivity} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold">Growth Timeline</h3>
          <Sparkline
            data={c.growthTimeline}
            width={680}
            height={180}
            color="var(--primary)"
            className="mt-4 w-full"
          />
        </Card>
        <Card className="flex flex-col items-center p-5">
          <h3 className="self-start font-semibold">Social Sentiment</h3>
          <Donut
            className="mt-4"
            centerLabel={`${c.sentiment.positive}%`}
            centerSub="Bullish"
            segments={[
              { label: "Positive", value: c.sentiment.positive, color: "var(--success)" },
              { label: "Neutral", value: c.sentiment.neutral, color: "var(--muted)" },
              { label: "Negative", value: c.sentiment.negative, color: "var(--danger)" },
            ]}
          />
          <ul className="mt-4 w-full space-y-1.5 text-sm">
            <SentRow color="var(--success)" label="Positive" value={c.sentiment.positive} />
            <SentRow color="var(--muted)" label="Neutral" value={c.sentiment.neutral} />
            <SentRow color="var(--danger)" label="Negative" value={c.sentiment.negative} />
          </ul>
        </Card>
      </div>
    </div>
  );
}

function SentRow({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-muted">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </span>
      <span className="font-medium">{value}%</span>
    </li>
  );
}
