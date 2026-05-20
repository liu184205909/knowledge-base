# Dream Bible Sitemap解析

> **竞品**: Dream Bible (dreambible.com)
> **1A清单序号**: #25（梦境领域竞品 · 纯静态HTML）
> **建站平台**: 自建静态站
> **Sitemap URL**: https://www.dreambible.com/sitemap.xml
> **解析状态**: 成功（2026-05-20 sitemap-mcp-server 精确解析）

---

## Sitemap结构

单文件 sitemap.xml：

| 子sitemap | 页面数 |
|-----------|--------|
| `sitemap.xml` | **96** |

**Priority**: 首页0.9，专题页0.5-0.8，词典页0.1
**Last Modified**: 无

## 页面分类统计

| 页面类型 | 数量 | URL模式 |
|---------|------|---------|
| 首页 | 1 | `/` |
| 字母词典页 | ~85 | `/dreamdictionary/{letter}[\{n}].html` |
| 专题主题页 | 7 | `/{topic}.html` (numbers, sex, hair, birds, countries, race-culture-skin-color) |
| **合计** | **96** | |

## Dream Bible 价值评估

- **极致简洁的自建站**：96个页面，纯静态HTML
- **字母分页策略**：按首字母A-Z组织词典，热门字母（S最多10页）有多页
- **无last_modified**：静态生成后未更新
- **无博客/文章**：内容深度有限，仅靠词典页
- **Priority有差异化**：首页0.9 > 专题页0.5-0.8 > 词典页0.1（合理分层）
