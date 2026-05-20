# The Hoodwitch Sitemap解析

> **竞品**: The Hoodwitch (thehoodwitch.com)
> **1A清单序号**: #29（灵性扩展竞品 · 占星周更型）
> **建站平台**: Squarespace
> **Sitemap URL**: https://www.thehoodwitch.com/sitemap.xml
> **解析状态**: 成功（2026-05-20 sitemap-mcp-server 精确解析）

---

## Sitemap结构

单文件 sitemap.xml（Squarespace标准）：

| 子sitemap | 页面数 |
|-----------|--------|
| `sitemap.xml` | **1,779** |

**Priority**: 绝大多数0.5，少数关键页1.0
**Last Modified**: 1,148/1,779 (64.5%)

## 页面分类统计（基于URL分析）

| 页面类型 | URL模式 | 估算数量 |
|---------|---------|---------|
| 周运 | `/blog/{y}/{m}/{d}/weekly-horoscopes-...` | ~400+ |
| 月相/天象 | `/blog/{y}/{m}/{d}/{moon-event}` | ~300+ |
| 星象事件 | `/blog/{y}/{m}/{d}/{astrology-event}` | ~500+ |
| 其他博客 | `/blog/{y}/{m}/{d}/{topic}` (含加密slug) | ~400+ |
| 落地页 | `/integratron` 等 | ~5+ |
| 博客索引 | `/blog` | 1 |

## 内容三大支柱

| 支柱 | 内容方向 | 更新频率 |
|------|---------|---------|
| **Weekly Horoscopes** | 每周运势，12星座全覆盖 | 每周1篇 |
| **Moon Events** | 新月/满月/月食 + ritual指南 | 按月相周期 |
| **Astrology Transits** | 行星逆行/星座季节/重要相位 | 按天象事件 |

## 样本URL

| 时间 | URL |
|------|-----|
| 2026-05 | `/blog/2026/5/14/taurus-super-moon-2026` |
| | `/blog/2026/5/11/weekly-horoscopes-may-11-17-2026` |
| | `/blog/2026/5/5/pluto-retrograde-2026` |
| 2026-03 | `/blog/2026/3/20/spring-equinox-2026-rituals-intentions-amp-how-to-celebrate` |
| 2026-02 | `/blog/2026/2/28/total-blood-moon-lunar-eclipse-in-virgo` |
| | `/blog/2026/2/24/mercury-retrograde-in-piscesnbsp` |

## The Hoodwitch 价值评估

- **Squarespace单sitemap**：1,779页全在一个文件，无分类拆分
- **高频更新**：每周2-3篇，内容保持新鲜
- **时间驱动URL**：`/blog/{y}/{m}/{d}/{slug}` 标准Squarespace结构
- **加密slug问题**：大量URL含随机字符（如`/svh0j1un9dxdlf7dk4wme4205rmvzf`），可能是付费内容，SEO价值零
- **AMP编码残留**：部分URL含`nbsp`后缀（如`mercury-retrograde-in-piscesnbsp`）
- **占星+灵性双主题**：占星周运为核心，灵性ritual为补充
