export type Base64Variant = "standard" | "urlsafe";

const MAX_INPUT_BYTES = 5 * 1024 * 1024;

function utf8ToBase64(text: string, variant: Base64Variant): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  let base64 = btoa(binary);
  if (variant === "urlsafe") {
    base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return base64;
}

function base64ToUtf8(encoded: string, variant: Base64Variant): string {
  let base64 = encoded;
  if (variant === "urlsafe") {
    base64 = base64.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad === 2) base64 += "==";
    else if (pad === 3) base64 += "=";
  }
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return "";
  }
}

export function encodeBase64(text: string, variant: Base64Variant): { value: string; error?: string } {
  const byteLength = new TextEncoder().encode(text).byteLength;
  if (byteLength > MAX_INPUT_BYTES) {
    return { value: "", error: "Input exceeds 5 MB limit" };
  }
  return { value: utf8ToBase64(text, variant) };
}

export function decodeBase64(encoded: string, variant: Base64Variant): { value: string; error?: string } {
  const cleaned = encoded.trim();
  if (!cleaned) return { value: "" };

  const validChars = variant === "urlsafe" ? /^[A-Za-z0-9\-_]+=?$/ : /^[A-Za-z0-9+/]+={0,2}$/;
  if (!validChars.test(cleaned)) {
    return { value: "", error: "Invalid Base64 input" };
  }

  const result = base64ToUtf8(cleaned, variant);
  if (result === "" && cleaned !== "") {
    return { value: "", error: "Invalid Base64 input" };
  }
  return { value: result };
}
