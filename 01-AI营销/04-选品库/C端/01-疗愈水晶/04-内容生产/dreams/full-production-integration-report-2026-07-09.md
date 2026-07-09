# Dream Full Production Integration Report

Generated: 2026-07-09

## Scope

- Candidate source: `_shared/dreams-candidates.json`
- Full workflow scope: all P0/P1/P2/P3 candidates
- Included in workflow: 1,289
- Parked outside P0/P1/P2/P3 workflow: 34
- Clean publishable-draft route: 351
- Revision/blocked route retained in ledgers: 938

## Content Outputs

- Evidence:
  - `evidence/dream-evidence-full.jsonl`
  - `evidence/dreams-evidence-enrichment-full-20260709.json`
  - `evidence/dreams-evidence-enrichment-summary-20260709.md`
- Briefs:
  - `briefs/dream-briefs-full.jsonl`
  - `briefs/dream-briefs-p0-p3-shard-001.json` through `013.json`
  - `briefs/dream-briefs-p0-p3-shard-001.md` through `013.md`
  - `briefs/dream-briefs-p0-p3-index.json`
  - `briefs/README.md`
- Articles:
  - `articles/dream-articles-full.jsonl`
  - `articles/dream-article-drafts.shard-001.jsonl` through `006.jsonl`
  - `articles/dream-article-drafts.index.json`
  - `articles/dream-article-drafts.summary.md`

## Image Outputs

- Image manifest:
  - `images/dream-image-manifest-full.jsonl`
  - `images/dream-image-manifest-enhanced-20260709-image-manifest-worker.jsonl`
  - `images/dream-image-generation-queue-20260709-image-manifest-worker.jsonl`
  - `images/dream-image-prompts-20260709-image-manifest-worker.jsonl`
- Crystal meaning image reuse:
  - `images/dream-crystal-reuse-manifest.jsonl`
  - `images/dream-crystal-reuse-summary.json`
  - Dream rows with crystal reuse: 351
  - Crystal reuse slots: 3 per dream row
  - Unique crystal profiles reused: 10
  - Missing crystal JSON refs: 0
  - Missing local crystal image refs: 0
- Real hero images:
  - Output root: `02-网站规划/assets/images/generated/dreams/`
  - Generated WebP files: 351
  - Dimensions: 1536 x 864
  - Results log: `images/dream-image-generation-results.jsonl`
  - Latest result status: 351 ok, 0 fail

## QA

- Validation script: `qa/validate_dream_workflow.py`
- Latest report: `qa/workflow-validation-report.json`
- Findings: 0
- Checks include:
  - no `/dream-dictionary/`
  - no risky claim phrases
  - no template placeholder residue
  - output directories present
  - evidence/brief/article/image outputs present

## Important Boundaries

- `publication_ready` remains false. These are production outputs and drafts, not WordPress-published final pages.
- Blocked/revision candidates remain in the ledgers and are not deleted.
- Image generation completed for the 351 clean draftable candidates. Blocked/revision candidates do not receive actual image requests.
- The 03:52 heartbeat is configured to re-check and only continue missing or failed work, not duplicate completed image generation.
