#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Batch write TKD (rank_math_title/description/focus_keyword) for 21 tool pages via Rank Math REST."""
import json, os, sys, time, urllib.request, base64, urllib.error

ENV_PATH = os.path.expanduser('~/.env')
creds = {}
with open(ENV_PATH, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            creds[k.strip()] = v.strip()

WP_USER = creds['WP_USER']
WP_APP = creds['WP_APP_PASSWORD']
SITE = creds['WP_SITE']

auth = base64.b64encode(f"{WP_USER}:{WP_APP}".encode()).decode()
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Basic {auth}",
    "User-Agent": "curl/8.0.0",
    "Accept": "application/json",
}

HERE = os.path.dirname(os.path.abspath(__file__))
data = json.load(open(os.path.join(HERE, 'tkd-data.json'), 'r', encoding='utf-8'))

results = []
for pid, v in data.items():
    payload = {
        "objectType": "post",
        "objectID": int(pid),
        "meta": {
            "rank_math_title": v["title"],
            "rank_math_description": v["desc"],
            "rank_math_focus_keyword": v["kw"],
        }
    }
    body = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(f"https://{SITE}/wp-json/rankmath/v1/updateMeta", data=body, headers=headers, method='POST')
    ok = False; err = ''
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            rbody = resp.read().decode('utf-8', 'replace')
            ok = (resp.status == 200)
            if not ok: err = rbody[:200]
    except urllib.error.HTTPError as e:
        err = f"HTTP {e.code}: {e.read().decode('utf-8','replace')[:200]}"
    except Exception as e:
        err = str(e)[:200]
    results.append({"id": pid, "slug": v["slug"], "ok": ok, "err": err})
    print(f"{'OK ' if ok else 'FAIL'} {pid} {v['slug']:32} {err[:80]}")
    time.sleep(0.3)

ok_n = sum(1 for r in results if r['ok'])
print(f"\n=== {ok_n}/{len(results)} written OK ===")
json.dump(results, open(os.path.join(HERE, 'write-results.json'), 'w', encoding='utf-8'), indent=2)
