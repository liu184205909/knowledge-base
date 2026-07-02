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

## 7A. Health / Finances 合规定制（是与否专属 ⭐⭐⭐ —— 5 类塔罗内容最易违规处）

> **为什么是与否是重灾区**：是与否页的 verdict 天然是"判定"（该牌该问题 = Strong Yes / Conditional / Strong No）。当问题落在 Health（如 "Is The Tower yes for surgery?"）/ Finances（如 "Is The Magician yes for this investment?"）时，AI 极易生成**医疗判定 / 投资建议**——这是平台+广告政策高压区，比其余 4 类塔罗内容风险**高一个数量级**。
> **本节为是与否页强制规则**，触发即打回不进生产。普适黑名单见 [1F §0A.1](../../01-竞品分析/1F-塔罗内容写法研究.md)，本节是**是与否页在该黑名单之上的类型专属加固**。

### 7A.1 Health 问题判定规则（禁医疗判定）

> **典型违规问题**：`Is {Card} yes for healing?` / `Is {Card} yes for recovery?` / `Is {Card} yes for surgery?` / `Is {Card} a warning about my illness?` / `Will {Card} mean I'll get better?`

**强制规则**：
1. **verdict 禁医疗判定**：是与否页对 Health 问题的判定，**只能谈 energy / rest / stress / body awareness / emotional pattern 层面**，**禁**判定该牌对"治愈/康复/手术/疾病"的 yes/no
   - ❌ 违规：`The Tower is a no for surgery — it signals complications.`（医疗判定）
   - ❌ 违规：`The Sun is a yes for healing — it means you will recover.`（疗效承诺）
   - ✅ 合规：`For health questions, The Tower is better read as a prompt to slow down and check in with your body — not a verdict on any treatment or outcome. The card's sudden-change energy may point to stress you've been carrying; whether to pursue any medical path is a conversation for you and a qualified professional.`
2. **verdict 禁用医疗词黑名单**（在 [1F §0A.1](../../01-竞品分析/1F-塔罗内容写法研究.md) Health 黑名单基础上，是与否页额外禁这些判定式表达）：
   - `yes/no for surgery` / `yes/no for healing` / `yes/no for recovery` / `yes/no for treatment`
   - `this card means you will get better/worse` / `the illness will...`
   - `cure` / `heal` / `diagnose` / `illness` / `sickness`（在 verdict 上下文）
3. **Health 问题统一加免责标签**：是与否页对 Health 问题的 verdict + M3 + FAQ 答案，**强制内嵌**（原文照搬禁改写）：
   > `"For health questions, this reading is a reflection prompt, not medical advice — decisions about treatment belong with a qualified professional."`
4. **三档判定在 Health 问题的改写**（禁直接 Strong Yes/No 医疗化）：
   - Strong Yes/No 在 Health 问题 → 改写为"该牌的能量指向（如 rest/check-in/slow down）是否与该问题相关"，**不**判定疗效
   - Conditional 在 Health 问题 → 谈"该牌提示的身体/能量觉察"，非"治不治"

### 7A.2 Finances 问题判定规则（禁投资建议）

> **典型违规问题**：`Is {Card} yes for this investment?` / `Is {Card} yes for buying this stock?` / `Is {Card} yes for lending money?` / `Will {Card} mean I'll make money?` / `Is {Card} a yes for crypto?`

**强制规则**：
1. **verdict 禁投资建议**：是与否页对 Finances 问题的判定，**只能谈 money mindset / risk awareness / spending pattern / planning behavior 层面**，**禁**判定该牌对"某项投资/某只股票/借贷/加密货币"的 yes/no
   - ❌ 违规：`The Magician is a yes for this investment — it means manifestation and returns.`（投资建议 + 收益暗示）
   - ❌ 违规：`The Fool is a yes for crypto — take the leap.`（具体投资品类建议）
   - ✅ 合规：`For money questions, The Magician leans toward resourcefulness and agency — but that's a mindset read, not a signal to invest. The card can't tell you whether a specific asset will perform; it may simply invite you to review whether you've thought the decision through. Treat any yes/no here as a prompt to slow down, not a green light.`
2. **verdict 禁用财务词黑名单**（在 [1F §0A.1](../../01-竞品分析/1F-塔罗内容写法研究.md) Finances 黑名单基础上，是与否页额外禁这些判定式表达）：
   - `yes/no for this investment/stock/crypto/asset` / `yes/no for lending`
   - `you will gain/profit` / `guaranteed return` / `this stock will...`
   - `invest now` / `don't invest or you'll lose` / `predicts loss`
3. **Finances 问题统一加免责标签**：是与否页对 Finances 问题的 verdict + M3 + FAQ 答案，**强制内嵌**（原文照搬禁改写）：
   > `"For money questions, this reading is symbolic, not investment advice — financial decisions belong with a qualified professional."`
4. **三档判定在 Finances 问题的改写**（禁直接 Strong Yes/No 投资化）：
   - Strong Yes/No 在 Finances 问题 → 改写为"该牌的能量（如 review spending / slow down / risk awareness）是否与该问题相关"，**不**判定收益
   - Conditional 在 Finances 问题 → 谈"该牌提示的财务觉察"，非"投不投"

### 7A.3 是与否页问题类型合规分级

| 问题类型 | 合规风险 | 是与否页专属规则 |
|---|---|---|
| Love（he loves me / new relationship） | 中 | 禁"对方一定回头/一定出轨"绝对预测；verdict 用 may/likely |
| Career（new job / quit / launch） | 中 | 禁"一定升职/被裁"；verdict 用 decision-frame，可正常三档判定 |
| Decision（should I do X） | 中 | 可正常三档判定（决策是是与否的天然主场），但守 [1F §0A.2](../../01-竞品分析/1F-塔罗内容写法研究.md) 绝对预测禁令 |
| Timing（is now the right time） | 中 | 可正常三档判定，禁"X 时刻必发生"确定论 |
| Move-or-Stay（move / stay / go back） | 中 | 可正常三档判定，禁"搬家必破财/必生病"连带违规 |
| **Health（healing/recovery/surgery/illness）** | **极高** | ⭐**守 §7A.1 全量**：禁医疗判定 + verdict 谈能量觉察 + 强制免责标签 |
| **Finances（investment/stock/lending/crypto）** | **极高** | ⭐**守 §7A.2 全量**：禁投资建议 + verdict 谈财务觉察 + 强制免责标签 |

**硬约束**：
1. 是与否页生产前，先判该篇问题类型；**Health/Finances 问题页全审**（不抽审，5 类里风险最高，错一篇即违规）
2. Health/Finances 问题的 verdict 不进 Strong Yes/Strong No 的医疗/投资化判定，统一降级为"能量/觉察层 Conditional 改写" + 强制免责标签
3. [1F §0A.1](../../01-竞品分析/1F-塔罗内容写法研究.md) Health/Finances 黑名单在是与否页是**关卡 0 必过项**，且 §7A.1/§7A.2 额外禁用判定式表达（yes/no for surgery / yes for this investment 等）一并 grep

---

## 8. 通用组件（复用牌义页/配对页框架）

| 组件 | 执行依据 | 是与否页专属 |
|---|---|---|
| 合规/去AI化 | 牌义页 §16 + [1F §0A](../../01-竞品分析/1F-塔罗内容写法研究.md) + **本框架 §7A** | 同 + **M7 强制免责 + 禁二元确定论**；⭐**Health/Finances 问题页守 §7A 全量**（5 类最易违规，是与否专属加固）；**禁用表达库 6 类见 [1F §0A.2](../../01-竞品分析/1F-塔罗内容写法研究.md)**——是与否页对"绝对预测"类尤其敏感（判定天然倾向确定论，最易写成 guaranteed yes/definitely no）|
| CTA 预验证 | 牌义页 §3 | conditional 水晶 meaning/category HEAD 检查 |
| Schema | 牌义页 §12 | Article + FAQPage + BreadcrumbList（是与否页通常无水晶 ItemList，除非 M5 有水晶）|
| 内链 | 2A §四塔罗页 | 牌义页（`/tarot-{card}-crystals/`）+ 同牌其他问题页 + 是与否 Hub + 配对页（可选）|
| 图片 | 牌义页 §14 | hero（牌视觉+是与否符号 yes/no/maybe，1536×864）|

## 9. 质检关卡（是与否专属）

- **关卡 0 合规前置门（Health/Finances 重点审 + 禁用表达库，全塔罗统一 ⭐⭐⭐ 是与否页最关键关卡）**：
  - grep [1F §0A.1](../../01-竞品分析/1F-塔罗内容写法研究.md) Health/Finances 黑名单 + [1F §0A.2](../../01-竞品分析/1F-塔罗内容写法研究.md) 禁用表达库 6 类 + **§7A.1/§7A.2 是与否专属判定式黑名单**（`yes/no for surgery` / `yes for healing/recovery` / `yes for this investment/stock/crypto` / `you will gain` / `invest now` 等）
  - **Health/Finances 问题页逐篇全审**（非抽审）：校验 verdict 不医疗化/投资化 + 强制免责标签原文存在（§7A.1/§7A.2 两句）
  - 命中即打回不进生产
  - 输出：`_qc/00-compliance.json`（标注每篇问题类型，Health/Finances 标红必过）

- **关卡 1 三档判定**：M1/M2/M3 判定档位明确 + 为什么
- **关卡 2 禁照抄 Selfgaze**：M2 与 Selfgaze 速答清单相似度 < 30%
- **关卡 3 问题类型差异化**：M3 该问题判定与 M2 总体可有差异（非复制）
- **关卡 4 免责存在性**：M7 含自由意志免责（前半一致+后半该牌差异化）
- **关卡 5 合规**：grep 禁词 will predict/destined/guaranteed/curse/bad omen

- **关卡 6 语义去重 + 结构指纹（全塔罗普适升级 ⭐，见 [1F §0A.3](../../01-竞品分析/1F-塔罗内容写法研究.md)）**：
  - **语义去重**：100 是与否页 M2/M3 段（核心论证段）跨篇 embedding 余弦相似度 **> 0.85 触发复审**。重点查**同问题类型 + 同档位**之间（如多张 Conditional 牌在 Love 问题的 M2 最易"换牌不换骨"——都写"yes but with complications"）
  - **结构指纹**：8 模块开场句式 + 论证路径指纹重复率 **< 40%**；**强制 ≥ 30% 是与否页打乱默认起承转合**（如 M4 正逆位前置、M5 conditional 并入 M3、加"误读警示"段、Strong No 牌用倒叙等变体）
  - **人工连读兜底**：抽**同问题类型** 5-10 篇连读（如 5 张牌在 Health 问题的判定连读），判断"换牌名能否互换"

## 10. 数据层 + 生产流程

- config：`yes-no-knowledge.json`（每牌 × 问题类型的 verdict 三档 + 条件 + 转化水晶）
- 流程：22 牌 × 5 问题清单 → AI 判定三档 → CTA 预验证 → 填充 → **关卡 0 合规前置门（Health/Finances 重点审）** → 五质检 → 二审 → 图片 → upload → 防假完成

### 10.1 yes-no-knowledge.json 数据层质量阀门（全塔罗普适见 [1F §0A.4](../../01-竞品分析/1F-塔罗内容写法研究.md)，本节是与否专属 ⭐⭐⭐）

> yes-no-knowledge.json 是 100 是与否页源头，错则全错。普适判定流程/抽审比例见 1F §0A.4，本节列**是与否专属验收清单**——Health/Finances 问题判定合规是重中之重。

**yes-no-knowledge.json 验收清单（任一不满足打回）**：
- [ ] 每条 verdict 三档判定（Strong Yes / Conditional / Strong No）有 archetype + upright/reversed 依据（非照抄 Selfgaze 速答，相似度 < 30%）
- [ ] 100 条 verdict 论证主体词组重叠 < 30%（同档位同问题类型之间也必须落到该牌独有论证）
- [ ] **Health 问题判定合规**（⭐重点审）：verdict 不医疗化（不判定 cure/healing/recovery/surgery），只谈 energy/rest/stress/body awareness；Health 问题条目带强制免责标签（§7A.1 句）
- [ ] **Finances 问题判定合规**（⭐重点审）：verdict 不投资建议化（不判定 investment/stock/crypto/lending），只谈 money mindset/risk awareness/spending pattern；Finances 问题条目带强制免责标签（§7A.2 句）
- [ ] conditional 牌的转化条件 + 水晶辅助落该牌该问题独有（非"wear X for luck"万能句）
- [ ] M3 该问题判定可与 M2 总体判定不同（如 The Tower 总体 no 但 for "leave toxic job" = yes），差异化有依据

**抽审比例（是与否页特殊，Health/Finances 全审）**：
- **Health/Finances 问题页全审**（是与否 5 类里风险最高，错一篇即违规，不抽审）
- 强 yes/no 高权重牌全审
- conditional 牌抽 30%
- 其余抽 20%（对齐 [1F §0A.4 ③](../../01-竞品分析/1F-塔罗内容写法研究.md)）

## 11. 与其他框架边界

见 [配对框架 §11](模板-Tarot-配对文章框架.md)。是与否页讲**单牌×问题的判定**，配对页 M5 是与否仅作可选补充。
