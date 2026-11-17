import { describe, it, expect } from "vitest";
import { regexWorkerHandler } from "../regex-worker";

describe("regexWorkerHandler", () => {
  it("matches global regex", () => {
    const result = regexWorkerHandler({
      pattern: "\\d+",
      flags: "g",
      text: "a1b22c333",
    });
    expect(result.error).toBeUndefined();
    expect(result.count).toBe(3);
    expect(result.matches[0].text).toBe("1");
    expect(result.matches[0].index).toBe(1);
    expect(result.matches[1].text).toBe("22");
    expect(result.matches[2].text).toBe("333");
  });

  it("extracts capture groups", () => {
    const result = regexWorkerHandler({
      pattern: "(\\w+)@(\\w+)",
      flags: "g",
      text: "user@example admin@test",
    });
    expect(result.count).toBe(2);
    expect(result.matches[0].groups).toEqual(["user", "example"]);
    expect(result.matches[1].groups).toEqual(["admin", "test"]);
  });

  it("returns error for invalid pattern", () => {
    const result = regexWorkerHandler({
      pattern: "[",
      flags: "",
      text: "test",
    });
    expect(result.error).toBeDefined();
    expect(result.matches).toHaveLength(0);
  });

  it("returns empty matches for no match", () => {
    const result = regexWorkerHandler({
      pattern: "xyz",
      flags: "g",
      text: "abc",
    });
    expect(result.count).toBe(0);
    expect(result.matches).toHaveLength(0);
  });

  it("truncates at 10000 matches", () => {
    const text = "1".repeat(20000);
    const result = regexWorkerHandler({
      pattern: "1",
      flags: "g",
      text,
    });
    expect(result.truncated).toBe(true);
    expect(result.count).toBe(10000);
  });

  it("empty text returns empty matches", () => {
    const result = regexWorkerHandler({
      pattern: "\\d+",
      flags: "g",
      text: "",
    });
    expect(result.count).toBe(0);
    expect(result.error).toBeUndefined();
  });
});
