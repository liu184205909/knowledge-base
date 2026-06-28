# -*- coding: utf-8 -*-
"""诊断 goearthward.com/tools/moon-calendar/ 空白渲染问题"""
import json
from playwright.sync_api import sync_playwright

URL = "https://goearthward.com/tools/moon-calendar/"
DIVS = ["emc-current", "emc-today", "emc-next", "emc-phases"]

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={"width": 1920, "height": 1080})
    page = context.new_page()

    console_msgs = []
    errors = []
    pageerrors = []
    request_fails = []

    def on_console(msg):
        console_msgs.append({"type": msg.type, "text": msg.text})
        if msg.type in ("error", "warning"):
            errors.append({"type": msg.type, "text": msg.text})

    def on_pageerror(err):
        pageerrors.append({"name": err.name, "message": err.message, "stack": err.stack})

    def on_request_failed(req):
        request_fails.append({"url": req.url, "failure": req.failure})

    page.on("console", on_console)
    page.on("pageerror", on_pageerror)
    page.on("requestfailed", on_request_failed)

    # 监听 SunCalc 请求是否成功
    suncalc_responses = []

    def on_response(resp):
        if "suncalc" in resp.url.lower():
            suncalc_responses.append({"url": resp.url, "status": resp.status})

    page.on("response", on_response)

    print("==> goto URL")
    try:
        page.goto(URL, wait_until="networkidle", timeout=60000)
    except Exception as e:
        print("goto error:", e)

    # 等渲染
    try:
        page.wait_for_timeout(4000)
    except Exception:
        pass

    # ===== 1. JS 全局状态 =====
    js_state = page.evaluate("""() => {
        const out = {};
        out.windowKeys = Object.keys(window).filter(k => k.startsWith('EM') || k === 'SunCalc' || k === 'DC' || k === 'P' || k === 'EWMoon');
        out.typeofSunCalc = typeof window.SunCalc;
        out.typeofEWMoon = typeof window.EWMoon;
        if (window.EWMoon) {
            out.ewmoonKeys = Object.keys(window.EWMoon);
            out.ewmoonType = Array.isArray(window.EWMoon) ? 'array' : typeof window.EWMoon;
        }
        out.typeofDC = typeof window.DC;
        out.typeofP = typeof window.P;
        if (Array.isArray(window.DC)) out.dcLength = window.DC.length;
        if (Array.isArray(window.P)) out.pLength = window.P.length;
        // 尝试取 DC 第一个条目结构
        try {
            if (window.DC && window.DC[0]) out.dcSampleKeys = Object.keys(window.DC[0]);
        } catch(e) { out.dcSampleErr = String(e); }
        return out;
    }""")
    print("\n===== JS GLOBAL STATE =====")
    print(json.dumps(js_state, ensure_ascii=False, indent=2))

    # ===== 2. DOM div innerHTML 长度 =====
    dom_state = page.evaluate("""(ids) => {
        const out = {};
        for (const id of ids) {
            const el = document.getElementById(id);
            if (!el) {
                out[id] = { exists: false };
            } else {
                out[id] = {
                    exists: true,
                    innerHTML_length: el.innerHTML.length,
                    textContent_length: (el.textContent || '').trim().length,
                    innerText_preview: (el.innerText || '').slice(0, 120),
                };
            }
        }
        return out;
    }""", DIVS)
    print("\n===== DOM DIV STATE =====")
    print(json.dumps(dom_state, ensure_ascii=False, indent=2))

    # ===== 3. SunCalc 网络 =====
    print("\n===== SUNCALC RESPONSES =====")
    print(json.dumps(suncalc_responses, ensure_ascii=False, indent=2) or "no suncalc responses captured")

    # ===== 4. 请求失败 =====
    print("\n===== FAILED REQUESTS =====")
    print(json.dumps(request_fails, ensure_ascii=False, indent=2) or "none")

    # ===== 5. console errors / warnings =====
    print("\n===== CONSOLE ERRORS / WARNINGS =====")
    print(json.dumps(errors, ensure_ascii=False, indent=2) or "none")

    # ===== 6. pageerror (未捕获异常) =====
    print("\n===== UNCAUGHT PAGE ERRORS =====")
    print(json.dumps(pageerrors, ensure_ascii=False, indent=2) or "none")

    # ===== 7. 所有 console messages（type+text 前 150 字）=====
    print("\n===== ALL CONSOLE MESSAGES =====")
    for m in console_msgs:
        t = (m["text"] or "")[:150].replace("\n", " ")
        print(f"[{m['type']}] {t}")

    # 截图存证
    page.screenshot(path="D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/moon_calendar_diag.png", full_page=False)
    print("\nScreenshot saved.")

    browser.close()
