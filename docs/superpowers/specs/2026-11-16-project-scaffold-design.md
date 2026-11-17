# 工程骨架初始化设计

> 日期：2026-11-16
> 范围：CLAUDE.md §13 首次初始化任务
> 需求依据：docs/PRD.md、DESIGN.md

## 意图与原因

DevBench 目前只有文档，没有任何代码。20 个工具的实现都依赖统一的工程基础设施：
构建工具、TypeScript 类型系统、样式系统、路由、i18n、状态管理、测试脚手架。
本任务建立这些基础设施，使后续工具开发可以并行推进，不需要重复搭建。

## 目标

- 建立可运行的 Vite + React + TypeScript 工程骨架
- 按 PRD §9.3 建立目录结构
- 建立工具注册中心类型定义（6 分类、20 工具 ID）
- 配置基础路由（7 个路由）
- 配置主题基础设施（data-theme + CSS Variables，DESIGN.md §2 色值）
- 配置 i18n 基础设施（i18next，zh-CN 默认）
- 建立 Zustand PreferencesStore 骨架（主题 + 语言）
- 建立 ESLint + Prettier + Vitest + React Testing Library 测试脚手架
- 配置 vite-plugin-pwa（Workbox 基础缓存策略）
- 建立工程文档骨架（README、LICENSE、.gitignore、.env.example）
- 验证：lint、typecheck、test、build 全部通过

## 非目标

- 不实现 20 个工具的核心逻辑和页面
- 不实现全局搜索功能
- 不实现收藏、最近使用功能
- 不建立 Playwright E2E 完整测试
- 不执行 Cloudflare Pages 部署验证

## 实现方案

### 依赖清单

| 依赖 | 用途 | 是否初始化阶段引入 |
|---|---|---|
| react / react-dom | UI 框架 | 是 |
| typescript | 类型系统 | 是 |
| vite / @vitejs/plugin-react | 构建工具 | 是 |
| tailwindcss / @tailwindcss/vite | 样式系统 | 是 |
| @radix-ui/react-dialog、react-tooltip、react-dropdown-menu 等 | 无障碍基础组件 | 是（按需） |
| zustand | 全局轻量状态 | 是 |
| react-router-dom | 路由 | 是 |
| i18next / react-i18next | 国际化 | 是 |
| date-fns | 日期处理 | 是（工具实现阶段才用） |
| @codemirror/* | 代码编辑器 | 否（按需加载，工具实现阶段再引入） |
| vitest / @testing-library/react / jsdom | 单元测试 | 是 |
| @playwright/test | E2E | 否（留占位，后续配置） |
| vite-plugin-pwa / workbox | PWA | 是 |
| eslint / prettier / @typescript-eslint | 代码质量 | 是 |
| axe-core | 无障碍 | 是（测试依赖） |

### 目录结构（PRD §9.3）

```
src/
├── app/            App.tsx, router.tsx, providers/
├── components/
│   ├── layout/     AppShell, Sidebar, TopBar, MainContent
│   ├── navigation/ NavItem, CategoryNav, Breadcrumb
│   ├── search/     GlobalSearch, SearchResults
│   ├── common/     EmptyState, Toast
│   ├── editor/     TextInput, Textarea, CodeEditor, InputSizeIndicator
│   ├── feedback/   ErrorMessage, LoadingState, ConfirmDialog
│   └── ui/         Button, Input, Card, Badge, ...
├── features/
│   ├── home/
│   ├── tools/
│   ├── favorites/
│   ├── recent/
│   └── privacy/
├── tools/
│   ├── registry/   工具注册中心（类型 + 元数据 + 校验）
│   ├── data/
│   ├── datetime/
│   ├── encoding/
│   ├── generator/
│   ├── http/
│   └── text/
├── stores/
│   ├── preferences-store.ts
│   ├── favorites-store.ts
│   └── recent-tools-store.ts
├── hooks/
├── i18n/
├── lib/
│   ├── storage/
│   ├── security/
│   ├── worker/
│   └── utils/
├── styles/
│   ├── tokens.css
│   └── themes.css
├── types/
└── main.tsx
```

### 关键设计决策

1. **工具注册中心**：`src/tools/registry/` 下定义 `ToolDefinition`、`ToolCategory` 类型
   （与 PRD §8.3 一致），以及 20 个工具 ID 和 6 个分类的常量。
   校验逻辑（ID 唯一、分类存在、relatedTools 合法等）在测试中执行。
   初始化阶段只建类型和常量，不建具体工具元数据（工具实现阶段补）。

2. **i18n**：`i18next` + `react-i18next`。
   初始化阶段建 `src/i18n/index.ts`，配置 `zh-CN`（默认）和 `en-US` 两个语言资源。
   语言资源按 `src/i18n/locales/{locale}.json` 组织。

3. **主题**：`data-theme="light" | "dark"` 属性挂在 `<html>` 上。
   `tokens.css` 定义两套 CSS Variables（DESIGN.md §2.2 色值）。
   `PreferencesStore` 持久化主题选择到 LocalStorage（键名 `devbench.preferences.theme`）。
   首次加载时读取 LocalStorage，失败则默认 light。

4. **PWA**：`vite-plugin-pwa` + `registerType: 'prompt'`。
   初始化阶段配置基础缓存策略（HTML Network First、JS/CSS Cache First），
   完整离线验证在工具实现完成后执行。

5. **路由**：`react-router-dom` v6，初始化阶段建立 7 个路由，
   工具页面用 `<Outlet />` 占位，工具详情路由暂时渲染"工具尚未实现"提示。

### 验证命令

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

### 不做的事

- 不写 20 个工具的具体元数据（`registry/tools.ts` 只定义类型和分类常量，工具条目在实现阶段逐个补入）
- 不写全局搜索逻辑
- 不写收藏/最近使用的业务逻辑（只建 store 类型骨架）
- 不配置 Playwright
- 不配置 Cloudflare Pages（`wrangler` 配置文件留待部署阶段）

## 风险

- `vite-plugin-pwa` 与 `jsdom` 测试环境的 Service Worker 模拟可能产生警告，需在 Vitest 配置中静默
- Tailwind CSS 4.x 与 React 19 的兼容性需确认（选用稳定兼容版本）
- `axe-core` 初始化阶段不运行，只装依赖，不影响构建

## 下一步

设计文档批准后，调用 `writing-plans` 技能拆分为可执行步骤，然后逐步实施。
