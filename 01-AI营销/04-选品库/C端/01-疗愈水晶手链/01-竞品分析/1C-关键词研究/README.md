# 1C 关键词研究说明

> **RLM步骤1C当前主线**：逐表清洗 `SEMrush-Seed-Keywords` 中的 `Seed-*` 暂存表，删除跨主题词和无效词，构建 `Seed-Master v1` 项目关键词主表；竞品证据回填在主表完成后再执行。

## 当前项目口径

- `Seed-*` 是按 Topic Pillar 拆分的导入暂存表。每张表只保留本主题高相关词，跨主题词默认删除或回到对应 `Seed-*` 处理。
- 本目录的 `Semrush排除关键词列表.md` 用于 Semrush 导出前过滤明显无关词。
- `Seed-*` 不是最终主表。它们承接种子词导出和初筛，经过人工/AI清洗、去重和 Subtopic 校准后，合并到 `Seed-Master`；`Seed-Master` 才是项目唯一关键词主表。
- Top Pages / Top Keywords 不直接合并进关键词主表。它们只在 `Seed-Master v1` 完成后，用过滤后的 `TopPages_All` 和 `TopKeywords_All` 给主表补竞品关键词证据与页面价值证据。
- 在 `Seed-Master v1` 完成前，不进入 B1b/B2/B3 SEO页面生成、内容 Brief、文章生产。

## 数据层

| 数据层 | 上游位置 | 用途 | 当前状态 |
|------|---------|------|---------|
| Seed-Master 主表 | 清洗后的 `Seed-*` 合并 | 回答“市场有什么需求、我们最终做哪些词” | 表头已创建，待合并；当前不得作为内容 Brief 或 Proof scope 的完成依据 |
| Seed-* 暂存表 | Semrush Keyword Magic / Keyword Overview 导出 | 各 Topic Pillar 的小而准关键词池 | 正在逐表清洗；已清理完成的表可进入 `Seed-Master v1` |
| TopPages_All | SEMrush-Top-Pages | 汇总竞品页面级 SEO 价值 | 作为后续证据增强输入；不直接创建关键词主表 |
| TopKeywords_All | SEMrush-Top-Keywords | 汇总竞品关键词排名与排名 URL | 作为后续证据增强输入；未命中词不直接进入 Seed-Master |
| Keyword-Page-Proof / 证据回填 | TopKeywords_All x TopPages_All | 给关键词主表补竞品成功证据 | `Seed-Master v1` 完成后再执行 |

## Seed-Master 状态

- `Seed-Master` 当前不是完成态；它必须由清洗后的 `Seed-*` 合并得到。
- 每个 `Seed-*` 在合并前必须尽量清零 `Delete / Review`，并删除跨主题词。
- 例如：`Seed-Tarot` 只保留主意图为 Tarot 的关键词；星座、生日、月份等词回到对应主题池或删除。
- `Seed-Master v1` 先承接基础字段：Keyword / 中文 / Topic Pillar / Subtopic / Volume / KD / CPC / Number of Results / Intent。
- 竞品证据字段、Priority、Recommended Page Type、Status 等研究字段在 `Seed-Master v1` 后再补。

## 当前待办

当前重点不是生成内容 Brief，而是完成 `Seed-*` 清洗和 `Seed-Master v1`。

正式进入批量 Brief 前，需要按顺序完成：

1. 逐表清理 `Seed-*` 的 Delete / Review / 跨主题词。
2. 合并清洗后的 `Seed-*` 到 `Seed-Master v1`。
3. 运行或刷新 `TopKeywords_All / TopPages_All` 证据层。
4. 把竞品关键词证据和页面证据回填到 `Seed-Master`。
5. 再做 Priority / Recommended Page Type / 内容 Brief。

## 清洗原则

- 每个 `Seed-*` 只保留自己的主题词。
- 主意图不属于当前主题的词，不要为了“可能有用”留在当前表。
- 交叉词只有在当前主题仍是主意图时保留，例如 `tarot astrology spread` 可留在 `Seed-Tarot`；单纯 `zodiac signs` 不应留在 `Seed-Tarot`。
- `Review` 不是长期状态。清洗完成后应改为 `Keep` 或删除。
- 清洗完成的 `Seed-*` 应默认整表可以进入 `Seed-Master v1`。

## 维护脚本

脚本实现状态以 `01-AI营销/02-自动化工具库/02-竞品研究工具/1B数据处理工具手册.md` 为准。`Seed-Master` 合并和证据回填前必须先确认脚本与当前字段规则一致。

脚本位于项目 `01-竞品分析/` 或知识库根目录 `scripts/` 中：

- `generate_all_tables.py`：生成 TopPages_All / TopKeywords_All。
- `generate_keyword_page_proof.py`：生成 Keyword-Page-Proof。
- `backfill_seed_keywords.py`：回填 Seed-Master 竞品验证，需确认已适配当前字段。
- `scripts/translate_seed_keywords.py`：从知识库根目录执行，批量补 `Seed-*` 的中文翻译列。
