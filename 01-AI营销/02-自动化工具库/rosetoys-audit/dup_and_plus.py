# -*- coding: utf-8 -*-
import json, re
from collections import Counter, defaultdict

data = json.load(open('products.json', encoding='utf-8'))
CATMAP = {250:'stockings', 258:'fishnet', 211:'bikini', 163:'nightwear'}
def primary_cat(p):
    cats = [c['id'] for c in p.get('categories', [])]
    for pri in (250, 258, 211, 163):
        if pri in cats: return CATMAP[pri]
    return 'other'

out = open('plus_and_dup.txt', 'w', encoding='utf-8')

# ---- plus size ----
plus_detail = defaultdict(list)  # pid -> opts
size_opt_counter = Counter()
n_size = 0
for p in data:
    for a in (p.get('attributes') or []):
        if 'size' in (a.get('name') or '').lower():
            n_size += 1
            for o in (a.get('options') or []):
                size_opt_counter[str(o)] += 1
                ol = str(o).lower()
                if re.search(r'(^|\s)(x{1,6}l|\dxl|plus|queen|king|fat)', ol):
                    plus_detail[p['id']].append((str(o), primary_cat(p)))

out.write("products with Size attr: %d / 211\n\n" % n_size)
out.write("ALL size option values distribution:\n")
for k, v in size_opt_counter.most_common(60):
    out.write("  %-24r x%d\n" % (k, v))

out.write("\nplus-size products: %d\n" % len(plus_detail))
bycat = Counter()
for pid, lst in plus_detail.items():
    for opt, cat in lst:
        bycat[cat] += 1
        break
out.write("by category: %s\n" % dict(bycat))
for pid, lst in sorted(plus_detail.items()):
    p = next(x for x in data if x['id'] == pid)
    out.write("  %s [%s] opts=%s | %s\n" % (pid, lst[0][1], [x[0] for x in lst], p['name'][:70]))

# ---- duplicate titles ----
out.write("\n\n===== DUPLICATE TITLES (exact name, count>1) =====\n")
name_counter = Counter((p['name'] or '').strip() for p in data)
dup_names = {k: v for k, v in name_counter.items() if v > 1}
total_dup_skus = sum(dup_names.values())
out.write("distinct duplicated titles: %d, total SKUs in them: %d\n\n" % (len(dup_names), total_dup_skus))
for name, cnt in sorted(dup_names.items(), key=lambda x: -x[1]):
    ids = [str(p['id']) for p in data if (p['name'] or '').strip() == name]
    cats = set(primary_cat(p) for p in data if (p['name'] or '').strip() == name)
    out.write("  x%d [%s] ids=%s | %s\n" % (cnt, ','.join(cats), ','.join(ids), name))

# 近重复：去掉 SKU 前缀后同名
out.write("\n===== NEAR-DUPLICATE (strip SKU prefix + spaces + lower) =====\n")
def norm_name(n):
    n = re.sub(r'^[A-Za-z]+\s*[-–]\s*\d+\s*', '', (n or '').strip())
    return re.sub(r'\s+', ' ', n).lower().strip()
nn = defaultdict(list)
for p in data:
    nn[norm_name(p['name'])].append(p['id'])
near_dups = {k: v for k, v in nn.items() if len(v) > 1}
near_total = sum(len(v) for v in near_dups.values())
out.write("distinct near-dup groups: %d, total SKUs: %d\n\n" % (len(near_dups), near_total))
for k, v in sorted(near_dups.items(), key=lambda x: -len(x[1])):
    pp = [p for p in data if p['id'] in v]
    cats = sorted(set(primary_cat(p) for p in pp))
    out.write("  x%d [%s] ids=%s | %s\n" % (len(v), ','.join(cats), ','.join(str(i) for i in v), k[:90]))

# ---- worst samples ----
out.write("\n===== WORST 15 SAMPLES =====\n")
def score(p):
    name = p['name'] or ''
    nl = name.lower()
    s = 0
    reasons = []
    if re.match(r'^[A-Za-z]+\s*[-–]\s*\d+', name.strip()): s += 1; reasons.append('SKU前缀')
    for w in ['sexy','erotic','seduction','seductive','temptation','tempting','pure desire','conjoined','joined','net socks','sex ']:
        if w in nl: s += 2; reasons.append('翻译腔:' + w); break
    if '  ' in name: s += 1; reasons.append('双空格')
    if len(name) > 60: s += 1; reasons.append('标题长%d' % len(name))
    nrm = norm_name(name)
    if name_counter[(p['name'] or '').strip()] > 1: s += 2; reasons.append('完全重复')
    elif len(nn[nrm]) > 1: s += 1; reasons.append('近似重复')
    return s, reasons
scored = []
for p in data:
    s, r = score(p)
    scored.append((s, p, r))
scored.sort(key=lambda x: -x[0])
import html as H
def stext(s):
    s = re.sub(r'<[^>]+>', ' ', s or '')
    s = H.unescape(s)
    return re.sub(r'\s+', ' ', s).strip()
for s, p, r in scored[:15]:
    out.write("\nid=%s score=%d | %s\n" % (p['id'], s, p['name']))
    out.write("  reasons: %s\n" % ', '.join(r))
    out.write("  desc(%d chars): %s\n" % (len(stext(p.get('description'))), stext(p.get('description'))[:160]))

out.close()
print("written plus_and_dup.txt")
# 同时输出最长的几个标题与最短
print("\nlongest titles:")
for p in sorted(data, key=lambda x: -len(x['name'] or ''))[:5]:
    print("  %d chars | %s" % (len(p['name']), p['name']))
