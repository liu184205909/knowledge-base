# New Moon Beginnings Sitemap解析

> **竞品**: New Moon Beginnings (newmoonbeginnings.com)
> **1A清单序号**: #9（直接竞品 · BigCommerce）
> **建站平台**: BigCommerce
> **Sitemap URL**: https://newmoonbeginnings.com/xmlsitemap.php
> **解析状态**: 成功（2026-05-20 sitemap-mcp-server 精确解析）

---

## Sitemap结构

Sitemap Index，通过 `xmlsitemap.php` 索引，含12个子sitemap（去重后7个唯一）：

| 子sitemap | URL | 页面数 | 说明 |
|-----------|-----|--------|------|
| products (×2重复) | `xmlsitemap.php?type=products&page=1` | **5,050** | 产品页 |
| pages (×2重复) | `xmlsitemap.php?type=pages&page=1` | **220** | 静态页面（以宝石含义页为主） |
| categories (×2重复) | `xmlsitemap.php?type=categories&page=1` | **379** | 分类页 |
| news (×2重复) | `xmlsitemap.php?type=news&page=1` | **77** | 博客/新闻 |
| brands | `xmlsitemap.php?type=brands&page=1` | **2** | 品牌页 |
| legacy sitemap | `/content/old-sitemap-lite.xml` | **2,560** | 旧版URL（priority=1.0） |

> **注意**: BigCommerce生成的sitemap中products/pages/categories/news各被引用两次，导致报告总页面数(14,014)是实际唯一页面数(~8,288)的近两倍。Priority: 0.5（当前）, 1.0（旧版）。

## 页面分类统计（去重后）

| 页面类型 | 唯一页面数 | 占比 | 子sitemap |
|---------|-----------|------|-----------|
| 产品页(Products) | **5,050** | 60.9% | products |
| 旧版URL(Legacy) | **2,560** | 30.9% | old-sitemap-lite |
| 分类页(Categories) | **379** | 4.6% | categories |
| 含义页面(Pages) | **220** | 2.7% | pages |
| 博客/新闻(News) | **77** | 0.9% | news |
| 品牌页(Brands) | **2** | <0.1% | brands |
| **合计（去重）** | **8,288** | 100% | — |
| **合计（含重复引用）** | **14,014** | — | — |

## 产品页样本URL

| 品类 | 样本URL |
|------|---------|
| 手链 | `/throat-chakra-clasp-bracelet-8mm-beads/`, `/amazonite-elastic-bracelet-8mm-beads/` |
| 吊坠 | `/amazonite-pendant-in-metal-alloy-polished-point-pendant-in-wire-wrapped-setting/`, `/emerald-pendant-sterling-silver-polished-no-9/` |
| 原石 | `/raw-ethiopian-opal-ring-in-sterling-silver/`, `/raw-amethyst-standing-crystal-cluster-137/` |
| 抛光石 | `/silver-topaz-tumbled-stone-polished-natural-silver-topaz/`, `/rainbow-fluorite-heart-polished-crystal/` |
| 套装 | `/libra-tumbled-stone-set/`, `/february-gift-box/`, `/love-happiness-stone-set-raw/` |
| 香薰/蜡烛 | `/frosted-spruce-candle/`, `/good-vibes-only-bath-bomb/` |
| 生肖 | `/scorpio-zodiac-oil-roller/` |
| 批发 | `/bulk-sunstone-chips-1-lb-bag-size-5mm-7mm-grade-a/`, `/raw-blue-aventurine-bulk/` |

## 分类页结构（379页）

| 分类层级 | 说明 | 估计数量 |
|---------|------|---------|
| `/healing-crystals/gemstones/{stone}/` | 宝石品种页 | ~200+ |
| `/zodiac/{sign}/` | 十二星座页 | 12 |
| `/chakra/` + `/chakra/{type}/` | 脉轮相关 | ~10 |
| `/color/{color}-crystals-gemstones/` | 按颜色分类 | ~10 |
| `/jewelry/{type}/` | 首饰类型 | ~20 |
| `/aromatherapy/{type}/` | 香薰类别 | ~10 |
| `/healing-crystals/raw-rough/` | 原石 | 少量 |
| `/healing-crystals/polished-shaped/{type}/` | 抛光成型 | 少量 |
| `/energy-tools/{type}/` | 能量工具 | 少量 |
| 主题/节日集合 | 情人节/母亲节等 | 少量 |

## 含义页面（220页，以水晶含义为主）

| 类型 | 样本URL |
|------|---------|
| 水晶含义 | `/rose-quartz-meaning/`, `/amethyst-meaning/`, `/labradorite-meaning/`, `/moldavite-meaning/` |
| 含义索引 | `/crystal-meanings/`, `/crystal-meanings/r-to-z/` |
| 教程 | `/how-to-charge-crystals/` |
| 政策页 | `/shipping-processing/`, `/terms-of-service/` |

> **亮点**: 约190+页为`{stone}-meaning/`宝石含义科普页，每个品种独立一页。

## 博客/新闻（77页）

| 类型 | 样本URL |
|------|---------|
| 博客教程 | `/blog/healing-crystals-that-should-not-be-cleansed-in-water-or-sunlight/` |
| | `/blog/energy-cleansing-what-is-smoke-cleansing-and-how-to-smoke-cleanse/` |
| | `/blog/how-to-get-started-with-healing-crystals-an-intro-to-healing-crystals/` |
| | `/blog/raw-vs-tumbled-and-shaped-healing-crystals-exploring-the-differences/` |
| | `/blog/how-to-measure-wrist-for-bracelet-size/` |
| 水晶含义 | 大量与Pages重复的`{stone}-meaning/`页面 |
| 节日/月相 | `/best-crystals-for-thanksgiving/`, `/best-crystals-for-samhain/`, `/full-moon-in-taurus-with-lunar-eclipse/` |

## 旧版Sitemap（2,560页）

| 特征 | 说明 |
|------|------|
| 来源 | 从旧平台（可能Shopify）迁移的历史数据 |
| URL格式 | `/products/{slug}` 和 `/collections/{slug}`（无尾斜杠） |
| Priority | 全部1.0（与当前0.5矛盾） |
| 问题 | 产品slug关键词堆砌严重，如 `carnelian-stone-heart-large-carnelian-heart-carnelian-crystal-heart-sacral-chakra-crystals-healing-crystals-and-stones-7` |

## New Moon Beginnings 价值评估

- **含义页面策略突出**：220页中190+为宝石含义科普页，每页独立URL，SEO覆盖面广
- **产品品类丰富**：5,050个产品覆盖原石/抛光石/手链/吊坠/耳环/戒指/香薰/套装
- **多维度分类**：379个分类页，支持宝石品种/星座/脉轮/颜色/首饰类型多维筛选
- **Sitemap存在重复问题**：BigCommerce引用重复导致报告虚高，实际唯一页面约8,288
- **旧版URL迁移遗留**：2,560个旧版URL的priority设为1.0，需检查301重定向
- **内容与Pages重叠**：News和Pages之间存在大量`{stone}-meaning/`URL重复提交
