interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutProps {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSub?: string;
  className?: string;
}

/** Donut chart (holder distribution, sentiment). Pure SVG arcs. */
export function Donut({
  segments,
  size = 180,
  thickness = 22,
  centerLabel,
  centerSub,
  className,
}: DonutProps) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <div
      className={`relative inline-flex ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {segments.map((seg, i) => {
          const fraction = seg.value / total;
          const dash = fraction * circumference;
          const segment = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offsetAcc}
            />
          );
          offsetAcc += dash;
          return segment;
        })}
      </svg>
      {(centerLabel || centerSub) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerLabel && (
            <span className="text-2xl font-bold tabular-nums">{centerLabel}</span>
          )}
          {centerSub && <span className="eyebrow">{centerSub}</span>}
        </div>
      )}
    </div>
  );
}
