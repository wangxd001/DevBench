# 会话交接（Handoff）

> 规则：每个会话结束前（或 PreCompact 时）更新本文件；新会话第一步读它。保持 ≤ 60 行，超长就压缩/归档旧条目。

## 当前状态

- 全部 20 个工具已实现
- 全局搜索已实现（/search 路由，Ctrl+K，注册中心数据驱动）
- 收藏/最近使用已实现（LocalStorage 持久化）
- PWA manifest icons 已补充（SVG 192/512）
- docs 三份文档已对齐实现
- hash/regex 工具已接入 Web Worker（worker-base 重写，每任务独立 Worker）
- 207 个测试全部通过，typecheck / ESLint 无错误，build 成功
- 最近提交：9a5f954（搜索/收藏/PWA/docs）+ 2c0b999（Worker 隔离）

## 未完成任务

- 真实设备性能验证（Base64/哈希大输入、Worker 超时、PWA 离线）
- 配置 Playwright E2E 测试
- Cloudflare Pages 部署配置与验证（CSP / 安全响应头）

## 已知坑 / 决策记录

- jsdom 缺 crypto.subtle：test/setup.ts 用 Node webcrypto polyfill 修复 hash 测试
- jsdom warning 与 YAMLWarning 类不兼容：yaml 自定义 tag 测试改为断言 error 已定义
- vitest 5.1.0 forks pool bug → pool: 'vmThreads'；勿误诊为 jsdom 损坏
- vitest.config.ts 不能引入 vite-plugin-pwa；tsconfig 需 ignoreDeprecations: "6.0"
- vitest jsdom 环境 React.lazy 不渲染，路由测试不能断言 lazy 页面
- registry/tools.ts 追加条目查 "},," 双逗号；写含转义字符串用 Write/Edit 工具
- 行级 diff 用 diffArrays；json-diff 用 fast-json-patch
- worker-base 每任务独立 Worker，超时/取消后不复用，task.id 防旧结果覆盖
- 设计规格：docs/superpowers/specs/2026-11-17-global-search-design.md

## 关键文件指引

- PRD：docs/PRD.md
- 工具注册中心：src/tools/registry/tools.ts
- 搜索：src/features/search/；Stores：src/stores/
- Worker：src/lib/worker/（worker-base + regex/hash worker-entry）
- i18n：src/i18n/locales/（zh-CN.json + en-US.json）

## 常用操作速记

- 上下文 ~70% 主动 /compact；收尾跑 /wrapup
- 验证：npm run lint、npm run typecheck、npm run test（已内置 vmThreads）、npm run build
