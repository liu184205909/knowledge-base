# Crystal Compatibility Checker（工具①）

> **URL**：`/tools/crystal-compatibility-checker/`（page 43180）｜**状态**：✅ 已上线
> **本质**：水晶×水晶兼容计算（前端 JS 静态计算，30 颗核心水晶，选 2 颗）

---

## 数据流

```
_shared/crystal-attributes.json (390 颗)
        ↓ 抽取 element/chakra/intention/pairing
data/crystal-stones-30.json (30 颗核心 + 5×5 元素矩阵 + 6 条冲突)
        ↓ engine/compatibility-engine.js (pairScore v2 算法参考实现)
build/generate.js (内嵌 pairScore + 207 HAS_ARTICLE + 注入 seo-content)
        ↓
build/crystal-checker.html (成品 43.9 KB)
        ↓ 部署（wp:html 块包裹）
page 43180 上线
```

---

## 目录

| 路径 | 内容 |
|------|------|
| `engine/compatibility-engine.js` | pairScore v2 算法（参考实现；`build/generate.js` 内嵌同算法） |
| `data/crystal-stones-30.json` | 30 颗核心水晶 + `elem`（5×5 元素矩阵）+ `conflicts`（6 条传统冲突） |
| `build/generate.js` | 生成 crystal-checker.html（原 `generate-crystal-checker.js`） |
| `build/crystal-checker.html` | 成品页面（部署到 43180） |
| `build/seo-content.html` | SEO 折叠长文（被 generate.js 注入成品） |
| `seo/SEO框架与内链规划.md` | SEO 文章框架 + 内链规则（207 篇配对文章 CTA） |
| `视觉组件规范.md` | UI 组件规范（品牌色/卡片/结果区线框） |

---

## 算法要点（pairScore v2）

- 元素矩阵 base + 共享 chakra × 5 + 共享 intention × 5 + 站内 pairing +15（命中保底 80）
- 冲突库 6 条命中 → 25 Conflicting（强制）
- 分档：≥85 Excellent / 70-84 Harmonious / 55-69 Moderate / 40-54 Neutral / <40 Conflicting
- **HAS_ARTICLE**：207 组精选配对 → CTA 跳 `/{a}-and-{b}/`；其余 228 组 → "Shop This Pair"
- **算法透明**：Why This Pairing 卡明示加减分（差异化于竞品笼统文案）

---

## 重新生成

```bash
node build/generate.js        # → build/crystal-checker.html（43.9 KB）
```

数据变更（如 207 篇文章清单更新）后重跑即可，`HAS_ARTICLE` 自动从 `04-内容生产/5.crystal-combinations/selected-articles.json` 读取。

---

## 相关

- 数据源：[_shared/crystal-attributes.json](../_shared/crystal-attributes.json)
- SEO/内链：[seo/SEO框架与内链规划.md](seo/SEO框架与内链规划.md)
- 视觉规范：[视觉组件规范.md](视觉组件规范.md)
- 框架规格：[模板-互动工具框架.md](../../03-内容策略/内容Brief/模板-互动工具框架.md) 工具①
- 待做：留资集成（邮箱换完整报告 → Newsletter）
