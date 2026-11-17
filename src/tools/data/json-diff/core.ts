import { compare } from "fast-json-patch";

export interface DiffEntry {
  path: string;
  type: "added" | "removed" | "modified" | "unchanged";
  oldValue?: unknown;
  newValue?: unknown;
}

export interface DiffResult {
  entries: DiffEntry[];
  hasDiff: boolean;
  error?: string;
}

function safeParse(input: string): { value: unknown; error?: string } {
  if (!input.trim()) return { value: {} };
  try {
    return { value: JSON.parse(input) };
  } catch (e) {
    return { value: null, error: e instanceof Error ? e.message : String(e) };
  }
}

function toJsonPath(opsPath: string): string {
  const segments = opsPath.replace(/^\//, "").split("/").filter((s) => s !== "");
  let result = segments[0] || "";
  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i];
    if (/^\d+$/.test(seg)) {
      result += "[" + seg + "]";
    } else {
      result += "." + seg;
    }
  }
  return result;
}

export function compareJson(a: string, b: string): DiffResult {
  const parseA = safeParse(a);
  if (parseA.error) return { entries: [], hasDiff: false, error: "Left side: " + parseA.error };
  const parseB = safeParse(b);
  if (parseB.error) return { entries: [], hasDiff: false, error: "Right side: " + parseB.error };

  const operations = compare(parseA.value as object, parseB.value as object);
  const entries: DiffEntry[] = [];

  for (const op of operations) {
    const path = toJsonPath(op.path || "/");
    if (op.op === "add") {
      entries.push({ path, type: "added", newValue: op.value });
    } else if (op.op === "remove") {
      entries.push({ path, type: "removed" });
    } else if (op.op === "replace") {
      entries.push({ path, type: "modified", oldValue: op.value, newValue: op.value });
    }
  }

  return { entries, hasDiff: entries.length > 0 };
}
