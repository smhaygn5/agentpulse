import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-border bg-surface",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-5 pb-0", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3 className={cn("text-lg font-semibold text-text", className)} {...props} />
  );
}

/** Monospace uppercase eyebrow used on most cards in the design. */
export function CardEyebrow({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("eyebrow", className)} {...props} />;
}
