# -*- coding: utf-8 -*-
# Love Tarot 线上验证 (https://goearthward.com/tools/love-tarot/)
# 验证: base64解码执行 + 22牌渲染 + Shuffle/Cut/Pick/Validate流程 + 翻牌 + 爱情场景引导 +
#        爱情解读 + 水晶CTA + Shop链接 + 字体min14 + 0字面反斜杠 + 桌面/移动
import os, json
from playwright.sync_api import sync_playwright

BASE = os.path.dirname(os.path.abspath(__file__))
URL = 'https://goearthward.com/tools/love-tarot/'
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
        page.goto(URL, wait_until='domcontentloaded', timeout=60000)
        page.wait_for_timeout(2500)  # 等主题/JS加载

        # 1) 工具容器存在(确认内容已部署)
        r['checks']['tool_present'] = page.evaluate(f'''() => !!document.getElementById('{PFX}-wrap')''')

        # 2) base64 JS 解码执行
        r['checks']['app_decoded'] = page.evaluate(f'() => typeof window.ELVlove === "object"')

        # 3) 22牌渲染
        deck_count = page.locator(f'#{PFX}-deck .{PFX}-card-back').count()
        r['checks']['deck_22'] = deck_count == 22
        r['checks']['deck_count'] = deck_count

        # 4) 场景+牌阵
        page.select_option(f'#{PFX}-scenario', scenario_id)
        page.select_option(f'#{PFX}-spread', spread)
        page.wait_for_timeout(150)
        page.screenshot(path=os.path.join(BASE, f'live-{PFX}-{label}-{scenario_id}-01.png'))

        # 5) Shuffle -> Cut
        page.click(f'#{PFX}-shuffle-btn')
        page.wait_for_timeout(600)
        page.click(f'#{PFX}-cut-btn')
        page.wait_for_timeout(1000)
        r['checks']['stage_cut'] = page.evaluate(f'''() => {{
            const el = document.getElementById('{PFX}-deck');
            return el && el.classList.contains('{PFX}-deck-pickable');
        }}''')

        # 6) 选牌 + Validate
        backs = page.locator(f'#{PFX}-deck .{PFX}-card-back').all()
        n_picks = 3 if spread == 'three' else 1
        for i in range(n_picks):
            backs[i].click()
            page.wait_for_timeout(400)
        r['checks']['validate_btn_shown'] = page.evaluate(f'''() => {{
            const b = document.getElementById('{PFX}-validate-btn');
            return b && b.style.display !== 'none';
        }}''')
        page.click(f'#{PFX}-validate-btn')
        page.wait_for_timeout(1500)

        page.screenshot(path=os.path.join(BASE, f'live-{PFX}-{label}-{scenario_id}-02-revealed.png'))

        # 7) 翻牌
        flip = page.evaluate(f'''() => {{
            const sel = document.querySelector('#{PFX}-deck .{PFX}-card-back.flipped');
            return {{
                flipped: sel ? sel.classList.contains('flipped') : false,
                hasFront: sel ? !!sel.querySelector('.{PFX}-front-face') : false,
            }};
        }}''')
        r['checks']['card_flipped'] = flip['flipped']
        r['checks']['card_shows_front'] = flip['hasFront']

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
        if spread == 'three':
            r['checks']['three_cards_revealed'] = page.locator(f'.{PFX}-card').count() == 3
            r['checks']['three_positions'] = page.locator(f'.{PFX}-card-pos').count() == 3

        # 9) Shop 链接
        shop_link = page.evaluate(f'''() => {{
            const a = document.querySelector('.{PFX}-stone-shop');
            return a ? a.getAttribute('href') : null;
        }}''')
        r['checks']['shop_link_ok'] = bool(shop_link) and ('/shop' in shop_link or '/product-category' in shop_link)
        r['shop_link'] = shop_link

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

        # 11) 0 字面反斜杠
        literal_bad = page.evaluate(f'''() => {{
            const body = document.body.innerText;
            return body.includes('\\\\n') || body.includes('\\\\u');
        }}''')
        r['checks']['no_literal_backslash'] = not literal_bad

        r['checks']['no_console_errors'] = len(r['console_errors']) == 0
        page.screenshot(path=os.path.join(BASE, f'live-{PFX}-{label}-{scenario_id}-03-full.png'), full_page=True)
        browser.close()
    return r

flows = [
    ('desktop', {'width': 1440, 'height': 900}, 'thinking', 'single'),
    ('desktop', {'width': 1440, 'height': 900}, 'reconcile', 'three'),
    ('mobile', {'width': 390, 'height': 844}, 'truelove', 'single'),
]
for label, vp, scn, sp in flows:
    key = f'{label}-{scn}-{sp}'
    try:
        report[key] = run_flow(label, vp, scn, sp)
    except Exception as e:
        report[key] = {'error': str(e)}

with open(os.path.join(BASE, 'verify-live-report.json'), 'w', encoding='utf-8') as f:
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
    expected = ['tool_present', 'app_decoded', 'deck_22', 'stage_cut', 'validate_btn_shown', 'card_flipped',
                'card_shows_front', 'result_shown', 'has_scenario_bar', 'has_scenario_guide', 'has_meaning',
                'has_stones', 'has_cta', 'shop_link_ok', 'font_min14', 'no_literal_backslash', 'no_console_errors']
    if r['spread'] == 'three':
        expected += ['three_cards_revealed', 'three_positions']
    fails = [k for k in expected if not c.get(k)]
    status = 'PASS' if not fails else 'FAIL(' + ','.join(fails) + ')'
    if fails:
        all_pass = False
    print(f'  [{key} {r["viewport"]["width"]}w] deck={c.get("deck_count")} {status} | shop={r.get("shop_link","")}')
    if r['console_errors']:
        print(f'           CONSOLE ERRORS: {r["console_errors"][:3]}')

print('=' * 90)
print('LIVE ALL PASS' if all_pass else 'LIVE HAS FAILURES')
