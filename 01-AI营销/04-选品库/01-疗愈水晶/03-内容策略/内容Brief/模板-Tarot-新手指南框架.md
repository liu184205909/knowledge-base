# Tarot 新手指南框架 v1（P1，10-15 篇）

> **三层架构**：母框架（本档，策略/合规/QC 逻辑）/ [生产 Brief](Brief-Tarot-新手指南-生产执行版.md)（写手填空）/ [QC 清单](Checklist-Tarot-新手指南-QC.md)（审核可勾选）。
> **适用**：`{beginner-slug}/` 独立新手指南页（10-15 篇：how-to-read-tarot / tarot-for-beginners / first-tarot-deck / how-to-shuffle-tarot / how-to-cleanse-tarot / tarot-card-meanings-list / storing-tarot-cards / daily-tarot-practice / tarot-journaling / reading-tarot-for-yourself / reversed-tarot-cards / major-vs-minor-arcana / reading-tarot-for-others，详见数据层 `beginner-knowledge.json`）。
> **与牌阵框架关系**：[牌阵框架](模板-Tarot-牌阵框架.md) 写**牌阵本身的教学**（结构/位含义/如何读）；本框架写**新手学塔罗的整体路径**（选牌/洗牌/净化/储存/每日练习/journaling/自读与他读等）。物理隔离：新手指南不讲单牌阵深度，链回牌阵页。
> **与牌义页框架关系**：[牌义页框架](模板-Tarot-牌义页框架.md) 写牌的普适意义；新手指南 `tarot-card-meanings-list` 是聚合清单页，链回 78 张牌义页。
> **竞品依据**：[1F §4.1.1 #8 新手指南](../../01-竞品分析/1F-塔罗内容写法研究.md) + SERP 实查（2026-07-03，见 §0）。
> **数据源**：`beginner-knowledge.json`（**第一交付物**，已审）+ 390 库（水晶落位依据）。
> **核心策略**：主词 `how to read tarot cards` / `tarot for beginners` / `first tarot deck` / `how to shuffle tarot cards` / `how to cleanse tarot cards` 等高搜索新手词。差异化：**学塔罗 × 配水晶（反思辅助口径）+ 东方视角 + 不预言结果而是给反思路径**。
> **⚠️ 最大风险**：① 抄 biddytarot/learntarot 教学步骤（重复内容）② 把 how-to 写成"算准方法"（违规预测）③ daily-practice/reading-for-others 涉他人 autonomy 与 mental health 边界 ④ 水晶万能论（玄学承诺）⑤ 反位讲成凶兆。

---

## §0 SERP 研究前置（竞品结构 + AIO 已查，2026-07-03）⭐⭐⭐

> **查询词**（serp_check 实查，禁 WebSearch 猜）：

| 查询词 | AIO | 竞品 top 结构 | goearthward 机会 |
|---|---|---|---|
| `how to read tarot cards` | ✅ | suburbanwitchery / the-line-up / almanac / vogue / panmacmillan / image.ie / biddytarot / learntarot / cosmopolitan / thetarotlady / reddit-wiki | 7 步带水晶触觉锚的完整流程（竞品 5-7 步纯操作零水晶） |
| `tarot for beginners` | ✅ | suburbanwitchery / image.ie / reddit / vogue / almanac / lightwands / cratejoy / usgamesinc / tarotarts / practicalmagic / amazon-book | 学 Major Arcana × 每张牌配水晶做触觉锚的新手路径 |
| `tarot card meanings list` | ❌ | labyrinthos / thetarotlady / solisdivinity / daily-tarot-girl / biddytarot / tarot.com / ezracard / purplegarden / darkforest / urbanepics | 78 牌清单 + 每牌一颗水晶速配（竞品纯清单零水晶） |
| `first tarot deck` | ❌(featured_snippet) | thetarotlady / medium / yahoo / quora / rockpoolpublishing / sarahgbeck / usgamesinc / ethony (PAA 'what to do when you get it') | 开牌仪式配一颗水晶做整副牌的长期触觉锚 |
| `how to shuffle tarot cards` | ✅ | reddit / sherylwagner / joyvernon / ethony / thetarotlady / healingthrutarot / incandescenttarot / qpmarketnetwork / brittagrubin / forum-thetarot-guru | 洗牌手法 × 水晶节律锚（竞品纯手部技巧零水晶） |
| `how to cleanse tarot cards` | ✅ | reddit / sherylwagner / creativesoultarot / quora / coppermoon / goddessprovisions / mindbodygreen / witchymama / stsoleil / spells8 / psychic-sisters | 净化方法 + 水晶作为长期触觉伴侣（竞品有提水晶但仅净化工具无首饰转化） |
| `learn tarot` | ❌ | learntarot / reddit / spotify-podcast / tarot.com / lightwands / amazon-book / labyrinthos / apple-app / joyvernon / practicalmagic / lizworth / teachmetarot | 路径型教程，与 tarot-for-beginners 互补 |
| `storing tarot cards` | ✅ | reddit / daily-tarot-girl / interrobangtarot / taroticallyspeaking / forum-thetarot-guru / tarotelements / tarotliza / darkforest / learnreligions / benebellwen / elvitarot | 储存方法 + 守护水晶（竞品纯物理保护零水晶能量伴侣） |

**AIO 关键发现**：8 词中 5 触发 AIO（how to read / tarot for beginners / how to shuffle / how to cleanse / storing），AIO 多引用 reddit/forum/小博客——**说明 AIO 在抓"教学解释"内容，深度教学页有机会被 AIO 引用**。这是新手指南 P1 优先级的核心 SEO 论据。

**竞品集体空白（核心差异化护城河）**：所有抓取的竞品 how-to / beginner 教学站**零水晶实践环节**。goearthward「学塔罗 × 配水晶触觉锚」是**竞品全无的差异化**——每步学牌 + 对应水晶 + 反思实践，与 1F §4.1.1 #8 一致。差异化 = 竞品纯教育，我们教育 + 水晶 + 首饰 Shop CTA。

---

## §1 数据层前置（`beginner-knowledge.json` = 第一交付物）⭐⭐⭐

> **核心变更**（学是与否/牌阵框架 §1）：`beginner-knowledge.json` 是**第一交付物**，矩阵审完才进文章生产。避免边写边判断。

**矩阵结构**（每条 beginner 文章）：

| 字段 | 内容 | 示例（how-to-read-tarot） |
|---|---|---|
| slug | 文章 slug（=URL） | how-to-read-tarot |
| name | 文章标准名 | How to Read Tarot Cards (A Beginner's Complete Walkthrough) |
| serp_keyword | SERP 实查主词 | how to read tarot cards |
| primary_kw | rank_math focus_keyword | how to read tarot cards |
| title_template | 标题模板 | "How to Read Tarot Cards: A Beginner's Complete Walkthrough (+ Crystals)" |
| h1_template | H1 模板 | "How to Read Tarot Cards: A Beginner's Walkthrough with Crystals" |
| url | 根级 post URL | /how-to-read-tarot/ |
| difficulty | 难度 | beginner / beginner-to-intermediate / intermediate |
| best_for | 最适用场景 | 完全新手第一次完整读牌 |
| serp_evidence | SERP 实查证据 | serp_check 2026-07-03: AIO=yes, top10 列表 |
| competitor_structure | 竞品结构对比 | 竞品 5-7 步线性教学；无水晶实践环节 |
| word_count_target | 目标字数 | 1800-2200 |
| compliance_flag | 合规标红 | general(低) / general(中, 涉他人 autonomy) / general(低, mental-health adjacent) |
| eastern_lens | 东方锚点 | 三才（地-人-天）/ 入门三宝（精-气-神）/ 调息 / 拂尘+开光 / 安处+藏 / 晨课+时辰 / 省察+观照 / 止观 / 阴面 / 本末+经纬 / 分位+不越界 |
| differentiation_hook | 该文章独有差异化点 | 一句话定位 vs 竞品 |
| process_steps | 步骤数组（核心） | 见下 |
| internal_links | 内链配方（数组） | 4-5 条 |
| faq_seed | FAQ 种子（4-6 条） | 来自 SERP PAA |
| free_will_second_half | 免责后半（该篇差异化） | "For a first reading, the cards may surface..., but..." |

**process_steps 数组每步**：

| 字段 | 内容 | 示例（how-to-read-tarot 步 1） |
|---|---|---|
| num | 步号 | 1 |
| name | 步名 | Settle and Frame the Question |
| crystal | 水晶 slug（390 库，已验证；null = 该步无水晶） | selenite |
| crystal_role | 水晶职能（反思辅助口径，非万能） | a physical cue to clear your mental space before framing the question — not magic, just a tactile reset that signals 'now I'm reading' |
| anchor_practice | 具体触觉锚用法（"hold/place/set beside"） | place selenite beside your deck before you sit down; touch it once as you settle |

**水晶落位依据**（非通识编）：
1. **步骤的能量职能匹配**：
   - 起始/清场/净化步 → selenite（清晰）/ smoky-quartz（grounding）
   - 抽牌/洗牌/反射步 → amethyst（反思）/ quartz（清明看见）/ moonstone（接收）
   - 行动/落地/具体步 → carnelian（行动）/ smoky-quartz（落地）
   - 困难/卡住/阴影步 → smoky-quartz / black-tourmaline（grounding 穿越阴影）
   - 模式识别/整合步 → labradorite（模式）/ fluorite（心理整理）
   - 心/关系步 → rose-quartz（暖意）
2. **219 张水晶全部已验证文件存在**（见数据层 _meta.crystal_source，clear quartz slug="quartz"）
3. **不是每步都配水晶**：纯机械/纯认知步骤 crystal=null，避免水晶堆砌（每篇 3-5 步有水晶，2-4 步无水晶，节奏自然）

**矩阵验收清单**（任一不满足打回，详细可勾选项见 [QC 清单](Checklist-Tarot-新手指南-QC.md)）：
- [ ] 每步 crystal slug 在 390 库存在（grep 验证；"varies-by-card" 仅用于聚合清单页）
- [ ] 每步 crystal_role 是**反思辅助口径**（"a tactile cue / a physical anchor / a reminder to / helps you stay..."），非"改变结果 / 吸引X / 改变能量"
- [ ] 同篇水晶尽量不重复（除非职能互补如 selenite 开场 + selenite 收尾的"复位"）；跨篇水晶可复用（按职能）
- [ ] 每篇 anchor_practice 含具体触觉动作（"hold in non-dominant hand / place beside / set on the card / carry in pocket"），非抽象
- [ ] 13 篇覆盖 SERP 实查的所有高搜索新手词（how to read / for beginners / meanings list / first deck / shuffle / cleanse / store / learn）
- [ ] mental-health adjacent（daily-practice）+ 涉他人（reading-for-others）守 §7A
- [ ] 每篇有 eastern_lens 具体锚点（非"Eastern traditions use crystals"万能句）
- [ ] 每篇 4-5 条内链（锚文本含主 KW 变体）

**抽审比例**：compliance general(中) 全审（reading-for-others）/ mental-health adjacent 全审（daily-practice M5 reflection 段）/ P1 pilot 3 篇全审 / P1 high 4 篇抽 50% / P2 6 篇抽 20%

---

## §2 URL + TKD

- **URL**：`{beginner-slug}/`（根级 post，对齐 site-url-rule）。示例：`/how-to-read-tarot/` / `/tarot-for-beginners/` / `/first-tarot-deck/` / `/how-to-shuffle-tarot/` / `/how-to-cleanse-tarot/`
- **Title**：用数据层 `title_template`（每篇独有，≤60 字符）
- **H1**：用数据层 `h1_template`
- **Primary KW**：数据层 `primary_kw`（= `serp_keyword`）
- rank_math 三件套（focus_keyword = primary_kw）

**内链结构**（见 §9）。

---

## §3 模块结构（8 核心，1500-2200 词）⭐

> 字数对标 1F §4.3：新手指南对标竞品深度教学页（biddytarot/learntarot/almanac/vogue ~1200-2000 词），下限 1200。聚合清单页（tarot-card-meanings-list）因 78 牌铺开可达 1800-2400。

| # | 模块 | H2 | 词数 | 必/可选 |
|---|---|---|---|---|
| Intro | Hero + 钩子 | | 120-180 | 核心 |
| M1 | Why This Step Matters（开头定位） | `Why {Topic} Trips Up Beginners` / `Why {Topic} Matters` | 150-220 | 核心 |
| **M2** | **The Step-by-Step Walkthrough**（步骤核心） | `How to {Topic}: A Step-by-Step Walkthrough` | 600-900 | **核心**（见 §4）⭐ |
| **M3** | **Crystals as Tactile Anchors**（差异化护城河） | `Crystals as Tactile Anchors for Each Step` | 250-400 | **核心**（见 §5）⭐ |
| M4 | Eastern Perspective | `An Eastern Lens on {Topic}` | 150-220 | 核心（差异化，见 §6） |
| M5 | Common Mistakes | `Common Mistakes Beginners Make with {Topic}` | 200-300 | 核心（见 §7） |
| M6 | Free Will + Ethics（如适用） | `Your Free Will (and Reading Responsibly)` | 120-180 | **可选**（涉他人/预测类必写） |
| M7 | FAQ + Shop CTA + Related | | 200-300 | 核心 |

**词数说明**：M2+M3 占 850-1300 词（步骤核心 + 差异化护城河）；其余分 650-900 词。简单 how-to（shuffle/cleanse/store）1500-1900；路径型（how-to-read/for-beginners）1800-2200；清单型（meanings-list）1800-2400。

**变体允许**（满足 1F §0A.3 ≥30% 打乱起承转合）：
- M6 提前到 M4 后（涉伦理的 reading-for-others / reversed）
- M5 并入 M2（每步后即讲常见错，how-to-shuffle 适用）
- 加咨询师/案例引言段（reading-tarot-for-yourself 用"为什么自读最难"的引言）

---

## §4 M2 步骤核心（核心防雷）

**照抄竞品 = 重复内容**。M2 必须落**每步的能量职能 + 实操细节 + 该步的"为什么"**（不只是步名）：
- ❌ "Step 1: Shuffle the cards."（learntarot/biddytarot 风格的扁平清单，可复制性高）
- ✅ "Step 1 — Settle and Frame the Question. Before you touch the deck, get clear on what you're actually asking. The mistake most beginners make is asking leading questions ('Will I get the job?') that lock in the answer they want. Rephrase into open questions ('What do I need to understand about this opportunity?'). This step alone changes the quality of the entire reading."

**硬约束**：
1. 每步含义落**实操 + 为什么**（不只是 what）——这是竞品薄弱处
2. 每步必含**「该步常见错」**（可直接嵌入 M2 或集中放 M5）——M2/M5 二选一结构
3. 每步禁"如何算准"口径（"this step ensures your reading is accurate"）→ 改"该步让你的注意力到位"口径（守 §7）
4. 步骤数 5-7 步（数据层 process_steps 数组决定），少于 5 太薄，多于 7 太长

---

## §5 M3 每步水晶触觉锚（差异化护城河）⭐⭐⭐

> **这是竞品全无的核心差异化**（1F §4.1.1 #8 + SERP 验证）。M3 决定文章是否被判同质。

**水晶口径（反复强调，避免玄学承诺）**：
水晶 = **反思辅助 + 触觉锚**，非改变结果/吸引X/净化能量的工具。
- ✅ "Selenite beside the deck is a **physical cue that you're shifting into reading mode** — not magic, just a tactile signal that helps your attention settle."
- ❌ "Selenite **clears negative energy** / **purifies the deck** / **raises your vibration**"（玄学承诺）

**M3 结构**（每步 1 段，~50-90 词）：
1. 该步的能量职能（接 M2）
2. 水晶为什么适配（职能匹配，从数据层 `crystal_role` 取，原文采用）
3. 具体触觉锚用法（"hold it on this step" / "place it beside the deck" / "set it on the card"）——**触觉锚**

**硬约束**：
1. 每步水晶来自数据层 `process_steps[].crystal`（已验证 390 库存在），禁生产中临时换
2. `crystal_role` 字段是反思辅助口径（"tactile cue / physical anchor / reminder to"），生产时**原文采用禁改写为万能论**
3. crystal=null 的步骤在 M3 段不补水晶（避免每步都堆水晶的"水晶堆砌"陷阱）—— M3 只讲有水晶的步骤
4. 水晶推荐段链 390 库 meaning 页或 Shop（CTA 三级降级，见 §10）

---

## §6 M4 东方锚点（差异化）

每篇 `eastern_lens` 字段给具体东方锚点（**13 篇锚点互不重复**，防跨篇雷同）：
- 三才（地-人-天）— how-to-read-tarot
- 入门三宝（精-气-神）— tarot-for-beginners
- 结缘 + 开光（非神秘化）— first-tarot-deck
- 调息（以息御物）— how-to-shuffle-tarot
- 拂尘 + 开光（除旧布新 + 以念净物）— how-to-cleanse-tarot
- 本末 + 经纬 — major-vs-minor-arcana
- 安处 + 藏（物归其位 + 静藏以养）— storing-tarot-cards
- 晨课 + 时辰（朝食气，夕反观）— daily-tarot-practice
- 省察 + 观照（日三省 + 毗钵舍那）— tarot-journaling
- 止观（止前观后）— reading-tarot-for-yourself
- 阴面（阳中有阴，阴中有阳）— reversed-tarot-cards
- 对应（五行 vs 四元素）— tarot-card-meanings-list
- 分位 + 不越界（不在其位不谋其政 + 正语）— reading-tarot-for-others

**硬约束**：东方锚点必须**具体**（非"Eastern traditions use crystals for healing"万能句，1F §0A.2 黑名单）。每篇的东方锚点**不同**（防跨篇雷同）。

---

## §7 合规（核心防线）⭐⭐⭐

### §7.1 普适合规（全篇共用）

**禁用表达库**（grep 兜底，命中即打回；1F §0A.2 套用）：

| 类型 | ❌ 禁 | ✅ 替代 |
|---|---|---|
| 绝对预测 | `this step ensures your reading is accurate` / `the cards predict` / `to get an accurate reading you must...` | `this step helps your attention settle` / `the cards show patterns and energy` |
| 水晶万能 | `X clears negative energy / purifies the deck / raises vibration / protects you from...` | `X as a tactile cue / physical anchor / reminder to...` |
| 医疗承诺 | `this crystal heals/cures/diagnoses` | `a reminder to check in with your body` |
| 财务承诺 | `attract wealth / draw money fast` | `support clearer money choices` |
| 恐吓 | `bad omen / curse / doomed / if you do this wrong your reading will be cursed` | `the growth edge / a common mistake / an invitation to slow down` |
| 凶兆反位 | `reversed = bad / a curse / misfortune` | `reversed = internalized / delayed / shadow / invitation to reflect` |

**强制免责文案**（每篇 M6/M7 必含，前半全站一致 + 后半该篇差异化，原文照搬禁改写）：
- 全站前半："Tarot is a tool for reflection, not a fixed forecast — the cards show energy and patterns, and you always have free will to choose your next step."
- 该篇后半：取自数据层 `free_will_second_half` 字段（每篇独有）。

**合规禁词**（grep）：`will predict` / `accurate reading` / `destined` / `guaranteed` / `definitely` / `curse` / `bad omen` / `doomed` / `cursed`。

### §7A Mental Health / Others Autonomy 加固（特定篇高危）⭐⭐⭐

> 新手指南多 general 风险，但 daily-tarot-practice（涉 mental health 边界）+ reading-tarot-for-others（涉他人 autonomy + 易触 Health/Finances 黑名单）必须加固。本节触发即打回。

**§7A.1 Mental Health 边界**（daily-tarot-practice M5 reflection / tarot-journaling Prompt 2 "body"）：
- 全段只谈 attention / awareness / pattern / body awareness / emotional pattern
- **禁**：cure / heal / therapy / trauma / diagnose / mental illness / `this practice heals anxiety` / `tarot for depression`
- 强制免责（原文照搬，daily-tarot-practice 必含）：
  > "Tarot and journaling are reflective practices, not substitutes for mental health care — if you're struggling, please reach out to a qualified professional."

**§7A.2 Reading for Others / Health / Finances 边界**（reading-tarot-for-others）：
- 全篇 verdict 只谈 reflection / pattern / agency / consent
- **禁**：读第三方（"let me read for your absent husband"）/ 给医疗建议 / 给法律建议 / 给投资建议（守 1F §0A.1 Health/Finances 黑名单全量）
- 强制免责（原文照搬，reading-tarot-for-others 必含）：
  > "For health, legal, or financial questions, tarot is a reflection tool — not a substitute for professional advice from a licensed provider."

**§7A.3 合规分级**（数据层 `compliance_flag`）：

| compliance_flag | 文章 | 规则 |
|---|---|---|
| general(低) | how-to-read / for-beginners / first-deck / shuffle / cleanse / store / journaling / meanings-list / reversed / major-vs-minor | 可正常读，禁绝对预测（用 may/likely/possibility） |
| general(低, mental-health adjacent) | daily-tarot-practice | 守 §7A.1 全量 + 强制 mental health 免责 |
| general(中, 涉他人 autonomy) | reading-tarot-for-others | 守 §7A.2 全量 + 强制 health/legal/financial 免责 + 不读第三方 |

### §7B How-to 专属风险：拒绝"如何算准"口径

新手指南的最大合规风险是把 how-to 写成"如何让读牌算准/灵验"（"how to get an accurate tarot reading"）。**全篇改口径**：
- "如何洗准" → "如何让注意力到位"（洗牌不是算准工具，是注意力练习）
- "如何问对" → "如何提开放问题"（不是"对的问题导致对的答案"，是"开放问题让牌有空间显示模式"）
- "如何净化彻底" → "如何用净化仪式标记'重新开始'"（不是"净化彻底 = 准"，是"净化是意图的物化"）

---

## §8 选题优先级（数据层 _meta.selection_priority）⭐

**P1 pilot**（3 篇，先验证框架——最高搜索 + AIO）：
1. `how-to-read-tarot`（高频 `how to read tarot cards`，AIO，新手必经起点）
2. `tarot-for-beginners`（高频 `tarot for beginners`，AIO，新手总入口）
3. `first-tarot-deck`（高频 `first tarot deck`，featured_snippet，新手第一关 + 开牌仪式带水晶锚差异化强）

**P1 high**（4 篇）：
4. `how-to-shuffle-tarot`（高频 `how to shuffle tarot cards`，AIO）
5. `how-to-cleanse-tarot`（高频 `how to cleanse tarot cards`，AIO，竞品水晶仅净化工具→我们升级为长期伴侣差异化最强）
6. `tarot-card-meanings-list`（高频 `tarot card meanings list`，清单型 + 78 牌铺开 + 每牌水晶配对）
7. `storing-tarot-cards`（高频 `storing tarot cards`，AIO）

**P2 mid**（3 篇）：daily-tarot-practice / tarot-journaling / reading-tarot-for-yourself

**P2 long tail**（3 篇）：reversed-tarot-cards / reading-tarot-for-others / major-vs-minor-arcana

---

## §9 内链配方 ⭐

> 13 篇规模下内链必须结构化。

| 内链类型 | 数量 | 锚文本示例 | 目标 |
|---|---|---|---|
| 同线新手指南互链 | 2-3 | "tarot for beginners" / "how to read tarot cards" / "first tarot deck" | `/{beginner-slug}/` |
| 牌阵教学（如适用） | 0-1 | "three card past present future tarot spread" | `/three-card-past-present-future/` |
| 牌义页/牌义清单 | 0-1 | "tarot card meanings list" / "crystals for tarot cards" | `/tarot-card-meanings-list/` / `/crystals-for-tarot-cards/` |
| 水晶页（M3 提及） | 1-2 | "crystals for {crystal}" / "{crystal} meaning" | `/{crystal}-crystals/` 或 meaning 页 |
| 工具页（如适用） | 0-1 | "free daily tarot reading" / "yes no tarot" | `/tarot-reading/` / `/tarot-yes-no/` |

**每篇 4-5 条内链**，锚文本含主 KW 变体，禁 "click here"。数据层 `internal_links` 字段已固化配方，生产时取值不另想。

---

## §10 Shop CTA 三级降级（避免死链）

新手指南页 Shop CTA 链水晶（M3 提及的水晶），三级降级（memory shop-cta-no-deadlink-rule）：
1. **首选**：该水晶的 product category（`/product-category/{crystal}-crystals/`）—— 生产前 curl 验证 200
2. **降级 1**：404 → 产品搜索 `/shop/?s={crystal}`
3. **降级 2**：搜索也空 → 总 healing-jewelry 类目

---

## §11 质检关卡（概览，可勾选项见 [QC 清单](Checklist-Tarot-新手指南-QC.md)）

- **关卡 0 合规前置门**：grep 黑名单 + §7A；mental-health/for-others 篇全审；强制免责标签原文存在
- **关卡 1 数据层取值一致**：M2 步骤 / M3 水晶 与数据层一致（生产中禁临时换）
- **关卡 2 每步实操 + 为什么**（防扁平抄竞品）：M2 落实操+为什么非扁平步名清单
- **关卡 3 水晶反思辅助口径**：M3 非万能论；crystal_role 原文采用
- **关卡 4 步骤间不雷同**（防同篇内步骤雷同）：5-7 步的"为什么"和"常见错"互不重复
- **关卡 5 拒绝"如何算准"口径**：how-to 是注意力/反思练习，不是"算准方法"
- **关卡 6 东方锚点具体**：非万能句；每篇东方锚点不同（13 篇锚点互不重复）
- **关卡 7 自由意志免责**：M6/M7 含免责（前半一致 + 后半该篇）
- **关卡 8 语义去重 + 结构指纹**：M2/M3 embedding 余弦 < 0.85；强制免责段排除相似度；结构指纹 < 40%；人工连读 5-10 篇

---

## §12 与其他框架边界

- **牌阵框架**：写牌阵本身的教学；新手指南链回牌阵页（如 how-to-read 链 PPF 牌阵）
- **牌义页框架**：写牌的普适意义；新手指南 `tarot-card-meanings-list` 是聚合清单页，链回 78 张牌义页
- **是与否框架**：写单牌×问题判定；新手指南不讲单牌判定，链回是与否页
- **Minor Arcana 框架**：写 56 张小牌深度；新手指南 `major-vs-minor-arcana` 是分工导引页，链回 Minor 牌义页

---

## 附录：三层架构

| 层 | 文件 | 用途 | 给谁 |
|---|---|---|---|
| 母框架 | 本档 | 策略 / 合规 / QC 逻辑标准 | 决策 / 合规审 |
| 生产 Brief | [Brief-Tarot-新手指南-生产执行版.md](Brief-Tarot-新手指南-生产执行版.md) | 单篇生成模板（字段 + 模块填空） | 写手 / AI 生产 |
| QC 清单 | [Checklist-Tarot-新手指南-QC.md](Checklist-Tarot-新手指南-QC.md) | 可勾选检查项 | 审核 |
| 数据层 | `13.tarot/configs/beginner/beginner-knowledge.json` | 13 篇新手指南矩阵（第一交付物） | 写作源头 |
