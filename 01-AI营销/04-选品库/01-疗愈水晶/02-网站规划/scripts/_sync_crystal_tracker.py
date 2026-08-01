# -*- coding: utf-8 -*-
"""同步 gemstone 排期到 Crystal Tracker。7 列结构（已删 Sources）：Crystal|KW|Vol|KD|URL|发布日期|是否收录
   URL=域名+slug；发布日期从 WP；按发布日期升序（空末尾）；是否收录保留用户填的值。
   用法: python _sync_crystal_tracker.py [--apply]
"""
import json, os, sys, urllib.parse
import requests

SITE = "https://goearthward.com"
TOKEN = json.load(open(os.path.expanduser('~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json')))['token']
ID = "1qh3KfZ3kdch9DdwE-cCiQqhaMGKMfbm2JLdL_C4-OFk"
PROXY = "http://127.0.0.1:10808"
SHEET = "'Crystal Tracker'"
APPLY = '--apply' in sys.argv
PX = {'https': PROXY, 'http': PROXY}
HDR = {'Authorization': f'Bearer {TOKEN}'}
HEADER = ['Crystal Name', 'Primary KW', 'Volume', 'KD', 'URL', '发布日期', '是否收录']

def api(method, path, body=None):
    enc = urllib.parse.quote(path, safe='!:')
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{ID}/values/{enc}"
    if method == 'GET':
        return requests.get(url, headers=HDR, proxies=PX, timeout=60).json()
    return requests.put(url + '?valueInputOption=USER_ENTERED', headers=HDR, proxies=PX, json={"values": body}, timeout=180).json()

data = api('GET', f"{SHEET}!A1:H600")
rows = data.get('values', [])
if 'error' in data:
    print("GET 失败:", data); sys.exit(1)
body = rows[1:]
print(f"读取 {len(body)} 行 | APPLY={APPLY}")

date_map = {w['slug']: w['date'] for w in json.load(open(r'D:\Code\knowledge-base\01-AI营销\04-选品库\C端\01-疗愈水晶\02-网站规划\assets\gemstone-schedule.json'))}

def extract_slug(u):
    return u.rstrip('/').split('/gemstone/')[-1] if '/gemstone/' in u else ''

out = []
matched = 0
for row in body:
    while len(row) < 8: row.append('')
    slug = extract_slug(row[4])
    url = f"{SITE}/gemstone/{slug}/" if slug else row[4]            # URL
    date = date_map.get(slug, '')                                   # 发布日期
    if slug in date_map: matched += 1
    indexed = row[7] if len(row) > 7 else ''                        # 是否收录（保留，可能含用户填的✓）
    out.append([row[0], row[1], row[2], row[3], url, date, indexed])  # 去掉 Sources(row[6])

out.sort(key=lambda r: (r[5] == '', r[5]))                          # 按发布日期升序，空末尾
print(f"匹配 {matched} | 未匹配 {len(out)-matched}")
print("排序后前5行:")
for r in out[:5]:
    print(f"  {r[0]} | {r[5] or '(空)'} | {r[4]} | 收录={r[6] or '(空)'}")

if not APPLY:
    print(f"\n[DRY-RUN] 将写 A1:G{len(out)+1}（7列，删Sources+排序）并清H列。加 --apply 实写。")
    sys.exit(0)

N = len(out)
print(f"\n写入 A1:G{N+1} ...")
print("  表头:", api('PUT', f"{SHEET}!A1:G1", [HEADER]).get('updatedCells'))
print("  全表:", api('PUT', f"{SHEET}!A2:G{N+1}", out).get('updatedCells'), 'cells')
print("  清H列残留:", api('PUT', f"{SHEET}!H1:H{N+1}", [[''] for _ in range(N+1)]).get('updatedCells'))
print("done")
