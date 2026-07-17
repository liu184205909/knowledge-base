# 模板-Gift 文章框架（Crystal Gifts listicle，P0 主线）

> **定位**：gift 内容线生产执行框架。文章型 = "N Best Crystal Gifts for {Recipient/Occasion}" listicle 博客——goearthward 抢中尾 listicle 位，对标 tinyrituals/crystals.com/selfgaia 深度（gifts 规划 §一结论3/§三）。
> **实体**：post。**根级 URL**（`/crystal-anniversary-gifts/`，符合 [site-url-rule](../../../../../)，不走 `/gifts/` 前缀）。
> **归档**：post category `Crystal Gifts`（slug `crystal-gifts`）。量级 ≥30 篇后启用 category-hub 模式（archive + SEO intro，[category-hub-seo-deployment](../../../../../)）。
> **上游依据**：[gifts 类目系统规划](../gifts类目系统规划.md) §一/§三/§六 + [2A-网站结构](../../02-网站规划/2A-网站结构.md)。
> **复用**：fengshui 生产线（fill-ai-batch / generate / images / upload / qc）+ `_shared/` 390 水晶库 + moleapi 图片 + WP base64 + Rank Math TKD。

---

## 一、模板变量

`{recipient}`（her / him / mom / women / men / wife / couples / crystal lovers / tea lovers / travelers / doctors / …）
× `{occasion}`（anniversary / 15th / wedding / housewarming / new home / valentine / mother's day / easter / …）
× `{budget}`（under $50 / under $30 / luxury）
× `{intention}`（love / protection / prosperity / calm）
× `{N}` 礼物数 × `{crystalList}` 推荐水晶（取自 390 库）。

---

## 二、文章结构（H2，每模块标依据）

```
# {N} Best Crystal Gifts for {Recipient/Occasion} [by Stone Meaning]

## 1. Quick Picks（速答表）⭐ 争 AIO
   [依据] AIO 引用偏好结构化表（gifts 规划 §一结论3）
   表：Pick | 水晶 | 寓意一句话 | 适合 | 价格段 | 看产品(内链)

## 2. Why Crystals Make Meaningful Gifts for {X}
   [依据] 差异化 from 情绪价值 + 寓意 + 持久（区别通用礼物 / 玻璃器皿，§一结论1-3）

## 3. The {N} Best Crystal Gifts for {X}（主模块）⭐
   [依据] 对标 tinyrituals / crystals.com / selfgaia 深度（§三中尾 listicle）
   每礼物一卡：
     - 图（moleapi 生成）
     - 水晶名 + 矿石寓意（取 _shared/ 390 库，不编）
     - 为何适合该人群 / 场景（具体，不泛）
     - 价格段（$ / $$ / $$$）
     - How to Use / 赠礼仪式（差异化）
     - 内链 → 单石 product category（/product-category/{stone}-crystals/，404 降级 /shop/?s={stone}）
   ⚠️ Rose Quartz 在爱情 / 周年类置顶（竞品 100% 旗舰石，情侣礼物框架 §六）

## 4. By Intention（按水晶意图选礼）⭐ 差异化
   [依据] gifts 规划 §五 by-intention facet（竞品无）
   love → Rose Quartz / protection → Black Tourmaline / prosperity → Citrine / calm → Amethyst

## 5. 东方锚点（独家差异化）⭐
   [依据] 站点 Eastern-inspired 定位 + 竞品 0 覆盖
   藏传 / 印度 / 七曜 / 中医时辰视角的赠礼寓意（如 15 周年 crystal + 东方"圆满 / 缘起"叙事）

## 6. How to Choose（选购指南）
   [依据] 选购导向区别于"水晶科普站"
   预算 / 对方意图 / 关系阶段 / 净化开光（内链 cleansing-timer 工具）

## 7. Shop / Keep Exploring（CTA）
   [依据] 电商定位（§一结论3）
   内链单石类目 + 相关工具（birthstone-finder / bracelet-builder / ring-size-calculator）

## 8. FAQ（6-8 问 + FAQPage schema）
   [依据] PAA 高频（what is 15th anniversary crystal / what does gifting a crystal mean / how to cleanse a gift crystal）

## 9. Related（集群互链）
   [依据] SEO topic cluster（2A §四）
   → 交叉页 /{stone}-crystals/ / 配对页 / 相关 gift 文章
```

---

## 三、内容深度基准（gifts 规划 §七）

- ≥1500 字
- 每礼物卡：图 + 矿石寓意 + 人群匹配 + 价格 + How to Use + 内链
- 顶部 Quick Picks 表（争 AIO）
- 权威来源链接（增强 E-E-A-T）
- 东方锚点段（独家）

---

## 四、数据与合规

- **水晶寓意 / 属性一律取 `_shared/` 390 库**，不凭通识编（[content-must-have-evidence](../../../../../)）
- **内链单石 product category 生产前 REST 验证 200**，404 降级 `/shop/?s={stone}`（[shop-cta-no-deadlink-rule](../../../../../)）
- 价格段真实分级（`$` <$20 / `$$` $20-50 / `$$$` $50+），**不编造具体售价**
- 合规：礼物价值真诚表述，**不夸大"水晶保证关系 / 运势"**
- Schema：Article + FAQPage + Breadcrumb（**禁 Product 前端渲染**）

---

## 五、vs 相关框架差异（证明独立）

| | Gift listicle（本框架） | 情侣礼物框架 | Crystals-for-Condition |
|---|---|---|---|
| 视角 | 礼物选购（人群 / 场景） | 情侣配对（星座对） | 功效（症状） |
| 主模块 | N 礼物卡 + Quick Picks | by Zodiac Pair | by Condition |
| 内链 | 单石 product category | 配对页 | 单石类目 |

---

## 六、生产 SOP（复用 fengshui 生产线）

1. `configs/gift-topics.json`（全量选题池，带 recipient / occasion / keyword / Vol / KD / 优先级）
2. `_placeholders/{slug}.txt`（每篇选题占位）
3. `scripts/fill-ai-batch-mainpages.js`（AI 填充，390 库取寓意）
4. `scripts/generate-mainpages.js`（生文章）
5. `scripts/generate-mainpages-images.js`（moleapi，hero + 每礼物图）
6. `scripts/upload-mainpages.js`（WP REST + base64 + Rank Math TKD）
7. `scripts/qc-scan.js`（风险词 / 水晶真实性 / Shop CTA 死链）
8. 线上 `status=any` REST 验证（[completion-requires-online-verification](../../../../../)）

---

## 七、依据溯源

- **需求**：gifts 规划 §一 / §二（33002 词，crystal 垂直 KD≤20）
- **竞品**：tinyrituals / crystals.com / selfgaia / satincrystals / opulentzen（§三中尾 listicle）
- **复用**：fengshui 生产线 + 390 库 + 情侣礼物框架（礼物视角）

---

*创建：2026-07-17 | 基于 gifts 规划 §一/§三/§六 + fengshui 生产线 + 情侣礼物框架礼物视角*
