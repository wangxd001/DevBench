import { describe, it, expect } from "vitest";
import { validateRegistry } from "../validate";
import type { ToolDefinition } from "../types";

const makeTool = (id: string, overrides: Partial<ToolDefinition> = {}): ToolDefinition => ({
  id: id as ToolDefinition["id"],
  name: { "zh-CN": id, "en-US": id },
  description: { "zh-CN": id, "en-US": id },
  categoryId: "data" as const,
  tags: [],
  keywords: { "zh-CN": [], "en-US": [] },
  icon: "circle",
  route: "/tools/" + id,
  component: undefined as any,  // LazyExoticComponent placeholder for tests
  recommended: false,
  relatedTools: [],
  ...overrides,
});

describe("validateRegistry", () => {
  it("legal registry returns valid true", () => {
    const tools = [
      makeTool("json-formatter", { relatedTools: ["json-diff", "json-yaml-converter"] }),
      makeTool("json-diff", { relatedTools: ["json-formatter", "json-yaml-converter"] }),
      makeTool("json-yaml-converter", { relatedTools: ["json-formatter", "json-diff"] }),
    ];
    const result = validateRegistry(tools);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  it("detects duplicate tool IDs", () => {
    const tools = [makeTool("json-formatter"), makeTool("json-formatter")];
    const result = validateRegistry(tools);
    expect(result.valid).toBe(false);
  });
  it("detects unknown category", () => {
    const tools = [makeTool("json-formatter", { categoryId: "unknown" as any })];
    expect(validateRegistry(tools).valid).toBe(false);
  });
  it("detects relatedTools containing self", () => {
    const tools = [
      makeTool("json-formatter", { relatedTools: ["json-formatter", "uuid-generator"] }),
      makeTool("uuid-generator", { relatedTools: ["json-formatter", "json-diff"] }),
      makeTool("json-diff", { relatedTools: ["uuid-generator", "json-formatter"] }),
    ];
    expect(validateRegistry(tools).valid).toBe(false);
  });
  it("detects relatedTools too few", () => {
    const tools = [
      makeTool("json-formatter", { relatedTools: ["uuid-generator"] }),
      makeTool("uuid-generator", { relatedTools: ["json-formatter", "json-diff"] }),
      makeTool("json-diff", { relatedTools: ["json-formatter", "uuid-generator"] }),
    ];
    expect(validateRegistry(tools).valid).toBe(false);
  });
  it("detects duplicate relatedTools", () => {
    const tools = [
      makeTool("json-formatter", { relatedTools: ["uuid-generator", "uuid-generator", "json-diff"] }),
      makeTool("uuid-generator", { relatedTools: ["json-formatter", "json-diff"] }),
      makeTool("json-diff", { relatedTools: ["json-formatter", "uuid-generator"] }),
    ];
    expect(validateRegistry(tools).valid).toBe(false);
  });
  it("detects unknown related tool", () => {
    const tools = [
      makeTool("json-formatter", { relatedTools: ["unknown-tool" as any, "uuid-generator" as any] }),
      makeTool("uuid-generator", { relatedTools: ["json-formatter", "json-diff"] }),
      makeTool("json-diff", { relatedTools: ["json-formatter", "uuid-generator"] }),
    ];
    expect(validateRegistry(tools).valid).toBe(false);
  });
  it("detects missing zh-CN name", () => {
    const tools = [
      makeTool("json-formatter", { name: { "zh-CN": "", "en-US": "x" } }),
      makeTool("uuid-generator", { relatedTools: ["json-formatter", "json-diff"] }),
      makeTool("json-diff", { relatedTools: ["json-formatter", "uuid-generator"] }),
    ];
    expect(validateRegistry(tools).valid).toBe(false);
  });
});