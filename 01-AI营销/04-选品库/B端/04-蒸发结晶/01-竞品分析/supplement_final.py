#!/usr/bin/env python3
"""
最终补充脚本：从本地 XML + 在线 sitemap 采集 Sunevap + Vanoo + Enchem 全量 slug
Sunevap: 读本地 XML（4 个子 sitemap，Cloudflare 已解除但 showlist 仍被挡）
Vanoo:   在线抓 sitemap_index.xml
Enchem:  在线抓 sitemap.xml
输出：清洗 MD + 可选写入飞书（--write）
"""

import json, time, re, ssl, sys, os
import urllib.request, urllib.parse
from collections import Counter

# === 飞书配置 ===
APP_ID = os.environ.get("LARK_APP_ID", "")
APP_SECRET = os.environ.get("LARK_APP_SECRET", "")
BASE_TOKEN = "NVS3bslX5aAlVWsXdGIcnOwinWh"
TABLE_ID = "tblU9N0w0fWN3KEk"
API_BASE = "https://open.feishu.cn/open-apis"

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def http_post(url, data, headers=None):
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", "application/json; charset=utf-8")
    if headers:
        for k, v in headers.items():
            req.add_header(k, v)
    with urllib.request.urlopen(req, context=ssl_ctx, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))

def http_get(url):
    req = urllib.request.Request(url, method="GET")
    req.add_header("User-Agent", BROWSER_UA)
    with urllib.request.urlopen(req, context=ssl_ctx, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="replace")

def get_token():
    url = f"{API_BASE}/auth/v3/tenant_access_token/internal"
    resp = http_post(url, {"app_id": APP_ID, "app_secret": APP_SECRET})
    return resp.get("tenant_access_token")

# === Sitemap 解析 ===
def parse_xml_urls(filepath):
    """从本地 XML 文件解析 URL 列表"""
    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        xml = f.read()
    # 检查是否是 Cloudflare 挑战页
    if "Just a moment" in xml or "challenge" in xml[:500].lower():
        return []
    urls = re.findall(r'<loc>(.*?)</loc>', xml)
    return [u.strip() for u in urls if u.strip()]

def fetch_sitemap_online(url):
    """在线获取 sitemap XML"""
    try:
        xml = http_get(url)
        if "Just a moment" in xml or len(xml) < 100:
            return []
        urls = re.findall(r'<loc>(.*?)</loc>', xml)
        return [u.strip() for u in urls if u.strip()]
    except Exception as e:
        print(f"  [WARN] fetch {url} failed: {e}")
        return []

def fetch_all_urls_online(domain, sitemap_path="/sitemap.xml"):
    base_url = f"https://{domain}{sitemap_path}"
    print(f"  Fetching {base_url}...")
    urls = fetch_sitemap_online(base_url)
    sub_sitemaps = [u for u in urls if u.endswith('.xml')]
    article_urls = [u for u in urls if not u.endswith('.xml')]
    if sub_sitemaps:
        print(f"  Found {len(sub_sitemaps)} sub-sitemaps")
        for sm in sub_sitemaps:
            sub_urls = fetch_sitemap_online(sm)
            sub_article = [u for u in sub_urls if not u.endswith('.xml')]
            article_urls.extend(sub_article)
            print(f"    {sm.split('/')[-1]}: {len(sub_article)} URLs")
            time.sleep(1)
    return article_urls

# === 分类逻辑（8类）===
TYPE_MAP = {
    1: "1-解决方案/案例",
    2: "2-What-Is/原理",
    3: "3-FAQ/买家提问",
    4: "4-技术对比/ROI",
    5: "5-运维/材料/节能",
    6: "6-展会/新闻/项目",
    7: "7-地理SEO",
    8: "8-其他"
}

def classify_slug(slug, competitor, url_path=""):
    s = slug.lower()

    # 地理 SEO（最高优先级）
    geo_kw = ['top-', 'best-', 'manufacturers-in-', 'suppliers-in', 'in-australia',
              'in-usa', 'in-china', 'in-france', 'in-pakistan', 'in-vietnam',
              'in-indonesia', 'in-south-africa', 'in-korea', 'in-india',
              'in-jordan', 'in-brazil', 'in-turkey', 'in-saudi', 'in-malaysia',
              'in-houston', 'in-sydney', 'in-karachi', 'in-lahore', 'in-hanoi',
              'in-jakarta', 'in-shanghai', 'in-paris', 'in-johannesburg']
    if any(k in s for k in geo_kw):
        return 7

    # 技术对比/ROI
    if any(k in s for k in ['vs-', '-vs-', 'comparison', 'compare', 'cost', 'pricing',
                            'opex', 'roi', 'payback', 'energy-saving', 'energy-savings',
                            'cut-operating', 'reduce-energy', 'reduce-opex']):
        if 'vs-' in s or '-vs-' in s or 'comparison' in s:
            return 4

    # FAQ
    if any(k in s for k in ['how-much', 'how-to-choose', 'how-many', 'common-problem',
                            'what-book', 'is-the-investment', 'what-is-the-best',
                            'mix-match', 'how-do-you', 'how-inefficient', 'how-does-the',
                            'what-type', 'what-are', 'best-way']):
        return 3

    # What-Is/原理
    if any(k in s for k in ['what-is', 'whats-the', 'principle', 'working-principle',
                            'guide', 'how-does', 'how-to', 'understand', 'introduction',
                            'classification', 'types-of', 'exploring', 'about-mvr',
                            'custom-vs-standard', 'customized']):
        return 2

    # 运维/材料/节能
    if any(k in s for k in ['cleaning', 'descale', 'scaling', 'fouling', 'anti-fouling',
                            'material-selection', 'material-consideration', 'maintenance',
                            'troubleshoot', 'prevent-clogg', 'boiling-point', 'cod',
                            'condensate', 'inlet', 'compressor', 'centrifugal-compressor',
                            'roots-compressor', 'vacuum-pump', 'operation-cost']):
        return 5

    # 展会/新闻/项目
    if any(k in s for k in ['expo', 'exhibition', 'fair', 'show-', 'visit',
                            'factory-inspection', 'pre-shipment', 'commissioning',
                            'successful', 'signed', 'contract', 'debuts', 'landing',
                            'partner', 'government', 'invitation', 'welcome',
                            'attending', 'participate', 'meet-at', 'booth']):
        return 6

    # === 竞对特定规则 ===
    if competitor == "Sunevap":
        if '/news/' in url_path:
            return 6
        if '/plist/' in url_path:
            return 1
        if '/blog/' in url_path:
            if any(k in s for k in ['application', 'mining', 'oil-and-gas', 'wastewater',
                                    'lithium', 'battery', 'salt', 'zero-liquid', 'zld',
                                    'fly-ash', 'ammonium', 'from-pollution',
                                    'revolutionizing', 'removing', 'seizing',
                                    'recycling', 'hydrometallurg', 'black-mass',
                                    'iron-phosphate', 'electroplating', 'dyeing',
                                    'pharmaceutical', 'agrochemical', 'sugar',
                                    'steel', 'oil-industry', 'brine']):
                return 1
            if any(k in s for k in ['mvr', 'evaporator', 'crystalliz', 'compressor',
                                    'thermal', 'heat-exchanger', 'cooling']):
                return 2
            if any(k in s for k in ['energy', 'saving', 'efficient', 'hardness',
                                    'water', 'custom', 'benefit', 'no-steam',
                                    'recycling-rate', 'treatment-plant', 'treatment-facility']):
                return 5
            return 6
        if '/knowledge/' in url_path:
            return 2
        if '/solutions/' in url_path:
            return 1
        # categories.xml 中的页面（无子路径）
        if any(k in s for k in ['ev-battery', 'zero', 'mining', 'sea-water', 'chemical',
                                'hydrometallurg', 'salt-production', 'fly-ash',
                                'food-fermentation']):
            return 1

    if competitor == "Vanoo":
        if '/portfolio/' in url_path or '/product/' in url_path:
            return 1
        if '/faq/' in url_path:
            return 3
        if '/tag/' in url_path or '/filter/' in url_path or '/category/' in url_path:
            return 8
        if '/post/' in url_path or '/blog/' in url_path:
            if any(k in s for k in ['spray-dry', 'dryer', 'drying']):
                return 8
            if any(k in s for k in ['zld', 'wastewater', 'crystallizer', 'evaporator',
                                    'lithium', 'sulfate', 'nickel', 'zinc', 'ammonium',
                                    'sodium', 'potassium', 'barium', 'pharmaceutical',
                                    'chemical', 'food', 'solvent', 'ethanol',
                                    'skid', 'modular', 'pilot', 'lab']):
                return 1
            if any(k in s for k in ['principle', 'guide', 'types', 'what-is',
                                    'understand', 'working', 'design', 'scale', 'selection']):
                return 2
            if any(k in s for k in ['cleaning', 'fouling', 'material', 'maintenance', 'energy']):
                return 5
            return 1

    if competitor == "Enchem":
        if '/news-posts/' in url_path:
            if any(k in s for k in ['successful', 'commissioning', 'australian', 'pre-shipment']):
                return 6
            if any(k in s for k in ['what-is', 'about-mvr', 'principle', 'improvement',
                                    'exploring', 'optimizing']):
                return 2
            if any(k in s for k in ['mvr-vs', 'comparison', 'vs-tvr']):
                return 4
            if any(k in s for k in ['material', 'equipment-material', 'how-to-select',
                                    'construction-material', 'cleaning', 'descale',
                                    'prevent-clogg', 'operation-cost', 'reduce-energy',
                                    'how-to-reduce', 'condensate', 'boiling-point',
                                    'cod', 'inlet', 'benefits-of-a']):
                return 5
            if any(k in s for k in ['lithium', 'battery', 'recycling',
                                    'industrial-production', 'zinc-chloride',
                                    'trichloro', 'application', 'zld', 'zero-liquid']):
                return 1
            return 2

    return 1

def extract_slug(url):
    path = url.split('//', 1)[-1].split('/', 1)[-1] if '//' in url else url
    parts = path.rstrip('/').split('/')
    slug = parts[-1] if parts[-1] else (parts[-2] if len(parts) > 1 else path)
    slug = slug.replace('.html', '').replace('.htm', '')
    return slug

def get_url_path(url):
    if '//' in url:
        return '/' + '/'.join(url.split('//', 1)[-1].split('/')[1:])
    return url

def infer_industry(slug):
    s = slug.lower()
    industries = {
        'lithium': '锂盐', 'battery': '锂电池', 'lioh': '锂盐', 'li2co3': '锂盐',
        'licl': '锂盐', 'black-mass': '锂电池回收',
        'potassium': '钾肥', 'kcl': '钾肥', 'k2so4': '钾肥', 'sop': '钾肥',
        'sodium': '钠盐', 'nacl': '钠盐', 'na2so4': '钠盐', 'na2co3': '钠盐',
        'ammonium': '铵盐', 'nh4': '铵盐',
        'calcium': '钙盐', 'cacl': '钙盐',
        'nickel': '重金属盐', 'zinc': '重金属盐', 'copper': '重金属盐',
        'barium': '重金属盐', 'cobalt': '重金属盐',
        'zld': 'ZLD零排放', 'zero-liquid': 'ZLD零排放', 'minimal-liquid': 'ZLD零排放',
        'wastewater': '废水处理', 'waste-water': '废水处理',
        'mining': '矿山废水', 'coal': '煤化工', 'mine': '矿山废水',
        'pharmaceutical': '制药', 'pharma': '制药',
        'food': '食品', 'sugar': '食品', 'coffee': '食品', 'milk': '食品',
        'chemical': '化工', 'dye': '化工', 'dyeing': '化工',
        'oil': '油气', 'gas': '油气',
        'landfill': '垃圾渗滤液', 'leachate': '垃圾渗滤液', 'fly-ash': '粉煤灰',
        'pfas': 'PFAS',
        'semiconductor': '半导体', 'data-center': '数据中心',
        'crystallizer': '结晶器', 'crystallization': '结晶',
        'evaporator': '蒸发器', 'evaporation': '蒸发',
        'mvr': 'MVR', 'mee': '多效蒸发', 'multi-effect': '多效蒸发',
        'dtb': 'DTB结晶器', 'oslo': 'OSLO结晶器', 'forced-circulation': '强制循环',
        'falling-film': '降膜蒸发', 'raising-film': '升膜蒸发',
        'thin-film': '薄膜蒸发', 'wiped-film': '刮膜蒸发',
        'skid': '撬装', 'modular': '模块化',
        'compressor': '压缩机', 'centrifugal': '压缩机', 'roots': '压缩机',
        'desalination': '海水淡化', 'sea-water': '海水淡化',
        'hydrometallurg': '湿法冶金', 'electroplating': '电镀',
        'steel': '钢铁', 'iron': '钢铁',
        'agrochemical': '农药', 'pmida': '农药',
        'dmac': '制药', 'solvent': '化工',
    }
    for k, v in industries.items():
        if k in s:
            return v
    return ""

def make_record(competitor, slug, url_path):
    type_num = classify_slug(slug, competitor, url_path)
    industry = infer_industry(slug)
    return {
        "竞对": competitor,
        "国别": "外贸",
        "文章类型": TYPE_MAP[type_num],
        "行业场景": industry,
        "slug": slug,
        "推断主题": "",
        "备注": ""
    }

# ==========================================
# 主流程
# ==========================================
print("=" * 60)
print("补充 Sunevap + Vanoo + Enchem 全量 slug")
print("=" * 60)

records = []

# === 1. Sunevap（从本地 XML）===
print("\n[1] Sunevap (本地 XML)...")
sunevap_files = [
    "sunevap_categories.xml",
    "sunevap_blog.xml",
    "sunevap_plist.xml",
    "sunevap_news.xml",
]
sunevap_urls = []
for fname in sunevap_files:
    fpath = os.path.join(SCRIPT_DIR, fname)
    if os.path.exists(fpath):
        urls = parse_xml_urls(fpath)
        print(f"  {fname}: {len(urls)} URLs")
        sunevap_urls.extend(urls)
    else:
        print(f"  {fname}: 文件不存在")

for url in sunevap_urls:
    if any(ext in url for ext in ['.jpg', '.png', '.pdf', '.css', '.js', '.xml', '.xsl']):
        continue
    slug = extract_slug(url)
    if not slug or slug in ('sitemap', 'sitemap_index', 'categories', 'plist', 'news'):
        continue
    url_path = get_url_path(url)
    records.append(make_record("Sunevap", slug, url_path))

print(f"  Sunevap records: {sum(1 for r in records if r['竞对']=='Sunevap')}")

# === 2. Vanoo（在线）===
print("\n[2] Vanoo (vanootech.com)...")
vanoo_urls = fetch_all_urls_online("vanootech.com", "/sitemap_index.xml")
if len(vanoo_urls) < 50:
    vanoo_urls = fetch_all_urls_online("vanootech.com", "/sitemap.xml")
print(f"  Total URLs: {len(vanoo_urls)}")

for url in vanoo_urls:
    if any(ext in url for ext in ['.jpg', '.png', '.pdf', '.css', '.js', '.xml']):
        continue
    slug = extract_slug(url)
    if not slug or slug in ('sitemap', 'sitemap_index'):
        continue
    url_path = get_url_path(url)
    records.append(make_record("Vanoo", slug, url_path))

print(f"  Vanoo records: {sum(1 for r in records if r['竞对']=='Vanoo')}")

# === 3. Enchem（在线）===
print("\n[3] Enchem (enchem-tech.com)...")
enchem_urls = fetch_all_urls_online("enchem-tech.com", "/sitemap.xml")
print(f"  Total URLs: {len(enchem_urls)}")

for url in enchem_urls:
    if any(ext in url for ext in ['.jpg', '.png', '.pdf', '.css', '.js', '.xml']):
        continue
    slug = extract_slug(url)
    if not slug:
        continue
    url_path = get_url_path(url)
    records.append(make_record("Enchem", slug, url_path))

print(f"  Enchem records: {sum(1 for r in records if r['竞对']=='Enchem')}")

# === 去重 ===
seen = set()
unique = []
for r in records:
    key = (r["竞对"], r["slug"])
    if key not in seen:
        seen.add(key)
        unique.append(r)

print(f"\n总计: {len(records)} → 去重后 {len(unique)} 条")

# === 统计 ===
type_dist = Counter(r["文章类型"] for r in unique)
comp_dist = Counter(r["竞对"] for r in unique)

print("\n按竞对:")
for comp, c in sorted(comp_dist.items(), key=lambda x: -x[1]):
    print(f"  {comp}: {c} 条")

print("\n按类型:")
for t, c in sorted(type_dist.items()):
    print(f"  {t}: {c} 条")

# === 写清洗 MD ===
output_file = os.path.join(SCRIPT_DIR, "清洗_补充3家_final.md")
print(f"\n写入 {output_file}...")
with open(output_file, "w", encoding="utf-8") as f:
    f.write("# 补充清洗：Sunevap + Vanoo + Enchem（最终版）\n\n")
    f.write(f"总计 {len(unique)} 条（去重后）\n\n")
    f.write("## 按竞对统计\n\n")
    for comp, c in sorted(comp_dist.items(), key=lambda x: -x[1]):
        f.write(f"- {comp}: {c} 条\n")
    f.write("\n## 按文章类型统计\n\n")
    for t, c in sorted(type_dist.items()):
        f.write(f"- {t}: {c} 条\n")
    f.write("\n## 全量 slug 清单\n\n")
    for r in unique:
        f.write(f"- {r['竞对']} | {r['文章类型']} | {r['行业场景']} | {r['slug']}\n")
print("清洗文件已写入")

# === 写飞书（可选）===
if "--write" not in sys.argv:
    print(f"\n{'=' * 60}")
    print(f"解析完成（{len(unique)} 条），未写入飞书")
    print(f"确认后运行: python {os.path.basename(__file__)} --write")
    print(f"{'=' * 60}")
    sys.exit(0)

print("\n" + "=" * 60)
print("写入飞书多维表格...")
print("=" * 60)

token = get_token()
print(f"Token: {token[:20]}...")

BATCH = 500
total_ok = 0
total_fail = 0

for i in range(0, len(unique), BATCH):
    batch = unique[i:i + BATCH]
    batch_num = i // BATCH + 1
    total_batches = (len(unique) + BATCH - 1) // BATCH

    fields_list = [{"fields": dict(r)} for r in batch]

    print(f"写入第 {batch_num}/{total_batches} 批, {len(batch)} 条 (offset={i})...")

    url = f"{API_BASE}/bitable/v1/apps/{BASE_TOKEN}/tables/{TABLE_ID}/records/batch_create"
    try:
        resp = http_post(url, {"records": fields_list}, {"Authorization": f"Bearer {token}"})
        if resp.get("code") == 0:
            print(f"  成功 ({len(batch)} 条)")
            total_ok += len(batch)
        else:
            print(f"  失败: code={resp.get('code')} msg={resp.get('msg', '')}")
            total_fail += len(batch)
    except Exception as e:
        print(f"  异常: {e}")
        total_fail += len(batch)

    time.sleep(0.5)

print(f"\n{'=' * 60}")
print(f"完成: 成功 {total_ok}, 失败 {total_fail}")
print(f"{'=' * 60}")
