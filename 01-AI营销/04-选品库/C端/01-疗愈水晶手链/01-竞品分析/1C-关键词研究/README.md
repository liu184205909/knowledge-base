# 1C 关键词研究说明

> **RLM步骤1C输出**：把 `SEMrush-Seed-Keywords` 中的 `Seed-*` 暂存表合并为 `Seed-Master` 项目关键词主表，并用竞品验证视图补充关键词证据。

## 当前项目口径

- `semrush volume>100` / Seed-Crystals 是当前水晶品类导入暂存表，包含 4,391 条关键词数据。
- 本目录的 `Semrush排除关键词列表.md` 用于 Semrush 导出前过滤明显无关词。
- Seed-* 不是最终主表。它们承接种子词导出和初筛，经过人工/AI清洗、去重、聚类、意图判断和页面类型映射后，合并到 Seed-Master；Seed-Master 才是项目唯一关键词主表。
- Top Pages / Top Keywords 不直接合并进关键词主表。它们需要先生成过滤后的 `TopPages_All` 和 `TopKeywords_All`，再通过 `competitor_domain + normalized_url` 生成 `Keyword-Page-Proof`，用于判断关键词是否已有竞品页面实际拿到流量。

## 数据层

| 数据层 | 上游位置 | 用途 | 当前状态 |
|------|---------|------|---------|
| Seed-Master 主表 | 暂存表合并 + 竞品增量词 | 回答"市场有什么需求、我们最终做哪些词" | **表头已创建** (2026-05-26): 19 列空表；Seed-Crystals（4,391 条）待合并 |
| Seed-Crystals 暂存表 | Semrush Keyword Magic 导出 | 水晶品类导入暂存表 | 已有 4,391 条 × 14列；合并到 Seed-Master 后仍保留为暂存表 |
| TopPages_All | SEMrush-Top-Pages | 汇总竞品页面级SEO价值 | **旧版**: 289行 × 9列（仅 thecrystalcouncil），待按 Competitor-Sheet-Map 重新生成 |
| TopKeywords_All | SEMrush-Top-Keywords | 汇总竞品关键词排名与排名URL | **旧版**: 2,000行 × 13列（仅 thecrystalcouncil），待按 Competitor-Sheet-Map 重新生成 |
| Competitor-Sheet-Map | SEMrush-Top-Keywords | 竞品工作表配置（读取白名单） | **草案** (2026-05-26): 31 个竞品，`known_topic_hint` 为可选提示，待人工审核 |
| Topic-Discovery | TopKeywords_All + Competitor-Sheet-Map | 主题发现报告 | 待生成 |
| Keyword-Page-Proof | TopKeywords_All x TopPages_All | 给关键词主表补竞品成功证据 | **旧版**: 1,913行 × 14列（仅 thecrystalcouncil），待重跑 |

## Seed-Master 状态

- Seed-Crystals（暂存表）：4,391 条关键词，14 列，待合并到 Seed-Master
- 合并规则：迁移基础字段（Keyword / Volume / KD / CPC / Intent），自动填 Topic Pillar = Crystals / Status = Approved / Source Type = Seed。Competitor Proof 等字段留空，待新 Proof 重跑后回填。
- Topic Pillar / Subtopic / Recommended Page Type：Seed-Master 合并后待 AI 聚类分析和页面类型映射
- 非水晶品类（天使数字 / MBTI / 星座配对 / 月相 / 塔罗 / 灵性）：执行前需要单独补充种子词导出和筛选

## 待补充

当前 Seed-Crystals 暂存表主要覆盖水晶品类。项目简报中已标注：天使数字、MBTI、星座配对、月相、塔罗、灵性等非水晶跨界内容，执行前需要单独补充种子词导出和筛选。

正式进入批量 Brief 前，需要补齐：

- Competitor-Sheet-Map 人工审核
- TopKeywords_All / TopPages_All 按新流程重新生成
- Topic-Discovery 主题确认
- Seed-Crystals 合并到 Seed-Master
- Topic Pillar / Subtopic / Recommended Page Type（AI 聚类分析）
- 非水晶品类暂存表导入（天使数字 / MBTI / 星座配对 / 月相 / 塔罗 / 灵性）
- 新 Keyword-Page-Proof 生成并回填 Seed-Master

## 维护脚本

> 脚本实现状态以 `01-AI营销/02-自动化工具库/02-竞品研究工具/1B数据处理工具手册.md` 第 6 节为准。当前新架构脚本尚未全部实现，Seed-Master 合并和 Proof 回填前必须先确认脚本已适配。

脚本位于 `01-竞品分析/` 目录：

- `generate_all_tables.py` — 生成 TopPages_All / TopKeywords_All（需先审核 Competitor-Sheet-Map）
- `generate_topic_discovery.py` — 生成 Topic-Discovery
- `generate_keyword_page_proof.py` — 生成 Keyword-Page-Proof
- `backfill_seed_keywords.py` — 回填 Seed-Master 竞品验证
