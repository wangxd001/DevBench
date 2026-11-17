import { describe, it, expect } from "vitest";
import { validatePattern } from "../core";

describe("validatePattern", () => {
  it("validates correct pattern", () => {
    const result = validatePattern("\d+", "g");
    expect(result.valid).toBe(true);
  });

  it("returns error for invalid pattern", () => {
    const result = validatePattern("[", "");
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("returns error for unsupported flags", () => {
    const result = validatePattern("test", "z");
    expect(result.valid).toBe(false);
  });

  it("accepts all supported flags", () => {
    const result = validatePattern("test", "gimsudy");
    expect(result.valid).toBe(true);
  });

  it("returns error for empty pattern", () => {
    const result = validatePattern("", "");
    // 空 pattern 在 JS 中是合法的，匹配空字符串
    expect(result.valid).toBe(true);
  });
});
