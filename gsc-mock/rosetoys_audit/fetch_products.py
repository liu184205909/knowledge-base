import requests, json, time

AUTH = ("lzn184205909@gmail.com", "x1F3unlUOIpUrhcb5aE0bDdG")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
H = {"User-Agent": UA}
BASE = "https://rosetoys.org/wp-json/wc/v3"
FIELDS = "id,name,slug,price,regular_price,sale_price,stock_status,categories,images,description,short_description,meta_data,attributes,type,status,permalink"

all_items = []
page = 1
while True:
    r = requests.get(f"{BASE}/products", params={
        "category": 299, "per_page": 100, "page": page, "status": "publish",
        "_fields": FIELDS}, auth=AUTH, headers=H, timeout=120)
    batch = r.json()
    if not isinstance(batch, list):
        print("ERR page", page, str(batch)[:300]); break
    all_items += batch
    print(f"page {page}: {len(batch)} items (total {len(all_items)}), hdr total={r.headers.get('X-WP-Total')}, pages={r.headers.get('X-WP-TotalPages')}")
    tp = r.headers.get("X-WP-TotalPages")
    if not batch or (tp and page >= int(tp)): break
    page += 1
    time.sleep(0.3)

with open("products.json", "w", encoding="utf-8") as f:
    json.dump(all_items, f, ensure_ascii=False, indent=1)
print("SAVED", len(all_items), "products")
