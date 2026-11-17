import { describe, it, expect, vi } from "vitest";
import { generateRandomString } from "../core";

describe("generateRandomString", () => {
  it("generates string of specified length", () => {
    const result = generateRandomString(16, 1, ["lowercase", "digits"]);
    expect(result.results).toHaveLength(1);
    expect(result.results[0].length).toBe(16);
  });

  it("respects quantity limit of 100", () => {
    const result = generateRandomString(8, 100, ["lowercase"]);
    expect(result.results).toHaveLength(100);
  });

  it("throws for quantity > 100", () => {
    expect(() => generateRandomString(8, 101, ["lowercase"])).toThrow();
  });

  it("throws for empty charset", () => {
    expect(() => generateRandomString(8, 1, [])).toThrow();
  });

  it("generates only selected character types", () => {
    const result = generateRandomString(32, 1, ["lowercase"]);
    expect(result.results[0]).toMatch(/^[a-z]+$/);
  });

  it("uses crypto.getRandomValues (not Math.random)", () => {
    const mockFn = vi.fn().mockImplementation((arr) => {
      arr.fill(48); // 48 = '0' in ASCII
      return arr;
    });
    vi.spyOn(global.crypto, "getRandomValues").mockImplementation(mockFn);
    generateRandomString(8, 1, ["digits"]);
    expect(mockFn).toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it("default length is 16, quantity is 1", () => {
    const result = generateRandomString(undefined, undefined, ["lowercase"]);
    expect(result.results).toHaveLength(1);
    expect(result.results[0].length).toBe(16);
  });
});
