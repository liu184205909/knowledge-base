#!/usr/bin/env python3
"""AI batch classification for any Seed-* sheet: Subtopic + Entity.

Usage:
    python ai_classify_seed.py --topic angel-numbers
    python ai_classify_seed.py --topic feng-shui
    python ai_classify_seed.py --topic astrology

Workflow:
1. AI defines categories based on data sample
2. AI batch classifies all keywords -> Subtopic + Entity
3. Regex correction for known patterns
4. Write back to sheet (C=Entity, D=Subtopic)
"""
import argparse, json, os, re, subprocess, tempfile, time, urllib.parse
from collections import Counter

SPREADSHEET_ID = "1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc"
CREDENTIALS_FILE = os.path.expanduser("~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json")
CLAUDE_SETTINGS_FILE = os.path.expanduser("~/.claude/settings.json")
PROXY = "http://127.0.0.1:10808"
BATCH_SIZE = 50

TOPICS = {
    "angel-numbers": {
        "sheet_name": "Seed-Angel-Numbers",
        "label": "Angel Numbers",
        "label_cn": "天使数字",
        "fallback_subtopic": "Angel Numbers Basics",
        "fallback_entity": "Angel Numbers",
    },
    "feng-shui": {
        "sheet_name": "Seed-Feng-Shui",
        "label": "Feng Shui",
        "label_cn": "风水",
        "fallback_subtopic": "Feng Shui Basics",
        "fallback_entity": "Feng Shui",
    },
    "astrology": {
        "sheet_name": "Seed-Astrology",
        "label": "Astrology",
        "label_cn": "占星术",
        "fallback_subtopic": "Astrology Basics",
        "fallback_entity": "Astrology",
    },
    "tarot": {
        "sheet_name": "Seed-Tarot",
        "label": "Tarot",
        "label_cn": "塔罗牌",
        "fallback_subtopic": "Tarot Basics",
        "fallback_entity": "Tarot",
    },
    "zodiac": {
        "sheet_name": "Seed-Zodiac",
        "label": "Zodiac",
        "label_cn": "星座",
        "fallback_subtopic": "Zodiac Basics",
        "fallback_entity": "Zodiac",
        "entity_only": True,
    },
    "numerology": {
        "sheet_name": "Seed-Numerology",
        "label": "Numerology",
        "label_cn": "数字命理学",
        "fallback_subtopic": "Numerology Basics",
        "fallback_entity": "Numerology",
        "entity_only": True,
    },
    "meditation": {
        "sheet_name": "Seed-Meditation",
        "label": "Meditation",
        "label_cn": "冥想",
        "fallback_subtopic": "Meditation Basics",
        "fallback_entity": "Meditation",
        "entity_only": True,
    },
    "moon-phases": {
        "sheet_name": "Seed-Moon-Phases",
        "label": "Moon Phases",
        "label_cn": "月相",
        "fallback_subtopic": "Moon Phases Basics",
        "fallback_entity": "Moon Phases",
        "entity_only": True,
    },
    "spirituality": {
        "sheet_name": "Seed-Spirituality",
        "label": "Spirituality",
        "label_cn": "灵性",
        "fallback_subtopic": "Spiritual Practice",
        "fallback_entity": "Spirituality",
        "entity_only": True,
    },
}

# ── Google Sheets API ────────────────────────────────────────────────────────

def get_token():
    with open(CREDENTIALS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)["token"]

def refresh_access_token():
    """Use refresh_token to get a new access_token, update credentials file."""
    with open(CREDENTIALS_FILE, "r", encoding="utf-8") as f:
        cred = json.load(f)
    data = json.dumps({
        "client_id": cred["client_id"],
        "client_secret": cred["client_secret"],
        "refresh_token": cred["refresh_token"],
        "grant_type": "refresh_token",
    }).encode("utf-8")
    tmp = tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False, encoding="utf-8")
    tmp.write(data)
    tmp.close()
    r = subprocess.run(["curl", "-s", "--proxy", PROXY,
        "https://oauth2.googleapis.com/token", "-X", "POST",
        "-H", "Content-Type: application/json",
        "-d", f"@{tmp.name}"], capture_output=True, timeout=30)
    os.unlink(tmp.name)
    resp = json.loads(r.stdout.decode("utf-8")) if r.stdout else {}
    if "access_token" in resp:
        cred["token"] = resp["access_token"]
        if "refresh_token" in resp:
            cred["refresh_token"] = resp["refresh_token"]
        cred["expiry"] = resp.get("expires_in", 3600)
        with open(CREDENTIALS_FILE, "w", encoding="utf-8") as f:
            json.dump(cred, f, indent=2)
        print("[Token refreshed for long-running tasks]")
    else:
        print(f"[WARN] Token refresh failed: {resp.get('error', 'unknown')}")
    return cred["token"]

def sheets_get(sheet_name, range_a1):
    t = get_token()
    enc = urllib.parse.quote(f"{sheet_name}!{range_a1}")
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{enc}"
    r = subprocess.run(["curl", "-s", "--proxy", PROXY, url, "-H", f"Authorization: Bearer {t}"],
                       capture_output=True, timeout=30)
    return json.loads(r.stdout.decode("utf-8")) if r.stdout else {}

def sheets_write(sheet_name, range_a1, values):
    t = get_token()
    enc = urllib.parse.quote(f"{sheet_name}!{range_a1}")
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{enc}?valueInputOption=USER_ENTERED"
    body = {"range": f"{sheet_name}!{range_a1}", "values": values}
    body_str = json.dumps(body, ensure_ascii=False)
    tmp = tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False, encoding="utf-8")
    tmp.write(body_str)
    tmp.close()
    cmd = ["curl", "-s", "--proxy", PROXY, "-X", "PUT", url,
           "-H", f"Authorization: Bearer {t}", "-H", "Content-Type: application/json",
           "-d", f"@{tmp.name}"]
    r = subprocess.run(cmd, capture_output=True, timeout=60)
    os.unlink(tmp.name)
    return json.loads(r.stdout.decode("utf-8")) if r.stdout else {}

# ── LLM API ──────────────────────────────────────────────────────────────────

def _get_llm_config():
    with open(CLAUDE_SETTINGS_FILE, "r", encoding="utf-8") as f:
        settings = json.load(f)
    env = settings.get("env", {})
    return {
        "api_key": env.get("ANTHROPIC_AUTH_TOKEN", ""),
        "base_url": env.get("ANTHROPIC_BASE_URL", "https://open.bigmodel.cn/api/anthropic").rstrip("/"),
        "model": env.get("ANTHROPIC_DEFAULT_SONNET_MODEL", "glm-5.1"),
    }

def llm_call(system_prompt, user_msg):
    config = _get_llm_config()
    body = {
        "model": config["model"],
        "max_tokens": 4096,
        "system": system_prompt,
        "messages": [{"role": "user", "content": user_msg}],
    }
    body_str = json.dumps(body, ensure_ascii=False)
    tmp = tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False, encoding="utf-8")
    tmp.write(body_str)
    tmp.close()
    cmd = ["curl", "-s", "--proxy", PROXY, f"{config['base_url']}/v1/messages",
           "-H", f"x-api-key: {config['api_key']}",
           "-H", "anthropic-version: 2023-06-01",
           "-H", "Content-Type: application/json",
           "-d", f"@{tmp.name}"]
    r = subprocess.run(cmd, capture_output=True, timeout=120)
    os.unlink(tmp.name)
    resp = json.loads(r.stdout.decode("utf-8")) if r.stdout else {}
    content = resp.get("content", [])
    for block in content:
        if block.get("type") == "text":
            return block["text"]
    return ""

# ── Step 1: AI defines categories ────────────────────────────────────────────

def build_categories_prompt(label, label_cn):
    return f"""你是 SEO 关键词分类专家。我有一批 {label}（{label_cn}）主题的关键词需要分类。

请分析这些关键词，定义 8-15 个 Subtopic 类别。每个类别必须：
1. 覆盖一组语义相近的关键词
2. 附 3-5 个典型样本关键词
3. 类别名用英文，简洁清晰

同时为每个 Subtopic 定义对应的 Entity 细粒度范围（Entity 是 Subtopic 内更具体的实体）。

输出格式（严格 JSON）：
{{
  "categories": [
    {{
      "subtopic": "类别名",
      "description": "简短描述",
      "sample_keywords": ["keyword1", "keyword2", "keyword3"],
      "entity_examples": ["Entity1", "Entity2"]
    }}
  ]
}}"""

def step1_define_categories(keywords_sample, label, label_cn):
    print("=== Step 1: AI defines categories ===")
    prompt = build_categories_prompt(label, label_cn)
    user_msg = f"以下是 {label} 关键词样本（前150条）：\n{json.dumps(keywords_sample[:150], ensure_ascii=False)}"
    result = llm_call(prompt, user_msg)
    print(result)
    try:
        start = result.index("{")
        end = result.rindex("}") + 1
        parsed = json.loads(result[start:end])
        cats = parsed.get("categories", [])
        print(f"\n  Defined {len(cats)} categories:")
        for c in cats:
            print(f"    {c['subtopic']}: {', '.join(c['sample_keywords'][:3])}")
        return cats
    except (ValueError, json.JSONDecodeError) as e:
        print(f"  Failed to parse: {e}")
        return []

# ── Step 2: AI batch classify ────────────────────────────────────────────────

def build_classify_prompt(label, label_cn, fallback_entity, categories_text, entity_only=False):
    if entity_only:
        return f"""你是 SEO 关键词分类专家。将以下 {label} 关键词分类到 Entity。

Entity 类别列表：
{categories_text}

规则：
1. 每个关键词必须归入上面列出的某个 Entity
2. Entity 是细粒度的实体（如特定星座名、数字、概念名）
3. 如果关键词太泛无法确定具体实体，Entity 填 "{fallback_entity}"
4. Entity 必须是列表中已有的名称，不得自创新 Entity

严格按 JSON 数组格式返回，不要有任何其他文字：
[{{"keyword": "...", "entity": "..."}}]"""
    return f"""你是 SEO 关键词分类专家。将以下 {label} 关键词分类到 Subtopic 和 Entity。

类别列表：
{categories_text}

规则：
1. 每个关键词必须归入上面列出的某个 Subtopic
2. Entity 是更细粒度的实体（如特定概念、数字、符号名）
3. 如果关键词太泛无法确定具体实体，Entity 填 "{fallback_entity}"
4. Subtopic 必须是列表中已有的类别名，不得自创

严格按 JSON 数组格式返回，不要有任何其他文字：
[{{"keyword": "...", "subtopic": "...", "entity": "..."}}]"""

def step2_classify_batch(keywords, categories, label, label_cn, fallback_entity, entity_only=False):
    categories_text = "\n".join(
        f"- **{c['subtopic']}**: {c['description']} (如 {', '.join(c['sample_keywords'][:3])})"
        for c in categories
    )
    prompt = build_classify_prompt(label, label_cn, fallback_entity, categories_text, entity_only=entity_only)
    user_msg = f"分类以下 {len(keywords)} 个关键词：\n{json.dumps(keywords, ensure_ascii=False)}"
    result = llm_call(prompt, user_msg)
    try:
        start = result.index("[")
        end = result.rindex("]") + 1
        return json.loads(result[start:end])
    except (ValueError, json.JSONDecodeError) as e:
        print(f"    Parse error: {e}")
        return []

# ── Regex corrections (per topic) ────────────────────────────────────────────

# Angel Numbers regex
ANGEL_NUMBERS_REGEX_ENTITY = [
    (r"\b111\b", "Angel Number 111"),
    (r"\b222\b", "Angel Number 222"),
    (r"\b333\b", "Angel Number 333"),
    (r"\b444\b", "Angel Number 444"),
    (r"\b555\b", "Angel Number 555"),
    (r"\b666\b", "Angel Number 666"),
    (r"\b777\b", "Angel Number 777"),
    (r"\b888\b", "Angel Number 888"),
    (r"\b999\b", "Angel Number 999"),
    (r"\b1111\b", "Angel Number 1111"),
    (r"\b1212\b", "Angel Number 1212"),
    (r"\b2222\b", "Angel Number 2222"),
    (r"\b3333\b", "Angel Number 3333"),
    (r"\b1234\b", "Angel Number 1234"),
    (r"\b000\b", "Angel Number 000"),
    (r"\b1010\b", "Angel Number 1010"),
    (r"\b11:11\b", "Angel Number 1111"),
    (r"\btwin flame\b", "Twin Flame"),
    (r"\bmirror hour\b", "Mirror Hour"),
]

# Feng Shui regex
FENG_SHUI_REGEX_ENTITY = [
    (r"\bbagua\b", "Bagua Map"),
    (r"\bflying star\b", "Flying Star"),
    (r"\bcompass\s+school\b", "Compass School"),
    (r"\bform\s+school\b", "Form School"),
    (r"\bfive\s+elements\b", "Five Elements"),
    (r"\bwu\s+xing\b", "Five Elements"),
    (r"\bchi\b", "Chi/Qi"),
    (r"\bqi\b", "Chi/Qi"),
    (r"\bla\s+sha\b", "Feng Shui Sha Qi"),
    (r"\bpoison\s+arrow\b", "Feng Shui Sha Qi"),
    (r"\bcrystal\b", "Feng Shui Crystals"),
    (r"\bmoney\s+plant\b", "Money Plant"),
    (r"\bwater\s+fountain\b", "Water Fountain"),
    (r"\bdragon\b", "Feng Shui Dragon"),
    (r"\bphoenix\b", "Feng Shui Phoenix"),
    (r"\btortoise\b", "Feng Shui Tortoise"),
    (r"\btiger\b", "Feng Shui Tiger"),
    (r"\bluo\s+pan\b", "Luo Pan"),
    (r"\bkua\s+number\b", "Kua Number"),
    (r"\bming\s+gua\b", "Ming Gua"),
    (r"\bfeng\s+shui\s+colors?\b", "Feng Shui Colors"),
    (r"\bfeng\s+shui\s+numbers?\b", "Feng Shui Numbers"),
    (r"\blucky\s+bamboo\b", "Lucky Bamboo"),
]

# Astrology regex
ASTROLOGY_REGEX_ENTITY = [
    (r"\baries\b", "Aries"), (r"\btaurus\b", "Taurus"),
    (r"\bgemini\b", "Gemini"), (r"\bcancer\b", "Cancer"),
    (r"\bleo\b", "Leo"), (r"\bvirgo\b", "Virgo"),
    (r"\blibra\b", "Libra"), (r"\bscorpio\b", "Scorpio"),
    (r"\bsagittarius\b", "Sagittarius"), (r"\bcapricorn\b", "Capricorn"),
    (r"\baquarius\b", "Aquarius"), (r"\bpisces\b", "Pisces"),
    (r"\brat\b", "Chinese Zodiac Rat"), (r"\box\b", "Chinese Zodiac Ox"),
    (r"\btiger\b", "Chinese Zodiac Tiger"), (r"\brabbit\b", "Chinese Zodiac Rabbit"),
    (r"\bdragon\b", "Chinese Zodiac Dragon"), (r"\bsnake\b", "Chinese Zodiac Snake"),
    (r"\bhorse\b", "Chinese Zodiac Horse"), (r"\bgoat\b", "Chinese Zodiac Goat"),
    (r"\bmonkey\b", "Chinese Zodiac Monkey"), (r"\brooster\b", "Chinese Zodiac Rooster"),
    (r"\bdog\b", "Chinese Zodiac Dog"), (r"\bpig\b", "Chinese Zodiac Pig"),
    (r"\bbirth\s+chart\b", "Birth/Natal Chart"),
    (r"\bnatal\s+chart\b", "Birth/Natal Chart"),
    (r"\bbirth\s+chart\b", "Birth/Natal Chart"),
    (r"\bhoroscope\b", "Horoscope"),
    (r"\bmercury\s+retrograde\b", "Mercury Retrograde"),
    (r"\bretrograde\b", "Planetary Retrograde"),
    (r"\bsun\s+sign\b", "Sun Sign"),
    (r"\bmoon\s+sign\b", "Moon Sign"),
    (r"\brising\s+sign\b", "Rising Sign"),
    (r"\bascendant\b", "Rising Sign"),
]

# Tarot regex (kept for completeness)
TAROT_REGEX_ENTITY = [
    (r"\bfool\b", "The Fool"), (r"\bmagician\b", "The Magician"),
    (r"\bhigh priestess\b", "The High Priestess"), (r"\bempress\b", "The Empress"),
    (r"\bemperor\b", "The Emperor"), (r"\bhierophant\b", "The Hierophant"),
    (r"\blovers\b", "The Lovers"), (r"\bchariot\b", "The Chariot"),
    (r"\bstrength\b", "Strength"), (r"\bhermit\b", "The Hermit"),
    (r"\bwheel of fortune\b", "Wheel of Fortune"), (r"\bjustice\b", "Justice"),
    (r"\bhanged man\b", "The Hanged Man"), (r"\bdeath\b", "Death"),
    (r"\btemperance\b", "Temperance"), (r"\bdevil\b", "The Devil"),
    (r"\btower\b", "The Tower"), (r"\bstar\b", "The Star"),
    (r"\bmoon\b", "The Moon"), (r"\bsun\b", "The Sun"),
    (r"\bjudgement\b", "Judgement"), (r"\bworld\b", "The World"),
    (r"\brider[\s-]+waite\b", "Rider-Waite Tarot"),
    (r"\bceltic\s+cross\b", "Celtic Cross Spread"),
]

REGEX_MAP = {
    "angel-numbers": ANGEL_NUMBERS_REGEX_ENTITY,
    "feng-shui": FENG_SHUI_REGEX_ENTITY,
    "astrology": ASTROLOGY_REGEX_ENTITY,
    "tarot": TAROT_REGEX_ENTITY,
}

# Zodiac regex
ZODIAC_REGEX_ENTITY = [
    (r"\baries\b", "Aries"), (r"\btaurus\b", "Taurus"),
    (r"\bgemini\b", "Gemini"), (r"\bcancer zodiac\b", "Cancer"),
    (r"\bcancer\b", "Cancer"), (r"\bleo\b", "Leo"),
    (r"\bvirgo\b", "Virgo"), (r"\blibra\b", "Libra"),
    (r"\bscorpio\b", "Scorpio"), (r"\bsagittarius\b", "Sagittarius"),
    (r"\bcapricorn\b", "Capricorn"), (r"\baquarius\b", "Aquarius"),
    (r"\bpisces\b", "Pisces"),
    (r"\bophiuchus\b", "Ophiuchus"),
    (r"\bchinese zodiac\b", "Chinese Zodiac"),
    (r"\byear of the (rat|ox|tiger|rabbit|dragon|snake|horse|goat|sheep|monkey|rooster|dog|pig)\b", "Chinese Zodiac"),
    (r"\blunar new year\b", "Chinese Zodiac"),
    (r"\bchinese new year\b", "Chinese Zodiac"),
    (r"\bhoroscope\b", "Horoscope"),
    (r"\bcompatib\w*\b", "Zodiac Compatibility"),
    (r"\bmatch\b", "Zodiac Compatibility"),
]
REGEX_MAP["zodiac"] = ZODIAC_REGEX_ENTITY

# Numerology regex
NUMEROLOGY_REGEX_ENTITY = [
    (r"\b(life\s*path|life-path)\s*(number\b)?\s*(\d{1,2})\b", None),  # handled by special logic
    (r"\blife\s*path\b", "Life Path Number"),
    (r"\bmaster\s*number\b", "Master Numbers"),
    (r"\b(11|22|33)\b", "Master Numbers"),
    (r"\bexpression\s*number\b", "Expression Number"),
    (r"\bsoul\s*urge\b", "Soul Urge Number"),
    (r"\bhouse\s*number\b", "House Number Numerology"),
    (r"\bname\s*numerolog", "Name Numerology"),
    (r"\bbaby\s*name\b", "Name Numerology"),
    (r"\bcalculator\b", "Numerology Calculator"),
    (r"\bangel\s*(?:number)?\s*(\d{3,4})\b", "Angel Number"),
    (r"\bcompatib\w*\b", "Numerology Compatibility"),
    (r"\b\d{3}\b.*\bmeaning\b", "Angel Number"),
]
REGEX_MAP["numerology"] = NUMEROLOGY_REGEX_ENTITY

# Meditation regex
MEDITATION_REGEX_ENTITY = [
    (r"\bmindful", "Mindfulness Meditation"),
    (r"\btranscendental\b|\btm\b", "Transcendental Meditation"),
    (r"\bzen\b|\bzazen\b|\bvipassana\b", "Zen / Buddhist Meditation"),
    (r"\byoga\s*nidra\b", "Yoga Nidra"),
    (r"\bchakra.*meditat", "Chakra Meditation"),
    (r"\bsleep.*meditat|meditat.*sleep|\binsomnia\b", "Sleep Meditation"),
    (r"\banxiety\b|\bstress\b|\bpanic\b", "Anxiety & Stress Relief"),
    (r"\bdepression\b|\bgrief\b|\bemotional\b", "Emotional Healing"),
    (r"\bfocus\b|\bconcentrat", "Focus & Concentration"),
    (r"\bmeditation\s*app\b|\bheadspace\b|\bcalm\b|\binsight timer\b", "Meditation Apps"),
    (r"\b(binaural|solfeggio|singing bowl|tibetan bowl|frequency)\b", "Meditation Music & Sound"),
    (r"\bmantra\b|\bchant\b|\bjapa\b", "Mantra Meditation"),
    (r"\bbreath\w*\s*(meditation|technique|exercise|practice)\b|\bpranayama\b", "Breathing Meditation"),
    (r"\bcandle\b|\bincense\b|\bessential oil\b|\bsmudge\b|\bsage\b|\bpalo santo\b", "Meditation Accessories"),
    (r"\bwalking.*meditation\b|\bmovement.*meditation\b", "Movement Meditation"),
    (r"\bloving.kindness\b|\bmetta\b|\bcompassion.*meditation\b", "Loving-Kindness Meditation"),
    (r"\bvisualization\b|\bguided.*imagery\b", "Visualization Meditation"),
    (r"\bbody\s*scan\b|\bprogressive.*relax", "Body Scan Meditation"),
    (r"\bmeditation.*cushion\b|\bzafu\b|\bzabuton\b|\bmeditation.*mat\b", "Meditation Equipment"),
]
REGEX_MAP["meditation"] = MEDITATION_REGEX_ENTITY

# Moon Phases regex
MOON_PHASES_REGEX_ENTITY = [
    (r"\bnew\s*moon\b|\bdark\s*moon\b", "New Moon"),
    (r"\bwaxing\s*crescent\b", "Waxing Crescent"),
    (r"\bfirst\s*quarter\b|\bhalf\s*moon\b", "First Quarter"),
    (r"\bwaxing\s*gibbous\b", "Waxing Gibbous"),
    (r"\bfull\s*moon\b|\bsupermoon\b|\bblood moon\b|\bblue moon\b", "Full Moon"),
    (r"\bwaning\s*gibbous\b", "Waning Gibbous"),
    (r"\blast\s*quarter\b|\bthird\s*quarter\b", "Last Quarter"),
    (r"\bwaning\s*crescent\b", "Waning Crescent"),
    (r"\bharvest\s*moon\b|\bworm\s*moon\b|\bsnow\s*moon\b|\bpink\s*moon\b", "Full Moon"),
    (r"\bstrawberry\s*moon\b|\bbuck\s*moon\b|\bsturgeon\s*moon\b|\bbee\s*moon\b", "Full Moon"),
    (r"\bflower\s*moon\b|\bgoose\s*moon\b|\bbarley\s*moon\b|\bworm\s*moon\b", "Full Moon"),
    (r"\bmoon.*calendar\b|\bcalendar.*moon\b|\blunar\s*calendar\b", "Moon Phase Calendar"),
    (r"\bmoon\s*cycle\b|\blunar\s*cycle\b|\b8\s*moon\s*phases\b", "Moon Phase Calendar"),
    (r"\b(ritual|manifest|intention|ceremony|wish)\b.*\b(moon|full|new)\b", "Moon Ritual & Manifestation"),
    (r"\bfishing\b|\bgarden\w*\b|\bplant\w*\b|\bseed\b|\bharvest\w*\b", "Practical Moon Lore"),
]
REGEX_MAP["moon-phases"] = MOON_PHASES_REGEX_ENTITY

# Spirituality regex
SPIRITUALITY_REGEX_ENTITY = [
    (r"\bmeditation\b|\bmindfulness\b|\byoga\b", "Meditation & Mindfulness"),
    (r"\bcrystal\w*\b|\bgem\w*\b|\bhealing\s*stone\b", "Crystals & Spirituality"),
    (r"\bangel\w*\b|\bguardian.*angel\b|\barchangel\b", "Angels & Spirit Guides"),
    (r"\btarot\b|\boracle\b|\bcard.*reading\b", "Tarot & Divination"),
    (r"\bnumerolog\w*\b|\blife\s*path\b", "Numerology & Spirituality"),
    (r"\bastrolog\w*\b|\bzodiac\b|\bhoroscope\b|\bbirth.*chart\b", "Astrology & Spirituality"),
    (r"\bchakra\w*\b|\baura\b|\benergy.*heal\w*\b|\breiki\b", "Energy Healing"),
    (r"\bfeng\s*shui\b|\bvastu\b", "Sacred Space"),
    (r"\bprayer\b|\bchant\b|\bmantra\b|\baffirmation\b", "Prayer & Mantra"),
    (r"\bawakening\b|\benlightenment\b|\bkundalini\b|\bthird\s*eye\b|\bascension\b", "Spiritual Awakening"),
    (r"\bpast\s*life\b|\bregression\b|\breincarn\w*\b|\bkarma\b", "Past Lives & Karma"),
    (r"\bsacred.*geometry\b|\bflower.*of.*life\b|\bmandala\b", "Sacred Geometry"),
    (r"\bsmudge\b|\bsage\b|\bpalo\s*santo\b|\bcleans\w*\b", "Spiritual Cleansing"),
    (r"\bgratitude\b|\bblessing\w*\b", "Gratitude & Blessings"),
    (r"\blaw.*of.*attract\b|\bmanifest\w*\b|\bvisuali\w*\b|\bintention\b", "Law of Attraction"),
    (r"\bspirit.*animal\b|\btotem\b|\bpower.*animal\b", "Spirit Animals"),
    (r"\bsynchronicity\b|\b11:11\b|\bsign.*from.*universe\b", "Signs & Synchronicity"),
    (r"\bintuition\b|\bpsychic\b|\bclair\w*\b|\bempath\b|\bmedium\b", "Intuition & Psychic"),
    (r"\bshadow.*work\b|\binner.*child\b|\bjournal\w*\b|\bself.*reflect", "Shadow Work"),
    (r"\bsolstic\w*\b|\bequinox\w*\b|\bsabbat\b|\bpagan\w*\b|\bwicca\w*\b", "Seasonal & Pagan Spirituality"),
]
REGEX_MAP["spirituality"] = SPIRITUALITY_REGEX_ENTITY

def regex_correct(kw, subtopic, entity, topic):
    """Apply deterministic regex corrections for Entity."""
    text = kw.lower()
    patterns = REGEX_MAP.get(topic, [])
    for pattern, correct_entity in patterns:
        if re.search(pattern, text):
            entity = correct_entity
            break
    return subtopic, entity

# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="AI batch classify Seed-* sheet")
    parser.add_argument("--topic", required=True, choices=TOPICS.keys(), help="Topic to classify")
    args = parser.parse_args()

    cfg = TOPICS[args.topic]
    sheet_name = cfg["sheet_name"]
    label = cfg["label"]
    label_cn = cfg["label_cn"]
    fallback_st = cfg["fallback_subtopic"]
    fallback_ent = cfg["fallback_entity"]
    entity_only = cfg.get("entity_only", False)

    # Read all keywords
    print(f"Reading keywords from {sheet_name}...")
    data = sheets_get(sheet_name, "A2:A")
    rows = data.get("values", [])
    keywords = [row[0].strip() for row in rows if row and row[0].strip()]
    N = len(keywords)
    print(f"Total keywords: {N}")
    print(f"Mode: {'Entity only (Subtopic preserved)' if entity_only else 'Subtopic + Entity'}\n")

    # Step 1: Define categories
    categories = step1_define_categories(keywords, label, label_cn)
    if not categories:
        print("Failed to define categories, aborting.")
        return

    # Step 2: Batch classify
    total_batches = (N + BATCH_SIZE - 1) // BATCH_SIZE
    print(f"\n=== Step 2: AI batch classifying {N} keywords ({BATCH_SIZE}/batch, {total_batches} batches) ===")
    all_results = {}
    errors = 0

    for batch_idx in range(total_batches):
        start = batch_idx * BATCH_SIZE
        end = min(start + BATCH_SIZE, N)
        batch_kws = keywords[start:end]

        print(f"  Batch {batch_idx+1}/{total_batches} ({start+1}-{end})...", end=" ", flush=True)
        results = step2_classify_batch(batch_kws, categories, label, label_cn, fallback_ent, entity_only=entity_only)

        if not results:
            print("FAILED")
            errors += 1
            if errors >= 3:
                print("  Too many errors, stopping.")
                break
            continue

        for item in results:
            kw = item.get("keyword", "").strip()
            if kw:
                if entity_only:
                    all_results[kw] = item.get("entity", "")
                else:
                    all_results[kw] = (item.get("subtopic", ""), item.get("entity", ""))

        matched = sum(1 for kw in batch_kws if kw in all_results)
        print(f"OK ({matched}/{len(batch_kws)} matched)")

        if batch_idx < total_batches - 1:
            time.sleep(1)

    print(f"\n  Total classified: {len(all_results)} keywords")
    print(f"  Coverage: {len(all_results)/N*100:.1f}%")

    # Step 3: Regex correction + build write columns
    print("\n=== Step 3: Regex correction + building columns ===")
    entity_col = []
    subtopic_col = []
    ent_counter = Counter()
    st_counter = Counter()
    unmatched = []

    for kw in keywords:
        if kw in all_results:
            if entity_only:
                ent = all_results[kw]
                _, ent = regex_correct(kw, "", ent, args.topic)
            else:
                st, ent = all_results[kw]
                st, ent = regex_correct(kw, st, ent, args.topic)
        else:
            if entity_only:
                ent = fallback_ent
            else:
                st = fallback_st
                ent = fallback_ent
            unmatched.append(kw)

        entity_col.append([ent])
        ent_counter[ent] += 1

        if not entity_only:
            subtopic_col.append([st])
            st_counter[st] += 1

    print(f"\n  Entity distribution:")
    for k, v in ent_counter.most_common(20):
        pct = v / N * 100
        print(f"    {v:5d} ({pct:5.1f}%)  {k}")

    if not entity_only:
        print(f"\n  Subtopic distribution:")
        for k, v in st_counter.most_common():
            pct = v / N * 100
            print(f"    {v:5d} ({pct:5.1f}%)  {k}")

    if unmatched:
        print(f"\n  Unmatched keywords: {len(unmatched)}")
        print(f"    Samples: {unmatched[:5]}")

    # Step 4: Write back
    print(f"\n=== Step 4: Writing back to {sheet_name} ===")
    WRITE_BATCH = 500
    for start in range(0, N, WRITE_BATCH):
        end = min(start + WRITE_BATCH, N)
        sheets_write(sheet_name, f"C{start+2}:C{end+1}", entity_col[start:end])
        if not entity_only:
            sheets_write(sheet_name, f"D{start+2}:D{end+1}", subtopic_col[start:end])
        print(f"  Written rows {start+2}-{end+1}")

    print("\n=== DONE ===")

if __name__ == "__main__":
    main()
