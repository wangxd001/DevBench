import crypto from "crypto";

export interface TestField {
  type: "string" | "email" | "phone" | "age" | "integer" | "decimal" | "boolean" | "date" | "uuid" | "fixed";
  name: string;
  value?: string;
  min?: number;
  max?: number;
}

export interface TestGenerateOptions {
  fields: TestField[];
  count?: number;
}

export interface TestGenerateResult {
  records: Record<string, unknown>[];
  json: string;
}

const FIRST_NAMES = ["Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Helen", "Ivan", "Julia"];
const PHONE_PREFIXES = ["+86-100", "+86-200", "+86-300"]; // 合成号段，避免冒用真实号码

function randomInt(min: number, max: number): number {
  const range = max - min + 1;
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return min + (bytes[0] % range);
}

function generateEmail(): string {
  const name = FIRST_NAMES[randomInt(0, FIRST_NAMES.length - 1)].toLowerCase();
  const num = randomInt(1, 99999);
  const domain = ["example.com", "example.org", "example.net"][randomInt(0, 2)];
  return `${name}${num}@${domain}`;
}

function generatePhone(): string {
  const prefix = PHONE_PREFIXES[randomInt(0, PHONE_PREFIXES.length - 1)];
  const suffix = String(randomInt(10000000, 99999999));
  return `${prefix}-${suffix}`;
}

function generateDate(): string {
  const start = new Date("2020-01-01").getTime();
  const end = new Date("2030-12-31").getTime();
  const d = new Date(start + randomInt(0, Math.floor((end - start) / 86400000)));
  return d.toISOString().slice(0, 10);
}

function generateValue(field: TestField): unknown {
  switch (field.type) {
    case "fixed":
      return field.value ?? "";
    case "string":
      return Array.from({ length: 8 }, () => "abcdefghijklmnopqrstuvwxyz"[randomInt(0, 25)]).join("");
    case "email":
      return generateEmail();
    case "phone":
      return generatePhone();
    case "age":
      return randomInt(18, 80);
    case "integer":
      return randomInt(field.min ?? 0, field.max ?? 1000);
    case "decimal": {
      const int = randomInt(field.min ?? 0, field.max ?? 100);
      const frac = randomInt(0, 99);
      return int + frac / 100;
    }
    case "boolean":
      return randomInt(0, 1) === 1;
    case "date":
      return generateDate();
    case "uuid":
      return crypto.randomUUID();
    default:
      return "";
  }
}

export function generateTestData(options: TestGenerateOptions): TestGenerateResult {
  const { fields, count = 10 } = options;

  if (count < 1) throw new Error("Count must be at least 1");
  if (count > 10000) throw new Error("Count must be at most 10000");
  if (fields.length === 0) throw new Error("At least one field is required");

  const records: Record<string, unknown>[] = [];
  for (let i = 0; i < count; i++) {
    const record: Record<string, unknown> = {};
    for (const field of fields) {
      record[field.name] = generateValue(field);
    }
    records.push(record);
  }

  return {
    records,
    json: JSON.stringify(records, null, 2),
  };
}
