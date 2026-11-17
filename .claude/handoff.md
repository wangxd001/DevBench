# 会话交接（Handoff）

> 规则：每个会话结束前（或 PreCompact 时）更新本文件；新会话第一步读它。保持 ≤ 80 行，超长就压缩/归档旧条目。

## 当前状态

- 工程骨架初始化完成（commit d5625d7）
- 第一批 10 个工具实现完成（commit 95ffb04）
- 99 个测试全部通过，typecheck/build/lint 均无错误

## 未完成任务

- 实现第二批 10 个工具（PRD §2.1 功能完善阶段）
- 实现全局搜索功能（注册中心数据驱动，Ctrl+K 快捷键）
- 实现收藏、最近使用完整功能（store 已有骨架，业务逻辑未完成）
- 配置 Playwright E2E 测试
- 真实设备性能验证（Base64/哈希大输入、Worker 超时、PWA 离线）
- Cloudflare Pages 部署验证
- regex-tester 真实 Worker 实现（当前用纯函数，性能未验证）

## 已知坑 / 决策记录

- 2026-11-17：jsdom 模块偶发损坏，重建 node_modules 可修复
- 2026-11-17：vitest.config.ts 不能引入 vite-plugin-pwa，只保留 react 插件
- 2026-11-17：tsconfig.json 需要 ignoreDeprecations: "6.0" 抑制 baseUrl 弃用错误
- 2026-11-17：测试文件中中文字符串通过 Python json.dumps 生成，避免 bash heredoc 编码损坏
- 2026-11-17：vitest jsdom 环境下 React.lazy 组件不渲染，路由测试不能断言 lazy 页面内容
- 2026-11-17：regex-tester 用纯函数 regexWorkerHandler，生产性能需真实设备验证后再补 Worker
- 2026-11-17：json-diff 用 fast-json-patch 而非 jsondiffpatch（API 更简洁）

## 关键文件指引

- PRD：docs/PRD.md
- 设计规格：docs/superpowers/specs/2026-11-17-batch1-tools-design.md
- 实现计划：docs/superpowers/plans/2026-11-17-batch1-tools.md
- 工具注册中心：src/tools/registry/tools.ts（20 个工具元数据）
- 通用组件：src/components/editor/、src/components/layout/
- Worker 基础设施：src/lib/worker/
- i18n 资源：src/i18n/locales/

## 常用操作速记

- 上下文 ~70% 主动 /compact；收尾跑 /wrapup。
- 验证命令：npm run lint、npm run typecheck、npm run test、npm run build
