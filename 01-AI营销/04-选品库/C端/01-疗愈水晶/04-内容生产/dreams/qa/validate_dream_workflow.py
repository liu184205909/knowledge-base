import json
import re
from collections import Counter
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
SHARED_DIR = BASE_DIR / "_shared"
OUTPUT_DIRS = {
    "evidence": BASE_DIR / "evidence",
    "briefs": BASE_DIR / "briefs",
    "articles": BASE_DIR / "articles",
    "images": BASE_DIR / "images",
}

FORBIDDEN_URL_PARTS = ("/dream-dictionary/", "/dreams/about/", "/dreams/interpretation/")
FORBIDDEN_CLAIMS = (
    "guaranteed",
    "cure",
    "diagnose",
    "religious ruling",
    "will definitely happen",
)


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def iter_jsonish_files(directory):
    for suffix in ("*.json", "*.jsonl", "*.md"):
        yield from directory.glob(suffix)


def scan_text_files():
    findings = []
    for label, directory in OUTPUT_DIRS.items():
        if not directory.exists():
            findings.append({"severity": "critical", "label": label, "issue": "missing_output_dir"})
            continue
        for path in iter_jsonish_files(directory):
            text = path.read_text(encoding="utf-8", errors="ignore")
            for part in FORBIDDEN_URL_PARTS:
                if part in text:
                    findings.append({"severity": "critical", "file": str(path), "issue": "forbidden_url", "value": part})
            for claim in FORBIDDEN_CLAIMS:
                if re.search(rf"\b{re.escape(claim)}\b", text, flags=re.IGNORECASE):
                    findings.append({"severity": "major", "file": str(path), "issue": "risky_claim_phrase", "value": claim})
            if re.search(r"\{\{\s*[-A-Za-z0-9_. ]+\s*\}\}", text):
                findings.append({"severity": "major", "file": str(path), "issue": "placeholder_residue"})
    return findings


def main():
    candidates = read_json(SHARED_DIR / "dreams-candidates.json")
    route_counts = Counter()
    for row in candidates:
        if row.get("priority") == "Parked" or row.get("noise_flag"):
            route_counts["requires_route"] += 1
        else:
            route_counts["clean_candidate"] += 1

    output_counts = {
        label: sum(1 for _ in iter_jsonish_files(directory)) if directory.exists() else 0
        for label, directory in OUTPUT_DIRS.items()
    }

    findings = scan_text_files()
    crystal_reuse_summary = BASE_DIR / "images" / "dream-crystal-reuse-summary.json"
    if not crystal_reuse_summary.exists():
        findings.append({"severity": "critical", "file": str(crystal_reuse_summary), "issue": "missing_crystal_reuse_summary"})
    else:
        reuse = read_json(crystal_reuse_summary)
        if reuse.get("dream_rows_with_crystal_reuse") != 351:
            findings.append({
                "severity": "critical",
                "file": str(crystal_reuse_summary),
                "issue": "unexpected_crystal_reuse_row_count",
                "value": reuse.get("dream_rows_with_crystal_reuse"),
            })
        if reuse.get("missing_crystal_json_refs") or reuse.get("missing_local_asset_refs"):
            findings.append({
                "severity": "critical",
                "file": str(crystal_reuse_summary),
                "issue": "missing_crystal_reuse_assets",
                "missing_json": reuse.get("missing_crystal_json_refs"),
                "missing_assets": reuse.get("missing_local_asset_refs"),
            })
    report = {
        "input_counts": {
            "candidates": len(candidates),
            "priority": dict(Counter(row.get("priority") for row in candidates)),
            "route_requirement": dict(route_counts),
        },
        "output_file_counts": output_counts,
        "findings_count": len(findings),
        "findings_by_severity": dict(Counter(item["severity"] for item in findings)),
        "findings_sample": findings[:50],
    }

    out_path = BASE_DIR / "qa" / "workflow-validation-report.json"
    out_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
