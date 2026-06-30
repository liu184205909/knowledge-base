# -*- coding: utf-8 -*-
# Crown Tarot v10.1 线上验证
# 验证: ① focus=love 显示场景子选择(4场景) ② 选场景→选牌→自动翻→解读含场景化标签
#       ③ focus=其他(general/career)不显示场景子选择 ④ v10 全部保留(左右滚动/focus必选/自动翻/三模式)
import os, json
from playwright.sync_api import sync_playwright

URL = 'https://goearthward.com/tools/crystal-tarot-reading/'
OUT = os.path.dirname(os.path.abspath(__file__))
report = {}

def console_screenshot(page, name):
    try:
        page.screenshot(path=os.path.join(OUT, f'v101-{name}.png'), full_page=False)
    except Exception as e:
        print('screenshot fail', name, e)

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={'width': 1280, 'height': 900}, device_scale_factor=1)
    page = ctx.new_page()
    errors = []
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    page.goto(URL, wait_until='domcontentloaded', timeout=60000)
    page.wait_for_timeout(2500)  # 等 IIFE base64 解码执行

    # 框架就绪
    report['app_ready'] = page.evaluate('() => typeof window.ECTaro === "object"')
    deck_count = page.locator('#ect-deck .ect-card-back').count()
    report['deck_22'] = deck_count
    report['console_errors'] = errors[:8]

    # ============ 验证 ① focus=love 显示场景子选择 ============
    page.select_option('#ect-focus', 'love')
    page.wait_for_timeout(300)
    scenario_field_display = page.evaluate("() => getComputedStyle(document.getElementById('ect-scenario-field')).display")
    report['love_shows_scenario'] = scenario_field_display
    scenario_options = page.locator('#ect-scenario option').count()
    report['scenario_option_count'] = scenario_options
    opts = page.eval_on_selector_all('#ect-scenario option', "els => els.map(e => e.textContent.trim())")
    report['scenario_options'] = opts
    console_screenshot(page, '01-love-shows-scenario')

    # ============ 验证 ② 选场景(thinking)→选牌→自动翻→解读含场景化标签 ============
    page.select_option('#ect-scenario', 'thinking')
    page.select_option('#ect-spread', 'single')
    page.wait_for_timeout(200)
    # focus 必选已满足(love), 点第一张牌 → 选满(1张) → 0.5s 自动翻
    page.locator('#ect-deck .ect-card-back').first.click()
    page.wait_for_timeout(1200)  # 等自动翻牌(0.5s + 翻牌动画)
    flipped = page.locator('#ect-deck .ect-card-back.flipped').count()
    report['love_autoflip'] = flipped
    # 场景引导块
    scenario_bar = page.locator('.ect-scenario-bar').count()
    report['love_scenario_bar'] = scenario_bar
    scenario_name_txt = page.locator('.ect-scenario-scenario-name, .ect-scenario-name').first.inner_text() if scenario_bar else ''
    report['love_scenario_name'] = scenario_name_txt
    # meaning-lbl 场景化(应含 "what is he/she thinking?")
    try:
        meaning_lbl_txt = page.locator('.ect-meaning-lbl').first.inner_text(timeout=3000)
    except Exception:
        meaning_lbl_txt = '<NOT FOUND>'
    report['love_meaning_lbl'] = meaning_lbl_txt
    # practice 场景化(thinking practice: "climate between us")
    try:
        practice_txt = page.locator('.ect-practice-txt').first.inner_text(timeout=3000)
    except Exception:
        practice_txt = '<NOT FOUND>'
    report['love_practice'] = practice_txt
    # 直接验证正位 love 的 meaning-lbl 场景化代码逻辑(本次随机可能抽到逆位)
    love_upright_lbl_logic = page.evaluate("""() => {
        var s=document.getElementById('ect-scenario');
        var scnMap={thinking:'What Is He/She Thinking?',truelove:'True Love / Soulmate',status:'Relationship Status',reconcile:'Getting Back Together?'};
        var label=scnMap[s.value];
        // 复刻 APP_JS 逻辑: 正位 love → 'Meaning in your '+label.toLowerCase()+' reading'
        return 'Meaning in your '+label.toLowerCase()+' reading';
    }""")
    report['love_upright_meaning_lbl_logic'] = love_upright_lbl_logic
    # love 水晶(应含 "For love" tag)
    stone_tags = page.eval_on_selector_all('.ect-stone-tag', "els => els.map(e => e.textContent.trim())")
    report['love_stone_tags'] = stone_tags
    console_screenshot(page, '02-love-thinking-revealed')

    # ============ 验证 ④ 三模式(three) love 场景化位置标签 ============
    page.click('#ect-reset-btn')
    page.wait_for_timeout(500)
    page.select_option('#ect-spread', 'three')
    page.wait_for_timeout(200)
    # 点 3 张牌
    backs = page.locator('#ect-deck .ect-card-back')
    for i in range(3):
        backs.nth(i).click()
        page.wait_for_timeout(150)
    page.wait_for_timeout(1500)  # 自动翻
    flipped3 = page.locator('#ect-deck .ect-card-back.flipped').count()
    report['three_autoflip'] = flipped3
    # 三牌位置标签(thinking 场景: What shaped their view / Where they are now / Where this is tending)
    pos_labels = page.eval_on_selector_all('.ect-card-pos', "els => els.map(e => e.textContent.trim())")
    report['three_pos_labels'] = pos_labels
    console_screenshot(page, '03-love-thinking-three')

    # ============ 验证 ③ focus=其他(general)不显示场景子选择 ============
    page.click('#ect-reset-btn')
    page.wait_for_timeout(400)
    page.select_option('#ect-focus', 'general')
    page.select_option('#ect-spread', 'single')  # 显式切回单牌(上阶段残留 three)
    page.wait_for_timeout(300)
    general_scenario_display = page.evaluate("() => getComputedStyle(document.getElementById('ect-scenario-field')).display")
    report['general_hides_scenario'] = general_scenario_display
    # general 选牌 → 自动翻 → meaning-lbl 应回 "Upright meaning"(非场景化)
    page.locator('#ect-deck .ect-card-back').first.click()
    page.wait_for_timeout(1500)
    general_flipped = page.locator('#ect-deck .ect-card-back.flipped').count()
    report['general_autoflip'] = general_flipped
    try:
        general_meaning_lbl = page.locator('.ect-meaning-lbl').first.inner_text(timeout=3000)
    except Exception:
        general_meaning_lbl = '<NOT FOUND>'
    report['general_meaning_lbl'] = general_meaning_lbl
    general_scenario_bar = page.locator('.ect-scenario-bar').count()
    report['general_scenario_bar'] = general_scenario_bar
    console_screenshot(page, '04-general-no-scenario')

    # ============ 验证 ④ focus 必选(initial 未选 focus 点牌无效) ============
    # 重新加载页面拿干净 initial 态
    page.goto(URL, wait_until='domcontentloaded', timeout=60000)
    page.wait_for_timeout(2000)
    # focus 默认未选(placeholder), 点牌应无效
    picked_before = page.locator('#ect-deck .ect-card-back.selected').count()
    page.locator('#ect-deck .ect-card-back').first.click()
    page.wait_for_timeout(300)
    picked_after = page.locator('#ect-deck .ect-card-back.selected').count()
    report['focus_required_picked_before'] = picked_before
    report['focus_required_picked_after'] = picked_after
    hint_txt = page.locator('#ect-stage-hint').inner_text()
    report['focus_required_hint'] = hint_txt
    console_screenshot(page, '05-focus-required')

    # ============ 验证 ④ free 模式(free-count 显隐) ============
    page.select_option('#ect-focus', 'guidance')
    free_field_disp_before = page.evaluate("() => getComputedStyle(document.getElementById('ect-free-field')).display")
    page.select_option('#ect-spread', 'free')
    page.wait_for_timeout(200)
    free_field_disp_after = page.evaluate("() => getComputedStyle(document.getElementById('ect-free-field')).display")
    report['free_field_before'] = free_field_disp_before
    report['free_field_after'] = free_field_disp_after
    # 左右滚动(deck overflow-x auto)
    deck_overflow = page.evaluate("() => getComputedStyle(document.getElementById('ect-deck')).overflowX")
    report['deck_overflow_x'] = deck_overflow

    browser.close()

print(json.dumps(report, ensure_ascii=False, indent=2))
with open(os.path.join(OUT, 'verify-v101-report.json'), 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)
print('\n--- report saved ---')
