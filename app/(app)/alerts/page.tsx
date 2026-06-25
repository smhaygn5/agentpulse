"use client";

import { useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { ALERTS } from "@/lib/mock/alerts";
import { AlertCard } from "@/components/alerts/alert-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TABS = ["All Alerts", "Critical Only", "By Agent"] as const;

export default function AlertsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All Alerts");
  const alerts =
    tab === "Critical Only" ? ALERTS.filter((a) => a.critical) : ALERTS;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              <span className="eyebrow text-success">System Live</span>
            </span>
            <span className="text-xs text-muted">Last update: 2m ago</span>
          </div>
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold tracking-tight lg:text-3xl">
            <Bell className="h-6 w-6" /> Alerts Center
          </h1>
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                tab === t ? "bg-surface-2 text-text" : "text-muted hover:text-text",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((a) => (
          <AlertCard key={a.id} alert={a} />
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="secondary" size="sm">
          <ChevronDown className="h-4 w-4" /> Load Older Notifications
        </Button>
      </div>
    </div>
  );
}
