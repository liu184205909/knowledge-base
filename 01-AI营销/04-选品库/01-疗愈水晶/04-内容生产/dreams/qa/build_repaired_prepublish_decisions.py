import json
import re
from collections import Counter, defaultdict
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
ARTICLES_PATH = BASE_DIR / "articles" / "dream-articles-repaired-full-1289.jsonl"
OUT_JSONL = BASE_DIR / "qa" / "repaired-full-prepublish-decisions.jsonl"
OUT_SUMMARY = BASE_DIR / "qa" / "repaired-full-prepublish-decisions-summary.json"


def read_jsonl(path):
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def decision_for(row, duplicate_group):
    flags = set(row.get("original_noise_flag") or [])
    slug = row["slug"]
    keyword = row["repaired_keyword"]
    reasons = []
    decision = "publish_candidate"

    if len(duplicate_group) > 1:
        primary = min(duplicate_group, key=lambda item: (0 if item["repair_status"] == "original_clean" else 1, item["source_row"]))
        if row["source_row"] != primary["source_row"]:
            return "merge_duplicate", ["duplicate_slug", f"canonical_source_row:{primary['source_row']}"]

    if "brand_query" in flags:
        decision = "human_review"
        reasons.append("brand_query_repaired")
    if "cross_vertical" in flags:
        decision = "human_review"
        reasons.append("cross_vertical_repaired")
    if "low_confidence" in flags:
        decision = "human_review"
        reasons.append("low_confidence_repaired")
    if re.search(r"(^|-)a-|(^|-)and-|(^|-)the-|dreamscape-definition|dreameaning|dreamlookup|dreamybot", slug):
        decision = "rewrite_slug"
        reasons.append("low_quality_slug")
    if "dream" not in keyword and "sleep paralysis" not in keyword:
        decision = "rewrite_slug"
        reasons.append("weak_dream_intent")
    if row.get("publication_ready") is True:
        decision = "blocked"
        reasons.append("publication_ready_true_unexpected")

    return decision, sorted(set(reasons))


def main():
    rows = read_jsonl(ARTICLES_PATH)
    by_slug = defaultdict(list)
    for row in rows:
        by_slug[row["slug"]].append(row)

    decisions = []
    for row in rows:
        decision, reasons = decision_for(row, by_slug[row["slug"]])
        decisions.append({
            "source_row": row["source_row"],
            "original_keyword": row["original_keyword"],
            "repaired_keyword": row["repaired_keyword"],
            "slug": row["slug"],
            "url": row["url"],
            "priority": row["priority"],
            "repair_status": row["repair_status"],
            "original_noise_flag": row.get("original_noise_flag") or [],
            "prepublish_decision": decision,
            "decision_reasons": reasons,
            "publication_ready": False,
        })

    with OUT_JSONL.open("w", encoding="utf-8", newline="\n") as handle:
        for row in decisions:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")

    summary = {
        "rows": len(decisions),
        "unique_slugs": len(by_slug),
        "decision_counts": dict(Counter(row["prepublish_decision"] for row in decisions)),
        "reason_counts": dict(Counter(reason for row in decisions for reason in row["decision_reasons"])),
        "duplicate_slug_count": sum(1 for group in by_slug.values() if len(group) > 1),
        "publication_ready": False,
        "outputs": {"decisions": str(OUT_JSONL)},
    }
    OUT_SUMMARY.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
