# Tarot 配对文章框架 v2（22 Major 两两配对，231 篇）

> **版本日志**：
> - v1：初版（§3 互动叙事防三段拼接 / §5 关系类型 5 类 / §6 双水晶协同 / §8 质检 4 关卡+关卡 0 合规/5 语义去重 + §7 引用 1F §0A）
> - **2026-07-01 v2 借鉴场景框架成熟改进**：Intent Lens（§0，前置）/ 张力分级 3 档 benchmark/standard/lite（§5.1，231 对分级）/ 结构变体清单（§3.1，跨对差异≥30%）/ M2-M3 分工硬化（§3.2，防 M2 变两段牌意拼接）/ 跨对去重强化（§8 关卡 3+5 细化同关系类型子群）/ 合规专属（§7.1，Health-Finances 组合边界）/ 生成前 Brief（§10 步骤 2.5）

> **适用**：`/{card-a}-and-{card-b}-combination/` 两牌组合解读页（22 Major 两两 C(22,2)=231 对；可先精选高频对 ~50-100 上线，其余按搜索量补全）
> **与牌义页框架的关系**：[模板-Tarot-牌义页框架](模板-Tarot-牌义页框架.md) 写**单牌**（archetype/画面/三视角/5角色水晶）；本框架写**两牌组合**（互动叙事/关系类型/双水晶协同）。两框架**物理隔离**：配对页 M2 只取与本对相关的牌意精要，不复制牌义页段落。
> **竞品依据**：[1F-塔罗内容写法研究](../../01-竞品分析/1F-塔罗内容写法研究.md) §2.3 —— 竞品**集体空白**（Biddy/Labyrinthos 无系统配对文章，Biddy 付费 ebook 有 combinations 章节但非独立页；The Crystal Council 等合集页偶有"two cards together"一段）。这是**蓝海交叉长尾**，但也意味着**无强对标，自定高标准**（1500-2000 词/篇）。
> **数据源**：`07-互动工具/_shared/tarot-knowledge.json`（22 牌 × archetype/upright/reversed/crystals/eastern/element 全字段）+ 本框架 §5 关系类型规则
> **核心策略**：竞品无配对独立页 = 我们的生态位。主词 `{a} and {b} tarot combination` / `{a} and {b} tarot meaning together` / `{a} and {b} in love`。差异化：**互动叙事（非拼接）+ 双水晶协同 + 东方阴阳/五行配对**。
> **⚠️ 最大风险**：配对文章是 5 类塔罗内容里**最易雷同**的（两段牌意拼接 + 万能"合起来"句）。**本框架的核心存在意义就是防这个**——见 §3 + §5 + §8。

---

## 0. Search Intent Lens（前置，决定应答重点 ⭐）

> 对标场景框架 §0。配对页用户搜索意图高度集中，**先锁定意图再决定怎么应答**，避免按通用框架"先牌意后组合"硬写。

**用户真实意图（按搜索量从高到低）**：

| 搜索意图 | 典型查询 | 应答重心 |
|---|---|---|
| "这两张牌一起什么意思？" | `{a} and {b} tarot combination` / `{a} and {b} tarot meaning together` | **关系类型判定**（互补/强化/冲突/因果/转化）+ 两牌互动叙事（非拼接） |
| "这段关系走势？" | `{a} and {b} in love` / `{a} and {b} relationship` | 关系类型在**亲密关系**语境下的具体表现（M3 互动叙事落到关系场景）+ 双水晶协同（关系向） |
| "这个抉择结果？" | `{a} and {b} in a reading` / `{a} and {b} decision` | 牌位语境（M4 过去/现在/未来位读法）+ Yes/No 倾向（M5） |
| "这是 yes 还是 no？" | `{a} and {b} yes or no` | 直接给 Yes/No/Conditional 三档判定（M5，配对页非主战场，简答+内链是与否页） |

**应答重点（Intent Lens 决定 M1-M8 的权重分配）**：

1. **关系类型判定**（M1 TL;DR 一句话速答 + M3 互动叙事基调）——这是配对页区别于牌义页的根本，**必须前置**
2. **两牌互动叙事**（M3，非 A+B 拼接，见 §3）——用户来配对页就是看"碰在一起"的化学反应
3. **双水晶协同**（M6，承接两牌组合的特定张力）——竞品空白，差异化核心
4. **牌位语境**（M4，过去/现在/未来位读法）——意图"走势/抉择"时权重升高

**Intent Lens 硬约束**：
- 每对写正文前先在生成前 Brief（§10 步骤 2.5）锁定**主搜索意图**（从上表 4 类选 1-2 个），主意图决定 M3/M4/M5 的篇幅倾斜
- **不得四类意图平均用力**——lite 档（§5.1）只答 1 个主意图 + 内链导向其他

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

## 2. 模块结构（9 模块，张力分级见 §5.1）

> **篇幅按张力分级**（对标场景 §3，详见 §5.1）：标杆 benchmark 2200-2800 词 / 标准 standard 1500-2000 词 / 精简 lite 900-1200 词。下表词数为**标准档基准**，标杆档各模块按比例上调、lite 档精简（M2 更短 + M5 可并入 M1 + M7/M8 内链化）。

| # | 模块 | H2 | 词数（标准档） | 要点 |
|---|---|---|---|---|
| Intro | Hero + 钩子 | （hero 图 + 导言段）| 100-150 | 两牌组合的**核心张力一句话钩子**（非"when A and B appear together..."通用句），含主关键词 |
| M1 | TL;DR | `{A} and {B} at a Glance` | 80-120 | **关系类型判定**（互补/强化/冲突/因果/转化，见 §5）+ 双水晶速答 + Featured Snippet bait |
| **M2** | **Two Cards in Brief** | `The Two Cards: Quick Recap` | 200-280 | A 和 B 各 1 段精要（**只取与本对相关的牌意，每牌≤100 词**，非牌义页全量复读，见 §3.2 M2-M3 分工硬化）|
| **M3** | **The Combination's Story** ⭐核心 | `What {A} and {B} Mean Together` | 350-450 | **两牌互动叙事**（核心模块，禁三段拼接；写两牌的对话/张力/化学反应，见 §3）|
| M4 | In Different Positions | `{A} and {B} in a Spread` | 200-280 | 这对牌在**过去/现在/未来位**的不同读法（见 §4，防"同一对只有一个读法"）|
| M5 | Yes/No Implication（可选，lite 档并入 M1）| `Are {A} and {B} a Yes or No?` | 120-180 | 这对牌的是与否倾向（结合 [是与否框架](模板-Tarot-是与否框架.md) 三档判定逻辑）|
| **M6** | **Crystal Synergy** ⭐差异化 | `Crystals for the {A}–{B} Combination` | 200-300 | **双水晶协同**（A 的 best_overall + B 的 best_overall 如何搭配，写协同逻辑非列两颗，见 §6）|
| M7 | Eastern Lens | `{A} and {B} in the Eastern Tradition` | 120-180 | **阴阳/五行配对视角**（该对独有的东方锚点，非万能句）|
| M8 | FAQ + Related | `FAQ & Related Combinations` | 200-300 | 配对高频问 + 相关配对互链 |

**篇幅**：按张力分级（§5.1），下限不低于 lite 档 900 词（[1F §4.3](../../01-竞品分析/1F-塔罗内容写法研究.md) 下限 1200 仅适用于 standard/benchmark）

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

### 3.1 结构变体清单（对标场景 §15 关卡 6 ⭐，防 231 对结构雷同）

> 对标场景框架 §15 关卡 6。231 对若都按 M1→M2→M3→...→M8 默认顺序写，跨对结构必然雷同。**每对生成前从下列变体勾选 ≥1 个**（benchmark 档强制 ≥2），写入 pair-knowledge.json > `structure_variants`，生产时按勾选变体调整模块顺序/插入额外段。

**可勾选结构变体（每对 benchmark≥2 / standard≥1 / lite 可不勾但必须打乱默认起承转合）**：

- [ ] **V1 关系类型对话段**（M3 写成两牌"对话"叙事，如 Fool 问 World "我该跳吗"，World 答"你已是终点"——非叙述者口吻）
- [ ] **V2 双牌 Rider-Waite 画面碰撞段**（两牌独有象征的化学反应，每对从**不同画面元素切入**——借鉴场景 v2.2 建议 7。如 Lovers×Devil 从"苹果树/蛇 × 锁链"切入，Tower×Star 从"崩塌高塔 × 星下跪女"切入，禁都用"光明/黑暗"泛词）
- [ ] **V3 牌位语境对比表前置**（M4 牌位读法提前到 M2 之后，倒置"先组合后位置"默认顺序，适合因果类对）
- [ ] **V4 Myth vs Reality 段**（纠正常见误读，如 "Myth: Fool+Tower means disaster. Reality: it names the leap that was always going to cost you the old structure."——加独立段，适合冲突/转化类对）
- [ ] **V5 双水晶协同叙事段并入 M3**（M6 水晶协同融进 M3 互动叙事，不单独成段，适合水晶与牌组合强绑定的对）
- [ ] **V6 东方阴阳/五行配对锚点反向破题**（M7 东方视角提前到 Intro 或 M1 作为破题钩子，如用"复卦/既济"破 Fool×World，适合互补/转化类对）
- [ ] **V7 倒叙/序列叙事**（因果类对用倒叙——先讲果（Star 的重建）再追因（Tower 的崩塌），适合因果类对）

**硬约束（防 231 对变体组合雷同）**：
1. 231 对结构变体组合跨对差异 **≥ 30%**（同关系类型子群内尤其严，见 §8 关卡 5）
2. **变体不得空勾**——勾选的变体必须在正文有对应段落/结构调整（质检 §8 关卡 5 校验）
3. 变体选择写入 pair-knowledge.json > `structure_variants`（数组，存勾选的 V1-V7 编号）

### 3.2 M2-M3 分工硬化（防 M2 变两段牌意拼接 ⭐）

> 对标场景框架 §3。v1 仅说"M2 只取相关牌意"，但 AI 生产时极易把 M2 写成两段完整牌意（每段 200 词复读牌义页），M3 再写两段牌意的"合起来"——本质还是拼接。**本节硬化 M2 与 M3 的边界。**

**M2 "Two Cards in Brief" 硬约束**：
1. M2 **只取与本对相关的牌意精要**（非牌义页全量复读），**每牌 1 段 ≤ 100 词**
2. "相关" = 与该对关系类型直接挂钩的牌意维度。例：
   - Fool×Tower（因果：鲁莽引发崩塌）→ M2 Fool 只取"鲁莽的 leap"维度，**不取**"innocence/信仰之跃/新旅程"等其他维度
   - Lovers×Devil（冲突：选择 vs 束缚）→ M2 Lovers 只取"选择/价值观对齐"维度，**不取**"浪漫/和谐"维度
3. M2 末尾**禁万能过渡句**（"Now let's see what they mean together" / "合起来看" / "结合起来"）——这种句是三段拼接的尾巴，质检 §8 关卡 1 grep

**M3 "The Combination's Story" 硬约束**：
1. M3 互动叙事**独立成段**（关系类型决定基调，见 §5），**禁 M2 拼接 + M3 万能"合起来"句**
2. M3 **不复述 M2 已写的牌意**——M2 给两牌各自相关牌意，M3 写两牌"碰在一起"的化学反应（**非 A 牌意 + B 牌意 + 合起来三段式**）
3. M3 必须落到 pair-knowledge.json > `combination_story_seed` 的种子叙事（§3 互动叙事种子）

**M2→M3 衔接规则（核心）**：
- M2 = 两牌**各自**与本对相关的牌意（横向并列，A 段 + B 段）
- M3 = 两牌**碰在一起**的化学反应（纵向交融，**一段整合叙事**）
- 衔接禁用三段式（A 牌意段 + B 牌意段 + "合起来"段），三段式直接判定为拼接，质检 §8 关卡 1 打回

**正反例**：
- ❌ 拼接式：M2 写 Fool 全部牌意 + Tower 全部牌意；M3 写"together they mean new beginning after sudden change"
- ✅ 分工式：M2 Fool 只写"the reckless leap"（≤100 词）+ Tower 只写"what falls was already unsound"（≤100 词）；M3 独立写"the leap **is** the thing that brings the structure down"的化学反应（不复述 M2）

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

### 5.1 张力分级（对标场景 §3，231 对分 benchmark/standard/lite 3 档 ⭐⭐⭐）

> 对标场景框架 §3。231 对张力天然不均——Fool×World（始终）张力远高于 Fool×Magician（都是开端，弱关联）。**统一写 2000 词会让标杆对力不足、弱关联对注水拼接**。按关系类型 + 牌组合强弱分 3 档，写入 pair-knowledge.json > `tension` + `depth_tier`。

**张力 3 档（词数 + 模块配比）**：

| 档位 | 词数 | 模块配比 | 适用对 | 写法重心 |
|---|---|---|---|---|
| **标杆 benchmark** | 2200-2800 | M3/M4/M6 深度全开 + 结构变体勾选 ≥2 + 牌位对比表 | 强关系对（天然高张力） | 完整互动叙事 + 双水晶协同叙事 + 牌位三态 + Myth vs Reality |
| **标准 standard** | 1500-2000 | §2 模块表基准（M3 350-450 词等）| 中等关系对 | 标准互动叙事 + 双水晶协同 + 2 种牌位读法 |
| **精简 lite** | 900-1200 | M2 精简（每牌 ≤ 80 词）/ M5 并入 M1 / M7-M8 内链化 | 弱关联对 | **诚实承认"这对牌同现无强共振"** + 内链导向同牌标杆对 |

**判定规则（AI 生产时按此推导每对档位）**：

1. **标杆 benchmark 判定**（满足任一）：
   - 关系类型为**因果/转化**且两牌构成明显叙事弧（Tower×Star 崩塌重建 / Death×Sun 结束新生 / Lovers×Devil 选择束缚 / Fool×World 始终）
   - 两牌元素互补（火/水、风/土）且 archetype 张力高（Emperor×Fool 秩序自由）
   - 每张 Major 牌**至少配 1-2 个标杆对**（保证 22 牌都有标杆级内容承接）
2. **精简 lite 判定**（满足任一）：
   - 两牌 element 相同且 archetype 高度重叠（如 Sun×Star 都是"光明/希望"，弱差异→诚实承认重叠）
   - 两牌无直接因果/张力关系，同现更多是各自独立信息（如 Hermit×High Priestess 都是"内省"，组合增量低）
   - lite 档**硬性要求**：正文诚实承认"这对牌同现没有强共振，更多是各自独立信息"+ 内链导向该牌参与的同元素标杆对
3. **标准 standard**：上述之外的多数对（中等关系强度）

**写入 pair-knowledge.json**：
- `tension`: `benchmark` / `standard` / `lite`（张力强度，AI 判定）
- `depth_tier`: `deep` / `standard` / `lite`（深度档位，决定词数 + 模块配比，与 tension 1:1 对应）
- **若 config 已有此字段则核对一致性；若无则标注"待补"**（生产前先跑判定脚本回填）

**配额参考（231 对分布，AI 判定时维持比例）**：
- benchmark 约 50-70 对（每牌 2-3 个标杆对，强关系对优先）
- standard 约 110-140 对（多数中等关系对）
- lite 约 30-50 对（弱关联对，诚实承认 + 内链导向）

**硬约束**：
1. lite 档**禁注水**——不得为凑 1500 词把弱关联写成强叙事（拼接的温床）
2. benchmark 档**禁缩水**——必须有牌位对比表 + 双水晶协同叙事 + Myth vs Reality 之一（结构变体 §3.1 勾选 ≥2）
3. 跨档差异化纳入 §8 关卡 5 结构指纹校验（benchmark/standard/lite 模块配比指纹必须可区分）

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
| 合规/去AI化 | 牌义页 §16 + [1F §0A](../../01-竞品分析/1F-塔罗内容写法研究.md) | 同（禁预测/确定论/凶兆；化学式大写；句式轮换）+ **M3 禁三段拼接、M6 禁水晶并列句**；**配对涉及健康/财运组合时守 [1F §0A.1](../../01-竞品分析/1F-塔罗内容写法研究.md) Health/Finances 黑名单**（如 Death×The Sun 谈疗愈转化禁 cure、The Emperor×The Fool 谈投资冒险禁 invest now/guaranteed gain）；**禁用表达库 6 类见 [1F §0A.2](../../01-竞品分析/1F-塔罗内容写法研究.md)**（配对页高发区：M3 泛泛开头/万能搭配句、M6 水晶万能句）|
| CTA 预验证 | 牌义页 §3 M4 CTA 预验证 | 双水晶 meaning/category HEAD 检查，三级降级，`_qc/_cta-validation.json` 全绿才生产 |
| Schema | 牌义页 §12 | Article + FAQPage + BreadcrumbList + **ItemList（双水晶指 meaning 页，禁 Product）** |
| 内链 | 牌义页 §13 + 2A §四塔罗页 | ≥2 相关配对 + **2 张牌义页**（`/tarot-{a}-crystals/` `/tarot-{b}-crystals/`）+ Tarot Hub + 2 颗水晶 meaning |
| 图片 | 牌义页 §14 | hero（两牌视觉符号 + 双水晶，1536×864）+ 双水晶卡（复用 390 图库）|
| Gentle Note | 牌义页 §16 | 全站统一免责组件，放 FAQ 前 |

### 7.1 合规专属（配对涉及 Health/Finances 组合时守边界 ⭐）

> 配对页特殊风险：两牌组合可触发 Health（疗愈/健康）或 Finances（财运/投资）语境，**组合后承诺风险高于单牌**（单牌 Death 谈"结束"，Death×Sun 谈"疗愈转化"易滑向 cure）。本节列配对专属 Health/Finances 组合红线（基于 [1F §0A.1](../../01-竞品分析/1F-塔罗内容写法研究.md) 黑名单 + 场景 v2.2 建议 10）。

**Health 组合（谈疗愈/康复/转化时）**：

| 典型对 | 滑向（❌禁） | 守边界（✅要） |
|---|---|---|
| Death × The Sun（疗愈转化/重生）| cure / heals / healing / recovery | **reflection / growth / renewal / transformation** |
| Death × The Star（结束后的希望）| heals / cure / restore health | **renewal / hope after loss** |
| The Tower × The Star（崩塌重建）| recover from illness | **rebuild after upheaval** |
| The Emperor × The Hierophant（秩序/传统，谈健康习惯）| treatment / remedy | **discipline / structure** |

**Finances 组合（谈投资/财运/抉择时）**：

| 典型对 | 滑向（❌禁） | 守边界（✅要） |
|---|---|---|
| The Emperor × The Fool（投资冒险/秩序 vs 风险）| invest now / guaranteed gain / this stock | **risk awareness / weigh the leap / informed choice** |
| The Fool × The Magician（新投资/显化）| money manifestation / wealth guarantee | **new venture awareness / skill meets opportunity** |
| Wheel of Fortune × 任何牌（财运变化）| predicts wealth / certain profit | **review / reassess / cycles shift** |
| The Devil × 任何牌（执念投资）| get-rich / sure win | **examine attachments / where you're hooked** |

**The Tower 组合（谈财务时的统一边界）**：
- The Tower × 任何牌 谈财务 → **禁 predicts loss / financial ruin / bankruptcy**
- 守边界用：**review your finances / what's structurally unsound / reassess what's exposed**

**配对页 Health/Finances 案例非强制（对标场景 v2.2 建议 10）**：
- benchmark 档 Health/Finances 组合**建议**给 1 个守边界的案例（如 Death×Sun 谈疗愈转化给 "renewal over cure" 的正面措辞示范），**非强制**
- standard/lite 档不强制案例，但 §8 关卡 0 grep 必须全绿

**硬约束**：
1. 关卡 0（§8）grep 覆盖上表所有 ❌ 禁词（cure/heals/invest now/guaranteed gain/predicts loss/this stock 等）
2. 配对 config 层验收（§9.1）：Health/Finances 相关对的 `combination_story_seed` / `position_readings` 不得触本表红线
3. **双水晶协同（M6）禁医疗/财务承诺**——水晶写"支持性象征"（symbolic support），禁"cures anxiety / attracts wealth / guarantees money"

---

## 8. 质检关卡（配对专属 ⭐，二审前强制）

> AI 填充后、二审前跑。**任一关卡不通过，批量打回重写。**

**关卡 0 — 合规前置门（Health/Finances + 禁用表达库，全塔罗统一 ⭐）**：
- grep [1F §0A.1 Health/Finances 黑名单](../../01-竞品分析/1F-塔罗内容写法研究.md)（cure/diagnose/heals/invest now/guaranteed gain/this stock 等）+ [1F §0A.2 禁用表达库](../../01-竞品分析/1F-塔罗内容写法研究.md) 6 类
- 配对页重点扫：M3（万能搭配句 + 涉健康/财运组合的违规承诺）、M6（水晶万能句/医疗承诺/财务承诺）
- 命中即打回不进生产
- 输出：`_qc/00-compliance.json`

**关卡 1 — 互动叙事检查（M3）**：
- grep 黑名单套话：`A means.*B means.*together` / `together they mean` / `合起来` / `两者相加`
- 检测 M3 是否含**两牌独有象征词**的化学反应（从 tarot-knowledge.json 取两牌画面象征词命中）
- 输出：`_qc/01-combination-story.json`

**关卡 2 — 关系类型检查（M1+M3）**：
- 每对 `relationship_type` 已判定（5 类之一）且 M3 叙事基调与类型匹配（互补=协奏非拉扯）
- 输出：`_qc/02-relationship-type.json`

**关卡 3 — 跨对 n-gram（重点 ⭐，v2 细化同关系类型子群）**：
- 231 对之间 M3 连续 8-gram 重复率 < 15%
- **同关系类型子群跨对 n-gram < 15%（v2 新增重点）**——按 `relationship_type` 分组，每组子群（如 30 对"互补"、24 对"因果"、N 对"强化/冲突/转化"）**组内** 8-gram 重复率 < 15%。子群内最易套同模板（如 30 对互补都写"始/终完整循环"），整体平均易掩盖子群雷同
- 231 对 M3 主体象征词组重叠率 < 30%
- 输出：`_qc/03-cross-pair-ngram.json`（含子群分组报告）

**关卡 4 — 与牌义页不重复（M2）**：
- M2 Recap 只取与本对相关的牌意，不复制牌义页 M2/M3 段落（n-gram 比对牌义页）
- 输出：`_qc/04-vs-card-meaning.json`

**关卡 5 — 语义去重 + 结构指纹（全塔罗普适升级 ⭐⭐⭐，配对页最易雷同，本框架核心存在意义，见 [1F §0A.3](../../01-竞品分析/1F-塔罗内容写法研究.md)）**：
- **语义去重**：231 对 M3 段（核心互动叙事）跨对 embedding 余弦相似度 **> 0.85 触发复审**。**重点查同类型对之间**（30 对"互补"之间、强化/冲突/因果/转化各自子群内）——同类型对字面易绕过 n-gram，但语义最易"换牌不换骨"（如多对互补都写"始/终完整循环"）
- **同关系类型子群语义去重（v2 细化）**：按 `relationship_type` 分组，组内 M3 embedding 相似度 **> 0.80 即触发复审**（子群内阈值严于全局 0.85，因同类型更易语义雷同）
- **结构指纹**：231 对模块开场句式 + 论证路径指纹（M3 起承转合）重复率 **< 40%**；**强制 ≥ 30% 配对页打乱默认起承转合**（如 M4 牌位语境前置、M6 双水晶并入 M3、加" Myth vs Reality"段、因果类对用倒叙等变体，见 §3.1 结构变体清单）
- **张力档位指纹校验（v2 新增）**：benchmark/standard/lite 三档模块配比指纹必须可区分（benchmark M3 词数占比 > standard > lite），防档位注水/缩水
- **人工连读兜底**：抽**同子类型** 5-10 对连读（如 5 对"因果"连读），判断"换牌名能否互换"——这是脚本最易漏过的结构性雷同
- 输出：`_qc/05-semantic-structure.json`

**关卡 6 — M3 互动叙事跨对去重（v2 新增 ⭐，落实 §3.2 M2-M3 分工硬化 + §5 关系类型差异化）**：
- 231 对 M3 互动叙事的 `combination_story_seed` 主体象征词组跨对重叠 **< 30%**（pair-knowledge.json 已有种子，生产时落到**该对独有两牌象征**）
- **M3 独立叙事校验**：M3 段不得复述 M2 已写的牌意（M2-M3 分工，§3.2）——M2 给两牌各自相关牌意，M3 必须是交融化学反应，禁三段式（A 牌意段 + B 牌意段 + 合起来段）。grep 三段式句式 + M2 末尾万能过渡句（"Now let's see" / "合起来" / "结合起来"）
- **结构变体落实校验**：pair-knowledge.json > `structure_variants` 勾选的变体必须在正文有对应段落/结构调整（变体不得空勾，§3.1）
- 输出：`_qc/06-m3-story-dedup.json`

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
  "tension": "benchmark",
  "depth_tier": "deep",
  "structure_variants": ["V2", "V6"],
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

> **tension / depth_tier / structure_variants** 为 v2 新增字段（§5.1 张力分级 + §3.1 结构变体）。若现有 pair-knowledge.json 未含，生产前先跑判定脚本回填，或在该对标注 `"tension": "待补"` 待人工/脚本补全后再生产。

**工具单源**：`pair-knowledge.json` 同时供文章生产 + 未来塔罗配对工具（07-互动工具）。

### 9.1 pair-knowledge.json 数据层质量阀门（全塔罗普适见 [1F §0A.4](../../01-竞品分析/1F-塔罗内容写法研究.md)，本节配对专属 ⭐）

> 231 对 config 是配对文章源头，错则 231 篇全错。普适判定流程/抽审比例见 1F §0A.4，本节列**配对专属验收清单**。

**pair-knowledge.json 验收清单（任一不满足打回）**：
- [ ] 每对 `relationship_type` 判定有 archetype/element/theme 依据（5 类之一，非随机标）
- [ ] 每对 `tension` / `depth_tier` 已判定（benchmark/standard/lite 3 档之一，§5.1）——若 config 未有此字段，**标注"待补"**并跑判定脚本回填
- [ ] 每对 `structure_variants` 已勾选（benchmark≥2 / standard≥1，§3.1 V1-V7）——若未勾选，生产前补勾
- [ ] 231 对 `combination_story_seed` 主体象征词组重叠 < 30%（同类型对之间也必须落到该对独有两牌象征）
- [ ] `combination_story_seed` 是**互动叙事非拼接**（grep "A means X, B means Y, together" 黑名单句式，命中打回）
- [ ] **Health/Finances 相关对**（如 Death×Sun 谈疗愈、Emperor×Fool 谈投资、Devil×Tower 谈执念破局）的 story_seed/position_readings 不触 [1F §0A.1](../../01-竞品分析/1F-塔罗内容写法研究.md) 合规红线 + **§7.1 配对专属 Health/Finances 红线**（config 层验收，不带到正文）
- [ ] `crystal_synergy.synergy_logic` 写**双水晶协同逻辑**（非两颗并列），有该对特定张力承接
- [ ] `position_readings` 至少 2 种牌位读法（过去/现在/未来位差异化）
- [ ] `related_pairs` 按语义关联（同关系类型或共享牌），非随机互链

**抽审比例**：高权重对（高频/标杆关系类型）全审；一般对抽 30%；低频对抽 20%（对齐 [1F §0A.4 ③](../../01-竞品分析/1F-塔罗内容写法研究.md)）。

---

## 10. 生产流程

1. **生成 231 对清单**：22 Major 两两组合，按牌号升序去重 → `pair-knowledge.json` 骨架
2. **AI 判定关系类型 + 叙事种子 + 张力分级 + 结构变体**：按 §5 规则判 `relationship_type` + §5.1 判 `tension`/`depth_tier` + §3.1 勾选 `structure_variants` + 填 `combination_story_seed` + `crystal_synergy.synergy_logic`（这是防雷的核心，先做）
2.5. **生成前 Brief（v2 新增 ⭐，对标场景 §2）**：每对写正文前先出 Brief（一页，存 `_briefs/{pair_slug}.md`），含：
   - 主 KW + Secondary KW（§1）
   - **搜索意图**（§0 Intent Lens 4 类选 1-2 个主意图，决定 M3/M4/M5 篇幅倾斜）
   - **关系类型**（§5，从 config 读 `relationship_type`）
   - **互动叙事种子**（从 pair-knowledge.json `combination_story_seed` 取，落到该对独有两牌象征）
   - **禁重复牌意**（M2 不复读牌义页，§3.2 列出 M2 只取的"与本对相关"维度）
   - **双水晶协同逻辑**（pair-knowledge.json `crystal_synergy.synergy_logic`）
   - **东方配对锚点**（`eastern_lens`）
   - **结构变体**（§3.1 勾选的 V1-V7，决定模块顺序/额外段）
   - **张力档位**（§5.1 benchmark/standard/lite，决定词数 + 模块配比）
   - **内链清单**（2 牌义页 + 2 相关配对 + 2 水晶 meaning + Tarot Hub）
   - **FAQ 骨架**（3-5 问）
   - **Brief 不通过不进生产**（防正文无锚生成）
3. **CTA 预验证**：双水晶 meaning/category HEAD 检查 → 降级 → `_qc/_cta-validation.json` 全绿
4. **AI 填充 231 篇**：BATCH=2 避智谱限流（memory），**每篇严格按步骤 2.5 的 Brief 生成**——M3 互动叙事 + M4 牌位 + M6 协同**按该对独有数据差异化**，M2-M3 按 §3.2 分工硬化，结构按 §3.1 变体调整，篇幅按 §5.1 档位
5. **六质检关卡**（§8，重点关卡 3 跨对 n-gram + 关卡 5 语义去重 + 关卡 6 M3 互动叙事跨对去重）
6. **二审**（关系类型准确性 / 互动叙事 vs 拼接 / M2-M3 分工 / 双水晶协同逻辑 / 结构变体落实 / 跨对重复度 / 张力档位配比 / 合规）
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
