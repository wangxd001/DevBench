import { describe, it, expect } from "vitest";
import { formatDatetime, formatNowInput, parseDatetime } from "../core";

describe("parseDatetime", () => {
  it("parses ISO 8601 string", () => {
    const result = parseDatetime("2023-11-14T22:13:20Z");
    expect(result.error).toBeUndefined();
    expect(result.date?.toISOString()).toBe("2023-11-14T22:13:20.000Z");
  });

  it("parses local datetime string", () => {
    const result = parseDatetime("2023-01-15 10:30:00");
    expect(result.error).toBeUndefined();
  });

  it("returns error for invalid input", () => {
    const result = parseDatetime("not a date");
    expect(result.error).toBeDefined();
  });

  it("returns error for empty input", () => {
    const result = parseDatetime("");
    expect(result.error).toBeDefined();
  });

  it("handles leap year date", () => {
    const result = parseDatetime("2024-02-29T00:00:00");
    expect(result.error).toBeUndefined();
  });

  it("rejects invalid leap year date", () => {
    const result = parseDatetime("2023-02-29T00:00:00");
    // 2023 is not a leap year, Feb 29 doesn't exist
    expect(result.error).toBeDefined();
  });
});

describe("formatDatetime", () => {
  it("formats with ISO preset", () => {
    const d = new Date("2023-11-14T22:13:20Z");
    const result = formatDatetime(d, "iso");
    expect(result).toBe("2023-11-14T22:13:20.000Z");
  });

  it("formats with custom pattern", () => {
    const d = new Date("2023-11-14T22:13:20Z");
    const result = formatDatetime(d, "yyyy-MM-dd HH:mm:ss");
    expect(result).toMatch(/2023-11-1[45]/);
  });
});

describe("formatNowInput", () => {
  it("formats a date as a local datetime input value", () => {
    const d = new Date(2023, 10, 14, 22, 13, 20);
    expect(formatNowInput(d)).toBe("2023-11-14 22:13:20");
  });

  it("produces a value parseable by parseDatetime", () => {
    const result = parseDatetime(formatNowInput());
    expect(result.error).toBeUndefined();
    expect(result.date).not.toBeNull();
  });
});
