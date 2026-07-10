import json
import re
from collections import Counter
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
ARTICLES = BASE_DIR / "articles" / "dream-articles-repaired-full-1289.jsonl"
BRIEFS = BASE_DIR / "briefs" / "dream-briefs-repaired-full-1289.jsonl"
EVIDENCE = BASE_DIR / "evidence" / "dream-evidence-repaired-full-1289.jsonl"
OUT = BASE_DIR / "qa" / "c1-core-content-validation.json"

SECTIONS = [
    "Psychological Reflection",
    "Spiritual Symbolism",
    "Crystals for Dream Reflection",
]

OLD_PLACEHOLDERS = [
    "This dream may point to emotion, attention, memory processing, or personal associations. Keep the interpretation reflective and avoid clinical conclusions.",
    "Spiritually, the dream can be treated as a prompt for reflection, prayer, journaling, or self-inquiry. Do not use it as certainty about the future.",
    "Use crystals as optional ritual anchors for journaling, calm, and intention. They are symbolic supports, not medical solutions or promised outcomes.",
]


def read_jsonl(path):
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def extract_section(markdown, heading):
    match = re.search(rf"## {re.escape(heading)}\n\n(.*?)(?=\n\n## |\Z)", markdown, re.S)
    if not match:
        return ""
    return re.sub(r"\s+", " ", match.group(1).strip())


def main():
    articles = read_jsonl(ARTICLES)
    briefs = read_jsonl(BRIEFS)
    evidence = read_jsonl(EVIDENCE)
    findings = []
    section_stats = {}

    for section in SECTIONS:
        values = [extract_section(row["article"]["body_markdown"], section) for row in articles]
        counts = Counter(values)
        missing = sum(1 for value in values if not value)
        short = sum(1 for value in values if 0 < len(value.split()) < 45)
        placeholder_hits = sum(1 for value in values if value in OLD_PLACEHOLDERS)
        top_count = counts.most_common(1)[0][1] if counts else 0
        section_stats[section] = {
            "missing": missing,
            "short_under_45_words": short,
            "unique": len(counts),
            "top_duplicate_count": top_count,
            "old_placeholder_hits": placeholder_hits,
            "top_samples": [
                {"count": count, "text": text[:240]}
                for text, count in counts.most_common(5)
            ],
        }
        if missing:
            findings.append({"severity": "critical", "check": f"{section}_missing", "value": missing})
        if placeholder_hits:
            findings.append({"severity": "critical", "check": f"{section}_old_placeholder_hits", "value": placeholder_hits})
        if short:
            findings.append({"severity": "major", "check": f"{section}_short_under_45_words", "value": short})
        if top_count > 25:
            findings.append({"severity": "major", "check": f"{section}_top_duplicate_count", "value": top_count})

    brief_coverage = {
        "psychological_reflection": sum(1 for row in briefs if (row.get("brief") or {}).get("psychological_reflection")),
        "spiritual_symbolism": sum(1 for row in briefs if (row.get("brief") or {}).get("spiritual_symbolism")),
        "crystals_for_dream_reflection": sum(1 for row in briefs if (row.get("brief") or {}).get("crystals_for_dream_reflection")),
        "journal_prompts": sum(1 for row in briefs if len((row.get("brief") or {}).get("journal_prompts") or []) == 3),
    }
    evidence_coverage = {
        "psychology_angle": sum(1 for row in evidence if (row.get("evidence") or {}).get("psychology_angle")),
        "spiritual_angle": sum(1 for row in evidence if (row.get("evidence") or {}).get("spiritual_angle")),
        "crystal_angle": sum(1 for row in evidence if (row.get("evidence") or {}).get("crystal_angle")),
    }
    for name, value in {**brief_coverage, **evidence_coverage}.items():
        if value != 1289:
            findings.append({"severity": "critical", "check": f"{name}_coverage", "value": value, "expected": 1289})

    result = {
        "scope": "C1 core content anti-placeholder validation",
        "rows": len(articles),
        "complete": not findings,
        "section_stats": section_stats,
        "brief_coverage": brief_coverage,
        "evidence_coverage": evidence_coverage,
        "findings_count": len(findings),
        "findings": findings,
    }
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
