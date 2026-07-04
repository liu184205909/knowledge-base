# 是与否文章 · 生产执行版 Brief v1

> 写手 / AI 生产单篇时**只看本档**。策略 / 合规细节见 [母框架](模板-Tarot-是与否框架.md)，审核见 [QC 清单](Checklist-Tarot-是与否-QC.md)。
> **前置**：判定矩阵 `yes-no-knowledge.json` 已审完（母框架 §0）。生产 = **从矩阵取值 → 填模块 → 自检**，不边写边判断。

---

## 1. 单篇关键字段（从矩阵取）

| 字段 | 取值来源 | 示例 |
|---|---|---|
| URL | 规则 `is-{card}-yes-or-no-{question}/` | `/is-the-fool-yes-or-no-love/` |
| Title | `Is {Card} a Yes or No Card? (For {Question})` | Is The Fool a Yes or No Card? (For Love) |
| H1 | `Is {Card} a Yes or No Card for {Question}?` | |
| Card | 矩阵 `card` | the-fool |
| Question Type | 矩阵 `question_type` | love |
| Overall Verdict | 矩阵 `overall_verdict` | conditional |
| Specific Verdict | 矩阵 `specific_verdict` | conditional yes（opening）/ no（red flags） |
| Core Reason | 矩阵 `core_reason` | leap-of-faith favors opening... |
| Shift Condition | 矩阵 `shift_condition` | stronger yes if eyes open... |
| Crystal | 矩阵 `crystal` | rose-quartz |
| Compliance Flag | 矩阵 `compliance_flag` | love(中)→正常 / health·finances→守 §7A |
| Common Mistakes | 矩阵 `common_mistakes` | true→写 O2 / false→跳过 |
| Internal Links | 母框架 §9 配方 | 3-5 条 |

---

## 2. 模块填空（6 核心 + 2 可选，1200-1800 词）

| 模块 | 词数 | 填什么 | 自检 |
|---|---|---|---|
| Intro | 120-180 | 该牌 yes/no 总体倾向 + 该问题钩子 | 含主 KW |
| M1 Quick Answer | 80-120 | 三档判定 + 条件（Snippet bait） | 档位明确 |
| **M2 Overall Tendency** | 280-380 | 该牌总体倾向 + 为什么（独有论证） | 非照抄 Selfgaze |
| **M3 For {Question}** | 280-380 | 该问题特殊判定（可与 M2 不同） | 落该问题独有 |
| M4 What Would Shift It | 150-220 | 转化条件 + 水晶（反思辅助口径） | 水晶非改结果 |
| M5 Free Will + FAQ | 150-220 | 免责（前半一致 + 后半该牌）+ FAQ 2-3 | 免责原文存在 |
| O1 Upright/Reversed | 150-220 | 可选；逆位关键牌独立，否则并入 M2/M3 | |
| O2 Common Mistakes | 100-160 | 可选；仅矩阵 `common_mistakes:true` 时写 | |

---

## 3. 生产顺序

1. 从矩阵取该篇字段（§1 表）
2. 填 6 核心模块（O1/O2 按矩阵标记决定）
3. **Health/Finances 篇额外步骤**（仅当矩阵含此问题类型时）：verdict 改能量/觉察口径 + 嵌强制免责标签（§7A 原文照搬）
   > **注**：当前 `yes-no-knowledge.json` 矩阵 question_types 仅 `love/career/decision/timing/move-or-stay`，**不含 health/finances** —— 本批生产不触发此步骤，§7A 规则保留供未来扩展这两类问题时启用。
4. 内链按母框架 §9 配方填 3-5 条
5. 自检 QC 清单 5 个必过项（关卡 0/1/2/4/5）
6. 输出 .md：`## Brief`(focus_keyword) + `## 正文` + `## 质检报告`

---

## 4. 水晶口径（反复强调，避免玄学承诺）

水晶 = **反思辅助**，非改结果工具。
- ✅ "Use Rose Quartz to support the open-heartedness The Fool asks for"
- ❌ "Wear Rose Quartz to turn this into a yes"

---

## 5. 合规快查（Health/Finances 篇必看）

**Health 篇 verdict 禁**：cure / heal / recovery / surgery / diagnose / illness → 改 energy / rest / stress / check-in / body awareness
**Finances 篇 verdict 禁**：investment / stock / crypto / lending / gain / return → 改 money mindset / risk awareness / spending pattern

两类强制免责标签**原文照搬**（见母框架 §7A.1 / §7A.2）。
