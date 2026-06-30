# Tarot 场景文章框架 v1（22 Major × 5 场景 = 110-220 篇）

> **适用**：`/{card}-for-{scenario}/` 单牌×单场景解读页（22 Major × 5 场景 Love/Career/Finances/Health/Spiritual Growth = 110 篇基础；正逆位拆分可扩至 220）
> **与牌义页框架的关系**：[模板-Tarot-牌义页框架](模板-Tarot-牌义页框架.md) 写**单牌普适**（archetype/画面/三视角）；本框架写**该牌在某场景的具体表现**（行为/冲突/人物画像）。两框架物理隔离：场景页不重复 archetype 深度，只落到该场景。
> **竞品依据**：[1F §2.2](../../01-竞品分析/1F-塔罗内容写法研究.md) —— Labyrinthos 牌义页内嵌 Love/Career/Finances 三列矩阵（每场景 ~150 词）；p.taluo 场景化牌阵页（极薄）。我们做**独立深度场景页**（1200-1800 词/篇），吸收 Labyrinthos 矩阵做独立页深度。
> **数据源**：`07-互动工具/_shared/tarot-knowledge.json`（22 牌全字段）+ 本框架 §5 五场景差异化重心表
> **核心策略**：主词 `{card} for {scenario}` / `{card} love meaning` / `{card} career meaning` / `{card} in love`。差异化：**场景落地具体行为/冲突 + 场景化水晶 + 该场景东方视角**。
> **⚠️ 最大风险**：5 场景之间该牌雷同（同牌 5 篇）+ 与牌义页撞内容。**本框架核心 = 五场景差异化重心 + 场景行为非通用句**。

---

## 1. URL + TKD

- **URL**：`/{card}-for-{scenario}/`（根级 post，无 category base）
  - 示例：`/the-fool-for-love/` / `/the-fool-for-career/` / `/the-tower-for-finance/`
  - 不加 `tarot-` 前缀（场景页无水晶产品词污染风险，`for-{scenario}` 已明确意图）；不加 `-crystals`（场景页是知识页，水晶在 M6）
- **Title**：`{Card} for {Scenario}: Tarot Meaning & Best Crystals`（≤60 字符）
- **H1**：`{Card} for {Scenario}: What This Card Means in {Scenario} Readings`
- **Primary KW**：`{card} for {scenario}` / `{card} {scenario} meaning` / `{card} in {scenario}`
- **Secondary KW**：`{card} upright/reversed in {scenario}` / `crystals for {card} {scenario}`
- rank_math 三件套（focus_keyword = `{card} {scenario}`）

---

## 2. 模块结构（10 模块，目标 1200-1800 词）

| # | 模块 | H2 | 词数 | 要点 |
|---|---|---|---|---|
| Intro | Hero + 钩子 | | 150-200 | 该牌+该场景的**具体张力钩子**（非"when X appears in a love reading..."通用句）|
| M1 | TL;DR | `{Card} in {Scenario} at a Glance` | 80-120 | 该牌在该场景一句话判定 + 推荐水晶 + Featured Snippet bait |
| **M2** | **Card's Energy in {Scenario}** ⭐ | `{Card}'s Energy in {Scenario}` | 250-350 | 该场景下该牌的**典型行为/人物画像/核心隐喻**（场景锚定，见 §3）|
| M3 | Upright in {Scenario} | `Upright {Card} in {Scenario}` | 200-280 | 正位该场景表现（落该场景具体行为）|
| M4 | Reversed in {Scenario} | `Reversed {Card} in {Scenario}: The Shadow` | 180-250 | 逆位该场景 shadow（**禁凶兆口径**，用 growth edge）|
| **M5** | **Crystals for {Card} in {Scenario}** ⭐ | `Best Crystals for {Card} in {Scenario}` | 250-350 | **场景化水晶 3-4 颗**（按场景选，区别牌义页 archetype 选法，见 §6）|
| M6 | Eastern Perspective | `{Card} in {Scenario}: Eastern View` | 120-180 | 该场景东方视角（Love=阴阳和合/Career=时势/Finances=财气，见 §7）|
| M7 | How to Work with It | `Working with {Card} in {Scenario}` | 120-180 | 场景化仪式/行动（该场景独有动作）|
| M8 | FAQ | `FAQ: {Card} in {Scenario}` | 200-300 | 该牌该场景高频问 3-4 条 |
| M9 | Shop CTA + Related | | 80-120 | 首饰 Shop CTA + 相关场景页/牌义页互链 |

---

## 3. M2 场景锚定（核心防雷 ⭐⭐⭐）

> **竞品雷同根源**：Labyrinthos 矩阵用通用句"when X appears in a love reading, it means..."跨牌复用。**本模块禁此写法。**

**场景锚定 = 写该牌在该场景的具体行为/人物画像/冲突，非通用句**：

| ❌ 禁（通用，任何牌都能套） | ✅ 要（场景锚定，该牌该场景独有） |
|---|---|
| "When The Fool appears in a love reading, it means new relationship." | "you're about to swipe right on someone completely outside your usual type / a fresh start where you've been burned / the risk of falling for someone with no safety net" |
| "The Fool in career means new job." | "quitting a stable job with no backup / launching a venture with just an idea / the colleague who jumps before looking" |

**硬约束**：
1. M2 必须含该牌+该场景的**具体行为/人物画像/冲突**（从 tarot-knowledge.json archetype + 场景特定行为推导）
2. 禁通用句黑名单：`when {card} appears in a {scenario} reading, it means...` / `in {scenario}, this card suggests...`（泛填）
3. 每篇 M2 必须落到该牌 Rider-Waite 独有画面在**该场景的投射**（The Fool 的悬崖=该场景的风险点）

---

## 4. 五场景差异化重心（防同牌 5 篇雷同 ⭐⭐⭐）

> 同一张牌在 5 场景的**核心隐喻必须不同**，否则 5 篇只换场景名。下表为 22 牌生成时的判定规则（每牌按 archetype 推导 5 场景重心）。

**以 The Fool 为例（5 场景重心必须不同）**：

| 场景 | The Fool 核心隐喻 | 该场景具体风险/行为 |
|---|---|---|
| Love | **冒险坠入**（swipe right on unusual type） | 无安全网的感情、被伤害后重新开始 |
| Career | **裸辞创业**（quit with no backup） | 只有 idea 就 launch、jump before look |
| Finances | **冲动投资**（speculative leap） | 未尽调就 all in、忽视财务预警 |
| Health | **忽视身体信号**（ignore the body's cliff edge） | 把警告当小事、拖延检查 |
| Spiritual | **初心回归**（beginner's mind） | 空杯、重新发问 |

**判定规则（AI 生产每牌 5 场景时）**：
1. 取该牌 archetype 核心特质（The Fool=leap/openness；The Emperor=structure/control）
2. 投射到 5 场景，**强制 5 个不同隐喻**（不得 5 场景都用"new beginning"）
3. 写入 `scenario-knowledge.json > cards[i].scenarios[5]`，每场景核心隐喻词不重叠

**5 场景重心跨牌检查**：22 牌 × 5 场景 = 110 篇，同场景跨牌可共用场景结构，但**该牌独有隐喻必须命中**。

---

## 5. 场景化水晶（M5 ⭐，区别牌义页 archetype 选法）

> 牌义页 M4 按 archetype 选 5 角色水晶；场景页 M5 按**场景需求**选 3-4 颗，选法不同。

**场景→水晶倾向映射（起点，按牌调整）**：

| 场景 | 倾向水晶 | 逻辑 |
|---|---|---|
| Love | Rose Quartz / Moonstone / Rhodonite | 心轮、关系、情感流动 |
| Career | Citrine / Tiger Eye / Pyrite | 显化、意志、事业成功 |
| Finances | Green Aventurine / Pyrite / Jade | 财气、丰盛、稳健 |
| Health | Bloodstone / Clear Quartz / Smoky Quartz | 排毒、清明、grounding |
| Spiritual | Amethyst / Selenite / Labradorite | 灵性、高我、直觉 |

**硬约束**：
1. M5 水晶必须说明**为什么这颗配该牌+该场景**（如"The Fool in Finances + Pyrite： Fool 的冲动冒险 × Pyrite 的招财但需聚焦 = 提醒冒险要有焦点"）
2. 不得 4 颗水晶都用通用句"wear X to enhance your Y energy"（[1F §4.2 黑名单](../../01-竞品分析/1F-塔罗内容写法研究.md)）
3. CTA 三级降级（memory `shop-cta-no-deadlink-rule`）

---

## 6. 东方视角（M6，按场景）

| 场景 | 东方锚点 | 写法 |
|---|---|---|
| Love | 阴阳和合 / 红线 / 桃花 | 该牌在该场景的阴阳投射 |
| Career | 时势 / 顺势而为 / 贵人 | 该牌在事业的东方时势观 |
| Finances | 财气 / 聚散 / 五行财 | 该牌在财的东方聚散观 |
| Health | 气血 / 子午流注 / 中庸 | 该牌在健康的东方气血观 |
| Spiritual | 初发心 / 中道 / 无为 | 该牌在灵性的东方修行观 |

**硬约束**：东方锚点具体（非"Eastern traditions use crystals"万能句，[1F §0 红线 4](../../01-竞品分析/1F-塔罗内容写法研究.md)）。

---

## 7. 通用组件（复用牌义页/配对页框架）

| 组件 | 执行依据 | 场景页专属 |
|---|---|---|
| 合规/去AI化 | 牌义页 §16 | 同 + **M2 禁通用场景句、M5 禁水晶并列句** |
| CTA 预验证 | 牌义页 §3 | 场景化水晶 meaning/category HEAD 检查，三级降级 |
| Schema | 牌义页 §12 | Article + FAQPage + BreadcrumbList + ItemList（水晶指 meaning 页，禁 Product）|
| 内链 | 2A §四塔罗页 | **牌义页**（`/tarot-{card}-crystals/`）+ 同牌其他场景页 + 相关牌同场景页 + Tarot Hub + 水晶 meaning |
| 图片 | 牌义页 §14 | hero（牌视觉+场景元素+水晶，1536×864）|

---

## 8. 质检关卡（场景专属，二审前强制）

- **关卡 1 场景锚定**：M2 含该牌该场景具体行为/冲突，grep 黑名单通用句
- **关卡 2 五场景差异化**：同牌 5 场景 M2 核心隐喻词重叠率 < 30%（防 5 篇雷同）
- **关卡 3 跨牌场景 n-gram**：同场景跨牌连续 8-gram 重复率 < 15%
- **关卡 4 与牌义页不重复**：M2/M3 不复制牌义页 archetype 段落（n-gram 比对）

---

## 9. 数据层 config（`04-内容生产/13.tarot/configs/scenario-knowledge.json`）

```json
{
  "card": "the-fool",
  "scenarios": {
    "love": {"metaphor": "adventurous fall", "behavior": "swipe right on unusual type", "risk": "no safety net", "crystals": ["rose-quartz","moonstone"]},
    "career": {"metaphor": "quit to start up", "behavior": "launch with just an idea", "risk": "jump before look", "crystals": ["citrine","tiger-eye"]},
    "finances": {"metaphor": "impulsive investment", "behavior": "all in without diligence", "risk": "ignore warning", "crystals": ["aventurine","pyrite"]},
    "health": {"metaphor": "ignore body's signals", "behavior": "dismiss warnings", "risk": "delay checkup", "crystals": ["bloodstone","quartz"]},
    "spiritual": {"metaphor": "beginner's mind", "behavior": "empty cup", "risk": "naive bypass", "crystals": ["amethyst","selenite"]}
  }
}
```

## 10. 生产流程

1. 22 牌 × 5 场景 = 110 篇清单（正逆位拆分再 ×2 = 220）
2. **AI 判定每牌 5 场景核心隐喻**（§4，先做，防雷核心）→ scenario-knowledge.json
3. CTA 预验证 → AI 填充 → 四质检 → 二审 → 图片 → upload → 防假完成

## 11. 与其他框架边界

见 [配对框架 §11](模板-Tarot-配对文章框架.md)。场景页讲**一牌在一场景**，配对页讲**两牌关系**，不重叠。
