import { describe, it, expect } from "vitest";
import { compareJson } from "../core";

describe("compareJson", () => {
  it("returns hasDiff false for identical JSON", () => {
    const result = compareJson('{"a":1}', '{"a":1}');
    expect(result.error).toBeUndefined();
    expect(result.hasDiff).toBe(false);
  });

  it("detects added property", () => {
    const result = compareJson('{"a":1}', '{"a":1,"b":2}');
    expect(result.hasDiff).toBe(true);
    expect(result.entries.some((e) => e.type === "added" && e.path === "b")).toBe(true);
  });

  it("detects removed property", () => {
    const result = compareJson('{"a":1,"b":2}', '{"a":1}');
    expect(result.hasDiff).toBe(true);
    expect(result.entries.some((e) => e.type === "removed" && e.path === "b")).toBe(true);
  });

  it("detects modified property", () => {
    const result = compareJson('{"a":1}', '{"a":2}');
    expect(result.hasDiff).toBe(true);
    expect(result.entries.some((e) => e.type === "modified" && e.path === "a")).toBe(true);
  });

  it("detects array index changes", () => {
    const result = compareJson('{"a":[1,2,3]}', '{"a":[1,9,3]}');
    expect(result.hasDiff).toBe(true);
    expect(result.entries.some((e) => e.path === "a[1]" && e.type === "modified")).toBe(true);
  });

  it("distinguishes null from 0", () => {
    const result = compareJson('{"a":null}', '{"a":0}');
    expect(result.hasDiff).toBe(true);
  });

  it("distinguishes 0 from '0'", () => {
    const result = compareJson('{"a":0}', '{"a":"0"}');
    expect(result.hasDiff).toBe(true);
  });

  it("returns error for invalid JSON", () => {
    const result = compareJson("{invalid}", '{"b":1}');
    expect(result.error).toBeDefined();
  });

  it("object key order does not affect comparison", () => {
    const result = compareJson('{"a":1,"b":2}', '{"b":2,"a":1}');
    expect(result.hasDiff).toBe(false);
  });
});
