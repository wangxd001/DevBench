const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
  copy: "\u00a9",
  reg: "\u00ae",
  hellip: "\u2026",
  mdash: "\u2014",
  ndash: "\u2013",
  lsquo: "\u2018",
  rsquo: "\u2019",
  ldquo: "\u201c",
  rdquo: "\u201d",
  trade: "\u2122",
  times: "\u00d7",
  divide: "\u00f7",
  plusmn: "\u00b1",
  frac12: "\u00bd",
  middot: "\u00b7",
  deg: "\u00b0",
  bull: "\u2022",
  para: "\u00b6",
  sect: "\u00a7",
  cent: "\u00a2",
  pound: "\u00a3",
  yen: "\u00a5",
  euro: "\u20ac",
  micro: "\u00b5",
  ordm: "\u00ba",
  ordf: "\u00aa",
};

export function textToHtmlEntity(text: string): string {
  let result = "";
  for (const char of text) {
    switch (char) {
      case "&": result += "&amp;"; break;
      case "<": result += "&lt;"; break;
      case ">": result += "&gt;"; break;
      case '"': result += "&quot;"; break;
      case "'": result += "&#39;"; break;
      default:
        const code = char.codePointAt(0)!;
        if (code > 0x7e) {
          result += char;
        } else {
          result += char;
        }
    }
  }
  return result;
}

export function htmlEntityToText(input: string): string {
  return input
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const code = parseInt(hex, 16);
      return code <= 0x10ffff ? String.fromCodePoint(code) : "&#" + code + ";";
    })
    .replace(/&#(\d+);/g, (_, dec) => {
      const code = parseInt(dec, 10);
      return code <= 0x10ffff ? String.fromCodePoint(code) : "&#" + code + ";";
    })
    .replace(/&([a-zA-Z]+);/g, (match, name) => {
      const lower = name.toLowerCase();
      if (lower in NAMED_ENTITIES) return NAMED_ENTITIES[lower];
      return match;
    });
}
