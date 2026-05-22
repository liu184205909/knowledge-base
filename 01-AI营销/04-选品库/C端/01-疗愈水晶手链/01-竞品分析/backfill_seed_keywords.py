"""
Backfill Seed Keywords with competitor proof data from Keyword-Page-Proof.
Adds columns: Topic Cluster, Recommended Page Type, Priority, Source Type,
              Source Detail, Competitor Proof, Proof URL

Auto-fills:
  - Competitor Proof: Best Proof Level from Keyword-Page-Proof
  - Proof URL: Best competitor URL from Keyword-Page-Proof
  - Source Type: 'Seed' for original, to be updated
  - Source Detail: Competitor domain from proof
  - Priority: Calculated from Volume, KD, CPC, Proof

Leaves for later AI processing:
  - Topic Cluster
  - Recommended Page Type
"""

import json
import re
import time
import urllib.request
import urllib.error
import urllib.parse

TOKEN_FILE = r'C:\Users\Dylan\.google_workspace_mcp\credentials\lzn184205909@gmail.com.json'
PROXY = 'http://127.0.0.1:10808'

SEED_KW_ID = '1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc'
TOP_KW_ID = '18CqR8GzvsonO5zYUaodDPB3oiIcdjdeCVJZn5BaPJng'

NEW_COLUMNS = ['Topic Cluster', 'Recommended Page Type', 'Priority',
               'Source Type', 'Source Detail', 'Competitor Proof', 'Proof URL']

PROOF_RANK = {'Strong': 4, 'Medium': 3, 'Weak': 2, 'None': 1, '': 0}


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
            data=body,
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
        )
        resp = opener.open(req)
        refreshed = json.loads(resp.read().decode())
        c['token'] = refreshed['access_token']
        c['expiry'] = time.strftime('%Y-%m-%dT%H:%M:%S', time.localtime(time.time() + refreshed.get('expires_in', 3600)))
        with open(TOKEN_FILE, 'w', encoding='utf-8') as f:
            json.dump(c, f, ensure_ascii=False, indent=2)
    return c['token']


def get_opener():
    proxy = urllib.request.ProxyHandler({'https': PROXY, 'http': PROXY})
    return urllib.request.build_opener(proxy)


def api_get(url, token, opener):
    req = urllib.request.Request(url, headers={'Authorization': f'Bearer {token}'})
    resp = opener.open(req)
    return json.loads(resp.read().decode())


def api_post(url, token, opener, data):
    body = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    })
    resp = opener.open(req)
    return json.loads(resp.read().decode())


def api_put(url, token, opener, data):
    body = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }, method='PUT')
    resp = opener.open(req)
    return json.loads(resp.read().decode())


def calc_priority(volume, kd, cpc, proof_level):
    """Calculate priority: P0 (highest) to P3 (lowest)."""
    try:
        vol = int(volume) if volume else 0
    except ValueError:
        vol = 0
    try:
        kd_val = int(kd) if kd else 50
    except ValueError:
        kd_val = 50
    try:
        cpc_val = float(cpc) if cpc else 0
    except ValueError:
        cpc_val = 0

    proof_rank = PROOF_RANK.get(proof_level, 0)

    # Score: higher = better priority
    score = 0
    # Volume factor (log scale)
    if vol >= 10000:
        score += 40
    elif vol >= 1000:
        score += 30
    elif vol >= 100:
        score += 20
    else:
        score += 10

    # KD factor (lower KD = better)
    if kd_val <= 20:
        score += 30
    elif kd_val <= 40:
        score += 25
    elif kd_val <= 60:
        score += 15
    else:
        score += 5

    # CPC factor (higher CPC = more commercial value)
    if cpc_val >= 1.0:
        score += 15
    elif cpc_val >= 0.5:
        score += 10
    else:
        score += 5

    # Proof factor
    score += proof_rank * 4

    if score >= 80:
        return 'P0'
    elif score >= 60:
        return 'P1'
    elif score >= 40:
        return 'P2'
    else:
        return 'P3'


def main():
    opener = get_opener()
    token = get_token(opener)

    # ==========================================
    # Step 1: Read Keyword-Page-Proof and build keyword lookup
    # ==========================================
    print('Step 1: Reading Keyword-Page-Proof...')
    sheet = urllib.request.quote('Keyword-Page-Proof', safe='')
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KW_ID}/values/{sheet}%21A%3AN'

    # Read in batches
    keyword_lookup = {}  # keyword -> best proof info
    batch_size = 10000
    offset = 1  # skip header
    total_read = 0

    while True:
        range_str = f'{sheet}%21A{offset}%3AN{offset + batch_size - 1}'
        chunk_url = f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KW_ID}/values/{range_str}'
        try:
            chunk_data = api_get(chunk_url, token, opener)
        except Exception as e:
            print(f'  Error: {e}')
            break

        values = chunk_data.get('values', [])
        if not values:
            break

        for row in values:
            if row and row[0] == 'Keyword':
                continue
            total_read += 1
            padded = row + [''] * (14 - len(row))
            kw = padded[0].lower().strip()
            proof_level = padded[13]

            # Keep the best proof for each keyword
            current = keyword_lookup.get(kw)
            current_rank = PROOF_RANK.get(current['proof_level'], 0) if current else 0
            new_rank = PROOF_RANK.get(proof_level, 0)

            if new_rank > current_rank:
                keyword_lookup[kw] = {
                    'proof_level': proof_level,
                    'competitor_domain': padded[1],
                    'proof_url': padded[2],
                    'position': padded[4],
                    'page_traffic': padded[10],
                    'page_keywords': padded[11],
                }

        if len(values) < batch_size:
            break
        offset += batch_size

    print(f'  Read {total_read} proof records')
    print(f'  Built lookup for {len(keyword_lookup)} unique keywords')

    # ==========================================
    # Step 2: Read Seed Keywords
    # ==========================================
    print('\nStep 2: Reading Seed Keywords...')
    # First get sheet title
    meta_url = f'https://sheets.googleapis.com/v4/spreadsheets/{SEED_KW_ID}?fields=sheets.properties(title,sheetId)'
    meta_data = api_get(meta_url, token, opener)
    sheet_title = meta_data['sheets'][0]['properties']['title']
    print(f'  Sheet title: {sheet_title}')

    encoded_sheet = urllib.request.quote(sheet_title, safe='')

    # Read all data
    data_url = f'https://sheets.googleapis.com/v4/spreadsheets/{SEED_KW_ID}/values/{encoded_sheet}%21A%3AG'
    seed_data = api_get(data_url, token, opener)
    seed_values = seed_data['values']
    header = seed_values[0]
    print(f'  Headers: {header}')
    print(f'  Data rows: {len(seed_values) - 1}')

    # ==========================================
    # Step 3: Add new columns and fill data
    # ==========================================
    print('\nStep 3: Adding new columns and filling data...')

    # Write headers for new columns (H1:N1)
    new_header_range = f'{encoded_sheet}%21H1%3AN1'
    put_url = f'https://sheets.googleapis.com/v4/spreadsheets/{SEED_KW_ID}/values/{new_header_range}?valueInputOption=RAW'
    api_put(put_url, token, opener, {'values': [NEW_COLUMNS]})
    print(f'  Added headers: {NEW_COLUMNS}')

    # Process each keyword row
    proof_found = 0
    no_proof = 0
    priority_dist = {'P0': 0, 'P1': 0, 'P2': 0, 'P3': 0}
    batch_values = []

    for i, row in enumerate(seed_values[1:], start=2):
        kw = row[0].lower().strip() if len(row) > 0 else ''
        volume = row[3] if len(row) > 3 else ''
        kd = row[4] if len(row) > 4 else ''
        cpc = row[5] if len(row) > 5 else ''

        proof_info = keyword_lookup.get(kw)

        if proof_info:
            proof_found += 1
            proof_level = proof_info['proof_level']
            source_type = 'Seed + Competitor Proof'
            source_detail = proof_info['competitor_domain']
            competitor_proof = proof_level
            proof_url = proof_info['proof_url']
        else:
            no_proof += 1
            proof_level = ''
            source_type = 'Seed'
            source_detail = ''
            competitor_proof = ''
            proof_url = ''

        priority = calc_priority(volume, kd, cpc, proof_level)
        priority_dist[priority] += 1

        # Row: Topic Cluster | Recommended Page Type | Priority | Source Type | Source Detail | Competitor Proof | Proof URL
        batch_values.append([
            '',                        # Topic Cluster (AI later)
            '',                        # Recommended Page Type (AI later)
            priority,                  # Priority (calculated)
            source_type,               # Source Type
            source_detail,             # Source Detail
            competitor_proof,          # Competitor Proof
            proof_url                  # Proof URL
        ])

    # Write in batches
    batch_write_size = 3000
    for batch_start in range(0, len(batch_values), batch_write_size):
        batch = batch_values[batch_start:batch_start + batch_write_size]
        start_row = batch_start + 2  # data starts at row 2
        end_row = start_row + len(batch) - 1
        range_str = f'{encoded_sheet}%21H{start_row}%3AN{end_row}'
        put_url = f'https://sheets.googleapis.com/v4/spreadsheets/{SEED_KW_ID}/values/{range_str}?valueInputOption=RAW'
        api_put(put_url, token, opener, {'values': batch})
        print(f'  Written rows {start_row}-{end_row} ({batch_start+1}-{batch_start+len(batch)} of {len(batch_values)})')

    print(f'\n[DONE] Seed Keywords backfill complete:')
    print(f'  Total keywords: {proof_found + no_proof}')
    print(f'  With competitor proof: {proof_found} ({proof_found/(proof_found+no_proof)*100:.1f}%)')
    print(f'  Without proof: {no_proof} ({no_proof/(proof_found+no_proof)*100:.1f}%)')
    print(f'  Priority distribution:')
    for p in ['P0', 'P1', 'P2', 'P3']:
        count = priority_dist.get(p, 0)
        pct = count / len(batch_values) * 100
        print(f'    {p}: {count} ({pct:.1f}%)')


if __name__ == '__main__':
    main()
