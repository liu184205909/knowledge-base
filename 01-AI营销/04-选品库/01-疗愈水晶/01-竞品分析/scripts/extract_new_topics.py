"""
Extract Dreams / Enneagram / Animal Symbolism keywords from TopKeywords_All,
deduplicate against existing Seed-Master, and create 3 new Seed-* staging sheets.

Output: Seed-Dreams, Seed-Enneagram, Seed-Animal-Symbolism in SEMrush-Seed-Keywords spreadsheet.
"""

import json
import os
import re
import subprocess
import sys
import time
import urllib.parse

TOKEN_FILE = os.path.expanduser('~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json')
PROXY = 'http://127.0.0.1:10808'
BANG = chr(33)  # ! character to avoid Python escape warnings

# Spreadsheet IDs
TK_SS = '18CqR8GzvsonO5zYUaodDPB3oiIcdjdeCVJZn5BaPJng'  # SEMrush-Top-Keywords
SEED_SS = '1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc'  # SEMrush-Seed-Keywords

# New topic rules (same as in generate_topic_discovery.py)
NEW_TOPIC_RULES = {
    'Dreams': {
        'compound': ['dream interpretation', 'dream meaning', 'dream dictionary',
                      'lucid dream', 'lucid dreaming', 'dream catcher', 'dream catchers'],
        'words': ['dream', 'dreams', 'dreaming', 'dreamed', 'nightmare', 'nightmares', 'asleep'],
    },
    'Enneagram': {
        'compound': ['enneagram test', 'enneagram quiz', 'enneagram type',
                      'enneagram personality'],
        'words': ['enneagram'],
    },
    'Animal Symbolism': {
        'compound': ['animal totem', 'power animal', 'totem animal', 'animal spirit guide'],
        'words': ['butterfly', 'hummingbird', 'raven', 'crow', 'wolf', 'dragon', 'snake',
                  'spider', 'owl', 'deer', 'fox', 'bear', 'hawk', 'eagle', 'dolphin',
                  'moth', 'ladybug', 'horse', 'creature', 'creatures', 'mythical'],
    },
}

# Sheet names for new topics
SHEET_NAMES = {
    'Dreams': 'Seed-Dreams',
    'Enneagram': 'Seed-Enneagram',
    'Animal Symbolism': 'Seed-Animal-Symbolism',
}

# Column structure for new Seed-* sheets (matching existing Seed-* format)
SEED_HEADER = ['Keyword', 'Status', 'Topic Pillar', 'Entity', 'Subtopic',
               'Content Role', 'Volume', 'KD', 'CPC', 'Number of Results',
               'Intent', 'Competitor Keyword Matched', 'Competitor Match Count',
               'Source Count', 'Best Competitor Source', 'Best Competitor URL',
               'Best Keyword Traffic', 'Best Traffic %', 'Best Page Traffic',
               'Best Page Traffic %', 'Best Page Top Keyword', 'Best Page Intent',
               'Evidence Updated At', 'Recommended Page Type']


def get_token():
    cred = json.load(open(TOKEN_FILE, encoding='utf-8'))
    return cred['token']


def api_get(path, token):
    url = 'https://sheets.googleapis.com' + path
    r = subprocess.run(['curl', '-s', '--proxy', PROXY, url,
                        '-H', 'Authorization: Bearer ' + token],
                       capture_output=True, timeout=60)
    text = r.stdout.decode('utf-8')
    if not text.strip():
        return {}
    return json.loads(text)


def api_post(path, token, body, method='POST'):
    url = 'https://sheets.googleapis.com' + path
    tmp = os.path.join(os.environ.get('TEMP', '/tmp'), '_seed_write.json')
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(body, f)
    r = subprocess.run(['curl', '-s', '--proxy', PROXY, '-X', method,
                        url, '-H', 'Authorization: Bearer ' + token,
                        '-H', 'Content-Type: application/json',
                        '-d', '@' + tmp],
                       capture_output=True, timeout=60)
    text = r.stdout.decode('utf-8')
    stderr_text = r.stderr.decode('utf-8') if r.stderr else ''
    if not text.strip():
        if stderr_text.strip():
            print(f'  [WARN] Empty stdout, stderr: {stderr_text[:200]}')
        return {}
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        print(f'  [WARN] Non-JSON response: {text[:300]}')
        return {}


def read_all_rows(ss_id, sheet, range_str, batch=5000):
    """Read all rows from a sheet in batches."""
    all_rows = []
    start = 1
    while True:
        rng = sheet + BANG + range_str.format(start=start, end=start + batch - 1)
        enc = urllib.parse.quote(rng)
        path = '/v4/spreadsheets/' + ss_id + '/values/' + enc
        data = api_get(path, token)
        rows = data.get('values', [])
        if not rows:
            break
        all_rows.extend(rows)
        if len(rows) < batch:
            break
        start += batch
        print(f'  ... read {len(all_rows)} rows so far')
    return all_rows


def classify_topic(keyword):
    """Classify a keyword into one of the new topics (or None)."""
    kw_lower = keyword.lower()

    # Check in priority order: Dreams, Enneagram, Animal Symbolism
    for topic, rules in NEW_TOPIC_RULES.items():
        # Check compound triggers first
        for trigger in rules['compound']:
            if trigger in kw_lower:
                return topic
        # Check word triggers
        words = kw_lower.split()
        for trigger in rules['words']:
            if trigger in words:
                return topic
    return None


def dedup_keyword(kw):
    """Normalize keyword for dedup."""
    return kw.lower().strip()


# ============================================================
# Main
# ============================================================
token = get_token()
print(f'Token loaded')

# Step 1: Read TopKeywords_All
print('\n[Step 1] Reading TopKeywords_All...')

# Read header first
header_data = api_get(
    '/v4/spreadsheets/' + TK_SS + '/values/' + urllib.parse.quote('TopKeywords_All' + BANG + 'A1:K1'),
    token
)
header = header_data.get('values', [[]])[0] if header_data.get('values') else []
print(f'  Columns: {header}')

# Read data rows in batches (only column A for keyword, G for volume, H for KD, I for CPC)
# We only need: A (keyword), G (volume), H (KD), I (CPC), F (url), G (source)
# Actually let's just read A-K to match TopKeywords_All structure
all_data_rows = []
for batch_start in range(2, 50000, 5000):
    batch_end = batch_start + 4999
    rng = 'TopKeywords_All' + BANG + f'A{batch_start}:K{batch_end}'
    enc = urllib.parse.quote(rng)
    path = '/v4/spreadsheets/' + TK_SS + '/values/' + enc
    data = api_get(path, token)
    rows = data.get('values', [])
    if not rows:
        break
    all_data_rows.extend(rows)
    print(f'  ... read {len(all_data_rows)} rows so far')
    if len(rows) < 5000:
        break

data_rows = all_data_rows
print(f'  Total data rows: {len(data_rows)}')

# Build keyword -> row data mapping
# TopKeywords_All actual columns:
# [0] Keyword, [1] Search Volume, [2] Keyword Difficulty, [3] CPC, [4] URL,
# [5] Traffic, [6] Traffic(%), [7] Number of Results, [8] Keyword Intents,
# [9] source_sheet, [10] normalized_url
keyword_data = {}  # normalized_kw -> {raw_kw, volume, kd, cpc, source, url, intent}
for row in data_rows:
    if not row or not row[0].strip():
        continue
    raw_kw = row[0].strip()
    norm_kw = dedup_keyword(raw_kw)
    if norm_kw in keyword_data:
        existing_vol = keyword_data[norm_kw].get('volume', 0)
        new_vol = int(row[1]) if len(row) > 1 and str(row[1]).isdigit() else 0
        if new_vol > existing_vol:
            keyword_data[norm_kw] = {
                'raw_kw': raw_kw,
                'volume': new_vol,
                'kd': int(row[2]) if len(row) > 2 and str(row[2]).isdigit() else 0,
                'cpc': float(row[3]) if len(row) > 3 and row[3] else 0,
                'source': row[9] if len(row) > 9 else '',
                'url': row[4] if len(row) > 4 else '',
                'intent': row[8] if len(row) > 8 else '',
            }
    else:
        keyword_data[norm_kw] = {
            'raw_kw': raw_kw,
            'volume': int(row[1]) if len(row) > 1 and str(row[1]).isdigit() else 0,
            'kd': int(row[2]) if len(row) > 2 and str(row[2]).isdigit() else 0,
            'cpc': float(row[3]) if len(row) > 3 and row[3] else 0,
            'source': row[9] if len(row) > 9 else '',
            'url': row[4] if len(row) > 4 else '',
            'intent': row[8] if len(row) > 8 else '',
        }

print(f'  Unique keywords: {len(keyword_data):,}')

# Step 2: Read Seed-Master for dedup
print('\n[Step 2] Reading Seed-Master for dedup...')
sm_keywords = set()
for start in range(2, 50000, 5000):
    end = start + 4999
    rng = 'Seed-Master' + BANG + f'A{start}:A{end}'
    enc = urllib.parse.quote(rng)
    path = '/v4/spreadsheets/' + SEED_SS + '/values/' + enc
    data = api_get(path, token)
    for row in data.get('values', []):
        if row:
            sm_keywords.add(dedup_keyword(row[0]))
print(f'  Seed-Master unique keywords: {len(sm_keywords):,}')

# Step 3: Classify new topic keywords
print('\n[Step 3] Classifying keywords into new topics...')
topic_keywords = {t: [] for t in NEW_TOPIC_RULES}
overlap_count = 0

for norm_kw, kw_data in keyword_data.items():
    topic = classify_topic(kw_data['raw_kw'])
    if topic:
        if norm_kw in sm_keywords:
            overlap_count += 1
        else:
            topic_keywords[topic].append((norm_kw, kw_data))

# Sort by volume within each topic
for topic in topic_keywords:
    topic_keywords[topic].sort(key=lambda x: -x[1]['volume'])

print(f'\n  Classification results (after Seed-Master dedup):')
for topic, kws in topic_keywords.items():
    total_vol = sum(kw['volume'] for _, kw in kws)
    print(f'    {topic}: {len(kws):,} new keywords, {total_vol:,.0f} volume')
print(f'  Overlap with Seed-Master: {overlap_count:,}')

# Step 4: Create Seed-* sheets
print('\n[Step 4] Creating Seed-* staging sheets...')

for topic, kws in topic_keywords.items():
    sheet_name = SHEET_NAMES[topic]
    if not kws:
        print(f'  {sheet_name}: 0 keywords, skipping')
        continue

    # Check if sheet already exists
    sheets_data = api_get(f'/v4/spreadsheets/{SEED_SS}?fields=sheets.properties(title,sheetId)', token)
    existing_sheets = {s['properties']['title']: s['properties']['sheetId']
                       for s in sheets_data.get('sheets', [])}

    if sheet_name in existing_sheets:
        print(f'  {sheet_name} already exists (id={existing_sheets[sheet_name]}), will write data')
    else:
        # Create sheet
        print(f'  Creating {sheet_name}...')
        result = api_post(f'/v4/spreadsheets/{SEED_SS}:batchUpdate', token, {
            'requests': [{'addSheet': {'properties': {'title': sheet_name}}}]
        })
        new_sheet_id = result['replies'][0]['addSheet']['properties']['sheetId']
        print(f'    Created sheet id={new_sheet_id}')

    # Write header + data
    rows_to_write = [SEED_HEADER]
    for norm_kw, kw_data in kws:
        rows_to_write.append([
            kw_data['raw_kw'],   # A: Keyword
            'Keep',               # B: Status (auto-approved from competitor data)
            topic,                # C: Topic Pillar
            '',                   # D: Entity (to be filled by update_seed_structure.py)
            '',                   # E: Subtopic
            '',                   # F: Content Role
            str(kw_data['volume']),  # G: Volume
            str(kw_data['kd']),      # H: KD
            str(kw_data['cpc']),     # I: CPC
            '',                   # J: Number of Results
            '',                   # K: Intent
            'No',                 # L: Competitor Keyword Matched (will be updated by track_d)
            '0',                  # M: Competitor Match Count
            '1',                  # N: Source Count
            kw_data['source'],    # O: Best Competitor Source
            kw_data['url'],       # P: Best Competitor URL
            str(kw_data['volume']),  # Q: Best Keyword Traffic
            '',                   # R: Best Traffic %
            '',                   # S: Best Page Traffic
            '',                   # T: Best Page Traffic %
            kw_data['raw_kw'],    # U: Best Page Top Keyword
            '',                   # V: Best Page Intent
            time.strftime('%Y-%m-%d'),  # W: Evidence Updated At
            '',                   # X: Recommended Page Type (to be filled by map_page_type.py)
        ])

    print(f'    Writing {len(rows_to_write) - 1} keywords...')

    # Write header first (PUT to A1:X1, within default grid)
    enc_header = urllib.parse.quote(sheet_name + BANG + 'A1:X1')
    api_post(
        f'/v4/spreadsheets/{SEED_SS}/values/{enc_header}?valueInputOption=USER_ENTERED',
        token,
        {'values': [SEED_HEADER]},
        method='PUT'
    )

    # Write data using append API (auto-expands grid, avoids "exceeds grid limits" error)
    data_rows = rows_to_write[1:]  # Skip header
    BATCH = 200
    total_written = 0
    for batch_start in range(0, len(data_rows), BATCH):
        batch_end = min(batch_start + BATCH, len(data_rows))
        batch_rows = data_rows[batch_start:batch_end]

        # Pad to 24 columns
        for row in batch_rows:
            while len(row) < 24:
                row.append('')

        enc = urllib.parse.quote(sheet_name + BANG + 'A:X')
        write_result = api_post(
            f'/v4/spreadsheets/{SEED_SS}/values/{enc}:append'
            f'?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS',
            token,
            {'values': batch_rows}
        )
        updated = write_result.get('updates', {}).get('updatedCells', 0)
        total_written += updated
        print(f'    Batch {batch_start}-{batch_end}: {updated} cells appended')
        time.sleep(0.5)  # Rate limit protection

    print(f'    Total: {total_written} cells ({len(data_rows)} keywords)')

    print(f'  {sheet_name}: DONE ({len(kws)} keywords)')

print('\n[DONE] All new topic sheets created.')
print(f'Next steps:')
print(f'  1. Run update_seed_structure.py to fill Entity/Subtopic/Content Role')
print(f'  2. Run map_page_type.py to fill Recommended Page Type')
print(f'  3. Merge new Seed-* into Seed-Master')
