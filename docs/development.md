# 本地开发说明

## 环境
记录实际使用的 Node.js、npm 和浏览器版本。依赖版本以 `package.json` 和锁文件为准。

## 安装与启动
在确认 package scripts 后填写真实命令：
```bash
npm install
npm run dev
```

## 常用检查
以 `package.json` 为准，PRD 质量门禁至少要求：
```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## 开发流程
1. 阅读 CLAUDE.md、相关 Rules 和 PRD 章节。
2. 检查现有实现与 Git 状态。
3. 明确本次范围和验收标准。
4. 小步实现。
5. 执行测试与质量检查。
6. 检查隐私、安全和文档同步。
7. 汇报结果和遗留事项。

## 本地数据约束
LocalStorage 只保存主题、语言、收藏、置顶、最近使用及少量非敏感偏好。输入和结果不得持久化或进入 URL、日志、缓存、全局 Store。
