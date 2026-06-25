"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Wallet, LogOut, AlertTriangle, ChevronDown, ShieldCheck, PenLine } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { arcTestnet } from "@/lib/wagmi";
import { ARC_TESTNET } from "@/lib/chain";
import { shortenAddress } from "@/lib/utils";
import { useSiwe } from "@/lib/hooks/use-siwe";

type Eip1193 = {
  request: (a: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

type Eip6963Detail = { info?: { rdns?: string; name?: string }; provider: Eip1193 };

const ARC_HEX = `0x${arcTestnet.id.toString(16)}`;

/**
 * Resolve the MetaMask provider explicitly via EIP-6963 so we never talk to a
 * different injected wallet (e.g. Auro) that happens to own window.ethereum.
 */
function findMetaMask(): Promise<Eip1193 | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    const found: Eip6963Detail[] = [];
    const onAnnounce = (e: Event) => {
      const detail = (e as CustomEvent<Eip6963Detail>).detail;
      if (detail?.provider) found.push(detail);
    };
    window.addEventListener("eip6963:announceProvider", onAnnounce);
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    setTimeout(() => {
      window.removeEventListener("eip6963:announceProvider", onAnnounce);
      const mm = found.find((d) => d.info?.rdns === "io.metamask");
      const eth = (window as unknown as { ethereum?: Eip1193 }).ethereum;
      resolve(mm?.provider ?? eth ?? null);
    }, 250);
  });
}

export function ConnectWallet() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [walletChainId, setWalletChainId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const providerRef = useRef<Eip1193 | null>(null);

  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { authed, signIn, signOut, loading: siweLoading } = useSiwe();

  /** Cached MetaMask provider (resolved once). */
  const getMM = useCallback(async (): Promise<Eip1193 | null> => {
    if (providerRef.current) return providerRef.current;
    providerRef.current = await findMetaMask();
    return providerRef.current;
  }, []);

  useEffect(() => setMounted(true), []);

  // Read the wallet's real chain once connected, and react to network changes.
  useEffect(() => {
    if (!isConnected) {
      setWalletChainId(null);
      return;
    }
    let provider: Eip1193 | undefined;
    const onChainChanged = (...args: unknown[]) => {
      setWalletChainId(Number.parseInt(args[0] as string, 16));
    };
    (async () => {
      provider = (await getMM()) ?? undefined;
      if (!provider?.request) return;
      try {
        const hex = (await provider.request({ method: "eth_chainId" })) as string;
        setWalletChainId(Number.parseInt(hex, 16));
      } catch {
        /* ignore */
      }
      provider.on?.("chainChanged", onChainChanged);
    })();
    return () => provider?.removeListener?.("chainChanged", onChainChanged);
  }, [isConnected, getMM]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleConnect() {
    const injected = connectors.find((c) => c.type === "injected");
    if (!injected) return;
    try {
      const provider = await getMM();
      await provider?.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      connect({ connector: injected });
    } catch {
      /* user rejected */
    }
  }

  async function switchToArc() {
    setSwitching(true);
    try {
      const provider = await getMM();
      if (!provider?.request) {
        console.error("[wallet] MetaMask provider not found (EIP-6963).");
        return;
      }
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ARC_HEX }],
        });
      } catch (err) {
        const code = (err as { code?: number })?.code;
        // 4902 = chain not added yet; some wallets wrap it as -32603.
        if (code === 4902 || code === -32603) {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: ARC_HEX,
                chainName: ARC_TESTNET.name,
                nativeCurrency: { name: "USD Coin", symbol: "USDC", decimals: 18 },
                rpcUrls: [ARC_TESTNET.rpcUrl],
                blockExplorerUrls: [ARC_TESTNET.explorerUrl],
              },
            ],
          });
        } else {
          throw err;
        }
      }
      // Re-read so the button only turns green when MetaMask really switched.
      const after = (await provider.request({ method: "eth_chainId" })) as string;
      setWalletChainId(Number.parseInt(after, 16));
    } catch (err) {
      console.error("[wallet] switch to Arc failed:", err);
    } finally {
      setSwitching(false);
    }
  }

  if (!mounted) {
    return (
      <Button size="sm" disabled>
        <Wallet className="h-4 w-4" />
        <span className="hidden sm:inline">Connect Wallet</span>
      </Button>
    );
  }

  const injected = connectors.find((c) => c.type === "injected");
  const wrongChain =
    isConnected && walletChainId !== null && walletChainId !== arcTestnet.id;

  if (!isConnected) {
    if (!injected) {
      return (
        <Button size="sm" asChild>
          <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Install MetaMask</span>
          </a>
        </Button>
      );
    }
    return (
      <Button size="sm" disabled={isPending} onClick={handleConnect}>
        <Wallet className="h-4 w-4" />
        <span className="hidden sm:inline">
          {isPending ? "Connecting…" : "Connect Wallet"}
        </span>
      </Button>
    );
  }

  if (wrongChain) {
    return (
      <Button
        size="sm"
        variant="secondary"
        disabled={switching}
        onClick={switchToArc}
        className="border-warning/40 text-warning"
      >
        <AlertTriangle className="h-4 w-4" />
        <span className="hidden sm:inline">
          {switching ? "Switching…" : `Switch to ${ARC_TESTNET.name}`}
        </span>
      </Button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button size="sm" variant="secondary" onClick={() => setOpen((o) => !o)}>
        <span className="h-2 w-2 rounded-full bg-success" />
        <span className="hidden font-mono text-[0.625rem] uppercase tracking-wide text-success sm:inline">
          Arc
        </span>
        <span className="font-mono text-xs">{shortenAddress(address!)}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </Button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-border bg-surface p-1 shadow-xl">
          <div className="px-3 py-2">
            <p className="eyebrow">{ARC_TESTNET.name}</p>
            <p className="mt-0.5 font-mono text-xs text-muted">{shortenAddress(address!, 6)}</p>
            {authed && authed.toLowerCase() === address!.toLowerCase() && (
              <p className="mt-1 flex items-center gap-1 text-[0.625rem] text-success">
                <ShieldCheck className="h-3 w-3" /> Signed in
              </p>
            )}
          </div>

          {authed && authed.toLowerCase() === address!.toLowerCase() ? (
            <button
              onClick={() => {
                signOut();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted hover:bg-surface-2 hover:text-text"
            >
              <PenLine className="h-4 w-4" /> Sign out
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              disabled={siweLoading}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-primary hover:bg-surface-2 disabled:opacity-50"
            >
              <PenLine className="h-4 w-4" />
              {siweLoading ? "Signing…" : "Sign in (SIWE)"}
            </button>
          )}

          <button
            onClick={() => {
              disconnect();
              signOut();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-danger hover:bg-surface-2"
          >
            <LogOut className="h-4 w-4" /> Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
