# Crystal Compatibility Checker — SEO 文章框架与内链规划

> **定位**：工具页（page 43180）下方的 SEO 内容 + 工具结果跳转的内链目标清单
> **创建**：2026-06-25
> **依据**：综合竞品框架（astroformer 详 1500词 + rivendell FAQ 轻量 + crystalmeaning 纯工具）+ 差异化

---

## 一、工具页结构（H1 + 工具 + 文章）

```
H1: Crystal Compatibility Checker
intro 描述段（1-2句，含主关键词）
[ Tab: By Crystal | By Zodiac ] + 选择器 + Analyze + 结果区
---
下方 SEO 长文（2000-2500词）
```

## 二、SEO 文章框架（综合竞品 + 差异化）

| 章节 | 内容 | 来源/差异化 |
|------|------|------------|
| **H2: What Is Crystal Compatibility?** | 定义——水晶能量如何相互作用 | astroformer |
| **H2: How Crystal Compatibility Works** | 原理：元素（火土风水）+ 脉轮 + 意图协同 | 我们独有（intention 维度） |
| **H2: Best Crystal Combinations** ⭐ | 最佳组合（Love/Wealth/Protection 等场景） | **差异化**（竞品都没详写） |
| **H2: Crystals That Should Not Be Combined** ⭐ | 搭配禁忌（Carnelian+Amethyst 等 6 条） | **差异化**（rivendell 只 FAQ 一句） |
| **H2: Crystal Compatibility by Zodiac** | 星座配对→水晶（链 78 配对文章） | 链 P1 |
| **H2: How to Use Compatible Crystals** | 佩戴/冥想/网格/净化 | rivendell/astroformer |
| **H2: FAQ** | ①冲突能一起戴吗 ②怎么用最有效 ③科学依据 ④一次戴几颗 | rivendell 3问+扩展 |

> 竞品对比：astroformer 1500词偏命理（Vedic/行星）；rivendell 400词轻量。**我们 2000-2500词，差异化在「最佳组合 + 搭配禁忌」+ intention 维度 + 东方调性**。

## 三、内链规划（工具→文章闭环）

| 触点 | 跳转目标 | 说明 |
|------|---------|------|
| 选择器水晶 chip（图/名） | `/gemstone/{name}-meaning/` | 了解单颗水晶（390 篇已上线） |
| 结果区水晶 chip | `/gemstone/{name}-meaning/` | 同上 |
| 结果区"Read Full Pairing Guide →" CTA | `/zodiac-compatibility/{a}-{b}/` | 跳配对文章（见 §四 78 URL） |
| 文章正文提到水晶 | `/gemstone/{name}-meaning/` | 内链织网 |
| 文章 By Zodiac 段 | `/zodiac-compatibility/{sign}/` 或 78 配对 | 集群内链 |

> **跳转桥接逻辑**（水晶×水晶结果 → 配对文章）：取两颗水晶 overview.Zodiac 的交集或首选，映射到 `/zodiac-compatibility/{zodiacA}-{zodiacB}/`。无精确匹配时 fallback 到 `/zodiac-compatibility/` 类目页。

## 四、P1 配对文章 URL 清单（78 篇，默认已写）

```
/zodiac-compatibility/aries-aries/     ...     /zodiac-compatibility/aries-pisces/
/zodiac-compatibility/taurus-taurus/   ...     /zodiac-compatibility/taurus-pisces/
/zodiac-compatibility/gemini-gemini/   ...     /zodiac-compatibility/gemini-pisces/
/zodiac-compatibility/cancer-cancer/   ...     /zodiac-compatibility/cancer-pisces/
/zodiac-compatibility/leo-leo/         ...     /zodiac-compatibility/leo-pisces/
/zodiac-compatibility/virgo-virgo/     ...     /zodiac-compatibility/virgo-pisces/
/zodiac-compatibility/libra-libra/     ...     /zodiac-compatibility/libra-pisces/
/zodiac-compatibility/scorpio-scorpio/ ...     /zodiac-compatibility/scorpio-pisces/
/zodiac-compatibility/sagittarius-sagittarius/ ... /sagittarius-pisces/
/zodiac-compatibility/capricorn-capricorn/ ... /capricorn-pisces/
/zodiac-compatibility/aquarius-aquarius/ ... /aquarius-pisces/
/zodiac-compatibility/pisces-pisces/
```
（完整 78 条见 `02-数据层/zodiac-pair-urls.json`，含 aries-aries 到 pisces-pisces 全部两两组合 i≤j）

## 五、待执行

- [ ] 批次1（build 改）：中文bug→英文 / 实物图(form_bracelet) / H1+intro / 结果文字描述 / 跳转内链 / CTA / 去留资
- [ ] 批次2：按本框架写 SEO 文章（2000-2500词）
- [ ] P1 78 篇配对文章产出（工具跳转目标，可后补）
