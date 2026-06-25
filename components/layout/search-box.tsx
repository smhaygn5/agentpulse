"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { AGENTS } from "@/lib/mock/agents";

/** Global search: jump to the best-matching agent (or the agents list). */
export function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim().toLowerCase();
    if (!query) return;
    const match = AGENTS.find(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.symbol.toLowerCase().includes(query) ||
        a.address.toLowerCase().includes(query),
    );
    router.push(match ? `/agents/${match.id}` : "/agents");
  }

  return (
    <form onSubmit={submit} className="relative hidden flex-1 sm:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        type="search"
        placeholder="Search agent name, token or github repository…"
        className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-16 text-sm text-text placeholder:text-muted focus:border-primary/50 focus:outline-none"
      />
      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[0.625rem] text-muted">
        ⏎
      </kbd>
    </form>
  );
}
