# -*- coding: utf-8 -*-
"""tarotap.com 全功能 Playwright 截图（桌面+移动端，经代理）"""
import asyncio, json, os
from playwright.async_api import async_playwright

PROXY = "http://127.0.0.1:10808"
OUT = os.path.dirname(os.path.abspath(__file__)).replace("\\","/") + "/screenshots"
os.makedirs(OUT, exist_ok=True)

# 核心功能页（英文默认站，最完整）
TARGETS = [
    ("home",            "https://tarotap.com/"),
    ("yes-or-no",       "https://tarotap.com/yes-or-no-tarot"),
    ("love-tarot",      "https://tarotap.com/love-tarot"),
    ("draw-cards",      "https://tarotap.com/draw-cards"),
    ("oracle-cards",    "https://tarotap.com/oracle-cards"),
    ("manifestation",   "https://tarotap.com/tarot-manifestation"),
    ("birth-card",      "https://tarotap.com/en/tarot-birth-card-calculator"),
    ("psychic",         "https://tarotap.com/en/psychic"),
    ("spread-2opt",     "https://tarotap.com/tarot-spread/two-options-spread"),
    ("spread-3opt",     "https://tarotap.com/tarot-spread/three-options-spread"),
    ("spread-celtic",   "https://tarotap.com/tarot-spread/celtic-cross-spread"),
    ("fortune-daily",   "https://tarotap.com/fortune/daily"),
    ("fortune-monthly", "https://tarotap.com/fortune/monthly"),
    ("fortune-yearly",  "https://tarotap.com/fortune/yearly"),
    ("fortune-seasonal","https://tarotap.com/fortune/seasonal"),
    ("pricing",         "https://tarotap.com/pricing"),
    ("blog-index",      "https://tarotap.com/blog"),
    ("zh-home",         "https://tarotap.com/zh"),
    ("zh-yes-no",       "https://tarotap.com/zh/yes-or-no-tarot"),
]

# 同时抓取关键页面的 HTML/文本，便于拆解
CAPTURE_TEXT = {"home","yes-or-no","psychic","spread-celtic","fortune-daily","pricing"}

async def grab(page, name, url):
    print(f"[{name}] {url}")
    try:
        await page.goto(url, wait_until="networkidle", timeout=45000)
    except Exception as e:
        print(f"  goto warn: {e}")
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        except Exception as e2:
            print(f"  goto fail: {e2}")
            return None
    await page.wait_for_timeout(2500)
    await page.screenshot(path=f"{OUT}/{name}.desktop.png", full_page=True)
    title = await page.title()
    h1s = await page.evaluate("() => Array.from(document.querySelectorAll('h1,h2')).map(e=>e.tagName+': '+e.innerText.trim()).slice(0,30)")
    nav = await page.evaluate("() => Array.from(document.querySelectorAll('nav a, header a')).map(a=>a.innerText.trim()+': '+a.href).slice(0,40)")
    cta = await page.evaluate("() => Array.from(document.querySelectorAll('button,a')).filter(e=>{const t=e.innerText||'';return /get|start|try|sign|premium|upgrade|pro|pay|chat|draw|reading|begin/i.test(t)}).map(e=>(e.innerText||'').trim()+' | '+(e.tagName==='A'?e.href:'')).slice(0,30)")
    text = ""
    if name in CAPTURE_TEXT:
        text = await page.evaluate("() => document.body.innerText.slice(0,8000)")
    meta = {
        "name": name, "url": url, "title": title,
        "headings": h1s, "nav": nav, "ctas": cta,
    }
    if text:
        meta["body_text"] = text
    return meta

async def main():
    results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, proxy={"server": PROXY})
        # 桌面
        ctx_d = await browser.new_context(viewport={"width":1440,"height":900}, locale="en-US")
        page_d = await ctx_d.new_page()
        for name, url in TARGETS:
            r = await grab(page_d, name, url)
            if r: results.append(r)
        await ctx_d.close()
        # 移动端（只关键页）
        ctx_m = await browser.new_context(viewport={"width":390,"height":844}, locale="en-US", is_mobile=True, has_touch=True)
        page_m = await ctx_m.new_page()
        mobile_targets = [
            ("home","https://tarotap.com/"),
            ("yes-or-no","https://tarotap.com/yes-or-no-tarot"),
            ("psychic","https://tarotap.com/en/psychic"),
            ("spread-celtic","https://tarotap.com/tarot-spread/celtic-cross-spread"),
            ("pricing","https://tarotap.com/pricing"),
        ]
        for name, url in mobile_targets:
            try:
                await page_m.goto(url, wait_until="domcontentloaded", timeout=30000)
                await page_m.wait_for_timeout(2000)
                await page_m.screenshot(path=f"{OUT}/{name}.mobile.png", full_page=True)
                print(f"[m:{name}] done")
            except Exception as e:
                print(f"[m:{name}] fail: {e}")
        await ctx_m.close()
        await browser.close()
    with open(OUT+"/../data/structure.json","w",encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"DONE: {len(results)} 桌面页抓取完成")

asyncio.run(main())
