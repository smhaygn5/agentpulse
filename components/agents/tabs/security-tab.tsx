import { ShieldCheck, Lock, Users, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { Agent } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBar } from "@/components/ui/score-bar";

const RESULT_META = {
  PASS: { tone: "success" as const, icon: CheckCircle2 },
  NOTICE: { tone: "warning" as const, icon: Info },
  FAIL: { tone: "danger" as const, icon: AlertTriangle },
};

export function SecurityTab({ agent }: { agent: Agent }) {
  const s = agent.security;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <p className="eyebrow">Live Alerts</p>
          </div>
          <p className="mt-3 text-2xl font-bold">
            {s.criticalAlerts}{" "}
            <span className="text-sm font-normal text-muted">Critical</span>
          </p>
          <p className="text-sm text-warning">{s.minorAlerts} Minor Issues</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-success" />
            <p className="eyebrow">Ownership Risk</p>
          </div>
          <p className="mt-3 text-xl font-bold">{s.ownership}</p>
          <p className="text-sm text-success">Safe State</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-success" />
            <p className="eyebrow">Liquidity Risk</p>
          </div>
          <p className="mt-3 text-xl font-bold">
            {s.liquidityLock === "Unlocked" ? "Unlocked" : "Locked"}
          </p>
          <p className="text-sm text-muted">{s.liquidityLock}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <p className="eyebrow">Concentration</p>
          </div>
          <p className="mt-3 text-2xl font-bold">{s.concentrationPct}%</p>
          <p className="text-sm text-muted">Top-10 holder share</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold">Whale Concentration</h3>
          <p className="mt-1 text-sm text-muted">
            Top 10 holders control {s.top10Pct}% of supply.
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Top Holder</span>
                <span className="font-medium">{s.topHolderPct}%</span>
              </div>
              <ScoreBar value={s.topHolderPct * 6} tone="primary" className="mt-1.5" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Aggregated Top 10</span>
                <span className="font-medium">{s.top10Pct}%</span>
              </div>
              <ScoreBar value={s.top10Pct * 2} tone="success" className="mt-1.5" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold">Historical Issues</h3>
          <div className="mt-4 space-y-3 text-sm">
            <CheckRow
              label="No prior exploits found"
              detail="Searched through 48 known vulnerability databases."
              ok={!s.priorExploits}
              tag={s.priorExploits ? "FOUND" : "PASS"}
            />
            <CheckRow
              label="Contract Verified"
              detail="Source matches bytecode on ArcScan."
              ok={s.contractVerified}
              tag={s.contractVerified ? "PASS" : "FAIL"}
            />
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-5 pb-3">
          <h3 className="font-semibold">Automated Forensics</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-border text-left">
              {["Test Vector", "Result", "Certainty"].map((h) => (
                <th key={h} className="px-5 py-2.5 font-mono text-[0.625rem] uppercase tracking-wide text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {s.checks.map((chk) => {
              const meta = RESULT_META[chk.result];
              const Icon = meta.icon;
              return (
                <tr key={chk.label} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 text-${meta.tone}`} />
                      <div>
                        <p className="font-medium">{chk.label}</p>
                        <p className="text-xs text-muted">{chk.detail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={meta.tone}>{chk.result}</Badge>
                  </td>
                  <td className="px-5 py-3 font-mono tabular-nums">{chk.certainty}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function CheckRow({
  label,
  detail,
  ok,
  tag,
}: {
  label: string;
  detail: string;
  ok: boolean;
  tag: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0">
      <div className="flex gap-2">
        {ok ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
        ) : (
          <AlertTriangle className="mt-0.5 h-4 w-4 text-danger" />
        )}
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-xs text-muted">{detail}</p>
        </div>
      </div>
      <Badge tone={ok ? "success" : "danger"}>{tag}</Badge>
    </div>
  );
}
