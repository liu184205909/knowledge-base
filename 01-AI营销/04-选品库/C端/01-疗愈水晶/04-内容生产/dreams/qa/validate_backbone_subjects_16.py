import json
import re
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BACKBONE_FILES = [
    ROOT / "backbone" / "dream-backbone-subjects-6.jsonl",
    ROOT / "backbone" / "dream-backbone-subjects-10.jsonl",
]
READINESS = ROOT / "qa" / "dream-wp-draft-readiness.jsonl"
OUT = ROOT / "qa" / "backbone-subjects-16-validation.json"


def read_jsonl(path):
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def main():
    rows = []
    for path in BACKBONE_FILES:
        rows.extend(read_jsonl(path))
    readiness = read_jsonl(READINESS)
    readiness_backbone = [row for row in readiness if row.get("bucket") == "wp_draft_ready_backbone"]

    findings = []
    slugs = [row["slug"] for row in rows]
    if len(rows) != 16:
        findings.append({"severity": "critical", "issue": "backbone_row_count_not_16", "value": len(rows)})
    duplicates = [slug for slug, count in Counter(slugs).items() if count > 1]
    if duplicates:
        findings.append({"severity": "critical", "issue": "duplicate_backbone_slug", "slugs": duplicates})

    for row in rows:
        slug = row["slug"]
        body = row.get("article", {}).get("body_markdown", "")
        if row.get("publication_ready") is not False:
            findings.append({"severity": "critical", "slug": slug, "issue": "publication_ready_not_false"})
        if row.get("requires_human_review") is not True:
            findings.append({"severity": "critical", "slug": slug, "issue": "requires_human_review_not_true"})
        for needle in ["## Key Takeaways", "## From Sleep Science", "## Psychological Reflection", "## Journal Prompts"]:
            if needle not in body:
                findings.append({"severity": "critical", "slug": slug, "issue": "missing_heading", "heading": needle})
        if "Crystals for" not in body:
            findings.append({"severity": "critical", "slug": slug, "issue": "missing_crystal_section"})
        if len(re.findall(r"\w+", body)) < 1900:
            findings.append({"severity": "major", "slug": slug, "issue": "word_count_under_1900"})
        if "/dream-dictionary/" in json.dumps(row, ensure_ascii=False):
            findings.append({"severity": "critical", "slug": slug, "issue": "forbidden_dream_dictionary_url"})

    readiness_slugs = [row["slug"] for row in readiness_backbone]
    if set(readiness_slugs) != set(slugs):
        findings.append({
            "severity": "critical",
            "issue": "readiness_backbone_slug_mismatch",
            "missing_in_readiness": sorted(set(slugs) - set(readiness_slugs)),
            "extra_in_readiness": sorted(set(readiness_slugs) - set(slugs)),
        })

    result = {
        "complete": not findings,
        "findings_count": len(findings),
        "backbone_rows": len(rows),
        "readiness_backbone_rows": len(readiness_backbone),
        "slugs": slugs,
        "publication_ready_counts": dict(Counter(str(row.get("publication_ready")) for row in rows)),
        "requires_human_review_counts": dict(Counter(str(row.get("requires_human_review")) for row in rows)),
        "min_word_count": min(len(re.findall(r"\w+", row.get("article", {}).get("body_markdown", ""))) for row in rows) if rows else 0,
        "findings": findings,
    }
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
