# Moonrise Crystals Sitemap解析

> **竞品**: Moonrise Crystals (moonrisecrystals.com)
> **1A清单序号**: #8（直接竞品）
> **建站平台**: WordPress + Yoast SEO
> **Sitemap URL**: https://moonrisecrystals.com/sitemap_index.xml
> **解析状态**: FAILED - sitemap_index.xml 返回 InvalidSitemap（2026-05-20 sitemap-mcp-server 精确解析）
> **解析时间**: 2026-05-20

---

## Sitemap结构

Sitemap Index，包含19个子sitemap：
- `post` - 博客文章
- `page` - 静态页面
- `product` - WooCommerce产品
- `avada_portfolio` - 作品集
- `category`, `post_tag` - 内容分类/标签
- `product_cat`, `product_tag` - 产品分类/标签
- `pa_chakra`, `pa_chinese-zodiac`, `pa_color`, `pa_crystal-type`, `pa_element`, `pa_ethics`, `pa_numerology`, `pa_shape`, `pa_stock`, `pa_zodiac` - WooCommerce产品属性
- `portfolio_category` - 作品集分类

## 页面分类统计

> **MCP解析结果**: FAILED - sitemap_index.xml 返回 InvalidSitemap，0页可访问
> 以下为2026-05-18手动分析数据，保留作为参考

| 页面类型 | 数量 | 说明 |
|---------|------|------|
| 静态页面(Pages) | 34 | 核心站内页面 |
| 产品属性归档页 | ~200+ | 按颜色/星座/脉轮/元素等属性自动生成 |
| 博客文章 | ~100+ | 水晶知识文章 |
| 产品页 | ~500+ | 单品宝石/水晶 |
| **合计(手动估算)** | **~500+** | 全站（手动分析，MCP解析失败） |
| **MCP精确统计** | **0** | sitemap_index.xml返回InvalidSitemap |

## Pages sitemap完整URL清单 (34个页面)

| 分类 | URL |
|------|-----|
| **Home** | `/` |
| **About** | `/about/`, `/my-journey/` |
| **Contact** | `/contact/` |
| **Crystal Learning** | `/crystal-learning-center/`, `/crystal-articles/`, `/learn-about-crystals/`, `/complete-guide-to-crystals/`, `/choosing-crystals/` |
| **Crystal Energy Indexes** | `/crystal-energy-indexes/`, `/crystals-by-chakra/`, `/crystals-by-color/`, `/crystals-by-numerology/`, `/crystals-by-zodiac/`, `/crystals-by-element/` |
| **Ethical Sourcing** (核心差异化) | `/ethical-sourcing-journal/`, `/ethical-lapidary/`, `/ethical-mining/`, `/ethical-crystals/`, `/carbon-footprint-sustainability/` |
| **Shop** | `/shop-ethical-crystals/`, `/shop/` |
| **Healing** | `/crystals-emotional-healing/`, `/crystals-world-healing/`, `/crystals-spiritual-healing/`, `/crystals-physical-healing/` |
| **Feel Loved** | `/feel-loved-crystal-stories/` |
| **Legal** | `/privacy-policy/`, `/terms-of-service/`, `/shipping-delivery/`, `/unsubscribe/`, `/email_unsubscribe/` |
