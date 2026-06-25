import { cn } from "@/lib/utils";

interface AgentAvatarProps {
  name: string;
  hue: number;
  size?: number;
  className?: string;
}

/** Deterministic gradient avatar with the agent's initials. */
export function AgentAvatar({ name, hue, size = 36, className }: AgentAvatarProps) {
  const initials = name
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg font-mono font-semibold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: `linear-gradient(135deg, hsl(${hue} 70% 45%), hsl(${(hue + 50) % 360} 70% 35%))`,
      }}
    >
      {initials}
    </div>
  );
}
