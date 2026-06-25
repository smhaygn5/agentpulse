"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, LifeBuoy } from "lucide-react";
import { NAV_ITEMS, isActivePath } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { ProUpgradeCard } from "./pro-upgrade-card";

/** Desktop left navigation rail (hidden on mobile, see MobileTabBar). */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-bg-elevated lg:flex">
      <div className="flex items-center gap-2.5 px-6 py-5">
        <Logo size={34} className="rounded-lg" />
        <div className="leading-tight">
          <p className="text-lg font-bold tracking-tight">AgentPulse</p>
          <p className="eyebrow">ARC Ecosystem</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-surface-2 hover:text-text",
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 px-3 pb-4">
        <ProUpgradeCard />
        <div className="space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:text-text"
          >
            <HelpCircle className="h-[18px] w-[18px]" /> Help
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:text-text"
          >
            <LifeBuoy className="h-[18px] w-[18px]" /> Support
          </Link>
        </div>
      </div>
    </aside>
  );
}
