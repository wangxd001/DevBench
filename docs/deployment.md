# 部署说明

## 部署平台
Cloudflare Pages 静态部署。正式部署仅来自 `main` 分支。

## PRD 明确的部署要求
- 不开发后端、不使用数据库、不配置账号系统或访问密码。
- 不建立独立 Preview 或线上测试环境。
- MVP 不使用 GitHub Actions；本地人工运行质量检查。
- 配置构建命令、构建输出目录、SPA fallback、PWA 静态资源、安全响应头和 CSP。
- 核心工具不依赖外部 API/CDN。
- GitHub Public 仓库，MIT License。

## 构建配置
- **构建命令**：`npm run build`（`tsc && vite build`）
- **构建输出目录**：`dist/`
- **SPA fallback**：Workbox `navigateFallback: '/index.html'`
- **PWA 资源**：`dist/manifest.webmanifest`、`dist/icon-*.svg`、`dist/sw.js`

## Cloudflare Pages 配置项
| 配置项 | 值 |
|---|---|
| Build Command | `npm run build` |
| Build Output Directory | `dist` |
| Root Directory | （仓库根目录） |

> 安全响应头（CSP）在 Cloudflare Pages Dashboard 或 `_headers` 文件配置，尚未完成。

## 上线前检查
- [ ] lint、typecheck、单元测试、build 通过
- [ ] 生产构建静态预览正常
- [ ] 直接访问/刷新所有工具路由正常
- [ ] SPA fallback 正确
- [ ] CSP 和安全响应头已配置（**尚未完成**）
- [ ] PWA 首次缓存、离线访问和更新流程已验证（**待真实设备**）
- [ ] 未访问过的工具可离线打开（**待验证**）
- [ ] 网络请求、存储和缓存未包含用户输入/结果
- [ ] 不存在非预期第三方请求
- [ ] README、SECURITY 和部署说明与实际状态一致

## 已知未完成
- E2E 测试（Playwright）尚未配置
- CSP / 安全响应头配置尚未完成
- 真实设备 PWA 离线验证尚未执行
