#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Verify all category hub intros: snippet active + online render on archive page."""
import json, subprocess, os

AUTH = "lzn184205909@gmail.com:QsF9VjRLDNzN9JXCI72f6HmN"
BASE = "https://goearthward.com"
UA = "curl/8.0.0"
HERE = os.path.dirname(os.path.abspath(__file__))
PARENT = {0: None, 1559: "zodiac", 1590: "crystals", 1572: "astrology"}

def api(path):
    r = subprocess.run(["curl", "-s", "-u", AUTH, "-A", UA, BASE + path],
                       capture_output=True, encoding="utf-8")
    return json.loads(r.stdout)

data = json.load(open(os.path.join(HERE, "intros.json"), encoding="utf-8"))
snips = api("/wp-json/code-snippets/v1/snippets?per_page=100")
hub = {}
for s in snips:
    n = s.get("name", "")
    if "Category Hub" in n:
        key = n.split("—")[-1].strip()
        hub[key] = s

print("%-22s %-7s %-7s %-5s %s" % ("slug", "active", "render", "id", "h2"))
print("-" * 80)
fails = []
for slug, item in data.items():
    if slug.startswith("_"):
        continue
    name = item["name"]
    s = hub.get(name)
    active = s.get("active") if s else "MISSING"
    p = item["parent"]
    if p == 0 or PARENT.get(p) is None:
        url = BASE + "/category/" + slug + "/"
    else:
        url = BASE + "/category/" + PARENT[p] + "/" + slug + "/"
    rp = subprocess.run(["curl", "-s", "-A", UA, url], capture_output=True, encoding="utf-8")
    render = "goe-cat-hub" in rp.stdout and item["h2"][:15] in rp.stdout
    ok = (active is True) and render
    if not ok:
        fails.append((slug, active, render, url))
    print("%-22s %-7s %-7s %-5s %s" % (
        slug, str(active), str(render), str(s.get("id") if s else "-"), item["h2"][:30]))

print("-" * 80)
print("FAILS:", len(fails))
for f in fails:
    print("  ", f)
