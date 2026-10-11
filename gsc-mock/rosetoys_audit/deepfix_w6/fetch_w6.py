# -*- coding: utf-8 -*-
"""Wave 6 fetch: 20 bikini (term 211) publish SKUs + 6 moved SKUs (19104/20011/22024/19419/19776/20625).
Saves full details for planning."""
import json, subprocess, time, os

AUTH = "lzn184205909@gmail.com:x1F3unlUOIpUrhcb5aE0bDdG"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.44")
HERE = os.path.dirname(os.path.abspath(__file__))

def curl_json(path, out_file=None):
    cmd = ["curl", "-s", "--max-time", "90", "-A", UA, "-u", AUTH,
           "https://rosetoys.org/wp-json" + path]
    if out_file:
        cmd += ["-o", out_file]
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if out_file:
        with open(out_file, "r", encoding="utf-8") as f:
            return json.load(f)
    try:
        return json.loads(r.stdout)
    except Exception:
        return {"_raw": r.stdout[:500]}

def slim(p):
    return {
        "id": p["id"], "name": p.get("name"), "slug": p.get("slug"),
        "status": p.get("status"), "price": p.get("price"),
        "type": p.get("type"),
        "cats": [(c["id"], c["name"]) for c in (p.get("categories") or [])],
        "attrs": [{"name": a.get("name"),
                   "options": a.get("options"),
                   "variation": a.get("variation")} for a in (p.get("attributes") or [])],
        "variations": len(p.get("variations") or []),
        "img_count": len(p.get("images") or []),
        "img_alts": [im.get("alt") for im in (p.get("images") or [])[:3]],
        "desc_len": len(p.get("description") or ""),
        "desc": p.get("description"),
        "short": p.get("short_description"),
        "rm_title": next((m["value"] for m in (p.get("meta_data") or [])
                          if m.get("key") == "rank_math_title"), None),
        "rm_desc": next((m["value"] for m in (p.get("meta_data") or [])
                         if m.get("key") == "rank_math_description"), None),
    }

# 1. term 211 list
lst = curl_json("/wc/v3/products?category=211&status=publish&per_page=100&page=1",
                os.path.join(HERE, "list_t211_p1.json"))
print("t211 publish count:", len(lst))
bikini_ids = [p["id"] for p in lst]

# 2. moved 6
moved = [19104, 20011, 22024, 19419, 19776, 20625]

all_ids = bikini_ids + [i for i in moved if i not in bikini_ids]
print("total wave6 ids:", len(all_ids))

out = {}
for pid in all_ids:
    full = curl_json(f"/wc/v3/products/{pid}")
    out[str(pid)] = slim(full)
    # keep a raw before snapshot too
    with open(os.path.join(HERE, f"_before_{pid}.json"), "w", encoding="utf-8") as f:
        json.dump(full, f, ensure_ascii=False, indent=1)
    time.sleep(1.0)

with open(os.path.join(HERE, "details_w6.json"), "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print("saved details_w6.json:", len(out))
