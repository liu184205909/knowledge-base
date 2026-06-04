#!/usr/bin/env python3
"""Clean Seed-Angel-Numbers from scratch. Mark Delete, don't physically delete."""
import json, os, re, urllib.request, urllib.parse
from collections import defaultdict, Counter

SPREADSHEET_ID = '1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc'
SHEET_NAME = 'Seed-Angel-Numbers'
token = json.load(open(os.path.expanduser('~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json')))['token']
proxy = urllib.request.ProxyHandler({'https': 'http://127.0.0.1:10808', 'http': 'http://127.0.0.1:10808'})
opener = urllib.request.build_opener(proxy)

def sheets_get(sheet, rng):
    enc_s = urllib.parse.quote(sheet)
    enc_r = urllib.parse.quote(rng)
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{enc_s}!{enc_r}'
    req = urllib.request.Request(url, headers={'Authorization': f'Bearer {token}'})
    return json.loads(opener.open(req, timeout=30).read().decode('utf-8'))

def sheets_put(sheet, rng, values):
    enc_s = urllib.parse.quote(sheet)
    enc_r = urllib.parse.quote(rng)
    body = json.dumps({'values': values})
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{enc_s}!{enc_r}?valueInputOption=USER_ENTERED'
    req = urllib.request.Request(url, data=body.encode('utf-8'), headers={
        'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'
    }, method='PUT')
    return json.loads(opener.open(req, timeout=30).read().decode('utf-8'))

# ============================================================
# Current rules
# ============================================================
STOPWORDS = {'the', 'a', 'an'}

def normalize(kw):
    kw = kw.lower().strip()
    kw = re.sub(r'[^a-z0-9:\s]', '', kw)  # preserve colons
    words = [w for w in kw.split() if w and w not in STOPWORDS]
    return tuple(sorted(words))

LOCATION_RE = re.compile(r'\b(near me|waltham)\b', re.IGNORECASE)

# ============================================================
# Read data
# ============================================================
print(f'Reading {SHEET_NAME}...')
result = sheets_get(SHEET_NAME, 'A1:N2000')
rows = result.get('values', [])
header = rows[0] if rows else []
data = rows[1:]
print(f'Header ({len(header)} cols): {header[:14]}')
print(f'Loaded {len(data)} data rows')

# Show sample
print('\nSample rows:')
for i, row in enumerate(data[:3]):
    kw = row[0] if len(row) > 0 else ''
    vol = row[5] if len(row) > 5 else ''
    sa = row[10] if len(row) > 10 else '(empty)'
    print(f'  Row {i+2}: "{kw}" V={vol} SA={sa}')

# Check existing SA values
existing_sa = Counter()
for row in data:
    sa = row[10] if len(row) > 10 else ''
    existing_sa[sa or '(empty)'] += 1
print(f'\nExisting SA distribution: {dict(existing_sa)}')

# ============================================================
# Build near-duplicate groups
# ============================================================
groups = defaultdict(list)
for i, row in enumerate(data):
    kw = row[0] if len(row) > 0 else ''
    vol = 0
    try:
        vol = int(row[5].replace(',', '')) if len(row) > 5 and row[5] else 0
    except:
        pass
    norm = normalize(kw)
    if norm:
        groups[norm].append({'idx': i, 'kw': kw, 'vol': vol})

# ============================================================
# Apply rules
# ============================================================
sa = ['Keep'] * len(data)
reason = [''] * len(data)
conf = ['High'] * len(data)

near_dup_groups = {k: v for k, v in groups.items() if len(v) > 1}
nd_delete = 0
for norm, members in near_dup_groups.items():
    members.sort(key=lambda x: -x['vol'])
    for j, m in enumerate(members):
        if j == 0:
            continue
        sa[m['idx']] = 'Delete'
        reason[m['idx']] = f'Near-dup of "{members[0]["kw"]}" (V={members[0]["vol"]})'
        conf[m['idx']] = 'High'
        nd_delete += 1

print(f'\nNear-dup groups: {len(near_dup_groups)}, Delete rows: {nd_delete}')

loc_count = 0
for i, row in enumerate(data):
    kw = row[0] if len(row) > 0 else ''
    if LOCATION_RE.search(kw):
        if sa[i] == 'Keep':
            sa[i] = 'Review'
            reason[i] = 'Location-specific keyword'
            conf[i] = 'High'
        else:
            reason[i] += ' + Location'
        loc_count += 1
print(f'Location words: {loc_count}')

sa_counts = Counter(sa)
print(f'\n=== FINAL ===')
print(f'Keep:   {sa_counts["Keep"]}')
print(f'Delete: {sa_counts["Delete"]}')
print(f'Review: {sa_counts.get("Review", 0)}')

# ============================================================
# Verify: colon formats
# ============================================================
print('\n=== Colon format verification ===')
for fmt in ['11:11', '1111', '4:44', '444', '2:22', '222', '12:12', '1212', '10:10', '1010', '1:11', '111']:
    norm = normalize(f'{fmt} angel numbers')
    group = groups.get(norm, [])
    status = f'group({len(group)})' if len(group) > 1 else 'standalone'
    print(f'  "{fmt} angel numbers" -> [{", ".join(norm)}] -> {status}')

# ============================================================
# Show top near-dup groups
# ============================================================
print('\n=== Top near-dup groups ===')
for norm, members in sorted(near_dup_groups.items(), key=lambda x: -len(x[1]))[:15]:
    members.sort(key=lambda x: -x['vol'])
    print(f'\n  [{" ".join(norm)}] ({len(members)} members):')
    for m in members[:4]:
        a = 'KEEP' if m == members[0] else 'DEL'
        print(f'    {a} "{m["kw"]}" (V={m["vol"]})')
    if len(members) > 4:
        print(f'    ... +{len(members)-4} more')

# ============================================================
# Write SA/Reason/Confidence (no physical deletion)
# ============================================================
last_row = len(data) + 1
print(f'\nWriting K/L/M ({len(data)} rows)...')
r1 = sheets_put(SHEET_NAME, f'K2:K{last_row}', [[v] for v in sa])
print(f'  K (SA): {r1.get("updatedCells")} cells')
r2 = sheets_put(SHEET_NAME, f'L2:L{last_row}', [[v] for v in reason])
print(f'  L (Reason): {r2.get("updatedCells")} cells')
r3 = sheets_put(SHEET_NAME, f'M2:M{last_row}', [[v] for v in conf])
print(f'  M (Conf): {r3.get("updatedCells")} cells')

print('\nDone! Waiting for human review before physical deletion.')
