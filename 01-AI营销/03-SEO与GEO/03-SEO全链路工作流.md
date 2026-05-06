# SEO 全链路工作流

> 基于 Claude Code Skills + n8n 自动化模板构建的七步闭环 SEO 工作流。

---

## 工作流总览

```
Audit → Strategy → Optimization → Content → Quality → Monitoring → Delivery
 诊断     规划         修复         生产      质控       监控         交付
```

所有步骤均可在 Claude Code 中用自然语言调用对应 Skill 完成，无需编写代码。

---

## 第一步：Site Audit（网站审计）

**做什么：** 全面诊断网站的技术结构、内容质量、On-page SEO、图片优化、Schema 部署等维度。

**用什么 Skill：**

| Skill | 诊断维度 |
|-------|---------|
| seo-technical | 可爬取性、索引状态、安全性、移动适配、Core Web Vitals |
| seo-visual | 首屏内容分析、移动端渲染、图片/视频审计 |
| seo-schema | 结构化数据检测与验证（JSON-LD） |
| seo-sitemap | XML Sitemap 验证与质量检查 |
| seo-performance | Core Web Vitals 实测（LCP/FID/CLS） |

**产出物：** 完整审计报告，可交付客户（Fiverr 同类服务参考价 $195）。

---

## 第二步：Strategy（战略规划）

**做什么：** 基于审计结果，生成可执行的 SEO 路线图，包括关键词策略、内容矩阵、Local SEO、Content Pillar 结构。

**用什么 Skill：**

| Skill | 规划维度 |
|-------|---------|
| seo-dataforseo | SERP 数据分析、关键词指标、竞品对比 |
| seo-google | GSC 流量数据、CrUX 真实用户指标、索引状态 |
| seo-local | GBP 信号、NAP 一致性、Local Schema、竞品分析 |
| seo-maps | 地理网格排名追踪、GBP 审计、评论分析 |
| blog-persona | 目标用户画像构建 |
| blog-calendar | 内容日历规划 |

**n8n 自动化模板：**

| 模板 | ID | 用途 |
|------|----|------|
| Comprehensive SEO Strategy | 6908 | O3 总监 + 6 个专家 Agent 并行生成完整策略 |
| Multi-Domain SEO Analysis | 7010 | Ahrefs + Google Sheet 批量域名分析 |

**产出物：** 12 周路线图（含每周任务、优先级、KPI）。

---

## 第三步：Site Optimization（网站优化）

**做什么：** 生成 Critical Issues 修复清单，每条问题附带 step-by-step 修复指南。

**用什么 Skill：**

| Skill | 修复维度 |
|-------|---------|
| seo-sitemap | 生成/验证 XML Sitemap、提交到 GSC |
| seo-technical | robots.txt、meta 标签、canonical、HTTPS、重定向 |
| seo-schema | 生成缺失的 Schema JSON-LD（Organization、FAQ、HowTo 等） |

**n8n 自动化模板：**

| 模板 | ID | 用途 |
|------|----|------|
| WordPress SEO + Yoast | 8423 | 自动优化 meta 标题/描述并更新到 Yoast SEO |

**产出物：** 按优先级排序的修复清单 + 每条修复指南。

---

## 第四步：Content Generation（内容生产）

**做什么：** 按 Content Pillar 结构自动生成博客文章、产品页、FAQ 页面，内容自动插入结构化数据。

**用什么 Skill：**

| Skill | 生产环节 |
|-------|---------|
| blog-persona | 确定目标读者和语调 |
| blog-brief | 生成内容需求文档（关键词、搜索意图、竞品分析） |
| blog-outline | 生成文章大纲 |
| blog | 按大纲生成长文内容 |
| blog-schema | 为文章生成结构化数据（Article、FAQ、HowTo） |
| blog-geo | 地理定向内容优化 |
| seo-geo | GEO/AI 搜索优化（ChatGPT、Perplexity、AIO 引用就绪） |
| seo-image-gen | OG/Social 预览图片分析与生成计划 |

**n8n 自动化模板：**

| 模板 | ID | 用途 |
|------|----|------|
| SEO Blog Publishing (36K views) | 3085 | Google Sheet → AI 写作 → WordPress 全自动发布 |
| SEO Blog Auto-Publish | 7038 | 定时 + Telegram 触发 → 1500-2500 词 → WordPress |

**产出物：** 带 Schema 的完整内容文件（Markdown / HTML）。

---

## 第五步：Quality Check（质量检测）

**做什么：** 四层 AI 检测确保内容质量：非 AI 化、E-E-A-T 合规、关键词密度合理、搜索意图匹配。

**用什么 Skill：**

| Skill | 检测维度 |
|-------|---------|
| seo-content | E-E-A-T 信号、可读性、内容深度、薄内容检测 |
| blog-audit | 内容审计（完整性、SEO 合规性） |
| blog-factcheck | 事实核查 |
| blog-cannibalization | 内容蚕食检测（避免内部竞争） |
| blog-analyze | 文章综合分析 |

**产出物：** 质量评分报告。低于标准自动触发重写，通过后才进入发布环节。

---

## 第六步：Monitoring（持续监控）

> 原工作流缺失的环节。SEO 是持续性的，"做一次"不够。

**做什么：** 持续追踪排名变化、流量波动、技术问题、竞品动态。

**用什么 Skill：**

| Skill | 监控维度 |
|-------|---------|
| alert-manager | 排名下降、流量异动、技术问题预警 |
| seo-google | GSC 数据趋势（索引量、点击量、排名变化） |
| seo-performance | Core Web Vitals 趋势 |
| seo-backlinks | 外链增长/丢失监控 |
| seo-dataforseo | 竞品排名追踪 |

**n8n 自动化模板：**

| 模板 | ID | 用途 |
|------|----|------|
| SEO Ranking Monitor | 10412 | 每日排名检查 + Slack/Gmail 自动告警 |
| SEO Strategy Reports (SerpApi) | 11109 | AI Agent 团队 + 实时搜索数据持续分析 |

**产出物：** 周报/月报 + 异常告警。

---

## 第七步：Delivery（交付）

**做什么：** 将所有产出物整理为可交付格式。

**交付物清单：**

| 交付物 | 格式 | 来源 |
|--------|------|------|
| 审计报告 | PDF | 第一步 audit 输出 |
| 战略路线图 | PDF / Markdown | 第二步 strategy 输出 |
| 修复清单 | Markdown | 第三步 optimization 输出 |
| 内容文件 | Markdown + Schema JSON-LD | 第四步 content 输出 |
| 质量报告 | PDF | 第五步 quality 输出 |
| 监控仪表盘 | Interactive Dashboard | 第六步 monitoring 输出 |

**发布渠道：**

| 渠道 | 方式 |
|------|------|
| WordPress | n8n + WordPress MCP 一键发布 |
| GitHub Pages | n8n + GitHub 节点自动提交 |
| 社交媒体 | n8n + Twitter/LinkedIn 节点同步分发 |

---

## n8n 模板速查表

| 模板名称 | ID | 覆盖步骤 | Views |
|---------|----|----|-------|
| Comprehensive SEO Strategy | 6908 | 1 + 2 | 204 |
| WordPress SEO + Yoast | 8423 | 3 + 7 | 65 |
| SEO Ranking Monitor | 10412 | 5 + 6 | 45 |
| SEO Blog Publishing | 3085 | 4 + 7 | 36,976 |
| SEO Blog Auto-Publish | 7038 | 4 + 7 | 96 |
| Multi-Domain Analysis | 7010 | 1 | 656 |
| SEO Strategy Reports | 11109 | 1 + 2 | 12 |
| Content Scraper + Keyword | 5657 | 1 + 2 | 21,070 |

---

## Skill 调用速查表

```
# 审计阶段
seo-technical    → 技术审计
seo-visual       → 视觉审计
seo-schema       → 结构化数据审计
seo-sitemap      → Sitemap 审计
seo-performance  → 性能审计

# 规划阶段
seo-dataforseo   → 关键词/SERP 数据
seo-google       → GSC/CrUX 数据
seo-local        → 本地 SEO 规划
seo-maps         → 地图排名规划
blog-persona     → 用户画像
blog-calendar    → 内容日历

# 优化阶段
seo-technical    → 技术修复
seo-sitemap      → Sitemap 生成
seo-schema       → Schema 生成

# 内容阶段
blog-brief       → 内容需求文档
blog-outline     → 文章大纲
blog             → 内容生成
blog-schema      → 内容 Schema
blog-geo         → 地理内容优化
seo-geo          → AI 搜索优化
seo-image-gen    → 图片分析与规划

# 质控阶段
seo-content      → E-E-A-T 审核
blog-audit       → 内容审计
blog-factcheck   → 事实核查
blog-cannibalization → 蚕食检测

# 监控阶段
alert-manager    → 异常告警
seo-google       → GSC 趋势
seo-performance  → CWV 趋势
seo-backlinks    → 外链监控
seo-dataforseo   → 竞品追踪
```

---

## MCP 工具生态

> MCP（Model Context Protocol）是 Anthropic 于2024年发布的开放标准，允许 AI 助手通过统一协议连接外部数据源和工具。以下为 2026 年主流 SEO MCP 工具一览。

### 主流 SEO MCP 工具

| MCP Server | 核心能力 | 费用 | 本工作流中的对应 Skill |
|------------|---------|------|----------------------|
| **DataForSEO MCP** | 8大API族：关键词/SERP/外链/OnPage/Local/域名分析/Labs/内容分析 | 按查询付费（单次 <$0.01） | `seo-dataforseo` |
| **GSC MCP** (suganthan-gsc-mcp) | 20个工具：分析/监控/报告/索引，直接读取 GSC 数据 | 免费开源 | `seo-google` |
| **Google Analytics MCP** | GA4 数据直连（Google 官方维护） | 免费 | 补充监控阶段 |
| **Semrush MCP** | 关键词研究、竞品对比、关键词聚类、趋势分析 | 消耗 API credits | 补充规划阶段 |
| **SEOptimer SEO MCP** | 网站审计 + 性能数据检索 | 付费 | 补充审计阶段 |
| **Nightwatch SEO MCP** | 排名追踪（200+国家）+ AI搜索可见性监控 | 付费 | 补充监控阶段 |
| **Coupler.io MCP** | 400+应用数据整合（含 GSC + GA4 + GBP） | 付费 | 跨平台数据汇总 |

### GSC MCP 工具速查（免费，最实用）

suganthan-gsc-mcp 内置 20 个工具，覆盖 SEO 工作流的核心环节：

**分析类（11个）**

| 工具 | 作用 | 示例提问 |
|------|------|---------|
| Site Snapshot | 整体表现 vs 上一周期 | "网站整体表现如何？" |
| Quick Wins | 排名4-15位、高展现量的关键词 | "哪些关键词可以快速冲首页？" |
| Content Gaps | 有展现但排名>20的主题 | "应该创建什么内容？" |
| Traffic Drops | 流量下降页面 + 原因诊断 | "哪些页面流量下降了？" |
| CTR Opportunities | CTR 低于该位置基准线的页面 | "哪些页面 CTR 偏低？" |
| Cannibalisation Check | 多页面竞争同一关键词 | "有没有页面互相蚕食？" |
| Content Decay | 连续3个月流量下滑的页面 | "哪些页面在衰退？" |
| URL Inspection | 索引状态、抓取信息、canonical问题 | "这个URL被收录了吗？" |
| Topic Clusters | 指定路径下的页面聚合表现 | "/blog/ 栏目表现如何？" |
| CTR vs Benchmarks | 实际CTR vs 行业基准 | "我的CTR和行业水平比怎么样？" |
| Advanced Search Analytics | 自定义维度/过滤器/排序的灵活查询 | "过去90天美国移动端Top20查询" |

**监控类（2个）**：Check Alerts（排名下降/CTR崩塌/点击损失告警）、Verify Claim（AI自校验数据准确性）

**报告类（3个）**：Content Recommendations（交叉分析输出行动建议）、Generate Report（完整Markdown报告）、Multi-site Dashboard（多站点健康总览）

**索引类（4个）**：Submit URL、Batch Submit（200 URLs/天）、Submit Sitemap、List Sitemaps

### 成本对比

| 场景 | DataForSEO MCP | Ahrefs | Semrush |
|------|---------------|--------|---------|
| 50关键词批量查询 | ~$0.005-0.02 | $129/月包含 | $139/月包含 |
| 100页网站审计 | ~$0.05-0.15 | $129/月包含 | $249/月包含 |
| 外链档案查询 | ~$0.003-0.01 | $129/月包含 | $139/月包含 |
| GSC数据分析 | 免费（GSC MCP） | — | — |

> MCP 按查询付费适合中小项目和探索性分析；大量高频使用场景下，传统 SaaS 订阅仍可能更经济。

### 局限性

- **设置门槛**：需要配置 API 密钥、OAuth 认证，非技术人员有学习曲线
- **工具覆盖不全**：并非所有 SEO 工具都已支持 MCP（如 Ahrefs、Screaming Frog 暂无）
- **API 费用控制**：AI Agent 自主运行时可能产生意外调用，需用 ENABLED_MODULES 限制权限范围
- **AI 解读准确性**：MCP 返回的数据是精确的，但 AI 的解读可能出错（过度归因、编造解释）——需人工审核
- **数据权限边界**：只能访问 API 暴露的数据，无法替代专业工具的私有数据库（如 Ahrefs 的外链库）

> **来源**：SEOptimer "Top SEO MCP Servers in 2026"、NextGrowth.ai "DataForSEO MCP Server Setup"、Suganthan "Google Search Console MCP Server Setup Guide"（2026年3-4月）
