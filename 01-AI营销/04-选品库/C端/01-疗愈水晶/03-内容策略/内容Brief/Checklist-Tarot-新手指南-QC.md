# 新手指南文章 · QC 清单 v1

> 审核用，只保留可勾选项。策略依据见 [母框架](模板-Tarot-新手指南框架.md)，生产填法见 [生产 Brief](Brief-Tarot-新手指南-生产执行版.md)。

---

## 关卡 0 合规前置门（mental-health / for-others 篇全审，命中即打回）⭐⭐⭐

- [ ] grep 黑名单无命中（`will predict` / `accurate reading` / `destined` / `guaranteed` / `definitely` / `curse` / `bad omen` / `doomed` / `cursed`）
- [ ] 全篇无"如何算准"口径（`this step ensures your reading is accurate` / `to get an accurate reading` / `the cards predict`）
- [ ] mental-health adjacent 篇（daily-tarot-practice M5）：verdict 无 `cure / heal / therapy / trauma / diagnose / mental illness / heals anxiety / tarot for depression`
- [ ] mental-health adjacent 篇：强制免责标签原文存在（"Tarot and journaling are reflective practices, not substitutes for mental health care..."）
- [ ] 涉他人篇（reading-tarot-for-others）：无读第三方内容（`reading for absent husband` / `third party`）/ 无医疗法律财务建议
- [ ] 涉他人篇：强制免责标签原文存在（"For health, legal, or financial questions, tarot is a reflection tool..."）
- [ ] 反位篇（reversed-tarot-cards）：无凶兆口径（`reversed = bad` / `curse` / `misfortune`）
- [ ] mental-health / for-others 篇 verdict 改反思/觉察口径（非医疗/他人决定）

## 关卡 1 数据层取值一致

- [ ] M2 步骤数与数据层 `process_steps` 一致（生产中禁临时增减步）
- [ ] M3 每步水晶 slug 与数据层 `process_steps[].crystal` 一致
- [ ] crystal=null 的步骤在 M3 段**不补**水晶（避免水晶堆砌）
- [ ] Title/H1/primary_kw/URL 与数据层 template 一致
- [ ] URL = `{beginner-slug}/`（根级 post）

## 关卡 2 每步实操 + 为什么（防扁平抄竞品）⭐

- [ ] M2 每步含义落**实操 + 为什么**（非 biddytarot/learntarot 风格的扁平步名清单）
- [ ] 每步含动词+具体动作（非抽象"consider the question"）
- [ ] 每步含"为什么这步重要"（接竞品没讲的盲点）
- [ ] 每步的"该步常见错"已嵌入此步或集中放 M5（二选一，不重复）

## 关卡 3 水晶反思辅助口径（差异化护城河）⭐⭐⭐

- [ ] M3 每步水晶段为**反思辅助 + 触觉锚**口径（`tactile cue` / `physical anchor` / `reminder to` / `helps you stay`）
- [ ] **禁**万能论（`clears negative energy` / `purifies the deck` / `raises vibration` / `attracts love` / `protects you from`）
- [ ] M3 每步段含具体触觉锚用法（hold in non-dominant hand / place beside deck / set on card / carry in pocket）
- [ ] M3 不堆砌水晶属性（颜色/脉轮/化学式——这是水晶页内容）
- [ ] `crystal_role` + `anchor_practice` 字段原文采用（非改写为万能论）

## 关卡 4 步骤间不雷同（防同篇内步骤雷同）

- [ ] M2 5-7 步的"为什么"互不重复（如 step1 为什么=提问 framing；step2 为什么=注意力；step3 为什么=看见 vs 期待）
- [ ] M2 5-7 步的"该步常见错"互不重复（如 step1 错=问太具体；step2 错=边洗边想答案；step3 错=只看牌面忽略位置）
- [ ] M3 每步水晶的职能匹配**不同**（如同篇内 amethyst 和 smoky-quartz 角色不能互换）

## 关卡 5 拒绝"如何算准"口径 ⭐

- [ ] 全篇无"如何算准"标题/段（"How to Get an Accurate Tarot Reading" 禁用）
- [ ] 洗牌步骤是"注意力练习"口径（非"洗得准 = 算得准"）
- [ ] 提问步骤是"开放问题让牌有空间"口径（非"对的问题导致对的答案"）
- [ ] 净化步骤是"意图的物化"口径（非"净化彻底 = 准"）

## 关卡 6 东方锚点具体

- [ ] M4 东方锚点具体（三才/入门三宝/结缘+开光/调息/拂尘+开光/本末+经纬/安处+藏/晨课+时辰/省察+观照/止观/阴面/对应/分位+不越界，来自数据层 `eastern_lens`）
- [ ] **禁**万能句（"Eastern traditions use crystals for healing"）
- [ ] 每篇东方锚点**不同**（13 篇锚点互不重复，防跨篇雷同）

## 关卡 7 自由意志免责存在性

- [ ] M6/M7 含免责前半（全站一致）："Tarot is a tool for reflection, not a fixed forecast — the cards show energy and patterns, and you always have free will to choose your next step."
- [ ] M6/M7 含免责后半（该篇差异化，来自数据层 `free_will_second_half`）

## 关卡 8 语义去重 + 结构指纹（批量审）

- [ ] M2/M3 embedding 余弦 < 0.85（同类型之间重点查：如多个 how-to 之间 / 多个设备指南之间）
- [ ] **强制免责段（关卡 7 两句原文）已排除相似度计算**（合规标签重复 ≠ 重复内容）
- [ ] 结构指纹重复率 < 40%（M2 每步开场句式 + M3 触觉锚句式不雷同）
- [ ] ≥ 30% 篇打乱起承转合（M6 提前 / M5 并入 M2 / 加案例引言段等，见母框架 §3 变体）
- [ ] 人工连读：同类型 5-10 篇"换话题能否互换" = 不能

## 关卡 9 完成性（防假完成）

- [ ] 线上 post 存在（`status=any` REST 查，非 curl -L 假阳性）
- [ ] 图片已上传并嵌 content（如有：步骤示意图 / 水晶图，遍历 images 全字段）
- [ ] rank_math `focus_keyword` 已写（`{primary_kw}`）
- [ ] schema Article + FAQPage + BreadcrumbList 前端渲染验证（禁 Product 前端渲染）
- [ ] Shop CTA 三级降级验证（curl category 200，404 → 搜索 → 总类目，无死链）
- [ ] 内链 4-5 条（锚文本含主 KW 变体，无 "click here"）

## 关卡 10 字数深度

- [ ] 简单 how-to（shuffle / cleanse / store）≥ 1500 词
- [ ] 路径型（how-to-read / for-beginners）≥ 1800 词
- [ ] 清单型（meanings-list，78 牌铺开）≥ 1800 词
- [ ] 下限 1200（薄内容阈值）

---

## 抽审比例

| 类型 | 比例 |
|---|---|
| mental-health adjacent 篇（daily-tarot-practice）| **全审**（M5 reflection 段合规风险最高） |
| 涉他人篇（reading-tarot-for-others）| **全审**（他人 autonomy + 易触 Health/Finances 黑名单） |
| 反位篇（reversed-tarot-cards）| 全审（禁凶兆口径是核心合规点） |
| P1 pilot 3 篇（how-to-read / for-beginners / first-deck） | 全审（验证框架） |
| P1 high 4 篇（shuffle / cleanse / meanings-list / store） | 抽 50% |
| P2 6 篇 | 抽 20% |
| how-to 类组（how-to-read / how-to-shuffle / how-to-cleanse） | 人工连读重点（最易撞文） |
| 设备指南类组（first-deck / store） | 人工连读重点 |
