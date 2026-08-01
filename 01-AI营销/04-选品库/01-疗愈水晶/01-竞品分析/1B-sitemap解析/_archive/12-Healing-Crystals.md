# Healing Crystals Sitemap解析

> **竞品**: Healing Crystals (healingcrystals.com)
> **1A清单序号**: #12（直接竞品 · 百科+批发型）
> **建站平台**: 自建
> **Sitemap URL**: https://www.healingcrystals.com/robots.txt (索引)
> **解析状态**: 成功（2026-05-20 sitemap-mcp-server 精确解析）

---

## Sitemap结构

Sitemap Index，通过 robots.txt 引用，含6个子sitemap：

| 子sitemap | URL | 页面数 | 说明 |
|-----------|-----|--------|------|
| `_sitemap-articles.xml` | https://www.healingcrystals.com/_sitemap-articles.xml | **15,627** | 文章/客户评价 |
| `_sitemap-products-page.xml` | https://www.healingcrystals.com/_sitemap-products-page.xml | **10,134** | 产品列表/分类页 |
| `_sitemap-tags-page.xml` | https://www.healingcrystals.com/_sitemap-tags-page.xml | **2,087** | 标签页 |
| `_sitemap-products.xml` | http://www.healingcrystals.com/_sitemap-products.xml | **870** | 产品详情页 |
| `_sitemap-static-pages.xml` | http://www.healingcrystals.com/_sitemap-static-pages.xml | **0** | 静态页面（InvalidSitemap） |
| robots.txt | https://www.healingcrystals.com/robots.txt | 0 | 索引文件 |

> **注意**: static-pages sitemap使用http://协议，被标记为InvalidSitemap，0页面。全站Priority统一0.5，无差异化。

## 页面分类统计

| 页面类型 | 数量 | 占比 | 子sitemap |
|---------|------|------|-----------|
| 文章(Articles) | **15,627** | 54.4% | _sitemap-articles.xml |
| 产品列表页(Products Page) | **10,134** | 35.3% | _sitemap-products-page.xml |
| 标签页(Tags) | **2,087** | 7.3% | _sitemap-tags-page.xml |
| 产品详情页(Products) | **870** | 3.0% | _sitemap-products.xml |
| 静态页面(Static Pages) | **0** | 0% | InvalidSitemap |
| **合计** | **28,718** | 100% | 6个sitemap文件 |

## 文章页（15,627页）样本

> **重要发现**: 15,627篇"文章"中大量为客户评价/感言，而非知识性文章。

| 类型 | 样本URL |
|------|---------|
| 客户评价 | `/{...}I_absolutely_love_the_crystals_I_got___Articles_2825.html` |
| | `/{...}beautiful_as_always___Articles_2023.html` |
| | `/{...}this_is_the_best_website_to_buy_crystals_from.__Articles_2660.html` |
| | `/{...}excellent_quality.__Articles_1698.html` |
| 知识文章 | `/{...}Crystal_Class__A____Articles_1312.html` |
| | `/{...}articles_have_helped_me_so_greatly...__Articles_1572.html` |
| 矿物展 | `/{...}2014_GEM__MINERAL___CRYSTAL_SHOWS__UPDATED_AS_OF__7_31_14__Articles_12687.html` |
| 行业动态 | `/{...}getting_ready_for_our_move_to_a_new_warehouse__Articles_2531.html` |
| | `/{...}Facebook_community_is_growing_by_leaps_and_bounds__Articles_2540.html` |

> **URL格式**: `http://www.healingcrystals.com/{title_slug}_Articles_{ID}.html`（使用http协议）

## 产品列表页（10,134页）样本

> 这是分类/筛选页面，非单个产品详情页。按多维度交叉筛选生成。

| 筛选维度 | 样本URL |
|---------|---------|
| 按产品类型+产地 | `/assortments-by-location.html`, `/assortments-by-brazil-location.html` |
| | `/cut-and-polished-crystals-by-location.html`, `/cut-and-polished-crystals-by-madagascar-location.html` |
| | `/crystal-jewelry-by-location.html`, `/crystal-jewelry-by-brazil-location.html` |
| | `/natural-crystals-and-minerals-by-location.html` |

**产地覆盖**: Africa, Argentina, Arizona, Arkansas, Australia, Bolivia, Botswana, Brazil, Canada, China, Columbia, Congo, Czech Republic, Dominican Republic, Himalayan, India, Madagascar, Mexico, Morocco, Namibia, Nepal, New York, Pakistan, Peru, Russia, South Africa, Spain, Tanzania, Tibet, United States, Uruguay 等30+产地

> **URL格式**: `https://www.healingcrystals.com/{product-type}-by-{location}-location.html`

## 标签页（2,087页）

| 标签类型 | 样本URL | 说明 |
|---------|---------|------|
| 分类索引 | `/crystals-by-location-products-property-tags.html` | 产地索引 |
| | `/crystals-by-color-products-property-tags.html` | 颜色索引 |
| | `/crystals-by-shape-products-property-tags.html` | 形状索引 |
| | `/crystals-by-primary-chakra-stones-property-2-tags.html` | 脉轮索引 |
| | `/crystals-by-astrological-sign-stones-property-5-tags.html` | 星座索引 |
| | `/crystals-by-numerical-vibration-stones-property-6-tags.html` | 数值振动索引 |
| | `/crystals-by-hardness-stones-property-7-tags.html` | 硬度索引 |
| | `/crystals-by-rarity-stones-property-10-tags.html` | 稀有度索引 |
| | `/crystals-by-mineral-class-stones-property-13-tags.html` | 矿物分类索引 |
| | `/crystals-by-common-conditions-stones-property-14-tags.html` | 功效/状况索引 |
| 化学成分 | `/products-by-(sio2)_silicon_dioxide.html` | 二氧化硅 |
| | `/products-by-(be3_al2_si6_o18)_beryllium_aluminum_silicate.html` | 绿柱石成分 |
| 硬度标签 | `/products-by-0.5-to-2.5-hardness-hardness.html` | 硬度范围 |
| 矿物名称 | `/products-by-{mineral-name}.html` | 按矿物名 |
| **异常URL** | `/products-by-.html?quot;a\\\"` | 带引号参数的无效URL |

> **15个分类维度**: Location, Quality, Color, Shape, Primary Chakra, Secondary Chakra, Crystal System, Chemical Composition, Astrological Sign, Numerical Vibration, Hardness, Rarity, Mineral Class, Common Conditions, Stone Name

## 产品详情页（870页）样本

| 产品类型 | 样本URL |
|---------|---------|
| 心形 | `/Hearts_-_Fluorite_Heart.html`, `/Hearts_-_Green_Aventurine_Heart.html` |
| 塔柱 | `/Towers_-_Clear_Quartz_Mini_Tower__Brazil_.html` |
| 金字塔 | `/Pyramid_-_Clear_Quartz_Pyramids.html` |
| 大卫星 | `/Star_of_David_-_Clear_Quartz_Star_of_David__Brazil_.html` |
| 球体 | `/Sphere_-_Rose_Quartz_Spheres__Brazil_.html` |
| 水晶棒 | `/Wand_-_Amethyst_6-Sided_Massage_Wands___Brazil_.html` |
| 梅尔卡巴 | `/Merkaba_-_Green_Aventurine_Merkaba_Star__India_.html` |
| 脉轮套装 | `/Chakra_Set_-_7_Chakra_Tumbled_Stone_Set_-_Tumbled_Stones.html` |
| 原矿 | `/Amethyst_-_Amethyst_Druze_Clusters__Extra___Brazil_.html` |

> **URL格式**: `http://www.healingcrystals.com/{Type}_{Mineral}_{Form}__{Origin}_.html`（双下划线分隔产品名与产地）

## Healing Crystals 价值评估

- **文章量最大的水晶站**：15,627篇"文章"，但大量为客户评价/感言，真实知识文章占比需进一步评估
- **多维度标签体系极其完善**：15个分类维度（产地/颜色/形状/脉轮/星座/化学成分/硬度/稀有度等），2,087个标签页
- **产地维度独特**：30+产地覆盖全球，按产品类型×产地交叉生成10,134个分类页
- **产品详情页偏少**：仅870个产品详情页 vs 10,134个分类列表页，产品化程度低
- **技术SEO问题严重**：
  - http/https混用（articles和products用http，products-page和tags用https）
  - URL结构不统一（文章用`_Articles_ID.html`，产品用下划线，标签用连字符）
  - 标签sitemap存在大量`?quot;`异常URL
  - Priority全站统一0.5，无差异化
  - static-pages sitemap无效（http协议导致InvalidSitemap）
