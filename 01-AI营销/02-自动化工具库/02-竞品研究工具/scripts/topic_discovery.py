#!/usr/bin/env python3
"""
Topic Discovery Report Generator

Reads Seed-Master v2 (A-X) and generates a comprehensive topic discovery analysis:
1. Topic Pillar distribution with volume
2. Page Type distribution
3. Topic x Page Type matrix
4. High-value keywords (Volume >= 1000)
5. Intent distribution
6. Competitor evidence coverage
7. Content opportunity gaps

Output: Markdown report to stdout
"""

import json
import os
import subprocess
import sys
import urllib.parse
from collections import Counter, defaultdict

CRED_PATH = os.path.expanduser(
    '~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json'
)
PROXY = 'http://127.0.0.1:10808'
SS = '1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc'
SHEET = 'Seed-Master'


def get_token():
    cred = json.load(open(CRED_PATH, encoding='utf-8'))
    return cred['token']


def read_range(rng, token):
    enc = urllib.parse.quote(f'{SHEET}!{rng}')
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{SS}/values/{enc}'
    r = subprocess.run(
        ['curl', '-s', '--proxy', PROXY, url,
         '-H', f'Authorization: Bearer {token}'],
        capture_output=True, timeout=60
    )
    text = r.stdout.decode('utf-8')
    if not text.strip():
        raise RuntimeError(f'Empty response for {rng}')
    return json.loads(text).get('values', [])


def col(row, idx, default=''):
    return row[idx].strip() if len(row) > idx and row[idx] else default


def safe_int(val):
    try:
        return int(val.replace(',', ''))
    except (ValueError, AttributeError):
        return 0


def main():
    token = get_token()

    # Read all data in batches
    print('[READ] Loading Seed-Master ...')
    all_rows = []
    header = None
    for start in range(1, 45002, 5000):
        end = min(start + 4999, 45001)
        batch = read_range(f'A{start}:X{end}', token)
        if start == 1:
            header = batch[0] if batch else []
            all_rows.extend(batch[1:])
        else:
            all_rows.extend(batch)

    print(f'  Total data rows: {len(all_rows)}')
    print(f'  Columns ({len(header)}): {header}')
    if not all_rows:
        print('ERROR: No data rows found!')
        return

    print()

    # === 1. TOPIC PILLAR DISTRIBUTION ===
    print('# Topic Discovery Report — LuckyCrystals Seed-Master v2')
    print(f'> Generated: 2026-06-04 | Data: {len(all_rows)} keywords x {len(header)} columns')
    print()
    print('## 1. Topic Pillar Distribution')
    print()
    print('| Topic Pillar | Keywords | % | Total Volume | Avg Volume | Has Competitor Evidence |')
    print('|---|---:|---:|---:|---:|---:|')

    topic_data = defaultdict(lambda: {'count': 0, 'vol_sum': 0, 'vol_valid': 0, 'matched': 0})
    for r in all_rows:
        t = col(r, 2) or '(empty)'
        topic_data[t]['count'] += 1
        v = safe_int(col(r, 6))
        if v > 0:
            topic_data[t]['vol_sum'] += v
            topic_data[t]['vol_valid'] += 1
        if col(r, 11):
            topic_data[t]['matched'] += 1

    for t in sorted(topic_data.keys(), key=lambda x: -topic_data[x]['count']):
        d = topic_data[t]
        avg_vol = d['vol_sum'] // d['vol_valid'] if d['vol_valid'] else 0
        print(f'| {t} | {d["count"]:,} | {d["count"]/len(all_rows)*100:.1f}% | {d["vol_sum"]:,} | {avg_vol:,} | {d["matched"]:,} ({d["matched"]/d["count"]*100:.1f}%) |')

    total_matched = sum(d['matched'] for d in topic_data.values())
    total_vol = sum(d['vol_sum'] for d in topic_data.values())
    print(f'| **TOTAL** | **{len(all_rows):,}** | **100%** | **{total_vol:,}** | — | **{total_matched:,} ({total_matched/len(all_rows)*100:.1f}%)** |')

    # === 2. PAGE TYPE DISTRIBUTION ===
    print()
    print('## 2. Page Type Distribution')
    print()
    print('| Page Type | Keywords | % | Top Topic |')
    print('|---|---:|---:|---|')

    pt_counts = Counter(col(r, 23) for r in all_rows)
    pt_topic = defaultdict(Counter)
    for r in all_rows:
        pt_topic[col(r, 23)][col(r, 2)] += 1

    for pt, cnt in pt_counts.most_common():
        top_topic = pt_topic[pt].most_common(1)[0][0] if pt_topic[pt] else ''
        print(f'| {pt} | {cnt:,} | {cnt/len(all_rows)*100:.1f}% | {top_topic} |')

    # === 3. TOPIC x PAGE TYPE MATRIX ===
    print()
    print('## 3. Topic x Page Type Matrix')
    print()
    topic_pt = defaultdict(Counter)
    for r in all_rows:
        topic_pt[col(r, 2)][col(r, 23)] += 1

    for topic in sorted(topic_pt.keys()):
        total = sum(topic_pt[topic].values())
        print(f'### {topic} ({total:,} keywords)')
        print()
        print('| Page Type | Count | % |')
        print('|---|---:|---:|')
        for pt, cnt in topic_pt[topic].most_common():
            print(f'| {pt} | {cnt:,} | {cnt/total*100:.1f}% |')
        print()

    # === 4. HIGH-VALUE KEYWORDS ===
    print('## 4. High-Value Keywords (Volume >= 1,000)')
    print()

    high_vol = []
    for r in all_rows:
        v = safe_int(col(r, 6))
        if v >= 1000:
            high_vol.append({
                'kw': col(r, 0),
                'topic': col(r, 2),
                'entity': col(r, 3),
                'pt': col(r, 23),
                'vol': v,
                'kd': safe_int(col(r, 7)),
                'intent': col(r, 10),
                'matched': bool(col(r, 11)),
            })

    high_vol.sort(key=lambda x: -x['vol'])
    print(f'Total high-volume keywords: **{len(high_vol):,}**')
    print()
    print('| # | Volume | KD | Topic | Page Type | Intent | Matched | Keyword |')
    print('|---:|---:|---:|---|---|---|---|---|')
    for i, kw in enumerate(high_vol[:50], 1):
        print(f'| {i} | {kw["vol"]:,} | {kw["kd"]} | {kw["topic"]} | {kw["pt"]} | {kw["intent"]} | {"Y" if kw["matched"] else "N"} | {kw["kw"][:50]} |')

    # === 5. INTENT DISTRIBUTION ===
    print()
    print('## 5. Intent Distribution')
    print()
    print('| Intent | Keywords | % | Avg Volume |')
    print('|---|---:|---:|---:|')

    intent_data = defaultdict(lambda: {'count': 0, 'vol_sum': 0, 'vol_valid': 0})
    for r in all_rows:
        intent = col(r, 10) or '(empty)'
        intent_data[intent]['count'] += 1
        v = safe_int(col(r, 6))
        if v > 0:
            intent_data[intent]['vol_sum'] += v
            intent_data[intent]['vol_valid'] += 1

    for intent in sorted(intent_data.keys(), key=lambda x: -intent_data[x]['count']):
        d = intent_data[intent]
        avg_vol = d['vol_sum'] // d['vol_valid'] if d['vol_valid'] else 0
        print(f'| {intent} | {d["count"]:,} | {d["count"]/len(all_rows)*100:.1f}% | {avg_vol:,} |')

    # === 6. COMPETITOR EVIDENCE BY TOPIC ===
    print()
    print('## 6. Competitor Evidence Coverage')
    print()
    print('| Topic | Total Keywords | Matched | Match Rate | Avg Matched Volume |')
    print('|---|---:|---:|---:|---:|')

    for t in sorted(topic_data.keys(), key=lambda x: -topic_data[x]['matched']):
        d = topic_data[t]
        matched_rows = [r for r in all_rows if col(r, 2) == t and col(r, 11)]
        avg_vol = sum(safe_int(col(r, 6)) for r in matched_rows) // len(matched_rows) if matched_rows else 0
        print(f'| {t} | {d["count"]:,} | {d["matched"]:,} | {d["matched"]/d["count"]*100:.1f}% | {avg_vol:,} |')

    # === 7. CONTENT OPPORTUNITY GAPS ===
    print()
    print('## 7. Content Opportunity Gaps')
    print()
    print('Keywords with high volume but no competitor evidence (untapped opportunities):')
    print()
    print('| # | Volume | KD | Topic | Page Type | Keyword |')
    print('|---:|---:|---:|---|---|---|')

    gaps = []
    for r in all_rows:
        if not col(r, 11):  # No competitor match
            v = safe_int(col(r, 6))
            if v >= 500:  # Decent volume
                gaps.append({
                    'kw': col(r, 0),
                    'topic': col(r, 2),
                    'pt': col(r, 23),
                    'vol': v,
                    'kd': safe_int(col(r, 7)),
                })

    gaps.sort(key=lambda x: -x['vol'])
    print(f'Total gaps (Volume >= 500, no competitor evidence): **{len(gaps):,}**')
    print()
    for i, kw in enumerate(gaps[:30], 1):
        print(f'| {i} | {kw["vol"]:,} | {kw["kd"]} | {kw["topic"]} | {kw["pt"]} | {kw["kw"][:50]} |')

    # === 8. CONTENT PLAN SUMMARY ===
    print()
    print('## 8. Recommended Content Plan by Page Type')
    print()

    # Group by page type and calculate content needs
    pt_plan = defaultdict(lambda: {'count': 0, 'vol_sum': 0, 'entities': set(), 'matched': 0})
    for r in all_rows:
        pt = col(r, 23)
        pt_plan[pt]['count'] += 1
        v = safe_int(col(r, 6))
        pt_plan[pt]['vol_sum'] += v
        entity = col(r, 3)
        if entity:
            pt_plan[pt]['entities'].add(entity)
        if col(r, 11):
            pt_plan[pt]['matched'] += 1

    print('| Page Type | Keywords | Unique Entities | Total Volume | Has Evidence | Content Priority |')
    print('|---|---:|---:|---:|---:|---|')

    for pt in sorted(pt_plan.keys(), key=lambda x: -pt_plan[x]['vol_sum']):
        d = pt_plan[pt]
        # Priority: high volume + low match rate = high priority
        match_rate = d['matched'] / d['count'] * 100 if d['count'] else 0
        if d['vol_sum'] > 500000 and match_rate < 10:
            priority = 'HIGH'
        elif d['vol_sum'] > 100000:
            priority = 'MEDIUM'
        else:
            priority = 'LOW'
        entities_count = len(d['entities'])
        print(f'| {pt} | {d["count"]:,} | {entities_count:,} | {d["vol_sum"]:,} | {d["matched"]:,} ({match_rate:.0f}%) | {priority} |')


if __name__ == '__main__':
    main()
