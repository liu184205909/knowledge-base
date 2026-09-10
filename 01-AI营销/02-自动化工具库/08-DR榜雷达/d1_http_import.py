#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
D1 HTTP API 同步导入器（2026-09-08）
背景：wrangler d1 execute --file 走上传+后台异步处理，有竞态且写入量不可控（实测自动膨胀）——
弃用。本脚本直接 POST /d1/database/{id}/query，同步返回，每条语句立等立知。
数据：dr_top1m.sqlite -> D1 dr-radar（99.5 万行，830 条 INSERT，每条 ~1200 行/72KB < D1 100KB 语句上限）
"""
import sqlite3, os, sys, time, json, urllib.request

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE = os.path.dirname(os.path.abspath(__file__))
ENV = {}
with open(os.path.expanduser('~/.env'), encoding='utf-8') as f:
    for line in f:
        if '=' in line and not line.strip().startswith('#'):
            k, v = line.strip().split('=', 1)
            ENV[k] = v

TOKEN = ENV['CLOUDFLARE_API_TOKEN']
ACCOUNT = ENV['CLOUDFLARE_ACCOUNT_ID']
DB_ID = '2936a004-96f8-4812-878d-b3ffb01fe7ad'
URL = f'https://api.cloudflare.com/client/v4/accounts/{ACCOUNT}/d1/database/{DB_ID}/query'
PROXY = urllib.request.ProxyHandler({'https': ENV.get('HTTPS_PROXY') or ENV.get('https_proxy') or 'http://127.0.0.1:10808'})

def api(sql):
    body = json.dumps({'sql': sql}).encode()
    req = urllib.request.Request(URL, data=body, method='POST',
        headers={'Authorization': f'Bearer {TOKEN}', 'Content-Type': 'application/json'})
    opener = urllib.request.build_opener(PROXY)
    with opener.open(req, timeout=120) as r:
        d = json.load(r)
    if not d.get('success'):
        raise RuntimeError(json.dumps(d.get('errors'))[:300])
    return d

def esc(d):
    return d.replace("'", "''")

db = sqlite3.connect(os.path.join(BASE, 'dr_top1m.sqlite'))
rows = db.execute('SELECT domain, dr, "rank" FROM dr').fetchall()
print('rows to import:', len(rows))

api('CREATE TABLE IF NOT EXISTS dr (domain TEXT PRIMARY KEY, dr REAL, "rank" INTEGER)')
print('table created')

STMT = 1200
ok = 0
t0 = time.time()
for i in range(0, len(rows), STMT):
    chunk = rows[i:i + STMT]
    vals = ','.join(f"('{esc(d)}',{dr},{r})" for d, dr, r in chunk)
    sql = f'INSERT OR IGNORE INTO dr VALUES {vals}'
    for attempt in range(5):
        try:
            api(sql)
            ok += len(chunk)
            break
        except Exception as e:
            if attempt == 4:
                print(f'FAILED at row {i}: {e}')
                sys.exit(1)
            wait = 10 * (2 ** attempt)
            print(f'retry {attempt+1} at row {i} after {wait}s: {str(e)[:120]}', flush=True)
            time.sleep(wait)
    time.sleep(0.15)
    if (i // STMT) % 50 == 0:
        print(f'{ok}/{len(rows)} ({time.time()-t0:.0f}s)', flush=True)

api('CREATE INDEX IF NOT EXISTS idx_rank ON dr("rank")')
c = api('SELECT COUNT(*) c FROM dr')['result'][0]['results'][0]['c']
print(f'IMPORT DONE: written {ok}, final count {c}, {time.time()-t0:.0f}s')
assert c == len(rows), f'COUNT mismatch: {c} != {len(rows)}'
print('VERIFIED: count matches local')
