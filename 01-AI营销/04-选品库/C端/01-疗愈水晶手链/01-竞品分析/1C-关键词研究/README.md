# 1C 关键词研究说明

> **RLM步骤1C输出**：把 `SEMrush-Seed-Keywords` 清洗成项目关键词主表，并用竞品验证视图补充关键词证据。

## 当前项目口径

- `semrush volume>100` Google Sheet 是当前水晶品类关键词主表，包含 4,391 条关键词数据。
- 本目录的 `Semrush排除关键词列表.md` 用于 Semrush 导出前过滤明显无关词。
- Seed Keywords 不是一次性原始池。它初始承接种子词导出，经过人工/AI清洗、去重、聚类、意图判断和页面类型映射后，就是项目唯一关键词主表。
- Top Pages / Top Keywords 不直接合并进关键词主表。它们需要先生成过滤后的 `TopPages_All` 和 `TopKeywords_All`，再通过 `competitor_domain + normalized_url` 生成 `Keyword-Page-Proof`，用于判断关键词是否已有竞品页面实际拿到流量。

## 数据层

| 数据层 | 上游位置 | 用途 | 当前状态 |
|------|---------|------|---------|
| Seed Keywords 主表 | Semrush Keyword Magic / Keyword Overview 导出 | 回答"市场有什么需求、我们最终做哪些词" | 已有 4,391 条 × 14列；Priority/Source/Proof 已回填；Topic Cluster/Recommended Page Type 待填充 |
| TopPages_All | SEMrush-Top-Pages 遍历所有竞品原始工作表，只保留 Traffic >=100 的页面，每竞品最多300页 | 汇总竞品页面级SEO价值 | 已生成 289行 × 10列（当前仅 thecrystalcouncil） |
| TopKeywords_All | SEMrush-Top-Keywords 遍历所有竞品原始工作表，只保留有流量证据、有URL、且英文词数不少于2的关键词，每竞品最多2000词 | 汇总竞品关键词排名与排名URL | 已生成 2,000行 × 13列（当前仅 thecrystalcouncil） |
| Keyword-Page-Proof | 过滤后的 TopKeywords_All x TopPages_All；范围限定为 Seed Keywords 命中词 + 非主表 Strong/Medium 增量机会 | 给关键词主表补竞品成功证据 | 已生成 1,913行 × 14列；Strong(299)/Medium(1,614)/Weak(0)/None(0) |
| 人工/AI候选词 | 项目种子关键词、内容策略候选方向 | 只能作为候选，必须补数据验证 | 按需补入主表 |

## Seed Keywords 竞品验证统计

- 总关键词：4,391
- 有竞品验证：277（6.3%）
  - 已从过滤版 Keyword-Page-Proof 匹配并回填 Competitor Proof / Proof URL / Source Detail
- 无竞品验证：4,114（93.7%）
  - 仅来自 Semrush 种子词导出，尚未在竞品数据中出现
- Priority 分布：P0(13) / P1(1,103) / P2(3,175) / P3(100)

## 待补充

当前关键词主表主要覆盖水晶品类。项目简报中已标注：天使数字、MBTI、星座配对、月相、塔罗、灵性等非水晶跨界内容，执行前需要单独补充种子词导出和筛选。

正式进入批量 Brief 前，需要补齐：

- Topic Cluster / Recommended Page Type（AI 聚类分析）
- 内容清单中的 KD / CPC / 竞品验证字段
- 非水晶品类种子词导出（天使数字/MBTI/星座配对/月相/塔罗/灵性）

## 维护脚本

脚本位于 `01-竞品分析/` 目录：

- `generate_all_tables.py` — 生成 TopPages_All / TopKeywords_All
- `generate_keyword_page_proof.py` — 生成 Keyword-Page-Proof
- `backfill_seed_keywords.py` — 回填 Seed Keywords 竞品验证
