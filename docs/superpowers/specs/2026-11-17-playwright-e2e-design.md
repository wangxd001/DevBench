# Playwright E2E 测试 + 工具目录页补齐

## 意图
PRD 19.4 要求最低 E2E 覆盖 8 个核心页面 + 10 个全局交互。当前无 Playwright，且工具目录页（`/tools`）是空壳（只有标题，无工具列表），E2E 无法断言"目录页可导航"。本次同时补齐目录页并搭建完整 E2E 场景集。

使用系统已安装的 Google Chrome（`channel: 'chrome'`），Playwright 不下载自带浏览器。

## 目标
1. 工具目录页 `/tools` 渲染注册中心 20 个工具，按 6 个分类分组，每个工具卡片含名称（随语言切换）、描述、路由链接
2. Playwright 基础设施：`@playwright/test` 依赖（不下载浏览器）、`playwright.config.ts`、`test:e2e` 脚本
3. E2E 场景（PRD 19.4 全覆盖）：
   - 页面：首页、工具目录、全局搜索、工具页、收藏、最近使用、隐私、404
   - 交互：主题切换、语言切换、收藏/取消收藏、置顶/取消置顶、最近使用、清空最近使用、页面刷新、直接访问工具路由、浏览器前进后退、离线访问
   - 无障碍：axe-core 自动扫描（每个核心页面）
4. 更新 `docs/testing-strategy.md` 对齐实际命令

## 非目标
- 不下载 Playwright 自带 Chromium/Firefox/WebKit（只配置 system Chrome channel）
- 不覆盖 20 个工具页各自的输入→结果交互（那是 20 个独立 spec，超出 PRD "至少"范围，留待后续）
- 不建 GitHub Actions（PRD 明确 MVP 不用）
- 不写 E2E 的视觉回归测试

## 约束
- E2E 跑在 `vite preview`（生产构建）上，符合 PRD "用静态服务器预览生产构建产物"
- axe-core 用 `@axe-core/playwright`（已适配 Playwright API，比手动注入 `axe-core` 包简单）
- 离线访问测试：先正常访问触发 PWA 缓存，再 `context.setOffline(true)` 重访，断言页面可达
- 隐私红线：E2E 中任何输入（搜索词、工具输入）不得断言其出现在 URL/LocalStorage（搜索词进 URL query 是设计行为，但工具输入不得）

## 实现方案（三选）
- A. 完整场景集（推荐，已选）：目录页 + 基础设施 + 全部 18 场景 + axe
- B. 仅基础设施 + 8 页面：工具链先通，交互/离线/axe 后续
- C. A + 20 工具 smoke：再加 20 个工具页各一个输入→结果断言

选 A 理由：一次满足 PRD 19.4"至少覆盖"全部；B 不完整；C 工作量翻倍且 20 工具交互已有单测覆盖核心逻辑。

## 文件变更

### 新增
| 文件 | 说明 |
|---|---|
| `src/features/tools/index.tsx` | 重写：渲染分类分组 + 工具卡片（数据来自 TOOLS） |
| `e2e/pages.ts` | Page Object：核心选择器与导航方法 |
| `e2e/home.spec.ts` | 首页：标题、副标题、导航到目录 |
| `e2e/tools.spec.ts` | 目录页：6 分类、20 工具卡片、点击进工具页 |
| `e2e/search.spec.ts` | 搜索：输入→结果、无结果→目录入口、Ctrl+K |
| `e2e/tool-page.spec.ts` | 工具页：直接路由、前进后退、刷新 |
| `e2e/favorites.spec.ts` | 收藏/置顶：切换、持久化、取消 |
| `e2e/recent.spec.ts` | 最近使用：进入记录、清空 |
| `e2e/privacy.spec.ts` | 隐私页：标题、6 条说明 |
| `e2e/not-found.spec.ts` | 404：未知路由、返回链接 |
| `e2e/theme.spec.ts` | 主题切换：浅/深切换、持久化 |
| `e2e/language.spec.ts` | 语言切换：zh/en 切换、文案变化 |
| `e2e/offline.spec.ts` | 离线：PWA 缓存后 setOffline 可达 |
| `e2e/a11y.spec.ts` | axe-core：每个核心页面扫描，断言无 critical 级违规 |
| `playwright.config.ts` | 配置：channel chrome、webServer（vite preview）、reporter |

### 修改
| 文件 | 变更 |
|---|---|
| `package.json` | devDeps 加 `@playwright/test`、`@axe-core/playwright`；scripts 加 `test:e2e`、`test:e2e:ui` |
| `docs/testing-strategy.md` | 对齐 `test:e2e` 命令与 Chrome channel 说明 |
| `.gitignore` | 加 `test-results/`、`playwright-report/` |
| `.claude/handoff.md` | 更新当前状态 |

## 工具目录页设计
- 数据源：`TOOLS`（注册中心），不硬编码
- 分组：按 `categoryId` 聚合，分类名从 i18n `nav.category.*` 取
- 卡片：工具名称（随 `language` 切换）+ 描述 + `Link to={route}`
- 空态：无（20 个工具固定存在）
- 无障碍：卡片用 `<nav>` 语义，链接有可访问名称

## axe-core 用法
```ts
import { AxeBuilder } from '@axe-core/playwright';
const violations = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa'])
  .analyze();
expect(violations.filter(v => v.impact === 'critical')).toHaveLength(0);
```
只断言 critical 级（避免次要违规阻塞 CI），符合 PRD WCAG 2.2 AA 目标。

## 离线测试时序
1. 正常访问 `/` 与 `/tools/json-formatter`（触发 PWA 首次缓存）
2. `await context.setOffline(true)`
3. `page.goto('/tools/json-formatter')`
4. 断言页面可达（标题/工具名渲染），不断言网络请求（已离线）

## 风险
- PWA Service Worker 在 `vite preview` 下可能不自动注册（需确认 preview 的 SW 作用域）；若离线测试不稳定，标记为"真实设备验证"项而非 E2E 阻塞项
- `@axe-core/playwright` 与 Playwright 版本需兼容
- 工具目录页 i18n：分类名已有 `nav.category.*` key，工具名/描述已有 `tools.*` key，无需新增
