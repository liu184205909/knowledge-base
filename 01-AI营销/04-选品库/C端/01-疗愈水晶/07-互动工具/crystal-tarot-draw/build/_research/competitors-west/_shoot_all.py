# -*- coding: utf-8 -*-
"""西方塔罗竞品统一抓取（首页+工具入口+牌阵页），经代理 http://127.0.0.1:10808
每家：截图(桌面) + 提取 headings/nav/ctas/body_text/links → data/structure.json
"""
import asyncio, json, os, sys
from playwright.async_api import async_playwright

PROXY = "http://127.0.0.1:10808"
BASE = os.path.dirname(os.path.abspath(__file__)).replace("\\","/")

# 每家：key -> (子目录名, [(页面名, URL), ...])
SITES = {
    "free-tarot-reading-net": [
        ("home",          "https://www.free-tarot-reading.net/"),
        ("free",          "https://www.free-tarot-reading.net/free"),
        ("readings",      "https://www.free-tarot-reading.net/readings"),
        ("live-readings", "https://www.free-tarot-reading.net/live-readings"),
        ("card-meanings", "https://www.free-tarot-reading.net/card-meanings"),
        ("meaning-fool",  "https://www.free-tarot-reading.net/card-meanings?slug=the-fool"),
        ("learn-tarot",   "https://www.free-tarot-reading.net/learn-tarot"),
        ("numerology",    "https://www.free-tarot-reading.net/numerology"),
        ("membership",    "https://www.free-tarot-reading.net/membership"),
    ],
    "llewellyn": [
        ("home",          "https://www.llewellyn.com/"),
        ("tarot-reading", "https://www.llewellyn.com/tarot_reading.php"),
        ("horoscope",     "https://www.llewellyn.com/horoscope.asp"),
        ("encyclopedia",  "https://www.llewellyn.com/encyclopedia/"),
        ("journal",       "https://www.llewellyn.com/journal/"),
        ("shop-tarot",    "https://www.llewellyn.com/shop/search.php?search=tarot"),
    ],
    "evatarot": [
        ("home",          "https://www.evatarot.net/"),
        ("en-home",       "https://www.evatarot.net/en"),
        ("en-free",       "https://www.evatarot.net/en/free-tarot-reading"),
        ("en-celtic",     "https://www.evatarot.net/en/celtic-cross"),
        ("en-love",       "https://www.evatarot.net/en/love-tarot"),
        ("en-yesno",      "https://www.evatarot.net/en/yes-or-no"),
        ("en-card-day",   "https://www.evatarot.net/en/card-of-the-day"),
    ],
    "tellmytarot": [
        ("home",          "https://www.tellmytarot.com/"),
    ],
    "tarotgoddess": [
        ("home",          "https://tarotgoddess.com/"),
        ("daily-card",    "https://tarotgoddess.com/dailytarot.html"),
        ("three-card",    "https://tarotgoddess.com/threecard.html"),
        ("celtic",        "https://tarotgoddess.com/celticcross.html"),
        ("yesno",         "https://tarotgoddess.com/yesno.html"),
        ("single",        "https://tarotgoddess.com/singlecard.html"),
        ("lovescopes",    "https://tarotgoddess.com/lovescopes.html"),
    ],
    "micheleknight": [
        ("home",          "https://www.micheleknight.com/"),
        ("tarot",         "https://www.micheleknight.com/tarot/"),
        ("single-card",   "https://www.micheleknight.com/tarot/single-card-tarot-reading/"),
        ("free-readings", "https://www.micheleknight.com/free-readings/"),
        ("tools",         "https://www.micheleknight.com/tools/"),
    ],
    "7tarot": [
        ("home",          "https://www.7tarot.com/"),
        ("en-home",       "https://www.7tarot.com/en"),
    ],
    "trustedtarot": [
        ("home",          "https://www.trustedtarot.com/"),
        ("free-reading",  "https://www.trustedtarot.com/free-reading/"),
        ("card-meanings", "https://www.trustedtarot.com/card-meanings/"),
        ("spreads",       "https://www.trustedtarot.com/spreads/"),
    ],
    "tarot-com": [
        ("home",          "https://www.tarot.com/"),
        ("tarot-hub",     "https://www.tarot.com/tarot"),
        ("daily-card",    "https://www.tarot.com/daily-tarot-card"),
        ("horoscope",     "https://www.tarot.com/horoscopes"),
        ("guides",        "https://www.tarot.com/guides"),
    ],
    "tarotoo": [
        ("home",          "https://tarotoo.com/"),
        ("free-tarot",    "https://tarotoo.com/en/free-tarot"),
        ("yes-no",        "https://tarotoo.com/en/yes-no"),
        ("love",          "https://tarotoo.com/en/love-tarot"),
        ("daily-card",    "https://tarotoo.com/en/card-of-the-day"),
        ("ai-tarot",      "https://tarotoo.com/en/ai-tarot"),
        ("pricing",       "https://tarotoo.com/en/pricing"),
    ],
    "ifate": [
        ("home",          "https://www.ifate.com/"),
        ("tarot",         "https://www.ifate.com/tarot"),
        ("tarot-reading", "https://www.ifate.com/tarot-reading"),
        ("daily-card",    "https://www.ifate.com/daily-tarot"),
        ("love",          "https://www.ifate.com/love-tarot"),
        ("yes-no",        "https://www.ifate.com/yes-no-tarot"),
        ("learn",         "https://www.ifate.com/learn-tarot"),
    ],
}

# 抓 body_text 的关键页（用于深度拆解牌阵/解读/变现文案）
CAPTURE_TEXT = {
    "free-tarot-reading-net": {"free","readings","card-meanings","meaning-fool","membership"},
    "evatarot": {"en-home","en-free","en-celtic"},
    "tarotgoddess": {"home","daily-card","three-card"},
    "trustedtarot": {"home","free-reading"},
    "tarotoo": {"home","free-tarot","ai-tarot","pricing"},
    "ifate": {"home","tarot","tarot-reading"},
    "tarot-com": {"home","tarot-hub"},
    "micheleknight": {"home","tarot","single-card"},
}

JS_HEADINGS = "() => Array.from(document.querySelectorAll('h1,h2')).map(e=>e.tagName+': '+e.innerText.trim()).slice(0,40)"
JS_NAV = """() => Array.from(document.querySelectorAll('nav a, header a, .nav a, .menu a, [class*=nav] a, [class*=menu] a')).map(a=>((a.innerText||'').trim()+' | '+(a.getAttribute('href')||''))).filter(x=>x.length>3).slice(0,60)"""
JS_CTA = """() => Array.from(document.querySelectorAll('button,a')).map(e=>{const t=(e.innerText||'').trim(); if(t.length<2||t.length>60) return null; if(/get|start|try|sign|premium|upgrade|pro|pay|chat|draw|reading|begin|read|free|buy|order|subscribe|reveal|shuffle|deal|consult|psychic|now/i.test(t)) return t+' | '+(e.tagName==='A'?(e.getAttribute('href')||''):'BTN'); return null}).filter(Boolean).slice(0,50)"""
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
            await page.goto(url, wait_until="networkidle", timeout=45000)
        except Exception:
            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            except Exception as e:
                rec["error"] = f"goto fail: {e}"
                print(f"  GOTO FAIL: {e}", flush=True)
                return rec
        await page.wait_for_timeout(2800)
        await page.screenshot(path=f"{ss_dir}/{name}.desktop.png", full_page=True)
        rec["title"] = await page.title()
        rec["headings"] = await page.evaluate(JS_HEADINGS)
        rec["nav"] = await page.evaluate(JS_NAV)
        rec["ctas"] = await page.evaluate(JS_CTA)
        rec["links"] = await page.evaluate(JS_LINKS)
        if site in CAPTURE_TEXT and name in CAPTURE_TEXT[site]:
            rec["body_text"] = await page.evaluate(JS_BODY)
        print(f"  OK title='{rec.get('title','')[:60]}' links={len(rec.get('links',[]))}", flush=True)
    except Exception as e:
        rec["error"] = str(e)
        print(f"  ERR: {e}", flush=True)
    return rec

async def run_site(browser, site, targets):
    out_dir = f"{BASE}/{site}"
    os.makedirs(f"{out_dir}/data", exist_ok=True)
    ctx = await browser.new_context(viewport={"width":1440,"height":900}, locale="en-US", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36")
    page = await ctx.new_page()
    results = []
    for name, url in targets:
        rec = await grab_one(page, site, name, url)
        results.append(rec)
        # llewellyn 有 crawl-delay 20s，礼貌限速；其他站 1.5s
        await asyncio.sleep(2.0 if "llewellyn" not in site else 3.0)
    await ctx.close()
    with open(f"{out_dir}/data/structure.json","w",encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    # 可读文本
    with open(f"{out_dir}/data/structure_readable.txt","w",encoding="utf-8") as f:
        for r in results:
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
    return site, len(results)

async def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    sites = {k:v for k,v in SITES.items() if (not only or k == only)}
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, proxy={"server": PROXY})
        for site, targets in sites.items():
            try:
                await run_site(browser, site, targets)
                print(f">>> DONE {site}", flush=True)
            except Exception as e:
                print(f">>> SITE FAIL {site}: {e}", flush=True)
        await browser.close()

asyncio.run(main())
print("ALL DONE", flush=True)
