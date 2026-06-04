"""
Update Seed-* sheets with Entity and Content Role columns.

Usage:
    python update_seed_structure.py --topic chakra
    python update_seed_structure.py --topic feng-shui
    python update_seed_structure.py --topic angel-numbers
    python update_seed_structure.py --topic palmistry
    python update_seed_structure.py --topic tarot
    python update_seed_structure.py --topic astrology
    python update_seed_structure.py --all

Adds/fills Entity and Content Role based on topic-specific regex rules.
Idempotent: if columns already exist, only refreshes values.
"""

import argparse
import re
import urllib.parse

from build_seed_master_v1 import SPREADSHEET_ID, get_access_token, request_json


# ---------------------------------------------------------------------------
# Topic configs: (sheet_name, sheet_id, entity_rules, content_role_fn)
# ---------------------------------------------------------------------------

def _chakra_entity(keyword):
    text = keyword.lower()
    rules = [
        (r"third eye|3rd eye|ajna|brow", "Third Eye Chakra"),
        (r"root|muladhara|mooladhara|base chakra", "Root Chakra"),
        (r"sacral|svadhisthana|swadhisthana", "Sacral Chakra"),
        (r"solar plexus|manipura", "Solar Plexus Chakra"),
        (r"heart|anahata", "Heart Chakra"),
        (r"throat|vishuddha", "Throat Chakra"),
        (r"crown|sahasrara", "Crown Chakra"),
        (r"7 chakra|seven chakra|all chakra", "Seven Chakras"),
        (r"color|colour", "Chakra Colors"),
        (r"symbol|chart", "Chakra Symbols / Chart"),
        (r"stone|crystal|gem|bracelet|necklace|bead|wand", "Chakra Crystals & Jewelry"),
        (r"meditation", "Chakra Meditation"),
        (r"yoga|pose|asana", "Chakra Yoga"),
        (r"healing|balance|cleansing|align|unblock|open", "Chakra Healing"),
        (r"frequency|sound|music|note", "Chakra Sound / Frequency"),
        (r"affirmation|mantra|mudra", "Chakra Practice"),
    ]
    for pattern, value in rules:
        if re.search(pattern, text):
            return value
    return "Chakra"


def _chakra_role(keyword, subtopic):
    text = keyword.lower()
    if re.search(r"near me|shop|buy|bracelet|necklace|stone|crystal|gem|bead|wand", text):
        return "Product / Category Page"
    if re.search(r"^chakras?$|^7 chakras?$|^seven chakras$|^the 7 chakras$", text):
        return "Guide Index / Hub"
    if subtopic == "Specific Chakra" and not re.search(
        r"meaning|color|frequency|blocked|healing|meditation|affirmation|yoga|crystal|stone|open|unblock|balance|pose|mudra|mantra",
        text,
    ):
        return "Main Article"
    if re.search(r"meaning|definition|what is|what are|explained|color|symbol|chart", text):
        return "Main Article / Guide Section"
    if re.search(r"how to|unblock|open|balance|heal|healing|meditation|yoga|affirmation|frequency|mantra|mudra|pose|cleansing|align", text):
        return "Separate Article Candidate"
    if subtopic == "Chakra Healing & Practice":
        return "Separate Article Candidate"
    if subtopic == "Chakra Crystals & Jewelry":
        return "Product / Category Page"
    return "Topic Keyword"


def _feng_shui_entity(keyword):
    text = keyword.lower()
    rules = [
        (r"bagua|ba gua", "Bagua"),
        (r"wealth|money|prosperity|abundance", "Wealth Feng Shui"),
        (r"bedroom|bed\b|sleep", "Bedroom Feng Shui"),
        (r"mirror", "Mirror Feng Shui"),
        (r"front door|entry|entrance", "Front Door Feng Shui"),
        (r"kitchen", "Kitchen Feng Shui"),
        (r"office|desk|work", "Office Feng Shui"),
        (r"living room", "Living Room Feng Shui"),
        (r"bathroom", "Bathroom Feng Shui"),
        (r"plant|money tree|bamboo", "Feng Shui Plants"),
        (r"color|colour", "Feng Shui Colors"),
        (r"crystal|stone|gem", "Feng Shui Crystals"),
        (r"compass|direction|north|south|east|west", "Feng Shui Directions"),
        (r"house|home|apartment|room", "Home Feng Shui"),
        (r"dragon|turtle|frog|pixiu|pi xiu|laughing buddha", "Feng Shui Symbol"),
        (r"career|love|relationship|health", "Life Area Feng Shui"),
    ]
    for pattern, value in rules:
        if re.search(pattern, text):
            return value
    return "Feng Shui"


def _feng_shui_role(keyword, subtopic):
    text = keyword.lower()
    if re.search(r"near me|shop|buy|for sale|store", text):
        return "Local SEO Candidate"
    if re.search(r"^feng shui$|feng shui meaning|what is feng shui|feng shui basics", text):
        return "Guide Index / Hub"
    if re.search(r"bedroom|kitchen|office|front door|living room|bathroom|home|house|room|apartment", text):
        return "Main Article"
    if re.search(r"wealth|money|love|career|health|prosperity|abundance", text):
        return "Main Article / Guide Section"
    if re.search(r"plant|money tree|bamboo|crystal|mirror|color|colour|symbol|dragon|frog|pixiu|turtle", text):
        return "Separate Article Candidate"
    if re.search(r"how to|tips|rules|layout|placement|cure", text):
        return "Separate Article Candidate"
    if subtopic:
        return "Topic Keyword"
    return "Review"


def _angel_numbers_entity(keyword):
    text = keyword.lower()
    spaced = re.search(r"\b(\d{1,4})\s+(\d{1,4})\b", text)
    if spaced:
        return f"Angel Number {spaced.group(1)}:{spaced.group(2)}"
    match = re.search(r"\b\d{2,4}\b", text)
    if match:
        return f"Angel Number {match.group(0)}"
    if "biblical" in text:
        return "Biblical Angel Numbers"
    if "my angel" in text or "personal" in text:
        return "Personal Angel Number"
    if "meaning" in text:
        return "Angel Number Meanings"
    return "Angel Numbers"


def _angel_numbers_role(keyword, subtopic):
    text = keyword.lower()
    if re.search(r"\b\d{2,4}\b", text):
        return "Main Article"
    if "my angel" in text or "calculator" in text or "personal" in text:
        return "Tool / Quiz Candidate"
    if keyword.strip().lower() in {"angel numbers", "angel number"}:
        return "Guide Index / Hub"
    if "meaning" in text or subtopic == "Angel Number Meaning":
        return "Main Article / Guide Section"
    if text.startswith("what ") or text.startswith("are ") or "biblical" in text:
        return "Guide Section / FAQ"
    return "Topic Keyword"


def _palmistry_entity(keyword):
    text = keyword.lower()
    rules = [
        (r"life line", "Life Line"),
        (r"heart line", "Heart Line"),
        (r"head line", "Head Line"),
        (r"fate line", "Fate Line"),
        (r"marriage line|relationship line|love line", "Marriage / Relationship Line"),
        (r"sun line|apollo line", "Sun / Apollo Line"),
        (r"health line", "Health Line"),
        (r"money line|wealth line", "Money Line"),
        (r"mount of|mounts", "Palm Mounts"),
        (r"hand shape|finger|thumb", "Hand Shape"),
        (r"left hand|right hand|dominant hand", "Reading Hand"),
        (r"palm reading|palmistry reading|read palms", "Palm Reading"),
        (r"palmistry chart|hand chart|palm chart", "Palmistry Chart"),
    ]
    for pattern, value in rules:
        if re.search(pattern, text):
            return value
    return "Palmistry"


def _palmistry_role(keyword, subtopic):
    text = keyword.lower()
    if re.search(r"near me|reader|reading|service|appointment", text):
        return "Local SEO Candidate"
    if re.search(r"^palmistry$|^palm reading$|what is palmistry|palmistry meaning", text):
        return "Guide Index / Hub"
    if re.search(r"life line|heart line|head line|fate line|marriage line|sun line|health line|money line", text):
        return "Main Article"
    if re.search(r"how to|learn|guide|chart|meaning|explained", text):
        return "Main Article / Guide Section"
    if re.search(r"mount|hand shape|finger|thumb|left hand|right hand", text):
        return "Separate Article Candidate"
    if subtopic:
        return "Topic Keyword"
    return "Review"


# --- Tarot ---

_TAROT_MAJOR_ARCANA = {
    "fool": "The Fool", "magician": "The Magician", "high priestess": "The High Priestess",
    "empress": "The Empress", "emperor": "The Emperor", "hierophant": "The Hierophant",
    "lovers": "The Lovers", "chariot": "The Chariot", "strength": "Strength",
    "hermit": "The Hermit", "wheel of fortune": "Wheel of Fortune", "justice": "Justice",
    "hanged man": "The Hanged Man", "death": "Death", "temperance": "Temperance",
    "devil": "The Devil", "tower": "The Tower", "star": "The Star",
    "moon": "The Moon", "sun": "The Sun", "judgement": "Judgement", "world": "The World",
}

_TAROT_SUIT_MAP = {
    "wands": "Suit of Wands", "cups": "Suit of Cups",
    "swords": "Suit of Swords", "pentacles": "Suit of Pentacles",
    "coins": "Suit of Pentacles",
}

_TAROT_COURT = {
    "page of": "Court Cards", "knight of": "Court Cards",
    "queen of": "Court Cards", "king of": "Court Cards",
}


def _tarot_entity(keyword):
    text = keyword.lower()
    # Major Arcana cards
    for key, name in _TAROT_MAJOR_ARCANA.items():
        if key in text:
            return name
    # Suits (Minor Arcana)
    for key, name in _TAROT_SUIT_MAP.items():
        if key in text:
            return name
    # Court cards
    for key, name in _TAROT_COURT.items():
        if key in text:
            return name
    # Numbered Minor Arcana (ace-10 of ...)
    if re.search(r"\b(ace|two|three|four|five|six|seven|eight|nine|ten)\s+of\b", text):
        return "Numbered Minor Arcana"
    if re.search(r"\b\d+\s+of\s+(wands|cups|swords|pentacles|coins)\b", text):
        return "Numbered Minor Arcana"
    # Specific concepts
    rules = [
        (r"major arcana", "Major Arcana"),
        (r"minor arcana", "Minor Arcana"),
        (r"spread|layout|pull|draw|position", "Tarot Spreads"),
        (r"yes.{0,5}no|yes or no|yes no", "Yes/No Tarot"),
        (r"love|relationship|soulmate|ex\b|breakup|crush|dating|marriage|couple", "Love Tarot"),
        (r"career|job|work|money|finance|business", "Career / Money Tarot"),
        (r"health|wellness|healing", "Health Tarot"),
        (r"deck|cards?\s*(?:list|set|collection)", "Tarot Cards & Decks"),
        (r"rider.?waite|rw\b|rws\b|thoth|marseille", "Tarot Deck Tradition"),
        (r"read|reader|reading|interpret", "Tarot Reading"),
        (r"meaning|symbol|symbolis|interpret", "Tarot Meaning"),
        (r"learn|study|guide|beginner|how to|course", "Tarot Learning"),
        (r"free|online|app", "Free / Online Tarot"),
        (r"revers|upright|inverse", "Tarot Reversals"),
        (r"combination|combo|pair|together", "Tarot Combinations"),
        (r"element|elemental|fire|water|air|earth", "Tarot Elements"),
        (r"numerolog|number", "Tarot Numerology"),
        (r"astrolog|zodiac|sign|planet", "Tarot & Astrology"),
        (r"horoscope", "Horoscope"),
        (r"biddy|lotus|labyrinthos|gal\s*tarot|keeno", "Tarot Brand / Platform"),
    ]
    for pattern, value in rules:
        if re.search(pattern, text):
            return value
    return "Tarot"


def _tarot_role(keyword, subtopic):
    text = keyword.lower()
    if re.search(r"near me|shop|buy|for sale|store|price|cheap|best.*deck", text):
        return "Product / Category Page"
    if re.search(r"free.*read|online.*tarot|tarot.*app|tarot.*game", text):
        return "Tool / Quiz Candidate"
    if text.strip() in {"tarot", "tarot cards", "tarot card", "tarot reading"}:
        return "Guide Index / Hub"
    # Major Arcana specific card
    for key in _TAROT_MAJOR_ARCANA:
        if key in text and not re.search(r"combination|combo|together|pair", text):
            return "Main Article"
    # Specific suit card
    for key in _TAROT_SUIT_MAP:
        if key in text:
            return "Main Article"
    for key in _TAROT_COURT:
        if key in text:
            return "Main Article"
    if re.search(r"meaning|symbol|interpret|what.*mean|definition", text):
        return "Main Article / Guide Section"
    if re.search(r"spread|layout|how to read|learn|guide|beginner|tutorial", text):
        return "Separate Article Candidate"
    if re.search(r"yes.{0,5}no", text):
        return "Separate Article Candidate"
    if re.search(r"love|relationship|career|money|health", text):
        return "Separate Article Candidate"
    if subtopic and subtopic != "Tarot Basics":
        return "Topic Keyword"
    return "Topic Keyword"


# --- Astrology ---

_ZODIAC_SIGNS = {
    "aries": "Aries", "taurus": "Taurus", "gemini": "Gemini", "cancer": "Cancer",
    "leo": "Leo", "virgo": "Virgo", "libra": "Libra", "scorpio": "Scorpio",
    "sagittarius": "Sagittarius", "capricorn": "Capricorn", "aquarius": "Aquarius", "pisces": "Pisces",
}


def _astrology_entity(keyword):
    text = keyword.lower()
    for key, name in _ZODIAC_SIGNS.items():
        if re.search(rf"\b{key}\b", text):
            return name
    if re.search(r"chinese zodiac|chinese astrology|year of the|rat\b|ox\b|tiger\b|rabbit\b|dragon\b|snake\b|horse\b|goat\b|sheep\b|monkey\b|rooster\b|dog\b|pig\b", text):
        return "Chinese Zodiac"
    if re.search(r"\b\d{1,2}(?:st|nd|rd|th)?\s+house", text):
        return "Astrology Houses"
    if re.search(r"house", text):
        return "Astrology Houses"
    planet_rules = [
        (r"moon\b", "Moon in Astrology"),
        (r"mercury\b", "Mercury"), (r"venus\b", "Venus"), (r"mars\b", "Mars"),
        (r"jupiter\b", "Jupiter"), (r"saturn\b", "Saturn"), (r"uranus\b", "Uranus"),
        (r"neptune\b", "Neptune"), (r"pluto\b", "Pluto"),
        (r"rising\b|ascendant", "Rising Sign / Ascendant"),
        (r"midheaven|mc\b", "Midheaven"),
    ]
    for pattern, value in planet_rules:
        if re.search(pattern, text):
            return value
    if re.search(r"conjunct|opposition|trine|square|sextile|quincunx|aspect", text):
        return "Astrology Aspects"
    rules = [
        (r"birth\s*chart|natal\s*chart", "Birth / Natal Chart"),
        (r"horoscope", "Horoscope"),
        (r"compatib|match|couple|love|relationship", "Zodiac Compatibility"),
        (r"retrograd|retro", "Retrograde"),
        (r"eclipse", "Eclipse"),
        (r"transit", "Astrology Transits"),
        (r"progress", "Progressed Chart"),
        (r"synastr", "Synastry"),
        (r"solar\s*return", "Solar Return"),
        (r"moon\s*phase|new\s*moon|full\s*moon", "Moon Phases"),
        (r"mercury\s*retrograde", "Mercury Retrograde"),
        (r"element|fire\s*sign|earth\s*sign|air\s*sign|water\s*sign", "Zodiac Elements"),
        (r"modality|cardinal|fixed|mutable", "Zodiac Modalities"),
        (r"north\s*node|south\s*node", "Lunar Nodes"),
        (r"chiron", "Chiron"),
        (r"tarot", "Tarot & Astrology"),
        (r"numerolog", "Numerology & Astrology"),
        (r"crystal|gem|stone", "Crystals & Astrology"),
    ]
    for pattern, value in rules:
        if re.search(pattern, text):
            return value
    return "Astrology"


def _astrology_role(keyword, subtopic):
    text = keyword.lower()
    if re.search(r"near me|shop|buy|store|for sale", text):
        return "Local SEO Candidate"
    if re.search(r"free.*horoscope|online.*chart|calculator|quiz|test", text):
        return "Tool / Quiz Candidate"
    if text.strip() in {"astrology", "zodiac signs", "horoscope", "zodiac"}:
        return "Guide Index / Hub"
    for key in _ZODIAC_SIGNS:
        if re.search(rf"\b{key}\b", text) and not re.search(r"compatib|match|couple", text):
            if re.search(r"meaning|personality|trait|character", text):
                return "Main Article"
            if re.search(r"love|career|money|health", text):
                return "Separate Article Candidate"
            return "Main Article"
    if re.search(r"birth\s*chart|natal\s*chart|how to read", text):
        return "Main Article / Guide Section"
    if re.search(r"compatib|match|love.*sign", text):
        return "Separate Article Candidate"
    if re.search(r"retrograde|eclipse|transit", text):
        return "Separate Article Candidate"
    if re.search(r"house\b|planet|aspect|element|modality", text):
        return "Main Article / Guide Section"
    if re.search(r"horoscope", text):
        return "Topic Keyword"
    if subtopic and subtopic not in ("Astrology Basics", "Horoscope"):
        return "Topic Keyword"
    return "Topic Keyword"


TOPICS = {
    "chakra": {
        "sheet_name": "Seed-Chakra",
        "sheet_id": 56384262,
        "entity_fn": _chakra_entity,
        "role_fn": _chakra_role,
    },
    "feng-shui": {
        "sheet_name": "Seed-Feng-Shui",
        "sheet_id": 874966104,
        "entity_fn": _feng_shui_entity,
        "role_fn": _feng_shui_role,
    },
    "angel-numbers": {
        "sheet_name": "Seed-Angel-Numbers",
        "sheet_id": 1745476761,
        "entity_fn": _angel_numbers_entity,
        "role_fn": _angel_numbers_role,
    },
    "palmistry": {
        "sheet_name": "Seed-Palmistry",
        "sheet_id": 48805297,
        "entity_fn": _palmistry_entity,
        "role_fn": _palmistry_role,
    },
    "tarot": {
        "sheet_name": "Seed-Tarot",
        "sheet_id": 738830481,
        "entity_fn": _tarot_entity,
        "role_fn": _tarot_role,
    },
    "astrology": {
        "sheet_name": "Seed-Astrology",
        "sheet_id": 95613431,
        "entity_fn": _astrology_entity,
        "role_fn": _astrology_role,
    },
}


# ---------------------------------------------------------------------------
# Sheets API helpers
# ---------------------------------------------------------------------------

def read_values(token, sheet_name, range_a1):
    enc_sheet = urllib.parse.quote(sheet_name)
    enc_range = urllib.parse.quote(range_a1)
    path = f"/v4/spreadsheets/{SPREADSHEET_ID}/values/{enc_sheet}!{enc_range}"
    return request_json("GET", "sheets.googleapis.com", path, token).get("values", [])


def update_values(token, sheet_name, range_a1, values):
    enc_range = urllib.parse.quote(f"{sheet_name}!{range_a1}")
    path = f"/v4/spreadsheets/{SPREADSHEET_ID}/values/{enc_range}?valueInputOption=RAW"
    request_json("PUT", "sheets.googleapis.com", path, token, body={"values": values})


def batch_update(token, requests):
    path = f"/v4/spreadsheets/{SPREADSHEET_ID}:batchUpdate"
    request_json("POST", "sheets.googleapis.com", path, token, body={"requests": requests})


def row_value(row, idx):
    return row[idx].strip() if len(row) > idx and row[idx] else ""


# ---------------------------------------------------------------------------
# Core logic
# ---------------------------------------------------------------------------

def ensure_structure(token, sheet_name, sheet_id):
    """Insert Entity/Subtopic/Content Role columns if missing."""
    header = read_values(token, sheet_name, "A1:N1")[0]
    if "Entity" in header and "Content Role" in header:
        return header

    batch_update(
        token,
        [
            {
                "insertDimension": {
                    "range": {
                        "sheetId": sheet_id,
                        "dimension": "COLUMNS",
                        "startIndex": 2,
                        "endIndex": 3,
                    },
                    "inheritFromBefore": True,
                }
            },
            {
                "insertDimension": {
                    "range": {
                        "sheetId": sheet_id,
                        "dimension": "COLUMNS",
                        "startIndex": 4,
                        "endIndex": 5,
                    },
                    "inheritFromBefore": True,
                }
            },
            {
                "updateCells": {
                    "range": {
                        "sheetId": sheet_id,
                        "startRowIndex": 0,
                        "endRowIndex": 1,
                        "startColumnIndex": 2,
                        "endColumnIndex": 5,
                    },
                    "rows": [
                        {
                            "values": [
                                {"userEnteredValue": {"stringValue": "Entity"}},
                                {"userEnteredValue": {"stringValue": "Subtopic"}},
                                {"userEnteredValue": {"stringValue": "Content Role"}},
                            ]
                        }
                    ],
                    "fields": "userEnteredValue",
                }
            },
            {
                "updateSheetProperties": {
                    "properties": {
                        "sheetId": sheet_id,
                        "gridProperties": {"frozenRowCount": 1},
                    },
                    "fields": "gridProperties.frozenRowCount",
                }
            },
        ],
    )
    return read_values(token, sheet_name, "A1:N1")[0]


def update_topic(token, topic_key):
    """Process a single Seed-* topic."""
    cfg = TOPICS[topic_key]
    sheet_name = cfg["sheet_name"]
    sheet_id = cfg["sheet_id"]
    entity_fn = cfg["entity_fn"]
    role_fn = cfg["role_fn"]

    ensure_structure(token, sheet_name, sheet_id)
    header = read_values(token, sheet_name, "A1:N1")[0]
    indexes = {name: header.index(name) for name in header}
    rows = read_values(token, sheet_name, "A2:N")

    output = []
    for row in rows:
        keyword = row_value(row, indexes["Keyword"])
        subtopic = row_value(row, indexes["Subtopic"])
        if not keyword:
            output.append(["", ""])
        else:
            output.append([entity_fn(keyword), role_fn(keyword, subtopic)])

    if output:
        update_values(token, sheet_name, f"C2:C{len(output) + 1}", [[r[0]] for r in output])
        update_values(token, sheet_name, f"E2:E{len(output) + 1}", [[r[1]] for r in output])
    print(f"Updated {sheet_name}: {len(output)} rows")


def main():
    parser = argparse.ArgumentParser(description="Update Seed-* Entity and Content Role columns")
    parser.add_argument("--topic", choices=list(TOPICS.keys()), help="Topic to process")
    parser.add_argument("--all", action="store_true", help="Process all registered topics")
    args = parser.parse_args()

    if not args.topic and not args.all:
        parser.error("Specify --topic <name> or --all")

    token = get_access_token()
    topics = list(TOPICS.keys()) if args.all else [args.topic]
    for topic in topics:
        update_topic(token, topic)


if __name__ == "__main__":
    main()
