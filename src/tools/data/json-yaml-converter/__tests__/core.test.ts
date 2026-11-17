import { describe, it, expect } from "vitest";
import { jsonToYaml, yamlToJson } from "../core";

describe("jsonToYaml", () => {
  it("converts simple JSON to YAML", () => {
    const result = jsonToYaml('{"name":"test","value":42}');
    expect(result.error).toBeUndefined();
    expect(result.value).toContain("name: test");
    expect(result.value).toContain("value: 42");
  });

  it("converts nested JSON to YAML", () => {
    const result = jsonToYaml('{"a":{"b":1}}');
    expect(result.error).toBeUndefined();
    expect(result.value).toContain("a:");
    expect(result.value).toContain("b: 1");
  });

  it("converts array to YAML", () => {
    const result = jsonToYaml('{"items":[1,2,3]}');
    expect(result.error).toBeUndefined();
    expect(result.value).toContain("- 1");
  });

  it("returns error for invalid JSON", () => {
    const result = jsonToYaml("{invalid}");
    expect(result.error).toBeDefined();
  });

  it("returns empty for empty input", () => {
    const result = jsonToYaml("");
    expect(result.error).toBeUndefined();
    expect(result.value).toBe("");
  });

  it("handles 2-space indent by default", () => {
    const result = jsonToYaml('{"a":{"b":1}}');
    expect(result.value).toMatch(/  b: 1/);
  });
});

describe("yamlToJson", () => {
  it("converts simple YAML to JSON", () => {
    const result = yamlToJson("name: test\nvalue: 42");
    expect(result.error).toBeUndefined();
    expect(JSON.parse(result.value)).toEqual({ name: "test", value: 42 });
  });

  it("converts nested YAML to JSON", () => {
    const result = yamlToJson("a:\n  b: 1\n  c: 2");
    expect(result.error).toBeUndefined();
    expect(JSON.parse(result.value)).toEqual({ a: { b: 1, c: 2 } });
  });

  it("returns error for invalid YAML", () => {
    const result = yamlToJson("a: [unclosed");
    expect(result.error).toBeDefined();
  });

  it("does not execute custom YAML tags", () => {
    // yaml 库把未解析的 tag 值作为字符串保留，不会执行函数
    const result = yamlToJson("key: !!js/function function() {}");
    const parsed = result.value ? JSON.parse(result.value) : {};
    expect(typeof parsed.key).toBe("string");
  });

  it("handles empty input", () => {
    const result = yamlToJson("");
    expect(result.error).toBeUndefined();
  });
});
