export interface UrlEncodeResult {
  value: string;
  error?: string;
}

export function encodeUri(input: string): UrlEncodeResult {
  try {
    return { value: encodeURI(input) };
  } catch {
    return { value: "", error: "Invalid URI" };
  }
}

export function decodeUri(input: string): UrlEncodeResult {
  try {
    return { value: decodeURI(input) };
  } catch {
    return { value: "", error: "Invalid URI encoding" };
  }
}

export function encodeComponent(input: string): UrlEncodeResult {
  try {
    return { value: encodeURIComponent(input) };
  } catch {
    return { value: "", error: "Invalid component" };
  }
}

export function decodeComponent(input: string): UrlEncodeResult {
  try {
    return { value: decodeURIComponent(input) };
  } catch {
    return { value: "", error: "Invalid component encoding" };
  }
}
