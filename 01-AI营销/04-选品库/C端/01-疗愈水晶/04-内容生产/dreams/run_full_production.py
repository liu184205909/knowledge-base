import json
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
BLOCKING_FLAGS = {"unsafe_skip", "non_english", "brand_query", "cross_vertical", "typo", "duplicate_slug", "generic_navigation"}


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_jsonl(path, rows):
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")


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


def route_for(row):
    flags = set(row.get("noise_flag") or [])
    if row.get("priority") == "Parked" or flags & BLOCKING_FLAGS:
        return "blocked"
    if "low_confidence" in flags:
        return "needs_revision"
    return "draftable"


def title_for(row):
    keyword = row["keyword"].strip()
    words = keyword.replace("-", " ").split()
    title = " ".join(word.capitalize() if word.lower() not in {"of", "in", "a", "an", "the", "and"} else word.lower() for word in words)
    if "dream" not in title.lower() and "sleep paralysis" not in title.lower():
        title = f"{title} Dream Meaning"
    return title


def safe_symbol(row):
    keyword = row["keyword"]
    for token in ("dreamed about", "dreamed of", "dream about", "dream of", "dreams about", "dream meaning", "biblical meaning of", "spiritual meaning of"):
        keyword = keyword.lower().replace(token, " ")
    return " ".join(keyword.split()).strip() or row["keyword"]


def evidence_for(row):
    route = route_for(row)
    lens = detect_lens(row["keyword"])
    return {
        "source_row": row["source_row"],
        "keyword": row["keyword"],
        "slug": row["slug"],
        "url": f"/{row['slug']}/",
        "priority": row["priority"],
        "route": route,
        "language": row["language"],
        "noise_flag": row["noise_flag"],
        "semrush": {
            "volume": row.get("volume"),
            "kd": row.get("kd"),
            "source": row.get("source"),
            "evidence_status": row.get("evidence_status"),
        },
        "intent_summary": (
            "Dream interpretation query with reflective, spiritual, or sleep-experience intent."
            if route != "blocked"
            else "Not safe to produce as a publishable dream article without revision."
        ),
        "evidence_boundary": "SEMrush candidate data is available; interpretive claims still require editorial review before publication.",
        "competitor_gap": "Use concise structure, safer claims, root-level URL, crystal CTA, and clearer psychology/spiritual boundaries.",
        "psychology_angle": "Frame as possible emotion, stress, memory, or personal-association reflection; do not make clinical conclusions.",
        "spiritual_angle": "Use cultural or faith-adjacent language; do not present prophecy, doctrine, or binding religious rulings.",
        "crystal_angle": "Offer crystals as optional reflective ritual objects, not cures or promised sleep aids.",
        "religious_sensitivity": lens in SENSITIVE_LENSES,
    }


def brief_for(row):
    route = route_for(row)
    title = title_for(row)
    lens = detect_lens(row["keyword"])
    symbol = safe_symbol(row)
    return {
        "source_row": row["source_row"],
        "keyword": row["keyword"],
        "slug": row["slug"],
        "url": f"/{row['slug']}/",
        "route": route,
        "title": title,
        "meta_title": f"{title} | LuckyCrystals",
        "meta_description": f"Explore {row['keyword']} through dream symbolism, personal reflection, spiritual context, and gentle crystal ritual ideas.",
        "template_family": "lens" if lens != "general" else "subject",
        "h1": title,
        "h2_outline": [
            f"What {symbol} Can Mean in a Dream",
            "Quick Interpretation",
            "Psychological Reflection",
            "Spiritual Symbolism",
            "Questions to Ask Yourself",
            "Crystals for Reflection",
            "FAQ",
        ],
        "cta_rule": "soft_casper_three_step",
        "religious_sensitivity": lens in SENSITIVE_LENSES,
        "publication_ready": False,
        "blocked_reason": row["noise_flag"] if route == "blocked" else [],
    }


def article_for(row):
    route = route_for(row)
    title = title_for(row)
    symbol = safe_symbol(row)
    lens = detect_lens(row["keyword"])
    body = [
        f"# {title}",
        "",
        f"{row['keyword']} is best treated as a reflective dream symbol, not a fixed prediction. Use the meaning below as a starting point and compare it with your recent emotions, relationships, sleep quality, and personal associations.",
        "",
        f"## What {symbol} Can Mean in a Dream",
        "",
        f"A dream about {symbol} can point to an image your mind is using to organize emotion, memory, fear, desire, or spiritual curiosity. The exact meaning depends on what happened in the dream and how you felt when you woke up.",
        "",
        "## Quick Interpretation",
        "",
        "- Notice the strongest emotion in the dream.",
        "- Compare the symbol with a current situation in your life.",
        "- Treat spiritual meanings as reflective possibilities, not certainty.",
        "- Keep a short dream journal if the theme repeats.",
        "",
        "## Psychological Reflection",
        "",
        "From a psychological angle, this dream may be connected with stress, attention, memory processing, or unresolved personal associations. It should not be used as a clinical or mental-health assessment.",
        "",
        "## Spiritual Symbolism",
        "",
        "From a spiritual angle, the symbol can be read as an invitation to reflect on timing, trust, protection, transition, or inner clarity. For religious lenses, avoid treating the interpretation as doctrine or a binding ruling.",
        "",
        "## Crystals for Reflection",
        "",
        "Amethyst can support a calm journaling ritual, while quartz can be used as a simple focus object for intention setting. These are symbolic practices, not medical or spiritual guarantees.",
        "",
        "## FAQ",
        "",
        f"### Is {row['keyword']} a prediction?",
        "No. Treat it as reflective content, not prophecy.",
        "",
        "### Should I worry about this dream?",
        "Not automatically. If a dream is distressing or recurring, consider journaling it and seeking qualified support when it affects your daily life.",
    ]
    return {
        "source_row": row["source_row"],
        "keyword": row["keyword"],
        "slug": row["slug"],
        "url": f"/{row['slug']}/",
        "route": route,
        "title": title,
        "body_markdown": "\n".join(body) if route != "blocked" else "",
        "religious_sensitivity": lens in SENSITIVE_LENSES,
        "publication_ready": False,
        "requires_human_review": True,
        "blocked_reason": row["noise_flag"] if route == "blocked" else [],
    }


def image_for(row):
    route = route_for(row)
    lens = detect_lens(row["keyword"])
    symbol = safe_symbol(row)
    religious_constraints = []
    if lens == "islamic":
        religious_constraints = ["no sacred text", "no calligraphy", "no human figures"]
    negative = ["text", "logo", "medical scene", "blood", "gore", "horror", "religious icons used as claims"] + religious_constraints
    return {
        "source_row": row["source_row"],
        "keyword": row["keyword"],
        "slug": row["slug"],
        "route": route,
        "filename": f"{row['slug']}-hero.webp",
        "hero_prompt": (
            f"Soft editorial dream-journal still life for {symbol}, moonlit bedroom atmosphere, "
            "subtle crystals on a nightstand, calm reflective mood, no text, no logo, high quality lifestyle photography."
        ) if route != "blocked" else "",
        "negative_prompt": negative,
        "alt_text": f"Dream journal scene for {row['keyword']} with calming crystals",
        "style_family": "soft_editorial_dream_journal",
        "religious_constraints": religious_constraints,
        "violence_abstraction": True,
        "actual_image_generated": False,
    }


def main():
    for directory in OUT_DIRS.values():
        directory.mkdir(parents=True, exist_ok=True)

    candidates = read_json(SHARED_DIR / "dreams-candidates.json")
    p_candidates = [row for row in candidates if row.get("priority") in {"P0", "P1", "P2", "P3"}]

    evidence_rows = [evidence_for(row) for row in p_candidates]
    brief_rows = [brief_for(row) for row in p_candidates]
    article_rows = [article_for(row) for row in p_candidates]
    image_rows = [image_for(row) for row in p_candidates]

    write_jsonl(OUT_DIRS["evidence"] / "dream-evidence-full.jsonl", evidence_rows)
    write_jsonl(OUT_DIRS["briefs"] / "dream-briefs-full.jsonl", brief_rows)
    write_jsonl(OUT_DIRS["articles"] / "dream-articles-full.jsonl", article_rows)
    write_jsonl(OUT_DIRS["images"] / "dream-image-manifest-full.jsonl", image_rows)

    summary = {
        "scope": "all P0/P1/P2/P3 candidates",
        "input_candidates": len(candidates),
        "included_candidates": len(p_candidates),
        "excluded_parked": len(candidates) - len(p_candidates),
        "route_counts": dict(Counter(route_for(row) for row in p_candidates)),
        "priority_counts": dict(Counter(row.get("priority") for row in p_candidates)),
        "noise_counts": dict(Counter(flag for row in p_candidates for flag in row.get("noise_flag", []))),
        "outputs": {
            "evidence": str(OUT_DIRS["evidence"] / "dream-evidence-full.jsonl"),
            "briefs": str(OUT_DIRS["briefs"] / "dream-briefs-full.jsonl"),
            "articles": str(OUT_DIRS["articles"] / "dream-articles-full.jsonl"),
            "images": str(OUT_DIRS["images"] / "dream-image-manifest-full.jsonl"),
        },
        "publication_ready": False,
        "actual_images_generated": False,
    }
    (OUT_DIRS["qa"] / "full-production-summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
