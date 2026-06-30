# Tarot 是与否框架 v1（单牌 × 问题类型，~100 篇）

> **适用**：`is-{card}-yes-or-no-{question}/` 单牌在某问题下的是与否判定页（22 Major × 5 问题类型 Love/Career/Decision/Timing/Move-or-Stay = 110 篇基础，精选强 yes/强 no/conditional 牌优先 ~100 篇）
> **与牌义页框架的关系**：[模板-Tarot-牌义页框架](模板-Tarot-牌义页框架.md) 写牌的普适意义；本框架写**该牌在某问题类型下的是与否判定 + 条件**。两框架物理隔离：是与否页不讲 archetype 深度，只讲判定逻辑。
> **竞品依据**：[1F §2.4](../../01-竞品分析/1F-塔罗内容写法研究.md) —— **Selfgazer 是方法论王**（4000 词总览页：问题措辞原则/读牌法/正逆位判定/强度三档/78 牌速答清单/5 错误+禁用场景/自由意志免责）。我们做**独立"该牌该问题=是/否/视情况"页**（1000-1500 词），吸收 Selfgazer 方法论深度。
> **数据源**：`07-互动工具/_shared/tarot-knowledge.json`（22 牌 upright/reversed）+ 本框架 §5 三档判定规则
> **核心策略**：主词 `is {card} a yes or no card` / `is {card} yes or no for {question}` / `{card} yes or no love`。差异化：**三档判定 + conditional 转化条件 + 水晶辅助决策 + 易经阴阳对照**。
> **⚠️ 最大风险**：照抄 Selfgaze 78 牌通用 yes/no 速答清单（重复内容）+ 二元答案太薄。**本框架核心 = 三档判定 + 该牌该问题独有论证 + 自由意志免责**。

---

## 1. URL + TKD

- **URL**：`is-{card}-yes-or-no-{question}/`（根级 post）
  - 示例：`/is-the-fool-yes-or-no-for-new-job/` / `/is-the-tower-yes-or-no-for-moving/` / `/is-the-fool-yes-or-no-he-loves-me/`
  - 不加 `tarot-` 前缀（`is-...-yes-or-no` 已明确意图，无产品词污染）
- **Title**：`Is {Card} a Yes or No Card? (For {Question})`（≤60 字符）
- **H1**：`Is {Card} a Yes or No Card for {Question}?`
- **Primary KW**：`is {card} a yes or no card` / `{card} yes or no` / `{card} yes or no {question}`
- rank_math 三件套（focus_keyword = `{card} yes or no`）

---

## 2. 模块结构（8 模块，目标 1000-1500 词）

| # | 模块 | H2 | 词数 | 要点 |
|---|---|---|---|---|
| Intro | Hero + 钩子 | | 120-180 | 该牌 yes/no 总体倾向 + 该问题特殊性 |
| M1 | TL;DR | `Quick Answer` | 80-120 | **三档判定**（Strong Yes / Conditional / Strong No）+ 条件 + Featured Snippet bait |
| **M2** | **Overall Tendency** ⭐ | `Is {Card} Generally a Yes or No Card?` | 250-350 | 该牌总体 yes/no 倾向 + **为什么**（非照抄清单，见 §3）|
| **M3** | **For {Question} Specifically** ⭐ | `{Card} for {Question}: Yes or No?` | 250-350 | 该问题类型下**特殊读法**（同牌 Love vs Career 判定可能不同，见 §4）|
| M4 | Upright vs Reversed | `Upright vs Reversed {Card}` | 180-250 | 正逆位判定差异（逆位≠否，常=not yet，见 §5）|
| M5 | If Conditional | `What Would Shift It to Yes/No?` | 150-220 | **转化条件 + 水晶辅助**（conditional 牌配水晶转化，见 §6）|
| M6 | Common Mistakes | `Common Mistakes Reading {Card}` | 120-180 | 该牌常见误读（吸收 Selfgaze 5 错误）|
| M7 | Free Will + FAQ | | 150-220 | **自由意志免责**（合规+E-E-A-T）+ FAQ |

---

## 3. M2 总体判定（核心防雷 ⭐⭐）

> **竞品雷同根源**：Selfgaze 78 牌 yes/no 速答清单是**通用速答**，多家复制。照抄 = 重复内容。**本模块禁照抄，必须写该牌独有论证。**

**判定 + 条件 > 二元答案**（Selfgaze 核心洞察：reversed doesn't mean opposite, often = not yet / yes but with complications）：

| ❌ 禁（照抄速答清单） | ✅ 要（该牌独有论证） |
|---|---|
| "The Fool is generally a yes card." | "The Fool leans yes — its archetype is the leap of faith, so it favors questions where action and openness matter. But it's a **conditional yes**: the leap must be informed, not reckless. For 'should I take this risk?' it's yes; for 'is this a sure thing?' it's no, because The Fool never promises safety." |

**硬约束**：
1. M2 必须给**三档判定**（Strong Yes / Conditional / Strong No）之一 + **为什么**（基于该牌 archetype + upright/reversed 语义）
2. 禁照抄 Selfgaze 速答句（grep 比对 Selfgaze 清单，相似度 < 30%）
3. 判定必须落到该牌独有象征（The Tower=震荡→多数 no；The Sun=光明→多数 yes；The Hermit=内省→conditional yes only if reflected）

---

## 4. M3 该问题类型特殊读法（⭐⭐）

> **Selfgaze 关键洞察**：同一张牌，不同问题判定可能不同。**Three of Swords might be yes for ending a painful relationship but no for pursuing someone.**

**该问题类型下的特殊判定（每篇必须给）**：

| 问题类型 | 该牌判定逻辑 |
|---|---|
| Love（he loves me / new relationship） | 该牌在感情问题的倾向 |
| Career（new job / quit / launch） | 该牌在事业问题的倾向 |
| Decision（should I do X） | 该牌在决策问题的倾向 |
| Timing（is now the right time） | 该牌在时机的倾向 |
| Move-or-Stay（move / stay / go back） | 该牌在去留问题的倾向 |

**硬约束**：M3 必须写**该牌在该问题的独有判定**，且与 M2 总体判定**可不同**（如 The Tower 总体 no，但 for "should I leave toxic job?" = yes，必要崩塌）。

---

## 5. 三档判定规则（M1+M2+M3 系统化）

| 档位 | 判定信号 | 典型牌 |
|---|---|---|
| **Strong Yes** | 正位 + 积极 archetype + 行动型牌 | The Sun / The World / The Star / The Magician（正位）|
| **Conditional** | 中性牌 / 逆位 / 需附加条件 | The Fool（条件 yes）/ The Hermit（reflect 后 yes）/ 逆位牌（not yet）|
| **Strong No** | 震荡/结束 archetype + 该问题忌动 | The Tower（忌大动）/ The Moon（不明朗）/ Death（结束，for 继续=否）|

**逆位规则（合规+Selfgaze）**：逆位 **≠** 否定/凶兆。逆位常 = **not yet / yes but with complications / 内在能量受阻**。用 shadow aspect / invitation to reflect 口径。

---

## 6. M5 conditional 转化 + 水晶辅助

> conditional 牌的核心价值：给转化条件 + 水晶辅助。

**写法**：
- The Hermit = yes **only if** you've reflected enough → 配 **Amethyst** 助内省
- The Fool = conditional yes → 配 **Clear Quartz** 帮你 discern 哪个 leap 值得
- The Tower = no for now → 配 **Smoky Quartz** 帮你 grounding 度过震荡期

**硬约束**：水晶辅助必须落**该牌该问题的转化条件**（非"wear X for luck"万能句），CTA 三级降级。

---

## 7. 自由意志免责 + 合规（M7 ⭐）

> 吸收 Selfgaze 结尾 + 全站合规。是与否页涉及"预测"，**免责尤其重要**。

**强制免责文案**（每篇必含，前半全站一致 + 后半该牌差异化）：
- 全站前半："Cards reflect current energy and patterns, not fixed outcomes — you always have free will to shape what happens next."
- 该牌后半：`For {Card}, the card may point to {该牌倾向}, but whether you act on it is your choice.`

**合规禁词**（牌义页 §16）：`will predict` / `destined` / `guaranteed yes` / `definitely no` / `curse` / `bad omen`。

---

## 8. 通用组件（复用牌义页/配对页框架）

| 组件 | 执行依据 | 是与否页专属 |
|---|---|---|
| 合规/去AI化 | 牌义页 §16 | 同 + **M7 强制免责 + 禁二元确定论** |
| CTA 预验证 | 牌义页 §3 | conditional 水晶 meaning/category HEAD 检查 |
| Schema | 牌义页 §12 | Article + FAQPage + BreadcrumbList（是与否页通常无水晶 ItemList，除非 M5 有水晶）|
| 内链 | 2A §四塔罗页 | 牌义页（`/tarot-{card}-crystals/`）+ 同牌其他问题页 + 是与否 Hub + 配对页（可选）|
| 图片 | 牌义页 §14 | hero（牌视觉+是与否符号 yes/no/maybe，1536×864）|

## 9. 质检关卡（是与否专属）

- **关卡 1 三档判定**：M1/M2/M3 判定档位明确 + 为什么
- **关卡 2 禁照抄 Selfgaze**：M2 与 Selfgaze 速答清单相似度 < 30%
- **关卡 3 问题类型差异化**：M3 该问题判定与 M2 总体可有差异（非复制）
- **关卡 4 免责存在性**：M7 含自由意志免责（前半一致+后半该牌差异化）
- **关卡 5 合规**：grep 禁词 will predict/destined/guaranteed/curse/bad omen

## 10. 数据层 + 生产流程

- config：`yes-no-knowledge.json`（每牌 × 问题类型的 verdict 三档 + 条件 + 转化水晶）
- 流程：22 牌 × 5 问题清单 → AI 判定三档 → CTA 预验证 → 填充 → 五质检 → 二审 → 图片 → upload → 防假完成

## 11. 与其他框架边界

见 [配对框架 §11](模板-Tarot-配对文章框架.md)。是与否页讲**单牌×问题的判定**，配对页 M5 是与否仅作可选补充。
