import json
from collections import Counter
from pathlib import Path


QA_DIR = Path(__file__).resolve().parent
DREAMS_DIR = QA_DIR.parent
PROJECT_DIR = DREAMS_DIR.parent.parent
ASSET_DREAMS_DIR = PROJECT_DIR / "02-网站规划" / "assets" / "images" / "generated" / "dreams"

FILES = {
    "evidence": DREAMS_DIR / "evidence" / "dream-evidence-repaired-full-1289.jsonl",
    "briefs": DREAMS_DIR / "briefs" / "dream-briefs-repaired-full-1289.jsonl",
    "articles": DREAMS_DIR / "articles" / "dream-articles-repaired-full-1289.jsonl",
    "image_queue": DREAMS_DIR / "images" / "dream-image-queue-repaired-full-1289.jsonl",
    "image_results_clean": DREAMS_DIR / "images" / "dream-image-generation-results.jsonl",
    "image_results_repaired": DREAMS_DIR / "images" / "dream-image-generation-results-repaired-full-1289.jsonl",
    "crystal_reuse_summary": DREAMS_DIR / "images" / "dream-crystal-reuse-summary-repaired-full-1289.json",
    "crystal_reuse_manifest": DREAMS_DIR / "images" / "dream-crystal-reuse-manifest-repaired-full-1289.jsonl",
    "prepublish": QA_DIR / "repaired-full-prepublish-decisions.jsonl",
    "prepublish_summary": QA_DIR / "repaired-full-prepublish-decisions-summary.json",
}

OUTPUT = QA_DIR / "repaired-full-1289-final-validation.json"


def read_jsonl(path):
    rows = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.strip():
            rows.append(json.loads(line))
    return rows


def latest_image_status(queue_slugs):
    latest = {}
    for path in (FILES["image_results_clean"], FILES["image_results_repaired"]):
        if not path.exists():
            continue
        for row in read_jsonl(path):
            slug = row.get("slug")
            if slug in queue_slugs:
                latest[slug] = row
    ok = {slug for slug, row in latest.items() if row.get("status") in {"ok", "skip_existing"}}
    fail = {slug for slug, row in latest.items() if row.get("status") == "fail"}
    missing = set(queue_slugs) - ok - fail
    file_missing = []
    for slug in ok:
        expected = ASSET_DREAMS_DIR / slug / f"{slug}-hero.webp"
        if not expected.exists():
            file_missing.append(slug)
    return {
        "ok_or_skip": len(ok),
        "failed_latest": len(fail),
        "missing_or_running": len(missing),
        "expected_file_missing_for_ok": len(file_missing),
        "sample_failed": sorted(fail)[:10],
        "sample_missing_or_running": sorted(missing)[:10],
        "sample_file_missing_for_ok": sorted(file_missing)[:10],
        "complete": len(ok) == len(queue_slugs) and not fail and not missing and not file_missing,
    }


def count_body(rows, needle):
    return sum(1 for row in rows if needle in ((row.get("article") or {}).get("body_markdown") or ""))


def main():
    evidence = read_jsonl(FILES["evidence"])
    briefs = read_jsonl(FILES["briefs"])
    articles = read_jsonl(FILES["articles"])
    image_queue = read_jsonl(FILES["image_queue"])
    prepublish = read_jsonl(FILES["prepublish"])
    crystal_manifest = read_jsonl(FILES["crystal_reuse_manifest"])
    crystal_summary = json.loads(FILES["crystal_reuse_summary"].read_text(encoding="utf-8"))
    prepublish_summary = json.loads(FILES["prepublish_summary"].read_text(encoding="utf-8"))

    article_slugs = [row["slug"] for row in articles]
    queue_slugs = [row["slug"] for row in image_queue]
    findings = []

    for name, rows in {
        "evidence": evidence,
        "briefs": briefs,
        "articles": articles,
        "image_queue": image_queue,
        "prepublish": prepublish,
        "crystal_manifest": crystal_manifest,
    }.items():
        if len(rows) != 1289:
            findings.append({"severity": "critical", "check": f"{name}_row_count", "value": len(rows), "expected": 1289})

    duplicate_slugs = [slug for slug, count in Counter(article_slugs).items() if count > 1]
    if duplicate_slugs:
        findings.append({"severity": "critical", "check": "duplicate_article_slugs", "sample": duplicate_slugs[:10]})

    if set(article_slugs) != set(queue_slugs):
        findings.append({"severity": "critical", "check": "article_image_queue_slug_mismatch"})

    forbidden_url_hits = sum(1 for row in articles if "/dream-dictionary/" in json.dumps(row, ensure_ascii=False))
    if forbidden_url_hits:
        findings.append({"severity": "critical", "check": "forbidden_dream_dictionary_url", "value": forbidden_url_hits})

    text_coverage = {
        "body_key_takeaways": count_body(articles, "## Key Takeaways"),
        "body_sleep_science": count_body(articles, "## From Sleep Science"),
        "evidence_sleep_science": sum(1 for row in evidence if (row.get("evidence") or {}).get("sleep_science")),
        "evidence_key_takeaways": sum(1 for row in evidence if (row.get("evidence") or {}).get("key_takeaways")),
        "brief_sleep_science": sum(1 for row in briefs if (row.get("brief") or {}).get("sleep_science")),
        "brief_key_takeaways": sum(1 for row in briefs if (row.get("brief") or {}).get("key_takeaways")),
    }
    for check, value in text_coverage.items():
        if value != 1289:
            findings.append({"severity": "major", "check": check, "value": value, "expected": 1289})

    if crystal_summary.get("dream_rows_with_crystal_reuse") != 1289:
        findings.append({"severity": "critical", "check": "crystal_reuse_rows", "value": crystal_summary.get("dream_rows_with_crystal_reuse")})
    if crystal_summary.get("missing_crystal_json_refs") or crystal_summary.get("missing_local_asset_refs"):
        findings.append({
            "severity": "critical",
            "check": "missing_crystal_reuse_assets",
            "missing_json": crystal_summary.get("missing_crystal_json_refs"),
            "missing_assets": crystal_summary.get("missing_local_asset_refs"),
        })

    publication_ready_true = sum(1 for row in prepublish if row.get("publication_ready") is True)
    if publication_ready_true:
        findings.append({"severity": "critical", "check": "publication_ready_true_before_human_gate", "value": publication_ready_true})

    image_status = latest_image_status(set(queue_slugs))
    if not image_status["complete"]:
        findings.append({"severity": "major", "check": "hero_images_not_complete", **image_status})

    result = {
        "scope": "repaired-full-1289",
        "complete": not findings,
        "counts": {
            "evidence": len(evidence),
            "briefs": len(briefs),
            "articles": len(articles),
            "image_queue": len(image_queue),
            "prepublish": len(prepublish),
            "crystal_manifest": len(crystal_manifest),
            "unique_article_slugs": len(set(article_slugs)),
        },
        "text_coverage": text_coverage,
        "prepublish_decision_counts": prepublish_summary.get("decision_counts"),
        "publication_ready_true": publication_ready_true,
        "image_status": image_status,
        "crystal_reuse_summary": crystal_summary,
        "findings_count": len(findings),
        "findings_by_severity": dict(Counter(item["severity"] for item in findings)),
        "findings": findings,
    }
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
