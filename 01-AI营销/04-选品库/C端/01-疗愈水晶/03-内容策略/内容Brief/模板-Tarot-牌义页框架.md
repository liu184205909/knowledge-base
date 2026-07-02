# Tarot Major Arcana 文章框架 v2（23 篇：22 Major + 1 Hub）

> **适用**：`/tarot-{card}-crystals/` 牌意 × 自我反思页（22 张 Major Arcana 各一篇 + 1 Hub `/crystals-for-tarot-cards/`，共 23 篇）
> **竞品依据**：soulfulnwild.com（22 Major 全做，每牌 1 颗水晶 + 牌意段）+ astrosofa.com（22 Major 全做，每牌 1 颗水晶 + How to Use）+ labyrinthos.co（22 Major 对应表，每牌 1-2 颗水晶 + herbs）+ thecrystalcouncil.com（10+ Major 牌意页，深度牌意解析但**无首饰 Shop CTA / 无 Minor Arcana / 无 Eastern 视角 / 无逆位专章**）
> **数据**：`_shared/tarot-knowledge.json`（22 张 Major × archetype/upright/reversed/4源水晶映射/Eastern lens/chakra/related 全字段单源）+ crystal-attributes.json（390 颗水晶 overview.Intentions）+ chakra-knowledge.json
> **核心策略**：与 Numerology 同款"植入水晶变现"逻辑平移 —— Tarot 主词（牌意）被 The Crystal Council / Biddy Tarot / Labyrinthos 等专站垄断，**做"crystals for {card} tarot card"交叉长尾**（SERP 是小站合集页低质，goearthward 同生态位靠**独立深度页**可排）+ **首饰 Shop CTA 承接**（竞品只做水晶 raw stone，我们是首饰站 = 差异化转化路径）
> **6 大差异化**（vs 竞品合集单页）：
> 1. **独立深度页**：每牌独立 1800-2500 词页（竞品合集单页每牌 2-3 段低质）
> 2. **首饰 Shop CTA**：每牌水晶链到首饰产品（竞品只讲水晶 raw，无购买承接）
> 3. **Minor Arcana 空白占位**：明确声明 Major 优先，Minor 留扩展（竞品无人系统做 Minor × 水晶）
> 4. **Eastern 藏式塔罗调性**：每牌至少 2 处 Eastern 锚点（藏传/印度/东亚水晶文化，对标 goearthward 东方调性首饰定位）
> 5. **三视角自我反思**：牌意 + 心理学 + 水晶三视角（archetype for self-reflection 框架降灵性门槛）
> 6. **逆位专章**：每牌独立逆位段 + 水晶支持（竞品合集页逆位仅一句带过）

---

## 1. URL + TKD

- **URL 规则**：`/tarot-{card-slug}-crystals/`（根级 post，无 category base，对齐 2A §一 URL 规则）
  - **避产品词污染**：`the-tower-crystal/` 会被水晶塔产品词污染（搜索"The Tower Crystal"返回水晶塔摆件），故强制加 `tarot-` 前缀 + `-crystals` 复数后缀
  - 示例：`/tarot-the-fool-crystals/` `/tarot-the-tower-crystals/` `/tarot-the-star-crystals/`
  - Hub：`/crystals-for-tarot-cards/`（汇总页，根级）
- **Title（短版）**：`{Card} Tarot Card Meaning & Best Crystals`（≤60 字符，如 `The Fool Tarot Card Meaning & Best Crystals`）
- **H1**：`{Card}: Tarot Card Meaning & Best Crystals for Self-Reflection`
- Primary KW：`{card} tarot card meaning` / `crystals for {card}` / `{card} tarot crystals`
- Secondary KW：`{card} upright meaning` / `{card} reversed meaning` / `{card} love meaning`
- rank_math 三件套必写（title / description / focus_keyword = `{card} tarot`）

## 2. 模块结构（12 模块，目标 1800-2500 词）

| # | 模块 | H2 | 词数 | 要点 |
|---|---|---|---|---|
| Intro | Hero + TL;DR | （hero 图 + 导言段）| 100-150 | 牌是什么的钩子（"When {Card} appears in a reading..."）+ archetype 一句话 + 含主关键词 |
| M1 | TL;DR Quick Answer | `{Card} at a Glance` | 80-120 | 速答 + Featured Snippet bait + 3 点 bullet（archetype / 核心牌意 / 推荐水晶）对标 Google AIO |
| **M2** | **Upright Meaning** ⭐牌意正位 | `{Card} Upright: Meaning & Message` | 250-350 | **正位牌意深化**（archetype 象征 + Rider-Waite 画面 + 三视角融入，非泛"new beginnings"）|
| **M3** | **Reversed Meaning** ⭐逆位专章差异化 | `{Card} Reversed: The Shadow Aspect` | 200-300 | **逆位独立深化**（差异化：竞品合集页逆位仅一句）+ **合规口径**：用 shadow aspect / invitation to reflect，禁 bad omen / curse |
| **M4** | **Crystal Correspondences** ⭐核心 | `Best Crystals for {Card}` | 350-450 | **5 角色 H3 分层**（best_overall + 4 角色差异于竞品单颗水晶）+ 四源映射依据 + 三要素 |
| **M5** | **How to Use Crystals** ⭐仪式型 | `How to Work with {Card} Crystals` | 150-220 | **具体仪式/练习步骤**（非泛"How to Use"）+ 抽牌冥想场景 |
| **M6** | **Crystals for Reversed {Card}** ⭐逆位水晶差异化 | `Crystals to Support {Card} Reversed` | 120-180 | **逆位时换哪颗水晶**（差异化：竞品无）+ shadow work 支持 |
| **M7** | **Three-Perspective Reading** ⭐三视角差异化 | `{Card} Through Three Lenses` | 200-280 | **三视角**：Tarot tradition / Psychological archetype / Crystal companion（差异化：竞品单一视角）|
| **M8** | **Eastern Perspective** ⭐护城河 | `{Card} in the Eastern Tradition` | 150-220 | **Eastern 锚点**（藏传/印度/东亚水晶文化，至少 2 处，差异化：竞品纯西方）|
| M9 | Shop CTA | `Shop {Card} Crystals` | 80-120 | 首饰 Shop CTA（差异化转化路径）+ 已验证 URL |
| **M10** | **Mini Crystal Tarot Spread** ⭐差异化 | `A Mini Crystal Tarot Spread for {Card}` | 120-180 | **3 牌 + 3 水晶小牌阵**（差异化：竞品无 spread）+ 教育性 |
| M11 | FAQ | `Frequently Asked Questions` | 300-400 | 三层分层（见 §7）|
| M12 | Related + Closing | `Related Tarot Cards` | 80-120 | 相关牌互链 + 收尾 |

**篇幅**：22 Major 主力 1800-2500 词；Hub 1200-1500 词（汇总 + 导航）

### module_weights：22 牌差异化重心（防模板感）

> 每张牌的 M2/M3/M7 内容重心不同，避免 22 篇只换牌名换形容词。

| 牌号 | 牌名 | Archetype | M2 Upright 重心 | M3 Reversed 张力 | M7 三视角落点 |
|---|---|---|---|---|---|
| 0 | The Fool | The Innocent Pioneer | leaps of faith / fresh starts | recklessness / avoidance of commitment | 心理学 = openness to experience |
| 1 | The Magician | The Manifestor | willpower / resourcefulness / as above so below | manipulation / misuse of power / illusion | 心理学 = self-efficacy & agency |
| 2 | The High Priestess | The Intuitive | inner knowing / the veil / stillness | secrets / disconnection from intuition / surface | 心理学 = introceptive awareness |
| 3 | The Empress | The Nurturer | abundance / creativity / fertility | smothering / dependence / creative block | 心理学 = nurturance vs overgiving |
| 4 | The Emperor | The Sovereign | structure / authority / foundations | tyranny / rigidity / abuse of control | 心理学 = healthy structure vs control |
| 5 | The Hierophant | The Teacher | tradition / wisdom / lineage | dogma / rebellion / outdated belief | 心理学 = conformity vs autonomy |
| 6 | The Lovers | The Choosers | union / values-aligned choice / partnership | disharmony / values misalignment / avoidance | 心理学 = attachment & values |
| 7 | The Chariot | The Victor | will / direction / triumph through focus | scattered force / aggression / no direction | 心理学 = conscientiousness & drive |
| 8 | Strength | The Gentle Power | courage through softness / patience / inner fortitude | self-doubt / raw instinct over mastery / burnout | 心理学 = emotional regulation |
| 9 | The Hermit | The Seeker | solitude / inner guidance / the lantern | isolation / withdrawal / refusal to share wisdom | 心理学 = solitude vs isolation |
| 10 | Wheel of Fortune | The Turning | cycles / fate / momentum | resistance to change / bad luck streak / stagnation | 心理学 = locus of control |
| 11 | Justice | The Truth-Seeker | fairness / accountability / balance | injustice / dishonesty / avoidance of responsibility | 心理学 = justice sensitivity |
| 12 | The Hanged Man | The Surrendered | perspective shift / surrender / pause | stalling / martyrdom / refusal to let go | 心理学 = cognitive reappraisal |
| 13 | Death | The Transformer | endings / transformation / rebirth | resistance to change / stagnation / decay | 心理学 = meaning-making after loss |
| 14 | Temperance | The Alchemist | balance / blending / patience | excess / imbalance / impatience | 心理学 = self-regulation |
| 15 | The Devil | The Shadow-Knower | bondage / attachment / shadow awareness | liberation / breaking chains / release | 心理学 = shadow integration |
| 16 | The Tower | The Awakener | sudden revelation / structural collapse / truth | avoiding the lesson / resisting necessary change | 心理学 = post-traumatic growth |
| 17 | The Star | The Hopeful | hope / renewal / guidance after storm | despair / disconnection from hope / faith lost | 心理学 = hope theory & optimism |
| 18 | The Moon | The Dreamer | intuition / illusion / the subconscious | confusion released / deception surfacing / clarity returning | 心理学 = unconscious processing |
| 19 | The Sun | The Radiant | joy / vitality / clarity / success | temporary setback / muted joy / ego inflation | 心理学 = positive affect |
| 20 | Judgment | The Awakened | reckoning / rebirth / calling | self-criticism / refusing the call / avoidance | 心理学 = self-compassion vs self-criticism |
| 21 | The World | The Complete | completion / integration / wholeness | incompletion / loose ends / delay of closure | 心理学 = self-actualization |

**页面个性化权重规则（生产硬约束）**：
1. **每篇 M2 必须落到该牌 archetype + Rider-Waite 画面象征**（如 The Fool 写"悬崖边缘、白色玫瑰、随行小狗"，非泛"new beginnings"）
2. **每篇 M3 的逆位张力必须写该牌独有 shadow**（见上表 M3 张力列，禁 22 篇都用"resistance / blockage"塞满）
3. **每篇 M7 三视角的心理学维度必须引用该牌对应心理学概念**（见上表最右列，如 The Fool = openness to experience，The Hermit = solitude vs isolation）
4. **archetype 词轮换检查**：22 篇之间 M2 主体象征词组**重叠率 < 30%**

### M2/M3 边界（防重叠 ⭐）

> **物理区隔**：Upright（M2）与 Reversed（M3）天然成对，必须分工。M2 写"正位健康能量"，M3 严格只写"逆位 shadow 如何转化"。

| 模块 | 写什么 | 不写什么 | 形式 |
|---|---|---|---|
| **M2** | 正位牌意 / Rider-Waite 画面 / 健康能量表达 / 实际生活场景 | 不写"逆位怎么办"、不写 shadow 对照 | 自然段 + meaning bullet |
| **M3** | 逆位 shadow / 过度或受阻的能量如何识别 / 转化 invitation | 不重复正位象征（M2 已覆盖）| 自然段 + reflection prompt |

**M3 合规硬约束**：
- ❌ 禁"bad omen / curse / bad luck / evil / cursed"（逆位≠凶兆）
- ✅ 用"shadow aspect / invitation to reflect / growth edge / the card reversed often points to..."（逆位 = 成长邀请，非凶兆）

## 3. M4 Crystal Correspondences 段（核心差异化 + 四源映射）

**位置**：M3 之后、M5 之前。**这是 Tarot × Crystals 的核心模块**（竞品合集页每牌只 1 颗水晶 + 2 段，我们做 5 角色 H3 分层 = 深度差异化）。

**H3 购买意图分层**（每牌 5 颗，从 `tarot-knowledge.json > cards[i].crystals` 读取）：
```
## Best Crystals for {Card}

### Best Overall Crystal for {Card}
[best_overall — 绑 archetype 核心特质，四源综合最优]

### Best Crystal for Upright {Card} Energy
[best_upright — 强化正位能量，从四源主推水晶选]

### Best Crystal for Reversed {Card} (Shadow Work)
[best_reversed — 平衡逆位 shadow，差异化：竞品无]

### Best Crystal for Love & Relationship Readings
[best_love — 跨牌统一需求，关系类牌意场景]

### Best Crystal to Wear Daily
[best_daily_wear — 价位友好 / 百搭 / 耐用]
```

> **注**：M4 只负责"选哪 5 颗石头 + 为什么"（5 角色 H3 分层 + 四源依据）。"怎么用"独立成 M5（仪式型）。两模块分工：M4 = 选石头，M5 = 怎么用。

### 四源水晶映射依据（每牌 best_overall 必须标注来源）

> **水晶映射自家权威**：综合四源（soulfulnwild / astrosofa / labyrinthos / thecrystalcouncil）+ 矿物学属性 + 五行 + 首饰适配度，**逐牌选最优**，建立 goearthward Crystal Tarot 体系成权威源（非照抄单一源）。

**四源矛盾示例与我们的裁决**（写入数据层 source_notes）：
- **The Fool**：soulfulnwild=Clear Quartz（clarity/new beginnings）/ astrosofa=Amethyst（spiritual protection for leaps）/ labyrinthos=Agate+Aventurine
  - **我们裁决 best_overall = Clear Quartz**（最贴合 Fool "unlimited potential + clarity" archetype，且 Quartz 是首饰百搭主推线）；best_reversed = Amethyst（逆位 reckless 时 grounding + 保护）
- **The Tower**：astrosofa=Moldavite（rapid transformation，但**贵 + 小众不适合首饰站**）/ soulfulnwild=Smoky Quartz（grounding through upheaval）/ labyrinthos=Ruby（lodestone 太小众）
  - **我们裁决 best_overall = Smoky Quartz**（grounding + transformation，首饰适配，平价）；best_reversed = Black Tourmaline（防护 + 吸收负能量）；M4 标注"Moldavite 是 astrosofa 推荐，我们选 Smoky Quartz 因首饰适配 + 平价 + 同 grounding-transformation 属性"
- **The Magician**：soulfulnwild=Citrine（manifestation）/ astrosofa=Clear Quartz（amplifier）/ labyrinthos=Agate+Sunstone
  - **我们裁决 best_overall = Clear Quartz**（"as above so below" 放大器，最贴 Magician archetype）；best_upright = Citrine（manifestation 能量）

**水晶选择五重交叉**（已在 tarot-knowledge.json 锁定）：
1. archetype / upright_meaning ↔ 水晶 Intentions 字段语义匹配（crystal-attributes.json 390 颗）
2. 四源验证（至少 1 源推荐，多源一致优先）
3. **首饰适配度**（goearthward 是首饰站，贵价/小众如 Moldavite/Painite 降级为"alt mention"不进 best 角色）
4. **五行/矿物学一致性**（自家权威：如 The Emperor 结构牌配 Red Jasper/Carnelian 火土属性稳固）
5. 5 角色平衡：best_overall(主推) + best_upright(正位) + best_reversed(逆位差异化) + best_love(rose-quartz 跨牌统一) + best_daily_wear(价位友好)

**每颗水晶写法**（3-4 套句式轮换，避免 22 篇同结构句，直接复用 Numerology v2 §4 的 4 个变体）：
- 变体 A：`{Crystal} resonates with {Card}'s {archetype特质}. Its {Intentions} quality makes it a natural companion when...`
- 变体 B：`For {Card}, {Crystal} offers {具体支持}. Known for {属性}, this stone helps you...`
- 变体 C：`If you are working with {Card}, try {Crystal}. It supports {动作} by...`
- 变体 D：`{Crystal} pairs naturally with {Card}'s energy. As a stone of {属性}, it can serve as a daily reminder to...`

**每颗水晶固定组件（CTA 文案轮换降模板感）**：
- Read 链接（2-3 套轮换）：套 A `Read {Crystal} Meaning →` / 套 B `Explore {Crystal} in depth →` / 套 C `{Crystal} properties & symbolism →`（均 `/gemstone/{slug}-meaning/`）
- Shop 链接（2-3 套轮换）：套 A `Shop {Crystal} →` / 套 B `Browse {Crystal} jewelry →` / 套 C `Find your {Crystal} piece →`（均 `/shop/?s={slug}` 或 `/product-category/{slug}-crystals/`，预验证后定）
- **同篇内 5 颗水晶的 CTA 文案必须混用 2-3 套**

### M4 产品 CTA 预验证（生产前硬检查 ⭐）

> **提升为生产前强制门**：M4 的 Read/Shop CTA 在 AI 填充前，先批量验证目标 URL 存在，**404 不上线**。避免 23 篇 × 5 颗 = 115 个潜在死链。

**生产前流程**（generate-articles.js 填充 M4 前执行）：
1. **输出 crystal slug 清单**：从 22 牌的 `crystals` 字段提取所有去重 slug（预计 25-35 颗，因 best_love 跨牌复用 rose-quartz）
2. **批量 HEAD 检查**两个目标：
   - `/gemstone/{slug}-meaning/`（Crystal Meaning CPT，390 颗已上线）
   - `/product-category/{slug}-crystals/`（WooCommerce 产品集合页）
3. **降级规则**（memory `shop-cta-no-deadlink-rule` 三级优先）：
   - Shop 目标 404 → `/shop/?s={crystal}` 产品搜索（验证搜索结果非空）
   - 搜索也空 → `/product-category/healing-jewelry/` + 文案改"Browse healing jewelry"
   - Meaning 目标 404 → 暂去 Read CTA，仅保留 Shop（不允许保留死链 Read）
4. **生成 validation 报告**：`04-内容生产/13.tarot/_qc/_cta-validation.json`，记录每个 slug 最终 CTA URL + 状态码 + 是否降级。**报告必须全绿才进入 AI 填充阶段**。

### M4 水晶绑定三要素（每颗水晶强制规范 ⭐）

> **反通用化硬约束**：每颗水晶不只写"X supports this card"（这种句子任何牌都能套）。**必须三要素齐全**，把水晶锚定到该牌的具体牌意/画面/逆位上。

**三要素**：
1. **该牌具体牌意/画面象征**（从 archetype + upright/reversed + Rider-Waite 画面取，非泛"new beginnings"）
2. **水晶 symbolic support**（从 crystal-attributes.json 的 Intentions/symbolism 取，说清"为什么是这颗"，标注四源依据）
3. **具体使用场景**（一句话落到抽牌冥想/日常佩戴/仪式场景，非"carry it with you"万能句）

**示例（The Fool × Clear Quartz）**：
> Clear Quartz resonates with The Fool's archetype of unlimited potential and
> the clarity of the white rose the traveler carries. As the "Master Healer"
> that amplifies intention (soulfulnwild's pick for this card), it is a natural
> companion when you are standing at the edge of your own cliff — a moment that
> asks for clear sight rather than reckless leaps. Try holding a clear quartz
> point while naming one new beginning you want to approach with both openness
> and discernment.

✅ 上述满足三要素：①Fool 具体画面"悬崖边缘 + 白玫瑰 + 清明" ②Clear Quartz = amplifier + clarity（soulfulnwild 依据）③场景"命名一个新开始时握水晶点"。

**反例（不合格，二审必打回）**：
> ❌ "Clear Quartz supports The Fool's energy. It is a clarity stone that helps with new beginnings."（任何牌都能套，无 Fool 具体画面，无场景）

**5 角色 × 三要素检查清单（M4 每颗都要过）**：
| 角色 | 牌具体依据来源 | symbolic support | 场景 |
|---|---|---|---|
| best_overall | archetype 核心特质 + 画面 | 主 Intentions（四源主推）| 晨间/抽牌冥想 |
| best_upright | 正位能量（M2）| 正位强化属性 | 正位抽到时佩戴 |
| best_reversed | 逆位 shadow（M3）| 平衡/吸收类属性 | 逆位时 shadow work |
| best_love | 关系牌意（Lovers/Empress 等）| 关系类属性 | 约会/沟通前 |
| best_daily_wear | 日常落地 | 百搭属性 | 随身/工作日 |

## 4A. M5 How to Use Crystals 段（仪式型，取代旧"How to Use"）

> **去重改造**：M4 = 选石头（5 角色），M5 = 怎么用（具体仪式/练习），分工清楚。

**H2 标题（轮换避免 22 篇同 H2）**：
- 版本 A：`How to Work with {Card} Crystals`
- 版本 B：`A Crystal Practice for {Card}`
- 版本 C：`Using {Card} Crystals in Your Tarot Practice`

**内容骨架（从 tarot-knowledge.json > recommended_practice 取该牌独有动作）**：
```
## How to Work with {Card} Crystals

A short practice to bring {Card}'s energy into your reading or your day. Keep
it practical — crystals are a focus for intention, not magic.

**You'll need:** {从 M4 5 颗中选 1-2 颗，优先 best_overall 或 best_upright}

**Step 1 — Set the focus (1 min):** {该牌 recommended_practice 的具体意图，
如 The Fool = "name one leap you are being invited to take"}
**Step 2 — Hold the stone + draw a card (2 min):** {symbolic support 一句话 + 抽牌冥想}
**Step 3 — Close with one commitment:** {把反思落成一个可执行的小动作}

> Prefer something quicker? Try the daily version: {一句话日常微动作，
如 The Fool = "touch your Clear Quartz before saying yes to a new opportunity"}
```

**M5 与 M4 的边界（防重叠）**：
- M4 写"**为什么**这 5 颗配 {Card}"（symbolic support + 三要素 + 四源依据）
- M5 写"**怎么用**它们做一个练习"（步骤 + 抽牌场景 + 承诺）
- M5 **不复述** M4 的水晶属性，只引用"选 Step 2 的那颗" + 一句 symbolic reminder

**22 篇仪式差异化（防模板感）**：
- 仪式动作锚定 module_weights 表的牌重心（The Fool 仪式=leap with discernment / The Emperor 仪式=structure one foundation / Death 仪式=release & rebirth）
- 仪式时长固定（5 分钟内），但**焦点意图每牌不同**，禁止 22 篇都是"hold the stone and breathe"

## 5. 22 牌 → 水晶映射总览（防同质化）

> 完整映射见 `_shared/tarot-knowledge.json`。下表为 best_overall + best_reversed 摘要（防 22 篇水晶集中）：

| 牌 | best_overall | best_reversed | best_upright | best_love | best_daily_wear |
|---|---|---|---|---|---|
| 0 Fool | Clear Quartz | Amethyst | Aventurine | Rose Quartz | Moonstone |
| 1 Magician | Clear Quartz | Smoky Quartz | Citrine | Carnelian | Tiger Eye |
| 2 High Priestess | Moonstone | Smoky Quartz | Selenite | Rose Quartz | Labradorite |
| 3 Empress | Rose Quartz | Carnelian | Green Aventurine | Emerald-alt(Peridot) | Rhodonite |
| 4 Emperor | Red Jasper | Sodalite | Carnelian | Rose Quartz | Tiger Eye |
| 5 Hierophant | Amethyst | Carnelian | Sodalite | Rose Quartz | Lapis Lazuli |
| 6 Lovers | Rhodonite | Rose Quartz | Rose Quartz | Rhodochrosite | Malachite |
| 7 Chariot | Hematite | Carnelian | Onyx | Rose Quartz | Tiger Eye |
| 8 Strength | Tiger Eye | Citrine | Sunstone | Rose Quartz | Carnelian |
| 9 Hermit | Labradorite | Smoky Quartz | Amethyst | Rose Quartz | Lapis Lazuli |
| 10 Wheel | Aventurine | Obsidian | Citrine | Rose Quartz | Turquoise |
| 11 Justice | Lapis Lazuli | Carnelian | Sodalite | Rose Quartz | Hematite |
| 12 Hanged Man | Selenite | Bloodstone | Amethyst | Rose Quartz | Aquamarine |
| 13 Death | Obsidian | Smoky Quartz | Malachite | Rose Quartz | Garnet |
| 14 Temperance | Amethyst | Smoky Quartz | Fluorite | Rose Quartz | Amazonite |
| 15 Devil | Black Tourmaline | Clear Quartz | Smoky Quartz | Rose Quartz | Onyx |
| 16 Tower | Smoky Quartz | Black Tourmaline | Labradorite | Rose Quartz | Hematite |
| 17 Star | Aquamarine | Lepidolite | Selenite | Rose Quartz | Moonstone |
| 18 Moon | Moonstone | Labradorite | Selenite | Rose Quartz | Amethyst |
| 19 Sun | Sunstone | Smoky Quartz | Citrine | Rose Quartz | Carnelian |
| 20 Judgment | Angelite | Clear Quartz | Citrine | Rose Quartz | Selenite |
| 21 World | Clear Quartz | Bloodstone | Selenite | Rose Quartz | Lapis Lazuli |

> **slug 映射**：Clear Quartz=`quartz` / Green Aventurine=`aventurine` / Lapis Lazuli=`lapis` / Black Onyx=`onyx` / 其余 slug = 显示名小写连字符。Ametrine（Hanged Man soulfulnwild 推荐）= 数据库无，拆为 Amethyst+Selenite。

**防同质化规则**：
- best_love 跨牌统一 rose-quartz 是**有意的**（爱情跨牌需求，rose-quartz 是主推产品线），但 Lovers/Empress 用 rose-quartz 作 best_overall 时，best_love 换 rhodonite/rhodochrosite 错开
- 22 牌合计触达 ≥ 20 个不同 meaning 页（非只 5-6 个高频页循环）
- 逆位水晶（best_reversed）是差异化主力，每牌不同（Black Tourmaline / Smoky Quartz / Amethyst / Carnelian 等错开）

## 6. M6 Crystals for Reversed 段（逆位水晶差异化 ⭐）

> **竞品空白**：soulfulnwild/astrosofa 合集页每牌只讲正位水晶，逆位仅一句。我们独立成段 = 差异化。

**位置**：M5 之后、M7 之前。**内容**：当抽到逆位时，换哪颗水晶支持 shadow work。

```
## Crystals to Support {Card} Reversed

When {Card} appears reversed, it often points to {逆位张力，见 module_weights M3 列}.
This isn't a bad omen — it's an invitation to notice where {该牌正位能量} has
gone into shadow. The crystal below is traditionally used to support this
specific reflection.

**Supporting stone:** {best_reversed} — {三要素：逆位 shadow + 水晶属性 + shadow work 场景}
```

**合规口径**（逆位段强制）：
- "isn't a bad omen / isn't a curse / invitation to reflect / growth edge / shadow aspect"
- 禁"bad luck / evil / cursed / negative card"

## 7. M7 Three-Perspective Reading 段（三视角差异化 ⭐）

> **竞品单一视角**：竞品只讲"传统牌意"，我们做三视角 = 差异化 + 降灵性门槛（心理学维度让理性用户也接受）。

```
## {Card} Through Three Lenses

**1. Tarot tradition:** {Rider-Waite 传统牌意 + 该牌在 Fool's Journey 中的位置}

**2. Psychological archetype:** {该牌对应心理学概念，见 module_weights M7 列，
如 The Fool = openness to experience, The Hermit = solitude vs isolation}
This lens treats {Card} as a mirror for self-inquiry rather than a prediction.

**3. Crystal companion:** {该牌 best_overall 如何作为 tangible reminder，
把牌意落到日常 —— 水晶不是魔法，是意图的物理锚点}
```

**三视角硬约束**：
- 三段长度均衡（每段 60-90 词），禁心理学段一句带过
- 心理学维度必须引用 module_weights 表的具体概念（非泛"psychology says"）
- 第三段必须落回水晶推荐（不是脱离产品讲理论）

## 8. M8 Eastern Perspective 段（护城河 ⭐）

> **护城河具体化**：Eastern 从概念落到每牌**至少 2 处 Eastern 锚点**（对标 goearthward 东方调性水晶首饰定位）。

### 每篇 Eastern 锚点配额（硬约束）

| 锚点类型 | 每篇最低 | 落点 | 写作指引 |
|---|---|---|---|
| 东方塔罗 / 曼荼罗对应 | 1 处 | M8 主段 | 该牌在藏传曼荼罗 / 印度神祇 / 东方修行体系里的对应象征（非主导，"also resonates with..."补充）|
| 东方水晶 / 玉石传统 | 1 处 | M8 或 M4 | 该牌某颗水晶在东方传统里的用途（如 jade 中国文化 = 纯净/守护，clear quartz = "菩萨石"古称）|
| 东方实践方式 | 0-1 处（可选）| M5 | 仪式可融入东方元素（藏式持咒计数、曼荼罗冥想轻提）|

### 四类 Eastern 锚点写作库（按牌适配，生产时取用）

**1. 藏传曼荼罗 / 东方塔罗体系**：
- 22 Major 与东方修行的呼应（如 The Fool = 初发心 / The Hermit = 闭关 / Death = 无常 / The Star = 菩提心）
- 写法：`In Tibetan Buddhist practice, the energy of {Card} also resonates with {象征}, where {一句话东方解释}.`

**2. 印度神祇 / 东方象征**：
- The Empress ≈ 大地母亲 / Devi 传统 / The Magician ≈ 创造之神象征
- 写法：`{Card}'s archetype also appears in Eastern traditions as {对应}, which mirrors this card's theme of {牌意}.`

**3. 东方玉石 / 中国水晶文化**：
- Clear Quartz（"菩萨石"古称，佛教七宝之一）/ Jade（纯净/守护/福）/ Agate（平衡/长寿，佛教七宝）/ Amethyst（东方紫色 = 尊贵/灵性）
- 写法：`{Crystal} has a long history in East Asian tradition as a stone of {象征} — for {Card}, this pairs naturally with {牌意}.`

**4. 东方修行 / 内观传统**：
- The Hermit ↔ 闭关 / The Hanged Man ↔ surrender in practice / Temperance ↔ 中道 / Death ↔ 无常观
- 写法：`The contemplative thread of {Card} also runs through Eastern meditation traditions as {对应修行}, where {一句话}.`

### 写作纪律（防翻车）
- **不主导、不算命、不宗教化**：Eastern 锚点是"文化补充"不是"宗教宣导"，必须接合规口径
- **不堆砌**：每篇 2-3 处即可，多了变文化科普文章偏离主词（`crystals for {card}`）
- **与西方水晶体系融合**：Eastern 锚点最终落回我们的水晶推荐（不是推传统宝石替代产品）
- **文化准确**：藏传/印度/中国象征必须查证，不确定的标注"in some traditions"

## 9. M9 Shop CTA 段（首饰转化差异化 ⭐）

> **竞品无首饰 Shop**：soulfulnwild/astrosofa 只讲水晶 raw，无购买承接。goearthward 是首饰站 = 差异化转化路径。

```
## Shop {Card} Crystals

{best_overall} and its companions are available as wearable jewelry in our
shop — each piece can serve as a daily reminder of {Card}'s invitation to
{archetype 动作}.

- [Shop {best_overall} jewelry →]({shop_url}) {预验证 URL}
- [Browse {best_daily_wear} →]({shop_url}) {预验证 URL}
- [Explore all healing jewelry →](/product-category/healing-jewelry/)
```

**Shop CTA 硬约束**（memory `shop-cta-no-deadlink-rule` 三级优先）：
- 目标 `/product-category/{slug}-crystals/` 先 HEAD 验证 200
- 404 → `/shop/?s={slug}` 产品搜索（验证非空）
- 搜索也空 → `/product-category/healing-jewelry/` 总分类
- **禁止带死链 Shop CTA publish**

## 10. M10 Mini Crystal Tarot Spread 段（差异化 ⭐）

> **竞品无 spread**：合集页无牌阵。我们做 3 牌 + 3 水晶小牌阵 = 教育性差异化 + 增加页面独特价值。

```
## A Mini Crystal Tarot Spread for {Card}

A three-card spread to explore {Card}'s message in your life, with a crystal
paired to each position.

| Position | Question | Companion Crystal |
|---|---|---|
| 1. Where {Card} is showing up | Where is {archetype 能量} active in my life right now? | {best_overall} |
| 2. What it invites | What is this card asking me to notice or do? | {best_upright} |
| 3. The next step | What small action aligns me with this card's healthy expression? | {best_daily_wear} |

Shuffle your deck, place a stone on each position as you draw, and sit with
the three cards together for a few minutes before journaling.
```

**M10 硬约束**：
- 3 牌阵固定结构，但问题内容每牌不同（锚定 archetype）
- 水晶复用 M4 已选（不引入新水晶）
- 表格形式（非段落，物理差异化）

## 11. FAQ 三层分层

**第一类：主搜索意图**（必含）
- What does {Card} mean in tarot?
- What is the upright meaning of {Card}?

**第二类：高转化意图**（必含）
- What are the best crystals for {Card}?
- What does {Card} mean in love?（关系长尾）

**第三类：信任与合规**（必含）
- Is {Card} a bad card?（**答：无好牌坏牌，逆位是成长邀请非凶兆**）
- Can tarot predict the future?（**答：不能，tarot 是自我反思工具非预测系统**）

### FAQ 答案差异化规则（降站内重复 ⭐）

> **问题可重复，答案分两半**：信任/合规类问题在 22 篇都会出现，但若答案全站逐字相同会被判薄内容。规则：**前半句全站一致（建立权威）+ 后半句加该牌具体语境（差异化）**。

**模板**：`[全站统一前半] + [该牌具体后半]`

**示例 1 — "Is {Card} a bad card?"**：
- 全站前半（一致）："In tarot, no card is inherently 'good' or 'bad' — every card, including reversed positions, is read as information for reflection rather than a fixed outcome."
- 牌后半（差异化，按 archetype 改写）：
  - The Tower：`...For The Tower, the card's sudden-change energy often feels alarming, but it typically points to structures that were already unstable — the invitation is to rebuild on truer foundations.`
  - The Sun：`...For The Sun, even this joyful card reminds us that joy is something to tend, not assume — its reversal can ask where we've muted our own radiance.`

**示例 2 — "Can tarot predict the future?"**：
- 全站前半（一致）："No — tarot is a symbolic system used for self-reflection and contemplation, not a tool that predicts fixed outcomes. The cards surface patterns and questions; your choices shape what happens next."
- 牌后半（差异化）：
  - The Fool：`...For The Fool, the card may prompt you to ask whether a leap before you is wise or reckless — but the leap itself remains your choice.`
  - Wheel of Fortune：`...For the Wheel, the card invites reflection on what is within your influence and what is not — it doesn't tell you which way the wheel will turn.`

**规则**：
1. 22 篇的同一问题**前半句逐字一致**（合规口径统一）
2. **后半句必须引用该牌 archetype + module_weights 重心**（如 The Fool 用 leap/openness，The Emperor 用 structure/authority）
3. 二审脚本对比 22 篇 FAQ 答案的**后半句相似度 < 40%**（前半句允许 100% 一致）

**选做**（按牌适用性）：
- What does {Card} reversed mean?（M3 长尾）
- What chakra is {Card} associated with?（我们独有，竞品无，从水晶反推脉轮）
- What number is {Card} in tarot?（教育性，0-21）

## 12. Schema

- **Article**：每篇必配
- **FAQPage**：M11（问题答案与页面可见 FAQ 严格一致）
- **ItemList**：M4 水晶段（列 crystal guide items，**指 meaning 页，禁 Product schema**）
- **BreadcrumbList**：Home > Blog > Tarot > {Card}

### ItemList 执行细则（防滥用 Product schema ⭐）

> **核心约束**：M4 是"水晶指南"不是"商品列表"，**禁止用 Product schema**（页面无真实商品价格/库存/评价，滥用 Product 会被 Google 判 spam）。

**正确做法**：
- 用 `ItemList`，`itemListElement` 每项指向 **Crystal Meaning 页**（`/gemstone/{slug}-meaning/`）或页内锚点（`#best-overall`），**不指向 product/category 商品页**
- 每项 `item` 类型 = `Article` 或 `CreativeWork`，不是 `Product`
- 字段：`name` / `description`（该水晶为何配此牌，一句话）/ `url`（meaning 页或锚点）
- 商品意图由可见 CTA（Shop 链接）承担，不进 schema

**二审确认项**：
- 确认 `ItemList` 每项 url 指向的 meaning 页**真实存在**（接 §3 M4 CTA 预验证报告）
- 确认 schema 中列出的水晶与页面 M4 可见 5 颗水晶**完全一致**（不多不少）
- 确认无任何 `Product` / `Offer` / `AggregateRating` 字段（除非真实接入 WooCommerce 商品数据）

## 13. 内链规则

- ≥1 Crystal Meaning 页（`/gemstone/{slug}-meaning/`，5 颗水晶各链）
- ≥1 产品集合页或 Shop 搜索（`/product-category/{slug}-crystals/` 或 `/shop/?s={slug}`，先验证 200）
- ≥2 相关牌（related_cards 互链，如 The Fool ↔ The World/The Magician）
- **1 个 Tarot Hub**（`/crystals-for-tarot-cards/`，23 篇互链枢纽）
- **天使号码内链**（可选）：The Fool 可链 `/0-angel-number-meaning/`（0 数字能量呼应）
- **Numerology 内链**（可选）：The Magician（1）链 `/numerology/life-path-1/`（牌号 1 呼应）

### 生产后内链热力统计（负载平衡检查 ⭐）

> **问题**：best_love 跨牌统一 rose-quartz 是有意的，但 22 篇集中链 rose-quartz 可能让 1 个 meaning 页吃掉绝大多数内链。

**生产后强制步骤**（22 篇 publish 后跑）：
1. 扫描 22 篇所有 `/gemstone/{slug}-meaning/` 内链，统计每个 slug 被链次数
2. 生成内链热力图：`_qc/post-link-heatmap.json`
3. **失衡判定**（任一触发即标红）：
   - 单一 meaning 页被 ≥ 15 篇链（占比 > 68%）
   - Top 3 meaning 页合计吃掉 ≥ 70% 的 Tarot 群内链
4. **失衡修正**：rose-quartz 失衡 → best_love 在 3-5 篇换 rhodonite/moonstone/rhodochrosite
5. **长尾覆盖检查**：确认 22 篇合计触达 ≥ 20 个不同 meaning 页

## 14. 图片配置

- **Hero**：牌视觉 + 水晶组合（1536×864）—— **天使号码 hero 风格平移**（memory `angel-numbers-hero-visual-style`：牌符号数字 + 水晶 graphic，专用 generate-images.js 不加 no text 以允许渲染牌符号/罗马数字）
- **牌 + 水晶组合图**：每牌独立 hero（牌的视觉符号 + 该牌 best_overall 水晶，如 The Tower = 闪电塔 + Smoky Quartz）
- **Mini Spread 示意图**：3 牌 + 3 水晶排列（M10 配图，1024×1024）
- **每颗水晶**：复用 390 图库（同天使号码/Numerology）

**图片规则**（memory `crystal-scripts-nodepath-sharp` + `shell-envkey-override-loadenv`）：
- 生图脚本 loadEnv **强制覆盖** shell 错误 key（OPENAI_API_KEY sk-local 占位会被 ~/.env 真源覆盖）
- NODE_PATH 指向全局 sharp（项目无 node_modules）
- gpt-image-2，hero `1536x864`，spread `1024x1024`

## 15. 数据层 config（`07-互动工具/_shared/tarot-knowledge.json`）

**每牌配置字段**：
```json
{
  "number": 0,
  "slug": "the-fool",
  "name": "The Fool",
  "archetype": "The Innocent Pioneer",
  "element": "Air",
  "theme": "New beginnings / leaps of faith",
  "upright_keywords": ["new beginnings","innocence","free spirit","leap of faith"],
  "reversed_keywords": ["recklessness","hesitation","naivety","avoidance of commitment"],
  "upright_meaning": "...",  // Rider-Waite 画面 + 象征 + 三视角
  "reversed_meaning": "...", // shadow aspect + 转化 invitation
  "psychological_lens": "openness to experience", // M7 心理学维度
  "eastern_anchor": "...",   // M8 东方锚点
  "recommended_practice": "...", // M5 仪式动作
  "crystals": {
    "best_overall": {"slug": "quartz", "name": "Clear Quartz", "reason": "...", "source": "soulfulnwild"},
    "best_upright": {...}, "best_reversed": {...},
    "best_love": {...}, "best_daily_wear": {...}
  },
  "chakra": "Crown",  // 从 best_overall 反推
  "related_cards": [21, 1],  // The World, The Magician
  "related_reason": "...",
  "source_notes": "..."  // 四源映射依据 + 裁决理由
}
```

**工具单源**：`tarot-knowledge.json` 同时供：
1. **文章生产**（04-内容生产/13.tarot/ 读取生成 articles/*.json）
2. **Tarot 工具**（07-互动工具/ 未来 tarot-spread-generator/ 可复用）

### 工具前置依赖（无 ⭐）

> 与 Numerology 不同（Numerology 依赖 Calculator 工具），Tarot 文章群**无工具前置依赖** —— 牌意 × 水晶内容自洽，M10 Mini Spread 是文章内嵌的教育性 spread，不需独立工具。未来若建 tarot-spread-generator 工具，可反向增强，但不阻塞 23 篇发布。

### 数据层质量阀门（tarot-knowledge.json 验收，全塔罗普适见 [1F §0A.4](../../01-竞品分析/1F-塔罗内容写法研究.md)）⭐

> tarot-knowledge.json 是 23 篇牌义页（+ 配对/场景/是与否/运势 4 类）的共同源头，错则全错。普适判定流程/抽审比例见 1F §0A.4，本节列**牌义页专属验收清单**。

**tarot-knowledge.json 牌义页验收清单（任一不满足打回）**：
- [ ] 每牌 archetype/upright_meaning 有 Rider-Waite 权威投射依据（画面象征可追溯）
- [ ] 22 牌 archetype 主体象征词组重叠 < 30%（[1F §0A.4](../../01-竞品分析/1F-塔罗内容写法研究.md)）
- [ ] 每牌 M3 reversed_keywords 写该牌独有 shadow（非 22 牌通用 resistance/blockage）
- [ ] **Health/Finances 相关牌**（Empress/Tower/Death/Devil/Justice 等）的 upright/reversed 意象不触 [1F §0A.1](../../01-竞品分析/1F-塔罗内容写法研究.md) 合规红线（config 层验收，不带到正文）
- [ ] 每牌 5 角色水晶有四源依据（source 字段命中，非 AI 通识选）
- [ ] eastern_anchor 跨牌轮换不重复

## 16. Writing & Compliance Rules

### 16.0 全塔罗普适规则（引用 1F，本节不重复全文）⭐

> 牌义页守 [1F §0A 全塔罗普适规则](../../01-竞品分析/1F-塔罗内容写法研究.md)（合规边界 / 禁用表达库 / 质检语义去重 / 数据层质量阀门）。本节只列**牌义页专属合规重点**，普适黑名单/阈值/验收清单见 1F §0A 对应小节。

**Health / Finances 合规（牌义页专属重点）**：
牌义页是单牌普适深度页，**涉及健康/财运 archetype 的牌**（如 The Empress=丰育/The Tower=身体震荡预警/Death=转化/The Devil=执念/Justice=平衡）在 M2/M3 落到健康或财运维度时，必须守 [1F §0A.1 Health/Finances 黑名单](../../01-竞品分析/1F-塔罗内容写法研究.md)：
- M2/M3 谈健康落点 → 只用 energy/stress/rest/body awareness/emotional pattern，禁 cure/diagnose/heals/predicts sickness
- M2/M3 谈财运落点 → 只用 money mindset/risk awareness/spending pattern，禁 invest now/guaranteed gain/this stock
- Health/Finances 主题牌的 FAQ（如 "Is The Tower a warning about my health?"）答案过 [1F §0A.1](../../01-竞品分析/1F-塔罗内容写法研究.md) 合规门，答 reflective not predictive
- 牌义页**不强制加 Health/Finances 收尾免责**（牌义页是普适页非场景页）；但若该牌 FAQ 明确谈健康/财运，在该 FAQ 答案内嵌免责口径

**禁用表达库**：全塔罗 6 类禁+替代表见 [1F §0A.2](../../01-竞品分析/1F-塔罗内容写法研究.md)。牌义页高发区：M4 水晶段（水晶万能句/医疗承诺/财务承诺）、M3 逆位段（恐吓逆位）、Intro 钩子（泛泛开头）。

**Tarot 特有合规**（比 Numerology 更需谨慎，因涉及"预测/占卜"）：
- ❌ "This card predicts / will tell you / foretells your future"
- ❌ "{Card} means you are destined to / will meet / will get..."
- ❌ "{Card} is a bad card / cursed / evil / brings bad luck"
- ❌ "Crystals will heal / cure / fix your {issue}"
- ❌ "This card guarantees success / love / wealth"

**推荐表达**：
- ✅ "In tarot tradition, {Card} is associated with... When this card appears, it often invites reflection on..."
- ✅ "Tarot is a symbolic system for self-reflection, not a predictive tool — your choices shape your path"
- ✅ "Crystals can serve as a tangible reminder of the qualities you want to cultivate"
- ✅ "Reversed positions are not 'bad' — they often point to where the card's energy is in shadow, inviting growth"

**Gentle Note**（全站统一组件，放 FAQ 前）：
> "Tarot and crystal meanings are based on spiritual traditions, symbolism, and personal mindfulness practices. They are a tool for self-reflection and contemplation, not a substitute for medical, financial, or professional advice — and not a prediction of fixed outcomes."

**去AI化**：同全站禁词 + 化学式大写 + **M4 水晶段 4 套句式轮换** + **M2/M3 牌意段用具体画面代替泛词**（"the figure steps toward the cliff edge holding a white rose" 而非 "this card means new beginnings"）

## 17. 生产流程

1. ✅ 数据层 `_shared/tarot-knowledge.json` 已建（22 牌 × 完整配置 + Hub）
2. ✅ 框架文档（本文件）已建
3. **M4 CTA 预验证**（生产前硬检查）：输出 slug 清单 → HEAD 检查 meaning/category → 降级 → 生成 `_cta-validation.json`（全绿才进入步骤 4）
4. config + 骨架生成脚本（`scripts/generate-articles.js`，12 模块参数化）
5. **AI workflow 一次填充全 23 篇**（`_placeholders/` + `fill-from-placeholders.js`，BATCH=2 避智谱限流，**全 23 篇一次考虑重复度**：每牌牌意 + 水晶 why + Eastern 锚点 + 心理学维度差异化，跨牌 FAQ 后半差异化，逆位描述不雷同）
6. **三质检关卡（二审前强制 ⭐，见 §17A）**：
   - 关卡 1：牌差异化检查（M2/M3/M7 有独立场景非只换牌名）
   - 关卡 2：水晶绑定检查（每颗绑定牌具体画面/牌意非通用，三要素齐全 + 四源依据）
   - 关卡 3：非占卜语言检查（批量搜禁词 will predict/destined/guaranteed/bad omen/curse，人工改写）
7. 二审（牌意准确性 vs Rider-Waite 权威 / 水晶三要素 / 跨牌重复度 / Eastern 锚点配额 / 合规）
8. 图片（hero 牌视觉 + 水晶 + Mini Spread 示意，gpt-image-2，loadEnv 强制覆盖，NODE_PATH sharp）
9. upload draft（URL `/tarot-{card}-crystals/` + Hub `/crystals-for-tarot-cards/`，分类 tarot 建，Shop 验证，rank_math + Schema Article/FAQPage/BreadcrumbList/ItemList 禁 Product）
10. **防假完成**：WP REST GET 验证每篇 featured_media≠0 + content img 数 + schema 写入 + slug 唯一，附证据（memory `completion-requires-online-verification` / `upload-images-completeness-check`）

### 17A. 三质检关卡细则（二审前强制 ⭐）

> AI 填充后、二审前，跑三个独立脚本关卡。**任一关卡不通过，批量打回重写**。

**关卡 1 — 牌差异化检查**：
- 检测对象：23 篇的 M2 / M3 / M7 正文
- 检测方法：
  - archetype 词频统计：23 篇 M2 主体象征词组**重叠率 < 30%**
  - 画面独特性：每篇 M2 至少 1 个该牌 Rider-Waite 独有画面元素（如 The Fool 的"悬崖/白玫瑰/小狗"，The Tower 的"闪电/坠落的王冠"）
  - M3 逆位张力不得跨牌雷同（shadow 必须不同，见 module_weights M3 列）
- 输出：`_qc/01-differentiation.json`

**关卡 2 — 水晶绑定检查**：
- 检测对象：23 篇 × 5 颗 = 115 条水晶段
- 检测方法：每条必须命中三要素：
  1. 引用该牌具体牌意/画面（archetype / upright / reversed / 画面词命中）
  2. 水晶 symbolic support（Intentions/symbolism 命中）+ **四源依据**（source 字段命中）
  3. 具体使用场景（非"carry it / wear it"万能句）
- 反例模式匹配：标红"X supports this card's energy. It is a Z stone."类通用句
- 输出：`_qc/02-crystal-binding.json`

**关卡 3 — 非占卜语言检查**：
- 批量正则搜禁词（含变体）：
  - `will predict` / `predicts` / `foretell` / `destined` / `destiny`（非牌意上下文）/ `guaranteed`
  - `bad omen` / `curse` / `cursed` / `evil` / `bad luck` / `bad card`
  - `will heal` / `will attract` / `will bring`（水晶段确定论）
  - `meant to` / `born to` / `fix` / `cure`
- 处理：命中句子**人工逐条改写**（非脚本自动替换，避免改坏语义）
- 输出：`_qc/03-determinism.json`
- 注：化学式校验区分大小写（memory `validate-riskwords-case-sensitive`）

**关卡 0 — 合规前置门（Health/Finances + 禁用表达库，全塔罗统一 ⭐）**：
- grep [1F §0A.1 Health/Finances 黑名单](../../01-竞品分析/1F-塔罗内容写法研究.md)（cure/diagnose/heals/invest now/guaranteed gain/this stock 等）+ [1F §0A.2 禁用表达库](../../01-竞品分析/1F-塔罗内容写法研究.md) 6 类
- 命中即打回不进生产；重点扫 M4 水晶段（水晶万能/医疗承诺/财务承诺）、M3 逆位段（恐吓逆位）、Intro 钩子（泛泛开头）
- 输出：`_qc/00-compliance.json`

**关卡 4 — 语义去重 + 结构指纹（全塔罗普适升级 ⭐，见 [1F §0A.3](../../01-竞品分析/1F-塔罗内容写法研究.md)）**：
- **语义去重**：22 牌牌义页 M2/M3 段（核心论证段）跨牌 embedding 余弦相似度 **> 0.85 触发复审**（换牌不换骨）。牌义页重点查 M2 archetype 段——22 牌 archetype 语义易雷同（如多牌都写"transformation/new beginning"）
- **结构指纹**：22 牌模块开场句式 + 论证路径指纹重复率 **< 40%**；**强制 ≥ 30% 牌义页打乱默认起承转合**（如 M3/M6 合并、加 Myth vs Reality 段、M10 Mini Spread 前置等变体）
- **人工连读兜底**：抽 5-10 牌连读，判断"换牌名能否互换"
- 输出：`_qc/04-semantic-structure.json`

## 18. 与 Numerology / 天使号码的关系（避免内容重叠）

| 维度 | 天使号码 | Numerology (Life Path) | Tarot (Major Arcana) |
|---|---|---|---|
| 来源 | 反复出现的数字序列 | 出生日期计算 | 抽牌（22 张 Major）|
| 主词 | `{n} angel number meaning` | `life path {n}` / `crystals for life path {n}` | `{card} tarot` / `crystals for {card}` |
| 内容核心 | 当下信息 / 提醒 | 人格特质 / 生命方向 | 牌意 archetype / 自我反思 |
| 工具 | 无 | Numerology Calculator | 无（M10 文章内 spread）|
| 数字/符号能量 | 单数字 + 重复 | Life Path archetype | 牌号 0-21 + Rider-Waite 画面 |

**同号呼应可互链**（如 The Magician 牌号 1 ↔ Life Path 1 ↔ 天使号码 1），但内容不重复 —— Tarot 讲"抽到这张牌的牌意与水晶"，Numerology 讲"出生为 1 号人的人格"。

---

## 附录：四源验证结论（2026-06-28）

### 1. SERP 生态
- **`{card} tarot card meaning`（纯牌意主题词）**：Biddy Tarot / Labyrinthos / The Crystal Council / Trusted Tarot 等 DA 70+ 专站垄断 → **主题词难度高，不做**
- **`crystals for {card} tarot card` / `{card} tarot crystals`（×水晶交叉长尾）**：SERP 全是小站合集页（soulfulnwild/astrosofa/elvitarot 单页每牌 2-3 段），goearthward 同生态位靠**独立深度页**可排 → **我们的生态位**

### 2. 竞品 sitemap（1B 35 家）
- **4 直接竞品**（buddhastoneshop/navratan/buddha3bodhi/第4家）：**0 做 Tarot 内容**（蓝海确认）
- **其他水晶站已做**：The Crystal Council（10+ Major 牌意深度页，但**无首饰 Shop / 无 Minor / 无 Eastern / 无逆位专章**）= 6 差异化空间
- **纯塔罗站**：Biddy/Labyrinthos 牌意深但无水晶绑定
- **结论**：非纯蓝海，是**与小站合集页直接竞争的交叉长尾**（goearthward 同生态位，靠 6 差异化赢：独立深度页 + 首饰 Shop + Minor 空白 + Eastern + 三视角 + 逆位专章）

### 3. 水晶映射四源矛盾与裁决
- **The Fool**：soulfulnwild=Clear Quartz / astrosofa=Amethyst → 我们 best_overall=Clear Quartz（贴 archetype），best_reversed=Amethyst（逆位保护）
- **The Tower**：astrosofa=Moldavite（贵+小众不适合首饰）/ soulfulnwild=Smoky Quartz → 我们 best_overall=Smoky Quartz（首饰适配+平价+同属性），Moldavite 降级为 alt mention
- **The Magician**：soulfulnwild=Citrine / astrosofa=Clear Quartz → 我们 best_overall=Clear Quartz（amplifier 最贴），best_upright=Citrine
- 逐牌裁决写入 `tarot-knowledge.json > source_notes`，建立 goearthward Crystal Tarot 体系成权威源

### 篇数定稿：23 篇（22 Major + 1 Hub）
- 22 Major Arcana（0-21）各一篇独立深度页
- 1 Hub（`/crystals-for-tarot-cards/`）汇总导航 + 22 牌互链
- Minor Arcana（56 张）留扩展，本批次不做（差异化声明：Major 优先，Minor 待验证后放大）
