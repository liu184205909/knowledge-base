# Tiny Buddha Sitemap解析

> **竞品**: Tiny Buddha (tinybuddha.com)
> **1A清单序号**: #27（灵性社区型 · 论坛+博客）
> **建站平台**: WordPress/BBPress
> **Sitemap URL**: https://tinybuddha.com/sitemap_index.xml
> **解析状态**: 部分（2026-05-20 sitemap-mcp-server 解析 — 统计API超限，仅获取结构树）

---

## Sitemap结构

Sitemap Index，包含170+子sitemap，是本次解析中规模最大的站点：

| 子sitemap类型 | 数量 | 说明 |
|-------------|------|------|
| `post-sitemap.xml` ~ `post-sitemap11.xml` | 11 | 博客文章（11个分片） |
| `page-sitemap.xml` | 1 | 静态页面 |
| `forum-sitemap.xml` | 1 | 论坛版块 |
| `topic-sitemap.xml` ~ `topic-sitemap13.xml` | 13 | 论坛话题 |
| `reply-sitemap.xml` ~ `reply-sitemap132.xml` | **132** | 论坛回复（最大分片） |
| `memberpressproduct-sitemap.xml` | 1 | 会员产品 |
| `wisdom-quote-sitemap.xml` ~ `wisdom-quote-sitemap3.xml` | 3 | 智慧名言 |
| `product-sitemap.xml` | 1 | WooCommerce产品 |
| `category-sitemap.xml` | 1 | 分类 |
| `post_tag-sitemap.xml` ~ `post_tag-sitemap4.xml` | 4 | 标签 |
| `author-sitemap.xml` ~ `author-sitemap3.xml` | 3 | 作者 |
| 其他CPT | 若干 | topic-tag, wisdom-author, wisdom-category, hub等 |

**估计总页面**: **50,000+**

## 页面分类统计（基于结构分析）

| 页面类型 | 估计数量 | 说明 |
|---------|---------|------|
| 论坛回复 (Replies) | **~40,000+** | 132个分片 × ~300/片 |
| 博客文章 (Posts) | **~3,000+** | 11个分片 |
| 论坛话题 (Topics) | **~4,000+** | 13个分片 |
| 智慧名言 | **~900** | 3个分片 |
| 标签 | **~2,000** | 4个分片 |
| 其他 | 若干 | 页面/分类/作者/产品 |

## Tiny Buddha 价值评估

- **社区型站点**：BBPress论坛 + WordPress博客，UGC驱动
- **论坛回复占绝对多数**：132个reply分片，估计40,000+回复页面
- **真实内容量**：去掉论坛回复后，博客文章约3,000+，论坛话题约4,000+
- **商业化为辅**：MemberPress会员 + WooCommerce产品，但不是核心
- **SEO问题**：论坛回复页面大量索引，严重消耗爬虫预算
- **Sitemap过大**：170+子sitemap导致统计API超限
