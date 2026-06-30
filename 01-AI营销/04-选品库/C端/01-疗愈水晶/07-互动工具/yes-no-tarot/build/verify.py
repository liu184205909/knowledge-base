# -*- coding: utf-8 -*-
# Yes/No Tarot + Draw Tarot Cards 本地验证
# 验证: 22牌渲染 + Shuffle/Cut/Pick流程 + 翻牌不跳走 + 判定(eyn) + 水晶CTA + 字体min14 + 0字面反斜杠 + 桌面/移动
import os, json
from playwright.sync_api import sync_playwright

BASE = os.path.dirname(os.path.abspath(__file__))  # yes-no-tarot/build
TOOLS = {
    'eyn': {
        'html': os.path.join(BASE, 'yes-no-tarot.html'),
        'prefix': 'eyn', 'has_verdict': True, 'deck_id': 'eyn-deck',
        'shuffle': 'eyn-shuffle-btn', 'cut': 'eyn-cut-btn', 'reset': 'eyn-reset-btn',
        'count_sel': 'eyn-count', 'single_val': 'single', 'three_val': 'three',
        'result': 'eyn-result', 'verdict': 'eyn-verdict', 'card': 'eyn-card',
        'meaning': 'eyn-meaning', 'stone': 'eyn-stone-card', 'cta': 'eyn-cta-primary',
    },
    'efd': {
        'html': os.path.join(BASE, '..', '..', 'draw-tarot-cards', 'build', 'draw-tarot-cards.html'),
        'prefix': 'efd', 'has_verdict': False, 'deck_id': 'efd-deck',
        'shuffle': 'efd-shuffle-btn', 'cut': 'efd-cut-btn', 'reset': 'efd-reset-btn',
        'count_sel': 'efd-count', 'single_val': '1', 'three_val': '3',
        'result': 'efd-result', 'verdict': None, 'card': 'efd-card',
        'meaning': 'efd-meaning', 'stone': 'efd-stone-card', 'cta': 'efd-cta-primary',
    },
}
report = {}

def run_flow(key, label, viewport):
    cfg = TOOLS[key]
    pfx = cfg['prefix']
    r = {'label': label, 'viewport': viewport, 'checks': {}, 'console_errors': []}
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context(viewport=viewport, device_scale_factor=2)
        page = ctx.new_page()
        page.on('console', lambda m: r['console_errors'].append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: r['console_errors'].append('pageerror: ' + e.message))
        url = 'file:///' + os.path.abspath(cfg['html']).replace('\\', '/')
        page.goto(url, wait_until='domcontentloaded')
        page.wait_for_timeout(700)

        # 1) 22牌渲染
        deck_count = page.locator(f'#{cfg["deck_id"]} .{pfx}-card-back').count()
        r['checks']['deck_22'] = deck_count == 22
        r['checks']['deck_count'] = deck_count

        # 截图: 初始牌背
        page.screenshot(path=os.path.join(BASE, f'{key}-{label}-01-cardback.png'))

        # 2) 设为单牌 -> Shuffle -> Cut
        page.select_option(f'#{cfg["count_sel"]}', cfg['single_val'])
        page.wait_for_timeout(150)
        page.click(f'#{cfg["shuffle"]}')
        page.wait_for_timeout(500)
        page.click(f'#{cfg["cut"]}')
        page.wait_for_timeout(900)
        r['checks']['stage_cut'] = page.evaluate(f'''() => {{
            const el = document.getElementById('{cfg["deck_id"]}');
            return el && el.classList.contains('{pfx}-deck-pickable');
        }}''')

        # 3) 选第一张牌背(单牌)
        backs = page.locator(f'#{cfg["deck_id"]} .{pfx}-card-back').all()
        backs[3].click()
        page.wait_for_timeout(1200)
        page.screenshot(path=os.path.join(BASE, f'{key}-{label}-02-revealed.png'))

        flip = page.evaluate(f'''() => {{
            const sel = document.querySelector('#{cfg["deck_id"]} .{pfx}-card-back.flipped');
            return {{
                flipped: sel ? sel.classList.contains('flipped') : false,
                hasFront: sel ? !!sel.querySelector('.{pfx}-front-face') : false,
            }};
        }}''')
        r['checks']['card_flipped'] = flip['flipped']
        r['checks']['card_shows_front'] = flip['hasFront']

        # 4) 翻牌不跳走(已通过 scrollIntoView block:nearest)
        scroll = page.evaluate('() => window.pageYOffset')
        r['checks']['no_big_jump'] = scroll < 1500  # 翻牌后不会猛跳到页面底部

        # 5) 结果/牌义/水晶/CTA
        r['checks']['result_shown'] = page.evaluate(f'''() => {{
            const el = document.getElementById('{cfg["result"]}');
            return el && el.style.display !== 'none';
        }}''')
        r['checks']['has_meaning'] = page.locator(f'.{pfx}-meaning').count() > 0
        r['checks']['has_stones'] = page.locator(f'.{pfx}-stone-card').count() > 0
        r['checks']['has_cta'] = page.locator(f'.{cfg["cta"]}').count() > 0

        # 6) 判定卡(仅 eyn)
        if cfg['has_verdict']:
            verdict_info = page.evaluate(f'''() => {{
                const el = document.getElementById('{cfg["verdict"]}');
                if (!el || el.style.display === 'none') return {{shown:false}};
                const big = el.querySelector('.{pfx}-verdict-big');
                const tag = el.querySelector('.{pfx}-verdict-tag');
                return {{
                    shown: true,
                    label: big ? big.textContent.trim() : '',
                    tag: tag ? tag.textContent.trim() : '',
                    isValid: big ? ['Yes','No','Maybe'].includes(big.textContent.trim()) : false,
                }};
            }}''')
            r['checks']['verdict_shown'] = verdict_info['shown']
            r['checks']['verdict_valid'] = verdict_info.get('isValid', False)
            r['verdict_label'] = verdict_info.get('label', '')

        # 7) Shop CTA 链接非空且指向 /shop 或 /product-category
        shop_link = page.evaluate(f'''() => {{
            const a = document.querySelector('.{pfx}-stone-shop');
            return a ? a.getAttribute('href') : null;
        }}''')
        r['checks']['shop_link_ok'] = bool(shop_link) and ('/shop' in shop_link or '/product-category' in shop_link)

        # 8) 字体 min14
        font_targets = [
            f'.{pfx}-stage-hint', f'.{pfx}-meaning', f'.{pfx}-stone-reason',
            f'.{pfx}-kw', f'.{pfx}-stone-name', f'.{pfx}-cta',
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
        # back-label 允许 12(tarot v6 同规格), 其余 min14
        r['checks']['font_min14'] = all(f['fontSize'] >= 14 for f in font_check)

        # 9) 0 字面反斜杠: 牌背符号正确渲染为 ✦ 而非字面文本
        back_sym_ok = page.evaluate(f'''() => {{
            const el = document.querySelector('#{cfg["deck_id"]} .{pfx}-card-back:not(.flipped) .{pfx}-back-sym');
            if (!el) return false;
            const t = el.textContent;
            return t === '\\u2726' || t.includes('✦');
        }}''')
        r['checks']['back_symbol_real'] = back_sym_ok
        # 页面可见文本不得出现字面 "\n" 或 "✦" 文本
        literal_bad = page.evaluate(f'''() => {{
            const body = document.body.innerText;
            return body.includes('\\\\u2726') || body.includes('\\\\n');
        }}''')
        r['checks']['no_literal_backslash'] = not literal_bad

        r['checks']['no_console_errors'] = len(r['console_errors']) == 0
        page.screenshot(path=os.path.join(BASE, f'{key}-{label}-03-fullpage.png'), full_page=True)

        # 10) 三牌流程(eyn: 多数决; efd: 三张牌义)
        page.click(f'#{cfg["reset"]}')
        page.wait_for_timeout(400)
        page.select_option(f'#{cfg["count_sel"]}', cfg['three_val'])
        page.wait_for_timeout(150)
        page.click(f'#{cfg["shuffle"]}')
        page.wait_for_timeout(500)
        page.click(f'#{cfg["cut"]}')
        page.wait_for_timeout(900)
        backs2 = page.locator(f'#{cfg["deck_id"]} .{pfx}-card-back').all()
        for i in range(3):
            backs2[i].click()
            page.wait_for_timeout(450)
        page.wait_for_timeout(1200)
        card_count = page.locator(f'.{pfx}-card').count()
        r['checks']['three_cards_revealed'] = card_count == 3
        if cfg['has_verdict']:
            v3 = page.evaluate(f'''() => {{
                const el = document.getElementById('{cfg["verdict"]}');
                const big = el ? el.querySelector('.{pfx}-verdict-big') : null;
                return big ? big.textContent.trim() : '';
            }}''')
            r['three_verdict'] = v3
            r['checks']['three_verdict_valid'] = v3 in ('Yes', 'No', 'Maybe')
        page.screenshot(path=os.path.join(BASE, f'{key}-{label}-04-three.png'), full_page=True)
        browser.close()
    return r

for key in TOOLS:
    report[key] = {}
    for label, vp in [('desktop', {'width': 1440, 'height': 900}), ('mobile', {'width': 390, 'height': 844})]:
        try:
            report[key][label] = run_flow(key, label, vp)
        except Exception as e:
            report[key][label] = {'error': str(e)}

with open(os.path.join(BASE, 'verify-report.json'), 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

for key in TOOLS:
    cfg = TOOLS[key]
    print(f'\n========== {key} ({cfg["prefix"]}) ==========')
    for label in ['desktop', 'mobile']:
        r = report[key][label]
        if 'error' in r:
            print(f'  [{label}] FLOW ERROR: {r["error"]}')
            continue
        c = r['checks']
        print(f'  [{label} {r["viewport"]["width"]}w] deck22={c["deck_22"]}({c["deck_count"]}) stage_cut={c["stage_cut"]} flip={c["card_flipped"]}/{c["card_shows_front"]} noJump={c["no_big_jump"]} result={c["result_shown"]} meaning={c["has_meaning"]} stones={c["has_stones"]} cta={c["has_cta"]} shop={c["shop_link_ok"]} font14={c["font_min14"]} backSymReal={c["back_symbol_real"]} noLiteralBs={c["no_literal_backslash"]} noConsoleErr={c["no_console_errors"]} threeCards={c["three_cards_revealed"]}')
        if cfg['has_verdict']:
            print(f'             verdict(single)={r.get("verdict_label","")} valid={c.get("verdict_valid")} | verdict(three)={r.get("three_verdict","")} valid={c.get("three_verdict_valid")}')
        if r['console_errors']:
            print(f'             CONSOLE ERRORS: {r["console_errors"][:3]}')
