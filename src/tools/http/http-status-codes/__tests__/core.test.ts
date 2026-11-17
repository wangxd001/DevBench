import { describe, it, expect } from "vitest";
import { searchStatusCodes } from "../core";
import { STATUS_CODES } from "../data";

describe("searchStatusCodes", () => {
  it("finds 404 by code", () => {
    const results = searchStatusCodes("404");
    expect(results.some((r) => r.code === 404)).toBe(true);
  });

  it("finds Not Found by English name", () => {
    const results = searchStatusCodes("not found");
    expect(results.some((r) => r.code === 404)).toBe(true);
  });

  it("finds 404 by Chinese keyword", () => {
    const results = searchStatusCodes("未找到");
    expect(results.some((r) => r.code === 404)).toBe(true);
  });

  it("returns all for empty query", () => {
    const results = searchStatusCodes("");
    expect(results).toHaveLength(STATUS_CODES.length);
  });

  it("returns empty for non-existent code", () => {
    const results = searchStatusCodes("999");
    expect(results).toHaveLength(0);
  });

  it("is case-insensitive for name search", () => {
    const results = searchStatusCodes("INTERNAL SERVER ERROR");
    expect(results.some((r) => r.code === 500)).toBe(true);
  });
});
