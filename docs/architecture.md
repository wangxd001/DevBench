# 架构说明（实施时持续更新）

> 本文是架构记录模板。具体实现必须与 `docs/PRD.md` 一致，不得将计划写成已完成事实。

## 1. 总体架构
纯前端 React + TypeScript + Vite Web 应用 / PWA，静态部署到 Cloudflare Pages。无后端业务服务、数据库、账号系统或云同步。

## 2. 技术栈
React、TypeScript、Vite、Tailwind CSS、Radix UI、Zustand、React Router、CodeMirror 6、Vitest、React Testing Library、Playwright、axe-core、vite-plugin-pwa、Workbox、date-fns；按需 date-fns-tz。

## 3. 模块边界
- App / Router / Providers
- Layout、Navigation、Search、Common UI、Editor、Feedback
- Features：Home、Tools、Favorites、Recent、Privacy
- Tools：Registry 与 data、datetime、encoding、generator、http、text 分类
- Stores：Preferences、Favorites、Recent
- Lib：Storage、Security、Worker、Utils
- i18n、Styles、Types

## 4. 工具注册中心
注册中心为工具元数据唯一来源，驱动首页、目录、分类、搜索、收藏、最近使用、相关工具和路由。维护元数据类型、运行时/测试校验与关联关系。禁止在多个页面重复维护清单。

## 5. 状态和隐私边界
全局状态只保存非敏感偏好、收藏/置顶、最近使用。输入和结果仅在当前工具页面局部状态中；不得进入持久化存储、URL、日志、缓存、全局 Store 或网络请求。

## 6. Worker
Regex 必须使用 Web Worker 并设置超时。其他工具是否使用 Worker，由真实设备性能测试决定。记录 Worker 初始化、执行、异常、超时、取消和终止的处理方式。

## 7. PWA 与缓存
记录 Workbox 缓存策略、必要资源清单、离线 fallback、未访问工具路由离线可达性、更新流程和缓存清理。严禁缓存用户输入和结果。

## 8. 决策记录
每项架构决策记录背景、选项、选择、影响、PRD 依据和日期。不得用架构决策覆盖 PRD。
