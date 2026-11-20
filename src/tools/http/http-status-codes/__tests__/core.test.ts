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

  // 按类别前缀匹配：纯数字前缀（含 2/20/200/2xx）显示整个 2xx 分组，
  // 解决"输入 200 看似没反应"的体验问题（PRD §7.19 按状态码查询 + 按类别展示）。
  it("prefix '2' returns the whole 2xx category", () => {
    const results = searchStatusCodes("2");
    const codes = results.map((r) => r.code);
    expect(codes).toContain(200);
    expect(codes).toContain(201);
    expect(codes).toContain(204);
    expect(codes.every((c) => c >= 200 && c < 300)).toBe(true);
  });

  it("prefix '20' returns the whole 2xx category", () => {
    const results = searchStatusCodes("20");
    expect(results.map((r) => r.code)).toContain(200);
    expect(results.map((r) => r.code)).toContain(206);
  });

  it("exact code '404' ranks the exact match first and keeps 4xx siblings", () => {
    const results = searchStatusCodes("404");
    expect(results[0].code).toBe(404);
    const codes = results.map((r) => r.code);
    expect(codes).toContain(400);
    expect(codes).toContain(403);
  });

  it("category-style '2xx' returns the whole 2xx category", () => {
    const results = searchStatusCodes("2xx");
    expect(results.map((r) => r.code)).toContain(200);
    expect(results.every((r) => r.code >= 200 && r.code < 300)).toBe(true);
  });
});
