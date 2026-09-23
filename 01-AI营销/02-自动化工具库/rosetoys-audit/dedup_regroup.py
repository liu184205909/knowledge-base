# -*- coding: utf-8 -*-
"""SKU 去重治理：重建重复组 + 每组候选评分（31号文档配套，2026-09-04）
口径：剥货号前缀(字母[-–]字母?数字，含 W-3117/J-A41/M 280/W -30xx/j-a28 形态) -> 空格归一 -> lower
"""
import json, re
from collections import defaultdict
from urllib.parse import urlparse, unquote

data = json.load(open('products.json', encoding='utf-8'))
CATMAP = {250: 'stockings', 258: 'fishnet', 211: 'bikini', 163: 'nightwear'}

def primary_cat(p):
    cats = [c['id'] for c in p.get('categories', [])]
    for pri in (250, 258, 211, 163):
        if pri in cats:
            return CATMAP[pri]
    return 'other'

def norm_name(n):
    n = (n or '').strip()
    n = re.sub(r'^[A-Za-z]+\s*[-–]\s*[A-Za-z]?\d+\s*', '', n)  # W-3117 / J-A41 / M 280 / W -3058 / j-a28
    return re.sub(r'\s+', ' ', n).lower().strip()

groups = defaultdict(list)
for p in data:
    groups[norm_name(p['name'])].append(p)

dup_groups = {k: v for k, v in groups.items() if len(v) > 1}

def img_fname(src):
    if not src:
        return ''
    return unquote(urlparse(src).path.rsplit('/', 1)[-1])

out = open('regroup_31.txt', 'w', encoding='utf-8')
out.write("normalization: strip ^[A-Za-z]+[-][A-Za-z]?\\d+ prefix, collapse spaces, lowercase\n")
out.write("total products: %d | near-dup groups: %d | SKUs in groups: %d\n\n"
          % (len(data), len(dup_groups), sum(len(v) for v in dup_groups.values())))

gi = 0
for key, pp in sorted(dup_groups.items(), key=lambda x: -len(x[1])):
    gi += 1
    out.write("== GROUP %d  x%d  [%s]  norm=%r\n" % (gi, len(pp),
              ','.join(sorted(set(primary_cat(p) for p in pp))), key))
    # 图片文件名跨 SKU 比对（真克隆检测）
    all_fnames = defaultdict(set)  # fname -> set(pid)
    for p in pp:
        for im in (p.get('images') or []):
            all_fnames[img_fname(im.get('src'))].add(p['id'])
    shared = {f: ids for f, ids in all_fnames.items() if len(ids) > 1}
    if shared:
        out.write("   !! SHARED IMAGES (possible true clones): %d filenames\n" % len(shared))
        for f, ids in list(shared.items())[:10]:
            out.write("      %s -> %s\n" % (f, sorted(ids)))
    for p in sorted(pp, key=lambda x: x['id']):
        imgs = p.get('images') or []
        out.write("   id=%d cat=%-9s type=%-8s price=%-7s slug=%s\n"
                  % (p['id'], primary_cat(p), p.get('type'), p.get('price'), p.get('slug')))
        out.write("      name=%r\n" % p['name'])
        out.write("      imgs=%d main=%s\n" % (len(imgs), img_fname(imgs[0].get('src')) if imgs else 'NONE'))
    out.write("\n")

out.close()
print("groups=%d skus=%d -> regroup_31.txt" % (len(dup_groups), sum(len(v) for v in dup_groups.values())))
