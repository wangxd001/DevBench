import { describe, it, expect } from "vitest";
import { parseCookie, parseSetCookie } from "../core";

describe("parseCookie", () => {
  it("parses simple cookie header", () => {
    const result = parseCookie("a=1; b=2; c=3");
    expect(result.cookies).toHaveLength(3);
    expect(result.cookies[0].name).toBe("a");
    expect(result.cookies[0].value).toBe("1");
  });

  it("handles empty cookie value", () => {
    const result = parseCookie("a=; b=2");
    expect(result.cookies[0].value).toBe("");
  });

  it("handles URL-encoded values", () => {
    const result = parseCookie("a=hello%20world");
    expect(result.cookies[0].value).toBe("hello%20world");
  });

  it("returns empty for empty input", () => {
    const result = parseCookie("");
    expect(result.cookies).toHaveLength(0);
  });

  it("handles cookie with no value", () => {
    const result = parseCookie("a; b=2");
    expect(result.cookies[0].name).toBe("a");
    expect(result.cookies[0].value).toBe("");
  });
});

describe("parseSetCookie", () => {
  it("parses name=value with attributes", () => {
    const result = parseSetCookie("session=abc123; Path=/; HttpOnly; Secure; SameSite=Strict");
    expect(result.name).toBe("session");
    expect(result.value).toBe("abc123");
    expect(result.path).toBe("/");
    expect(result.httpOnly).toBe(true);
    expect(result.secure).toBe(true);
    expect(result.sameSite).toBe("Strict");
  });

  it("handles Expires with comma (RFC 6265 date format)", () => {
    const result = parseSetCookie("a=1; Expires=Wed, 09 Jun 2027 10:18:14 GMT; Path=/");
    expect(result.expires).toBe("Wed, 09 Jun 2027 10:18:14 GMT");
    expect(result.path).toBe("/");
  });

  it("handles Max-Age", () => {
    const result = parseSetCookie("a=1; Max-Age=3600");
    expect(result.maxAge).toBe(3600);
  });

  it("does not merge multiple Set-Cookie fields", () => {
    // 每个 Set-Cookie 行应该单独解析，不得合并
    const r1 = parseSetCookie("a=1; Domain=example.com");
    const r2 = parseSetCookie("b=2; Domain=example.com");
    expect(r1.name).toBe("a");
    expect(r2.name).toBe("b");
  });

  it("handles Domain attribute", () => {
    const result = parseSetCookie("a=1; Domain=example.com");
    expect(result.domain).toBe("example.com");
  });

  it("returns error for invalid input (no name=value)", () => {
    const result = parseSetCookie("");
    expect(result.error).toBeDefined();
  });
});
