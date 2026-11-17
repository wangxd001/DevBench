# 会话交接（Handoff）

> 规则：每个会话结束前（或 PreCompact 时）更新本文件；新会话第一步读它。保持 ≤ 60 行，超长就压缩/归档旧条目。

## 当前状态

- 全部 20 个工具已实现（骨架 d5625d7，第一批 95ffb04，第二批 6ca0592）
- 全局搜索已实现（/search 路由，Ctrl+K，注册中心数据驱动，9 个单测）
- 收藏/最近使用已实现（LocalStorage 持久化 devbench.favorites / devbench.recent，12 个 store 单测）
- PWA manifest icons 已补充（SVG 192/512）
- docs/architecture.md、development.md、deployment.md 已对齐实际实现
- vitest.config.ts 加 pool: 'vmThreads'（vitest 5.1.0 forks pool bug）
- 207 测试通过（5 个预存失败：hash SHA-256/512 与 json-yaml，见下方坑记录）
- typecheck 无错误，ESLint 0 errors，build 成功

## 未完成任务

- 实现 hash-generator 的 Web Worker 隔离（当前主线程执行）
- 实现 regex-tester 的真实 Worker（当前纯函数，性能未验证）
- 配置 Playwright E2E 测试
- 真实设备性能验证（Base64/哈希大输入、Worker 超时、PWA 离线）
- Cloudflare Pages 部署配置与验证（含 CSP / 安全响应头，deployment.md 已标注未做）

## 已知坑 / 决策记录

- vitest 5.1.0 forks pool bug 全量失败（"reading 'config'"）→ pool: 'vmThreads'；勿误诊为 jsdom 损坏
- 预存 5 个失败测试：hash-generator SHA-256/512 四例 + json-yaml 自定义 tag 一例，未修复，与近期改动无关
- vitest.config.ts 不能引入 vite-plugin-pwa，只保留 react 插件
- tsconfig.json 需要 ignoreDeprecations: "6.0"
- vitest jsdom 环境 React.lazy 组件不渲染，路由测试不能断言 lazy 页面内容
- registry/tools.ts 追加条目后查 "},," 双逗号（TS1136）；写含转义字符串优先用 Write/Edit 工具
- 行级 diff 用 diffArrays；json-diff 用 fast-json-patch
- 搜索/收藏/最近使用设计规格：docs/superpowers/specs/2026-11-17-global-search-design.md

## 关键文件指引

- PRD：docs/PRD.md
- 工具注册中心：src/tools/registry/tools.ts（20 个工具完整元数据）
- 搜索：src/features/search/（search.ts 纯函数 + index.tsx）
- Stores：src/stores/（preferences / favorites / recent，均 LocalStorage 持久化）
- Worker 基础设施：src/lib/worker/
- i18n 资源：src/i18n/locales/（zh-CN.json + en-US.json）

## 常用操作速记

- 上下文 ~70% 主动 /compact；收尾跑 /wrapup
- 验证命令：npm run lint、npm run typecheck、npm run test、npm run build（test 已内置 vmThreads pool）
