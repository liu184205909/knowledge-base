# -*- coding: utf-8 -*-
"""抓取 5 工具页移动端的工具容器 DOM,确认 JS 是否渲染出交互内容"""
import json, os, time
from playwright.sync_api import sync_playwright

TOOLS = [
    ("chakra-test",       "https://goearthward.com/tools/chakra-test/"),
    ("element-test",      "https://goearthward.com/tools/element-test/"),
    ("crystal-quiz",      "https://goearthward.com/tools/crystal-quiz/"),
    ("cleansing-timer",   "https://goearthward.com/tools/crystal-cleansing-timer/"),
    ("birthstone-finder", "https://goearthward.com/tools/birthstone-finder/"),
]

FIND_ROOT = r"""
() => {
  const candidates = document.querySelectorAll('[id*="tool"], [id*="quiz"], [id*="chakra"], [id*="element"], [id*="cleans"], [id*="birthstone"], [id*="app"], [id*="root"], [id*="test"], [id*="finder"]');
  const ec = document.querySelector('.entry-content, .wd-entry-content, main, article');
  const roots = [];
  const scope = ec || document.body;
  scope.querySelectorAll('div').forEach(d => {
    const b = d.querySelectorAll('button').length;
    if (b >= 2) roots.push({id: d.id, cls:(d.className||'').slice(0,80), btn: b, html: d.outerHTML.slice(0,400)});
  });
  roots.sort((a,b)=>b.btn-a.btn);
  return {
    top: roots.slice(0,3),
    idd: Array.from(candidates).map(c=>({tag:c.tagName,id:c.id,cls:(c.className||'').slice(0,60)})).slice(0,15),
    ecFound: !!ec
  };
}
"""

DEEP = r"""
(sel) => {
  let root = sel ? document.querySelector(sel) : null;
  if (!root) root = document.querySelector('.entry-content, .wd-entry-content, main, article') || document.body;
  const btns = Array.from(root.querySelectorAll('button, [role="button"], label, input[type="radio"], select'));
  const sample = btns.slice(0,40).map(b => {
    const r=b.getBoundingClientRect();
    return {tag:b.tagName, txt:(b.innerText||b.getAttribute('aria-label')||b.value||'').trim().slice(0,40), cls:(b.className||'').slice(0,40), w:Math.round(r.width), h:Math.round(r.height)};
  });
  return {rootSel: sel, btnCount: btns.length, sample, txt:(root.innerText||'').slice(0,700)};
}
"""

OUT = r"D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/screenshots/tools-mobile"
with sync_playwright() as p:
    b = p.chromium.launch()
    out = {}
    for slug, url in TOOLS:
        ctx = b.new_context(viewport={"width":375,"height":812}, is_mobile=True, has_touch=True)
        pg = ctx.new_page()
        errs=[]
        pg.on("console", lambda m: errs.append(f"[{m.type}]{m.text}") if m.type=="error" else None)
        pg.on("pageerror", lambda e: errs.append(f"[pageerror]{e}"))
        try: pg.goto(url, wait_until="networkidle", timeout=45000)
        except Exception as e: errs.append(f"goto:{e}")
        time.sleep(2.5)
        find = pg.evaluate(FIND_ROOT)
        rootSel = None
        for t in find.get("top",[]):
            if t.get("id"): rootSel = "#"+t["id"]; break
        if not rootSel:
            for i in find.get("idd",[]):
                if i.get("id") and any(k in i["id"].lower() for k in ["quiz","chakra","element","cleans","birth","tool","app","root","finder","test"]):
                    rootSel = "#"+i["id"]; break
        deep = pg.evaluate(DEEP, rootSel)
        out[slug] = {"find": find, "deep": deep, "errors": errs[:10]}
        ctx.close()
    b.close()

json.dump(out, open(os.path.join(OUT,"_dom.json"),"w",encoding="utf-8"), ensure_ascii=False, indent=2)
for slug,d in out.items():
    print(f"\n##### {slug} #####")
    top = d["find"].get("top",[])
    print("  top0:", json.dumps(top[0] if top else {}, ensure_ascii=False)[:220])
    print("  btnCount:", d["deep"].get("btnCount"), "rootSel:", d["deep"].get("rootSel"))
    print("  txt[:280]:", (d["deep"].get("txt","") or "")[:280].replace("\n"," "))
    print("  sample[:4]:", json.dumps(d["deep"].get("sample",[])[:4], ensure_ascii=False))
    print("  errors:", d["errors"][:3])
