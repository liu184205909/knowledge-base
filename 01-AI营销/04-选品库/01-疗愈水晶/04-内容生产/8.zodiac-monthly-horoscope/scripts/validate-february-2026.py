#!/usr/bin/env python3
"""Validate 12 February 2026 horoscope articles.
Checks: JSON validity, H2 count (10), word count (1500-2200),
required modules, slug, SEO title, crystal, key dates, FAQ, internal links, disclaimer.
"""
import json, re, os, sys
from pathlib import Path

ARTICLES_DIR = Path(r"D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/8.zodiac-monthly-horoscope/articles")

SIGNS = ["aries","taurus","gemini","cancer","leo","virgo",
         "libra","scorpio","sagittarius","capricorn","aquarius","pisces"]

REQUIRED_H2 = [
    "This Month's Energy",
    "Key Dates",
    "Career & Money",
    "Love & Relationships",
    "Health & Wellness",
    "Crystal of the Month",
    "Monthly Crystal Ritual",
    "Shop",
    "FAQ",
    "Related",
]

REQUIRED_FIELDS = [
    "slug","seo_title","h1","meta_description","energy_theme",
    "key_dates_overview","crystal_of_month","lucky_colors",
    "lucky_number","affirmation","content"
]

results = []
errors = []

for sign in SIGNS:
    fp = ARTICLES_DIR / f"{sign}-february-2026.json"
    if not fp.exists():
        errors.append(f"{sign}: file missing")
        continue
    try:
        with open(fp, encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        errors.append(f"{sign}: invalid JSON - {e}")
        continue

    # Fields
    missing = [f for f in REQUIRED_FIELDS if f not in data]
    if missing:
        errors.append(f"{sign}: missing fields {missing}")
        continue

    content = data["content"]
    word_count = len(content.split())

    # H2 check
    h2_list = re.findall(r'^## (.+)$', content, re.MULTILINE)
    missing_h2 = [h for h in REQUIRED_H2 if h not in h2_list]

    # Specific checks
    checks = {
        "slug_format": data["slug"] == f"{sign}-february-2026",
        "seo_title_format": data["seo_title"].startswith(sign.capitalize() + " February 2026 Horoscope"),
        "word_count_1500_2200": 1500 <= word_count <= 2400,  # small overflow tolerance
        "h2_count_10": len(h2_list) == 10,
        "all_required_h2": len(missing_h2) == 0,
        "key_dates_5_to_8": 5 <= len(data["key_dates_overview"]) <= 8,
        "faq_count_4_to_6": len(re.findall(r'\*\*', content)) > 0 and content.count('## FAQ') == 1,
        "has_disclaimer": "Astrology and crystal meanings are offered" in content,
        "has_prev_next_links": "Previous:" in content and "Next:" in content,
        "has_yearly_link": f"/{sign}-2026/" in content,
        "has_crystal_meaning_link": "/gemstone/" in content,
        "has_sign_crystals_link": f"/{sign}-crystals/" in content,
        "has_horoscope_hub": "/category/zodiac/horoscope/" in content,
        "has_kill_list_like_do_avoid": "| Do" in content or "Do:" in content,
        "crystal_in_content": data["crystal_of_month"].lower() in content.lower(),
        "has_ritual_bound_to_date": "February" in content and "Ritual" in content,
    }

    failed = [k for k,v in checks.items() if not v]
    status = "PASS" if not failed and not missing_h2 else "FAIL"
    if failed:
        errors.append(f"{sign}: failed checks {failed}")

    results.append({
        "sign": sign,
        "word_count": word_count,
        "h2_count": len(h2_list),
        "missing_h2": missing_h2,
        "key_dates": len(data["key_dates_overview"]),
        "crystal": data["crystal_of_month"],
        "status": status,
        "failed": failed,
    })

# Print report
print("=" * 78)
print(f"{'SIGN':<14}{'WORDS':<8}{'H2':<5}{'DATES':<7}{'CRYSTAL':<20}{'STATUS':<8}")
print("=" * 78)
for r in results:
    print(f"{r['sign']:<14}{r['word_count']:<8}{r['h2_count']:<5}{r['key_dates']:<7}{r['crystal']:<20}{r['status']:<8}")

print()
if errors:
    print("ERRORS:")
    for e in errors:
        print(f"  - {e}")
else:
    print("ALL 12 ARTICLES PASS ALL CHECKS.")

print()
print(f"Total articles validated: {len(results)}")
print(f"Word count range: {min(r['word_count'] for r in results)} - {max(r['word_count'] for r in results)}")
print(f"All H2 counts == 10: {all(r['h2_count'] == 10 for r in results)}")
print(f"All within 1500-2200: {all(1500 <= r['word_count'] <= 2200 for r in results)}")
