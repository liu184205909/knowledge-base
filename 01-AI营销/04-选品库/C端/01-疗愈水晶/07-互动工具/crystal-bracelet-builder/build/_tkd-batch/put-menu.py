#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""PUT update cms_block 47990 mega menu content."""
import json, os, urllib.request, base64

ENV = os.path.expanduser('~/.env')
import re
env = open(ENV, 'r', encoding='utf-8').read()
def g(k): return re.search(rf'^{k}=(.*)$', env, re.M).group(1).strip()
WP_USER, WP_APP, SITE = g('WP_USER'), g('WP_APP_PASSWORD'), g('WP_SITE')

auth = base64.b64encode(f"{WP_USER}:{WP_APP}".encode()).decode()
headers = {"Content-Type": "application/json", "Authorization": f"Basic {auth}", "User-Agent": "curl/8.0.0"}

HERE = os.path.dirname(os.path.abspath(__file__))
new_raw = open(os.path.join(HERE, 'menu-new-raw.txt'), 'r', encoding='utf-8').read()

payload = {"content": new_raw}
body = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(f"https://{SITE}/wp-json/wp/v2/cms_block/47990?context=edit",
                             data=body, headers=headers, method='POST')  # WP REST: POST to update existing
try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        r = resp.read().decode('utf-8', 'replace')
        print("HTTP", resp.status)
        d = json.loads(r)
        print("id:", d.get('id'), "slug:", d.get('slug'))
        raw = d.get('content', {}).get('raw', '')
        print("NEW RAW LEN:", len(raw))
        # Confirm new links present
        for needle in ['/tools/daily-tarot/', '/tools/crystal-bracelet-builder/', 'Daily Tarot', 'Crystal Bracelet Builder']:
            print(f"  contains {needle!r}:", needle in raw)
except urllib.error.HTTPError as e:
    print("FAIL HTTP", e.code, e.read().decode('utf-8', 'replace')[:500])
