import { getAgent } from "@/lib/mock/agents";
import type { SignalSources, AgentRef } from "./types";

/**
 * Mock signal sources derived from the seeded agent dataset. This lets the
 * full pipeline (sources -> scoring engine -> AI summary) run end-to-end with
 * zero API keys, and serves as the fallback when a real adapter has no data.
 */
function agentOrThrow(ref: AgentRef) {
  const a = getAgent(ref.id);
  if (!a) throw new Error(`Unknown agent: ${ref.id}`);
  return a;
}

export const mockSources: SignalSources = {
  developer: {
    async fetchDeveloper(ref) {
      const d = agentOrThrow(ref).developer;
      return {
        commitsLast30d: Math.round(d.commits / 36),
        contributors: d.contributors,
        releasesLast90d: Math.round(d.releases / 4),
        openIssues: d.openIssues,
        closedIssues: d.closedIssues,
      };
    },
  },
  onchain: {
    async fetchOnchain(ref) {
      const o = agentOrThrow(ref).onchain;
      return {
        holders: o.holders,
        liquidityUsd: o.liquidityUsd,
        volume24hUsd: o.volume24hUsd,
        walletRetentionPct: o.walletRetentionPct,
        smartMoneyPct: o.smartMoneyPct,
        top10HolderPct: o.holderDistribution.whales + o.holderDistribution.team,
      };
    },
  },
  community: {
    async fetchCommunity(ref) {
      const c = agentOrThrow(ref).community;
      return {
        followers: c.xFollowers,
        followerGrowthPct: c.growthRatePct,
        engagementPct: c.engagementPct,
        sentimentPositivePct: c.sentiment.positive,
      };
    },
  },
  security: {
    async fetchSecurity(ref) {
      const s = agentOrThrow(ref).security;
      return {
        contractVerified: s.contractVerified,
        ownershipRenounced: s.ownership === "Renounced",
        liquidityLocked: s.liquidityLock !== "Unlocked",
        top10HolderPct: s.top10Pct,
        priorExploits: s.priorExploits,
        criticalAlerts: s.criticalAlerts,
      };
    },
  },
};
