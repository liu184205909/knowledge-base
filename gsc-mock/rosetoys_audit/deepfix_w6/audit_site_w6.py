# -*- coding: utf-8 -*-
"""Site-wide final audit: pull all publish products, verify the three-piece
(name+desc+short+TKD) completeness per SKU against wave plans / generic gates.
Output: site_audit_w6.json + console summary."""
import json, subprocess, time, os, re, html, glob

AUTH = "lzn184205909@gmail.com:x1F3unlUOIpUrhcb5aE0bDdG"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

def curl_json(path):
    r = subprocess.run(["curl", "-s", "--max-time", "90", "-A", UA, "-u", AUTH,
                        "https://rosetoys.org/wp-json" + path],
                       capture_output=True, text=True, encoding="utf-8")
    return json.loads(r.stdout)

def words(s):
    return len(re.findall(r"[A-Za-z0-9'+-]+", re.sub(r'<[^>]+>', ' ', s or '')))

def textonly(s):
    s = re.sub(r"<[^>]+>", " ", s or "")
    return html.unescape(s).replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')

# --- merge plans ---
plans = {}  # id -> (wave, item)
for f in glob.glob(os.path.join(ROOT, "deepfix_night", "plan_night_b*.json")):
    for k, v in json.load(open(f, encoding="utf-8")).items():
        plans[k] = ("w3-night", v)
for f in glob.glob(os.path.join(ROOT, "deepfix_toy", "plan_toy_b*.json")):
    for k, v in json.load(open(f, encoding="utf-8")).items():
        if k not in plans: plans[k] = ("w4-toy", v)
for f in glob.glob(os.path.join(ROOT, "deepfix_cos", "plan_cos_x*.json")):
    for k, v in json.load(open(f, encoding="utf-8")).items():
        if k not in plans: plans[k] = ("w5-cos", v)
for k, v in json.load(open(os.path.join(HERE, "plan_w6.json"), encoding="utf-8")).items():
    if k not in plans: plans[k] = ("w6", v)
print("plan-covered ids:", len(plans))

# --- pull all publish products ---
all_items, page = [], 1
while True:
    batch = curl_json(f"/wc/v3/products?status=publish&per_page=100&page={page}&orderby=id&order=asc")
    if not isinstance(batch, list) or not batch:
        break
    all_items.extend(batch)
    print(f"page {page}: {len(batch)} (total so far {len(all_items)})", flush=True)
    if len(batch) < 100:
        break
    page += 1
    time.sleep(1.0)
print("TOTAL publish:", len(all_items))

CATNAMES = {}
rows, fails = [], []
for p in all_items:
    pid = str(p["id"])
    md = {m.get("key"): m.get("value") for m in (p.get("meta_data") or [])}
    rmt = html.unescape(md.get("rank_math_title") or "")
    rmd = html.unescape(md.get("rank_math_description") or "")
    desc = p.get("description") or ""
    short = p.get("short_description") or ""
    wave, it = plans.get(pid, (None, None))
    dw, sw = words(desc), words(short)
    has_ul = "<ul>" in desc.lower() or "<li>" in desc.lower()
    checks = {
        "desc_deep": dw >= 120 and has_ul,
        "short_ok": 12 <= sw <= 40,
        "rmt_ok": rmt.endswith("| RoseToys") and len(rmt) <= 62,
        "rmd_ok": 90 <= len(rmd) <= 160,
    }
    name_ok = (p.get("name") == it["new_name"]) if it else None
    if it:
        checks["name_plan"] = bool(name_ok)
    cats = [c["name"] for c in (p.get("categories") or [])]
    for c in p.get("categories") or []:
        CATNAMES[c["id"]] = c["name"]
    ok = all(checks.values())
    rows.append({"id": p["id"], "wave": wave or "w1w2-zero", "name": p.get("name"),
                 "cats": cats, "desc_w": dw, "short_w": sw, "rmt_len": len(rmt),
                 "rmd_len": len(rmd), "ok": ok, "checks": checks})
    if not ok:
        fails.append({"id": p["id"], "wave": wave or "w1w2-zero",
                      "failed": [k for k, v in checks.items() if not v],
                      "name": p.get("name")})

summary = {
    "total": len(rows),
    "ok_count": sum(1 for r in rows if r["ok"]),
    "by_wave": {},
    "fails": fails,
    "pulled_at": "2026-10-11",
}
for r in rows:
    summary["by_wave"].setdefault(r["wave"], {"n": 0, "ok": 0})
    summary["by_wave"][r["wave"]]["n"] += 1
    summary["by_wave"][r["wave"]]["ok"] += 1 if r["ok"] else 0

json.dump({"summary": summary, "rows": rows, "catnames": CATNAMES},
          open(os.path.join(HERE, "site_audit_w6.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
print(json.dumps({k: v for k, v in summary.items() if k != "fails"}, ensure_ascii=False, indent=1))
print("FAILS:", json.dumps(fails, ensure_ascii=False, indent=1))
