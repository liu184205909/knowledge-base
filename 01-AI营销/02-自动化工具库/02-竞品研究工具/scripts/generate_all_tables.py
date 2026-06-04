"""
Generate filtered TopPages_All and TopKeywords_All evidence worksheets.
Reads competitor worksheets directly, keeps only rows with traffic evidence,
adds source_sheet/normalized_url, and writes to the _All worksheet.

Usage: python generate_all_tables.py [--top-pages | --top-keywords | --both]
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

# Spreadsheet IDs
TOP_PAGES_ID = '1x__cXM-FCmTe_BjTND0nG0VhWrjbVl8iFajtXGE854U'
TOP_KEYWORDS_ID = '18CqR8GzvsonO5zYUaodDPB3oiIcdjdeCVJZn5BaPJng'

# Column specs: (header_name, url_col_index)
TOP_PAGES_HEADER = ['URL', 'Traffic(%)', 'Traffic', 'Top Keyword', 'Intent', 'LLM Prompts']
TOP_PAGES_URL_COL = 0  # Column A
TOP_PAGES_TRAFFIC_PCT_COL = 1
TOP_PAGES_TRAFFIC_COL = 2

TOP_KEYWORDS_HEADER = ['Keyword', 'Search Volume', 'Keyword Difficulty', 'CPC', 'URL', 'Traffic', 'Traffic(%)', 'Number of Results', 'Intent']
TOP_KEYWORDS_KEYWORD_COL = 0
TOP_KEYWORDS_VOLUME_COL = 1
TOP_KEYWORDS_KD_COL = 2
TOP_KEYWORDS_CPC_COL = 3
TOP_KEYWORDS_URL_COL = 4  # Column E
TOP_KEYWORDS_TRAFFIC_COL = 5
TOP_KEYWORDS_TRAFFIC_PCT_COL = 6

EXTRA_COLS = ['source_sheet', 'normalized_url']
EXCLUDED_SHEETS = {
    'TopKeywords_All',
    'TopPages_All',
    'Competitor-Sheet-Map',
    'Topic-Discovery',
    'Keyword-Page-Proof',
    'README',
    '字段说明',
}

# _All sheets are evidence indexes, not raw backups. Low-signal rows stay in
# each competitor's raw worksheet and are not promoted here.
MIN_PAGE_TRAFFIC = 100
MIN_KEYWORD_TRAFFIC = 1
MIN_KEYWORD_WORDS = 2
MAX_PAGES_PER_COMPETITOR = 300
MAX_KEYWORDS_PER_COMPETITOR = 2000


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
        # Use the refreshed access token in memory. Do not write the Google
        # Workspace credential file from this project script.
        c['token'] = refreshed['access_token']

    return c['token']


def get_opener():
    proxy = urllib.request.ProxyHandler({'https': PROXY, 'http': PROXY})
    return urllib.request.build_opener(proxy)


def normalize_url(url):
    """Normalize URL for cross-table joining."""
    if not url:
        return ''
    url = url.lower().strip()
    url = re.sub(r'^https?://', '', url)
    url = re.sub(r'^www\.', '', url)
    url = url.split('?')[0]
    url = url.split('#')[0]
    url = url.rstrip('/')
    return url


def to_number(value):
    """Parse Semrush numeric strings such as '1,234', '0.56', or '0%'."""
    if value is None:
        return 0.0
    text = str(value).strip().replace(',', '').replace('%', '')
    if not text:
        return 0.0
    try:
        return float(text)
    except ValueError:
        return 0.0


def has_traffic(row, traffic_index, traffic_pct_index):
    traffic = to_number(row[traffic_index]) if traffic_index < len(row) else 0.0
    traffic_pct = to_number(row[traffic_pct_index]) if traffic_pct_index < len(row) else 0.0
    return traffic >= MIN_KEYWORD_TRAFFIC or traffic_pct > 0


def word_count(text):
    return len(re.findall(r'[a-z0-9]+', str(text or '').lower()))


def should_keep_top_page(row):
    url = row[TOP_PAGES_URL_COL] if TOP_PAGES_URL_COL < len(row) else ''
    traffic = to_number(row[TOP_PAGES_TRAFFIC_COL]) if TOP_PAGES_TRAFFIC_COL < len(row) else 0.0
    return bool(url) and traffic >= MIN_PAGE_TRAFFIC


def should_keep_top_keyword(row):
    url = row[TOP_KEYWORDS_URL_COL] if TOP_KEYWORDS_URL_COL < len(row) else ''
    keyword = row[TOP_KEYWORDS_KEYWORD_COL] if TOP_KEYWORDS_KEYWORD_COL < len(row) else ''
    return (
        bool(keyword)
        and word_count(keyword) >= MIN_KEYWORD_WORDS
        and bool(url)
        and has_traffic(row, traffic_index=TOP_KEYWORDS_TRAFFIC_COL, traffic_pct_index=TOP_KEYWORDS_TRAFFIC_PCT_COL)
    )


def sort_key_top_page(row):
    return (
        -to_number(row[TOP_PAGES_TRAFFIC_COL] if len(row) > TOP_PAGES_TRAFFIC_COL else 0),
        -to_number(row[TOP_PAGES_TRAFFIC_PCT_COL] if len(row) > TOP_PAGES_TRAFFIC_PCT_COL else 0),
    )


def sort_key_top_keyword(row):
    kd_raw = row[TOP_KEYWORDS_KD_COL] if len(row) > TOP_KEYWORDS_KD_COL else ''
    kd = to_number(kd_raw) if str(kd_raw).strip() else 999
    return (
        -to_number(row[TOP_KEYWORDS_TRAFFIC_COL] if len(row) > TOP_KEYWORDS_TRAFFIC_COL else 0),
        -to_number(row[TOP_KEYWORDS_VOLUME_COL] if len(row) > TOP_KEYWORDS_VOLUME_COL else 0),
        kd,
        -to_number(row[TOP_KEYWORDS_CPC_COL] if len(row) > TOP_KEYWORDS_CPC_COL else 0),
    )


def sort_and_cap_rows(rows, all_sheet_name):
    if all_sheet_name == 'TopPages_All':
        return sorted(rows, key=sort_key_top_page)[:MAX_PAGES_PER_COMPETITOR]
    if all_sheet_name == 'TopKeywords_All':
        return sorted(rows, key=sort_key_top_keyword)[:MAX_KEYWORDS_PER_COMPETITOR]
    return rows


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


def list_worksheets(spreadsheet_id, token, opener):
    """List all worksheet titles in a spreadsheet."""
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}?fields=sheets.properties(title,sheetId)'
    data = api_get(url, token, opener)
    return [(s['properties']['title'], s['properties']['sheetId']) for s in data['sheets']]


def get_all_sheet_data(spreadsheet_id, sheet_title, token, opener):
    """Read all data from a worksheet."""
    encoded_title = urllib.request.quote(sheet_title, safe='')
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{encoded_title}!A1:ZZ'
    return api_get(url, token, opener)


def delete_worksheet(spreadsheet_id, sheet_id, token, opener):
    """Delete a worksheet."""
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}:batchUpdate'
    data = {
        'requests': [{
            'deleteSheet': {'sheetId': sheet_id}
        }]
    }
    return api_post(url, token, opener, data)


def create_worksheet(spreadsheet_id, title, token, opener):
    """Create a new worksheet and return its sheetId."""
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}:batchUpdate'
    data = {
        'requests': [{
            'addSheet': {
                'properties': {'title': title}
            }
        }]
    }
    result = api_post(url, token, opener, data)
    return result['replies'][0]['addSheet']['properties']['sheetId']


def write_data(spreadsheet_id, sheet_title, values, token, opener):
    """Write data to a worksheet using batchUpdate for large datasets."""
    encoded_title = urllib.request.quote(sheet_title, safe='')

    total_rows = len(values)
    if total_rows <= 5000:
        url = f'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{encoded_title}!A1?valueInputOption=RAW'
        return api_put(url, token, opener, {'values': values})

    first_batch_size = 5000
    first_batch = values[:first_batch_size]
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{encoded_title}!A1?valueInputOption=RAW'
    api_put(url, token, opener, {'values': first_batch})
    print(f'  Written rows 1-{len(first_batch)} of {total_rows}')

    append_batch_size = 3000
    remaining = values[first_batch_size:]
    written = len(first_batch)
    for i in range(0, len(remaining), append_batch_size):
        chunk = remaining[i:i + append_batch_size]
        append_url = f'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{encoded_title}%21A%3AA:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS'
        api_post(append_url, token, opener, {'values': chunk})
        start = written + i + 1
        end = written + i + len(chunk)
        print(f'  Written rows {start}-{end} of {total_rows}')

    return {'status': 'complete'}


def generate_all_table(spreadsheet_id, all_sheet_name, original_headers, url_col_index, token, opener, row_filter):
    """Generate an _All summary table from competitor worksheets."""
    print(f'\n{"="*60}')
    print(f'Generating {all_sheet_name} in spreadsheet {spreadsheet_id}')
    print(f'{"="*60}')

    # 1. List competitor worksheets directly. Output, helper, and docs sheets
    # are excluded by name; real competitor worksheet count is not hard-coded.
    all_sheets = list_worksheets(spreadsheet_id, token, opener)
    competitor_sheets = [
        title for title, _ in all_sheets
        if title not in EXCLUDED_SHEETS
    ]
    print(f'Competitor sheets to read: {len(competitor_sheets)}')

    # 2. Read data from each competitor sheet
    all_rows = []
    new_headers = original_headers + EXTRA_COLS
    all_rows.append(new_headers)

    total_data_rows = 0
    total_kept_rows = 0
    total_skipped_rows = 0
    total_capped_rows = 0
    total_errors = 0
    for sheet_title in competitor_sheets:
        print(f'  Reading {sheet_title}...')
        try:
            result = get_all_sheet_data(spreadsheet_id, sheet_title, token, opener)
        except Exception as e:
            print(f'    ERROR reading {sheet_title}: {e}')
            total_errors += 1
            continue
        values = result.get('values', [])
        if len(values) <= 1:
            print(f'    Empty or header-only, skipping')
            continue

        kept_rows = 0
        skipped_rows = 0
        sheet_rows = []

        # Skip header row
        for row in values[1:]:
            # Pad row to expected column count
            padded = row + [''] * (len(original_headers) - len(row))
            if not row_filter(padded):
                skipped_rows += 1
                continue

            url = padded[url_col_index] if url_col_index < len(padded) else ''

            padded.append(sheet_title)                 # source_sheet
            padded.append(normalize_url(url))          # normalized_url

            sheet_rows.append(padded[:len(new_headers)])
            kept_rows += 1

        capped_sheet_rows = sort_and_cap_rows(sheet_rows, all_sheet_name)
        capped_rows = len(sheet_rows) - len(capped_sheet_rows)
        all_rows.extend(capped_sheet_rows)

        data_rows = len(values) - 1
        total_data_rows += data_rows
        total_kept_rows += len(capped_sheet_rows)
        total_skipped_rows += skipped_rows
        total_capped_rows += capped_rows
        print(f'    {data_rows} data rows read, candidates={kept_rows}, kept={len(capped_sheet_rows)}, skipped_low_signal={skipped_rows}, capped={capped_rows}')

    print(f'\nTotal: {total_data_rows} data rows read, {total_kept_rows} kept, {total_skipped_rows} skipped, {total_capped_rows} capped, {total_errors} errors ({len(new_headers)} columns)')

    if total_kept_rows == 0:
        print('No data to write!')
        return

    # 4. Check if _All worksheet already exists, delete if so
    existing_sheets = list_worksheets(spreadsheet_id, token, opener)
    existing_all = [(title, sid) for title, sid in existing_sheets if title == all_sheet_name]
    if existing_all:
        print(f'Deleting existing {all_sheet_name} (id={existing_all[0][1]})...')
        delete_worksheet(spreadsheet_id, existing_all[0][1], token, opener)

    # 5. Create new _All worksheet
    print(f'Creating {all_sheet_name}...')
    new_sheet_id = create_worksheet(spreadsheet_id, all_sheet_name, token, opener)
    print(f'  Created sheet id={new_sheet_id}')

    # 6. Write data
    print(f'Writing {len(all_rows)} rows (1 header + {len(all_rows)-1} data)...')
    write_data(spreadsheet_id, all_sheet_name, all_rows, token, opener)

    print(f'\n[DONE] {all_sheet_name} generated: {len(all_rows)-1} data rows, {len(new_headers)} columns')
    print(f'  Columns: {new_headers}')


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else '--both'

    opener = get_opener()
    token = get_token(opener)

    if mode in ('--top-pages', '--both'):
        generate_all_table(
            spreadsheet_id=TOP_PAGES_ID,
            all_sheet_name='TopPages_All',
            original_headers=TOP_PAGES_HEADER,
            url_col_index=TOP_PAGES_URL_COL,
            token=token,
            opener=opener,
            row_filter=should_keep_top_page
        )

    if mode in ('--top-keywords', '--both'):
        generate_all_table(
            spreadsheet_id=TOP_KEYWORDS_ID,
            all_sheet_name='TopKeywords_All',
            original_headers=TOP_KEYWORDS_HEADER,
            url_col_index=TOP_KEYWORDS_URL_COL,
            token=token,
            opener=opener,
            row_filter=should_keep_top_keyword
        )


if __name__ == '__main__':
    main()
