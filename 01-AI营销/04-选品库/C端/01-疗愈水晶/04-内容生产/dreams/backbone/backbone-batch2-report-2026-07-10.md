# Dream Subject Backbone Batch 2 Report

Date: 2026-07-10

## Scope

Generated 10 missing Subject backbone pages:

1. house-dream-meaning
2. car-dream-meaning
3. fire-dream-meaning
4. baby-dream-meaning
5. lost-dream-meaning
6. sex-dream-meaning
7. being-chased-dream-meaning
8. dying-dream-meaning
9. wedding-dream-meaning
10. naked-dream-meaning

Canonical choices:

- car dream meaning is the canonical page; car accident dream meaning is covered as a major variation.
- being chased dream meaning is the canonical page; chasing dream meaning is treated as a variant.

## Output

- Backbone content: `dream-backbone-subjects-10.jsonl`
- Builder script: `_build_subject_backbone_batch2.py`
- QA script: `../qa/validate_backbone_batch2.py`
- QA result: `../qa/backbone-batch2-validation.json`
- Readiness updated: `../qa/dream-wp-draft-readiness.jsonl`

## Validation Summary

`validate_backbone_batch2.py` result:

- complete: true
- findings_count: 0
- rows: 10
- readiness_batch2_count: 10
- crystal_missing_count: 0
- section uniqueness:
  - psychological: 10/10
  - spiritual: 10/10
  - crystal: 10/10
- word counts:
  - house: 2117
  - car: 2072
  - fire: 2031
  - baby: 2035
  - lost: 2056
  - sex: 2102
  - being chased: 2049
  - dying: 2044
  - wedding: 1988
  - naked: 2011

## Notes

- No image queue was modified.
- No WordPress upload was performed.
- Sleep science fields remain `source_status: needs_verification`; `public_data_point` remains empty.
- Crystal content is framed as journaling/reflection only, not treatment or guarantee.
- Sensitive subjects use non-explicit and crisis-aware language.
- `being-chased-dream-meaning` replaced the previous original-clean readiness record from `dreamed of being chased`, so the readiness total is 1304 rather than 1305.
