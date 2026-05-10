# DR 与流量数据获取方案

> 竞品分析阶段（RLM 步骤 1B）批量获取域名权重、自然流量、流量渠道等 SEO 指标 | 最后更新: 2026-05-10

---

## 方案总览

```
DR                    →  DataForSEO backlinks/bulk_ranks（需激活 Backlinks 订阅） / Ahrefs 手动查询
流量渠道拆分          →  traffic.cv + Web Access CDP（免费）
补充参考              →  DataForSEO MCP domain_rank_overview（ETV，已有）
备用                 →  RapidAPI Similarweb（$19/月） / Apify（按量）
```

---

## 主方案：DataForSEO + traffic.cv

### DataForSEO MCP（DR + ETV）

已集成。两个可用端点：

| 指标 | 端点 | 模块 | 状态 |
|------|------|------|------|
| DR（权重 0-100） | `/v3/backlinks/bulk_ranks/live` | Backlinks | **需激活 Backlinks 订阅** |
| 自然流量（ETV） | `/v3/dataforseo_labs/google/domain_rank_overview/live` | DataForSEO Labs | 可用 |

> `bulk_ranks` 支持一次最多 1000 个域名批量查询，`rank_scale: "one_hundred"` 转为 0-100 量表（与 Ahrefs DR 一致）。

### traffic.cv + CDP（流量渠道拆分）

通过 Web Access skill 的 CDP 连接真实 Chrome 浏览器访问 [traffic.cv](https://traffic.cv/{domain})，绕过 Cloudflare 保护提取数据。

**返回数据**：
- Total Visits（月访问量）
- Traffic Sources：search%、direct%、social%、referrals%、mail%、paidReferrals%

**操作方式**：

```bash
# 1. 检查 CDP 环境
node ~/.claude/skills/web-access/scripts/check-deps.mjs

# 2. 打开域名页面
curl -s "http://localhost:3456/new?url=https://traffic.cv/{domain}"

# 3. 提取数据（通过 /eval 读取 DOM）
# 4. 关闭 tab
curl -s "http://localhost:3456/close?target={targetId}"
```

**实际验证结果**（2026-05-10，40 个竞品域名）：

| 结果 | 数量 | 说明 |
|------|------|------|
| 完整数据（visits + 6 渠道%） | 20 | traffic.cv 有完整数据 |
| 部分数据（visits + 部分%） | 11 | 仅 Semrush 免费页有基础数据 |
| 仅 visits | 3 | traffic.cv 有访问量但无渠道拆分 |
| 无数据 | 6 | 流量太小或域名不在数据库 |

**注意事项**：
- 连续访问 ~6-7 个域名后可能触发 Cloudflare Turnstile 验证，需间隔操作
- 可用并行子 Agent 加速，每个 Agent 操作独立 tab
- traffic.cv 无付费 API，数据只能通过网页抓取

---

## RLM 流程对接

```
步骤1A: 竞品发现 → 40+ 竞品域名
    ↓
步骤1B: 竞品筛选 → 批量获取 DR + 流量 + 渠道数据
    ├── Ahrefs/Semrush → DR（手动查询）
    └── traffic.cv + CDP → 月访问量 + 流量渠道拆分
    ↓
输出: 竞品清单 Google Sheets（补充DR/流量/渠道字段） → P0/P1/P2/P3 分级
```

---

## 数据输出格式（竞品清单字段）

| 字段 | 列号 | 数据来源 | 格式 |
|------|------|---------|------|
| DR | E | Ahrefs/Semrush 手动查询 | 0-100 |
| 月访问量 | G | traffic.cv | 如 233.06K、2.71M |
| 搜索% | H | traffic.cv | 如 53.80% |
| 直接% | I | traffic.cv | 如 14.63% |
| 社交% | J | traffic.cv | 如 16.26% |
| 引荐% | K | traffic.cv | 如 12.83% |
| 邮件% | L | traffic.cv | 如 1.75% |
| 付费% | M | traffic.cv | 如 0.17% |

> DR 数据来源说明：DataForSEO 的 `backlinks/bulk_ranks/live` 端点可批量获取 DR（0-100 量表，一次最多 1000 域名），但需要激活 Backlinks 订阅。当前 DR 值通过 Ahrefs/Semrush 免费版手动查询获取。如需批量自动获取 DR，激活 Backlinks 模块即可。

---

## 备用方案

### RapidAPI Similarweb（需付费）

| 项目 | 详情 |
|------|------|
| API | `oceanrock/similarweb-api1` |
| 定价 | Basic $0（50次/月）/ Pro $19（15,000次/月） |
| 优势 | 结构化 JSON，含 Engagement + TopKeywords |
| 端点 | `POST /v1/visitsInfo`，Host: `similarweb-api1.p.rapidapi.com` |
| 限制 | Basic 配额太少（40 个域名就超限），Pro 需月费 |

### Apify Similarweb Actor（按量付费）

| 项目 | 详情 |
|------|------|
| Actor | `just_scrape/similarweb-advanced-scraper` |
| 定价 | ~$1.05/1000 域名 |
| 独有数据 | AI 流量、竞品发现、历史趋势 |
