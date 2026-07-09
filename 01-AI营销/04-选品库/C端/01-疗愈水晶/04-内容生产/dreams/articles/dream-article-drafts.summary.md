# Dream Article Draft Shards

Generated: 2026-07-09

Scope: all P0/P1/P2/P3 candidates from `dreams-candidates.json`; `Parked` candidates are excluded from this article-draft pass.

## Counts

- Included records: 1289
- Excluded Parked records: 34
- Route counts: {'blocked': 657, 'needs_revision': 127, 'draft': 505}
- Priority counts: {'P3': 1120, 'P0': 11, 'P1': 36, 'P2': 122}
- Knowledge-layer matched: {'true': 247, 'false': 1042}

## Route Reason Distribution

- cross_vertical: 636
- duplicate_slug: 125
- brand_query: 21
- generic_navigation: 18

## Output Shards

- `dream-article-drafts.shard-001.jsonl`
- `dream-article-drafts.shard-002.jsonl`
- `dream-article-drafts.shard-003.jsonl`
- `dream-article-drafts.shard-004.jsonl`
- `dream-article-drafts.shard-005.jsonl`
- `dream-article-drafts.shard-006.jsonl`

## Contract

- Every record contains `url`, `title`, `meta`, `h2_outline`, `body`, `faq`, `internal_links`, `cta`, and `compliance_flags`.
- `publication_ready` is forced to `false` in `meta` and `compliance_flags`.
- No URL uses `legacy dictionary prefix`.
- `blocked` and `needs_revision` records keep an editorial routing note instead of a publishable article body.
