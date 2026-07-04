# Minor 牌义文章 · QC 清单 v1

> 审核用，只保留可勾选项。策略依据见 [母框架](模板-Tarot-Minor牌义框架.md)，生产填法见 [生产 Brief](Brief-Tarot-Minor牌义-生产执行版.md)。

---

## 关卡 0 合规前置（Swords 阴影牌 + Five of Pentacles 全审）⭐⭐⭐

- [ ] grep 黑名单无断言式命中（`curse`/`bad omen`/`evil`/`will predict`/`destined`/`guaranteed` 作断言；反例否定语境 OK）
- [ ] **Three / Nine / Ten of Swords**：M3 + FAQ 不医疗化（不诊断失眠/焦虑/抑郁为疾病）
- [ ] **Three / Nine / Ten of Swords**：水晶不承诺疗效（如 Amethyst 仅"traditionally placed under pillow"，非治疗承诺）
- [ ] **Five of Pentacles**：M7 finances + FAQ 不投资建议、不承诺脱贫、含 "seek qualified support where appropriate"
- [ ] 全篇逆位用 shadow aspect / invitation to reflect 口径

## 关卡 1 archetype / progression 独有（防模板感）

- [ ] 数字牌：M-Progression 落该数字 × 该花色独有（Four of Wands ≠ Four of Cups ≠ Four of Swords ≠ Four of Pentacles）
- [ ] 宫廷牌：M-Archetype 落该角色 × 该花色独有（Page of Wands ≠ Page of Cups ≠ Page of Swords ≠ Page of Pentacles）
- [ ] 宫廷牌：as feelings / as a person 落该牌独有人物（非通用"young person"）

## 关卡 2 禁照抄 Biddy / Labyrinthos

- [ ] M2 落独有论证 + Rider-Waite 画面（非速答关键词清单）
- [ ] M8 Eastern 段有（竞品无，是我们差异化）

## 关卡 3 M7 三段落该牌独有

- [ ] love / career / finances 三段从 `minor-knowledge.json` 取（非泛化通用句）
- [ ] 正逆位各一套（6 段），对标 Labyrinthos

## 关卡 4 水晶口径 + slug 对齐

- [ ] 水晶口径 = 反思辅助（"not to change the verdict"/"supports the energy {Card} asks for"）
- [ ] 5 角色 slug 全带 `-meaning` 对齐 390 库（`quartz-meaning` 非 `quartz`，`lapis-meaning` 非 `lapis-lazuli-meaning`）

## 关卡 5 语义去重（批量审）

- [ ] 同花色 14 张连读不可互换
- [ ] 同数字 4 张连读不可互换（如 Four of Wands/Cups/Swords/Pentacles）
- [ ] 同角色 4 张连读不可互换（如 Page of Wands/Cups/Swords/Pentacles）
- [ ] M2/M7 embedding 余弦 < 0.85
- [ ] 强制免责段（若有）排除相似度计算

## 关卡 6 完成性（防假完成）

- [ ] 线上 post 存在（`status=any` REST，非 curl -L 假阳性）
- [ ] 图片已上传并嵌 content（遍历 images 全字段，不只 featured）
- [ ] rank_math `focus_keyword` 已写（`{card} tarot`）
- [ ] schema Article + FAQPage + BreadcrumbList + ItemList 前端渲染验证

---

## 抽审比例

| 类型 | 比例 |
|---|---|
| Swords 阴影牌（3/9/10）+ Five of Pentacles | **全审**（合规高风险） |
| Top 20 高搜索牌（宫廷 8 + Ace 4 + 标杆） | 全审 |
| 其余数字牌 | 抽 30%（重点查 progression 独有性） |
