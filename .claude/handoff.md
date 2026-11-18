# 会话交接（Handoff）

> 规则：每个会话结束前（或 PreCompact 时）更新本文件；新会话第一步读它。保持 ≤ 60 行，超长就压缩/归档旧条目。

## 当前状态

- 全部 20 个工具已实现
- 全局搜索已实现（/search 路由，Ctrl+K，注册中心数据驱动）
- 收藏/最近使用已实现（LocalStorage 持久化）
- PWA manifest icons 已补充（SVG 192/512）
- docs 三份文档已对齐实现
- hash/regex 工具已接入 Web Worker（worker-base 重写，每任务独立 Worker）
- 工具目录页已补齐（6 分类 + 20 工具卡片，注册中心数据驱动）
- Playwright E2E 已配置（10 spec + axe-core；chrome project 走 dev 5173，preview project 走 vite preview 4173 跑 offline）
- React "Invalid hook call" 已修复（Vite 8 预打包重复 react chunk；`resolve.dedupe`）
- 207 个单测通过，dev/preview 页面均正常渲染、无 console 错误
- E2E 31 个用例全部通过（10 个选择器冲突/PWA 离线用例已修）
- typecheck / ESLint 无错误，build 成功
- 最近提交：9a5f954 + 2c0b999 + 31f9d61 + db43554 + 3ea681c + c7baf3e + 86f0415

## 未完成任务

- 真实设备性能验证（Base64/哈希大输入、Worker 超时、PWA 离线）
- Cloudflare Pages 部署配置与验证（CSP / 安全响应头）

## 已知坑 / 决策记录

- vite-plugin-pwa 2.0 dev 模式 SW 注册链失效（dev-sw.js 不激活），offline E2E 走 preview project（2026-11-18）
- 侧边栏 5 li + 主区「工具目录」双位置链接，E2E 选择器需限定 `main` 区域（2026-11-18）
- Vite 8 + Rolldown 预打包曾把 react 拆成两个 chunk，
  导致 react-dom 与 react-router 拿到不同 React 实例（useRef null）。
  修复：`resolve.dedupe: ['react', 'react-dom']`（vite + vitest），dev/prod 均生效
- 降级 react-router 到 7.13.0 引入 cookie 模块导出不兼容，已恢复 7.18.5
- optimizeDeps.exclude react-router 导致 cookie 加载失败，已移除该配置
- 曾误以为 prod build 独有 useRef bug；实际同一双 React 实例问题，dedupe 后 preview 正常
- jsdom 缺 crypto.subtle：test/setup.ts 用 Node webcrypto polyfill
- jsdom warning 与 YAMLWarning 不兼容：yaml 自定义 tag 测试改断言 error 已定义
- vitest 5.1.0 forks pool bug → pool: 'vmThreads'
- worker-base 每任务独立 Worker，超时/取消后不复用，task.id 防旧结果覆盖

## 关键文件指引

- PRD：docs/PRD.md
- 工具注册中心：src/tools/registry/tools.ts
- 工具目录页：src/features/tools/index.tsx（注册中心数据驱动）
- 搜索：src/features/search/；Stores：src/stores/
- Worker：src/lib/worker/
- E2E：e2e/（10 spec + pages.ts）；offline.spec.ts 走 preview project（vite preview 4173，需先 build）；playwright.config.ts 双 project
- 侧边栏 5 个 li（主导航）会污染全局 `li`/`ul li a` 计数，选择器需限定到 `main` 区域
- i18n：src/i18n/locales/
- 设计规格：docs/superpowers/specs/

## 常用操作速记

- 上下文 ~70% 主动 /compact；收尾跑 /wrapup
- 验证：npm run lint、npm run typecheck、npm run test、npm run build
- E2E：npm run test:e2e（31/31 通过；offline 用例需先 npm run build，再走 preview project）
