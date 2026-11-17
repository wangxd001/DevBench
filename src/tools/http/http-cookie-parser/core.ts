export interface ParsedCookie {
  name: string;
  value: string;
}

export interface CookieParseResult {
  cookies: ParsedCookie[];
}

export interface SetCookieResult {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: string;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string;
  error?: string;
}

export function parseCookie(input: string): CookieParseResult {
  if (!input.trim()) return { cookies: [] };

  const cookies: ParsedCookie[] = [];
  const parts = input.split(";").map((s) => s.trim());

  for (const part of parts) {
    if (!part) continue;
    const eqIdx = part.indexOf("=");
    if (eqIdx === -1) {
      cookies.push({ name: part, value: "" });
    } else {
      const name = part.slice(0, eqIdx).trim();
      const value = part.slice(eqIdx + 1).trim();
      cookies.push({ name, value });
    }
  }

  return { cookies };
}

export function parseSetCookie(input: string): SetCookieResult {
  if (!input.trim()) {
    return { name: "", value: "", error: "Empty Set-Cookie input" };
  }

  // 第一个 ; 之前是 name=value，之后是属性
  const firstSemicolon = input.indexOf(";");
  const nameValuePart = firstSemicolon === -1 ? input : input.slice(0, firstSemicolon);
  const attrsPart = firstSemicolon === -1 ? "" : input.slice(firstSemicolon + 1);

  const eqIdx = nameValuePart.indexOf("=");
  if (eqIdx === -1) {
    return {
      name: nameValuePart.trim(),
      value: "",
      error: "Missing = in name=value pair",
    };
  }

  const name = nameValuePart.slice(0, eqIdx).trim();
  const value = nameValuePart.slice(eqIdx + 1).trim();

  const result: SetCookieResult = { name, value };

  // 解析属性（Expires 可能包含逗号，需要特殊处理）
  // 按 RFC 6265: Expires 是 GMT 日期，格式如 "Wed, 09 Jun 2027 10:18:14 GMT"
  // 逗号在 Expires 值内不能作为分隔符
  const attrs = attrsPart.trim();
  if (!attrs) return result;

  // 用正则匹配每个属性
  const attrPattern = /((?:Domain|Path|Expires|Max-Age|Secure|HttpOnly|SameSite)\s*=\s*("[^"]*"|[^;]+)|Secure|HttpOnly)/gi;
  let match: RegExpExecArray | null;
  let lastEnd = 0;

  while ((match = attrPattern.exec(attrs)) !== null) {
    const rawAttr = match[0].trim();
    const attrName = rawAttr.split("=")[0].trim().toLowerCase();

    if (attrName === "domain") {
      const val = rawAttr.replace(/^domain\s*=\s*/i, "").trim();
      result.domain = val.replace(/^"|"$/g, "");
    } else if (attrName === "path") {
      const val = rawAttr.replace(/^path\s*=\s*/i, "").trim();
      result.path = val.replace(/^"|"$/g, "");
    } else if (attrName === "expires") {
      // Expires 值到下一个分号或行尾
      const expiresStart = attrs.indexOf("Expires", lastEnd - 10);
      if (expiresStart !== -1) {
        const afterEq = attrs.indexOf("=", expiresStart) + 1;
        const semicolonIdx = attrs.indexOf(";", afterEq);
        const expiresValue = (semicolonIdx === -1 ? attrs.slice(afterEq) : attrs.slice(afterEq, semicolonIdx)).trim();
        result.expires = expiresValue.replace(/^"|"$/g, "");
      }
    } else if (attrName === "max-age") {
      const val = rawAttr.replace(/^max-age\s*=\s*/i, "").trim();
      const num = parseInt(val, 10);
      if (!isNaN(num)) result.maxAge = num;
    } else if (attrName === "samesite") {
      const val = rawAttr.replace(/^samesite\s*=\s*/i, "").trim();
      result.sameSite = val.replace(/^"|"$/g, "");
    } else if (attrName === "secure") {
      result.secure = true;
    } else if (attrName === "httponly") {
      result.httpOnly = true;
    }

    lastEnd = attrPattern.lastIndex;
  }

  return result;
}
