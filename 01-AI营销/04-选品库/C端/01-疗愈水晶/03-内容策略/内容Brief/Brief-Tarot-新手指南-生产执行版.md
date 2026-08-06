# 新手指南文章 · 生产执行版 Brief v1

> 写手 / AI 生产单篇时**只看本档**。策略 / 合规细节见 [母框架](模板-Tarot-新手指南框架.md)，审核见 [QC 清单](Checklist-Tarot-新手指南-QC.md)。
> **前置**：数据层 `beginner-knowledge.json` 已审完（母框架 §1）。生产 = **从数据层取值 → 填模块 → 自检**，不边写边判断。

---

## 1. 单篇关键字段（从数据层取）

| 字段 | 取值来源 | 示例（how-to-read-tarot） |
|---|---|---|
| URL | 数据层 `url` | /how-to-read-tarot/ |
| Title | 数据层 `title_template` | How to Read Tarot Cards: A Beginner's Complete Walkthrough (+ Crystals) |
| H1 | 数据层 `h1_template` | How to Read Tarot Cards: A Beginner's Walkthrough with Crystals |
| Primary KW | 数据层 `primary_kw` | how to read tarot cards |
| Name | 数据层 `name` | How to Read Tarot Cards (A Beginner's Complete Walkthrough) |
| Difficulty | 数据层 `difficulty` | beginner |
| Best For | 数据层 `best_for` | 完全新手第一次完整读牌 |
| SERP Evidence | 数据层 `serp_evidence` | serp_check 2026-07-03: AIO=yes, top10... |
| Competitor Structure | 数据层 `competitor_structure` | 竞品 5-7 步线性教学；无水晶实践环节 |
| Word Count Target | 数据层 `word_count_target` | 1800-2200 |
| Process Steps | 数据层 `process_steps`（数组，每步 num/name/crystal/crystal_role/anchor_practice） | 7 步 |
| Compliance Flag | 数据层 `compliance_flag` | general(低) / general(低, mental-health adjacent) / general(中, 涉他人) → 守 §7A |
| Eastern Lens | 数据层 `eastern_lens` | 三才（地-人-天） |
| Differentiation Hook | 数据层 `differentiation_hook` | 一句话 vs 竞品 |
| Internal Links | 数据层 `internal_links`（数组） | 4-5 条 |
| FAQ Seed | 数据层 `faq_seed` | 4-6 条 |
| Free Will 2nd Half | 数据层 `free_will_second_half` | 该篇差异化免责后半 |

---

## 2. 模块填空（8 核心，1500-2200 词）

| 模块 | 词数 | 填什么 | 自检 |
|---|---|---|---|
| Intro | 120-180 | 该如何学的话题钩子 + 谁该读 + 链子（含主 KW） | 含主 KW |
| **M1 Why It Matters** | 150-220 | 新手为何卡在这步 + 竞品没说的盲点 + 本篇会怎么讲 | 落 differentiation_hook |
| **M2 Step-by-Step** ⭐ | 600-900 | 每步：实操 + 为什么 + 该步常见错（5-7 步） | 非抄 biddytarot/learntarot 清单 |
| **M3 Crystals as Anchors** ⭐ | 250-400 | 每步 1 段（仅 crystal≠null 步骤）：步职能 + 水晶为何适配 + 触觉锚用法 | **反思辅助口径非万能论** |
| M4 Eastern Lens | 150-220 | 数据层 `eastern_lens` 展开（具体锚点） | 非万能句 |
| M5 Common Mistakes | 200-300 | 该话题 4-5 个新手常错（如未在 M2 嵌入则集中在此） | 不与 M2 重复 |
| M6 Free Will + Ethics（可选）| 120-180 | `compliance_flag` 含 mental-health/涉他人 时必写；其余并入 M7 | 强制免责原文 |
| M7 FAQ + Shop + Related | 200-300 | FAQ 4-6（来自 `faq_seed`）+ Shop CTA（三级降级）+ Related 内链 | 内链 4-5 条 |

**词数下限**：1200（薄内容阈值，1F §4.3）。简单 how-to 1500-1900；路径型 1800-2200；清单型 1800-2400。

**结构变体**（满足 1F §0A.3 ≥30% 打乱起承转合，避免 13 篇同骨架）：
- M6 提前到 M4 后（涉伦理的 reading-for-others / reversed-tarot-cards）
- M5 并入 M2（每步后即讲该步常见错，how-to-shuffle / how-to-cleanse / how-to-read 适用）
- 加案例/咨询师引言段（reading-tarot-for-yourself 用"为什么自读最难"的引言；daily-tarot-practice 用一个简短的晨间场景）

---

## 3. 生产顺序

1. 从数据层取该篇字段（§1 表）
2. 填 7 核心模块（M6 按 `compliance_flag` 决定；结构变体按数据层隐含的话题性质选）
3. **mental-health / for-others 篇额外步骤**（`compliance_flag` 含 mental-health adjacent / 涉他人）：
   - daily-tarot-practice（M5 reflection 段）：禁医疗承诺 + 嵌 §7A.1 强制免责标签（原文照搬）
   - reading-tarot-for-others：禁读第三方 + 禁医疗/法律/财务建议 + 嵌 §7A.2 强制免责标签（原文照搬）
4. 内链按数据层 `internal_links` 取值（4-5 条），禁临时改
5. Shop CTA 三级降级（生产前 curl 验证 category 200，404 → 搜索 → 总类目）
6. 自检 QC 清单必过项（关卡 0/1/3/5/7）
7. 输出 .md：`## Brief`(focus_keyword) + `## 正文` + `## 质检报告`

---

## 4. M3 水晶口径（反复强调，避免玄学承诺）⭐⭐⭐

水晶 = **反思辅助 + 触觉锚**，非改变结果/吸引X/净化能量的工具。
- ✅ "Selenite beside the deck is a **physical cue that you're shifting into reading mode** — not magic, just a tactile signal that helps your attention settle."
- ❌ "Selenite **clears negative energy / purifies the deck / raises vibration**"

**M3 每步 1 段（~50-90 词）模板**（仅 `crystal ≠ null` 的步骤）：
1. 该步的能量职能（接 M2）
2. 水晶为什么适配（从数据层 `crystal_role` 取，原文采用禁改写）
3. 具体触觉锚用法（从数据层 `anchor_practice` 取，原文采用禁改写）

**禁**：水晶属性堆砌（"Amethyst is a violet quartz associated with the crown chakra, composed of silicon dioxide..."——这是水晶页内容，新手指南页只讲**职能匹配 + 触觉锚**）。

**禁**：每步都堆水晶（crystal=null 的步骤 M3 段不补，避免水晶堆砌）。

---

## 5. 合规快查（mental-health / for-others 篇必看）

**mental-health adjacent 篇禁**（daily-tarot-practice M5）：cure / heal / therapy / trauma / diagnose / mental illness / `heals anxiety` / `tarot for depression` → 改 attention / awareness / pattern / body awareness / emotional pattern
**强制免责标签原文**："Tarot and journaling are reflective practices, not substitutes for mental health care — if you're struggling, please reach out to a qualified professional."

**涉他人篇禁**（reading-tarot-for-others）：读第三方 / 医疗建议 / 法律建议 / 投资建议（守 1F §0A.1 全量）→ 改 reflection / pattern / agency / consent
**强制免责标签原文**："For health, legal, or financial questions, tarot is a reflection tool — not a substitute for professional advice from a licensed provider."

两类强制免责标签**原文照搬**（见母框架 §7A.1 / §7A.2）。

**全篇禁**（"如何算准"口径）：`this step ensures your reading is accurate` / `to get an accurate reading` / `the cards predict` → 改 `this step helps your attention settle` / `the cards show patterns and energy`

---

## 6. M2 防扁平抄竞品（核心防雷）

learntarot 的 19 课、biddytarot 的 how-to、almanac/vogue/cosmopolitan 的 beginner guide 都是**步名清单**，可复制性极高。M2 必须落**实操 + 为什么**：

- ❌ 扁平："Step 1: Shuffle the cards. Step 2: Cut the deck. Step 3: Draw your cards."
- ✅ 实操+为什么："Step 1 — Settle and Frame the Question. Before you touch the deck, get clear on what you're actually asking. **Most beginners skip this and jump straight to shuffling, which is why their readings feel muddy** — the cards answer the question you actually hold, not the one you said out loud. Rephrase 'Will I get the job?' into 'What do I need to understand about this opportunity?' and the cards have room to show you something real."

**每步含义 1 段（~80-140 词）**：实操 + 为什么 + （可选）该步常见错。

**每步必含**：
1. **该步做什么**（动词+具体动作，非"consider the question"）
2. **为什么这步重要**（接竞品没讲的盲点）
3. **该步常见错**（可嵌入此步或集中放 M5，二选一）

---

## 7. M4 东方锚点（防万能句）

每篇东方锚点来自数据层 `eastern_lens`，**展开 1-2 段，禁万能句**：
- ❌ "In Eastern traditions, crystals are used for healing."（1F §0A.2 黑名单）
- ✅ "The 7 steps of this walkthrough map onto the Daoist 三才 (Three Realms): 地 (Earth) — the settling and question-framing of step 1, the soil you're reading from. 人 (Human) — the drawing and reading of steps 2–6, where your agency lives. 天 (Heaven) — the closing reflection of step 7, the space you leave for meaning to surface. Smoky Quartz at the close echoes 地, grounding what surfaced; Selenite at the start clears the soil so the question can take root."

**每篇东方锚点不同**（防跨篇雷同）：见数据层 `eastern_lens` 字段（三才/入门三宝/结缘+开光/调息/拂尘+开光/本末+经纬/安处+藏/晨课+时辰/省察+观照/止观/阴面/对应/分位+不越界，13 篇锚点互不重复）。

---

## 8. 输出格式

每篇 .md 文件结构：
```
## Brief
- focus_keyword: {primary_kw}
- title / h1 / URL
- word_count_target / difficulty / best_for
- compliance_flag

## 正文
{7 模块完整正文，含 H2 分段；M6 按需}

## 质检报告
- 关卡 0 合规：PASS/FAIL（grep 结果）
- 关卡 1 数据层一致：PASS
- 关卡 3 水晶反思辅助口径：PASS
- 关卡 5 拒绝"如何算准"口径：PASS
- 关卡 7 免责存在：PASS
- 字数：{N}
- 内链数：{N}
```
