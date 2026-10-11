# -*- coding: utf-8 -*-
"""Final verification for wave 3 (nightwear term 163): read back all 117 SKUs,
compare name/desc/short/rankmath vs plans, check slug/price vs before snapshots,
and run the slop scan over all new copy."""
import json, re, subprocess, time, os, glob

AUTH = "lzn184205909@gmail.com:x1F3unlUOIpUrhcb5aE0bDdG"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
HERE = os.path.dirname(os.path.abspath(__file__))
SLOP = ['elevate', 'effortless', 'timeless', 'perfect', 'must-have', 'must have',
        'whether you', 'whether it', 'unleash', 'look no further', 'game-changer',
        'stunning', 'unlock', 'level up']

def norm(s):
    return "".join(s.split())

plans = {}
for f in sorted(glob.glob(os.path.join(HERE, 'plan_night_b*.json'))):
    plans.update(json.load(open(f, encoding='utf-8')))

report = {"total": len(plans), "name_ok": 0, "desc_ok": 0, "short_ok": 0,
          "rmT_ok": 0, "rmD_ok": 0, "slug_ok": 0, "price_ok": 0,
          "slop_hits": [], "fails": []}

for pid in sorted(plans, key=int):
    it = plans[pid]
    r = subprocess.run(["curl", "-s", "--max-time", "60", "-A", UA, "-u", AUTH,
                        f"https://rosetoys.org/wp-json/wc/v3/products/{pid}"],
                       capture_output=True, text=True, encoding="utf-8")
    d = json.loads(r.stdout)
    md = {m.get('key'): m.get('value') for m in (d.get('meta_data') or [])}
    before = json.load(open(os.path.join(HERE, f"_before_{pid}.json"), encoding='utf-8'))
    checks = {
        "name_ok": d.get('name') == it['new_name'],
        "desc_ok": norm(d.get('description') or '') == norm(it['desc']),
        "short_ok": bool((d.get('short_description') or '').strip()),
        "rmT_ok": md.get('rank_math_title') == it['tkd_title'],
        "rmD_ok": md.get('rank_math_description') == it['tkd_desc'],
        "slug_ok": d.get('slug') == before.get('slug'),
        "price_ok": d.get('price') == before.get('price'),
    }
    for k, v in checks.items():
        if v:
            report[k] += 1
    if not all(checks.values()):
        report["fails"].append({"id": int(pid), "failed": [k for k, v in checks.items() if not v]})
    hits = [w for w in SLOP if w in (it['desc'] + it['short'] + it['tkd_desc']).lower()]
    if hits:
        report["slop_hits"].append((pid, hits))
    time.sleep(0.5)

# word/char stats for the report
wcs, tls, dls, sls = [], [], [], []
for pid, it in plans.items():
    txt = re.sub(r'<[^>]+>', ' ', it['desc'])
    wcs.append(len(re.sub(r'\s+', ' ', txt).strip().split()))
    tls.append(len(it['tkd_title']))
    dls.append(len(it['tkd_desc']))
    sls.append(len(it['short'].split()))
report["desc_wc"] = {"min": min(wcs), "max": max(wcs)}
report["tkd_title_len"] = {"min": min(tls), "max": max(tls)}
report["tkd_desc_len"] = {"min": min(dls), "max": max(dls)}
report["short_wc"] = {"min": min(sls), "max": max(sls)}

json.dump(report, open(os.path.join(HERE, 'final_verify.json'), 'w', encoding='utf-8'),
          ensure_ascii=False, indent=1)
print(json.dumps(report, ensure_ascii=False, indent=1))
