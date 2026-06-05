#!/usr/bin/env python3
"""Fetch Seed-Master data for pilot items #2-#5."""
import sys, io, json, os, subprocess, urllib.parse

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

CRED = os.path.expanduser('~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json')
PROXY = 'http://127.0.0.1:10808'
SS_SEED = '1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc'

PILOT_KWS = [
    'teeth falling out dream',
    'cancer zodiac sign',
    'the fool tarot',
    'butterfly symbolism',
]

def get_token():
    return json.load(open(CRED, encoding='utf-8'))['token']

def api_get(url):
    r = subprocess.run(['curl', '-s', '--proxy', PROXY, url,
                        '-H', f'Authorization: Bearer {get_token()}'],
                       capture_output=True, timeout=120)
    return json.loads(r.stdout.decode('utf-8'))

def norm_kw(kw):
    import re
    return re.sub(r'\s+', ' ', kw.lower().strip())

def main():
    enc = urllib.parse.quote('Seed-Master' + chr(33) + 'A1:X')
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{SS_SEED}/values/{enc}'
    data = api_get(url)
    rows = data.get('values', [])
    header = rows[0] if rows else []

    print(f'Header: {header}')
    print(f'Total rows: {len(rows) - 1}')
    print()

    # Find matching rows for each pilot keyword
    for pilot_kw in PILOT_KWS:
        nk = norm_kw(pilot_kw)
        matches = []
        for row in rows[1:]:
            kw = row[0] if len(row) > 0 else ''
            if nk in norm_kw(kw):
                matches.append(row)

        print(f'=== {pilot_kw} ===')
        print(f'  Matches: {len(matches)}')
        if matches:
            # Show top 5 by volume
            def get_vol(r):
                try:
                    return int(float(str(r[6]).replace(',', '')))
                except:
                    return 0
            matches.sort(key=get_vol, reverse=True)
            for m in matches[:5]:
                kw = m[0] if len(m) > 0 else ''
                vol = m[6] if len(m) > 6 else ''
                kd = m[7] if len(m) > 7 else ''
                cpc = m[8] if len(m) > 8 else ''
                topic = m[2] if len(m) > 2 else ''
                entity = m[3] if len(m) > 3 else ''
                pt = m[23] if len(m) > 23 else ''
                matched = m[11] if len(m) > 11 else ''
                print(f'  KW: {kw} | Vol: {vol} | KD: {kd} | CPC: {cpc}')
                print(f'    Topic: {topic} | Entity: {entity} | PT: {pt} | Matched: {matched}')
        print()

if __name__ == '__main__':
    main()
