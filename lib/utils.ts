import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Compact number formatting: 12402 -> "12,402", 1200000 -> "1.2M". */
export function formatCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 10_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString("en-US");
}

/** Truncate an EVM address: 0x1234...abcd */
export function shortenAddress(addr: string, chars = 4): string {
  if (!addr.startsWith("0x") || addr.length < 10) return addr;
  return `${addr.slice(0, 2 + chars)}…${addr.slice(-chars)}`;
}

/** Relative "x ago" label from a timestamp (ms). */
export function timeAgo(tsMs: number): string {
  const diff = Date.now() - tsMs;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}
