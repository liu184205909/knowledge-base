#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Deploy evergreen SEO intros to goearthward.com category archive hubs via Code Snippets.
- loop_start + is_category(slug) + nowdoc echo (per memory: code-snippets-archive-deploy)
- GET dedupe before create (per memory: code-snippets-rest-api-route — avoid double-active)
- curl + UA=curl/8.0.0 (Imunify360 blocks urllib)
- Snippet name uses U+2014 em-dash: 'Category Hub — {Name}'. Keep consistent for dedupe (name_map exact match).
- active is set via payload active:true on POST/PUT. The /activate endpoint returns HTTP 500 and is NOT called.
Usage: python deploy.py            # all slugs
       python deploy.py tarot      # single slug (test)
"""
import json, subprocess, sys, os

AUTH = "lzn184205909@gmail.com:QsF9VjRLDNzN9JXCI72f6HmN"
BASE = "https://goearthward.com"
UA = "curl/8.0.0"
HERE = os.path.dirname(os.path.abspath(__file__))

def api(method, path, data=None):
    cmd = ["curl", "-s", "-w", "\n%{http_code}", "-X", method,
           "-u", AUTH, "-A", UA, "-H", "Content-Type: application/json"]
    if data is not None:
        cmd += ["--data-binary", json.dumps(data)]
    cmd += [BASE + path]
    r = subprocess.run(cmd, capture_output=True, encoding="utf-8")
    out = r.stdout or ""
    lines = out.rsplit("\n", 1)
    code = lines[1].strip() if len(lines) == 2 else "0"
    body = lines[0]
    try:
        return json.loads(body), code
    except Exception:
        return body, code

def build_html(slug, item):
    html = ('<div class="goe-cat-hub" style="grid-column:1 / -1;width:100%;margin:0 0 30px;'
            'padding:26px 0;background:#fbf8f4;border-top:1px solid #ece3d8;'
            'border-bottom:1px solid #ece3d8;line-height:1.75;color:#3d3530;font-size:16px;">')
    html += '<div style="max-width:880px;margin:0 auto;padding:0 28px;">\n'
    html += ('  <h2 style="font-size:clamp(22px,3vw,28px);color:#2a2520;margin:0 0 14px;'
             'line-height:1.3;font-weight:600;">' + item["h2"] + '</h2>\n')
    for p in item["ps"]:
        html += '  <p style="margin:0 0 14px;">' + p + '</p>\n'
    faq = item.get("faq")
    if faq:
        html += ('  <h2 style="font-size:clamp(22px,3vw,28px);color:#2a2520;margin:10px 0 14px;'
                 'line-height:1.3;font-weight:600;">Frequently Asked Questions</h2>\n')
        for f in faq:
            html += '  <p style="margin:0 0 6px;font-weight:600;color:#2a2520;">' + f["q"] + '</p>\n'
            html += '  <p style="margin:0 0 14px;">' + f["a"] + '</p>\n'
    if item.get("is_parent_hub"):
        html += ('  <div style="display:grid;grid-template-columns:'
                 'repeat(auto-fill,minmax(220px,1fr));gap:14px;margin-top:6px;">\n')
        for ch in item["children"]:
            p_slug = ch.get("cross_parent", slug)
            if p_slug:
                url = BASE + "/category/" + p_slug + "/" + ch["slug"] + "/"
            else:
                url = BASE + "/category/" + ch["slug"] + "/"
            html += ('    <a href="' + url + '" style="display:block;padding:16px;background:#fff;'
                     'border:1px solid #ece3d8;border-radius:10px;text-decoration:none;color:#2a2520;">'
                     '<strong style="display:block;font-size:16px;margin-bottom:4px;">' + ch["title"] +
                     '</strong><span style="font-size:14px;color:#6b5d52;">' + ch["desc"] +
                     '</span></a>\n')
        html += '  </div>\n'
    html += ('  <p style="margin:18px 0 0;font-size:13px;color:#7a6e62;font-style:italic;'
             'border-top:1px solid #ece3d8;padding-top:14px;">Crystals, astrology, and tarot are offered '
             'for reflection, self-awareness, and spiritual inspiration. There is no scientific evidence '
             'that they determine outcomes, and this content is not a substitute for medical, psychological, '
             'financial, or professional advice.</p>\n')
    html += '</div>\n</div>'
    return html

TEMPLATE = """<?php
add_action('loop_start', function($q){
  if(!is_category('__SLUG__') || !$q->is_main_query() || is_paged()) return;
  echo <<<'GOEHTML'
__HTML__
GOEHTML;
});"""

# For empty leaf archives (publish=0, no children) loop_start never fires because WP skips The Loop
# when have_posts() is false. Inject via output buffering into the wd-content-area container instead.
OB_TEMPLATE = """<?php
add_action('template_redirect', function(){
  if(!is_category('__SLUG__') || is_paged()) return;
  ob_start(function($html){
    if(strpos($html, 'goe-cat-hub') !== false){ return $html; }
    $intro = <<<'GOEHTML'
__HTML__
GOEHTML;
    return preg_replace('/(<div[^>]*class="[^"]*wd-content-area[^"]*"[^>]*>)/', '$1' . $intro, $html, 1);
  });
});"""

def main():
    with open(os.path.join(HERE, "intros.json"), encoding="utf-8") as f:
        data = json.load(f)
    only = sys.argv[1] if len(sys.argv) > 1 else None

    existing, c = api("GET", "/wp-json/code-snippets/v1/snippets?per_page=100")
    print("GET snippets HTTP", c, "count:", len(existing) if isinstance(existing, list) else "ERR")
    name_map = {s.get("name"): s for s in existing} if isinstance(existing, list) else {}

    for slug, item in data.items():
        if slug.startswith("_"):
            continue
        if only and slug != only:
            continue
        name = "Category Hub — " + item["name"]
        html = build_html(slug, item)
        tpl = OB_TEMPLATE if (item["count"] == 0 and not item.get("is_parent_hub")) else TEMPLATE
        code = tpl.replace("__SLUG__", slug).replace("__HTML__", html)
        payload = {"name": name, "code": code, "scope": "global",
                   "active": True, "tags": ["category-hub"]}
        ex = name_map.get(name)
        if ex:
            sid = ex["id"]
            res, c = api("PUT", "/wp-json/code-snippets/v1/snippets/%d" % sid, payload)
            print("UPDATED", slug, "id", sid, "PUT", c, "(active via payload)")
        else:
            res, c = api("POST", "/wp-json/code-snippets/v1/snippets", payload)
            sid = res.get("id") if isinstance(res, dict) else None
            if sid:
                print("CREATED", slug, "id", sid, "POST", c, "(active via payload)")
            else:
                print("FAILED ", slug, "POST", c, str(res)[:300])

if __name__ == "__main__":
    main()
