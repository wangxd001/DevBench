import { describe, it, expect } from "vitest";
import { encodeBase64, decodeBase64 } from "../core";

describe("encodeBase64", () => {
  it("encodes simple ASCII text to standard base64", () => {
    const result = encodeBase64("hello", "standard");
    expect(result.error).toBeUndefined();
    expect(result.value).toBe("aGVsbG8=");
  });

  it("encodes Chinese characters correctly", () => {
    const result = encodeBase64("中文", "standard");
    expect(result.error).toBeUndefined();
    const decoded = decodeBase64(result.value, "standard");
    expect(decoded.value).toBe("中文");
  });

  it("encodes to URL-safe base64 (no + or /)", () => {
    const result = encodeBase64("test==", "urlsafe");
    expect(result.error).toBeUndefined();
    expect(result.value).not.toContain("+");
    expect(result.value).not.toContain("/");
  });

  it("returns error for input over 5 MB", () => {
    const largeText = "a".repeat(5 * 1024 * 1024 + 1);
    const result = encodeBase64(largeText, "standard");
    expect(result.error).toBeDefined();
  });

  it("handles empty input", () => {
    const result = encodeBase64("", "standard");
    expect(result.error).toBeUndefined();
    expect(result.value).toBe("");
  });
});

describe("decodeBase64", () => {
  it("decodes standard base64", () => {
    const result = decodeBase64("aGVsbG8=", "standard");
    expect(result.error).toBeUndefined();
    expect(result.value).toBe("hello");
  });

  it("returns error for invalid base64", () => {
    const result = decodeBase64("!!invalid!!", "standard");
    expect(result.error).toBeDefined();
  });

  it("decodes URL-safe base64", () => {
    const encoded = encodeBase64("test", "urlsafe");
    const result = decodeBase64(encoded.value, "urlsafe");
    expect(result.error).toBeUndefined();
    expect(result.value).toBe("test");
  });
});
