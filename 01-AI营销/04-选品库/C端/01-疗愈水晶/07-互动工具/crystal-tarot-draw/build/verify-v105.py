# -*- coding: utf-8 -*-
# Crown Tarot v10.5 线上验证 — 每行 11 张完整可见 + 滚动效果优化(桌面无溢出→滚动条自动隐藏)
# 核心断言(对比 v10.4 的"每行 10 张需滚动"):
#   ① 每行 11 张牌全部完整可见(无水平溢出): row scrollWidth <= clientWidth + 2, 22 张两行 11+11
#   ② 桌面统一滚动条自动隐藏(因无溢出 horizontalMode=false): .ect-deck-scrollbar 无 ect-sb-show
#   ③ 牌大小 ~108px(自适应填满 11 张) + 卡牌矮 142px(v10.4 沿用)
#   ④ v10.4 保留回归: 两行 11+11 / 删圈圈(back-inner 无 border) / 自动翻 / 爱情场景显隐 / 三模式
#   ⑤ 移动端 grid 换行(无水平滚动)
import os, json
from playwright.sync_api import sync_playwright

URL = 'https://goearthward.com/tools/crystal-tarot-reading/?ver=v105'
OUT = os.path.dirname(os.path.abspath(__file__))
report = {}

def shot(page, name, full=False):
    try: page.screenshot(path=os.path.join(OUT, f'v105-{name}.png'), full_page=full)
    except Exception as e: print('shot fail', name, e)

with sync_playwright() as pw:

    # ============ 桌面 1280 ============
    ctx = pw.chromium.launch_persistent_context('', viewport={'width': 1280, 'height': 900}, headless=True, device_scale_factor=1)
    page = ctx.new_page()
    errors = []
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    page.goto(URL, wait_until='domcontentloaded', timeout=60000)
    page.wait_for_timeout(3000)

    report['desktop_app_ready'] = page.evaluate('() => typeof window.ECTaro === "object"')
    deck_count = page.locator('#ect-deck .ect-card-back').count()
    report['desktop_deck_22'] = deck_count
    report['desktop_console_errors'] = errors[:8]

    # ① 行数与每行牌数(两行 11+11)
    rows_info = page.evaluate("""() => {
        const rows = document.querySelectorAll('#ect-deck .ect-deck-row');
        const perRow = [];
        rows.forEach(r => perRow.push(r.querySelectorAll('.ect-card-back').length));
        return { rowCount: rows.length, perRow: perRow };
    }""")
    report['desktop_rows'] = rows_info
    report['two_rows_11_11'] = (rows_info['rowCount'] == 2 and rows_info['perRow'] == [11, 11])

    # ① 核心: 每行无水平溢出(11 张全可见) — 两行都查
    overflow = page.evaluate("""() => {
        const rows = document.querySelectorAll('#ect-deck .ect-deck-row');
        const out = [];
        rows.forEach((r, i) => {
            out.push({ row: i, scrollWidth: r.scrollWidth, clientWidth: r.clientWidth,
                       hasHOverflow: r.scrollWidth > r.clientWidth + 2,
                       overflowPx: r.scrollWidth - r.clientWidth });
        });
        return out;
    }""")
    report['desktop_overflow_per_row'] = overflow
    report['desktop_no_h_overflow'] = all(not r['hasHOverflow'] for r in overflow)

    # ② 桌面统一滚动条应隐藏(无溢出 → JS 不加 ect-sb-show)
    sb_info = page.evaluate("""() => {
        const sb = document.querySelector('#ect-deck .ect-deck-scrollbar');
        if (!sb) return { found: false };
        return { found: true, hasShowClass: sb.classList.contains('ect-sb-show'),
                 display: getComputedStyle(sb).display,
                 visible: sb.offsetWidth > 0 && sb.offsetHeight > 0 };
    }""")
    report['desktop_scrollbar_info'] = sb_info
    # v10.5 核心: 无溢出时滚动条应隐藏(无 ect-sb-show 类, display=none)
    report['desktop_scrollbar_auto_hidden'] = (sb_info.get('found') and not sb_info.get('hasShowClass') and sb_info.get('display') == 'none')

    # ③ 牌大小(自适应 ~108px) + 卡牌矮(142px) + 11 张牌实际宽度合计 vs 行宽
    card_metrics = page.evaluate("""() => {
        const cards = document.querySelectorAll('#ect-deck .ect-card-back');
        const row = document.querySelector('#ect-deck .ect-deck-row');
        if (!cards.length || !row) return null;
        const c0 = cards[0].getBoundingClientRect();
        const rowRect = row.getBoundingClientRect();
        // 第一行 11 张牌的右边界 - 第一张左边界 = 11 张占用宽度(含 gap)
        const firstRowCards = [...row.querySelectorAll('.ect-card-back')];
        const firstLeft = firstRowCards[0].getBoundingClientRect().left;
        const lastRect = firstRowCards[firstRowCards.length - 1].getBoundingClientRect();
        return {
            cardWidth: Math.round(c0.width),
            cardHeight: Math.round(c0.height),
            rowClientWidth: row.clientWidth,
            firstCardLeft: Math.round(firstLeft),
            lastCardRight: Math.round(lastRect.right),
            elevenCardsSpan: Math.round(lastRect.right - firstLeft),
            rowVisibleWidth: Math.round(rowRect.width)
        };
    }""")
    report['desktop_card_metrics'] = card_metrics
    # 牌宽应在 96-134 之间(min/max), 高度 ~142
    if card_metrics:
        report['card_width_in_range'] = (96 <= card_metrics['cardWidth'] <= 134)
        report['card_height_short'] = (130 <= card_metrics['cardHeight'] <= 150)
        # 11 张牌总占宽 <= 行可视宽(无裁剪)
        report['eleven_cards_fit_row'] = (card_metrics['elevenCardsSpan'] <= card_metrics['rowVisibleWidth'] + 2)

    # ④ 删圈圈(v10.4 保留): .ect-back-inner border=none
    inner_info = page.evaluate("""() => {
        const inner = document.querySelector('#ect-deck .ect-back-inner');
        if(!inner) return {found:false};
        const cs = getComputedStyle(inner);
        return { found:true, border: cs.border, borderTopWidth: cs.borderTopWidth, borderStyle: cs.borderTopStyle, borderRadius: cs.borderRadius };
    }""")
    report['back_inner_info'] = inner_info
    report['circle_removed'] = (inner_info.get('found') and (
        inner_info.get('borderTopWidth') == '0px' or inner_info.get('borderStyle') == 'none' or 'none' in (inner_info.get('border') or '')))

    shot(page, '01-desktop-11-per-row-full-visible')

    # ④ v10.4 回归: 自动翻 three + 爱情场景显隐 + 三模式
    page.select_option('#ect-focus', 'general')
    page.select_option('#ect-spread', 'three')
    page.wait_for_timeout(200)
    for k in range(3):
        page.locator('#ect-deck .ect-card-back').nth(k).click()
        page.wait_for_timeout(120)
    page.wait_for_timeout(900)
    flipped = page.locator('#ect-deck .ect-card-back.flipped').count()
    report['autoflip_3'] = flipped
    report['autoflip_works'] = (flipped >= 3)
    shot(page, '02-autoflip-three')

    # 爱情场景显隐
    try:
        page.get_by_role('button', name='Draw Again').click()
        page.wait_for_timeout(300)
    except Exception: pass
    page.select_option('#ect-focus', 'love')
    page.wait_for_timeout(250)
    scn_show = page.evaluate("() => { const f=document.getElementById('ect-scenario-field'); return f ? getComputedStyle(f).display : 'absent'; }")
    page.select_option('#ect-focus', 'career')
    page.wait_for_timeout(250)
    scn_hide = page.evaluate("() => { const f=document.getElementById('ect-scenario-field'); return f ? getComputedStyle(f).display : 'absent'; }")
    report['scenario_show_on_love'] = (scn_show != 'none')
    report['scenario_hide_on_non_love'] = (scn_hide == 'none')

    spreads = page.evaluate("""() => {
        const s=document.getElementById('ect-spread');
        return s ? [...s.options].map(o=>o.value) : [];
    }""")
    report['three_spreads'] = spreads

    # ============ 移动 390 ============
    ctx2 = pw.chromium.launch_persistent_context('', viewport={'width': 390, 'height': 840}, headless=True, device_scale_factor=2)
    mpage = ctx2.new_page()
    m_errs = []
    mpage.on('pageerror', lambda e: m_errs.append(str(e)))
    mpage.goto(URL, wait_until='domcontentloaded', timeout=60000)
    mpage.wait_for_timeout(2800)
    m_rows = mpage.evaluate("""() => {
        const rows = document.querySelectorAll('#ect-deck .ect-deck-row');
        const cs = rows[0] ? getComputedStyle(rows[0]) : null;
        return {
            rowCount: rows.length,
            display: cs ? cs.display : null,
            gridCols: cs ? cs.gridTemplateColumns : null,
            overflowX: cs ? cs.overflowX : null,
            row0CardCount: rows[0] ? rows[0].querySelectorAll('.ect-card-back').length : 0,
            scrollWidth: rows[0] ? rows[0].scrollWidth : 0,
            clientWidth: rows[0] ? rows[0].clientWidth : 0
        };
    }""")
    report['mobile_rows_grid'] = m_rows
    m_card = mpage.evaluate("""() => {
        const c = document.querySelector('#ect-deck .ect-card-back');
        const r = c.getBoundingClientRect();
        return { width: Math.round(r.width), height: Math.round(r.height) };
    }""")
    report['mobile_card_size'] = m_card
    m_sb = mpage.evaluate("""() => {
        const sb = document.querySelector('#ect-deck .ect-deck-scrollbar');
        return { visible: sb ? (sb.offsetWidth > 0 && sb.offsetHeight > 0) : false };
    }""")
    report['mobile_scrollbar_hidden'] = (not m_sb['visible'])
    shot(mpage, '03-mobile-grid-wrap')
    report['mobile_console_errors'] = m_errs[:5]

    ctx.close(); ctx2.close()

# 写报告
with open(os.path.join(OUT, 'verify-v105-report.json'), 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

# 摘要
print('=' * 60)
print('v10.5 验证摘要')
print('=' * 60)
print(f"app ready:                  {report.get('desktop_app_ready')}")
print(f"deck 22 张:                 {report.get('desktop_deck_22')}")
print(f"两行 11+11:                 {report.get('two_rows_11_11')}  detail={report.get('desktop_rows')}")
print(f"[核心] 桌面无水平溢出:      {report.get('desktop_no_h_overflow')}  detail={report.get('desktop_overflow_per_row')}")
print(f"[核心] 滚动条自动隐藏:      {report.get('desktop_scrollbar_auto_hidden')}  detail={report.get('desktop_scrollbar_info')}")
cm = report.get('desktop_card_metrics') or {}
print(f"[核心] 牌大小(宽~108/高142): {cm}  widthInRange={report.get('card_width_in_range')}  heightShort={report.get('card_height_short')}")
print(f"[核心] 11张牌总占宽<=行宽:   {report.get('eleven_cards_fit_row')}")
print(f"删圈圈(v10.4):              {report.get('circle_removed')}")
print(f"自动翻 three(≥3):           {report.get('autoflip_works')}  flipped={report.get('autoflip_3')}")
print(f"爱情场景 love显/非love隐:   {report.get('scenario_show_on_love')} / {report.get('scenario_hide_on_non_love')}")
print(f"三模式:                     {report.get('three_spreads')}")
print(f"移动端 grid 换行:           {report.get('mobile_rows_grid')}")
print(f"移动卡牌尺寸:               {report.get('mobile_card_size')}")
print(f"移动端滚动条隐藏:           {report.get('mobile_scrollbar_hidden')}")
print(f"console errors:             desktop={report.get('desktop_console_errors')}  mobile={report.get('mobile_console_errors')}")
print('=' * 60)
