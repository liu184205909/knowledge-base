# 牌阵教学文章 · 生产执行版 Brief v1

> 写手 / AI 生产单篇时**只看本档**。策略 / 合规细节见 [母框架](模板-Tarot-牌阵框架.md)，审核见 [QC 清单](Checklist-Tarot-牌阵-QC.md)。
> **前置**：数据层 `spreads-knowledge.json` 已审完（母框架 §1）。生产 = **从数据层取值 → 填模块 → 自检**，不边写边判断。

---

## 1. 单篇关键字段（从数据层取）

| 字段 | 取值来源 | 示例（PPF） |
|---|---|---|
| URL | 规则 `{spread-slug}/` | `/three-card-past-present-future/` |
| Title | 数据层 `title_template` | Past, Present, Future Tarot Spread: How to Read It (+ Crystals for Each Position) |
| H1 | 数据层 `h1_template` | The Past-Present-Future Tarot Spread: A Beginner's Guide with Crystals |
| Primary KW | 数据层 `primary_kw` | past present future tarot spread |
| Name | 数据层 `name` | Past-Present-Future Spread |
| Card Count | 数据层 `card_count` | 3 |
| Layout | 数据层 `layout` | linear |
| Difficulty | 数据层 `difficulty` | beginner |
| Best For | 数据层 `best_for` | 新手第一牌阵；快速状态检查 |
| Positions | 数据层 `positions`（数组，每位 num/name/meaning/crystal/crystal_role） | 3 位 |
| Yes/No | 数据层 `yes_no_applicable` + `yes_no_method` | true + 正位多→顺 |
| Compliance Flag | 数据层 `compliance_flag` | general(低) / health(极高) / finances(极高) → 守 §7A |
| Eastern Lens | 数据层 `eastern_lens` | 三才阵（天-地-人） |
| Differentiation Hook | 数据层 `differentiation_hook` | 每位能量质地 + 水晶 |
| Internal Links | 母框架 §9 配方 | 3-5 条 |

---

## 2. 模块填空（8 核心，1500-2200 词）

| 模块 | 词数 | 填什么 | 自检 |
|---|---|---|---|
| Intro | 120-180 | 该阵一句话定位 + 谁该用 + 钩子（含主 KW） | 含主 KW |
| **M1 When to Use** | 150-220 | 该阵最适用的情境 + 何时不该用（如复杂问题用 Celtic Cross 而非 3-card） | 落 best_for |
| **M2 The Positions** ⭐ | 400-600 | 每位含义（**能量质地**非扁平位名）+ 复杂阵加卡间动力学 | 非抄 Labyrinthos 清单 |
| **M3 Crystals per Position** ⭐ | 250-400 | 每位 1 段：位职能 + 水晶为何适配 + 具体触觉锚用法 | **反思辅助口径非万能论** |
| M4 How to Read | 200-300 | 抽牌 → 摆牌 → 读牌流程；建议从左到右 / 整体故事 | 实操可跟 |
| M5 Eastern Lens | 150-220 | 数据层 `eastern_lens` 展开（具体锚点） | 非万能句 |
| M6 Yes/No（可选）| 120-180 | 仅 `yes_no_applicable:true` 时写；用 `yes_no_method` | conditional 口径 |
| M7 Mistakes + Free Will | 150-220 | 该阵常见误读 + 强制免责（前半一致 + 后半该阵） | 免责原文存在 |
| M8 FAQ + Shop + Related | 200-300 | FAQ 3-5 + Shop CTA（三级降级）+ Related 内链 | 内链 3-5 条 |

**词数下限**：1200（薄内容阈值，1F §4.3）。简单阵 1500-1800；复杂阵（Celtic Cross / Year Ahead）2200-2500。

---

## 3. 生产顺序

1. 从数据层取该篇字段（§1 表）
2. 填 8 核心模块（M6 按标记决定）
3. **Health/Finances 阵额外步骤**（`compliance_flag` 含 health/finances）：
   - Health 阵（mind-body-spirit 的 Body 位）：verdict 改能量/觉察口径 + 嵌 §7A.1 强制免责标签（原文照搬）
   - Finances 阵（money-spread）：verdict 改 mindset/spending pattern 口径 + 嵌 §7A.2 强制免责标签（原文照搬）
4. 内链按母框架 §9 配方填 3-5 条
5. Shop CTA 三级降级（生产前 curl 验证 category 200，404 → 搜索 → 总类目）
6. 自检 QC 清单必过项（关卡 0/1/3/5/7）
7. 输出 .md：`## Brief`(focus_keyword) + `## 正文` + `## 质检报告`

---

## 4. M3 水晶口径（反复强调，避免玄学承诺）⭐⭐⭐

水晶 = **反思辅助 + 触觉锚**，非改变结果/吸引X 的工具。
- ✅ "Smoky Quartz here helps you **stay grounded while you look at old patterns** — a tactile cue to keep you present rather than spiraling."
- ❌ "Smoky Quartz **clears the past / releases karma / attracts new beginnings**"

**M3 每位 1 段（~50-80 词）模板**：
1. 该位的能量职能（接 M2 含义）
2. 水晶为什么适配（从数据层 `crystal_role` 取，原文采用）
3. 具体触觉锚用法（"hold it on that position as you read" / "place it under the card" / "set it beside the spread as you read each position"）

**禁**：水晶属性堆砌（"Smoky Quartz is a grounding stone associated with the root chakra..."——这是水晶页内容，牌阵页只讲**职能匹配**）。

---

## 5. 合规快查（Health/Finances 阵必看）

**Health 阵禁**：cure / heal / recovery / surgery / diagnose / illness / `will be ill` → 改 energy / rest / stress / check-in / body awareness
**Finances 阵禁**：investment / stock / crypto / lending / `you will gain` / `guaranteed return` → 改 money mindset / risk awareness / spending pattern

两类强制免责标签**原文照搬**（见母框架 §7A.1 / §7A.2）。

**全阵禁**（事件预言口径）：`this position tells you what will happen` / `the cards predict` → 改 `this position shows energy patterns / possibilities / tendencies`

---

## 6. M2 防扁平抄竞品（核心防雷）

Labyrinthos 的 3-card 18 种表是**位名清单**（Past / Present / Future 一字排开），可复制性极高。M2 必须落**能量质地**：

- ❌ 扁平："Position 1 is the Past. Position 2 is the Present. Position 3 is the Future."
- ✅ 质地："Position 1 — the Past — shows the **energy that shaped where you are now**: not just events, but the **patterns and old energy you're still carrying**. A Major Arcana card here suggests the past is still actively running the show."

**每位含义 1 段（~80-120 词）**：能量职能 + 该位 Major vs Minor 的不同含义 + （复杂阵）与其他位的对比读法。

**复杂阵卡间动力学**（Celtic Cross / horseshoe / year-ahead 等）必含：参照 Biddy，对比 Above vs Below / Above vs Outcome / Future vs Outcome / Below vs Hopes-Fears / Advice vs Outcome——**这是竞品多缺的深度**。

---

## 7. M5 东方锚点（防万能句）

每阵东方锚点来自数据层 `eastern_lens`，**展开 1-2 段，禁万能句**：
- ❌ "In Eastern traditions, crystals are used for healing."（1F §0A.2 黑名单）
- ✅ "The Past-Present-Future spread maps neatly onto the Daoist 三才 (Three Realms): 地 (Earth/past, what's already formed), 人 (Human/present, where your agency lives), 天 (Heaven/future, what's still taking shape). Smoky Quartz on the past position echoes 地 — grounding what's already solid — while Moonstone on the future echoes 天, the soft receiving of what's forming."

**每阵东方锚点不同**（防跨阵雷同）：见数据层 `eastern_lens` 字段（三才/阴阳/五方/因-缘-果/七曜/十二月将/朔望/三宝/气机/舍/愿力）。

---

## 8. 输出格式

每篇 .md 文件结构：
```
## Brief
- focus_keyword: {primary_kw}
- title / h1 / URL
- card_count / difficulty / best_for
- compliance_flag

## 正文
{8 模块完整正文，含 H2 分段}

## 质检报告
- 关卡 0 合规：PASS/FAIL（grep 结果）
- 关卡 1 数据层一致：PASS
- 关卡 3 水晶反思辅助口径：PASS
- 关卡 5 拒绝事件预言：PASS
- 关卡 7 免责存在：PASS
- 字数：{N}
- 内链数：{N}
```
