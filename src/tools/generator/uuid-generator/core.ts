export function generateUuid(count: number): string[] {
  if (!Number.isInteger(count) || count < 1 || count > 100) {
    throw new Error("Count must be an integer between 1 and 100");
  }
  const results: string[] = [];
  for (let i = 0; i < count; i++) {
    results.push(crypto.randomUUID());
  }
  return results;
}
