# Dream Evidence Enrichment Summary - 2026-07-09

This is a local-only evidence skeleton generated from the existing Dream data layer. No web access, live SERP review, or external source verification was performed.

## Output

- Full JSON: `dreams-evidence-enrichment-full-20260709.json`
- Total records: 1323
- Knowledge matches: 247
- Enrichable records with required enrichment fields: 351

## Priority Counts

| Priority | Count |
|---|---:|
| P3 | 1120 |
| P0 | 11 |
| P1 | 36 |
| Parked | 34 |
| P2 | 122 |

## Route Counts

| Route | Count |
|---|---:|
| needs_revision | 938 |
| enrichable | 351 |
| blocked | 34 |

## Route by Priority

| Priority | Enrichable | Needs Revision | Blocked |
|---|---:|---:|---:|
| P3 | 191 | 929 | 0 |
| P0 | 10 | 1 | 0 |
| P1 | 35 | 1 | 0 |
| Parked | 0 | 0 | 34 |
| P2 | 115 | 7 | 0 |

## Noise Flag Counts

| Flag | Count |
|---|---:|
| cross_vertical | 657 |
| low_confidence | 349 |
| duplicate_slug | 220 |
| brand_query | 21 |
| non_english | 21 |
| generic_navigation | 19 |
| unsafe_skip | 13 |
| typo | 3 |

## Route Policy

- `enrichable`: clean English production-ready dream intent; includes `intent_summary`, `evidence_boundary`, `competitor_gap`, `psychology_angle`, `spiritual_angle`, and `crystal_angle`.
- `needs_revision`: candidate may be usable only after fixing brand, cross-vertical, duplicate slug, typo, generic navigation, low-confidence, or other production-readiness issues.
- `blocked`: unsafe or non-English candidate; do not brief or draft until manually cleared/reframed.

## Risks

- Competitor gaps are strategy hypotheses from local planning docs, not live SERP findings.
- Psychology, spiritual, and crystal angles are conservative skeletons; they still require editorial/source review before final article copy.
- Duplicate slugs and cross-vertical rows are intentionally routed away from drafting to avoid accidental doorway pages or off-intent content.
