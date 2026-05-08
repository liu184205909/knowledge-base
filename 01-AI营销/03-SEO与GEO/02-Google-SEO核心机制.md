# Google SEO 核心机制（三源交叉验证）

> 基于 DOJ 反垄断案证词 + Content Warehouse API Leak（2500+模块/14000+属性）+ MWC Exploit（200万站/90M查询实时数据）三份硬证据整合。来源：鸭老师SEO。

---

## 排名架构

```
Crawling → Indexing → Query Processing → Core Ranking(T*×Q*×P*) → Post-Ranking(Twiddler) → SERP(含AIO)
```

- **Core Ranking** 决定你是不是候选池
- **Post-Ranking Twiddler** 决定你在候选池里排第几
- AIO、Featured Snippet、PAA 都是 Twiddler 层的产物

### 排名的数学基础：检索、排序与信号组合

> 基于信息检索（Information Retrieval）文献和鸭老师SEO「Google排名原理：相关性、权威性与用户信号的数学逻辑」整合。

搜索引擎是数学系统——每一个排名决策都是数学函数处理可量化输入后的输出。如果一个信号不能被系统观测、编码、建模为数值，它就不能进入排名函数，就不能影响排名。许多听起来抽象的概念（"内容质量""品牌信任""专业性"）每天都在通过**代理变量**被量化：语言模型评分、链接模式、实体识别、行为信号。

#### 第一阶段：检索——进入候选池（存亡级）

页面必须先被检索到才能参与排名。检索是多路径过程，主要依赖两个通道：

**BM25：词法关卡**

BM25 是词法检索的经典模型，考虑三个要素：
1. 查询词在文档中的出现频率
2. 该词在整个索引中的稀有程度（IDF）
3. 文档相对于平均长度的长短

输出是一个实数，越高表示词法匹配越好。BM25 具有**饱和特性**：关键词第 10 次出现的增益远小于第 1 次——这就是关键词堆砌收益递减的数学原因。

**稠密检索：语义关卡**

查询和文档各自被转化为高维向量（意义的数值表示），两个向量之间的余弦相似度衡量语义接近程度（0-1）。即使使用的词完全不同，只要语义接近就能匹配。RankBrain、BERT、MUM 等系统涉及交叉编码、上下文语言理解和多任务架构，远超基本向量比较，但基础思想不变：语言变成数字，数字被比较。

> **存亡约束**：页面必须通过至少一个关卡才能进入候选池。两个都没通过，再多的权威性或用户互动都救不了你——你根本不在池子里。

#### 第二阶段：排名——多层管道，非线性组合

被检索到之后，文档不是拿到一个总分直接排位。现代排名是多阶段管道：

```
轻量级初排 → 深度重排序模型 → 质量/垃圾分类过滤 → 多样性/时效性调整 → 展示层决策
```

**"为什么我的页面明明相关却不排名？"**——很多时候不是相关性的问题，而是在下游某一层闸门被过滤或降权了。

#### 信号组合：Learning to Rank（LTR）

现代搜索引擎使用学习排序（Learning to Rank）在海量标注数据上训练 ML 模型预测最优排序，而非固定线性公式。LTR 与固定公式的根本区别：

| 维度 | 固定公式（过时） | Learning to Rank（当前） |
|------|----------------|----------------------|
| 特征关系 | `score = w₁x₁ + w₂x₂ + w₃x₃` 线性 | **非线性**——特征间交互由模型学习 |
| 权重 | 静态不变 | **动态**——随查询类型、意图、垂直领域变化 |
| 上下文 | 不考虑 | 高权威性在商业查询中权重极高，在信息查询中权重下降 |

然而约束不变：进入 LTR 模型的每一个特征仍然是可计算的数值。数字进去，分数出来，按分数排序。

#### 实操简化公式

绝大多数 SEO 操作可以归入两个核心变量：

```
Authority × Relevance = Ranking
```

| 优化方向 | 具体操作 |
|---------|---------|
| **优化相关性** | slug/H1 精准反映查询意图、内容与查询高语义相似度、术语与排名页面对齐 |
| **建设权威性** | 主题相关高权威外链、内链结构合理分配权重、链接画像自然 |
| **获取正向用户信号** | 赢得点击的标题、满足查询需求的内容（NavBoost 校准） |

#### 评估 SEO 概念的三层过滤器

遇到任何 SEO 概念时，问三个问题：

1. **能被计算吗？** 不能直接计算，能被拆解成可计算的代理特征吗？如果都不能，它不参与排名函数
2. **怎么产生的？** 统计函数（BM25）、图计算（PageRank）、神经模型（嵌入相似度）、行为聚合（NavBoost）？理解机制才能知道优化什么
3. **在哪个阶段起作用？** 检索（存亡级）→ 初排（大致位置）→ 重排序（更深评分）→ 质量分类（过滤/降权）→ 展示层调整。**阶段决定优先级：检索阶段的信号是存亡级的**

> 许多流行概念是可计算信号的通俗描述："匹配搜索意图"= 词法+语义检索高分；"主题权威性"= 实体覆盖度+内链结构+入站链接相关性的组合。描述没错，但不精确。底层可计算特征才是搜索引擎实际处理的东西。

---

### Firefly：规模化内容滥用检测引擎

> 基于 Content Warehouse API Leak 中的 `QualityCopiaFireflySiteSignal` 模块（Shaun Anderson 取证分析）。Firefly 是**站点级信号**，直接影响排名。

**模块命名解读**：Quality（质量生态）+ Copia（拉丁语"过量"，对应 scaled）+ Firefly（萤火虫算法，在海量数据中发现微弱操纵信号）+ SiteSignal（站点级聚合）

**追踪的关键属性**：

| 属性 | 机制 | 意义 |
|------|------|------|
| **内容生产速度** | 连续 30 天内新发现 URL 数量突变即触发审查 | 从每天 1 篇变 50 篇 = 立刻跳变 |
| **高质量内容占比** | 内部评分 ≥0.8 的页面数量 / 总页面数 | 发 1000 篇但只有 5 篇达标 = 强信号 |
| **dailyClicks vs dailyGoodClicks** | 来自 NavBoost，goodClicks = 用户未立即返回搜索 | **大量点击 + 低 goodClicks = 低质量的数学证据** |
| **临时排名提升追踪** | `impressionsInBoostedPeriod` + `firstBoostedTimeSec` | 新内容"测试窗口"表现不佳 → 后续机会递减 |
| **展示量突增预警** | `recentImpForQuotaSystem` 触发资源配额审核 | 突然几千新页面 = 潜在垃圾来源 |
| **AI 生成内容评分** | `racterScores`（AGC 分类评分，带版本历史） | 追踪 AI 内容比例趋势，突变即跳变 |

**关键影响**：Firefly 是站点级信号——一个站上的规模化滥用行为不只影响被标记的页面，而是影响**整个站点**的排名。（Patrick Stox / Ahrefs 确认：Ahrefs 把有风险的 programmatic 内容搬到独立域名 ahrefstop.com，避免站点级信号污染主站。）

**规模化策略的时间差本质**：Relevance Systems 快速找到相关内容，Quality Systems（含 Firefly）需要几周到几个月完成评估。黑帽策略赌的就是这个时间差——流量是真实的，但排名崩溃是必然的。这也解释了为什么需要不断注册新域名——每个站都是消耗品。

---

### SegIndexer：索引分层机制

> 页面不是"被索引了就有机会排名"。Google 内部的 SegIndexer 系统将已抓取页面分配到不同 serving tier，不同层级获得的排名机会天差地别。（来源：2004 年 Google Index Partitioning 专利 + 2024 年 Content Warehouse API Leak 中的 SegIndexer 模块。2026.4 Google Search Central Live Toronto 官方确认：AI 降低了内容创作门槛，迫使 Google 提高了索引标准。）

**分层逻辑**：

| 层级 | 质量定位 | 排名机会 |
|------|---------|---------|
| **高 tier** | 高质量页面 | 用户查询时**优先搜索**，绝大多数搜索结果来源 |
| **中 tier** | 中等质量页面 | 仅当高 tier 结果不够时才扩展搜索，机会大幅减少 |
| **低 tier** | 低质量/重复/thin content | **排名过程开始前就被跳过**，等同"已抓取-未编入索引" |

**核心影响**：

- **站点级信号决定新页面初始分配**：整站 static rank 低 → 新页面默认进低 tier → 没有曝光 → 没有用户信号 → 继续低 tier（自我强化的死循环）
- **"Crawl Budget 不够"是常见误诊**：真正瓶颈在 serving 层而非 crawling 层。Google 抓了你的页面但分配到低 tier，优化 crawl budget 无济于事
- **HCU 的本质就是站点级 tier 重新分配**：整站被标记为"unhelpful" → 所有页面的 tier 被整体压低（Glenn Gabe 追踪数据：被 HCU 打击的站近两年大部分未恢复）
- **翻盘路径**：唯一有效的是改变 static rank 的底层信号——外链质量、用户行为、站点 authority 积累。对已在低 tier 的单个页面反复修改，ROI 通常不如把精力花在新页面上

> ⚠️ 注：具体分为几层、内部名称是什么，是外部基于专利和 API 文档的推演。分层机制本身可靠，但精确层级划分不应被视为 Google 官方确认。

---

## 排名公式：T* × Q* × P*

### T*（Topicality 主题相关）— ABC Signals

| 信号 | 含义 |
|------|------|
| A = Anchors | 外链锚文本 |
| B = Body | 页面内容与查询匹配 |
| C = Clicks | 用户点击行为 |

### Q*（Quality 站点质量）— 三源交叉验证

- **subdomain 级别**评分（www.example.com 和 help.example.com 是不同分数）
- **0-1 区间，0.4 是 SERP features 硬门槛**（Featured Snippet / PAA）

Q* 的三个核心输入：

| 输入 | 含义 |
|------|------|
| Brand Visibility | 有多少查询直接包含品牌名 |
| **Selection Rate** | 用户在 SERP 主动点选你的比例，**特别是你不在第一位时** |
| Anchor Text Brand Prevalence | 锚文本中包含品牌名/站名的比例 |

**Selection Rate 是最反直觉但最重要的信号**：
- 排第 5 但用户跳过前 4 个直接点你 → Selection Rate 高 → Q* 增加
- 排第 1 但用户划过不点 → Selection Rate 低 → Q* 下降

### P*（Popularity 受欢迎度）— NavBoost

**NavBoost 是最重要排名信号之一**（Pandu Nayak 宣誓作证，2019年内部邮件称"独自可能比其他因素加起来更强"）：

| 变量 | 含义 |
|------|------|
| goodClicks | 点击后满意（停留、无bounce） |
| badClicks | 点击后立刻返回 SERP |
| lastLongestClicks | 最长停留的那次点击（"终极满意"信号） |

- **13 个月滚动窗口** → 短期 CTR 操纵基本无效
- **国家/语言/设备分层** → 各市场独立评分
- **累积优势** → 持续好的点击信号形成竞争对手短期无法复制的壁垒

---

## Site Quality Score：新站"先飞后崩"

Google 有"predicting site quality"专利，新站初始分继承自向量相似的已有站：

1. AI 内容基于互联网最好内容训练 → 向量像高质量站 → 初始分 0.8-0.9 → 排名飞升
2. 6-12 个月后真实用户信号跟不上 → 分数下调 → 排名崩盘

> 核心判断："如果因为任何原因你失去可见度，Google 发现没人主动搜你——你就不存在——那你的站就完了。"

### siteQualityStddev：一致性比最高质量更重要

> 来源：Content Warehouse API Leak。John Mueller 2025 年说"一致性是技术 SEO 最重要的因素"，描述的就是这个属性。

`siteQualityStddev` 是网站页面级 PQ 评分（pqData）的**标准差估计值**——衡量站内页面质量波动程度。标准差越高，说明站内页面质量越参差不齐。

**核心逻辑**：

```
低质量内容 = 低 pqData 整数值
"影响整个网站" = 高 siteQualityStddev
"删除、合并或迁移" = 降低标准差的唯一统计学方法
```

**实操意义**：

- **你的排名不仅取决于你最好的作品，还取决于你与卓越水平的偏差**
- 一个站上有 10 篇优秀文章和 100 篇垃圾 → siteQualityStddev 很高 → 那 10 篇优秀的排名潜力会被拖垮
- 删除/合并低质量页面、将内容单薄页面合并为更有用页面、将低质量页面迁移到不同域名 → 这些都是降低标准差的手段
- Google 2011 年 Panda 指南就已明确说了这个逻辑，Leak 只是揭示了具体执行属性

---

## 8 种查询分类

Google 把几乎所有查询分成 8 类，**不同类别算法权重不一样**：

| 分类 | 典型例子 | SEO 意义 |
|------|----------|----------|
| Short Facts | "英国首相是谁" | AIO 吞噬最严重 |
| Comparison | "iPhone vs Samsung" | B2B 决策核心 |
| Consequence | "喝太多咖啡会怎样" | YMYL 风险 |
| Reason | "天为什么是蓝的" | AIO 高频命中 |
| Definition | "什么是区块链" | AIO 吞噬严重 |
| Instruction | "如何烤蛋糕" | HowTo 长尾 |
| Boolean | "今天下雨吗" | AIO 吞噬严重 |
| Other | "附近的咖啡馆" | 兜底 |

**实操**：关键词研究后按类型写内容，比"看 SERP 骨架"更精确。

---

## HCU 真相：实体未定义

Google 官方说 HCU 评估"内容是否为人写的"，三源真相：

- HCU 是 **site-wide 信号**，不是 page-level
- 2024年3月已合并进 core ranking
- 机制是 **demotion-first**（只降权，不提升）
- **真正触发降权的不是"内容不够好"，是"实体未定义"**

### Disconnected Entity Hypothesis（根因链条）

```
实体未定义 → Google无法评估"你为什么存在" → 被归类为"Unhelpful" → HCU site-wide demotion
```

**恢复路径**：不是优化内容，不是改技术 SEO，是**定义实体**：
- About 页、作者信息、schema、sameAs、真实业务证据
- Google Quality Rater Guidelines Section 2.5.2

### Synthetic Gap（Tom Capper / Moz）

HCU 受害者共性：**Domain Authority 远高于 Brand Authority**（DA:BA = 2:1+）。
- 你外链攒得快，但没人搜你的品牌 = 高风险
- HCU losers 平均 Brand Authority 37，winners 50-52

---

## 三层链接索引机制

> 来源：Content Warehouse API Leak。Google 维护三个不同层级的链接索引，链接页面在层级中的位置由 `SourceType` 属性决定。

| 层级 | 条件 | 效果 |
|------|------|------|
| **高质量** | 页面上的链接获得真实用户点击 | 正常传递 PageRank 和锚文本信号 |
| **中质量** | 少量互动 | 部分传递 |
| **低质量** | 页面上链接 **TotalClicks 为零** | **排名算法实际上忽略该链接**，不传递 PageRank，不传递锚文本信号 |

**核心机制**：零点击页面上的所有内链和外链都不传递任何价值。你以为在通过内链把权重导向 money page，实际上这些链接被归入了低质量层，什么都没传递。

**anchorMismatchDemotion**：在完全不相关的页面上放置精确匹配锚文本的链接不只是浪费——**可能对排名造成实际损害**。

**实操结论**：获取链接不再是终点。让链接所在的页面获得真实用户互动验证，才是让链接产生价值的前提条件。批量发布几千个无人访问的页面，页面上的所有内链和外链全部失效。

---

## 虚伪惩罚：声称与实际不匹配

> 来源：Shaun Anderson Contextual SEO 框架 + Quality Rater Guidelines Section 7.0

Google 的 Quality Raters 被训练去寻找**网站声明和实际行为之间的不匹配**。Section 7.0 明确指出：声明目的与实际内容之间存在不匹配的页面应被评为最低质量。

**触发条件**：About 页面写着"资深专家团队，每篇内容严格审核"，实际每天发 50 篇未编辑 AI 内容 = Deceptive Page Purpose。

**Leak 属性对应**：可能触发 `scamness`（欺骗性评分）和 `unauthoritativeScore`（非权威评分）。

**核心原则**：内容生产价值必须与政策声明对齐。不能用精心制作的 About 页面伪造 E-E-A-T，如果实际产出与声明严重不符。

---

## 四种系统性失败模式

> 来源：Shaun Anderson Contextual SEO 框架。这四种不是内容问题，而是系统性问题，**单靠改进内容无法解决**。

| 模式 | 表现 | 根因 |
|------|------|------|
| **语境过度延伸**（Context Overreach） | 个人博客排名"心脏病治疗方案"等 YMYL 查询 | 网站试图在需要更多信任/权威的查询中排名，超出了合理范围 |
| **实体膨胀**（Entity Inflation） | 没有外部证据却以权威机构身份出现 | 通过 EntityAnnotations 和 Knowledge Graph 验证身份，无证据 = 信任摩擦 + 排名阻力 |
| **意图漂移**（Intent Drift） | 页面对不满足的查询暂时排名靠前，最终下降 | NavBoost 的 `lastLongestClicks` 机制——用户搜索任务未在你的页面完成 → 排名随时间衰减 |
| **信任信号债务**（Trust Signal Debt） | UX 问题、激进盈利、信息不透明侵蚀信任 | `clutterScore`（杂乱度评分）等属性追踪，悄无声息地累积 |

**共同特点**：都不是内容质量问题，是系统性和背景性问题，单靠写更好的内容或获取更多外链无法解决。需要从站点定位、实体定义、用户验证等层面系统性地修复。

---

## 关键误区修正

### Sandbox：不是新站专属

hostAge 只 sandbox "fresh spam"，不影响干净新站。**PageRank 是跳过 sandbox 的 VIP 通行证。**

触发场景：
- 新域名 + 突然大量内容（内容农场）
- 老域名 + 突然改主题 + 批量内容
- **不要为了"域名年龄"买老域名——买来改主题比新域名还惨**

### Freshness：只对 QDF 查询生效

QDF 只对 3 类查询启动：突发新闻、周期性事件、频繁变动话题。**三者同时满足才激活。**

| 指标 | 2017 | 2025 | 趋势 |
|------|------|------|------|
| Top 10 中 3年以上页面 | 59% | 72.9% | 老内容占比更高 |
| 新页面 1年内进 Top 10 | 5.7% | 1.74% | 大幅下降 |
| #1 页面平均年龄 | 2年 | 5年 | 翻倍 |

**结论**：2026年 SERP 比以往任何时候都更被老内容主导。

### lastmod：信任是 binary 的

Gary Illyes 原话："It's binary. We either trust it or we don't."

| 改动类型 | Google 反应 |
|----------|-------------|
| 大改动 + 更新 lastmod | 正向信号 |
| 小改动 + 更新 lastmod | 负面，多次后失效 |
| **完全不改 + 更新 lastmod** | **最负面，直接"骗子"判定** |

### Parasite SEO：已死

2024.3 Site Reputation Abuse 政策 → 2024.11 人工处罚 Forbes/WSJ/Time/CNN → 2025.8 算法化执行 → 2026.3 Core Update 强化。

### Crawl Budget：多数情况下是误诊

页面没排名，多数人归因于"crawl budget 不够"。但真正瓶颈在 serving tier（见上方 SegIndexer），不在 crawling。Google 抓了你的页面但分到低 tier，优化 robots.txt / sitemap / 服务器速度都无济于事。**把 serving 层的分区问题错误诊断成 crawling 层的资源分配问题，是治错了病。**

### llms.txt 和 Markdown 转换：对 SEO 无用

> 2026.4 Google Search Central Live Toronto 官方确认：创建 llms.txt 文件对 SEO 没有任何好处。将网站转换为 Markdown 格式对于 LLM 或 SEO 也无任何好处。

这两个是 GEO 领域流传甚广的做法，Google 官方直接否定了。**不要在这两件事上浪费时间。**

### data-nosnippet：阻止 AI 引用的唯一方法

屏蔽 Google 扩展搜索机器人（Extended Search Bot）**不会阻止 AI 在 AIO/AI Mode 中使用你的内容**——因为你的网站已经在搜索索引中，Google 仍然可以在"分页搜索"中使用这些数据生成 AI 答案。

**唯一真正有效的方法是 `data-nosnippet`**。但这把双刃剑：阻止了 AI 引用，同时也会降低传统 SEO 效果（SERP 中不显示摘要）。

> 实操判断：如果你的流量主要依赖传统搜索 → 不建议用。如果你的内容被 AI 大量引用但不带来点击 → 可考虑对特定段落使用。

### 规模化内容滥用 vs AI 使用

Google **不反对 AI 本身**。AI 内容流量下降的根因是**规模化内容滥用算法**（Scaled Content Abuse），不是"你用了 AI"。

区别：用 AI 写 1 篇高质量内容 = 没问题。用 AI 批量生成 1000 篇内容 = 触发规模化滥用检测。

---

## Schema 和实体建设

Schema 不是直接排名因素，但是**实体建设的加速器**：

```
Schema → 实体消歧加速 → 实体权威建立 → Knowledge Graph 认可 → LLM 引用概率提升（间接）
```

### 2026 年实体建设 3 个核心条件

1. **Notability**：20-30 个独立权威来源提及
2. **Entity Home**：一个 URL 作为"真相来源"（通常是 About 页）
3. **Corroboration**：所有平台信息完全一致

### 实体验证务实指标（不追求 Knowledge Panel）

| 层级 | 指标 | 难度 |
|------|------|------|
| 第 1 层 | 搜品牌名，官网排第一 | 容易 |
| 第 2 层 | 有 brand card 或 sitelinks | 中等 |
| 第 3 层 | Knowledge Graph API 能查到实体 | 较难 |
| 第 4 层 | 完整 Knowledge Panel | 很难 |
| 第 5 层 | AI 系统自动提到你 | 最难 |

**大部分网站到第 2 层就合格。** 实用目标：搜品牌名时官网排第一 + KG API 能查到实体 ID。

### 外部平台权重（按 ROI）

1. Wikidata（最高 ROI，Knowledge Graph 直接输入源）
2. Google Business Profile
3. LinkedIn
4. Crunchbase
5. 行业权威平台
6. 主流社交媒体官方账号

---

## SEO 优先级（正确顺序）

| 优先级 | 层级 | 内容 |
|--------|------|------|
| **第1层** | 实体健康 | About页 + schema + sameAs 完整性 |
| **第2层** | 站级质量 Q* | 搜品牌名官网排第一、Branded Search 量、Selection Rate |
| 第3层 | 站级权威 | 链接图质量、主题聚焦度（siteFocusScore） |
| 第4层 | 用户信号 P* | NavBoost 13个月积累、goodClicks/badClicks 趋势 |
| 第5层 | 单页内容 T* | ABC signals、查询分类匹配、Schema |

**多数人从第5层往第1层做，顺序反了。**

---

## 24 条硬事实

1. Q* 真实存在，subdomain 级别，0.4 是 SERP features 硬门槛
2. Q* 核心输入 = Brand Visibility + Selection Rate + Anchor Text Brand Prevalence
3. NavBoost 是最重要排名信号之一，13个月窗口，国家/设备分层
4. HCU 是站级信号，**实体未定义是根因**
5. 降权机制是明确算法项，不是模糊的"Google 懂"
6. Sandbox 不是新站专属，是对"不可信+突然爆发"实体的 demotion
7. hostAge 只 sandbox fresh spam，不影响干净新站
8. lastmod 信任是 binary，假更新 = 永久失效
9. **Freshness 只对 QDF 查询生效，SERP 主体被老内容统治**
10. Parasite SEO 通路已基本关闭
11. Schema 对实体消歧有加速作用，对 LLM 引用是间接影响
12. 8 种查询分类决定不同算法权重
13. **实用指标是"搜品牌名官网排第一"，不是追求 Knowledge Panel**
14. **llms.txt 对 SEO 无用**（Google 官方确认，2026.4 Toronto）
15. **网站转 Markdown 对 LLM/SEO 无用**（Google 官方确认，2026.4 Toronto）
16. **屏蔽扩展搜索机器人不会阻止 AI 使用你的内容，data-nosnippet 是唯一方法**（但伤害传统 SEO）
17. **Google 不反对 AI 本身，反对的是规模化内容滥用**
18. **"已抓取-未索引"很少是技术问题，通常是质量信号**（Google 官方确认，2026.4 Toronto）
19. **Firefly（QualityCopiaFireflySiteSignal）是站点级规模化滥用检测引擎**，追踪内容生产速度、高质量占比、dailyClicks/goodClicks 比率、AI 内容比例趋势
20. **siteQualityStddev 衡量站内页面质量一致性**，标准差越高排名越不利，一致性比最高质量更重要
21. **三层链接索引机制**：零点击页面上的链接不传递任何 PageRank 和锚文本信号
22. **anchorMismatchDemotion**：不相关页面上的精确匹配锚文本不只是浪费，可能造成实际损害
23. **虚伪惩罚**：网站声明（About 页）与实际内容生产行为不匹配，可触发 scamness + unauthoritativeScore
24. **四种系统性失败模式**（语境过度延伸、实体膨胀、意图漂移、信任信号债务）单靠改进内容无法解决

---

## 实操检查清单

### 第1层：实体健康

| 检查项 | 做法 | 工具 |
|--------|------|------|
| 实体是否被识别 | 查询品牌名，是否有 @id: "kg:/m/..." | [audits.com KG Search](https://audits.com/tools/knowledge-graph-search) / [PlePer KG Tool](https://pleper.com/index.php?do=tools&sdo=google_knowledge_graph_raw) |
| 搜品牌名官网排第几 | Google 搜索品牌名 | 直接搜索 |
| 实体信息一致性 | 检查 About 页、LinkedIn、Crunchbase、Wikidata 信息是否完全一致 | 人工检查 |
| sameAs 部署 | Organization/Person schema 中 sameAs 字段是否连接了 Wikidata、LinkedIn 等 | 查看页面源码 schema |

**时间预期**：schema + sameAs 部署 → Google 处理 4-8 周 → KG 实体识别 3-6 个月

### 第2层：站级质量 Q*

| 检查项 | 做法 | 工具 |
|--------|------|------|
| Branded Search 量 | 品牌名有多少搜索量 | Google Search Console（搜索效果报告） |
| Selection Rate | 不在第1位时用户是否主动选你 | GSC → 效果报告 → 按查询查看 CTR vs 排名位置 |
| SERP features 资格 | 是否出现 Featured Snippet / PAA | 手动搜索目标关键词 |

> Q* 无公开直接检测工具（MWC 漏洞已修复）。间接判断：如果排第5-10位但 CTR 异常高 → Selection Rate 可能不错 → Q* 可能健康。如果排第1-3位但 CTR 低 → Q* 可能有问题。

### 第3层：站级权威

| 检查项 | 做法 | 工具 |
|--------|------|------|
| 锚文本品牌占比 | 外链锚文本中包含品牌名的比例 | Ahrefs / SEMrush 锚文本报告 |
| 主题聚焦度 | 站点内容是否围绕核心主题 | 人工判断 |
| DA:BA 比值 | Domain Authority vs Brand Authority 是否失衡 | Ahrefs（DA）+ 品牌搜索量 |

**高风险信号**：DA 远高于 BA（如 2:1+），说明外链攒得快但没人搜你的品牌 → HCU 高风险。

### 第4层：用户信号 P*

| 检查项 | 做法 | 工具 |
|--------|------|------|
| 页面停留时间 | 用户点击后停留多久 | GSC → 网页体验 → 互动数据 |
| Pogo-sticking | 用户点击后是否立刻返回 SERP | GSC → CTR vs 平均排名位对比（排第3但 CTR 接近第10位 = pogo-stick） |
| 分市场表现 | 不同国家/语言的排名差异 | GSC 按国家筛选对比 |

### 站点一致性检查（siteQualityStddev）

| 检查项 | 做法 | 工具 |
|--------|------|------|
| 低质量页面占比 | 识别站内流量极低 + 停留时间短的页面 | GSC → 按页面查看低效页面 |
| 内容合并/删除 | 将内容单薄页面合并为更有用页面，或直接删除 | 人工判断 |
| 高风险内容隔离 | 把批量产出的有风险内容搬到独立域名 | — |

> 如果站内有大量低质量页面拉高 siteQualityStddev，优先处理这些比优化少数好页面 ROI 更高。

### 链接有效性检查（三层链接索引）

| 检查项 | 做法 | 工具 |
|--------|------|------|
| 内链页面是否有真实流量 | 内链指向的页面是否有用户访问 | GSC → 页面流量报告 |
| 锚文本相关性 | 内链锚文本是否与目标页面主题相关 | 人工检查 / Screaming Frog |
| 外链所在页面质量 | 外链来源页面是否有用户互动 | Ahrefs / SEMrush 外链报告 |

> 零点击页面上的链接不传递任何权重。重点不是建更多内链，而是让已有内链所在的页面获得真实用户访问。

---

### 第5层：单页内容 T*

| 检查项 | 做法 | 工具 |
|--------|------|------|
| 查询分类 | 关键词属于8类中哪一类 | [MWC Refined Query Classifier](https://rqpredictor.streamlit.app)（免费，基于4.6M英文查询训练） |
| 内容与查询匹配 | 页面是否精准回答目标查询 | AI 搜索平台（ChatGPT / Perplexity）直接搜目标关键词 |
| lastmod 信任 | 是否在不改内容的情况下更新了日期 | 对比页面 Wayback Machine 快照 vs lastmod 日期 |
| Schema 实施 | 关键页面是否有正确 schema | [Schema Markup Validator](https://validator.schema.org) / GSC 增强体验报告 |

### 新站专项检查

| 检查项 | 做法 |
|--------|------|
| 是否被索引 | Google 搜索 `site:yourdomain.com` |
| 是否被 sandbox | 有索引但完全无排名 + 不是 spam 内容 → 可能只是缺少 PR 信号（非惩罚） |
| 初始评分预测 | 内容主题是否聚焦 + 有真实业务实体（About/schema/sameAs） → 避免继承低质量邻居分数 |

---

## 参考来源

- DOJ 反垄断案 Pandu Nayak 证词
- Content Warehouse API Leak（Mike King / iPullRank 技术解读）
- MWC Exploit（Mark Williams-Cook / SearchNorwich）
- Shaun Anderson（Hobo-Web）Disconnected Entity Hypothesis
- Tom Capper（Moz）Synthetic Gap 研究
- Ahrefs Patrick Stox Top 10 年龄研究
- Gary Illyes lastmod 信任机制（LinkedIn 对话）
- Google 2004 Index Partitioning 专利（Bill Slawski / SEO by the Sea 解读）
- 鸭老师SEO 三源整合原文 + 分层索引分析
- 鸭老师SEO「Google排名原理：相关性、权威性与用户信号的数学逻辑」（BM25、稠密检索、LTR、三层过滤器）
- Google Search Central Live Toronto 2026（Danny Sullivan / Daniel Waisberg / Ryan Levering 发言，2026.4.21）
- Shaun Anderson（Hobo-Web）Contextual SEO 框架（虚伪惩罚、四种系统性失败模式、Firefly 取证分析）
- 鸭老师SEO「谷歌如何识别规模化内容滥用（Scaled Content Abuse）」原文
- Robertson & Zaragoza BM25 模型（信息检索经典文献）
