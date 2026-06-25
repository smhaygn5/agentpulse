import { describe, it, expect } from "vitest";
import { evmAddress, agentId, githubRepo, searchQuery } from "./validation";

describe("validation schemas", () => {
  it("accepts well-formed EVM addresses and rejects bad ones", () => {
    expect(evmAddress.safeParse(`0x${"a".repeat(40)}`).success).toBe(true);
    expect(evmAddress.safeParse("0x123").success).toBe(false);
    expect(evmAddress.safeParse("not-an-address").success).toBe(false);
  });

  it("restricts agent ids to slug characters", () => {
    expect(agentId.safeParse("sentience-1").success).toBe(true);
    expect(agentId.safeParse("Bad Id!").success).toBe(false);
    expect(agentId.safeParse("../etc/passwd").success).toBe(false);
  });

  it("only allows owner/repo or github.com URLs (SSRF-safe)", () => {
    expect(githubRepo.safeParse("vercel/next.js").success).toBe(true);
    expect(githubRepo.safeParse("https://github.com/vercel/next.js").success).toBe(true);
    // host-locked: other hosts and schemes are rejected
    expect(githubRepo.safeParse("http://169.254.169.254/latest/meta-data").success).toBe(false);
    expect(githubRepo.safeParse("https://evil.com/a/b").success).toBe(false);
    expect(githubRepo.safeParse("file:///etc/passwd").success).toBe(false);
  });

  it("trims and bounds search queries", () => {
    expect(searchQuery.parse("  hi  ")).toBe("hi");
    expect(searchQuery.safeParse("x".repeat(200)).success).toBe(false);
    expect(searchQuery.parse(undefined)).toBe("");
  });
});
