# -*- coding: utf-8 -*-
# Love Tarot 本地验证
# 验证: base64解码执行 + 22牌渲染 + Shuffle/Cut/Pick/Validate流程 + 翻牌不跳走 + 爱情场景引导 +
#        爱情解读(牌义+practice) + 水晶CTA(best_love石) + Shop链接 + 字体min14 + 0字面反斜杠 + 桌面/移动
import os, json
from playwright.sync_api import sync_playwright

BASE = os.path.dirname(os.path.abspath(__file__))  # love-tarot/build
HTML = os.path.join(BASE, 'love-tarot-reading.html')
PFX = 'elv'
report = {}

def run_flow(label, viewport, scenario_id='thinking', spread='single'):
    r = {'label': label, 'viewport': viewport, 'scenario': scenario_id, 'spread': spread, 'checks': {}, 'console_errors': []}
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context(viewport=viewport, device_scale_factor=2)
        page = ctx.new_page()
        page.on('console', lambda m: r['console_errors'].append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: r['console_errors'].append('pageerror: ' + e.message))
        url = 'file:///' + os.path.abspath(HTML).replace('\\', '/')
        page.goto(url, wait_until='domcontentloaded')
        page.wait_for_timeout(700)

        # 1) base64 JS 解码并执行: window.ELVlove 存在 = IIFE 跑通
        r['checks']['app_decoded'] = page.evaluate('() => typeof window.ELVlove === "object" && typeof window.ELVlove.shuffle === "function"')

        # 2) 22牌渲染
        deck_count = page.locator(f'#{PFX}-deck .{PFX}-card-back').count()
        r['checks']['deck_22'] = deck_count == 22
        r['checks']['deck_count'] = deck_count

        # 3) 场景+牌阵选择
        page.select_option(f'#{PFX}-scenario', scenario_id)
        page.select_option(f'#{PFX}-spread', spread)
        page.wait_for_timeout(150)
        page.screenshot(path=os.path.join(BASE, f'{PFX}-{label}-{scenario_id}-01-cardback.png'))

        # 4) Shuffle -> Cut
        page.click(f'#{PFX}-shuffle-btn')
        page.wait_for_timeout(500)
        page.click(f'#{PFX}-cut-btn')
        page.wait_for_timeout(900)
        r['checks']['stage_cut'] = page.evaluate(f'''() => {{
            const el = document.getElementById('{PFX}-deck');
            return el && el.classList.contains('{PFX}-deck-pickable');
        }}''')

        # 5) 选牌
        backs = page.locator(f'#{PFX}-deck .{PFX}-card-back').all()
        n_picks = 3 if spread == 'three' else 1
        for i in range(n_picks):
            backs[i].click()
            page.wait_for_timeout(350)
        # 选满后 Validate/Reveal 按钮出现
        r['checks']['validate_btn_shown'] = page.evaluate(f'''() => {{
            const b = document.getElementById('{PFX}-validate-btn');
            return b && b.style.display !== 'none';
        }}''')
        # 点 Validate -> revealAll
        page.click(f'#{PFX}-validate-btn')
        page.wait_for_timeout(1300)

        page.screenshot(path=os.path.join(BASE, f'{PFX}-{label}-{scenario_id}-02-revealed.png'))

        # 6) 翻牌
        flip = page.evaluate(f'''() => {{
            const sel = document.querySelector('#{PFX}-deck .{PFX}-card-back.flipped');
            return {{
                flipped: sel ? sel.classList.contains('flipped') : false,
                hasFront: sel ? !!sel.querySelector('.{PFX}-front-face') : false,
            }};
        }}''')
        r['checks']['card_flipped'] = flip['flipped']
        r['checks']['card_shows_front'] = flip['hasFront']

        # 7) 翻牌不跳走(scrollIntoView block:nearest)
        scroll = page.evaluate('() => window.pageYOffset')
        r['checks']['no_big_jump'] = scroll < 1500

        # 8) 结果/场景引导/爱情解读/水晶/CTA
        r['checks']['result_shown'] = page.evaluate(f'''() => {{
            const el = document.getElementById('{PFX}-result');
            return el && el.style.display !== 'none';
        }}''')
        r['checks']['has_scenario_bar'] = page.locator(f'.{PFX}-scenario-bar').count() > 0
        r['checks']['has_scenario_guide'] = page.locator(f'.{PFX}-scenario-guide').count() > 0
        r['checks']['has_meaning'] = page.locator(f'.{PFX}-meaning').count() > 0
        r['checks']['has_stones'] = page.locator(f'.{PFX}-stone-card').count() > 0
        r['checks']['has_cta'] = page.locator(f'.{PFX}-cta-primary').count() > 0
        # 三牌阵: 验证3张牌+3个场景位置标签
        if spread == 'three':
            r['checks']['three_cards_revealed'] = page.locator(f'.{PFX}-card').count() == 3
            r['checks']['three_positions'] = page.locator(f'.{PFX}-card-pos').count() == 3

        # 9) Shop CTA 链接
        shop_link = page.evaluate(f'''() => {{
            const a = document.querySelector('.{PFX}-stone-shop');
            return a ? a.getAttribute('href') : null;
        }}''')
        r['checks']['shop_link_ok'] = bool(shop_link) and ('/shop' in shop_link or '/product-category' in shop_link)

        # 10) 字体 min14
        font_targets = [
            f'.{PFX}-stage-hint', f'.{PFX}-meaning', f'.{PFX}-stone-reason',
            f'.{PFX}-kw', f'.{PFX}-stone-name', f'.{PFX}-cta', f'.{PFX}-scenario-guide',
        ]
        font_check = page.evaluate(f'''(sels) => {{
            const out = [];
            for (const s of sels) {{
                const el = document.querySelector(s);
                if (el) {{
                    const fs = parseFloat(getComputedStyle(el).fontSize);
                    out.push({{sel:s, fontSize:fs}});
                }}
            }}
            return out;
        }}''', font_targets)
        r['font_check'] = font_check
        r['checks']['font_min14'] = all(f['fontSize'] >= 14 for f in font_check)

        # 11) 0 字面反斜杠(asciiJSON/base64 包装正确)
        literal_bad = page.evaluate(f'''() => {{
            const body = document.body.innerText;
            return body.includes('\\\\n') || body.includes('\\\\u');
        }}''')
        r['checks']['no_literal_backslash'] = not literal_bad
        # 牌背符号正确渲染(心 ♡ + 闪 ✦)
        back_ok = page.evaluate(f'''() => {{
            const el = document.querySelector('#{PFX}-deck .{PFX}-card-back:not(.flipped) .{PFX}-back-heart');
            if (!el) return false;
            const t = el.textContent;
            return t.includes('\\u2661') || t.includes('\\u2665');
        }}''')
        r['checks']['back_heart_real'] = back_ok

        r['checks']['no_console_errors'] = len(r['console_errors']) == 0
        page.screenshot(path=os.path.join(BASE, f'{PFX}-{label}-{scenario_id}-03-fullpage.png'), full_page=True)
        browser.close()
    return r

# 桌面: 4 场景 × 单牌 + 一个三牌阵; 移动: 一个场景单牌
flows = []
flows.append(('desktop', {'width': 1440, 'height': 900}, 'thinking', 'single'))
flows.append(('desktop', {'width': 1440, 'height': 900}, 'truelove', 'single'))
flows.append(('desktop', {'width': 1440, 'height': 900}, 'status', 'single'))
flows.append(('desktop', {'width': 1440, 'height': 900}, 'reconcile', 'single'))
flows.append(('desktop', {'width': 1440, 'height': 900}, 'thinking', 'three'))
flows.append(('mobile', {'width': 390, 'height': 844}, 'thinking', 'single'))
flows.append(('mobile', {'width': 390, 'height': 844}, 'truelove', 'three'))

for label, vp, scn, sp in flows:
    key = f'{label}-{scn}-{sp}'
    try:
        report[key] = run_flow(label, vp, scn, sp)
    except Exception as e:
        report[key] = {'error': str(e)}

with open(os.path.join(BASE, 'verify-report.json'), 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

print('=' * 90)
all_pass = True
for key in report:
    r = report[key]
    if 'error' in r:
        print(f'  [{key}] FLOW ERROR: {r["error"]}')
        all_pass = False
        continue
    c = r['checks']
    expected = ['app_decoded', 'deck_22', 'stage_cut', 'validate_btn_shown', 'card_flipped', 'card_shows_front',
                'no_big_jump', 'result_shown', 'has_scenario_bar', 'has_scenario_guide', 'has_meaning',
                'has_stones', 'has_cta', 'shop_link_ok', 'font_min14', 'no_literal_backslash', 'back_heart_real',
                'no_console_errors']
    if r['spread'] == 'three':
        expected += ['three_cards_revealed', 'three_positions']
    fails = [k for k in expected if not c.get(k)]
    status = 'PASS' if not fails else 'FAIL(' + ','.join(fails) + ')'
    if fails:
        all_pass = False
    print(f'  [{key} {r["viewport"]["width"]}w] deck={c.get("deck_count")} {status}')
    if r['console_errors']:
        print(f'           CONSOLE ERRORS: {r["console_errors"][:3]}')

print('=' * 90)
print('ALL PASS' if all_pass else 'HAS FAILURES')
