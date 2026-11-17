import { describe, it, expect } from "vitest";
import { encodeUri, decodeUri, encodeComponent, decodeComponent } from "../core";

describe("url-encoder", () => {
  it("encodes URI preserving scheme and path separators", () => {
    const result = encodeUri("https://example.com/path?q=1&x=a b");
    expect(result.error).toBeUndefined();
    expect(result.value).toBe("https://example.com/path?q=1&x=a%20b");
  });

  it("decodes URI", () => {
    const result = decodeUri("https://example.com/path?q=1");
    expect(result.error).toBeUndefined();
    expect(result.value).toBe("https://example.com/path?q=1");
  });

  it("encodes component (spaces become %20)", () => {
    const result = encodeComponent("hello world");
    expect(result.error).toBeUndefined();
    expect(result.value).toBe("hello%20world");
  });

  it("decodes component", () => {
    const result = decodeComponent("hello%20world");
    expect(result.error).toBeUndefined();
    expect(result.value).toBe("hello world");
  });

  it("returns error for invalid component encoding", () => {
    const result = decodeComponent("%GG");
    expect(result.error).toBeDefined();
  });

  it("handles Chinese characters", () => {
    const result = encodeComponent("中文");
    expect(result.error).toBeUndefined();
    expect(result.value).toBe(encodeURIComponent("中文"));
  });

  it("handles empty input", () => {
    const result = encodeComponent("");
    expect(result.error).toBeUndefined();
    expect(result.value).toBe("");
  });

  it("decodeUri does not throw for plain text", () => {
    const result = decodeUri("just plain text");
    expect(result.error).toBeUndefined();
  });
});
