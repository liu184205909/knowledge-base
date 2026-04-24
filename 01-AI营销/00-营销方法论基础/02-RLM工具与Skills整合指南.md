# 01-RLM工具与Skills整合指南

> **将 RLM 方法论、Python 本地自动化工具、MCP 服务器与 Claude Code Skills 无缝结合的实战指南** | 最后更新: 2026-04-24

---

## 为什么需要整合？

在执行 RLM（分而治之的营销全流程自动化）时，单纯依赖聊天式 AI 效率低下。真正的最佳实践是：
- **批量/重复抓取类任务** → 交给**Python自动化工具**（无 token 限制、速度快、可抗反爬）。
- **实时数据/平台对接类任务** → 交给 **MCP 服务器**（如 GSC MCP 直连 Google Search Console，用自然语言查询 SEO 数据）。
- **策略/分析/创作类任务** → 交给专门的 **Claude Code Skills**（预设了行业最佳提示词和微调逻辑）。
- 三者协同，即可将工作流效率推向极致。

---

## 关键 MCP 服务器：Google Search Console (GSC)

> **一句话说明**：通过 MCP 让 Claude Code 直连你的 GSC 数据，用自然语言完成所有 SEO 分析。

### 推荐方案：`gsc-mcp-server`

| 项目 | 详情 |
|------|------|
| 包名 | `gsc-mcp-server`（npm） |
| 安装 | 一行命令（见下方） |
| 认证 | OAuth（推荐）或 Service Account |
| 工具数 | 20 个内置工具 |
| 维护 | 活跃更新（v2.1，2026-03） |

### 快速安装（Claude Code）

```bash
# 一行命令添加
claude mcp add gsc -- npx -y gsc-mcp-server

# 然后在 Claude Code 的 MCP 配置中设置环境变量：
# GSC_AUTH_MODE=oauth
# GSC_OAUTH_SECRETS_FILE=/path/to/gsc-oauth-secrets.json
# GSC_SITE_URL=sc-domain:yourdomain.com
```

> **注意**：Domain 属性类型必须用 `sc-domain:` 前缀，URL 属性用 `https://`。

### 20 个内置工具速查

**分析类（10个）**

| 工具 | 用途 | 示例提问 |
|------|------|---------|
| Site Snapshot | 整体表现 vs 上期 | "我的网站最近表现怎么样？" |
| Quick Wins | 排名 4-15 的高潜关键词 | "有哪些快速上首页的机会？" |
| Content Gaps | 有展现但排名 20+ 的主题 | "我应该为哪些话题写内容？" |
| Traffic Drops | 流量下降诊断（排名/CTR/需求） | "哪些页面流量掉得最多？" |
| CTR Opportunities | CTR 低于同排名基准 | "我的 CTR 在哪些位置表现差？" |
| Cannibalisation | 关键词内耗检测 | "有没有页面互相抢排名？" |
| Content Decay | 连续 3 个月流量下降的页面 | "哪些页面在慢慢衰落？" |
| URL Inspection | 索引状态、抓取、canonical | "这个 URL 是否已被索引？" |
| Topic Clusters | 按 URL 路径分组分析 | "我的 /blog/ 板块表现如何？" |
| CTR vs Benchmarks | CTR 对比行业平均值 | "我的 CTR 和行业平均比如何？" |

**监控类（2个）**

| 工具 | 用途 |
|------|------|
| Check Alerts | 主动监控排名暴跌、CTR 崩溃、点击流失 |
| Verify Claim | 二次验证数据准确性，防止 AI 误判 |

**报告类（3个）**

| 工具 | 用途 |
|------|------|
| Content Recommendations | 综合分析后给出优先级排序的行动建议 |
| Generate Report | 生成完整 Markdown 性能报告（可存档） |
| Multi-site Dashboard | 多站点一键健康检查（适合管理多个网站） |

**索引类（4个）**

| 工具 | 用途 |
|------|------|
| Submit URL | 单个 URL 提交 Google 索引 |
| Batch Submit | 批量提交（每日 200 个上限） |
| Submit Sitemap | 通知 Google 更新 sitemap |
| List Sitemaps | 查看所有 sitemap 状态和错误 |

### 前置准备（15 分钟）

1. **Google Cloud 创建项目** → console.cloud.google.com → 新建项目（如 `GSC MCP`）
2. **启用 API** → 搜索并启用 `Google Search Console API`（如需索引提交，也启用 `Web Search Indexing API`）
3. **创建 OAuth 凭据** → APIs & Services → Credentials → OAuth client ID（Desktop app）→ 下载 JSON
4. **配置环境变量** → 将 JSON 路径和域名填入 Claude Code MCP 配置
5. **首次授权** → 第一次提问时会弹出 Google 登录窗口，授权后缓存

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
**最佳整合方式**：`GSC MCP`（实时数据） + `SEMrush 数据` -> `SEO Skills` 意图分类与聚类

这是发挥专业 Skills 和 MCP 实力最关键的一环。
1. **获取原始数据**：
   手动从 SEMrush/Ahrefs 导出核心类目词相关的 CSV 数据底表。
2. **GSC MCP 实时分析（网站上线后）**：
   网站有数据后，直接用自然语言查 GSC，无需手动导出：
   - 话术："用 GSC 查我的 Quick Wins 关键词" — 找出排名 4-15 位的高潜词
   - 话术："用 GSC 分析我的 Content Gaps" — 发现有需求但未覆盖的话题
   - 话术："用 GSC 检查 Cannibalisation" — 排查页面间关键词内耗
3. **SEO 技能全面介入**：
   - 触发 Skills组合：`claude-seo` (E-E-A-T标准) 或 `Agentic-SEO-Skill`
   - 话术："读取 SEMrush 导出的关键词 CSV，跳过高 KD 词。挑选出搜索意图为'信息型'和'购买型'的长尾词，按主题集群(Topic Clusters)进行分组，并输出优先级策略。"

---

### 步骤 5：内容策略与批量生产（开始写内容）

**目标**：批量生产比竞品覆盖面更广、深度更深的内容。
**最佳整合方式**：`GSC MCP`（数据驱动决策） + `Python脚本` 白皮书/洞察分析 -> `写作 Skills` 批量生成 -> `社交 Skills` 分发

1. **GSC 数据驱动内容排期（网站上线后）**：
   用 GSC MCP 直接从真实数据中找内容方向，比猜测更精准：
   - 话术："用 GSC 查 Content Decay，找出需要更新的旧文章" — 内容保鲜
   - 话术："用 GSC 生成 Content Recommendations" — AI 自动综合分析并给出优先级建议
   - 话术："用 GSC 生成一份完整的性能报告" — 定期存档复盘
2. **分析竞品内容模式（找空挡）**：
   ```bash
   python 02-自动化工具库/05-竞品内容分析工具/content_analyzer.py --input 03-sitemap_results/blog_urls.csv
   ```
3. **生产高转化博客/内容**：
   - 触发 Skill组合：`claude-blog` + `seo-geo-claude-skills` + `huashu-skills (中文环境)`
   - 话术："基于 content_pattern_report.md 里的『竞品内容空白区』，使用 claude-blog 技能，以 [目标关键词] 为核心，写一篇符合 E-E-A-T 规范的万字选购指南。注意，请重点在正文中埋入我们的『差异化清单』策略。"
4. **发布后索引提交（GSC MCP）**：
   - 话术："用 GSC Submit URL 提交这篇文章的链接" — 加速收录
   - 话术："用 GSC 检查这篇文章是否已被索引" — 验证收录状态
5. **社交媒体同步裂变（分发）**：
   - 触发 Skill：`typefully/agent-skills` (社媒分发) 或 `article-to-x` (转推文)
   - 话术："把刚写好的博客摘要提取出来，生成符合 Twitter 和 LinkedIn 用户偏好的多图文 Thread 设计并发推。"

---

## 常用高频指令速查 (Prompt Snippets)

在 Claude Code 的终端中，你可以把多项任务串联为一条指令：

**【竞品发现到解析连招】**：
> "帮我运行 `serp_competitor_finder.py` 挖掘关于 `[关键词]` 的竞品，等它完成后，立刻读取它生成的 txt 文件，去运行 `sitemap_parser.py` 解析并把统计结果汇总用表格发给我。"

**【内容差距分析与文章起草连招】**：
> "读取最新的 `content_pattern_report.md`，调用 `marketingskills`，帮我为本月的内容更新草拟一份排期表，聚焦在竞品没覆盖的 FAQ 问答类型内容上。"

**【GSC SEO 全景连招（网站上线后）】**：
> "用 GSC 生成一份完整性能报告，然后检查 Alerts，再查 Quick Wins 和 Content Gaps，最后给出 Content Recommendations。"

## 总结

**脚本（Python）是"感官与手脚"**：它去外网海量爬行、筛选、格式化数据结晶。
**MCP 服务器是"实时数据触角"**：它直连 Google Search Console 等平台，用自然语言获取第一手 SEO 数据。
**技能（Skills）是"专业级大脑"**：它拿着规范去设计方案、生成图文、做搜索引擎优化。
三者协同，便是无坚不摧的自动化引擎。
