# Numerology (Life Path) 文章框架 v1（12 篇：1-9 + Master 11/22/33）

> **适用**：`/life-path-{n}/` 灵性 × 自我认知页（Life Path 1-9 各一篇 + Master Numbers 11/22/33 各一篇，共 12 篇）
> **竞品依据**：solacely.co（Life Path 1-9 全做，每篇 What is / How to Calculate / Traits / Crystals / Daily Life / Charge / Final Thought 七段，配 5 颗水晶：Clear Quartz/Citrine/Garnet/Amethyst/Tiger's Eye 等）+ moonrisecrystals.com（Numerology X Healing Crystals 系列商品归档）+ californiapsychics.com（Best Crystals for Your Life Path）+ navratan.com（印度体系 Lucky Stone For X Number，配 Ruby/Cats Eye/Yellow Sapphire 等传统宝石）
> **数据**：`_shared/numerology-knowledge.json`（12 个 Life Path × archetype/traits/crystals 5 角色/master_note 单源）+ crystal-attributes.json（390 颗水晶 overview）+ chakra-knowledge.json
> **核心策略**：天使号码同款"植入水晶变现"逻辑平移 —— Numerology 主词被大站（Cosmopolitan/mindbodygreen/numerology.com）垄断，**做"crystals for life path X"交叉长尾**（SERP 全是小站，goearthward 同生态位可排）+ **计算器工具承接**（life path calculator AIO 空缺）
> **差异化空间**：竞品 solacely 只做 1-9，**未做 Master Numbers 11/22/33 独立页** —— 这正是我们的差异化。Master Number 篇用 master_note 真实定义（非简单放大）

---

## 1. URL + TKD

- URL：`/life-path-{n}/`（根级，无 category base，2A §一 URL 规则一致；Master 写 `/life-path-11/` `/life-path-22/` `/life-path-33/`）
- **Title（短版）**：`Life Path {N}: Meaning, Personality & Best Crystals`（控制在 60 字符内）
- **Title（长版备用）**：`Life Path Number {N} Meaning + Best Crystals for {Archetype}`
- **H1**：`Life Path {N}: The {Archetype} — Meaning, Traits & Best Crystals`
- Primary KW：`life path {n}` / `life path {n} meaning` / `crystals for life path {n}`
- Secondary KW：`life path number {n} personality` / `life path {n} compatibility` / `life path {n} career`
- rank_math 三件套必写（title / description / focus_keyword = `life path {n}`）

## 2. 模块结构（11 模块，目标 2000-2800 词）

| # | 模块 | H2 | 词数 | 要点 |
|---|---|---|---|---|
| Intro | Introduction | （无 H2，导言段）| 120-180 | 1 是谁的钩子（"If you keep meeting the same patterns..."）+ archetype 一句话 + 含主关键词 + 三视角自然融入 |
| M1 | Quick Answer | `Life Path {N} at a Glance` | 80-120 | 速答 + Featured Snippet bait + 3 点 bullet（archetype / 核心特质 / 推荐水晶）对标 Google AIO 结构 |
| **M2** | **How to Calculate** ⭐工具联动 | `How to Calculate Your Life Path Number` | 200-300 | 计算方法 4 步 + **Master Number 规则** + 示例 + **CTA 到 Numerology Calculator 工具**（见 §3）|
| M3 | Personality & Traits | `Life Path {N} Personality & Traits` | 250-350 | **"是什么样的人 / 日常表现"**（具体场景描写，非泛 trait 词，见 §2A 边界）|
| M4 | Love & Compatibility | `Life Path {N} in Love & Compatibility` | 200-300 | Singles / Relationship / 最配号码（related_numbers 配 compatible）|
| M5 | Career & Purpose | `Life Path {N} Career & Life Purpose` | 200-300 | 适合的方向 + purpose_keyword 展开 + 非命中注定式表达 |
| **M6** | **Best Crystals** ⭐差异化 | `Best Crystals for Life Path {N}` | 350-450 | **竞品独有段强化**（5 角色 H3 分层，见 §4）|
| **M7** | **Crystal Ritual / Daily Practice** ⭐仪式型 | `A Simple Crystal Ritual for Life Path {N}` 或 `Daily Crystal Practice for Life Path {N}` | 150-220 | **具体仪式/练习步骤**（非泛"How to Use"，见 §4A）|
| **M8** | **Strengths & Challenges** ⭐深化 | `The Gifts and Growth Edges of Life Path {N}` | 200-300 | **强制表格化**：Gift / Overplayed Edge / How to Rebalance 三列，**只写成长张力与转化**，禁写日常表现（M3 已覆盖，见 §2A 边界）|
| M9 | FAQ | `Frequently Asked Questions` | 300-400 | 三层分层（见 §7）|
| M10 | Related + Closing | `Related Life Path Numbers` | 80-120 | 兄弟号码互链 + 收尾 |

**篇幅**：1-9 主力 2000-2800 词；Master Numbers（11/22/33）2500-3000 词（master_note + 加重段更深）

### module_weights：1-9 差异化重心（防 12 篇模板感）

> 不只 Master Numbers 有模块权重，**1-9 每篇 M3 / M5 / M8 的内容重心也不同**。生产时按本表分配"该号码最该深挖的张力"，避免 12 篇只是换号码换形容词。

| Life Path | Archetype | M3 Personality 重心 | M5 Career 重心 | M8 Growth Edges 张力（表格核心张力点） |
|---|---|---|---|---|
| 1 | Leader | leadership / independence / self-trust / initiative | 先锋型/独立创业者/开创方向 | 独断 ↔ 孤立；self-trust 滑向 dismissive |
| 2 | Peacemaker | relationship / emotional sensitivity / cooperation / boundaries | 调解/支持/协作型方向 | 取悦 ↔ 失自我；sensitivity 滑向 oversensitive |
| 3 | Creative | creativity / expression / visibility / joy | 创意/表达/内容创作方向 | 散漫 ↔ 浅尝辄止；visibility 焦虑 |
| 4 | Builder | structure / discipline / stability / long-term building | 工程/系统/长期建设方向 | 刻板 ↔ 控制欲；stability 滑向 rigidity |
| 5 | Freedom Seeker | freedom / adaptability / restlessness / grounding | 体验/变化/多元方向 | 散乱 ↔ 逃避承诺；restlessness 滑向不稳定 |
| 6 | Nurturer | care / family / service / overgiving | 照护/服务/家庭方向 | 过度付出 ↔ 怨气；overgiving 滑向 martyrdom |
| 7 | Seeker | introspection / spirituality / knowledge / isolation | 研究/专精/内省方向 | 孤立 ↔ 疏离；isolation 滑向 avoidant |
| 8 | Powerhouse | ambition / money / power / responsibility | 商业/财务/领导方向 | 控制欲 ↔ 工具化他人；power 滑向 dominating |
| 9 | Humanitarian | compassion / completion / humanitarian / emotional release | 公益/艺术/收尾方向 | 牺牲 ↔ 自我耗竭；completion 滑向 burnt-out |

**页面个性化权重规则（生产硬约束）**：
1. **每篇 M3 必须落到该号码 4 个 trait 词中的至少 2 个具体日常场景**（如 LP1 写"主动发起会议、不等被指派"而非"你是天生领导者"；LP7 写"能一个人研究某主题数小时不觉累"而非"你爱思考"）。
2. **每篇 M5 的 purpose 展开必须用该号码的 purpose_keyword**（如 LP1=initiation / LP4=foundation / LP9=completion），禁止 12 篇都用"find your purpose"套话。
3. **每篇 M8 表格的"Growth Edge"列必须写该号码独有张力**（见上表最右列），不能用通用"work-life balance / perfectionism"塞满 9 篇。
4. **trait 词轮换检查**：12 篇之间 M3 主体 trait 词组**重叠率 < 30%**（如 LP1 的 leadership 与 LP8 的 ambition 虽相关但落点不同：LP1 落"自我领导"、LP8 落"物质与组织掌控"）。二审脚本统计 trait 词频，超 30% 触发重写。

### M3 / M8 边界（防重叠 ⭐）

> **物理区隔**：Personality（M3）与 Strengths & Challenges（M8）天然重叠，必须分工。M3 写"是什么样的人"，M8 严格只写"成长张力如何转化"，且 M8 **强制用表格**（非段落）做物理区隔。

| 模块 | 写什么 | 不写什么 | 形式 |
|---|---|---|---|
| **M3** | 日常表现 / 行为场景 / "你是这样的人" | 不写"如何改进"、不写 Gift-Edge 对照 | 自然段 + strength bullet |
| **M8** | 成长张力 / 短板如何转化 / 过度特质如何平衡 | 不重复描写"是什么样的人" | **强制表格**（见下） |

**M8 强制表格模板**（每篇必用此结构，非段落）：

| Gift (健康表达) | Overplayed Edge (失衡时) | How to Rebalance (转化动作) |
|---|---|---|
| {strength 正向} | {该 strength 滑向的极端，来自 module_weights 张力列} | {一句话可执行调整，带水晶/场景} |

**示例（LP1 Leader）**：
| Gift | Overplayed Edge | How to Rebalance |
|---|---|---|
| Self-directed initiative | Dismissing others' input / going solo | Pause for one external perspective before deciding (Tiger Eye as a "stay grounded" cue) |

**边界硬约束**：
- M3 出现的 trait 场景，M8 **不得复述**，只引用其"过度形态"
- M8 的"How to Rebalance"列必须落到可执行动作（非"be more balanced"套话），可与 M7 仪式呼应但不复述

## 3. M2 How to Calculate 段（工具联动核心 ⭐）

**位置**：M1 之后、M3 之前。**这是 Numerology 区别于天使号码的关键模块**（天使号码不需计算，Numerology 必须教用户算）。

**内容骨架**（从 `numerology-knowledge.json > calculation` 读取，全站单源）：
```
## How to Calculate Your Life Path Number

Your Life Path Number is calculated from your full birth date using Pythagorean
reduction — adding the digits of the month, day, and year and reducing them to
a single digit (with one important exception for Master Numbers).

**Step 1:** Write your birthdate as MM/DD/YYYY.
**Step 2:** Reduce each part (month, day, year) to a single digit.
**Step 3:** Add the three reduced numbers together.
**Step 4:** Reduce the total to a single digit.

**Master Number rule:** In our calculator, we reduce the month, day, and year
separately, then add them together. If the final total is **11, 22, or 33**, we
keep it as a Master Number instead of reducing it further. Some numerology
traditions also preserve Master Numbers during intermediate steps, but this page
uses one consistent method for clarity. Master Numbers carry intensified energy
with higher potential — and higher demand. All other double digits are reduced
to a single digit.

> Want to skip the math? **[Use our free Life Path Number Calculator →](/tools/numerology-calculator/)**
> Enter your birth date and get your number, archetype, and crystals in seconds.
```

**规则**：
- 每篇 Life Path 文章的 M2 **统一**引用 calculation 单源（避免 12 篇各写各的计算步骤导致不一致）
- **计算规则单源 + 工具同步**：上述算法是**全站唯一定义**，写入 `numerology-knowledge.json > calculation`，**计算器工具（07-互动工具/numerology-calculator/）必须用同一套算法**（月/日/年分别归约→相加→仅最终总计为 11/22/33 时保留），不允许文章写 A 流派、工具实现 B 流派造成用户拿到不同号码
- 工具 CTA 是**每篇必放**（计算器工具是 Numerology 内容群的工具承接，参考 birthstone-finder 模式）
- Master Number 篇（11/22/33）的 M2 额外加一段：解释为什么这个号码不归约 + master_note

## 4. M6 Best Crystals 段（差异化核心 + 转化强化）

**位置**：M5 之后、M7 之前。**天使号码框架 v2 §3 直接平移**（5 角色 H3 分层 + 购买意图标签 + 句式轮换）。

**H3 购买意图分层**（每篇 5 颗，从 `numerology-knowledge.json > numbers[i].crystals` 读取）：
```
## Best Crystals for Life Path {N}

### Best Overall Crystal for Life Path {N}
[best_overall — 绑 archetype 核心特质]

### Best Crystal for Love & Relationships
[best_love — 跨号码统一需求]

### Best Crystal for Grounding & Protection
[best_protection — 平衡挑战 / 过度特质]

### Best Crystal for Manifestation & Focus
[best_manifestation — 强化优势]

### Best Crystal to Wear Daily
[best_daily_wear — 价位友好 / 百搭 / 耐用]
```

> **注**：M6 只负责"选哪 5 颗石头 + 为什么"（5 角色 H3 分层）。"怎么用"独立成 M7（仪式/练习型），见 §4A。两模块分工：M6 = 选石头，M7 = 怎么用。

**每颗水晶写法**（3-4 套句式轮换，避免 12 篇同结构句，直接复用天使号码 v2 §3 的 4 个变体）：
- 变体 A：`{Crystal} resonates with Life Path {N}'s {archetype特质}. Its {Intentions} quality makes it a natural companion when...`
- 变体 B：`For Life Path {N}, {Crystal} offers {具体支持}. Known for {属性}, this stone helps you...`
- 变体 C：`If you are a Life Path {N}, try working with {Crystal}. It supports {动作} by...`
- 变体 D：`{Crystal} pairs naturally with Life Path {N}'s energy. As a stone of {属性}, it can serve as a daily reminder to...`

**每颗水晶固定组件（CTA 文案轮换降模板感）**：
- Read 链接（2-3 套轮换，非 12 篇同一句）：
  - 套 A：`Read {Crystal} Meaning →`（`/gemstone/{slug}-meaning/`）
  - 套 B：`Explore {Crystal} in depth →`（同 URL）
  - 套 C：`{Crystal} properties & symbolism →`（同 URL）
- Shop 链接（2-3 套轮换）：
  - 套 A：`Shop {Crystal} →`（`/product-category/{slug}-crystals/`）
  - 套 B：`Browse {Crystal} jewelry →`（同 URL）
  - 套 C：`Find your {Crystal} piece →`（同 URL）
- **同篇内 5 颗水晶的 CTA 文案必须混用 2-3 套**（如 best_overall 用 A、best_love 用 B、其余用 C/A 交错），禁止 5 颗全用"Shop X →"

### M6 产品 CTA 预验证（生产前硬检查 ⭐）

> **提升为生产前强制门**：M6 的 Read/Shop CTA 在 AI 填充前，先批量验证目标 URL 存在，**404 不上线**。避免 12 篇 × 5 颗 = 60 个潜在死链。

**生产前流程**（在 generate-articles.js 填充 M6 前执行）：
1. **输出 crystal slug 清单**：从 12 篇的 `crystals` 字段提取所有去重 slug（预计 15-25 颗，因 best_love 跨号复用 rose-quartz）。
2. **批量 HEAD 检查**两个目标：
   - `/gemstone/{slug}-meaning/`（Crystal Meaning CPT，goearthward 已上线 390 颗，memory `crystal-content-recovery`）
   - `/product-category/{slug}-crystals/`（WooCommerce 产品集合页）
3. **降级规则**（memory `shop-cta-no-deadlink-rule` 三级优先）：
   - Shop 目标 404 → 改用 `/shop/?s={crystal}` 产品搜索（验证搜索结果非空）
   - 搜索也空 → 改用上层分类（如 `/product-category/healing-jewelry/`）+ 文案改为"Browse healing jewelry"
   - Meaning 目标 404 → 暂去 Read CTA，仅保留 Shop（不允许保留死链 Read）
4. **生成 validation 报告**：`04-内容生产/10.numerology/_cta-validation.json`，记录每个 slug 的最终 CTA URL + 状态码 + 是否降级。**报告必须全绿才进入 AI 填充阶段**。

### M6 水晶绑定三要素（每颗水晶强制规范 ⭐）

> **反通用化硬约束**：每颗水晶不只写"X supports confidence"（这种句子任何号码都能套）。**必须三要素齐全**，把水晶锚定到该号码的具体挑战/优势上。

**三要素**：
1. **Life Path 号码具体挑战/优势**（从 module_weights 表 + challenges/strengths 取，非泛 trait）
2. **水晶 symbolic support**（从 crystal-attributes.json 的 Intentions/symbolism 取，说清"为什么是这颗"）
3. **具体使用场景**（一句话落到日常动作/情境，非"carry it with you"万能句）

**示例（LP5 Freedom Seeker × Smoky Quartz）**：
> When Life Path 5's adaptability turns into "starting five things and finishing
> none," Smoky Quartz serves as a grounding anchor. Its gentle, stabilizing
> energy is traditionally used to release excess mental static — try holding it
> for two minutes before committing to a new project, as a physical cue to check
> whether the impulse aligns with what you actually want to build.

✅ 上述满足三要素：①LP5 具体张力"想同时尝试太多方向难完成选择" ②Smoky Quartz = grounding/release static（symbolic support） ③场景"决定新项目前握两分钟"。

**反例（不合格，二审必打回）**：
> ❌ "Smoky Quartz supports Life Path 5's energy. It is a grounding stone that
> helps with stability."（任何号码都能套，无 5 号具体挑战，无场景）

**5 角色 × 三要素检查清单（M6 每颗都要过）**：
| 角色 | 号码具体挑战/优势来源 | symbolic support | 场景 |
|---|---|---|---|
| best_overall | archetype 核心特质 | 主 Intentions | 日常佩戴/晨间 |
| best_love | 关系模式（M4） | 关系类属性 | 约会/沟通前 |
| best_protection | 过度特质（M8） | 防护/吸收类属性 | 过载时/睡前 |
| best_manifestation | 优势放大 | 显化类属性 | 目标设定时 |
| best_daily_wear | 日常落地 | 百搭属性 | 随身/工作日 |

**水晶选择依据**（已在 numerology-knowledge.json 锁定，三重交叉）：
1. archetype / core_traits ↔ 水晶 Intentions 字段语义匹配（crystal-attributes.json 390 颗）
2. 竞品 solacely/navratan/commonly-used 验证（Life Path 1: solacely 配 Clear Quartz/Citrine/Garnet/Amethyst/Tiger's Eye，我们 best_overall 选 Citrine 同款但理由更精准）
3. 5 角色平衡：best_overall(主推) + best_love(rose-quartz 常出现，跨号码统一爱情需求) + best_protection(黑系) + best_manifestation(显化系) + best_daily_wear(价位友好)

**水晶内链平衡**（避免 12 篇集中链 Clear Quartz/Citrine）：
- best_overall/best_manifestation 两角色是差异化主力（每号不同）
- best_love 多次出现 rose-quartz 是**有意的**（爱情跨号码需求，且 rose-quartz 是主推产品线）
- best_protection/best_daily_wear 错开不同水晶带动长尾 meaning 页

## 4A. M7 仪式 / 练习型模块（取代旧"How to Use"）

> **去重改造**：原 M6 下嵌"How to Use"+ M7 独立"How to Use"重复。现 **M6 = 选石头（5 角色）**，**M7 = 怎么用（具体仪式/练习）**，分工清楚。

**H2 标题（轮换避免 12 篇同 H2）**：
- 版本 A：`A Simple Crystal Ritual for Life Path {N}`
- 版本 B：`Daily Crystal Practice for Life Path {N}`
- Master Number 篇（11/22/33）专用版：`Working with Crystals at the Master Level: A Practice for Life Path {N}`

**内容骨架（从 numerology-knowledge.json > recommended_action 取该号码独有动作）**：
```
## A Simple Crystal Ritual for Life Path {N}

A short practice to bring {archetype}'s energy into your day. Keep it practical —
crystals are a focus for intention, not magic.

**You'll need:** {从 M6 5 颗中选 1-2 颗，优先 best_overall 或 best_protection}

**Step 1 — Set the focus (1 min):** {该号码 recommended_action 的具体意图，
如 LP1 = "name one thing you want to lead or initiate this week"}
**Step 2 — Hold the stone (2 min):** {symbolic support 一句话，为何这颗配此号码}
**Step 3 — Close with one commitment:** {把抽象反思落成一个可执行的小承诺}

> Prefer something quicker? Try the daily version: {一句话日常微动作，
如 LP5 = "touch your Smoky Quartz before saying yes to anything new"}
```

**M7 与 M6 的边界（防重叠）**：
- M6 写"**为什么**这 5 颗配 {N}"（symbolic support + 三要素，见 §4 水晶绑定三要素）
- M7 写"**怎么用**它们做一个练习"（步骤 + 场景 + 承诺）
- M7 **不复述** M6 的水晶属性，只引用"选 Step 2 的那颗" + 一句 symbolic reminder

**12 篇仪式差异化（防模板感）**：
- 仪式动作锚定 module_weights 表的号码重心（LP1 仪式=initiate/lead / LP4 仪式=structure a foundation / LP9 仪式=release & complete）
- 仪式时长固定（5 分钟内），但**焦点意图每号不同**，禁止 12 篇都是"hold the stone and breathe"

## 5. Life Path 号码 → 水晶映射总览（防同质化）

| Life Path | Archetype | best_overall | best_protection | best_daily_wear | unique_angle |
|---|---|---|---|---|---|
| 1 | Leader | Citrine | Tiger Eye | Garnet | self-directed will |
| 2 | Peacemaker | Moonstone | Howlite | Aquamarine | receptive cooperation |
| 3 | Creative | Citrine | Amazonite | Yellow Apatite | joyful expression |
| 4 | Builder | Green Jade | Hematite | Green Aventurine | steady foundation |
| 5 | Freedom Seeker | Aquamarine | Smoky Quartz | Turquoise | adaptive experience |
| 6 | Nurturer | Rose Quartz | Black Tourmaline | Rhodonite | caring service |
| 7 | Seeker | Amethyst | Black Tourmaline | Lapis Lazuli | introspective wisdom |
| 8 | Powerhouse | Pyrite | Black Tourmaline | Tiger Eye | material mastery |
| 9 | Humanitarian | Malachite | Black Tourmaline | Bloodstone | universal compassion |
| **11** | **Spiritual Messenger** | **Amethyst** | **Black Tourmaline** | **Selenite** | **master intuition** |
| **22** | **Master Builder** | **Clear Quartz** | **Black Tourmaline** | **Tiger Eye** | **masterful manifestation** |
| **33** | **Master Teacher** | **Rose Quartz** | **Black Tourmaline** | **Moonstone** | **compassionate uplift** |

**防同质化规则**：
- 同元素/同主题的号码（如 1/8 都是领导力），best_overall/best_manifestation 至少错开 1 颗
- best_love 跨号统一 rose-quartz 是有意的（爱情统一承接），但 6/33 用 rose-quartz 作为 best_overall 时，best_love 换成 moonstone/rhodonite 错开
- Master Numbers（11/22/33）的水晶组合与对应基础号（2/4/6）必须有差异（11 ≠ 2 的水晶组合，体现 master 升级）

## 6. Master Number 专属规则（11/22/33 三篇差异化核心）

**这是竞品 solacely 未做的空白，我们的核心差异化**。

**master_note 必须真实使用**（从 numerology-knowledge.json 读取）：
- **11** = doubled 1 through sensitivity of 2 (1+1=2) → Spiritual Messenger（非"更好的 2"）
- **22** = doubled 2 through structure of 4 (2+2=4) → Master Builder（非"更好的 4"）
- **33** = doubled 3 through nurturing of 6 (3+3=6) → Master Teacher（非"更好的 6"）

**Master Number 篇 M2 加重段**（基础号篇无此段）：
```
### Why {11/22/33} Is Not Reduced

In numerology, 11, 22, and 33 are Master Numbers. They are kept in double-digit
form because they carry intensified energy with higher potential — and higher
demand. Operating at master level is a choice, not a guarantee; many people with
Master Numbers also experience the grounded energy of their root number (2, 4, or 6)
as their everyday baseline.

{master_note 全文}
```

**Master Number 模块权重调整**：
- 11：M4 Love & Compatibility 加重（灵性伴侣长尾强）+ M3 Personality 加重（sensitivity 张力）
- 22：M5 Career & Purpose 加重（master builder 事业主题）+ M8 Strengths & Challenges 加重（压力张力）
- 33：M5 Career & Purpose 加重（healing/teaching 方向）+ M8 加重（自我牺牲张力）

## 7. FAQ 三层分层

**第一类：主搜索意图**（必含）
- What does Life Path {N} mean?
- What is the personality of a Life Path {N}?

**第二类：高转化意图**（必含）
- What are the best crystals for Life Path {N}?
- Who is Life Path {N} most compatible with?（M4 关系长尾）

**第三类：信任与合规**（必含）
- Is numerology scientifically proven?
- Can my Life Path Number change?（**答：不会，由出生日期决定；但 Master Number 是否激活是个人选择**）

### FAQ 答案差异化规则（降站内重复 ⭐）

> **问题可重复，答案分两半**：信任/合规类问题在 12 篇都会出现（用户期望），但若答案全站逐字相同会被搜索引擎判薄内容。规则：**前半句全站一致（建立权威）+ 后半句加该号码具体语境（差异化）**。

**模板**：`[全站统一前半] + [该号码具体后半]`

**示例 1 — "Is numerology scientifically proven?"**：
- 全站前半（一致）："Numerology is part of symbolic and spiritual traditions, not established science — there's no peer-reviewed evidence that birth numbers determine personality or outcomes."
- 号码后半（差异化，按 module_weights 重心改写）：
  - LP1：`...For Life Path 1, the value isn't in proving leadership is "destined," but in using the description as a mirror for your self-trust and initiative.`
  - LP6：`...For Life Path 6, the reflection is about care and boundaries — noticing where you overgive, not predicting your family role.`
  - LP7：`...For Life Path 7, it's a prompt for introspection and where knowledge-seeking serves (or isolates) you.`

**示例 2 — "Can my Life Path Number change?"**：
- 全站前半（一致）："No — your Life Path Number is fixed, calculated from your birth date. What can change is how consciously you work with it."
- 号码后半（差异化）：
  - LP1：`...A Life Path 1 may lean into initiative in one season and rest in another, but the underlying self-leadership theme remains.`
  - LP5：`...Your freedom-seeking theme stays; what shifts is whether it expresses as adaptability or as scattered restlessness.`
  - Master 11：`...For Master Number 11, the deeper question is whether you're operating at master-level intuition or resting in the grounded 2 energy (1+1=2) — both are valid.`

**规则**：
1. 12 篇的同一问题**前半句逐字一致**（合规口径统一）
2. **后半句必须引用该号码 archetype + module_weights 重心词**（如 LP1 用 independence/initiative，LP6 用 care/boundaries）
3. 二审脚本对比 12 篇 FAQ 答案的**后半句相似度 < 40%**（前半句允许 100% 一致）

**选做**（按号码适用性）：
- What careers are best for Life Path {N}?（M5 长尾，非命中注定式）
- What is the lucky stone for number {N}?（印度体系 navratan 竞品词，我们用西方水晶体系答，提传统宝石但不主导）
- Is {N} a Master Number?（**仅 11/22/33 篇**）
- What chakra is Life Path {N} associated with?（我们独有，竞品无，从 element/color 反推脉轮）

## 8. Schema

- **Article**：每篇必配
- **FAQPage**：M9（问题答案与页面可见 FAQ 严格一致）
- **ItemList**：M6 水晶段（列 crystal guide items，**不列商品** —— 除非页面真实展示商品信息）
- **BreadcrumbList**：Home > Blog > Numerology > Life Path {N}

### ItemList 执行细则（防滥用 Product schema ⭐）

> **核心约束**：M6 是"水晶指南"不是"商品列表"，**禁止用 Product schema**（页面无真实商品价格/库存/评价数据，滥用 Product 会被 Google 判 spam）。

**正确做法**：
- 用 `ItemList`，`itemListElement` 每项指向 **Crystal Meaning 页**（`/gemstone/{slug}-meaning/`）或**页内锚点**（`#best-overall` 等），**不指向 product/category 商品页**
- 每项 `item` 类型 = `Article` 或 `CreativeWork`（crystal guide 条目），不是 `Product`
- 字段：`name` / `description`（该水晶为何配此号码，一句话）/ `url`（meaning 页或锚点）
- 商品意图由可见 CTA（Shop 链接）承担，不进 schema

**二审确认项**：
- 确认 `ItemList` 每项 url 指向的 meaning 页**真实存在**（接 §4 M6 CTA 预验证报告）
- 确认 schema 中列出的水晶与页面 M6 可见 5 颗水晶**完全一致**（不多不少）
- 确认无任何 `Product` / `Offer` / `AggregateRating` 字段出现在 schema（除非页面真实接入 WooCommerce 商品数据）

## 9. 内链规则

- ≥1 Crystal Meaning 页（`/gemstone/{slug}-meaning/`，5 颗水晶各链）
- ≥1 产品集合页（`/product-category/{slug}-crystals/`，先验证 200）
- ≥2 兄弟号码（related_numbers 互链，如 Life Path 1 ↔ 11/5/3）
- **1 个 Numerology Calculator 工具**（M2 CTA，单向 `/tools/numerology-calculator/`）
- 1 个 Numerology Hub（如建汇总页 `/numerology/`，单向回链；未建则暂缺接受临时）
- **天使号码内链**（可选）：Life Path 1 篇可链 `/1-angel-number-meaning/`（同数字能量呼应，天使号码已上线 100 篇可复用流量）

### 生产后内链热力统计（负载平衡检查 ⭐）

> **问题**：best_love 跨号统一 rose-quartz 是有意的，但 12 篇集中链 rose-quartz / clear-quartz / citrine 可能让 3-4 个 meaning 页吃掉绝大多数内链，其余 380+ meaning 页吃不到 Numerology 群的内链权重。

**生产后强制步骤**（12 篇 publish 后跑）：
1. **扫描 12 篇所有 `/gemstone/{slug}-meaning/` 内链**，统计每个 slug 被链次数
2. **生成内链热力图**：`_qc/post-link-heatmap.json`，按被链次数降序
3. **失衡判定**（任一触发即标红）：
   - 单一 meaning 页被 ≥ 8 篇链（占比 > 66%）
   - Top 3 meaning 页合计吃掉 ≥ 70% 的 Numerology 群内链
4. **失衡修正**（非阻塞，但必须处理）：
   - rose-quartz 失衡：best_love 在 2-3 篇里换成 rhodonite / moonstone / rhodochrosite（同爱情属性，分散权重）
   - clear-quartz / citrine 失衡：best_overall 或 best_manifestation 在相关号码换成语义近似的次选水晶
   - 修正时优先动 best_daily_wear / best_love（差异化空间大），少动 best_overall（每号主推已锁定）
5. **长尾覆盖检查**：确认 12 篇合计至少触达 ≥ 15 个不同 meaning 页（非只 3-4 个高频页循环）

**允许的有意集中**：
- best_love 多次 rose-quartz：允许，但总数 < 8 篇（其余用替代石分散）
- Master Numbers（11/22/33）共享 Black Tourmaline 作 best_protection：允许（防护跨 master 统一需求），但 Master 篇其他角色水晶必须与基础号差异化（见 §5 防同质化规则）

## 10. 图片配置

- **Hero**：号码视觉 + 水晶组合（1536×864）—— **天使号码 hero 风格平移**（memory `angel-numbers-hero-visual-style`：号码数字 + 水晶 graphic，专用 generate-images.js 不加 no text 以允许渲染数字）
- **Calculation diagram**：Life Path 计算步骤示意图（Step 1-4 + Master Number 分支，教育性 infographics）
- **每颗水晶**：复用 390 图库（同天使号码）
- **Master Number 篇**：额外 master_number 视觉（11=双光柱 / 22=建筑结构 / 33=心+教学符号）

## 11. 数据层 config（`07-互动工具/_shared/numerology-knowledge.json`）

**已建**（v1，2026-06-28）。每号码配置字段：
```json
{
  "number": 1,
  "slug": "1",
  "is_master": false,
  "archetype": "The Leader / The Pioneer",
  "theme": "Independence / Leadership",
  "unique_angle": "...",
  "primary_intent": "independence",
  "secondary_intent": "self-leadership",
  "core_traits": [...],
  "strengths": [...],
  "challenges": [...],
  "emotional_state": "...",
  "recommended_action": "...",
  "purpose_keyword": "initiation",
  "ruling_planet_note": "...",
  "element": "Fire / Solar",
  "color": "Red, Gold, Orange",
  "avoid_claims": [...],
  "crystals": {
    "best_overall": {"slug": "citrine", "reason": "..."},
    "best_love": {...}, "best_protection": {...},
    "best_manifestation": {...}, "best_daily_wear": {...}
  },
  "related_numbers": [...],
  "related_reason": "..."
}
```

**工具单源**：`numerology-knowledge.json` 同时供：
1. **文章生产**（04-内容生产/10.numerology/ 读取生成 articles/*.json）
2. **计算器工具**（07-互动工具/numerology-calculator/ 读取计算结果展示 archetype + crystals）

> 工具本身用户另开窗口做（参考 birthstone-finder 模式），agent 只备数据。

### 工具前置依赖（12 篇发布门 ⭐）

> M2 每篇必放"Use our Life Path Calculator →"CTA，指向 `/tools/numerology-calculator/`。**该工具未上线时此 CTA 即死链**。必须明确发布顺序与降级方案。

**主方案（推荐）**：
- **12 篇 Numerology 文章的发布前置依赖 = Numerology Calculator 工具上线**
- 工具优先级与 birthstone-finder / crystal-cleansing-timer 同级，先于或同期发布 12 篇文章
- 工具上线后，12 篇才能从 draft 转 publish

**降级方案（工具未上线时的临时承接）**：
1. M2 CTA 目标临时改为**静态计算说明页**（如 `/numerology/how-to-calculate/` 或临时在 Hub 页锚点 `#calculate`），文案改为：
   > `Learn the full calculation method →`（指向说明页，非工具）
2. 该说明页内容 = §3 M2 计算骨架的完整版（4 步 + Master Number 规则 + 示例），承担"教用户算"的搜索意图
3. 工具上线后，批量把 12 篇 M2 CTA 从说明页换回 `/tools/numerology-calculator/`（脚本批量改 link，不重写正文）

**硬约束**：
- **禁止 12 篇带死链 CTA publish**（即使工具"快做好了"）
- 降级方案上线时，§13 生产流程步骤 6 二审必须验证 M2 CTA 目标 200
- 工具上线后的"换 CTA"操作记入生产流程步骤 8（见 §13）

## 12. Writing & Compliance Rules

**Numerology 特有合规**（比天使号码更需谨慎，因为涉及"性格判断"）：
- ❌ "Life Path {N} means you are destined to..."
- ❌ "Life Path {N} people are always / never..."
- ❌ "This number determines your career / partner / success"
- ❌ "Crystals will heal / cure / fix your {N} challenges"
- ❌ "Master Numbers are spiritually superior"

**推荐表达**：
- ✅ "In numerology, Life Path {N} is associated with... People with this number often describe themselves as..."
- ✅ "Numerology is a self-reflection tool, not a deterministic system — your choices shape your path far more than your number"
- ✅ "Crystals can serve as a tangible reminder of the qualities you want to cultivate"
- ✅ "Numerology is part of symbolic and spiritual traditions, not established science"

**巴纳姆效应防护**（三视角的心理学维度，memory 策略 §3.1）：
> 示例："Psychologically, numerology works partly because recognizing patterns in ourselves helps us reflect — Life Path {N} descriptions can serve as a mirror for self-inquiry rather than a fixed label. The value is in what the reflection prompts you to notice, not in the number itself."

**Gentle Note**（全站统一组件，放 FAQ 前）：
> "Numerology and crystal meanings are based on spiritual traditions, symbolism, and personal mindfulness practices. They are a tool for self-reflection, not a substitute for medical, financial, or professional advice — and not a deterministic prediction of your life."

**去AI化**：同全站禁词 + 化学式大写 + **M6 水晶段 4 套句式轮换**（避免 12 篇同结构句）+ **M3/M8 性格段用具体场景代替泛词**（"you may find yourself leading meetings even when no one assigned you the role" 而非 "you are a natural leader"）

## 12A. Eastern 调性写作规则（护城河具体化 ⭐）

> **从概念落到可执行**：护城河 = 深度 + Master Number 空白 + **Eastern 调性**。把"Eastern"从 navratan FAQ 轻带，变成每篇**至少 2 处 Eastern 锚点**的硬写作指引（对标 goearthward 东方调性水晶首饰定位，memory `crystal-product-positioning`）。

### 每篇 Eastern 锚点配额（硬约束）

| 锚点类型 | 每篇最低 | 落点模块 | 写作指引 |
|---|---|---|---|
| 东方数字文化 / 本命数字 | 1 处 | M1 或 M3 | 该号码在藏传 / 印度 / 东方数字学里的对应象征（非主导，作"also recognized in..."补充） |
| 东方水晶 / 玉石传统 | 1 处 | M6 或 FAQ | 该号码某颗水晶在东方传统里的用途（如 jade 在中国文化 = 纯净/守护，navratan 的 lucky stone 体系） |
| 东方实践方式 | 0-1 处（可选）| M7 | 仪式可融入东方元素（如藏式持咒计数、印度 rashis 体系轻提） |

### 四类 Eastern 锚点写作库（按号码适配，生产时取用）

**1. 藏传数字学 / 喇嘛数字体系**：
- 数字在藏传佛教象征（如 1 = 统一/佛性、3 = 三宝、4 = 四圣谛、6 = 六度、9 = 极数圆满）
- 写法：`In Tibetan Buddhist numerology, {N} also appears as a symbol of {象征}, which resonates with this Life Path's {archetype特质}.`

**2. 印度 Lucky Stone / Navratan 体系**：
- navratan 竞品词（"lucky stone for number {N}"）我们用西方水晶体系答，但**提传统对应**作补充
- 印度体系对应：1=Ruby / 2=Pearl / 3=Yellow Sapphire / 4=Emerald(hara) / 5=Emerald / 6=Diamond / 7=Cats Eye / 8=Blue Sapphire / 9=Coral
- 写法：`In the Indian navaratna tradition, number {N} is linked to {传统宝石}; in our crystal framework we suggest {西方水晶 slug} for a similar supportive quality — {一句话理由}.`（不主导，提传统宝石）

**3. 东方玉石 / 中国水晶文化**：
- Jade（纯净/守护/福）、Agate（平衡/长寿）、Nephrite vs Jadeite、Crystal（水晶 = "菩萨石"古称）
- 写法：`{Crystal} has a long history in East Asian tradition as a stone of {象征} — for Life Path {N}, this pairs naturally with {archetype特质}.`

**4. 本命数字 / 八字数字文化**：
- 本命数字（中国民间"命数"概念）、生辰八字衍生数字、河图洛书数字（轻提，避免算命化）
- 写法：`The idea of a birth-number shaping tendencies appears across cultures — from Chinese folk traditions to Western numerology. This page treats it as a reflection tool, not a fixed fate.`（合规口径 + 东方呼应）

### 写作纪律（防翻车）
- **不主导、不算命**：Eastern 锚点是"文化补充"不是"预测依据"，必须接合规口径（"as a symbol of / in tradition / not deterministic"）
- **不堆砌**：每篇 2-3 处即可，多了变文化科普文章偏离主词（`crystals for life path {n}`）
- **与西方水晶体系融合**：Eastern 锚点最终要落回我们的水晶推荐（不是推传统宝石替代产品），如提 navratan Ruby 后落回"we suggest {我们的 crystal slug}"
- **文化准确**：藏传/印度/中国象征必须查证（避免编造，参考 navratan 竞品 + 公开数字学资料），不确定的标注"in some traditions"

## 13. 生产流程

1. ✅ 数据层 `_shared/numerology-knowledge.json` 已建（12 号码 × 完整配置）
2. ✅ 框架文档（本文件）已建
3. ⏳ **用户审框架**（当前节点）
4. **M6 CTA 预验证**（生产前硬检查，见 §4 "M6 产品 CTA 预验证"）：输出 slug 清单 → HEAD 检查 meaning/category → 降级 → 生成 `_cta-validation.json`（全绿才进入步骤 5）
5. config + 骨架生成脚本（`scripts/generate-articles.js`，参数化 Master Number 段 / 水晶组件 / 计算段单源）
6. AI workflow（填占位，按 unique_angle + 模块权重差异化，参考 9.angel-numbers fill-from-placeholders.js）
7. **三质检关卡（二审前强制 ⭐，见 §13A）**：
   - 关卡 1：号码差异化检查（M3/M5/M8 有独立场景非只换 traits 词）
   - 关卡 2：水晶绑定检查（每颗绑定号码具体优势/挑战非通用，三要素齐全）
   - 关卡 3：确定论语言检查（批量搜禁词，人工改写）
8. 二审（同质化检测 + 水晶内链热力统计 + master_note 准确性 + 巴纳姆合规 + 计算方法一致性 + Eastern 锚点配额）
9. 图片（hero + calculation diagram + 复用 390 水晶图）+ upload draft
10. **工具前置依赖门**（见 §11）：Numerology Calculator 上线 → 12 篇 publish；未上线 → 用降级说明页 CTA，待工具上线后批量换回

### 13A. 三质检关卡细则（二审前强制 ⭐）

> AI 填充后、人工二审前，跑三个独立脚本关卡。**任一关卡不通过，批量打回重写**，不进入二审。

**关卡 1 — 号码差异化检查**：
- 检测对象：12 篇的 M3 / M5 / M8 正文
- 检测方法：
  - trait 词频统计：12 篇 M3 主体 trait 词组**重叠率 < 30%**（见 §2 module_weights 规则 4）
  - 场景独特性：每篇 M3 至少 2 个该号码独有日常场景（非泛"你是领导者"）
  - M8 表格"How to Rebalance"列不得跨号雷同（动作必须不同）
- 输出：`_qc/01-differentiation.json`，标红重叠超标的号码对

**关卡 2 — 水晶绑定检查**：
- 检测对象：12 篇 × 5 颗 = 60 条水晶段
- 检测方法：每条必须命中三要素（见 §4 水晶绑定三要素）：
  1. 引用该号码具体挑战/优势（trait / challenge 词命中）
  2. 水晶 symbolic support（Intentions/symbolism 命中）
  3. 具体使用场景（非"carry it / wear it"万能句）
- 反例模式匹配：标红"X supports Y's energy. It is a Z stone."类通用句
- 输出：`_qc/02-crystal-binding.json`，标红缺要素的水晶段

**关卡 3 — 确定论语言检查**：
- 批量正则搜禁词（含变体）：
  - `destined` / `destiny`（非 Destiny Number 上下文）/ `always` / `never` / `guaranteed`
  - `will heal` / `will attract` / `will bring`（水晶段确定论）
  - `meant to` / `born to` / `fix` / `cure`
  - `superior`（Master Number 优越论）
- 处理：命中句子**人工逐条改写**（非脚本自动替换，避免改坏语义），改写后复检
- 输出：`_qc/03-determinism.json`，列出每条命中 + 改写后文本
- 注：化学式校验区分大小写（memory `validate-riskwords-case-sensitive`），`SiO₂` 等正确写法不误判

## 14. 与天使号码的关系（避免内容重叠）

天使号码（已上线 100 篇）和 Numerology 都涉及"数字 1-9 的能量"，但**搜索意图和内容定位不同**：

| 维度 | 天使号码 | Numerology (Life Path) |
|---|---|---|
| 来源 | 反复出现的数字序列（111, 444）| 出生日期计算 |
| 主词 | `{n} angel number meaning` | `life path {n}` / `crystals for life path {n}` |
| 内容核心 | 当下信息 / 提醒 | 人格特质 / 生命方向 |
| 工具 | 无（号码即所见）| Numerology Calculator |
| 数字能量 | 单数字 + 重复放大 | Life Path archetype + Master Number |

**同号（如天使号码 1 vs Life Path 1）可互链**（同数字能量根基，不同应用），但内容不重复 —— 天使号码 1 讲"看到 1 是什么信号"，Life Path 1 讲"出生为 1 号人的人格与水晶"。

---

## 附录：三源验证结论（2026-06-28）

### 1. SERP 生态
- **`life path {n} meaning`（纯号码主题词）**：Cosmopolitan/mindbodygreen/numerology.com/worldnumerology 等 DA 90+ 大站垄断 → **主题词难度高，不做**
- **`crystals for life path {n}` / `best crystals for life path {n}`（×水晶交叉长尾）**：SERP 全是小站（solacely/moonrise/crystals.com/etsy/crystalgrids），position 2-3 可排 → **我们的生态位**
- **`life path calculator`**：纯计算器词被专站占（seventhlifepath/numerology.com），但 **AIO 空缺**（has_aio=false）→ 工具有机会
- **`life path number meaning`**：有 AIO（引用 mindbodygreen/worldnumerology）→ 我们的深度交叉页有机会进 AIO

### 2. Seed-Master volume（1C 关键词研究）
- Numerology Topic Pillar：~2000 词 / ~3M volume / "低（P3 竞品为主）"
- 核心种子词（内容扩展种子关键词.md §76-81）：numerology / life path number / life path number calculator / destiny number / soul number / master numbers
- 策略表格记录 19 篇 / 357K（子集筛选，与 Pillar 总量口径不同）

### 3. 1B 竞品 sitemap（35 家）
- **4 直接竞品**（buddhastoneshop/navratan/buddha3bodhi/第4家）：**0 做 Numerology 内容**（蓝海确认，memory 记录准确）
- **其他水晶站已做**：Moonrise Crystals（#8 直接竞品，pa_numerology 产品属性 + /crystals-by-numerology/ 索引页，但 sitemap 解析失败无文章计数）、Solacely（非 1A 清单 4 家直接竞品，但 Life Path 1-9 全做 + Numerology Bracelet 产品线 + Life Path Calculator 工具）、crystals.com（life-path-number 汇总页）
- **结论修正**：memory `crystal-content-recovery` 等记录的"4 直接竞品 0 做"指 4 家核心直接竞品，**Numerology × 水晶赛道整体有 solacely/moonrise 等其他水晶站已做**。非纯蓝海，是**与小站直接竞争的交叉长尾**（goearthward 同生态位，靠深度 + Master Number 空白 + Eastern 调性差异化赢）

### 篇数定稿：12 篇（Life Path 1-9 + Master 11/22/33）
- 策略表格原记 19 篇，含其他维度（destiny number / soul number / 生日数字等）
- **本批次先做 12 篇核心**（Life Path 是 numerology 主词，搜索量最大，计算器工具承接最自然）
- destiny number / soul number / birth number 等扩展篇（~7 篇）作为后续批次，待 12 篇验证排名+转化后再放大
