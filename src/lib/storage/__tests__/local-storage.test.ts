import { describe, it, expect, vi } from "vitest";
import { safeGet, safeSet } from "../local-storage";

describe("safeGet", () => {
  it("returns fallback when key does not exist", () => {
    const result = safeGet("nonexistent-key", "default");
    expect(result).toBe("default");
  });

  it("returns fallback when stored value is corrupted JSON", () => {
    vi.spyOn(window.localStorage, "getItem").mockReturnValue("{invalid");
    const result = safeGet("some-key", "fallback");
    expect(result).toBe("fallback");
    vi.restoreAllMocks();
  });
});

describe("safeSet", () => {
  it("does not throw when localStorage.setItem fails", () => {
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });
    expect(() => safeSet("key", { value: 1 })).not.toThrow();
    vi.restoreAllMocks();
  });
});
