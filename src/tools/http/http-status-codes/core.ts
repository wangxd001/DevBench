import { STATUS_CODES, type HttpStatusEntry } from "./data";

export function searchStatusCodes(query: string): HttpStatusEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...STATUS_CODES];

  return STATUS_CODES.filter((entry) => {
    const codeMatch = String(entry.code) === q;
    const nameMatch = entry.name.toLowerCase().includes(q);
    const zhMatch = entry.description.zh.includes(query.trim());
    const enMatch = entry.description.en.toLowerCase().includes(q);
    return codeMatch || nameMatch || zhMatch || enMatch;
  });
}
