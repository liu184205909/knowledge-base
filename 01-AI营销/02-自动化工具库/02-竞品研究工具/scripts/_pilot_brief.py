#!/usr/bin/env python3
"""Fetch pilot batch data from Seed-Master for content brief generation."""
import sys, io, json, os, subprocess, urllib.parse, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

CRED = os.path.expanduser('~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json')
PROXY = 'http://127.0.0.1:10808'
token = json.load(open(CRED, encoding='utf-8'))['token']

def api_get(url):
    r = subprocess.run(['curl', '-s', '--proxy', PROXY, url,
                        '-H', f'Authorization: Bearer {token}'],
                       capture_output=True, timeout=60)
    return json.loads(r.stdout.decode('utf-8'))

pilots = [
    'amethyst crystal meaning',
    'dreaming about teeth falling out',
    'cancer zodiac',
    'the fool tarot meaning',
    'butterfly symbolism',
]

SS = '1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc'
enc = urllib.parse.quote('Seed-Master' + chr(33) + 'A1:X')
data = api_get(f'https://sheets.googleapis.com/v4/spreadsheets/{SS}/values/{enc}')
rows = data.get('values', [])
body = rows[1:]

def norm(kw):
    return re.sub(r'\s+', ' ', kw.lower().strip())

def v(row, i):
    return row[i] if len(row) > i else ''

for kw in pilots:
    nk = norm(kw)
    for row in body:
        if norm(v(row, 0)) == nk:
            print(f'KEYWORD: {v(row,0)}')
            print(f'  Topic: {v(row,2)}')
            print(f'  Entity: {v(row,3)}')
            print(f'  Subtopic: {v(row,4)}')
            print(f'  Content Role: {v(row,5)}')
            print(f'  Volume: {v(row,6)}')
            print(f'  KD: {v(row,7)}')
            print(f'  CPC: {v(row,8)}')
            print(f'  Intent: {v(row,10)}')
            print(f'  Matched: {v(row,11)}')
            print(f'  Best Source: {v(row,14)}')
            print(f'  Best URL: {v(row,15)}')
            print(f'  Best Traffic: {v(row,16)}')
            print(f'  Page Traffic: {v(row,18)}')
            print(f'  Page Top KW: {v(row,19)}')
            print(f'  Page Intent: {v(row,21)}')
            print(f'  Page Type: {v(row,23)}')
            print()
            break
