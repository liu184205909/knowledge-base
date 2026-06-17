# 1C 关键词研究说明

> **RLM步骤1C当前主线**：`Seed-Master v3` 已完成，覆盖 15 个 Topic Pillar 共 47,745 条 × 24 列（含竞品证据增强字段）。1B 轨道D 竞品证据回填已完成。当前已进入步骤2/3 执行阶段。

## 当前项目口径

- `Seed-*` 是按 Topic Pillar 拆分的导入暂存表。每张表只保留本主题高相关词，跨主题词默认删除或回到对应 `Seed-*` 处理。
- 本目录的 `Semrush排除关键词列表.md` 用于 Semrush 导出前过滤明显无关词。
- `Seed-*` 不是最终主表。它们承接种子词导出和初筛，经过人工/AI清洗、去重和 Subtopic 校准后，合并到 `Seed-Master`；`Seed-Master` 才是项目唯一关键词主表。
- Top Pages / Top Keywords 已通过 1B 轨道D 完成竞品证据回填到 `Seed-Master`。
- 页面决策表（2B）和内容清单（步骤3）已基于 Seed-Master 数据完成。

## 数据层

| 数据层 | 上游位置 | 用途 | 当前状态 |
|------|---------|------|---------|
| Seed-Master 主表 | 12 个 `Seed-*` 清洗后合并 + 1B 轨道D 证据增强 | 项目唯一关键词主表，驱动页面决策和内容清单 | **v3 完成**: 47,745 条 × 24 列，覆盖 15 个 Topic Pillar |
| Seed-* 暂存表 | Semrush Keyword Magic / Keyword Overview 导出 | 各 Topic Pillar 的小而准关键词池 | 12 个 `Seed-*` 全部清洗完成并合并到 Seed-Master |
| TopPages_All | SEMrush-Top-Pages | 汇总竞品页面级 SEO 价值 | 已完成，用于轨道D 证据增强 |
| TopKeywords_All | SEMrush-Top-Keywords | 汇总竞品关键词排名与排名 URL | 已完成，用于轨道D 证据增强 |
| 竞品证据增强 (1B 轨道D) | TopKeywords_All × TopPages_All | 给关键词主表补竞品成功证据 | **已完成**: Seed-KD/Seed-CPC 等字段已回填 |

## Seed-Master 状态

- `Seed-Master v3` 当前已完成，47,745 条 × 24 列，覆盖 15 个 Topic Pillar。
- 已包含字段：Keyword / 中文 / Topic Pillar / Entity / Subtopic / Content Role / Volume / KD / CPC / Number of Results / Intent + 竞品证据字段 (Seed-KD / Seed-CPC / 竞品URL 等) + Recommended Page Type + Priority。
- 37 种 Page Type 和 15 个 Topic Pillar 已标注。
- 该版本为项目关键词数据底座，支撑了 2B 页面决策表（59 个页面类型）和步骤3 内容清单（992 条）。

## 下游产出

基于 Seed-Master v3 已完成的下游产出：

1. **2B 页面决策表** — 59 个页面类型，B1a/B1b/B2/B3/B4 批次已决策
2. **步骤3 内容清单** — 992 条 × 17 列（含 KD/CPC/竞品验证），Google Sheets
3. **1C 关键词分组与优先级** — 页面类型维度和 Topic Pillar 维度的分组已体现在页面决策表和内容清单中

## 当前待办

Seed-Master v3 已完成，1B/1C 阶段无重大数据待办。当前执行重点在步骤2（B1b 2C/2D）和步骤3（Brief 批量生成）。

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
- `01-AI营销/02-自动化工具库/02-竞品研究工具/scripts/translate_seed_keywords.py`：从知识库根目录执行，批量补 `Seed-*` 的中文翻译列。
