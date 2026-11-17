import { describe, it, expect } from "vitest";
import { timestampToDate, dateToTimestamp, getNowTimestamp } from "../core";

describe("timestampToDate", () => {
  it("converts seconds timestamp", () => {
    const d = timestampToDate("1700000000", "seconds");
    expect(d).not.toBeNull();
    expect(d?.toISOString()).toBe("2023-11-14T22:13:20.000Z");
  });

  it("converts milliseconds timestamp", () => {
    const d = timestampToDate("1700000000000", "milliseconds");
    expect(d).not.toBeNull();
    expect(d?.toISOString()).toBe("2023-11-14T22:13:20.000Z");
  });

  it("returns null for non-numeric input", () => {
    expect(timestampToDate("abc", "seconds")).toBeNull();
  });

  it("returns null for negative input", () => {
    expect(timestampToDate("-1", "seconds")).toBeNull();
  });

  it("returns null for empty input", () => {
    expect(timestampToDate("", "seconds")).toBeNull();
  });

  it("returns null for decimal input", () => {
    expect(timestampToDate("1.5", "seconds")).toBeNull();
  });
});

describe("dateToTimestamp", () => {
  it("converts ISO date string to seconds", () => {
    const ts = dateToTimestamp("2023-11-14T22:13:20Z", "seconds");
    expect(ts).toBe("1700000000");
  });

  it("converts ISO date string to milliseconds", () => {
    const ts = dateToTimestamp("2023-11-14T22:13:20Z", "milliseconds");
    expect(ts).toBe("1700000000000");
  });

  it("returns null for invalid date string", () => {
    expect(dateToTimestamp("not a date", "seconds")).toBeNull();
  });
});

describe("getNowTimestamp", () => {
  it("returns seconds string", () => {
    const ts = getNowTimestamp("seconds");
    expect(ts).toMatch(/^\d+$/);
    expect(parseInt(ts, 10)).toBeGreaterThan(0);
  });

  it("returns milliseconds string", () => {
    const ts = getNowTimestamp("milliseconds");
    expect(ts).toMatch(/^\d+$/);
    expect(parseInt(ts, 10)).toBeGreaterThan(0);
  });
});
