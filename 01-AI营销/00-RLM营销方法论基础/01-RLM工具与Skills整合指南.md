# 01-RLM工具与Skills整合指南

> **将 RLM 方法论、Python 本地自动化工具与 Claude Code Skills 无缝结合的实战指南** | 最后更新: 2026-04-13

---

## 为什么需要整合？

在执行 RLM（分而治之的营销全流程自动化）时，单纯依赖聊天式 AI 效率低下。真正的最佳实践是：
- **批量/重复抓取类任务** → 交给**Python自动化工具**（无 token 限制、速度快、可抗反爬）。
- **策略/分析/创作类任务** → 交给专门的 **Claude Code Skills**（预设了行业最佳提示词和微调逻辑）。
- 结合两者，即可将工作流效率推向极致。

---

## 5个标准化融合工作流

### 步骤 1：竞品发现（知道对手是谁）

**目标**：通过核心关键词快速锁定市场中的本土独立站竞品。
**最佳整合方式**：`Python脚本` 挖掘 -> `Skill` 审查分类

1. **执行自动化挖掘**：
   ```bash
   # 使用本地工具挖掘（过滤大平台如Amazon）
   python 02-自动化工具库/02-竞品挖掘工具/serp_competitor_finder.py --keyword "你的核心词"
   ```
2. **利用 Skill 深度排查（可选）**：
   如果需要对挖掘出来的独立站作进一步的竞争激烈程度分析：
   - 触发 Skill：`marketingskills` 或 `claude-seo` 
   - 话术："请根据我刚抓取到的 `competitor_urls.txt` 列表，使用搜索引擎分析这些品牌是在细分垂类市场，还是在大众市场竞争？"

---

### 步骤 2：竞品初步分析（知道网站怎么建）

**目标**：还原竞品网站的内容结构和类目层级。
**最佳整合方式**：`Python脚本` 解析 -> `Skill` 总结报告

1. **抓取 Sitemap 结构**：
   ```bash
   python 02-自动化工具库/03-竞品分析工具/sitemap_parser.py --file 02-自动化工具库/02-竞品挖掘工具/competitor_urls.txt
   ```
2. **AI 分析结构优劣**：
   让 Claude Code 读取生成的 Markdown 报告，结合前端建站 Skills 进行优化。
   - 触发 Skill：`frontend-design` (提供现代前端审美约束)
   - 话术："分析生成的 `<domain>_sitemap_report.md`，从现代独立站的用户体验（UX）和转化路径出发，告诉我哪些竞品的目录结构值得模仿？"

---

### 步骤 3：网站规划与建站执行（把网站建起来）

**目标**：选定域名并搭建超越竞品的网站架构。
**最佳整合方式**：`Python脚本` 查域名 -> `WordPress Skills` + `MCP` 辅助建站

1. **域名可用性批量检测**：
   ```bash
   python 02-自动化工具库/01-域名查询/domain_checker.py --keywords "my_brand_ideas"
   ```
2. **操作 WordPress（推荐全 AI 介入）**：
   - 核心工具：`02-自动化工具库/04-WordPress建站` 文档规范
   - 触发 Skill：`wordpress-agent-skills` (专门的WP建站Skill)
   - 辅助功能：结合 `playwright` MCP 直接由 AI 测试后台操作结果。
   - 话术："参考我们刚设计的网站结构，使用 wordpress-agent-skills 帮我在 WooCommerce 中批量创建这些分类层级。"

---

### 步骤 4：竞品深度分析 + 关键词研究（知道内容怎么做）

**目标**：系统性的关键词研究与差异化策略，建立内容壁垒。
**最佳整合方式**：`SEMrush 数据` -> `SEO Skills` 意图分类与聚类

这是发挥专业 Skills 实力最关键的一环。
1. **获取原始数据**：
   手动从 SEMrush/Ahrefs 导出核心类目词相关的 CSV 数据底表。
2. **SEO 技能全面介入**：
   - 触发 Skills组合：`claude-seo` (E-E-A-T标准) 或 `Agentic-SEO-Skill`
   - 话术："读取 SEMrush 导出的关键词 CSV，跳过高 KD 词。挑选出搜索意图为'信息型'和'购买型'的长尾词，按主题集群(Topic Clusters)进行分组，并输出优先级策略。"

---

### 步骤 5：内容策略与批量生产（开始写内容）

**目标**：批量生产比竞品覆盖面更广、深度更深的内容。
**最佳整合方式**：`Python脚本` 白皮书/洞察分析 -> `写作 Skills` 批量生成 -> `社交 Skills` 分发

1. **分析竞品内容模式（找空挡）**：
   ```bash
   python 02-自动化工具库/05-竞品内容分析工具/content_analyzer.py --input 03-sitemap_results/blog_urls.csv
   ```
2. **生产高转化博客/内容**：
   - 触发 Skill组合：`claude-blog` + `seo-geo-claude-skills` + `huashu-skills (中文环境)`
   - 话术："基于 content_pattern_report.md 里的『竞品内容空白区』，使用 claude-blog 技能，以 [目标关键词] 为核心，写一篇符合 E-E-A-T 规范的万字选购指南。注意，请重点在正文中埋入我们的『差异化清单』策略。"
3. **社交媒体同步裂变（分发）**：
   - 触发 Skill：`typefully/agent-skills` (社媒分发) 或 `article-to-x` (转推文)
   - 话术："把刚写好的博客摘要提取出来，生成符合 Twitter 和 LinkedIn 用户偏好的多图文 Thread 设计并发推。"

---

## 常用高频指令速查 (Prompt Snippets)

在 Claude Code 的终端中，你可以把多项任务串联为一条指令：

**【竞品发现到解析连招】**：
> "帮我运行 `serp_competitor_finder.py` 挖掘关于 `[关键词]` 的竞品，等它完成后，立刻读取它生成的 txt 文件，去运行 `sitemap_parser.py` 解析并把统计结果汇总用表格发给我。"

**【内容差距分析与文章起草连招】**：
> "读取最新的 `content_pattern_report.md`，调用 `marketingskills`，帮我为本月的内容更新草拟一份排期表，聚焦在竞品没覆盖的 FAQ 问答类型内容上。"

## 总结

**脚本（Python）是“感官与手脚”**：它去外网海量爬行、筛选、格式化数据结晶。
**技能（Skills）是“专业级大脑”**：它拿着规范去设计方案、生成图文、做搜索引擎优化。
两者协同，便是无坚不摧的自动化引擎。
