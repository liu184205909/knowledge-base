# -*- coding: utf-8 -*-
# Crown Tarot v10.4 线上验证 — 滚动统一+拖动 / 卡牌矮 / 删圈圈
# 验证:
#  ① 一个统一滚动条(非两个): 两行原生滚动条隐藏 + 底部 1 个 .ect-deck-scrollbar 显示
#  ② 两行同步滚动 + 鼠标拖动卡牌滚动(drag to scroll): 设 row0 scrollLeft → row1 同步; mousedown+move 拖动改 scrollLeft
#  ③ 卡牌矮: 桌面牌高 ~142px(比 v10.3 176 矮)
#  ④ 删圈圈: .ect-back-inner border=none / borderRadius=0(无外圈装饰)
#  ⑤ v10.3 全保留: 两行 11+11 / focus 必选 / 选满自动翻 / 爱情场景显隐 / 三模式
import os, json
from playwright.sync_api import sync_playwright

URL = 'https://goearthward.com/tools/crystal-tarot-reading/?ver=v104'
OUT = os.path.dirname(os.path.abspath(__file__))
report = {}

def shot(page, name, full=False):
    try: page.screenshot(path=os.path.join(OUT, f'v104-{name}.png'), full_page=full)
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

    # 行数与每行牌数(两行 11+11)
    rows_info = page.evaluate("""() => {
        const rows = document.querySelectorAll('#ect-deck .ect-deck-row');
        const perRow = [];
        rows.forEach(r => perRow.push(r.querySelectorAll('.ect-card-back').length));
        return { rowCount: rows.length, perRow: perRow };
    }""")
    report['desktop_rows'] = rows_info

    # ① 一个统一滚动条: 两行原生滚动条 height(隐藏=0 或 webkit display none) + scrollbar 数量=1 + 显示
    sb_info = page.evaluate("""() => {
        const rows = document.querySelectorAll('#ect-deck .ect-deck-row');
        const rowNative = [];
        rows.forEach(r => {
            const cs = getComputedStyle(r);
            rowNative.push({scrollbarWidth: cs.scrollbarWidth, overflowX: cs.overflowX});
        });
        const sbs = document.querySelectorAll('#ect-deck .ect-deck-scrollbar');
        const sb = sbs[0] || null;
        const sbDisplay = sb ? getComputedStyle(sb).display : 'none';
        const sbVisible = sb ? (sb.classList.contains('ect-sb-show') && sb.offsetWidth > 0 && sb.offsetHeight > 0) : false;
        return { rowCount: rows.length, nativeScrollbar: rowNative, scrollbarCount: sbs.length, sbDisplay: sbDisplay, sbVisible: sbVisible };
    }""")
    report['scrollbar_info'] = sb_info
    # 关键断言: 只有一个统一滚动条 + 它可见; 两行原生滚动条 firefox scrollbar-width=none
    report['one_unified_scrollbar'] = (sb_info['scrollbarCount'] == 1 and sb_info['sbVisible'])
    report['native_scrollbars_hidden'] = all(x['scrollbarWidth'] == 'none' for x in sb_info['nativeScrollbar'])

    # 横向溢出确认(桌面应有水平滚动: scrollWidth > clientWidth)
    overflow = page.evaluate("""() => {
        const r0 = document.querySelector('#ect-deck .ect-deck-row');
        return { scrollWidth: r0.scrollWidth, clientWidth: r0.clientWidth, hasHOverflow: r0.scrollWidth > r0.clientWidth + 2 };
    }""")
    report['desktop_h_overflow'] = overflow['hasHOverflow']
    report['desktop_overflow_metrics'] = overflow

    # ③ 卡牌高度(矮 ~142)
    card_box = page.evaluate("""() => {
        const c = document.querySelector('#ect-deck .ect-card-back');
        const r = c.getBoundingClientRect();
        return { width: Math.round(r.width), height: Math.round(r.height) };
    }""")
    report['desktop_card_size'] = card_box
    report['card_is_shorter'] = (card_box['height'] is not None and card_box['height'] <= 150 and card_box['height'] >= 130)

    # ④ 删圈圈: .ect-back-inner border 与 borderRadius
    inner_info = page.evaluate("""() => {
        const inner = document.querySelector('#ect-deck .ect-back-inner');
        if(!inner) return {found:false};
        const cs = getComputedStyle(inner);
        return { found:true, border: cs.border, borderTopWidth: cs.borderTopWidth, borderStyle: cs.borderTopStyle, borderRadius: cs.borderRadius };
    }""")
    report['back_inner_info'] = inner_info
    report['circle_removed'] = (inner_info.get('found') and (
        inner_info.get('borderTopWidth') == '0px' or inner_info.get('borderStyle') == 'none' or inner_info.get('border') == '' or 'none' in (inner_info.get('border') or '')))

    shot(page, '01-desktop-deck-short-cards-nocircle')

    # ② 两行同步 + drag to scroll
    # 先选 focus 进入 pickable
    page.select_option('#ect-focus', 'love')
    page.wait_for_timeout(400)

    # drag to scroll 先测(归零起点, 避免被后续操作推到 max 附近)
    page.evaluate("() => { document.querySelectorAll('#ect-deck .ect-deck-row')[0].scrollLeft = 0; }")
    page.wait_for_timeout(200)
    card0_scroll_before = page.evaluate("() => document.querySelectorAll('#ect-deck .ect-deck-row')[0].scrollLeft")
    cards = page.locator('#ect-deck .ect-card-back')
    target = cards.nth(5)
    box = target.bounding_box()
    cx0 = box['x'] + box['width']/2
    cy0 = box['y'] + box['height']/2
    page.mouse.move(cx0, cy0)
    page.mouse.down()
    page.wait_for_timeout(80)
    page.mouse.move(cx0 - 200, cy0, steps=12)  # 向左拖 200px → scrollLeft 增大
    page.wait_for_timeout(100)
    card0_scroll_after_drag = page.evaluate("() => document.querySelectorAll('#ect-deck .ect-deck-row')[0].scrollLeft")
    drag_dragging = page.evaluate("() => document.querySelector('#ect-deck .ect-deck-row').classList.contains('ect-dragging')")
    page.mouse.up()
    page.wait_for_timeout(150)
    report['drag_to_scroll'] = {
        'before': card0_scroll_before,
        'after_drag': card0_scroll_after_drag,
        'dragging_class': drag_dragging,
        'worked': card0_scroll_after_drag > card0_scroll_before + 30  # 拖动应明显增大 scrollLeft
    }

    # 两行同步: 归零后设 row0.scrollLeft=60 → 检查 row1.scrollLeft 是否同步
    page.evaluate("() => { document.querySelectorAll('#ect-deck .ect-deck-row')[0].scrollLeft = 0; }")
    page.wait_for_timeout(150)
    sync_test = page.evaluate("""() => {
        const rows = document.querySelectorAll('#ect-deck .ect-deck-row');
        if(rows.length < 2) return {sync:false, reason:'<2 rows'};
        rows[0].scrollLeft = 60;
        return new Promise(res => {
            requestAnimationFrame(() => requestAnimationFrame(() => {
                res({row0: rows[0].scrollLeft, row1: rows[1].scrollLeft, sync: Math.abs(rows[0].scrollLeft - rows[1].scrollLeft) < 3});
            }));
        });
    }""")
    report['rows_sync'] = sync_test

    # thumb 跟随: 设 scrollLeft 后 thumb 的 left 应非 0
    thumb_test = page.evaluate("""() => {
        const thumb = document.querySelector('#ect-deck .ect-deck-thumb');
        if(!thumb) return {found:false};
        return {found:true, left: thumb.style.left || getComputedStyle(thumb).left, width: thumb.style.width || getComputedStyle(thumb).width};
    }""")
    report['thumb_follow'] = thumb_test
    # 拖动后 cursor 应为 grabbing(拖动中)/grab(默认); 至少 row 有 cursor 设置
    cursor_info = page.evaluate("""() => {
        const r = document.querySelector('#ect-deck .ect-deck-row');
        return { cursor: getComputedStyle(r).cursor };
    }""")
    report['drag_cursor'] = cursor_info

    shot(page, '02-desktop-after-drag')

    # ⑤ v10.3 保留: focus 必选(未选 focus 点牌无效) — 已选 love, 测试 general 之外; 验证 stage-hint 文案
    # 选牌自动翻: 选 needed 张牌 → 等 0.6s → 检查 flipped
    page.select_option('#ect-focus', 'general')
    page.select_option('#ect-spread', 'three')
    page.wait_for_timeout(200)
    # 选 3 张
    picked_scroll_before = page.evaluate("() => document.querySelectorAll('#ect-deck .ect-deck-row')[0].scrollLeft=0")
    for k in range(3):
        page.locator('#ect-deck .ect-card-back').nth(k).click()
        page.wait_for_timeout(120)
    page.wait_for_timeout(900)  # 选满 0.5s 自动翻 + 翻牌动画
    flipped = page.locator('#ect-deck .ect-card-back.flipped').count()
    report['autoflip_3'] = flipped
    report['autoflip_works'] = (flipped >= 3)
    shot(page, '03-autoflip-three')

    # 爱情场景显隐: focus=love → scenario field 显示; focus=general → 隐藏
    page.get_by_role('button', name='Draw Again').click() if page.get_by_role('button', name='Draw Again').count() else None
    page.wait_for_timeout(300)
    page.select_option('#ect-focus', 'love')
    page.wait_for_timeout(250)
    scn_show = page.evaluate("() => { const f=document.getElementById('ect-scenario-field'); return f ? getComputedStyle(f).display : 'absent'; }")
    page.select_option('#ect-focus', 'career')
    page.wait_for_timeout(250)
    scn_hide = page.evaluate("() => { const f=document.getElementById('ect-scenario-field'); return f ? getComputedStyle(f).display : 'absent'; }")
    report['scenario_show_on_love'] = (scn_show != 'none')
    report['scenario_hide_on_non_love'] = (scn_hide == 'none')

    # 三模式(spread 选项)
    spreads = page.evaluate("""() => {
        const s=document.getElementById('ect-spread');
        return s ? [...s.options].map(o=>o.value) : [];
    }""")
    report['three_spreads'] = spreads

    # ============ 移动 390 ============
    ctx2 = pw.chromium.launch_persistent_context('', viewport={'width': 390, 'height': 840}, headless=True, device_scale_factor=2)
    mpage = ctx2.new_page()
    m_report_errs = []
    mpage.on('pageerror', lambda e: m_report_errs.append(str(e)))
    mpage.goto(URL, wait_until='domcontentloaded', timeout=60000)
    mpage.wait_for_timeout(2800)
    m_card = mpage.evaluate("""() => {
        const c = document.querySelector('#ect-deck .ect-card-back');
        const r = c.getBoundingClientRect();
        return { width: Math.round(r.width), height: Math.round(r.height) };
    }""")
    report['mobile_card_size'] = m_card
    # 移动端 grid 模式 → 统一滚动条应隐藏
    m_sb = mpage.evaluate("""() => {
        const sb = document.querySelector('#ect-deck .ect-deck-scrollbar');
        return { visible: sb ? (sb.offsetWidth > 0 && sb.offsetHeight > 0) : false, display: sb ? getComputedStyle(sb).display : 'absent' };
    }""")
    report['mobile_scrollbar_hidden'] = (not m_sb['visible'])
    shot(mpage, '04-mobile-grid-noscroll')
    report['mobile_console_errors'] = m_report_errs[:5]

    ctx.close(); ctx2.close()

# 写报告
with open(os.path.join(OUT, 'verify-v104-report.json'), 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

# 摘要
print('=' * 60)
print('v10.4 验证摘要')
print('=' * 60)
print(f"app ready:                {report.get('desktop_app_ready')}")
print(f"deck 22 张:               {report.get('desktop_deck_22')}")
print(f"两行 11+11:               {report.get('desktop_rows')}")
print(f"一个统一滚动条:           {report.get('one_unified_scrollbar')}  (count={sb_info['scrollbarCount']}, visible={sb_info['sbVisible']})")
print(f"原生滚动条隐藏:           {report.get('native_scrollbars_hidden')}")
print(f"桌面有横向溢出:           {report.get('desktop_h_overflow')}")
print(f"两行同步滚动:             {report.get('rows_sync')}")
print(f"thumb 跟随:               {report.get('thumb_follow')}")
print(f"drag to scroll:           {report.get('drag_to_scroll')}")
print(f"卡牌矮(~142):             {report.get('desktop_card_size')}  shorter={report.get('card_is_shorter')}")
print(f"删圈圈(back-inner 无border): {report.get('circle_removed')}  detail={report.get('back_inner_info')}")
print(f"自动翻 three(≥3):         {report.get('autoflip_works')}  flipped={report.get('autoflip_3')}")
print(f"爱情场景 love 显 / 非 love 隐: {report.get('scenario_show_on_love')} / {report.get('scenario_hide_on_non_love')}")
print(f"三模式:                   {report.get('three_spreads')}")
print(f"移动卡牌尺寸:             {report.get('mobile_card_size')}")
print(f"移动端统一滚动条隐藏:     {report.get('mobile_scrollbar_hidden')}")
print(f"console errors:           desktop={report.get('desktop_console_errors')}  mobile={report.get('mobile_console_errors')}")
print('=' * 60)
print('截图: v104-01..04-desktop-after-drag / autoflip-three / mobile-grid-noscroll')
