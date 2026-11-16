# 产品范围与需求冻结规则

## 正式依据
- 必须以 `docs/PRD.md` 原文为正式需求基线。
- PRD 是 MVP 需求冻结/开发基线；聊天摘要、猜测和个人偏好不能覆盖 PRD。
- 实现前定位相关章节；不确定时先报告，不自行补充产品需求。

## MVP 固定范围
20 个工具及 ID 必须与 PRD 完全一致：
1. `json-formatter`
2. `timestamp-converter`
3. `uuid-generator`
4. `base64-converter`
5. `url-encoder`
6. `hash-generator`
7. `jwt-decoder`
8. `http-header-parser`
9. `json-diff`
10. `regex-tester`
11. `datetime-formatter`
12. `date-calculator`
13. `random-string-generator`
14. `test-data-generator`
15. `unicode-converter`
16. `html-entity-converter`
17. `json-yaml-converter`
18. `http-cookie-parser`
19. `http-status-codes`
20. `text-diff`

六个主分类：`data`、`datetime`、`encoding`、`generator`、`http`、`text`。每个工具只能属于一个主分类。ID、路由和分类不得擅改。

## 明确不做
不开发账号/登录、后端业务服务、数据库、服务端文件处理、云同步、广告、行为分析/访问统计、远程错误监控、站内反馈、文件上传/拖放/批量文件处理、工具间自动传递、第三方动态插件运行时、多套可自定义首页布局预设。

MVP 不增加第 21 个工具。不要把“未来可能需要”当作本期需求。

## 需求不清楚时
列出：PRD 位置、未明确内容、可能影响、最小可行选项。涉及产品方向、隐私、安全、法律或不可逆决策时等待用户确认。不得擅自删除 PRD 已确认能力来简化实现。
