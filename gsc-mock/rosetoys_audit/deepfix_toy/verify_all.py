# -*- coding: utf-8 -*-
"""Final verification for wave 4 (toy line): read back all SKUs, compare vs plans,
check slug/price vs before snapshots, slop scan, word/char stats."""
import json, re, subprocess, time, os, glob, html

AUTH = "lzn184205909@gmail.com:x1F3unlUOIpUrhcb5aE0bDdG"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
HERE = os.path.dirname(os.path.abspath(__file__))
SLOP = ['elevate', 'effortless', 'timeless', 'perfect', 'must-have', 'must have',
        'whether you', 'whether it', 'unleash', 'look no further', 'game-changer',
        'stunning', 'unlock', 'level up']
PH = chr(0x27E6) + "IMG" + chr(0x27E7)
PHF = chr(0x27E6) + "IFRAME" + chr(0x27E7)

def norm(s):
    return "".join(s.split())

def norm_deep(s):
    s = re.sub(r"<br\s*/?>", "", s)
    s = re.sub(r"<p>\s*((?:<img[^>]*>\s*)+)</p>", r"\1", s)
    s = re.sub(r"<(\w+)[^>]*>", r"<\1>", s)
    return "".join(s.split())

def srcs(s):
    out = []
    for u in re.findall(r'src="([^"]+)"', s):
        if not out or out[-1] != u:
            out.append(u)
    return out

def text(s):
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s).replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    s = s.replace("×", "x").replace("–", "-").replace("—", "-")
    return norm(s)

plans = {}
for f in sorted(glob.glob(os.path.join(HERE, 'plan_toy_b*.json'))):
    plans.update(json.load(open(f, encoding='utf-8')))
print('plan items:', len(plans))

report = {"total": len(plans), "name_ok": 0, "desc_ok": 0, "short_ok": 0,
          "rmT_ok": 0, "rmD_ok": 0, "slug_ok": 0, "price_ok": 0, "img_ok": 0,
          "slop_hits": [], "fails": [], "stats": {}}
wcs, tls, dls, sls = [], [], [], []
for pid in sorted(plans, key=int):
    it = plans[pid]
    r = subprocess.run(["curl", "-s", "--max-time", "60", "-A", UA, "-u", AUTH,
                        f"https://rosetoys.org/wp-json/wc/v3/products/{pid}"],
                       capture_output=True, text=True, encoding="utf-8")
    d = json.loads(r.stdout)
    md = {m.get('key'): m.get('value') for m in (d.get('meta_data') or [])}
    before = json.load(open(os.path.join(HERE, f"_before_{pid}.json"), encoding='utf-8'))
    # rebuild expected desc
    btags = re.findall(r'<img[^>]*/?>|<iframe[^>]*>.*?</iframe>', before['description'] or '', re.S)
    if it.get('drop_iframe'):
        btags = [t for t in btags if not t.startswith('<iframe')]
    want = it['desc'].replace('@@IMG@@', PH).replace('@@IF@@', PHF)
    media_mode = it.get('media_mode', 'keep')
    if media_mode == 'clean' or it.get('drop_iframe'):
        want = want.replace(PHF, '')
    if media_mode == 'clean':
        want = want.replace(PH, '')
    else:
        for tag in btags:
            want = want.replace(PH if tag.startswith('<img') else PHF, tag, 1)
    img_live = len(re.findall(r'<img', d.get('description') or ''))
    img_want = len(re.findall(r'<img', want))
    checks = {
        "name_ok": d.get('name') == it['new_name'],
        "desc_ok": norm_deep(d.get('description') or '') == norm_deep(want) and srcs(d.get('description') or '') == srcs(want),
        "short_ok": text(d.get('short_description') or '') == text(it['short']),
        "rmT_ok": html.unescape(md.get('rank_math_title') or '') == it['tkd_title'],
        "rmD_ok": html.unescape(md.get('rank_math_description') or '') == it['tkd_desc'],
        "slug_ok": d.get('slug') == before.get('slug'),
        "price_ok": d.get('price') == before.get('price'),
        "img_ok": img_live == img_want,
    }
    for k, v in checks.items():
        if v: report[k] += 1
    if not all(checks.values()):
        report["fails"].append({"id": int(pid), "failed": [k for k, v in checks.items() if not v]})
    blob = (it['desc'] + it['short'] + it['tkd_desc'] + it['new_name']).lower()
    hits = [w for w in SLOP if w in blob]
    if hits: report["slop_hits"].append((pid, hits))
    wcs.append(len(re.findall(r"[A-Za-z0-9'+-]+", re.sub(r'<[^>]+>', ' ', it['desc']))))
    sls.append(len(re.findall(r"[A-Za-z0-9'+-]+", it['short'])))
    tls.append(len(it['tkd_title'])); dls.append(len(it['tkd_desc']))
    time.sleep(0.5)

report["stats"] = {"desc_words": [min(wcs), max(wcs)], "short_words": [min(sls), max(sls)],
                   "tkd_title_len": [min(tls), max(tls)], "tkd_desc_len": [min(dls), max(dls)]}
json.dump(report, open(os.path.join(HERE, 'final_verify.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps({k: v for k, v in report.items() if k != 'fails'}, ensure_ascii=False))
print('fails:', report['fails'])
