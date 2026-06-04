"""
Generate Topic-Discovery from TopKeywords_All (L1/L2 hierarchy).
Reads all filtered keywords, assigns each to an L1 topic,
then clusters into L2 sub-topics by word frequency (weighted by volume).

Output columns:
  L1 Topic | L2 Topic | Keywords Count | Total Volume | Avg KD | Avg CPC |
  Top Keywords | Competitors | confirmed_action | notes
"""

import json
import re
import sys
import time
import urllib.request
import urllib.parse
from collections import defaultdict

TOKEN_FILE = r'C:\Users\Dylan\.google_workspace_mcp\credentials\lzn184205909@gmail.com.json'
PROXY = 'http://127.0.0.1:10808'

TOP_KEYWORDS_ID = '18CqR8GzvsonO5zYUaodDPB3oiIcdjdeCVJZn5BaPJng'

# Stop words to exclude from L2 topic extraction
STOP_WORDS = {
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'shall', 'not', 'no', 'nor',
    'it', 'its', 'this', 'that', 'these', 'those', 'my', 'your', 'his',
    'her', 'their', 'our', 'me', 'you', 'him', 'them', 'us', 'what',
    'which', 'who', 'whom', 'when', 'where', 'why', 'how', 'all', 'each',
    'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'than',
    'too', 'very', 'just', 'about', 'above', 'after', 'again', 'against',
    'between', 'into', 'through', 'during', 'before', 'below', 'up', 'down',
    'out', 'off', 'over', 'under', 'only', 'own', 'same', 'so', 'then',
    'also', 'if', 'any', 'like', 'there', 'here', 'many', 'much', 'well',
    'best', 'top', 'good', 'great', 'new', 'old', 'big', 'small', 'make',
    'get', 'know', 'see', 'use', 'find', 'give', 'tell', 'work', 'call',
    'try', 'ask', 'need', 'feel', 'become', 'leave', 'mean', 'look',
    'want', 'help', 'go', 'come', 'take', 'think', 'say', 'thing', 'things',
    'way', 'ways', 'one', 'two', 'three', 'four', 'five', 'first', 'last',
    'long', 'day', 'days', 'time', 'times', 'year', 'years', 'people',
    'man', 'woman', 'men', 'women', 'world', 'life', 'right', 'left',
    'still', 'now', 'back', 'even', 'part', 'place', 'case', 'week',
    'point', 'home', 'water', 'room', 'area', 'money', 'story', 'fact',
    'month', 'lot', 'study', 'book', 'eye', 'eyes', 'job', 'word',
    'line', 'end', 'member', 'law', 'hand', 'high', 'head', 'side',
    'kind', 'house', 'service', 'friend', 'father', 'power', 'hour',
    'game', 'set', 'night', 'car', 'city', 'community', 'name', 'team',
    'minute', 'idea', 'body', 'information', 'child', 'children',
    'together', 'follow', 'photo', 'start', 'student', 'group', 'country',
    'problem', 'turn', 'real', 'kid', 'question', 'different', 'important',
    'another', 'without', 'around', 'always',
}

# ============================================================
# L1 Topic Rules — checked in priority order (first match wins)
# Each rule: (L1_name, compound_triggers, word_triggers)
# ============================================================
L1_RULES = [
    ('Angel Numbers',
     ['angel number', 'angel numbers', '11:11', '12:12', '10:10', '1:11', '2:22', '3:33', '4:44', '5:55',
      'life path number', 'life path', '1234'],
     ['angel', 'angels', 'archangel', 'numerology', 'number']),

    ('Crystals',
     ['rose quartz', 'black tourmaline', 'clear quartz', 'lapis lazuli',
      'tiger eye', 'tigers eye', 'moon stone', 'petrified wood', 'apache tears',
      'blue apatite', 'green aventurine', 'blue lace agate', 'snowflake obsidian',
      'herkimer diamond', 'red jasper', 'yellow jasper', 'fancy jasper',
      'picasso jasper', 'zebra stone', 'palm stone', 'worry stone',
      'crystal grid', 'crystal grids', 'crystal skull', 'crystal skulls',
      'red tigers eye', 'blue tigers eye', 'blood stone', 'cubic zirconia'],
     ['crystal', 'crystals', 'quartz', 'amethyst', 'tourmaline', 'jade',
      'gemstone', 'gemstones', 'agate', 'opal', 'topaz', 'garnet', 'peridot',
      'onyx', 'beryl', 'citrine', 'selenite', 'fluorite', 'obsidian',
      'labradorite', 'moonstone', 'bloodstone', 'carnelian', 'howlite',
      'malachite', 'pyrite', 'shungite', 'aventurine', 'geode', 'geodes',
      'tumbled', 'lapis', 'rhodonite', 'apophyllite', 'chalcedony', 'jasper',
      'calcite', 'celestite', 'dumortierite', 'kyanite', 'morganite',
      'rhodochrosite', 'sugilite', 'tanzanite', 'kunzite', 'prehnite',
      'charoite', 'dioptase', 'moldavite', 'lepidolite', 'sodalite',
      'unakite', 'emerald', 'ruby', 'sapphire', 'aquamarine',
      'healing stone', 'stones', 'stone', 'gems',
      'hematite', 'apatite', 'amazonite', 'turquoise', 'sunstone', 'larimar',
      'serpentine', 'pearl', 'pearls', 'diamond', 'chrysocolla', 'petrified',
      'aragonite', 'tiger', 'tigers', 'birthstone', 'birthstones',
      # — Batch 3: from Other deep-dive (noise bucket stone names) —
      'abalone', 'goldstone', 'azurite', 'angelite', 'gabbro', 'druzy',
      'peacock', 'sardonyx', 'copal', 'orgonite', 'dolomite', 'stibnite',
      'nuummite', 'shattuckite', 'chlorite', 'heishi', 'rhyolite',
      'charoite', 'variscite', 'sphalerite', 'zeolite']),

    ('Tarot',
     ['tarot card', 'tarot cards', 'major arcana', 'minor arcana',
      'tarot reading', 'tarot spread', 'rider waite',
      'yes or no', 'as feelings', 'wheel of fortune', 'high priestess',
      'the hermit', 'the devil', 'the tower', 'the empress', 'the emperor',
      'the magician', 'the lovers', 'the chariot', 'the fool',
      'the hanged man', 'death card', 'judgement card'],
     ['tarot', 'swords', 'cups', 'wands', 'pentacles', 'arcana',
      'card', 'cards', 'deck', 'divination', 'oracle',
      'reversed', 'priestess', 'hierophant', 'chalices', 'coins']),

    ('Astrology',
     ['birth chart', 'birth charts', 'zodiac sign', 'zodiac signs',
      'mercury retrograde', 'rising sign', 'moon sign', 'sun sign',
      'star sign', 'star signs', 'natal chart', 'compatibility chart',
      'what sign is', 'sign and ascendant',
      'december sign', 'january sign', 'february sign', 'march sign',
      'april sign', 'may sign', 'june sign', 'july sign', 'august sign',
      'september sign', 'october sign', 'november sign',
      'fire signs', 'earth signs', 'air signs', 'water signs',
      'fire sign', 'earth sign', 'air sign', 'water sign', 'birth signs'],
     ['zodiac', 'astrology', 'horoscope', 'horoscopes', 'astrological',
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra',
      'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
      'retrograde', 'mercury', 'venus', 'mars', 'jupiter', 'saturn',
      'neptune', 'pluto', 'uranus', 'natal', 'cusp', 'houses',
      'trine', 'square', 'conjunction', 'opposition', 'stellium',
      'transit', 'transits', 'equinox', 'solstice', 'rooster']),

    ('Dreams',
     ['dream interpretation', 'dream meaning', 'dream dictionary',
      'lucid dream', 'lucid dreaming', 'dream catcher', 'dream catchers'],
     ['dream', 'dreams', 'dreaming', 'dreamed', 'nightmare', 'nightmares',
      'asleep']),

    ('Chakras',
     ['root chakra', 'sacral chakra', 'solar plexus', 'heart chakra',
      'throat chakra', 'third eye', 'crown chakra', 'chakra healing',
      'chakra balancing'],
     ['chakra', 'chakras']),

    ('Moon Phases',
     ['new moon', 'full moon', 'moon phase', 'moon phases', 'moon ritual',
      'lunar eclipse', 'solar eclipse', 'supermoon', 'blue moon',
      'blood moon', 'harvest moon', 'wolf moon', 'crescent moon',
      'waxing moon', 'waning moon', 'gibbous moon'],
     ['moonphase', 'lunar']),

    ('Spirituality',
     ['law of attraction', 'sage smudging', 'palo santo', 'sound bath',
      'sound baths', 'reiki healing', 'spirit animal', 'spirit animals',
      'sage smudge', 'twin flame'],
     ['spiritual', 'spirituality', 'meditation', 'meditate', 'mindfulness',
      'manifest', 'manifesting', 'manifestation', 'affirmation', 'affirmations',
      'gratitude', 'intention', 'journaling', 'self-care', 'wellness',
      'healing', 'energy', 'aura', 'vibration', 'frequency', 'consciousness',
      'enlightenment', 'awakening', 'soul', 'sacred', 'divine', 'ritual',
      'smudge', 'smudging', 'sage', 'incense', 'reiki', 'prayer',
      'blessing', 'blessings', 'twin', 'flame',
      # — Batch 3: from Other deep-dive —
      'shadow', 'spirit', 'spirits', 'gaslighting', 'namaste',
      'astral', 'binaural', 'indigo']),

    ('Enneagram',
     ['enneagram test', 'enneagram quiz', 'enneagram type',
      'enneagram personality'],
     ['enneagram']),

    ('Animal Symbolism',
     ['animal totem', 'power animal', 'totem animal', 'animal spirit guide'],
     ['butterfly', 'hummingbird', 'raven', 'crow', 'wolf', 'dragon', 'snake',
      'spider', 'owl', 'deer', 'fox', 'bear', 'hawk', 'eagle', 'dolphin',
      'moth', 'ladybug', 'horse', 'creature', 'creatures', 'mythical']),

    ('I Ching',
     ['i ching', 'iching', 'book of changes'],
     ['hexagram']),

    ('Palmistry',
     ['palm reading', 'palm lines', 'heart line', 'life line', 'head line',
      'fate line', 'mount of venus', 'mount of jupiter'],
     ['palmistry', 'palm']),
]

# Angel number patterns: AAA/AAAA (444), ABAB (1212, 1010), AABB (1122), AA (11, 22)
ANGEL_NUMBER_PATTERNS = [
    re.compile(r'\b(\d)\1{2,3}\b'),       # AAA/AAAA: 111, 444, 1111
    re.compile(r'\b(\d)(\d)\1\2\b'),       # ABAB: 1212, 1010, 1313
    re.compile(r'\b(\d)\1(\d)\2\b'),       # AABB: 1122, 3344
    re.compile(r'\b(\d)\1\b'),             # AA: 11, 22, 33, 44, 55
]


# ============================================================
# API helpers
# ============================================================

def get_token(opener):
    with open(TOKEN_FILE, 'r', encoding='utf-8') as f:
        c = json.load(f)
    if c.get('refresh_token'):
        body = urllib.parse.urlencode({
            'client_id': c['client_id'],
            'client_secret': c['client_secret'],
            'refresh_token': c['refresh_token'],
            'grant_type': 'refresh_token',
        }).encode('utf-8')
        req = urllib.request.Request(
            c.get('token_uri', 'https://oauth2.googleapis.com/token'),
            data=body, headers={'Content-Type': 'application/x-www-form-urlencoded'})
        resp = opener.open(req)
        refreshed = json.loads(resp.read().decode())
        c['token'] = refreshed['access_token']
        c['expiry'] = time.strftime('%Y-%m-%dT%H:%M:%S',
            time.localtime(time.time() + refreshed.get('expires_in', 3600)))
        with open(TOKEN_FILE, 'w', encoding='utf-8') as f:
            json.dump(c, f, ensure_ascii=False, indent=2)
    return c['token']


def get_opener():
    proxy = urllib.request.ProxyHandler({'https': PROXY, 'http': PROXY})
    return urllib.request.build_opener(proxy)


def api_get(url, token, opener):
    req = urllib.request.Request(url, headers={'Authorization': f'Bearer {token}'})
    return json.loads(opener.open(req).read().decode())


def api_post(url, token, opener, data):
    body = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers={
        'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'})
    return json.loads(opener.open(req).read().decode())


def api_put(url, token, opener, data):
    body = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers={
        'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'},
        method='PUT')
    return json.loads(opener.open(req).read().decode())


def to_number(value):
    if value is None:
        return 0.0
    text = str(value).strip().replace(',', '').replace('%', '')
    if not text:
        return 0.0
    try:
        return float(text)
    except ValueError:
        return 0.0


# ============================================================
# L1 / L2 classification
# ============================================================

def classify_l1(keyword):
    """Assign a keyword to its L1 topic. Returns (l1_name, matched_word)."""
    kw_lower = str(keyword or '').lower().strip()
    if not kw_lower:
        return 'Other', ''

    # Special: detect angel number digit patterns (444, 1212, 1122, etc.)
    for pat in ANGEL_NUMBER_PATTERNS:
        m = pat.search(kw_lower)
        if m:
            return 'Angel Numbers', m.group()

    # Check rules in priority order
    for l1_name, compounds, words in L1_RULES:
        # Check compound triggers first (more specific)
        for compound in compounds:
            if compound in kw_lower:
                return l1_name, compound
        # Check word triggers
        tokens = set(re.findall(r'[a-z0-9]+', kw_lower))
        for w in words:
            if w in tokens:
                return l1_name, w

    return 'Other', ''


def extract_l2(keyword, l1_name):
    """Extract L2 sub-topic within an L1 category."""
    kw_lower = str(keyword or '').lower().strip()
    tokens = [w for w in re.findall(r'[a-z0-9]+', kw_lower)
              if w not in STOP_WORDS and len(w) >= 2]
    if not tokens:
        return ''
    return tokens[0]


def main():
    opener = get_opener()
    token = get_token(opener)

    # ==========================================
    # Step 1: Read TopKeywords_All
    # ==========================================
    print('Step 1: Reading TopKeywords_All...')
    sheet = urllib.request.quote('TopKeywords_All', safe='')

    all_keywords = []  # (keyword, volume, kd, cpc, domain)
    batch_size = 10000
    offset = 1

    while True:
        end_row = offset + batch_size - 1
        range_str = f'{sheet}%21A{offset}%3AL{end_row}'
        url = f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KEYWORDS_ID}/values/{range_str}'
        try:
            data = api_get(url, token, opener)
        except Exception as e:
            print(f'  Error reading rows {offset}-{end_row}: {e}')
            break
        values = data.get('values', [])
        if not values:
            break
        for row in values:
            if row and row[0] == 'Keyword':
                continue
            padded = row + [''] * (12 - len(row))
            keyword = padded[0]
            volume = to_number(padded[1])
            kd = to_number(padded[2])
            cpc = to_number(padded[3])
            domain = padded[9] if len(padded) > 9 else ''
            if keyword:
                all_keywords.append((keyword, volume, kd, cpc, domain))
        print(f'  Read {len(all_keywords)} keywords so far...')
        if len(values) < batch_size:
            break
        offset += batch_size

    print(f'  Total keywords read: {len(all_keywords)}')

    # ==========================================
    # Step 2: Classify L1 + extract L2
    # ==========================================
    print('\nStep 2: Classifying L1 + extracting L2...')

    # l1_l2_keywords[(l1, l2)] -> [(keyword, volume, kd, cpc, domain)]
    l1_l2_keywords = defaultdict(list)
    l1_stats = defaultdict(lambda: {'count': 0, 'volume': 0.0})

    for keyword, volume, kd, cpc, domain in all_keywords:
        l1, matched = classify_l1(keyword)
        l2 = extract_l2(keyword, l1)

        l1_l2_keywords[(l1, l2)].append((keyword, volume, kd, cpc, domain))
        l1_stats[l1]['count'] += 1
        l1_stats[l1]['volume'] += volume

    # Filter: keep L2 with >= 5 keywords
    significant = {(l1, l2): kws for (l1, l2), kws in l1_l2_keywords.items()
                   if len(kws) >= 5}

    # Reassign non-significant to (l1, 'Other within L1')
    for (l1, l2), kws in l1_l2_keywords.items():
        if (l1, l2) not in significant:
            significant.setdefault((l1, 'Other'), []).extend(kws)

    # Sort L1 by total volume
    l1_order = sorted(
        set(l1 for l1, l2 in significant.keys()),
        key=lambda l: l1_stats[l]['volume'],
        reverse=True
    )

    # Within each L1, sort L2 by volume
    l2_order = {}
    for l1 in l1_order:
        l2s = [(l2, kws) for (l1_, l2), kws in significant.items() if l1_ == l1]
        l2s.sort(key=lambda x: sum(kw[1] for kw in x[1]), reverse=True)
        l2_order[l1] = l2s

    # Print L1 summary
    print(f'\n  L1 topics ({len(l1_order)}):')
    for l1 in l1_order:
        s = l1_stats[l1]
        l2_count = len(l2_order[l1])
        print(f'    {l1}: {s["count"]} keywords, {s["volume"]:.0f} volume, {l2_count} L2 sub-topics')

    # ==========================================
    # Step 3: Build output rows
    # ==========================================
    print('\nStep 3: Building Topic-Discovery rows...')

    header = ['L1 Topic', 'L2 Topic', 'Keywords Count', 'Total Volume', 'Avg KD',
              'Avg CPC', 'Top Keywords', 'Competitors', 'confirmed_action', 'notes']
    rows = [header]

    for l1 in l1_order:
        for l2, kws in l2_order[l1]:
            kw_count = len(kws)
            total_vol = sum(kw[1] for kw in kws)
            avg_kd = sum(kw[2] for kw in kws) / kw_count if kw_count else 0
            avg_cpc = sum(kw[3] for kw in kws) / kw_count if kw_count else 0

            top_kws = sorted(kws, key=lambda x: -x[1])[:10]
            top_kw_str = ' | '.join(f"{kw[0]} ({kw[1]:.0f})" for kw in top_kws)

            competitors = sorted(set(kw[4] for kw in kws if kw[4]))
            competitors_str = ', '.join(competitors[:20])
            if len(competitors) > 20:
                competitors_str += f' (+{len(competitors)-20} more)'

            rows.append([
                l1,
                l2.title() if l2 != 'Other' else 'Other',
                str(kw_count),
                f'{total_vol:.0f}',
                f'{avg_kd:.1f}',
                f'{avg_cpc:.2f}',
                top_kw_str,
                competitors_str,
                '',  # confirmed_action
                '',  # notes
            ])

    print(f'  Total rows: {len(rows) - 1}')

    # Print top 10 L2 across all L1
    all_l2_flat = []
    for l1 in l1_order:
        for l2, kws in l2_order[l1]:
            all_l2_flat.append((l1, l2, sum(kw[1] for kw in kws), len(kws)))
    all_l2_flat.sort(key=lambda x: -x[2])
    print('\n  Top 10 L2 sub-topics by volume:')
    for i, (l1, l2, vol, cnt) in enumerate(all_l2_flat[:10]):
        print(f'    {i+1}. [{l1}] {l2.title()}: {cnt} keywords, {vol:.0f} volume')

    # ==========================================
    # Step 4: Write to Google Sheets
    # ==========================================
    print(f'\nStep 4: Writing Topic-Discovery ({len(rows)} rows)...')

    # Delete existing Topic-Discovery
    sheets_url = f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KEYWORDS_ID}?fields=sheets.properties(title,sheetId)'
    sheets_data = api_get(sheets_url, token, opener)
    for s in sheets_data['sheets']:
        if s['properties']['title'] == 'Topic-Discovery':
            print(f'  Deleting existing Topic-Discovery...')
            api_post(
                f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KEYWORDS_ID}:batchUpdate',
                token, opener,
                {'requests': [{'deleteSheet': {'sheetId': s['properties']['sheetId']}}]})
            break

    # Create new sheet
    print('  Creating Topic-Discovery worksheet...')
    result = api_post(
        f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KEYWORDS_ID}:batchUpdate',
        token, opener,
        {'requests': [{'addSheet': {'properties': {'title': 'Topic-Discovery'}}}]})
    print(f'  Created sheet id={result["replies"][0]["addSheet"]["properties"]["sheetId"]}')

    # Write data (may need batching for large output)
    td_sheet = urllib.request.quote('Topic-Discovery', safe='')
    put_url = f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KEYWORDS_ID}/values/{td_sheet}%21A1?valueInputOption=RAW'

    if len(rows) <= 5000:
        api_put(put_url, token, opener, {'values': rows})
    else:
        # First batch
        api_put(put_url, token, opener, {'values': rows[:5000]})
        print(f'  Written rows 1-{min(5000, len(rows))} of {len(rows)}')
        # Remaining via append
        remaining = rows[5000:]
        for i in range(0, len(remaining), 3000):
            chunk = remaining[i:i + 3000]
            append_url = (f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KEYWORDS_ID}'
                         f'/values/{td_sheet}%21A%3AA:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS')
            api_post(append_url, token, opener, {'values': chunk})
            print(f'  Written rows {5000 + i + 1}-{5000 + i + len(chunk)} of {len(rows)}')

    # ==========================================
    # Step 5: Reorder worksheets — results first, raw data last
    # ==========================================
    print('\nStep 5: Reordering worksheets (results first)...')
    PRIORITY_ORDER = [
        'Competitor-Sheet-Map',
        'TopKeywords_All',
        'Topic-Discovery',
        'Keyword-Page-Proof',
    ]
    sheets_data = api_get(sheets_url, token, opener)
    title_to_id = {s['properties']['title']: s['properties']['sheetId']
                   for s in sheets_data['sheets']}
    requests = []
    idx = 0
    for title in PRIORITY_ORDER:
        if title in title_to_id:
            requests.append({
                'updateSheetProperties': {
                    'properties': {'sheetId': title_to_id[title], 'index': idx},
                    'fields': 'index'
                }
            })
            idx += 1
    # Remaining sheets fill after priority sheets
    for title, sid in title_to_id.items():
        if title not in PRIORITY_ORDER:
            requests.append({
                'updateSheetProperties': {
                    'properties': {'sheetId': sid, 'index': idx},
                    'fields': 'index'
                }
            })
            idx += 1
    if requests:
        api_post(
            f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KEYWORDS_ID}:batchUpdate',
            token, opener, {'requests': requests})
        print(f'  Reordered {len(requests)} worksheets')

    print(f'\n[DONE] Topic-Discovery: {len(rows) - 1} rows, {len(header)} columns')
    print(f'  Columns: {header}')
    print(f'  Next step: User fills confirmed_action for each L1/L2 topic')


if __name__ == '__main__':
    main()
