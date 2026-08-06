import json
import re
import sys
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

SENSITIVE_LENSES = {"biblical", "islamic", "christian", "spiritual", "prophetic", "religious"}
RELIGIOUS_TERMS = {
    "god", "jesus", "christ", "church", "bible", "biblical", "christian",
    "islam", "islamic", "quran", "koran", "prophetic", "spiritual", "prayer",
}
TYPO_FIXES = {
    "dram": "dream",
    "drram": "dream",
    "drma": "dream",
    "dreem": "dream",
    "drream": "dream",
}


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def read_jsonl(path):
    with path.open("r", encoding="utf-8") as handle:
        return [json.loads(line) for line in handle if line.strip()]


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
    if any(re.search(rf"\b{re.escape(term)}\b", k) for term in RELIGIOUS_TERMS):
        return "religious"
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


def display_crystal(slug):
    return slug.removesuffix("-meaning").replace("-", " ").title()


def subject_for(keyword):
    subject = keyword.lower()
    subject = re.sub(r"\b(?:biblical|christian|islamic|islam|spiritual|prophetic|religious)\b", " ", subject)
    subject = re.sub(r"\b(?:dream|dreams|dreamed|dreaming|meaning|interpretation|symbol|symbols|dictionary|about|of|in|a|an|the|my|your|to|for)\b", " ", subject)
    subject = re.sub(r"\s+", " ", subject).strip()
    return subject or keyword


def theme_for(keyword, page_type):
    k = keyword.lower()
    animals = {
        "snake": "instinct, hidden pressure, and the need to notice what feels unsafe or transformative",
        "cat": "independence, intuition, and boundaries around closeness",
        "dog": "loyalty, protection, friendship, and trust",
        "spider": "patience, entanglement, creative work, or feeling caught in a situation",
        "bird": "perspective, messages, freedom, or the wish to rise above a problem",
        "fish": "emotion, intuition, and what is moving below the surface",
        "bear": "strength, solitude, protection, and the need to slow down",
        "rat": "unease, resourcefulness, suspicion, or small worries that keep multiplying",
        "lion": "confidence, courage, pride, and how power is being used",
        "frog": "transition, cleansing, and movement from one emotional state to another",
    }
    for animal, theme in animals.items():
        if re.search(rf"\b{animal}s?\b", k):
            return theme
    if any(term in k for term in ("water", "ocean", "river", "flood", "rain")):
        return "emotion, overwhelm, cleansing, and how feelings are moving through your life"
    if any(term in k for term in ("teeth", "tooth")):
        return "confidence, vulnerability, communication, and fear of losing control"
    if any(term in k for term in ("death", "dead", "dying", "funeral")):
        return "endings, grief, memory, and the symbolic closing of one life chapter"
    if any(term in k for term in ("pregnant", "pregnancy", "baby")):
        return "new responsibility, creativity, waiting, and something developing beneath the surface"
    if any(term in k for term in ("falling", "fall")):
        return "loss of control, uncertainty, and the body-mind feeling of not being supported"
    if any(term in k for term in ("flying", "fly")):
        return "freedom, distance from daily pressure, and the wish to see life from above"
    if any(term in k for term in ("chased", "chase", "running")):
        return "avoidance, urgency, and a pressure you may not want to face directly"
    if any(term in k for term in ("house", "room", "door", "window")):
        return "personal boundaries, private identity, and the rooms of life you are entering or leaving"
    if any(term in k for term in ("car", "vehicle", "train", "bus")):
        return "direction, control, pacing, and whether life feels self-directed or steered by others"
    if page_type == "Emotion":
        return "relationship memory, attachment, old emotion, and the need to name what still feels unresolved"
    if page_type == "Type":
        return "recurring stress patterns, body arousal, and the difference between a vivid dream and a useful signal"
    return "personal context, emotion, memory, and the symbolic role this image played in the dream"


def lens_guidance(lens):
    if lens == "islamic":
        return "For an Islamic lens, keep the reading humble: treat it as reflective commentary, not a fatwa, omen, or substitute for a qualified scholar."
    if lens == "biblical":
        return "For a biblical lens, connect the dream to prayerful reflection, conscience, and moral attention without claiming a direct message from God."
    if lens == "christian":
        return "For a Christian lens, frame the symbol around discernment, prayer, and character rather than certainty about the future."
    if lens == "prophetic":
        return "For a prophetic lens, keep the boundary especially clear: intensity does not prove prediction, and the safest use is reflective journaling."
    if lens == "spiritual":
        return "For a spiritual lens, read the symbol as an invitation to self-inquiry, grounding, and meaning-making rather than a fixed sign."
    if lens == "religious":
        return "For a religious lens, keep the interpretation respectful, non-doctrinal, and open to qualified guidance from the reader's own tradition."
    return "Spiritually, the symbol can be read as an invitation to notice patterns, values, and inner timing without treating the dream as proof."


def differentiated_sections(keyword, lens, page_type, original_flags, crystals):
    subject = subject_for(keyword)
    theme = theme_for(keyword, page_type)
    crystal_names = [display_crystal(slug) for slug in crystals]
    is_repaired = bool(original_flags)
    route_note = " Because this topic came from a repaired keyword route, use the page as a draftable interpretation and keep the final slug/intent review in place." if is_repaired else ""
    psychology = (
        f"In a psychological reading, {keyword} is best treated as a scene built around {theme}. "
        f"Start with the role of {subject}: was it threatening, comforting, strange, familiar, distant, or close to you? "
        "That emotional position matters more than a dictionary definition, because dreams often remix recent stress, memory, body sensation, and unfinished attention. "
        f"If the dream repeated or felt unusually vivid, journal the moment when {subject} changed the mood of the dream and compare it with a current waking-life pressure.{route_note}"
    )
    spiritual = (
        f"{lens_guidance(lens)} In this page, {subject} can be explored as a symbolic mirror for {theme}. "
        "A useful spiritual reading asks what the dream is asking you to practice: patience, protection, honesty, release, courage, forgiveness, or clearer boundaries. "
        "Keep the interpretation gentle and test it against your actual life rather than forcing the dream to carry more certainty than it can support."
    )
    crystals_text = (
        f"For crystal reflection, use {crystal_names[0]} as the primary journaling anchor for this dream, then pair it with {crystal_names[1]} and {crystal_names[2]} if you want a fuller ritual. "
        f"Place the stones beside a notebook, write the phrase '{subject} in my dream may be pointing to...', and finish the sentence without trying to make it perfect. "
        "The value is the pause, the texture, and the intention you assign to the practice; the crystals are symbolic supports, not treatments, guarantees, or proof that the interpretation is correct."
    )
    takeaways = [
        f"{title_fragment(subject)} points toward {theme}; read the feeling before forcing a fixed meaning.",
        "Sleep science can explain vividness and emotional charge, but not a universal symbol code.",
        f"The {lens if lens != 'general' else 'spiritual'} layer should stay reflective, humble, and grounded in your real context.",
        f"{crystal_names[0]} can serve as a journaling anchor for the theme, without medical or predictive claims.",
    ]
    prompts = [
        f"What did {subject} seem to want, protect, reveal, or interrupt in the dream?",
        f"Where do I feel {theme.split(',')[0]} in waking life right now?",
        f"What would a calmer and more honest response to this {subject} dream look like today?",
    ]
    return {
        "psychology": psychology,
        "spiritual": spiritual,
        "crystals": crystals_text,
        "key_takeaways": takeaways,
        "journal_prompts": prompts,
    }


def title_fragment(subject):
    return subject[:1].upper() + subject[1:] if subject else "This dream"


def article_markdown(title, keyword, lens, original_flags, page_type, crystals):
    sections = differentiated_sections(keyword, lens, page_type, original_flags, crystals)
    subject = subject_for(keyword)
    theme = theme_for(keyword, page_type)
    crystal_names = [display_crystal(slug) for slug in crystals]
    faith_note = " For faith-based lenses, this is reflective symbolism rather than doctrine or a binding faith ruling." if lens in SENSITIVE_LENSES else ""
    flag_note = ""
    if original_flags:
        flag_note = " This draft was generated from a repaired candidate, so the original keyword route should be reviewed before publishing."
    return "\n".join([
        f"# {title}",
        "",
        f"{keyword} can be explored as a dream-symbol question rather than a fixed prediction.{faith_note}{flag_note}",
        "",
        "## Key Takeaways",
        "",
        *[f"- {item}" for item in sections["key_takeaways"]],
        "",
        "## From Sleep Science",
        "",
        "Sleep research has not pinned down one fixed meaning for this kind of dream. Dreams during REM may reflect memory consolidation and emotional processing, which helps explain why dreams can feel vivid, recurring, or emotionally charged. Science can describe the mechanism; it has not confirmed a fixed symbolic meaning, which leaves room for the personal, cultural, and reflective readings below.",
        "",
        "## Psychological Reflection",
        "",
        sections["psychology"],

        "",
        "## How the Details Change the Reading",
        "",
        f"The image alone is not the whole story. With {subject}, begin with the dream's feeling-tone: fear can point toward a pressure that needs naming, while curiosity can point toward a change you are already ready to explore. Notice whether the symbol was approaching you, leaving you, blocked behind something, or under your control. Those small shifts usually tell you more than a fixed dream-dictionary definition.",
        "",
        f"Then place the dream beside a current waking-life context. The theme here is {theme}. Ask whether a recent conversation, deadline, relationship change, health worry, or transition has given that theme extra emotional charge. This is not proof that the dream predicts an outcome; it is a practical way to turn a vivid image into a useful question.",

        "",
        "## Before You Settle on an Interpretation",
        "",
        f"Hold at least two possibilities at once. {subject} may reflect a personal association, a recent memory, a body sensation during sleep, or a broader emotional pattern. A strong interpretation should still make sense after you remove the dramatic parts of the dream. If it makes you more frightened, certain, or disconnected from ordinary evidence, step back and return to the simplest version of the question: what feeling did the scene leave with me, and what in my current life might need that feeling's attention?",
        "",
        "## Spiritual Symbolism",
        "",
        sections["spiritual"],

        "",
        "## A Grounded Way to Work With This Dream",
        "",
        f"1. **Record the scene before interpreting it.** Write down what {subject} did, where it appeared, and the strongest feeling in your body when you woke.",
        f"2. **Name one live pressure.** Connect the dream to one area where {theme.split(',')[0]} feels present now. Keep the link tentative rather than treating it as a verdict.",
        "3. **Choose one small response.** That might be a conversation, a boundary, a rest day, a practical check-in, or simply returning to the question after you have slept on it.",
        "4. **Escalate real-world concerns appropriately.** If a dream is tied to ongoing distress, disrupted sleep, trauma, or a physical symptom, seek support from an appropriate qualified professional. A dream page is a reflection aid, not care.",
        "",
        "## Crystals for Dream Reflection",
        "",
        sections["crystals"],

        "",
        f"### {crystal_names[0]}: the primary reflection cue",
        f"Keep {crystal_names[0]} where you journal or beside the bed. Its role in this practice is to mark a short pause between waking from the dream and reacting to it. Give it one question about {subject}, then write for five minutes.",
        "",
        f"### {crystal_names[1]}: a second perspective",
        f"Use {crystal_names[1]} when the dream leaves you with a lot of mental noise. Rather than asking the stone to give an answer, use it as a prompt to separate what happened in the dream from the story you immediately began telling yourself about it.",
        "",
        f"### {crystal_names[2]}: closing the practice",
        f"End with {crystal_names[2]} and one grounded action for the day. This keeps the ritual connected to ordinary choices and makes clear that the stones are symbolic companions, not medical tools or evidence that an interpretation is true.",

        "",
        "## Common Variations to Notice",
        "",
        f"- **The symbol is close or overwhelming.** This can be a useful prompt to look at where {theme.split(',')[0]} feels immediate or difficult to avoid.",
        f"- **The symbol is distant, hidden, or behind a barrier.** Consider whether {subject} represents an issue you have noticed but not yet engaged directly.",
        "- **The scene repeats.** Repetition does not make a dream prophetic. It can simply mean the associated emotion or life situation has remained active.",
        "- **The dream ends with relief.** Pay attention to what changed just before you woke. That moment can suggest a personal resource, boundary, or conversation worth carrying into daylight.",
        "",
        "## Journal Prompts",
        "",
        *[f"- {item}" for item in sections["journal_prompts"]],
        "",
        "## FAQ",
        "",
        "### Is this dream meaning definitive?",
        "No. Dream meanings are reflective prompts, not fixed facts.",
        "",
        "### Should I act on this dream immediately?",
        "Use it for journaling first. For health, safety, legal, financial, or religious decisions, seek qualified guidance.",

        "",
        f"### Why did {subject} appear in my dream?",
        f"There is no universal answer. Compare the image, its feeling-tone, and the current life context where {theme.split(',')[0]} feels most alive. That is more useful than treating the symbol as a fixed code.",

        "",
        "### Can crystals change what this dream means?",
        "No. A crystal can support a reflective routine, but it cannot prove, change, diagnose, or predict the meaning of a dream. Use the practice to slow down and journal, not to replace real-world judgment or care.",
    ])


def build_rows(candidates):
    used_slugs = {
        row["slug"]
        for row in candidates
        if row.get("priority") in {"P0", "P1", "P2", "P3"}
        and row.get("production_ready")
        and not row.get("noise_flag")
    }
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
        content_sections = differentiated_sections(keyword, lens, row.get("page_type"), row.get("noise_flag") or [], crystals)
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
                "sleep_science": {
                    "sleep_mechanism": "REM dreaming may involve memory consolidation, emotional processing, and vivid sensory imagery.",
                    "public_data_point": "Use only verified public sleep-science data during final editorial review; this draft does not claim proprietary survey data.",
                    "humility_line": f"Sleep research has not confirmed that {keyword} has one fixed symbolic meaning.",
                    "source_status": "needs_final_source_verification",
                },
                "key_takeaways": [
                    *content_sections["key_takeaways"],
                ],
                "psychology_angle": content_sections["psychology"],
                "spiritual_angle": content_sections["spiritual"],
                "crystal_angle": content_sections["crystals"],
            },
            "brief": {
                "h1": title,
                "key_takeaways": content_sections["key_takeaways"],
                "sleep_science": "Sleep research has not confirmed one fixed symbolic meaning for this dream; use the science section as a boundary-setting bridge before psychology, spiritual symbolism, and crystals.",
                "psychological_reflection": content_sections["psychology"],
                "spiritual_symbolism": content_sections["spiritual"],
                "crystals_for_dream_reflection": content_sections["crystals"],
                "journal_prompts": content_sections["journal_prompts"],
                "h2_outline": ["Key Takeaways", "From Sleep Science", "Psychological Reflection", "Spiritual Symbolism", "Crystals for Dream Reflection", "Journal Prompts", "FAQ"],
                "template_family": "lens" if lens != "general" else "subject",
                "crystal_profile_slugs": crystals,
            },
            "article": {
                "body_markdown": article_markdown(title, keyword, lens, row.get("noise_flag") or [], row.get("page_type"), crystals),
                "faq_count": 2,
            },
            "image": {
                "filename": f"{slug}-hero.webp",
                "hero_prompt": f"Soft editorial dream-journal hero image for {keyword}, moonlit room, symbolic mist, calming crystals on a nightstand, peaceful reflective mood, no text, no logo",
                "negative_prompt": [
                    "text", "logo", "watermark", "blood", "gore", "medical scene",
                    "dark horror", "religious scripture text", "binding faith ruling claim",
                    *(
                        ["deity depiction", "prophets or holy figures", "sacred iconography"]
                        if lens in SENSITIVE_LENSES else []
                    ),
                ],
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


def expand_current_ready_rows():
    """Re-render only the retained 351 rows; never restore parked candidates."""
    article_path = OUT_DIRS["articles"] / "dream-articles-repaired-full-1289.jsonl"
    rows = read_jsonl(article_path)
    expanded = []
    for row in rows:
        keyword = row.get("repaired_keyword") or row.get("original_keyword") or row["slug"].replace("-", " ")
        lens = detect_lens(keyword)
        crystals = [slot["slug"] for slot in row.get("crystal_reuse_slots") or []]
        if len(crystals) < 3:
            crystals = crystal_slots(lens, row.get("page_type"))
        sections = differentiated_sections(keyword, lens, row.get("page_type"), row.get("original_noise_flag") or [], crystals)
        body = article_markdown(row["title"], keyword, lens, row.get("original_noise_flag") or [], row.get("page_type"), crystals)
        row["article"] = {
            "body_markdown": body,
            "faq_count": 4,
            "word_count": len(re.findall(r"\b[\w']+\b", body)),
        }
        row.setdefault("brief", {}).update({
            "key_takeaways": sections["key_takeaways"],
            "psychological_reflection": sections["psychology"],
            "spiritual_symbolism": sections["spiritual"],
            "crystals_for_dream_reflection": sections["crystals"],
            "journal_prompts": sections["journal_prompts"],
            "h2_outline": [
                "Key Takeaways", "From Sleep Science", "Psychological Reflection",
                "How the Details Change the Reading", "Before You Settle on an Interpretation", "Spiritual Symbolism",
                "A Grounded Way to Work With This Dream", "Crystals for Dream Reflection",
                "Common Variations to Notice", "Journal Prompts", "FAQ",
            ],
        })
        row.setdefault("evidence", {}).update({
            "key_takeaways": sections["key_takeaways"],
            "psychology_angle": sections["psychology"],
            "spiritual_angle": sections["spiritual"],
            "crystal_angle": sections["crystals"],
        })
        expanded.append(row)

    output_names = {
        "evidence": "dream-evidence-repaired-full-1289.jsonl",
        "briefs": "dream-briefs-repaired-full-1289.jsonl",
        "articles": "dream-articles-repaired-full-1289.jsonl",
    }
    for key, filename in output_names.items():
        write_jsonl(OUT_DIRS[key] / filename, expanded)
    return expanded


def main():
    text_only = "--text-only" in sys.argv
    for directory in OUT_DIRS.values():
        directory.mkdir(parents=True, exist_ok=True)
    if "--expand-current-ready" in sys.argv:
        rows = expand_current_ready_rows()
        counts = [row["article"]["word_count"] for row in rows]
        print(json.dumps({
            "scope": "retained current ready rows only",
            "rows": len(rows),
            "min_word_count": min(counts) if counts else 0,
            "max_word_count": max(counts) if counts else 0,
            "images": "unchanged",
        }, ensure_ascii=False, indent=2))
        return
    candidates = read_json(SHARED_DIR / "dreams-candidates.json")
    rows = build_rows(candidates)
    write_jsonl(OUT_DIRS["evidence"] / "dream-evidence-repaired-full-1289.jsonl", rows)
    write_jsonl(OUT_DIRS["briefs"] / "dream-briefs-repaired-full-1289.jsonl", rows)
    write_jsonl(OUT_DIRS["articles"] / "dream-articles-repaired-full-1289.jsonl", rows)
    if not text_only:
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
            "images": str(OUT_DIRS["images"] / "dream-image-queue-repaired-full-1289.jsonl") if not text_only else "unchanged_text_only_run",
        },
        "text_only": text_only,
    }
    (OUT_DIRS["qa"] / "repaired-full-production-summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
