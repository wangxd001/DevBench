import { format } from "date-fns";

export type FormatPreset = "iso" | "local" | "utc" | "custom";

export interface ParseResult {
  date: Date | null;
  error?: string;
}

export function parseDatetime(input: string): ParseResult {
  if (!input.trim()) {
    return { date: null, error: "Empty input" };
  }

  // 尝试 ISO 格式
  const isoMatch = input.match(
    /^(\d{4})-(\d{2})-(\d{2})(T(\d{2}):(\d{2})(?::(\d{2})(\.\d{1,3})?)?(Z|[+-]\d{2}:?\d{2})?)?$/
  );

  if (isoMatch) {
    try {
      // 验证日期合法性
      const y = parseInt(input.slice(0, 4), 10);
      const mo = parseInt(input.slice(5, 7), 10);
      const d = parseInt(input.slice(8, 10), 10);
      if (mo < 1 || mo > 12 || d < 1) {
        return { date: null, error: "Invalid date" };
      }
      const daysInMonth = new Date(y, mo, 0).getDate();
      if (d > daysInMonth) {
        return { date: null, error: "Invalid date" };
      }
      const date = new Date(input);
      if (isNaN(date.getTime())) {
        return { date: null, error: "Invalid date" };
      }
      return { date };
    } catch {
      // fall through
    }
  }

  // 尝试通用解析
  try {
    const date = new Date(input);
    if (isNaN(date.getTime())) {
      return { date: null, error: "Invalid date format" };
    }
    // 验证日期合法性（JS Date 会自动进位，2023-02-29 -> 2023-03-01）
    const m = input.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const y = parseInt(m[1], 10);
      const mo = parseInt(m[2], 10);
      const d = parseInt(m[3], 10);
      if (mo < 1 || mo > 12 || d < 1 || d > 31) {
        return { date: null, error: "Invalid date" };
      }
      // 验证该月天数
      const daysInMonth = new Date(y, mo, 0).getDate();
      if (d > daysInMonth) {
        return { date: null, error: "Invalid date" };
      }
    }
    return { date };
  } catch {
    return { date: null, error: "Invalid date format" };
  }
}

export function formatNowInput(date: Date = new Date()): string {
  return format(date, "yyyy-MM-dd HH:mm:ss");
}

export function formatDatetime(
  date: Date,
  preset: FormatPreset | string,
  customPattern?: string
): string {
  switch (preset) {
    case "iso":
      return date.toISOString();
    case "utc":
      return format(date, "yyyy-MM-dd HH:mm:ss 'UTC'");
    case "local":
      return date.toLocaleString();
    case "custom":
    default:
      {
        const pattern = customPattern || (typeof preset === "string" && !["iso", "local", "utc"].includes(preset) ? preset : undefined);
        if (pattern) {
          try {
            return format(date, pattern);
          } catch {
            return date.toLocaleString();
          }
        }
        return date.toLocaleString();
      }
  }
}
