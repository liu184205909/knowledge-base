# Crystal Compatibility Checker — SEO 文章框架与内链规划

> **定位**：Crystal Checker（page 43180）工具页下方的 SEO 内容 + 工具结果跳转的内链目标清单。
> **创建**：2026-06-25｜**更新**：2026-06-25（工具拆分后仅管 Crystal Checker 43180；水晶×水晶结果 CTA 跳 207 篇水晶配对文章 `/{a}-and-{b}/`）
> **依据**：综合竞品框架（astroformer 详 1500 词 + rivendell FAQ 轻量 + crystalmeaning 纯工具）+ 差异化。
> **关联**：Zodiac Checker（page 43246）是**独立页面**，承接星座×星座兼容 + 链 78 篇星座配对文章，其 SEO 内容另规划（不复用本文档）。

---

## 〇、工具拆分说明（2026-06-25）

原"一个页面双 Tab（By Crystal | By Zodiac）"已拆为两独立页面——两者**搜索意图完全不同**：

| 工具 | page | URL | 意图 | 结果 CTA 跳 |
|------|------|-----|------|------------|
| **Crystal Checker** | 43180 | `/tools/crystal-compatibility-checker/` | 两水晶能不能一起戴 | **`/{a}-and-{b}/`（207 篇水晶配对）** |
| **Zodiac Checker** | 43246 | `/tools/zodiac-compatibility-checker/` | 两星座关系 + 推荐水晶 | `/zodiac-compatibility/{a}-{b}/`（78 篇星座配对） |

**本文档仅管 Crystal Checker（43180）。** 下方所有内链/跳转逻辑均针对水晶×水晶。

---

## 一、Crystal Checker 工具页结构（单页，无 Tab）

```
H1: Crystal Compatibility Checker
intro 描述段（1-2 句，含主关键词 "crystal compatibility checker"）
[ 30 颗水晶选择器（图标+搜索），只选 2 颗 ] + Analyze + 结果区
---
下方 SEO 长文（2000-2500 词，<details> 折叠）
```

## 二、SEO 文章框架（综合竞品 + 差异化）

| 章节 | 内容 | 来源/差异化 |
|------|------|------------|
| **H2: What Is Crystal Compatibility?** | 定义——水晶能量如何相互作用 | astroformer |
| **H2: How Crystal Compatibility Works** | 原理：元素（火土风水以太）+ 脉轮 + 意图协同 | 我们独有（intention 维度） |
| **H2: Best Crystal Combinations** ⭐ | 最佳组合（Love/Wealth/Protection/Sleep 等场景，各链 `/{a}-and-{b}/`） | **差异化**（竞品都没详写） |
| **H2: Crystals That Should Not Be Combined** ⭐ | 搭配禁忌（6 条传统冲突 + 火×水相克） | **差异化**（rivendell 只 FAQ 一句） |
| **H2: How to Use Compatible Crystals** | 佩戴/冥想/网格/净化 | rivendell/astroformer |
| **H2: Want Zodiac Compatibility?** | 一句引导 → 链 Zodiac Checker（43246） | 工具矩阵内循环 |
| **H2: FAQ** | ①冲突能一起戴吗 ②怎么用最有效 ③科学依据 ④一次戴几颗 | rivendell 3 问+扩展 |

> 竞品对比：astroformer 1500 词偏命理（Vedic/行星）；rivendell 400 词轻量。**我们 2000-2500 词，差异化在「最佳组合 + 搭配禁忌」+ intention 维度 + 东方调性**。

## 三、内链规划（Crystal Checker → 水晶配对文章闭环）

| 触点 | 跳转目标 | 说明 |
|------|---------|------|
| 选择器水晶 chip（图/名） | `/gemstone/{name}-meaning/` | 了解单颗水晶（390 篇已上线） |
| 结果区水晶 chip | `/gemstone/{name}-meaning/` | 同上 |
| 结果区 "Read Full Combination Guide →" CTA | **`/{stoneA}-and-{stoneB}/`** | 跳水晶配对文章（**仅 207 篇精选有文章时显示**） |
| 其余 228 组（无文章） | **不显示 CTA** | 结果页自给自足（评分+Why+Best For+How to Use+Shop） |
| 文章 "Best Crystal Combinations" 段 | `/{a}-and-{b}/`（精选 5-8 组） | 集群内链 |
| 文章 "Should Not Be Combined" 段 | 对应冲突配对 `/{a}-and-{b}/`（13 篇 T3） | 链冲突文章（讲分开方案） |
| 文章 "Want Zodiac Compatibility" 段 | `/tools/zodiac-compatibility-checker/`（43246） | 工具矩阵互链 |

> **跳转桥接逻辑（水晶×水晶 → 水晶配对文章）**：结果直接对应 `/{stoneA}-and-{stoneB}/`（slug = 两石 slug 按字母序 `-and-` 拼接，与 selected-articles.json 的 slug 一致）。207 个 slug 内嵌工具 JS 的 `HAS_ARTICLE` 清单；命中则显示 CTA，不命中则隐藏。**不再做"水晶 Zodiac 交集→星座配对"的旧桥接**（那是拆分前的逻辑，现归 Zodiac Checker）。

## 四、水晶配对文章清单（207 篇，Crystal Checker CTA 目标）

`selected-articles.json` 的 207 个 slug（T1_pairing 65 + T2_highscore 129 + T3_conflict 13，T2 含 38 组同脉轮/元素 Excellent），全部内嵌进 Crystal Checker 页面 JS 的 `HAS_ARTICLE` 数组。生产完成后 CTA 全量生效；当前可先内嵌清单（数据已就绪），文章陆续上线后自动有 CTA。

> 78 篇**星座配对** URL 属 Zodiac Checker（43246），清单见 `02-数据层/zodiac-pair-urls.json`，不在本文档。

## 五、待执行

- [ ] Crystal Checker SEO 文章撰写（2000-2500 词，按 §二 框架）
- [ ] 207 篇水晶配对文章产出（Crystal Checker CTA 目标，见 [模板-水晶配对文章框架](../../03-内容策略/内容Brief/模板-水晶配对文章框架.md)）
- [ ] Zodiac Checker（43246）独立 SEO 框架（链 78 星座配对，另规划）
- [ ] Crystal Checker 页 JS 内嵌 207 个 HAS_ARTICLE slug（数据已就绪）

---

## 六、无文章组合（228 组）处理方案

435 组中 207 组有独立文章（CTA 跳 `/{a}-and-{b}/`），其余 **228 组**（Harmonious 60 无 tag + Moderate 138 + Neutral 30）无独立文章。处理原则：**不做独立 post（避免 thin content + 编造），但工具结果页动态厚化 + Hub 页 SEO 兜底，确保用户体验和转化不落空。**

### 1. 为什么 228 组不做文章
- 无共享 intention 场景（tag 空 + score < 85），强行写 Benefits 只能编造，违反"内容必须有依据"。
- 228 个相似低质页 → Google thin/duplicate content 风险，拖累新站权重。
- 工具页是交互页（动态结果），不算 thin content。

### 2. 工具结果页动态厚化（Crystal Checker 前端 JS 实时生成）
228 组虽无文章，工具结果页对它们也生成完整结果，只是 CTA 不同：

| 字段 | 207 组（有文章） | 228 组（无文章） |
|---|---|---|
| 评分环 + 分档 | ✅ | ✅ 同 |
| Why This Pairing | ✅ | ✅ 算法透明（元素 base + 共享 chakra 加减分） |
| Best For | sharedTags → TAG_SCENE | **sharedTags 空 → 从 sharedChakras 推导（CHAKRA_SCENE）**，再空通用 |
| How to Use | ✅ | ✅ 两颗各自佩戴/冥想（参数化） |
| Shop | ✅ | ✅ 推两颗水晶（转化不丢） |
| CTA | "Read Full Combination Guide →" 跳文章 | "Shop This Pair →" 跳页内 Shop（未来加 Hub 链接） |

**CHAKRA_SCENE 映射**（七脉轮 → 场景，已实现于 `crystal-checker.html`）：
root→Grounding & stability / sacral→Creativity & passion / solar-plexus→Confidence & willpower / heart→Love & emotional balance / throat→Communication & truth / third-eye→Intuition & insight / crown→Spiritual connection

→ 228 组的 Best For 不再空洞（如共享心轮组显示 "Love & emotional balance"）。

### 3. Hub 页 SEO 兜底
228 组无独立 URL，搜索流量由 Crystal Checker 工具页（43180，含 2000-2500 词 SEO 折叠长文）+ `/category/crystal-combinations/` Hub archive 承接。Hub archive 需补 SEO 文案（兼容性原理 + 元素/脉轮组合表 + 207 篇精选索引 + 搭配禁忌），作为 228 组流量的统一入口 + 内链中心。

### 4. 代码实现状态（2026-06-25）
- ✅ `generate-crystal-checker.js` 已加 CHAKRA_SCENE + pairScore 返回 sharedChakras + Best For 三级 fallback（tags→chakras→通用）
- ✅ `crystal-checker.html` 已重新生成（43.8 KB）
- ⏳ 待上传 page 43180（网络通时用 `build-deploy-tool.js`）
- ⏳ Hub archive SEO 文案待补
