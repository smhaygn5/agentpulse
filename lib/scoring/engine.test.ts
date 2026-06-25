import { describe, it, expect } from "vitest";
import {
  scoreDeveloper,
  scoreOnchain,
  scoreCommunity,
  scoreSecurity,
  computeTrustScore,
  scoreAgent,
  SCORE_VERSION,
  type RawSignals,
} from "./engine";

describe("scoring engine", () => {
  it("clamps sub-scores to 0..100", () => {
    const huge = scoreDeveloper({
      commitsLast30d: 99999,
      contributors: 99999,
      releasesLast90d: 99999,
      openIssues: 0,
      closedIssues: 9999,
    });
    expect(huge).toBeLessThanOrEqual(100);
    expect(huge).toBeGreaterThanOrEqual(0);

    const zero = scoreDeveloper({
      commitsLast30d: 0,
      contributors: 0,
      releasesLast90d: 0,
      openIssues: 100,
      closedIssues: 0,
    });
    expect(zero).toBeGreaterThanOrEqual(0);
  });

  it("rewards verified, renounced, locked contracts and penalizes exploits", () => {
    const safe = scoreSecurity({
      contractVerified: true,
      ownershipRenounced: true,
      liquidityLocked: true,
      top10HolderPct: 12,
      priorExploits: false,
      criticalAlerts: 0,
    });
    const risky = scoreSecurity({
      contractVerified: false,
      ownershipRenounced: false,
      liquidityLocked: false,
      top10HolderPct: 80,
      priorExploits: true,
      criticalAlerts: 3,
    });
    expect(safe).toBeGreaterThan(risky);
    expect(safe).toBeGreaterThan(80);
    expect(risky).toBe(0);
  });

  it("applies the 40/30/20/10 weighting", () => {
    expect(
      computeTrustScore({ developer: 100, onchain: 0, community: 0, security: 0 }),
    ).toBe(40);
    expect(
      computeTrustScore({ developer: 0, onchain: 100, community: 0, security: 0 }),
    ).toBe(30);
    expect(
      computeTrustScore({ developer: 80, onchain: 80, community: 80, security: 80 }),
    ).toBe(80);
  });

  it("produces a versioned, reproducible result", () => {
    const raw: RawSignals = {
      developer: { commitsLast30d: 60, contributors: 10, releasesLast90d: 6, openIssues: 5, closedIssues: 95 },
      onchain: { holders: 4000, liquidityUsd: 5_000_000, volume24hUsd: 800_000, walletRetentionPct: 68, smartMoneyPct: 12, top10HolderPct: 24 },
      community: { followers: 45000, followerGrowthPct: 5, engagementPct: 3.2, sentimentPositivePct: 65 },
      security: { contractVerified: true, ownershipRenounced: true, liquidityLocked: true, top10HolderPct: 24, priorExploits: false, criticalAlerts: 0 },
    };
    const a = scoreAgent(raw);
    const b = scoreAgent(raw);
    expect(a).toEqual(b);
    expect(a.version).toBe(SCORE_VERSION);
    expect(a.trustScore).toBeGreaterThan(60);
    expect(scoreOnchain(raw.onchain)).toBeGreaterThan(0);
    expect(scoreCommunity(raw.community)).toBeGreaterThan(0);
  });
});
