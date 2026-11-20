# 会话交接（Handoff）

> 规则：每个会话结束前（或 PreCompact 时）更新本文件；新会话第一步读它。保持 ≤ 60 行，超长就压缩/归档旧条目。细节沉淀到 ~/.claude/projects/f--Code-github-DevBench/memory/，本文件只留指针。

## 当前状态

- 全部 20 个工具已实现；全局搜索、收藏/最近使用、工具目录页、图标体系（lucide-react + DevBenchLogo + icon-map.ts）均已落地
- hash/regex 接入 Web Worker（worker-base，每任务独立 Worker，task.id 防旧结果覆盖）
- 226 单测通过；Playwright E2E 已配置（10 spec + axe-core，chrome 走 dev 5173，preview 走 vite preview 4173 跑 offline）
- CodeMirror 暗色行号列背景已修复（src/styles/index.css CSS 变量对齐 tokens，双主题通用）
- Cloudflare Pages 安全响应头 + CSP 已配置（public/_headers + public/_redirects，随构建进 dist）

### 2026-11-20 本轮修复
- test-data-generator 浏览器崩溃：core.ts 误 `import crypto from "crypto"`，Vite externalize 成空对象致运行时 TypeError；改用全局 Web Crypto
- http-status-codes：① 分组 key 拼成 "200x" 与 CATEGORIES 的 "2xx" 不一致致列表整组不渲染（真 bug）；② 搜索改按类别前缀匹配（2/20/200/2xx 显示整组，404 精确排首+同组），加「匹配 N 条」反馈
- hash-generator 交互：不传 `processing` 给 ToolActionBar 避免按钮闪 "..."；复制成功/失败 status/alert 反馈
- 全工具复制反馈统一：ToolResultPanel 的 `onCopy` 改造为组件内管理 `copied`/`copyError`（json-formatter 自动获益）；random-string-generator 加 `copied` 文案切换

## 未完成任务

- 真实设备性能验证（Base64/哈希大输入、Worker 超时、PWA 离线）
- **上线 Cloudflare Pages 后** `curl -I https://<project>.pages.dev` 核验 CSP/安全响应头实际生效（本地模拟仅近似）
- SECURITY.md 文档骨架（PRD §12 要求，尚未创建）

## 已知坑 / 决策记录（细节见 memory）

- Cloudflare Pages 安全头：`public/_headers`/`_redirects` 是 Pages 专有，`vite preview` 不应用；CSP `script-src 'unsafe-inline'` 因 index.html 首屏防主题闪烁内联脚本；本地验证用临时 Node 静态服务器解析 dist/_headers，勿误以为 `vite preview` 能测响应头
- CodeMirror 暗色行号列：`@codemirror/view` 默认 gutter 背景硬编码 `#f5f5f5`，暗色下与 `--color-surface-muted` 不搭；在 src/styles/index.css 用 CSS 变量覆盖
- 图标体系：lucide-react 唯一图标库；icon 字符串经 src/ui/icon-map.ts 映射，加新工具须同步该表
- vitest：误扫 e2e/ 致 TransformStream is not defined（include 限定 src 修复）；5.1.0 forks pool bug → pool vmThreads；jsdom 缺 crypto.subtle（test/setup.ts 用 Node webcrypto polyfill）；vmThreads 下 `import.meta.url` 非 file 协议，静态断言用 `process.cwd()` 拼路径
- E2E：残留 vite 占 4173/5173 致 offline 连接被拒（DEV_PORT/PREVIEW_PORT env 绕开）；vite-plugin-pwa 2.0 dev 模式 SW 不激活，offline 走 preview project；侧边栏 5 li + 主区「工具目录」双位置链接，选择器需限定 `main` 区域
- Vite 8 + Rolldown 预打包曾把 react 拆两个 chunk 致 Invalid hook call；修复 `resolve.dedupe: ['react','react-dom']`（vite + vitest）；降级 react-router 7.13.0 致 cookie 导出不兼容已回 7.18.5
- worker-base 每任务独立 Worker，超时/取消后不复用，task.id 防旧结果覆盖；组件测试 mock `?worker` 时须回显 `data.id`（全局 taskId 递增，hardcode 会被丢弃）
- 浏览器代码禁止 `import ... from "crypto"` / `"node:crypto"`：Vite externalize 成空对象，运行时调用其方法抛 TypeError；一律用全局 Web Crypto。Node 22+ 全局也有 `crypto`，单测在 Node 下复现不了浏览器问题，故 test-data-generator 加静态断言 `源码不含 from "crypto"` 防回归
- PowerShell 从 bash 调用：`$_` 被 shell 吞；写 .ps1 文件 + 具名变量，属性访问 `$c.OwningProcess` 不写 `$c .OwningProcess`

## 关键文件指引

- PRD：docs/PRD.md；设计规格：DESIGN.md §2.9 / docs/superpowers/specs/
- 工具注册中心：src/tools/registry/tools.ts（icon 字符串）；图标映射：src/ui/icon-map.ts + ToolIcon.tsx；品牌 logo：src/ui/DevBenchLogo.tsx
- public：favicon.svg、icon-192.svg、icon-512.svg、manifest.webmanifest
- 工具目录页：src/features/tools/index.tsx（注册中心数据驱动）；搜索：src/features/search/；Stores：src/stores/
- Worker：src/lib/worker/；E2E：e2e/（10 spec + pages.ts）；playwright.config.ts 双 project + DEV_PORT/PREVIEW_PORT override
- vitest：vitest.config.ts（include 限定 src，pool vmThreads）；i18n：src/i18n/locales/

## 常用操作速记

- 上下文 ~70% 主动 /compact；收尾跑 /wrapup
- 验证：npm run lint、npm run typecheck、npm run test、npm run build
- E2E：npm run test:e2e（offline 需先 build；端口占用时 `PREVIEW_PORT=4175 npx playwright test`）