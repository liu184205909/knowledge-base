# -*- coding: utf-8 -*-
# v7 优化本地验证 - python playwright 版
# 验证: 横向铺开(deck flex) + Validate确认流程 + 翻牌不跳走 + 无JS错误 + 桌面/移动
import os, json
from playwright.sync_api import sync_playwright

OUT = os.path.dirname(os.path.abspath(__file__))
HTML_URL = 'file:///' + os.path.join(OUT, 'page.html').replace('\\', '/')
report = {'desktop': {}, 'mobile': {}, 'errors': []}


def run_flow(label, viewport):
    r = {'label': label, 'viewport': viewport, 'checks': {}, 'console_errors': []}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport=viewport, device_scale_factor=2)
        page = ctx.new_page()
        page.on('console', lambda m: r['console_errors'].append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: r['console_errors'].append('pageerror: ' + e.message))

        page.goto(HTML_URL, wait_until='domcontentloaded')
        page.wait_for_timeout(800)

        # 检查1: 22张牌背渲染 + ECTaro初始化
        deck_count = page.locator('#ect-deck .ect-card-back').count()
        r['checks']['deck_rendered'] = deck_count == 22
        r['checks']['deck_count'] = deck_count
        r['checks']['ectaro_init'] = page.evaluate('() => typeof window.ECTaro === "object"')

        # 检查2: deck 是 flex 横向铺开(非 grid)
        r['checks']['deck_is_flex'] = page.evaluate('''() => {
            const el = document.getElementById('ect-deck');
            if (!el) return false;
            return getComputedStyle(el).display === 'flex';
        }''')

        # 截图1: 牌背铺开
        page.screenshot(path=os.path.join(OUT, f'{label}-01-cardback-spread.png'))

        # 检查3: 初始 Validate 隐藏
        v_init = page.evaluate('''() => {
            const el = document.getElementById('ect-validate-btn');
            return el ? getComputedStyle(el).display : 'not-found';
        }''')
        r['checks']['validate_hidden_initially'] = (v_init == 'none')

        # Shuffle -> Cut
        page.click('#ect-shuffle-btn')
        page.wait_for_timeout(500)
        page.click('#ect-cut-btn')
        page.wait_for_timeout(900)
        page.screenshot(path=os.path.join(OUT, f'{label}-02-pickable.png'))

        r['checks']['stage_cut'] = page.evaluate('''() => {
            const el = document.getElementById('ect-deck');
            return el && el.classList.contains('ect-deck-pickable');
        }''')

        # 检查4: 选满显示 Validate (单牌模式, 需1张)
        backs = page.locator('#ect-deck .ect-card-back').all()
        backs[3].click()
        page.wait_for_timeout(300)
        v_after = page.evaluate('''() => {
            const el = document.getElementById('ect-validate-btn');
            return el ? getComputedStyle(el).display : 'not-found';
        }''')
        r['checks']['validate_shown_after_full'] = (v_after not in ('none', 'not-found'))
        page.screenshot(path=os.path.join(OUT, f'{label}-03-validate-shown.png'))

        # 检查5: 可反悔(再点取消)
        backs[3].click()
        page.wait_for_timeout(300)
        v_undo = page.evaluate('''() => {
            const el = document.getElementById('ect-validate-btn');
            return el ? getComputedStyle(el).display : 'not-found';
        }''')
        r['checks']['validate_hidden_after_undo'] = (v_undo == 'none')
        backs[3].click()
        page.wait_for_timeout(300)

        # 检查6+7: 翻牌不跳走
        scroll_before = page.evaluate('() => window.pageYOffset')
        rect_before = page.evaluate('''() => {
            const el = document.querySelector('#ect-deck .ect-card-back.selected');
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return {top: r.top, left: r.left};
        }''')
        page.click('#ect-validate-btn')
        page.wait_for_timeout(1200)
        page.screenshot(path=os.path.join(OUT, f'{label}-04-revealed.png'))

        flip = page.evaluate('''() => {
            const sel = document.querySelector('#ect-deck .ect-card-back.selected');
            return {
                flipped: sel ? sel.classList.contains('flipped') : false,
                hasFrontFace: sel ? !!sel.querySelector('.ect-front-face') : false,
            };
        }''')
        r['checks']['card_flipped'] = flip['flipped']
        r['checks']['card_shows_front'] = flip['hasFrontFace']

        scroll_after = page.evaluate('() => window.pageYOffset')
        rect_after = page.evaluate('''() => {
            const el = document.querySelector('#ect-deck .ect-card-back.selected, #ect-deck .ect-card-back.flipped');
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return {top: r.top, left: r.left};
        }''')
        r['scroll_before'] = scroll_before
        r['scroll_after'] = scroll_after
        r['scroll_jump'] = abs(scroll_after - scroll_before)
        r['checks']['no_jump'] = r['scroll_jump'] < 100
        r['rect_before'] = rect_before
        r['rect_after'] = rect_after

        # 检查8: 深度内容
        r['checks']['result_shown'] = page.evaluate('''() => {
            const res = document.getElementById('ect-result');
            return res && res.style.display !== 'none';
        }''')
        r['checks']['has_meaning'] = page.locator('.ect-meaning').count() > 0
        r['checks']['has_stones'] = page.locator('.ect-stone-card').count() > 0
        r['checks']['has_cta'] = page.locator('.ect-cta-primary').count() > 0

        # 检查9: 水晶主题牌背 + 旧符号移除
        r['checks']['has_crystal_back'] = page.evaluate('''() => {
            const back = document.querySelector('#ect-deck .ect-card-back:not(.flipped) .ect-back-crystal');
            return !!back;
        }''')
        r['checks']['no_old_symbol'] = page.evaluate('() => document.querySelectorAll(".ect-back-sym").length === 0')

        # 检查10: 字体最小值
        font_check = page.evaluate('''() => {
            const targets = [
                {sel: '.ect-stage-hint', min: 14},
                {sel: '.ect-meaning', min: 14},
                {sel: '.ect-stone-reason', min: 14},
                {sel: '.ect-kw', min: 14},
                {sel: '.ect-back-label', min: 10},
            ];
            const out = [];
            for (const t of targets) {
                const el = document.querySelector(t.sel);
                if (el) {
                    const fs = parseFloat(getComputedStyle(el).fontSize);
                    out.push({sel: t.sel, fontSize: fs, pass: fs >= t.min});
                }
            }
            return out;
        }''')
        r['font_check'] = font_check
        r['checks']['font_min_ok'] = all(f['pass'] for f in font_check)

        r['checks']['no_console_errors'] = len(r['console_errors']) == 0
        page.screenshot(path=os.path.join(OUT, f'{label}-05-fullpage.png'), full_page=True)
        browser.close()
    return r


for label, vp in [('desktop', {'width': 1440, 'height': 900}), ('mobile', {'width': 390, 'height': 844})]:
    try:
        report[label] = run_flow(label, vp)
    except Exception as e:
        report['errors'].append(f'{label}: {e}')

with open(os.path.join(OUT, 'verify-report.json'), 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

for key in ['desktop', 'mobile']:
    r = report[key]
    if 'checks' not in r:
        continue
    c = r['checks']
    print(f"\n===== {r['label']} ({r['viewport']['width']}x{r['viewport']['height']}) =====")
    print(f"  deck rendered (22): {c['deck_rendered']} | count: {c['deck_count']}")
    print(f"  ECTaro init: {c['ectaro_init']}")
    print(f"  deck is FLEX (横向铺开): {c['deck_is_flex']}")
    print(f"  Validate hidden initially: {c['validate_hidden_initially']}")
    print(f"  stage=cut after Shuffle+Cut: {c['stage_cut']}")
    print(f"  Validate shown after full pick: {c['validate_shown_after_full']}")
    print(f"  Validate hidden after undo: {c['validate_hidden_after_undo']}")
    print(f"  card flipped: {c['card_flipped']} | shows front face: {c['card_shows_front']}")
    print(f"  no jump (nearest): {c['no_jump']} | jump px: {r['scroll_jump']} (before {r['scroll_before']} -> after {r['scroll_after']})")
    print(f"  result+meaning+stones+CTA: {c['result_shown']} {c['has_meaning']} {c['has_stones']} {c['has_cta']}")
    print(f"  crystal back theme: {c['has_crystal_back']} | old sym removed: {c['no_old_symbol']}")
    print(f"  font min OK: {c['font_min_ok']}")
    print(f"  console errors: {'NONE' if c['no_console_errors'] else r['console_errors']}")
if report['errors']:
    print('\nFLOW ERRORS:', report['errors'])
