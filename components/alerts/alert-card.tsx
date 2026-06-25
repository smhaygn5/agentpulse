import {
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Users,
  Lock,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type AlertKind =
  | "security_alert"
  | "reputation_change"
  | "activity_drop"
  | "growth_spike"
  | "security";

type AlertTone = "danger" | "success" | "warning" | "primary" | "muted";

const KIND_META: Record<
  AlertKind,
  { icon: LucideIcon; tone: AlertTone; tag: string }
> = {
  security_alert: { icon: ShieldAlert, tone: "danger", tag: "Security Alert" },
  reputation_change: { icon: ShieldCheck, tone: "success", tag: "Reputation Change" },
  activity_drop: { icon: TrendingDown, tone: "warning", tag: "Activity Drop" },
  growth_spike: { icon: Users, tone: "primary", tag: "Growth Spike" },
  security: { icon: Lock, tone: "muted", tag: "Security" },
};

const TONE_CLASS = {
  danger: { ring: "border-danger/40", icon: "bg-danger-soft text-danger", tag: "text-danger" },
  success: { ring: "border-border", icon: "bg-success-soft text-success", tag: "text-success" },
  warning: { ring: "border-border", icon: "bg-warning-soft text-warning", tag: "text-warning" },
  primary: { ring: "border-border", icon: "bg-primary-soft text-primary", tag: "text-primary" },
  muted: { ring: "border-border", icon: "bg-surface-2 text-muted", tag: "text-muted" },
} as const;

export interface AlertItem {
  id: string;
  kind: AlertKind;
  title: string;
  agent: string;
  body: string;
  timeAgo: string;
  critical?: boolean;
}

export function AlertCard({ alert }: { alert: AlertItem }) {
  const meta = KIND_META[alert.kind];
  const cls = TONE_CLASS[meta.tone];
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border bg-surface p-5",
        alert.critical ? cls.ring : "border-border",
      )}
    >
      <div className="flex gap-4">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", cls.icon)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-text">{alert.title}</h3>
            <span className="shrink-0 font-mono text-[0.625rem] text-muted">
              {alert.timeAgo}
            </span>
          </div>
          <p className={cn("mt-1 font-mono text-[0.625rem] uppercase tracking-wide", cls.tag)}>
            {meta.tag} · Agent: {alert.agent}
          </p>
          <p className="mt-2 text-sm text-muted">{alert.body}</p>
          <Link
            href="#"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
