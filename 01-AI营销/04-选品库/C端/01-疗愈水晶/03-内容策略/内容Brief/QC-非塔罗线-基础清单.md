# 非塔罗线 · 基础 QC 清单 v1

> **用途**：所有非塔罗内容类型的发布前质检。每篇文章发布前过一遍，勾完才能 publish。
> **适用范围**：Crystal Meaning / Condition / Zodiac / Chakra / Color / Element / Combinations / Angel Numbers / Numerology / Chinese Zodiac / Meditation / Astrology / How-to / Authenticity / MBTI×Tarot。
> **塔罗线**（是与否/Minor/牌阵/新手指南/场景/配对）用各自的独立 QC 清单（10 关卡版）。
> **策略依据**：[内容策略.md §3.5-3.6](../内容策略.md) + [品牌语调配置.md §4 合规禁用词](../品牌语调配置.md)

---

## 关卡 0 合规前置门（命中即打回）⭐⭐⭐

- [ ] **禁用词检查**：grep 黑名单全无（`cure` / `heal` / `treat` / `diagnose` / `guarantee` / `destined` / `curse` / `bad omen` / `will predict`）
- [ ] **医疗免责**：涉及 Health/Anxiety/Sleep 等功效页，强制免责标签原文存在（"This information is for spiritual reflection, not medical advice..."）
- [ ] **投资免责**：涉及 Wealth/Money/Success 等功效页，强制免责标签原文存在（"This is symbolic guidance, not financial advice..."）
- [ ] **MBTI 商标**：MBTI 相关文章含 disclaimer（"MBTI® and Myers-Briggs Type Indicator® are trademarks of..."）
- [ ] **品牌禁用词**：对照 [品牌语调配置.md §4](../品牌语调配置.md) 逐项检查

## 关卡 1 关键词与意图校验

- [ ] **目标关键词**：rank_math `focus_keyword` 已写，且与 Brief 中声明的目标词一致
- [ ] **搜索意图**：内容匹配搜索意图（Informational / Navigational / Commercial / Transactional）
- [ ] **关键词密度**：目标关键词在文中出现 3-8 次（不过度堆砌）
- [ ] **Title 含关键词**：`<title>` 自然包含目标关键词
- [ ] **H1 含关键词**：首个 H1 自然包含目标关键词或变体

## 关卡 2 水晶口径准确性

- [ ] **水晶名称**：与 `_shared/crystal-attributes.json` 中的 `name` 字段一致
- [ ] **功效描述**：与 crystal-attributes 中的 `properties` 字段不矛盾
- [ ] **脉轮对应**：与 `_shared/chakra-knowledge.json` 中的映射一致
- [ ] **星座对应**：与 `_shared/astrology-knowledge.json` 中的映射一致
- [ ] **颜色分类**：与 crystal-attributes 中的 `color` 字段一致
- [ ] **矿物安全**：涉及接触/浸泡/食用场景，对照 `_shared/mineral-safety.json` 检查安全性

## 关卡 3 差异化检查（三视角 + 独家维度）

- [ ] **三视角覆盖**：水晶百科类文章同时提供科学（矿物学）+ 灵性（脉轮/星座）+ 心理学（正念/仪式）至少两个视角
- [ ] **东方锚点**：至少 1 处东方元素（藏传/菩萨石/阴阳/三宝/风水 等），如 Brief 要求
- [ ] **信息增量**：有 1 条竞品未覆盖的信息（对照 1D 竞品深拆文档的 §9 候选策略点）
- [ ] **产品推荐**：至少推荐 1-3 款相关水晶产品（有 `crystals for X` 类型 CTA）
- [ ] **非编造**：所有水晶属性、功效、历史来源可追溯（标注数据来源或交叉验证）

## 关卡 4 内链完整性

- [ ] **内链数量**：3-5 条内部链接（指向同 Pillar 相关页面）
- [ ] **内链锚文本**：锚文本描述性（非"点击这里"）
- [ ] **无死链**：所有内链 URL 返回 200（`grep` 检查 + 抽样 curl）
- [ ] **相关工具**：至少 1 条链接指向互动工具（如 Crystal Quiz / Chakra Test / 相关计算器）
- [ ] **Crystal Guide Index 回链**：水晶百科类页面链接回 Crystal Guide Index

## 关卡 5 完成性验证（防假完成）

- [ ] **线上 post 存在**：REST API 查询 `status=any` 确认（非 curl -L 假阳性）
- [ ] **图片已上传**：featured image + content images 均已上传并嵌入
- [ ] **字数达标**：按类型检查（百科 800+ / 功效 600+ / 配对 500+ / 星座 400+）
- [ ] **结构完整**：H2 分段 ≥ 3 个 / CTA 存在 / FAQ 存在（如 Brief 要求）
- [ ] **CTA 验证**：Shop CTA 链接指向 WooCommerce 产品或类目页（非占位符）

## 关卡 6 技术 SEO

- [ ] **Meta Description**：已写且含目标关键词，120-160 字符
- [ ] **Canonical URL**：已设置且与最终 URL 一致
- [ ] **Schema 验证**：JSON-LD 结构化数据存在且通过 Google Rich Results Test
  - 百科类：Article schema
  - 产品推荐类：Product / Offer schema
  - FAQ 类：FAQPage schema
  - 面包屑：BreadcrumbList schema
- [ ] **OG 标签**：og:title / og:description / og:image 均已设置
- [ ] **移动端首屏**：无横向滚动 + hero 图片加载正常

---

## 内容类型特殊要求（附加关卡）

| 内容类型 | 附加检查项 | 依据 |
|---------|-----------|------|
| **Crystal Meaning（390 篇）** | 每篇有 1 个诗意副标题（如 "The Artist's Stone"）+ 与 crystal-attributes.json 完全一致 | 1H 模仿17 |
| **Condition（32 篇）** | 3-5 款水晶推荐×每种水晶有独立段落 + 医疗免责强制存在 | 1H 模仿4 |
| **Zodiac Compatibility（79 篇）** | 双视角（双方各一段）+ 百分比评分 + 水晶推荐 | 模板-星座配对×水晶框架 |
| **Crystal Combinations（207 篇）** | 两水晶协同效应说明 + 使用场景 + 禁忌（如 mineral-safety） | 模板-水晶配对文章框架 |
| **Angel Numbers（88 篇）** | 数字灵性含义+圣经含义+水晶推荐+生活建议 | 模板-Angel-Numbers文章框架 |
| **Monthly Horoscope（144 篇）** | 月度星象数据引用（星象数据参考文档）+ 12 星座各 1 段 + 水晶推荐 | 模板-星座运势×水晶框架 |
| **Numerology（12 篇）** | 数字 1-9 含义+生命灵数计算方法+水晶推荐 | 模板-Numerology文章框架 |
| **Chinese Zodiac（15 篇）** | 生肖性格+水晶对应+年运简述 | 模板-Chinese-Zodiac文章框架 |
| **MBTI×Tarot（17 篇）** | MBTI 商标 disclaimer + 认知栈水晶推导 + primary+growth 双牌 | 16型-Brief.md |

---

## 抽审比例

| 风险等级 | 内容类型 | 抽审比例 |
|---------|---------|---------|
| **全审（100%）** | Health/Anxiety/Sleep Condition 页 + Wealth/Money 功效页 | 全部 |
| **重点抽审（30-50%）** | Crystal Meaning（390 篇取 120 篇）+ Zodiac Compatibility + Crystal Combinations | 30% |
| **随机抽审（10-20%）** | Angel Numbers / Numerology / Chinese Zodiac / Monthly Horoscope / Meditation / Astrology / How-to / Authenticity / MBTI | 10-20% |

---

## 使用方式

1. **生产者**（AI/写手）：完成初稿后，自行过一遍本清单，勾完才提交
2. **审核者**：收到提交后，按抽审比例抽审，填写 `04-内容生产/{type}/_qc/` 下的 QC JSON
3. **打回重做**：关卡 0 命中 = 直接打回；关卡 1-6 任一不过 = 标注问题后退回生产者
4. **通过发布**：所有勾选项通过 → 发布到线上 → 记录到内容执行追踪表

---

*创建时间：2026-07-07 | 基于 RLM §3.5-3.6 + 塔罗线 QC 标杆简化*
