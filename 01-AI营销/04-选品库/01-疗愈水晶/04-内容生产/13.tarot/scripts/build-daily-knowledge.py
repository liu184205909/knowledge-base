# -*- coding: utf-8 -*-
"""
Build daily-knowledge.json: 365 days (2026-01-01 .. 2026-12-31) x
date-seeded Major Arcana card + moon phase + planetary backdrop + crystal.

Sources (all confirmed in 星象数据参考-2026-2027.md):
  - 2026 new moons / full moons (with zodiac + special names)
  - 2026 eclipses (4)
  - 2026 outer-planet sign shifts (Neptune/Saturn/Uranus/Jupiter/Chiron)
  - 2026 retrogrades (Mercury x3 / Venus / Jupiter)
  - 22 Major Arcana from tarot-knowledge.json

Card assignment: deterministic per-date seed = hash(yyyy-mm-dd) % 22 so the
same date always yields the same card and the 22 cards distribute evenly
across 365 days (each card ~16-17 days). A second offset
(seed // 22) % 22 rotates the start so consecutive days don't walk the
deck in order (prevents adjacent-day structural similarity).
"""
import json, hashlib, datetime as dt, os

ROOT = r"D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶"
TK = json.load(open(os.path.join(ROOT, "07-互动工具/_shared/tarot-knowledge.json"), encoding="utf-8"))
CARDS = {c["number"]: c for c in TK["cards"]}
ORDER = [c["number"] for c in TK["cards"]]  # 0..21

# ---- 2026 astrology anchors (from 星象数据参考-2026-2027.md) ----
NEW_MOONS = {  # date -> (zodiac, note)
    "2026-01-19": ("Capricorn", ""), "2026-02-17": ("Aquarius", "annular solar eclipse 28°04'"),
    "2026-03-19": ("Pisces", ""), "2026-04-17": ("Aries", ""),
    "2026-05-16": ("Taurus", "Super New Moon"), "2026-06-14": ("Gemini", "Super New Moon"),
    "2026-07-13": ("Cancer", ""), "2026-08-12": ("Leo", "total solar eclipse 20°01'"),
    "2026-09-11": ("Virgo", ""), "2026-10-10": ("Libra", ""),
    "2026-11-08": ("Scorpio", ""), "2026-12-07": ("Sagittarius", ""),
}
FULL_MOONS = {  # date -> (zodiac, name)
    "2026-01-03": ("Cancer", "Wolf Moon"), "2026-02-01": ("Leo", "Snow Moon"),
    "2026-03-03": ("Virgo", "Total lunar eclipse 12°"), "2026-04-02": ("Libra", "Pink Moon"),
    "2026-05-03": ("Scorpio", "Flower Moon"),
    "2026-05-31": ("Sagittarius", "Blue Moon + Micro Moon"),
    "2026-06-29": ("Capricorn", "Strawberry Moon"), "2026-07-29": ("Aquarius", "Buck Moon 6°29'"),
    "2026-08-28": ("Pisces", "Partial lunar eclipse 5°"), "2026-09-26": ("Aries", "Harvest Moon"),
    "2026-10-26": ("Taurus", "Hunter's Moon"), "2026-11-24": ("Gemini", "Beaver Moon"),
    "2026-12-24": ("Cancer", "Cold Moon"),
}
ECLIPSES = {
    "2026-02-17": "annular solar eclipse 28°04' Aquarius (eclipse-season new moon)",
    "2026-03-03": "total lunar eclipse 12° Virgo",
    "2026-08-12": "total solar eclipse 20° Leo (first visible in Europe since 1999)",
    "2026-08-28": "partial lunar eclipse 5° Pisces",
}
# retrograde windows (inclusive)
RETRO = [
    ("Mercury", "2026-02-26", "2026-03-20", "Pisces 22°34' → 8°30'"),
    ("Mercury", "2026-06-29", "2026-07-23", "Cancer"),
    ("Mercury", "2026-10-24", "2026-11-13", "Scorpio (pre-shadow from 10/4)"),
    ("Venus",  "2026-10-03", "2026-11-13", "Scorpio 8°29' → Libra 22°51' (pre-shadow from 8/31)"),
    ("Jupiter", "2026-12-12", "2026-12-31", "Leo 27°01' (station retrograde; ends 4/12/2027)"),
]
# outer-planet backdrop changes (date -> note). Outside the listed date, the
# planet is in the sign it most recently entered.
OUTER_MILESTONES = [
    ("2026-01-26", "Neptune enters Aries (new ~14-year cycle)"),
    ("2026-02-13", "Saturn enters Aries"),
    ("2026-02-17", "Saturn-Neptune conjunction at Aries 0° — the year's defining alignment"),
    ("2026-04-25", "Uranus enters Gemini (through ~2032-33)"),
    ("2026-06-19", "Chiron enters Taurus"),
    ("2026-06-29", "Jupiter enters Leo"),
]
SPECIAL_DAYS = {
    "2026-02-28": "six-planet alignment (Mercury/Venus/Jupiter/Saturn/Uranus/Neptune) across the sky",
    "2026-11-16": "Mars conjunct Jupiter at 25°53' Leo",
}

def outer_backdrop(date_iso):
    """Return the most-recent outer-planet milestone note on or before `date`."""
    note = None
    for d, n in OUTER_MILESTONES:
        if d <= date_iso:
            note = n
    # baseline before first milestone
    if note is None:
        note = "Outer planets pre-shift: Pluto in Aquarius, Neptune in late Pisces, Uranus in late Taurus, Jupiter in Cancer, Saturn in late Pisces."
    return note

def active_retrogrades(date_iso):
    out = []
    for planet, start, end, detail in RETRO:
        if start <= date_iso <= end:
            out.append({"planet": planet, "sign": detail})
    return out

def moon_phase(date_iso):
    """Return the phase label for the date using the confirmed 2026 table.

    Strategy: exact new/full moon dates get explicit labels; the ~7 days
    between are labelled by the nearest named phase following standard
    lunar cycle ordering. We anchor to the confirmed new/full moon table
    and interpolate the four canonical phases.
    """
    all_anchors = []
    for d, (z, note) in NEW_MOONS.items():
        all_anchors.append((d, "New Moon", z, note))
    for d, (z, name) in FULL_MOONS.items():
        # eclipse full moons already carry eclipse text in `name`
        all_anchors.append((d, "Full Moon", z, name))
    all_anchors.sort(key=lambda x: x[0])

    target = dt.date.fromisoformat(date_iso)
    # exact match
    for d, phase, z, extra in all_anchors:
        if d == date_iso:
            return {"phase": phase, "zodiac": z, "detail": extra or None,
                    "exact_date": True}
    # find surrounding anchors
    prev = None; nxt = None
    for d, phase, z, extra in all_anchors:
        dd = dt.date.fromisoformat(d)
        if dd < target:
            prev = (d, phase, z, extra, dd)
        elif dd > target and nxt is None:
            nxt = (d, phase, z, extra, dd)
    if prev is None:
        # before first new moon of year: waning from late-2025 Capricorn
        return {"phase": "Waning Crescent", "zodiac": "Capricorn",
                "detail": "approaching the Jan 19 Capricorn new moon", "exact_date": False}
    if nxt is None:
        return {"phase": "Waning Gibbous", "zodiac": "Cancer",
                "detail": "after the Dec 24 Cancer full moon", "exact_date": False}

    pd, pphase, pz, pextra, pdd = prev
    nd, nphase, nz, nextra, ndd = nxt
    gap = (ndd - pdd).days
    offset = (target - pdd).days
    ratio = offset / gap if gap else 0
    # standard 8-phase model collapsed to 4 named phases the audience knows
    if pphase == "New Moon":
        if ratio < 0.25:
            ph = "Waxing Crescent"
        elif ratio < 0.5:
            ph = "First Quarter"
        else:
            ph = "Waxing Gibbous"
        return {"phase": ph, "zodiac": nz, "detail": f"building toward the {nd} {nz} full moon", "exact_date": False}
    else:  # prev is Full Moon
        if ratio < 0.25:
            ph = "Waning Gibbous"
        elif ratio < 0.5:
            ph = "Last Quarter"
        else:
            ph = "Waning Crescent"
        return {"phase": ph, "zodiac": nz, "detail": f"releasing toward the {nd} {nz} new moon", "exact_date": False}

# ---- Eastern double-hour (子午流注) rotation ----
# 12 traditional Chinese double-hours; rotate by day-of-year so each day has a
# distinctive "peak meridian" anchor that the article can weave in.
SHICHEN = [
    ("Zi 子时 23:00–01:00", "Gallbladder meridian (胆经) — the hour of decisions made in the dark; seeds of vision before dawn."),
    ("Chou 丑时 01:00–03:00", "Liver meridian (肝经) — the body's planning hour; where frustration or vision gets stored."),
    ("Yin 寅时 03:00–05:00", "Lung meridian (肺经) — the hour grief and grief's resolution move through the breath."),
    ("Mao 卯时 05:00–07:00", "Large Intestine meridian (大肠经) — the hour of letting go; what no longer serves is released."),
    ("Chen 辰时 07:00–09:00", "Stomach meridian (胃经) — the hour of nourishment; how you receive the day's first fuel."),
    ("Si 巳时 09:00–11:00", "Spleen meridian (脾经) — the hour of assimilation; worry or grounded focus takes root."),
    ("Wu 午时 11:00–13:00", "Heart meridian (心经) — the noon peak of clarity and connection; where intention meets the world."),
    ("Wei 未时 13:00–15:00", "Small Intestine meridian (小肠经) — the hour of sorting; discerning what to keep."),
    ("Shen 申时 15:00–17:00", "Bladder meridian (膀胱经) — the afternoon stamina hour; stored tension surfaces to be cleared."),
    ("You 酉时 17:00–19:00", "Kidney meridian (肾经) — the hour of reserves and fear's resting place; willpower's well."),
    ("Xu 戌时 19:00–21:00", "Pericardium meridian (心包经) — the hour of the heart's protector; intimacy and emotional gatekeeping."),
    ("Hai 亥时 21:00–23:00", "Triple Burner meridian (三焦经) — the hour of integration; the day's three fires reconcile before sleep."),
]

MONTH_NAMES = ["", "January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"]

def _build_assignment():
    """Build a deterministic, perfectly even date->card map for all 365 days.

    hash % 22 is NOT even on structured date strings (实测 11-30 spread).
    Instead: build a 365-length list where each card appears floor(365/22)=16
    times and 3 cards appear 17 times, then Fisher-Yates shuffle it seeded by
    a fixed seed derived from '2026'. This gives a perfectly even (16-17)
    distribution AND scrambles adjacency (consecutive days → unrelated cards),
    deterministically reproducible. Returns dict date_iso -> card number.
    """
    import random
    pool = []
    extras = 365 - 22 * 16  # = 3 cards get a 17th day
    for i, n in enumerate(ORDER):
        pool.extend([n] * 16)
        if i < extras:
            pool.append(n)  # first 3 cards (fool, magician, high-priestess) get 17
    assert len(pool) == 365
    rng = random.Random(2026)  # fixed seed = reproducible
    rng.shuffle(pool)
    start = dt.date(2026, 1, 1)
    mapping = {}
    for i in range(365):
        d = (start + dt.timedelta(days=i)).isoformat()
        mapping[d] = pool[i]
    return mapping

_ASSIGNMENT = _build_assignment()

def date_seed_card(date_iso):
    """Deterministic 22-card assignment, perfectly even (16-17 days per card)."""
    return _ASSIGNMENT[date_iso]

def weekday_name(date_iso):
    return dt.date.fromisoformat(date_iso).strftime("%A")

def build():
    dates = {}
    start = dt.date(2026, 1, 1)
    card_counter = {n: 0 for n in ORDER}
    for i in range(365):
        d = start + dt.timedelta(days=i)
        iso = d.isoformat()
        doy = d.timetuple().tm_yday
        card_num = date_seed_card(iso)
        card_counter[card_num] += 1
        c = CARDS[card_num]
        bo = c["crystals"]["best_overall"]
        bu = c["crystals"]["best_upright"]
        # pick crystal: 70% best_overall, 30% best_upright for variety,
        # deterministic per date
        use_overall = (int(hashlib.md5((iso + "c").encode()).hexdigest(), 16) % 10) < 7
        crystal = bo if use_overall else bu
        moon = moon_phase(iso)
        retro = active_retrogrades(iso)
        backdrop = outer_backdrop(iso)
        eclipse = ECLIPSES.get(iso)
        special = SPECIAL_DAYS.get(iso)
        shichen = SHICHEN[doy % 12]
        dates[iso] = {
            "date": iso,
            "weekday": weekday_name(iso),
            "day_of_year": doy,
            "card": {
                "number": c["number"],
                "slug": c["slug"],
                "name": c["name"],
                "archetype": c["archetype"],
                "element": c["element"],
                "astrology": c["astrology"],
                "theme": c["theme"],
                "upright_keywords": c["upright_keywords"],
                "eastern_imagery": c.get("eastern_imagery", []),
                "card_url": f"/tarot-{c['slug']}-crystals/",
            },
            "crystal": {
                "slug": crystal["slug"],
                "name": crystal["name"],
                "role": "best_overall" if use_overall else "best_upright",
                "meaning_url": f"/{crystal['slug']}-meaning/",
            },
            "moon": moon,
            "outer_backdrop": backdrop,
            "retrogrades": retro,
            "eclipse": eclipse,
            "special_event": special,
            "eastern_hour": {"label": shichen[0], "meridian_note": shichen[1]},
            "url": f"/tarot-daily-{iso}/",
            "title": f"Daily Tarot Reading for {MONTH_NAMES[d.month]} {d.day}, 2026: {c['name']}",
            "focus_keyword": f"daily tarot {iso}",
        }
    out = {
        "_meta": {
            "purpose": "365 daily tarot readings (2026) — date x card x crystal x astrology x Eastern hour. Programmatic, anti-template.",
            "framework": "模板-Tarot-每日运势框架.md (5 modules, 600-1000 words, anti-template §3)",
            "data_sources": [
                "07-互动工具/_shared/tarot-knowledge.json (22 cards)",
                "03-内容策略/星象数据参考-2026-2027.md (moon phases, eclipses, retrogrades, outer-planet shifts — all confirmed)",
            ],
            "card_assignment": "Fisher-Yates shuffle of a pre-built even pool (16 days/card, 3 cards get 17), seeded by fixed seed 2026 — perfectly even distribution (16-17) + scrambled adjacency, fully reproducible",
            "year": 2026,
            "date_range": "2026-01-01 .. 2026-12-31",
            "total_days": 365,
            "compliance": "1F §0A (Health/Finances blacklist + 6-class banned phrases); no determinism ('today will/guaranteed'); crystal = tactile cue not cure/wealth charm",
            "anti_template": "each day's combination of (card x moon phase x retrograde x Eastern double-hour x crystal role) is unique; articles must weave the specific astrology, not generic card meaning",
            "card_distribution_check": "see distribution.json — each of 22 cards lands on 16-17 days",
        },
        "dates": dates,
    }
    return out, card_counter

if __name__ == "__main__":
    out, counter = build()
    path = os.path.join(ROOT, "04-内容生产/13.tarot/configs/daily-knowledge.json")
    json.dump(out, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    # distribution check
    dist_path = os.path.join(ROOT, "04-内容生产/13.tarot/_qc/card-distribution.json")
    dist = {CARDS[n]["slug"]: counter[n] for n in ORDER}
    json.dump({"distribution": dist, "min": min(dist.values()), "max": max(dist.values()),
               "total": sum(dist.values())}, open(dist_path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print("WROTE:", path)
    print("WROTE:", dist_path)
    print("card distribution min/max:", min(dist.values()), max(dist.values()), "total:", sum(dist.values()))
    # adjacency check: how often do two consecutive days share the same card?
    isos = sorted(out["dates"].keys())
    adj_same = sum(1 for i in range(1, len(isos)) if out["dates"][isos[i]]["card"]["number"] == out["dates"][isos[i-1]]["card"]["number"])
    print("consecutive-day same-card pairs:", adj_same, "(expect ~365/22 ≈ 16 by chance, shuffle gives ~16-17)")
    # spot-check a few dates
    for iso in ["2026-01-01", "2026-02-17", "2026-06-29", "2026-08-12", "2026-12-31"]:
        e = out["dates"][iso]
        print(iso, "→", e["card"]["name"], "| moon:", e["moon"]["phase"], e["moon"]["zodiac"],
              "| crystal:", e["crystal"]["name"], "| retro:", [r["planet"] for r in e["retrogrades"]],
              "| eclipse:", e["eclipse"])
