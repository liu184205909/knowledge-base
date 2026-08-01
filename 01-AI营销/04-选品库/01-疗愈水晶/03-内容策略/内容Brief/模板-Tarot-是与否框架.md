# Tarot 是与否框架 v2（单牌 × 问题类型，~100 篇）

> **v2 变更**（按评审优化）：① 拆三层——母框架(本档) / [生产 Brief](Brief-Tarot-是与否-生产执行版.md) / [QC 清单](Checklist-Tarot-是与否-QC.md)；② **判定矩阵前置 §0**（数据层=第一交付物，先审矩阵再写文，从源头去重）；③ 8 模块 → **6 核心 + 2 可选**，词数放宽 1200-1800；④ 新增 **§8 选题优先级矩阵**（SEO 评分表）；⑤ 新增 **§9 内链配方**；⑥ **强制免责段排除相似度计算**；⑦ Common Mistakes 改可选（仅误读牌启用）。
> **适用**：`is-{card}-yes-or-no-{question}/` 单牌在某问题下的是与否判定页（22 Major × 5 问题类型 = 110 篇基础，精选 ~100 篇）
> **与牌义页框架关系**：[牌义页框架](模板-Tarot-牌义页框架.md) 写牌的普适意义；本框架写**该牌在某问题类型下的是与否判定 + 条件**。物理隔离：是与否页不讲 archetype 深度，只讲判定逻辑。
> **竞品依据**：[1F §2.4](../../01-竞品分析/1F-塔罗内容写法研究.md) —— Selfgazer 是方法论王（4000 词总览页：问题措辞/读牌法/正逆位/强度三档/78 牌速答/5 错误+禁用场景/自由意志免责）。我们做独立"该牌该问题=是/否/视情况"页，吸收其方法论深度。
> **数据源**：`yes-no-knowledge.json`（判定矩阵，**第一交付物**）+ `tarot-knowledge.json`（22 牌正逆位）
> **核心策略**：主词 `is {card} a yes or no card` / `{card} yes or no for {question}`。差异化：**三档判定 + conditional 转化条件 + 水晶辅助反思 + 自由意志免责**。
> **⚠️ 最大风险**：照抄 Selfgaze 78 牌速答清单（重复内容）+ 二元答案太薄 + Health/Finances 违规。

---

## §0 判定矩阵前置（第一交付物）⭐⭐⭐

> **核心变更**：`yes-no-knowledge.json` 不再是生产中的附属配置，而是**整个项目的第一交付物**。矩阵审完才进文章生产。
> **为什么前置**（解决 4 个源头问题）：① 避免同牌不同问题逻辑冲突；② 提前发现 100 篇里哪些太像——**选题去重在矩阵阶段做，不靠写作端补救**（治本）；③ Health/Finances 高风险页提前标红；④ 写作阶段只扩写不判断。

**矩阵结构**（`yes-no-knowledge.json` 每条）：

| 字段 | 内容 | 示例（The Fool × Love） |
|---|---|---|
| card | 牌 slug | the-fool |
| question_type | 5 类 | love |
| overall_verdict | 三档 | conditional |
| specific_verdict | 该问题判定 | conditional yes（opening 关系）/ no（忽略 red flag） |
| core_reason | 落该牌 archetype | leap-of-faith favors opening, but innocence slides to naivety |
| shift_condition | 转化条件 | stronger yes if eyes open; no if ignoring red flags |
| crystal | 反思辅助 | rose-quartz |
| compliance_flag | 合规标红 | love(中) / health(极高) / finances(极高) |
| common_mistakes | 是否启用 O2 | true/false |

**矩阵阶段就去重**（⭐ 解决"防重复 vs 强制差异化"张力根源）：
- 同档位 + 同问题类型的牌（如多张 Conditional 在 Love），core_reason **必须落到该牌独有 archetype**（The Fool=leap / The Hermit=introspection / The Hierophant=convention），**禁都用 "yes but with complications" 通用句**
- 矩阵审时连读同档位同问题组，"换牌名能否互换"——能互换 = 打回重写 core_reason

**矩阵验收清单**（任一不满足打回，详细可勾选项见 [QC 清单](Checklist-Tarot-是与否-QC.md)）：
- [ ] 110 条 verdict 三档有 archetype + 正逆位依据（与 Selfgaze 速答相似度 < 30%）
- [ ] core_reason 主体词组跨篇重叠 < 30%（同档位同问题之间也落独有论证）
- [ ] Health/Finances 条目 verdict 不医疗/投资化 + 带强制免责标签
- [ ] conditional 牌 shift_condition + crystal 落该牌该问题独有
- [ ] 同牌不同问题 verdict 可不同（The Tower 总体 no，for "leave toxic job" = yes）

**抽审比例**：Health/Finances 全审 / 强 yes·no 高权重牌全审 / conditional 抽 30% / 其余抽 20%

---

## §1 URL + TKD

- **URL**：`is-{card}-yes-or-no-{question}/`（根级 post）。示例：`/is-the-fool-yes-or-no-love/` / `/is-the-tower-yes-or-no-for-moving/`
- **Title**：`Is {Card} a Yes or No Card? (For {Question})`（≤60 字符）
- **H1**：`Is {Card} a Yes or No Card for {Question}?`
- **Primary KW**：`is {card} a yes or no card` / `{card} yes or no` / `{card} yes or no {question}`
- rank_math 三件套（focus_keyword = `{card} yes or no`）

---

## §2 模块结构（6 核心 + 2 可选，1200-1800 词）⭐ 改

| # | 模块 | H2 | 词数 | 必/可选 |
|---|---|---|---|---|
| Intro | Hero + 钩子 | | 120-180 | 核心 |
| M1 | Quick Answer | `Quick Answer` | 80-120 | 核心（Featured Snippet bait） |
| **M2** | **Overall Tendency** | `Is {Card} Generally a Yes or No Card?` | 280-380 | **核心**（见 §3） |
| **M3** | **For {Question}** | `{Card} for {Question}: Yes or No?` | 280-380 | **核心**（见 §4） |
| M4 | What Would Shift It | `What Would Shift It to Yes/No?` | 150-220 | 核心（conditional 必写，strong yes/no 简写） |
| M5 | Free Will + FAQ | | 150-220 | 核心（免责 + FAQ 2-3 个） |
| O1 | Upright vs Reversed | `Upright vs Reversed {Card}` | 150-220 | **可选**（可并入 M2/M3，逆位关键牌才独立） |
| O2 | Common Mistakes | `Common Mistakes Reading {Card}` | 100-160 | **可选**（仅误读牌启用，见下） |

**Common Mistakes(O2) 启用规则**（⭐ 改：不硬塞，避免水字数）：
- ✅ 启用：The Moon / The Tower / Death / The Devil / The Fool / The Hermit / The Hanged Man（有明显常见误读）
- ❌ 不启用：The Sun / The World / The Star（强行写误读 = 水字数）
- 判定：矩阵阶段标 `common_mistakes: true/false`

**词数说明**：M2+M3 占 560-760 词（核心论证），其余分 440-1040 词，空间充足。Strong Yes/No 牌 M4 简写可控制在 1200-1400；Conditional 牌 M4 详写 1400-1800。

---

## §3 M2 总体判定（核心防雷）

照抄 Selfgaze 速答清单 = 重复内容。M2 必须写**该牌独有论证**：
- ❌ "The Fool is generally a yes card."
- ✅ "The Fool leans yes — its archetype is the leap of faith... But it's a **conditional yes**: the leap must be informed, not reckless..."

**硬约束**：三档判定 + 为什么（archetype + 正逆位语义）/ 禁照抄 Selfgaze（相似度 < 30%）/ 落该牌独有象征（The Tower=震荡→多 no；The Sun=光明→多 yes；The Hermit=内省→conditional yes only if reflected）。

---

## §4 M3 该问题特殊读法

同一张牌不同问题判定可不同（Three of Swords might be yes for ending a painful relationship but no for pursuing someone）。M3 写该牌该问题独有判定，**可与 M2 总体不同**（The Tower 总体 no，但 for "should I leave toxic job?" = yes，必要崩塌）。

---

## §5 三档判定规则

| 档位 | 信号 | 典型牌 |
|---|---|---|
| **Strong Yes** | 正位 + 积极 archetype + 行动型 | The Sun / The World / The Star / The Magician（正位） |
| **Conditional** | 中性牌 / 逆位 / 需附加条件 | The Fool（条件 yes）/ The Hermit（reflect 后 yes）/ 逆位（not yet） |
| **Strong No** | 震荡/结束 archetype + 该问题忌动 | The Tower（忌大动）/ The Moon（不明朗）/ Death（结束，for 继续=否） |

**逆位规则**：逆位 **≠** 否定/凶兆，常 = **not yet / yes but with complications / 内在能量受阻**。用 shadow aspect / invitation to reflect 口径。

---

## §6 conditional 转化 + 水晶辅助

- The Hermit = yes **only if** you've reflected enough → **Amethyst** 助内省
- The Fool = conditional yes → **Clear Quartz** 帮 discern 哪个 leap 值得
- The Tower = no for now → **Smoky Quartz** 助 grounding 度过震荡

**水晶口径**（⭐ 反复强调，避免玄学承诺）：水晶**不是改变结果的工具**，而是**帮助执行该牌建议的反思辅助**。
- ✅ "Use Amethyst to support the introspection The Hermit asks for"
- ❌ "Wear Amethyst to turn this into a yes"

CTA 三级降级（meaning → category → 总 shop）。

---

## §7 自由意志免责 + 合规

**强制免责文案**（每篇必含，前半全站一致 + 后半该牌差异化）：
- 全站前半："Cards reflect current energy and patterns, not fixed outcomes — you always have free will to shape what happens next."
- 该牌后半：`For {Card}, the card may point to {该牌倾向}, but whether you act on it is your choice.`

**合规禁词**：`will predict` / `destined` / `guaranteed yes` / `definitely no` / `curse` / `bad omen`。

### §7A Health / Finances 加固（是与否专属，5 类最易违规处）⭐⭐⭐

> 是与否 verdict 天然是"判定"，落在 Health/Finances 时 AI 极易生成医疗判定/投资建议——平台+广告政策高压区，比其余 4 类塔罗内容风险**高一个数量级**。本节触发即打回。

**§7A.1 Health**（禁医疗判定）：verdict 只谈 energy / rest / stress / body awareness / emotional pattern，**禁**判定 cure/healing/recovery/surgery。强制免责标签（原文照搬禁改写）：
> "For health questions, this reading is a reflection prompt, not medical advice — decisions about treatment belong with a qualified professional."

**§7A.2 Finances**（禁投资建议）：verdict 只谈 money mindset / risk awareness / spending pattern / planning behavior，**禁**判定 investment/stock/crypto/lending。强制免责标签：
> "For money questions, this reading is symbolic, not investment advice — financial decisions belong with a qualified professional."

**§7A.3 问题类型合规分级**：

| 问题类型 | 风险 | 规则 |
|---|---|---|
| Love / Career / Decision / Timing / Move | 中 | 可正常三档判定，禁绝对预测（用 may/likely） |
| **Health** | **极高** | 守 §7A.1 全量：禁医疗判定 + verdict 谈能量觉察 + 强制免责标签 |
| **Finances** | **极高** | 守 §7A.2 全量：禁投资建议 + verdict 谈财务觉察 + 强制免责标签 |

---

## §8 选题优先级矩阵（SEO 评分表）⭐ NEW

> 22×5=110 精选 ~100，"精选"不能只靠内容逻辑（强 yes/no/conditional），必须有 SEO 维度排序，否则冷启动吃亏。

**选题评分表**（每条 0-100）：

| 维度 | 权重 | 说明 | 示例 |
|---|---|---|---|
| 搜索意图明确度 | 30% | "{card} yes or no {question}" 是否高频直查 | "the fool yes or no love" > 模糊长尾 |
| 牌热度 | 25% | Major 牌搜索量梯队（查 Seed-Master） | Fool/Lovers/Tower/Death/Sun > 其他 |
| 商业价值 | 20% | Love/Career/Decision > Timing/Move | love highest |
| 差异化空间 | 15% | 有独有判断的牌×问题 | "The Tower for leaving job" 独特 |
| 合规风险 | 10% | Health/Finances 降权（独立审查成本） | Health/Finances 默认 -10% |

**优先级梯队**（生产前查 Seed-Master Sheet 精确搜索量微调，不臆断）：

| 梯队 | 量级 | 牌×问题组合 |
|---|---|---|
| **T1 先做** | ~30 篇 | Fool / Lovers / Tower / Death / Sun / Devil / Magician / Star / Moon × Love + Decision + 主要 Career |
| T2 | ~60 篇 | Hermit / Empress / Emperor / High Priestess / Hierophant / Chariot / Strength / Wheel / Justice / Temperance × 5 问题 |
| T3 补尾 | ~10 篇 | Judgment / World / Hanged Man + Move / Timing 长尾 |

**精确搜索量来源**：Seed-Master Sheet（SEMrush-Seed-Keywords ID 1HhKDz7）或 `serp_check` 验证。

---

## §9 内链配方 ⭐ NEW

> 100 篇规模下内链必须结构化，否则失控。每篇固定配方：

| 内链类型 | 数量 | 锚文本示例 | 目标 |
|---|---|---|---|
| 同牌牌义页 | 1 | "{Card} tarot card meaning" | `/tarot-{card}-crystals/` |
| 同牌其他 Yes/No 页 | 1-2 | "{Card} yes or no for {other-question}" | `is-{card}-yes-or-no-{other-q}/` |
| 问题类型 Hub | 1 | "tarot yes or no {question} readings" | Hub 页 |
| 水晶页 | 0-1 | "crystals for {crystal}" | `/{crystal}-crystals/` 或 meaning 页 |
| 配对页 | 可选（语义自然时） | "{Card} with {Other}" | `/{card}-and-{other}/` |

**每篇 3-5 条内链**，锚文本含主关键词变体，禁 "click here"。

---

## §10 质检关卡（概览，可勾选项见 [QC 清单](Checklist-Tarot-是与否-QC.md)）

- **关卡 0 合规前置门**：grep Health/Finances 黑名单 + §7A 判定式黑名单；**Health/Finances 页全审**；强制免责标签原文存在
- **关卡 1 三档判定**：M1/M2/M3 档位明确 + 为什么
- **关卡 2 禁照抄 Selfgaze**：M2 相似度 < 30%
- **关卡 3 问题类型差异化**：M3 与 M2 可有差异
- **关卡 4 免责存在性**：M5 含免责（前半一致 + 后半该牌）
- **关卡 5 合规禁词**：grep will predict/destined/guaranteed/curse/bad omen
- **关卡 6 语义去重 + 结构指纹**：
  - M2/M3 embedding 余弦 > 0.85 触发复审（重点：同档位同问题组）
  - 结构指纹重复率 < 40%，≥ 30% 打乱起承转合
  - **⭐ 强制免责段（§7/§7A 两句原文）显式排除 embedding 相似度计算**（否则合规标签的重复性会被误判为重复内容）
  - 人工连读：抽同问题类型 5-10 篇"换牌名能否互换"

---

## §11 与其他框架边界

见 [配对框架 §11](模板-Tarot-配对文章框架.md)。是与否页讲**单牌×问题的判定**，配对页 M5 是与否仅作可选补充。

---

## 附录：三层架构

| 层 | 文件 | 用途 | 给谁 |
|---|---|---|---|
| 母框架 | 本档 | 策略 / 合规 / QC 逻辑标准 | 决策 / 合规审 |
| 生产 Brief | [Brief-Tarot-是与否-生产执行版.md](Brief-Tarot-是与否-生产执行版.md) | 单篇生成模板（字段 + 模块填空） | 写手 / AI 生产 |
| QC 清单 | [Checklist-Tarot-是与否-QC.md](Checklist-Tarot-是与否-QC.md) | 可勾选检查项 | 审核 |
