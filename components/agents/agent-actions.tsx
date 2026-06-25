"use client";

import { useState } from "react";
import { Share2, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/lib/hooks/use-watchlist";

/** Share (copy link) + Monitor (watchlist toggle) for the agent detail header. */
export function AgentActions({ id }: { id: string; name: string }) {
  const { has, toggle } = useWatchlist();
  const [copied, setCopied] = useState(false);
  const monitoring = has(id);

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={share}>
        {copied ? <Check className="h-4 w-4 text-success" /> : <Share2 className="h-4 w-4" />}
        {copied ? "Copied" : "Share"}
      </Button>
      <Button
        size="sm"
        variant={monitoring ? "secondary" : "primary"}
        onClick={() => toggle(id)}
      >
        {monitoring ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        {monitoring ? "Monitoring" : "Monitor Agent"}
      </Button>
    </div>
  );
}
