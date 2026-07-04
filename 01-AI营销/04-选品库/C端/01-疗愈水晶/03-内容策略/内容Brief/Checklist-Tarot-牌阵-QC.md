# 牌阵教学文章 · QC 清单 v1

> 审核用，只保留可勾选项。策略依据见 [母框架](模板-Tarot-牌阵框架.md)，生产填法见 [生产 Brief](Brief-Tarot-牌阵-生产执行版.md)。

---

## 关卡 0 合规前置门（Health/Finances 阵全审，命中即打回）⭐⭐⭐

- [ ] grep 黑名单无命中（`will predict` / `destined` / `guaranteed` / `definitely` / `curse` / `bad omen` / `doomed`）
- [ ] 全阵无事件预言口径（`this position tells you what will happen` / `the cards predict`）
- [ ] Health 阵（mind-body-spirit Body 位）：verdict 无 `cure / heal / recovery / surgery / diagnose / illness`
- [ ] Health 阵：强制免责标签原文存在（"For health questions, this reading is a reflection prompt, not medical advice..."）
- [ ] Finances 阵（money-spread）：verdict 无 `investment / stock / crypto / lending / you will gain / guaranteed return / attract wealth quickly`
- [ ] Finances 阵：强制免责标签原文存在（"For money questions, this reading is symbolic, not investment advice..."）
- [ ] Health/Finances 阵 verdict 改能量/觉察口径（非医疗/投资判定）

## 关卡 1 数据层取值一致

- [ ] M2 每位含义与数据层 `positions[].meaning` 一致（生产中禁临时改）
- [ ] M3 每位水晶 slug 与数据层 `positions[].crystal` 一致
- [ ] Title/H1/primary_kw 与数据层 template 一致
- [ ] URL = `{spread-slug}/`（根级 post）

## 关卡 2 每位能量质地（防扁平抄竞品）⭐

- [ ] M2 每位含义落**能量质地**（非 Labyrinthos 风格的扁平位名清单）
- [ ] 每位含 Major vs Minor 的不同含义（深度）
- [ ] 复杂阵（Celtic Cross / horseshoe / year-ahead）含卡间动力学（Above vs Below / Above vs Outcome / Future vs Outcome / Below vs Hopes-Fears / Advice vs Outcome 至少 3 组对比）

## 关卡 3 水晶反思辅助口径（差异化护城河）⭐⭐⭐

- [ ] M3 每位水晶段为**反思辅助 + 触觉锚**口径（`helps you stay grounded` / `tactile cue` / `reminder to`）
- [ ] **禁**万能论（`clears the past` / `attracts love` / `manifests wealth` / `releases karma`）
- [ ] M3 每位段含具体触觉锚用法（hold on position / place under card / set beside spread）
- [ ] M3 不堆砌水晶属性（颜色/脉轮/化学式——这是水晶页内容）
- [ ] `crystal_role` 字段原文采用（非改写为万能论）

## 关卡 4 卡间动力学（复杂阵）

- [ ] Celtic Cross / horseshoe / year-ahead 等复杂阵 M2 或 M4 含卡间对比读法
- [ ] 卡间对比有实质信息（非"compare card X and Y"空话）

## 关卡 5 拒绝事件预言 ⭐

- [ ] Past 位是"能量/模式"口径（非"发生的事件"）
- [ ] Present 位是"当下能量状态"（非"正在发生的事"）
- [ ] Future / Outcome 位是"可能性/倾向"（非"将发生的事件"）+ 强调自由意志可改变

## 关卡 6 东方锚点具体

- [ ] M5 东方锚点具体（三才/阴阳/五方/因-缘-果/七曜/十二月将/朔望/三宝/气机/舍/愿力，来自数据层 `eastern_lens`）
- [ ] **禁**万能句（"Eastern traditions use crystals for healing"）
- [ ] 每阵东方锚点**不同**（防跨阵雷同）

## 关卡 7 自由意志免责存在性

- [ ] M7 含免责前半（全站一致）："Tarot spreads are a mirror for reflection, not a fixed forecast — the positions show energy, and you always have free will to choose your next step."
- [ ] M7 含免责后半（该阵差异化）："For the {Name}, the cards may point to {该阵倾向}, but how you act on what you see is your choice."

## 关卡 8 语义去重 + 结构指纹（批量审）

- [ ] M2/M3 embedding 余弦 < 0.85（同主题牌阵之间重点查：如多个 3-card 变体之间 / 多个 love 类牌阵之间）
- [ ] **强制免责段（关卡 7 两句原文）已排除相似度计算**（合规标签重复 ≠ 重复内容）
- [ ] 结构指纹重复率 < 40%（M2 每位开场句式 + M3 触觉锚句式不雷同）
- [ ] ≥ 30% 篇打乱起承转合（M5 提前 / M6 并入 M4 / 加案例引言段等）
- [ ] 人工连读：同主题 5-10 篇"换牌阵名能否互换" = 不能

## 关卡 9 完成性（防假完成）

- [ ] 线上 post 存在（`status=any` REST 查，非 curl -L 假阳性）
- [ ] 图片已上传并嵌 content（牌阵布局图 + 水晶图，遍历 images 全字段）
- [ ] rank_math `focus_keyword` 已写（`{primary_kw}`）
- [ ] schema Article + FAQPage + BreadcrumbList 前端渲染验证（禁 Product 前端渲染）
- [ ] Shop CTA 三级降级验证（curl category 200，404 → 搜索 → 总类目，无死链）
- [ ] 内链 3-5 条（锚文本含主 KW 变体，无 "click here"）

## 关卡 10 字数深度

- [ ] 简单阵（1-3 牌）≥ 1500 词
- [ ] 复杂阵（Celtic Cross 10 / Year Ahead 12）≥ 2200 词
- [ ] 下限 1200（薄内容阈值）

---

## 抽审比例

| 类型 | 比例 |
|---|---|
| Health 阵（mind-body-spirit）/ Finances 阵（money-spread）| **全审**（合规风险最高） |
| P1 pilot 5 篇（PPF / Celtic Cross / yes-no / love / mind-body-spirit） | 全审（验证框架） |
| P1 high 5 篇 | 抽 50% |
| P2 mid + long tail（15 篇） | 抽 20% |
| 3-card 变体组（PPF / MBS / SAO / yes-no / truth-or-lie 等多位 3 牌） | 人工连读重点（最易撞文） |
| Love 类组（love / relationship / twin-flame / self-love） | 人工连读重点 |
