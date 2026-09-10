# -*- coding: utf-8 -*-
import json, re, html

data = json.load(open('products.json', encoding='utf-8'))

def strip_html(s):
    if not s: return ""
    s = re.sub(r'<[^>]+>', ' ', s)
    s = html.unescape(s)
    return re.sub(r'\s+', ' ', s).strip()

CATMAP = {250:'stockings', 258:'fishnet', 211:'bikini', 163:'nightwear'}
def primary_cat(p):
    cats = [c['id'] for c in p.get('categories', [])]
    for pri in (250, 258, 211, 163):
        if pri in cats: return CATMAP[pri]
    return 'other'

print("========== STOCKINGS 28 SKU detail ==========")
for p in sorted(data, key=lambda x: x['id']):
    if primary_cat(p) != 'stockings': continue
    name = p['name']
    desc_txt = strip_html(p.get('description') or '')
    attrs = p.get('attributes') or []
    attr_str = '; '.join("%s=%s" % (a.get('name'), ','.join(str(o) for o in (a.get('options') or []))) for a in attrs)
    flags = []
    if re.match(r'^[A-Za-z]+[-–]\d+', name.strip()): flags.append('SKU前缀')
    nl = name.lower()
    for w in ['sexy','erotic','seduction','seductive','temptation','pure desire','conjoined','joined','tempting','net socks']:
        if w in nl: flags.append('翻译腔:' + w)
    if 'stocking' not in nl and 'tights' not in nl and 'pantyhose' not in nl and 'thigh' not in nl and 'sock' not in nl and 'fishnet' not in nl:
        flags.append('缺品类词')
    if '  ' in name: flags.append('双空格')
    if len(name) > 60: flags.append('超长%d' % len(name))
    print()
    print("id=%s | %s" % (p['id'], name))
    print("  slug: %s" % p['slug'])
    print("  price=%s type=%s imgs=%d desc_len=%d short_len=%d" % (
        p.get('price'), p.get('type'), len(p.get('images') or []), len(desc_txt),
        len(strip_html(p.get('short_description') or ''))))
    print("  attrs: %s" % attr_str)
    print("  desc: %s" % desc_txt[:180])
    print("  flags: %s" % (', '.join(flags) if flags else 'PASS'))

print()
print("========== PLUS SIZE analysis ==========")
plus_list = []
size_detail = Counter = {}
from collections import Counter
size_opt_counter = Counter()
plus_size_counter = Counter()
n_size = 0
for p in data:
    attrs = p.get('attributes') or []
    for a in attrs:
        if 'size' in (a.get('name') or '').lower():
            n_size += 1
            opts = [str(o) for o in (a.get('options') or [])]
            for o in opts:
                size_opt_counter[o] += 1
                ol = o.lower()
                if re.search(r'(^|\s)(x{1,5}l|\d?xl|plus|queen|king)', ol):
                    plus_size_counter[o] += 1
                    plus_list.append((p['id'], p['name'][:60], o, primary_cat(p)))
print("products with Size attribute: %d / 211" % n_size)
print("size option value distribution (top 40):")
for k, v in size_opt_counter.most_common(40):
    print("   %-20r x%d" % (k, v))
print()
print("PLUS-SIZE option values:")
for k, v in plus_size_counter.most_common():
    print("   %-20r x%d" % (k, v))
print()
print("products having plus-size options: %d" % len(set(x[0] for x in plus_list)))
by_cat = Counter(x[3] for x in plus_list)
print("by category:", dict(by_cat))
for pid, nm, opt, cat in plus_list:
    print("   %s [%s] opt=%s | %s" % (pid, cat, opt, nm))
