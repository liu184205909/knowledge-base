# Crystal Meaning Search（T2）

> **URL**：`/crystal-meaning-search/`（page 44461）｜**状态**：✅ 已上线（2026-06-26）
> **本质**：390 颗水晶含义搜索 + 4 facet 多选筛选（color/chakra/element/intention）+ 卡片网格
> **URL 注**：2E 规划 `/tools/` 前缀；实际部署根级（`/tools/crystal-meaning-search/` 301 重定向兜底，不 404）。若需严格 `/tools/`，设 parent=tools page。

---

## 数据流

```
_shared/crystal-attributes.json (overview 字段)
  + 04-内容生产/1.crystal-meaning/*.json (img: form_bracelet + excerpt 一句话含义)
        ↓ build/extract-search-data.js (4 维归一化)
data/search-data.json (390 颗，230 KB)
        ↓ build/generate.js (内嵌数据 + 搜索/筛选 UI + 注入 SEO 折叠)
build/crystal-meaning-search.html (185 KB)
        ↓ build/deploy.js (wp:html 包裹 → POST 创建 page)
page 44461 上线
```

---

## 目录

| 路径 | 内容 |
|------|------|
| `build/extract-search-data.js` | 从属性库 + 原始 json 提取搜索数据集（含 4 维 facet 归一化） |
| `build/generate.js` | 生成成品 HTML（搜索框 + facet + 卡片网格 + SEO） |
| `build/deploy.js` | 首次创建 page + 上传（44461 已建，重跑需改 update 模式） |
| `build/seo-content.html` | SEO 折叠长文（772 词，覆盖 crystal meaning 长尾） |
| `build/crystal-meaning-search.html` | 成品页面（部署到 44461） |
| `data/search-data.json` | 390 颗搜索数据（name/img/excerpt/colors/chakras/element/intentions/link） |

---

## facet 归一化（关键：原始值太多，必须归并才能筛选）

| facet | 原始去重值 | 归一化目标 | 覆盖率 |
|-------|-----------|-----------|--------|
| color | 399 | 12 色系（关键词映射） | 100% |
| chakra | — | 7 脉轮（CHAKRA_MAP） | 100% |
| element | 48 | 5 元（fire/water/earth/air/ether） | 100% |
| intention | 284 | 8 意图 tag（对齐 intention 页） | 100% |

---

## 重新生成 / 部署

```bash
node build/extract-search-data.js   # 数据变更时重生 search-data.json
node build/generate.js              # → crystal-meaning-search.html
# 部署：page 44461 已存在，重跑 deploy.js 会 slug 冲突；改用 WP REST update（POST /pages/44461）
```

---

## 相关

- 数据源：[_shared/crystal-attributes.json](../_shared/crystal-attributes.json)
- 规划：[2E-页面工具规划.md §T2](../../02-网站规划/2E-页面工具规划.md)
- 待做：URL 移到 `/tools/` 下（设 parent=tools page）；`SearchResultsPage` Schema
