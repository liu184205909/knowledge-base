# Tarot 配对文章框架 v1（22 Major 两两配对，231 篇）

> **适用**：`/{card-a}-and-{card-b}-combination/` 两牌组合解读页（22 Major 两两 C(22,2)=231 对；可先精选高频对 ~50-100 上线，其余按搜索量补全）
> **与牌义页框架的关系**：[模板-Tarot-牌义页框架](模板-Tarot-牌义页框架.md) 写**单牌**（archetype/画面/三视角/5角色水晶）；本框架写**两牌组合**（互动叙事/关系类型/双水晶协同）。两框架**物理隔离**：配对页 M2 只取与本对相关的牌意精要，不复制牌义页段落。
> **竞品依据**：[1F-塔罗内容写法研究](../../01-竞品分析/1F-塔罗内容写法研究.md) §2.3 —— 竞品**集体空白**（Biddy/Labyrinthos 无系统配对文章，Biddy 付费 ebook 有 combinations 章节但非独立页；The Crystal Council 等合集页偶有"two cards together"一段）。这是**蓝海交叉长尾**，但也意味着**无强对标，自定高标准**（1500-2000 词/篇）。
> **数据源**：`07-互动工具/_shared/tarot-knowledge.json`（22 牌 × archetype/upright/reversed/crystals/eastern/element 全字段）+ 本框架 §5 关系类型规则
> **核心策略**：竞品无配对独立页 = 我们的生态位。主词 `{a} and {b} tarot combination` / `{a} and {b} tarot meaning together` / `{a} and {b} in love`。差异化：**互动叙事（非拼接）+ 双水晶协同 + 东方阴阳/五行配对**。
> **⚠️ 最大风险**：配对文章是 5 类塔罗内容里**最易雷同**的（两段牌意拼接 + 万能"合起来"句）。**本框架的核心存在意义就是防这个**——见 §3 + §5 + §8。

---

## 1. URL + TKD

- **URL**：`/{card-a}-and-{card-b}-combination/`（根级 post，无 category base）
  - **规范化（强制，避免重复建篇）**：按**牌号升序**排列（小号在前），A×B 与 B×A 视为同一篇。例：`/the-fool-and-the-world-combination/`（0×21），**不建** `/the-world-and-the-fool-.../`
  - **不加 `-crystals` 后缀**：配对页是知识解读页（非水晶商业页），水晶在 M6 双水晶段承担；URL 保持纯知识词，对齐竞品"two cards together"搜索意图
- **Title**：`{A} and {B} Tarot Combination: Meaning & Crystals`（≤60 字符）
- **H1**：`{A} and {B} Together: Tarot Combination Meaning`
- **Primary KW**：`{a} and {b} tarot combination` / `{a} and {b} tarot meaning` / `{a} and {b} together tarot`
- **Secondary KW**：`{a} and {b} in love` / `{a} and {b} yes or no` / `{a} and {b} in a reading`
- rank_math 三件套必写（focus_keyword = `{a} and {b} tarot`）

---

## 2. 模块结构（9 模块，目标 1500-2000 词）

| # | 模块 | H2 | 词数 | 要点 |
|---|---|---|---|---|
| Intro | Hero + 钩子 | （hero 图 + 导言段）| 100-150 | 两牌组合的**核心张力一句话钩子**（非"when A and B appear together..."通用句），含主关键词 |
| M1 | TL;DR | `{A} and {B} at a Glance` | 80-120 | **关系类型判定**（互补/强化/冲突/因果/转化，见 §5）+ 双水晶速答 + Featured Snippet bait |
| **M2** | **Two Cards in Brief** | `The Two Cards: Quick Recap` | 200-280 | A 和 B 各 1 段精要（**只取与本对相关的牌意**，非牌义页全量重复，防撞牌义页）|
| **M3** | **The Combination's Story** ⭐核心 | `What {A} and {B} Mean Together` | 350-450 | **两牌互动叙事**（核心模块，禁三段拼接；写两牌的对话/张力/化学反应，见 §3）|
| M4 | In Different Positions | `{A} and {B} in a Spread` | 200-280 | 这对牌在**过去/现在/未来位**的不同读法（见 §4，防"同一对只有一个读法"）|
| M5 | Yes/No Implication（可选）| `Are {A} and {B} a Yes or No?` | 120-180 | 这对牌的是与否倾向（结合 [是与否框架](模板-Tarot-是与否框架.md) 三档判定逻辑）|
| **M6** | **Crystal Synergy** ⭐差异化 | `Crystals for the {A}–{B} Combination` | 200-300 | **双水晶协同**（A 的 best_overall + B 的 best_overall 如何搭配，写协同逻辑非列两颗，见 §6）|
| M7 | Eastern Lens | `{A} and {B} in the Eastern Tradition` | 120-180 | **阴阳/五行配对视角**（该对独有的东方锚点，非万能句）|
| M8 | FAQ + Related | `FAQ & Related Combinations` | 200-300 | 配对高频问 + 相关配对互链 |

**篇幅**：1500-2000 词/篇（[1F §4.3](../../01-竞品分析/1F-塔罗内容写法研究.md) 下限 1200）

---

## 3. M3 互动叙事（核心防雷 ⭐⭐⭐）

> **竞品雷同根源**：`A means X, B means Y, together they mean Z` 三段拼接。这是配对文章被判薄内容/重复内容的头号风险。**本模块严禁此写法。**

**互动叙事 = 写两牌的对话/张力/因果/化学反应，锚定两牌独有象征的碰撞**：

| ❌ 禁（三段拼接，任何对都能套） | ✅ 要（互动叙事，该对独有） |
|---|---|
| "The Fool means new beginnings. The Tower means sudden change. Together they mean a new beginning after sudden change." | "the leap that triggers the collapse — Fool's innocence walks straight into Tower's demolition, and what falls was already unsound. The combination isn't 'change then start over'; it's that the reckless leap **is** the thing that brings the structure down." |

**互动叙事种子（M3 必须落到这类化学反应）**：
- The Fool × The Tower → "the leap that triggers the collapse / new beginning born from sudden upheaval"
- Death × The Sun → "rebirth into joy / what ends makes room for radiance / the phoenix narrative"
- The Lovers × The Devil → "苹果树/蛇 × 锁链 = 自由选择递进为执念束缚"（落两牌 Rider-Waite 独有画面）
- The Hermit × The Star → "withdrawal into the lantern × guidance after storm = 在孤独中找到希望之光"

**硬约束**：
1. M3 必须含**两牌独有象征词**的化学反应（从 tarot-knowledge.json 取两牌的 archetype + Rider-Waite 画面象征），非泛词
2. 禁跨对复用"搭配叙事万能句"（如"X 代表开始，Y 代表结束，合起来是完整的循环"——这种句会污染所有对）
3. 互动叙事的**基调由关系类型决定**（见 §5：互补=协奏/强化=共振/冲突=拉扯/因果=推演/转化=蜕变）

---

## 4. M4 牌位语境（防"同一对只有一个读法"）

同一对牌在牌阵不同位置，读法本质不同。**每对必须给至少 2 种牌位读法**：

| 牌位组合 | 读法 |
|---|---|
| 过去 A + 现在 B | 已发生的因果（如过去 Fool + 现在 Tower = 鲁莽已导致崩塌，现在要收拾） |
| 现在 A + 未来 B | 即将发生的序列（如现在 Fool + 未来 Tower = 当下的冒险即将引发震荡，预警） |
| 现在 A + 现在 B | 同时存在的张力（如同时抽到 Fool + Emperor = 自由与秩序在当下拉扯） |

**硬约束**：M4 不得只写一种读法；牌位读法必须基于该对的关系类型 + 两牌独有时间感（Fool=开端/World=完成/Death=结束/Star=之后...）。

---

## 5. module_weights：关系类型判定（231 对的系统化 ⭐⭐⭐）

> 231 对不可能手写叙事。用 **archetype + element + theme** 推导每对的**关系类型**，关系类型决定 M3 叙事基调 + M1 速答。每对 AI 生产前先判类型，写入 `pair-knowledge.json > relationship_type`。

**关系类型 5 类（每对必属其一）**：

| 类型 | 定义 | 判定信号 | 代表对 | M3 叙事基调 |
|---|---|---|---|---|
| **互补 Complementary** | 两牌能量互补，拼成完整图景 | 互补 element（火/水、风/土）+ 对立互补 archetype | Fool×World（始/终）/ Magician×High Priestess（做/收）/ Emperor×Empress（父/母） | 协奏/完整/阴阳和合 |
| **强化 Amplifying** | 主题相近，能量叠加 | 同 element 或同主题 archetype | Chariot×Strength（意志/内在力）/ Emperor×Hierophant（秩序/传统）/ Sun×Star（光明/希望） | 共振/放大/加倍 |
| **冲突 Tension** | 能量对立，需调和 | 对立 archetype + 用户难两全 | Fool×Emperor（自由/秩序）/ Lovers×Devil（选择/束缚）/ Moon×Sun（潜意识/显意识） | 拉扯/抉择/张力 |
| **因果 Causal** | 一张是另一张的因或果 | 序列关系（时间先后） | Tower×Star（崩塌/重建）/ Death×Sun（结束/新生）/ Hermit×Judgement（孤独/觉醒） | 推演/序列/因果链 |
| **转化 Transformation** | 构成转变弧线 | 阶段跃迁 archetype | Hanged Man×Judgement（臣服/觉醒）/ Devil×Tower（执念/破局）/ Death×Fool（终结/重启） | 蜕变/升华/炼金 |

**判定规则（AI 生产时按此推导每对类型）**：
1. 看 **element**（tarot-knowledge.json）：同元素 → 倾向强化；互补元素（火/水、风/土）→ 倾向互补或冲突
2. 看 **archetype 语义**：同主题→强化；对立主题→冲突；前后序列→因果；阶段跃迁→转化；阴阳配→互补
3. 看 **theme/upright_meaning**：是否有明显因果（A 导致 B）、明显张力（A 与 B 难两全）
4. 写入 `pair-knowledge.json > relationship_type`，并在 `combination_story_seed` 记录该对的互动叙事种子

**关系类型差异化重心（防 231 篇 M3 雷同）**：
- 同类型对之间（如 30 对"互补"）也要落到**该对独有两牌象征**的化学反应，非套同类型叙事模板
- 231 对的 M3 主体象征词组重叠率 < 30%（同 §8 关卡 3）

---

## 6. M6 双水晶协同（差异化 ⭐）

> **竞品空白**：无配对水晶协同内容。我们做 A 的 best_overall + B 的 best_overall 的**搭配逻辑**（非简单列两颗水晶）。

**写法（双水晶协同 = 两颗水晶如何配合承接两牌组合的能量）**：
- 不是"Amethyst for calm, Rose Quartz for love"两句并列
- 要写**协同逻辑**：A 水晶承接 A 牌能量 + B 水晶承接 B 牌能量 + 两颗如何配合处理这对组合的特定张力

**示例**：
- The Fool（Clear Quartz 直觉/清明）+ The Tower（Smoky Quartz grounding/穿越震荡）→ "清明的直觉指引你穿越必然的震荡——Clear Quartz 帮你看清哪个 leap 值得，Smoky Quartz 在崩塌时给你 grounding，两颗协同 = 明智冒险 + 稳稳落地"
- The Lovers（Rhodonite 心轮关系）+ The Devil（Black Tourmaline 破除束缚）→ "在关系中保持心轮开放（Rhodonite）的同时破除不健康依附（Black Tourmaline），两颗协同 = 爱而不缚"

**每颗水晶固定组件**（复用 [牌义页框架](模板-Tarot-牌义页框架.md) §3 三要素 + 四源依据）：
1. 该牌具体牌意/画面象征（为什么这颗配这张牌）
2. 水晶 symbolic support（Intentions/symbolism + 四源依据）
3. 在该组合中的具体协同场景（非"carry it"万能句）

**双水晶 CTA**（三级降级，memory `shop-cta-no-deadlink-rule`）：
- 链两颗水晶的 meaning 页 `/gemstone/{slug}-meaning/`
- Shop CTA：`/product-category/{slug}-crystals/`（HEAD 验证 200）→ 404 降级 `/shop/?s={slug}` → 搜索空降级 `/product-category/healing-jewelry/`

---

## 7. 通用组件（复用牌义页框架，本框架不重复全文）

> 以下组件与 [模板-Tarot-牌义页框架](模板-Tarot-牌义页框架.md) 一致，按牌义页框架对应章节执行，本框架只列**配对专属差异**。

| 组件 | 执行依据 | 配对专属差异 |
|---|---|---|
| 合规/去AI化 | 牌义页 §16 | 同（禁预测/确定论/凶兆；化学式大写；句式轮换）+ **M3 禁三段拼接、M6 禁水晶并列句** |
| CTA 预验证 | 牌义页 §3 M4 CTA 预验证 | 双水晶 meaning/category HEAD 检查，三级降级，`_qc/_cta-validation.json` 全绿才生产 |
| Schema | 牌义页 §12 | Article + FAQPage + BreadcrumbList + **ItemList（双水晶指 meaning 页，禁 Product）** |
| 内链 | 牌义页 §13 + 2A §四塔罗页 | ≥2 相关配对 + **2 张牌义页**（`/tarot-{a}-crystals/` `/tarot-{b}-crystals/`）+ Tarot Hub + 2 颗水晶 meaning |
| 图片 | 牌义页 §14 | hero（两牌视觉符号 + 双水晶，1536×864）+ 双水晶卡（复用 390 图库）|
| Gentle Note | 牌义页 §16 | 全站统一免责组件，放 FAQ 前 |

---

## 8. 质检关卡（配对专属 ⭐，二审前强制）

> AI 填充后、二审前跑。**任一关卡不通过，批量打回重写。**

**关卡 1 — 互动叙事检查（M3）**：
- grep 黑名单套话：`A means.*B means.*together` / `together they mean` / `合起来` / `两者相加`
- 检测 M3 是否含**两牌独有象征词**的化学反应（从 tarot-knowledge.json 取两牌画面象征词命中）
- 输出：`_qc/01-combination-story.json`

**关卡 2 — 关系类型检查（M1+M3）**：
- 每对 `relationship_type` 已判定（5 类之一）且 M3 叙事基调与类型匹配（互补=协奏非拉扯）
- 输出：`_qc/02-relationship-type.json`

**关卡 3 — 跨对 n-gram（重点 ⭐）**：
- 231 对之间 M3 连续 8-gram 重复率 < 15%（**重点查同类型对之间**——如 30 对"互补"之间最易套同模板）
- 231 对 M3 主体象征词组重叠率 < 30%
- 输出：`_qc/03-cross-pair-ngram.json`

**关卡 4 — 与牌义页不重复（M2）**：
- M2 Recap 只取与本对相关的牌意，不复制牌义页 M2/M3 段落（n-gram 比对牌义页）
- 输出：`_qc/04-vs-card-meaning.json`

---

## 9. 数据层 config（`04-内容生产/13.tarot/configs/pair-knowledge.json`）

> 231 对的配置。生产前先 AI 判定每对关系类型 + 生成叙事种子，再批量填充文章。

**每对字段**：
```json
{
  "card_a": {"slug": "the-fool", "number": 0},
  "card_b": {"slug": "the-world", "number": 21},
  "pair_slug": "the-fool-and-the-world",
  "relationship_type": "complementary",
  "combination_story_seed": "the leap that completes the cycle — Fool's beginning meets World's wholeness, ...",
  "position_readings": {
    "past_a_present_b": "...",
    "present_a_future_b": "..."
  },
  "crystal_synergy": {
    "a": {"slug": "quartz", "name": "Clear Quartz"},
    "b": {"slug": "bloodstone", "name": "Bloodstone"},
    "synergy_logic": "Clear Quartz 的清明 + Bloodstone 的完成感 = ..."
  },
  "eastern_lens": "始(复卦)/终(既济) — 阴阳和合的完整循环",
  "related_pairs": ["the-fool-and-the-magician", "the-world-and-the-judgement"]
}
```

**工具单源**：`pair-knowledge.json` 同时供文章生产 + 未来塔罗配对工具（07-互动工具）。

---

## 10. 生产流程

1. **生成 231 对清单**：22 Major 两两组合，按牌号升序去重 → `pair-knowledge.json` 骨架
2. **AI 判定关系类型 + 叙事种子**：按 §5 规则给每对判 `relationship_type` + 填 `combination_story_seed` + `crystal_synergy.synergy_logic`（这是防雷的核心，先做）
3. **CTA 预验证**：双水晶 meaning/category HEAD 检查 → 降级 → `_qc/_cta-validation.json` 全绿
4. **AI 填充 231 篇**：BATCH=2 避智谱限流（memory），每篇 M3 互动叙事 + M4 牌位 + M6 协同**按该对独有数据差异化**
5. **四质检关卡**（§8，重点关卡 3 跨对 n-gram）
6. **二审**（关系类型准确性 / 互动叙事 vs 拼接 / 双水晶协同逻辑 / 跨对重复度 / 合规）
7. **图片**（hero 两牌+双水晶，gpt-image-2，loadEnv 强制覆盖 + NODE_PATH sharp）
8. **upload draft**（URL `/tarot-{a}-and-{b}-combination/` 实为 `/{a}-and-{b}-combination/`，category tarot/combinations 建，Shop 验证，rank_math + Schema Article/FAQPage/BreadcrumbList/ItemList 禁 Product）
9. **防假完成**：WP REST GET 验证每篇 featured_media≠0 + content img 数 + schema 写入 + slug 唯一，附证据（memory `completion-requires-online-verification`）

---

## 11. 与其他 4 类塔罗框架的边界（防跨类型重复）

| 框架 | 内容边界 | 与配对页的区别 |
|---|---|---|
| [牌义页](模板-Tarot-牌义页框架.md) | 单牌 archetype/画面/三视角/5角色水晶 | 配对页 M2 只 Recap，不重复牌义页深度 |
| **配对页（本框架）** | **两牌互动叙事/关系类型/双水晶协同** | — |
| [场景页](模板-Tarot-场景文章框架.md) | 单牌×单场景的行为/冲突/场景化水晶 | 配对页讲两牌关系，场景页讲一牌在一场景的表现 |
| [是与否页](模板-Tarot-是与否框架.md) | 单牌×问题的三档判定/条件 | 配对页 M5 是与否仅作可选补充，深度归是与否页 |
| [每日运势](模板-Tarot-每日运势框架.md) | 日期×牌×水晶/星象 | 完全不同维度（日期驱动 vs 组合驱动）|

**核心原则**（[1F §0 红线 1](../../01-竞品分析/1F-塔罗内容写法研究.md)）：每篇锚定**独特组合数据**（配对页 = 牌×牌组合），正文落到该组合独有象征，禁止通用句跨篇复用。
