import { Logo } from "@/components/brand/logo";
import { SearchBox } from "@/components/layout/search-box";
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

      <SearchBox />

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
