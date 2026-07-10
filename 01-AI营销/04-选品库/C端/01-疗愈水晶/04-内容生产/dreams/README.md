# Dream 内容生产目录

> 更新时间: 2026-07-09
> 定位: Dream 内容生产的唯一入口索引。旧的过程状态、brief shard 说明、evidence 摘要、QA 摘要应收口到这里, 避免多份状态文档互相打架。

## 当前结论

Dream 内容生产已跑到 repaired draft layer, 但没有进入可发布完成态。

- Candidate source: `_shared/dreams-candidates.json`
- Knowledge skeleton: `_shared/dreams-knowledge.json`
- Workflow scope: P0/P1/P2/P3 candidates
- Included rows: 1,289
- Parked rows: 34
- `publication_ready`: false
- 当前产物是 draft / QA / image queue, 不是 WordPress final pages。

## 关键边界

1. 不允许 `/dream-dictionary/` URL。
2. 不允许在 evidence、brief、article、image、QA 全部通过前写 `publication_ready=true`。
3. 不允许医疗诊断、心理健康诊断、宗教裁决、预言保证、水晶疗效保证。
4. Islamic 图片必须避免 sacred text、calligraphy、human figures。
5. violent / death / chase / pregnancy 等敏感主题必须抽象化。
6. duplicate slug 不可直接发布。
7. `Parked`、`brand_query`、`cross_vertical`、`non_english`、`unsafe_skip`、`typo`、duplicate rows 必须有明确 route status。

## 当前保留主产物

| 类型 | 当前主文件 | 说明 |
|---|---|---|
| 候选源 | `_shared/dreams-candidates.json` | 候选全集 |
| 知识骨架 | `_shared/dreams-knowledge.json` | 当前为匹配/约束/推荐骨架, 不是最终内容知识库 |
| Evidence | `evidence/dream-evidence-repaired-full-1289.jsonl` | 最新 repaired evidence 全量 |
| Briefs | `briefs/dream-briefs-repaired-full-1289.jsonl` | 最新 repaired brief 全量 |
| Articles | `articles/dream-articles-repaired-full-1289.jsonl` | 最新 repaired article draft 全量 |
| Images | `images/dream-image-queue-repaired-full-1289.jsonl` | 最新 repaired image queue |
| Image results | `images/dream-image-generation-results-repaired-full-1289.jsonl` | 最新图片生成结果 |
| QA report | `qa/dream-repaired-full-1289-prepublish-qa-20260709.md` | 发布前主 QA 报告 |
| QA data | `qa/dream-repaired-full-1289-prepublish-qa-20260709.json` | 发布前机器 QA 结果 |
| Decisions | `qa/repaired-full-prepublish-decisions.jsonl` | 发布决策明细 |
| Summary | `qa/repaired-full-production-summary.json` | 最新 repaired production summary |

## 生产摘要

来自 repaired full production:

- Rows: 1,289
- `original_clean`: 351
- `draftable_after_repair`: 938
- Priority:
  - P0: 11
  - P1: 36
  - P2: 122
  - P3: 1,120
- Original noise flags:
  - `cross_vertical`: 636
  - `low_confidence`: 344
  - `duplicate_slug`: 217
  - `brand_query`: 21
  - `generic_navigation`: 19
  - `typo`: 3

## Brief 生产口径

旧 brief shard 口径:

- Target briefs: 1,289
- Publishable draft briefs: 351
- Blocked/revision briefs: 938
- Knowledge matched: 247
- Knowledge unmatched: 1,042
- Parked excluded: 34

旧 `dream-briefs-p0-p3-shard-001..013` 是中间分片。当前应优先读 `briefs/dream-briefs-repaired-full-1289.jsonl`。

## Evidence 生产口径

旧 evidence enrichment 说明:

- Full enrichment source rows: 1,323
- Knowledge matches: 247
- Enrichable records: 351
- Route counts:
  - `enrichable`: 351
  - `needs_revision`: 938
  - `blocked`: 34

注意: competitor gaps 是本地规划假设, 不是 live SERP findings。Psychology / spiritual / crystal angles 仍是 conservative skeleton, 需要 source/editorial review 后才能成为最终文章内容。

## Image 生产口径

图片规则:

- `route=draftable`: 可进入 image request。
- `route=blocked` / `route=needs_revision`: 只保留 route, 不生成实际 hero prompt。
- 默认 size: 1536x864
- 默认 format: webp
- Crystal slots 复用现有 390 crystal library images, 不重新生成 crystal-only image。

安全规则:

- No dark horror, gore, corpses, injury, weapons, medical scenes, sexual content, or realistic distress.
- Violence, death, chase, drowning, disaster, pregnancy 等主题必须 symbolic and abstract。
- Islamic prompts must be non-figurative: no people, no faces, no sacred text, no Quranic text, no calligraphy。
- Religious prompts are reflective visuals only, not doctrine and not binding faith rulings。

## QA 摘要

当前发布前 QA 主结论:

- 三个 JSONL 主产物均为 1,289 rows。
- `publication_ready=false` 全部通过。
- root-level URL、无 `/dream-dictionary/`、核心合规 flag、hard-claim phrase 检查通过。
- 旧 QA 曾发现 repaired slug duplicates 和宗教敏感漏标; 后续 decision summary 已显示 duplicate slug count 为 0。
- `repaired-full-prepublish-decisions-summary.json` 口径:
  - human_review: 639
  - publish_candidate: 392
  - rewrite_slug: 258
  - duplicate_slug_count: 0
  - publication_ready: false

发布前仍应以 `qa/dream-repaired-full-1289-prepublish-qa-20260709.md` 和 `qa/repaired-full-prepublish-decisions.jsonl` 为准。

## 可复现脚本

| 脚本 | 用途 |
|---|---|
| `_shared/build_dreams_data.py` | 构建 candidates / knowledge |
| `run_repaired_full_production.py` | 当前 repaired production 主脚本 |
| `images/generate-repaired-dream-images.js` | 当前 repaired image generation 脚本 |
| `qa/validate_dream_workflow.py` | workflow 验证 |
| `qa/build_repaired_prepublish_decisions.py` | prepublish decision 构建 |

## 与工具线关系

AI Dream Interpreter 工具不等待深度文章完成。工具线使用 `_shared/dreams-knowledge.json` 的骨架字段做:

- 梦象匹配
- crystal candidate seed
- religious sensitivity / compliance guardrails
- internal link / shop CTA 候选

工具最终解释由 LLM 实时生成。当前 `dreams-knowledge.json` 不是最终心理学/宗教/文章内容知识库。

工具主文档: `../../02-网站规划/AI-Dream-Interpreter-数据层与工具设计.md`

## 清理原则

后续读取优先级:

1. 先读本 README。
2. 再读 repaired full 主产物。
3. 需要问题明细时读 QA 主报告和 decisions JSONL。
4. 旧 full、旧 shard、worker manifest、live progress 等过程文件不要作为当前状态依据。
