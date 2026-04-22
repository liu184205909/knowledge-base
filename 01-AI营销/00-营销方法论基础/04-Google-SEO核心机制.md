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

## 13 条硬事实

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
- 鸭老师SEO 三源整合原文
