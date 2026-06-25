import type { RiskLevel } from "@/lib/reputation";

export type AgentCategory =
  | "AI Agents"
  | "DeFi"
  | "Infrastructure"
  | "Gaming"
  | "Trading";

export interface SubScores {
  developer: number;
  onchain: number;
  community: number;
  security: number;
}

export interface DeveloperData {
  healthScore: number;
  commits: number;
  contributors: number;
  releases: number;
  openIssues: number;
  closedIssues: number;
  testCoverage: number;
  avgPrMergeHours: number;
  repo: string;
  commitTrend: number[];
  releaseByQuarter: number[];
  activityHeatmap: number[][];
}

export interface CommunityData {
  xFollowers: number;
  growthRatePct: number;
  engagementPct: number;
  discordActivity: "Low" | "Medium" | "High";
  telegramActivity: "Low" | "Medium" | "High";
  discordMembers: number;
  sentiment: { positive: number; neutral: number; negative: number };
  growthTimeline: number[];
}

export interface OnchainData {
  holders: number;
  holdersDeltaPct: number;
  liquidityUsd: number;
  volume24hUsd: number;
  walletRetentionPct: number;
  smartMoneyPct: number;
  holderDistribution: { team: number; vcs: number; public: number; whales: number };
}

export interface SecurityCheck {
  label: string;
  detail: string;
  result: "PASS" | "NOTICE" | "FAIL";
  certainty: number;
}

export interface SecurityData {
  score: number;
  criticalAlerts: number;
  minorAlerts: number;
  ownership: "Renounced" | "Multisig" | "EOA Owner";
  liquidityLock: string;
  concentrationPct: number;
  topHolderPct: number;
  top10Pct: number;
  contractVerified: boolean;
  priorExploits: boolean;
  checks: SecurityCheck[];
}

export interface AiAnalysis {
  strengths: string[];
  risks: string;
  recommendation: string;
}

export interface Agent {
  id: string;
  name: string;
  symbol: string;
  category: AgentCategory;
  address: string;
  avatarHue: number;
  rank: number;
  verified: boolean;
  lastScannedMinsAgo: number;
  trustScore: number;
  scores: SubScores;
  trend24hPct: number;
  trend7d: number[];
  riskLevel: RiskLevel;
  developer: DeveloperData;
  community: CommunityData;
  onchain: OnchainData;
  security: SecurityData;
  ai: AiAnalysis;
}
