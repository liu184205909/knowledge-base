#!/usr/bin/env python3
"""
最终：删除 Type 8 + 清空飞书旧数据 + 写入干净数据
"""
import json, re, os, ssl, time
import urllib.request
from collections import Counter

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# === 飞书配置 ===
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

def http_get(url, headers=None):
    req = urllib.request.Request(url, method="GET")
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

# ==========================================
# Step 1: 加载并过滤数据
# ==========================================
print("=" * 60)
print("Step 1: 加载并过滤数据")
print("=" * 60)

json_path = os.path.join(SCRIPT_DIR, "选题库_final.json")
with open(json_path, 'r', encoding='utf-8') as f:
    all_records = json.load(f)

print(f"  输入: {len(all_records)} 条")

# 删除 Type 8
clean = [r for r in all_records if r['type_num'] != 8]
print(f"  删除 Type 8: {len(all_records) - len(clean)} 条")
print(f"  保留: {len(clean)} 条")

# 统计
type_dist = Counter(r['type'] for r in clean)
print(f"\n  最终类型分布:")
for t, c in sorted(type_dist.items()):
    print(f"    {t}: {c} ({100*c//len(clean)}%)")

has_zh = sum(1 for r in clean if r['title_zh'])
print(f"  有中文主题: {has_zh} / {len(clean)} ({100*has_zh//len(clean)}%)")

# ==========================================
# Step 2: 获取飞书 token
# ==========================================
print(f"\n{'=' * 60}")
print("Step 2: 获取飞书 Token")
print("=" * 60)

token = get_token()
print(f"  Token: {token[:20]}...")
headers = {"Authorization": f"Bearer {token}"}

# ==========================================
# Step 3: 添加"中文主题"字段（如果不存在）
# ==========================================
print(f"\n{'=' * 60}")
print("Step 3: 检查/添加字段")
print("=" * 60)

# 获取现有字段
fields_url = f"{API_BASE}/bitable/v1/apps/{BASE_TOKEN}/tables/{TABLE_ID}/fields"
fields_resp = http_get(fields_url, headers)
existing_fields = [f['field_name'] for f in fields_resp.get('data', {}).get('items', [])]
print(f"  现有字段: {existing_fields}")

# 添加"中文主题"字段（如果不存在）
if "中文主题" not in existing_fields:
    print("  添加 '中文主题' 字段...")
    try:
        resp = http_post(fields_url, {
            "field_name": "中文主题",
            "type": 1  # 文本类型
        }, headers)
        if resp.get("code") == 0:
            print("  [OK] 中文主题 已添加")
        else:
            print(f"  [FAIL] 添加失败: {resp.get('msg', '')}")
    except Exception as e:
        print(f"  [FAIL] 异常: {e}")
else:
    print("  [OK] 中文主题 已存在")

# ==========================================
# Step 4: 读取并删除所有旧记录
# ==========================================
print(f"\n{'=' * 60}")
print("Step 4: 清空旧数据")
print("=" * 60)

# 搜索所有记录 ID
all_record_ids = []
page_token = None
search_count = 0

while True:
    search_url = f"{API_BASE}/bitable/v1/apps/{BASE_TOKEN}/tables/{TABLE_ID}/records/search"
    params = {"page_size": 500}
    if page_token:
        params["page_token"] = page_token

    search_data = {"filter": {"conjunction": "and", "conditions": []}}
    search_url_with_params = f"{search_url}?page_size=500"
    if page_token:
        search_url_with_params += f"&page_token={page_token}"

    try:
        req = urllib.request.Request(search_url_with_params, method="POST",
                                     data=json.dumps({}).encode("utf-8"))
        req.add_header("Content-Type", "application/json; charset=utf-8")
        req.add_header("Authorization", f"Bearer {token}")
        with urllib.request.urlopen(req, context=ssl_ctx, timeout=30) as resp:
            result = json.loads(resp.read().decode("utf-8"))

        if result.get("code") != 0:
            print(f"  搜索失败: {result.get('msg', '')}")
            break

        data = result.get("data", {})
        items = data.get("items", [])
        for item in items:
            all_record_ids.append(item.get("record_id"))

        search_count += len(items)
        if not data.get("has_more"):
            break
        page_token = data.get("page_token")
    except Exception as e:
        print(f"  搜索异常: {e}")
        break

print(f"  找到 {len(all_record_ids)} 条旧记录")

# 批量删除（每批 500）
if all_record_ids:
    delete_url = f"{API_BASE}/bitable/v1/apps/{BASE_TOKEN}/tables/{TABLE_ID}/records/batch_delete"
    deleted = 0
    for i in range(0, len(all_record_ids), 500):
        batch = all_record_ids[i:i+500]
        try:
            resp = http_post(delete_url, {"records": batch}, headers)
            if resp.get("code") == 0:
                deleted += len(batch)
                print(f"  删除批次 {i//500 + 1}: {len(batch)} 条 (累计 {deleted})")
            else:
                print(f"  删除失败: {resp.get('msg', '')}")
        except Exception as e:
            print(f"  删除异常: {e}")
        time.sleep(0.3)
    print(f"  [OK] 共删除 {deleted} 条旧记录")

# ==========================================
# Step 5: 写入新数据
# ==========================================
print(f"\n{'=' * 60}")
print(f"Step 5: 写入 {len(clean)} 条新数据")
print("=" * 60)

BATCH = 500
total_ok = 0
total_fail = 0

for i in range(0, len(clean), BATCH):
    batch = clean[i:i+BATCH]
    batch_num = i // BATCH + 1
    total_batches = (len(clean) + BATCH - 1) // BATCH

    # 构造记录
    records_data = []
    for r in batch:
        fields = {
            "竞对": r.get('competitor', ''),
            "国别": "外贸",
            "文章类型": r['type'],
            "行业场景": r.get('industry', ''),
            "slug": r['slug'],
            "推断主题": r.get('title_zh', ''),
            "备注": "",
        }
        records_data.append({"fields": fields})

    print(f"  写入 {batch_num}/{total_batches}, {len(batch)} 条 (offset={i})...")

    url = f"{API_BASE}/bitable/v1/apps/{BASE_TOKEN}/tables/{TABLE_ID}/records/batch_create"
    try:
        resp = http_post(url, {"records": records_data}, headers)
        if resp.get("code") == 0:
            total_ok += len(batch)
            print(f"    [OK] 成功")
        else:
            print(f"    [FAIL] code={resp.get('code')} msg={resp.get('msg', '')}")
            total_fail += len(batch)
    except Exception as e:
        print(f"    [FAIL] 异常: {e}")
        total_fail += len(batch)

    time.sleep(0.5)

# ==========================================
# 总结
# ==========================================
print(f"\n{'=' * 60}")
print(f"完成!")
print(f"  成功写入: {total_ok}")
print(f"  失败: {total_fail}")
print(f"  类型分布:")
for t, c in sorted(type_dist.items()):
    print(f"    {t}: {c}")
print(f"{'=' * 60}")
