import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardEyebrow, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { ScoreBar } from "@/components/ui/score-bar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrustScoreRing } from "@/components/charts/trust-score-ring";
import { Sparkline } from "@/components/charts/sparkline";
import { MiniBarChart } from "@/components/charts/mini-bar-chart";
import { Donut } from "@/components/charts/donut";
import { Heatmap } from "@/components/charts/heatmap";
import { AlertCard } from "@/components/alerts/alert-card";

export const metadata: Metadata = { title: "Style Guide" };

const spark = [12, 18, 14, 22, 19, 28, 24, 33, 30, 41];
const bars = [8, 14, 10, 18, 22, 16, 30];
const heat = Array.from({ length: 4 }, () =>
  Array.from({ length: 16 }, () => Math.random()),
);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="eyebrow">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleGuidePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Style Guide</h1>
        <p className="mt-1 text-sm text-muted">
          AgentPulse design system — Faz 1 component gallery.
        </p>
      </div>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="success">Success</Button>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge tone="success">Trusted</Badge>
          <Badge tone="primary">High Trust</Badge>
          <Badge tone="warning">Medium</Badge>
          <Badge tone="danger">High</Badge>
          <Badge tone="neutral">Neutral</Badge>
        </div>
      </Section>

      <Section title="Metric cards">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total Agents Tracked" value="12,402" />
          <MetricCard
            label="Avg Trust Score"
            value="72 / 100"
            chart={<ScoreBar value={72} />}
          />
          <MetricCard
            label="High Risk Agents"
            value="142"
            delta="+5%"
            deltaTone="danger"
          />
          <MetricCard
            label="Holders"
            value="1,240"
            delta="+4.2%"
            chart={<Sparkline data={spark} width={160} color="var(--success)" />}
          />
        </div>
      </Section>

      <Section title="Charts">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="flex flex-col items-center p-6">
            <CardEyebrow className="self-start">Trust Score Ring</CardEyebrow>
            <TrustScoreRing score={84} className="mt-4" />
          </Card>
          <Card className="p-6">
            <CardEyebrow>Sparkline / Bars</CardEyebrow>
            <div className="mt-6 space-y-6">
              <Sparkline data={spark} width={260} height={48} />
              <MiniBarChart data={bars} width={260} height={56} />
            </div>
          </Card>
          <Card className="flex flex-col items-center p-6">
            <CardEyebrow className="self-start">Donut</CardEyebrow>
            <Donut
              className="mt-4"
              centerLabel="1.2k"
              centerSub="Total"
              segments={[
                { label: "Public", value: 40, color: "var(--warning)" },
                { label: "VCs", value: 25, color: "var(--success)" },
                { label: "Whales", value: 20, color: "var(--muted)" },
                { label: "Team", value: 15, color: "var(--primary)" },
              ]}
            />
          </Card>
        </div>
        <Card className="p-6">
          <CardEyebrow>Activity Heatmap</CardEyebrow>
          <Heatmap rows={heat} className="mt-4" />
        </Card>
      </Section>

      <Section title="Tabs">
        <Card>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="developer">Developer</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <CardTitle>Overview content</CardTitle>
              </TabsContent>
              <TabsContent value="developer">
                <CardTitle>Developer content</CardTitle>
              </TabsContent>
              <TabsContent value="security">
                <CardTitle>Security content</CardTitle>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Section>

      <Section title="Alerts">
        <div className="space-y-3">
          <AlertCard
            alert={{
              id: "1",
              kind: "security_alert",
              title: "Critical Security Vulnerability",
              agent: "NeuralLink-9",
              body: "Unusual private key export attempts detected on mainnet node. Automated circuit breaker triggered.",
              timeAgo: "4m ago",
              critical: true,
            }}
          />
          <AlertCard
            alert={{
              id: "2",
              kind: "reputation_change",
              title: "Reputation Milestone Achieved",
              agent: "Sentinel-Prime",
              body: "Reached a Trust Score of 98/100 following 5,000 successful cross-chain verifications.",
              timeAgo: "12m ago",
            }}
          />
        </div>
      </Section>
    </div>
  );
}
