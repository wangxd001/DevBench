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

## 上线前检查
- [ ] lint、typecheck、单元测试、组件测试、E2E 和 build 通过
- [ ] 生产构建静态预览正常
- [ ] 直接访问/刷新所有工具路由正常
- [ ] SPA fallback 正确
- [ ] CSP 和安全响应头已检查
- [ ] PWA 首次缓存、离线访问和更新流程已验证
- [ ] 未访问过的工具可离线打开
- [ ] 网络请求、存储和缓存未包含用户输入/结果
- [ ] 不存在非预期第三方请求
- [ ] README、SECURITY 和部署说明与实际状态一致

本文件中的复选项只有在真实验证后才能勾选。
