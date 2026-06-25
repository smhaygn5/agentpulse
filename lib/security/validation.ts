import { z } from "zod";

/** EVM address with checksum-agnostic format validation. */
export const evmAddress = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid EVM address");

/** Agent slug as produced by the mock generator / detail routes. */
export const agentId = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9-]+$/, "Invalid agent id");

/** A free-text search query; trimmed and length-bounded to curb abuse. */
export const searchQuery = z.string().trim().max(80).default("");

/** owner/repo or a github.com URL (host-locked — SSRF-safe). */
export const githubRepo = z
  .string()
  .max(140)
  .refine(
    (v) =>
      /^[\w.-]+\/[\w.-]+$/.test(v) ||
      /^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+/i.test(v),
    "Must be owner/repo or a github.com URL",
  );
