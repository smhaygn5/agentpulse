import { describe, it, expect } from "vitest";
import { tierFor, riskTone, SCORE_WEIGHTS } from "./reputation";

describe("tierFor", () => {
  it("maps scores to the right tier at boundaries", () => {
    expect(tierFor(10).tier).toBe("Critical");
    expect(tierFor(20).tier).toBe("Critical");
    expect(tierFor(21).tier).toBe("Weak");
    expect(tierFor(50).tier).toBe("Developing");
    expect(tierFor(75).tier).toBe("Strong");
    expect(tierFor(81).tier).toBe("Trusted");
    expect(tierFor(100).tone).toBe("success");
  });
});

describe("riskTone", () => {
  it("maps risk levels to tones", () => {
    expect(riskTone("Low")).toBe("success");
    expect(riskTone("Medium")).toBe("warning");
    expect(riskTone("High")).toBe("danger");
  });
});

describe("SCORE_WEIGHTS", () => {
  it("sums to 1", () => {
    const sum = Object.values(SCORE_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);
  });
});
