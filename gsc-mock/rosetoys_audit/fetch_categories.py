import requests, json

AUTH = ("lzn184205909@gmail.com", "x1F3unlUOIpUrhcb5aE0bDdG")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
H = {"User-Agent": UA}
BASE = "https://rosetoys.org/wp-json/wc/v3"

r = requests.get(f"{BASE}/products/categories", params={"per_page": 100, "_fields": "id,name,slug,parent,count"},
                 auth=AUTH, headers=H, timeout=60)
d = r.headers
# 翻页
pages = int(d.get("X-WP-TotalPages", "1"))
total = d.get("X-WP-Total", "?")
data = r.json()
print("page1:", len(data), "total:", total, "pages:", pages)
for p in range(2, pages + 1):
    rr = requests.get(f"{BASE}/products/categories", params={"per_page": 100, "page": p, "_fields": "id,name,slug,parent,count"},
                      auth=AUTH, headers=H, timeout=60)
    data += rr.json()
with open("categories.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=1)
print("fetched categories:", len(data))

byid = {c["id"]: c for c in data}
def subtree(root_id):
    ids = {root_id}
    changed = True
    while changed:
        changed = False
        for c in data:
            if c["parent"] in ids and c["id"] not in ids:
                ids.add(c["id"]); changed = True
    return ids

roots = [c for c in data if c["slug"] in ("womens-lingerie", "womens-costumes")]
for root in roots:
    ids = subtree(root["id"])
    print(f'== root id={root["id"]} {root["name"]} count={root["count"]} subtree={len(ids)}')
    for i in sorted(ids):
        cc = byid[i]
        print(f'  id={i:4d} slug={cc["slug"]:30s} parent={cc["parent"]:4d} count={cc["count"]}')
    with open(f'subtree_{root["slug"]}.json', "w", encoding="utf-8") as f:
        json.dump(sorted(ids), f)
