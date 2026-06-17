# Ask Angels Sitemap解析

> **竞品**: Ask Angels (ask-angels.com)
> **1A清单序号**: #28（灵性扩展竞品 · 天使通灵+灵性指导）
> **建站平台**: WordPress
> **Sitemap URL**: https://www.ask-angels.com/sitemap.xml
> **解析状态**: 成功（2026-05-20 sitemap-mcp-server 精确解析）

---

## Sitemap结构

Sitemap Index，包含9个子sitemap（含.gz和未压缩重复）：

| 子sitemap | 页面数 | 说明 |
|-----------|--------|------|
| `post-sitemap.xml` | **779** | 博客文章 |
| `page-sitemap.xml` | **106** | 静态页面 |
| `sitemap-misc.xml` | **2** | 杂项 |

> **去重后实际唯一页面**: 779 + 106 + 2 = **887**（.gz和未压缩版本重复）

**Priority**: Posts=0.2（极低）, Pages=0.6, Misc=0.5-1.0

## 页面分类统计

| 页面类型 | 数量 | Priority |
|---------|------|----------|
| 博客文章 (Posts) | **779** | 0.2 |
| 静态页面 (Pages) | **106** | 0.6 |
| 杂项 | **2** | 0.5-1.0 |

## 内容主题

### 博客文章（779篇）— 三大目录

| 目录 | 内容方向 | 样本 |
|------|---------|------|
| `/free-angel-messages/` | 天使通灵讯息 | 大天使Metatron/Uriel/Azrael/Zadkiel等系列 |
| `/angel-messages/` | 天使讯息/冥想 | 冥想指导、天使之光 |
| `/spiritual-guidance/` | 灵性指导 | 如何连接天使、直觉开发、前世记忆 |

### 静态页面（106页）

| 类型 | 样本 |
|------|------|
| 通灵阅读服务 | `/channeled-angel-readings/`, `/channeled-angel-readings/free-angel-card-reading/` |
| 课程/产品 | `/angel-courses/` |
| 大天使页面 | `/channeled-messages/archangel-michael/` |
| 冥想 | `/channeled-messages/meditation/` |
| 工具 | `/channeled-angel-readings/free-numerology-reading/` |
| 电商 | `/ask-angels-member/`, `/checkout/`, `/shopping-cart/` |
| 营销落地页 | `/activate-your-ascension-codes/`, `/discover-the-secret/` |
| 感谢页 | `/thank-you-for-your-purchase/`, `/thank-you-for-your-order/` |

## Ask Angels 价值评估

- **天使/灵性垂直**：几乎所有内容围绕大天使、通灵、冥想
- **商业化程度高**：会员系统、在线课程、天使卡阅读、付费通灵
- **Priority策略有问题**：Posts(779篇)设为0.2极低值，不重视博客索引
- **重复sitemap**：同时提供.gz和未压缩版本
- **106个Pages中大量非SEO页**：感谢页、购物车、结账页不应在sitemap中
