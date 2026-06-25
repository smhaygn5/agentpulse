"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActivePath } from "@/lib/nav";
import { cn } from "@/lib/utils";

/** Bottom tab bar shown on small screens; mirrors the mobile screenshots. */
export function MobileTabBar() {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((i) => i.mobile);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-bg-elevated/95 backdrop-blur lg:hidden">
      {items.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.625rem] font-medium uppercase tracking-wide",
              active ? "text-primary" : "text-muted",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
