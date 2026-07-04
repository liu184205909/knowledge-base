# 是与否文章 · QC 清单 v1

> 审核用，只保留可勾选项。策略依据见 [母框架](模板-Tarot-是与否框架.md)，生产填法见 [生产 Brief](Brief-Tarot-是与否-生产执行版.md)。

---

## 关卡 0 合规前置门（Health/Finances 全审，命中即打回）⭐⭐⭐

- [ ] grep 黑名单无命中（`will predict` / `destined` / `guaranteed yes` / `definitely no` / `curse` / `bad omen`）
- [ ] Health 篇：verdict 无 `cure / heal / recovery / surgery / diagnose / illness`
- [ ] Health 篇：强制免责标签原文存在（"For health questions, this reading is a reflection prompt, not medical advice..."）
- [ ] Finances 篇：verdict 无 `investment / stock / crypto / lending / you will gain / guaranteed return`
- [ ] Finances 篇：强制免责标签原文存在（"For money questions, this reading is symbolic, not investment advice..."）
- [ ] Health/Finances 篇 verdict 改能量/觉察口径（非医疗/投资判定）

## 关卡 1 三档判定

- [ ] M1/M2/M3 三档判定明确（Strong Yes / Conditional / Strong No）
- [ ] 每档有"为什么"（archetype + 正逆位依据）

## 关卡 2 禁照抄 Selfgaze

- [ ] M2 与 Selfgaze 速答清单相似度 < 30%

## 关卡 3 问题类型差异化

- [ ] M3 该问题判定落该问题独有
- [ ] M3 可与 M2 总体不同（有依据，非复制）

## 关卡 4 免责存在性

- [ ] M5 含自由意志免责（前半全站一致 + 后半该牌差异化）

## 关卡 5 合规禁词

- [ ] grep `will predict` / `destined` / `guaranteed` / `curse` / `bad omen` 全无

## 关卡 6 语义去重 + 结构指纹（批量审）

- [ ] M2/M3 embedding 余弦 < 0.85（同档位同问题组重点查）
- [ ] **强制免责段（§7/§7A 两句原文）已排除相似度计算**（合规标签重复 ≠ 重复内容）
- [ ] 结构指纹重复率 < 40%
- [ ] ≥ 30% 篇打乱起承转合
- [ ] 人工连读：同问题类型 5-10 篇"换牌名能否互换" = 不能

## 关卡 7 完成性（防假完成）

- [ ] 线上 post 存在（`status=any` REST 查，非 curl -L 假阳性）
- [ ] 图片已上传并嵌 content（遍历 images 全字段，不只 featured）
- [ ] rank_math `focus_keyword` 已写（`{card} yes or no`）
- [ ] schema Article + FAQPage + BreadcrumbList 前端渲染验证

---

## 抽审比例

| 类型 | 比例 |
|---|---|
| Health / Finances 问题页 | **全审**（5 类里风险最高，错一篇即违规） |
| 强 yes / no 高权重牌 | 全审 |
| Conditional 牌 | 抽 30% |
| 其余 | 抽 20% |
