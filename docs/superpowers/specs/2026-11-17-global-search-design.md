# 全局搜索功能设计

## 意图
实现 PRD 4.3 节全局搜索：支持 Ctrl+K/Cmd+K 聚焦，从注册中心数据驱动，覆盖中英文名称、别名、关键词、描述和标签，中英文混合，大小写不敏感，按相关性排序；无结果时提供目录入口。

## 方案选择
- 独立路由 `/search`，TopBar 加搜索图标，Ctrl+K 跳转搜索页
- 放弃 TopBar 内嵌下拉（移动端适配差，无结果目录入口难组织）

## 目标
1. `src/features/search/index.tsx` — 搜索页，读 `useSearchParams` 的 `query`，展示结果列表或空态
2. 搜索逻辑：纯函数 `searchTools(query, tools) → ToolSearchResult[]`，放在 `src/lib/search.ts`，可单独测试
3. 相关性排序：命中字段权重（名称 > 关键词 > 描述 > 标签），命中数多的排前
4. TopBar 加搜索图标，`aria-label` 完整，点击导航到 `/search`
5. `Ctrl+K` / `Cmd+K` 全局监听，跳转到 `/search`（不覆盖 URL query，用户手动输入）
6. 无结果：提示 + 链接到 `/tools`（完整目录）
7. i18n key：`search.placeholder`、`search.noResult`、`search.viewAll`、`search.resultCount`、`search.hint`（快捷键提示）

## 非目标
- 不实现搜索历史持久化
- 不实现分类筛选 UI（PRD 只要求无结果时提供目录入口）
- 不修改注册中心数据结构

## 约束
- 搜索输入不写 LocalStorage（隐私红线）
- 20 个工具规模小，全量匹配即可，无需索引

## 文件变更
| 文件 | 变更 |
|---|---|
| `src/features/search/index.tsx` | 新建，搜索页组件 |
| `src/features/search/search.ts` | 新建，`searchTools` 纯函数 + 类型 |
| `src/features/search/__tests__/search.test.ts` | 新建，搜索逻辑单测 |
| `src/components/layout/TopBar.tsx` | 加搜索图标导航 |
| `src/app/router.tsx` | 加 `/search` 路由 |
| `src/i18n/locales/zh-CN.json` | 加 search 节点 |
| `src/i18n/locales/en-US.json` | 加 search 节点 |

## Ctrl+K 实现
- 在 `AppShell` 挂 `useEffect` 监听 `keydown`，`e.ctrlKey && e.key === 'k'` 时 `navigate('/search')`
- 不阻止浏览器默认行为，仅导航
