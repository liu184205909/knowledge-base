import requests, json
AUTH = ("lzn184205909@gmail.com", "x1F3unlUOIpUrhcb5aE0bDdG")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
H = {"User-Agent": UA}
# 看 404 返回体 + 试 wc/v3
r1 = requests.get("https://rosetoys.org/wp-json/wp/v2/products/categories", params={"per_page":5}, auth=AUTH, headers=H, timeout=60)
print("wp/v2:", r1.status_code, r1.text[:300])
r2 = requests.get("https://rosetoys.org/wp-json/wc/v3/products/categories", params={"per_page":5,"_fields":"id,name,slug,parent,count"}, auth=AUTH, headers=H, timeout=60)
print("wc/v3:", r2.status_code, r2.text[:500])
