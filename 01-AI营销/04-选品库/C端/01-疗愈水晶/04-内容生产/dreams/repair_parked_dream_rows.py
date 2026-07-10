import json
import re
from pathlib import Path

from run_repaired_full_production import (
    SENSITIVE_LENSES,
    article_markdown,
    crystal_slots,
    detect_lens,
    differentiated_sections,
    write_jsonl,
)


BASE = Path(__file__).resolve().parent
ARTICLE_PATH = BASE / "articles" / "dream-articles-repaired-full-1289.jsonl"
OUTPUTS = [
    BASE / "articles" / "dream-articles-repaired-full-1289.jsonl",
    BASE / "briefs" / "dream-briefs-repaired-full-1289.jsonl",
    BASE / "evidence" / "dream-evidence-repaired-full-1289.jsonl",
]

# Each former artifact gets one distinct, reader-facing topic rather than a slug-only repair.
REPAIRS = {
    "az-dream-spiritual-meaning": ("Spiritual Dream Meanings A to Z", "spiritual dream meanings a to z", "spiritual-dream-meanings-a-to-z", "Lens"),
    "and-their-meanings-dream-spiritual-meaning": ("How to Interpret Spiritual Dreams", "how to interpret spiritual dreams", "how-to-interpret-spiritual-dreams", "Lens"),
    "dreamy-bot-dream-meaning": ("Dream Interpretation Tools Guide", "dream interpretation tools guide", "dream-interpretation-tools-guide", "Type"),
    "dreamlookup-dream-meaning": ("How to Look Up Dream Meanings", "how to look up dream meanings", "how-to-look-up-dream-meanings", "Type"),
    "z-dream-spiritual-meaning": ("Dream Symbols A to Z", "dream symbols a to z", "dream-symbols-a-to-z", "Hub"),
    "online-dream-biblical-meaning": ("Biblical Dream Dictionary", "biblical dream dictionary", "biblical-dream-dictionary", "Lens"),
    "and-meanings-dream-spiritual-meaning": ("Spiritual Dream Meanings", "spiritual dream meanings", "spiritual-dream-meanings", "Lens"),
    "and-their-dream-spiritual-meaning": ("Spiritual Dream Symbols", "spiritual dream symbols", "spiritual-dream-symbols", "Lens"),
    "verse-big-dream-biblical-meaning": ("Bible Verses About Dreams", "bible verses about dreams", "bible-verses-about-dreams", "Lens"),
    "and-meanings-dream-biblical-meaning": ("Biblical Dream Meanings", "biblical dream meanings", "biblical-dream-meanings", "Lens"),
    "dreamscape-definition-dream-meaning": ("What Is a Dreamscape?", "what is a dreamscape", "what-is-a-dreamscape", "Subject"),
    "within-dream-biblical-meaning": ("Dream Within a Dream Biblical Meaning", "dream within a dream biblical meaning", "dream-within-a-dream-biblical-meaning", "Lens"),
    "dreamscape-define-dream-meaning": ("How to Interpret a Dreamscape", "how to interpret a dreamscape", "how-to-interpret-a-dreamscape", "Type"),
    "dreamscape-dream-meaning": ("Dreamscape Meaning", "dreamscape meaning", "dreamscape-meaning", "Subject"),
    "meanings-for-dream-biblical-meaning": ("Biblical Dream Interpretation Guide", "biblical dream interpretation guide", "biblical-dream-interpretation-guide", "Lens"),
    "interpretations-az-dream-christian-meaning": ("Christian Dream Symbols A to Z", "christian dream symbols a to z", "christian-dream-symbols-a-to-z", "Lens"),
    "define-dreamscape-dream-meaning": ("Dreamscape vs Dream", "dreamscape vs dream", "dreamscape-vs-dream", "Subject"),
    "online-free-dream-islamic-meaning": ("Islamic Dream Interpretation Guide", "islamic dream interpretation guide", "islamic-dream-interpretation-guide", "Lens"),
    "definition-dreamscape-dream-meaning": ("Dreamscape Symbolism", "dreamscape symbolism", "dreamscape-symbolism", "Subject"),
    "ai-dream-islamic-meaning": ("Islamic Dream Discernment Guide", "islamic dream discernment guide", "islamic-dream-discernment-guide", "Lens"),
    "dreamer-tattoo-dream-meaning": ("Dreamer Tattoo Symbolism", "dreamer tattoo symbolism", "dreamer-tattoo-symbolism", "Emotion"),
}


def read_jsonl(path):
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def repair_row(row):
    old_slug = row["slug"]
    title, keyword, slug, page_type = REPAIRS[old_slug]
    lens = detect_lens(keyword)
    crystals = crystal_slots(lens, page_type)
    sections = differentiated_sections(keyword, lens, page_type, [], crystals)
    body = article_markdown(title, keyword, lens, [], page_type, crystals)
    row.update({
        "previous_slug": old_slug,
        "repaired_keyword": keyword,
        "slug": slug,
        "url": f"/{slug}/",
        "page_type": page_type,
        "repair_status": "editorially_repaired_from_slug_artifact",
        "original_noise_flag": [],
        "title": title,
        "meta_title": f"{title} | Earthward",
        "meta_description": f"Explore {keyword} through grounded dream reflection, spiritual context, and optional crystal journaling support.",
        "image_source_slug": old_slug,
    })
    row["article"] = {"body_markdown": body, "faq_count": 4, "word_count": len(re.findall(r"\b[\w']+\b", body))}
    row["brief"].update({
        "h1": title,
        "key_takeaways": sections["key_takeaways"],
        "psychological_reflection": sections["psychology"],
        "spiritual_symbolism": sections["spiritual"],
        "crystals_for_dream_reflection": sections["crystals"],
        "journal_prompts": sections["journal_prompts"],
        "template_family": "lens" if lens != "general" else "subject",
        "crystal_profile_slugs": crystals,
    })
    row["evidence"].update({
        "intent_summary": "Editorially repaired from a navigation, brand, or duplicated-keyword artifact into a distinct dream-intent page.",
        "psychology_angle": sections["psychology"],
        "spiritual_angle": sections["spiritual"],
        "crystal_angle": sections["crystals"],
        "key_takeaways": sections["key_takeaways"],
    })
    row["crystal_reuse_slots"] = [{"slug": stone, "profile_path": f"/{stone}/", "image_request": "reuse_existing_390_library"} for stone in crystals]
    row["compliance"]["religious_sensitivity"] = lens in SENSITIVE_LENSES
    return row


def main():
    rows = read_jsonl(ARTICLE_PATH)
    repaired = [repair_row(row) if row["slug"] in REPAIRS else row for row in rows]
    missing = set(REPAIRS) - {row.get("previous_slug") for row in repaired}
    if missing:
        raise ValueError(f"repair rows missing: {sorted(missing)}")
    slugs = [row["slug"] for row in repaired]
    if len(slugs) != len(set(slugs)):
        raise ValueError("repair mapping created duplicate slugs")
    for path in OUTPUTS:
        write_jsonl(path, repaired)
    print(json.dumps({"repaired": len(REPAIRS), "rows": len(repaired), "unique_slugs": len(set(slugs))}, indent=2))


if __name__ == "__main__":
    main()
