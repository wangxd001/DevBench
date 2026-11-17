export interface ParsedHeader {
  name: string;
  value: string;
  line: number;
}

export interface HeaderError {
  line: number;
  message: string;
}

export interface HeaderParseResult {
  headers: ParsedHeader[];
  errors: HeaderError[];
}

export function parseHeaders(input: string): HeaderParseResult {
  const headers: ParsedHeader[] = [];
  const errors: HeaderError[] = [];

  const lines = input.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") continue;

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) {
      errors.push({ line: i + 1, message: "Missing colon" });
      continue;
    }

    const name = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (name === "") {
      errors.push({ line: i + 1, message: "Empty header name" });
      continue;
    }

    headers.push({ name, value, line: i + 1 });
  }

  return { headers, errors };
}
