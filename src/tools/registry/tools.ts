import { lazy } from "react";
import type { ToolDefinition, ToolId } from "./types";

const UuidGenerator = lazy(() => import("@/tools/generator/uuid-generator").then(m => ({ default: m.UuidGenerator })));

export const TOOLS: Partial<Record<ToolId, ToolDefinition>> = {
  "uuid-generator": {
    id: "uuid-generator",
    name: { "zh-CN": "UUID 生成器", "en-US": "UUID Generator" },
    description: {
      "zh-CN": "生成 UUID v4 格式的标识符",
      "en-US": "Generate UUID v4 identifiers"
    },
    categoryId: "generator",
    tags: ["generation"],
    keywords: {
      "zh-CN": ["uuid", "生成", "标识符"],
      "en-US": ["uuid", "generate", "identifier"]
    },
    icon: "hash",
    route: "/tools/uuid-generator",
    component: UuidGenerator,
    recommended: true,
    relatedTools: ["random-string-generator", "test-data-generator", "hash-generator"],
  },
};
