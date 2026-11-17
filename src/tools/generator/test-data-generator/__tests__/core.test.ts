import { describe, it, expect } from "vitest";
import { generateTestData } from "../core";

describe("generateTestData", () => {
  it("generates 10 records by default", () => {
    const result = generateTestData({ fields: [{ type: "string", name: "name" }] });
    expect(result.records).toHaveLength(10);
  });

  it("respects count parameter", () => {
    const result = generateTestData({ fields: [{ type: "string", name: "name" }], count: 5 });
    expect(result.records).toHaveLength(5);
  });

  it("throws for count > 10000", () => {
    expect(() =>
      generateTestData({ fields: [{ type: "string", name: "name" }], count: 10001 })
    ).toThrow();
  });

  it("generates valid email with example.com domain", () => {
    const result = generateTestData({ fields: [{ type: "email", name: "email" }], count: 10 });
    for (const record of result.records) {
      const email = record.email as string;
      expect(email).toContain("@");
      expect(email).toMatch(/example\.(com|org|net)$/);
    }
  });

  it("generates UUID v4 format", () => {
    const result = generateTestData({ fields: [{ type: "uuid", name: "id" }], count: 5 });
    for (const record of result.records) {
      const uuid = record.id as string;
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    }
  });

  it("generates boolean values", () => {
    const result = generateTestData({ fields: [{ type: "boolean", name: "active" }], count: 20 });
    for (const record of result.records) {
      expect(typeof record.active).toBe("boolean");
    }
  });

  it("generates fixed text as-is", () => {
    const result = generateTestData({ fields: [{ type: "fixed", name: "status", value: "active" }], count: 3 });
    for (const record of result.records) {
      expect(record.status).toBe("active");
    }
  });

  it("generates integer in range", () => {
    const result = generateTestData({ fields: [{ type: "integer", name: "age", min: 18, max: 65 }], count: 100 });
    for (const record of result.records) {
      const age = record.age as number;
      expect(age).toBeGreaterThanOrEqual(18);
      expect(age).toBeLessThanOrEqual(65);
    }
  });
});
