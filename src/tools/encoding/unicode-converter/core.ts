export interface UnicodeConvertResult {
  value: string;
  error?: string;
}

export function textToUnicode(text: string): UnicodeConvertResult {
  let result = "";
  for (const char of text) {
    const code = char.codePointAt(0)!;
    if (code < 0x20 || code > 0x7e) {
      if (code > 0xffff) {
        const high = Math.floor((code - 0x10000) / 0x400) + 0xd800;
        const low = ((code - 0x10000) % 0x400) + 0xdc00;
        result += "\\u" + high.toString(16).padStart(4, "0") + "\\u" + low.toString(16).padStart(4, "0");
      } else {
        result += "\\u" + code.toString(16).padStart(4, "0");
      }
    } else {
      result += char;
    }
  }
  return { value: result };
}

export function unicodeToText(input: string): UnicodeConvertResult {
  const result = input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
    const code = parseInt(hex, 16);
    if (code > 0x10ffff) throw new Error("Invalid code point");
    return String.fromCharCode(code);
  });
  const hasInvalidSeq = /\\u(?![0-9a-fA-F]{4})/.test(input);
  if (hasInvalidSeq) {
    return { value: "", error: "Invalid unicode escape sequence" };
  }
  return { value: result };
}
