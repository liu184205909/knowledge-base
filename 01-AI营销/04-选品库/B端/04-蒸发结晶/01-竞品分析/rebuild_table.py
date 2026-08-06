#!/usr/bin/env python3
"""
重建飞书表：slug→完整URL + 新增英文主题列
1. 读取选题库_final.json
2. 构建完整URL（竞对域名+slug）
3. 创建新表（完整链接+英文主题+中文主题+文章类型+行业场景+竞对来源）
4. 写入3188条
5. 删除旧表
"""
import json, ssl, urllib.request, time, os, re

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

APP_ID = os.environ.get("LARK_APP_ID", "")
APP_SECRET = os.environ.get("LARK_APP_SECRET", "")
BASE_TOKEN = "NVS3bslX5aAlVWsXdGIcnOwinWh"
OLD_TABLE = "tblZ0wiTirpvWZGC"  # 选题库_clean（要删除）
API = "https://open.feishu.cn/open-apis"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def post(url, data, token=None):
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", "application/json")
    if token: req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, context=ssl_ctx, timeout=30) as r:
        return json.loads(r.read())

def delete(url, token=None):
    req = urllib.request.Request(url, method="DELETE")
    req.add_header("Content-Type", "application/json")
    if token: req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, context=ssl_ctx, timeout=30) as r:
        return json.loads(r.read())

# === 竞对域名映射 ===
DOMAIN_MAP = {
    'Alfa Laval': 'https://www.alfalaval.com',
    'SPX Flow': 'https://www.spxflow.com',
    'GEA': 'https://www.gea.com',
    'Myande': 'https://www.myande.com',
    'ANDRITZ': 'https://www.andritz.com',
    'Saltworks': 'https://www.saltworkstech.com',
    'EBNER': 'https://www.ebner-group.com',
    'Sunevap': 'https://www.sunevapgroup.com',
    'Vanoo': 'https://www.vanootech.com',
    'Enchem': 'https://www.enchem-tech.com',
    'Zewatech': 'https://www.zewatech.com',
    'Shachi': 'https://www.shachiengineering.com',
    'Goldfinch': 'https://www.goldfinchevaporators.com',
    'Ion Exchange': 'https://www.ionexchangeglobal.com',
    'Swenson': 'https://www.swensontechnology.com',
    '敏杰': 'https://www.shmjjx.com',
    '嘉泰': 'https://www.js-jiatai.com',
    'Ace': 'https://www.ace-chn.com',
    'MKS': 'https://www.mks.co.in',
    'SAMCO': 'https://www.samcotech.com',
    'Alaqua': 'https://www.alaquatec.com',
    'Toption': 'https://www.toptionlab.com',
    'ENCO': 'https://www.enco-tech.com',
    'ASOS': 'https://www.asostechnology.com',
    'Condorchem': 'https://www.condorchem.com',
}

# 竞对默认路径前缀（slug 不含 / 时使用）
PATH_PREFIX = {
    'Alfa Laval': '/insights/',
    'SPX Flow': '/news/',
    'GEA': '/en/news/',
    'Myande': '/news/',
    'ANDRITZ': '/references/',
    'Saltworks': '/resources/',
    'Sunevap': '/blog/',
    'Vanoo': '/post/',
    'Enchem': '/news-posts/',
    'Zewatech': '/en/applications/',
    'Shachi': '/blog/',
    'Goldfinch': '/blog/',
    'Ion Exchange': '/blog/',
    'SAMCO': '/blog/',
    'Alaqua': '/blog/',
    'Toption': '/news/',
    'ENCO': '/news/',
    'ASOS': '/blog/',
    'Condorchem': '/blog/',
    'Ace': '/info/',
    'MKS': '/blog/',
}

def build_url(competitor, slug):
    """构建完整 URL"""
    domain = DOMAIN_MAP.get(competitor, '')
    if not domain:
        return slug

    # slug 已含路径前缀（如 project/xxx）
    if '/' in slug:
        return f"{domain}/{slug}"

    # case-study-xxx → /case-study/xxx 或直接拼接
    if slug.startswith('case-study-'):
        return f"{domain}/case-study/{slug}/"

    # success-story-xxx
    if slug.startswith('success-story-'):
        return f"{domain}/references/success-story/{slug}/"

    # 使用默认路径前缀
    prefix = PATH_PREFIX.get(competitor, '/')
    return f"{domain}{prefix}{slug}/"

def slug_to_title(slug):
    """slug → 英文标题"""
    # 取最后一段（如果有路径）
    parts = slug.rstrip('/').split('/')
    text = parts[-1] if parts[-1] else (parts[-2] if len(parts) > 1 else slug)
    # 替换连字符为空格，Title Case
    title = text.replace('-', ' ').replace('_', ' ')
    words = title.split()
    # 保留全大写缩写（MVR, ZLD, DTB 等）
    result = []
    for w in words:
        if len(w) <= 4 and w.isupper():
            result.append(w)
        else:
            result.append(w.capitalize())
    return ' '.join(result)[:200]

# ==========================================
# 主流程
# ==========================================
print("=" * 60)

# Token
t = post(f"{API}/auth/v3/tenant_access_token/internal", {"app_id": APP_ID, "app_secret": APP_SECRET})
token = t["tenant_access_token"]
print("[1] Token OK")

# 加载数据
with open(os.path.join(SCRIPT_DIR, "选题库_final.json"), "r", encoding="utf-8") as f:
    all_records = json.load(f)

clean = [r for r in all_records if r['type_num'] != 8]
print(f"[2] Clean records: {len(clean)}")

# 构建完整数据
processed = []
for r in clean:
    comp = r.get('competitor', '')
    slug = r['slug']
    url = build_url(comp, slug)
    title_en = slug_to_title(slug)
    title_zh = r.get('title_zh', '')
    industry = r.get('industry', '')
    atype = r['type']

    processed.append({
        '文章类型': atype,
        '行业场景': industry,
        '完整链接': url,
        '英文主题': title_en,
        '中文主题': title_zh,
        '竞对来源': comp,
    })

# 统计 URL 构建情况
has_domain = sum(1 for p in processed if p['完整链接'].startswith('http'))
print(f"[3] URL 构建完成: {has_domain}/{len(processed)} 有域名")

# 创建新表
print("[4] 创建新表...")
new_table_resp = post(
    f"{API}/bitable/v1/apps/{BASE_TOKEN}/tables",
    {"table": {"name": "选题库_v3", "default_view_name": "main", "fields": [
        {"field_name": "文章类型", "type": 3, "property": {"options": [
            {"name": "1-解决方案/案例"}, {"name": "2-What-Is/原理"},
            {"name": "3-FAQ/选型"}, {"name": "4-技术对比/ROI"},
            {"name": "5-运维/材料/节能"}, {"name": "7-地理SEO"}
        ]}},
        {"field_name": "行业场景", "type": 1},
        {"field_name": "完整链接", "type": 1},
        {"field_name": "英文主题", "type": 1},
        {"field_name": "中文主题", "type": 1},
        {"field_name": "竞对来源", "type": 1},
    ]}},
    token
)

if new_table_resp.get('code') != 0:
    print(f"    创建表失败: {new_table_resp.get('msg', '')}")
    exit(1)

new_table_id = new_table_resp['data']['table_id']
print(f"    新表 ID: {new_table_id}")

# 写入数据
print(f"[5] 写入 {len(processed)} 条...")
create_url = f"{API}/bitable/v1/apps/{BASE_TOKEN}/tables/{new_table_id}/records/batch_create"
BATCH = 500
ok = 0
for i in range(0, len(processed), BATCH):
    batch = processed[i:i+BATCH]
    records_data = [{"fields": p} for p in batch]
    batch_num = i // BATCH + 1
    total_batches = (len(processed) + BATCH - 1) // BATCH

    try:
        resp = post(create_url, {"records": records_data}, token)
        if resp.get("code") == 0:
            ok += len(batch)
            print(f"    batch {batch_num}/{total_batches}: [OK] {len(batch)} (total {ok})")
        else:
            print(f"    batch {batch_num} FAIL: {resp.get('msg', '')}")
    except Exception as e:
        print(f"    batch {batch_num} ERROR: {e}")
    time.sleep(0.5)

print(f"    写入完成: {ok}")

# 删除旧表
print("[6] 删除旧表 (选题库_clean)...")
try:
    del_resp = delete(f"{API}/bitable/v1/apps/{BASE_TOKEN}/tables/{OLD_TABLE}", token)
    if del_resp.get('code') == 0:
        print("    [OK] 旧表已删除")
    else:
        print(f"    [FAIL] {del_resp.get('msg', '')}")
except Exception as e:
    print(f"    [FAIL] {e}")

# 完成
print(f"\n{'=' * 60}")
print(f"DONE: {ok} records in new table {new_table_id}")
print(f"URL: https://r2quepastz.feishu.cn/base/{BASE_TOKEN}")
print(f"{'=' * 60}")
