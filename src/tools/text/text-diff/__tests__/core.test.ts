import { describe, it, expect } from "vitest";
import { textDiff } from "../core";

describe("textDiff", () => {
  it("returns no diff for identical text", () => {
    const result = textDiff("hello\nworld", "hello\nworld");
    expect(result.hasDiff).toBe(false);
  });

  it("detects added lines", () => {
    const result = textDiff("line1", "line1\nline2");
    expect(result.hasDiff).toBe(true);
    expect(result.lines.some((l) => l.type === "added")).toBe(true);
  });

  it("detects removed lines", () => {
    const result = textDiff("line1\nline2", "line1");
    expect(result.hasDiff).toBe(true);
    expect(result.lines.some((l) => l.type === "removed")).toBe(true);
  });

  it("detects modified lines", () => {
    const result = textDiff("line1\nold", "line1\nnew");
    expect(result.hasDiff).toBe(true);
    expect(result.lines.some((l) => l.type === "modified" || l.type === "added")).toBe(true);
  });

  it("preserves empty lines", () => {
    const result = textDiff("a\n\nb", "a\n\nc");
    expect(result.hasDiff).toBe(true);
  });

  it("handles CRLF vs LF without false diff", () => {
    const result = textDiff("line1\r\nline2\r\n", "line1\nline2\n");
    const significant = result.lines.filter((l) => l.type !== "unchanged");
    expect(significant.length).toBeLessThanOrEqual(0);
  });

  it("distinguishes case by default", () => {
    const result = textDiff("Hello", "hello");
    expect(result.hasDiff).toBe(true);
  });

  it("case-insensitive option", () => {
    const result = textDiff("Hello", "hello", { caseSensitive: false });
    expect(result.hasDiff).toBe(false);
  });

  it("handles empty vs non-empty", () => {
    const result = textDiff("", "text");
    expect(result.hasDiff).toBe(true);
  });

  it("handles large text without hanging", () => {
    const lines1: string[] = Array(10000).fill("line");
    const lines2: string[] = Array(10000).fill("line");
    lines2[99] = "changed";
    const large1 = lines1.join("\n");
    const large2 = lines2.join("\n");
    const start = Date.now();
    const result = textDiff(large1, large2);
    const elapsed = Date.now() - start;
    expect(result.hasDiff).toBe(true);
    expect(elapsed).toBeLessThan(5000);
  });
});
