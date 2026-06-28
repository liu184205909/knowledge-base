# -*- coding: utf-8 -*-
"""定位 SyntaxError 来源:列出所有 script 标签 + 外部脚本加载状态"""
import json
from playwright.sync_api import sync_playwright

URL = "https://goearthward.com/tools/moon-calendar/"

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={"width": 1920, "height": 1080})
    page = context.new_page()

    external_loaded = {}
    def on_response(resp):
        u = resp.url
        if (u.endswith(".js") or "suncalc" in u.lower() or "/tools/" in u or "moon" in u.lower()) and resp.request.resource_type == "script":
            external_loaded[u] = resp.status
    page.on("response", on_response)

    page.goto(URL, wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(3000)

    # 列出所有 script 标签
    scripts = page.evaluate("""() => {
        const list = [];
        document.querySelectorAll('script').forEach((s, i) => {
            const entry = {
                index: i,
                src: s.src || null,
                type: s.type || null,
                id: s.id || null,
                inlineLength: s.textContent ? s.textContent.length : 0,
                inlineHead: s.textContent ? s.textContent.slice(0, 200).replace(/\\s+/g,' ') : '',
                hasEWMoon: s.textContent ? s.textContent.includes('EWMoon') : false,
                hasDC: s.textContent ? s.textContent.includes('var DC') || s.textContent.includes('window.DC') : false,
                hasSunCalc: s.textContent ? s.textContent.includes('SunCalc') : false,
            };
            list.push(entry);
        });
        return list;
    }""")

    print("===== ALL SCRIPT TAGS =====")
    for sc in scripts:
        print(f"\n[{sc['index']}] src={sc['src']}")
        if sc['inlineLength']:
            print(f"    inline length={sc['inlineLength']}")
            print(f"    head: {sc['inlineHead']}")
            flags = []
            if sc['hasEWMoon']: flags.append("EWMoon")
            if sc['hasDC']: flags.append("DC")
            if sc['hasSunCalc']: flags.append("SunCalc")
            if flags:
                print(f"    contains: {','.join(flags)}")

    print("\n===== EXTERNAL JS STATUS =====")
    for u, st in external_loaded.items():
        print(f"  [{st}] {u}")

    # 重点找 EWMoon 所在的内联脚本，看完整内容（找语法错误点）
    ewmoon_script = page.evaluate("""() => {
        for (const s of document.querySelectorAll('script')) {
            if (s.textContent && s.textContent.includes('EWMoon')) {
                const t = s.textContent;
                return {
                    totalLength: t.length,
                    head: t.slice(0, 600),
                    tail: t.slice(-600),
                    // 找 's' 标识符线索: 出现 单引号包s 的可疑片段
                    suspiciousQuotes: (t.match(/'.{0,3}s.{0,3}'/g) || []).slice(0, 10),
                };
            }
        }
        return null;
    }""")
    print("\n===== EWMoon INLINE SCRIPT (head+tail) =====")
    print(json.dumps(ewmoon_script, ensure_ascii=False, indent=2) if ewmoon_script else "EWMoon inline script NOT FOUND in DOM")

    # 也检查 today 相关脚本（doy/tc/theme/reading）
    today_script = page.evaluate("""() => {
        const out = [];
        for (const s of document.querySelectorAll('script')) {
            const t = s.textContent || '';
            if (t.includes('emc-today') || t.includes('DAILY_JSON') || t.includes('reading') || t.includes('theme')) {
                out.push({ length: t.length, head: t.slice(0, 400) });
            }
        }
        return out;
    }""")
    print("\n===== TODAY-RELATED INLINE SCRIPTS =====")
    print(json.dumps(today_script, ensure_ascii=False, indent=2))

    browser.close()
