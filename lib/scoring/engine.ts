import { SCORE_WEIGHTS } from "@/lib/reputation";
import type { SubScores } from "@/lib/types";

/**
 * Deterministic, versioned reputation scoring engine.
 *
 * Raw signals (from data adapters) -> normalized 0–100 sub-scores -> a single
 * weighted Trust Score. Every function here is pure so it can be unit tested
 * and so a stored score can always be reproduced from its inputs + version.
 *
 *   Trust = 0.40·Developer + 0.30·Onchain + 0.20·Community + 0.10·Security
 */
export const SCORE_VERSION = "1.0.0";

// ---- normalization helpers ------------------------------------------------

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

/** Linear ramp: <=min -> 0, >=max -> 100. */
function ramp(value: number, min: number, max: number): number {
  if (max === min) return value >= max ? 100 : 0;
  return clamp(((value - min) / (max - min)) * 100);
}

/** Ratio in [0,1] -> 0..100. */
const pct = (ratio: number) => clamp(ratio * 100);

/** Weighted average of {value, weight} parts. */
function weighted(parts: { v: number; w: number }[]): number {
  const totalW = parts.reduce((s, p) => s + p.w, 0) || 1;
  return clamp(parts.reduce((s, p) => s + p.v * p.w, 0) / totalW);
}

// ---- raw signal shapes (produced by adapters) -----------------------------

export interface RawDeveloperSignals {
  commitsLast30d: number;
  contributors: number;
  releasesLast90d: number;
  openIssues: number;
  closedIssues: number;
}

export interface RawOnchainSignals {
  holders: number;
  liquidityUsd: number;
  volume24hUsd: number;
  walletRetentionPct: number; // 0..100
  smartMoneyPct: number; // 0..100
  top10HolderPct: number; // 0..100 (higher = worse)
}

export interface RawCommunitySignals {
  followers: number;
  followerGrowthPct: number; // weekly %
  engagementPct: number; // 0..100
  sentimentPositivePct: number; // 0..100
}

export interface RawSecuritySignals {
  contractVerified: boolean;
  ownershipRenounced: boolean;
  liquidityLocked: boolean;
  top10HolderPct: number; // 0..100 (higher = worse)
  priorExploits: boolean;
  criticalAlerts: number;
}

export interface RawSignals {
  developer: RawDeveloperSignals;
  onchain: RawOnchainSignals;
  community: RawCommunitySignals;
  security: RawSecuritySignals;
}

// ---- per-dimension scorers ------------------------------------------------

export function scoreDeveloper(s: RawDeveloperSignals): number {
  // When closedIssues is 0 we treat resolution as unknown (neutral 0.5) rather
  // than a hard 0 — a 0 usually means the optional closed-issue count was
  // unavailable (e.g. GitHub Search API rate limit), not genuine inactivity.
  const issueResolution =
    s.closedIssues > 0
      ? s.closedIssues / (s.openIssues + s.closedIssues)
      : 0.5;
  return Math.round(
    weighted([
      { v: ramp(s.commitsLast30d, 0, 100), w: 0.4 },
      { v: ramp(s.contributors, 1, 20), w: 0.25 },
      { v: ramp(s.releasesLast90d, 0, 10), w: 0.15 },
      { v: pct(issueResolution), w: 0.2 },
    ]),
  );
}

export function scoreOnchain(s: RawOnchainSignals): number {
  const concentrationPenalty = ramp(s.top10HolderPct, 10, 60); // 0..100 bad
  return Math.round(
    weighted([
      { v: ramp(s.holders, 100, 5000), w: 0.25 },
      { v: ramp(s.liquidityUsd, 50_000, 10_000_000), w: 0.25 },
      { v: ramp(s.volume24hUsd, 10_000, 2_000_000), w: 0.15 },
      { v: clamp(s.walletRetentionPct), w: 0.15 },
      { v: clamp(s.smartMoneyPct * 3), w: 0.1 },
      { v: 100 - concentrationPenalty, w: 0.1 },
    ]),
  );
}

export function scoreCommunity(s: RawCommunitySignals): number {
  return Math.round(
    weighted([
      { v: ramp(s.followers, 1_000, 80_000), w: 0.3 },
      { v: ramp(s.followerGrowthPct, -2, 10), w: 0.25 },
      { v: ramp(s.engagementPct, 0.5, 6), w: 0.2 },
      { v: clamp(s.sentimentPositivePct), w: 0.25 },
    ]),
  );
}

export function scoreSecurity(s: RawSecuritySignals): number {
  let score = 0;
  score += s.contractVerified ? 30 : 0;
  score += s.ownershipRenounced ? 25 : 0;
  score += s.liquidityLocked ? 25 : 0;
  score += (100 - ramp(s.top10HolderPct, 10, 60)) * 0.2; // up to 20
  if (s.priorExploits) score -= 30;
  score -= s.criticalAlerts * 10;
  return Math.round(clamp(score));
}

// ---- composition ----------------------------------------------------------

export function computeTrustScore(scores: SubScores): number {
  return Math.round(
    scores.developer * SCORE_WEIGHTS.developer +
      scores.onchain * SCORE_WEIGHTS.onchain +
      scores.community * SCORE_WEIGHTS.community +
      scores.security * SCORE_WEIGHTS.security,
  );
}

export interface ScoreResult {
  version: string;
  scores: SubScores;
  trustScore: number;
}

export function scoreAgent(raw: RawSignals): ScoreResult {
  const scores: SubScores = {
    developer: scoreDeveloper(raw.developer),
    onchain: scoreOnchain(raw.onchain),
    community: scoreCommunity(raw.community),
    security: scoreSecurity(raw.security),
  };
  return {
    version: SCORE_VERSION,
    scores,
    trustScore: computeTrustScore(scores),
  };
}
