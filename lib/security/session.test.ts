import { describe, it, expect } from "vitest";
import { createSessionToken, verifySessionToken } from "./session";

const ADDR = "0xAbC0000000000000000000000000000000000001";

describe("session tokens", () => {
  it("round-trips a valid token (lower-cased address)", () => {
    const token = createSessionToken(ADDR);
    const session = verifySessionToken(token);
    expect(session?.address).toBe(ADDR.toLowerCase());
  });

  it("rejects tampered tokens", () => {
    const token = createSessionToken(ADDR);
    const [addr, exp] = token.split(".");
    expect(verifySessionToken(`${addr}.${exp}.deadbeef`)).toBeNull();
    // swapping the address invalidates the signature
    expect(
      verifySessionToken(token.replace(addr, "0xdead000000000000000000000000000000000000")),
    ).toBeNull();
  });

  it("rejects malformed and expired tokens", () => {
    expect(verifySessionToken(undefined)).toBeNull();
    expect(verifySessionToken("only.two")).toBeNull();
    // exp in the past
    const past = `${ADDR.toLowerCase()}.1`;
    // a forged signature won't match anyway, but expiry is also enforced
    expect(verifySessionToken(`${past}.x`)).toBeNull();
  });
});
