# -*- coding: utf-8 -*-
"""16945 desc rewrite (stale supplier name + slop 'perfect' in tail).
name/short/TKD already compliant from zero-tail batch - carried unchanged."""
import json, subprocess, time, os, re, html

AUTH = "lzn184205909@gmail.com:x1F3unlUOIpUrhcb5aE0bDdG"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
HERE = os.path.dirname(os.path.abspath(__file__))

NEW_DESC = ("<p>A rose-shaped stimulator in medical-grade silicone and ABS, finished in rose red or pink. "
"The bud head carries 9 vibration frequencies and 9 rotation frequencies, plus a neutral mode - "
"nineteen loaded settings in total, switchable in sequence.</p>"
"<p>The unit weighs 147.8 g and measures 105.61 by 58.48 mm - small enough for one-handed control "
"at any of its settings, with the charge contact sealed against water.</p>"
"<ul><li>Material: medical-grade silicone, ABS</li><li>Colors: rose red, pink</li>"
"<li>Modes: 9 vibration, 9 rotation, 1 neutral</li><li>Weight: 147.8 g</li>"
"<li>Dimensions: 105.61 x 58.48 mm</li><li>Battery: 3.7V 320mAh, magnetic USB, 80-minute charge</li>"
"<li>Noise: under 58 dB</li><li>Waterproof: IPX7</li></ul>"
"<p>The 3.7V 320mAh battery recharges over magnetic USB in 80 minutes, and the IPX7 rating takes "
"the whole unit under running water. Noise stays under 58 dB across every mode.</p>"
"<p>Rose red serves the gift register, pink the everyday one - the same motor and mode set in either shell.</p>")

def _norm_deep(s):
    s = re.sub(r"<br\s*/?>", "", s)
    s = re.sub(r"<p>\s*((?:<img[^>]*>\s*)+)</p>", r"\1", s)
    s = re.sub(r"<(\w+)[^>]*>", r"<\1>", s)
    return "".join(s.split())

def curl_json(method, path, payload=None):
    cmd = ["curl", "-s", "--max-time", "90", "-X", method, "-A", UA, "-u", AUTH,
           "https://rosetoys.org/wp-json" + path]
    if payload is not None:
        tmp = os.path.join(HERE, "_payload_tmp_16945.json")
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False)
        cmd += ["-H", "Content-Type: application/json; charset=utf-8", "--data-binary", "@" + tmp]
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    return json.loads(r.stdout)

before = curl_json("GET", "/wc/v3/products/16945")
with open(os.path.join(HERE, "_before_16945.json"), "w", encoding="utf-8") as f:
    json.dump(before, f, ensure_ascii=False, indent=1)
short0 = before.get("short_description")
name0 = before.get("name")
slug0, price0 = before.get("slug"), before.get("price")
cats0 = sorted(c["id"] for c in (before.get("categories") or []))
time.sleep(1.0)

resp = curl_json("PUT", "/wc/v3/products/16945",
                 {"name": name0, "description": NEW_DESC, "short_description": short0})
assert resp.get("id") == 16945 and resp.get("name") == name0, resp
assert _norm_deep(resp.get("description", "")) == _norm_deep(NEW_DESC), "desc mismatch"
assert resp.get("slug") == slug0 and resp.get("price") == price0
time.sleep(1.0)
back = curl_json("GET", "/wc/v3/products/16945")
cats1 = sorted(c["id"] for c in (back.get("categories") or []))
print("name:", back.get("name") == name0)
print("desc:", _norm_deep(back.get("description") or "") == _norm_deep(NEW_DESC))
print("short unchanged:", back.get("short_description") == short0)
print("slug:", back.get("slug") == slug0, "| price:", back.get("price") == price0,
      "| cats:", cats1 == cats0)
dw = len(re.findall(r"[A-Za-z0-9'+-]+", re.sub(r'<[^>]+>', ' ', NEW_DESC)))
print("desc words:", dw)
