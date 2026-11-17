import { describe, it, expect } from "vitest";
import { formatJson } from "../core";

describe("formatJson", () => {
  it("formats valid JSON to pretty with 2-space indent", () => {
    const result = formatJson('{"a":1,"b":2}', "pretty", 2);
    expect(result.error).toBeUndefined();
    expect(result.value).toBe('{\n  "a": 1,\n  "b": 2\n}');
  });

  it("formats valid JSON to pretty with 4-space indent", () => {
    const result = formatJson('{"a":1}', "pretty", 4);
    expect(result.value).toBe('{\n    "a": 1\n}');
  });

  it("minifies JSON", () => {
    const result = formatJson('{\n  "a": 1,\n  "b": [2, 3]\n}', "minify", 2);
    expect(result.value).toBe('{"a":1,"b":[2,3]}');
  });

  it("preserves object property order", () => {
    const result = formatJson('{"z":1,"a":2,"m":3}', "pretty", 2);
    expect(result.value).toBe('{\n  "z": 1,\n  "a": 2,\n  "m": 3\n}');
  });

  it("returns empty value for empty input", () => {
    const result = formatJson("", "pretty", 2);
    expect(result.value).toBe("");
    expect(result.error).toBeUndefined();
  });

  it("returns error for trailing comma", () => {
    const result = formatJson('{"a":1,}', "pretty", 2);
    expect(result.error).toBeDefined();
  });

  it("returns error for invalid JSON", () => {
    const result = formatJson("{a:1}", "pretty", 2);
    expect(result.error).toBeDefined();
  });

  it("returns error with position for string escape error", () => {
    const result = formatJson('{"a": "invalid\\"}', "pretty", 2);
    expect(result.error).toBeDefined();
  });

  it("handles deeply nested JSON", () => {
    const nested = JSON.stringify({ a: { b: { c: { d: 1 } } } });
    const result = formatJson(nested, "pretty", 2);
    expect(result.error).toBeUndefined();
    expect(result.value).toContain('"d": 1');
  });
});
