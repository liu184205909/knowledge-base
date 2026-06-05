#!/usr/bin/env python3
"""Fetch Page Type distribution from Seed-Master v3 for 2B update."""
import sys, io, json, os, subprocess, urllib.parse
from collections import defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

CRED = os.path.expanduser('~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json')
PROXY = 'http://127.0.0.1:10808'
SS_SEED = '1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc'

def get_token():
    return json.load(open(CRED, encoding='utf-8'))['token']

def api_get(url):
    r = subprocess.run(['curl', '-s', '--proxy', PROXY, url,
                        '-H', f'Authorization: Bearer {get_token()}'],
                       capture_output=True, timeout=120)
    return json.loads(r.stdout.decode('utf-8'))

def main():
    enc = urllib.parse.quote('Seed-Master' + chr(33) + 'A1:X')
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{SS_SEED}/values/{enc}'
    data = api_get(url)
    rows = data.get('values', [])
    header = rows[0] if rows else []

    # Column indices
    KW_COL = 0       # A: Keyword
    VOL_COL = 6      # G: Volume
    TOPIC_COL = 2    # C: Topic Pillar
    ENTITY_COL = 3   # D: Entity
    PT_COL = 23      # X: Recommended Page Type
    MATCH_COL = 11   # L: Competitor Keyword Matched

    # Group by Page Type
    pt_data = defaultdict(lambda: {'keywords': 0, 'volume': 0, 'entities': set(), 'matched': 0, 'topics': set()})

    for row in rows[1:]:
        pt = row[PT_COL] if len(row) > PT_COL else 'Unknown'
        vol = 0
        try:
            vol = int(float(str(row[VOL_COL]).replace(',', '')))
        except:
            pass
        entity = row[ENTITY_COL] if len(row) > ENTITY_COL else ''
        topic = row[TOPIC_COL] if len(row) > TOPIC_COL else ''
        matched = row[MATCH_COL] if len(row) > MATCH_COL else ''

        d = pt_data[pt]
        d['keywords'] += 1
        d['volume'] += vol
        d['entities'].add(entity)
        if matched == 'Yes':
            d['matched'] += 1
        if topic:
            d['topics'].add(topic)

    # Sort by volume desc
    sorted_pts = sorted(pt_data.items(), key=lambda x: -x[1]['volume'])

    print(f'Total Page Types: {len(sorted_pts)}')
    print(f'Total keywords: {sum(d["keywords"] for _, d in sorted_pts)}')
    print(f'Total volume: {sum(d["volume"] for _, d in sorted_pts):,}')
    print()

    print('| # | Page Type | Keywords | Volume | Entities | Matched | Topics |')
    print('|---|-----------|----------|--------|----------|---------|--------|')
    for i, (pt, d) in enumerate(sorted_pts, 1):
        entities_str = str(len(d['entities']))
        topics_str = ', '.join(sorted(d['topics']))
        print(f'| {i} | {pt} | {d["keywords"]:,} | {d["volume"]:,} | {entities_str} | {d["matched"]:,} | {topics_str} |')

    # Also list existing 2B page types for cross-reference
    existing_2b = [
        'Home', 'About Us', 'Contact', 'FAQ', 'Product Detail',
        'Crystal Guide Index', 'Shop by Stone', 'Ethical Sourcing',
        'Crystal Single', 'Intention Category', 'Crystals by Condition',
        'Crystals by Zodiac', 'Crystals by Chakra', 'Crystals by Color',
        'Crystal Quiz', 'Blog', 'Mystery Crystal Box', 'Moon Calendar',
        'Crystal Oracle', 'Free Resources', 'Birthstone Finder', 'Chakra Test',
        'Crystals by Element', 'Angel Numbers', 'MBTI×Crystals',
        'Zodiac Compatibility', 'Subscription Box',
        'Bracelet Size Calculator', 'Crystal Meaning Search',
        'Crystal Compatibility Checker', 'Crystal Cleansing Timer',
    ]

    print()
    print('=== New PTs not in existing 2B ===')
    existing_lower = {e.lower() for e in existing_2b}
    for pt, d in sorted_pts:
        # Simple matching: check if PT name relates to any existing 2B entry
        pt_lower = pt.lower()
        matched_existing = False
        for ex in existing_lower:
            if ex in pt_lower or pt_lower in ex:
                matched_existing = True
                break
        if not matched_existing:
            print(f'  NEW: {pt} ({d["keywords"]} kw, {d["volume"]:,} vol, {len(d["entities"])} entities)')

if __name__ == '__main__':
    main()
