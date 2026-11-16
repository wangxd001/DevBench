# 技术架构与模块边界规则

## 技术栈
遵循 PRD：React、TypeScript、Vite、Tailwind CSS、Radix UI、Zustand、React Router、CodeMirror 6、Vitest、React Testing Library、Playwright、axe-core、vite-plugin-pwa、Workbox、date-fns；仅在需要 IANA 时区转换时引入 date-fns-tz。部署 Cloudflare Pages。

选择稳定兼容版本并固定版本/锁文件。不得为“可能用到”而引入额外依赖；第三方库需评估维护状态、许可证、浏览器兼容、包体积、安全和离线能力。

## 模块边界
- 工具注册中心是工具元数据唯一来源。
- 首页、目录、分类、搜索、收藏、最近使用、相关工具、路由匹配由注册中心数据驱动。
- 工具逻辑与 UI 分离；核心逻辑尽量纯函数化。
- 工具页面按需加载；CodeMirror 和语言扩展按需加载。
- 不建立复杂全局业务状态系统。
- 不建立第三方动态插件运行时。

## 全局状态
仅允许全局 Store 管理：
- Preferences：主题、语言、少量非敏感偏好；
- Favorites：收藏、置顶；
- Recent：最多 10 个工具及最近使用时间。

工具输入、结果、JWT、Cookie、Token、Authorization Header 等敏感内容必须留在当前页面局部状态，不得进入 Zustand。

## 注册中心校验
至少校验：
- 工具 ID 唯一、路由唯一；
- 分类和标签 ID 存在；
- 中英文名称、描述、关键词完整；
- 图标标识有效；
- 组件可加载；
- recommended 为布尔值；
- relatedTools 中 ID 存在、不重复、不包含自身；
- 每个工具关联 2–4 个工具；
- 每个工具恰好属于一个主分类。

## 目录
以 PRD 第 9.3 节建议结构为基础，允许合理微调，但必须保持清晰边界，不为抽象而抽象。结构变化须同步架构文档。
