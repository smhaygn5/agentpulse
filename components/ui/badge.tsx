import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[0.625rem] font-medium uppercase tracking-wide",
  {
    variants: {
      tone: {
        success: "border-success/30 bg-success-soft/60 text-success",
        warning: "border-warning/30 bg-warning-soft/60 text-warning",
        danger: "border-danger/30 bg-danger-soft/60 text-danger",
        primary: "border-primary/30 bg-primary-soft/60 text-primary",
        neutral: "border-border bg-surface-2 text-muted",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps
  extends ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
