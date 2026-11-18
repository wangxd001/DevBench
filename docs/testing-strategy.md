# 测试策略

## 分层
| 层级 | 工具 | 目标 | 命令 |
|---|---|---|---|
| 核心逻辑 | Vitest | 验证工具算法与边界 | `npm run test` |
| 组件交互 | React Testing Library | 验证输入、按钮、状态和提示 | `npm run test` |
| E2E | Playwright | 验证完整用户流程与路由 | `npm run test:e2e` |
| 无障碍 | axe-core + 人工检查 | 验证常见问题、键盘与焦点 | `npm run test:e2e`（a11y spec） |
| 真实设备 | iOS Safari/PWA、Android Chrome/PWA 等 | 验证兼容、离线和性能 | 手动 |

## E2E 运行方式
- 依赖：`@playwright/test` + `@axe-core/playwright`
- 浏览器：使用系统已安装的 Google Chrome（`channel: 'chrome'`），不下载 Playwright 自带浏览器
- Web 服务器：`npm run preview`（vite 生产构建产物，端口 4173）
- 命令：
  ```bash
  npm run build        # 先构建
  npm run test:e2e     # playwright test（自动拉起 preview）
  npm run test:e2e:ui  # 交互式 UI 调试
  ```
- 报告：`playwright-report/`（HTML），`test-results/`（trace/截图）

## 每个工具最低用例
正常、空、非法、边界、正确结果、复制、输入大小限制、异常处理。

## 全局流程（E2E 已覆盖）
首页、目录、搜索、工具页面、收藏、最近使用、隐私、404；主题/语言切换、收藏/取消收藏、最近使用/清空、刷新、直接访问路由、前进后退、离线访问；axe-core 扫描 7 个核心页面（断言无 critical 级违规）。

## 隐私专项
用 JWT、Cookie、Authorization Header 等测试数据检查 LocalStorage、SessionStorage、IndexedDB、URL、浏览器历史、Service Worker Cache、控制台/应用日志和实际网络请求的 URL/查询参数/请求头/请求体。

## PWA 专项
首次缓存、离线首页、离线目录、未曾打开过的工具离线打开、更新暂缓、更新确认、必要资源先缓存再切换、旧缓存清理。

## 设备与性能
测试桌面和移动设备；重点验证 Base64、哈希、Diff 和 Worker 场景的内存、耗时、主线程响应性。输入上限如需调整，必须同步更新 UI、文档和测试。

## 报告
记录环境、命令、结果、失败原因、未执行项。未执行或仅静态审查的项目不得标记为通过。
