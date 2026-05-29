"""Deep analysis of remaining 'Other' keywords — cluster + triage.

Reads TopKeywords_All, applies CURRENT L1 rules from generate_topic_discovery,
then analyzes what's left as 'Other' with:
  1. Token clustering (group by shared core word)
  2. Intent patterns (how to, what is, quiz, for sale, etc.)
  3. Volume-tiered triage (high/medium/low)
"""

import json
import re
import sys
import time
import urllib.request
import urllib.parse
from collections import defaultdict, Counter

TOKEN_FILE = r'C:\Users\Dylan\.google_workspace_mcp\credentials\lzn184205909@gmail.com.json'
PROXY = 'http://127.0.0.1:10808'
TOP_KEYWORDS_ID = '18CqR8GzvsonO5zYUaodDPB3oiIcdjdeCVJZn5BaPJng'

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
    # extra generics
    'does', 'did', 'don', 'doesn', 'didn', 'was', 'were', 'been',
    'true', 'yes', 'let', 'going', 'been', 'being', 'had', 'has',
    'can', 'may', 'might', 'must', 'shall', 'should',
}

# Intent pattern matchers
INTENT_PATTERNS = {
    'how-to':    re.compile(r'\bhow\b.+\b(to|do|make|use|clean|charge|cleanse|activate)\b'),
    'what-is':   re.compile(r'\b(what is|what are|what does|whats|who is|meaning of)\b'),
    'quiz-test': re.compile(r'\b(quiz|test|calculator|check)\b'),
    'for-sale':  re.compile(r'\b(for sale|buy|cheap|price|wholesale|store|near me|shop)\b'),
    'yes-no':    re.compile(r'\byes or no\b'),
    'feeling':   re.compile(r'\b(feelings?|as feelings?)\b'),
    'meaning':   re.compile(r'\bmeaning\b'),
    'symbolism': re.compile(r'\b(symbolism|symbolize|represents?|signifies?)\b'),
    'color':     re.compile(r'\bcolor\b'),
}


# ============================================================
# Import L1 rules from main script
# ============================================================
# We duplicate the rules here to avoid import issues.
# Must match generate_topic_discovery.py exactly.

L1_RULES = [
    ('Angel Numbers',
     ['angel number', 'angel numbers', '11:11', '12:12', '10:10', '1:11', '2:22', '3:33', '4:44', '5:55',
      'life path number', 'life path'],
     ['angel', 'angels', 'archangel', 'numerology']),
    ('Crystals',
     ['rose quartz', 'black tourmaline', 'clear quartz', 'lapis lazuli',
      'tiger eye', 'tigers eye', 'moon stone', 'petrified wood', 'apache tears',
      'blue apatite', 'green aventurine', 'blue lace agate', 'snowflake obsidian',
      'herkimer diamond', 'red jasper', 'yellow jasper', 'fancy jasper',
      'picasso jasper', 'zebra stone', 'palm stone', 'worry stone',
      'crystal grid', 'crystal grids', 'crystal skull', 'crystal skulls',
      'red tigers eye', 'blue tigers eye', 'blood stone'],
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
      'aragonite', 'tiger', 'tigers', 'birthstone', 'birthstones']),
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
      'september sign', 'october sign', 'november sign'],
     ['zodiac', 'astrology', 'horoscope', 'horoscopes', 'astrological',
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra',
      'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
      'retrograde', 'mercury', 'venus', 'mars', 'jupiter', 'saturn',
      'neptune', 'pluto', 'uranus', 'natal', 'cusp', 'houses',
      'trine', 'square', 'conjunction', 'opposition', 'stellium',
      'transit', 'transits']),
    ('Dreams',
     ['dream interpretation', 'dream meaning', 'dream dictionary',
      'lucid dream', 'lucid dreaming', 'dream catcher', 'dream catchers'],
     ['dream', 'dreams', 'dreaming', 'dreamed', 'nightmare', 'nightmares', 'asleep']),
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
      'blessing', 'blessings', 'twin', 'flame']),
    ('Palmistry',
     ['palm reading', 'palm lines', 'heart line', 'life line', 'head line',
      'fate line', 'mount of venus', 'mount of jupiter'],
     ['palmistry', 'palm']),
]

ANGEL_NUMBER_PATTERNS = [
    re.compile(r'\b(\d)\1{2,3}\b'),
    re.compile(r'\b(\d)(\d)\1\2\b'),
    re.compile(r'\b(\d)\1(\d)\2\b'),
]


# ============================================================
# API helpers (same as main script)
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


def classify_l1(keyword):
    kw_lower = str(keyword or '').lower().strip()
    if not kw_lower:
        return 'Other'
    for pat in ANGEL_NUMBER_PATTERNS:
        if pat.search(kw_lower):
            return 'Angel Numbers'
    for l1_name, compounds, words in L1_RULES:
        for compound in compounds:
            if compound in kw_lower:
                return l1_name
        tokens = set(re.findall(r'[a-z0-9]+', kw_lower))
        for w in words:
            if w in tokens:
                return l1_name
    return 'Other'


def get_intent(keyword):
    """Classify keyword intent."""
    kw_lower = str(keyword or '').lower().strip()
    for intent_name, pat in INTENT_PATTERNS.items():
        if pat.search(kw_lower):
            return intent_name
    return 'general'


def main():
    opener = get_opener()
    token = get_token(opener)

    # ==========================================
    # Step 1: Read TopKeywords_All, filter Other
    # ==========================================
    print('Reading TopKeywords_All...')
    sheet = urllib.request.quote('TopKeywords_All', safe='')
    other_keywords = []
    batch_size = 10000
    offset = 1

    while True:
        end_row = offset + batch_size - 1
        range_str = f'{sheet}%21A{offset}%3AL{end_row}'
        url = f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KEYWORDS_ID}/values/{range_str}'
        try:
            data = api_get(url, token, opener)
        except Exception as e:
            print(f'  Error: {e}')
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
            if keyword and classify_l1(keyword) == 'Other':
                other_keywords.append({
                    'kw': keyword, 'vol': volume, 'kd': kd, 'cpc': cpc, 'domain': domain
                })
        print(f'  {len(other_keywords)} Other keywords so far...')
        if len(values) < batch_size:
            break
        offset += batch_size

    total_vol = sum(kw['vol'] for kw in other_keywords)
    print(f'\nTotal Other: {len(other_keywords)} keywords, {total_vol:,.0f} volume')

    # ==========================================
    # Step 2: Token clustering
    # ==========================================
    print('\n' + '='*80)
    print('ANALYSIS 1: TOKEN CLUSTERING (top 40 core words by volume)')
    print('='*80)

    token_data = defaultdict(lambda: {'count': 0, 'volume': 0.0, 'examples': []})

    for kw_info in other_keywords:
        tokens = [w for w in re.findall(r'[a-z0-9]+', kw_info['kw'].lower())
                  if w not in STOP_WORDS and len(w) >= 3]
        for t in tokens:
            token_data[t]['count'] += 1
            token_data[t]['volume'] += kw_info['vol']
            if len(token_data[t]['examples']) < 5:
                token_data[t]['examples'].append(kw_info['kw'])

    # Sort by volume
    sorted_tokens = sorted(token_data.items(), key=lambda x: -x[1]['volume'])

    for i, (token, data) in enumerate(sorted_tokens[:40]):
        pct_kw = data['count'] / len(other_keywords) * 100
        pct_vol = data['volume'] / total_vol * 100 if total_vol else 0
        examples = ' | '.join(data['examples'][:3])
        print(f'  {i+1:2d}. {token:18s}  kw={data["count"]:4d} ({pct_kw:4.1f}%)  '
              f'vol={data["volume"]:>10,.0f} ({pct_vol:4.1f}%)  ex: {examples}')

    # ==========================================
    # Step 3: Intent distribution
    # ==========================================
    print('\n' + '='*80)
    print('ANALYSIS 2: INTENT DISTRIBUTION')
    print('='*80)

    intent_data = defaultdict(lambda: {'count': 0, 'volume': 0.0, 'examples': []})
    for kw_info in other_keywords:
        intent = get_intent(kw_info['kw'])
        intent_data[intent]['count'] += 1
        intent_data[intent]['volume'] += kw_info['vol']
        if len(intent_data[intent]['examples']) < 5:
            intent_data[intent]['examples'].append(kw_info['kw'])

    for intent, data in sorted(intent_data.items(), key=lambda x: -x[1]['volume']):
        pct_kw = data['count'] / len(other_keywords) * 100
        pct_vol = data['volume'] / total_vol * 100 if total_vol else 0
        examples = ' | '.join(data['examples'][:3])
        print(f'  {intent:12s}  kw={data["count"]:5d} ({pct_kw:5.1f}%)  '
              f'vol={data["volume"]:>12,.0f} ({pct_vol:5.1f}%)  ex: {examples}')

    # ==========================================
    # Step 4: Volume-tiered triage
    # ==========================================
    print('\n' + '='*80)
    print('ANALYSIS 3: VOLUME-TIERED TRIAGE')
    print('='*80)

    high_vol = [kw for kw in other_keywords if kw['vol'] >= 1000]
    med_vol = [kw for kw in other_keywords if 100 <= kw['vol'] < 1000]
    low_vol = [kw for kw in other_keywords if kw['vol'] < 100]

    print(f'  High (>=1000 vol):  {len(high_vol):5d} keywords, {sum(k["vol"] for k in high_vol):>12,.0f} volume')
    print(f'  Med   (100-999):    {len(med_vol):5d} keywords, {sum(k["vol"] for k in med_vol):>12,.0f} volume')
    print(f'  Low   (<100):       {len(low_vol):5d} keywords, {sum(k["vol"] for k in low_vol):>12,.0f} volume')

    # Top 50 high-volume Other keywords (most actionable)
    print('\n' + '='*80)
    print('ANALYSIS 4: TOP 50 HIGHEST-VOLUME "OTHER" KEYWORDS')
    print('='*80)
    top_50 = sorted(other_keywords, key=lambda x: -x['vol'])[:50]
    for i, kw in enumerate(top_50):
        print(f'  {i+1:2d}. vol={kw["vol"]:>8,.0f}  kd={kw["kd"]:4.0f}  {kw["kw"]}')

    # ==========================================
    # Step 5: Cluster keywords by leading token
    # ==========================================
    print('\n' + '='*80)
    print('ANALYSIS 5: CLUSTER BY LEADING TOKEN (top 30 clusters)')
    print('='*80)

    cluster_data = defaultdict(lambda: {'count': 0, 'volume': 0.0, 'keywords': []})

    for kw_info in other_keywords:
        tokens = [w for w in re.findall(r'[a-z0-9]+', kw_info['kw'].lower())
                  if w not in STOP_WORDS and len(w) >= 3]
        if tokens:
            lead = tokens[0]
        else:
            lead = '__SHORT__'
        cluster_data[lead]['count'] += 1
        cluster_data[lead]['volume'] += kw_info['vol']
        if len(cluster_data[lead]['keywords']) < 8:
            cluster_data[lead]['keywords'].append(kw_info['kw'])

    sorted_clusters = sorted(cluster_data.items(), key=lambda x: -x[1]['volume'])
    for i, (cluster, data) in enumerate(sorted_clusters[:30]):
        examples = ' | '.join(data['keywords'][:5])
        print(f'  {i+1:2d}. [{cluster:18s}] kw={data["count"]:4d}  vol={data["volume"]:>10,.0f}')
        print(f'      ex: {examples}')

    # ==========================================
    # Step 6: Suggest triage
    # ==========================================
    print('\n' + '='*80)
    print('ANALYSIS 6: AUTO-TRIAGE SUGGESTION')
    print('='*80)

    # Keywords that match known patterns for existing L1s
    suggest_expand = defaultdict(lambda: {'count': 0, 'volume': 0.0, 'examples': []})
    suggest_new_l1 = defaultdict(lambda: {'count': 0, 'volume': 0.0, 'examples': []})
    noise_kw = {'count': 0, 'volume': 0.0, 'examples': []}

    # Patterns that suggest existing L1 expansion
    EXPAND_PATTERNS = {
        'Crystals': re.compile(r'\b(jewelry|bracelet|necklace|ring|bead|beads|raw|cabochon|'
                               r'wholesale|necklace|earring|pendant)\b'),
        'Tarot': re.compile(r'\b(fortune|fool|lover|emperor|chariot|star|moon|sun|hermit|'
                           r'hanged|death|temperance|justice|strength|devil|tower|world|'
                           r'knight|queen|king|page)\b'),
        'Astrology': re.compile(r'\b(equinox|solstice|eclipse|2017|2018|2019|2020|'
                                r'january|february|march|april|june|july|august|'
                                r'september|october|november|december|ascendant)\b'),
        'Angel Numbers': re.compile(r'\b(number \d|seeing \d|\d meaning|\d\d meaning|'
                                    r'portal)\b'),
        'Moon Phases': re.compile(r'\b(moon|lunar|eclipse|equinox|solstice)\b'),
        'Spirituality': re.compile(r'\b(self |yourself|spirit|soul|awakening|guides|'
                                   r'gaslighting|toxic|relationship)\b'),
        'Dreams': re.compile(r'\b(dream|nightmare|asleep|sleep)\b'),
    }

    # Patterns that suggest completely new categories
    NEW_L1_PATTERNS = {
        'Enneagram': re.compile(r'\b(enneagram)\b'),
        'Love Languages': re.compile(r'\b(love language)\b'),
        'Animal Symbolism': re.compile(r'\b(butterfly|hummingbird|bird|raven|crow|wolf|'
                                       r'dragon|snake|spider|owl|deer|fox|bear|cat|'
                                       r'animal spirit|totem|power animal)\b'),
        'Color Theory': re.compile(r'\b(color|colors|orange|purple|yellow|pink|green|blue|'
                                    r'white|black|red aura|favorite color)\b'),
        'I Ching': re.compile(r'\b(hexagram|i ching)\b'),
        'Feng Shui': re.compile(r'\b(feng shui|bagua)\b'),
        'Yoga': re.compile(r'\b(yoga|chakra|pose|asana|mantra)\b'),
        'Hair/Beauty': re.compile(r'\b(hair|nail|skin|beauty)\b'),
    }

    for kw_info in other_keywords:
        kw_lower = kw_info['kw'].lower()
        placed = False

        # Check new L1 patterns first (more specific)
        for new_l1, pat in NEW_L1_PATTERNS.items():
            if pat.search(kw_lower):
                suggest_new_l1[new_l1]['count'] += 1
                suggest_new_l1[new_l1]['volume'] += kw_info['vol']
                if len(suggest_new_l1[new_l1]['examples']) < 5:
                    suggest_new_l1[new_l1]['examples'].append(kw_info['kw'])
                placed = True
                break

        if not placed:
            # Check expand patterns
            for l1, pat in EXPAND_PATTERNS.items():
                if pat.search(kw_lower):
                    suggest_expand[l1]['count'] += 1
                    suggest_expand[l1]['volume'] += kw_info['vol']
                    if len(suggest_expand[l1]['examples']) < 5:
                        suggest_expand[l1]['examples'].append(kw_info['kw'])
                    placed = True
                    break

        if not placed:
            noise_kw['count'] += 1
            noise_kw['volume'] += kw_info['vol']
            if len(noise_kw['examples']) < 10:
                noise_kw['examples'].append(kw_info['kw'])

    print('\n  --- BUCKET A: Expand existing L1 rules ---')
    for l1, data in sorted(suggest_expand.items(), key=lambda x: -x[1]['volume']):
        examples = ' | '.join(data['examples'][:3])
        print(f'    → {l1:14s}  kw={data["count"]:4d}  vol={data["volume"]:>10,.0f}  ex: {examples}')

    print('\n  --- BUCKET B: Potential new L1 categories ---')
    for new_l1, data in sorted(suggest_new_l1.items(), key=lambda x: -x[1]['volume']):
        examples = ' | '.join(data['examples'][:3])
        print(f'    ★ {new_l1:20s}  kw={data["count"]:4d}  vol={data["volume"]:>10,.0f}  ex: {examples}')

    print(f'\n  --- BUCKET C: Noise / uncategorized ---')
    print(f'    kw={noise_kw["count"]:4d}  vol={noise_kw["volume"]:>10,.0f}')
    print(f'    ex: {" | ".join(noise_kw["examples"][:8])}')


if __name__ == '__main__':
    main()
