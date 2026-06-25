import type { Metadata } from "next";
import { Wallet, Bell, KeyRound, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConnectWallet } from "@/components/wallet/connect-wallet";
import { SettingToggle } from "@/components/settings/setting-toggle";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your account, alerts and API access.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <SectionHeader icon={Wallet} title="Wallet" />
          <Row
            label="Connected Wallet"
            desc="Connect MetaMask on Arc testnet to track agents and unlock Pro."
            action={<ConnectWallet />}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <SectionHeader icon={Bell} title="Alerts" />
          <SettingToggle id="alert_repdrop" label="Reputation drop alerts" desc="Notify when a watched agent drops 10+ points." defaultOn />
          <SettingToggle id="alert_security" label="Security alerts" desc="Critical contract & liquidity events." defaultOn />
          <SettingToggle id="alert_growth" label="Community surge alerts" desc="Sudden social volume spikes." />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <SectionHeader icon={KeyRound} title="API Access" badge="Pro" />
          <Row
            label="API Key"
            desc="Programmatic access to trust scores and webhooks."
            action={<Button variant="secondary" size="sm">Upgrade to Pro</Button>}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <SectionHeader icon={Palette} title="Appearance" />
          <Row
            label="Theme"
            desc="AgentPulse ships dark by default."
            action={<Badge tone="primary">Dark</Badge>}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge?: string;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-border pb-3">
      <Icon className="h-4 w-4 text-primary" />
      <h2 className="font-semibold">{title}</h2>
      {badge && <Badge tone="primary">{badge}</Badge>}
    </div>
  );
}

function Row({
  label,
  desc,
  action,
}: {
  label: string;
  desc: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted">{desc}</p>
      </div>
      {action}
    </div>
  );
}

