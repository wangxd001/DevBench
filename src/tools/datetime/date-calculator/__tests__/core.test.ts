import { describe, it, expect } from "vitest";
import { addDays, dateDiff } from "../core";

describe("addDays", () => {
  it("adds days to a date", () => {
    expect(addDays("2023-01-31", 1).value).toBe("2023-02-01");
  });

  it("handles month-end clamping (Jan 31 + 1 month = Feb 28)", () => {
    // 注意：这里测试的是加天数，不是加月
    // 加 28 天从 2023-01-31 -> 2023-02-28
    expect(addDays("2023-01-31", 28).value).toBe("2023-02-28");
  });

  it("handles leap year", () => {
    expect(addDays("2024-02-28", 1).value).toBe("2024-02-29");
    expect(addDays("2023-02-28", 1).value).toBe("2023-03-01");
  });

  it("returns error for invalid date", () => {
    const result = addDays("2023-02-30", 1);
    expect(result.error).toBeDefined();
  });
});

describe("dateDiff", () => {
  it("calculates days between two dates", () => {
    const result = dateDiff("2023-01-01", "2023-01-31");
    expect(result.totalDays).toBe(30);
  });

  it("calculates with negative difference", () => {
    const result = dateDiff("2023-01-31", "2023-01-01");
    expect(result.totalDays).toBe(-30);
  });

  it("calculates calendar breakdown", () => {
    const result = dateDiff("2023-01-15", "2023-03-20");
    // Jan 15 -> Mar 20: Jan remaining 16 days + Feb 28 days + Mar 20 days = 64 days
    expect(result.totalDays).toBe(64);
  });

  it("handles same date", () => {
    const result = dateDiff("2023-06-15", "2023-06-15");
    expect(result.totalDays).toBe(0);
  });
});
