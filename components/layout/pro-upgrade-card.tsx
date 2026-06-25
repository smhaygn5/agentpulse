import Link from "next/link";
import { Button } from "@/components/ui/button";

/** The "Upgrade to Pro" card pinned near the bottom of the sidebar. */
export function ProUpgradeCard() {
  return (
    <div className="rounded-[var(--radius-card)] border border-primary/25 bg-gradient-to-b from-primary-soft/40 to-surface p-4">
      <p className="eyebrow text-primary">Pro Access</p>
      <p className="mt-2 text-sm text-muted-strong">
        Unlock real-time wallet tracking and API access.
      </p>
      <Button asChild className="mt-3 w-full" size="sm">
        <Link href="/settings">Upgrade to Pro</Link>
      </Button>
    </div>
  );
}
