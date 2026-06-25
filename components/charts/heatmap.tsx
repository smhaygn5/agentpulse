import { cn } from "@/lib/utils";

interface HeatmapProps {
  /** Row-major intensity values in 0..1. */
  rows: number[][];
  className?: string;
}

/** Activity-intensity grid (GitHub-style). Opacity encodes intensity. */
export function Heatmap({ rows, className }: HeatmapProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {rows.map((row, r) => (
        <div key={r} className="flex gap-1">
          {row.map((v, c) => (
            <div
              key={c}
              className="h-3.5 w-3.5 rounded-[3px]"
              style={{
                backgroundColor: "var(--primary)",
                opacity: 0.12 + Math.max(0, Math.min(1, v)) * 0.88,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
