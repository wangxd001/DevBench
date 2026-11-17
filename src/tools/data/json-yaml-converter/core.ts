import { parse, stringify } from "yaml";

export interface ConvertResult {
  value: string;
  error?: string;
}

export function jsonToYaml(json: string, indent: number = 2): ConvertResult {
  if (!json.trim()) return { value: "" };

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    return { value: "", error: e instanceof Error ? e.message : "Invalid JSON" };
  }

  try {
    const yaml = stringify(parsed, {
      indent,
      lineWidth: -1,
    });
    return { value: yaml };
  } catch (e) {
    return { value: "", error: e instanceof Error ? e.message : "Failed to convert to YAML" };
  }
}

export function yamlToJson(yaml: string, indent: number = 2): ConvertResult {
  if (!yaml.trim()) return { value: "" };

  try {
    // 使用 parse，自定义标签会被解析为字符串（不会执行）
    const parsed = parse(yaml);
    const json = JSON.stringify(parsed, null, indent);
    return { value: json };
  } catch (e) {
    return { value: "", error: e instanceof Error ? e.message : "Invalid YAML" };
  }
}
