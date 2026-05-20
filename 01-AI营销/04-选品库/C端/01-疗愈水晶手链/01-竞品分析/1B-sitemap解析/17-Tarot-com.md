# Tarot.com Sitemap解析

> **竞品**: Tarot.com (tarot.com)
> **1A清单序号**: #17（灵性扩展竞品 · 塔罗工具+付费解读）
> **建站平台**: 自建
> **Sitemap URL**: https://gfx.tarot.com/tarot_sitemap.xml (CDN子域名托管)
> **解析状态**: 成功（2026-05-20 sitemap-mcp-server 精确解析）

---

## Sitemap结构

单文件 sitemap.xml，托管在CDN子域名 `gfx.tarot.com`：

| 子sitemap | URL | 页面数 | 说明 |
|-----------|-----|--------|------|
| `tarot_sitemap.xml` | https://gfx.tarot.com/tarot_sitemap.xml | **1,349** | 单文件全站 |
| `robots_desktop.txt` | — | 0 | 桌面端专用robots |

**Priority**: 全部0.5
**Last Modified**: 953/1,349 (70.6%)

## 页面分类统计

| 页面类型 | 路径模式 | 估算数量 | 占比 |
|---------|---------|---------|------|
| 文章内容 | `/articles/*` | ~600+ | ~44% |
| 占星/功能页 | `/astrology/*`, `/health/*` | ~500+ | ~37% |
| 塔罗牌含义页 | `/tarot/cards/{card}` | **78** | 5.8% |
| 付费塔罗解读 | `/readings-reports/tarot-readings/{type}` | ~40+ | 3.0% |
| 塔罗牌组 | `/tarot/decks/{deck}` | ~30+ | 2.2% |
| 占星报告 | `/readings-reports/astrology-reports/{type}` | ~15+ | 1.1% |
| 塔罗兼容性 | `/astrology/compatibility/tarot/{card}` | ~22 | 1.6% |
| 出生牌组合 | `/tarot/birth-cards-{c1}-{c2}` | ~12 | 0.9% |
| 作者简介 | `/articles/bios/{name}` | ~10 | 0.7% |
| **合计** | | **1,349** | 100% |

## 塔罗牌含义页（78张全覆盖）

| 类型 | 样本URL |
|------|---------|
| 大阿卡纳 | `/tarot/cards/the-fool`, `/tarot/cards/the-magician`, `/tarot/cards/death`, `/tarot/cards/the-tower` |
| 小阿卡纳 | `/tarot/cards/ace-of-wands`, `/tarot/cards/king-of-coins` |
| 花色总览 | `/tarot/cards/suit-of-wands-meaning`, `/tarot/cards/minor-arcana` |
| 精选 | `/tarot/cards/best-cards`, `/tarot/cards/worst-cards` |

## 付费解读产品页

| 类型 | 样本URL |
|------|---------|
| 塔罗解读 | `/readings-reports/tarot-readings/celtic-cross` |
| | `/readings-reports/tarot-readings/breakthrough-tarot` |
| | `/readings-reports/tarot-readings/timeline` |
| | `/readings-reports/tarot-readings/mandala` |
| | `/readings-reports/tarot-readings/reconciliation` |
| | `/readings-reports/tarot-readings/karma` |
| | `/readings-reports/tarot-readings/free` |
| 占星报告 | `/readings-reports/astrology-reports/yearly-forecast` |
| | `/readings-reports/astrology-reports/relationship-potential` |
| | `/readings-reports/astrology-reports/love-languages` |

## 塔罗牌组（30+种）

| 牌组 | URL |
|------|-----|
| Dark Exact | `/tarot/decks/dark-exact` |
| Mystic Mondays | `/tarot/decks/mystic-mondays` |
| Melanated | `/tarot/decks/melanated` |
| Vampire | `/tarot/decks/vampire` |
| Crystal Visions | `/tarot/decks/crystal-visions` |
| Motherpeace | `/tarot/decks/motherpeace` |

## 独特功能

| 功能 | URL | 说明 |
|------|-----|------|
| 出生牌计算器 | `/tarot/tarot-birth-card-calculator` | 互动工具 |
| 出生牌组合 | `/tarot/birth-cards-magician-wheel` | 12组组合 |
| 塔罗+占星兼容性 | `/astrology/compatibility/tarot/the-magician` | 交叉内容矩阵 |
| 教育页面 | `/tarot/tarot-101-how-readings-work` | 引导付费转化 |
| | `/tarot/how-to-shuffle-tarot-cards` | 教程 |

## Tarot.com 价值评估

- **商业化程度最高的灵性竞品**：大量付费解读产品（Celtic Cross、Timeline、Mandala等），每个解读类型是独立产品
- **完整的78张塔罗牌参考库**：所有Major + Minor Arcana牌面都有详细含义页
- **多牌组支持**：30+种塔罗牌组，用户可选不同牌组进行解读
- **塔罗+占星交叉矩阵**：`/astrology/compatibility/tarot/` 路径下22+页面
- **Sitemap托管在CDN子域**：`gfx.tarot.com`，技术架构独特
- **内容教育+商业转化结合**：教育页面自然引导到付费解读
- **使用robots_desktop.txt**：可能有移动端分离策略
