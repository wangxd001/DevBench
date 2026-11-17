# 本地开发说明

## 环境
- Node.js v24.15.0
- npm 11.x
- 浏览器：Chrome、Safari、Firefox 最新版（开发用 Chrome DevTools）

## 安装与启动
```bash
npm install
npm run dev
```

## 常用检查
以 `package.json` 为准，当前可用命令：
```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run test        # vitest run（已配置 pool: vmThreads）
npm run build       # tsc && vite build（含 PWA Service Worker 生成）
```

> 注：`npm run test:e2e` 尚未配置（Playwright 未引入）。

## 开发流程
1. 阅读 CLAUDE.md、相关 Rules 和 PRD 章节。
2. 检查现有实现与 Git 状态。
3. 明确本次范围和验收标准。
4. 小步实现。
5. 执行测试与质量检查（`npm run test` + `npm run typecheck` + `npm run lint`）。
6. 检查隐私、安全和文档同步。
7. 汇报结果和遗留事项。

## 本地数据约束
LocalStorage 只保存：主题、语言、收藏、置顶、最近使用（`devbench.*` 键）。
输入和处理结果不得持久化或进入 URL、日志、缓存、全局 Store 或网络请求。

## 已知注意事项
- vitest 5.1.0 默认 `forks` pool 有 bug（`Cannot read properties of undefined (reading 'config')`），已在 `vitest.config.ts` 中配置 `pool: 'vmThreads'`。
- `vitest.config.ts` 不得引入 `vite-plugin-pwa`（测试不需要 PWA 功能）。
- `tsconfig.json` 需要 `ignoreDeprecations: "6.0"`（baseUrl 弃用警告）。
