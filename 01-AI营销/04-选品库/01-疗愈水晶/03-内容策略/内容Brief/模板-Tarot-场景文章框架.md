# Tarot 场景文章框架 v2.2（22 Major × 5 场景 = 110-220 篇）

> **2026-07-01 v2.2 Fool 连读反馈落实**：M2 RW 画面每篇不同元素切入 / 开篇去模板 / 核心句式同牌≤2 / Finances-Health 案例非强制 / config 档位权威 / 同批连读生产
> **2026-07-01 v2.1 试点反馈落实**：M5/M6 水晶不重复 / M9 benchmark 词数放宽 150-180 / 关卡6 结构变体清单 / M2 匿名案例规范 / 质检否定句上下文判定 / Brief-config behavior 对齐
> **2026-06-30 升级（v1→v2）**：融入 Search Intent Lens / 张力分级（3档词数）/ Health-Finances 合规硬边界 / 东方锚点池+意象词校验 / 模块顺序调整（行动 M5 在水晶 M6 前）/ 生成前 Brief / 禁用表达库 / 语义+结构去重升级 / 数据层字段扩展。
> **适用**：`/{card}-for-{scenario}/` 单牌×单场景解读页（22 Major × 5 场景 Love/Career/Finances/Health/Spiritual Growth = 110 篇基础；正逆位拆分可扩至 220）
> **与牌义页框架的关系**：[模板-Tarot-牌义页框架](模板-Tarot-牌义页框架.md) 写**单牌普适**（archetype/画面/三视角）；本框架写**该牌在某场景的具体表现**（行为/冲突/人物画像）。两框架物理隔离：场景页不重复 archetype 深度，只落到该场景。
> **竞品依据**：[1F §2.2](../../01-竞品分析/1F-塔罗内容写法研究.md) —— Labyrinthos 牌义页内嵌 Love/Career/Finances 三列矩阵（每场景 ~150 词）；p.taluo 场景化牌阵页（极薄）。我们做**独立深度场景页**，吸收 Labyrinthos 矩阵做独立页深度。
> **数据源**：`07-互动工具/_shared/tarot-knowledge.json`（22 牌全字段，含每牌专属意象词）+ 本框架 §6 五场景东方锚点池 + §10 scenario-knowledge.json
> **核心策略**：主词 `{card} for {scenario}` / `{card} love meaning` / `{card} career meaning` / `{card} in love`。差异化：**场景落地具体行为/冲突 + 场景化水晶 + 该场景东方锚点 + 张力分级词数**。
> **⚠️ 最大风险**：① 5 场景该牌雷同 ② 与牌义页撞内容 ③ Health/Finances 触合规红线 ④ 110+ 篇规模化"同套路换皮"。**本框架核心 = Search Intent Lens + 张力分级 + 合规硬边界 + 东方锚点池 + 去重升级**。

---

## 0. Search Intent Lens（生成前第一关，先于模块结构）⭐⭐⭐

> **每场景动笔前必先锁定用户真实问题 + 应答重点**。这不是模板填空，而是"这页到底回答什么"。所有模块围绕 Intent Lens 展开，模块完成后再回看是否命中。

| 场景 | 用户真实意图（搜这个词的人想问什么） | 应答重点（内容该交付什么） |
|---|---|---|
| **Love** | 这段关系有没有希望？对方怎么想？我该主动吗？ | 情感模式、互动风险、边界感、下一步沟通 |
| **Career** | 这个机会值不值得？跳槽/创业/坚持？ | 决策节奏、资源条件、团队关系、行动策略 |
| **Finances** | 钱会变好吗？投资/消费安全吗？ | 风险意识、现金流、冲动消费、长期规划（**禁投资建议**）|
| **Health** | 身体/状态在提醒我什么？ | 压力、休息、习惯觉察、body awareness（**禁诊断/治疗承诺**）|
| **Spiritual Growth** | 我在经历什么内在课题？ | 觉察、阴影、修行态度、内在整合 |

**硬约束**：
1. §1 生成前 Brief 必须显式声明该场景 Intent（一句话），正文每模块回看是否服务于该 Intent
2. M2 Card Energy 的开篇冲突句必须**直接命中**该场景用户真实意图，禁绕弯"when this card appears..."
3. M8 FAQ 4 问必须从 Intent Lens 推导（见 §11 场景固定问题池），非 AI 自由发挥

---

## 1. URL + TKD

- **URL**：`/{card}-for-{scenario}/`（根级 post，无 category base），scenario 统一用下表规范（**finances 非 finance**）
  - **5 场景 URL 规范**（全站统一，禁变体）：

    | 场景 | URL 模板 | 示例（The Tower） |
    |---|---|---|
    | Love | `/{card}-for-love/` | `/the-tower-for-love/` |
    | Career | `/{card}-for-career/` | `/the-tower-for-career/` |
    | Finances | `/{card}-for-finances/` | `/the-tower-for-finances/`（**非 finance**）|
    | Health | `/{card}-for-health/` | `/the-tower-for-health/` |
    | Spiritual Growth | `/{card}-for-spiritual-growth/` | `/the-tower-for-spiritual-growth/` |

  - 不加 `tarot-` 前缀（场景页无水晶产品词污染风险，`for-{scenario}` 已明确意图）；不加 `-crystals`（场景页是知识页，水晶在 M6）
  - **修正历史示例**：v1 中 `/the-tower-for-finance/` 全部改 `/the-tower-for-finances/`
- **Title**（≤60 字符规则）：
  - 默认形式：`{Card} for {Scenario}: Meaning & Crystals`
  - **长牌名（≥20 字符）短形式**：去掉 The / Tarot Card，用 `{Card-short} for {Scenario}: Meaning & Crystals`
    - The High Priestess → `High Priestess for Love: Meaning & Crystals`（去 The）
    - The Wheel of Fortune → `Wheel of Fortune for Career: Meaning & Crystals`
    - Three of Cups（若未来扩展小牌）→ `Three of Cups for Love: Meaning & Crystals`
  - 字符数校验：Title 必须通过 ≤60 字符检查（含空格），超长用短形式
- **H1（每场景不同语气，降低模板痕迹）**：

  | 场景 | H1 模板 | 语气差异 |
  |---|---|---|
  | Love | `{Card} for Love: What It Reveals About Your Relationship` | 关系揭示型 |
  | Career | `{Card} for Career: Work, Decisions, and Direction` | 决策方向型 |
  | Finances | `{Card} for Finances: Money Lessons and Warnings` | 警示教训型 |
  | Health | `{Card} for Health: Energy, Balance, and Body Signals` | 能量觉察型 |
  | Spiritual | `{Card} for Spiritual Growth: Inner Lessons and Awakening` | 内在觉醒型 |

- **Primary KW**：`{card} for {scenario}` / `{card} {scenario} meaning` / `{card} in {scenario}`
- **Secondary KW**：`{card} upright/reversed in {scenario}` / `crystals for {card} {scenario}`
- rank_math 三件套（focus_keyword = `{card} {scenario}`）

---

## 2. 生成前 Brief（单篇 brief，不给用户看，控质量）⭐⭐

> **每篇写正文前先输出一份 brief**，作为该篇的"质量契约"。Brief 通过质检门后才允许写正文。这是 110+ 篇规模化不雷同的核心阀门——brief 重复/通用，正文必然换皮。

**Brief 模板（12 字段，每篇必填）**：

```
[1] 主关键词：
[2] 搜索意图（从 §0 Intent Lens 选定，一句话）：
[3] 核心隐喻（该牌该场景独有，从 scenario-knowledge.json metaphor）：
[4] 禁重复的普适牌义（牌义页已写过、本篇不复读的 archetype 段）：
[5] Rider-Waite 投射（该牌独有画面 → 该场景的具体投射，如 Fool 悬崖=该场景的风险点）：
[6] 3 个具体场景行为（该牌该场景会做的具体动作/人物画像，非抽象状态；**从 scenario-knowledge.json 该场景的 `behavior` 数组直接取，不自行推导**）：
[7] upright-reversed 区分（正位/逆位在该场景的差异化表现）：
[8] 3-4 颗水晶及理由（每颗：为何这颗配该牌+该场景；**v2.1 起须标注分工：1 颗=M5 行动锚点，另 2-3 颗=M6 主写，两组不重复**）：
[9] 东方锚点（从 §6 该场景锚点池选 1，配该牌专属意象词）：
[10] 内链目标（同牌其他场景×2-4 + 关联牌×2-3 + 水晶 meaning×3-4 + 牌义页×1 + Hub×1，按 §12 语义化）：
[11] FAQ 4 问（从 §11 该场景固定问题池选）：
[12] 结构变体（v2.1 新增，benchmark 档必填；从 §15 关卡6 清单勾选 ≥1，列变体名）：
```

> 字段 [12] 仅 3 分 benchmark 档必填（standard/lite 可空）。勾选决定本篇结构指纹，是关卡6 可操作标准的前置数据。

**硬约束**：
1. Brief 字段 [3] 核心隐喻与同牌其他 4 场景 brief 比对，重叠 <30% 才放行（防同牌 5 篇雷同）
2. Brief 字段 [6] 三个行为必须是**动词短语+具体情境**（如"swipe right on someone outside your type"），禁抽象状态（如"new relationship"）
3. **Brief 字段 [6] 行为来源 = scenario-knowledge.json 该场景 `behavior` 数组**（3 项，config 微调后的最终值），生产 agent 不自行推导；**若 config behavior 不足 3 项**，从该场景 `archetype + upright_focus` 补足到 3 项，并在 brief 标注 `[补充自 archetype/upright_focus]`
4. Brief 字段 [9] 东方锚点必须配该牌**专属意象词**（从 tarot-knowledge.json 取，如 The Fool=悬崖/小白/初心），否则判通用句打回

---

## 3. 张力分级（3 档词数 + 弱牌退路，替代一刀切）⭐⭐⭐

> **v1 问题**：22 牌 × 5 场景一刀切 1200-1800 词，导致强张力场景（The Tower in Love）写不透、弱张力场景（The Hierophant in Finances）灌水充数。v2 引入张力分级：给 22 牌 × 5 场景打 tension 分（1/2/3），分级决定词数+模块策略。

### 3.1 tension 打分规则

每牌每场景打 **tension 分（1/2/3）**，写入 scenario-knowledge.json：
- **3 分（标杆档）**：该牌该场景有天然鲜明隐喻（如 The Tower×Love=关系剧变 / The Devil×Love=有毒关系 / The Fool×Career=裸辞创业）
- **2 分（标准档）**：中等，有隐喻但不极致（如 The Empress×Finances=丰盛流动）
- **3 分（精简档）**：信息稀薄，该牌在此场景偏中性（如 The Hierophant×Finances / Justice×Love）

**每牌至多挑 1-2 个 3 分场景深做**（避免 5 场景全标杆导致信息过载），其余按 2/1 分处理。

### 3.2 三档差异化策略

| 档位 | 词数 | M2 深度 | 模块策略 | FAQ | 内链 |
|---|---|---|---|---|---|
| **3 分 benchmark** | **2200-2800** | 深挖 500+词，允许加真实案例/咨询师视角 | 全 10 模块全做 | 4 条 | 该页为权重承接页，收同牌其他场景内链 |
| **2 分 standard** | **1200-1600** | 标准 250-350 词，隐喻不重叠 | 全模块，M6/M7 可精简 | 3-4 条 | 标准配额 |
| **1 分 lite** | **900-1200** | 200-280 词，**允许诚实承认该牌在此场景偏中性** | **合并 M6 东方入 M7 行动**，精简 M5 | **砍到 2 条** | 通过内链把权重导向同牌标杆档（3 分）页 |

**1 分诚实承认正例**（The Hierophant in Finances）：
> ✅ "The Hierophant rarely decides your financial direction on its own. It mostly reminds you not to follow the crowd's spending just to fit in——conformity tax is real, but this card isn't your portfolio's protagonist. For deeper money arcs, see [The Hierophant for Career] and [The Emperor for Finances]."

**硬约束**：
1. 每篇 brief 字段 [3] 后必须声明 `tension: 1|2|3` + `depth_tier: benchmark|standard|lite`，决定该篇模块策略
2. 1 分页必须含"诚实承认中性 + 内链导向同牌标杆页"二要素，禁灌水凑 1200 词
3. 3 分页 M2 必须 ≥500 词 + 含至少 1 个具体案例或咨询师视角，否则降级 2 分
4. **config 档位权威（v2.2 新增，建议11）**：tension / depth_tier 以 `scenario-knowledge.json` 为准，**生产 agent 不得擅自改档**（不得把 2 分 standard 自行拔高到 3 分 benchmark 灌字数，也不得把 3 分自降 1 分省事）。**发现 config 档位与牌 archetype 明显冲突时（如某牌该场景明显张力极强却打了 1 分，或明显中性却打 3 分），在质检 `issues` 标注回写 config，由 config 维护者统一修订 scenario-knowledge.json，而非生产时自改档位**——避免单篇生产改档破坏同牌 5 场景档位平衡 + 关卡2/5/6 连读基准。

---

## 4. 合规硬边界（Health / Finances 黑名单）⭐⭐⭐

> **监管红线**：Health/Finances 是平台+广告政策高压区，AI 易生成"塔罗治病/塔罗投资"违规承诺。本节为强制黑名单，质检关卡 0（前置门），触发任一即打回不进生产。

### 4.1 Health 场景

| 类型 | ✅ 允许 | ❌ 禁（黑名单） |
|---|---|---|
| 话题域 | energy / stress / routine / rest / body awareness / emotional pattern | 疾病判断 / 治疗建议 / 疗效承诺 |
| 表达 | "a nudge to check in with your body" / "stress you may be carrying" | `this card means you will be ill` / `cure` / `diagnose` / `heals X illness` |
| 逆位改写 | `a nudge to check in with your body, not a verdict` | `predicts sickness` / `a bad health omen` |

**统一收尾免责**（Health 页 FAQ 前固定，原文照搬，禁改写）：
> "Use tarot as a reflective tool, not a substitute for professional medical care."

### 4.2 Finances 场景

| 类型 | ✅ 允许 | ❌ 禁（黑名单） |
|---|---|---|
| 话题域 | money mindset / risk awareness / spending pattern / planning behavior | 具体投资建议 / 收益暗示 |
| 表达 | "review your spending pattern" / "slow down before big purchases" | `invest now` / `you will gain` / `guaranteed` / `attract wealth quickly` / `this stock will...` |
| 逆位改写 | `a prompt to slow down and review, not a market call` | `predicts loss` / `don't invest or you'll lose` |

**统一收尾免责**（Finances 页 FAQ 前固定，原文照搬，禁改写）：
> "Treat this reading as symbolic guidance rather than investment advice."

### 4.3 五场景风险等级

| 场景 | 风险等级 | 额外约束 |
|---|---|---|
| Love | 中 | 禁"对方一定回头/一定出轨"绝对预测；用 may/likely |
| Career | 中 | 禁"一定会升职/被裁"；用 decision-frame |
| Finances | **高** | §4.2 全量 + 收尾免责 |
| Health | **高** | §4.1 全量 + 收尾免责 |
| Spiritual | 低 | 仅防"开悟承诺"（awaken guaranteed）|

---

## 5. 禁用表达库（质检关卡 0 配套）⭐⭐

> AI 生成时极易滑入的 6 类套路句。grep 兜底 + 二审人眼双查。

| 类型 | ❌ 禁 | ✅ 替代 |
|---|---|---|
| 泛泛开头 | `When this card appears...` / `In a {scenario} reading, this card...` | 直接写场景冲突（"you're about to swipe right on..."）|
| 绝对预测 | `This means you will...` / `You will definitely...` | `This may point to...` / `It often suggests...` |
| 恐吓逆位 | `A bad omen for...` / `This ruins your...` | `The growth edge is...` / `The shadow side invites...` |
| 水晶万能 | `Wear X to enhance your energy` / `X attracts love` | 写具体使用场景（"hold Tiger Eye for 5 minutes before a big decision"）|
| 医疗承诺 | `This crystal heals anxiety` / `cures insomnia` | `Use it as a reminder to...` / `a tactile cue to pause` |
| 财务承诺 | `Attract wealth quickly` / `draw money fast` | `Support clearer money choices` / `a prompt to review spending` |

**硬约束**：质检脚本对全文 grep 上表 ❌ 列，命中即打回；M5 水晶段 + M3/M4 逆位段为高发区，重点扫。

### 5.1 否定教学句上下文判定（v2.1 新增，Tower-Finances 试点反馈）

> Tower-Finances 试点发现：合规反向声明（"no crystal that attracts money" / "not a prediction of ruin"）会被 grep 禁词误命中。这类**否定教学句是合规所需**，不是违规。脚本须加上下文判定，避免误杀合规页。

**判定规则**（grep 脚本对 `attract | guarantee | predict | invest | gain | loss` 命中时执行）：
1. 检查命中词**前后各 30 字符**是否含否定标记：`not` / `no` / `never` / `cannot` / `can't` / `without` / `"no crystal"` / `"not a"`
2. 含否定标记 → 视为**合规反向声明**，**不算违规命中**，脚本放行
3. 不含否定标记 → 按原规则判违规打回

**白名单合规句（正例，脚本须放行不报错）**：
- "no crystal that attracts money"
- "not a prediction of ruin"
- "not a market call"
- "there is no crystal that guarantees returns"
- "tarot never predicts a specific loss"
- "can't substitute for professional advice"

**反例（真违规，命中即打回）**：
- "Pyrite attracts money fast"（无否定标记）
- "this card guarantees a gain"（无否定标记）
- "predicts a market loss"（无否定标记）

> 原则：合规反向声明是 Health/Finances 页的**安全语**，脚本不能因为句子里出现 `attract/predict/guarantee` 就一刀切打回——要读上下文。生产 agent 写合规页时主动用否定教学句（§4 收尾免责也是此思路），脚本须识别而非误杀。

---

## 6. 模块结构（v2 新顺序：行动 M5 在水晶 M6 前 + 三档词数）⭐

> **v2 顺序调整**：v1 是 ...M4 Reversed → M5 Crystals → M6 Eastern → M7 How to Work。v2 改为 ...M4 Reversed → **M5 Working with It（行动）** → **M6 Crystals** → **M7 Eastern** → M8 FAQ → M9 CTA。
> **理由**：先告诉用户"怎么办"再推荐水晶辅助，CTA 更自然（水晶作为行动辅助出现，而非商品突兀插入）。

### 6.1 全量模块表（3 分 benchmark 档全做；2/1 分按 §3.2 裁剪）

| # | 模块 | H2 | 3分词数 | 2分词数 | 1分词数 | 要点 |
|---|---|---|---|---|---|---|
| Intro | Hero + 钩子 | | 150-200 | 150-180 | 100-150 | 直接命中 §0 Intent，禁"when X appears" |
| M1 | TL;DR | `{Card} in {Scenario} at a Glance` | 80-120 | 80-120 | 80-100 | 判定+水晶+Featured Snippet |
| **M2** | **Card's Energy ⭐** | `{Card}'s Energy in {Scenario}` | **500-650** | 250-350 | 200-280 | 场景锚定（§7）+ 案例/咨询师视角 |
| M3 | Upright | `Upright {Card} in {Scenario}` | 250-320 | 200-280 | 150-200 | 正位具体行为 |
| M4 | Reversed | `Reversed {Card}: The Shadow` | 220-300 | 180-250 | 150-200 | 逆位 growth edge（禁凶兆）+ Health/Finances 合规改写 |
| **M5** | **Working with It（行动）⭐ 新前移** | `Working with {Card} in {Scenario}` | 200-280 | 120-180 | 合并入 M7 | **1 行动 + 1 反思问题 + 1 水晶使用方式**（§8.1）|
| **M6** | **Crystals ⭐ 新后移** | `Crystals for {Card} in {Scenario}` | 250-350 | 200-280 | 合并入 M7 | 场景化水晶 3-4 颗，写使用场景非商品（§9）|
| **M7** | **Eastern ⭐** | `{Card} in {Scenario}: Eastern View` | 180-250 | 120-180 | 合并入 M5 | 东方锚点（§10）+ 该牌专属意象词 |
| M8 | FAQ | `FAQ: {Card} in {Scenario}` | 280-380 | 200-300 | 120-180 | §11 场景固定问题池 4/3-4/2 条 |
| M9 | Shop CTA + Related | | **150-180** | 80-120 | 80-120 | 首饰 Shop CTA + §12 内链配额（3分 benchmark 放宽容纳 §13 的 12 条语义内链）|

**1 分页合并规则**：M5 行动 + M6 水晶 + M7 东方 三合一为单节 `Working with {Card} in {Scenario}`，避免 lite 页模块碎裂。

**M9 词数分档说明（v2.1 新增）**：3 分 benchmark 档 M9 放宽到 **150-180** 词，原因是 §13 该档需容纳 **12 条语义内链**（牌义页1 + 同牌场景4 + 关联牌3 + 水晶3 + Hub1），内链锚文本自然嵌入需更多词数空间；2 分 standard / 1 分 lite 内链配额减半（同牌场景 2-3、关联牌 2、水晶 2-3），M9 维持 80-120 词即可。若 2/1 分档因内链多写不下，可上调到 120-150，但不得超 150。

---

## 7. M2 场景锚定（核心防雷 ⭐⭐⭐）

> **竞品雷同根源**：Labyrinthos 矩阵用通用句"when X appears in a love reading, it means..."跨牌复用。**本模块禁此写法。**

**场景锚定 = 写该牌在该场景的具体行为/人物画像/冲突，非通用句**：

| ❌ 禁（通用，任何牌都能套） | ✅ 要（场景锚定，该牌该场景独有） |
|---|---|
| "When The Fool appears in a love reading, it means new relationship." | "you're about to swipe right on someone completely outside your usual type / a fresh start where you've been burned / the risk of falling for someone with no safety net" |
| "The Fool in career means new job." | "quitting a stable job with no backup / launching a venture with just an idea / the colleague who jumps before looking" |

**硬约束**：
1. M2 必须含该牌+该场景的**具体行为/人物画像/冲突**（从 tarot-knowledge.json archetype + 场景特定行为推导）
2. 禁通用句黑名单：`when {card} appears in a {scenario} reading, it means...` / `in {scenario}, this card suggests...`（泛填）
3. 每篇 M2 必须落到该牌 Rider-Waite 独有画面在**该场景的投射**（The Fool 的悬崖=该场景的风险点；The Tower 的崩塌=该场景的突发断裂）
4. M2 开篇句必须直接命中 §0 Intent Lens（用户真实问题），禁绕弯
5. **M2 Rider-Waite 画面描写每篇必须从不同画面元素切入（v2.2 新增，建议7，最大盲点）**：同牌 5 场景 M2 的 Rider-Waite 画面描写，**每篇必须从不同画面元素切入**——5 篇不得用同一段画面罗列句式开头。关卡 2/3（§15）连读验：M2 画面描写段同牌跨场景连续 8-gram 重复率 < 15%。

   **✅ 正例（The Fool 5 场景画面分化，每篇不同画面元素切入）**：
   - **love 从悬崖切入**（感情无安全网）："The cliff edge is the image to sit with here—not the sky the Fool gazes at, but the drop beneath the foot. In love, that drop is the relationship you're entering with no safety net..."
   - **career 从 satchel 切入**（资源未齐）："Look at the small satchel on the Fool's shoulder, not what's ahead. It's barely packed. In a career leap, that satchel is the resources you haven't yet gathered before the jump..."
   - **finances 从服饰/行装切入**（未尽调的投入）："The Fool's garments are ornate, the luggage meager—that mismatch is the image to read. In money decisions, it's the gap between how polished an investment looks and how little diligence backs it..."
   - **health 从白玫瑰切入**（身体信号的纯洁提醒）："The white rose in the Fool's left hand is the image to dwell on—untouched, pure, a signal uncluttered by story. In health, it's the body's clean signal before the mind talks over it..."
   - **spiritual 从小狗切入**（本能的初心）："The small dog at the Fool's heel is the image to listen to—instinctive, uncalculated, acting before training. On a spiritual path, that dog is the beginner's instinct before doctrine settles in..."

   **❌ 反例（5 篇逐字相同的画面罗列句式，必打回）**：
   > "Look at the Rider-Waite image: the figure gazing at the sky, a white rose of pure intention, a tiny satchel... a small dog... the cliff edge."（5 篇用同一句式罗列全部画面元素 → 同牌连读画面雷同，关卡3 ngram 必爆）

   **原则**：Rider-Waite 画面是同牌 5 场景的共享视觉资产，但**每场景只挑 1 个最贴合该场景冲突的元素深做**，其余元素不重复罗列。画面元素=该牌该场景的"视觉钩子"，不是每篇都要全套复述。

6. **M2 开篇去模板（v2.2 新增，建议8）**：M2 开篇**禁用** `doesn't show up to announce...` / `Here's the part most {scenario}-tarot pages skip...` 类模板句。每篇须用不同开篇句式。同牌 5 场景至少 3 篇用不同开篇类型，禁 5 篇同一开篇套路。

   **5 种开篇变体示例（同牌 5 场景轮换选用，至少 3 种不同）**：
   - **直接场景冲突型**："You're three dates in and already planning the trip together—the Fool's leap is already mid-air."
   - **咨询师观察型**："In the readings where The Fool surfaces for love, it almost never arrives when someone is calm. It arrives mid-leap."
   - **Myth-vs-Reality 型**："The Fool for love gets sold as 'new romance, exciting, go for it.' The card is quieter and more dangerous than that."
   - **追问型**："What does it actually mean when The Fool shows up for your career? Not 'new job'—the question under the question."
   - **反向声明型**："The Fool doesn't arrive to celebrate your boldness. It arrives to ask what's beneath the leap."

7. **Rider-Waite 投射核心句式同牌复用上限（v2.2 新增，建议9）**：`the part the figure is not looking at` 类 Rider-Waite 投射核心句式，**同牌不超过 2 篇复用**（5 篇至少 3 篇用不同投射句式）。同牌 5 场景连读验：投射句式不得 5 篇逐字复用同一句。

### 7.1 匿名来访者案例规范（v2.1 新增，benchmark 档 M2 案例感来源）

> 3 分 benchmark 档 M2 要求 **500-650 词 + 案例感/咨询师视角**（§3.2）。Love 等内在张力场景尤其需要案例来落地抽象张力。但案例若写成"某女会离婚/某男会发财"的占卜预言，反触 §4 红线。本节规范"匿名来访者案例"写法，**显式允许并约束**。

**允许并推荐的匿名案例写法（4 要素）**：

| 要素 | 要求 | 正例（The Fool for Love） |
|---|---|---|
| **化名** | 单字母 + M./J./A.（不编全名、不编可识别细节） | "M., 32, came in after three dates with someone who didn't fit any pattern she'd dated before." |
| **场景细节** | 具体到节点（"三场约会后""某次消费前""提出离职那天"），非"一段时间后" | "after three dates" / "the night before she nearly said 'I love you' on date four" |
| **两个同时为真的事实**（核心防预言结构） | 写出当事人内心**两件同时成立**的事，不写结局预测 | "M. was genuinely excited by the cross-type attraction **and** simultaneously ignoring one unconfirmed fact about his availability." |
| **牌意投射**（illustrate 非 predict） | 案例只用于**演示牌意如何投射到该情境**，不预测该人结局 | "The Fool wasn't predicting whether M.'s relationship would last——it was mirroring the leap itself, and the safety net she hadn't yet checked." |

**"两个同时为真的事实"结构为什么是核心**：
- 占卜预言 = 单线因果（"因为抽到 Fool，所以她会受伤"）→ 触 §4 红线
- 投射案例 = 双真并置（"她既兴奋于跨类型吸引 + 同时忽视了一个未确认的 availability 事实"）→ 两个事实同时成立，牌意只**命名这个张力**，不判结局
- 这种结构天然防案例变预言：读者看到的是"牌如何照亮当下内心张力"，不是"牌断该人未来"

**硬约束**：
1. benchmark 档 M2 可选 1 个匿名案例（Love/Finances/Health 内在张力强的场景推荐用；Career/Spiritual 可用咨询师视角替代）
2. **禁案例里下确定性预言**（如"M. 后来果然被辜负"）——案例只 illustrate 牌意投射到该情境，**不预测该人结局**
3. 案例必须是**化名 + 节点细节 + 双真事实**三要素齐全；缺任一要素判不合格案例，改用咨询师视角段
4. 化名禁用真实姓名、禁用可识别地域/单位（"M., a designer in her early 30s" 可以；"M., who works at Acme in Brooklyn" 不可）
5. **Finances/Health 合规页案例非强制（v2.2 新增，建议10）**：Finances/Health 合规页 benchmark 档**优先用咨询师视角/普遍模式替代匿名个人案例**——匿名案例在 Finances 易滑向"某人投资必赚/必亏"的收益暗示，在 Health 易滑向"某人查出大病"的诊断暗示，均为 §4 合规高风险。这两类场景的 M2 案例感通过**"咨询师普遍观察"段 + Myth vs Reality 段**实现，匿名个人案例**非强制**。若要用匿名案例，必须严守双真事实结构 + 禁任何收益/诊断结局（连"后来这笔投资涨了/跌了""后来确诊了"都不写）。

**反例（案例变占卜预言，必打回）**：
> ❌ "M. came to me about a Fool relationship. I told her it would end in heartbreak. Six months later, it did——proving the Fool's warning."（单线因果 + 结局预测 + 把牌当算命）

**正例（双真事实 + 投射非预测）**：
> ✅ "M., 32, sat with the Fool after three dates with someone outside every pattern she'd dated. She was genuinely lit up by the cross-type pull **and**, in the same breath, avoiding one direct question about his availability. The Fool wasn't forecasting heartbreak——it was naming the leap and the unchecked net beneath it. The work wasn't to predict the relationship's end; it was to ask the question she'd been circling."

---

## 8. 五场景差异化重心（防同牌 5 篇雷同 ⭐⭐⭐）

> 同一张牌在 5 场景的**核心隐喻必须不同**，否则 5 篇只换场景名。下表为生成时的判定规则（每牌按 archetype 推导 5 场景重心 + §3 tension 分）。

**以 The Fool 为例（5 场景重心必须不同）**：

| 场景 | The Fool 核心隐喻 | 该场景具体风险/行为 | 建议张力分 |
|---|---|---|---|
| Love | **冒险坠入**（swipe right on unusual type） | 无安全网的感情、被伤害后重新开始 | 3 |
| Career | **裸辞创业**（quit with no backup） | 只有 idea 就 launch、jump before look | 3 |
| Finances | **冲动投资**（speculative leap） | 未尽调就 all in、忽视财务预警 | 2 |
| Health | **忽视身体信号**（ignore the body's cliff edge） | 把警告当小事、拖延检查 | 2 |
| Spiritual | **初心回归**（beginner's mind） | 空杯、重新发问 | 3 |

**判定规则（AI 生产每牌 5 场景时）**：
1. 取该牌 archetype 核心特质（The Fool=leap/openness；The Emperor=structure/control）
2. 投射到 5 场景，**强制 5 个不同隐喻**（不得 5 场景都用"new beginning"）
3. 打 tension 分（§3.1），每牌挑 1-2 个 3 分场景深做，其余按 2/1 分
4. 写入 `scenario-knowledge.json > cards[i].scenarios[5]`，每场景核心隐喻词不重叠 + 带 tension/depth_tier 字段

**5 场景重心跨牌检查**：22 牌 × 5 场景 = 110 篇，同场景跨牌可共用场景结构，但**该牌独有隐喻必须命中**。

---

## 9. M5 行动模块（v2 强化，行动+反思+水晶使用三件套）⭐

> v1 的 How to Work 偏泛仪式。v2 强化：每篇固定「1 个具体行动 + 1 个反思问题 + 1 个水晶使用方式」，让用户拿到可执行步骤。

**M5 结构（固定三件套）**：

| 子项 | 要求 | 正例（The Fool for Career） |
|---|---|---|
| **1 个行动** | 动词开头，可在 24h 内做的具体动作 | "Write down the opportunity you want to leap into, plus 3 resources you already have to land it." |
| **1 个反思问题** | 直击该牌该场景的张力点 | "Are you drawn to this by calling, or running from boredom? Sit with the answer for a day before deciding." |
| **1 个水晶使用方式** | 具体使用场景（非"佩戴增强X"） | "Hold Tiger Eye for 5 minutes before the decision——a grounding cue when your enthusiasm outruns discernment, not a 'confidence boost'." |

**硬约束**：
1. 三件套缺一不可，grep 校验 M5 含"action / reflect / crystal use"三要素
2. 水晶使用方式必须写**场景+时长/动作**（hold for 5 min / place on desk during / carry to X），禁"佩戴增强能量"
3. 行动必须是该牌该场景独有（The Fool 行动=写下机会+资源；The Emperor 行动=列结构清单），禁万能"meditate on it"
4. **M5 水晶与 M6 水晶不得重复（v2.1 新增，试点反馈 1）**：M5 选 **1 颗**做"行动锚点"（用于行动/反思环节的具体使用），M6 主写**另外 2-3 颗**。M5 的水晶不得在 M6 重复 hold/place 场景。
   - **正例（Fool for Love）**：M5 用 **Moonstone** 做"对话前暂停锚点"（hold 30s before sending the risky text）；M6 主写 **Rose Quartz + Rhodonite**（Moonstone 在 M6 只做 first-step 角度轻提一句"see also Moonstone in §6 for the pause ritual"，不重复 hold 30s 场景）
   - **反例（必打回）**：M5 写"hold Rose Quartz 5 min before the date"，M6 又写"Rose Quartz: hold for 5 minutes before dating"——同颗水晶同场景重复
   - 脚本校验：提取 M5 水晶名集合 A、M6 水晶名集合 B，要求 `A ∩ B = ∅`（M5 锚点水晶不出现在 M6 主写水晶列表）

---

## 10. M6 水晶（弱化商品感，写使用场景）⭐

> 牌义页 M4 按 archetype 选 5 角色水晶；场景页 M6 按**场景需求**选 3-4 颗，选法不同。v2 进一步：写"使用场景"非"商品推荐"。

**场景→水晶倾向映射（起点，按牌调整）**：

| 场景 | 倾向水晶 | 逻辑 |
|---|---|---|
| Love | Rose Quartz / Moonstone / Rhodonite | 心轮、关系、情感流动 |
| Career | Citrine / Tiger Eye / Pyrite | 显化、意志、事业成功 |
| Finances | Green Aventurine / Pyrite / Jade | 财气、丰盛、稳健（**禁"招财速成"口径**）|
| Health | Bloodstone / Clear Quartz / Smoky Quartz | 排毒、清明、grounding（**禁"治愈X病"口径**）|
| Spiritual | Amethyst / Selenite / Labradorite | 灵性、高我、直觉 |

**硬约束**：
1. M6 每颗水晶必须说明**为什么这颗配该牌+该场景**（如"The Fool in Finances + Pyrite： Fool 的冲动冒险 × Pyrite 的招财但需聚焦 = 提醒冒险要有焦点"）
2. **弱化商品感**：写"hold / place / carry during {场景}"使用场景，禁"wear to enhance / attracts X"商品推荐口径（[1F §4.2 黑名单](../../01-竞品分析/1F-塔罗内容写法研究.md)）
3. CTA 三级降级（memory `shop-cta-no-deadlink-rule`）：跳特定石类目 HEAD 200→不 200 则 `/shop/?s={stone}` 搜索→搜索空则总 `/healing-jewelry/`
4. **M6 水晶与 M5 水晶不重复（v2.1 新增，试点反馈 1）**：M6 主写 **2-3 颗水晶**（与 M5 锚点水晶**互斥**），把"为什么是这几颗配该牌该场景"展开写透。M5 已用作行动锚点的那颗，M6 不再作为主写对象重复 hold/place 场景。
   - **正例（Fool for Love）**：M5 锚点 = Moonstone（对话前暂停），M6 主写 = **Rose Quartz（心轮打开但保边界）+ Rhodonite（受伤后重新信任的创伤疗愈石）**，各写一段"为什么这颗配 Fool×Love"，Moonstone 在 M6 仅一句话轻提"pairs with the Moonstone pause from §5"
   - **数量约束**：3 分 benchmark M6 主写 3 颗（不含 M5 锚点）；2 分 standard 主写 2-3 颗；1 分 lite M6 已合入 M5，不单列
   - **脚本校验同 §9 硬约束 4**：M5 锚点水晶 ∉ M6 主写水晶集合

---

## 11. M7 东方视角（v2 强化：锚点池+专属意象词校验，最薄弱节重点补）⭐⭐⭐

> v1 东方节最薄弱：每篇都能套"Eastern traditions view X as..."万能句。v2 用**每场景锚点池（跨牌轮换）+ 该牌专属意象词强制校验**。

### 11.1 五场景东方锚点池（跨牌轮换，相邻牌不得重复主锚点）

| 场景 | 锚点池（每牌选 1，跨牌轮换） |
|---|---|
| Love | 阴阳和合 / 红线姻缘 / 桃花方位 / 相生相克 / 缘起聚散 |
| Career | 时势顺逆 / 贵人方位 / 厚德载物 / 韬光养晦 / 守正出奇 |
| Finances | 财气聚散 / 五行偏财 / 取之有道 / 量入为出 / 散财聚人 |
| Health | 气血调和 / 子午流注 / 中庸守度 / 治未病 / 形神共养 |
| Spiritual | 初发心 / 中道 / 无为而治 / 致虚守静 / 知止 |

**轮换规则**：相邻牌（按 Major 序号）同场景不得用同一主锚点（如 Fool-Love=阴阳和合，则 Magician-Love 须换 红线/桃花/相生相克/缘起聚散之一）。

### 11.2 正例公式（4 要素）

**东方锚点 + 场景冲突 + 该牌提醒 + 一个具体行动**

✅ **正例（The Fool for Finances，锚点=财气聚散）**：
> "财气之道非只扩张，亦关聚散之气。The Fool 之 leap 在热情快于 discernment 时散财——投资前 pause 一问：此举聚财还是漏财？这一问不是否定冒险，是给冒险加一道气口。"

❌ **反例（通用万能句，必打回）**：
> "Eastern traditions view crystals as energy amplifiers that can support your financial journey."（无锚点、无该牌专属意象、无行动）

### 11.3 该牌专属意象词校验（硬约束）

1. M7 东方段必须出现**该牌专属意象词**（从 `tarot-knowledge.json > cards[i].eastern_imagery` 取，如 The Fool=悬崖/初心/白纸；The Tower=崩塌/破立；The Hermit=独照/内观）
2. 缺该牌专属意象词 → 判通用句打回
3. 东方锚点具体（非"Eastern traditions use crystals"万能句，[1F §0 红线 4](../../01-竞品分析/1F-塔罗内容写法研究.md)）

---

## 12. M8 FAQ（场景固定问题池，防规模化重复）⭐⭐

> 110+ 篇若 FAQ 自由发挥必重复。v2 用**场景固定问题池**：同场景跨牌用相同 4 问（换牌名），保证语义一致结构不雷同；不同场景问题池不同。

| 场景 | 固定 4 问（{Card} 替换） |
|---|---|
| **Love** | `Is {Card} a yes or no for love?` / `What does {Card} mean for singles?` / `What does {Card} mean for an existing relationship?` / `What does reversed {Card} mean in love?` |
| **Career** | `Is {Card} a good sign for career?` / `What does {Card} mean for a job change?` / `What does reversed {Card} mean at work?` / `What should I do when {Card} appears in a career reading?` |
| **Finances** | `Is {Card} a good sign for money?` / `What does {Card} mean for spending and saving?` / `What does reversed {Card} mean financially?` / `What should I do when {Card} appears in a money reading?` |
| **Health** | `What does {Card} say about my energy and stress?` / `What does {Card} mean for rest and routine?` / `What does reversed {Card} mean for body awareness?` / `Is {Card} a warning about my health?`（**答：reflective, not predictive**）|
| **Spiritual Growth** | `What is the spiritual lesson of {Card}?` / `What does {Card} mean for inner work?` / `What does reversed {Card} mean spiritually?` / `How can I work with {Card} on my path?` |

**硬约束**：
1. 每篇从该场景池选 3-4 问（3 分 benchmark 全 4 问，2 分 3-4 问，1 分 2 问）
2. 答案必须落该牌该场景，禁牌义页普适复读
3. Health/Finances FAQ 答案必须过 §4 合规门（含免责口径）

---

## 13. 内链配额 + 关联牌语义化（v2 新增）⭐⭐

> v1 内链只列类型。v2 给固定配额 + 关联牌按**语义**定义（非随机互链）。

**每篇固定内链配额**：

| 内链类型 | 数量 | 说明 |
|---|---|---|
| 牌义页 | ×1 | `/tarot-{card}-crystals/`（同牌普适页）|
| 同牌其他场景页 | ×2-4 | 优先链该牌 3 分标杆档场景页（导权重）|
| 同场景相关牌 | ×2-3 | 按 §13.1 语义矩阵选 |
| 水晶 meaning | ×3-4 | M6 提到的水晶各链 meaning 页 |
| Tarot Hub | ×1 | `/category/tarot/` |

### 13.1 关联牌语义矩阵（节选，全 22 牌见 scenario-knowledge.json `internal_links.related_cards`）

| 场景 | 当前牌 | 语义关联牌（链这 2-3 张） | 关联逻辑 |
|---|---|---|---|
| Love | The Fool | The Lovers / The Devil / Two of Cups | Fool 的冒险坠入 ↔ Lovers 的选择 / Devil 的执迷 / Two of Cups 的对等 |
| Career | The Fool | The Magician / The Emperor / Wheel of Fortune | Fool 的裸辞创业 ↔ Magician 的资源变现 / Emperor 的结构 / Wheel 的时机 |
| Finances | The Fool | The Emperor / Wheel of Fortune / The Devil | Fool 的冲动投资 ↔ Emperor 的财务结构 / Wheel 的周期 / Devil 的消费执迷 |
| Health | The Fool | The Hermit / Temperance / The Hanged Man | Fool 的忽视信号 ↔ Hermit 的内观 / Temperance 的中庸 / Hanged Man 的暂停 |
| Spiritual | The Fool | The Hermit / The Star / The High Priestess | Fool 的初心 ↔ Hermit 的独照 / Star 的希望 / High Priestess 的内听 |

**硬约束**：关联牌必须从语义矩阵选（每场景每牌 ≥2 张语义关联），禁随机互链或全站轮链。

---

## 14. 通用组件（复用牌义页/配对页框架）

| 组件 | 执行依据 | 场景页专属 |
|---|---|---|
| 合规/去AI化 | 牌义页 §16 | 同 + **M2 禁通用场景句、M5/M6 禁水晶并列句、§4 Health/Finances 黑名单、§5 禁用表达库** |
| CTA 预验证 | 牌义页 §3 | 场景化水晶 meaning/category HEAD 检查，三级降级 |
| Schema | 牌义页 §12 | Article + FAQPage + BreadcrumbList + ItemList（水晶指 meaning 页，禁 Product）|
| 内链 | §13 配额 + 语义矩阵 | 牌义页×1 + 同牌场景×2-4 + 同场景相关牌×2-3 + 水晶 meaning×3-4 + Hub×1 |
| 图片 | 牌义页 §14 | hero（牌视觉+场景元素+水晶，1536×864）|
| 免责声明 | §4.1/§4.2 | Health/Finances 页 FAQ 前固定免责，原文照搬禁改写 |

---

## 15. 质检关卡（v2.1 升级：9 关卡 0-8 + 语义/结构去重）⭐⭐⭐

> v1 四关卡（1-4）+ v2 新增关卡 0（合规前置门）/关卡 5（语义去重）/关卡 6（结构指纹）/关卡 7（东方意象词）+ v2.1 新增关卡 8（水晶不重复）。共 9 关（编号 0-8），二审前强制。

- **关卡 0 合规前置门**（Health/Finances 必过）：grep §4 黑名单 + §5 禁用表达库，命中即打回不进生产；校验免责声明原文存在；**对 `attract/guarantee/predict/invest/gain/loss` 命中须跑 §5.1 上下文判定**（前后 30 字符含 not/no/never/cannot/can't/without/"no crystal"/"not a" → 视为合规反向声明放行，不误杀）
- **关卡 1 场景锚定**：M2 含该牌该场景具体行为/冲突，grep 黑名单通用句；M2 开篇命中 §0 Intent
- **关卡 2 五场景差异化**：同牌 5 场景 M2 核心隐喻词重叠率 < 30%（防 5 篇雷同）；**v2.2 起同牌连读还须扫 M2 Rider-Waite 画面描写是否每篇不同元素切入（§7 硬约束 5）+ 开篇句式是否每篇不同（§7 硬约束 6）+ 投射核心句式同牌≤2 篇复用（§7 硬约束 7）**——Fool 连读暴露的最大盲点
- **关卡 3 跨牌场景 n-gram**：同场景跨牌连续 8-gram 重复率 < 15%；**v2.2 起同时跑同牌跨场景 M2 画面描写段连续 8-gram 重复率 < 15%**（§7 硬约束 5 的兜底校验）
- **关卡 4 与牌义页不重复**：M2/M3 不复制牌义页 archetype 段落（n-gram 比对）
- **关卡 5 语义去重（v2 新增）**：同场景跨牌 M2 段落 embedding 余弦相似度 >0.85 触发复审（换牌不换骨）
- **关卡 6 结构指纹（v2 新增，v2.1 升级可勾选清单）**：模块开场句式 + 论证路径指纹，同场景跨牌重复率 < 40%；**每篇 benchmark 档生产时须从下方清单勾选 ≥1 个结构变体，并在 brief 显式标注本篇用了哪些变体**（替代 v2 的"自主打乱"，给可操作标准）

  **结构变体可勾选清单（每篇 benchmark 勾选 ≥1）**：
  - [ ] **咨询师引言段**（开篇用一句话引出"在咨询室里这张牌常这样出现"的视角框架）
  - [ ] **匿名来访者案例段**（化名+节点细节+双真事实结构，见 §7.1）
  - [ ] **Myth vs Reality 段**（先列对该牌该场景的常见误读，再逐一纠正）
  - [ ] **M3/M4 合并**（正逆位合并为单节 `Upright & Reversed {Card} in {Scenario}`，用对照表而非分两段）
  - [ ] **列表化逆位**（M4 逆位用"three shapes of reversal"列表式：blocked / resisted / projected 三形态，非叙述段）
  - [ ] **M5 提前到 Intro 后**（行动模块前置，让用户先拿到"怎么办"，M2 能量放其后展开）
  - [ ] **加"常见误读/避坑"段**（独立一节列 2-3 个该牌该场景的高频误读 + 纠正）
  - [ ] **M7 东方反向破题**（东方节先否定"万能句"如"这不是 Eastern traditions view X as energy amplifier 的套话"，再落该牌专属锚点）

  **生产标注格式**（brief 字段 [12] 新增）：`structural_variants: [咨询师引言段, Myth vs Reality]`（列出本篇实际用的变体名）
  **约束**：同场景跨牌 5 篇，结构变体组合不得完全相同（至少 2 篇用不同变体组合），防"5 篇都加咨询师引言"变成新套路。
- **关卡 7 东方意象词（v2 新增）**：M7 含该牌专属意象词（从 tarot-knowledge.json 校验），缺则打回
- **关卡 8 水晶不重复检查（v2.1 新增，试点反馈 1）**：提取 M5 行动锚点水晶集合 A、M6 主写水晶集合 B，要求 `A ∩ B = ∅`；命中重复即打回，要求 M6 换另外 2-3 颗主写（见 §9 硬约束 4 + §10 硬约束 4）
- **最低成本兜底**：同场景 5 篇连读人工抽查"是否同套路换皮"（关卡 5/6 的脚本能漏过的结构性雷同）

---

## 16. 数据层 config（§10 升级：scenario-knowledge.json 字段扩展）⭐⭐⭐

> v2 在 v1（metaphor/behavior/risk/crystals）基础上扩展 10 字段，支撑 §0-§15 全部硬约束。**这是 v2 落地的关键，config 必须按本节重新生成**。

```json
{
  "card": "the-fool",
  "eastern_imagery": ["悬崖", "初心", "白纸", "第一步"],
  "scenarios": {
    "love": {
      "tension": 3,
      "depth_tier": "benchmark",
      "main_conflict": "冒险坠入 vs 安全网缺失",
      "metaphor": "adventurous fall",
      "upright_focus": "被伤害后重新开始、跨类型吸引力",
      "reversed_focus": "无安全网的感情、冲动投入",
      "rider_waite_projection": "悬崖边一步=感情里没有兜底的风险点",
      "behavior": "swipe right on unusual type",
      "risk": "no safety net",
      "eastern_anchor": "缘起聚散",
      "crystals": ["rose-quartz", "moonstone"],
      "faq_angles": ["yes-no", "singles", "existing-relationship", "reversed"],
      "internal_links": {
        "same_card": ["the-fool-for-career", "the-fool-for-spiritual-growth"],
        "related_cards": ["the-lovers-for-love", "the-devil-for-love"]
      }
    },
    "career": {
      "tension": 3,
      "depth_tier": "benchmark",
      "main_conflict": "裸辞冲动 vs 资源未齐",
      "metaphor": "quit to start up",
      "upright_focus": "only idea then launch、calling-driven",
      "reversed_focus": "jump before look、escape boredom",
      "rider_waite_projection": "悬崖=没有 backup 的裸辞",
      "behavior": "launch with just an idea",
      "risk": "jump before look",
      "eastern_anchor": "守正出奇",
      "crystals": ["citrine", "tiger-eye"],
      "faq_angles": ["good-sign", "job-change", "reversed", "what-to-do"],
      "internal_links": {
        "same_card": ["the-fool-for-love", "the-fool-for-finances"],
        "related_cards": ["the-magician-for-career", "the-emperor-for-career"]
      }
    },
    "finances": {
      "tension": 2,
      "depth_tier": "standard",
      "main_conflict": "冲动扩张 vs 财气聚散",
      "metaphor": "impulsive investment",
      "upright_focus": "speculative leap、未尽调 all in",
      "reversed_focus": "忽视财务预警、消费执迷",
      "rider_waite_projection": "悬崖=忽视尽调的投机",
      "behavior": "all in without diligence",
      "risk": "ignore warning",
      "eastern_anchor": "财气聚散",
      "crystals": ["aventurine", "pyrite"],
      "faq_angles": ["good-sign", "spending-saving", "reversed", "what-to-do"],
      "internal_links": {
        "same_card": ["the-fool-for-career", "the-fool-for-health"],
        "related_cards": ["the-emperor-for-finances", "wheel-of-fortune-for-finances"]
      }
    },
    "health": {
      "tension": 2,
      "depth_tier": "standard",
      "main_conflict": "忽视信号 vs 身体的悬崖",
      "metaphor": "ignore body's signals",
      "upright_focus": "fresh routine、重新发问身体",
      "reversed_focus": "dismiss warnings、delay checkup",
      "rider_waite_projection": "悬崖=身体的预警被无视",
      "behavior": "dismiss warnings",
      "risk": "delay checkup",
      "eastern_anchor": "治未病",
      "crystals": ["bloodstone", "quartz"],
      "faq_angles": ["energy-stress", "rest-routine", "reversed-body-awareness", "warning"],
      "internal_links": {
        "same_card": ["the-fool-for-finances", "the-fool-for-spiritual-growth"],
        "related_cards": ["the-hermit-for-health", "temperance-for-health"]
      }
    },
    "spiritual": {
      "tension": 3,
      "depth_tier": "benchmark",
      "main_conflict": "初心回归 vs naive bypass",
      "metaphor": "beginner's mind",
      "upright_focus": "空杯、重新发问",
      "reversed_focus": "naive bypass、灵性逃避",
      "rider_waite_projection": "悬崖=放下旧框架的纵身一跃",
      "behavior": "empty cup",
      "risk": "naive bypass",
      "eastern_anchor": "初发心",
      "crystals": ["amethyst", "selenite"],
      "faq_angles": ["spiritual-lesson", "inner-work", "reversed", "how-to-work"],
      "internal_links": {
        "same_card": ["the-fool-for-love", "the-fool-for-career"],
        "related_cards": ["the-hermit-for-spiritual-growth", "the-star-for-spiritual-growth"]
      }
    }
  }
}
```

### 16.1 v2 新增字段说明

| 新字段 | 用途 | 对应章节 |
|---|---|---|
| `tension` (1\|2\|3) | 张力分，决定词数+模块策略 | §3 |
| `depth_tier` (benchmark\|standard\|lite) | 深度档位 | §3.2 |
| `main_conflict` | 该牌该场景核心冲突（一句话）| §0/§7 |
| `upright_focus` / `reversed_focus` | 正位/逆位在该场景的差异化焦点 | M3/M4 |
| `rider_waite_projection` | 该牌独有画面→该场景投射 | §7 硬约束 3 |
| `eastern_anchor` | 从 §11.1 锚点池选 1 | M7 |
| `faq_angles` | 该场景 FAQ 4 问角度（映射 §12 池）| M8 |
| `internal_links.same_card` / `related_cards` | 内链目标（同牌其他场景 + 语义关联牌）| §13 |
| `eastern_imagery`（牌级） | 该牌专属东方意象词列表 | §11.3 |

---

## 17. 数据层质量阀门（v2 新增，§16/§18 配套）⭐⭐

> config 是 110+ 篇的源头；config 错则全错。v2 加判定流程 + 验收清单 + 抽审比例。

### 17.1 判定流程（config 怎么生成）

1. **AI 按 archetype 生成草案**（每牌 5 场景 metaphor/conflict/behavior）
2. **权威牌义交叉核对**（Rider-Waite 原典 + tarot-knowledge.json），标注来源依据
3. **打 tension 分**（§3.1，每牌挑 1-2 个 3 分场景）
4. **填东方锚点**（§11.1 池，跨牌轮换不重复）
5. **填内链语义矩阵**（§13.1）

### 17.2 config 验收清单（任一不满足打回）

- [ ] 每场景 metaphor 有权威投射依据（Rider-Waite 可追溯）
- [ ] 同牌 5 场景隐喻词重叠 < 30%
- [ ] behavior 是具体行为（动词短语+情境），非抽象状态（如"new relationship"）
- [ ] Health/Finances 的 risk 不触 §4 合规红线
- [ ] tension 分已打，每牌有 1-2 个 3 分场景
- [ ] eastern_anchor 跨牌轮换不重复
- [ ] internal_links.related_cards 每场景 ≥2 张语义关联（非随机）

### 17.3 抽审比例

- **3 分场景全审**（benchmark 档是权重页，错不起）
- **2 分场景抽 30%**
- **1 分场景抽 20%**（lite 页风险低，但防"诚实承认"写成灌水）

---

## 18. 生产流程（v2 升级，6 步）

1. **22 牌 × 5 场景 = 110 篇清单**（正逆位拆分再 ×2 = 220），带 tension 分标注
2. **AI 判定每牌 5 场景 config**（§16 字段全填）→ §17 质量阀门验收 → scenario-knowledge.json
3. **CTA 预验证**（水晶 meaning/category HEAD 检查，三级降级）
4. **每篇生成前 Brief**（§2 模板 11 字段）→ 质检门（隐喻重叠<30%、行为具体、意象词命中）
5. **AI 填充正文**（按 §6 模块顺序 + §3 张力档词数 + §0 Intent Lens）
6. **7 关质检**（§15）→ 二审 → 图片（hero 牌视觉+场景+水晶）→ upload → **防假完成**（线上抽样验证 img 数/schema/TKD，不只信脚本成功）

### 18.1 同批连读生产硬规则（v2.2 新增，建议12）

> **同牌 5 场景必须同一批次生产 + 连读验关卡 2/3/5/6，禁止单篇零散产出**。

关卡 2（五场景差异化：M2 核心隐喻词重叠率<30%）/关卡 3（跨场景 ngram：M2 画面描写同牌跨场景连续 8-gram 重复率<15%）/关卡 5（语义去重：M2 embedding 余弦相似度<0.85）/关卡 6（结构指纹：同牌跨场景模块开场句式+论证路径重复率<40%）**都依赖同牌多篇连读**，单篇产出验不了——单篇质检只能过关卡 0/1/4/7/8（合规/锚定/牌义页不重/东方意象/水晶不重），跨场景去重四关全部空转。

**硬约束**：
1. **生产批次 = 同牌 5 场景同批**（love/career/finances/health/spiritual 五篇同批产出），不得今天写 Fool-love、明天写 Fool-career 零散产出
2. **同批 5 篇产出后立即连读跑关卡 2/3/5/6**，四关任一不过则 5 篇同批返工（不是只改命中篇）
3. **M2 Rider-Waite 画面描写（§7 硬约束 5）+ 开篇句式（§7 硬约束 6）+ 投射核心句式（§7 硬约束 7）三处连读重点扫**——Fool 连读发现的最大盲点就是这三处在单篇质检下全合规、5 篇连读才暴露逐字雷同
4. **跨场景连读基准 = scenario-knowledge.json 该牌 5 场景 config**（§3 硬约束 4：config 档位权威，生产不得自改档位逃避连读基准）
5. 单篇零散产出（如临时补写某牌某场景）必须先回读该牌其余已有场景篇，按连读标准自检关卡 2/3/5/6 四关，不得跳过

---

## 19. 与其他框架边界

见 [配对框架 §11](模板-Tarot-配对文章框架.md)。场景页讲**一牌在一场景**，配对页讲**两牌关系**，不重叠。
