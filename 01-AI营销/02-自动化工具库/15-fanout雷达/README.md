# Fan-out 雷达

> AI 检索子查询 → 真实来源池 → 站内覆盖对照 | 建于 2026-10-14 | 数据源：智谱 web_search API（web-search-prime MCP 同源直调）

## 定位

解决 GEO 选题层的一个缺口：**AI 接到 buyer question 会把它展开成哪些子查询、每个子查询的真实来源池里有没有我们**。来源：子木 chatgpt-fanout-queries（开源 skill，OpenAI Responses API 通道）的思路移植——用我们自己的智谱栈实现，零额外成本。

**与既有工具的分工**：
- 07-GEO可见性检查（Serper）= 品牌信号维度（Reddit/评价站/媒体有没有我们）
- 本工具 = 内容缺口维度（子查询来源池有没有我们的页）
- Ubs serp_analysis = Google SERP/AIO 真源（竞研纪律主通道，本工具**不替代**它）
- ChatGPT 真实行为实录 = 原 skill 的独有价值，本工具是"大模型展开共性"的模拟（Profound：fanout 展开有行业共性，模拟有参考价值）

## 架构（2026-10-15 修正：主线走订阅+MCP，不走 API）

```
主线（fanout-radar skill，订阅套餐内零成本）：会话模型规划子查询 → 逐词调 web-search-prime MCP → 来源池聚合 → 站内对照 → 留档+解读
预留（fanout_radar.py，直调 HTTP API）：仅未来需要 cron 无人值守自动化时启用；当前不作为主通道（额度归属不透明+多余 token 依赖）
```

两通道产出 `sources.json` 结构一致（topic/queries/intents/pool/domains），diff 互通。

## 用法

```bash
# 会话规划好子查询后执行（--site 做域名级对照）
python fanout_radar.py --site cushionmill.com --topic "outdoor-replacement" \
  --q "custom replacement cushions outdoor furniture" --q "how to measure cushions for replacement" ...

# 或 queries.json 批量（{"topic":..., "queries":[{"q":...,"intent":...}]}）
python fanout_radar.py --site cushionmill.com --queries queries.json

# 周/月对比
python fanout_radar.py --diff runs/2026-10-14_xxx runs/2026-10-21_xxx
```

- **认证**：自动从 `~/.claude.json` 读 web-search-prime MCP 的 Bearer token（不硬编码；`--token` 可覆盖）
- **输出**：`runs/{日期}_{topic}/`——`raw/qNN.json`（每词原始响应）/ `sources.json`（来源池+域名统计+intents 含 keywords）/ `coverage.md`（对照报告）
- **意外红利**：智谱 `search_intent.keywords` = 搜索引擎侧查询扩展，本身是 fan-out 信号（留在 sources.json）
- **正式使用时 run 目录落站点项目目录**（工具目录 runs/ 仅首测样例）
- 词间隔 1.2s 防限流；个别 best 型词只返回 2-3 条属智谱路由行为，如实记录

## 首测基线（2026-10-14，靠垫 outdoor replacement 主题）

5 子查询 → 158 URL / 102 域名来源池，**我方零命中**（新站符合预期，即 GEO 起点）。来源池头部：cascadiaoutdoorcushions.com ×11（该主题最强 GEO 对手）、foamorder ×5、zipcushions/uscushion 等；同时混入 carefocusdaily/telectronichub 等泛内容农场域名——印证 AI 搜索来源池"垂直站+农场"混构。

## 纪律边界

本工具是 **AI 检索来源采集模拟**；**禁用于竞对发现/SERP 意图实判**（那两件必须走 Ubs `serp_analysis`，CLAUDE.md 纪律）。结果喂 `03-SEO与GEO/15-Query-Fanout-子问题选题策略.md` 选题与 GEO 审查 SOP 三动作；引用模拟（哪些来源会被 AI 引）留在会话模型段做，脚本不做。

## 升级路径

会话流程（规划→执行→解读）跑 2-3 轮成熟后固化为 skill（fanout-radar），与 word-radar/gsc-radar 构成雷达三件套：趋势新词（word）/ GSC 存量（gsc）/ AI 检索缺口（fanout）。
