#!/usr/bin/env python3
"""修复：读取所有记录 → 全删 → 重写3188条干净数据"""
import json, os, ssl, time
import urllib.request
from collections import Counter

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

APP_ID = os.environ.get("LARK_APP_ID", "")
APP_SECRET = os.environ.get("LARK_APP_SECRET", "")
BASE_TOKEN = "NVS3bslX5aAlVWsXdGIcnOwinWh"
TABLE_ID = "tblU9N0w0fWN3KEk"
API_BASE = "https://open.feishu.cn/open-apis"

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

def http_post(url, data, headers=None):
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", "application/json; charset=utf-8")
    if headers:
        for k, v in headers.items():
            req.add_header(k, v)
    with urllib.request.urlopen(req, context=ssl_ctx, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))

def get_token():
    resp = http_post(f"{API_BASE}/auth/v3/tenant_access_token/internal",
                     {"app_id": APP_ID, "app_secret": APP_SECRET})
    return resp["tenant_access_token"]

token = get_token()
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json; charset=utf-8"}

# === Step 1: 读取所有记录 ID ===
print("Step 1: 读取所有记录 ID...")
all_ids = []
page_token = ""
page_num = 0

while True:
    page_num += 1
    url = f"{API_BASE}/bitable/v1/apps/{BASE_TOKEN}/tables/{TABLE_ID}/records/search?page_size=500"
    if page_token:
        url += f"&page_token={page_token}"

    body = json.dumps({}).encode("utf-8")
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", "application/json; charset=utf-8")
    req.add_header("Authorization", f"Bearer {token}")

    try:
        with urllib.request.urlopen(req, context=ssl_ctx, timeout=30) as resp:
            result = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"  [尝试 list API] page {page_num}: {e}")
        # 尝试 list API
        url2 = f"{API_BASE}/bitable/v1/apps/{BASE_TOKEN}/tables/{TABLE_ID}/records?page_size=500"
        if page_token:
            url2 += f"&page_token={page_token}"
        try:
            req2 = urllib.request.Request(url2, method="GET")
            req2.add_header("Authorization", f"Bearer {token}")
            with urllib.request.urlopen(req2, context=ssl_ctx, timeout=30) as resp2:
                result = json.loads(resp2.read().decode("utf-8"))
        except Exception as e2:
            print(f"  [list API 也失败] {e2}")
            break

    data = result.get("data", {})
    items = data.get("items", [])
    for item in items:
        rid = item.get("record_id")
        if rid:
            all_ids.append(rid)

    print(f"  page {page_num}: +{len(items)} (total {len(all_ids)})")

    if not data.get("has_more"):
        break
    page_token = data.get("page_token", "")
    if not page_token:
        break
    time.sleep(0.2)

print(f"\n  总计 {len(all_ids)} 条记录")

# === Step 2: 批量删除 ===
if all_ids:
    print(f"\nStep 2: 删除 {len(all_ids)} 条记录...")
    del_url = f"{API_BASE}/bitable/v1/apps/{BASE_TOKEN}/tables/{TABLE_ID}/records/batch_delete"
    deleted = 0
    for i in range(0, len(all_ids), 500):
        batch = all_ids[i:i+500]
        try:
            resp = http_post(del_url, {"records": batch}, headers)
            if resp.get("code") == 0:
                deleted += len(batch)
                print(f"  batch {i//500+1}: {len(batch)} (total {deleted})")
            else:
                print(f"  batch {i//500+1} FAIL: {resp.get('msg','')}")
        except Exception as e:
            print(f"  batch {i//500+1} ERROR: {e}")
        time.sleep(0.3)
    print(f"  [OK] deleted {deleted}")

# === Step 3: 重写 3188 条 ===
print(f"\nStep 3: 重写干净数据...")
json_path = os.path.join(SCRIPT_DIR, "选题库_final.json")
with open(json_path, 'r', encoding='utf-8') as f:
    all_records = json.load(f)

clean = [r for r in all_records if r['type_num'] != 8]
print(f"  {len(clean)} records to write")

create_url = f"{API_BASE}/bitable/v1/apps/{BASE_TOKEN}/tables/{TABLE_ID}/records/batch_create"
BATCH = 500
ok = 0
for i in range(0, len(clean), BATCH):
    batch = clean[i:i+BATCH]
    records_data = []
    for r in batch:
        fields = {
            "竞对": r.get('competitor', ''),
            "国别": "外贸",
            "文章类型": r['type'],
            "行业场景": r.get('industry', ''),
            "slug": r['slug'],
            "推断主题": r.get('title_zh', ''),
            "中文主题": r.get('title_zh', ''),
            "备注": "",
        }
        records_data.append({"fields": fields})

    try:
        resp = http_post(create_url, {"records": records_data}, headers)
        if resp.get("code") == 0:
            ok += len(batch)
            print(f"  batch {i//500+1}/{(len(clean)+499)//500}: [OK] {len(batch)} (total {ok})")
        else:
            print(f"  batch {i//500+1} FAIL: {resp.get('msg','')}")
    except Exception as e:
        print(f"  batch {i//500+1} ERROR: {e}")
    time.sleep(0.5)

print(f"\n{'='*60}")
print(f"DONE: {ok} records written")
print(f"{'='*60}")
