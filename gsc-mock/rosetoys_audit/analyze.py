# -*- coding: utf-8 -*-
import json, re, html
from collections import Counter, defaultdict

data = json.load(open('products.json', encoding='utf-8'))
print("total products:", len(data))

def strip_html(s):
    if not s: return ""
    s = re.sub(r'<[^>]+>', ' ', s)
    s = html.unescape(s)
    return re.sub(r'\s+', ' ', s).strip()

CATMAP = {163:'nightwear', 211:'bikini', 250:'stockings', 258:'fishnet', 299:'womens-lingerie'}
def primary_cat(p):
    cats = [c['id'] for c in p.get('categories', [])]
    for pri in (250, 258, 211, 163):
        if pri in cats: return CATMAP[pri]
    return 'other/' + ','.join(str(c) for c in cats)

res = defaultdict(list)
for p in data:
    res[primary_cat(p)].append(p)

print()
print("== category distribution ==")
for k, v in sorted(res.items(), key=lambda x: -len(x[1])):
    print("  %s: %d" % (k, len(v)))

stats = defaultdict(Counter)

SKU_PREFIX = re.compile(r'^([A-Za-z]+)[-–]\d+', re.I)
SUSPECT_WORDS = ['seduction','seductive','pure desire','conjoined','joined','temptation','tempting',
                 'sexy','erotic','alluring','enchanting','charming','fascinating','lewd','binding',
                 'deputy','breakthrough','hazy','net socks','battle','pirate','garter']

def cat_word_ok(cat, name):
    nl = name.lower()
    words = {'stockings':['stocking','thigh','tights','pantyhose','sock','fishnet'],
             'fishnet':['fishnet','stocking'],
             'bikini':['bikini','swim','beach'],
             'nightwear':['pajama','nightwear','sleepwear','nightdress','nightgown','robe','negligee',
                          'babydoll','chemise','sleep','shirt','skirt','dress','uniform','bodysuit',
                          'lingerie','one-piece','one piece','silk','satin','gown','suit','teddy']}
    return any(w in nl for w in words.get(cat, []))

for p in data:
    name = p['name'] or ""
    cat = primary_cat(p)
    S = stats[cat]

    S['title_n'] += 1
    L = len(name)
    if L < 20: S['title_len<20'] += 1
    elif L <= 40: S['title_20-40'] += 1
    elif L <= 60: S['title_41-60'] += 1
    elif L <= 80: S['title_61-80'] += 1
    else: S['title_>80'] += 1
    m = SKU_PREFIX.match(name.strip())
    if m:
        S['title_sku_prefix'] += 1
        stats['prefixes'][m.group(1).lower()] += 1
    if name.isupper(): S['title_allcaps'] += 1
    if '  ' in name: S['title_dbl_space'] += 1
    nl = name.lower()
    hits = [w for w in SUSPECT_WORDS if w in nl]
    if hits: S['title_suspect_word'] += 1
    if not cat_word_ok(cat, name): S['title_no_catword'] += 1

    metas = {}
    for m2 in (p.get('meta_data') or []):
        metas[m2.get('key')] = m2.get('value')
    if str(metas.get('rank_math_title') or '').strip(): S['tkd_title_set'] += 1
    else: S['tkd_title_missing'] += 1
    if str(metas.get('rank_math_description') or '').strip(): S['tkd_desc_set'] += 1
    else: S['tkd_desc_missing'] += 1

    imgs = p.get('images') or []
    S['img_total'] += len(imgs)
    if not imgs: S['no_images'] += 1
    main_alt = (imgs[0].get('alt') or '').strip() if imgs else ''
    if not main_alt: S['main_alt_empty'] += 1
    empties = sum(1 for i in imgs if not (i.get('alt') or '').strip())
    S['alt_empty'] += empties
    S['alt_filled'] += len(imgs) - empties
    if imgs and empties == len(imgs): S['all_alt_empty'] += 1

    desc_raw = p.get('description') or ''
    desc_txt = strip_html(desc_raw)
    dl = len(desc_txt)
    S['desc_n'] += 1
    if dl == 0: S['desc_0'] += 1
    elif dl < 200: S['desc_<200'] += 1
    elif dl <= 1000: S['desc_200-1000'] += 1
    else: S['desc_>1000'] += 1
    is_param_table = ('product detail' in desc_raw.lower()) and desc_txt.count('.') <= 2
    if is_param_table: S['desc_param_only'] += 1
    if (p.get('short_description') or '').strip(): S['short_set'] += 1
    else: S['short_missing'] += 1
    low = desc_raw.lower()
    if '<h2' in low or '<h3' in low or 'faq' in low: S['desc_has_heading'] += 1

    attrs = p.get('attributes') or []
    anames = [(a.get('name') or '').lower() for a in attrs]
    has_size = any('size' in a for a in anames)
    has_color = any('color' in a or 'colour' in a for a in anames)
    S['attr_n'] += 1
    if attrs: S['attr_has_any'] += 1
    if has_size: S['attr_size'] += 1
    if has_color: S['attr_color'] += 1
    size_opts = []
    for a in attrs:
        if 'size' in (a.get('name') or '').lower():
            size_opts += [str(o).lower() for o in (a.get('options') or [])]
    if any(re.search(r'(x{1,5}l|plus|queen|king)', o) for o in size_opts): S['attr_plus_size'] += 1
    if any(('one size' in o) or ('free size' in o) for o in size_opts): S['attr_one_size'] += 1

    S['stock_' + (p.get('stock_status') or 'null')] += 1
    if not (p.get('price') or '').strip(): S['price_empty'] += 1
    S['type_' + (p.get('type') or 'null')] += 1

print()
print("== SKU prefix distribution ==")
for k, v in stats['prefixes'].most_common():
    print("  %s- : %d" % (k, v))

keys_order = ['title_n','title_len<20','title_20-40','title_41-60','title_61-80','title_>80',
              'title_sku_prefix','title_allcaps','title_dbl_space','title_suspect_word','title_no_catword',
              'tkd_title_set','tkd_title_missing','tkd_desc_set','tkd_desc_missing',
              'img_total','alt_empty','alt_filled','main_alt_empty','all_alt_empty','no_images',
              'desc_0','desc_<200','desc_200-1000','desc_>1000','desc_param_only','short_missing','short_set','desc_has_heading',
              'attr_has_any','attr_size','attr_color','attr_plus_size','attr_one_size',
              'stock_instock','stock_outofstock','price_empty','type_simple','type_variable']

print()
print("== per-category stats ==")
for cat in ['nightwear','stockings','fishnet','bikini']:
    S = stats[cat]
    print()
    print("-- %s (n=%d) --" % (cat, S['title_n']))
    for k in keys_order:
        if k in S:
            denom = S['title_n'] if ('title' in k or 'tkd' in k or 'alt' in k and 'img' not in k or 'desc' in k or 'attr' in k or 'stock' in k or 'price' in k or 'short' in k or 'no_images' in k) else None
            extra = ""
            if denom and k not in ('title_n','desc_n','attr_n'):
                extra = " (%.0f%%)" % (S[k] / denom * 100)
            print("   %-22s = %d%s" % (k, S[k], extra))

print()
print("== GLOBAL totals (n=211) ==")
G = Counter()
for cat in ['nightwear','stockings','fishnet','bikini']:
    G += stats[cat]
for k in keys_order:
    if k in G:
        denom = G['title_n']
        extra = ""
        if k not in ('title_n','desc_n','attr_n','img_total','alt_empty','alt_filled'):
            extra = " (%.0f%%)" % (G[k] / denom * 100)
        print("   %-22s = %d%s" % (k, G[k], extra))

print()
print("== suspect word hits in titles ==")
wc = Counter()
for p in data:
    nl = (p['name'] or '').lower()
    for w in SUSPECT_WORDS:
        if w in nl: wc[w] += 1
for k, v in wc.most_common(30):
    print("  %s: %d" % (k, v))

out = {k: dict(v) for k, v in stats.items()}
json.dump(out, open('stats.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
