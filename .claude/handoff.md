# 会话交接（Handoff）

> 规则：每个会话结束前（或 PreCompact 时）更新本文件；新会话第一步读它。保持 ≤ 60 行，超长就压缩/归档旧条目。

## 当前状态

- 全部 20 个工具已实现
- 全局搜索已实现（/search 路由，Ctrl+K，注册中心数据驱动）
- 收藏/最近使用已实现（LocalStorage 持久化）
- 图标体系已落地：lucide-react 唯一图标库；品牌 logo（DevBenchLogo）+ favicon + PWA 192/512（含 maskable）；工具/分类 icon 字符串经 src/ui/icon-map.ts 映射；侧栏/顶栏/工具卡片/收藏页全部去 emoji 化（2026-11-18）
- docs（architecture/DESIGN §2.9）已对齐图标实现
- hash/regex 工具已接入 Web Worker（worker-base 重写，每任务独立 Worker）
- 工具目录页已补齐（6 分类 + 20 工具卡片，注册中心数据驱动）
- Playwright E2E 已配置（10 spec + axe-core；chrome project 走 dev 5173，preview project 走 vite preview 4173 跑 offline；支持 DEV_PORT/PREVIEW_PORT env 绕开端口占用）
- React "Invalid hook call" 已修复（Vite 8 预打包重复 react chunk；`resolve.dedupe`）
- vitest 排除 e2e/ 目录（include 限定 src，避免误扫 playwright spec）
- 207 个单测通过，dev/preview 页面均正常渲染、无 console 错误
- E2E 31 用例通过（状态依赖用例全量序列偶发残留状态影响，单独重跑即过；非回归）
- typecheck / ESLint 无错误，build 成功

## 未完成任务

- 真实设备性能验证（Base64/哈希大输入、Worker 超时、PWA 离线）
- Cloudflare Pages 部署配置与验证（CSP / 安全响应头）

## 已知坑 / 决策记录

- 图标体系（2026-11-18）：lucide-react 唯一图标库；icon 字符串经 src/ui/icon-map.ts 映射，加新工具须同步该表；品牌 logo 与 public 三个 SVG 保持一致
- vitest 误扫 e2e/（2026-11-18）：npm test 报 TransformStream is not defined 是扫到 playwright spec，include 限定 src 修复，勿误诊 jsdom
- E2E 端口占用（2026-11-18）：残留 vite 占 4173/5173 致 offline 连接被拒；DEV_PORT/PREVIEW_PORT env 绕开；全量序列状态依赖用例（收藏/最近使用/语言）偶发残留状态影响，重跑对应 spec 即可
- PowerShell 从 bash 调用（2026-11-18）：`$_` 被 shell 吞；写 .ps1 文件 + 具名变量，属性访问 `$c.OwningProcess` 不写 `$c .OwningProcess`
- vite-plugin-pwa 2.0 dev 模式 SW 注册链失效（dev-sw.js 不激活），offline E2E 走 preview project（2026-11-18）
- 侧边栏 5 li + 主区「工具目录」双位置链接，E2E 选择器需限定 `main` 区域（2026-11-18）
- Vite 8 + Rolldown 预打包曾把 react 拆两个 chunk → react-dom 与 react-router 不同 React 实例（useRef null / Invalid hook call）；修复 `resolve.dedupe: ['react','react-dom']`（vite + vitest），dev/prod 均生效。降级 react-router 7.13.0 曾致 cookie 导出不兼容已回 7.18.5；optimizeDeps.exclude react-router 致 cookie 加载失败已移除
- jsdom 缺 crypto.subtle：test/setup.ts 用 Node webcrypto polyfill
- jsdom warning 与 YAMLWarning 不兼容：yaml 自定义 tag 测试改断言 error 已定义
- vitest 5.1.0 forks pool bug → pool: 'vmThreads'
- worker-base 每任务独立 Worker，超时/取消后不复用，task.id 防旧结果覆盖

## 关键文件指引

- PRD：docs/PRD.md
- 工具注册中心：src/tools/registry/tools.ts（icon 字符串）
- 图标映射：src/ui/icon-map.ts + src/ui/ToolIcon.tsx；品牌 logo：src/ui/DevBenchLogo.tsx
- public：favicon.svg、icon-192.svg、icon-512.svg、manifest.webmanifest
- 工具目录页：src/features/tools/index.tsx（注册中心数据驱动）
- 搜索：src/features/search/；Stores：src/stores/
- Worker：src/lib/worker/
- E2E：e2e/（10 spec + pages.ts）；offline.spec.ts 走 preview project（vite preview 4173，需先 build）；playwright.config.ts 双 project + DEV_PORT/PREVIEW_PORT override
- vitest：vitest.config.ts（include 限定 src，pool vmThreads）
- i18n：src/i18n/locales/
- 设计规格：docs/superpowers/specs/；图标规范：DESIGN.md §2.9

## 常用操作速记

- 上下文 ~70% 主动 /compact；收尾跑 /wrapup
- 验证：npm run lint、npm run typecheck、npm run test、npm run build
- E2E：npm run test:e2e（offline 需先 build；端口占用时 `PREVIEW_PORT=4175 npx playwright test`）
