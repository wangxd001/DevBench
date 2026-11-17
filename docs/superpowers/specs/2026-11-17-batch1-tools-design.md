# 第一批 10 个工具实现设计

> 日期：2026-11-17
> 范围：PRD §2.1 第一批 10 个工具 + 通用工具页面组件
> 需求依据：docs/PRD.md §7、DESIGN.md §7-8

## 目标

- 实现第一批 10 个工具的完整功能（核心逻辑 + 页面 + 测试 + i18n + 注册元数据）
- 建立工具页面通用组件，供 20 个工具复用
- 引入 CodeMirror 6（按需加载，仅适用工具）
- 引入 Web Worker 基础设施（regex-tester 强制使用）
- 引入 jsondiffpatch（json-diff 工具）

## 工具实现顺序（按复杂度）

| 顺序 | 工具 ID | 分类 | 复杂度 | 交互模式 |
|------|---------|------|--------|----------|
| 1 | uuid-generator | generator | 低 | 按钮触发 |
| 2 | url-encoder | encoding | 低 | 实时处理 |
| 3 | http-status-codes | http | 低 | 配置驱动（查询） |
| 4 | timestamp-converter | datetime | 中 | 按钮触发 |
| 5 | base64-converter | encoding | 中 | 实时处理 |
| 6 | http-header-parser | http | 中 | 按钮触发（CodeMirror） |
| 7 | jwt-decoder | http | 中 | 按钮触发 |
| 8 | json-formatter | data | 中 | 按钮触发（CodeMirror） |
| 9 | regex-tester | text | 高 | 按钮触发（Worker） |
| 10 | json-diff | data | 高 | 按钮触发（双 CodeMirror） |

## 通用组件

创建以下组件，放在 src/components/ 下：

| 组件 | 职责 | 位置 |
|------|------|------|
| ToolPageLayout | 工具页面通用布局（标题、说明、输入、参数、操作、结果、相关工具） | src/components/layout/ToolPageLayout.tsx |
| ToolInputPanel | 输入区域包装（标签、InputSizeIndicator、清空按钮） | src/components/editor/ToolInputPanel.tsx |
| ToolResultPanel | 结果区域包装（标题、复制、下载、状态提示） | src/components/editor/ToolResultPanel.tsx |
| ToolActionBar | 操作按钮区域（主操作 + 次要操作） | src/components/editor/ToolActionBar.tsx |
| InputSizeIndicator | 输入大小提示（当前/限制） | src/components/editor/InputSizeIndicator.tsx |
| CodeEditor | CodeMirror 6 封装（按需加载，light/dark 主题） | src/components/editor/CodeEditor.tsx |
| TextareaInput | 多行文本输入（非 CodeMirror 工具用） | src/components/editor/TextareaInput.tsx |
| ResultViewer | 结果展示（等宽字体、滚动、折叠） | src/components/editor/ResultViewer.tsx |

## Worker 基础设施

src/lib/worker/ 下创建：
- worker-base.ts：Worker 生命周期管理（初始化、执行、超时、取消、终止、旧结果覆盖防护）
- regex-worker.ts：regex-tester 专用 Worker

## i18n 扩展

每个工具在 zh-CN.json 和 en-US.json 中增加：
- 工具名称、描述
- 输入标签、参数标签
- 按钮文案（生成、转换、格式化、解析、测试、比对）
- 错误/成功/空状态文案
- 使用说明

## 注册中心

src/tools/registry/tools.ts 中创建 10 个工具的完整 ToolDefinition 元数据：
- 中英文名称、描述
- 分类、标签、关键词
- 图标（Lucide 风格）
- 路由、组件（lazy import）
- recommended 标记
- relatedTools（按 PRD §8.5）

## 非目标

- 不实现第二批 10 个工具
- 不实现全局搜索功能
- 不实现收藏、最近使用完整功能
- 不配置 Playwright E2E

## 风险

- CodeMirror 6 按需加载与 PWA 离线缓存的兼容性需验证
- jsondiffpatch 库的 API 稳定性（v0.x 版本）
- Worker 在 jsdom 测试环境中的模拟
