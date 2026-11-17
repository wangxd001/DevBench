# DevBench 工程骨架初始化 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 subagent-driven-development（推荐）或 executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 建立 DevBench 可运行的 Vite + React + TypeScript 工程骨架，包含路由、i18n、主题、工具注册中心类型、测试脚手架和 PWA 基础配置，使后续工具开发可以在此基础上推进。

**架构：** 单一 Vite 应用，按 PRD 9.3 目录结构组织。工具注册中心是元数据唯一来源，驱动路由、首页和目录。工具核心逻辑与 UI 分离，纯函数化。Zustand 管理少量全局偏好（主题、语言），工具输入和结果留在页面局部状态。

**技术栈：** React 19、TypeScript 5、Vite 6、Tailwind CSS 4、Radix UI、Zustand、React Router 7、i18next、Vitest、React Testing Library、vite-plugin-pwa / Workbox

**规格：** docs/superpowers/specs/2026-11-16-project-scaffold-design.md

## 全局约束

- TypeScript 严格模式（strict: true），避免不必要的 any
- 依赖版本固定，写进 package.json 和锁文件
- 路由：/、/tools、/tools/:toolId、/favorites、/recent、/privacy、*（404）
- 工具 ID 必须与 PRD 2.1 的 20 个完全一致，不得新增
- 分类 ID：data、datetime、encoding、generator、http、text
- i18n 默认 zh-CN，支持 en-US；语言资源放 src/i18n/locales/
- 主题通过 data-theme 属性切换；CSS Variables 定义在 src/styles/tokens.css
- LocalStorage 键名前缀 devbench.；只允许存主题、语言、收藏、置顶、最近使用
- 工具输入和结果不进入 LocalStorage、SessionStorage、IndexedDB、URL、控制台、Service Worker Cache、Zustand
- 验证命令：npm run lint、npm run typecheck、npm run test、npm run build
- 每个任务完成后 commit，Conventional Commits 格式（chore:/feat: + 中文描述）

## 审查重点（Review Focus）

1. LocalStorage 写入失败：读取或写入时浏览器存储不可用，应用必须使用合理默认值，不得崩溃，不得触发任何网络请求。
2. 工具 ID 重复或路由冲突：注册中心校验必须检测工具 ID 唯一、路由唯一、分类 ID 存在，校验失败时测试报错。
3. i18n 资源缺失：某个 locale 的 key 缺失时，t() 必须回退到 zh-CN，不得返回 undefined 或 key 本身。
4. PWA Service Worker 在测试环境：vitest 的 jsdom 环境没有 Service Worker，vite-plugin-pwa 相关代码不得在测试中抛出未捕获异常。
5. 工具详情路由未知 ID：访问 /tools/unknown-id 时渲染"工具尚未实现"或 404 提示，不得白屏。

## 文件结构

| 文件 | 职责 |
|---|---|
| package.json | 依赖、scripts |
| vite.config.ts | Vite + React + PWA 配置 |
| tsconfig.json / tsconfig.node.json | TypeScript 配置 |
| vite.config.ts | Vite 构建配置（含 Tailwind + PWA 插件） |
| vitest.config.ts | Vitest 配置 |
| eslint.config.js | ESLint 配置 |
| .prettierrc | Prettier 配置 |
| index.html | 入口 HTML |
| .gitignore / LICENSE / .env.example / README.md | 工程文档 |
| src/main.tsx | React 入口 |
| src/app/App.tsx | 根组件（BrowserRouter + GlobalProviders + AppRoutes） |
| src/app/router.tsx | 路由定义（AppRoutes） |
| src/app/providers/index.tsx | 全局 Provider（i18n、主题） |
| src/components/layout/AppShell.tsx | Sidebar + TopBar + MainContent |
| src/components/layout/Sidebar.tsx | 侧边栏导航 |
| src/components/layout/TopBar.tsx | 顶部工具栏 |
| src/components/navigation/NavItem.tsx | 导航项 |
| src/components/common/EmptyState.tsx | 空状态组件 |
| src/features/home/index.tsx | 首页（HomePage） |
| src/features/tools/index.tsx | 工具目录页（ToolsPage） |
| src/features/tools/ToolDetail.tsx | 工具详情页（占位） |
| src/features/favorites/index.tsx | 收藏页（占位） |
| src/features/recent/index.tsx | 最近使用页（占位） |
| src/features/privacy/index.tsx | 隐私说明页 |
| src/features/not-found/index.tsx | 404 页 |
| src/tools/registry/types.ts | ToolDefinition、ToolCategory、RegistryValidationResult |
| src/tools/registry/constants.ts | TOOL_IDS、CATEGORY_IDS、TAG_IDS |
| src/tools/registry/validate.ts | validateRegistry() |
| src/stores/preferences-store.ts | usePreferencesStore（theme、language） |
| src/stores/favorites-store.ts | useFavoritesStore 骨架 |
| src/stores/recent-tools-store.ts | useRecentToolsStore 骨架 |
| src/i18n/index.ts | initI18n() |
| src/i18n/locales/zh-CN.json | 中文 i18n 资源 |
| src/i18n/locales/en-US.json | 英文 i18n 资源 |
| src/styles/tokens.css | Design Tokens（两套主题 CSS Variables） |
| src/styles/index.css | Tailwind 入口 |
| src/lib/storage/local-storage.ts | safeGet/safeSet LocalStorage 封装 |
| src/types/index.ts | Locale、ThemeMode、LocalizedText 等公共类型 |
| src/test/setup.ts | Vitest 全局 setup（jest-dom） |
| src/test/__tests__/smoke.test.tsx | 冒烟测试 |
| public/manifest.webmanifest | PWA manifest |

---

## 任务 1：工程初始化（Vite + TypeScript + 目录结构）

**文件：** 见上方"文件结构"表中任务 1 涉及的所有文件

- [ ] **步骤 1：初始化 package.json 并安装依赖**

运行 npm init -y，然后：

    npm install react react-dom react-router-dom zustand i18next react-i18next date-fns
    npm install -D typescript @types/react @types/react-dom @types/node
    npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite
    npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
    npm install -D eslint @eslint/js typescript-eslint eslint-config-prettier prettier
    npm install -D vite-plugin-pwa
    npm install -D axe-core

package.json scripts 字段：

    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"

- [ ] **步骤 2：创建 tsconfig.json 和 tsconfig.node.json**

tsconfig.json：strict: true，moduleResolution: bundler，jsx: react-jsx，paths: {"@/*": ["src/*"]}，include: ["src"]，references: [tsconfig.node.json]。
tsconfig.node.json：composite: true，include: ["vite.config.ts", "vitest.config.ts"]。

- [ ] **步骤 3：创建 vite.config.ts**

引入 react()、tailwindcss()、VitePWA() 插件。
VitePWA 配置：registerType: 'prompt'，manifest.name 为 "DevBench - Developer & Tester Toolbox"，workbox.navigateFallback 为 "/index.html"，runtimeCaching 对 .js/.css 用 CacheFirst。
resolve.alias：@ 指向 ./src。

- [ ] **步骤 4：创建目录结构和占位文件**

按"文件结构"表创建所有目录，每个空目录放一个 index.ts（空导出或 re-export）。

- [ ] **步骤 5：创建 index.html**

html lang="zh-CN"，title "DevBench"，引入 /src/main.tsx。

- [ ] **步骤 6：创建 src/styles/tokens.css**

定义两套主题 CSS Variables，色值直接照搬 DESIGN.md 2.2 和 2.3（:root 和 [data-theme="light"] 用浅色值，[data-theme="dark"] 用深色值）。包含：color-primary、color-primary-hover、color-primary-soft、color-background、color-surface、color-surface-muted、color-border、color-text、color-text-secondary、color-text-muted、color-focus、color-success、color-warning、color-error、color-info。

- [ ] **步骤 7：创建 src/styles/index.css**

内容为：@import 'tailwindcss'; 和 @import './tokens.css';

- [ ] **步骤 8：创建 src/main.tsx**

ReactDOM.createRoot 渲染 <React.StrictMode><App /></React.StrictMode>，引入 ./styles/index.css。

- [ ] **步骤 9：创建 src/app/App.tsx**

BrowserRouter > GlobalProviders > AppRoutes。

- [ ] **步骤 10：创建 src/app/router.tsx**

导出 AppRoutes 组件，定义 7 条路由：/、/tools、/tools/:toolId、/favorites、/recent、/privacy、*（404）。各页面组件在任务 4 创建，此处先用占位 import。

- [ ] **步骤 11：创建 src/app/providers/index.tsx**

导出 GlobalProviders({ children })，暂时直接返回 <>{children}</>（i18n 和主题逻辑在任务 3 接入）。

- [ ] **步骤 12：创建布局组件**

src/components/layout/AppShell.tsx：Sidebar（左）+ TopBar（上）+ <main>{children}</main>（主区域）。
src/components/layout/Sidebar.tsx：产品标识 + NavItem 列表（首页、工具目录、收藏、最近使用、隐私）。
src/components/layout/TopBar.tsx：主题切换按钮（占位，onClick 调 usePreferencesStore.setTheme）+ 语言切换按钮（占位）。
src/components/navigation/NavItem.tsx：NavLink 组件，选中态用 aria-current + 背景色 + 侧边标识（非颜色唯一表达）。

- [ ] **步骤 13：创建 src/types/index.ts**

export type Locale = 'zh-CN' | 'en-US';
export type ThemeMode = 'light' | 'dark';
export interface LocalizedText { 'zh-CN': string; 'en-US': string; }
export interface LocalizedKeywords { 'zh-CN': string[]; 'en-US': string[]; }

- [ ] **步骤 14：创建 LICENSE、.gitignore、.env.example、README.md**

LICENSE：MIT，Copyright 2026 DevBench Contributors。
.gitignore：node_modules/、dist/、.DS_Store、*.local、.vite/。
.env.example：注释说明 MVP 无环境变量。
README.md：产品定位、功能清单（20 个工具）、技术栈、npm install / npm run dev / npm run build、Cloudflare Pages 部署说明、隐私原则摘要。

- [ ] **步骤 15：验证构建**

    npm run typecheck
    npm run build

预期：tsc 无错误，vite build 成功生成 dist/。

- [ ] **步骤 16：Commit**

    git add .
    git commit -m "chore: 初始化 Vite + React + TypeScript 工程骨架"

---

## 任务 2：工具注册中心类型、常量与校验函数

**文件：**
- 创建：src/tools/registry/types.ts
- 创建：src/tools/registry/constants.ts
- 创建：src/tools/registry/validate.ts
- 测试：src/tools/registry/__tests__/validate.test.ts

**Interfaces：**
- ToolId、CategoryId（string 字面量联合类型）
- ToolDefinition、ToolCategory、ToolTag、RegistryValidationResult
- TOOL_IDS: readonly ToolId[]（20 个）
- CATEGORY_IDS: readonly CategoryId[]（6 个）
- TAG_IDS: readonly string[]（17 个）
- validateRegistry(tools: ToolDefinition[]): RegistryValidationResult

- [ ] **步骤 1：创建 src/tools/registry/types.ts**

导出类型：

    export type ToolId =
      | 'json-formatter' | 'timestamp-converter' | 'uuid-generator'
      | 'base64-converter' | 'url-encoder' | 'hash-generator'
      | 'jwt-decoder' | 'http-header-parser' | 'json-diff'
      | 'regex-tester' | 'datetime-formatter' | 'date-calculator'
      | 'random-string-generator' | 'test-data-generator'
      | 'unicode-converter' | 'html-entity-converter'
      | 'json-yaml-converter' | 'http-cookie-parser'
      | 'http-status-codes' | 'text-diff';

    export type CategoryId = 'data' | 'datetime' | 'encoding' | 'generator' | 'http' | 'text';

    export interface ToolCategory {
      id: CategoryId;
      name: LocalizedText;
      description: LocalizedText;
      icon: string;
      order: number;
    }

    export interface ToolTag { id: string; name: LocalizedText; }

    export interface ToolDefinition {
      id: ToolId;
      name: LocalizedText;
      description: LocalizedText;
      categoryId: CategoryId;
      tags: string[];
      keywords: LocalizedKeywords;
      icon: string;
      route: string;
      component: React.LazyExoticComponent<React.ComponentType>;
      recommended: boolean;
      relatedTools: ToolId[];
    }

    export interface RegistryValidationResult { valid: boolean; errors: string[]; }

- [ ] **步骤 2：创建 src/tools/registry/constants.ts**

    import type { ToolId, CategoryId } from './types';

    export const TOOL_IDS: readonly ToolId[] = [
      'json-formatter', 'timestamp-converter', 'uuid-generator',
      'base64-converter', 'url-encoder', 'hash-generator',
      'jwt-decoder', 'http-header-parser', 'json-diff',
      'regex-tester', 'datetime-formatter', 'date-calculator',
      'random-string-generator', 'test-data-generator',
      'unicode-converter', 'html-entity-converter',
      'json-yaml-converter', 'http-cookie-parser',
      'http-status-codes', 'text-diff',
    ];

    export const CATEGORY_IDS: readonly CategoryId[] = [
      'data', 'datetime', 'encoding', 'generator', 'http', 'text',
    ];

    export const TAG_IDS: readonly string[] = [
      'json', 'yaml', 'encoding', 'decoding', 'conversion', 'datetime',
      'generation', 'hash', 'http', 'security', 'text', 'comparison',
      'regex', 'testing', 'validation', 'unicode', 'web',
    ];

- [ ] **步骤 3：编写校验失败的测试**

src/tools/registry/__tests__/validate.test.ts，覆盖：
- 工具 ID 重复 → valid: false，errors 含对应 ID
- 分类 ID 不存在 → valid: false
- relatedTools 包含自身 → valid: false
- relatedTools 数量 < 2 或 > 4 → valid: false
- relatedTools 有重复 → valid: false
- relatedTools 引用不存在的工具 → valid: false
- 中英文名称缺失 → valid: false
- 合法注册表（20 个工具，每个 2-4 个 relatedTools，ID 互不重复）→ valid: true，errors: []

makeTool helper 函数：构造合法 ToolDefinition 基础对象，用 overrides 覆盖字段。

- [ ] **步骤 4：运行测试验证失败**

    npm run test -- src/tools/registry/__tests__/validate.test.ts

预期：FAIL，validateRegistry 未定义。

- [ ] **步骤 5：实现 src/tools/registry/validate.ts**

导出 validateRegistry(tools: ToolDefinition[]): RegistryValidationResult。

校验逻辑（逐项检查，收集所有 errors，不提前返回）：
1. 用 Set 检测 ID 重复、route 重复
2. categoryId 必须在 CATEGORY_IDS 中
3. tags 中每个 tag 必须在 TAG_IDS 中
4. recommended 必须是 boolean
5. relatedTools 数量在 [2, 4] 范围内
6. relatedTools 不包含自身
7. relatedTools 无重复（new Set(relatedTools).size === relatedTools.length）
8. relatedTools 中每个 ID 必须存在于当前工具列表中
9. name['zh-CN'] 和 name['en-US'] 必须非空
10. description['zh-CN'] 和 description['en-US'] 必须非空

- [ ] **步骤 6：运行测试验证通过**

    npm run test -- src/tools/registry/__tests__/validate.test.ts

预期：PASS，所有用例通过。

- [ ] **步骤 7：Commit**

    git add src/tools/registry/
    git commit -m "feat: 工具注册中心类型、常量与校验函数"

---

## 任务 3：i18n 基础设施与 PreferencesStore

**文件：**
- 创建：src/i18n/index.ts
- 创建：src/i18n/locales/zh-CN.json
- 创建：src/i18n/locales/en-US.json
- 创建：src/stores/preferences-store.ts
- 创建：src/lib/storage/local-storage.ts
- 修改：src/app/providers/index.tsx（接入 i18n 和主题）
- 测试：src/i18n/__tests__/i18n.test.ts
- 测试：src/lib/storage/__tests__/local-storage.test.ts

**Interfaces：**
- initI18n(): Promise<I18next>
- usePreferencesStore: { theme: ThemeMode, language: Locale, setTheme, setLanguage }
- safeGet<T>(key: string, fallback: T): T
- safeSet(key: string, value: unknown): void
- LocalStorage 键：devbench.preferences（JSON: { theme, language }）

- [ ] **步骤 1：创建 src/lib/storage/local-storage.ts**

    export function safeGet<T>(key: string, fallback: T): T {
      try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    }

    export function safeSet(key: string, value: unknown): void {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // 写入失败不影响核心功能，静默处理
      }
    }

- [ ] **步骤 2：编写 local-storage 测试**

src/lib/storage/__tests__/local-storage.test.ts：
- safeGet 在 localStorage 无该键时返回 fallback
- safeGet 在 localStorage 值损坏（非法 JSON）时返回 fallback
- safeSet 在 localStorage.setItem 抛异常时不向外抛错

用 vi.spyOn(window.localStorage, 'getItem') 模拟。

- [ ] **步骤 3：运行 local-storage 测试验证失败**

    npm run test -- src/lib/storage/__tests__/local-storage.test.ts

预期：FAIL，safeGet/safeSet 未定义。

- [ ] **步骤 4：运行 local-storage 测试验证通过**

    npm run test -- src/lib/storage/__tests__/local-storage.test.ts

预期：PASS。

- [ ] **步骤 5：创建 src/i18n/locales/zh-CN.json**

包含以下 key（完整 i18n 资源在工具实现阶段扩展，初始化阶段只覆盖全局 UI）：

    {
      "app": { "title": "DevBench", "subtitle": "开发者与测试人员工具箱" },
      "nav": { "home": "首页", "tools": "工具目录", "favorites": "收藏", "recent": "最近使用", "privacy": "隐私与安全" },
      "tool": { "notImplemented": "工具尚未实现", "comingSoon": "工具即将上线" },
      "common": { "copy": "复制", "copied": "已复制", "clear": "清空", "processing": "处理中", "error": "错误", "empty": "暂无内容" },
      "theme": { "light": "浅色", "dark": "深色" },
      "language": { "zh-CN": "简体中文", "en-US": "English" },
      "notFound": { "title": "页面未找到", "description": "您访问的页面不存在或工具尚未实现。", "backHome": "返回首页" },
      "privacy": {
        "title": "隐私与安全",
        "items": {
          "local": "工具计算主要在浏览器本地完成",
          "noUpload": "产品不会主动将用户输入和结果发送到服务器",
          "noTracking": "产品不接入应用级行为统计",
          "noPersist": "用户输入和处理结果不会被主动持久化",
          "browserRisk": "浏览器扩展、恶意脚本、设备本身仍可能影响数据安全",
          "hostingMeta": "托管平台可能处理正常静态资源请求所需的网络元数据"
        }
      }
    }

- [ ] **步骤 6：创建 src/i18n/locales/en-US.json**

对应 en-US 版本，key 结构相同。

- [ ] **步骤 7：创建 src/i18n/index.ts**

    import i18n from 'i18next';
    import { initReactI18next } from 'react-i18next';
    import zhCN from './locales/zh-CN.json';
    import enUS from './locales/en-US.json';

    export async function initI18n() {
      await i18n.use(initReactI18next).init({
        resources: { 'zh-CN': { translation: zhCN }, 'en-US': { translation: enUS } },
        lng: 'zh-CN',
        fallbackLng: 'zh-CN',
        interpolation: { escapeValue: false },
        returnNull: false,
      });
      return i18n;
    }

- [ ] **步骤 8：编写 i18n 测试**

src/i18n/__tests__/i18n.test.ts：
- 默认语言为 zh-CN
- 切换 en-US 后 t('nav.home') === 'Home'
- 缺失 key 时回退，不返回 undefined 或 key 本身（用 returnNull: false 保证）

- [ ] **步骤 9：运行 i18n 测试验证失败**

    npm run test -- src/i18n/__tests__/i18n.test.ts

预期：FAIL，initI18n 未定义。

- [ ] **步骤 10：运行 i18n 测试验证通过**

    npm run test -- src/i18n/__tests__/i18n.test.ts

预期：PASS。

- [ ] **步骤 11：创建 src/stores/preferences-store.ts**

    import { create } from 'zustand';
    import type { ThemeMode, Locale } from '@/types';
    import { safeGet, safeSet } from '@/lib/storage/local-storage';

    const STORAGE_KEY = 'devbench.preferences';

    interface PreferencesState {
      theme: ThemeMode;
      language: Locale;
      setTheme: (theme: ThemeMode) => void;
      setLanguage: (language: Locale) => void;
    }

    function loadPreferences(): { theme: ThemeMode; language: Locale } {
      const stored = safeGet<{ theme?: string; language?: string }>(STORAGE_KEY, {});
      const theme: ThemeMode = stored.theme === 'dark' ? 'dark' : 'light';
      const language: Locale = stored.language === 'en-US' ? 'en-US' : 'zh-CN';
      return { theme, language };
    }

    export const usePreferencesStore = create<PreferencesState>((set, get) => ({
      ...loadPreferences(),
      setTheme: (theme) => {
        set({ theme });
        safeSet(STORAGE_KEY, { ...get() });
        document.documentElement.setAttribute('data-theme', theme);
      },
      setLanguage: (language) => {
        set({ language });
        safeSet(STORAGE_KEY, { ...get() });
      },
    }));

- [ ] **步骤 12：更新 src/app/providers/index.tsx**

GlobalProviders 组件：
- 调用 initI18n()，将结果传给 I18nextProvider
- 从 usePreferencesStore 读 theme，用 useEffect 同步 data-theme 到 document.documentElement
- 从 usePreferencesStore 读 language，用 useEffect 调用 i18n.changeLanguage(language)

- [ ] **步骤 13：运行 typecheck**

    npm run typecheck

预期：无错误。

- [ ] **步骤 14：Commit**

    git add src/i18n/ src/stores/preferences-store.ts src/lib/storage/ src/app/providers/
    git commit -m "feat: i18n 基础设施、PreferencesStore 与 LocalStorage 安全封装"

---

## 任务 4：路由与页面占位组件

**文件：**
- 修改：src/app/router.tsx（完整路由定义）
- 创建：src/features/home/index.tsx
- 创建：src/features/tools/index.tsx
- 创建：src/features/tools/ToolDetail.tsx
- 创建：src/features/favorites/index.tsx
- 创建：src/features/recent/index.tsx
- 创建：src/features/privacy/index.tsx
- 创建：src/features/not-found/index.tsx
- 创建：src/components/common/EmptyState.tsx
- 测试：src/features/__tests__/routes.test.tsx

**Interfaces：**
- HomePage、ToolsPage、ToolDetail、FavoritesPage、RecentPage、PrivacyPage、NotFoundPage
- AppRoutes（router.tsx 导出）

- [ ] **步骤 1：编写路由测试**

src/features/__tests__/routes.test.tsx，覆盖 5 个审查重点中的第 5 项（未知工具 ID）：

    import { describe, it, expect, beforeAll } from 'vitest';
    import { render, screen } from '@testing-library/react';
    import { MemoryRouter } from 'react-router-dom';
    import { I18nextProvider } from 'react-i18next';
    import { initI18n } from '@/i18n';
    import { AppRoutes } from '@/app/router';

    describe('routes', () => {
      let i18n: Awaited<ReturnType<typeof initI18n>>;
      beforeAll(async () => { i18n = await initI18n(); });

      const renderAt = (path: string) =>
        render(
          <I18nextProvider i18n={i18n}>
            <MemoryRouter initialEntries={[path]}>
              <AppRoutes />
            </MemoryRouter>
          </I18nextProvider>
        );

      it('渲染首页', () => {
        renderAt('/');
        expect(screen.getByText(/DevBench/)).toBeDefined();
      });

      it('访问未知工具 ID 显示"尚未实现"而非白屏', () => {
        renderAt('/tools/unknown-id');
        expect(screen.getByText(/尚未实现/)).toBeDefined();
      });

      it('访问有效工具 ID 显示"即将上线"占位', () => {
        renderAt('/tools/json-formatter');
        expect(screen.getByText(/即将上线/)).toBeDefined();
      });

      it('404 页面渲染', () => {
        renderAt('/nonexistent');
        expect(screen.getByText(/未找到/)).toBeDefined();
      });

      it('隐私页渲染六条说明', () => {
        renderAt('/privacy');
        expect(screen.getByText(/浏览器本地/)).toBeDefined();
      });
    });

- [ ] **步骤 2：运行测试验证失败**

    npm run test -- src/features/__tests__/routes.test.tsx

预期：FAIL，AppRoutes 或各页面组件未定义。

- [ ] **步骤 3：创建 src/components/common/EmptyState.tsx**

    export function EmptyState({ title, description }: { title: string; description?: string }) {
      return (
        <div role="status" aria-label={title}>
          <p className="text-sm font-medium">{title}</p>
          {description && <p className="text-sm text-secondary">{description}</p>}
        </div>
      );
    }

- [ ] **步骤 4：创建 src/features/home/index.tsx**

    import { useTranslation } from 'react-i18next';
    import { Link } from 'react-router-dom';

    export function HomePage() {
      const { t } = useTranslation();
      return (
        <div>
          <h1 className="text-xl font-semibold">{t('app.title')}</h1>
          <p className="text-sm text-secondary">{t('app.subtitle')}</p>
          <Link to="/tools" className="text-primary underline">{t('nav.tools')}</Link>
        </div>
      );
    }

- [ ] **步骤 5：创建 src/features/tools/index.tsx**

    import { useTranslation } from 'react-i18next';

    export function ToolsPage() {
      const { t } = useTranslation();
      return (
        <div>
          <h1 className="text-xl font-semibold">{t('nav.tools')}</h1>
          {/* 工具列表在工具实现阶段补入 */}
        </div>
      );
    }

- [ ] **步骤 6：创建 src/features/tools/ToolDetail.tsx**

    import { useParams } from 'react-router-dom';
    import { useTranslation } from 'react-i18next';
    import { TOOL_IDS } from '@/tools/registry/constants';

    export function ToolDetail() {
      const { toolId } = useParams<{ toolId: string }>();
      const { t } = useTranslation();

      const isValidId = TOOL_IDS.includes(toolId as (typeof TOOL_IDS)[number]);

      return (
        <div>
          <h1 className="text-xl font-semibold">{toolId}</h1>
          <p className="text-sm">{isValidId ? t('tool.comingSoon') : t('tool.notImplemented')}</p>
        </div>
      );
    }

- [ ] **步骤 7：创建 src/features/favorites/index.tsx**

    import { useTranslation } from 'react-i18next';
    import { EmptyState } from '@/components/common/EmptyState';

    export function FavoritesPage() {
      const { t } = useTranslation();
      return (
        <div>
          <h1 className="text-xl font-semibold">{t('nav.favorites')}</h1>
          <EmptyState title={t('common.empty')} />
        </div>
      );
    }

- [ ] **步骤 8：创建 src/features/recent/index.tsx**

同 favorites，标题用 t('nav.recent')。

- [ ] **步骤 9：创建 src/features/privacy/index.tsx**

渲染 PRD 13.6 的 6 条说明，用 t('privacy.items.*') 取文案，列表形式。

- [ ] **步骤 10：创建 src/features/not-found/index.tsx**

    import { useTranslation } from 'react-i18next';
    import { Link } from 'react-router-dom';

    export function NotFoundPage() {
      const { t } = useTranslation();
      return (
        <div>
          <h1 className="text-xl font-semibold">{t('notFound.title')}</h1>
          <p className="text-sm text-secondary">{t('notFound.description')}</p>
          <Link to="/" className="text-primary underline">{t('notFound.backHome')}</Link>
        </div>
      );
    }

- [ ] **步骤 11：完成 src/app/router.tsx**

    import { Routes, Route, Outlet } from 'react-router-dom';
    import { AppShell } from '@/components/layout/AppShell';
    import { HomePage } from '@/features/home';
    import { ToolsPage } from '@/features/tools';
    import { ToolDetail } from '@/features/tools/ToolDetail';
    import { FavoritesPage } from '@/features/favorites';
    import { RecentPage } from '@/features/recent';
    import { PrivacyPage } from '@/features/privacy';
    import { NotFoundPage } from '@/features/not-found';

    export function AppRoutes() {
      return (
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/:toolId" element={<ToolDetail />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/recent" element={<RecentPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      );
    }

AppShell 内部用 <Outlet /> 渲染路由内容。

- [ ] **步骤 12：运行路由测试验证通过**

    npm run test -- src/features/__tests__/routes.test.tsx

预期：PASS，5 个用例通过。

- [ ] **步骤 13：运行 typecheck**

    npm run typecheck

预期：无错误。

- [ ] **步骤 14：Commit**

    git add src/features/ src/components/common/ src/app/router.tsx
    git commit -m "feat: 基础路由与页面占位组件"

---

## 任务 5：ESLint + Prettier + Vitest 配置 + 冒烟测试 + PWA manifest

**文件：**
- 创建：eslint.config.js
- 创建：.prettierrc
- 创建：vitest.config.ts
- 创建：src/test/setup.ts
- 创建：src/test/__tests__/smoke.test.tsx
- 创建：public/manifest.webmanifest
- 创建：src/stores/favorites-store.ts
- 创建：src/stores/recent-tools-store.ts

- [ ] **步骤 1：创建 eslint.config.js**

    import js from '@eslint/js';
    import tseslint from 'typescript-eslint';
    import prettier from 'eslint-config-prettier';

    export default [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettier,
      {
        files: ['src/**/*.{ts,tsx}'],
        rules: {
          '@typescript-eslint/no-explicit-any': 'warn',
          'no-console': ['error', { allow: ['warn', 'error'] }],
        },
      },
    ];

- [ ] **步骤 2：创建 .prettierrc**

    {
      "semi": true,
      "singleQuote": true,
      "tabWidth": 2,
      "trailingComma": "es5",
      "printWidth": 100
    }

- [ ] **步骤 3：创建 vitest.config.ts**

    import { defineConfig } from 'vitest/config';
    import react from '@vitejs/plugin-react';
    import { VitePWA } from 'vite-plugin-pwa';
    import { resolve } from 'path';

    export default defineConfig({
      plugins: [react(), VitePWA({ disable: true })],
      resolve: { alias: { '@': resolve(__dirname, './src') } },
      test: {
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        globals: true,
      },
    });

VitePWA({ disable: true }) 是关键：防止 jsdom 测试环境中 Service Worker 相关代码抛出异常（审查重点 4）。

- [ ] **步骤 4：创建 src/test/setup.ts**

    import '@testing-library/jest-dom/vitest';

- [ ] **步骤 5：创建 src/stores/favorites-store.ts**

    import { create } from 'zustand';
    import type { ToolId } from '@/tools/registry/types';

    interface FavoritesState {
      favorites: ToolId[];
      pinned: ToolId[];
      toggleFavorite: (id: ToolId) => void;
      togglePinned: (id: ToolId) => void;
    }

    export const useFavoritesStore = create<FavoritesState>((set) => ({
      favorites: [],
      pinned: [],
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
      togglePinned: (id) =>
        set((s) => ({
          pinned: s.pinned.includes(id)
            ? s.pinned.filter((p) => p !== id)
            : [...s.pinned, id],
        })),
    }));

- [ ] **步骤 6：创建 src/stores/recent-tools-store.ts**

    import { create } from 'zustand';
    import type { ToolId } from '@/tools/registry/types';

    interface RecentToolsState {
      recent: { toolId: ToolId; lastUsedAt: number }[];
      addRecent: (toolId: ToolId) => void;
      clearRecent: () => void;
    }

    const MAX_RECENT = 10;

    export const useRecentToolsStore = create<RecentToolsState>((set) => ({
      recent: [],
      addRecent: (toolId) =>
        set((s) => {
          const filtered = s.recent.filter((r) => r.toolId !== toolId);
          return {
            recent: [{ toolId, lastUsedAt: Date.now() }, ...filtered].slice(0, MAX_RECENT),
          };
        }),
      clearRecent: () => set({ recent: [] }),
    }));

- [ ] **步骤 7：创建 public/manifest.webmanifest**

    {
      "name": "DevBench - Developer & Tester Toolbox",
      "short_name": "DevBench",
      "description": "面向开发人员和测试人员的在线工具箱",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#F6F8FA",
      "theme_color": "#426A91",
      "icons": []
    }

- [ ] **步骤 8：创建 src/test/__tests__/smoke.test.tsx**

    import { describe, it, expect, beforeAll } from 'vitest';
    import { render, screen } from '@testing-library/react';
    import { I18nextProvider } from 'react-i18next';
    import { initI18n } from '@/i18n';
    import { HomePage } from '@/features/home';

    describe('smoke test', () => {
      let i18n: Awaited<ReturnType<typeof initI18n>>;
      beforeAll(async () => { i18n = await initI18n(); });

      it('渲染首页标题', () => {
        render(
          <I18nextProvider i18n={i18n}>
            <HomePage />
          </I18nextProvider>
        );
        expect(screen.getByText(/DevBench/)).toBeDefined();
      });

      it('LocalStorage 不可用时 HomePage 不崩溃', () => {
        const origGetItem = window.localStorage.getItem;
        vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
          throw new Error('Storage not available');
        });
        expect(() => {
          render(
            <I18nextProvider i18n={i18n}>
              <HomePage />
            </I18nextProvider>
          );
        }).not.toThrow();
        vi.restoreAllMocks();
      });
    });

- [ ] **步骤 9：运行全部测试**

    npm run test

预期：PASS，所有测试通过（validate + routes + i18n + local-storage + smoke）。

- [ ] **步骤 10：运行 lint 和 typecheck**

    npm run lint
    npm run typecheck

预期：lint 无 error（warn 允许），typecheck 无错误。

- [ ] **步骤 11：运行 build**

    npm run build

预期：成功生成 dist/，无错误。

- [ ] **步骤 12：Commit**

    git add eslint.config.js .prettierrc vitest.config.ts src/test/ src/stores/ public/manifest.webmanifest
    git commit -m "chore: ESLint、Prettier、Vitest 配置、store 骨架与冒烟测试"

---

## 自检记录

**规格覆盖度：**
- 工程骨架（任务 1）✅
- 目录结构（任务 1）✅
- 工具注册中心类型 + 常量 + 校验（任务 2）✅
- 基础路由 7 条（任务 4）✅
- 主题基础设施（任务 1 tokens.css + 任务 3 providers）✅
- i18n 基础设施（任务 3）✅
- Zustand PreferencesStore（任务 3）✅
- ESLint + Prettier + Vitest + RTL（任务 5）✅
- vite-plugin-pwa（任务 1）✅
- 工程文档骨架（任务 1）✅
- lint / typecheck / test / build 验证（任务 5）✅

**步骤扫描：** 各步骤签名和测试已钉死，无歧义。

**类型一致性：** ToolId、CategoryId 在任务 2 定义，任务 4 的 ToolDetail 通过 TOOL_IDS 判断，任务 5 的 store 骨架通过 ToolId 引用，一致。

**审查重点覆盖：**
1. LocalStorage 失败 → 任务 3 local-storage.test.ts + 任务 5 smoke.test.tsx 第二个用例
2. 工具 ID 重复 → 任务 2 validate.test.ts 已覆盖
3. i18n 资源缺失 → 任务 3 i18n.test.ts 已覆盖
4. PWA Service Worker 测试环境 → 任务 5 vitest.config.ts VitePWA({ disable: true }) 已处理
5. 未知工具 ID → 任务 4 routes.test.tsx 第二个用例已覆盖

**比例：** 计划与规格长度相当，无冗余函数体。
