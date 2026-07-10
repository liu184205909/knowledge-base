import json
from pathlib import Path

from PIL import Image


IMAGES_DIR = Path(__file__).resolve().parent
DREAMS_DIR = IMAGES_DIR.parent
PROJECT_ROOT = DREAMS_DIR.parent.parent
OUTPUT_ROOT = PROJECT_ROOT / "02-网站规划" / "assets" / "images" / "generated" / "dreams"
QUEUE_PATH = IMAGES_DIR / "dream-image-queue-backbone-16.jsonl"
RESULTS_PATH = IMAGES_DIR / "dream-image-generation-results-backbone-16.jsonl"
SUMMARY_PATH = IMAGES_DIR / "dream-image-qa-backbone-16.json"


def read_jsonl(path: Path):
    if not path.exists():
        return []
    rows = []
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


def main():
    queue = read_jsonl(QUEUE_PATH)
    results = read_jsonl(RESULTS_PATH)
    latest = {}
    for row in results:
        latest[row.get("slug")] = row

    findings = []
    checked = []
    for item in queue:
        slug = item["slug"]
        file_path = OUTPUT_ROOT / slug / (item.get("filename") or f"{slug}-hero.webp")
        result = latest.get(slug)
        if not result:
            findings.append({"slug": slug, "severity": "critical", "issue": "missing result row"})
        elif result.get("status") not in {"ok", "skip_existing"}:
            findings.append({"slug": slug, "severity": "critical", "issue": f"latest status {result.get('status')}"})

        if not file_path.exists():
            findings.append({"slug": slug, "severity": "critical", "issue": "missing final webp", "file": str(file_path)})
            checked.append({"slug": slug, "exists": False})
            continue

        try:
            with Image.open(file_path) as image:
                size = image.size
                fmt = image.format
        except Exception as exc:
            findings.append({"slug": slug, "severity": "critical", "issue": f"image open failed: {exc}", "file": str(file_path)})
            checked.append({"slug": slug, "exists": True, "open": False})
            continue

        if size != (1536, 864):
            findings.append({"slug": slug, "severity": "major", "issue": f"unexpected size {size}", "file": str(file_path)})
        if fmt != "WEBP":
            findings.append({"slug": slug, "severity": "major", "issue": f"unexpected format {fmt}", "file": str(file_path)})
        checked.append({"slug": slug, "exists": True, "format": fmt, "size": size, "file": str(file_path)})

    summary = {
        "complete": not findings,
        "queue_count": len(queue),
        "checked_count": len(checked),
        "findings_count": len(findings),
        "findings": findings,
        "output_root": str(OUTPUT_ROOT),
        "results_path": str(RESULTS_PATH),
        "checked": checked,
    }
    SUMMARY_PATH.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: summary[k] for k in ["complete", "queue_count", "checked_count", "findings_count"]}, ensure_ascii=False, indent=2))
    if findings:
        print(json.dumps(findings[:10], ensure_ascii=False, indent=2))
        raise SystemExit(1)


if __name__ == "__main__":
    main()
