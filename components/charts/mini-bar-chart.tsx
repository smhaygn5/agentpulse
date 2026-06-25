interface MiniBarChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  /** Highlight the last bar (common in the "7D trend" cells). */
  highlightLast?: boolean;
  className?: string;
}

/** Compact bar chart used in trend cells and developer/release panels. */
export function MiniBarChart({
  data,
  width = 110,
  height = 40,
  color = "var(--success)",
  highlightLast = true,
  className,
}: MiniBarChartProps) {
  if (data.length === 0) return null;
  const max = Math.max(...data) || 1;
  const gap = 3;
  const barWidth = (width - gap * (data.length - 1)) / data.length;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      {data.map((v, i) => {
        const h = Math.max(2, (v / max) * height);
        const x = i * (barWidth + gap);
        const isLast = i === data.length - 1;
        return (
          <rect
            key={i}
            x={x}
            y={height - h}
            width={barWidth}
            height={h}
            rx={1.5}
            fill={color}
            opacity={highlightLast ? (isLast ? 1 : 0.45) : 0.8}
          />
        );
      })}
    </svg>
  );
}
