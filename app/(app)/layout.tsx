import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";

/**
 * Authenticated app shell: fixed sidebar on desktop, sticky topbar, and a
 * bottom tab bar on mobile. All product pages render inside this group.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <div className="px-4 pb-24 pt-6 lg:px-8 lg:pb-12">{children}</div>
        <Footer />
      </div>
      <MobileTabBar />
    </div>
  );
}
