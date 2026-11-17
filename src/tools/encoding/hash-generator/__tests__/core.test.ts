import { describe, it, expect } from "vitest";
import { computeHash } from "../core";

describe("computeHash", () => {
  it("computes MD5 of empty string", async () => {
    const result = await computeHash("", "md5");
    expect(result.error).toBeUndefined();
    expect(result.value).toBe("d41d8cd98f00b204e9800998ecf8427e");
  });

  it("computes MD5 of 'hello'", async () => {
    const result = await computeHash("hello", "md5");
    expect(result.value).toBe("5d41402abc4b2a76b9719d911017c592");
  });

  it("computes SHA-256 of empty string", async () => {
    const result = await computeHash("", "sha-256");
    expect(result.value).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  });

  it("computes SHA-256 of 'hello'", async () => {
    const result = await computeHash("hello", "sha-256");
    expect(result.value).toBe("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
  });

  it("computes SHA-512 of 'hello'", async () => {
    const result = await computeHash("hello", "sha-512");
    expect(result.value).toBe("9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043");
  });

  it("handles UTF-8 Chinese input for SHA-256", async () => {
    const result = await computeHash("中文", "sha-256");
    expect(result.value).toMatch(/^[0-9a-f]{64}$/);
  });

  it("returns error for unknown algorithm", async () => {
    const result = await computeHash("test", "unknown" as any);
    expect(result.error).toBeDefined();
  });
});
