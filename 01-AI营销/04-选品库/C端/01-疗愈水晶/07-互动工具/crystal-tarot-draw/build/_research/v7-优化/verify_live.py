# -*- coding: utf-8 -*-
# v7 线上端到端验证(goearthward.com/tools/crystal-tarot-reading/)
# 确认线上 base64 loader 解码执行, 完整流程跑通
import os, json
from playwright.sync_api import sync_playwright

OUT = os.path.dirname(os.path.abspath(__file__))
URL = 'https://goearthward.com/tools/crystal-tarot-reading/'
report = {}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for label, vp in [('desktop', {'width': 1440, 'height': 900}), ('mobile', {'width': 390, 'height': 844})]:
        r = {'label': label, 'checks': {}, 'console_errors': []}
        ctx = browser.new_context(viewport=vp, device_scale_factor=2)
        page = ctx.new_page()
        page.on('console', lambda m: r['console_errors'].append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: r['console_errors'].append('pageerror: ' + e.message))
        try:
            page.goto(URL, wait_until='domcontentloaded', timeout=40000)
            page.wait_for_timeout(2500)  # 等base64 loader解码执行+CDN图片
            r['checks']['deck_22'] = page.locator('#ect-deck .ect-card-back').count() == 22
            r['checks']['ectaro_init'] = page.evaluate('() => typeof window.ECTaro === "object"')
            r['checks']['deck_is_flex'] = page.evaluate('''() => {
                const el=document.getElementById('ect-deck');
                return el && getComputedStyle(el).display==='flex';
            }''')
            r['checks']['crystal_back'] = page.evaluate("() => !!document.querySelector('.ect-back-crystal')")
            r['checks']['validate_exists'] = page.evaluate("() => !!document.getElementById('ect-validate-btn')")
            # 跑完整流程
            page.screenshot(path=os.path.join(OUT, f'LIVE-{label}-01-cardback.png'))
            page.click('#ect-shuffle-btn'); page.wait_for_timeout(500)
            page.click('#ect-cut-btn'); page.wait_for_timeout(900)
            page.click('#ect-deck .ect-card-back[data-pos="7"]'); page.wait_for_timeout(300)
            v_show = page.evaluate('() => getComputedStyle(document.getElementById("ect-validate-btn")).display')
            r['checks']['validate_shown'] = v_show != 'none'
            page.screenshot(path=os.path.join(OUT, f'LIVE-{label}-02-validate.png'))
            page.click('#ect-validate-btn'); page.wait_for_timeout(1500)
            page.screenshot(path=os.path.join(OUT, f'LIVE-{label}-03-revealed.png'))
            r['checks']['card_flipped'] = page.evaluate('''() => {
                const el=document.querySelector('#ect-deck .ect-card-back.selected');
                return el && el.classList.contains('flipped') && !!el.querySelector('.ect-front-face');
            }''')
            r['checks']['result_shown'] = page.locator('.ect-meaning').count() > 0
            r['checks']['has_stones'] = page.locator('.ect-stone-card').count() > 0
            r['checks']['no_console_errors'] = len(r['console_errors']) == 0
        except Exception as e:
            r['error'] = str(e)[:300]
        report[label] = r
        ctx.close()
    browser.close()

with open(os.path.join(OUT, 'verify-live-report.json'), 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

for k in ['desktop', 'mobile']:
    r = report[k]
    print(f"\n===== LIVE {r['label']} =====")
    if 'error' in r:
        print('  ERROR:', r['error']); continue
    c = r['checks']
    print(f"  deck 22 cards: {c.get('deck_22')}")
    print(f"  ECTaro init (base64 loader OK): {c.get('ectaro_init')}")
    print(f"  deck is FLEX: {c.get('deck_is_flex')}")
    print(f"  crystal back: {c.get('crystal_back')}")
    print(f"  Validate exists: {c.get('validate_exists')}")
    print(f"  Validate shown after pick: {c.get('validate_shown')}")
    print(f"  card flipped: {c.get('card_flipped')}")
    print(f"  result+stones: {c.get('result_shown')} {c.get('has_stones')}")
    print(f"  console errors: {'NONE' if c.get('no_console_errors') else r['console_errors']}")
