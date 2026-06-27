# -*- coding: utf-8 -*-
"""精确交互验证:点选项->推进->结果;测量工具区字体/触控/溢出"""
import json, os, time
from playwright.sync_api import sync_playwright

TOOLS = [
    ("chakra-test",       "https://goearthward.com/tools/chakra-test/"),
    ("element-test",      "https://goearthward.com/tools/element-test/"),
    ("crystal-quiz",      "https://goearthward.com/tools/crystal-quiz/"),
    ("cleansing-timer",   "https://goearthward.com/tools/crystal-cleansing-timer/"),
    ("birthstone-finder", "https://goearthward.com/tools/birthstone-finder/"),
]

# 定位工具根:body 内含特定选项 button 文本的最小公共祖先
LOCATE = r"""
() => {
  // 收集工具特有 button
  const all = Array.from(document.querySelectorAll('button'));
  const toolBtns = all.filter(b => {
    const t=(b.innerText||'').trim().toUpperCase();
    return ['RARELY','SOMETIMES','OFTEN','NOT REALLY','SOMEWHAT','YES, EXACTLY','SEARCH','START','NEXT','SUBMIT','GET RESULT','FIND MY','SHOW'].some(k=>t.includes(k)) && t.length<40;
  });
  // 找这些 button 的最近共同祖先(往上走)
  if (!toolBtns.length) return {found:false, totalBtn: all.length};
  // 取第一个工具 button 的祖先链,找一个像容器的(id 含关键词 或 class 含 tool/quiz 等)
  let node = toolBtns[0];
  let container = null;
  for (let i=0;i<12 && node; i++){
    node = node.parentElement;
    if (!node) break;
    const id=(node.id||'').toLowerCase();
    const cls=(node.className||'').toString().toLowerCase();
    if (/tool|quiz|chakra|element|cleans|birth|app|root|widget|finder/.test(id+cls) && node.querySelectorAll('button').length>=3){
      container = node; break;
    }
  }
  if (!container) container = toolBtns[0].closest('div');
  return {
    found:true,
    totalBtn: all.length,
    toolBtnCount: toolBtns.length,
    containerTag: container.tagName,
    containerId: container.id,
    containerCls: (container.className||'').toString().slice(0,100),
    containerRect: (()=>{const r=container.getBoundingClientRect();return{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}})(),
    containerTxt: (container.innerText||'').slice(0,500)
  };
}
"""

# 测量工具区内所有可点元素的触控尺寸 + 字体
MEASURE = r"""
() => {
  const all = Array.from(document.querySelectorAll('button, [role="button"], input[type="radio"], label, select, a'));
  const touch = [];
  for (const b of all){
    const t=(b.innerText||b.getAttribute('aria-label')||b.value||'').trim();
    if (!t || t.length>50) continue;
    const r=b.getBoundingClientRect();
    if (r.width<5 || r.height<5) continue;
    const cs=getComputedStyle(b);
    touch.push({txt:t.slice(0,25), w:Math.round(r.width), h:Math.round(r.height), fs:Math.round(parseFloat(cs.fontSize)), tag:b.tagName});
  }
  // 找最小触控
  const minH = touch.length? Math.min(...touch.map(t=>t.h)) : null;
  const undersized = touch.filter(t=>t.h<44 || t.w<44).slice(0,15);
  return {count:touch.length, minH, undersized, all:touch.slice(0,8)};
}
"""

OUT = r"D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/screenshots/tools-mobile"

def click_through(page, slug):
    """模拟完整答题流,返回每步后页面变化"""
    steps = []
    if slug in ("chakra-test","element-test"):
        # 多题,点 OFTEN 推进
        for i in range(8):
            btns = page.query_selector_all("button")
            often = [b for b in btns if (b.inner_text() or "").strip().upper()=="OFTEN"]
            if not often: break
            before = page.evaluate("document.body.innerText.length")
            try: often[0].click(); time.sleep(0.6)
            except: break
            after = page.evaluate("document.body.innerText.length")
            steps.append({"step":i,"clicked":"OFTEN","delta":after-before})
        # 看是否出结果
        res = page.evaluate("()=>{const t=document.body.innerText; return {hasResult:/result|your|chakra|element|dominant|recommend/i.test(t), tail:t.slice(-400)}}")
        steps.append({"final":res})
    elif slug=="crystal-quiz":
        for i in range(10):
            btns = page.query_selector_all("button")
            yes = [b for b in btns if "EXACTLY" in (b.inner_text() or "").upper()]
            if not yes: break
            before = page.evaluate("document.body.innerText.length")
            try: yes[0].click(); time.sleep(0.6)
            except: break
            after = page.evaluate("document.body.innerText.length")
            steps.append({"step":i,"clicked":"YES","delta":after-before})
        res = page.evaluate("()=>{const t=document.body.innerText; return {hasResult:/result|recommend|your perfect|crystal|match/i.test(t), tail:t.slice(-400)}}")
        steps.append({"final":res})
    elif slug=="cleansing-timer":
        # 输入搜索 + 选方式 + 启动
        acted = page.evaluate("""()=>{
          const inp=document.querySelector('input[type="text"], input[type="search"]');
          let log=[];
          if(inp){try{inp.value='selenite';inp.dispatchEvent(new Event('input',{bubbles:true}));log.push('typed selenite');}catch(e){}}
          // 找方式按钮/卡片
          const cards=Array.from(document.querySelectorAll('button, [role="button"], .card, [class*="method"]')).slice(0,5).map(c=>(c.innerText||'').slice(0,20));
          return {log, hasInput:!!inp, sampleCards:cards};
        }""")
        steps.append({"action":"search", **acted})
    elif slug=="birthstone-finder":
        acted = page.evaluate("""()=>{
          const sels=document.querySelectorAll('select');
          const cards=document.querySelectorAll('[class*="month"], [class*="birthstone"], .card, button');
          return {selectCount:sels.length, cardOrButtonCount:cards.length, sample:Array.from(cards).slice(0,8).map(c=>(c.innerText||'').trim().slice(0,20))};
        }""")
        steps.append({"action":"inspect", **acted})
    return steps

with sync_playwright() as p:
    b = p.chromium.launch()
    out = {}
    for slug, url in TOOLS:
        out[slug] = {}
        for vn, w, h in [("mobile",375,812),("tablet",768,1024)]:
            ctx = b.new_context(viewport={"width":w,"height":h}, is_mobile=(vn=="mobile"), has_touch=(vn=="mobile"))
            pg = ctx.new_page()
            errs=[]
            pg.on("console", lambda m: errs.append(f"[{m.type}]{m.text}") if m.type=="error" else None)
            pg.on("pageerror", lambda e: errs.append(f"[pageerror]{e}"))
            try: pg.goto(url, wait_until="networkidle", timeout=45000)
            except Exception as e: errs.append(f"goto:{e}")
            time.sleep(3.0)
            loc = pg.evaluate(LOCATE)
            measure = pg.evaluate(MEASURE)
            interact = click_through(pg, slug)
            shot = os.path.join(OUT, f"{slug}-{vn}-interact.png")
            try: pg.screenshot(path=shot, full_page=False)
            except Exception as e: errs.append(f"shot:{e}")
            out[slug][vn] = {"locate":loc,"measure":measure,"interact":interact,"errors":errs[:8],"shot":shot}
            ctx.close()
    b.close()

json.dump(out, open(os.path.join(OUT,"_interact.json"),"w",encoding="utf-8"), ensure_ascii=False, indent=2)
for slug in TOOLS:
    s=slug[0]
    print(f"\n########## {s} ##########")
    for vn in ["mobile","tablet"]:
        d=out[s][vn]
        loc=d["locate"]; m=d["measure"]
        print(f"  [{vn}] container={loc.get('containerTag')}#{loc.get('containerId')}.{(loc.get('containerCls') or '')[:30]} found={loc.get('found')} toolBtn={loc.get('toolBtnCount')} rect={loc.get('containerRect')}")
        print(f"       touchCount={m.get('count')} minH={m.get('minH')} undersized={len(m.get('undersized',[]))}")
        if m.get('undersized'): print(f"       undersizedSample={json.dumps(m['undersized'][:4], ensure_ascii=False)}")
        it=d["interact"]
        # 打印交互结果摘要
        if it and isinstance(it[-1],dict) and "final" in it[-1]:
            f=it[-1]["final"]; print(f"       interactSteps={len(it)-1} hasResult={f.get('hasResult')} tail[:120]={(f.get('tail') or '').replace(chr(10),' ')[:120]}")
        elif it:
            print(f"       interact={json.dumps(it, ensure_ascii=False)[:300]}")
        er=[e for e in d["errors"] if "error" in e.lower()]
        print(f"       errors={len(er)} {er[:2]}")
