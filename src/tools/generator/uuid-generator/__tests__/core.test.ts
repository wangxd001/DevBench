import { describe, it, expect, vi } from "vitest";
import { generateUuid } from "../core";

describe("generateUuid", () => {
  it("returns 1 UUID for count=1", () => {
    const result = generateUuid(1);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it("returns 100 unique UUIDs for count=100", () => {
    const result = generateUuid(100);
    expect(result).toHaveLength(100);
    expect(new Set(result).size).toBe(100);
  });

  it("throws for count=0", () => {
    expect(() => generateUuid(0)).toThrow();
  });

  it("throws for count=101", () => {
    expect(() => generateUuid(101)).toThrow();
  });

  it("throws when crypto.randomUUID is unavailable", () => {
    vi.spyOn(crypto, "randomUUID").mockImplementation(() => {
      throw new Error("Not available in insecure context");
    });
    expect(() => generateUuid(1)).toThrow();
    vi.restoreAllMocks();
  });

  it("uses crypto.randomUUID", () => {
    const mockFn = vi.fn().mockReturnValue("12345678-1234-4234-8234-123456789abc");
    vi.spyOn(crypto, "randomUUID").mockImplementation(mockFn);
    generateUuid(1);
    expect(mockFn).toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});
