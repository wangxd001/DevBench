import md5 from "js-md5";

export type HashAlgorithm = "md5" | "sha-1" | "sha-256" | "sha-384" | "sha-512";

export interface HashResult {
  value: string;
  error?: string;
}

const SHA_ALGOS: Record<string, string> = {
  "sha-1": "SHA-1",
  "sha-256": "SHA-256",
  "sha-384": "SHA-384",
  "sha-512": "SHA-512",
};

export async function computeHash(text: string, algorithm: HashAlgorithm): Promise<HashResult> {
  if (algorithm === "md5") {
    const bytes = new TextEncoder().encode(text);
    const md5Instance = (md5 as any).create();
    md5Instance.update(bytes);
    return { value: md5Instance.hex() };
  }

  const webAlgo = SHA_ALGOS[algorithm];
  if (!webAlgo) {
    return { value: "", error: "Unknown algorithm: " + algorithm };
  }

  try {
    const bytes = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest(webAlgo, bytes);
    const hashArray = new Uint8Array(hashBuffer);
    const hex = Array.from(hashArray)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return { value: hex };
  } catch (e) {
    return { value: "", error: e instanceof Error ? e.message : String(e) };
  }
}
