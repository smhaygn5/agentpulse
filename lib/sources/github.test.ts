import { describe, it, expect } from "vitest";
import { normalizeRepo } from "./github";

describe("normalizeRepo", () => {
  it("accepts owner/repo and github URLs, stripping .git", () => {
    expect(normalizeRepo("vercel/next.js")).toBe("vercel/next.js");
    expect(normalizeRepo("https://github.com/vercel/next.js")).toBe("vercel/next.js");
    expect(normalizeRepo("https://github.com/foo/bar.git")).toBe("foo/bar");
    expect(normalizeRepo("  foo/bar  ")).toBe("foo/bar");
  });

  it("rejects malformed or non-github inputs (SSRF-safe)", () => {
    expect(normalizeRepo(undefined)).toBeNull();
    expect(normalizeRepo("")).toBeNull();
    expect(normalizeRepo("just-one-part")).toBeNull();
    expect(normalizeRepo("https://evil.com/a/b")).toBeNull();
    expect(normalizeRepo("a/b/c/d")).toBeNull();
  });

  it("rejects . and .. path segments", () => {
    expect(normalizeRepo("owner/..")).toBeNull();
    expect(normalizeRepo("../repo")).toBeNull();
    expect(normalizeRepo("./repo")).toBeNull();
  });
});
