import { SCORE_WEIGHTS, type RiskLevel } from "@/lib/reputation";
import type { Agent, AgentCategory } from "@/lib/types";

/** Tiny deterministic PRNG (mulberry32) so server & client render identically. */
function rng(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const NAMES: { name: string; symbol: string; category: AgentCategory }[] = [
  { name: "Sentience-1", symbol: "SENT", category: "AI Agents" },
  { name: "NeuralNexus-7", symbol: "NNX", category: "Infrastructure" },
  { name: "AetherFlow Alpha", symbol: "AETH", category: "DeFi" },
  { name: "SwarmMind Core", symbol: "SWARM", category: "AI Agents" },
  { name: "OracleV3-4", symbol: "ORC", category: "Gaming" },
  { name: "PrismLogic-5", symbol: "PRSM", category: "AI Agents" },
  { name: "TitanOps-6", symbol: "TITAN", category: "Infrastructure" },
  { name: "CipherSent-7", symbol: "CSNT", category: "Gaming" },
  { name: "GigaBrain-8", symbol: "GIGA", category: "Gaming" },
  { name: "VaultKeeper-9", symbol: "VLT", category: "AI Agents" },
  { name: "QuestBot-10", symbol: "QST", category: "Gaming" },
  { name: "NeuralMind", symbol: "MIND", category: "AI Agents" },
  { name: "EthBridge-AI", symbol: "EBR", category: "Infrastructure" },
  { name: "StatPulse V2", symbol: "STAT", category: "Trading" },
  { name: "Agent-X", symbol: "AGX", category: "AI Agents" },
  { name: "Pulse-Bot", symbol: "PLSB", category: "Trading" },
  { name: "Dark-Yield-A1", symbol: "DYA", category: "DeFi" },
  { name: "GhostQuant", symbol: "GHST", category: "Trading" },
  { name: "OmniBot", symbol: "OMNI", category: "AI Agents" },
  { name: "VoidRunner", symbol: "VOID", category: "Trading" },
];

function pickRisk(score: number): RiskLevel {
  if (score >= 70) return "Low";
  if (score >= 45) return "Medium";
  return "High";
}

function genAddress(r: () => number): string {
  const hex = "0123456789abcdef";
  let a = "0x";
  for (let i = 0; i < 40; i++) a += hex[Math.floor(r() * 16)];
  return a;
}

function buildAgent(
  idx: number,
  meta: { name: string; symbol: string; category: AgentCategory },
): Agent {
  const r = rng(hashString(meta.name));
  const range = (lo: number, hi: number) => lo + r() * (hi - lo);
  const int = (lo: number, hi: number) => Math.round(range(lo, hi));

  // Curate a couple of well-known agents to match the screenshots exactly.
  const curated: Record<string, Partial<Agent["scores"]> & { trust?: number }> = {
    "Sentience-1": { developer: 92, onchain: 86, community: 78, security: 91, trust: 84 },
    "NeuralNexus-7": { developer: 99, onchain: 97, community: 96, security: 99, trust: 98.4 },
    "Dark-Yield-A1": { developer: 30, onchain: 22, community: 28, security: 18, trust: 24 },
  };
  const c = curated[meta.name] ?? {};

  const scores = {
    developer: c.developer ?? int(35, 98),
    onchain: c.onchain ?? int(30, 95),
    community: c.community ?? int(35, 96),
    security: c.security ?? int(25, 97),
  };
  const trustScore =
    c.trust ??
    Math.round(
      scores.developer * SCORE_WEIGHTS.developer +
        scores.onchain * SCORE_WEIGHTS.onchain +
        scores.community * SCORE_WEIGHTS.community +
        scores.security * SCORE_WEIGHTS.security,
    );

  const trend7d = Array.from({ length: 8 }, () => int(20, 100));
  const sentPos = int(45, 75);
  const sentNeg = int(5, 20);

  return {
    id: meta.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: meta.name,
    symbol: meta.symbol,
    category: meta.category,
    address: genAddress(r),
    avatarHue: Math.floor(r() * 360),
    rank: idx + 1,
    verified: trustScore >= 60,
    lastScannedMinsAgo: int(1, 90),
    trustScore,
    scores,
    trend24hPct: +(range(-4, 5)).toFixed(2),
    trend7d,
    riskLevel: pickRisk(trustScore),
    developer: {
      healthScore: scores.developer,
      commits: int(400, 4500),
      contributors: int(3, 24),
      releases: int(6, 60),
      openIssues: int(0, 18),
      closedIssues: int(40, 220),
      testCoverage: int(58, 96),
      avgPrMergeHours: +range(1.2, 9).toFixed(1),
      repo: `${meta.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-core`,
      commitTrend: Array.from({ length: 12 }, () => int(8, 60)),
      releaseByQuarter: [int(4, 12), int(8, 16), int(6, 14), int(14, 26)],
      activityHeatmap: Array.from({ length: 4 }, () =>
        Array.from({ length: 24 }, () => r()),
      ),
    },
    community: {
      xFollowers: int(2, 120) * 1000,
      growthRatePct: +range(-2, 9).toFixed(1),
      engagementPct: +range(1.2, 6).toFixed(1),
      discordActivity: scores.community > 70 ? "High" : scores.community > 50 ? "Medium" : "Low",
      telegramActivity: scores.community > 60 ? "High" : "Medium",
      discordMembers: int(200, 4200),
      sentiment: { positive: sentPos, neutral: 100 - sentPos - sentNeg, negative: sentNeg },
      growthTimeline: Array.from({ length: 10 }, (_, i) => int(20, 40) + i * int(3, 8)),
    },
    onchain: {
      holders: int(300, 9000),
      holdersDeltaPct: +range(-3, 6).toFixed(1),
      liquidityUsd: int(800, 24000) * 1000,
      volume24hUsd: int(120, 4200) * 1000,
      walletRetentionPct: int(45, 88),
      smartMoneyPct: int(5, 28),
      holderDistribution: { team: 15, vcs: 25, public: 40, whales: 20 },
    },
    security: {
      score: scores.security,
      criticalAlerts: scores.security > 60 ? 0 : int(1, 3),
      minorAlerts: int(0, 4),
      ownership: scores.security > 75 ? "Renounced" : scores.security > 50 ? "Multisig" : "EOA Owner",
      liquidityLock: scores.security > 60 ? `${int(6, 24)} Months Remaining` : "Unlocked",
      concentrationPct: int(8, 38),
      topHolderPct: +range(2, 9).toFixed(1),
      top10Pct: +range(10, 40).toFixed(1),
      contractVerified: scores.security > 45,
      priorExploits: scores.security < 35,
      checks: [
        { label: "Re-entrancy Guard", detail: "Checking OpenZeppelin standard implementation.", result: scores.security > 40 ? "PASS" : "FAIL", certainty: 99.8 },
        { label: "Honeypot Check", detail: "Simulating sell transactions in sandbox environment.", result: scores.security > 35 ? "PASS" : "FAIL", certainty: 100 },
        { label: "Gas Limit Volatility", detail: "Monitoring execution cost during peak congestion.", result: "NOTICE", certainty: 84.2 },
      ],
    },
    ai: {
      strengths: [
        "Heuristic consistency remains above 94% across all major market cycles.",
        "Developer activity exhibits high-density commits on critical security modules.",
        "Community alignment is strong with the majority of supply in governance contracts.",
      ],
      risks:
        "Recent liquidity shifts on-chain suggest a minor centralization of voting power among a few whales. No malicious behavior detected; monitor treasury outflows for anomalies.",
      recommendation:
        trustScore >= 70
          ? `${meta.name} is a Tier-A asset. Metrics support a 'Maintain Long-Term' thesis with a focus on governance participation.`
          : `${meta.name} shows elevated risk. Treat as speculative until developer cadence and liquidity stabilize.`,
    },
  };
}

// Build once, then sort by trust score so ranks reflect the leaderboard order.
const built = NAMES.map((m, i) => buildAgent(i, m)).sort(
  (a, b) => b.trustScore - a.trustScore,
);
built.forEach((a, i) => (a.rank = i + 1));

export const AGENTS: Agent[] = built;

export function getAgent(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}

export function searchAgents(query: string): Agent[] {
  const q = query.trim().toLowerCase();
  if (!q) return AGENTS;
  return AGENTS.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.symbol.toLowerCase().includes(q) ||
      a.address.toLowerCase().includes(q),
  );
}
