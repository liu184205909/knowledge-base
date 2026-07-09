import json
import re
from collections import Counter
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
SHARED_DIR = BASE_DIR / "_shared"
OUT_DIRS = {
    "evidence": BASE_DIR / "evidence",
    "briefs": BASE_DIR / "briefs",
    "articles": BASE_DIR / "articles",
    "images": BASE_DIR / "images",
    "qa": BASE_DIR / "qa",
}

SENSITIVE_LENSES = {"biblical", "islamic", "christian", "spiritual", "prophetic"}
TYPO_FIXES = {
    "dram": "dream",
    "drram": "dream",
    "drma": "dream",
    "dreem": "dream",
    "drream": "dream",
}


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_jsonl(path, rows):
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")


def slugify(value):
    value = value.lower().replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return re.sub(r"-+", "-", value).strip("-") or "dream"


def detect_lens(keyword):
    k = keyword.lower()
    if "islam" in k:
        return "islamic"
    if "christian" in k:
        return "christian"
    if "biblical" in k or "bible" in k:
        return "biblical"
    if "spiritual" in k:
        return "spiritual"
    if "prophetic" in k:
        return "prophetic"
    return "general"


def clean_keyword(keyword):
    k = keyword.lower().strip()
    for bad, good in TYPO_FIXES.items():
        k = re.sub(rf"\b{bad}\b", good, k)
    k = k.replace("can't", "cant")
    k = re.sub(r"\bdreamybot\b", "ai dream interpreter", k)
    k = re.sub(r"\bdream bible\b", "biblical dream meaning", k)
    k = re.sub(r"\bdream bible dictionary\b", "biblical dream meaning", k)
    k = re.sub(r"\bdream bible com\b", "biblical dream meaning", k)
    k = re.sub(r"\bdreamdictionary\b", "dream meaning", k)
    k = re.sub(r"\bdreamlookup\b", "dream lookup", k)
    k = re.sub(r"\bdreamscape definition\b", "dreamscape dream meaning", k)
    k = re.sub(r"\bdefinition of\b", "", k)
    k = re.sub(r"\bdefine\b", "", k)
    k = re.sub(r"\bdef of\b", "", k)
    k = re.sub(r"\bwhat is meant by\b", "", k)
    k = re.sub(r"\bwhat does\b", "", k)
    k = re.sub(r"\bwhat do\b", "", k)
    k = re.sub(r"\bwhat is\b", "", k)
    k = re.sub(r"\bwho is\b", "", k)
    k = re.sub(r"\bin the bible\b", "biblical dream", k)
    k = re.sub(r"\bbible\b", "biblical", k)
    k = re.sub(r"\s+", " ", k).strip()
    if "dream" not in k and "sleep paralysis" not in k:
        k = f"{k} dream meaning"
    return k


def title_for(keyword):
    title = " ".join(
        word.capitalize() if word not in {"of", "in", "a", "an", "the", "and", "to", "for"} else word
        for word in keyword.split()
    )
    if "Dream" not in title and "Sleep Paralysis" not in title:
        title = f"{title} Dream Meaning"
    return title


def repair_slug(row, used):
    if row.get("production_ready") and not row.get("noise_flag"):
        used.add(row["slug"])
        return row["slug"]
    lens = detect_lens(row["keyword"])
    keyword = clean_keyword(row["keyword"])
    base = slugify(keyword)
    if "dream" not in base and "sleep-paralysis" not in base:
        base = f"{base}-dream-meaning"
    elif not base.endswith("meaning") and "sleep-paralysis" not in base:
        base = f"{base}-meaning"
    if lens != "general" and lens not in base:
        base = base.replace("-dream-meaning", f"-dream-{lens}-meaning")
    candidate = base
    if candidate in used:
        candidate = f"{base}-{row['source_row']}"
    used.add(candidate)
    return candidate


def repair_status(row):
    flags = set(row.get("noise_flag") or [])
    if row.get("production_ready") and not flags:
        return "original_clean"
    return "draftable_after_repair"


def crystal_slots(lens, page_type):
    if lens == "islamic":
        return ["moonstone-meaning", "agate-meaning", "chalcedony-meaning"]
    if lens in {"biblical", "christian", "prophetic", "spiritual"}:
        return ["amethyst-meaning", "quartz-meaning", "celestite-meaning"]
    if page_type in {"Emotion", "Type"}:
        return ["amethyst-meaning", "smoky-quartz-meaning", "quartz-meaning"]
    return ["labradorite-meaning", "black-tourmaline-meaning", "amethyst-meaning"]


def article_markdown(title, keyword, lens, original_flags):
    faith_note = " For faith-based lenses, this is reflective symbolism rather than doctrine or a binding faith ruling." if lens in SENSITIVE_LENSES else ""
    flag_note = ""
    if original_flags:
        flag_note = " This draft was generated from a repaired candidate, so the original keyword route should be reviewed before publishing."
    return "\n".join([
        f"# {title}",
        "",
        f"{keyword} can be explored as a dream-symbol question rather than a fixed prediction.{faith_note}{flag_note}",
        "",
        "## Quick Meaning",
        "",
        "Start with the strongest feeling in the dream, then compare the symbol with current stress, memory, relationships, or spiritual reflection.",
        "",
        "## Psychological Reflection",
        "",
        "This dream may point to emotion, attention, memory processing, or personal associations. Keep the interpretation reflective and avoid clinical conclusions.",
        "",
        "## Spiritual Symbolism",
        "",
        "Spiritually, the dream can be treated as a prompt for reflection, prayer, journaling, or self-inquiry. Do not use it as certainty about the future.",
        "",
        "## Crystals for Dream Reflection",
        "",
        "Use crystals as optional ritual anchors for journaling, calm, and intention. They are symbolic supports, not medical solutions or promised outcomes.",
        "",
        "## Journal Prompts",
        "",
        "- What emotion stayed with you after waking?",
        "- What recent situation does this symbol remind you of?",
        "- What would a calmer reading of this dream look like?",
        "",
        "## FAQ",
        "",
        "### Is this dream meaning definitive?",
        "No. Dream meanings are reflective prompts, not fixed facts.",
        "",
        "### Should I act on this dream immediately?",
        "Use it for journaling first. For health, safety, legal, financial, or religious decisions, seek qualified guidance.",
    ])


def build_rows(candidates):
    used_slugs = set()
    rows = []
    for row in candidates:
        if row.get("priority") not in {"P0", "P1", "P2", "P3"}:
            continue
        keyword = clean_keyword(row["keyword"])
        lens = detect_lens(keyword)
        slug = repair_slug(row, used_slugs)
        title = title_for(keyword)
        status = repair_status(row)
        crystals = crystal_slots(lens, row.get("page_type"))
        common = {
            "source_row": row["source_row"],
            "original_keyword": row["keyword"],
            "repaired_keyword": keyword,
            "original_slug": row["slug"],
            "slug": slug,
            "url": f"/{slug}/",
            "priority": row["priority"],
            "page_type": row.get("page_type"),
            "repair_status": status,
            "original_noise_flag": row.get("noise_flag") or [],
            "publication_ready": False,
            "requires_human_review": True,
        }
        rows.append({
            **common,
            "title": title,
            "meta_title": f"{title} | LuckyCrystals",
            "meta_description": f"Explore {keyword} with dream symbolism, personal reflection, spiritual context, and optional crystal journaling support.",
            "evidence": {
                "intent_summary": "Repaired dream-intent draft generated from the candidate ledger.",
                "evidence_boundary": "Keyword data is local SEMrush-derived candidate evidence; interpretive claims remain conservative and require editorial review.",
                "psychology_angle": "Reflective emotion and memory framing only.",
                "spiritual_angle": "Symbolic and faith-adjacent framing only; no doctrine or certainty claims.",
                "crystal_angle": "Optional ritual anchor and journaling support only.",
            },
            "brief": {
                "h1": title,
                "h2_outline": ["Quick Meaning", "Psychological Reflection", "Spiritual Symbolism", "Crystals for Dream Reflection", "Journal Prompts", "FAQ"],
                "template_family": "lens" if lens != "general" else "subject",
                "crystal_profile_slugs": crystals,
            },
            "article": {
                "body_markdown": article_markdown(title, keyword, lens, row.get("noise_flag") or []),
                "faq_count": 2,
            },
            "image": {
                "filename": f"{slug}-hero.webp",
                "hero_prompt": f"Soft editorial dream-journal hero image for {keyword}, moonlit room, symbolic mist, calming crystals on a nightstand, peaceful reflective mood, no text, no logo",
                "negative_prompt": ["text", "logo", "watermark", "blood", "gore", "medical scene", "dark horror", "religious scripture text", "binding faith ruling claim"],
                "alt_text": f"Dream journal scene for {keyword} with calming crystals",
                "actual_image_generated": False,
            },
            "crystal_reuse_slots": [
                {
                    "slug": crystal,
                    "profile_path": f"/{crystal}/",
                    "image_request": "reuse_existing_390_library",
                }
                for crystal in crystals
            ],
            "compliance": {
                "not_medical_advice": True,
                "not_mental_health_assessment": True,
                "not_a_religious_ruling": True,
                "no_prediction_guarantee": True,
                "religious_sensitivity": lens in SENSITIVE_LENSES,
                "root_level_url": True,
            },
        })
    return rows


def main():
    for directory in OUT_DIRS.values():
        directory.mkdir(parents=True, exist_ok=True)
    candidates = read_json(SHARED_DIR / "dreams-candidates.json")
    rows = build_rows(candidates)
    write_jsonl(OUT_DIRS["evidence"] / "dream-evidence-repaired-full-1289.jsonl", rows)
    write_jsonl(OUT_DIRS["briefs"] / "dream-briefs-repaired-full-1289.jsonl", rows)
    write_jsonl(OUT_DIRS["articles"] / "dream-articles-repaired-full-1289.jsonl", rows)
    write_jsonl(OUT_DIRS["images"] / "dream-image-queue-repaired-full-1289.jsonl", rows)
    summary = {
        "scope": "all P0/P1/P2/P3 candidates repaired to draft layer",
        "rows": len(rows),
        "repair_status_counts": dict(Counter(row["repair_status"] for row in rows)),
        "priority_counts": dict(Counter(row["priority"] for row in rows)),
        "original_flag_counts": dict(Counter(flag for row in rows for flag in row["original_noise_flag"])),
        "publication_ready": False,
        "outputs": {
            "evidence": str(OUT_DIRS["evidence"] / "dream-evidence-repaired-full-1289.jsonl"),
            "briefs": str(OUT_DIRS["briefs"] / "dream-briefs-repaired-full-1289.jsonl"),
            "articles": str(OUT_DIRS["articles"] / "dream-articles-repaired-full-1289.jsonl"),
            "images": str(OUT_DIRS["images"] / "dream-image-queue-repaired-full-1289.jsonl"),
        },
    }
    (OUT_DIRS["qa"] / "repaired-full-production-summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
