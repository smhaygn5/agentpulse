"use client";

import { useState } from "react";
import { Boxes, Loader2, Search, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OnchainResult {
  address: string;
  isContract: boolean;
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  totalSupply: string | null;
  owner: string | null;
  ownershipRenounced: boolean | null;
  holders: number | null;
  transfers: number | null;
  reputation: string | null;
  explorerUrl: string;
}

function fmtCount(n: number | null): string {
  if (n == null) return "—";
  return n.toLocaleString("en-US");
}

function fmtSupply(s: string | null): string {
  if (!s) return "—";
  const n = Number(s);
  if (!Number.isFinite(n)) return s;
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function OnchainLookupCard() {
  const [addr, setAddr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OnchainResult | null>(null);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    if (!addr.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/onchain?address=${encodeURIComponent(addr.trim())}`);
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Lookup failed");
      else setResult(data);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Boxes className="h-5 w-5 text-success" />
          <h2 className="text-lg font-semibold">On-chain Lookup</h2>
        </div>
        <Badge tone="success">Arc Testnet · real RPC</Badge>
      </div>
      <p className="mt-1 text-xs text-muted">
        Reads live contract data from the Arc testnet public RPC.
      </p>

      <form onSubmit={lookup} className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            placeholder="0x… contract / token address on Arc testnet"
            className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 font-mono text-sm focus:border-primary/50 focus:outline-none"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Look up"}
        </Button>
      </form>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}

      {result && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <Badge tone={result.isContract ? "success" : "warning"}>
              {result.isContract ? "Contract" : "EOA (no code)"}
            </Badge>
            {result.symbol && <Badge tone="primary">{result.symbol}</Badge>}
            {result.ownershipRenounced === true && (
              <Badge tone="success">Ownership renounced</Badge>
            )}
            {result.ownershipRenounced === false && (
              <Badge tone="warning">Owned</Badge>
            )}
            {result.reputation && result.reputation !== "ok" && (
              <Badge tone="danger">Flagged: {result.reputation}</Badge>
            )}
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Row label="Name" value={result.name ?? "—"} />
            <Row label="Symbol" value={result.symbol ?? "—"} />
            <Row label="Decimals" value={result.decimals?.toString() ?? "—"} />
            <Row label="Total Supply" value={fmtSupply(result.totalSupply)} />
            <Row label="Holders" value={fmtCount(result.holders)} />
            <Row label="Transfers" value={fmtCount(result.transfers)} />
            <Row
              label="Owner"
              value={
                result.owner
                  ? `${result.owner.slice(0, 6)}…${result.owner.slice(-4)}`
                  : "—"
              }
            />
          </dl>
          <a
            href={result.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View on ArcScan <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </Card>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-1">
      <dt className="text-muted">{label}</dt>
      <dd className={muted ? "text-xs text-muted" : "font-medium"}>{value}</dd>
    </div>
  );
}
