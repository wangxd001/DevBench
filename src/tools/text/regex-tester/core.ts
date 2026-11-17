const SUPPORTED_FLAGS = new Set(["g", "i", "m", "s", "u", "y", "d"]);

export function validatePattern(pattern: string, flags: string): { valid: boolean; error?: string } {
  for (const flag of flags) {
    if (!SUPPORTED_FLAGS.has(flag)) {
      return { valid: false, error: `Unsupported flag: ${flag}` };
    }
  }
  try {
    new RegExp(pattern, flags);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: e instanceof Error ? e.message : String(e) };
  }
}
