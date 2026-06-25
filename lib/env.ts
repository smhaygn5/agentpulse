import { z } from "zod";

/**
 * Server-side environment validation. Secrets live here and must NEVER be
 * exposed with a NEXT_PUBLIC_ prefix. Real data-source keys are added in
 * Faz 3 — for now everything is optional so the mock-first app boots clean.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  // Faz 3 (data sources) — optional until wired:
  GITHUB_TOKEN: z.string().optional(),
  // Arc testnet block explorer (ArcScan) API key, if/when available:
  ARCSCAN_API_KEY: z.string().optional(),
  // EVM RPC provider for Arc testnet reads (e.g. Alchemy Arc endpoint):
  ARC_RPC_API_KEY: z.string().optional(),
  // Faz 3 (AI analysis):
  ANTHROPIC_API_KEY: z.string().optional(),
  // Faz 3 (cache / rate-limit):
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  // Faz 4 (database / auth):
  DATABASE_URL: z.string().optional(),
  // HMAC secret for signing SIWE session cookies. Required in production.
  SESSION_SECRET: z.string().optional(),
});

const publicSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("AgentPulse"),
});

export const env = serverSchema.parse(process.env);
export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});
