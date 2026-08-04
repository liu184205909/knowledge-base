#!/usr/bin/env python3
"""
轨道D：Seed-Master v2 竞品证据增强

执行流程：
  D2: TopKeywords_All -> Seed-Master 关键词匹配
  D3: TopPages_All    -> Seed-Master 页面级证据补充
  D4: 回填竞品证据字段到 Seed-Master（从 L 列开始）

匹配键：标准化 Keyword（小写、去首尾空格、合并连续空格）
normalized_url 规则：全小写 -> 去协议 -> 去 www -> 删查询参数 -> 删锚点 -> 去尾斜杠

用法：
  python track_d_backfill.py              # 全量执行 D2+D3+D4
  python track_d_backfill.py --dry-run    # 只统计不写回
  python track_d_backfill.py --d2-only    # 只执行 D2
"""

import sys
import io
import json
import os
import re
import urllib.parse
from datetime import datetime, timezone
from collections import defaultdict

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

# Seed-Master spreadsheet
SEED_SS = '1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc'
SEED_SHEET = 'Seed-Master'

# TopKeywords spreadsheet
KW_SS = '18CqR8GzvsonO5zYUaodDPB3oiIcdjdeCVJZn5BaPJng'
KW_ALL_SHEET = 'TopKeywords_All'

# TopPages spreadsheet
TP_SS = '1x__cXM-FCmTe_BjTND0nG0VhWrjbVl8iFajtXGE854U'
TP_ALL_SHEET = 'TopPages_All'

# D4 columns (starting from L)
D4_COLS = [
    'Competitor Keyword Matched',  # L: Yes/No
    'Competitor Match Count',      # M: number of keyword evidence rows
    'Source Count',                 # N: number of distinct competitor sources
    'Best Competitor Source',       # O: domain of best keyword evidence
    'Best Competitor URL',          # P: URL of best keyword evidence
    'Best Keyword Traffic',         # Q: traffic of best keyword evidence
    'Best Traffic %',               # R: traffic% of best keyword evidence
    'Best Page Traffic',            # S: traffic of best page evidence
    'Best Page Traffic %',          # T: traffic% of best page evidence
    'Best Page Top Keyword',        # U: top keyword of best page
    'Best Page Intent',             # V: intent of best page
    'Evidence Updated At',          # W: timestamp
]

# ---------------------------------------------------------------------------
# Auth helpers (reuse build_seed_master_v1 pattern)
# ---------------------------------------------------------------------------

CRED_PATH = os.path.expanduser(
    '~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json'
)
PROXY = 'http://127.0.0.1:10808'


def get_token():
    cred = json.load(open(CRED_PATH, encoding='utf-8'))
    return cred['token']


def refresh_token():
    subprocess_path = r'C:\Users\Dylan\tools\refresh_google_token.py'
    import subprocess
    subprocess.run([sys.executable, subprocess_path], check=True)
    return get_token()


def api_get(host, path, token):
    import subprocess
    url = f'https://{host}{path}'
    r = subprocess.run(
        ['curl', '-s', '--proxy', PROXY, url,
         '-H', f'Authorization: Bearer {token}'],
        capture_output=True, timeout=60
    )
    text = r.stdout.decode('utf-8')
    if r.returncode != 0 or not text.strip():
        raise RuntimeError(f'API error: rc={r.returncode}')
    return json.loads(text)


def api_post(host, path, token, body):
    import subprocess
    url = f'https://{host}{path}'
    r = subprocess.run(
        ['curl', '-s', '-X', 'POST', '--proxy', PROXY, url,
         '-H', f'Authorization: Bearer {token}',
         '-H', 'Content-Type: application/json',
         '-d', json.dumps(body)],
        capture_output=True, timeout=120
    )
    text = r.stdout.decode('utf-8')
    if r.returncode != 0 or not text.strip():
        raise RuntimeError(f'API write error: rc={r.returncode}')
    return json.loads(text)


def read_sheet(ss_id, sheet, rng, token):
    enc = urllib.parse.quote(sheet) + '!' + urllib.parse.quote(rng)
    path = f'/v4/spreadsheets/{ss_id}/values/{enc}'
    return api_get('sheets.googleapis.com', path, token)


def write_sheet(ss_id, sheet, rng, values, token):
    enc = urllib.parse.quote(sheet) + '!' + urllib.parse.quote(rng)
    path = f'/v4/spreadsheets/{ss_id}/values/{enc}?valueInputOption=USER_ENTERED'
    body = {'values': values}
    return api_post('sheets.googleapis.com', path, token, body)


def batch_update_sheet(ss_id, sheet, rng, values, token):
    """Write via curl using temp file for body (avoids WinError 206 on Windows)."""
    import subprocess
    import tempfile

    enc = urllib.parse.quote(sheet) + '!' + urllib.parse.quote(rng)
    url = (
        f'https://sheets.googleapis.com/v4/spreadsheets/{ss_id}/values/{enc}'
        f'?valueInputOption=USER_ENTERED'
    )

    body = json.dumps({'values': values})

    # Write body to temp file to avoid command-line length limit on Windows
    tmp = tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False, encoding='utf-8')
    tmp.write(body)
    tmp.close()

    try:
        r = subprocess.run(
            ['curl', '-s', '-X', 'PUT', '--proxy', PROXY, url,
             '-H', f'Authorization: Bearer {token}',
             '-H', 'Content-Type: application/json',
             '-d', f'@{tmp.name}'],
            capture_output=True, timeout=120
        )
    finally:
        os.unlink(tmp.name)

    text = r.stdout.decode('utf-8')
    if not text.strip():
        raise RuntimeError(f'batch update failed: rc={r.returncode}')
    return json.loads(text)


# ---------------------------------------------------------------------------
# Normalize helpers
# ---------------------------------------------------------------------------

def normalize_kw(kw):
    """Standardize keyword for matching."""
    return re.sub(r'\s+', ' ', kw.lower().strip())


def normalize_url(url):
    """URL normalization per project rules."""
    if not url:
        return ''
    u = url.lower()
    u = re.sub(r'^https?://', '', u)
    u = re.sub(r'^www\.', '', u)
    u = u.split('?')[0]
    u = u.split('#')[0]
    u = u.rstrip('/')
    return u


def safe_int(val, default=0):
    try:
        return int(float(str(val).replace(',', '')))
    except (ValueError, TypeError):
        return default


def safe_float(val, default=0.0):
    try:
        return float(str(val).replace(',', ''))
    except (ValueError, TypeError):
        return default


# ---------------------------------------------------------------------------
# D2: TopKeywords_All -> Seed-Master keyword match
# ---------------------------------------------------------------------------

def load_top_keywords_all(token):
    """Load TopKeywords_All into memory. Returns list of dicts keyed by header."""
    print('[D2] Loading TopKeywords_All ...')
    data = read_sheet(KW_SS, KW_ALL_SHEET, 'A1:K', token)
    rows = data.get('values', [])
    if not rows:
        raise RuntimeError('TopKeywords_All is empty')

    header = rows[0]
    # Expected: Keyword, Search Volume, KD, CPC, URL, Traffic, Traffic(%),
    #           Number of Results, Keyword Intents, source_sheet, normalized_url
    print(f'  Header: {header}')
    print(f'  Total rows: {len(rows) - 1}')

    records = []
    for row in rows[1:]:
        rec = {}
        for i, h in enumerate(header):
            rec[h] = row[i] if i < len(row) else ''
        records.append(rec)

    # Build lookup: normalized_keyword -> list of records (sorted by Traffic desc)
    kw_lookup = defaultdict(list)
    for rec in records:
        kw = normalize_kw(rec.get('Keyword', ''))
        if kw:
            kw_lookup[kw].append(rec)

    # Sort each group by Traffic desc
    for kw in kw_lookup:
        kw_lookup[kw].sort(key=lambda r: safe_float(r.get('Traffic', 0)), reverse=True)

    print(f'  Unique normalized keywords: {len(kw_lookup)}')
    return kw_lookup


# ---------------------------------------------------------------------------
# D3: TopPages_All -> page-level evidence
# ---------------------------------------------------------------------------

def load_top_pages_all(token):
    """Load TopPages_All into memory. Returns dict: normalized_url -> best page record."""
    print('[D3] Loading TopPages_All ...')
    data = read_sheet(TP_SS, TP_ALL_SHEET, 'A1:H', token)
    rows = data.get('values', [])
    if not rows:
        raise RuntimeError('TopPages_All is empty')

    header = rows[0]
    print(f'  Header: {header}')
    print(f'  Total rows: {len(rows) - 1}')

    records = []
    for row in rows[1:]:
        rec = {}
        for i, h in enumerate(header):
            rec[h] = row[i] if i < len(row) else ''
        records.append(rec)

    # Build lookup: normalized_url -> record with highest Traffic
    url_lookup = {}
    for rec in records:
        nu = normalize_url(rec.get('URL', ''))
        if not nu:
            continue
        traffic = safe_float(rec.get('Traffic', 0))
        if nu not in url_lookup or traffic > safe_float(url_lookup[nu].get('Traffic', 0)):
            url_lookup[nu] = rec

    print(f'  Unique normalized URLs: {len(url_lookup)}')
    return url_lookup


# ---------------------------------------------------------------------------
# D4: Compute evidence and write back
# ---------------------------------------------------------------------------

def compute_d4(seed_rows, kw_lookup, page_lookup):
    """
    For each Seed-Master row, compute D4 evidence fields.
    Returns list of D4 value rows (one per seed row, aligned with seed_rows order).
    """
    now = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')
    matched_count = 0
    unmatched_count = 0
    topic_stats = defaultdict(lambda: {'matched': 0, 'total': 0})

    d4_rows = []
    for row in seed_rows:
        kw_raw = row[0] if row else ''
        kw = normalize_kw(kw_raw)
        topic = row[2] if len(row) > 2 else ''

        topic_stats[topic]['total'] += 1

        if kw not in kw_lookup:
            # No keyword match
            unmatched_count += 1
            d4_rows.append([
                'No', '', '', '', '', '', '',
                '', '', '', '', ''
            ])
            continue

        matched_count += 1
        topic_stats[topic]['matched'] += 1
        kw_matches = kw_lookup[kw]
        best = kw_matches[0]

        # Count distinct sources
        sources = set()
        for m in kw_matches:
            src = m.get('source_sheet', '')
            if src:
                sources.add(src)

        # Best keyword evidence
        best_source = best.get('source_sheet', '')
        best_url = best.get('URL', '')
        best_traffic = safe_float(best.get('Traffic', 0))
        best_traffic_pct = best.get('Traffic(%)', '')

        # Page-level evidence via normalized_url
        nu = normalize_url(best_url)
        page_rec = page_lookup.get(nu)

        if page_rec:
            pg_traffic = page_rec.get('Traffic', '')
            pg_traffic_pct = page_rec.get('Traffic(%)', '')
            pg_top_kw = page_rec.get('Top Keyword', '')
            pg_intent = page_rec.get('Primary Intent', '')
        else:
            pg_traffic = ''
            pg_traffic_pct = ''
            pg_top_kw = ''
            pg_intent = ''

        d4_rows.append([
            'Yes',
            str(len(kw_matches)),
            str(len(sources)),
            best_source,
            best_url,
            str(best_traffic),
            str(best_traffic_pct),
            pg_traffic,
            pg_traffic_pct,
            pg_top_kw,
            pg_intent,
            now,
        ])

    total = matched_count + unmatched_count
    match_rate = matched_count / total * 100 if total > 0 else 0

    print(f'\n[D4] Match results:')
    print(f'  Total Seed-Master keywords: {total}')
    print(f'  Matched: {matched_count} ({match_rate:.1f}%)')
    print(f'  Unmatched: {unmatched_count} ({100 - match_rate:.1f}%)')

    print(f'\n  Per-topic match rate:')
    for topic in sorted(topic_stats.keys()):
        s = topic_stats[topic]
        rate = s['matched'] / s['total'] * 100 if s['total'] > 0 else 0
        print(f'    {topic}: {s["matched"]}/{s["total"]} ({rate:.1f}%)')

    # Check miss rate per D2 rules
    if match_rate >= 80:
        print(f'\n  [OK] Match rate >= 80% - no Seed-* supplementation needed')
    elif match_rate >= 60:
        print(f'\n  [WARN] Match rate 60-80% - check if gaps are concentrated in specific topics')
    else:
        print(f'\n  [ALERT] Match rate < 60% - consider supplementing Seed-* or manual review')

    return d4_rows


def main():
    dry_run = '--dry-run' in sys.argv
    d2_only = '--d2-only' in sys.argv

    print('=' * 70)
    print('Track D: Seed-Master v2 competitor evidence backfill')
    print('=' * 70)
    if dry_run:
        print('  [DRY RUN - no writes]')

    token = get_token()

    # --- Load Seed-Master v2 ---
    print('\n[LOAD] Reading Seed-Master v2 ...')
    data = read_sheet(SEED_SS, SEED_SHEET, 'A1:K', token)
    seed_rows = data.get('values', [])
    if not seed_rows:
        raise RuntimeError('Seed-Master is empty')

    header = seed_rows[0]
    seed_data = seed_rows[1:]  # skip header
    print(f'  Columns: {header}')
    print(f'  Data rows: {len(seed_data)}')

    # --- D2: Load TopKeywords_All ---
    kw_lookup = load_top_keywords_all(token)

    # --- D3: Load TopPages_All ---
    if not d2_only:
        page_lookup = load_top_pages_all(token)
    else:
        page_lookup = {}

    # --- D4: Compute evidence ---
    d4_rows = compute_d4(seed_data, kw_lookup, page_lookup)

    if dry_run:
        print(f'\n[DRY RUN] Would write {len(d4_rows)} rows x {len(D4_COLS)} cols to Seed-Master')
        print('  Sample (first 3 rows):')
        for i, row in enumerate(d4_rows[:3]):
            print(f'  Row {i+2}: {dict(zip(D4_COLS, row))}')
        return

    # --- Write header ---
    print(f'\n[WRITE] Adding D4 columns to Seed-Master ...')

    # First, write header row (L1:W1)
    header_result = batch_update_sheet(
        SEED_SS, SEED_SHEET,
        'L1', [D4_COLS], token
    )
    print(f'  Header written: {header_result.get("updatedCells", "?")} cells')

    # --- Write data in batches ---
    BATCH_SIZE = 500
    total_written = 0
    for batch_start in range(0, len(d4_rows), BATCH_SIZE):
        batch = d4_rows[batch_start:batch_start + BATCH_SIZE]
        row_start = batch_start + 2  # 1-indexed, skip header
        row_end = row_start + len(batch) - 1
        rng = f'L{row_start}:W{row_end}'

        result = batch_update_sheet(SEED_SS, SEED_SHEET, rng, batch, token)
        cells = result.get('updatedCells', 0)
        total_written += cells
        print(f'  Batch {batch_start//BATCH_SIZE + 1}: rows {row_start}-{row_end} ({cells} cells)')

    print(f'\n[DONE] Total cells written: {total_written}')
    print(f'  {len(d4_rows)} rows x {len(D4_COLS)} columns')
    print(f'  Columns: L={D4_COLS[0]} ... W={D4_COLS[-1]}')


if __name__ == '__main__':
    main()
