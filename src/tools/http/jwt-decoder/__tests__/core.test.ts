import { describe, it, expect } from "vitest";
import { decodeJwt, CLAIM_DESCRIPTIONS } from "../core";

// 用固定的测试 JWT（header: {"alg":"HS256","typ":"JWT"}, payload: {"sub":"1234567890","iat":1516239022,"exp":1516269022})
const TEST_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMjkwMjJ9." +
  "TJVA95OrM7rXXcKQGgjBmM9Yz1JgDQ";

describe("decodeJwt", () => {
  it("decodes valid JWT", () => {
    const result = decodeJwt(TEST_JWT);
    expect(result.errors).toHaveLength(0);
    expect(result.header).not.toBeNull();
    expect(result.payload).not.toBeNull();
    expect(result.payload?.sub).toBe("1234567890");
    expect(result.header?.alg).toBe("HS256");
  });

  it("returns errors for non-three-segment JWT", () => {
    const result = decodeJwt("only.two");
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("returns errors for corrupted base64 segment", () => {
    const result = decodeJwt("!!!.@@@.###");
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("returns empty signature for valid 3-segment JWT", () => {
    const result = decodeJwt(TEST_JWT);
    expect(result.signature).toBeDefined();
  });

  it("flags expired JWT", () => {
    // exp=1516229022 is in the past
    const result = decodeJwt(TEST_JWT);
    expect(result.expired).toBe(true);
  });

  it("has claim descriptions for standard claims", () => {
    expect(CLAIM_DESCRIPTIONS.iss).toBeDefined();
    expect(CLAIM_DESCRIPTIONS.sub).toBeDefined();
    expect(CLAIM_DESCRIPTIONS.exp).toBeDefined();
    expect(CLAIM_DESCRIPTIONS.iss.en).toBe("Issuer");
    expect(CLAIM_DESCRIPTIONS.exp.zh).toBe("过期时间");
  });
});
