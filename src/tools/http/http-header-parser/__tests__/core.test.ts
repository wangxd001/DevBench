import { describe, it, expect } from "vitest";
import { parseHeaders } from "../core";

describe("parseHeaders", () => {
  it("parses simple header", () => {
    const result = parseHeaders("Content-Type: text/html");
    expect(result.headers).toHaveLength(1);
    expect(result.headers[0].name).toBe("Content-Type");
    expect(result.headers[0].value).toBe("text/html");
    expect(result.errors).toHaveLength(0);
  });

  it("preserves duplicate headers", () => {
    const input = "Set-Cookie: a=1\nSet-Cookie: b=2";
    const result = parseHeaders(input);
    expect(result.headers).toHaveLength(2);
    expect(result.headers[0].value).toBe("a=1");
    expect(result.headers[1].value).toBe("b=2");
  });

  it("preserves original order", () => {
    const input = "B: 2\nA: 1\nC: 3";
    const result = parseHeaders(input);
    expect(result.headers.map((h) => h.name)).toEqual(["B", "A", "C"]);
  });

  it("marks invalid lines (no colon)", () => {
    const result = parseHeaders("valid-header: ok\nno-colon-here");
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].line).toBe(2);
  });

  it("returns empty for empty input", () => {
    const result = parseHeaders("");
    expect(result.headers).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
  });

  it("skips empty lines", () => {
    const result = parseHeaders("A: 1\n\nB: 2");
    expect(result.headers).toHaveLength(2);
  });

  it("is case-insensitive for header names", () => {
    const result = parseHeaders("content-type: text/html\nCONTENT-TYPE: application/json");
    expect(result.headers).toHaveLength(2);
  });

  it("splits on first colon only", () => {
    const result = parseHeaders("X-Custom: a:b:c");
    expect(result.headers[0].name).toBe("X-Custom");
    expect(result.headers[0].value).toBe("a:b:c");
  });
});
