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
| SPA fallback | `public/_redirects` 中 `/* → /index.html`（Pages 原生），与 Workbox `navigateFallback` 对齐 |

## 安全响应头与 CSP

放在 `public/_headers`（构建时原样复制到 `dist/_headers`，Cloudflare Pages 部署时自动应用；无需在 Dashboard 手动配置）：

| 响应头 | 值 | 说明 |
|---|---|---|
| `Content-Security-Policy` | 见下 | 限制脚本/样式/连接/worker 来源 |
| `X-Frame-Options` | `DENY` | 禁止被 iframe 嵌入（防点击劫持） |
| `X-Content-Type-Options` | `nosniff` | 禁止 MIME 嗅探 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | 同源不发送 referrer，跨域只发送 origin |
| `Permissions-Policy` | 关闭相机/麦克风/定位/USB/运动传感器/支付 | 本产品无需上述能力，显式禁用 |

**CSP 策略：**
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self';
img-src 'self' data:;
font-src 'self' data:;
connect-src 'self';
manifest-src 'self';
worker-src 'self' blob:;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests
```

设计依据（对齐 PRD 13.5）：
- 纯前端、全同源，核心工具不依赖外部 API/CDN，故 `default-src 'self'` 且 `connect-src 'self'`（禁止任何出站连接，用户输入/结果不会离开浏览器）。
- `script-src` 含 `'unsafe-inline'`：唯一的外来脚本是 `index.html` 里首屏防主题闪烁的内联脚本（只读 localStorage、设置 `data-theme`，无远程代码执行面）。若未来希望去掉 `'unsafe-inline'`，需为该内联脚本改用 `nonce`/`hash`。
- `worker-src 'self' blob:`：Vite `?worker` 打包为同源文件（`/assets/regex-worker-entry-*.js`）；`blob:` 是 Web Worker 兜底。
- `data:` 仅开放给图片/字体（本产物暂无 data URI，预留）。
- `frame-ancestors 'none'` 与 `X-Frame-Options: DENY` 双重禁止嵌入。

> 本地验证：`_headers`/`_redirects` 是 Cloudflare Pages 专有机制，`vite preview` 不会应用它们。
> 本地可用 `npx serve dist -l 4173`（或任意能解析 `_headers` 的静态服务器）核对响应头，但**最终以上线到 Cloudflare Pages 后
> `curl -I https://<你的项目>.pages.dev` 的实际响应头为准**。

## 上线前检查
- [x] lint、typecheck、单元测试、build 通过
- [x] 生产构建静态预览正常（`dist/` 完整，`_headers`/`_redirects` 已进 dist）
- [ ] 直接访问/刷新所有工具路由正常（**上线后人工验证**）
- [x] SPA fallback 配置正确（`_redirects` `/* → /index.html` + Workbox `navigateFallback`）
- [x] CSP 和安全响应头已配置（`public/_headers`，待上线 `curl -I` 核验实际生效）
- [ ] PWA 首次缓存、离线访问和更新流程已验证（**待真实设备**）
- [ ] 未访问过的工具可离线打开（**待验证**）
- [x] 网络请求、存储和缓存未包含用户输入/结果（代码层面：无 fetch/上传，CSP `connect-src 'self'` 进一步保证）
- [x] 不存在非预期第三方请求（全同源，CSP 禁止外部连接）
- [ ] README、SECURITY 和部署说明与实际状态一致（SECURITY.md 尚未创建）

## 已知未完成
- [ ] 真实设备 PWA 离线验证尚未执行
- [ ] SECURITY.md 文档骨架尚未创建（PRD 12 要求）
- [ ] 上线后 `curl -I` 核验 CSP/安全响应头实际生效
