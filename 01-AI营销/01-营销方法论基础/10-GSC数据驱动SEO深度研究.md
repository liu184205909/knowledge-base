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
3. **深度拆解（1D，套 9 章节模板）**：核心输入是 SEMrush Top Pages/Keywords + Sitemap + Seed-Master + 证据（**不是页面 H2/字数**），分层 P0-P3，见 `01-营销方法论基础/03-模板库/02-竞品深度拆解模板.md`
4. **跨竞品汇总（1E 结构/1F 内容/1G 用户/1H 策略）** + **社区逆向**（`选品方法论/04-竞品与社区逆向挖掘法.md`：Reddit 9 步法/评论 Q&A/亚马逊搜索词逆向）

**web_reader/web-access 的真实位置**：深度拆解模板的「辅助输入·核心页面轻量复核」，按需验证结构，**非主力数据源**。

**gsc-radar 阶段2 编排**：GSC 定位词（第一方）→ `serp_check` 看 SERP 竞品（L1 元信息）→ 对 top 竞品跑轨道 A/C/E（SEMrush + Sitemap）→ 套 9 章节深度拆解模板 → `track_d_backfill` 验证证据 → `topic_discovery`/`map_page_type` 找主题缺口；web_reader 仅复核关键页面。

**实测发现（electricalcabinet 阶段2，2026-06-22）**：`sitemap-mcp` 对 KDM Steel/E-Abel 探测返回 0（非标准 sitemap 位置/屏蔽）+ `get_sitemap_pages` 报 `TypeError`（MCP 内部 bug）→ 触发模板「数据缺失降级规则」：缺 Sitemap 降级到 Top Pages + 核心页面爬取（web-access）；SEMrush 轨道需 Tabbit `--remote-debugging-port=9222` 登录 semrush.com + 项目级竞品总表。**教训**：做竞品分析前先确认 SEMrush/Sitemap 可获取性，缺失时按降级规则走，不硬抓页面假装完整分析。

### 我们的差异化（不抄竞品，保持优势）
- **GA4↔GSC 跨域归因**（`cross_opportunity_matrix` / `cross_seo_to_revenue_attribution` 等）— Suganthan/Serploom/AnalySEO 全部只到 GSC clicks 层，**我们到 revenue**，回答"优化哪页能赚钱"而非"优化哪页能涨流量"。降维打击。
- **阶段2 SERP 反向工程 + Claude 5步 playbook**（年轻站/弱结果策略判断 + LLM 动态生成，NEURONwriter 是固定 NLP 打分）
- **history diff 复查闭环**（Suganthan 有 generate_report 存盘但**无 diff**，我们有 history_diff 能答"两周前 vs 现在 quick win 进步没"）

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
