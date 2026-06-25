import { Search } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ConnectWallet } from "@/components/wallet/connect-wallet";

/**
 * Top bar: brand (mobile only), global search, live status and Connect Wallet.
 * Wallet is a placeholder button until Faz 4 wires SIWE.
 */
export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-bg/80 px-4 py-3 backdrop-blur lg:px-8">
      {/* Brand shown only on mobile (sidebar carries it on desktop) */}
      <div className="flex items-center gap-2 lg:hidden">
        <Logo size={30} className="rounded-lg" />
        <span className="text-base font-bold">AgentPulse</span>
      </div>

      <div className="relative hidden flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          placeholder="Search agent name, token or github repository…"
          className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-16 text-sm text-text placeholder:text-muted focus:border-primary/50 focus:outline-none"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[0.625rem] text-muted">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 md:inline-flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
          <span className="eyebrow text-success">Live Monitoring</span>
        </span>
        <ConnectWallet />
      </div>
    </header>
  );
}
