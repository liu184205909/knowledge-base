"""
Generate Keyword-Page-Proof from filtered TopKeywords_All x TopPages_All.
For each keyword with traffic, checks if its ranking URL exists as a top page
with traffic. Keyword-Page-Proof is an evidence view, not a raw keyword dump.

Output columns:
  Keyword | Competitor Domain | Ranking URL | Normalized URL |
  Search Volume | KD | CPC | Keyword Traffic | Keyword Traffic(%) |
  Page Traffic | Page Top Keyword | Proof Level
"""

import json
import re
import sys
import time
import urllib.request
import urllib.error
import urllib.parse

TOKEN_FILE = r'C:\Users\Dylan\.google_workspace_mcp\credentials\lzn184205909@gmail.com.json'
PROXY = 'http://127.0.0.1:10808'

TOP_PAGES_ID = '1x__cXM-FCmTe_BjTND0nG0VhWrjbVl8iFajtXGE854U'
TOP_KEYWORDS_ID = '18CqR8GzvsonO5zYUaodDPB3oiIcdjdeCVJZn5BaPJng'
SEED_KEYWORDS_ID = '1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc'

EXCLUDED_SHEETS = {'README', '字段说明', 'TopPages_All', 'TopKeywords_All', 'Keyword-Page-Proof'}

MIN_KEYWORD_TRAFFIC = 1
MIN_PAGE_TRAFFIC = 100


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


def normalize_keyword(keyword):
    return re.sub(r'\s+', ' ', str(keyword or '').lower().strip())


def classify_proof(keyword_traffic, page_traffic):
    """Classify proof level based on traffic thresholds."""
    kt = to_number(keyword_traffic)
    pt = to_number(page_traffic)

    if kt < MIN_KEYWORD_TRAFFIC or pt < MIN_PAGE_TRAFFIC:
        return 'None'

    if kt >= 100 and pt >= 1000:
        return 'Strong'
    elif kt >= 10 and pt >= 100:
        return 'Medium'
    elif kt >= MIN_KEYWORD_TRAFFIC and pt >= MIN_PAGE_TRAFFIC:
        return 'Weak'
    else:
        return 'None'


def main():
    opener = get_opener()
    token = get_token(opener)

    # ==========================================
    # Step 0: Read Seed Keywords for proof scoping
    # ==========================================
    print('Step 0: Reading Seed Keywords scope...')
    seed_meta_url = f'https://sheets.googleapis.com/v4/spreadsheets/{SEED_KEYWORDS_ID}?fields=sheets.properties(title,sheetId)'
    seed_meta = api_get(seed_meta_url, token, opener)
    seed_sheet_title = seed_meta['sheets'][0]['properties']['title']
    encoded_seed_sheet = urllib.request.quote(seed_sheet_title, safe='')
    seed_url = f'https://sheets.googleapis.com/v4/spreadsheets/{SEED_KEYWORDS_ID}/values/{encoded_seed_sheet}%21A%3AA'
    seed_data = api_get(seed_url, token, opener)
    seed_keywords = {
        normalize_keyword(row[0])
        for row in seed_data.get('values', [])[1:]
        if row and normalize_keyword(row[0])
    }
    print(f'  Seed keyword scope: {len(seed_keywords)} keywords')

    # ==========================================
    # Step 1: Read TopPages_All and build lookup
    # ==========================================
    print('Step 1: Reading TopPages_All...')
    sheet = urllib.request.quote('TopPages_All', safe='')
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_PAGES_ID}/values/{sheet}%21A%3AJ'
    data = api_get(url, token, opener)
    tp_values = data['values']
    tp_header = tp_values[0]
    print(f'  TopPages_All: {len(tp_values)-1} rows, columns: {tp_header}')

    # Column indices for TopPages_All
    # URL=0, Traffic(%)=1, Traffic=2, Top Keyword=3,
    # Primary Intent=4, LLM Prompts=5, competitor_domain=6, source_sheet=7, normalized_url=8
    TP_URL = 0
    TP_TRAFFIC_PCT = 1
    TP_TRAFFIC = 2
    TP_TOP_KEYWORD = 3
    TP_COMPETITOR_DOMAIN = 6
    TP_NORMALIZED_URL = 8

    # Build lookup: (competitor_domain, normalized_url) -> page data
    page_lookup = {}
    for row in tp_values[1:]:
        domain = row[TP_COMPETITOR_DOMAIN] if len(row) > TP_COMPETITOR_DOMAIN else ''
        norm_url = row[TP_NORMALIZED_URL] if len(row) > TP_NORMALIZED_URL else ''
        key = (domain, norm_url)
        page_traffic = row[TP_TRAFFIC] if len(row) > TP_TRAFFIC else ''
        if to_number(page_traffic) < MIN_PAGE_TRAFFIC:
            continue

        if key not in page_lookup:
            page_lookup[key] = {
                'page_traffic': page_traffic,
                'page_top_keyword': row[TP_TOP_KEYWORD] if len(row) > TP_TOP_KEYWORD else '',
            }
    print(f'  Built lookup with {len(page_lookup)} unique pages')

    # ==========================================
    # Step 2: Read TopKeywords_All in batches
    # ==========================================
    print('\nStep 2: Reading TopKeywords_All...')
    sheet2 = urllib.request.quote('TopKeywords_All', safe='')
    url2 = f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KEYWORDS_ID}/values/{sheet2}%21A%3AM'
    data2 = api_get(url, token, opener)  # This might be too large for one call
    # Actually let's use a different approach - read the keyword data directly

    # TopKeywords_All columns (after Position/Competition removal):
    # 0:Keyword 1:Search Volume 2:KD 3:CPC 4:URL 5:Traffic 6:Traffic(%)
    # 7:Number of Results 8:Keyword Intents 9:competitor_domain 10:source_sheet 11:normalized_url

    # Read in chunks
    all_proof_rows = []
    header = ['Keyword', 'Competitor Domain', 'Ranking URL', 'Normalized URL',
              'Search Volume', 'KD', 'CPC',
              'Keyword Traffic', 'Keyword Traffic(%)',
              'Page Traffic', 'Page Top Keyword', 'Proof Level']
    all_proof_rows.append(header)

    batch_size = 10000
    offset = 1
    total_keywords = 0
    skipped_header = 0
    skipped_zero_keyword_traffic = 0
    matched = 0
    unmatched = 0
    written_rows = 0
    seed_scope_rows = 0
    incremental_rows = 0

    while True:
        end_row = offset + batch_size - 1
        range_str = f'{sheet2}%21A{offset}%3AM{end_row}'
        url_chunk = f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KEYWORDS_ID}/values/{range_str}'
        try:
            chunk_data = api_get(url_chunk, token, opener)
        except Exception as e:
            print(f'  Error reading rows {offset}-{end_row}: {e}')
            break

        chunk_values = chunk_data.get('values', [])
        if not chunk_values:
            break

        for row in chunk_values:
            if row and row[0] == 'Keyword':
                skipped_header += 1
                continue

            total_keywords += 1
            # Pad row to 12 columns
            padded = row + [''] * (12 - len(row))

            keyword = padded[0]
            normalized_keyword = normalize_keyword(keyword)
            search_vol = padded[1]
            kd = padded[2]
            cpc = padded[3]
            url = padded[4]
            traffic = padded[5]
            traffic_pct = padded[6]
            # num_results = padded[7]
            # intents = padded[8]
            domain = padded[9]
            norm_url = padded[11]

            if not keyword or not url or to_number(traffic) < MIN_KEYWORD_TRAFFIC:
                skipped_zero_keyword_traffic += 1
                continue

            # Lookup page data
            key = (domain, norm_url)
            page_data = page_lookup.get(key)

            if page_data:
                matched += 1
                page_traffic = page_data['page_traffic']
                page_top_kw = page_data['page_top_keyword']
            else:
                unmatched += 1
                continue

            proof_level = classify_proof(traffic, page_traffic)
            if proof_level == 'None':
                continue

            in_seed_scope = normalized_keyword in seed_keywords
            is_incremental_candidate = proof_level in ('Strong', 'Medium')
            if not in_seed_scope and not is_incremental_candidate:
                continue

            if in_seed_scope:
                seed_scope_rows += 1
            else:
                incremental_rows += 1

            proof_row = [
                keyword, domain, url, norm_url,
                search_vol, kd, cpc,
                traffic, traffic_pct,
                page_traffic, page_top_kw, proof_level
            ]
            all_proof_rows.append(proof_row)
            written_rows += 1

        print(f'  Processed {total_keywords} keywords (matched={matched}, unmatched={unmatched}, kept={written_rows}, seed_scope={seed_scope_rows}, incremental={incremental_rows}, skipped_zero_keyword_traffic={skipped_zero_keyword_traffic})')

        if len(chunk_values) < batch_size:
            break
        offset += batch_size

    print(f'\nTotal: {total_keywords} keywords, {matched} matched to pages, {unmatched} unmatched, {written_rows} proof rows kept ({seed_scope_rows} seed-scope, {incremental_rows} incremental Strong/Medium), {skipped_zero_keyword_traffic} zero-traffic keywords skipped, {skipped_header} header rows skipped')

    # ==========================================
    # Step 3: Write Keyword-Page-Proof
    # ==========================================
    print(f'\nStep 3: Writing Keyword-Page-Proof ({len(all_proof_rows)} rows)...')

    # Check if Keyword-Page-Proof sheet already exists in Top Keywords spreadsheet
    sheets_url = f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KEYWORDS_ID}?fields=sheets.properties(title,sheetId)'
    sheets_data = api_get(sheets_url, token, opener)
    for s in sheets_data['sheets']:
        if s['properties']['title'] == 'Keyword-Page-Proof':
            print(f'  Deleting existing Keyword-Page-Proof (id={s["properties"]["sheetId"]})...')
            del_url = f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KEYWORDS_ID}:batchUpdate'
            api_post(del_url, token, opener, {
                'requests': [{'deleteSheet': {'sheetId': s['properties']['sheetId']}}]
            })
            break

    # Create new sheet
    print('  Creating Keyword-Page-Proof worksheet...')
    create_url = f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KEYWORDS_ID}:batchUpdate'
    result = api_post(create_url, token, opener, {
        'requests': [{'addSheet': {'properties': {'title': 'Keyword-Page-Proof'}}}]
    })
    print(f'  Created sheet id={result["replies"][0]["addSheet"]["properties"]["sheetId"]}')

    # Write data in batches using append
    data_rows = all_proof_rows[1:]  # Skip header for first batch
    # First batch includes header
    first_batch_size = 5000
    first_batch = all_proof_rows[:1 + first_batch_size]  # header + first data rows

    proof_sheet = urllib.request.quote('Keyword-Page-Proof', safe='')
    put_url = f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KEYWORDS_ID}/values/{proof_sheet}%21A1?valueInputOption=RAW'
    api_put(put_url, token, opener, {'values': first_batch})
    written = len(first_batch) - 1  # data rows written
    print(f'  Written rows 1-{written} of {len(data_rows)}')

    # Remaining batches via append
    remaining = data_rows[first_batch_size:]
    append_batch_size = 3000
    for i in range(0, len(remaining), append_batch_size):
        batch = remaining[i:i + append_batch_size]
        append_url = f'https://sheets.googleapis.com/v4/spreadsheets/{TOP_KEYWORDS_ID}/values/{proof_sheet}%21A%3AA:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS'
        api_post(append_url, token, opener, {'values': batch})
        end = written + i + len(batch)
        print(f'  Written rows {written + i + 1}-{end} of {len(data_rows)}')

    print(f'\n[DONE] Keyword-Page-Proof: {len(data_rows)} data rows, {len(header)} columns')

    # Print proof level distribution
    proof_counts = {}
    for row in all_proof_rows[1:]:
        level = row[13]
        proof_counts[level] = proof_counts.get(level, 0) + 1
    print('  Proof Level distribution:')
    for level in ['Strong', 'Medium', 'Weak', 'None']:
        count = proof_counts.get(level, 0)
        pct = count / len(data_rows) * 100
        print(f'    {level}: {count} ({pct:.1f}%)')


if __name__ == '__main__':
    main()
