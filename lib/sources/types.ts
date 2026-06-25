import type {
  RawDeveloperSignals,
  RawOnchainSignals,
  RawCommunitySignals,
  RawSecuritySignals,
} from "@/lib/scoring/engine";

/**
 * Chain-agnostic data-source contracts. Each adapter fetches one slice of raw
 * signals for an agent. Real adapters (GitHub, ArcScan, Alchemy/Arc RPC)
 * implement these in Faz 3 behind server-only API keys; a mock adapter
 * implements them for local/demo use. The scoring engine never knows which.
 */
export interface AgentRef {
  id: string;
  name: string;
  symbol: string;
  /** EVM token contract address (checksum-validated upstream). */
  address?: string;
  /** owner/repo or full GitHub URL. */
  repo?: string;
}

export interface DeveloperSource {
  fetchDeveloper(ref: AgentRef): Promise<RawDeveloperSignals>;
}
export interface OnchainSource {
  fetchOnchain(ref: AgentRef): Promise<RawOnchainSignals>;
}
export interface CommunitySource {
  fetchCommunity(ref: AgentRef): Promise<RawCommunitySignals>;
}
export interface SecuritySource {
  fetchSecurity(ref: AgentRef): Promise<RawSecuritySignals>;
}

export interface SignalSources {
  developer: DeveloperSource;
  onchain: OnchainSource;
  community: CommunitySource;
  security: SecuritySource;
}
