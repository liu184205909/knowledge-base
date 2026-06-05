#!/usr/bin/env python3
"""
Apply Page Type mapping to new Seed-* staging sheets (Dreams/Enneagram/Animal-Symbolism).
"""
import sys
import io
import json
import os
import re
import subprocess
import urllib.parse
import tempfile
from collections import Counter

# Fix stdout for UTF-8
if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Read classify_page_type from map_page_type.py as text and exec it
_script_dir = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(_script_dir, 'map_page_type.py'), 'r', encoding='utf-8') as f:
    _src = f.read()

# Extract just the classify_page_type function
_func_match = re.search(r'def classify_page_type\(', _src)
# Find the end: next top-level function def or section starting with '# ----'
_func_end_match = re.search(r'\n(?=# -{3,}|def \w+\(.*main)', _src[_func_match.start():])

if _func_match and _func_end_match:
    _func_code = _src[_func_match.start():_func_match.start() + _func_end_match.start()]
    exec(_func_code, globals())
else:
    raise RuntimeError("Could not extract classify_page_type from map_page_type.py")

TOKEN_FILE = os.path.expanduser('~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json')
PROXY = 'http://127.0.0.1:10808'
SS = '1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc'
BANG = chr(33)

cred = json.load(open(TOKEN_FILE, encoding='utf-8'))
token = cred['token']


def read_range(sheet, rng, token):
    enc = urllib.parse.quote(sheet + BANG + rng)
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{SS}/values/{enc}'
    r = subprocess.run(['curl', '-s', '--proxy', PROXY, url, '-H', f'Authorization: Bearer {token}'],
                       capture_output=True, timeout=60)
    text = r.stdout.decode('utf-8')
    if not text.strip():
        return []
    return json.loads(text).get('values', [])


def batch_write(sheet, rng, values, token):
    enc = urllib.parse.quote(sheet + BANG + rng)
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{SS}/values/{enc}?valueInputOption=USER_ENTERED'
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
        raise RuntimeError(f'batch write failed for {rng}')
    return json.loads(text)


sheets = ['Seed-Dreams', 'Seed-Enneagram', 'Seed-Animal-Symbolism']

for sheet in sheets:
    print(f'\n=== {sheet} ===')

    all_rows = []
    for start in range(1, 30000, 5000):
        end = min(start + 4999, 30000)
        batch = read_range(sheet, f'A{start}:X{end}', token)
        if start == 1:
            header = batch[0] if batch else []
            all_rows.extend(batch[1:])
        else:
            all_rows.extend(batch)
        if len(batch) < 5000:
            break

    print(f'  Data rows: {len(all_rows)}')

    results = []
    pt_counter = Counter()
    for r in all_rows:
        while len(r) < 11:
            r.append('')
        kw = r[0]
        topic = r[2] if len(r) > 2 else ''
        entity = r[3] if len(r) > 3 else ''
        subtopic = r[4] if len(r) > 4 else ''
        content_role = r[5] if len(r) > 5 else ''
        intent = r[10] if len(r) > 10 else ''
        pt = classify_page_type(kw, topic, entity, subtopic, content_role, intent, '')
        results.append(pt)
        pt_counter[pt] += 1

    print(f'  Page Type distribution:')
    for pt, cnt in pt_counter.most_common():
        print(f'    {pt}: {cnt}')

    # Write header
    batch_write(sheet, 'X1', [['Recommended Page Type']], token)

    # Write data in batches
    BATCH = 500
    total_written = 0
    for i in range(0, len(results), BATCH):
        batch_end = min(i + BATCH, len(results))
        batch_vals = [[pt] for pt in results[i:batch_end]]
        row_start = i + 2
        row_end = row_start + len(batch_vals) - 1
        result = batch_write(sheet, f'X{row_start}:X{row_end}', batch_vals, token)
        cells = result.get('updatedCells', 0)
        total_written += cells
    print(f'  Written: {total_written} cells to column X')

print(f'\n[DONE] Page Type mapping complete for all 3 sheets.')
