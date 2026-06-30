# -*- coding: utf-8 -*-
"""补抓：用从首页 nav 提取的正确路径，抓取那些 404/timeout 的牌阵页 + 深度牌阵页
经代理 http://127.0.0.1:10808
"""
import asyncio, json, os
from playwright.async_api import async_playwright

PROXY = "http://127.0.0.1:10808"
BASE = os.path.dirname(os.path.abspath(__file__)).replace("\\","/")

# 补抓目标（基于已抓 home 的 nav 提取的正确 URL）
FIXES = {
    "tarotgoddess": [
        ("readings-index", "https://tarotgoddess.com/readings.html"),
        ("tarot-index",    "https://tarotgoddess.com/tarot/"),
        ("ppf",            "https://tarotgoddess.com/tarot/ppf.html"),       # past-present-future 三牌阵
        ("yesno",          "https://tarotgoddess.com/tarot/yesno.html"),
        ("multicard",      "https://tarotgoddess.com/multicard.html"),
        ("oraclereadings", "https://tarotgoddess.com/oraclereadings.html"),
        ("tarotscope",     "https://tarotgoddess.com/tarotscope/"),
        ("philosophy",     "https://tarotgoddess.com/philosophy.html"),
    ],
    "7tarot": [
        ("daily-tarot",    "https://www.7tarot.com/daily-tarot/"),
        ("yes-no",         "https://www.7tarot.com/yes-no/"),
        ("love-tarot",     "https://www.7tarot.com/love-tarot/"),
        ("egyptian",       "https://www.7tarot.com/egyptian-tarot/"),
        ("psychic",        "https://www.7tarot.com/psychic-reading/"),
        ("moon-reading",   "https://www.7tarot.com/moon-reading/"),
        ("angel-oracle",   "https://www.7tarot.com/angel-oracle/"),
        ("cartomancy",     "https://www.7tarot.com/cartomancy/"),
        ("card-major",     "https://www.7tarot.com/card/major-arcana.htm"),
    ],
    "micheleknight": [
        ("three-card",     "https://micheleknight.com/free-readings/three-card-tarot-reading/"),
        ("celtic-cross",   "https://micheleknight.com/free-readings/celtic-cross-tarot-reading/"),
        ("audio-celtic",   "https://micheleknight.com/free-readings/audio-celtic-cross-tarot-reading/"),
        ("soulmate",       "https://micheleknight.com/free-readings/soulmate-compatibility-report/"),
        ("goddess",        "https://micheleknight.com/free-readings/goddess-reading/"),
        ("runes",          "https://micheleknight.com/free-readings/runes/"),
        ("yearly",         "https://micheleknight.com/free-readings/yearly-forecast/"),
    ],
}

CAPTURE_ALL = True  # 补抓的都存 body_text

JS_HEADINGS = "() => Array.from(document.querySelectorAll('h1,h2')).map(e=>e.tagName+': '+e.innerText.trim()).slice(0,40)"
JS_NAV = """() => Array.from(document.querySelectorAll('nav a, header a, .nav a, .menu a, [class*=nav] a, [class*=menu] a')).map(a=>((a.innerText||'').trim()+' | '+(a.getAttribute('href')||''))).filter(x=>x.length>3).slice(0,60)"""
JS_CTA = """() => Array.from(document.querySelectorAll('button,a')).map(e=>{const t=(e.innerText||'').trim(); if(t.length<2||t.length>60) return null; if(/get|start|try|sign|premium|upgrade|pro|pay|chat|draw|reading|begin|read|free|buy|order|subscribe|reveal|shuffle|deal|consult|psychic|now|cut|mix|pick|choose|tap|click/i.test(t)) return t+' | '+(e.tagName==='A'?(e.getAttribute('href')||''):'BTN'); return null}).filter(Boolean).slice(0,50)"""
JS_LINKS = """() => Array.from(document.querySelectorAll('a')).map(a=>(a.getAttribute('href')||'')).filter(h=>h&&!h.startsWith('#')&&!h.startsWith('javascript')).map(h=>{try{return new URL(h, location.href).href}catch(e){return h}}).slice(0,300)"""
JS_BODY = "() => document.body.innerText.slice(0,9000)"

async def grab_one(page, site, name, url):
    out_dir = f"{BASE}/{site}"
    ss_dir = f"{out_dir}/screenshots"
    os.makedirs(ss_dir, exist_ok=True)
    print(f"[{site}/{name}] {url}", flush=True)
    rec = {"site": site, "name": name, "url": url}
    try:
        try:
            await page.goto(url, wait_until="networkidle", timeout=40000)
        except Exception:
            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=25000)
            except Exception as e:
                rec["error"] = f"goto fail: {e}"
                print(f"  GOTO FAIL: {e}", flush=True)
                return rec
        await page.wait_for_timeout(2500)
        await page.screenshot(path=f"{ss_dir}/{name}.desktop.png", full_page=True)
        rec["title"] = await page.title()
        rec["headings"] = await page.evaluate(JS_HEADINGS)
        rec["nav"] = await page.evaluate(JS_NAV)
        rec["ctas"] = await page.evaluate(JS_CTA)
        rec["links"] = await page.evaluate(JS_LINKS)
        if CAPTURE_ALL:
            rec["body_text"] = await page.evaluate(JS_BODY)
        print(f"  OK '{rec.get('title','')[:55]}'", flush=True)
    except Exception as e:
        rec["error"] = str(e)
        print(f"  ERR: {e}", flush=True)
    return rec

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, proxy={"server": PROXY})
        for site, targets in FIXES.items():
            out_dir = f"{BASE}/{site}"
            # 读已有 structure.json 追加
            existing = []
            ep = f"{out_dir}/data/structure.json"
            if os.path.exists(ep):
                try: existing = json.load(open(ep,encoding="utf-8"))
                except: existing = []
            ctx = await browser.new_context(viewport={"width":1440,"height":900}, locale="en-US", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36")
            page = await ctx.new_page()
            new_recs = []
            for name, url in targets:
                r = await grab_one(page, site, name, url)
                new_recs.append(r)
                await asyncio.sleep(1.5)
            await ctx.close()
            # 合并：去重（按 name 优先新）
            by_name = {r["name"]: r for r in existing}
            for r in new_recs:
                by_name[r["name"]] = r
            merged = list(by_name.values())
            with open(ep,"w",encoding="utf-8") as f:
                json.dump(merged, f, ensure_ascii=False, indent=2)
            with open(f"{out_dir}/data/structure_readable.txt","w",encoding="utf-8") as f:
                for r in merged:
                    f.write("="*70+"\n")
                    f.write(f"[{r['name']}] {r['url']}\n")
                    f.write(f"TITLE: {r.get('title','')}\n")
                    if r.get("error"): f.write(f"ERROR: {r['error']}\n")
                    f.write("HEADINGS:\n  " + "\n  ".join(r.get("headings",[])) + "\n")
                    f.write("NAV:\n  " + "\n  ".join(r.get("nav",[])) + "\n")
                    f.write("CTAS:\n  " + "\n  ".join(r.get("ctas",[])) + "\n")
                    if r.get("body_text"):
                        f.write("BODY(excerpt):\n" + r["body_text"] + "\n")
                    f.write("\n")
            print(f">>> DONE {site} (+{len(new_recs)})", flush=True)
        await browser.close()

asyncio.run(main())
print("ALL FIX DONE", flush=True)
