#!/usr/bin/env python3
"""
Generate supplementary content items for missing Page Types.
Reads Seed-Master v3, selects top keywords per entity per PT,
generates content entries, appends to content list spreadsheet.
"""
import sys, io, json, os, subprocess, urllib.parse, re, tempfile
from collections import defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

CRED = os.path.expanduser('~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json')
PROXY = 'http://127.0.0.1:10808'

SS_SEED = '1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc'
SS_CONTENT = '1PjXmT3CDngnbi4kIHAZZg6_qj-4N5RpKxBKMtxGxl5M'


def get_token():
    return json.load(open(CRED, encoding='utf-8'))['token']


def api_get(url):
    r = subprocess.run(['curl', '-s', '--proxy', PROXY, url,
                        '-H', f'Authorization: Bearer {get_token()}'],
                       capture_output=True, timeout=120)
    return json.loads(r.stdout.decode('utf-8'))


def api_post_append(ss_id, rng, values):
    body = {'values': values}
    tmp = tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False, encoding='utf-8')
    tmp.write(json.dumps(body))
    tmp.close()
    try:
        enc = urllib.parse.quote(rng)
        url = (f'https://sheets.googleapis.com/v4/spreadsheets/{ss_id}/values/{enc}'
               f':append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS')
        r = subprocess.run(['curl', '-s', '-X', 'POST', '--proxy', PROXY, url,
                            '-H', f'Authorization: Bearer {get_token()}',
                            '-H', 'Content-Type: application/json',
                            '-d', f'@{tmp.name}'],
                           capture_output=True, timeout=120)
        return json.loads(r.stdout.decode('utf-8'))
    finally:
        os.unlink(tmp.name)


def norm_kw(kw):
    return re.sub(r'\s+', ' ', kw.lower().strip())


def safe_int(v, d=0):
    try:
        return int(float(str(v).replace(',', '')))
    except (ValueError, TypeError):
        return d


# Page Types already covered by existing 709 items
COVERED_PTS = {
    'Crystals by Condition Page', 'Blog Article', 'Category Hub Page',
    'Crystal Single Page', 'Product Page', 'Crystals by Zodiac Page',
    'Crystals by Chakra Page', 'Crystals by Color Page', 'Local SEO Page',
    'Shop by Stone Page', '(Skip)',
}

# Limits per PT (number of entities to include)
PT_LIMITS = {
    'Astrology Guide Page': 25, 'Tool / Quiz Page': 15, 'Zodiac Sign Page': 15,
    'Meditation Guide Page': 15, 'Horoscope Page': 15, 'Chinese Zodiac Page': 15,
    'Moon Phase Page': 10, 'Numerology Page': 10,
    'Tarot Card Page': 25, 'Spiritual Guide Page': 15, 'Dream Subject Page': 20,
    'Dream Interpretation Page': 10, 'Birth Chart Page': 10, 'Zodiac Compatibility Page': 10,
    'Crystals by Chakra Page': 7, 'Feng Shui Guide Page': 10,
    'Animal Symbolism Page': 20, 'Angel Number Page': 15, 'Tarot Reading Guide Page': 10,
    'Palmistry Guide Page': 8, 'Tarot Spread Page': 8, 'Spirit Animal Page': 7,
    'Calculator Page': 5, 'Enneagram Guide Page': 5, 'Crystal Guide Index Page': 5,
    'Lucid Dream Guide Page': 3, 'Nightmare Guide Page': 2,
}

PT_CN = {
    'Astrology Guide Page': '指南', 'Tool / Quiz Page': '工具/测试',
    'Zodiac Sign Page': '星座', 'Meditation Guide Page': '指南',
    'Horoscope Page': '运势', 'Chinese Zodiac Page': '生肖',
    'Moon Phase Page': '月相', 'Numerology Page': '数字学',
    'Tarot Card Page': '塔罗牌', 'Spiritual Guide Page': '灵性指南',
    'Dream Subject Page': '解梦', 'Dream Interpretation Page': '解梦',
    'Birth Chart Page': '星盘', 'Zodiac Compatibility Page': '星座配对',
    'Crystals by Chakra Page': '脉轮水晶', 'Feng Shui Guide Page': '风水',
    'Animal Symbolism Page': '动物象征', 'Angel Number Page': '天使数字',
    'Tarot Reading Guide Page': '塔罗指南', 'Palmistry Guide Page': '手相',
    'Tarot Spread Page': '塔罗牌阵', 'Spirit Animal Page': '灵兽',
    'Calculator Page': '工具/测试', 'Enneagram Guide Page': '九型人格',
    'Crystal Guide Index Page': '水晶指南', 'Lucid Dream Guide Page': '清明梦',
    'Nightmare Guide Page': '噩梦指南',
}

PT_URL = {
    'Astrology Guide Page': '/astrology/', 'Tool / Quiz Page': '/tools/',
    'Zodiac Sign Page': '/zodiac/', 'Meditation Guide Page': '/meditation/',
    'Horoscope Page': '/horoscope/', 'Chinese Zodiac Page': '/chinese-zodiac/',
    'Moon Phase Page': '/moon-phases/', 'Numerology Page': '/numerology/',
    'Tarot Card Page': '/tarot/cards/', 'Spiritual Guide Page': '/spirituality/',
    'Dream Subject Page': '/dreams/about/', 'Dream Interpretation Page': '/dreams/',
    'Birth Chart Page': '/astrology/birth-chart/', 'Zodiac Compatibility Page': '/zodiac/compatibility/',
    'Crystals by Chakra Page': '/chakra/', 'Feng Shui Guide Page': '/feng-shui/',
    'Animal Symbolism Page': '/animal-symbolism/', 'Angel Number Page': '/angel-numbers/',
    'Tarot Reading Guide Page': '/tarot/', 'Palmistry Guide Page': '/palmistry/',
    'Tarot Spread Page': '/tarot/spreads/', 'Spirit Animal Page': '/animal-symbolism/spirit/',
    'Calculator Page': '/tools/', 'Enneagram Guide Page': '/enneagram/',
    'Crystal Guide Index Page': '/crystal-guide/', 'Lucid Dream Guide Page': '/dreams/lucid/',
    'Nightmare Guide Page': '/dreams/nightmares/',
}


def make_title(kw, pt, entity):
    kw_clean = kw.strip()
    entity_t = entity.title() if entity else kw_clean.title()
    if pt == 'Zodiac Sign Page':
        return f'{entity_t} Zodiac Sign: Dates, Traits, Compatibility & More'
    elif pt == 'Horoscope Page':
        return f'{entity_t} Horoscope: Daily, Weekly & Monthly'
    elif pt == 'Chinese Zodiac Page':
        return f'{entity_t} Chinese Zodiac: Years, Personality & Fortune'
    elif pt == 'Tarot Card Page':
        return f'{entity_t} Tarot Card Meaning (Upright & Reversed)'
    elif pt == 'Angel Number Page':
        return f'Angel Number {entity_t}: Meaning, Spiritual Significance & Twin Flame'
    elif pt == 'Moon Phase Page':
        return f'{entity_t}: Meaning, Rituals & Crystal Guide'
    elif pt == 'Tool / Quiz Page':
        return f'{kw_clean.title()}: Free Online Tool'
    elif pt == 'Dream Subject Page':
        return f'Dreaming About {entity_t}: Meaning & Interpretation'
    elif pt == 'Dream Interpretation Page':
        return f'{kw_clean.title()}: Complete Guide'
    elif pt == 'Animal Symbolism Page':
        return f'{entity_t} Symbolism & Spiritual Meaning'
    elif pt == 'Spirit Animal Page':
        return f'{entity_t} as a Spirit Animal: Meaning & Guidance'
    elif pt == 'Zodiac Compatibility Page':
        return f'{entity_t} Compatibility: Love, Friendship & Work'
    elif pt == 'Crystals by Chakra Page':
        return f'Best Crystals for {entity_t} Chakra Healing'
    elif pt == 'Calculator Page':
        return f'{kw_clean.title()}: Free Calculator'
    elif pt == 'Enneagram Guide Page':
        return f'Enneagram Guide: Understanding Your Type'
    elif pt == 'Tarot Reading Guide Page':
        return f'{entity_t}: How to Read Tarot Cards'
    elif pt == 'Tarot Spread Page':
        return f'{entity_t} Tarot Spread: How to & Meaning'
    elif pt == 'Palmistry Guide Page':
        return f'{entity_t}: Palm Reading Guide'
    elif pt == 'Spiritual Guide Page':
        return f'{entity_t}: Spiritual Meaning & Practice'
    elif pt == 'Feng Shui Guide Page':
        return f'{entity_t}: Feng Shui Guide & Tips'
    elif pt == 'Meditation Guide Page':
        return f'{entity_t}: Complete Meditation Guide'
    elif pt == 'Numerology Page':
        return f'{entity_t} Numerology: Meaning & Significance'
    elif pt == 'Birth Chart Page':
        return f'{entity_t}: Birth Chart Reading Guide'
    elif pt == 'Astrology Guide Page':
        return f'{entity_t}: Complete Astrology Guide'
    elif pt == 'Lucid Dream Guide Page':
        return f'{entity_t}: How to Lucid Dream'
    elif pt == 'Nightmare Guide Page':
        return f'{entity_t}: Nightmare Meaning & How to Stop'
    elif pt == 'Crystal Guide Index Page':
        return f'{entity_t} Crystal Guide'
    else:
        return f'{kw_clean.title()}: Complete Guide & Meaning'


def make_slug(kw):
    s = kw.lower().strip()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'\s+', '-', s)
    return s.strip('-')[:60]


def make_publish_rhythm(vol):
    if vol >= 10000:
        return '首批'
    elif vol >= 1000:
        return '第二批'
    else:
        return '第三批'


def main():
    token = get_token()

    # 1. Load Seed-Master v3
    print('[1] Loading Seed-Master v3 ...')
    enc = urllib.parse.quote('Seed-Master' + chr(33) + 'A1:X')
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{SS_SEED}/values/{enc}'
    seed_data = api_get(url)
    seed_body = seed_data.get('values', [])[1:]
    print(f'  Rows: {len(seed_body)}')

    # 2. Load existing content list keywords (for dedup)
    print('[2] Loading existing content list ...')
    enc2 = urllib.parse.quote(chr(20869) + chr(23481) + chr(28165) + chr(21333) + chr(33) + 'C1:C710')
    url2 = f'https://sheets.googleapis.com/v4/spreadsheets/{SS_CONTENT}/values/{enc2}'
    content_data = api_get(url2)
    existing_kws = set()
    for row in content_data.get('values', [])[1:]:
        if row:
            existing_kws.add(norm_kw(row[0]))
    print(f'  Existing keywords: {len(existing_kws)}')

    # 3. Group by (PT, entity)
    print('[3] Grouping keywords by PT+entity ...')
    pt_entity_groups = defaultdict(list)
    for row in seed_body:
        pt = row[23] if len(row) > 23 else ''
        if not pt or pt in COVERED_PTS:
            continue
        kw = row[0] if len(row) > 0 else ''
        nk = norm_kw(kw)
        if nk in existing_kws:
            continue
        topic = row[2] if len(row) > 2 else ''
        entity = row[3] if len(row) > 3 else ''
        vol = safe_int(row[6]) if len(row) > 6 else 0
        kd = row[7] if len(row) > 7 else ''
        cpc = row[8] if len(row) > 8 else ''
        matched = row[11] if len(row) > 11 else ''
        pt_entity_groups[(pt, entity.lower() if entity else '')].append(
            (vol, kw, kd, cpc, topic, matched)
        )

    # 4. Select top keyword per entity, then top entities per PT
    print('[4] Selecting representative keywords ...')
    new_items = []
    for (pt, entity), kw_list in pt_entity_groups.items():
        kw_list.sort(reverse=True)
        best_vol, kw, kd, cpc, topic, matched = kw_list[0]
        total_vol = sum(v for v, *_ in kw_list)
        new_items.append({
            'pt': pt, 'entity': entity, 'kw': kw, 'vol': best_vol,
            'total_vol': total_vol, 'kd': kd, 'cpc': cpc,
            'topic': topic, 'matched': matched, 'kw_count': len(kw_list),
        })

    # Sort and limit per PT
    pt_items = defaultdict(list)
    for item in new_items:
        pt_items[item['pt']].append(item)

    selected = []
    pt_summary = {}
    for pt in sorted(pt_items.keys()):
        items = sorted(pt_items[pt], key=lambda x: -x['total_vol'])
        limit = PT_LIMITS.get(pt, 10)
        trimmed = items[:limit]
        selected.extend(trimmed)
        pt_summary[pt] = len(trimmed)

    selected.sort(key=lambda x: -x['total_vol'])

    print(f'  Total new items: {len(selected)}')
    print()
    for pt in sorted(pt_summary.keys()):
        cnt = pt_summary[pt]
        total_vol = sum(item['total_vol'] for item in pt_items[pt][:cnt])
        print(f'    {pt:<35s} {cnt:>3d} items | {total_vol:>12,d} vol')

    # 5. Generate content rows
    print()
    print('[5] Generating content entries ...')
    rows_to_append = []
    for i, item in enumerate(selected):
        seq = 710 + i
        title = make_title(item['kw'], item['pt'], item['entity'])
        slug = make_slug(item['kw'])
        url_prefix = PT_URL.get(item['pt'], '/')
        url = f'{url_prefix}{slug}'
        cn_type = PT_CN.get(item['pt'], '博客')
        rhythm = make_publish_rhythm(item['total_vol'])
        rows_to_append.append([
            str(seq), title, item['kw'], str(item['vol']),
            item['kd'], item['cpc'], cn_type, rhythm, url,
            '待写', '待写',
            item['pt'], item['topic'], item['matched'],
            item['entity'], item['kd'], item['cpc'],
        ])

    print(f'  Generated {len(rows_to_append)} rows')

    # 6. Append to content list
    print()
    print('[6] Appending to content list ...')
    # Use Chinese sheet name encoded properly
    sheet_name = chr(20869) + chr(23481) + chr(28165) + chr(21333)
    rng = sheet_name + chr(33) + 'A710'
    result = api_post_append(SS_CONTENT, rng, rows_to_append)
    updates = result.get('updates', {})
    print(f'  Range: {updates.get("updatedRange", "?")}')
    print(f'  Cells: {updates.get("updatedCells", "?")}')
    print(f'  Rows: {updates.get("updatedRows", "?")}')

    print()
    print('[DONE] Content list supplemented!')
    print(f'  Original: 709 items')
    print(f'  New items: {len(rows_to_append)}')
    print(f'  Total: {709 + len(rows_to_append)} items')


if __name__ == '__main__':
    main()
