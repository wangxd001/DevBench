export type JsonFormatMode = "pretty" | "minify";

export interface JsonFormatResult {
  value: string;
  error?: { message: string; line?: number; column?: number };
}

export function formatJson(input: string, mode: JsonFormatMode, indent: 2 | 4): JsonFormatResult {
  if (!input.trim()) return { value: "" };

  try {
    const parsed = JSON.parse(input);
    if (mode === "minify") {
      return { value: JSON.stringify(parsed) };
    }
    return { value: JSON.stringify(parsed, null, indent) };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    let line: number | undefined;
    let column: number | undefined;

    // 尝试从错误消息提取行列
    const posMatch = message.match(/position (\d+)/);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const before = input.slice(0, pos);
      line = before.split("\n").length;
      column = pos - before.lastIndexOf("\n");
    }

    return {
      value: "",
      error: { message, line, column },
    };
  }
}
