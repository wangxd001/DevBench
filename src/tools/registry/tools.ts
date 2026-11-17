import { lazy } from "react";
import type { ToolDefinition, ToolId } from "./types";

const HttpStatusCodes = lazy(() => import("@/tools/http/http-status-codes").then(m => ({ default: m.HttpStatusCodes })));
const UrlEncoder = lazy(() => import("@/tools/encoding/url-encoder").then(m => ({ default: m.UrlEncoder })));
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
  "http-status-codes": {
    id: "http-status-codes",
    name: { "zh-CN": "HTTP 状态码查询", "en-US": "HTTP Status Codes" },
    description: {
      "zh-CN": "查询 HTTP 状态码含义",
      "en-US": "Look up HTTP status code meanings"
    },
    categoryId: "http",
    tags: ["http", "web"],
    keywords: {
      "zh-CN": ["http", "状态码", "查询"],
      "en-US": ["http", "status", "code"]
    },
    icon: "list",
    route: "/tools/http-status-codes",
    component: HttpStatusCodes,
    recommended: false,
    relatedTools: ["http-header-parser", "http-cookie-parser", "jwt-decoder"],
  },
  "url-encoder": {
    id: "url-encoder",
    name: { "zh-CN": "URL 编解码", "en-US": "URL Encoder/Decoder" },
    description: {
      "zh-CN": "URL、URI 和组件的编解码",
      "en-US": "URL, URI and component encoding/decoding"
    },
    categoryId: "encoding",
    tags: ["encoding", "decoding"],
    keywords: {
      "zh-CN": ["url", "编码", "解码", "uri"],
      "en-US": ["url", "encode", "decode", "uri"]
    },
    icon: "link",
    route: "/tools/url-encoder",
    component: UrlEncoder,
    recommended: false,
    relatedTools: ["base64-converter", "unicode-converter", "html-entity-converter"],
  },
};
