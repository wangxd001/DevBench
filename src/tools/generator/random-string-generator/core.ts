const CHARSETS = {
  digits: "0123456789",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  special: "!@#$%^&*()-_=+[]{}|;:,.<>?",
};

export interface RandomStringOptions {
  length?: number;
  quantity?: number;
  charsets: string[];
  customCharset?: string;
}

export interface RandomStringResult {
  results: string[];
}

export function generateRandomString(
  length: number = 16,
  quantity: number = 1,
  charsets: string[] = ["lowercase", "digits"],
  customCharset?: string
): RandomStringResult {
  if (quantity < 1 || quantity > 100) {
    throw new Error("Quantity must be between 1 and 100");
  }
  if (length < 1 || length > 1024) {
    throw new Error("Length must be between 1 and 1024");
  }

  let pool = charsets.reduce((acc, c) => acc + (CHARSETS[c as keyof typeof CHARSETS] || ""), "");
  if (customCharset) pool += customCharset;
  if (!pool) {
    throw new Error("Character set is empty");
  }

  const results: string[] = [];
  const bytes = new Uint32Array(quantity * length);
  crypto.getRandomValues(bytes);

  for (let i = 0; i < quantity; i++) {
    let str = "";
    for (let j = 0; j < length; j++) {
      // 无偏采样：拒绝超出范围的随机数
      let idx: number;
      do {
        idx = bytes[i * length + j] % pool.length;
      } while (
        bytes[i * length + j] >=
        Math.floor(0xFFFFFFFF / pool.length) * pool.length
      );
      str += pool[idx];
    }
    results.push(str);
  }

  return { results };
}
