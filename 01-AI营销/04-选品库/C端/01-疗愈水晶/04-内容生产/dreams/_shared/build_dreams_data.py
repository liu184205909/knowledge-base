import json
import re
from collections import Counter
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
CANDIDATES_PATH = BASE_DIR / "dreams-candidates.json"
SAMPLE_PATH = BASE_DIR / "dreams-knowledge.sample.json"
KNOWLEDGE_PATH = BASE_DIR / "dreams-knowledge.json"
CRYSTAL_LIBRARY_DIR = BASE_DIR.parent.parent / "1.crystal-meaning"

LENS_TERMS = ("biblical", "bible", "islamic", "islam", "christian", "spiritual", "prophetic")
SENSITIVE_LENSES = {"biblical", "islamic", "christian", "spiritual", "prophetic"}
ANIMAL_TERMS = {
    "ant", "ants", "bear", "cat", "cockroach", "cockroaches", "cobra", "dog", "fish",
    "frog", "frogs", "insect", "insects", "lion", "mice", "rat", "rats", "roach",
    "roaches", "snake", "snakes", "spider", "spiders", "whale", "zombie", "zombies",
}
UNSAFE_TERMS = (
    "kill", "killed", "murder", "murdered", "suicide", "forcing themselves",
    "rape", "assault", "abuse", "miscarriage",
)
GENERIC_NAV_TERMS = (
    "dictionary", "a to z", "a-z", "interpret my dream", "dream interpretation",
    "dream symbols", "dream meanings", "dream meaning", "meaning of dreams",
)
BRAND_TERMS = ("dream bible", "dreambible", "dreamybot", "ibn sirin")
CROSS_VERTICAL_STARTS = (
    "define ", "what is meant by ", "what does ", "what do ", "what is ",
    "who is ", "deer symbolism", "letter ", "symbolism number",
)
SPANISH_MARKERS = ("soñar", "sueño", "suenos", "sueños", "significado", "que significa", "con jesus")
ARABIC_PERSIAN_RE = re.compile(r"[\u0600-\u06ff]")
TYPO_RE = re.compile(r"\b(?:dram|drram|drma|dreem|drream)\b")
ANGEL_NUMBER_RE = re.compile(r"\b\d{3,4}\s+angel\s+number\b")

CRYSTAL_CHOICES = [
    {
        "name": "amethyst",
        "profile_slug": "amethyst-meaning",
        "shop_url": "/product-category/amethyst-crystals/",
        "use_case": "calm reflection and sleep-journal ritual",
    },
    {
        "name": "quartz",
        "profile_slug": "quartz-meaning",
        "shop_url": "/product-category/quartz-crystals/",
        "use_case": "clarity-focused intention setting",
    },
    {
        "name": "labradorite",
        "profile_slug": "labradorite-meaning",
        "shop_url": "/product-category/labradorite-crystals/",
        "use_case": "symbolic intuition and transition journaling",
    },
    {
        "name": "black tourmaline",
        "profile_slug": "black-tourmaline-meaning",
        "shop_url": "/product-category/black-tourmaline-crystals/",
        "use_case": "grounding after intense or unsettling dream themes",
    },
    {
        "name": "rose quartz",
        "profile_slug": "rose-quartz-meaning",
        "shop_url": "/product-category/rose-quartz-crystals/",
        "use_case": "gentle emotional reflection for relationship dreams",
    },
    {
        "name": "smoky quartz",
        "profile_slug": "smoky-quartz-meaning",
        "shop_url": "/product-category/smoky-quartz-crystals/",
        "use_case": "grounded evening routine after anxious dream themes",
    },
]


def slugify(value):
    value = value.lower().replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return re.sub(r"-+", "-", value).strip("-") or "dream"


def normalized_keyword(keyword):
    k = keyword.lower().replace("can't", "cant")
    k = re.sub(r"\bdreamed\b", "dream", k)
    k = re.sub(r"\bdreaming\b", "dream", k)
    k = re.sub(r"\bdreams\b", "dream", k)
    return re.sub(r"\s+", " ", k).strip()


def detect_language(keyword):
    k = keyword.lower()
    if ARABIC_PERSIAN_RE.search(keyword):
        return "arabic_or_persian"
    if any(marker in k for marker in SPANISH_MARKERS):
        return "spanish"
    if re.search(r"[^\x00-\x7f]", keyword):
        return "other"
    return "english"


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
    return None


def extract_subject(keyword, page_type):
    k = normalized_keyword(keyword)
    original = k
    replacements = [
        (r"^biblical meaning of (.+?) in (?:a )?dream$", r"\1"),
        (r"^biblical meaning of dream about (.+)$", r"\1"),
        (r"^biblical meaning of dreams about (.+)$", r"\1"),
        (r"^spiritual meaning of (.+?) in (?:a )?dream$", r"\1"),
        (r"^spiritual meaning of dreams about (.+)$", r"\1"),
        (r"^dream about (.+?) spiritual meaning$", r"\1"),
        (r"^dream of (.+?) spiritual meaning$", r"\1"),
        (r"^dream of (.+?) biblical interpretation$", r"\1"),
        (r"^(.+?) dream meaning biblical$", r"\1"),
        (r"^(.+?) dream spiritual meaning$", r"\1"),
        (r"^(.+?) in dream islam$", r"\1"),
        (r"^dream meaning in islam (.+)$", r"\1"),
        (r"^dreamed? (?:about|of) (?:a |an |the |my )?(.+)$", r"\1"),
        (r"^i dream (?:of|about) (.+)$", r"\1"),
        (r"^(.+?) dream meaning$", r"\1"),
    ]
    for pattern, repl in replacements:
        hit = re.sub(pattern, repl, k)
        if hit != k:
            k = hit
            break
    k = re.sub(r"\b(?:biblical|bible|christian|islamic|islam|spiritual|prophetic)\b", " ", k)
    k = re.sub(r"\b(?:meaning|interpretation|symbol|symbols|dictionary|dream|dreams|dreamed|dreaming|about|of|in|a|an|the|my)\b", " ", k)
    k = re.sub(r"\b(?:what|does|do|is|are|to|you|your|mean|meant|by)\b", " ", k)
    k = re.sub(r"\s+", " ", k).strip()
    if not k and page_type == "Lens":
        return None
    if not k:
        k = original
    return k


def build_slug(keyword, page_type):
    lens = detect_lens(keyword)
    subject = extract_subject(keyword, page_type)
    if page_type == "Lens" and lens:
        if subject and slugify(subject) not in {"dream", "dreams"}:
            return f"{slugify(subject)}-dream-{lens}-meaning"
        return f"{lens}-dream-meaning"
    if page_type == "Lens":
        return f"{slugify(subject or keyword)}-dream-meaning"
    return f"{slugify(subject or keyword)}-dream-meaning"


def classify_category(keyword, page_type):
    k = keyword.lower()
    subject = extract_subject(keyword, page_type) or ""
    subject_tokens = set(slugify(subject).split("-"))
    if "sleep paralysis" in k:
        return "Type"
    if page_type == "Splinter" or any(color in k for color in ("white snake", "black snake")):
        return "Splinter"
    if page_type == "Emotion" or any(term in k for term in ("ex girlfriend", "boyfriend", "husband", "someone died", "stole my car")):
        return "Emotion"
    if "crystal" in k or k == "spiritual meaning of dreams":
        return "Crystals×Dreams"
    if detect_lens(k) and not subject:
        return "Hub"
    if subject_tokens & ANIMAL_TERMS:
        return "Animal"
    return page_type


def noise_flags(keyword, page_type, volume, kd, language):
    k = keyword.lower()
    flags = []
    if language != "english":
        flags.append("non_english")
    if TYPO_RE.search(k):
        flags.append("typo")
    if ANGEL_NUMBER_RE.search(k):
        flags.append("cross_vertical")
    if any(term in k for term in BRAND_TERMS):
        flags.append("brand_query")
    if "crossword clue" in k:
        flags.append("cross_vertical")
    has_dream_intent = any(term in k for term in ("dream", "dreamed", "dreaming", "sleep paralysis"))
    if not has_dream_intent:
        flags.append("cross_vertical")
    if page_type != "Lens" and any(k.startswith(prefix) for prefix in CROSS_VERTICAL_STARTS) and not has_dream_intent:
        flags.append("cross_vertical")
    if page_type == "Lens" and not has_dream_intent and any(term in k for term in ("spiritual meaning", "symbolize", "symbolism", "in the bible")):
        flags.append("cross_vertical")
    if any(term in k for term in UNSAFE_TERMS):
        flags.append("unsafe_skip")
    if any(term in k for term in GENERIC_NAV_TERMS) and not extract_subject(keyword, page_type):
        flags.append("generic_navigation")
    if volume <= 10 or kd == 0:
        flags.append("low_confidence")
    return sorted(set(flags))


def priority_for(row, flags):
    if "unsafe_skip" in flags or "non_english" in flags:
        return "Parked"
    if any(flag in flags for flag in ("brand_query", "cross_vertical", "typo", "generic_navigation")):
        return "P3"
    volume = row.get("volume") or 0
    page_type = row.get("page_type")
    lens = detect_lens(row["keyword"])
    if volume >= 1000 and (page_type in {"Subject", "Emotion", "Type", "Splinter"} or lens):
        return "P0"
    if volume >= 300:
        return "P1"
    if volume >= 50 and "low_confidence" not in flags:
        return "P2"
    return "P3"


def priority_rank(priority):
    return {"P0": 0, "P1": 1, "P2": 2, "P3": 3, "Parked": 4}.get(priority, 9)


def semrush_block(row):
    return {
        "verified": row.get("evidence_status") == "verified",
        "volume": row.get("volume"),
        "kd": row.get("kd"),
        "source": row.get("source"),
        "source_row": row.get("source_row"),
        "evidence_status": row.get("evidence_status"),
    }


def crystal_items_for(category, lens):
    choices = list(CRYSTAL_CHOICES[:2])
    if category in {"Emotion", "Type"}:
        choices = [CRYSTAL_CHOICES[0], CRYSTAL_CHOICES[5]]
    elif category == "Animal":
        choices = [CRYSTAL_CHOICES[2], CRYSTAL_CHOICES[3]]
    elif lens in SENSITIVE_LENSES:
        choices = [CRYSTAL_CHOICES[0], CRYSTAL_CHOICES[1]]
    return [
        {
            "name": item["name"],
            "profile_slug": item["profile_slug"],
            "profile_path": f"/{item['profile_slug']}/",
            "shop_url": item["shop_url"],
            "use_case": item["use_case"],
            "evidence_status": "brand_editorial_pairing",
        }
        for item in choices
    ]


def knowledge_object(row, content_depth="candidate_skeleton"):
    keyword = row["keyword"]
    lens = detect_lens(keyword)
    religious = lens in SENSITIVE_LENSES
    category = object_category(row)
    subject = extract_subject(keyword, row["page_type"]) or keyword
    image_negative = ["sacred text", "calligraphy", "human figures"] if lens == "islamic" else []
    return {
        "id": f"dream-{row['source_row']:04d}",
        "slug": row["slug"],
        "keyword": keyword,
        "volume": row.get("volume"),
        "kd": row.get("kd"),
        "semrush_verified": semrush_block(row),
        "category": category,
        "page_type": row.get("page_type"),
        "production_ready": row.get("production_ready"),
        "brief_ready": False,
        "content_ready": False,
        "publication_ready": False,
        "priority": row.get("priority"),
        "source_notes": {
            "source": row.get("source"),
            "source_row": row.get("source_row"),
            "evidence_status": row.get("evidence_status"),
            "content_depth": content_depth,
            "confidence": "conservative_skeleton",
            "notes": "SERP keyword metrics are verified from the candidate pool; interpretive copy requires editorial/source review before publication.",
        },
        "dream_symbol": {
            "primary_symbol": subject,
            "lens": lens or "general",
            "summary_status": "stub",
            "safe_summary": f"A conservative dream-symbol page outline for '{keyword}' without definitive claims.",
            "evidence_status": row.get("evidence_status"),
        },
        "psychology": {
            "status": "needs_editorial_review",
            "angle": "Frame as possible emotions, stressors, memory processing, or personal associations; avoid diagnosis.",
            "evidence_status": "not_yet_sourced",
        },
        "spiritual": {
            "status": "sensitive" if religious else "optional_interpretive",
            "lens": lens or "general",
            "religious_sensitivity": religious,
            "not_a_religious_ruling": True,
            "guidance": "Present as cultural or faith-adjacent interpretation, not doctrine, prophecy, or a binding ruling.",
            "evidence_status": "requires_source_review" if religious else "not_yet_sourced",
        },
        "crystal_recommendations": {
            "status": "candidate_pairings",
            "items": crystal_items_for(category, lens),
            "medical_claims": False,
        },
        "classification": {
            "language": row.get("language"),
            "noise_flag": row.get("noise_flag"),
            "content_status": "production_pool" if row.get("production_ready") else "candidate_only",
            "category": category,
            "lens": lens,
        },
        "urls": {
            "path": f"/{row['slug']}/",
            "canonical": f"/{row['slug']}/",
            "root_level_slug_only": True,
        },
        "internal_links": {
            "hub_candidates": ["/dream-meaning/", "/spiritual-dream-meaning/"],
            "related_candidates": [],
            "shop_candidates": [item["shop_url"] for item in crystal_items_for(category, lens)],
            "status": "needs_link_mapping",
        },
        "faq": [
            {
                "question": f"What can a {subject} dream mean?",
                "answer_status": "stub",
                "safe_answer": "It can be explored through personal context, recent emotions, and cultural symbolism rather than a fixed universal meaning.",
            },
            {
                "question": "Is this interpretation definitive?",
                "answer_status": "approved_compliance_stub",
                "safe_answer": "No. Dream interpretation is reflective content, not medical, mental-health, religious, legal, or financial advice.",
            },
        ],
        "images": {
            "status": "prompt_ready",
            "hero_prompt": f"Soft editorial still life for a dream journal page about {subject}, moonlit bedroom details, crystals on a nightstand, no text.",
            "negative_prompt": image_negative,
            "islamic_image_constraints": image_negative if lens == "islamic" else [],
        },
        "shop_cta": {
            "status": "soft_cta_only",
            "copy": "Pair this reflection with a calming crystal ritual or dream journal practice.",
            "avoid_claims": ["cure", "guarantee", "prophecy", "religious ruling"],
        },
        "compliance": {
            "not_medical_advice": True,
            "not_mental_health_diagnosis": True,
            "not_a_religious_ruling": True,
            "no_third_party_coverage_inference_claim": True,
            "dream_dictionary_prefix_forbidden": True,
            "religious_sensitivity": religious,
            "requires_human_review": True,
        },
    }


def enrich_candidates(raw_rows):
    enriched = []
    for idx, raw in enumerate(raw_rows, start=1):
        row = dict(raw)
        language = detect_language(row["keyword"])
        flags = noise_flags(row["keyword"], row["page_type"], row.get("volume") or 0, row.get("kd") or 0, language)
        priority = priority_for(row, flags)
        row.update({
            "slug": build_slug(row["keyword"], row["page_type"]),
            "canonical_slug": build_slug(row["keyword"], row["page_type"]),
            "priority": priority,
            "production_ready": not flags,
            "language": language,
            "noise_flag": flags,
            "source_row": idx,
        })
        enriched.append(row)

    by_slug = {}
    for row in enriched:
        by_slug.setdefault(row["canonical_slug"], []).append(row)
    for rows in by_slug.values():
        if len(rows) == 1:
            rows[0]["duplicate_rank"] = 1
            rows[0]["duplicate_of_source_row"] = None
            continue
        rows.sort(key=lambda row: (
            0 if row["production_ready"] else 1,
            priority_rank(row["priority"]),
            -(row.get("volume") or 0),
            row["source_row"],
        ))
        primary = rows[0]
        primary["duplicate_rank"] = 1
        primary["duplicate_of_source_row"] = None
        for rank, row in enumerate(rows[1:], start=2):
            row["duplicate_rank"] = rank
            row["duplicate_of_source_row"] = primary["source_row"]
            row["production_ready"] = False
            row["noise_flag"] = sorted(set(row["noise_flag"] + ["duplicate_slug"]))
    return enriched


def synthetic_row(source_row, keyword, page_type, category, priority="P1"):
    slug = build_slug(keyword, page_type)
    return {
        "keyword": keyword,
        "volume": None,
        "kd": None,
        "source": "editorial_support_object",
        "page_type": page_type,
        "evidence_status": "support_object_not_seo_metric",
        "slug": slug,
        "canonical_slug": slug,
        "priority": priority,
        "production_ready": False,
        "language": "english",
        "noise_flag": ["support_object"],
        "source_row": source_row,
        "duplicate_rank": 1,
        "duplicate_of_source_row": None,
        "forced_category": category,
    }


def object_category(row):
    return row.get("forced_category") or classify_category(row["keyword"], row["page_type"])


def pick_sample(enriched):
    target_categories = ["Subject", "Lens", "Animal", "Type", "Emotion", "Splinter", "Crystals×Dreams", "Hub"]
    picked = []
    seen_rows = set()
    for category in target_categories:
        match = next((
            row for row in enriched
            if row["source_row"] not in seen_rows
            and row["language"] == "english"
            and not row["noise_flag"]
            and object_category(row) == category
        ), None)
        if match:
            picked.append(match)
            seen_rows.add(match["source_row"])

    next_row = max(row["source_row"] for row in enriched) + 1
    existing_categories = {object_category(row) for row in picked}
    if "Crystals×Dreams" not in existing_categories:
        picked.append(synthetic_row(next_row, "crystals for dream recall", "Tool", "Crystals×Dreams"))
        next_row += 1
    if "Hub" not in existing_categories:
        picked.append(synthetic_row(next_row, "biblical dream meaning", "Lens", "Hub"))

    for row in enriched:
        if len(picked) >= 10:
            break
        if row["source_row"] in seen_rows or row["language"] != "english" or row["noise_flag"]:
            continue
        picked.append(row)
        seen_rows.add(row["source_row"])

    sample = [knowledge_object(row, "sample_completeish") for row in picked[:10]]
    for obj in sample:
        obj["source_notes"]["notes"] = "Sample object for schema validation; conservative placeholders only, not final article copy."
    return sample


def build_knowledge(enriched):
    production_pool = [
        row for row in enriched
        if row["production_ready"] and row["priority"] in {"P0", "P1", "P2"}
    ]
    return [knowledge_object(row) for row in production_pool]


def main():
    raw_rows = json.loads(CANDIDATES_PATH.read_text(encoding="utf-8"))
    enriched = enrich_candidates(raw_rows)
    sample = pick_sample(enriched)
    knowledge = build_knowledge(enriched)

    CANDIDATES_PATH.write_text(json.dumps(enriched, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    SAMPLE_PATH.write_text(json.dumps(sample, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    KNOWLEDGE_PATH.write_text(json.dumps(knowledge, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    noise_counter = Counter(flag for row in enriched for flag in row["noise_flag"])
    priority_counter = Counter(row["priority"] for row in enriched)
    knowledge_category_counter = Counter(row["category"] for row in knowledge)
    print(json.dumps({
        "candidates_count": len(enriched),
        "production_ready_count": sum(1 for row in enriched if row["production_ready"]),
        "priority_counts": dict(sorted(priority_counter.items())),
        "noise_flag_counts": dict(sorted(noise_counter.items())),
        "sample_count": len(sample),
        "knowledge_count": len(knowledge),
        "knowledge_category_counts": dict(sorted(knowledge_category_counter.items())),
        "paths": {
            "candidates": str(CANDIDATES_PATH),
            "sample": str(SAMPLE_PATH),
            "knowledge": str(KNOWLEDGE_PATH),
        },
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
