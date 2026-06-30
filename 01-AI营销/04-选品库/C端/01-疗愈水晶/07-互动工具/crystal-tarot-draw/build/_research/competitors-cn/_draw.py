# -*- coding: utf-8 -*-
"""中文塔罗竞品抽牌流程截图脚本 (Python Playwright)
用法: python _draw.py <key>
中文站多直连，失败回退代理 http://127.0.0.1:10808
"""
import sys, os, json, time, re
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent
PROXY = "http://127.0.0.1:10808"

SITES = {
    "tarothall": {
        "name": "tarothall.com",
        "url": "https://tarothall.com/draw",
        "explore": ["https://tarothall.com/card/0", "https://tarothall.com/card/1"],
    },
    "ptaluo": {
        "name": "p.taluo.com",
        "url": "https://p.taluo.com/",
        "explore": ["https://p.taluo.com/1/", "https://p.taluo.com/3/", "https://p.taluo.com/seven/",
                    "https://p.taluo.com/love/", "https://p.taluo.com/career/"],
    },
    "cctarot": {
        "name": "cctarot.com",
        "url": "https://cctarot.com/divination/three-cards/",
        "explore": ["https://cctarot.com/divination/", "https://cctarot.com/divination/celtic-cross/",
                    "https://cctarot.com/divination/birthday/", "https://cctarot.com/"],
    },
    "xzw": {
        "name": "m.xzw.com",
        "url": "https://m.xzw.com/tarot/divine/",
        "explore": ["https://m.xzw.com/tarot/"],
    },
    "lovehealing": {
        "name": "love-healing.com",
        "url": "https://love-healing.com/Tarot.aspx",
        "explore": [],
    },
    "taroscope": {
        "name": "taroscope.ai",
        "url": "https://taroscope.ai/",
        "explore": [],
    },
    "cornerwonder": {
        "name": "tarot.cornerwonder.com",
        "url": "https://tarot.cornerwonder.com/",
        "explore": [],
    },
    "gomedia": {
        "name": "gomedia.asia",
        "url": "https://gomedia.asia/zh/free_tarot/",
        "explore": [],
    },
    "tarotmoons": {
        "name": "tarotmoons.com",
        "url": "https://tarotmoons.com/tarot",
        "explore": ["https://tarotmoons.com/spreads/three-card",
                    "https://tarotmoons.com/spreads/celtic-cross", "https://tarotmoons.com/masters",
                    "https://tarotmoons.com/yes-no-tarot", "https://tarotmoons.com/daily-tarot"],
    },
    "fortunetell": {
        "name": "fortunetell.ai",
        "url": "https://fortunetell.ai/fortune-tarot",
        "explore": ["https://fortunetell.ai/"],
    },
    "tarotmood": {
        "name": "tarotmood.com",
        "url": "https://tarotmood.com/spreads/three",
        "explore": ["https://tarotmood.com/spreads/celtic",
                    "https://tarotmood.com/spreads/love-relationship-status",
                    "https://tarotmood.com/spreads/five-elements"],
    },
    "jasiyu": {
        "name": "jasiyu.com",
        "url": "https://jasiyu.com/",
        "explore": [],
    },
}

CLICK_TEXTS = ["開始", "开始", "抽牌", "占卜", "洗牌", "切牌", "免费占卜", "開始占卜",
               "开始占卜", "抽取", "选牌", "選牌", "立即占卜", "免费抽牌", "免費抽牌", "塔羅", "塔罗"]

def slug(url):
    s = re.sub(r'^https?://', '', url)
    s = re.sub(r'[\/\?=&\.\:]', '-', s)
    s = re.sub(r'-+', '-', s).strip('-')
    return s[:60]

def grab_page(page, url, d, key, tag):
    """打开 url，截图首屏+全页，收集交互线索"""
    rec = {"url": url, "tag": tag, "ok": False}
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=25000)
    except Exception as e:
        rec["error"] = f"goto: {str(e)[:200]}"
        return rec
    try:
        page.wait_for_timeout(2200)
    except Exception:
        pass
    try:
        title = page.title()
    except Exception:
        title = ""
    rec["title"] = title
    # 截图
    safe_tag = re.sub(r'[^a-zA-Z0-9_-]', '', tag)[:40]
    try:
        vp = d / f"{key}--{safe_tag}--viewport.png"
        page.screenshot(path=str(vp))
        rec["viewport"] = vp.name
    except Exception as e:
        rec["vp_err"] = str(e)[:120]
    try:
        ff = d / f"{key}--{safe_tag}--full.png"
        page.screenshot(path=str(ff), full_page=True)
        rec["full"] = ff.name
    except Exception as e:
        rec["full_err"] = str(e)[:120]
    # 交互线索：按钮文字
    try:
        btns = page.evaluate("""() => {
            const els = [...document.querySelectorAll('a, button, [role=button], .btn, [class*=btn], [class*=Btn]')];
            const seen = new Set(); const out = [];
            for (const e of els) {
              const t = (e.innerText || e.textContent || '').replace(/\\s+/g,' ').trim();
              if (t && t.length > 0 && t.length < 20 && !seen.has(t)) { seen.add(t); out.push(t); }
              if (out.length >= 40) break;
            }
            return out;
        }""")
        rec["buttons"] = btns or []
    except Exception:
        rec["buttons"] = []
    # 页面文本摘要
    try:
        text = page.evaluate("() => (document.body.innerText||'').slice(0,2500)")
        rec["text"] = text
    except Exception:
        rec["text"] = ""
    rec["ok"] = True
    return rec

def try_click_draw(page, d, key):
    """尝试点击抽牌入口并截图"""
    clicked = None
    for t in CLICK_TEXTS:
        try:
            loc = page.get_by_text(t, exact=False).first
            if loc.count() > 0:
                loc.click(timeout=3500)
                clicked = t
                break
        except Exception:
            continue
    if clicked:
        try:
            page.wait_for_timeout(2800)
        except Exception:
            pass
        try:
            page.screenshot(path=str(d / f"{key}--after-click--viewport.png"))
            page.screenshot(path=str(d / f"{key}--after-click--full.png"), full_page=True)
        except Exception:
            pass
    return clicked

def run(key, use_proxy):
    cfg = SITES[key]
    d = OUT / key
    d.mkdir(parents=True, exist_ok=True)
    launch_kw = {"headless": True}
    if use_proxy:
        launch_kw["proxy"] = {"server": PROXY}
    result = {"key": key, "name": cfg["name"], "usedProxy": use_proxy, "main": None, "explore": [], "errors": []}
    with sync_playwright() as p:
        browser = p.chromium.launch(**launch_kw)
        ctx = browser.new_context(
            viewport={"width": 1440, "height": 900},
            locale="zh-CN",
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        )
        page = ctx.new_page()
        # 主 URL
        rec = grab_page(page, cfg["url"], d, key, "landing")
        result["main"] = rec
        if rec.get("ok"):
            clicked = try_click_draw(page, d, key)
            result["clicked"] = clicked
        # explore
        for ex in cfg.get("explore", []):
            r = grab_page(page, ex, d, key, slug(ex))
            result["explore"].append(r)
        browser.close()
    (d / "_result.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    return result

if __name__ == "__main__":
    key = sys.argv[1] if len(sys.argv) > 1 else None
    if not key or key not in SITES:
        print("keys:", ",".join(SITES.keys())); sys.exit(1)
    # 先直连
    try:
        res = run(key, use_proxy=False)
        if res["main"] and res["main"].get("ok"):
            print(json.dumps({"key": key, "ok": True, "pages": len(res["explore"]) + 1,
                              "clicked": res.get("clicked"), "usedProxy": False}, ensure_ascii=False))
        else:
            # 回退代理
            res2 = run(key, use_proxy=True)
            print(json.dumps({"key": key, "ok": res2["main"] and res2["main"].get("ok", False),
                              "pages": len(res2["explore"]) + 1, "clicked": res2.get("clicked"),
                              "usedProxy": True}, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({"key": key, "ok": False, "error": str(e)[:300]}, ensure_ascii=False))
