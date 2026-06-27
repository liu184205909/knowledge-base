# -*- coding: utf-8 -*-
"""
诊断 https://goearthward.com/tools/crystal-quiz/ 实际渲染状态。
检查项：题目/选项渲染、结果区初始隐藏、图表初始是否显示、按钮 disabled、
console JS 错误、答题提交流程。
"""
import json
import sys
from playwright.sync_api import sync_playwright

URL = "https://goearthward.com/tools/crystal-quiz/"
SHOT_DIR = "D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/screenshots"

console_msgs = []  # (type, text)
page_errors = []

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()

        # 收集 console 与 pageerror
        def on_console(msg):
            console_msgs.append((msg.type, msg.text))
        def on_pageerror(err):
            page_errors.append(str(err))
        page.on("console", on_console)
        page.on("pageerror", on_pageerror)

        print("=== STEP 1: goto (networkidle) ===")
        page.goto(URL, wait_until="networkidle", timeout=60000)
        # 额外等待 JS 执行
        page.wait_for_timeout(2500)

        # ===== 桌面全页截图 =====
        page.screenshot(path=f"{SHOT_DIR}/quiz-desktop-full.png", full_page=True)
        # viewport 截图(above fold)
        page.screenshot(path=f"{SHOT_DIR}/quiz-desktop-fold.png", full_page=False)

        # ===== 元素探测 =====
        print("\n=== STEP 2: 元素探测(初始加载后) ===")
        report = page.evaluate(r"""() => {
            const out = {};
            const exists = (sel) => { const e = document.querySelector(sel); return e ? true : false; };
            const disp = (sel) => {
                const e = document.querySelector(sel);
                if (!e) return null;
                const cs = getComputedStyle(e);
                return {display: cs.display, visibility: cs.visibility, opacity: cs.opacity,
                        hidden_attr: e.hidden, offsetParent: !!e.offsetParent};
            };

            out.ewq_quiz_exists = exists('#ewq-quiz');
            out.ewq_quiz_disp = disp('#ewq-quiz');
            out.ewq_result_exists = exists('#ewq-result');
            out.ewq_result_disp = disp('#ewq-result');

            // 题目数量(各种可能选择器)
            const qSels = ['#ewq-quiz .ewq-question', '#ewq-quiz [data-question]',
                           '#ewq-quiz .question', '#ewq-quiz .quiz-question',
                           '#ewq-quiz fieldset', '#ewq-quiz .ewq-q'];
            out.question_counts = {};
            qSels.forEach(s => {
                out.question_counts[s] = document.querySelectorAll(s).length;
            });

            // 选项按钮文本
            const allBtns = Array.from(document.querySelectorAll('#ewq-quiz button, #ewq-quiz input[type=button], #ewq-quiz [role=button], #ewq-quiz label'));
            out.option_button_texts = allBtns.map(b => (b.textContent||'').trim().slice(0,30)).filter(t=>t).slice(0,30);

            // 所有包含 Not really / Somewhat / Yes 文本的元素
            const html = document.querySelector('#ewq-quiz') ? document.querySelector('#ewq-quiz').innerText : '';
            out.quiz_innerText_preview = html.slice(0, 800);
            out.quiz_has_NotReally = html.includes('Not really');
            out.quiz_has_Somewhat = html.includes('Somewhat');
            out.quiz_has_YesExactly = html.toLowerCase().includes('yes, exactly');

            // 图表(初始不该显示)
            out.chart_canvas_exists = exists('#ewq-result canvas') || exists('canvas');
            out.chart_disp_in_result = disp('#ewq-result canvas');
            // "Your Full Color Match" 文本
            const bodyTxt = document.body.innerText;
            out.has_FullColorMatch_text = bodyTxt.includes('Full Color Match');
            out.has_Shop_button = bodyTxt.includes('Shop');

            return out;
        }""")
        # 上面 evaluate 里有个 typo(smm)，下面再干净查一次
        report2 = page.evaluate(r"""() => {
            const out = {};
            const findBtn = () => {
                const candidates = ['button.ewq-submit', '#ewq-submit', 'button[type=submit]',
                                    '.quiz-submit', '[data-action=submit]', '#ewq-result button'];
                for (const s of candidates) {
                    const e = document.querySelector(s);
                    if (e) return {sel:s, text:(e.textContent||'').trim().slice(0,30), disabled:e.disabled};
                }
                // 全文档找 "See My Crystal"
                const all = Array.from(document.querySelectorAll('button, a, input[type=button], input[type=submit]'));
                const hit = all.find(b => /see my crystal/i.test(b.textContent||''));
                if (hit) return {sel:'textmatch', text:(hit.textContent||'').trim().slice(0,30), disabled:hit.disabled || (hit.getAttribute('aria-disabled')==='true')};
                return null;
            };
            out.see_my_crystal_btn = findBtn();
            // 列出 #ewq-quiz 里所有可点击/输入元素概况
            const q = document.querySelector('#ewq-quiz');
            if (q) {
                out.quiz_tag_counts = {};
                q.querySelectorAll('*').forEach(e => {
                    const k = e.tagName.toLowerCase() + (e.className ? '.'+String(e.className).split(' ')[0] : '');
                    out.quiz_tag_counts[k] = (out.quiz_tag_counts[k]||0)+1;
                });
                const top = Array.from(q.children).map(c => ({tag:c.tagName.toLowerCase(), cls:c.className, id:c.id}));
                out.quiz_direct_children = top.slice(0,20);
            }
            return out;
        }""")

        print("REPORT1:", json.dumps(report, ensure_ascii=False, indent=2))
        print("\nREPORT2:", json.dumps(report2, ensure_ascii=False, indent=2))

        # ===== Console 错误 =====
        print("\n=== STEP 3: Console / PageError ===")
        errors = [m for m in console_msgs if m[0] in ("error", "warning")]
        print(f"console total={len(console_msgs)} error/warn={len(errors)}")
        for t, txt in errors[:20]:
            print(f"  [{t}] {txt[:300]}")
        if page_errors:
            print(f"PAGEERROR count={len(page_errors)}:")
            for e in page_errors[:20]:
                print(f"  {e[:400]}")

        # ===== STEP 4: 模拟答题 =====
        print("\n=== STEP 4: 模拟答 8 题 ===")
        clicked = page.evaluate(r"""() => {
            // 找所有题目容器
            const qs = document.querySelectorAll('#ewq-quiz .ewq-question, #ewq-quiz fieldset, #ewq-quiz .question');
            const log = [];
            qs.forEach((q, i) => {
                // 找选项(选第二个/Somewhat)
                const opts = q.querySelectorAll('button, label, input, [role=button], [data-value]');
                let clickedAny = false;
                for (const o of opts) {
                    const txt = (o.textContent||o.value||'').toLowerCase();
                    if (txt.includes('somewhat')) { try{o.click();clickedAny=true;}catch(e){} break; }
                }
                if (!clickedAny && opts.length>0) {
                    // 点中间那个
                    try { opts[Math.floor(opts.length/2)].click(); clickedAny=true; } catch(e){}
                }
                log.push({q:i, opts:opts.length, clicked:clickedAny});
            });
            return {found:qs.length, log:log};
        }""")
        print("答题点击结果:", json.dumps(clicked, ensure_ascii=False, indent=2))
        page.wait_for_timeout(800)

        # 截图答题后
        page.screenshot(path=f"{SHOT_DIR}/quiz-desktop-after-answer.png", full_page=True)

        # 找 See My Crystal 按钮并点击
        submit_clicked = page.evaluate(r"""() => {
            const all = Array.from(document.querySelectorAll('button, a, input[type=button], input[type=submit]'));
            const hit = all.find(b => /see my crystal/i.test(b.textContent||''));
            if (hit && !hit.disabled) { hit.click(); return {clicked:true, text:hit.textContent.trim().slice(0,30)}; }
            return {clicked:false, found: !!hit, disabled: hit?hit.disabled:null};
        }""")
        print("提交按钮点击:", json.dumps(submit_clicked, ensure_ascii=False))
        page.wait_for_timeout(2500)

        # 截图结果
        page.screenshot(path=f"{SHOT_DIR}/quiz-desktop-result.png", full_page=True)

        # 检查结果区状态
        result_state = page.evaluate(r"""() => {
            const out = {};
            const r = document.querySelector('#ewq-result');
            if (r) {
                const cs = getComputedStyle(r);
                out.result_display = cs.display;
                out.result_visibility = cs.visibility;
                out.result_innerText_preview = r.innerText.slice(0, 1000);
                out.result_has_canvas = !!r.querySelector('canvas');
                out.result_innerHTML_len = r.innerHTML.length;
            }
            return out;
        }""")
        print("\n结果区状态:", json.dumps(result_state, ensure_ascii=False, indent=2))

        browser.close()

if __name__ == "__main__":
    main()
