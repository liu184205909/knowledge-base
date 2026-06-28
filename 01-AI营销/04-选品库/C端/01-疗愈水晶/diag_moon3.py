# -*- coding: utf-8 -*-
"""导出 script[13] 完整内容到文件,供 node --check 定位语法错误行号"""
from playwright.sync_api import sync_playwright

URL = "https://goearthward.com/tools/moon-calendar/"

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()
    page = context.new_page()
    page.goto(URL, wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(2000)

    # 取所有内联脚本中含 EWMoon 的那条,完整内容
    js = page.evaluate("""() => {
        for (const s of document.querySelectorAll('script')) {
            if (s.textContent && s.textContent.includes('EWMoon')) {
                return s.textContent;
            }
        }
        return null;
    }""")

    if js:
        out = "D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/ewmoon_extracted.js"
        with open(out, "w", encoding="utf-8") as f:
            f.write(js)
        print(f"Extracted {len(js)} chars -> {out}")
    else:
        print("EWMoon script not found")
    browser.close()
