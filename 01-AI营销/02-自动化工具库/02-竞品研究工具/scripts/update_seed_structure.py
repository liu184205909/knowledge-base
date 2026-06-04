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


# ---------------------------------------------------------------------------
# Zodiac
# ---------------------------------------------------------------------------

_CHINESE_ZODIAC = {
    "rat": "Rat", "ox": "Ox", "tiger": "Tiger", "rabbit": "Rabbit",
    "dragon": "Dragon", "snake": "Snake", "horse": "Horse",
    "goat": "Goat", "sheep": "Sheep", "monkey": "Monkey",
    "rooster": "Rooster", "dog": "Dog", "pig": "Pig",
}


def _zodiac_entity(keyword):
    text = keyword.lower()
    # Western zodiac signs
    for key, name in _ZODIAC_SIGNS.items():
        if re.search(rf"\b{key}\b", text):
            return name
    # Ophiuchus
    if "ophiuchus" in text:
        return "Ophiuchus"
    # Chinese zodiac animals
    for key, name in _CHINESE_ZODIAC.items():
        if re.search(rf"\b{key}\b", text) and ("chinese" in text or "year of" in text or "zodiac" in text):
            return f"Chinese {name}"
    if re.search(r"chinese zodiac|chinese new year|chinese year|lunar new year|year of the", text):
        return "Chinese Zodiac"
    # Horoscope
    if re.search(r"horoscope|daily.*sign|weekly.*sign|monthly.*sign", text):
        return "Horoscope"
    # Compatibility
    if re.search(r"compatib|match|couple|duo|pair|together|soulmate", text):
        return "Zodiac Compatibility"
    # Dates & Calendar
    if re.search(r"date|month|born|birthday|season|start|end|cusp", text):
        return "Zodiac Signs & Dates"
    # Elements & Modalities
    if re.search(r"element|fire sign|earth sign|air sign|water sign|cardinal|fixed|mutable", text):
        return "Zodiac Elements"
    # Entertainment / Off-topic indicators
    if re.search(r"manhwa|manga|anime|tattoo|game|app|emoji|memes|aesthetic|wallpaper|drawing|coloring|craft|diy|cake|cookie|cocktail|drink|food|nail|outfit|shirt|merch", text):
        return "Off-topic / Entertainment"
    return "Zodiac"


def _zodiac_role(keyword, subtopic):
    text = keyword.lower()
    if re.search(r"near me|reader|reading|tattoo.*artist|psychic", text):
        return "Local SEO Candidate"
    if re.search(r"tattoo|jewelry|necklace|ring|bracelet|shirt|merch|poster|sticker|cake|cookie|craft|diy|aesthetic|wallpaper", text):
        return "Product / Category Page"
    if re.search(r"manhwa|manga|anime|game|emoji|memes|coloring|nail|outfit|cocktail|drink|food|rib boat", text):
        return "Delete"
    if text.strip() in {"zodiac signs", "zodiac", "star signs", "the zodiac", "12 zodiac signs"}:
        return "Guide Index / Hub"
    # Specific sign articles
    for key in _ZODIAC_SIGNS:
        if re.search(rf"\b{key}\b", text) and re.search(r"meaning|personality|trait|character|symbol|fact", text):
            return "Main Article"
    # Compatibility articles
    if re.search(r"compatib|match|couple|duo|pair", text):
        return "Separate Article Candidate"
    # Horoscope
    if re.search(r"horoscope", text):
        return "Topic Keyword"
    # Date/Calendar queries
    if re.search(r"what month|when is|when are|what sign|dates|born|birthday|start|end", text):
        return "Main Article / Guide Section"
    # Chinese zodiac
    if re.search(r"chinese zodiac|chinese new year|year of the|lunar", text):
        return "Main Article / Guide Section"
    if subtopic in ("Zodiac Basics",):
        return "Topic Keyword"
    return "Topic Keyword"


# ---------------------------------------------------------------------------
# Numerology
# ---------------------------------------------------------------------------


def _numerology_entity(keyword):
    text = keyword.lower()
    # Life path / expression / soul urge specific numbers
    m = re.search(r"\b(life path|life-path|expression|soul urge|soul-urge|personality|birthday|birth day|destiny|maturity|balance)\s*(number\s*)?(\d{1,2})\b", text)
    if m:
        num = m.group(3)
        if num in ("11", "22", "33"):
            return f"Master Number {num}"
        return f"{m.group(1).strip().title()} Number"
    # Master numbers
    if re.search(r"\b(11|22|33)\b", text) and "numerolog" in text:
        return "Master Numbers"
    # Angel numbers (3-4 digit patterns)
    m2 = re.search(r"\b(\d{3,4})\s*(angel|meaning|numerolog)", text)
    if m2:
        return f"Angel Number {m2.group(1)}"
    m3 = re.search(r"angel\s*(?:number\s*)?(\d{3,4})", text)
    if m3:
        return f"Angel Number {m3.group(1)}"
    # Life path calculation
    if re.search(r"life path|calculate.*number|numerolog.*calculator|what.*my.*number", text):
        return "Life Path Number"
    # Repeating/sequential numbers
    m4 = re.search(r"\b(\d)\1{2,}\b", text)  # 111, 222, etc.
    if m4:
        return f"Angel Number {m4.group(0)}"
    # Single digit meanings
    m5 = re.search(r"\b(number|numeral)\s*(\d)\b", text)
    if m5:
        return f"Number {m5.group(2)} Meaning"
    # House numbers
    if re.search(r"house\s*number|address.*number", text):
        return "House Number Numerology"
    # Name numerology
    if re.search(r"name|baby.*name|business.*name", text):
        return "Name Numerology"
    # Compatibility
    if re.search(r"compatib|match|couple|relationship|love", text):
        return "Numerology Compatibility"
    if re.search(r"calculator|calculate|chart|meaning|what does", text):
        return "Numerology Calculator"
    return "Numerology"


def _numerology_role(keyword, subtopic):
    text = keyword.lower()
    if re.search(r"near me|reader|service", text):
        return "Local SEO Candidate"
    if text.strip() in {"numerology", "numerology numbers", "number meaning"}:
        return "Guide Index / Hub"
    if re.search(r"calculator|calculate|what.*my|find.*my|check.*my", text):
        return "Tool / Quiz Candidate"
    if re.search(r"life path|expression|soul urge|destiny|personality|birthday|master number", text):
        return "Main Article"
    if re.search(r"meaning|what does|what.*mean|significance", text):
        return "Main Article / Guide Section"
    if re.search(r"compatib|match|love|relationship", text):
        return "Separate Article Candidate"
    if re.search(r"house|name|baby|business|car", text):
        return "Separate Article Candidate"
    if re.search(r"angel|repeating|sequence|111|222|333|444|555|666|777|888|999", text):
        return "Topic Keyword"
    if subtopic == "Life Path & Core Numbers":
        return "Main Article"
    return "Topic Keyword"


# ---------------------------------------------------------------------------
# Meditation
# ---------------------------------------------------------------------------


def _meditation_entity(keyword):
    text = keyword.lower()
    rules = [
        (r"mindfulness|mindful", "Mindfulness Meditation"),
        (r"transcendental|tm\b", "Transcendental Meditation"),
        (r"zen\b|zazen|vipassana|samatha", "Zen / Buddhist Meditation"),
        (r"yoga.*meditation|yoga.*nidra|yoga.*medit", "Yoga Nidra"),
        (r"chakra.*meditation|chakra.*medit", "Chakra Meditation"),
        (r"guided.*meditation|guided.*medit", "Guided Meditation"),
        (r"sleep.*meditation|insomnia|meditation.*sleep", "Sleep Meditation"),
        (r"anxiety|stress|panic|worry|overwhelm", "Anxiety & Stress Relief"),
        (r"depression|sadness|grief|emotion", "Emotional Healing"),
        (r"focus|concentrat|productiv|attention", "Focus & Concentration"),
        (r"pain|chronic|healing|recovery", "Pain Management"),
        (r"meditation.*app|app.*meditation|headspace|calm|insight|waking up", "Meditation Apps"),
        (r"music|sound|frequency|binaural|solfeggio|singing bowl|tibetan bowl", "Meditation Music & Sound"),
        (r"mantra|chant|affirmation|japa", "Mantra Meditation"),
        (r"breath|breathing|pranayama", "Breathing Meditation"),
        (r"meditation.*timer|timer|clock", "Meditation Timer / Tool"),
        (r"candle|incense|essential oil|diffuser|smudge|sage|palo santo", "Meditation Accessories"),
        (r"meditation.*cushion|zafu|zabuton|mat|bench|bolster", "Meditation Equipment"),
        (r"walking|running|movement|active", "Movement Meditation"),
        (r"loving.kindness|metta|compassion|heart", "Loving-Kindness Meditation"),
        (r"visualization|creative|imagery", "Visualization Meditation"),
        (r"body\s*scan|progressive.*relax|relaxation", "Body Scan Meditation"),
        (r"spiritual|spirit|awakening|enlightenment|inner.*peace", "Spiritual Meditation"),
        (r"morning|daily|routine|habit", "Morning Meditation"),
        (r"beginner|how to|start|learn|guide", "Meditation Basics"),
        (r"meditation.*benefit|benefit.*meditation|why.*meditat|science|research|study", "Meditation Benefits"),
    ]
    for pattern, value in rules:
        if re.search(pattern, text):
            return value
    if re.search(r"meditation\b", text):
        return "Meditation"
    return "Meditation"


def _meditation_role(keyword, subtopic):
    text = keyword.lower()
    if re.search(r"near me|class|studio|retreat|center|teacher|course|workshop", text):
        return "Local SEO Candidate"
    if re.search(r"app|download|online|free|subscription|price|cost|review|best.*app|headspace|calm", text):
        return "Product / Category Page"
    if text.strip() in {"meditation", "how to meditate", "meditation guide"}:
        return "Guide Index / Hub"
    if re.search(r"calculator|quiz|test|what.*type|find.*type", text):
        return "Tool / Quiz Candidate"
    if re.search(r"how to|guide|step|begin|learn|start|technique|practice", text):
        return "Main Article"
    if re.search(r"benefit|science|research|why|effect|prove|improve|help", text):
        return "Main Article / Guide Section"
    if re.search(r"music|sound|binaural|solfeggio|frequency", text):
        return "Separate Article Candidate"
    if re.search(r"candle|incense|cushion|mat|bench|timer|accessory|equipment|tool", text):
        return "Product / Category Page"
    if subtopic in ("Meditation Tools",):
        return "Product / Category Page"
    if subtopic == "Guided Meditation & Music":
        return "Separate Article Candidate"
    if subtopic == "Meditation Techniques":
        return "Separate Article Candidate"
    return "Topic Keyword"


# ---------------------------------------------------------------------------
# Moon Phases
# ---------------------------------------------------------------------------


def _moon_phases_entity(keyword):
    text = keyword.lower()
    # Specific moon phases
    if re.search(r"new moon|dark moon|black moon", text):
        return "New Moon"
    if re.search(r"waxing crescent", text):
        return "Waxing Crescent"
    if re.search(r"first quarter|half moon", text):
        return "First Quarter"
    if re.search(r"waxing gibbous", text):
        return "Waxing Gibbous"
    if re.search(r"full moon\b|full.moon|supermoon|blood moon|blue moon|harvest moon|worm moon|snow moon|pink moon|flower moon|strawberry moon|buck moon|sturgeon moon|corn moon|harvest moon|hunter moon|beaver moon|cold moon|wolf moon", text):
        return "Full Moon"
    if re.search(r"waning gibbous", text):
        return "Waning Gibbous"
    if re.search(r"last quarter|third quarter", text):
        return "Last Quarter"
    if re.search(r"waning crescent", text):
        return "Waning Crescent"
    # Calendar / scheduling
    if re.search(r"calendar|schedule|tonight|today|this month|next moon|moon cycle|lunar cycle|lunar calendar", text):
        return "Moon Phase Calendar"
    # Rituals / manifestation
    if re.search(r"ritual|manifest|intention|spell|ceremony|wish|pray|charge|crystal.*moon", text):
        return "Moon Ritual & Manifestation"
    # Fishing / gardening (practical uses)
    if re.search(r"fishing|garden|plant|seed|harvest|farmer|almanac", text):
        return "Practical Moon Lore"
    # General
    if re.search(r"moon phase|phase.*moon|phases.*moon|lunar phase", text):
        return "Moon Phases"
    if re.search(r"moon", text):
        return "Moon"
    return "Moon Phases"


def _moon_phases_role(keyword, subtopic):
    text = keyword.lower()
    if re.search(r"near me|event|workshop|retreat|class", text):
        return "Local SEO Candidate"
    if text.strip() in {"moon phases", "phases of the moon", "lunar phases", "moon cycle", "8 moon phases"}:
        return "Guide Index / Hub"
    if re.search(r"calendar|schedule|tonight|today|this month|next full|upcoming|when is|date|time", text):
        return "Tool / Quiz Candidate"
    if re.search(r"meaning|significance|what does|symbolism|spiritual", text):
        return "Main Article / Guide Section"
    if re.search(r"how to|guide|ritual|manifest|intention|ceremony|charge", text):
        return "Separate Article Candidate"
    if re.search(r"fishing|garden|plant|seed|harvest|hair|cut", text):
        return "Separate Article Candidate"
    if re.search(r"full moon|new moon", text):
        return "Main Article"
    if subtopic == "Full Moon":
        return "Main Article"
    if subtopic == "New Moon":
        return "Main Article"
    if subtopic == "Moon Phase Calendar":
        return "Topic Keyword"
    return "Topic Keyword"


# ---------------------------------------------------------------------------
# Spirituality
# ---------------------------------------------------------------------------


def _spirituality_entity(keyword):
    text = keyword.lower()
    rules = [
        (r"meditation|mindfulness|yoga|breath", "Meditation & Mindfulness"),
        (r"crystal|gem|stone|healing stone", "Crystals & Spirituality"),
        (r"angel|guardian.*angel|archangel", "Angels & Spirit Guides"),
        (r"tarot|oracle|card.*reading", "Tarot & Divination"),
        (r"numerolog|life path|number.*meaning", "Numerology & Spirituality"),
        (r"astrolog|zodiac|horoscope|birth.*chart", "Astrology & Spirituality"),
        (r"chakra|aura|energy.*heal|reiki|pranic", "Energy Healing"),
        (r"feng shui|vastu|space.*cleans", "Sacred Space"),
        (r"prayer|chant|mantra|affirmation", "Prayer & Mantra"),
        (r"mind.*body.*spirit|holistic|wholeness", "Mind-Body-Spirit"),
        (r"awakening|enlightenment|kundalini|third eye|ascension", "Spiritual Awakening"),
        (r"past life|regression|reincarn|karma|soul.*contract", "Past Lives & Karma"),
        (r"sacred.*geometry|flower.*of.*life|metatron|mandala", "Sacred Geometry"),
        (r"smudge|sage|palo santo|cleans|purif|incense", "Spiritual Cleansing"),
        (r"gratitude|thankful|blessing|abundance mindset", "Gratitude & Blessings"),
        (r"law.*attract|manifest|visuali|intention|affirm", "Law of Attraction"),
        (r"spirit.*animal|totem|power.*animal|animal.*spirit", "Spirit Animals"),
        (r"synchronicity|coincidence|sign.*from.*universe|11:11|angel.*number", "Signs & Synchronicity"),
        (r"intuition|psychic|clair|empath|medium|sixth.*sense", "Intuition & Psychic"),
        (r"shadow.*work|inner.*child|journal|self.*reflect", "Shadow Work"),
        (r"solstic|equinox|sabbat|wheel.*year|pagan|wicca|wiccan", "Seasonal & Pagan Spirituality"),
        (r"bible|christian|muslim|islam|buddh|hindu|sufi|jewish|taoist|zen|monk|nun|monastery|temple|church|mosque", "Organized Religion"),
    ]
    for pattern, value in rules:
        if re.search(pattern, text):
            return value
    if re.search(r"meaning|spiritual.*meaning|what.*mean", text):
        return "Spiritual Meaning"
    if re.search(r"spirit", text):
        return "Spirituality"
    return "Spirituality"


def _spirituality_role(keyword, subtopic):
    text = keyword.lower()
    if re.search(r"near me|church|temple|mosque|center|retreat|teacher|guru|class|workshop", text):
        return "Local SEO Candidate"
    if re.search(r"shop|buy|store|price|best|review|amazon|etsy|book|course|program|app", text):
        return "Product / Category Page"
    if text.strip() in {"spirituality", "spiritual", "what is spirituality"}:
        return "Guide Index / Hub"
    if re.search(r"how to|guide|learn|start|begin|practice|way.*to", text):
        return "Main Article"
    if re.search(r"meaning|significance|what does|symbolism", text):
        return "Main Article / Guide Section"
    if re.search(r"awakening|enlightenment|kundalini|third eye", text):
        return "Main Article"
    if re.search(r"prayer|chant|ritual|ceremony|cleans|sage|smudge", text):
        return "Separate Article Candidate"
    if re.search(r"angel|tarot|numerolog|astrolog|crystal", text):
        return "Topic Keyword"
    if re.search(r"bible|christian|muslim|hindu|buddh|jewish|taoist|sufi|pagan|wicca", text):
        return "Separate Article Candidate"
    if subtopic == "Spiritual Practice":
        return "Topic Keyword"
    if subtopic == "Spiritual Meaning":
        return "Main Article / Guide Section"
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
    "zodiac": {
        "sheet_name": "Seed-Zodiac",
        "sheet_id": 66189221,
        "entity_fn": _zodiac_entity,
        "role_fn": _zodiac_role,
    },
    "numerology": {
        "sheet_name": "Seed-Numerology",
        "sheet_id": 258720785,
        "entity_fn": _numerology_entity,
        "role_fn": _numerology_role,
    },
    "meditation": {
        "sheet_name": "Seed-Meditation",
        "sheet_id": 1750161576,
        "entity_fn": _meditation_entity,
        "role_fn": _meditation_role,
    },
    "moon-phases": {
        "sheet_name": "Seed-Moon-Phases",
        "sheet_id": 1845236016,
        "entity_fn": _moon_phases_entity,
        "role_fn": _moon_phases_role,
    },
    "spirituality": {
        "sheet_name": "Seed-Spirituality",
        "sheet_id": 2074692649,
        "entity_fn": _spirituality_entity,
        "role_fn": _spirituality_role,
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
