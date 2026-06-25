import {
  LayoutDashboard,
  Bot,
  BarChart3,
  Bell,
  Settings,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Show in the mobile bottom tab bar (space is limited there). */
  mobile?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, mobile: true },
  { label: "Agents", href: "/agents", icon: Bot, mobile: true },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy, mobile: true },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Alerts", href: "/alerts", icon: Bell, mobile: true },
  { label: "Settings", href: "/settings", icon: Settings },
];

/** Active when the current path equals or is nested under the item href. */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
