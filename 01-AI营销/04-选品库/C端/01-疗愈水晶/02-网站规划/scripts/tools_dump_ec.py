# -*- coding: utf-8 -*-
"""直接 dump entry-content / wd-entry-content 全文 + 找真正工具容器"""
import json, os, time
from playwright.sync_api import sync_playwright

TOOLS = [
    ("chakra-test",       "https://goearthward.com/tools/chakra-test/"),
    ("element-test",      "https://goearthward.com/tools/element-test/"),
    ("crystal-quiz",      "https://goearthward.com/tools/crystal-quiz/"),
    ("cleansing-timer",   "https://goearthward.com/tools/crystal-cleansing-timer/"),
    ("birthstone-finder", "https://goearthward.com/tools/birthstone-finder/"),
]

DUMP = r"""
() => {
  const ec = document.querySelector('.wd-entry-content') || document.querySelector('.entry-content') || document.querySelector('main') || document.body;
  // 工具容器:在 ec 内 button 数最多的 DIV(排除 style/script)
  const divs = Array.from(ec.querySelectorAll('div')).filter(d => {
    const cs = getComputedStyle(d);
    return cs.display !== 'none' && d.querySelectorAll('button, [role="button"], label, input[type="radio"]').length >= 1;
  });
  const scored = divs.map(d => ({el:d, btn: d.querySelectorAll('button, [role="button"], label, input[type="radio"]').length})).sort((a,b)=>b.btn-a.btn);
  const root = scored[0]?.el || ec;
  const btns = Array.from(root.querySelectorAll('button, [role="button"], label, input[type="radio"], select'));
  const sample = btns.slice(0,40).map(b => {
    const r=b.getBoundingClientRect();
    const cs=getComputedStyle(b);
    return {tag:b.tagName, txt:(b.innerText||b.getAttribute('aria-label')||b.value||'').trim().slice(0,30), w:Math.round(r.width), h:Math.round(r.height), fs:Math.round(parseFloat(cs.fontSize))};
  });
  return {
    ecTag: ec.tagName, ecCls: ec.className.slice(0,80),
    rootTag: root.tagName, rootId: root.id, rootCls: (root.className||'').slice(0,80),
    btnCount: btns.length,
    sample,
    txt: (root.innerText||'').slice(0,900),
    // 顺便抓 body 里所有 button 的可见文本(确认 46 个 button 是什么)
    allBtnTexts: Array.from(document.querySelectorAll('button')).map(b=>(b.innerText||'').trim().slice(0,20)).filter(Boolean).slice(0,20)
  };
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
        time.sleep(3.0)
        d = pg.evaluate(DUMP)
        d["errors"] = errs[:10]
        out[slug] = d
        ctx.close()
    b.close()

json.dump(out, open(os.path.join(OUT,"_dom2.json"),"w",encoding="utf-8"), ensure_ascii=False, indent=2)
for slug,d in out.items():
    print(f"\n##### {slug} #####")
    print(f"  ecCls={d['ecCls']} | root={d['rootTag']}#{d['rootId']}.{d['rootCls'][:40]} btnCount={d['btnCount']}")
    print(f"  txt[:300]={(d['txt'] or '').replace(chr(10),' ')[:300]}")
    print(f"  sample[:5]={json.dumps(d['sample'][:5], ensure_ascii=False)}")
    print(f"  allBtnTexts[:12]={d['allBtnTexts'][:12]}")
    print(f"  errors={d['errors'][:3]}")
