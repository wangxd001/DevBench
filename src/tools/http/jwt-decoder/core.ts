export interface JwtDecodeResult {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  errors: string[];
  expired: boolean;
}

export const CLAIM_DESCRIPTIONS: Record<string, { zh: string; en: string }> = {
  iss: { zh: "签发者", en: "Issuer" },
  sub: { zh: "主题", en: "Subject" },
  aud: { zh: "受众", en: "Audience" },
  exp: { zh: "过期时间", en: "Expiration Time" },
  nbf: { zh: "生效时间", en: "Not Before" },
  iat: { zh: "签发时间", en: "Issued At" },
  jti: { zh: "JWT ID", en: "JWT ID" },
};

function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad === 2) base64 += "==";
  else if (pad === 3) base64 += "=";
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch {
    return "";
  }
}

export function decodeJwt(jwt: string): JwtDecodeResult {
  const errors: string[] = [];
  const parts = jwt.trim().split(".");

  if (parts.length !== 3) {
    errors.push("Invalid JWT format: expected 3 Base64URL segments");
    return { header: null, payload: null, signature: jwt, errors, expired: false };
  }

  const [headerB64, payloadB64, signature] = parts;

  let header: Record<string, unknown> | null = null;
  let payload: Record<string, unknown> | null = null;

  const headerStr = base64UrlDecode(headerB64);
  if (!headerStr) {
    errors.push("Failed to decode header segment");
  } else {
    try {
      header = JSON.parse(headerStr);
    } catch {
      errors.push("Header is not valid JSON");
    }
  }

  const payloadStr = base64UrlDecode(payloadB64);
  if (!payloadStr) {
    errors.push("Failed to decode payload segment");
  } else {
    try {
      payload = JSON.parse(payloadStr);
    } catch {
      errors.push("Payload is not valid JSON");
    }
  }

  let expired = false;
  if (payload && typeof payload.exp === "number") {
    expired = payload.exp * 1000 < Date.now();
  }

  return { header, payload, signature, errors, expired };
}
