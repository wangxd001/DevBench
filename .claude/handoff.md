# 会话交接（Handoff）

> 规则：每个会话结束前（或 PreCompact 时）更新本文件；新会话第一步读它。保持 ≤ 80 行，超长就压缩/归档旧条目。

## 当前状态

- 工程骨架初始化完成（commit d5625d7）
- 20 个工具均未实现，等待第一批工具开发

## 未完成任务

- 实现第一批 10 个工具（PRD §2.1 基础验证阶段）
- 实现全局搜索功能
- 实现收藏、最近使用完整功能
- 配置 Playwright E2E 测试
- Cloudflare Pages 部署验证

## 已知坑 / 决策记录

- 日期：2026-11-17
- 记录：Windows 上 jsdom 的 whatwg-encoding 模块偶发缺失，重建 node_modules 可修复
- 记录：vitest 的 native config loader 对 vite-plugin-pwa ESM import 有问题，vitest.config.ts 只保留 react 插件
- 记录：tsconfig.json 需要 ignoreDeprecations: "6.0" 来抑制 baseUrl 弃用警告
- 记录：测试文件中中文字符串通过 Python json.dumps 生成，避免 bash heredoc 编码损坏

## 关键文件指引

- PRD：docs/PRD.md
- 设计规格：docs/superpowers/specs/2026-11-16-project-scaffold-design.md
- 实现计划：docs/superpowers/plans/2026-11-16-project-scaffold.md
- 工具注册中心：src/tools/registry/
- i18n 资源：src/i18n/locales/
- Design Tokens：src/styles/tokens.css

## 常用操作速记

- 上下文 ~70% 主动 /compact；收尾跑 /wrapup。
- 验证命令：npm run lint、npm run typecheck、npm run test、npm run build
