import { tierFor } from "@/lib/reputation";
import { cn } from "@/lib/utils";

const TONE_VAR: Record<string, string> = {
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  primary: "var(--primary)",
};

interface TrustScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  /** Show the tier label under the number. */
  showLabel?: boolean;
  className?: string;
}

/** Circular gauge for a 0–100 score, colored by tier. Pure SVG. */
export function TrustScoreRing({
  score,
  size = 180,
  strokeWidth = 12,
  showLabel = true,
  className,
}: TrustScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const { tone, label } = tierFor(clamped);
  const color = TONE_VAR[tone];
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums">{Math.round(clamped)}</span>
        <span className="eyebrow">/ 100</span>
        {showLabel && (
          <span className="mt-1 text-xs font-medium" style={{ color }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
