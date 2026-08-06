#!/usr/bin/env python3
"""补充 Sunevap / Vanoo / Enchem 三家全量 slug 到飞书多维表格"""

import json, time, urllib.request, urllib.parse, re, ssl, os

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

def http_get(url):
    req = urllib.request.Request(url, method="GET")
    req.add_header("User-Agent", "Mozilla/5.0")
    with urllib.request.urlopen(req, context=ssl_ctx, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="replace")

def get_token():
    url = f"{API_BASE}/auth/v3/tenant_access_token/internal"
    resp = http_post(url, {"app_id": APP_ID, "app_secret": APP_SECRET})
    return resp.get("tenant_access_token")

def fetch_sitemap(url):
    """获取 sitemap XML，返回 URL 列表"""
    try:
        xml = http_get(url)
        urls = re.findall(r'<loc>(.*?)</loc>', xml)
        return [u.strip() for u in urls if u.strip()]
    except Exception as e:
        print(f"  [WARN] fetch {url} failed: {e}")
        return []

def fetch_all_urls(domain, sitemap_path="/sitemap.xml"):
    """递归抓取 sitemap（处理 index 格式）"""
    base_url = f"https://{domain}{sitemap_path}"
    print(f"  Fetching {base_url}...")
    urls = fetch_sitemap(base_url)

    # 检查是否是 sitemap index（含 <sitemap> 标签）
    all_article_urls = []

    # 如果 URL 看起来是子 sitemap（.xml 结尾且不是文章页），递归抓取
    sub_sitemaps = [u for u in urls if u.endswith('.xml')]
    article_urls = [u for u in urls if not u.endswith('.xml')]

    if sub_sitemaps:
        print(f"  Found {len(sub_sitemaps)} sub-sitemaps, fetching...")
        for sm in sub_sitemaps:
            sub_urls = fetch_sitemap(sm)
            sub_article = [u for u in sub_urls if not u.endswith('.xml')]
            article_urls.extend(sub_article)
            print(f"    {sm.split('/')[-1]}: {len(sub_article)} URLs")

    return article_urls

# === 分类逻辑 ===
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
    """根据 slug 语义分类"""
    s = slug.lower()

    # 地理 SEO
    if any(k in s for k in ['top-', 'best-', 'manufacturers-in-', 'suppliers-in', 'in-australia', 'in-usa', 'in-china', 'in-france', 'in-pakistan', 'in-vietnam', 'in-indonesia', 'in-south-africa', 'in-korea', 'in-india', 'in-jordan', 'in-brazil', 'in-turkey', 'in-saudi', 'in-malaysia']):
        return 7

    # 技术对比/ROI
    if any(k in s for k in ['vs-', '-vs-', 'comparison', 'compare', 'cost', 'pricing', 'opex', 'roi', 'payback', 'energy-saving', 'energy-savings', 'cut-operating', 'reduce-energy', 'reduce-opex']):
        if competitor == "Vanoo" and any(k in s for k in ['cost', 'pricing', 'opex', 'roi', 'payback', 'comparison', 'vs-']):
            return 4
        if 'vs-' in s or '-vs-' in s or 'comparison' in s:
            return 4

    # FAQ
    if any(k in s for k in ['how-much', 'how-to-choose', 'how-many', 'common-problem', 'best-', 'what-book', 'is-the-investment', 'what-is-the-best', 'mix-match', 'how-do-you', 'how-inefficient', 'how-does-the', 'what-type', 'what-are', 'best-way']):
        return 3

    # What-Is
    if any(k in s for k in ['what-is', 'whats-the', 'principle', 'working-principle', 'guide', 'how-does', 'how-to', 'understand', 'introduction', 'classification', 'types-of', 'exploring', 'about-mvr', 'custom-vs-standard', 'customized']):
        return 2

    # 运维
    if any(k in s for k in ['cleaning', 'descale', 'scaling', 'fouling', 'anti-fouling', 'material-selection', 'material-consideration', 'maintenance', 'troubleshoot', 'prevent-clogg', 'boiling-point', 'cod', 'condensate', 'inlet', 'compressor', 'centrifugal-compressor', 'roots-compressor', 'vacuum-pump', 'operation-cost', 'reduce-energy']):
        return 5

    # 展会/新闻/项目
    if any(k in s for k in ['expo', 'exhibition', 'fair', 'show-', 'visit', 'factory-inspection', 'pre-shipment', 'commissioning', 'successful', 'signed', 'contract', 'debuts', 'landing', 'partner', 'government']):
        return 6

    # Sunevap news/plist
    if competitor == "Sunevap":
        if '/news/' in url_path or '/plist/' in url_path:
            return 6
        if '/blog/' in url_path:
            # blog 中非以上类型的
            if any(k in s for k in ['application', 'mining', 'oil-and-gas', 'wastewater', 'lithium', 'battery', 'salt', 'zero-liquid', 'zld', 'fly-ash', 'ammonium', 'from-pollution', 'revolutionizing', 'removing', 'seizing']):
                return 1
            if any(k in s for k in ['mvr', 'evaporator', 'crystalliz', 'compressor', 'thermal', 'heat-exchanger', 'cooling']):
                return 2
            if any(k in s for k in ['energy', 'saving', 'efficient', 'hardness', 'water', 'custom', 'benefit', 'no-steam']):
                return 5
            return 6
        if '/knowledge/' in url_path:
            return 2
        if '/solutions/' in url_path:
            return 1

    # Vanoo
    if competitor == "Vanoo":
        if '/portfolio/' in url_path or '/product/' in url_path:
            return 1
        if '/faq/' in url_path:
            return 3
        if '/tag/' in url_path or '/filter/' in url_path or '/category/' in url_path:
            return 8
        if '/post/' in url_path or '/blog/' in url_path:
            if any(k in s for k in ['mvr-vs', 'cost', 'roi', 'pricing', 'energy-cost', 'opex', 'comparison']):
                return 4
            if any(k in s for k in ['spray-dry', 'dryer', 'drying']):
                return 8  # 非蒸发结晶核心
            if any(k in s for k in ['zld', 'wastewater', 'crystallizer', 'evaporator', 'lithium', 'sulfate', 'nickel', 'zinc', 'ammonium', 'sodium', 'potassium', 'barium', 'pharmaceutical', 'chemical', 'food', 'solvent', 'ethanol', 'skid', 'modular', 'pilot', 'lab']):
                return 1
            if any(k in s for k in ['principle', 'guide', 'types', 'what-is', 'understand', 'working', 'design', 'scale', 'selection']):
                return 2
            if any(k in s for k in ['cleaning', 'fouling', 'material', 'maintenance', 'energy']):
                return 5
            return 1

    # Enchem
    if competitor == "Enchem":
        if '/news-posts/' in url_path:
            if any(k in s for k in ['successful', 'commissioning', 'australian', 'pre-shipment']):
                return 6
            if any(k in s for k in ['what-is', 'about-mvr', 'principle', 'improvement', 'exploring', 'optimizing']):
                return 2
            if any(k in s for k in ['mvr-vs', 'comparison', 'vs-tvr']):
                return 4
            if any(k in s for k in ['material', 'equipment-material', 'how-to-select', 'construction-material', 'cleaning', 'descale', 'prevent-clogg', 'operation-cost', 'reduce-energy', 'how-to-reduce', 'condensate', 'boiling-point', 'cod', 'inlet', 'benefits-of-a']):
                return 5
            if any(k in s for k in ['lithium', 'battery', 'recycling', 'industrial-production', 'zinc-chloride', 'trichloro', 'application', 'zld', 'zero-liquid']):
                return 1
            return 2

    return 1  # 默认归入解决方案/案例

def extract_slug(url):
    """从 URL 提取 slug（最后一段路径，去掉 .html 和尾部 /）"""
    # 去掉协议和域名
    path = url.split('//', 1)[-1].split('/', 1)[-1] if '//' in url else url
    # 取最后两段路径（可能包含子目录信息）
    parts = path.rstrip('/').split('/')
    slug = parts[-1] if parts[-1] else (parts[-2] if len(parts) > 1 else path)
    slug = slug.replace('.html', '').replace('.htm', '')
    return slug

def get_url_path(url):
    """获取 URL 路径（用于分类判断）"""
    if '//' in url:
        return '/' + '/'.join(url.split('//', 1)[-1].split('/')[1:])
    return url

def infer_industry(slug):
    """从 slug 推断行业场景"""
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
        'zld': 'ZLD零排放', 'zero-liquid': 'ZLD零排放',
        'wastewater': '废水处理', 'waste-water': '废水处理',
        'mining': '矿山废水', 'coal': '煤化工', 'mine': '矿山废水',
        'pharmaceutical': '制药', 'pharma': '制药',
        'food': '食品', 'sugar': '食品', 'coffee': '食品', 'milk': '食品',
        'chemical': '化工', 'dye': '化工', 'dyeing': '化工',
        'oil': '油气', 'gas': '油气',
        'landfill': '垃圾渗滤液', 'leachate': '垃圾渗滤液',
        'pfas': 'PFAS',
        'semiconductor': '半导体', 'data-center': '数据中心',
        'crystallizer': '结晶器', 'crystallization': '结晶',
        'evaporator': '蒸发器', 'evaporation': '蒸发',
        'mvr': 'MVR', 'mee': '多效蒸发', 'multi-effect': '多效蒸发',
        'dtb': 'DTB结晶器', 'oslo': 'OSLO结晶器', 'forced-circulation': '强制循环',
        'falling-film': '降膜蒸发', 'rising-film': '升膜蒸发',
        'thin-film': '薄膜蒸发', 'wiped-film': '刮膜蒸发',
        'skid': '撬装', 'modular': '模块化',
        'compressor': '压缩机', 'centrifugal': '压缩机', 'roots': '压缩机',
    }
    for k, v in industries.items():
        if k in s:
            return v
    return ""

# === 主流程 ===
print("=" * 60)
print("补充 Sunevap / Vanoo / Enchem 三家全量 slug")
print("=" * 60)

records = []

# 1. Sunevap
print("\n[1] Sunevap (sunevapgroup.com)...")
sunevap_urls = fetch_all_urls("sunevapgroup.com", "/sitemap.xml")
# 也尝试 sitemap index
if len(sunevap_urls) < 100:
    # 尝试 sitemap_index.xml
    sunevap_urls2 = fetch_all_urls("sunevapgroup.com", "/sitemap_index.xml")
    sunevap_urls.extend(sunevap_urls2)

print(f"  Total URLs: {len(sunevap_urls)}")
for url in sunevap_urls:
    if any(ext in url for ext in ['.jpg', '.png', '.pdf', '.css', '.js', '.xml']):
        continue
    slug = extract_slug(url)
    if not slug or slug == 'sitemap':
        continue
    url_path = get_url_path(url)
    type_num = classify_slug(slug, "Sunevap", url_path)
    industry = infer_industry(slug)
    records.append({
        "竞对": "Sunevap",
        "国别": "外贸",
        "文章类型": TYPE_MAP[type_num],
        "行业场景": industry,
        "slug": slug,
        "推断主题": "",
        "备注": ""
    })
print(f"  Sunevap records: {sum(1 for r in records if r['竞对']=='Sunevap')}")

# 2. Vanoo
print("\n[2] Vanoo (vanootech.com)...")
vanoo_urls = fetch_all_urls("vanootech.com", "/sitemap_index.xml")
if len(vanoo_urls) < 50:
    vanoo_urls = fetch_all_urls("vanootech.com", "/sitemap.xml")

print(f"  Total URLs: {len(vanoo_urls)}")
for url in vanoo_urls:
    if any(ext in url for ext in ['.jpg', '.png', '.pdf', '.css', '.js', '.xml']):
        continue
    slug = extract_slug(url)
    if not slug or slug in ('sitemap', 'sitemap_index'):
        continue
    url_path = get_url_path(url)
    type_num = classify_slug(slug, "Vanoo", url_path)
    industry = infer_industry(slug)
    records.append({
        "竞对": "Vanoo",
        "国别": "外贸",
        "文章类型": TYPE_MAP[type_num],
        "行业场景": industry,
        "slug": slug,
        "推断主题": "",
        "备注": ""
    })
print(f"  Vanoo records: {sum(1 for r in records if r['竞对']=='Vanoo')}")

# 3. Enchem
print("\n[3] Enchem (enchem-tech.com)...")
enchem_urls = fetch_all_urls("enchem-tech.com", "/sitemap.xml")
print(f"  Total URLs: {len(enchem_urls)}")
for url in enchem_urls:
    if any(ext in url for ext in ['.jpg', '.png', '.pdf', '.css', '.js', '.xml']):
        continue
    slug = extract_slug(url)
    if not slug:
        continue
    url_path = get_url_path(url)
    type_num = classify_slug(slug, "Enchem", url_path)
    industry = infer_industry(slug)
    records.append({
        "竞对": "Enchem",
        "国别": "外贸",
        "文章类型": TYPE_MAP[type_num],
        "行业场景": industry,
        "slug": slug,
        "推断主题": "",
        "备注": ""
    })
print(f"  Enchem records: {sum(1 for r in records if r['竞对']=='Enchem')}")

# 去重（slug + 竞对组合）
seen = set()
unique = []
for r in records:
    key = (r["竞对"], r["slug"])
    if key not in seen:
        seen.add(key)
        unique.append(r)

print(f"\n总计: {len(records)} → 去重后 {len(unique)} 条")

# 打印类型分布
print("\n类型分布:")
for r in unique:
    pass
from collections import Counter
type_dist = Counter(r["文章类型"] for r in unique)
for t, c in sorted(type_dist.items()):
    print(f"  {t}: {c} 条")

competitor_dist = Counter(r["竞对"] for r in unique)
for comp, c in sorted(competitor_dist.items(), key=lambda x: -x[1]):
    print(f"  {comp}: {c} 条")

# 输出清洗结果到 md 文件
output_file = "d:/Code/knowledge-base/01-AI营销/04-选品库/B端/04-蒸发结晶/01-竞品分析/清洗_补充3家_Sunevap_Vanoo_Enchem.md"
print(f"\n写入清洗结果到 {output_file}...")
with open(output_file, "w", encoding="utf-8") as f:
    f.write("# 补充清洗：Sunevap + Vanoo + Enchem\n\n")
    f.write(f"总计 {len(unique)} 条（去重后）\n\n")
    f.write("## 按竞对统计\n\n")
    for comp, c in sorted(competitor_dist.items(), key=lambda x: -x[1]):
        f.write(f"- {comp}: {c} 条\n")
    f.write("\n## 按文章类型统计\n\n")
    for t, c in sorted(type_dist.items()):
        f.write(f"- {t}: {c} 条\n")
    f.write("\n## 全量 slug 清单\n\n")
    for r in unique:
        f.write(f"- {r['竞对']} | {r['文章类型']} | {r['行业场景']} | {r['slug']}\n")
print("清洗文件已写入")

# 检查是否需要写入飞书
import sys
if "--write" not in sys.argv:
    print(f"\n{'=' * 60}")
    print(f"解析完成（{len(unique)} 条），未写入飞书")
    print(f"确认无误后运行: python {sys.argv[0]} --write")
    print(f"{'=' * 60}")
    sys.exit(0)

# 写入飞书
print("\n" + "=" * 60)
print("写入飞书多维表格...")
print("=" * 60)

token = get_token()
print(f"Token: {token[:20]}...")

BATCH = 500
total_ok = 0
total_fail = 0

for i in range(0, len(unique), BATCH):
    batch = unique[i:i+BATCH]
    batch_num = i // BATCH + 1
    total_batches = (len(unique) + BATCH - 1) // BATCH

    fields_list = []
    for r in batch:
        fields_list.append({"fields": dict(r)})

    print(f"写入第 {batch_num}/{total_batches} 批, {len(batch)} 条 (offset={i})...")

    url = f"{API_BASE}/bitable/v1/apps/{BASE_TOKEN}/tables/{TABLE_ID}/records/batch_create"
    try:
        resp = http_post(url, {"records": fields_list}, {"Authorization": f"Bearer {token}"})
        if resp.get("code") == 0:
            print(f"  成功 ({len(batch)} 条)")
            total_ok += len(batch)
        else:
            print(f"  失败: code={resp.get('code')} msg={resp.get('msg','')}")
            total_fail += len(batch)
    except Exception as e:
        print(f"  异常: {e}")
        total_fail += len(batch)

    time.sleep(0.5)

print(f"\n{'=' * 60}")
print(f"完成: 成功 {total_ok}, 失败 {total_fail}")
print(f"{'=' * 60}")
