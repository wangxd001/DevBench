# 第一批 10 个工具实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 executing-plans 逐任务实现此计划。

**目标：** 实现 PRD 2.1 第一批 10 个工具的完整功能，包括通用工具页面组件、核心逻辑、页面、测试、i18n 和注册元数据。

**架构：** 工具核心逻辑为纯函数，与 React UI 分离。每个工具一个目录（src/tools/<category>/<tool-id>/），包含 core.ts（纯函数）、index.tsx（页面组件）、tests。通用组件在 src/components/ 下，所有工具复用。

**技术栈：** React 19、TypeScript 5、CodeMirror 6、jsondiffpatch、Web Crypto API、Web Worker

**规格：** docs/superpowers/specs/2026-11-17-batch1-tools-design.md

## 全局约束

- 工具 ID、路由、分类必须与 PRD 2.1 完全一致
- 核心逻辑纯函数，不依赖 React
- 输入限制按 UTF-8 字节数，执行前检查
- 空输入不报错，非法输入显示明确错误
- 结果不覆盖原始输入
- 用户输入和结果不进入 LocalStorage、URL、控制台
- 每个工具必须有单元测试（正常、空、非法、边界）
- i18n 文案必须 zh-CN + en-US 双语完整
- 每个任务完成后 commit，Conventional Commits 格式

## 审查重点（Review Focus）

1. UUID 生成器：crypto.randomUUID() 不可用时，必须报错而非静默降级到 Math.random()。测试需模拟 crypto.randomUUID 缺失场景。
2. Base64 解码非法输入：非法 Base64 字符串必须显示明确错误，不得产生乱码结果。
3. JWT 解析器：JWT 格式错误（不是三段、Base64 段损坏）必须显示明确错误。exp 字段为过去时间时，界面显示警告但不阻止解析。
4. regex-tester Worker 超时：危险正则必须在超时后终止 Worker，界面显示超时错误，不得让主线程无响应。
5. json-diff 大输入：单侧 2 MB 输入时，diff 计算不得阻塞主线程超过 1 秒，结果必须可滚动。

---

## 任务 1：通用工具页面组件 + CodeMirror 封装

**文件：**
- 创建：src/components/layout/ToolPageLayout.tsx
- 创建：src/components/editor/ToolInputPanel.tsx
- 创建：src/components/editor/ToolResultPanel.tsx
- 创建：src/components/editor/ToolActionBar.tsx
- 创建：src/components/editor/InputSizeIndicator.tsx
- 创建：src/components/editor/CodeEditor.tsx
- 创建：src/components/editor/TextareaInput.tsx
- 创建：src/components/editor/ResultViewer.tsx
- 修改：src/components/editor/index.ts（导出所有组件）

**Interfaces：**

- ToolPageLayout: title, description, category, relatedTools?, children
- ToolInputPanel: label, placeholder?, value, onChange, onClear?, sizeLimit?, children
- ToolResultPanel: title, status('idle'|'processing'|'success'|'error'|'empty'), error?, onCopy?, onDownload?, children
- ToolActionBar: primaryLabel, onPrimary, primaryDisabled?, secondaryActions?, processing?
- InputSizeIndicator: current, limit, unit
- CodeEditor: value, onChange, language?('json'|'javascript'), readOnly?, height?
- TextareaInput: value, onChange, placeholder?, rows?
- ResultViewer: content, language?, collapsible?

每个组件：
- ToolPageLayout：标题区域（名称+描述+分类标签）、内容区域（children）、相关工具区域（点击跳转）
- ToolInputPanel：标签、输入内容（children）、清空按钮（有值时显示）、大小提示（有 sizeLimit 时显示）
- ToolResultPanel：标题、状态提示（processing 加载动画，error 错误，empty 空状态）、复制/下载按钮
- ToolActionBar：主操作按钮（processing 时禁用+加载状态）、次要操作按钮
- InputSizeIndicator："输入大小：X KB / Y MB"，超 80% 警告色，超限错误色
- CodeEditor：React.lazy 按需加载，JSON/JS 语法高亮，light/dark 主题，等宽字体，行号，默认 300px 高度
- TextareaInput：等宽字体，保留换行空白，默认 10 行
- ResultViewer：等宽字体，长内容可滚动，collapsible 时默认折叠显示前 50 行

验证：npm run typecheck && npm run build
Commit: feat: 通用工具页面组件与 CodeMirror 封装

---

## 任务 2：Worker 基础设施

**文件：**
- 创建：src/lib/worker/worker-base.ts
- 创建：src/lib/worker/regex-worker.ts
- 测试：src/lib/worker/__tests__/worker-base.test.ts
- 测试：src/lib/worker/__tests__/regex-worker.test.ts

**Interfaces：**

- createWorker(workerFactory: () => Worker): WorkerManager
- WorkerManager: execute(input, timeoutMs?): Promise, cancel(), terminate()
- WorkerTask: { id: number, input, timeoutMs }

测试场景（jsdom 无原生 Worker，需 mock）：
- 正常执行返回结果
- 超时 reject
- 取消终止当前任务
- Worker 意外终止后重新初始化
- 快速连续调用，旧结果不覆盖新结果（任务 ID 匹配）

regex-worker.ts：
- 接收 { pattern, flags, text, timeoutMs }
- 创建 RegExp 执行 matchAll
- 返回 { matches: [{text, index, groups, namedGroups}], count, truncated }
- 超过 10000 个匹配时截断并标记 truncated: true

验证：npm run test -- src/lib/worker/__tests__/
Commit: feat: Web Worker 基础设施与 regex-worker

---

## 任务 3：uuid-generator

**文件：**
- 创建：src/tools/generator/uuid-generator/core.ts
- 创建：src/tools/generator/uuid-generator/index.tsx
- 测试：src/tools/generator/uuid-generator/__tests__/core.test.ts
- 修改：src/i18n/locales/zh-CN.json、en-US.json、src/tools/registry/tools.ts

**core.ts 接口：**
- generateUuid(count: number): string[]（1-100，使用 crypto.randomUUID）
- crypto.randomUUID 不可用时抛错，不降级

**测试场景：**
- generateUuid(1) 返回 1 个 UUID，格式符合 v4 正则
- generateUuid(100) 返回 100 个唯一 UUID
- mock crypto.randomUUID 缺失时抛错
- count=0 或 count=101 时抛错

**页面：**
- 数量输入（number，min=1, max=100，默认 1）
- 生成按钮
- 结果列表（每条带复制按钮）
- 复制全部按钮

Commit: feat: UUID 生成器工具

---

## 任务 4：url-encoder

**文件：**
- 创建：src/tools/encoding/url-encoder/core.ts
- 创建：src/tools/encoding/url-encoder/index.tsx
- 测试：src/tools/encoding/url-encoder/__tests__/core.test.ts

**core.ts 接口：**
- encodeUri(input: string): { value: string; error?: string }
- decodeUri(input: string): { value: string; error?: string }
- encodeComponent(input: string): { value: string; error?: string }
- decodeComponent(input: string): { value: string; error?: string }
- 四个函数分别调用 encodeURI/decodeURI/encodeURIComponent/decodeURIComponent
- decode 用 try/catch 捕获 URIError，返回 error

**测试场景：**
- encodeUri("https://example.com/path?q=1") 保留 https:// 和 /
- encodeComponent("hello world") === "hello%20world"
- decodeComponent("%GG") 返回 error
- Unicode 字符（中文、Emoji）正确处理
- 实时处理模式（输入变化时自动计算结果）

Commit: feat: URL 编解码工具

---

## 任务 5：http-status-codes

**文件：**
- 创建：src/tools/http/http-status-codes/data.ts（静态数据）
- 创建：src/tools/http/http-status-codes/core.ts
- 创建：src/tools/http/http-status-codes/index.tsx
- 测试：src/tools/http/http-status-codes/__tests__/core.test.ts

**data.ts：**
- HttpStatusEntry: { code: number; name: string; description: { zh: string; en: string }; category: string }
- STATUS_CODES: 至少 50 条标准 HTTP 状态码
- 未分配状态码 description 写 "未分配" / "Unassigned"，不得编造

**core.ts：**
- searchStatusCodes(query: string): HttpStatusEntry[]
- 支持按 code、name、中英文关键词搜索，大小写不敏感
- 空查询返回全部

**测试场景：**
- searchStatusCodes("404") 返回 404 Not Found
- searchStatusCodes("not found") 返回 404
- searchStatusCodes("未找到") 返回 404（中文搜索）
- searchStatusCodes("") 返回全部
- searchStatusCodes("999") 返回空数组

Commit: feat: HTTP 状态码查询工具

---

## 任务 6：timestamp-converter

**文件：**
- 创建：src/tools/datetime/timestamp-converter/core.ts
- 创建：src/tools/datetime/timestamp-converter/index.tsx
- 测试：src/tools/datetime/timestamp-converter/__tests__/core.test.ts

**core.ts 接口：**
- timestampUnit = "seconds" | "milliseconds"
- timestampToDate(ts: string, unit: timestampUnit): Date | null
  - ts 必须是纯数字字符串（正数），否则返回 null
- dateToTimestamp(dateStr: string, unit: timestampUnit): string | null
  - dateStr 必须是合法日期时间字符串，否则返回 null
- getNowTimestamp(unit: timestampUnit): string

**测试场景：**
- timestampToDate("1700000000", "seconds") 返回对应 Date（2023-11-14T22:13:20Z）
- timestampToDate("1700000000000", "milliseconds") 返回对应 Date
- timestampToDate("abc", "seconds") 返回 null
- timestampToDate("-1", "seconds") 返回 null
- getNowTimestamp("seconds") 返回当前时间秒级时间戳字符串

**页面：**
- 双向转换（时间戳输入 + 日期时间输入）
- 单位选择（秒/毫秒 radio）
- 显示格式（本地/UTC/ISO 三种同时显示）
- 当前时间快捷填充按钮
- 使用 date-fns 格式化显示

Commit: feat: 时间戳转换器工具

---

## 任务 7：base64-converter

**文件：**
- 创建：src/tools/encoding/base64-converter/core.ts
- 创建：src/tools/encoding/base64-converter/index.tsx
- 测试：src/tools/encoding/base64-converter/__tests__/core.test.ts

**core.ts 接口：**
- base64Variant = "standard" | "urlsafe"
- encodeBase64(text: string, variant: base64Variant): { value: string; error?: string }
- decodeBase64(encoded: string, variant: base64Variant): { value: string; error?: string }
- 使用 TextEncoder/TextDecoder（UTF-8）
- 输入限制 5 MB（5 * 1024 * 1024 字节）
- URL-safe 变体：+ -> -，/ -> _，去掉 = 填充

**测试场景：**
- encodeBase64("hello", "standard") === "aGVsbG8="
- decodeBase64("aGVsbG8=", "standard") === "hello"
- encodeBase64("中文", "standard") 正确处理多字节
- decodeBase64("!!invalid!!", "standard") 返回 error
- encodeBase64("test", "urlsafe") 结果不含 + 和 /
- 输入超过 5 MB 时返回 error

**页面：**
- 编码/解码模式 radio
- 变体选择 radio
- 输入（TextareaInput）+ 大小提示
- 结果（ResultViewer）

Commit: feat: Base64 编解码工具

---

## 任务 8：http-header-parser

**文件：**
- 创建：src/tools/http/http-header-parser/core.ts
- 创建：src/tools/http/http-header-parser/index.tsx
- 测试：src/tools/http/http-header-parser/__tests__/core.test.ts

**core.ts 接口：**
- HeaderParseResult: { headers: { name: string; value: string; line: number }[]; errors: { line: number; message: string }[] }
- parseHeaders(input: string): HeaderParseResult
- 按第一个冒号分割，保留重复 Header，保留原始顺序
- 空行跳过，无冒号行标记为非法

**测试场景：**
- 正常 header（"Content-Type: text/html"）正确解析
- 重复 header（Set-Cookie 出现两次）都保留
- 非法行（"no-colon-here"）标记为 error
- 空输入返回 { headers: [], errors: [] }
- 大小写不敏感（content-type 和 Content-Type 都识别）

**页面：**
- 输入（CodeEditor，纯文本模式）
- 解析按钮
- 结果表格（name、value、行号）
- 非法行红色标记 + 错误说明

Commit: feat: HTTP Header 解析器工具

---

## 任务 9：jwt-decoder

**文件：**
- 创建：src/tools/http/jwt-decoder/core.ts
- 创建：src/tools/http/jwt-decoder/index.tsx
- 测试：src/tools/http/jwt-decoder/__tests__/core.test.ts

**core.ts 接口：**
- JwtDecodeResult: { header: Record<string, unknown> | null; payload: Record<string, unknown> | null; signature: string; errors: string[]; expired: boolean }
- decodeJwt(jwt: string): JwtDecodeResult
- 按 . 分割三段，Base64URL 解码 header/payload，JSON.parse
- 解码失败时 errors 非空，header/payload 为 null
- exp 为过去时间时 expired: true
- 不验证签名，不访问网络

**测试场景：**
- 合法 JWT（固定测试数据）正确解析 header 和 payload
- 不是三段（如 "abc.def"）返回 errors
- Base64 段损坏返回 errors
- exp 为过去时间时 expired: true
- CLAIM_DESCRIPTIONS 静态数据包含 iss/sub/aud/exp/nbf/iat/jti

**页面：**
- 输入（TextareaInput）
- 解析按钮
- 结果：Header 表格 + Payload 表格（每字段显示值 + 说明）
- 安全提示（双语）
- exp 过期时显示警告

Commit: feat: JWT 解析器工具

---

## 任务 10：json-formatter

**文件：**
- 创建：src/tools/data/json-formatter/core.ts
- 创建：src/tools/data/json-formatter/index.tsx
- 测试：src/tools/data/json-formatter/__tests__/core.test.ts

**core.ts 接口：**
- JsonFormatMode = "pretty" | "minify"
- JsonFormatResult: { value: string; error?: { message: string; line?: number; column?: number } }
- formatJson(input: string, mode: JsonFormatMode, indent: 2 | 4): JsonFormatResult
- 空输入返回 { value: "" }
- 使用 JSON.parse + JSON.stringify（保留属性顺序）
- 非法 JSON 提取行列（从 error message 解析）
- 重复属性名：JSON.parse 保留最后一个值，工具说明中注明
- 输入限制 5 MB

**测试场景：**
- 正常 JSON pretty 格式化（2 空格）
- 正常 JSON minify
- 空输入返回 { value: "" }
- 尾随逗号返回 error
- 字符串转义错误返回 error + 行列
- 大输入（接近 5 MB）正常处理

**页面：**
- 输入（CodeEditor，JSON 高亮）+ 大小提示
- 模式选择（Pretty/Minify radio）
- 缩进选择（2/4 空格 radio）
- 格式化按钮
- 结果（CodeEditor readOnly，JSON 高亮）
- 错误提示（行列号）

Commit: feat: JSON 格式化与校验工具

---

## 任务 11：regex-tester

**文件：**
- 创建：src/tools/text/regex-tester/core.ts
- 创建：src/tools/text/regex-tester/index.tsx
- 测试：src/tools/text/regex-tester/__tests__/core.test.ts
- 使用：src/lib/worker/regex-worker.ts（任务 2 创建）

**core.ts 接口：**
- RegexMatchResult: { matches: { text: string; index: number; groups: string[]; namedGroups: Record<string, string> }[]; truncated: boolean; error?: string }
- createRegex(pattern: string, flags: string): RegExp | null
- validatePattern(pattern: string, flags: string): { valid: boolean; error?: string }

**测试场景：**
- /\d+/g 匹配 "a1b22c333" 返回正确位置
- 捕获组正确提取
- 非法 pattern（"["）返回 error
- 空测试文本返回空 matches

**页面（Worker 流程）：**
- 正则输入（CodeEditor，JS 高亮）
- flags checkbox（g, i, m, s, u, y, d）
- 测试文本（TextareaInput，100 KB 限制）
- 测试按钮
- 结果：匹配列表（位置、文本、捕获组）
- 超时错误提示
- 取消操作

Commit: feat: 正则表达式测试器工具

---

## 任务 12：json-diff

**文件：**
- 创建：src/tools/data/json-diff/core.ts
- 创建：src/tools/data/json-diff/index.tsx
- 测试：src/tools/data/json-diff/__tests__/core.test.ts

**core.ts 接口：**
- DiffEntry: { path: string; type: "added"|"removed"|"modified"|"unchanged"; oldValue?: unknown; newValue?: unknown }
- DiffResult: { entries: DiffEntry[]; hasDiff: boolean; error?: string }
- compareJson(a: string, b: string): DiffResult
- 使用 jsondiffpatch 库
- 非法 JSON 返回 error
- 对象按属性名，数组按索引，null 与其他类型不同
- 输入限制：单侧 2 MB

**测试场景：**
- 相同 JSON 返回 hasDiff: false
- 属性新增/删除/修改正确识别
- 数组索引变化
- null vs 0 vs "0" 严格区分
- 非法 JSON 返回 error
- 大输入（接近 2 MB）正常处理

**页面：**
- 双 CodeMirror（左右，JSON 高亮）+ 各自大小提示
- 比对按钮
- 结果列表（path、type、原值、新值）
- 差异标识：新增=绿色+"+"，删除=红色+"-"，修改=黄色+"~"
- 移动端：上下排列两个输入区域

Commit: feat: JSON 比对工具

---

## 任务 13：注册中心完整元数据 + 路由接入

**文件：**
- 创建：src/tools/registry/tools.ts
- 修改：src/tools/registry/index.ts
- 修改：src/app/router.tsx

**tools.ts：**
- TOOLS: Record<ToolId, ToolDefinition>
- 10 个工具完整元数据（中英文名称、描述、分类、标签、关键词、图标、路由、组件 lazy import、recommended、relatedTools）
- relatedTools 严格按 PRD 8.5 关联关系表

**router.tsx 更新：**
- ToolDetail 从 tools.ts 查找 toolId 对应组件
- 找到则 React.Suspense + lazy 渲染
- 找不到则渲染"工具尚未实现"

**验证：**
- npm run test（validateRegistry 测试通过）
- npm run typecheck
- npm run build

Commit: feat: 第一批 10 个工具注册元数据与路由接入
