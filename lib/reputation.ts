/**
 * Shared reputation vocabulary used across the UI and (later) the scoring
 * engine. Categories and weights come straight from the product spec:
 *
 *   Trust Score = 0.40·Developer + 0.30·Onchain + 0.20·Community + 0.10·Security
 */

export const SCORE_WEIGHTS = {
  developer: 0.4,
  onchain: 0.3,
  community: 0.2,
  security: 0.1,
} as const;

export type ScoreDimension = keyof typeof SCORE_WEIGHTS;

export type TrustTier =
  | "Critical"
  | "Weak"
  | "Developing"
  | "Strong"
  | "Trusted";

export interface TierMeta {
  tier: TrustTier;
  /** Token name from globals.css (success | warning | danger | primary). */
  tone: "success" | "warning" | "danger" | "primary";
  label: string;
}

/** Map a 0–100 score to its tier + display tone. */
export function tierFor(score: number): TierMeta {
  if (score <= 20) return { tier: "Critical", tone: "danger", label: "Critical Risk" };
  if (score <= 40) return { tier: "Weak", tone: "danger", label: "Weak" };
  if (score <= 60) return { tier: "Developing", tone: "warning", label: "Developing" };
  if (score <= 80) return { tier: "Strong", tone: "primary", label: "Strong" };
  return { tier: "Trusted", tone: "success", label: "Trusted" };
}

export type RiskLevel = "Low" | "Medium" | "High";

export function riskTone(level: RiskLevel): "success" | "warning" | "danger" {
  if (level === "Low") return "success";
  if (level === "Medium") return "warning";
  return "danger";
}
