import type { Agent } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { Donut } from "@/components/charts/donut";
import { Sparkline } from "@/components/charts/sparkline";
import { formatCompact } from "@/lib/utils";

export function OnchainTab({ agent }: { agent: Agent }) {
  const o = agent.onchain;
  const dist = o.holderDistribution;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <MetricCard
          label="Holders"
          value={formatCompact(o.holders)}
          delta={`${o.holdersDeltaPct > 0 ? "+" : ""}${o.holdersDeltaPct}%`}
          deltaTone={o.holdersDeltaPct >= 0 ? "success" : "danger"}
        />
        <MetricCard label="Liquidity" value={`$${formatCompact(o.liquidityUsd)}`} />
        <MetricCard label="Volume (24h)" value={`$${formatCompact(o.volume24hUsd)}`} />
        <MetricCard label="Wallet Retention" value={`${o.walletRetentionPct}%`} />
        <MetricCard label="Smart Money" value={`${o.smartMoneyPct}%`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center p-5">
          <h3 className="self-start font-semibold">Holder Distribution</h3>
          <Donut
            className="mt-4"
            centerLabel={formatCompact(o.holders)}
            centerSub="Total Wallets"
            segments={[
              { label: "Public", value: dist.public, color: "var(--warning)" },
              { label: "VCs", value: dist.vcs, color: "var(--success)" },
              { label: "Whales", value: dist.whales, color: "var(--muted)" },
              { label: "Team", value: dist.team, color: "var(--primary)" },
            ]}
          />
          <ul className="mt-4 grid w-full grid-cols-2 gap-2 text-sm">
            <DistRow color="var(--primary)" label="Team" value={dist.team} />
            <DistRow color="var(--success)" label="VCs" value={dist.vcs} />
            <DistRow color="var(--warning)" label="Public" value={dist.public} />
            <DistRow color="var(--muted)" label="Whales" value={dist.whales} />
          </ul>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold">Liquidity Depth</h3>
          <p className="eyebrow mt-1">Pool: {agent.symbol}/USDC (Arc)</p>
          <Sparkline
            data={[40, 36, 30, 28, 32, 38, 44, 52, 60]}
            width={620}
            height={180}
            color="var(--success)"
            className="mt-4 w-full"
          />
          <div className="mt-3 flex justify-between font-mono text-[0.625rem] text-muted">
            <span>Buy Wall</span>
            <span>Volume Weighted Midpoint</span>
            <span>Sell Wall</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DistRow({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <li className="flex items-center gap-2 text-muted">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label} <span className="ml-auto font-medium text-text">{value}%</span>
    </li>
  );
}
