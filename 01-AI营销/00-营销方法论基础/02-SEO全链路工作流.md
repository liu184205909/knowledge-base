# SEO 全链路工作流

> 基于 Claude Code + Skills + MCP 构建的七步闭环 SEO 工作流。

---

## 与 RLM 流程的关系

本文件不替代 RLM 的竞品分析、网站规划和内容策略。它主要用于两个场景：

1. **网站上线前**：检查技术 SEO、页面结构、Schema、Sitemap、性能、移动端体验
2. **网站上线后**：监控索引、排名、流量、外链、内容质量和竞品变化

**输入/输出关系**：
- RLM 产出的关键词库、网站规划、内容清单 → 是本工作流的输入
- 本工作流产出的审计报告、修复清单、监控报告 → 反向更新 RLM 的策略和内容优先级

---

## 工作流总览

```
Audit → Strategy → Optimization → Content → Quality → Monitoring → Delivery
 诊断     规划         修复         生产      质控       监控         交付
```

所有步骤均可在 Claude Code 中用自然语言调用对应 Skill 完成，无需编写代码。

### 按项目阶段选择流程

不是每个项目都需要完整跑七步。根据当前阶段选择执行范围：

| 场景 | 应执行步骤 | 可暂缓 |
|------|----------|--------|
| 新站上线前 | Audit → Optimization → Quality → Delivery | Monitoring 上线后再做 |
| 已上线但没流量 | Audit → Strategy → Content → Monitoring | Delivery 可简化 |
| 已有流量要增长 | Strategy → Content → Quality → Monitoring | 基础 Audit 可抽样 |
| 流量下跌 | Audit → Monitoring → Optimization | 新内容生产可暂缓 |

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

> SEO 是持续性的，"做一次"不够。

**做什么：** 持续追踪排名变化、流量波动、技术问题、竞品动态。

**用什么 Skill：**

| Skill | 监控维度 |
|-------|---------|
| alert-manager | 排名下降、流量异动、技术问题预警 |
| seo-google | GSC 数据趋势（索引量、点击量、排名变化） |
| seo-performance | Core Web Vitals 趋势 |
| seo-backlinks | 外链增长/丢失监控 |
| seo-dataforseo | 竞品排名追踪 |

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

## MCP 工具配置

本工作流依赖两个 MCP 数据源：

| MCP Server | 定位 | 状态 | 安装指南 |
|------------|------|------|----------|
| **DataForSEO MCP** | 第三方 SEO 数据（关键词/SERP/趋势/竞品） | 必装 | [Claude Code 环境配置](../../00-基础能力/01-Claude-Code环境配置.md) |
| **GSC MCP** (suganthan-gsc-mcp) | 自有网站数据（GSC 流量/索引/排名） | 后期按需安装 | [RLM营销方法论 - GSC MCP 配置](./00-RLM营销方法论核心.md#gsc-mcp-配置网站上线后必装) |

### DataForSEO MCP（必装）

按查询付费（单次 < $0.01），覆盖工作流中 `seo-dataforseo` Skill 的所有数据需求。

**核心模块：** `KEYWORDS_DATA`（关键词研究）+ `SERP`（搜索结果分析）

**典型用途：**
- 关键词搜索量、CPC、竞争度查询
- Google/YouTube SERP 实时数据
- Google Trends 趋势分析
- 地区关注度与人群画像

> 详见 [Claude Code 环境配置 - DataForSEO MCP 章节](../../00-基础能力/01-Claude-Code环境配置.md)

### GSC MCP（后期按需）

当网站接入 Google Search Console 后安装，用于读取自有网站的真实流量和索引数据。免费开源，内置 20 个工具（分析 11 + 监控 2 + 报告 3 + 索引 4）。

> 详见 [RLM营销方法论 - GSC MCP 配置](./00-RLM营销方法论核心.md#gsc-mcp-配置网站上线后必装)

### 局限性

- **AI 解读准确性**：MCP 返回的数据是精确的，但 AI 的解读可能出错（过度归因、编造解释）——需人工审核
- **数据权限边界**：只能访问 API 暴露的数据，无法替代专业工具的私有数据库（如 Ahrefs 的外链库）
- **API 费用控制**：AI Agent 自主运行时可能产生意外调用，需用 `ENABLED_MODULES` 限制范围
