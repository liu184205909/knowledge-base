# -*- coding: utf-8 -*-
"""Validate Dream Subject Backbone batch 2."""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BACKBONE_JSONL = ROOT / "backbone" / "dream-backbone-subjects-10.jsonl"
READINESS_JSONL = ROOT / "qa" / "dream-wp-draft-readiness.jsonl"
OUT_JSON = ROOT / "qa" / "backbone-batch2-validation.json"

EXPECTED_SLUGS = {
    "house-dream-meaning",
    "car-dream-meaning",
    "fire-dream-meaning",
    "baby-dream-meaning",
    "lost-dream-meaning",
    "sex-dream-meaning",
    "being-chased-dream-meaning",
    "dying-dream-meaning",
    "wedding-dream-meaning",
    "naked-dream-meaning",
}

REQUIRED_HEADINGS = [
    "## Key Takeaways",
    "## From Sleep Science",
    "## Psychological Reflection",
    "## Spiritual Symbolism & Religious Meanings",
    "## Journal Prompts",
    "## Frequently Asked Questions",
    "## Related Dream Pages",
]

FORBIDDEN = [
    "/dream-dictionary/",
    "will cure",
    "guaranteed",
    "guarantee that",
    "definitely means",
    "fatwa.",
]


def read_jsonl(path: Path) -> list[dict]:
    return [
        json.loads(line)
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


def crystal_profile_exists(slug: str) -> bool:
    target = f"{slug}.json"
    for path in Path.cwd().rglob(target):
        if path.parent.name == "1.crystal-meaning":
            return True
    return False


def main() -> None:
    rows = read_jsonl(BACKBONE_JSONL)
    readiness = read_jsonl(READINESS_JSONL)
    findings = []

    slugs = [row.get("slug") for row in rows]
    if set(slugs) != EXPECTED_SLUGS:
        findings.append({"severity": "critical", "issue": "slug_set_mismatch", "actual": slugs})
    if len(rows) != 10:
        findings.append({"severity": "critical", "issue": "row_count_not_10", "actual": len(rows)})
    if len(slugs) != len(set(slugs)):
        findings.append({"severity": "critical", "issue": "duplicate_slug_in_batch", "duplicates": [s for s, c in Counter(slugs).items() if c > 1]})

    section_values = {"psychological": [], "spiritual": [], "crystal": []}
    word_counts = {}
    crystal_missing = []

    for row in rows:
        slug = row.get("slug")
        body = row.get("article", {}).get("body_markdown", "")
        brief = row.get("brief", {})
        evidence = row.get("evidence", {})
        sleep = row.get("sleep_science", {})

        for heading in REQUIRED_HEADINGS:
            if heading not in body:
                findings.append({"severity": "critical", "slug": slug, "issue": "missing_heading", "heading": heading})
        if "## Crystals for " not in body:
            findings.append({"severity": "critical", "slug": slug, "issue": "missing_crystal_heading"})
        if row.get("url") != f"/{slug}/":
            findings.append({"severity": "critical", "slug": slug, "issue": "url_not_root_level", "url": row.get("url")})
        if row.get("publication_ready") is not False:
            findings.append({"severity": "critical", "slug": slug, "issue": "publication_ready_must_remain_false_before_final_editorial_gate"})
        if row.get("requires_human_review") is not True:
            findings.append({"severity": "critical", "slug": slug, "issue": "requires_human_review_must_remain_true_for_wp_draft"})
        if row.get("bucket") != "wp_draft_ready_backbone":
            findings.append({"severity": "critical", "slug": slug, "issue": "wrong_bucket", "bucket": row.get("bucket")})
        if sleep.get("source_status") != "needs_verification":
            findings.append({"severity": "critical", "slug": slug, "issue": "sleep_source_status_not_needs_verification"})
        if sleep.get("public_data_point") not in ("", None):
            findings.append({"severity": "major", "slug": slug, "issue": "public_data_point_should_be_empty_stub"})

        text_lower = json.dumps(row, ensure_ascii=False).lower()
        for phrase in FORBIDDEN:
            if phrase.lower() in text_lower:
                findings.append({"severity": "critical", "slug": slug, "issue": "forbidden_phrase", "phrase": phrase})

        wc = row.get("article", {}).get("word_count", 0)
        word_counts[slug] = wc
        if wc < 1900:
            findings.append({"severity": "major", "slug": slug, "issue": "word_count_under_1900", "word_count": wc})

        section_values["psychological"].append(brief.get("psychological_reflection"))
        section_values["spiritual"].append(brief.get("spiritual_symbolism"))
        section_values["crystal"].append(brief.get("crystals_for_dream_reflection"))

        if not evidence.get("psychology_angle") or not evidence.get("spiritual_angle") or not evidence.get("crystal_angle"):
            findings.append({"severity": "critical", "slug": slug, "issue": "missing_c1_evidence_angle"})

        for slot in row.get("crystal_reuse_slots", []):
            crystal_slug = slot.get("slug")
            if not crystal_profile_exists(crystal_slug):
                crystal_missing.append({"slug": slug, "crystal": crystal_slug})

    for name, values in section_values.items():
        unique = len(set(values))
        if unique != len(rows):
            findings.append({"severity": "critical", "issue": f"{name}_section_not_unique", "unique": unique, "rows": len(rows)})

    readiness_counts = Counter(row.get("slug") for row in readiness)
    readiness_missing = sorted(EXPECTED_SLUGS - set(readiness_counts))
    readiness_duplicates = sorted(slug for slug in EXPECTED_SLUGS if readiness_counts[slug] != 1)
    if readiness_missing:
        findings.append({"severity": "critical", "issue": "readiness_missing_batch2_slugs", "slugs": readiness_missing})
    if readiness_duplicates:
        findings.append({"severity": "critical", "issue": "readiness_duplicate_or_wrong_count", "slugs": readiness_duplicates})
    if crystal_missing:
        findings.append({"severity": "critical", "issue": "missing_crystal_profiles", "items": crystal_missing})

    summary = {
        "complete": not findings,
        "findings_count": len(findings),
        "rows": len(rows),
        "expected_rows": 10,
        "slugs": slugs,
        "word_counts": word_counts,
        "section_uniqueness": {k: len(set(v)) for k, v in section_values.items()},
        "readiness_rows": len(readiness),
        "readiness_batch2_count": sum(1 for row in readiness if row.get("slug") in EXPECTED_SLUGS),
        "crystal_missing_count": len(crystal_missing),
        "findings": findings,
    }
    OUT_JSON.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
