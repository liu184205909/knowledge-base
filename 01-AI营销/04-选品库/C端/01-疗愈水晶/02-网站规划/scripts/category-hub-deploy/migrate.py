#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Migrate category hub intros to Elementor Archive templates.
Clones horoscope (48124) FULL 4-container structure, replaces text per category:
  container1: wd_title -> category name
  container2: heading "Latest {Name}" + intro text + posts(term)
  container3: heading "All {Name} Articles" + intro text + posts(term)
  container4: text-editor -> category SEO intro (h2/ps/faq/disclaimer)
Usage: python migrate.py tarot   # single
       python migrate.py         # all
"""
import json, random, string, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from deploy import api

HOROSCOPE_TPL = 48124

def eid():
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=7))

def get_full_data():
    d, _ = api("GET", "/wp-json/wp/v2/elementor_library/%d?context=edit" % HOROSCOPE_TPL)
    return json.loads(d["meta"]["_elementor_data"])

def intro_inner(item):
    h = "<h2>%s</h2>" % item["h2"]
    for p in item["ps"]:
        h += "<p>%s</p>" % p
    faq = item.get("faq")
    if faq:
        h += "<h2>Frequently Asked Questions</h2>"
        for f in faq:
            h += "<p><strong>%s</strong></p><p>%s</p>" % (f["q"], f["a"])
    h += ("<p><em>Crystals, astrology, and tarot are offered for reflection, self-awareness, and spiritual "
          "inspiration. There is no scientific evidence that they determine outcomes, and this content is "
          "not a substitute for medical, psychological, financial, or professional advice.</em></p>")
    return h

def make_data(intro_html, cat_id, name, full_data):
    data = json.loads(json.dumps(full_data))  # deep copy of horoscope 4-container structure
    counters = {"heading": 0}
    text_editors = []
    def walk(els):
        for e in els:
            e["id"] = eid()
            wt = e.get("widgetType")
            s = e.setdefault("settings", {})
            if wt == "wd_title":
                s["title"] = name
            elif wt == "heading":
                s["title"] = ("Latest %s Articles" % name) if counters["heading"] == 0 else ("All %s Articles" % name)
                counters["heading"] += 1
            elif wt == "text-editor":
                text_editors.append(e)
            elif wt == "posts":
                s["posts_include_term_ids"] = [str(cat_id)]
                s.pop("posts_exclude_ids", None)
                s.pop("posts_exclude", None)
                s["classic_posts_per_page"] = 9
            walk(e.get("elements", []))
    walk(data)
    n = len(text_editors)
    nm = name.lower()
    for i, te in enumerate(text_editors):
        s = te.setdefault("settings", {})
        if i == n - 1:                    # last text-editor = SEO intro (container 4)
            s["editor"] = intro_html
        elif i == 0:                      # container 2 blurb
            s["editor"] = "<p>The newest %s guides, refreshed regularly.</p>" % nm
        else:                             # container 3 blurb
            s["editor"] = "<p>The complete archive of every %s article on the site.</p>" % nm
    return data

def create(slug, item, full_data):
    intro_html = intro_inner(item)
    data = make_data(intro_html, item["cat_id"], item["name"], full_data)
    data_json = json.dumps(data)
    payload = {
        "title": "%s Archive" % item["name"],
        "status": "publish",
        "slug": "%s-archive" % slug,
        "content": data_json,
        "meta": {
            "_elementor_template_type": "archive",
            "_elementor_edit_mode": "builder",
            "_elementor_data": data_json,
            "_elementor_conditions": ["include/archive/category/%d" % item["cat_id"]],
            "_elementor_css": "",
            "_elementor_version": "4.1.4",
            "_wp_page_template": "default",
        },
    }
    res, c = api("POST", "/wp-json/wp/v2/elementor_library", payload)
    return res, c

def main():
    intros = json.load(open(os.path.join(HERE, "intros.json"), encoding="utf-8"))
    only = sys.argv[1] if len(sys.argv) > 1 else None
    full_data = get_full_data()
    print("horoscope top-level containers:", len(full_data))
    for slug, item in intros.items():
        if slug.startswith("_"):
            continue
        if only and slug != only:
            continue
        res, c = create(slug, item, full_data)
        if isinstance(res, dict) and res.get("id"):
            print("CREATED", slug, "id", res["id"], "HTTP", c)
        else:
            print("FAILED ", slug, "HTTP", c, str(res)[:200])

if __name__ == "__main__":
    main()
