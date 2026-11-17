# DevBench — 开发者工作台

> Developer & Tester Toolbox

面向 Web 软件测试工程师、前端、后端及全栈开发人员的纯前端 Web 工具箱 / PWA。

## 功能

提供 20 个常用开发者工具，覆盖数据处理、日期时间、编码哈希、数据生成、HTTP 解析和文本比对。

工具完全在浏览器本地处理，无需注册、登录，不上传用户输入和结果。

## 技术栈

- React 19 + TypeScript + Vite
- Tailwind CSS + Radix UI
- Zustand（全局偏好状态）
- React Router
- i18next（简体中文 / 英文）
- Vitest + React Testing Library
- vite-plugin-pwa + Workbox

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 部署

静态部署到 Cloudflare Pages，配置 SPA fallback。详见 `docs/deployment.md`。

## 隐私原则

- 工具计算在浏览器本地完成
- 不主动上传用户输入和结果到服务器
- 不接入应用级行为统计
- 用户输入和结果不被主动持久化

## 许可证

MIT License，见 [LICENSE](./LICENSE)。
