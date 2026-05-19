# Crystal Vaults Sitemap解析

> **竞品**: Crystal Vaults (crystalvaults.com)
> **1A清单序号**: #4（直接竞品）
> **建站平台**: WordPress + Yoast SEO
> **Sitemap URL**: https://crystalvaults.com/sitemap_index.xml（标准 /sitemap.xml 返回404）
> **解析状态**: 成功（替代路径）
> **解析时间**: 2026-05-18

---

## Sitemap结构

获取方式: 替代路径 `/page-sitemap.xml` + `/sitemap_index.xml`（标准 `/sitemap.xml` 返回404）

Sitemap Index，包含30+子sitemap：
- `post-sitemap` - 博客文章
- `page-sitemap` - 静态页面（500+ URL）
- `product-sitemap` x6 - WooCommerce产品（按分页拆分）
- `category-sitemap` - 产品分类
- `product_attribute-sitemap` x8 - 产品属性归档（color, crystal_type, shape, zodiac_sign等）
- `rp_parent-sitemap` - 相关产品分组

## 页面分类统计

| 页面类型 | 数量 | 说明 |
|---------|------|------|
| Crystal Encyclopedia (单品百科) | ~100+ | `/crystal-encyclopedia/[name]` 格式 |
| Crystals for X (功效/意图) | ~150+ | `/crystal-reference-guide/crystals-for-[condition]` 格式 |
| 静态页面(Pages) | ~50 | 品牌/指南/工具页面 |
| Zodiac Pages | 12 | `/[sign]-crystals` 格式 |
| Chakra Pages | 7+ | `/[chakra]-chakra-explained` 格式 |
| Color Pages | 12+ | `/[color]-explained` + `/shop-crystals-by-color/` |
| Goddess Crystals | 40+ | 女神×水晶 |
| Magical Herbs | 30+ | 魔法草药 |
| Crystal Moon Astrology | 27 | 月宿占星 |
| 产品页 | ~500+ | WooCommerce产品 |
| **合计(估)** | **~800+** | 全站 |

## page-sitemap 关键URL清单

| 分类 | URL |
|------|-----|
| **Home** | `/` |
| **About** | `/about-crystal-vaults/` |
| **Contact** | `/contact-us/` |
| **Crystal Encyclopedia (100+)** | `/crystal-encyclopedia/amethyst`, `/crystal-encyclopedia/rose-quartz`, `/crystal-encyclopedia/citrine`, `/crystal-encyclopedia/black-tourmaline`, `/crystal-encyclopedia/labradorite`, `/crystal-encyclopedia/moonstone`, `/crystal-encyclopedia/selenite`, `/crystal-encyclopedia/malachite`, `/crystal-encyclopedia/carnelian`, `/crystal-encyclopedia/lapis-lazuli`, `/crystal-encyclopedia/moldavite`, `/crystal-encyclopedia/aquamarine`, `/crystal-encyclopedia/amazonite`, `/crystal-encyclopedia/clear-quartz`, `/crystal-encyclopedia/jade`, `/crystal-encyclopedia/garnet`, `/crystal-encyclopedia/tiger-eye`, `/crystal-encyclopedia/fluorite`, `/crystal-encyclopedia/howlite`, `/crystal-encyclopedia/jasper` 等100+个 |
| **Crystals for X (150+)** | `/crystal-reference-guide/crystals-for-anxiety`, `/crystal-reference-guide/crystals-for-depression`, `/crystal-reference-guide/crystals-for-love`, `/crystal-reference-guide/crystals-for-money`, `/crystal-reference-guide/crystals-for-protection`, `/crystal-reference-guide/crystals-for-sleep`, `/crystal-reference-guide/crystals-for-luck`, `/crystal-reference-guide/crystals-for-confidence`, `/crystal-reference-guide/crystals-for-creativity`, `/crystal-reference-guide/crystals-for-meditation`, `/crystal-reference-guide/crystals-for-healing`, `/crystal-reference-guide/crystals-for-abundance`, `/crystal-reference-guide/crystals-for-stress`, `/crystal-reference-guide/crystals-for-focus`, `/crystal-reference-guide/crystals-for-new-beginnings` 等150+个 |
| **Zodiac (12)** | `/aquarius-crystals`, `/pisces-crystals`, `/aries-crystals`, `/taurus-crystals`, `/gemini-crystals`, `/cancer-crystals`, `/leo-crystals`, `/virgo-crystals`, `/libra-crystals`, `/scorpio-crystals`, `/sagittarius-crystals`, `/capricorn-crystals` |
| **Chakra (7+)** | `/root-chakra-explained`, `/sacral-chakra-explained`, `/solar-plexus-chakra-explained`, `/heart-chakra-explained`, `/throat-chakra-explained`, `/third-eye-chakra-explained`, `/crown-chakra-explained`, `/crystal-reference-guide/crystals-for-the-root-chakra` ~ `/crystals-for-the-crown-chakra` |
| **Color (12+)** | `/shop-crystals-by-color/`, `/crystal-colors-explained/`, `/red-explained`, `/orange-explained`, `/yellow-explained`, `/green-explained`, `/blue-explained`, `/purple-explained`, `/pink-explained`, `/black-explained`, `/white-explained`, `/brown-explained` |
| **Crystal Oracle** | `/crystal-oracle/` |
| **I-Ching** | `/crystal-i-ching/` |
| **Medicine Wheel** | `/medicine-wheel/` |
| **Magical Herbs** | `/magical-herbs/` + 30+个子页 |
| **Goddess Crystals** | `/goddess-crystals/` + 40+个子页 |
| **Crystal Moon Astrology** | `/crystal-moon-astrology/` + 27个月宿页 |
| **Spirit Guides** | `/spirit-guides/` |
| **Crystal Courses** | `/crystal-courses/` |
| **Shop** | `/shop/`, `/crystal-sale/` |
| **Blog** | (通过post-sitemap) |
| **Legal** | `/privacy-policy/`, `/terms-of-use/`, `/disclosure/` |

## Sitemap Index 子sitemap清单（30+）

| 子sitemap | 说明 |
|-----------|------|
| `post-sitemap.xml` | 博客文章 |
| `page-sitemap.xml` | 静态页面（500+ URL） |
| `product-sitemap1.xml` ~ `product-sitemap6.xml` | WooCommerce产品 |
| `category-sitemap.xml` | 产品分类 |
| `product_attribute-color-sitemap.xml` | 产品颜色属性 |
| `product_attribute-crystal_type-sitemap.xml` | 水晶类型属性 |
| `product_attribute-shape-sitemap.xml` | 形状属性 |
| `product_attribute-zodiac_sign-sitemap.xml` | 星座属性 |
| `rp_parent-sitemap.xml` | 相关产品分组 |

## Crystal Vaults 价值评估

- **百科内容最深**：100+水晶单品百科页，每个都有详细的物理/灵性/历史描述
- **功效覆盖最广**：150+"Crystals for X"页面，覆盖从anxiety到zen的几乎所有意图
- **独特内容**：Crystal Oracle、I-Ching、Medicine Wheel、Magical Herbs、Goddess Crystals、Crystal Moon Astrology（27个月宿）— 其他6家竞品都没有的独有内容
- **产品属性维度丰富**：WooCommerce属性包含color、crystal_type、shape、zodiac_sign等，自动生成大量归档页
