#!/usr/bin/env python3
"""
Seed-Master v2 主题聚类 + Recommended Page Type 映射

输入：Seed-Master A-M 列 (Keyword / 中文 / Topic Pillar / Entity / Subtopic / Content Role / Volume / KD / CPC / Number of Results / Intent / Competitor Matched / Match Count)
输出：X 列 (Recommended Page Type) + Y 列 (Topic Cluster)

Page Type 枚举基于 2A 页面布局方案中定义的 19 类页面模板，
扩展为内容维度映射：

映射规则（按优先级从高到低）：
1. Content Role 直接映射
2. Topic Pillar + Entity 模式匹配
3. Intent 补充判断
4. 兜底：Topic Keyword → Blog Article

用法：
  python map_page_type.py              # 全量执行
  python map_page_type.py --dry-run    # 只统计不写回
"""

import sys
import io
import json
import os
import re
import urllib.parse
import tempfile
import subprocess
from collections import Counter, defaultdict
from datetime import datetime, timezone

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

SEED_SS = '1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc'
SEED_SHEET = 'Seed-Master'

CRED_PATH = os.path.expanduser(
    '~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json'
)
PROXY = 'http://127.0.0.1:10808'

# ---------------------------------------------------------------------------
# Page Type 枚举（基于 2A 架构规划 + 内容策略扩展）
# ---------------------------------------------------------------------------

PAGE_TYPES = [
    # 核心产品/品类页
    'Crystal Single Page',           # 单品水晶页 (amethyst, rose quartz, etc.)
    'Shop by Stone Page',            # 按石材购买页
    'Intention Category Page',       # 按用途分类页 (crystals for anxiety, etc.)
    'Product Page',                  # 产品详情页 (WooCommerce)

    # 指南/条件页
    'Crystals by Condition Page',    # 按症状/用途 (crystals for sleep, etc.)
    'Crystals by Chakra Page',       # 按脉轮
    'Crystals by Zodiac Page',       # 按星座
    'Crystals by Color Page',        # 按颜色
    'Crystal Guide Index Page',      # 水晶指南索引

    # 星座/占星专题
    'Zodiac Sign Page',              # 单个星座页 (Cancer traits, etc.)
    'Zodiac Compatibility Page',     # 星座配对页
    'Chinese Zodiac Page',           # 生肖页
    'Horoscope Page',                # 运势页 (daily/monthly/yearly)
    'Astrology Guide Page',          # 占星指南 (natal chart, houses, etc.)
    'Birth Chart Page',              # 出生图表页

    # 塔罗专题
    'Tarot Card Page',               # 单张塔罗牌页 (The Fool, Death, etc.)
    'Tarot Reading Guide Page',      # 塔罗解读指南
    'Tarot Spread Page',             # 塔罗牌阵页

    # 数字/天使数字
    'Angel Number Page',             # 天使数字页 (111, 222, etc.)
    'Numerology Page',               # 数字命理页 (life path, etc.)

    # 月相/灵性
    'Moon Phase Page',               # 月相页 (full moon ritual, etc.)
    'Meditation Guide Page',         # 冥想指南
    'Spiritual Guide Page',          # 灵性指南 (spiritual awakening, etc.)

    # 风水
    'Feng Shui Guide Page',          # 风水指南

    # 手相
    'Palmistry Guide Page',          # 手相指南

    # 交互工具
    'Tool / Quiz Page',              # 工具/测验页 (crystal quiz, chakra test, etc.)
    'Calculator Page',               # 计算器页 (numerology calculator, etc.)

    # 博客/文章
    'Blog Article',                  # 博客文章 (default for informational)
    'Category Hub Page',             # 分类聚合页
    'Local SEO Page',                # 本地SEO页 (near me, etc.)
]

# ---------------------------------------------------------------------------
# Auth helpers (same pattern as track_d_backfill.py)
# ---------------------------------------------------------------------------

def get_token():
    cred = json.load(open(CRED_PATH, encoding='utf-8'))
    return cred['token']

def refresh_token():
    subprocess.run([sys.executable, r'C:\Users\Dylan\tools\refresh_google_token.py'], check=True)
    return get_token()

def read_range(sheet, rng, token):
    enc = urllib.parse.quote(sheet) + '!' + urllib.parse.quote(rng)
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{SEED_SS}/values/{enc}'
    r = subprocess.run(['curl', '-s', '--proxy', PROXY, url, '-H', f'Authorization: Bearer {token}'],
                       capture_output=True, timeout=60)
    text = r.stdout.decode('utf-8')
    if not text.strip():
        raise RuntimeError(f'API read error')
    return json.loads(text).get('values', [])

def batch_write(sheet, rng, values, token):
    enc = urllib.parse.quote(sheet) + '!' + urllib.parse.quote(rng)
    url = (f'https://sheets.googleapis.com/v4/spreadsheets/{SEED_SS}/values/{enc}'
           f'?valueInputOption=USER_ENTERED')
    body = json.dumps({'values': values})
    tmp = tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False, encoding='utf-8')
    tmp.write(body)
    tmp.close()
    try:
        r = subprocess.run(['curl', '-s', '-X', 'PUT', '--proxy', PROXY, url,
                           '-H', f'Authorization: Bearer {token}',
                           '-H', 'Content-Type: application/json',
                           '-d', f'@{tmp.name}'], capture_output=True, timeout=120)
    finally:
        os.unlink(tmp.name)
    text = r.stdout.decode('utf-8')
    if not text.strip():
        raise RuntimeError('batch write failed')
    return json.loads(text)

# ---------------------------------------------------------------------------
# Mapping rules
# ---------------------------------------------------------------------------

def classify_page_type(keyword, topic, entity, subtopic, content_role, intent, comp_matched):
    """
    Core mapping logic. Priority:
    1. Content Role direct map
    2. Topic Pillar + Entity pattern
    3. Intent supplement
    4. Fallback: Blog Article
    """
    kw = keyword.lower().strip()
    cr = content_role.strip() if content_role else ''
    tp = topic.strip() if topic else ''
    ent = entity.strip() if entity else ''
    sub = subtopic.strip() if subtopic else ''
    intnt = intent.strip() if intent else ''

    # --- Rule 1: Content Role direct mappings ---
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

    # --- Rule 2: Topic Pillar + Entity pattern matching ---

    # CRYSTALS topic
    if tp == 'Crystals':
        # Specific crystal entities
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
        # Entity-based fallback
        if ent in ('Quartz', 'Amethyst', 'Rose Quartz', 'Citrine', 'Selenite', 'Black Tourmaline',
                    'Moonstone', 'Labradorite', 'Carnelian', 'Obsidian', 'Lapis Lazuli',
                    'Aventurine', 'Jasper', 'Tourmaline', 'Malachite', 'Pyrite'):
            return 'Crystal Single Page'
        return 'Blog Article'

    # CHAKRA topic
    if tp == 'Chakra':
        if any(ch in kw for ch in ['root chakra', 'muladhara']):
            return 'Crystals by Chakra Page'
        if any(ch in kw for ch in ['heart chakra', 'anahata']):
            return 'Crystals by Chakra Page'
        if any(ch in kw for ch in ['throat chakra', 'vishuddha']):
            return 'Crystals by Chakra Page'
        if any(ch in kw for ch in ['third eye', 'ajna']):
            return 'Crystals by Chakra Page'
        if any(ch in kw for ch in ['sacral chakra', 'svadhisthana']):
            return 'Crystals by Chakra Page'
        if any(ch in kw for ch in ['crown chakra', 'sahasrara']):
            return 'Crystals by Chakra Page'
        if any(ch in kw for ch in ['solar plexus', 'manipura']):
            return 'Crystals by Chakra Page'
        if 'crystal' in kw or 'stone' in kw or 'bracelet' in kw:
            return 'Crystals by Chakra Page'
        if 'test' in kw or 'quiz' in kw or 'chart' in kw:
            return 'Tool / Quiz Page'
        if 'balancing' in kw or 'alignment' in kw or 'healing' in kw or 'meditation' in kw:
            return 'Crystals by Chakra Page'
        return 'Blog Article'

    # ZODIAC topic
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

    # ASTROLOGY topic
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

    # TAROT topic
    if tp == 'Tarot':
        if 'reading' in kw or 'interpretation' in kw:
            return 'Tarot Reading Guide Page'
        if 'spread' in kw:
            return 'Tarot Spread Page'
        if 'major arcana' in kw or 'minor arcana' in kw:
            return 'Tarot Card Page'
        # Specific card names
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

    # ANGEL NUMBERS topic
    if tp == 'Angel Numbers':
        # Pattern: number meaning (111, 222, 333, etc.)
        if re.search(r'\b\d{3,4}\b', kw):
            return 'Angel Number Page'
        if 'angel number' in kw:
            return 'Angel Number Page'
        return 'Blog Article'

    # NUMEROLOGY topic
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

    # MOON PHASES topic
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

    # MEDITATION topic
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

    # SPIRITUALITY topic
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

    # FENG SHUI topic
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

    # PALMISTRY topic
    if tp == 'Palmistry':
        if 'line' in kw or 'palm reading' in kw or 'hand reading' in kw:
            return 'Palmistry Guide Page'
        if 'mount' in kw or 'finger' in kw or 'thumb' in kw:
            return 'Palmistry Guide Page'
        return 'Blog Article'

    # --- Rule 3: Intent supplement ---
    if 'Transactional' in intnt and 'Commercial' not in intnt:
        return 'Product Page'

    # --- Rule 4: Fallback ---
    return 'Blog Article'


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    dry_run = '--dry-run' in sys.argv

    print('=' * 70)
    print('Seed-Master v2: Topic Clustering + Page Type Mapping')
    print('=' * 70)
    if dry_run:
        print('  [DRY RUN - no writes]')

    token = get_token()

    # Read Seed-Master A-M
    print('\n[READ] Loading Seed-Master ...')
    all_rows = []
    for start in range(1, 45001, 5000):
        end = min(start + 4999, 45000)
        batch = read_range(SEED_SHEET, f'A{start}:M{end}', token)
        if start == 1:
            header = batch[0]
            all_rows.extend(batch[1:])
        else:
            all_rows.extend(batch)

    print(f'  Data rows: {len(all_rows)}')
    print(f'  Header: {header[:11]}')

    # Classify each row
    print('\n[CLASSIFY] Mapping Page Types ...')
    results = []
    pt_counter = Counter()
    for r in all_rows:
        kw = r[0] if len(r) > 0 else ''
        topic = r[2] if len(r) > 2 else ''
        entity = r[3] if len(r) > 3 else ''
        subtopic = r[4] if len(r) > 4 else ''
        content_role = r[5] if len(r) > 5 else ''
        intent = r[10] if len(r) > 10 else ''
        comp_matched = r[11] if len(r) > 11 else ''

        pt = classify_page_type(kw, topic, entity, subtopic, content_role, intent, comp_matched)
        results.append(pt)
        pt_counter[pt] += 1

    print(f'\n=== Page Type Distribution ===')
    for pt, cnt in pt_counter.most_common():
        pct = cnt / len(results) * 100
        print(f'  {pt}: {cnt} ({pct:.1f}%)')

    # Cross-tab: Topic x Page Type
    print(f'\n=== Topic x Page Type (top 3 per topic) ===')
    topic_pt = defaultdict(Counter)
    for i, r in enumerate(all_rows):
        topic = r[2] if len(r) > 2 else ''
        topic_pt[topic][results[i]] += 1
    for t in sorted(topic_pt.keys()):
        top3 = topic_pt[t].most_common(3)
        print(f'  {t}: {top3}')

    if dry_run:
        print(f'\n[DRY RUN] Would write {len(results)} rows to column X')
        # Show sample
        for i in range(min(5, len(all_rows))):
            print(f'  {all_rows[i][0][:50]} -> {results[i]}')
        return

    # Write header + data to column X
    print(f'\n[WRITE] Writing Recommended Page Type to column X ...')

    # Header
    batch_write(SEED_SHEET, 'X1', [['Recommended Page Type']], token)
    print('  Header written')

    # Data in batches
    BATCH_SIZE = 500
    total_written = 0
    for batch_start in range(0, len(results), BATCH_SIZE):
        batch = [[pt] for pt in results[batch_start:batch_start + BATCH_SIZE]]
        row_start = batch_start + 2
        row_end = row_start + len(batch) - 1
        rng = f'X{row_start}:X{row_end}'
        r = batch_write(SEED_SHEET, rng, batch, token)
        cells = r.get('updatedCells', 0)
        total_written += cells
        print(f'  Batch {batch_start//BATCH_SIZE + 1}: rows {row_start}-{row_end} ({cells} cells)')

    print(f'\n[DONE] Total cells written: {total_written}')


if __name__ == '__main__':
    main()
