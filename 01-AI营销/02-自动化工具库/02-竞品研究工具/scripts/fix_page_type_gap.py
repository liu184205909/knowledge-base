#!/usr/bin/env python3
"""
Fix missing Page Type values in Seed-Master column X (rows 31502-35001).

These rows were missed during the initial map_page_type.py run due to API rate limiting.
This script reads the keyword data from those rows, re-classifies, and writes back.
"""

import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.parse
from collections import Counter

CRED_PATH = os.path.expanduser(
    '~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json'
)
PROXY = 'http://127.0.0.1:10808'
SS = '1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc'
SHEET = 'Seed-Master'

# Gap range (1-indexed data rows, excluding header at row 1)
GAP_START = 31502
GAP_END = 35001


def get_token():
    cred = json.load(open(CRED_PATH, encoding='utf-8'))
    return cred['token']


def api_get(rng):
    enc = urllib.parse.quote(rng)
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{SS}/values/{enc}'
    r = subprocess.run(
        ['curl', '-s', '--proxy', PROXY, url,
         '-H', 'Authorization: Bearer {token}'],
        capture_output=True, timeout=30
    )
    text = r.stdout.decode('utf-8')
    if not text.strip():
        return []
    return json.loads(text).get('values', [])


def api_put(rng, values, token):
    enc = urllib.parse.quote(rng)
    url = (f'https://sheets.googleapis.com/v4/spreadsheets/{SS}/values/{enc}'
           f'?valueInputOption=USER_ENTERED')
    body = json.dumps({'values': values})
    tmp = tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False, encoding='utf-8')
    tmp.write(body)
    tmp.close()
    try:
        r = subprocess.run(
            ['curl', '-s', '-X', 'PUT', '--proxy', PROXY, url,
             '-H', f'Authorization: Bearer {token}',
             '-H', 'Content-Type: application/json',
             '-d', f'@{tmp.name}'],
            capture_output=True, timeout=60
        )
    finally:
        os.unlink(tmp.name)
    text = r.stdout.decode('utf-8')
    if not text.strip():
        raise RuntimeError(f'Write failed for {rng}')
    return json.loads(text)


# --- classify_page_type (copied from map_page_type.py to avoid import stdout issue) ---

def classify_page_type(keyword, topic, entity, subtopic, content_role, intent, comp_matched):
    kw = keyword.lower().strip()
    cr = content_role.strip() if content_role else ''
    tp = topic.strip() if topic else ''
    ent = entity.strip() if entity else ''
    sub = subtopic.strip() if subtopic else ''
    intnt = intent.strip() if intent else ''

    # Rule 1: Content Role direct mappings
    if 'Local SEO' in cr:
        return 'Local SEO Page'
    if 'Tool / Quiz' in cr or 'Quiz' in cr:
        return 'Tool / Quiz Page'
    if 'Product' in cr and 'Category' not in cr:
        return 'Product Page'
    if cr == 'Hub' or cr == 'Guide Index / Hub':
        return 'Category Hub Page'
    if 'Category Page' in cr and 'Collection' not in cr:
        return 'Category Hub Page'
    if 'Collection / Guide' in cr or 'Entity Page / Collection' in cr:
        return 'Category Hub Page'
    if 'Delete' in cr:
        return '(Skip)'

    # Rule 2: Topic Pillar + Entity pattern matching
    if tp == 'Crystals':
        crystal_names = ['amethyst', 'rose quartz', 'citrine', 'clear quartz', 'black tourmaline',
                         'selenite', 'carnelian', 'labradorite', 'obsidian', 'moonstone',
                         'lapis lazuli', ' aventurine', 'jasper', 'agate', 'fluorite',
                         'howlite', 'malachite', 'tourmaline', 'garnet', 'peridot',
                         'rhodonite', 'bloodstone', 'calcite', 'carnelian', 'pyrite',
                         'tiger', 'sodalite', 'aquamarine', 'hematite', 'chalcedony']
        if any(c in kw for c in crystal_names) and ('meaning' in kw or 'properties' in kw or 'healing' in kw or 'benefits' in kw):
            return 'Crystal Single Page'
        if 'for anxiety' in kw or 'for sleep' in kw or 'for protection' in kw or \
           'for love' in kw or 'for luck' in kw or 'for wealth' in kw or \
           'for depression' in kw or 'for stress' in kw or 'for healing' in kw or \
           'crystals for' in kw:
            return 'Crystals by Condition Page'
        if 'chakra' in kw:
            return 'Crystals by Chakra Page'
        if any(z in kw for z in ['zodiac', 'aries', 'taurus', 'gemini', 'cancer', 'leo',
                                  'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn',
                                  'aquarius', 'pisces']):
            return 'Crystals by Zodiac Page'
        if any(c in kw for c in ['black crystal', 'white crystal', 'pink crystal', 'green crystal',
                                  'blue crystal', 'red crystal', 'purple crystal', 'yellow crystal',
                                  'orange crystal', 'crystal color']):
            return 'Crystals by Color Page'
        if 'shop' in kw or 'buy' in kw or 'store' in kw or 'online' in kw:
            return 'Shop by Stone Page'
        if 'gift' in kw or 'bracelet' in kw or 'necklace' in kw or 'jewelry' in kw or 'ring' in kw:
            return 'Product Page'
        if 'guide' in kw or 'index' in kw or 'list' in kw or 'a to z' in kw or 'types of' in kw:
            return 'Crystal Guide Index Page'
        if ent in ('Quartz', 'Amethyst', 'Rose Quartz', 'Citrine', 'Selenite', 'Black Tourmaline',
                    'Moonstone', 'Labradorite', 'Carnelian', 'Obsidian', 'Lapis Lazuli',
                    'Aventurine', 'Jasper', 'Tourmaline', 'Malachite', 'Pyrite'):
            return 'Crystal Single Page'
        return 'Blog Article'

    if tp == 'Chakra':
        if any(ch in kw for ch in ['root chakra', 'muladhara', 'heart chakra', 'anahata',
                                    'throat chakra', 'vishuddha', 'third eye', 'ajna',
                                    'sacral chakra', 'svadhisthana', 'crown chakra', 'sahasrara',
                                    'solar plexus', 'manipura']):
            return 'Crystals by Chakra Page'
        if 'crystal' in kw or 'stone' in kw or 'bracelet' in kw:
            return 'Crystals by Chakra Page'
        if 'test' in kw or 'quiz' in kw or 'chart' in kw:
            return 'Tool / Quiz Page'
        if 'balancing' in kw or 'alignment' in kw or 'healing' in kw or 'meditation' in kw:
            return 'Crystals by Chakra Page'
        return 'Blog Article'

    if tp == 'Zodiac':
        if 'chinese zodiac' in kw or 'chinese astrology' in kw or 'year of the' in kw:
            return 'Chinese Zodiac Page'
        if 'compatibility' in kw or 'match' in kw or 'pair' in kw or (' and ' in kw and any(
                z in kw for z in ['aries','taurus','gemini','cancer','leo','virgo',
                                  'libra','scorpio','sagittarius','capricorn','aquarius','pisces'])):
            return 'Zodiac Compatibility Page'
        if any(z in kw for z in ['aries','taurus','gemini','cancer','leo','virgo',
                                  'libra','scorpio','sagittarius','capricorn','aquarius','pisces']):
            if 'crystal' in kw or 'stone' in kw:
                return 'Crystals by Zodiac Page'
            if 'horoscope' in kw:
                return 'Horoscope Page'
            return 'Zodiac Sign Page'
        if 'horoscope' in kw or 'daily ' in kw or 'monthly ' in kw or 'weekly ' in kw:
            return 'Horoscope Page'
        if 'dates' in kw or 'signs' in kw or 'all zodiac' in kw:
            return 'Zodiac Sign Page'
        if 'cusp' in kw:
            return 'Zodiac Sign Page'
        return 'Blog Article'

    if tp == 'Astrology':
        if 'chinese zodiac' in kw or 'chinese astrology' in kw or 'year of the' in kw:
            return 'Chinese Zodiac Page'
        if 'natal chart' in kw or 'birth chart' in kw:
            return 'Birth Chart Page'
        if 'house' in kw and ('astrology' in kw or 'meaning' in kw):
            return 'Astrology Guide Page'
        if 'rising sign' in kw or 'moon sign' in kw or 'sun sign' in kw or 'venus sign' in kw or 'mars sign' in kw:
            return 'Astrology Guide Page'
        if 'compatibility' in kw:
            return 'Zodiac Compatibility Page'
        if any(z in kw for z in ['aries','taurus','gemini','cancer','leo','virgo',
                                  'libra','scorpio','sagittarius','capricorn','aquarius','pisces']):
            if 'crystal' in kw or 'stone' in kw:
                return 'Crystals by Zodiac Page'
            return 'Zodiac Sign Page'
        if 'horoscope' in kw:
            return 'Horoscope Page'
        if 'retrograde' in kw or 'mercury' in kw or 'eclipse' in kw or 'transit' in kw:
            return 'Astrology Guide Page'
        if 'calculator' in kw or 'chart calculator' in kw or 'find' in kw:
            return 'Calculator Page'
        return 'Astrology Guide Page'

    if tp == 'Tarot':
        if 'reading' in kw or 'interpretation' in kw:
            return 'Tarot Reading Guide Page'
        if 'spread' in kw:
            return 'Tarot Spread Page'
        if 'major arcana' in kw or 'minor arcana' in kw:
            return 'Tarot Card Page'
        tarot_cards = ['the fool', 'the magician', 'the high priestess', 'the empress', 'the emperor',
                       'the hierophant', 'the lovers', 'the chariot', 'strength', 'the hermit',
                       'wheel of fortune', 'justice', 'the hanged man', 'death', 'temperance',
                       'the devil', 'the tower', 'the star', 'the moon', 'the sun',
                       'judgement', 'the world',
                       'swords', 'cups', 'wands', 'pentacles', 'page of', 'knight of',
                       'queen of', 'king of', 'ace of', 'two of', 'three of', 'four of',
                       'five of', 'six of', 'seven of', 'eight of', 'nine of', 'ten of']
        if any(t in kw for t in tarot_cards):
            return 'Tarot Card Page'
        if 'online' in kw or 'free' in kw or 'generator' in kw:
            return 'Tool / Quiz Page'
        return 'Blog Article'

    if tp == 'Angel Numbers':
        if re.search(r'\b\d{3,4}\b', kw):
            return 'Angel Number Page'
        if 'angel number' in kw:
            return 'Angel Number Page'
        return 'Blog Article'

    if tp == 'Numerology':
        if 'calculator' in kw or 'compute' in kw:
            return 'Calculator Page'
        if 'life path' in kw or 'destiny number' in kw or 'soul number' in kw:
            return 'Numerology Page'
        if 'house' in kw or 'address' in kw or 'phone' in kw:
            return 'Numerology Page'
        if 'number ' in kw and ('meaning' in kw or 'significance' in kw):
            return 'Numerology Page'
        if 'name' in kw:
            return 'Numerology Page'
        return 'Blog Article'

    if tp == 'Moon Phases':
        if 'calendar' in kw or 'schedule' in kw or 'dates' in kw:
            return 'Moon Phase Page'
        if 'full moon' in kw or 'new moon' in kw:
            return 'Moon Phase Page'
        if 'ritual' in kw or 'spell' in kw or 'manifest' in kw:
            return 'Moon Phase Page'
        if 'waxing' in kw or 'waning' in kw or 'crescent' in kw or 'gibbous' in kw:
            return 'Moon Phase Page'
        return 'Blog Article'

    if tp == 'Meditation':
        if 'app' in kw or 'youtube' in kw or 'video' in kw or 'music' in kw or 'sound' in kw:
            return 'Meditation Guide Page'
        if 'guide' in kw or 'how to' in kw or 'technique' in kw or 'beginner' in kw:
            return 'Meditation Guide Page'
        if 'script' in kw or 'guided' in kw:
            return 'Meditation Guide Page'
        if 'sleep' in kw or 'morning' in kw or 'anxiety' in kw or 'stress' in kw:
            return 'Meditation Guide Page'
        return 'Blog Article'

    if tp == 'Spirituality':
        if 'spiritual meaning' in kw or 'meaning of' in kw:
            return 'Spiritual Guide Page'
        if 'awakening' in kw or 'enlighten' in kw:
            return 'Spiritual Guide Page'
        if 'cleansing' in kw or 'protection' in kw or 'healing' in kw:
            return 'Spiritual Guide Page'
        if 'crystal' in kw or 'stone' in kw:
            return 'Crystals by Condition Page'
        if 'prayer' in kw or 'mantra' in kw or 'chant' in kw:
            return 'Spiritual Guide Page'
        return 'Blog Article'

    if tp == 'Feng Shui':
        if 'bedroom' in kw or 'living room' in kw or 'kitchen' in kw or 'bathroom' in kw:
            return 'Feng Shui Guide Page'
        if 'bagua' in kw or 'compass' in kw:
            return 'Feng Shui Guide Page'
        if 'color' in kw or 'element' in kw or 'water' in kw or 'plant' in kw:
            return 'Feng Shui Guide Page'
        if 'door' in kw or 'window' in kw or 'mirror' in kw:
            return 'Feng Shui Guide Page'
        return 'Blog Article'

    if tp == 'Palmistry':
        if 'line' in kw or 'palm reading' in kw or 'hand reading' in kw:
            return 'Palmistry Guide Page'
        if 'mount' in kw or 'finger' in kw or 'thumb' in kw:
            return 'Palmistry Guide Page'
        return 'Blog Article'

    # Rule 3: Intent supplement
    if 'Transactional' in intnt and 'Commercial' not in intnt:
        return 'Product Page'

    # Rule 4: Fallback
    return 'Blog Article'


def main():
    token = get_token()

    # Read gap rows A-K
    print('[READ] Loading gap rows A-K from Seed-Master ...')
    gap_rows = []
    for start in range(GAP_START, GAP_END + 1, 500):
        end = min(start + 499, GAP_END)
        rng = f'{SHEET}!A{start}:K{end}'
        enc = urllib.parse.quote(rng)
        url = f'https://sheets.googleapis.com/v4/spreadsheets/{SS}/values/{enc}'
        r = subprocess.run(
            ['curl', '-s', '--proxy', PROXY, url,
             '-H', f'Authorization: Bearer {token}'],
            capture_output=True, timeout=30
        )
        text = r.stdout.decode('utf-8')
        if not text.strip():
            print(f'  WARNING: Empty response for {rng}')
            continue
        batch = json.loads(text).get('values', [])
        gap_rows.extend(batch)
        print(f'  {rng} -> {len(batch)} rows')

    print(f'  Total gap rows loaded: {len(gap_rows)}')

    if not gap_rows:
        print('[DONE] No gap rows found, nothing to fix.')
        return

    # Classify
    print('[CLASSIFY] Mapping Page Types for gap rows ...')
    results = []
    for r in gap_rows:
        kw = r[0] if len(r) > 0 else ''
        topic = r[2] if len(r) > 2 else ''
        entity = r[3] if len(r) > 3 else ''
        subtopic = r[4] if len(r) > 4 else ''
        content_role = r[5] if len(r) > 5 else ''
        intent = r[10] if len(r) > 10 else ''
        pt = classify_page_type(kw, topic, entity, subtopic, content_role, intent, '')
        results.append(pt)

    dist = Counter(results)
    print('  Distribution:')
    for pt, cnt in dist.most_common():
        print(f'    {pt}: {cnt}')

    # Write back in batches
    print('[WRITE] Writing Page Types to column X ...')
    BATCH_SIZE = 500
    total = 0
    for i in range(0, len(results), BATCH_SIZE):
        batch = [[pt] for pt in results[i:i + BATCH_SIZE]]
        row_start = GAP_START + i
        row_end = row_start + len(batch) - 1
        rng = f'{SHEET}!X{row_start}:X{row_end}'
        r = api_put(rng, batch, token)
        cells = r.get('updatedCells', 0)
        total += cells
        print(f'  {rng} -> {cells} cells')

    print(f'[DONE] Total written: {total} cells')


if __name__ == '__main__':
    main()
