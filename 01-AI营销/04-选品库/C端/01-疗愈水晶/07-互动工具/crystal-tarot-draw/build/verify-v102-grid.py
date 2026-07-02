# -*- coding: utf-8 -*-
# Crown Tarot v10.2 线上验证 — deck grid 两行改造
# 验证: ① 桌面 grid 两行(无水平滚动, 22牌, minmax 135px) ② hover 浮起
#       ③ v10.1 全保留(focus必选/选满自动翻/爱情场景/三模式)
#       ④ 移动端 grid 2-3 列换行(无水平滚动)
import os, json
from playwright.sync_api import sync_playwright

URL = 'https://goearthward.com/tools/crystal-tarot-reading/'
OUT = os.path.dirname(os.path.abspath(__file__))
report = {}

def shot(page, name, full=False):
    try: page.screenshot(path=os.path.join(OUT, f'v102-{name}.png'), full_page=full)
    except Exception as e: print('shot fail', name, e)

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)

    # ============ 桌面 1280 ============
    ctx = browser.new_context(viewport={'width': 1280, 'height': 900}, device_scale_factor=1)
    page = ctx.new_page()
    errors = []
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    page.goto(URL + '?ver=v102grid', wait_until='domcontentloaded', timeout=60000)
    page.wait_for_timeout(2800)

    report['desktop_app_ready'] = page.evaluate('() => typeof window.ECTaro === "object"')
    deck_count = page.locator('#ect-deck .ect-card-back').count()
    report['desktop_deck_22'] = deck_count
    report['desktop_console_errors'] = errors[:8]

    # 关键: deck display=grid, 无 overflow-x
    deck_css = page.evaluate("""() => {
        const el = document.getElementById('ect-deck');
        const cs = getComputedStyle(el);
        return { display: cs.display, overflowX: cs.overflowX, gridTemplateColumns: cs.gridTemplateColumns };
    }""")
    report['desktop_deck_css'] = deck_css

    # 水平滚动检测: deck scrollWidth vs clientWidth
    deck_scroll = page.evaluate("""() => {
        const el = document.getElementById('ect-deck');
        return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, hasHScroll: el.scrollWidth > el.clientWidth + 2 };
    }""")
    report['desktop_deck_no_hscroll'] = not deck_scroll['hasHScroll']
    report['desktop_deck_scroll_metrics'] = deck_scroll

    # 22 牌分两行: 取每张牌 offsetTop, 看有几行
    rows_info = page.evaluate("""() => {
        const cards = document.querySelectorAll('#ect-deck .ect-card-back');
        const tops = new Set();
        cards.forEach(c => tops.add(c.offsetTop));
        const sortedTops = [...tops].sort((a,b)=>a-b);
        return { rowCount: sortedTops.length, distinctTops: sortedTops, cardCount: cards.length,
                 colCount: sortedTops.length ? Math.round(cards.length / sortedTops.length) : 0 };
    }""")
    report['desktop_grid_rows'] = rows_info['rowCount']
    report['desktop_grid_cols_approx'] = rows_info['colCount']
    report['desktop_grid_rows_detail'] = rows_info

    # 牌宽 (桌面 ~135px+)
    card_box = page.evaluate("""() => {
        const c = document.querySelector('#ect-deck .ect-card-back');
        const r = c.getBoundingClientRect();
        return { width: Math.round(r.width), height: Math.round(r.height) };
    }""")
    report['desktop_card_size'] = card_box
    shot(page, '01-desktop-grid-tworows')

    # hover 浮起: 鼠标移到第 5 张牌, 看 transform 是否含 translateY 负值
    # 先让 deck 进入 pickable(focus=love 满足 focusReady 后)
    page.select_option('#ect-focus', 'love')
    page.wait_for_timeout(300)
    hover_test = page.evaluate("""() => {
        const cards = document.querySelectorAll('#ect-deck .ect-card-back');
        const target = cards[4];
        const before = getComputedStyle(target).transform;
        // 模拟 hover: dispatchEvent unreliable for :hover; 用 :hover 经 CSS 无法 JS 触发
        // 改: 直接读 CSS rule (ect-deck-pickable .ect-card-back:hover transform)
        return { beforeTransform: before };
    }""")
    # 用真实 hover
    page.locator('#ect-deck .ect-card-back').nth(4).hover()
    page.wait_for_timeout(200)
    hover_after = page.evaluate("""() => {
        const cards = document.querySelectorAll('#ect-deck .ect-card-back');
        return getComputedStyle(cards[4]).transform;
    }""")
    report['desktop_hover_transform'] = hover_after
    report['desktop_hover_floats'] = 'translateY' in hover_after and hover_after != 'none'
    shot(page, '02-desktop-hover')

    # ============ v10.1 全保留: focus 必选 + 选满自动翻 + 爱情场景 ============
    # focus 已选 love, 选场景 thinking, single 模式, 点第一张牌 → 自动翻
    page.select_option('#ect-scenario', 'thinking')
    page.select_option('#ect-spread', 'single')
    page.wait_for_timeout(200)
    scenario_field_display = page.evaluate("() => getComputedStyle(document.getElementById('ect-scenario-field')).display")
    report['love_shows_scenario'] = scenario_field_display
    page.locator('#ect-deck .ect-card-back').first.click()
    page.wait_for_timeout(1300)
    flipped = page.locator('#ect-deck .ect-card-back.flipped').count()
    report['love_autoflip_count'] = flipped
    report['love_scenario_bar'] = page.locator('.ect-scenario-bar').count()
    shot(page, '03-love-autoflip')

    # focus 必选: focus 默认值校验 (reload 检查 placeholder)
    # 检查 focus select 第一 option value=""
    focus_first_opt = page.evaluate("() => document.getElementById('ect-focus').options[0].value")
    report['focus_placeholder_empty'] = (focus_first_opt == '')

    # 三模式: spread 有 single/three/free
    spread_opts = page.eval_on_selector_all('#ect-spread option', "els => els.map(e => e.value)")
    report['spread_modes'] = spread_opts

    # ============ 移动端 375 ============
    ctxm = browser.new_context(viewport={'width': 375, 'height': 812}, device_scale_factor=2, user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1')
    pagem = ctxm.new_page()
    pagem.goto(URL + '?ver=v102grid', wait_until='domcontentloaded', timeout=60000)
    pagem.wait_for_timeout(2800)
    deck_css_m = pagem.evaluate("""() => {
        const el = document.getElementById('ect-deck');
        const cs = getComputedStyle(el);
        return { display: cs.display, overflowX: cs.overflowX, gridTemplateColumns: cs.gridTemplateColumns };
    }""")
    report['mobile_deck_css'] = deck_css_m
    deck_scroll_m = pagem.evaluate("""() => {
        const el = document.getElementById('ect-deck');
        return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, hasHScroll: el.scrollWidth > el.clientWidth + 2 };
    }""")
    report['mobile_deck_no_hscroll'] = not deck_scroll_m['hasHScroll']
    rows_m = pagem.evaluate("""() => {
        const cards = document.querySelectorAll('#ect-deck .ect-card-back');
        const tops = new Set();
        cards.forEach(c => tops.add(c.offsetTop));
        const sorted = [...tops].sort((a,b)=>a-b);
        return { rowCount: sorted.length, colCount: sorted.length ? Math.round(cards.length / sorted.length) : 0 };
    }""")
    report['mobile_grid_rows'] = rows_m['rowCount']
    report['mobile_grid_cols_approx'] = rows_m['colCount']
    card_box_m = pagem.evaluate("""() => {
        const c = document.querySelector('#ect-deck .ect-card-back');
        const r = c.getBoundingClientRect();
        return { width: Math.round(r.width), height: Math.round(r.height) };
    }""")
    report['mobile_card_size'] = card_box_m
    shot(pagem, '04-mobile-grid')
    pagem.select_option('#ect-focus', 'love')
    pagem.wait_for_timeout(200)
    shot(pagem, '05-mobile-pickable')

    browser.close()

with open(os.path.join(OUT, 'verify-v102-report.json'), 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)
print('=== v10.2 grid verify ===')
print(json.dumps(report, ensure_ascii=False, indent=2))
