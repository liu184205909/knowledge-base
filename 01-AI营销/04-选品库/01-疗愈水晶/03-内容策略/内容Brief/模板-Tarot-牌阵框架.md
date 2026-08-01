# Tarot 牌阵教学框架 v1（P1，~25 篇）

> **三层架构**：母框架（本档，策略/合规/QC 逻辑）/ [生产 Brief](Brief-Tarot-牌阵-生产执行版.md)（写手填空）/ [QC 清单](Checklist-Tarot-牌阵-QC.md)（审核可勾选）。
> **适用**：`{spread-slug}/` 独立牌阵教学页（25 篇：3-card / celtic cross / yes-no / love / mind-body-spirit 等，详见数据层 `spreads-knowledge.json`）。
> **与是与否框架关系**：[是与否框架](模板-Tarot-是与否框架.md) 写**单牌在某问题下的判定**；本框架写**牌阵本身的教学**（结构/位含义/如何读/水晶落位）。物理隔离：牌阵页不讲单牌深度，只讲阵法。
> **与牌义页框架关系**：[牌义页框架](模板-Tarot-牌义页框架.md) 写牌的普适意义；本框架写**阵法**，链回相关牌义页。
> **竞品依据**：[1F §2.6 牌阵教学](../../01-竞品分析/1F-塔罗内容写法研究.md) + SERP 实查（2026-07-02，见下）。
> **数据源**：`spreads-knowledge.json`（**第一交付物**，已审）+ `scenario-knowledge.json`（场景水晶倾向）+ 390 库（水晶落位依据）。
> **核心策略**：主词 `{spread name} tarot spread` / `tarot spreads for {topic}`。差异化：**每牌阵位→对应水晶（反思辅助口径）+ 东方阵法对照 + 不预言结果而是给建议路径**。
> **⚠️ 最大风险**：① 抄 Labyrinthos 18 种 3-card 表（重复内容）② 把每牌位读成"今日事件预言"（违规预测）③ Health/Finances 牌阵违规医疗/投资判定 ④ 水晶万能论（玄学承诺）。

---

## §0 SERP 研究前置（竞品结构 + AIO 已查，2026-07-02）⭐⭐⭐

> **查询词**（serp_check 实查，禁 WebSearch 猜）：

| 查询词 | AIO | 竞品 top 结构 | goearthward 机会 |
|---|---|---|---|
| `tarot spreads for beginners` | ✅ | labyrinthos（3-card 18种按layout分）/ biddy（top 5）/ ethony / emeraldlotus / suburbanwitchery / womenshealthmag / today / thtarotlady | 新手总览页 + 3-card 深度变体页（每变体独立篇） |
| `celtic cross spread` | ✅ | biddy（10位详释+卡间动力学）/ labyrinthos / thtarotlady / learntarot / theirishjewelrycompany / carriemallon | 10位水晶落位 + 卡间动力学教学（竞品零水晶） |
| `3 card spread meaning` | ✅ | labyrinthos（4类layout：linear/balanced/foundational/crossed）/ biddy（25种）/ ethony / jesscarlson / moonleafmagic | 3-card 变体各独立篇（PPF / MBS / SAO 等） |
| `yes no spread tarot` | ✅ | labyrinthos（4法）/ tarotelements / thetarotlady（30秒）/ tarotparlor / tarot-heritage（yes-no-maybe）/ creativesoultarot | conditional 转化 + 自由意志免责（竞品多扁平判定） |
| `love spread tarot` | ❌ | labyrinthos / pagangrimoire / writualplanner（relationship cross）/ emeraldlotus（15种）/ starandstrength（13种 singles） | love 牌阵每位的爱情能量质地（竞品零水晶） |
| `tarot spreads for love and relationships` | ✅ | reddit / writualplanner / labyrinthos / emeraldlotus / autostraddle / tarotwithgord / daily-tarot-girl | 同上 |
| `past present future tarot spread` | ✅ | spiralseatarot / horoscope / dailytarotdraw / tarotgoddess / daily-tarot-girl / sophrosynetarot / ifate / paulomara | PPF 牌阵每位的能量质地 + 水晶（竞品零水晶） |

**AIO 关键发现**：7 词中 6 词触发 AIO，且 AIO 多引用 Reddit/论坛/小型博客——**说明 AIO 在抓"教学解释"内容，深度教学页有机会被 AIO 引用**。这是牌阵教学 P1 优先级的核心 SEO 论据。

**竞品集体空白（核心差异化护城河）**：所有抓取的竞品 spreads 文章**零水晶提及**。goearthward 每牌阵位→对应水晶（反思辅助口径）是**竞品全无的差异化**，与 1F §2.6 一致。

---

## §1 数据层前置（`spreads-knowledge.json` = 第一交付物）⭐⭐⭐

> **核心变更**（学是与否框架 §0）：`spreads-knowledge.json` 是**第一交付物**，矩阵审完才进文章生产。避免边写边判断。

**矩阵结构**（每条 spread）：

| 字段 | 内容 | 示例（PPF） |
|---|---|---|
| slug | 牌阵 slug（=URL） | three-card-past-present-future |
| name | 牌阵标准名 | Past-Present-Future Spread |
| card_count | 牌数 | 3 |
| layout | 阵法形态 | linear / cross-and-staff / fan / balanced-triangle / mirror / horseshoe / wheel 等 |
| primary_intent | 主要意图 | general-beginners / love / decision / manifestation / quick-answer / self-awareness / finances / health |
| serp_keyword | SERP 实查主词 | past present future tarot spread |
| title/h1_template | 标题模板 | "Past, Present, Future Tarot Spread: How to Read It (+ Crystals for Each Position)" |
| primary_kw | rank_math focus_keyword | past present future tarot spread |
| difficulty | 难度 | beginner / intermediate / advanced |
| best_for | 最适用场景 | 新手第一牌阵；快速状态检查 |
| positions | 每位数组（核心） | 见下 |
| yes_no_applicable | 该阵是否适用 yes/no | true/false |
| yes_no_method | yes/no 判定法（如适用） | 正位多→顺；逆位多→调整 |
| compliance_flag | 合规标红 | general(低) / love(中) / health(极高) / finances(极高) |
| eastern_lens | 东方阵法对照 | 三才阵（天-地-人）/ 阴阳 / 五方 / 七曜 / 十二月将 等 |
| differentiation_hook | 该牌阵独有差异化点 | 一句话定位 vs 竞品 |

**positions 数组每位**：

| 字段 | 内容 | 示例（PPF 位 1） |
|---|---|---|
| num | 位号 | 1 |
| name | 位名 | Past |
| meaning | 该位含义 | 塑造当前处境的过去影响——事件、模式或你携带的旧能量 |
| crystal | 水晶 slug（390 库，已验证存在） | smoky-quartz |
| crystal_role | 水晶职能（反思辅助口径，非万能） | grounding 旧能量 / 看清过去模式而不被其困住 |

**水晶落位依据**（非通识编）：
1. **5 大场景水晶倾向**（来自 `scenario-knowledge.json` `scenario_crystal_tendency`）：love→rose-quartz/moonstone/rhodonite；career→citrine/tiger-eye/pyrite；finances→aventurine/pyrite/jade；health→bloodstone/quartz/smoky-quartz；spiritual→amethyst/selenite/labradorite
2. **位的能量职能匹配**：grounding 位→smoky-quartz/black-tourmaline/bloodstone；intuition/潜意识 位→labradorite/amethyst/moonstone；heart/关系 位→rose-quartz/rhodonite/kunzite；will/行动 位→carnelian/citrine/pyrite；清明/觉察 位→quartz/fluorite/selenite；接收/未来 位→moonstone/aquamarine
3. **390 库全部 21 颗水晶已验证文件存在**（见数据层 _meta.crystal_source）

**矩阵验收清单**（任一不满足打回，详细可勾选项见 [QC 清单](Checklist-Tarot-牌阵-QC.md)）：
- [ ] 每位 crystal slug 在 390 库存在（grep 验证）
- [ ] 每位 crystal_role 是**反思辅助口径**（"助看清/助稳住/助接通"），非"改变结果/吸引X"万能论
- [ ] 同阵内水晶尽量不重复（除非职能互补）；跨阵水晶可复用（按职能）
- [ ] 25 牌阵覆盖 SERP 实查的所有高搜索词（PPF/Celtic Cross/yes-no/love/3-card 等）
- [ ] Health/Finances 牌阵守 §7A（mind-body-spirit 的 Body 位 / money-spread 全阵）
- [ ] 每阵有 eastern_lens 具体锚点（非"Eastern traditions use crystals"万能句）
- [ ] yes_no_applicable 标记准确（判定型阵 true；深度探索型 false）

**抽审比例**：Health/Finances 阵全审 / P1 pilot 5 篇全审 / P1 high 抽 50% / P2 抽 20%

---

## §2 URL + TKD

- **URL**：`{spread-slug}/`（根级 post，对齐 site-url-rule）。示例：`/three-card-past-present-future/` / `/celtic-cross-spread/` / `/yes-no-spread/`
- **Title**：用数据层 `title_template`（每阵独有，≤60 字符）
- **H1**：用数据层 `h1_template`
- **Primary KW**：数据层 `primary_kw`（= `serp_keyword`）
- rank_math 三件套（focus_keyword = primary_kw）

**内链结构**（见 §9）。

---

## §3 模块结构（8 核心，1500-2200 词）⭐

> 字数对标 1F §4.3：牌阵教学对标竞品深度页（Biddy Celtic Cross ~1500 词 / Labyrinthos 3-card 18 种 ~2000 词），下限 1200。

| # | 模块 | H2 | 词数 | 必/可选 |
|---|---|---|---|---|
| Intro | Hero + 钩子 | | 120-180 | 核心 |
| M1 | What This Spread Is + When to Use | `When to Use the {Name}` | 150-220 | 核心 |
| **M2** | **The Layout + Positions**（每位含义） | `The {N} Positions of the {Name}` | 400-600 | **核心**（见 §4）⭐ |
| **M3** | **Crystals for Each Position** | `Crystals for Each Position` | 250-400 | **核心**（差异化护城河，见 §5）⭐ |
| M4 | How to Read It（读牌法） | `How to Read the {Name}` | 200-300 | 核心 |
| M5 | Eastern Perspective | `An Eastern Lens on the {Name}` | 150-220 | 核心（差异化，见 §6） |
| M6 | Yes/No（如适用）| `Can the {Name} Answer Yes/No Questions?` | 120-180 | **可选**（仅 `yes_no_applicable:true`） |
| M7 | Common Mistakes + Free Will Disclaimer | `Common Mistakes + Your Free Will` | 150-220 | 核心（见 §7） |
| M8 | FAQ + Shop CTA + Related | | 200-300 | 核心 |

**词数说明**：M2+M3 占 650-1000 词（核心 + 差异化护城河）；其余分 850-1200 词。简单阵（1-3 牌）控制 1500-1800；复杂阵（Celtic Cross 10 牌 / Year Ahead 12 牌）可达 2200-2500。

---

## §4 M2 每位含义（核心防雷）

**照抄竞品 = 重复内容**。M2 必须落**该牌阵每位的能量职能**（不只是位名）：
- ❌ "Position 1 is the Past."（Labyrinthos 风格的扁平清单，可复制性高）
- ✅ "Position 1 — the Past — shows the **energy that shaped where you are now**: not just events, but the **patterns and old energy you're still carrying**. A Major Arcana card here suggests the past is still actively running the show; a Minor suggests it's situational."

**硬约束**：
1. 每位含义落**能量质地**（不只是事件描述）——这是竞品薄弱处
2. 复杂阵（Celtic Cross 10 位）必含**卡间动力学**（学 Biddy：Above vs Below / Above vs Outcome / Future vs Outcome / Below vs Hopes-Fears / Advice vs Outcome）——**这是 Biddy 独有的深度，竞品多缺**
3. 每位含义禁"今日事件预言"口径（"this position tells you what will happen"）→ 改"能量焦点/可能性/倾向"口径（守 §7）

---

## §5 M3 每位水晶（差异化护城河）⭐⭐⭐

> **这是竞品全无的核心差异化**（1F §2.6 + SERP 验证）。M3 决定文章是否被判同质。

**水晶口径（反复强调，避免玄学承诺）**：
水晶 = **反思辅助 + 触觉锚**，非改变结果/吸引X 的工具。
- ✅ "Smoky Quartz here helps you **stay grounded while you look at old patterns** — a tactile cue to keep you present rather than spiraling into rehashing."
- ❌ "Smoky Quartz **clears the past** / **releases old karma** / **attracts new beginnings**"（玄学承诺）

**M3 结构**（每位 1 段，~50-80 词）：
1. 该位的能量职能（接 M2）
2. 水晶为什么适配（职能匹配，非属性堆砌）
3. 具体用法（"hold it on that position as you read" / "place it under the card"）——**触觉锚**

**硬约束**：
1. 每位水晶来自数据层 `positions[].crystal`（已验证 390 库存在），禁生产中临时换
2. `crystal_role` 字段是反思辅助口径（"助看清/助稳住/助接通"），生产时**原文采用禁改写为万能论**
3. 同阵内水晶尽量不重复（除非职能互补，如 PPF 用 moonstone 在未来位 + mind-body-spirit 用 moonstone 在 spirit 位跨阵可复用）
4. 水晶推荐段链 390 库 meaning 页或 Shop（CTA 三级降级，见 §10）

---

## §6 M5 东方阵法对照（差异化）

每阵 `eastern_lens` 字段给具体东方锚点：
- 三才阵（天-地-人）— PPF / mind-body-spirit
- 阴阳 — yes-no / decision / twin flame / relationship
- 五方（中央+四象）— Celtic Cross
- 因-缘-果 — situation-action-outcome
- 七曜 — week ahead
- 十二月将 — year ahead
- 朔望月相 — new moon / full moon
- 三宝（精气神）— mind-body-spirit
- 气机 — blockages
- 舍 — letting go
- 愿力 vs 妄念 — wish

**硬约束**：东方锚点必须**具体**（非"Eastern traditions use crystals for healing"万能句，1F §0A.2 黑名单）。每阵的东方锚点**不同**（防跨阵雷同）。

---

## §7 合规（核心防线）⭐⭐⭐

### §7.1 普适合规（全阵共用）

**禁用表达库**（grep 兜底，命中即打回；1F §0A.2 套用）：

| 类型 | ❌ 禁 | ✅ 替代 |
|---|---|---|
| 绝对预测 | `this position tells you what will happen` / `the cards predict` | `this position shows energy patterns / possibilities / tendencies` |
| 水晶万能 | `X clears the past / attracts love / manifests wealth` | `X as a tactile cue to stay grounded while you reflect on...` |
| 医疗承诺 | `this crystal heals/cures/diagnoses` | `a reminder to check in with your body` |
| 财务承诺 | `attract wealth / draw money fast` | `support clearer money choices / a prompt to review spending` |
| 恐吓 | `bad omen / curse / doomed` | `growth edge / shadow side / invitation to reflect` |

**强制免责文案**（每篇 M7 必含，前半全站一致 + 后半该阵差异化）：
- 全站前半："Tarot spreads are a mirror for reflection, not a fixed forecast — the positions show energy, and you always have free will to choose your next step."
- 该阵后半：`For the {Name}, the cards may point to {该阵倾向}, but how you act on what you see is your choice.`

**合规禁词**（grep）：`will predict` / `destined` / `guaranteed` / `definitely` / `curse` / `bad omen` / `doomed`。

### §7A Health / Finances 加固（牌阵专属高风险）⭐⭐⭐

> 牌阵教学的 Health/Finances 阵天然是"全阵谈该域"，比单牌场景风险更高。本节触发即打回。

**§7A.1 Health**（mind-body-spirit 的 Body 位 / 任何涉健康的阵）：
- 全阵/Body 位 verdict 只谈 energy / rest / stress / body awareness / emotional pattern
- **禁**：cure / heal / recovery / surgery / diagnose / illness / `this card means you will be ill`
- 强制免责标签（原文照搬禁改写）：
  > "For health questions, this reading is a reflection prompt, not medical advice — decisions about treatment belong with a qualified professional."

**§7A.2 Finances**（money-spread / 任何涉金钱的阵）：
- 全阵 verdict 只谈 money mindset / risk awareness / spending pattern / planning behavior
- **禁**：investment / stock / crypto / lending / `you will gain` / `guaranteed return` / `attract wealth quickly`
- 强制免责标签（原文照搬禁改写）：
  > "For money questions, this reading is symbolic, not investment advice — financial decisions belong with a qualified professional."

**§7A.3 牌阵合规分级**（数据层 `compliance_flag`）：

| compliance_flag | 牌阵 | 规则 |
|---|---|---|
| general(低) | PPF / Celtic Cross / 3-card / 等大多数 | 可正常读，禁绝对预测（用 may/likely/possibility） |
| love(中) | love / relationship / twin-flame / self-love | 禁"你一定会遇到真命天子"式绝对爱情预言 |
| **health(极高)** | mind-body-spirit（Body 位）| 守 §7A.1 全量 + 强制免责标签 |
| **finances(极高)** | money-spread | 守 §7A.2 全量 + 强制免责标签 |

### §7B 牌阵专属风险：拒绝"事件预言"

牌阵教学的最大合规风险是把"位含义"读成"事件预言"（"Position 3 tells you what will happen in your future"）。**全阵改口径**：
- Past 位 → "能量/模式"（非"发生的事件"）
- Present 位 → "当下能量状态"（非"正在发生的事"）
- Future / Outcome 位 → "若延续当前路径的可能性/倾向"（非"将发生的事件"）+ 强调"自由意志可改变"

---

## §8 选题优先级（数据层 _meta.priority）⭐

**P1 pilot**（5 篇，先验证框架）：
1. `three-card-past-present-future`（高频 `past present future`，AIO，3-card 入门）
2. `celtic-cross-spread`（经典 `celtic cross`，AIO，10 位深度）
3. `yes-no-spread`（高频 `yes no spread`，AIO，承接是与否工具线）
4. `love-spread`（高频 `love spread`，承接爱情工具线，水晶契合度最高）
5. `mind-body-spirit-spread`（Health 合规模板，验证 §7A）

**P1 high**（5 篇）：single-card-daily / situation-action-outcome / relationship / career / decision

**P2 mid**（7 篇）：shadow / new-moon / full-moon / self-love / money / dream / blockages

**P2 long tail**（8 篇）：week-ahead / year-ahead / twin-flame / letting-go / truth-or-lie / wish / five-card-advice / horseshoe

---

## §9 内链配方 ⭐

> 25 篇规模下内链必须结构化。

| 内链类型 | 数量 | 锚文本示例 | 目标 |
|---|---|---|---|
| 同主题牌阵 | 1-2 | "{other spread} tarot spread" | `/{other-spread-slug}/` |
| 牌义页（位含义相关牌） | 1-2 | "{card} tarot card meaning" | `/tarot-{card}-crystals/` |
| 水晶页（M3 提及） | 1-2 | "crystals for {crystal}" / "{crystal} meaning" | `/{crystal}-crystals/` 或 meaning 页 |
| 牌阵 Hub（如有） | 1 | "tarot spreads for beginners" | Hub 页 |
| 工具页（如适用） | 0-1 | "free {topic} tarot reading" | /tarot-reading/ /tarot-yes-no/ 等 |

**每篇 3-5 条内链**，锚文本含主关键词变体，禁 "click here"。

---

## §10 Shop CTA 三级降级（避免死链）

牌阵教学页 Shop CTA 链水晶（M3 提及的水晶），三级降级（memory shop-cta-no-deadlink-rule）：
1. **首选**：该水晶的 product category（`/product-category/{crystal}-crystals/`）—— 生产前 curl 验证 200
2. **降级 1**：404 → 产品搜索 `/shop/?s={crystal}`
3. **降级 2**：搜索也空 → 总 healing-jewelry 类目

---

## §11 质检关卡（概览，可勾选项见 [QC 清单](Checklist-Tarot-牌阵-QC.md)）

- **关卡 0 合规前置门**：grep 黑名单 + §7A；Health/Finances 阵全审；强制免责标签原文存在
- **关卡 1 数据层取值一致**：M2 位含义 / M3 水晶 与数据层一致（生产中禁临时换）
- **关卡 2 每位能量质地**（防扁平抄竞品）：M2 落能量职能非扁平位名清单
- **关卡 3 水晶反思辅助口径**：M3 非万能论；crystal_role 原文采用
- **关卡 4 卡间动力学**（复杂阵）：Celtic Cross / horseshoe 等含卡间对比
- **关卡 5 拒绝事件预言**：Past/Present/Future/Outcome 位是能量口径非事件预言
- **关卡 6 东方锚点具体**：非万能句；每阵东方锚点不同
- **关卡 7 自由意志免责**：M7 含免责（前半一致 + 后半该阵）
- **关卡 8 语义去重 + 结构指纹**：M2/M3 embedding 余弦 < 0.85；强制免责段排除相似度；结构指纹 < 40%；人工连读 5-10 篇

---

## §12 与其他框架边界

- **牌义页框架**：写牌的普适意义；牌阵页 M2 链回相关牌义页
- **是与否框架**：写单牌×问题判定；牌阵页 M6（如适用）给阵法级 yes/no 方法（非单牌判定）
- **场景框架**：写单牌×场景；牌阵页不讲单牌深度

---

## 附录：三层架构

| 层 | 文件 | 用途 | 给谁 |
|---|---|---|---|
| 母框架 | 本档 | 策略 / 合规 / QC 逻辑标准 | 决策 / 合规审 |
| 生产 Brief | [Brief-Tarot-牌阵-生产执行版.md](Brief-Tarot-牌阵-生产执行版.md) | 单篇生成模板（字段 + 模块填空） | 写手 / AI 生产 |
| QC 清单 | [Checklist-Tarot-牌阵-QC.md](Checklist-Tarot-牌阵-QC.md) | 可勾选检查项 | 审核 |
| 数据层 | `13.tarot/configs/spreads/spreads-knowledge.json` | 25 牌阵矩阵（第一交付物） | 写作源头 |
