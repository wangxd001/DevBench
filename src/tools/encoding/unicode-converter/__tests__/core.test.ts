import { describe, it, expect } from "vitest";
import { textToUnicode, unicodeToText } from "../core";

describe("textToUnicode", () => {
  it("keeps printable ASCII as-is", () => {
    expect(textToUnicode("hello").value).toBe("hello");
  });

  it("converts non-ASCII to unicode escapes", () => {
    const result = textToUnicode("中");
    expect(result.value).toBe("\\u4e2d");
  });

  it("handles emoji surrogate pairs", () => {
    const result = textToUnicode("\ud83d\ude00");
    expect(result.error).toBeUndefined();
    expect(result.value).toMatch(/\\u[0-9a-f]{4}/);
  });

  it("returns empty for empty input", () => {
    expect(textToUnicode("").value).toBe("");
  });
});

describe("unicodeToText", () => {
  it("converts escapes to characters", () => {
    expect(unicodeToText("\\u0041").value).toBe("A");
  });

  it("returns error for invalid escape", () => {
    const result = unicodeToText("\\uZZZZ");
    expect(result.error).toBeDefined();
  });
});
