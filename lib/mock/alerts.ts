import type { AlertItem } from "@/components/alerts/alert-card";

export const ALERTS: AlertItem[] = [
  {
    id: "a1",
    kind: "security_alert",
    title: "Critical Security Vulnerability",
    agent: "NeuralLink-9",
    body: "Unusual private key export attempts detected on mainnet node. Automated circuit breaker triggered. Immediate audit required.",
    timeAgo: "4m ago",
    critical: true,
  },
  {
    id: "a2",
    kind: "reputation_change",
    title: "Reputation Milestone Achieved",
    agent: "Sentinel-Prime",
    body: "Sentinel-Prime has reached a Trust Score of 98/100 following 5,000 successful cross-chain verifications with zero latency spikes.",
    timeAgo: "12m ago",
  },
  {
    id: "a3",
    kind: "activity_drop",
    title: "Developer Activity Drop",
    agent: "GPT-Oracle-v4",
    body: "Commit frequency has dropped by 65% over the last 48 hours. Main maintainer repository has shown no activity since the latest hard fork.",
    timeAgo: "1h ago",
  },
  {
    id: "a4",
    kind: "growth_spike",
    title: "Community Growth Surge",
    agent: "Meme-Master-AI",
    body: "Social mention volume increased by 400% in the last hour. Correlation detected with a trending thread on X/Twitter regarding AI governance.",
    timeAgo: "3h ago",
  },
  {
    id: "a5",
    kind: "security",
    title: "Routine Security Patch Applied",
    agent: "Multi-Node-Alpha",
    body: "Version 2.4.1 hotfix successfully deployed across all nodes. No downtime was reported during the rollout process.",
    timeAgo: "5h ago",
  },
];
