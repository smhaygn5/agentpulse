import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "./card";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  /** Small delta string e.g. "+5%" with tone coloring. */
  delta?: string;
  deltaTone?: "success" | "danger" | "muted";
  sub?: ReactNode;
  /** Optional visual (sparkline / mini bar chart) shown below the value. */
  chart?: ReactNode;
  className?: string;
}

const DELTA_CLASS = {
  success: "text-success",
  danger: "text-danger",
  muted: "text-muted",
} as const;

/** The KPI/stat card pattern used across Dashboard, Onchain and detail pages. */
export function MetricCard({
  label,
  value,
  delta,
  deltaTone = "success",
  sub,
  chart,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="eyebrow">{label}</p>
        {delta && (
          <span className={cn("text-xs font-medium", DELTA_CLASS[deltaTone])}>
            {delta}
          </span>
        )}
      </div>
      <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
      {chart && <div className="mt-3">{chart}</div>}
    </Card>
  );
}
