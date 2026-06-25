import "server-only";
import { scoreAgent, type RawSignals, type ScoreResult } from "@/lib/scoring/engine";
import { mockSources } from "./mock";
import { githubDeveloperSource } from "./github";
import type { AgentRef, SignalSources } from "./types";

/**
 * Resolve the active signal sources. Each dimension independently upgrades to
 * a real adapter when its API key is configured, otherwise falls back to mock.
 * This makes the "mock -> real" cutover incremental and per-source.
 *
 * `import "server-only"` guarantees adapters (and any secrets they read) can
 * never be bundled into client code.
 */
export function resolveSources(): SignalSources {
  return {
    developer: process.env.GITHUB_TOKEN ? githubDeveloperSource : mockSources.developer,
    onchain: mockSources.onchain, // -> ArcScan / Arc RPC (Alchemy) in Faz 3
    community: mockSources.community, // -> X/social in Faz 3
    security: mockSources.security, // -> ArcScan contract verification in Faz 3
  };
}

export interface AgentReport extends ScoreResult {
  ref: AgentRef;
  raw: RawSignals;
  generatedAt: string;
}

/** Full pipeline: fan out to every source in parallel, then score. */
export async function buildAgentReport(ref: AgentRef): Promise<AgentReport> {
  const sources = resolveSources();
  const [developer, onchain, community, security] = await Promise.all([
    sources.developer.fetchDeveloper(ref),
    sources.onchain.fetchOnchain(ref),
    sources.community.fetchCommunity(ref),
    sources.security.fetchSecurity(ref),
  ]);

  const raw: RawSignals = { developer, onchain, community, security };
  return {
    ref,
    raw,
    generatedAt: new Date().toISOString(),
    ...scoreAgent(raw),
  };
}
