# -*- coding: utf-8 -*-
"""抓取 5 工具页移动端的工具容器 DOM 结构,确认 JS 是否渲染出交互内容"""
import json, os, time
from playwright.sync_api import sync_playwright

TOOLS = [
    ("chakra-test",          "https://goearthward.com/tools/chakra-test/"),
    ("element-test",         "https://goearthward.com/tools/element-test/"),
    ("crystal-quiz",         "https://goearthward.com/tools/crystal-quiz/"),
    ("cleansing-timer",      "https://goearthward.com/tools/crystal-cleansing-timer/"),
    ("birthstone-finder",    "https://goearthward.com/tools/birthstone-finder/"),
]

# 找工具根:优先 id 含 tool/quiz/chakra,或 div 内含大量 button 的
FIND_ROOT = r"""
() => {
  // 1. 找 wp:html 嵌入的工具容器(通常 id 或 class 含关键词,或在 entry-content 内的 div)
  const candidates = document.querySelectorAll('div[id], section[id], [id*="tool"], [id*="quiz"], [id*="chakra"], [id*="element"], [id*="cleans"], [id*="birthstone"], [id*="app"], [id*="root"]');
  let best = null;
  // 2. 退而求其次:找 entry-content 内 button 最多的容器
  const ec = document.querySelector('.entry-content, .wd-entry-content, main, article');
  const roots = [];
  if (ec) {
    ec.querySelectorAll('div').forEach(d => {
      const b = d.querySelectorAll('button').length;
      if (b >= 2) roots.push({el: d, btn: b});
    });
  }
  roots.sort((a,b)=>b.btn-a.btn);
  const top = roots.slice(0,3).map(r => ({btn:r.btn, tag:r.el.tagName, id:r.el.id, cls:(r.el.className||'').slice(0,80), html:r.el.outerHTML.slice(0,600)}));
  // 也抓所有 id/class 含关键词的
  const idd = Array.from(candidates).map(c => ({tag:c.tagName, id:c.id, cls:(c.className||'').slice(0,60)})).slice(0,15);
  return {top, idd, ecFound: !!ec, totalButtons: document.querySelectorAll('button').length};
}
"""

# 抓工具根容器 + 触发交互前后对比
DEEP = r"""
(rootSel) => {
  // rootSel 形如 '#quiz-app' 或 '.entry-content'
  const root = document.querySelector(rootSel) || document.querySelector('.entry-content, main');
  if (!root) return {err:'no root'};
  const btns = Array.from(root.querySelectorAll('button, [role="button"], label, input[type="radio"], select'));
  const sample = btns.slice(0,40).map(b => ({
    tag: b.tagName,
    txt: (b.innerText||b.getAttribute('aria-label')||b.value||'').trim().slice(0,50),
    cls: (b.className||'').slice(0,50),
    rect: (()=>{const r=b.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height)}})()
  }));
  // 全部可见文本前 500 字
  const txt = (root.innerText||'').slice(0,800);
  return {btnCount: btns.length, sample, txt};
}
"""

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
        # 用 top 容器或 entry-content 深抓
        rootSel = None
        for t in find.get("top",[]):
            if t.get("id"): rootSel = "#"+t["id"]; break
        if not rootSel and find.get("idd"):
            for i in find["idd"]:
                if i.get("id"): rootSel="#"+i["id"]; break
        deep = pg.evaluate(DEEP, rootSel or ".entry-content") if rootSel or True else {}
        # 截工具区
        out[slug] = {"find": find, "deep": deep, "errors": errs[:10]}
        ctx.close()
    b.close()

json.dump(out, open(r"D:\Code\knowledge-base\01-AI营销\04-选品库\C端\01-疗愈水晶\02-网站规划\screenshots\tools-mobile\_dom.json","w",encoding="utf-8"), ensure_ascii=False, indent=2)
for slug,d in out.items():
    print(f"\n##### {slug} #####")
    print("  find.top[0]:", json.dumps(d["find"].get("top",[{}])[0] if d["find"].get("top") else {}, ensure_ascii=False)[:200])
    print("  deep.btnCount:", d["deep"].get("btnCount"))
    print("  deep.txt[:300]:", (d["deep"].get("txt","") or "")[:300])
    print("  deep.sample[:5]:", json.dumps(d["deep"].get("sample",[])[:5], ensure_ascii=False))
    print("  errors:", d["errors"][:3])
