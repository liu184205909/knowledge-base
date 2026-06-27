# -*- coding: utf-8 -*-
"""用真实选择器 .ewq-q / .ewq-opt 完成答题并提交,验证结果区渲染。"""
import json
from playwright.sync_api import sync_playwright

URL = "https://goearthward.com/tools/crystal-quiz/"
SHOT_DIR = "D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/screenshots"
console_msgs = []
page_errors = []

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(viewport={"width":1920,"height":1080})
        page = ctx.new_page()
        page.on("console", lambda m: console_msgs.append((m.type, m.text)))
        page.on("pageerror", lambda e: page_errors.append(str(e)))
        page.goto(URL, wait_until="networkidle", timeout=60000)
        page.wait_for_timeout(2500)

        # 用真实选择器逐题点 Somewhat(每个 .ewq-q 里的第2个 .ewq-opt)
        clickres = page.evaluate(r"""() => {
            const qs = document.querySelectorAll('#ewq-quiz .ewq-q');
            const log = [];
            qs.forEach((q, i) => {
                const opts = q.querySelectorAll('.ewq-opt');
                // 选 Somewhat(index 1)
                const target = opts[1] || opts[opts.length-1];
                if (target) {
                    target.click();
                    const cls = target.className;
                    log.push({q:i, clicked_text:(target.textContent||'').trim().slice(0,20), nowActive:cls});
                }
            });
            return {found:qs.length, log};
        }""")
        print("答题点击:", json.dumps(clickres, ensure_ascii=False, indent=2))
        page.wait_for_timeout(500)

        # 检查按钮是否变 enabled
        btn_state_before = page.evaluate(r"""() => {
            const b = document.querySelector('#ewq-submit');
            return b ? {disabled:b.disabled, cls:b.className, text:b.textContent.trim().slice(0,30)} : null;
        }""")
        print("答题后按钮状态:", btn_state_before)
        page.screenshot(path=f"{SHOT_DIR}/quiz-after-answer.png", full_page=True)

        # 点击 See My Crystal
        click_submit = page.evaluate(r"""() => {
            const b = document.querySelector('#ewq-submit');
            if (b && !b.disabled) { b.click(); return true; }
            return false;
        }""")
        print("点击提交:", click_submit)
        page.wait_for_timeout(3000)

        page.screenshot(path=f"{SHOT_DIR}/quiz-result.png", full_page=True)

        # 结果区详细状态
        rstate = page.evaluate(r"""() => {
            const r = document.querySelector('#ewq-result');
            if (!r) return {exists:false};
            const cs = getComputedStyle(r);
            const out = {
                exists:true, display:cs.display, visibility:cs.visibility,
                innerText_preview: r.innerText.slice(0,1500),
                innerHTML_len: r.innerHTML.length,
                has_canvas: !!r.querySelector('canvas'),
                canvas_count: r.querySelectorAll('canvas').length,
                img_count: r.querySelectorAll('img').length,
                has_dominant_color: r.innerText.includes('Dominant') || r.innerText.includes('primary') || /#[0-9a-f]{6}/i.test(r.innerText),
                links: Array.from(r.querySelectorAll('a')).map(a=>({t:(a.textContent||'').trim().slice(0,25), href:a.href})).slice(0,10),
                child_summary: Array.from(r.children).map(c=>({tag:c.tagName.toLowerCase(), cls:String(c.className).slice(0,40), txt:(c.innerText||'').trim().slice(0,60)}))
            };
            return out;
        }""")
        print("\n结果区详细:", json.dumps(rstate, ensure_ascii=False, indent=2))

        errs = [m for m in console_msgs if m[0] in ("error","warning")]
        print(f"\nconsole err/warn={len(errs)}; pageerror={len(page_errors)}")
        for t,txt in errs[:15]: print(f"  [{t}] {txt[:300]}")
        for e in page_errors[:15]: print(f"  PAGEERR {e[:400]}")

        browser.close()

if __name__=="__main__":
    main()
