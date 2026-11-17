# 架构说明（实施时持续更新）

> 本文是架构记录模板。具体实现必须与 `docs/PRD.md` 一致，不得将计划写成已完成事实。

## 1. 总体架构
纯前端 React + TypeScript + Vite Web 应用 / PWA，静态部署到 Cloudflare Pages。无后端业务服务、数据库、账号系统或云同步。

## 2. 技术栈
React、TypeScript、Vite、Tailwind CSS、Radix UI、Zustand、React Router、CodeMirror 6、Vitest、React Testing Library、Playwright、axe-core、vite-plugin-pwa、Workbox、date-fns；按需 date-fns-tz。

## 3. 模块边界
- **App / Router / Providers**：`src/app/`，含路由配置和 i18n provider
- **Layout**：`src/components/layout/`，AppShell、Sidebar、TopBar（含搜索入口）、ToolPageLayout
- **Features**：`src/features/`
  - `home`、`tools`（目录 + ToolDetail）、`search`（全局搜索，Ctrl+K）、`favorites`、`recent`、`privacy`、`not-found`
- **Tools**：`src/tools/`，registry（`tools.ts`、`types.ts`、`constants.ts`、`validate.ts`）及 6 个分类目录（data、datetime、encoding、generator、http、text），共 20 个工具
- **Stores**：`src/stores/`，`preferences-store`（主题/语言，LocalStorage 持久化）、`favorites-store`（收藏/置顶，LocalStorage 持久化）、`recent-tools-store`（最近使用，LocalStorage 持久化，最多 10 条）
- **Lib**：`src/lib/`，worker 基础设施
- **i18n**：`src/i18n/locales/`，zh-CN.json + en-US.json
- **Types**：`src/types/`，Locale、ThemeMode、LocalizedText、LocalizedKeywords

## 4. 工具注册中心
`src/tools/registry/tools.ts` 为工具元数据唯一来源。
- 驱动：路由（React Router lazy）、工具目录页、搜索（`searchTools` 纯函数）、收藏、最近使用、相关工具
- 校验：`validate.ts` 在测试中验证 ID 唯一、路由唯一、分类/标签存在、中英文名称完整、relatedTools 合法
- 禁止在多个页面重复维护工具清单

## 5. 状态和隐私边界
| Store | 持久化位置 | 内容 |
|---|---|---|
| `preferences-store` | LocalStorage `devbench.preferences` | 主题（light/dark）、语言（zh-CN/en-US） |
| `favorites-store` | LocalStorage `devbench.favorites` | 收藏工具 ID 列表、置顶工具 ID 列表 |
| `recent-tools-store` | LocalStorage `devbench.recent` | 最近使用工具（最多 10 条，含 toolId + lastUsedAt） |

**红线**：工具输入和处理结果只存在于 React 局部 state，不得进入任何 Store、LocalStorage、URL、日志、Service Worker Cache 或网络请求。

## 6. Worker
- `regex-tester`：当前实现为纯函数 `regexWorkerHandler`（`src/tools/text/regex-tester/`），未使用真实 Web Worker；生产环境性能需真实设备验证后再决定是否升级为 Worker 隔离。
- `hash-generator`：当前在主线程执行；Web Worker 隔离尚未实现。
- 其他工具是否使用 Worker 由真实性能测试决定。

## 7. PWA 与缓存
- 使用 `vite-plugin-pwa`（`registerType: 'prompt'`）
- Workbox 缓存策略：`navigateFallback: '/index.html'`，静态资源 `CacheFirst`（maxEntries: 100）
- Manifest icons：SVG（192x192、512x512），存放在 `public/icon-*.svg`
- 用户输入和结果绝不进入 Service Worker Cache
- 更新流程：用户确认刷新后应用新缓存，提示须说明刷新会清空当前工具输入和结果

## 8. 决策记录
| 日期 | 决策 | 背景 | PRD 依据 |
|---|---|---|---|
| 2026-11-17 | vitest.config.ts 配置 `pool: 'vmThreads'` | vitest 5.1.0 默认 forks pool 有 bug，测试收集失败 | - |
| 2026-11-17 | 全局搜索用独立路由 `/search` 而非 TopBar 内嵌下拉 | 移动端适配更自然，无结果目录入口易组织 | PRD §4.3 |
| 2026-11-17 | PWA manifest 用 SVG 图标 | 无 PNG 生成工具，SVG 在现代浏览器中受 manifest 支持 | - |
