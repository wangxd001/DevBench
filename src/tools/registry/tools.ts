import { lazy } from "react";
import type { ToolDefinition, ToolId } from "./types";

const HttpStatusCodes = lazy(() => import("@/tools/http/http-status-codes").then(m => ({ default: m.HttpStatusCodes })));
const UrlEncoder = lazy(() => import("@/tools/encoding/url-encoder").then(m => ({ default: m.UrlEncoder })));
const TimestampConverter = lazy(() => import("@/tools/datetime/timestamp-converter").then(m => ({ default: m.TimestampConverter })));
const Base64Converter = lazy(() => import("@/tools/encoding/base64-converter").then(m => ({ default: m.Base64Converter })));
const HttpHeaderParser = lazy(() => import("@/tools/http/http-header-parser").then(m => ({ default: m.HttpHeaderParser })));
const JwtDecoder = lazy(() => import("@/tools/http/jwt-decoder").then(m => ({ default: m.JwtDecoder })));
const JsonFormatter = lazy(() => import("@/tools/data/json-formatter").then(m => ({ default: m.JsonFormatter })));
const RegexTester = lazy(() => import("@/tools/text/regex-tester").then(m => ({ default: m.RegexTester })));
const JsonDiff = lazy(() => import("@/tools/data/json-diff").then(m => ({ default: m.JsonDiff })));
const RandomStringGenerator = lazy(() => import("@/tools/generator/random-string-generator").then(m => ({ default: m.RandomStringGenerator })));
const UnicodeConverter = lazy(() => import("@/tools/encoding/unicode-converter").then(m => ({ default: m.UnicodeConverter })));
const HtmlEntityConverter = lazy(() => import("@/tools/encoding/html-entity-converter").then(m => ({ default: m.HtmlEntityConverter })));
const DatetimeFormatter = lazy(() => import("@/tools/datetime/datetime-formatter").then(m => ({ default: m.DatetimeFormatter })));
const DateCalculator = lazy(() => import("@/tools/datetime/date-calculator").then(m => ({ default: m.DateCalculator })));
const HashGenerator = lazy(() => import("@/tools/encoding/hash-generator").then(m => ({ default: m.HashGenerator })));
const ComingSoon = lazy(() => import("@/features/tools/ComingSoon").then(m => ({ default: m.ComingSoon })));
const UuidGenerator = lazy(() => import("@/tools/generator/uuid-generator").then(m => ({ default: m.UuidGenerator })));

export const TOOLS: Partial<Record<ToolId, ToolDefinition>> = {
  "timestamp-converter": {
    id: "timestamp-converter",
    name: { "zh-CN": "时间戳转换器", "en-US": "Timestamp Converter" },
    description: {
      "zh-CN": "时间戳与日期时间互转",
      "en-US": "Convert between timestamps and dates"
    },
    categoryId: "datetime",
    tags: ["datetime", "conversion"],
    keywords: {
      "zh-CN": ["时间戳", "转换", "日期"],
      "en-US": ["timestamp", "convert", "date"]
    },
    icon: "clock",
    route: "/tools/timestamp-converter",
    component: TimestampConverter,
    recommended: true,
    relatedTools: ["datetime-formatter", "date-calculator"],
  },
  "base64-converter": {
    id: "base64-converter",
    name: { "zh-CN": "Base64 编解码", "en-US": "Base64 Encoder/Decoder" },
    description: {
      "zh-CN": "文本与 Base64 互转",
      "en-US": "Convert between text and Base64"
    },
    categoryId: "encoding",
    tags: ["encoding", "decoding"],
    keywords: {
      "zh-CN": ["base64", "编码", "解码"],
      "en-US": ["base64", "encode", "decode"]
    },
    icon: "code",
    route: "/tools/base64-converter",
    component: Base64Converter,
    recommended: false,
    relatedTools: ["url-encoder", "unicode-converter", "html-entity-converter"],
  },
  "http-header-parser": {
    id: "http-header-parser",
    name: { "zh-CN": "HTTP Header 解析器", "en-US": "HTTP Header Parser" },
    description: {
      "zh-CN": "解析原始 HTTP Header",
      "en-US": "Parse raw HTTP headers"
    },
    categoryId: "http",
    tags: ["http", "web"],
    keywords: {
      "zh-CN": ["http", "header", "解析"],
      "en-US": ["http", "header", "parse"]
    },
    icon: "header",
    route: "/tools/http-header-parser",
    component: HttpHeaderParser,
    recommended: false,
    relatedTools: ["http-cookie-parser", "jwt-decoder", "http-status-codes"],
  },
  "jwt-decoder": {
    id: "jwt-decoder",
    name: { "zh-CN": "JWT 解析器", "en-US": "JWT Decoder" },
    description: {
      "zh-CN": "本地解码 JWT Header 和 Payload",
      "en-US": "Decode JWT header and payload locally"
    },
    categoryId: "http",
    tags: ["http", "security", "decoding"],
    keywords: {
      "zh-CN": ["jwt", "解析", "token"],
      "en-US": ["jwt", "decode", "token"]
    },
    icon: "key",
    route: "/tools/jwt-decoder",
    component: JwtDecoder,
    recommended: false,
    relatedTools: ["base64-converter", "http-header-parser", "http-cookie-parser"],
  },
  "json-formatter": {
    id: "json-formatter",
    name: { "zh-CN": "JSON 格式化与校验", "en-US": "JSON Formatter & Validator" },
    description: {
      "zh-CN": "格式化、压缩和校验 JSON",
      "en-US": "Format, minify and validate JSON"
    },
    categoryId: "data",
    tags: ["json", "validation"],
    keywords: {
      "zh-CN": ["json", "格式化", "校验"],
      "en-US": ["json", "format", "validate"]
    },
    icon: "braces",
    route: "/tools/json-formatter",
    component: JsonFormatter,
    recommended: true,
    relatedTools: ["json-diff", "json-yaml-converter", "base64-converter"],
  },
  "regex-tester": {
    id: "regex-tester",
    name: { "zh-CN": "正则表达式测试器", "en-US": "Regex Tester" },
    description: {
      "zh-CN": "测试 JavaScript 正则表达式",
      "en-US": "Test JavaScript regular expressions"
    },
    categoryId: "text",
    tags: ["regex", "testing", "text"],
    keywords: {
      "zh-CN": ["正则", "正则表达式", "regex"],
      "en-US": ["regex", "regular expression", "pattern"]
    },
    icon: "search",
    route: "/tools/regex-tester",
    component: RegexTester,
    recommended: false,
    relatedTools: ["text-diff", "test-data-generator", "json-formatter"],
  },
  "json-diff": {
    id: "json-diff",
    name: { "zh-CN": "JSON 比对工具", "en-US": "JSON Diff" },
    description: {
      "zh-CN": "比较两个 JSON 结构的差异",
      "en-US": "Compare differences between two JSON structures"
    },
    categoryId: "data",
    tags: ["json", "comparison"],
    keywords: {
      "zh-CN": ["json", "比对", "diff"],
      "en-US": ["json", "diff", "compare"]
    },
    icon: "diff",
    route: "/tools/json-diff",
    component: JsonDiff,
    recommended: false,
    relatedTools: ["json-formatter", "json-yaml-converter", "text-diff"],
  },

"hash-generator": {
    id: "hash-generator",
    name: { "zh-CN": "MD5 / SHA 哈希计算", "en-US": "Hash Generator (MD5 / SHA)" },
    description: { "zh-CN": "计算文本的 MD5 和 SHA 哈希摘要", "en-US": "Calculate MD5 and SHA hash digests" },
    categoryId: "encoding",
    tags: ["hash", "encoding"],
    keywords: { "zh-CN": ["hash", "md5", "sha"], "en-US": ["hash", "md5", "sha"] },
    icon: "lock",
    route: "/tools/hash-generator",
    component: HashGenerator,
    recommended: false,
    relatedTools: ["base64-converter", "uuid-generator", "random-string-generator"],
  },
"datetime-formatter": {
    id: "datetime-formatter",
    name: { "zh-CN": "日期时间格式化", "en-US": "Datetime Formatter" },
    description: { "zh-CN": "格式化日期时间为指定格式", "en-US": "Format dates and times" },
    categoryId: "datetime",
    tags: ["datetime", "conversion"],
    keywords: { "zh-CN": ["日期", "格式化", "时间"], "en-US": ["date", "format", "time"] },
    icon: "calendar",
    route: "/tools/datetime-formatter",
    component: DatetimeFormatter,
    recommended: false,
    relatedTools: ["timestamp-converter", "date-calculator"],
  },
"date-calculator": {
    id: "date-calculator",
    name: { "zh-CN": "日期计算器", "en-US": "Date Calculator" },
    description: { "zh-CN": "计算日期差值和日期加减", "en-US": "Calculate date differences and add/subtract days" },
    categoryId: "datetime",
    tags: ["datetime", "calculation"],
    keywords: { "zh-CN": ["日期", "计算", "差值"], "en-US": ["date", "calculate", "difference"] },
    icon: "calculator",
    route: "/tools/date-calculator",
    component: DateCalculator,
    recommended: false,
    relatedTools: ["datetime-formatter", "timestamp-converter"],
  },
"random-string-generator": {
    id: "random-string-generator",
    name: { "zh-CN": "随机字符串生成器", "en-US": "Random String Generator" },
    description: { "zh-CN": "生成随机字符串", "en-US": "Generate random strings" },
    categoryId: "generator",
    tags: ["generation"],
    keywords: { "zh-CN": ["随机", "字符串", "生成"], "en-US": ["random", "string", "generate"] },
    icon: "shuffle",
    route: "/tools/random-string-generator",
    component: RandomStringGenerator,
    recommended: false,
    relatedTools: ["uuid-generator", "test-data-generator", "hash-generator"],
  },
  "test-data-generator": {
    id: "test-data-generator",
    name: { "zh-CN": "随机测试数据生成器", "en-US": "Test Data Generator" },
    description: { "zh-CN": "生成模拟测试数据", "en-US": "Generate mock test data" },
    categoryId: "generator",
    tags: ["generation", "testing"],
    keywords: { "zh-CN": ["测试数据", "生成", "模拟"], "en-US": ["test data", "generate", "mock"] },
    icon: "database",
    route: "/tools/test-data-generator",
    component: ComingSoon,
    recommended: false,
    relatedTools: ["uuid-generator", "random-string-generator", "json-formatter"],
  },
"unicode-converter": {
    id: "unicode-converter",
    name: { "zh-CN": "Unicode 编解码", "en-US": "Unicode Converter" },
    description: { "zh-CN": "Unicode 转义与普通文本互转", "en-US": "Convert between Unicode escapes and text" },
    categoryId: "encoding",
    tags: ["unicode", "encoding", "decoding"],
    keywords: { "zh-CN": ["unicode", "编码", "解码"], "en-US": ["unicode", "encode", "decode"] },
    icon: "globe",
    route: "/tools/unicode-converter",
    component: UnicodeConverter,
    recommended: false,
    relatedTools: ["html-entity-converter", "url-encoder", "base64-converter"],
  },
"html-entity-converter": {
    id: "html-entity-converter",
    name: { "zh-CN": "HTML 实体编解码", "en-US": "HTML Entity Converter" },
    description: { "zh-CN": "HTML 实体与普通文本互转", "en-US": "Convert between HTML entities and text" },
    categoryId: "encoding",
    tags: ["encoding", "decoding", "web"],
    keywords: { "zh-CN": ["html", "实体", "编码"], "en-US": ["html", "entity", "encode"] },
    icon: "code",
    route: "/tools/html-entity-converter",
    component: HtmlEntityConverter,
    recommended: false,
    relatedTools: ["unicode-converter", "url-encoder", "base64-converter"],
  },
  "json-yaml-converter": {
    id: "json-yaml-converter",
    name: { "zh-CN": "JSON / YAML 转换", "en-US": "JSON / YAML Converter" },
    description: { "zh-CN": "JSON 与 YAML 互转", "en-US": "Convert between JSON and YAML" },
    categoryId: "data",
    tags: ["json", "yaml", "conversion"],
    keywords: { "zh-CN": ["json", "yaml", "转换"], "en-US": ["json", "yaml", "convert"] },
    icon: "file",
    route: "/tools/json-yaml-converter",
    component: ComingSoon,
    recommended: false,
    relatedTools: ["json-formatter", "json-diff", "text-diff"],
  },
  "http-cookie-parser": {
    id: "http-cookie-parser",
    name: { "zh-CN": "HTTP Cookie 解析器", "en-US": "HTTP Cookie Parser" },
    description: { "zh-CN": "解析 HTTP Cookie 和 Set-Cookie", "en-US": "Parse HTTP cookies and Set-Cookie headers" },
    categoryId: "http",
    tags: ["http", "web", "security"],
    keywords: { "zh-CN": ["cookie", "http", "解析"], "en-US": ["cookie", "http", "parse"] },
    icon: "cookie",
    route: "/tools/http-cookie-parser",
    component: ComingSoon,
    recommended: false,
    relatedTools: ["http-header-parser", "jwt-decoder", "base64-converter"],
  },
  "text-diff": {
    id: "text-diff",
    name: { "zh-CN": "文本 Diff 比对", "en-US": "Text Diff" },
    description: { "zh-CN": "比较两段文本的差异", "en-US": "Compare differences between two texts" },
    categoryId: "text",
    tags: ["text", "comparison", "diff"],
    keywords: { "zh-CN": ["文本", "diff", "比对"], "en-US": ["text", "diff", "compare"] },
    icon: "diff",
    route: "/tools/text-diff",
    component: ComingSoon,
    recommended: false,
    relatedTools: ["json-diff", "regex-tester", "json-formatter"],
  },
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
