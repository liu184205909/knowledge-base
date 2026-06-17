# Crystal Vaults Sitemap解析

> **竞品**: Crystal Vaults (crystalvaults.com)
> **1A清单序号**: #4（直接竞品）
> **建站平台**: WordPress + Yoast SEO
> **Sitemap URL**: https://crystalvaults.com/sitemap_index.xml（标准 /sitemap.xml 返回404）
> **解析状态**: 成功（2026-05-20 sitemap-mcp-server 精确解析）
> **解析时间**: 2026-05-20

---

## Sitemap结构

获取方式: 替代路径 `/page-sitemap.xml` + `/sitemap_index.xml`（标准 `/sitemap.xml` 返回404）

Sitemap Index，包含29个子sitemap：
- `post-sitemap` - 博客文章（539页）
- `page-sitemap` - 静态页面（706页）
- `product-sitemap` x6 - WooCommerce产品（993+1,000+996+975+972+324 = 5,260页）
- `category-sitemap` - 产品分类（4页）
- `post_tag-sitemap` - 标签（512页）
- `product_cat-sitemap` - 产品分类（436页）
- `product_tag-sitemap` - 产品标签（434页）
- `product_attribute-crystal_type-sitemap` - 水晶类型属性（131页）
- `product_attribute-shape-sitemap` - 形状属性（59页）
- `product_attribute-color-sitemap` - 颜色属性（18页）
- 其他属性归档 - 约55页
- `rp_parent-sitemap` - 相关产品分组

## 页面分类统计

| 页面类型 | 数量 | 说明 |
|---------|------|------|
| 博客文章(Posts/Blog) | 539 | 水晶知识文章 |
| 静态页面(Pages) | 706 | 含Crystal Encyclopedia、功效页等 |
| 产品页(Products) | 5,260 | WooCommerce产品（6个分片：993+1,000+996+975+972+324） |
| 产品分类(Product Categories) | 436 | WooCommerce产品分类 |
| 产品标签(Product Tags) | 434 | WooCommerce产品标签 |
| 标签(Tags) | 512 | WordPress内容标签 |
| 分类(Categories) | 4 | WordPress内容分类 |
| Crystal Type属性 | 131 | 产品属性归档 |
| Shape属性 | 59 | 产品属性归档 |
| Color属性 | 18 | 产品属性归档 |
| 其他属性 | ~55 | zodiac_sign等 |
| **合计** | **8,204** | 全站（29个子sitemap） |

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

## Sitemap Index 子sitemap清单（29个）

| 子sitemap | 说明 |
|-----------|------|
| `post-sitemap.xml` | 博客文章（539） |
| `page-sitemap.xml` | 静态页面（706） |
| `product-sitemap1.xml` ~ `product-sitemap6.xml` | WooCommerce产品（共5,260） |
| `category-sitemap.xml` | 内容分类（4） |
| `post_tag-sitemap.xml` | 内容标签（512） |
| `product_cat-sitemap.xml` | 产品分类（436） |
| `product_tag-sitemap.xml` | 产品标签（434） |
| `product_attribute-crystal_type-sitemap.xml` | 水晶类型属性（131） |
| `product_attribute-shape-sitemap.xml` | 形状属性（59） |
| `product_attribute-color-sitemap.xml` | 颜色属性（18） |
| `product_attribute-zodiac_sign-sitemap.xml` | 星座属性 |
| `rp_parent-sitemap.xml` | 相关产品分组 |

## Crystal Vaults 价值评估

- **百科内容最深**：100+水晶单品百科页，每个都有详细的物理/灵性/历史描述
- **功效覆盖最广**：150+"Crystals for X"页面，覆盖从anxiety到zen的几乎所有意图
- **独特内容**：Crystal Oracle、I-Ching、Medicine Wheel、Magical Herbs、Goddess Crystals、Crystal Moon Astrology（27个月宿）— 其他6家竞品都没有的独有内容
- **产品属性维度丰富**：WooCommerce属性包含color、crystal_type、shape、zodiac_sign等，自动生成大量归档页
