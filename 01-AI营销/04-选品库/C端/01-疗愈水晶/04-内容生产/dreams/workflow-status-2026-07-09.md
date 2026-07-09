# Dream Full Production Workflow Status

Started: 2026-07-09 03:52 resume scheduled; workflow began immediately before resume.

## Scope

- Input: `dreams-candidates.json` full P0/P1/P2/P3 candidate set, plus current `dreams-knowledge.json`.
- Scheduling rule: full parallel production, not P0/P1/P2/P3 phased production.
- Routing rule: noisy or unsafe candidates stay in the workflow as `blocked` or `needs_revision`; they must not be disguised as publishable articles.

## Active Workers

- Evidence enrichment: enrich every candidate with intent and evidence-boundary fields.
- Brief generation: generate full-candidate brief shards and blocked/revision briefs.
- Article drafts: generate article draft shards for clean candidates and route invalid candidates.
- Image manifest: generate hero prompt, negative prompt, alt text, filename, and safety flags for every candidate.

## Hard Gates

- No `/dream-dictionary/` URL.
- No `publication_ready=true` before evidence, brief, article, image, and QA all pass.
- No medical diagnosis, mental-health diagnosis, religious ruling, prophecy guarantee, or crystal healing guarantee.
- Islamic images must avoid sacred text, calligraphy, and human figures.
- Violent, death, chase, pregnancy, and similar sensitive themes must be abstracted.
- Duplicate slugs cannot publish more than one article.
- `Parked`, `brand_query`, `cross_vertical`, `non_english`, `unsafe_skip`, `typo`, and duplicate rows require explicit route status.

## Resume Note

If this thread wakes at 03:52, first inspect this file and the four output folders:

- `evidence/`
- `briefs/`
- `articles/`
- `images/`
- `qa/`

Then continue from the latest verified artifact instead of restarting from scratch.
