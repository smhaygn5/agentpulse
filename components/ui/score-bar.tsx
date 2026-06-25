import { tierFor } from "@/lib/reputation";
import { cn } from "@/lib/utils";

const TONE_VAR: Record<string, string> = {
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  primary: "var(--primary)",
};

interface ScoreBarProps {
  value: number;
  /** Force a tone; otherwise derived from the score tier. */
  tone?: "success" | "warning" | "danger" | "primary";
  className?: string;
}

/** Thin progress bar under sub-scores (Developer/Onchain/etc). */
export function ScoreBar({ value, tone, className }: ScoreBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const color = TONE_VAR[tone ?? tierFor(clamped).tone];
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-border", className)}>
      <div
        className="h-full rounded-full"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}
