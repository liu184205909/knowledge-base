# SEO 全链路工作流（三合一：SEO全链路 + GSC数据驱动 + GEO五段布局）

> **定位**：SEO 与 GEO 的操作工作流合集——项目各阶段照此执行。三部分各自独立成章：
> 第 I 部分 SEO 全链路七步闭环 ｜ 第 II 部分 GSC 数据驱动分析方法论 ｜ 第 III 部分 C 端 GEO 五段旅程布局
> **知识层依据**（机制/研究/数据）在 [03-SEO与GEO/](../../03-SEO与GEO/README.md)，本文只管"何时做什么"。
> 2026-09-14 由 02/10/20 三文档合并。配套脚本（已迁工具库）：[13-SEO审计脚本包](../../02-自动化工具库/13-SEO审计脚本包/README.md)（keyword_cannibalization_checker / onpage_seo_checker / seo_technical_auditor）

---


<!-- ======== 第 I 部分：SEO 全链路工作流（原 01-SEO全链路工作流.md，2026-09-14 并入）======== -->

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

### 发布顺序策略

内容发布顺序直接影响 thematic foundation 的建立速度。核心原则：**先覆盖低竞争子主题建立主题权威 → 再冲高搜索量核心词**。

| 批次 | 时间 | 内容 | 目的 |
|------|------|------|------|
| 第一批 | 第 1-4 周 | 每个集群的 3-5 个低竞争子主题页（长尾词、问题型查询） | 让搜索引擎理解网站的主题边界 |
| 第二批 | 第 5-8 周 | 集群的 Pillar Page（支柱页） | 此时已有子页面通过内链支撑，Pillar Page 初始排名更有利 |
| 第三批 | 第 9-12 周 | 高搜索量核心词页面 | 此时网站已积累 Q*（站级质量）的 thematic foundation |

**为什么不能先冲核心词**：新站在搜索引擎没有主题理解之前直接冲高竞争词，初始排名很低（SegIndexer 低 tier），没有曝光 → 没有用户信号 → 继续低 tier（死循环）。先建覆盖再冲核心词，是用子主题的积累为核心词页面"铺路"。

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
| **GSC MCP** (suganthan-gsc-mcp) | 自有网站数据（GSC 流量/索引/排名） | 后期按需安装 | [Claude Code 环境配置](../../00-基础能力/01-Claude-Code环境配置.md) |

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

> 详见 [Claude Code 环境配置](../../00-基础能力/01-Claude-Code环境配置.md)

### 局限性

- **AI 解读准确性**：MCP 返回的数据是精确的，但 AI 的解读可能出错（过度归因、编造解释）——需人工审核
- **数据权限边界**：只能访问 API 暴露的数据，无法替代专业工具的私有数据库（如 Ahrefs 的外链库）
- **API 费用控制**：AI Agent 自主运行时可能产生意外调用，需用 `ENABLED_MODULES` 限制范围


<!-- ======== 第 II 部分：GSC 数据驱动 SEO 深度研究（原 01-SEO全链路工作流.md，2026-09-14 并入）======== -->

# GSC 数据驱动 SEO 深度研究：方法论 × AI 自动化

> 最后更新：2026-06-22 | 配套工具：google-seo-mcp（Mario 版）| 配套 skill：gsc-radar（建设中）
>
> 本文档是「方法论层」，回答"业界怎么用 GSC、怎么结合 AI"。具体执行层（调哪个工具、参数）见 §6 落地映射；自动化封装见 §7 skill 路线。

---

## 0. 核心理念：为什么是 GSC

GSC（Google Search Console）是**唯一**告诉你"自己页面在 Google 真实表现"的第一方数据源——第三方工具（Ahrefs/Semrush）都是估算，GSC 是 Google 自己给的实测。

两条业界共识贯穿全文：
1. **第一方 GSC 数据 + 反向工程 SERP，胜过任何第三方工具组合**（[Glen Allsopp/Detailed](https://detailed.com/advanced-keyword-research/)，13 年 SEO 总结这是"做过最聪明的事"）
2. **GSC 里已经坐着最高 ROI 的机会**——不是"建新内容"，而是把已经在 5-15 名的词推上去（[Analyseo](https://analyseo.app/blog/striking-distance-keywords-search-console)：12 个词、90 天、480→2750 月点击，零新内容）

所以本文档的主线：**从 GSC 第一方数据出发，用 AI 把"发现机会→诊断原因→生成改进→验证效果"的闭环自动化**。

> **为什么不只用 Looker Studio（Data Studio）？** BI 仪表盘适合看大盘（访问量/掉量一眼扫，给老板看），但**固定模板会低估数据价值**——人只预设常规维度（PV/停留/跳出），藏在数据底下的机会（striking-distance 词、自相竞争、内容衰减、query cluster、AIO 蚕食）挖不出来（[小渔](https://mp.weixin.qq.com/s/_w4OSNhc2aPOzqW3nhPOPg)：自己设计可视化模板"数据价值可能被低估，隐藏信息没办法充分挖掘"）。核心价值在 AI 深度分析（gsc-radar 这类 skill 按真实数据动态切片+诊断+出决策队列，效果远超固定图表）；Looker Studio 只做监控看板、**不替代分析**。别本末倒置把精力耗在手搓可视化模板上——数据采集（API 自动化）+ AI 分析才是主线。

---

## 1. GSC 内部高级切片（不止 quick_wins）

### 1.1 品牌词 vs 非品牌词分离
- **Google 2025-11 上线原生 branded filter**（[官方](https://developers.google.com/search/blog/2025/11/search-console-branded-filter)）：用 AI 自动判定查询是否含品牌意图，三态「Branded / Non-branded / Unverified」。**不再是 regex**。
- 意义：**非品牌词流量 = 内容营销真实成绩**（排除已认识品牌的人）。branded query CTR/排名天然更高，混在一起看会掩盖增长问题。
- 多品牌/拼写字体仍要 regex 兜底（[seo-stack regex 指南](https://www.seo-stack.io/blog/google-search-console-regex-filters-the-ultimate-guide)）：`brandname|brand name|brandname\.com|bn`（RE2，大小写不敏感）。
- **落地**：google-seo-mcp 的 `gsc_search_analytics` 拉全量 query 后，按品牌词正则分两桶分别报告。

### 1.2 Striking Distance（position 4-15）—— 全文最高 ROI 的动作
- **定义**：已排进前 2 页但不在前 3 的词。各工具口径：Analyseo 5-15、Rows 4-10、Chris Long Decoder 11-20、NEURONwriter 4.9-15.1。**新站用 11-20 更现实，成熟站用 4-15 更易出量**。
- **数学**（[Analyseo 原文](https://analyseo.app/blog/striking-distance-keywords-search-console)）：pos1≈30% CTR、2≈15%、3≈10%、7≈3%、11+ <1%。**pos 8→3 不是 +60%，是 5-10x 点击**。
- **优先级公式**：`Impressions × (Expected_CTR_at_target − Current_CTR)`。砍掉 <100 展现的词（绝对增量太小）。
- **5 步优化 playbook**（Analyseo，80% 的提升发生在 step 1-2）：
  1. **Title tag**：关键词在前 60 字符，对照 top3 的 title。单次 title 重写常 2-3 周内移动 2-5 位。
  2. **H1 + intro**：关键词（或同义词）在 H1 和前 200 字。H1 与目标 query 错配 = 最高杠杆的修复点。
  3. **On-page 覆盖**：对照 top3 的子标题，补缺失子主题（"Examples"/"Pricing"/"How it works"）。**80% 的 striking-distance 提升发生在这里**。
  4. **内链**：GSC→Links→Top linked pages 看内链数，从相关内容加 2-5 条，关键词做锚文本。
  5. **Freshness**：对 "best X 2026" 类 query，年度刷新可移动 3-5 位，页面显眼处放 "Last updated"。
- **4 个常见错误**：只改 title 就停（少了 5-8 位的复利）；优化已在 top3 的页（风险>收益，别动赢家）；跳过 SERP 分析（盲改）；改太频繁（Google 几次抓取才重评，一次改完等 4-6 周）。
- **落地**：google-seo-mcp `gsc_quick_wins`（pos 4-15，带 opportunity_score 和"升第3预估增量"，已验证 electricalcabinet 出 30 词）。

### 1.3 Page × Query 交叉 + Cannibalization
- **页面级下钻**（[Rows Full Data](https://rows.com/blog/post/google-search-console-keyword-research)）：锁定单页 → 切 Queries 维度 → 看驱动该页的所有词，判断 Google 实际归类的意图（常与作者预设不符）。
- **cannibalization 诊断**（[Analyseo](https://analyseo.app/blog/striking-distance-keywords-search-console)）：点任一 query → Pages tab → 若同 query 出现 ≥2 URL = 自相竞争，**先合并/区分再优化**；若排名页与意图不符 = 不是改 title 能救的，要重写。
- **批量找自相竞争**（[Fisher SEO](https://fisherseo.com/blogs/news/find-keyword-cannibalisation-using-google-search-console-data)）：Search Analytics for Sheets 导出 query+page 全量，`COUNTIFS` 统计每 query 出现在几个 URL，>1 标红。比 UI 逐条点快两个数量级。
- **落地**：`gsc_search_analytics` dimensions=[page,query]；`gsc_cannibalization`（Mario 版内置，自动检测同 query 多页）。

### 1.4 Content Decay（内容衰减）
- **3 窗口检测**（[SEO Testing](https://seotesting.com/blog/content-decay-tools/)）：Compare 日期 → 90 天对 90 天 → Pages tab 按点击降序，叠加 Position 维度。
  - **真衰减 = 点击掉 + 排名掉** → 内容/权重问题，刷新
  - **只点击掉、排名稳 = CTR 衰减** → 可能 AIO 蚕食或标题过时
- **刷新后主动请求重爬**（[Harbor SEO](https://www.harborseo.ai/content-decay)）：URL Inspection → Request indexing，通常 2-3 周回升；显眼处放 Last updated 日期。
- **落地**：`gsc_content_decay`（Mario 版，自动 3 个 30 天窗口单调下降检测）。
- **Google 官方已产品化**（[2025-06 Insights](https://developers.google.com/search/blog/2025/06/search-console-insights)）：Trending down pages = 官方版 content decay 信号，可作为 3 窗口检测的补充触发器；Trending up queries 直接喂内容选题 backlog。

### 1.5 CTR 机会 —— ⚠️ 警惕 AI 改 meta 反例
- **机会识别**：高曝光 + 低 CTR（<1%）= title/meta 与意图错配信号（[Rows](https://rows.com/blog/post/google-search-console-keyword-research)）。
- **🔴 反常识硬数据**（[Seer Interactive 对照实验](https://www.seerinteractive.com/insights/using-chatgpt-to-rewrite-meta-descriptions-results-in-decreased-performance)）：用 Supernova 监控 Google 改写 meta 频率（>10次/周报警）→ 把改写数据喂 ChatGPT 生成新 meta → 4 页 CTR 同比 **-1.1% / -0.2% / +0% / +0.2%**，而同期对照组（≤2 次改写）CTR 略升。结论：**Google 的算法改写通常是为提升匹配度，强行用 AI "修"反而更糟**。
  - 启示：任何"AI 自动改 meta"工作流必须先小批量灰度，用 GSC CTR 做 4 周对照再决定全量。详见 §4.1。
- **批量生成（谨慎用）**：[Screaming Frog + Custom JavaScript + OpenAI](https://www.screamingfrog.co.uk/seo-spider/tutorials/how-to-crawl-with-chatgpt/)，爬取时每页调 OpenAI 生成 meta，5 分钟几百条。**必须配合上条的对照验证**。
- **落地**：`gsc_ctr_opportunities`（Mario 版，按位置基准找低 CTR 页）。

### 1.6 URL Inspection 高级
- **Live Test 是渲染诊断核心**（[官方](https://support.google.com/webmasters/answer/9012289)）：默认显示索引版（可能几天前），点 "Test Live URL" 才是实时抓取+渲染。两结果对比能发现"索引滞后/渲染差异/JS 资源被 robots 屏蔽"。
- **"Discovered – currently not indexed" 不是 bug**（[Onely](https://www.onely.com/blog/how-to-fix-discovered-currently-not-indexed-in-google-search-console/)）：Google 发现了 URL 但选择不索引，根因是感知价值低/重复/内链弱/抓取预算不足。**修法是提升内链+去重+加唯一价值，不是反复点 Request indexing**（Google 已明确该按钮不强制索引）。
- **批量索引检查**：UI 一次 1 个 URL，大站用 [URL Inspection API](https://www.linkedin.com/posts/jaykishanpanchal_how-to-fix-website-indexing-issues-2026-activity-7447535350597488640-aPlg)（每日免费配额 2000）脚本化全站扫描。
- **落地**：`gsc_inspect_url`（Mario 版，单 URL；批量要循环调用，注意配额）。

### 1.7 Regex 高阶
- **Question query 挖 FAQ/AIO 候选**（[Steve Toth](https://www.linkedin.com/posts/stevetothjr_seonotebook-activity-6787527490517782528-iSTx)）：`^(who|what|where|when|why|how)[" "]`。这些既是 Featured Snippet 候选，也是 AI Overview 最爱引用的答案格式。[Glenn Gabe 完整版](https://www.gsqi.com/marketing-blog/filter-gsc-data-regular-expressions-ga/)：`^(what|how|why|who|when|where|which|can|is|does|are|will|should|do)\b`。
- **按 intent 分桶**（[Shauvik Kumar](https://x.com/shauvikkumar)、[ThatWare](https://thatware.co/finding-seo-content-opportunities-using-ai-and-gsc-regex/)）：
  - comparison：`.*(vs|versus|compared to|alternative).*`
  - buying：`.*(buy|price|cost|cheap|best|review).*`
  - learning：上面的 question regex
  - 完整问句：`.*\?$`（带问号）
- **反向匹配（not matching）**（[官方](https://developers.google.com/search/blog/2021/06/regex-negative-match)）：下拉选 "not matching"，整体排除品牌词/导航词，专注纯获取类 query。比正向枚举非品牌词省事。
- **落地**：`gsc_search_analytics` 返回 query 后本地 regex 分桶（MCP 不直接支持 regex 参数，需拉全量后过滤）。

### 1.8 内容覆盖检测 + AI 取用优化（"排着名但没回答"的词）

> 来源：[虾·GSC SEO 优化 6 步 SOP](https://mp.weixin.qq.com/s/3alHEAclY5ORopPmYDK9nQ)（2026）

**核心洞察**：GSC 给你曝光的词，不等于你正文回答了的词。Google 在说"我认为你涉及这个主题，但你没讲清楚"。

**识别方法**（GSC Performance → 按页面反查词 → 对照正文）：
- 逐个看页面拿到的搜索词，找"有曝光但正文没正面回答"的词
- 案例：《XX产品选购指南》被匹配上"XX产品能不能退货"，但文章没有"退货"段落 → Google 给了曝光机会但页面没接住

**AI 优化指令模板**（别说"帮我优化"，要具体到这个程度）：

```
下面是这个页面在 Google 上拿到曝光的搜索词，以及页面正文。
请找出：哪些词页面拿到了排名，但正文并没有直接回答。
对每一个这样的词，写一个独立的内容块，结构是：
1. 一个小标题（H2/H3/H4）——标题措辞贴近搜索词原文
2. 紧跟 1-2 句话，直接给答案
3. 再跟 2-3 条支撑：数据、例子、要点
```

跑完后再补一步：把排在你前面的 2-3 个竞品页面也喂给 AI——目的是让机器先认出你是同类（SERP 第一页 = Google 认可的"标准答案"格式），再发现你多给了新东西。

**AI 取用硬数据**（来源：Dan Petrovic / DEJAN 测试 Google 答题系统）：
- Google 答一个题总共只取约 **1900 词**，分给多个站，**单站中位数仅 377 词**
- 页面长度 vs 取用率：

| 页面长度 | 内容被取用比例 |
|---------|-------------|
| 5000 字符以内 | **66%** |
| 5000-10000 字符 | 42% |
| 10000-20000 字符 | 25% |
| 20000 字符以上 | **12%** |

> 你写了 5000 字，它就取那 377 词。越长的页面，被取用的比例越低。

**写作原则：写出"经得起被切的段落"**：
- ❌ **不要刻意切 100-300 词小块**（Danny Sullivan 官方原话："We don't want you to do that... We really don't."）
- ✅ 每句话离开上文也能读懂（别用"它""这个"这种指代不明的词开头）
- ✅ 关键结论放前一两句（answer-first）
- ✅ 答案和证据在同一段（否则 AI 可能只取走其中一段，读到的人不知道在说啥）

**新鲜度对比逻辑**（来源：2024 Google 内部文档泄露）：
- 参数 `result_set_age_*_percentile_in_days`：Google 把**同词下所有排名页面的年龄**排队，看你站在什么位置
- "领带怎么打"：2014 年页面依然算新鲜（对手都老）→ **新鲜是跟对手比出来的，不是看日历**
- "iPhone 17 评测"：9 天前的已经算旧（对手 2 天前发）
- **判断方法**：拉这个词排前十的页面，看它们上次更新时间，明显比中位数老就该动
- ❌ 只改日期不改内容 = 假更新，没用。真正算数的是：换过时数据、加新案例、按当前意图重写段落、删失效引用

---

## 2. 2026 GSC 新维度（必须知道的，多数很新）

### 2.1 ⭐ Search Generative AI 性能报告（2026-06-03 官方上线）
[官方公告](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)：GSC 新增独立报告，把 **AI Overviews 和 AI Mode 的曝光/点击从普通 web 搜索拆出来单独呈现**。这是过去两年最大的 GSC 数据结构变化——**AIO 流量首次可量化**。
- 报告含：Impressions（URL 在生成式 AI 功能的出现次数）、Pages、Countries、Devices、Dates（小时/日/周/月粒度）。
- 仍在分批灰度（subset of websites），未全量。
- 意义：终于能算"AIO 到底吃了多少点击"。

### 2.2 AIO 曝光的 3 层规则（[Brodie Clark 实验](https://brodieclark.com/ai-overviews-google-search-console/)，867 次曝光实测）
- **Tier1 默认可见**：页面加载即计曝光（同 featured snippet）。
- **Tier2 部分可见**：点 "show more" 才计曝光（CTR 看似高，因分母小）。
- **Tier3 隐藏**：需展开才计曝光——Sundar Pichai 说的"高 CTR"就指这层，但**绝对流量低**。
- **整个 AIO 卡片只占 1 个 position**，所有引用链接共享该 position。
- Search Labs（烧杯图标）数据**不计入** GSC。
- 启示：position 看起来没掉但点击掉 → 先查该 query 是否新增 AIO。

### 2.3 AIO 蚕食的量化
- 2026 年 AIO 出现率约 48%（同比 +58%）；**SERP 含 AIO 时，下方自然结果 CTR 下降 34-61%**（[TheStacc](https://thestacc.com/blog/google-ai-overview-statistics/)）。
- 推断链：排名 1-3 但 CTR 崩 → 大概率被 AIO 吃 → 改内容结构适配 AIO 引用（答案前置、结构化、可引用片段）。
- 反常识：[被 manual action 的站仍能进 AIO](https://www.gsqi.com/marketing-blog/how-to-track-aio-performance-gsc-manual-action/)（Glenn Gabe）——AIO 收录逻辑与常规索引不完全一致。

### 2.4 Branded Filter / Annotations / AI 配置 / 社交渠道（2025-11~12 密集上线）
- **Branded filter**（[官方 2025-11](https://developers.google.com/search/blog/2025/11/search-console-branded-filter)）：AI 自动分类品牌词，见 §1.1。
- **Custom Annotations**（[官方 2025-11](https://coywolf.com/news/seo/google-adds-custom-annotations-to-search-console/)）：在 Performance 图表打事件标签（改版/宕机/Core Update/迁移），团队回溯流量波动一眼看到"那天发生了什么"。配合周/月聚合视图消除周末噪声。
- **AI-Powered Configuration**（[官方 2025-12](https://developers.google.com/search/blog/2025/12/ai-powered-configuration)）：Performance 里用自然语言描述（"对比移动端和桌面端品牌词在美国的点击"），GSC 自动转成 filters+comparisons。**Google 自己提醒需人工复核准确性**。
- **社交渠道进 Insights**（[Brafton](https://brafton.com/blog/seo/a-renewed-way-to-maximize-google-search-console-in-2026/)）：YouTube 等社媒搜索表现并入 Insights，首次跨渠道同框。

### 2.5 2025-2026 GSC 新功能速查（搜索 + 专家验证）

| 功能 | 上线 | 用途 | 来源 |
|------|------|------|------|
| **Query Groups** | 2025-10 | Google AI 自动把语义相似 query 聚类成组，整体报告 clicks/impressions——**官方版 query cluster**（替代我们 §8.3 手动聚类） | [官方](https://developers.google.com/search/blog/2025/10/search-console-query-groups) |
| **Recommendations** | 2024-08 起 | Google 主动给每个站列"按优先级排序的个性化优化建议"——**Google 告诉你下一步修什么**，gsc-radar 阶段 1 应先读这个 | [官方](https://developers.google.com/search/blog/2024/08/search-console-recommendations) |
| **Insights Trending Up/Down** | 2025-06 | 官方产品化 content decay 信号：Trending down pages = 需刷新；Trending up queries = 新选题来源 | [官方](https://developers.google.com/search/blog/2025/06/search-console-insights) |
| **API 小时级数据** | 2025-04 | API 支持 hourly breakdown，每天 192 个新数据点，用于日内异动诊断 + 算法更新实时监测 | [官方](https://developers.google.com/search/blog/2025/04/hourly-data) + [Lily Ray](https://x.com/lilyraynyc) |
| **Weekly/Monthly 视图** | 2025-12 | Performance 新增周/月聚合，消除周末噪声（配合 Custom Annotations 使用） | [官方](https://developers.google.com/search/blog/2025/12/weekly-monthly-views) |
| **AI Mode Position 陷阱** | 2025-06 | AI Mode 内"链接组"= position 1，嵌入链接仅点击后记 impression；混入 Web 数据会**污染 position 均值** | [Brodie Clark](https://brodieclark.com/ai-mode-google-search-console/)（万人实验） |

> **UK CMA 强制背景**（[Marie Haynes](https://www.mariehaynes.com/new-aio-and-aimode-info-in-gsc/)）：Google 发布 AIO 数据不是出于好心，是英国竞争与市场管理局（CMA）强制要求透明度。发布者可在 GSC 内 opt-out 阻止内容被 AI 使用（但 opt-out AIO ≈ opt-out Search，**绝大多数站不应 opt-out**）。Marie 的 AI 优化 prompt："这页有什么是 AI Overview 没答的？为什么用户仍要点击？"

---

## 3. ⭐ GSC + SERP 反查联动（AI 自动化核心，最值钱）

这一章是"用 AI 自动化"的真正主战场——不只是拉 GSC 数据（§1），而是 **GSC 发现机会 → SERP 反查竞品 → 生成具体改进**。

### 3.1 两段式 Agent 架构（[CXL n8n 实战](https://cxl.com/blog/seo-workflow-n8n-automation/)）
业界最清晰的实战架构，刻意不用 Ahrefs/Semrush：
- **Agent 1（轻、高频）**：从 GSC 找出 top 10 改进页/机会词。
- **Agent 2（重、按需）**：对每个目标，用 SERP API 抓排名前列文章 + 抓 Google AI summary + scrape 竞品内容 + 与自家文章比对 → 出具体改进点。
- 分离的原因：第一个要高频扫，第二个要深度分析，合一起会 choke（见 §4.2）。
- **落地**：这正是我们 **gsc-radar 单 skill 两阶段**的设计依据（阶段1扫描=Agent1 / 阶段2深挖=Agent2）。合为一个 skill 而非两个，因为 Claude 调 MCP 工具只返回 top N 结构化结果、不碰全量数据，无 CXL 那种 choke；一个命令走全流程，Claude 按意图路由阶段。

### 3.2 年轻站/页反查 = 高 ROI 信号（[Glen Allsopp 战术 1+3](https://detailed.com/advanced-keyword-research/)）
Glen 称这是他"13 年 SEO 做过最聪明的事"：
- **核心论点**：如果 <2 年的新站/新页能排进某词的前两页，说明 Google 对该词"青睐新鲜内容/站"，老站没占满——**这些词对你也易攻**。
- **执行**：拉一批 500-5000 月搜的 niche 词 → Google 搜每个 → 排名站过 Whois/Archive 查年龄 → <2 年的站排名好 = 命中。
- **年轻页版本**（战术3）：site: 搜大站 + 日期范围筛 3-8 周前发布的文章 → 看哪些新页已拉流量（用图片 URL 上传日期交叉验证真实发布时间，绕过改日期）。
- **落地**：`serp_check`（Mario 版）拉 SERP → web-access/Whois 查排名域年龄 → 筛"年轻站排名"的词。

### 3.3 Google CSE 监控竞品新内容（[战术2](https://detailed.com/advanced-keyword-research/)）
- 用 Google Custom Search Engine 限定搜竞品站 → `intitle:` + 月份/年份 看对手最新目标词。
- 进阶：CSE 的 Search Features > Advanced 支持按 schema key 排序（如按 review-RatingCount、metatags-DateModified）→ 找竞品"高评论数页"或"刚更新页"。
- **落地**：web-access + CSE；或 `serp_check` 限定竞品域。

### 3.4 "弱结果"超车（[战术4](https://detailed.com/advanced-keyword-research/)）
- 找排名好但内容薄/旧的结果（forum 老帖/quora 未答/yelp 纯列表）→ 这些是易超车机会。
- Glenn 的例子：MakeupTalk 一个 4 年没更新的帖排"is ipsy worth it"；Reddit r/Succulents 一个 15 评论、无人真正回答的帖排该意图词。
- **落地**：SERP top 结果 → 评估内容质量/更新时间 → 标"弱结果可超"。

### 3.5 核心更新后用 GSC 导出 + 浏览器 agent 对比排名（[Marie Haynes](https://www.mariehaynes.com/use-chatgpt-operator-to-check-your-rankings-immediately-following-a-google-core-update/)）
- Google 核心更新发布当天，GA4 数据有延迟，GSC 也滞后。
- 解法：导出 GSC 最近 7 天 top 15 关键词及排名 → 丢给 ChatGPT Operator/Project Mariner（浏览器 agent）→ prompt"逐个搜索，给旧排名 vs 今天排名对照表"→ ~10 分钟出快照。
- **落地**：`gsc_search_analytics` 导出 top 词 → web-access（浏览器 agent）逐个搜并对比。

### 3.6 AI 分析 prompt 模板（实战版，来源 [NextGrowth.ai](https://nextgrowth.ai/n8n-google-search-console-automation/)）

> 不要把 25000 行原始数据丢给 AI。**先预聚合为 500 词结构化摘要**，再让 AI 输出可执行的优先级清单。

**数据预处理**（喂 AI 前必做）：
- Top 20 pages by impressions（流量集中度）
- Top 20 queries by clicks（核心词）
- Pages with CTR < 2% and impressions > 500（低 CTR 机会）
- Pages with position 6-15 and impressions > 200（page 2 机会）

**Prompt 模板**：

```
You are an SEO analyst reviewing weekly Google Search Console data.

SITE: {site}
DATE RANGE: {weekStart} to {weekEnd}
TOTAL CLICKS: {totalClicks} (vs {priorClicks} prior week)
TOTAL IMPRESSIONS: {totalImpressions}

TOP TRAFFIC DROPS (pages down 20%+ week-over-week):
{trafficDropsList}

PAGE 2 OPPORTUNITY PAGES (position 6-15, impressions > 200):
{page2OpportunityList}

HIGH IMPRESSION / LOW CTR PAGES (CTR < 2%, impressions > 500):
{lowCTRList}

Task: For each category above, provide:
1. The most likely cause (1 sentence)
2. The recommended action (1-2 sentences, specific)
3. Priority: HIGH / MEDIUM / LOW

Format as a JSON array of objects with keys:
url, category, cause, action, priority
Return only valid JSON. No markdown wrapper.
```

> **成本参考**：GPT-4o-mini 每次分析 $0.02-0.05，每周一次 ≈ $0.10-0.20/月/站。
>
> **Claude Code 适配**：在 Claude Code 会话中，用 `gsc_search_analytics` / `gsc_quick_wins` / `gsc_ctr_opportunities` 三个 MCP 工具拉数据 → 手工或脚本预聚合到上面的模板格式 → 喂给 Claude 分析。不需要 n8n。

---

## 4. ⚠️ 反常识与避坑（最值钱的护栏，每个自动化项目必读）

### 4.1 AI 改 meta 可能降 CTR（Seer 对照实验）
见 §1.5。**所有"AI 自动改 title/meta"工作流必须前置这道校验门**：先 5 页灰度、4 周 GSC CTR 对照、对照组同步看，确认不降再全量。否则可能在系统性地伤害自己。

### 4.2 LLM Agent 处理大 GSC 数据会 choke（CXL 教训）
- n8n AI Agent 处理 2000 行 GSC 导出 → **卡死 15-20 分钟无响应**；同样 prompt+数据丢 ChatGPT Code Interpreter **不到 1 分钟**（Code Interpreter 沙箱批处理 vs n8n 逐行 LLM 调用）。
- 修复：分析窗口从 1 月缩到 1 周（~500 行）才跑通。
- **落地铁律**：任何 GSC 自动化要**限数据量**（top N，不拉全量）+ 优先用结构化批处理而非逐行喂 LLM。

### 4.3 最有效的自动化往往不是 AI（[25K→80K 实战](https://www.reddit.com/r/n8n/comments/1jeuzjg/automation_workflows_that_grew_my_traffic_from/)）
- 作者把流量从 25K 做到 80K clicks，发现最稳的是 **rank tracking、内容 refresh、SERP 监控这类简单确定性工作流，"大部分不需要 AI"**。
- 启示：别迷信 agent。确定性脚本能做的（拉数据、算 delta、排优先级）就用脚本，LLM 只用在"生成建议/判断意图"这种真正需要它的环节。

### 4.4 其他坑
- **"Discovered – not indexed" 不是 bug**（§1.6），是质量信号，反复 Request indexing 无用。
- **domain property 必须 `sc-domain:` 前缀**，否则部分工具静默失败。
- **GSC 三出口数据不一致**（[Marco Giordano](https://www.linkedin.com/posts/marco-giordano96_a-look-into-google-search-console-and-its-activity-7381991862695415808-om2t)）：UI / API / BigQuery 三个出口有 "different truths"，大站分析要统一用 BigQuery 源。
- **GSC UI 每 query 最多 1000 行、16 个月历史**——大站要绕开，用 BigQuery Bulk Export（URL×Query×Date 全量，无上限）。

### 4.5 🔴 Indexing API 红线 + AI 内容损害 crawl demand
- **Indexing API 仅限 `JobPosting` 和 `BroadcastEvent`**（[Onely 2026-03](https://www.onely.com/blog/how-to-fix-discovered-currently-not-indexed-in-google-search-console/)）：批量提交普通页面**违反 Google 反垃圾政策**，风险整域被标记。正确做法：更新 XML sitemap + 优化内链。
- **未编辑的大规模 AI 内容主动损害 crawl demand**（2025-05 Google 质量审查情报）：Google 把整域 AI 内容比例纳入 crawl 优先级评估——AI 内容越多，Googlebot 越不愿抓取。**placeholder 模式批量生产的内容需监控 crawl rate 变化**。
- **Crawl budget 阈值**（Google 官方）：只有 >100 万唯一页 或 1 万+页且每日快速变化才需担心。小站"Discovered – not indexed"几乎都是 crawl demand（质量/流行度）问题而非容量问题。

### 4.6 三个自动化反模式（来源 [NextGrowth.ai](https://nextgrowth.ai/n8n-google-search-console-automation/)，对 Claude Code 同样适用）
1. **不要每次会话都跑全套 GSC 分析**：数据日复一日变化不大，AI 分析只在异常时触发（掉量/排名异常/核心更新后）。日常只拉数据到 Sheets，周报才跑 AI。
2. **不要把 MCP 工具调用当产品**：价值在 SEO 洞察，不在调了多少个工具。14 条告警/周里只有 2-3 条值得行动。
3. **数据预处理再喂 AI**：不要把 25000 行原始 GSC 数据直接丢给 Claude——先聚合为 500 词结构化摘要（top 20 掉量页 / position 6-15 机会 / 低 CTR 页），再让 AI 输出优先级。

---

## 5. 工作流架构（落地设计）

基于 §3.1 两段式 + §4 避坑。**三段同属 gsc-radar 单 skill**（合为一是因为 MCP 工具只返 top N、无 choke；Claude 按意图路由阶段）：

```
┌─ gsc-radar（轻 / 高频 / 每周）─────────────────┐
│  限 top N 防 choke（§4.2）                       │
│  ├─ gsc_quick_wins（pos4-15，品牌词过滤 §1.1）   │
│  ├─ gsc_ctr_opportunities（低CTR，标注待灰度）   │
│  ├─ gsc_content_decay（3窗口真衰减）             │
│  ├─ gsc_traffic_drops（ranking/ctr/demand分类）  │
│  └─ gsc_cannibalization（同query多页）           │
│  输出：结构化「本周优化清单」+ 每项建议           │
└──────────────────────────────────────────────────┘
            │ 选高优先级目标（机会词/掉量页）
            ▼
┌─ 阶段2·深挖（gsc-radar，重/按需/单目标）──────┐
│  复刻 CXL Agent 2（§3.1）                        │
│  ├─ serp_check 拉 SERP top                      │
│  ├─ serp_aio_monitor 看 AIO 是否蚕食（§2.3）     │
│  ├─ web-reader 抓竞品 top3 内容                  │
│  ├─ 弱结果识别（§3.4）/ 年轻站反查（§3.2）       │
│  └─ Claude 对比自家页 → 具体改进清单             │
│  输出：可执行的改 title/补子主题/加内链指令      │
└──────────────────────────────────────────────────┘
            │ 执行改进
            ▼
┌─ 验证闭环（4-6 周后）─────────────────────────┐
│  history_save_snapshot（优化前）                 │
│  → GSC Custom Annotation 标"优化了X"（§2.4）     │
│  → 4-6 周 history_diff 看是否回升                │
│  → AI 改 meta 的必须先灰度对照（§4.1）           │
└──────────────────────────────────────────────────┘
```

**多语言站特殊处理**（electricalcabinet 有 ja/fr/it/ar/tr/es/de）：按语言分组报告，多语种长尾（如 スイッチギア、断路器、fusibile elettrico）单独列——这些往往是低竞争高意图的金矿。

---

## 6. 落地映射：技巧 → google-seo-mcp 工具

| 技巧（章节） | MCP 工具 | 关键参数/输出 |
|---|---|---|
| Striking distance（§1.2） | `gsc_quick_wins` | site_url, days=90, min_impressions; 输出 opportunity_score + estimated_extra_clicks |
| CTR 机会（§1.5） | `gsc_ctr_opportunities` | 输出低CTR页 + 该位置预期CTR；**⚠️改前看§4.1** |
| 内容衰减（§1.4） | `gsc_content_decay` | 自动3个30天窗口单调下降 |
| 掉量分类（§1.4） | `gsc_traffic_drops` | diagnosis: ranking_loss/ctr_collapse/demand_decline/disappeared |
| 自相竞争（§1.3） | `gsc_cannibalization` | 同query≥2页 |
| Page×Query（§1.3） | `gsc_search_analytics` | dimensions=[page,query] |
| 品牌词分离（§1.1） | `gsc_search_analytics` | 拉全量query后本地regex分桶 |
| Question/Intent regex（§1.7） | `gsc_search_analytics` | 拉query后本地regex（how/why/vs/buy） |
| URL 索引诊断（§1.6） | `gsc_inspect_url` | 单URL；批量循环注意2000/日配额 |
| AIO 蚕食推断（§2.3） | `serp_aio_monitor` | 批量查关键词AIO存在性 |
| SERP 反查竞品（§3.1-3.4） | `serp_check`/`serp_paa_extractor` + web-reader | 拉SERP+抓竞品+Claude对比 |
| 核心更新后排名快照（§3.5） | `gsc_search_analytics` + web-access | 导出top词+浏览器agent逐个搜 |
| 验证闭环（§5） | `history_save_snapshot`/`history_diff` | 优化前后对比 |

---

## 7. Skill 落地

**单 skill `gsc-radar`（两阶段）**，已建于 `~/.claude/skills/gsc-radar/SKILL.md`：

| 阶段 | 做什么 | 对应章节 |
|---|---|---|
| 阶段1 扫描 | GSC 内部切片（quick_wins/ctr/decay/drops/cannibalization + 品牌词过滤），限 top N 防 choke | §1 + §5 上 |
| 阶段2 深挖 | 针对目标拉 SERP+AIO+竞品，生成具体改进（§1.2 五步 playbook） | §3 + §5 中 |
| 复查闭环 | history_save_snapshot + annotation + 4-6周 diff | §5 下 |

> 合为一个 skill 而非两个（原计划 gsc-radar + serp-deep-dive 已合并）：Claude 调 MCP 工具只返回 top N 结构化结果、不碰全量数据，无 CXL 那种 choke；一个命令走全流程，Claude 按意图路由（"扫一下"→阶段1，"深挖X"→阶段2）。

与现有 SEO skill 协同：`seo-audit`（技术审计）、`competitor-analysis`（竞品）、`content-refresher`（内容刷新）、`blog-google`（Google API）—— gsc-radar 产出机会清单后，可调用 content-refresher 落地刷新、competitor-analysis 做竞品深挖。

---

## 8. 竞品吸收增强（2026-06 调研 AnalySEO/Suganthan/Serploom/NEURONwriter）

> gsc-radar SKILL.md 已整合执行层。以下方法论补充。

### 8.1 防幻觉三原则（来源 [Suganthan GSC MCP v1.1.0](https://suganthan.com/blog/google-search-console-mcp-server/) 三层）
AI 出 GSC 分析最致命是数字幻觉（把 312 clicks 说成 350、臆断"核心更新导致"无证据）。三层防护：
1. **Guardrail prompts**：工具描述写死"只基于返回数据分析，报精确数字，不知道就说不知道"
2. **Data provenance**：每响应带 `_meta`（source/tool/params）— google-seo-mcp 已内置
3. **verify_claim**：结论前 re-query API 核对关键数字 — skill 收尾可选自检 top3 数字（成本 3 次额外调用，自用可接受）

### 8.2 content_gaps：该写未写选题（来源 Suganthan）
`gsc_search_analytics` filter `position>20 AND impressions>100` → 有曝光但排不上的 query = 真实需求未覆盖。
- 比 keyword research 准（站内真实曝光=真实需求，非估算）
- 直接喂内容生产 SOP（Crystal Meaning / Condition 等）
- 多语种 query 单独列（如 スイッチギア/断路器 = 低竞争高意图金矿）

### 8.3 Query cluster → 补 H2（来源 [Serploom](https://serploom.com/blog/gsc-quick-wins) / [NEURONwriter](https://neuronwriter.com/striking-distance-audit-gsc-2026/)）
单页 N≥5 相关 query 卡 pos 11-20 且语义聚集 = **内容深度不够**的精确信号。
- `gsc_search_analytics` dim=[query,page] 过滤该 page，统计 query 数 + 位置集中度
- 输出"建议补 H2：[query1]/[query2]..."
- 比 NEURONwriter 的 NLP semantic gap 接地气（用真实 GSC query 而非 NLP 打分）

### 8.4 CTR 7 档 benchmark（来源 [Serploom 2026](https://serploom.com/blog/gsc-quick-wins)）
ctr_opportunities 输出必须**透明展示 benchmark**（非黑箱分数），让用户看到推导过程：

| position | 预期 CTR |
|---|---|
| 1 | 25-35% |
| 2 | 12-18% |
| 3 | 8-13% |
| 4 | 6-9% |
| 5 | 5-8% |
| 6-7 | 3-6% |
| 8-10 | 2-4% |

每条标"你 pos X 该 Y%，实际 Z%，gap Δ"。加 **device pivot**（`dim=[query,device]`，mobile vs desktop 差 >5 位 → flag mobile 落后，跑 `lighthouse_audit strategy=mobile`）和 country pivot（未开发市场/本地化机会）。

### 8.5 content_recommendations 决策融合（来源 Suganthan）— 从工具升级成助手
把 quick_wins + decay + drops + cannibalization + content_gaps 融成**单一优先级行动队列**（避免用户自己拼）：

| 动作 | 来源 | 排序 |
|---|---|---|
| **UPDATE**（改现有页） | quick_wins + decay + ctr_opportunities | 按 impressions × lift_potential |
| **CREATE**（建新内容） | content_gaps query | 按 impressions |
| **CONSOLIDATE**（合并/区分） | cannibalization 对 | 标 merge/differentiate |

每条带：目标 URL/query + 调哪个 MCP 验证 + 下一步动作。这是 skill 从"分析工具"到"决策助手"的质变。

### 8.6 阶段2 竞品深挖 × 知识库 RLM §1B-1D（2026-06-22 重大修正）

> ⚠️ **修正**：竞品分析主力是 **SEMrush 数据 + Sitemap + Seed-Master 证据**，不是 web_reader 浅抓页面。曾误把 web_reader 当主力，已修正 gsc-radar SKILL 关联段。

**知识库竞品分析体系（RLM 营销方法论 §1A-1H，水晶站实证）**：
1. **数据采集（1B 五轨道并行）**：轨道A `semrush_to_sheets.py`（Domain Overview/AS/Organic Traffic/流量渠道）+ 轨道C SEMrush Top Pages/Keywords（水晶实证：36 竞品 / TopKeywords_All **45,418 行** / TopPages_All **7,498 行**）+ 轨道E `sitemap-mcp`（全站页面清单）+ 轨道B/D Seed-Master（**47,745 条 × 24 列**）+ 证据回填
2. **证据验证**（轨道D/Keyword-Page-Proof）：`track_d_backfill.py` 验证竞品 query **真有流量**（非猜）
3. **深度拆解（1D，套 9 章节模板）**：核心输入是 SEMrush Top Pages/Keywords + Sitemap + Seed-Master + 证据（**不是页面 H2/字数**），分层 P0-P3，见 `01-营销方法论基础/01-竞品研究/1D-竞品深度拆解模板.md`
4. **跨竞品汇总（1E 结构/1F 内容/1G 用户/1H 策略）** + **社区逆向**（`选品方法论/04-竞品与社区逆向挖掘法.md`：Reddit 9 步法/评论 Q&A/亚马逊搜索词逆向）

**web_reader/web-access 的真实位置**：深度拆解模板的「辅助输入·核心页面轻量复核」，按需验证结构，**非主力数据源**。

**gsc-radar 阶段2 编排**：GSC 定位词（第一方）→ `serp_check` 看 SERP 竞品（L1 元信息）→ 对 top 竞品跑轨道 A/C/E（SEMrush + Sitemap）→ 套 9 章节深度拆解模板 → `track_d_backfill` 验证证据 → `topic_discovery`/`map_page_type` 找主题缺口；web_reader 仅复核关键页面。

**实测发现（electricalcabinet 阶段2，2026-06-22）**：`sitemap-mcp` 对 KDM Steel/E-Abel 探测返回 0（非标准 sitemap 位置/屏蔽）+ `get_sitemap_pages` 报 `TypeError`（MCP 内部 bug）→ 触发模板「数据缺失降级规则」：缺 Sitemap 降级到 Top Pages + 核心页面爬取（web-access）；SEMrush 轨道需 Tabbit `--remote-debugging-port=9222` 登录 semrush.com + 项目级竞品总表。**教训**：做竞品分析前先确认 SEMrush/Sitemap 可获取性，缺失时按降级规则走，不硬抓页面假装完整分析。

### 我们的差异化（不抄竞品，保持优势）
- **GA4↔GSC 跨域归因**（`cross_opportunity_matrix` / `cross_seo_to_revenue_attribution` 等）— Suganthan/Serploom/AnalySEO 全部只到 GSC clicks 层，**我们到 revenue**，回答"优化哪页能赚钱"而非"优化哪页能涨流量"。降维打击。
- **阶段2 SERP 反向工程 + Claude 5步 playbook**（年轻站/弱结果策略判断 + LLM 动态生成，NEURONwriter 是固定 NLP 打分）
- **history diff 复查闭环**（Suganthan 有 generate_report 存盘但**无 diff**，我们有 history_diff 能答"两周前 vs 现在 quick win 进步没"）

### 8.7 工具覆盖度与扩展路线（google-seo-mcp 全族 vs gsc-radar）

google-seo-mcp 是 100+ 工具的能力底座（14 大类），gsc-radar 目前只编排约 12 个（GSC + SERP + History 三族，约 1/8），跑通了最高 ROI 的 GSC 机会挖掘闭环。**未覆盖的大块 = 扩展空间**：

| 类别 | 工具数 | gsc-radar | 扩展价值 |
|---|---|---|---|
| GSC | 12 | ✅ 阶段1主力 | — |
| SERP | 4 | ✅ 阶段2 | — |
| History | 3 | ✅ 复查闭环 | — |
| **Cross（GSC×GA4）** | 6 | ❌ 未编排 | ⭐⭐⭐ 落地 §8.6 revenue 差异化：`cross_opportunity_matrix`（机会×转化四象限）+ `cross_seo_to_revenue_attribution`（query→收入）接入决策队列，从"涨流量"升级到"赚钱" |
| **AEO** | 3 | ❌ 未编排 | ⭐⭐ `serp_aio_monitor` 已发现 AIO 蚕食，但"适配 AIO"（`aeo_ai_bots_robots_audit` 放行 AI 爬虫 / `aeo_llms_txt_check`）没接上 |
| **CrUX** | 3 | ❌ 仅原则提 | ⭐⭐ 防幻觉原则要 ranking_loss 附证据，`crux_history` 同期 LCP 回归即现成证据，应常态化 |
| GA4 | 14 | ❌ | 行为分析，部分靠 Cross 间接覆盖 |
| Schema | 3 | ❌ | CREATE 时 `schema_validate_url` 前置检查 |
| Logs/Migration/Suggest-Trends/IndexNow | 45+ | ❌ | 技术 SEO/迁移，不同赛道，按需另开 skill |

**扩展优先级**：① Cross 族接决策队列（revenue）→ ② AEO 族接 AIO 适配 → ③ CrUX 接掉量诊断证据。三步把 gsc-radar 从"流量机会雷达"升级成"收入+AI搜索+性能全维度决策助手"。

> 工具清单随版本变，用 `get_capabilities` 动态查；本表只记稳定的"类别→覆盖度"映射。

---

## 附录：关键来源索引（均可访问，2026-06 验证）

**Google 官方（最权威）**
- [Search Generative AI 性能报告（2026-06）](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)
- [AI-Powered Configuration（2025-12）](https://developers.google.com/search/blog/2025/12/ai-powered-configuration)
- [Branded queries filter（2025-11）](https://developers.google.com/search/blog/2025/11/search-console-branded-filter)
- [Custom Annotations（2025-11）](https://coywolf.com/news/seo/google-adds-custom-annotations-to-search-console/)
- [URL Inspection 工具](https://support.google.com/webmasters/answer/9012289)

**专家深度长文（一手）**
- [CXL – n8n AI SEO agent 实战（含 choke 教训 + 双 agent）](https://cxl.com/blog/seo-workflow-n8n-automation/)
- [Detailed.com – Glen Allsopp 高级关键词 4 战术](https://detailed.com/advanced-keyword-research/)
- [Brodie Clark – AIO 在 GSC 的追踪实验](https://brodieclark.com/ai-overviews-google-search-console/)
- [Analyseo – Striking Distance 完整 playbook](https://analyseo.app/blog/striking-distance-keywords-search-console)
- [Rows – GSC 关键词研究（4x 增量区）](https://rows.com/blog/post/google-search-console-keyword-research)
- [Seer Interactive – AI 改 meta 反例（对照实验）](https://www.seerinteractive.com/insights/using-chatgpt-to-rewrite-meta-descriptions-results-in-decreased-performance)
- [Glenn Gabe/GSQi – Regex + Delta Report + AIO manual action](https://www.gsqi.com/marketing-blog/filter-gsc-data-regular-expressions-ga/)
- [Marco Giordano – GSC + BigQuery URL 级分析](https://www.linkedin.com/posts/marco-giordano96_a-look-into-google-search-console-and-its-activity-7381991862695415808-om2t)
- [Marie Haynes – 核心更新后用 Operator 查排名](https://www.mariehaynes.com/use-chatgpt-operator-to-check-your-rankings-immediately-following-a-google-core-update/)
- [Onely – Discovered not indexed 详解](https://www.onely.com/blog/how-to-fix-discovered-currently-not-indexed-in-google-search-console/)
- [Steve Toth – Question regex](https://www.linkedin.com/posts/stevetothjr_seonotebook-activity-6787527490517782528-iSTx)

**工具/产品化参考**
- [Suganthan – GSC MCP 20 工具](https://suganthan.com/blog/google-search-console-mcp-server/)
- [Suganthan – BigQuery MCP 32 工具（revenue per keyword）](https://suganthan.com/blog/bigquery-mcp-server/)
- [Screaming Frog + ChatGPT 批量 meta](https://www.screamingfrog.co.uk/seo-spider/tutorials/how-to-crawl-with-chatgpt/)
- [Profound – GSC 节点 + AI 搜索可见性](https://www.tryprofound.com/blog/introducing-google-search-console-nodes-for-profound-agents)

**反 AI 优先的实战**
- [25K→80K clicks：最有效的自动化多不需要 AI](https://www.reddit.com/r/n8n/comments/1jeuzjg/automation_workflows_that_grew_my_traffic_from/)


<!-- ======== 第 III 部分：C 端 GEO 五段旅程布局工作流（原 20-C端GEO五段旅程布局工作流.md，2026-09-14 并入）======== -->

# C端项目 GEO 五段旅程布局工作流

> **定位**：C 端项目的 GEO 布局必读工作流——立项前读（判断品类空间+提前布局基础设施）、内容排期读（五段配比）、运营复盘读（基线测试与缺口修补）
> **适用场景**：任何 C 端独立站项目（B2C 实物/工具订阅）
> **边界与衔接**：AI 引用机制与平台差异见 03-SEO与GEO/03；pSEO 规模化见 03-SEO与GEO/12；AISV 监测方法论见 03-SEO与GEO/13。本文只管"何时做什么"
> **创建**：2026-09-14，基于交易意图 prompt 分类学专项调研（Profound 50M / OpenAI 官方论文 / Adobe 零售计量 / peec 50万商业 prompt 等多源，全量来源在文末）

---

## 为什么按"五段旅程"布局（定量锚点）

| 数据点 | 数值 | 含义 |
|---|---|---|
| 交易型意图：传统搜索 vs ChatGPT | 0.6% → **6.1%**（约10倍，唯一在 AI 端放大的意图） | 购买问题正在涌进对话——交易段 prompt 就是出单位置 |
| AI 引荐流量转化率 | 比非 AI 高 **42%**（Adobe，一年前还是低 38%，完全反转） | AI 流量少而精 |
| 商业 prompt 触发实时搜索 | **53.5%**（信息型仅 18.7%） | 商业问题 AI 必联网=引用机会 |
| 购买前平均 prompt 数 | **6.3 个**（22% 用户要 10+） | 单页打法失效，需整段覆盖 |
| 用户最终选择 | **74% 选 AI 回答中提及最多的品牌** | 缺席=把名字让给竞品 |
| 品类品牌格局 | **53.7% 品类无定局品牌**（prompt 间漂移严重） | 新站有机会，但单次测试是噪声 |
| 购后搜索 AIO 触发率 | **94.4%（全漏斗最高）** | 购后内容=最低成本可见性位置 |
| ChatGPT 购物卡数据源 | **100% 由 Google Shopping 有机 top40 解释**（Bing 仅~11%） | GMC feed 是购物卡开关；小品牌接入后最快一天出现 |

## 五段 × 布局动作 × 时机（主表）

| 段 | 典型 prompt 形态 | 布局动作 | 时机 |
|---|---|---|---|
| **1 发现** | best X for [use case] / X ideas / [price 约束]+品类（"under $200"前置）/ 场景化描述原话 | 非品牌词内容矩阵；标题与小节匹配 fanout 自动加词（best/review/2026/top/vs）；AI 端 fanout 会把 1 个头查询拆 4-20 个子查询——覆盖子意图而非主词 | 内容排期时：非品牌发现词占内容矩阵大头 |
| **2 考虑** | X vs Y / best alternatives to [竞品] / does X support [条件] / [Brand A] vs [Brand B] for [persona] | 自有 head-to-head 对比页+诚实权衡表（不藏缺点的对比更易被引用）；Comparison 类 AIO 覆盖 93-97%，是必争位 | 建站后第一波内容：对比页+替代页 |
| **3 决策** | is [brand] legit / worth it / why so expensive / should I wait for Black Friday / what payment plans | 公开价格、退货政策、真实评分（Trustpilot 等评论平台入驻=AI 敢推你的前提）；57.5% 用户被 AI 劝退过购买——负口碑会被放大 | 建站时：trust 页+评论平台账号；运营期持续养评分 |
| **4 交易 ★** | where can I buy X / [裸品牌词] / how much is X / with delivery time / under $X + 规格 / near me + availability / [payment] 支持类 | **主战场在 feed 层与结构化数据，不在文章**：①GMC feed（购物卡开关）②服务端 JSON-LD Product+aggregateRating（缺评分类目下等于隐身，实测"开关级翻转"）③页面平文本化运费/交期/支付方式（AI 提取前提） | **建站时就要做**（最容易漏）：feed+schema 先于交易段内容 |
| **5 购后** | how to clean X / can you machine wash X / what happens if I [cancel/return] / how to fix | 护理/清洁/退货 FAQ——AIO 触发率最高段+竞争几乎为零；捕获品牌词售后流量与复购 | 内容排期时：与发现段并行排，成本低优先做 |

## 立项前检查（品类政策门禁，rosetoys 教训）

**先查品类政策再动 feed**：OpenAI Commerce Policies 明文禁成人品类（所有商业面）；Google/Microsoft Shopping 受限允许（可开 adult 设置）。非受限品类（家居/工具/常规 B2C）无此问题，直接走 GMC。

## 基线测试纪律（运营复盘用）

1. 五段各 5-10 条 prompt（按本文形态库 × 项目品类词根组装），ChatGPT 锁定模式（查 Labrador 缓存收录）+ 普通模式各一轮
2. 记录：品牌出现/被引用 URL/占位竞品——与 GSC 数据对照，分离"SEO 先行信号"与"GEO 缺口"
3. 53.7% 品类无定局品牌 + prompt 间漂移 → 单轮结果只作基线，季度重测才成结论
4. 商业意图对话占比 13.9%→19.2%（一年+38%）——趋势向上，基线值得每年重做

## 主要来源（分级）

- **官方一手**：OpenAI《How People Use ChatGPT》110万对话样本论文 / OpenAI shopping research（home-and-garden 为强项品类）
- **研究机构**：Adobe Analytics 零售计量（AI 转化+42%）/ Bain & Sensor Tower（购物 prompt 增速与站内点击率 2.2%→5.7%）
- **工具商一手**：Profound（50M prompt 意图分布/购物触发预测 1 亿 prompt）/ peec（50万商业 prompt 分类/AIO 分段触发率）/ Semrush（60万引用研究：74% 多提及获胜；2,338 消费者双向调查）
- **社区实测**：Shopify 社区（feed/aggregateRating 开关级案例）/ CrazyEgg（120+ prompt 零自动成单→出单发生在点击零售商之后）
- 推断构造的 prompt 示例（无一手研究覆盖的垂直品类）在各使用处单独标注，未混入上表


<!-- ======== 第 IV 部分：SEO 漂移监控体系（原 05 号附录，2026-09-14 迁入）======== -->

## 第 IV 部分：SEO 漂移监控体系

> **定位**：内容上线后持续监控 SEO 信号变化（基线采集 + 对比检测 + 变化预警 + 漂移报告格式）。原 05 号附录迁入，全库引用请指本部分。架构参考：[codex-seo seo-drift workflow](https://github.com/AgriciDaniel/codex-seo)

---

## 一、为什么需要漂移监控

| 场景 | 后果 | 漂移监控的作用 |
|------|------|---------------|
| CMS 更新覆盖了自定义 Meta | 排名下降但发现延迟数周 | 自动检测 Title/Meta 变更 |
| 新增页面忘记加 Canonical | 重复内容稀释权重 | 检测 Canonical 缺失/变更 |
| Schema 被主题更新破坏 | Rich Result 丢失 | 检测 Schema 类型/字段变化 |
| H1 被 A/B 测试工具修改 | 页面主题信号弱化 | 检测标题层级变化 |
| 内链结构被内容团队改动 | 权重流向改变 | 检测内链锚文本/数量变化 |
| 竞手页面突然优化 | 你的排名被动下滑 | 定期对比竞手页面快照 |

**核心原则**：优化不是一次性事件，而是一个需要持续监控的闭环。没有监控的优化 = 盲目优化。

---

## 二、监控信号体系

### 2.1 信号分层

```
┌───────────────────────────────────────────────────┐
│  P0 关键信号（任何变化都应预警）                      │
│  • Title Tag                                      │
│  • Meta Description                               │
│  • Canonical URL                                  │
│  • H1 标题                                        │
│  • robots.txt（整站级）                             │
│  • 页面 HTTP 状态码                                │
├───────────────────────────────────────────────────┤
│  P1 重要信号（显著变化应预警）                        │
│  • Schema/Structured Data 类型与字段               │
│  • H2-H3 标题层级                                  │
│  • 内部链接数量（页面级）                            │
│  • 图片 ALT 标签覆盖率                              │
│  • hreflang 标签                                   │
├───────────────────────────────────────────────────┤
│  P2 趋势信号（定期审查，趋势异常时预警）              │
│  • 页面字数                                        │
│  • 外链数量（需要第三方数据）                        │
│  • Core Web Vitals 指标                            │
│  • 索引覆盖率（GSC）                                │
│  • 关键词排名位置                                   │
└───────────────────────────────────────────────────┘
```

### 2.2 每个信号的基线结构

```json
{
  "url": "https://example.com/page",
  "snapshot_date": "2026-06-11",
  "signals": {
    "title": "Example Page Title | Brand",
    "meta_description": "160 chars description...",
    "canonical": "https://example.com/page",
    "h1": "Main Page Heading",
    "h2_count": 5,
    "schema_types": ["Article", "FAQPage"],
    "internal_links": 12,
    "external_links": 3,
    "images_total": 8,
    "images_with_alt": 7,
    "status_code": 200,
    "word_count": 1850,
    "hreflang": ["en", "zh", "es"]
  }
}
```

---

## 三、监控流程

### 3.1 三阶段闭环

```
 采集基线          对比检测          预警与修复
 ─────────   →   ─────────   →   ──────────────
 首次全量抓取      定期增量抓取      变化报告 → 排查 → 修复 → 更新基线
```

### 3.2 采集频率建议

| 信号类型 | 采集频率 | 理由 |
|----------|---------|------|
| P0 关键信号 | 每日或每次部署后 | 部署是高风险时刻 |
| P1 重要信号 | 每周 | Schema 和内链变化通常不是瞬时的 |
| P2 趋势信号 | 每月 | 排名和流量是滞后指标，月度足够 |
| 竞手页面快照 | 每月 | 竞手变化频率通常低于自身 |

### 3.3 基线管理规则

1. **首次基线**：优化完成后 48 小时内采集，确认优化效果已生效
2. **更新基线**：每次有意修改 SEO 元素后，手动触发基线更新（标注变更原因）
3. **回滚基线**：如果修改导致排名下降，回滚到上一个已知良好的基线
4. **版本管理**：保留最近 N 个基线快照（建议 N=10），用于趋势分析

---

## 四、漂移报告格式

### 4.1 变更分类

| 分类 | 含义 | 示例 |
|------|------|------|
| **changed** | 信号值发生变化 | Title 从 A 变为 B |
| **missing** | 信号从有到无 | Schema 消失 |
| **added** | 信号从无到有 | 新增 FAQPage Schema |
| **regressed** | 信号质量下降 | ALT 覆盖率从 90% 降到 60% |
| **improved** | 信号质量提升 | 字数从 800 增加到 1500 |

### 4.2 报告模板

```markdown
# SEO Drift Report — 2026-06-11

## 摘要
- 检测页面：150
- 有变化：12 页面（8%）
- P0 变更：2 页面 ⚠️
- P1 变更：5 页面
- P2 变更：5 页面

## P0 关键变更（需立即排查）

| URL | 信号 | 旧值 | 新值 | 可能原因 |
|-----|------|------|------|---------|
| /products/a | title | "Product A - Brand" | "Product A" | CMS 模板更新 |
| /blog/post-1 | canonical | /blog/post-1 | /blog/post-1?ref=newsletter | URL 参数泄漏 |

## P1 重要变更

| URL | 信号 | 变化类型 | 详情 |
|-----|------|---------|------|
| /about | schema | missing | Organization Schema 消失 |
| /services | h2_count | changed | 8 → 3（内容被精简） |

## 趋势（P2）
...
```

---

## 五、技术实现路径

### 5.1 轻量级方案（推荐起步）

```
Python 脚本（复用 seo_technical_auditor.py 的检查逻辑）
    ↓
输出 JSON 快照 → 存入 .seo-cache/pages/{slug}/snapshots/
    ↓
diff 脚本对比相邻快照 → 生成 Markdown 报告
    ↓
报告推送到 Slack / 邮件 / GitHub Issue
```

**优势**：无需外部依赖，复用现有审计脚本。

### 5.2 集成方案（规模化时）

```
爬虫调度器（Scrapy / Playwright）
    ↓
SEO 信号提取 → JSON 存储（SQLite / PostgreSQL）
    ↓
diff 引擎（信号对比 + 变更分类）
    ↓
告警路由（Slack / PagerDuty / GSC 邮件通知）
    ↓
Dashboard（Grafana / 自建面板）
```

### 5.3 与 codex-seo 架构的整合点

基于 本文第 I 部分 中的架构规划：

| 整合点 | 说明 |
|--------|------|
| `.seo-cache/` 共享缓存 | 漂移快照存入 `pages/{slug}/snapshots/`，其他 Skill 可复用基线数据 |
| 条件式调度 | 检测到部署事件时自动触发漂移检查，而非固定周期 |
| 基线即审计输入 | 技术审计 Skill 可直接读取最新快照作为"当前状态"，无需重新抓取 |

---

## 六、与知识库其他文档的关系

| 文档 | 关系 |
|------|------|
| [01-内容质量标准](../../03-SEO与GEO/01-内容质量标准.md) | 质量标准定义了"什么是好的"，漂移监控检测"是否从好变差" |
| [02-Google-SEO核心机制](../../03-SEO与GEO/02-Google-SEO核心机制.md) | 核心机制定义了 SEO 信号体系，漂移监控中的信号分类基于此 |
| [08-内容审计与优化工具包](../03-内容生产与质检/04-内容审计与优化工具包.md) | 内容审计是定期全量检查，漂移监控是持续增量检查（互补） |
| [10-内容可检索性框架](../../03-SEO与GEO/10-内容可检索性框架.md) | 可检索性是目标，漂移监控确保可检索性不被破坏 |
| [13-AI搜索研究与Prompt执行库](../../03-SEO与GEO/13-AI搜索研究与Prompt执行库.md) | Prompt 执行库产出优化内容，漂移监控验证优化效果持久 |

---

## 七、实施优先级

**当前状态**：架构设计阶段，未实施。

**建议优先级**：中。等 SEO 项目实际执行并达到稳定优化状态后启动。过早实施会在内容频繁变动期产生大量噪音告警。

**启动条件**：
1. 核心 SEO 优化已落地（Title/Meta/Schema/H1 已优化完毕）
2. 内容更新频率趋于稳定（非每日大量新页面上线）
3. 有至少 1 个月的 GSC 数据基线

**最小可行方案**：仅监控 P0 关键信号的 Title + Canonical + H1，覆盖首页 + Top 10 流量页面，每周一次。
