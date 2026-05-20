# Selfgazer Sitemap解析

> **竞品**: Selfgazer (selfgazer.com)
> **1A清单序号**: #13（灵性扩展竞品 · 塔罗+占星+易经）
> **建站平台**: 自建
> **Sitemap URL**: https://www.selfgazer.com/sitemap.xml
> **解析状态**: 成功（2026-05-20 sitemap-mcp-server 精确解析）

---

## Sitemap结构

单文件 sitemap.xml，通过 robots.txt 引用：

| 子sitemap | URL | 页面数 | 说明 |
|-----------|-----|--------|------|
| `sitemap.xml` | https://www.selfgazer.com/sitemap.xml | **1,020** | 单文件，所有页面 |

**Priority范围**: 0.6 ~ 1.0（均值0.606）—— 唯一使用差异化priority的竞品
**Last Modified**: 1,020/1,020 (100%)

## 页面分类统计

| 页面类型 | 路径模式 | 估算数量 | 占比 |
|---------|---------|---------|------|
| 塔罗牌含义 | `/blog/{card}-tarot-meaning` | ~200+ | ~20% |
| 塔罗Yes/No | `/blog/{card}-yes-or-no` | ~78 | ~8% |
| 塔罗感受解读 | `/blog/{card}-as-feelings` | ~78 | ~8% |
| 太阳/月亮组合 | `/blog/{sign}-sun-{sign}-moon-personality` | ~144 | ~14% |
| 易经卦象 | `/blog/hexagram-{n}-iching-meaning` | ~64 | ~6% |
| 星座行星含义 | `/blog/{planet}-astrology-meaning` | ~15 | ~1.5% |
| 星座宫位 | `/blog/{n}th-house-astrology-meaning` | ~12 | ~1.2% |
| 荣格原型 | `/blog/jungian-archetype-{name}` | ~12 | ~1.2% |
| Pearson原型 | `/blog/pearson-archetype-{name}` | ~12 | ~1.2% |
| 工具/功能页 | `/soul-plan/*`, `/reference/*` | ~30 | ~3% |
| 其他博客 | `/blog/{topic}` | ~300+ | ~30% |

## 内容矩阵分析

### 塔罗牌三变体矩阵（~356页）

每张78张塔罗牌都有3个变体页面：

| 变体 | URL格式 | 数量 |
|------|---------|------|
| 含义解读 | `/blog/{card}-tarot-meaning` | ~78 |
| Yes/No判断 | `/blog/{card}-yes-or-no` | ~78 |
| 感情解读 | `/blog/{card}-as-feelings` | ~78 |
| 其他变体 | `/blog/{card}-advice` 等 | ~122 |

**样本URL:**
- `/blog/the-fool-tarot-meaning`
- `/blog/the-magician-yes-or-no`
- `/blog/the-high-priestess-as-feelings`
- `/blog/ace-of-cups-tarot-meaning`
- `/blog/strength-tarot-meaning`

### 星座太阳/月亮组合（144页）

| URL格式 | 数量 |
|---------|------|
| `/blog/{sign1}-sun-{sign2}-moon-personality` | 12×12=144 |

### 易经64卦

| URL格式 | 数量 |
|---------|------|
| `/blog/hexagram-{1-64}-iching-meaning` | 64 |
| `/blog/what-is-the-iching` | 1 |

### 工具/功能页

| URL | 说明 |
|-----|------|
| `/reference/tarot` | 塔罗参考工具 |
| `/reference/i-ching` | 易经参考工具 |
| `/soul-plan/context` | Soul Plan付费服务 |

## Selfgazer 价值评估

- **高度系统化的SEO内容矩阵**：每张塔罗牌3个变体，78×3=234个塔罗页面
- **星座组合全覆盖**：12×12=144种太阳/月亮组合
- **易经内容差异化**：64卦系列在水晶竞品中独一无二
- **唯一使用Priority差异化**：0.6-1.0范围，表明有SEO策略意识
- **存在开发工具页泄露**：`/dev/tools/*` 页面不应出现在sitemap中
- **自建架构优势**：URL结构干净，所有内容在`/blog/`下
