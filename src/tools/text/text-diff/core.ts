import { diffArrays } from "diff";

export interface DiffLine {
  type: "added" | "removed" | "modified" | "unchanged";
  text?: string;
  newText?: string;
  oldText?: string;
  lineNumber: number;
}

export interface TextDiffOptions {
  caseSensitive?: boolean;
  ignoreWhitespace?: boolean;
}

export interface TextDiffResult {
  lines: DiffLine[];
  hasDiff: boolean;
}

function normalizeLine(line: string, options: TextDiffOptions): string {
  let normalized = line;
  if (options.ignoreWhitespace) {
    normalized = normalized.trim();
  }
  if (!options.caseSensitive) {
    normalized = normalized.toLowerCase();
  }
  return normalized;
}

export function textDiff(
  a: string,
  b: string,
  options: TextDiffOptions = { caseSensitive: true, ignoreWhitespace: false }
): TextDiffResult {
  const normalize = (line: string) => normalizeLine(line, options);
  const aNorm = a.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const bNorm = b.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const aLines = aNorm.split("\n");
  const bLines = bNorm.split("\n");
  const aNormLines = aLines.map(normalize);
  const bNormLines = bLines.map(normalize);

  const changes = diffArrays(aNormLines, bNormLines);

  const lines: DiffLine[] = [];
  let oldLineNum = 0;
  let newLineNum = 0;

  for (const change of changes) {
    const vals = change.value as string[];

    if (!change.added && !change.removed) {
      for (let i = 0; i < vals.length; i++) {
        oldLineNum++;
        newLineNum++;
        lines.push({
          type: "unchanged",
          text: aLines[oldLineNum - 1] ?? "",
          lineNumber: oldLineNum,
        });
      }
    } else if (change.removed) {
      for (let i = 0; i < vals.length; i++) {
        oldLineNum++;
        lines.push({
          type: "removed",
          text: aLines[oldLineNum - 1] ?? "",
          oldText: aLines[oldLineNum - 1] ?? "",
          lineNumber: oldLineNum,
        });
      }
    } else if (change.added) {
      for (let i = 0; i < vals.length; i++) {
        newLineNum++;
        lines.push({
          type: "added",
          text: bLines[newLineNum - 1] ?? "",
          newText: bLines[newLineNum - 1] ?? "",
          lineNumber: newLineNum,
        });
      }
    }
  }

  const merged: DiffLine[] = [];
  let idx = 0;
  while (idx < lines.length) {
    if (lines[idx].type === "removed" && idx + 1 < lines.length && lines[idx + 1].type === "added") {
      merged.push({
        type: "modified",
        oldText: lines[idx].oldText,
        newText: lines[idx + 1].newText,
        lineNumber: lines[idx].lineNumber,
      });
      idx += 2;
    } else {
      merged.push(lines[idx]);
      idx++;
    }
  }

  return {
    lines: merged,
    hasDiff: merged.some((l) => l.type !== "unchanged"),
  };
}
