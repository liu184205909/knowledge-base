# -*- coding: utf-8 -*-
# Crown Tarot v10.6 线上验证 — 翻牌结果卡金色外扩 + 文字区加宽
# 核心断言(对比 v10.5 的"翻牌后绿色边框/光晕"):
#   ① 详细解读结果卡(.ect-card) border 金 #CFAA3E + 金色外扩 box-shadow(0 0 0 5px rgba(207,170,62,.22))
#   ② 牌体(.ect-card-body) padding 加宽(26→32px 上下, 32px 左右)
#   ③ 牌头(.ect-card-head) 底边 3px 金线
#   ④ Deck 翻开牌(.ect-card-back.flipped/.ect-is-front) border 金 + 金色外扩(无绿色 selected 光晕残留)
#   ⑤ 翻牌流程不破(focus→选牌→自动翻→结果卡显示)
import os, json
from playwright.sync_api import sync_playwright

URL = 'https://goearthward.com/tools/crystal-tarot-reading/?ver=v106'
OUT = os.path.dirname(os.path.abspath(__file__))
report = {}

def probe_css(page):
    return page.evaluate("""() => {
      const r = {};
      const c = document.querySelector('.ect-card');
      const head = document.querySelector('.ect-card-head');
      const body = document.querySelector('.ect-card-body');
      const pos = document.querySelector('.ect-card-pos');
      const flip = document.querySelector('.ect-card-back.flipped');
      if (c) { const cs = getComputedStyle(c); r.card_border = cs.borderTopColor; r.card_border_width = cs.borderTopWidth; r.card_shadow = cs.boxShadow.slice(0, 90); }
      if (head) { const hs = getComputedStyle(head); r.head_padding = hs.padding; r.head_border_bottom = hs.borderBottomColor + '/' + hs.borderBottomWidth; }
      if (body) { r.body_padding = getComputedStyle(body).padding; }
      if (pos) { r.pos_bg = getComputedStyle(pos).backgroundColor; r.pos_color = getComputedStyle(pos).color; }
      if (flip) { const fs = getComputedStyle(flip); r.flip_border = fs.borderTopColor; r.flip_shadow = fs.boxShadow.slice(0, 90); }
      return r;
    }""")

with sync_playwright() as pw:
    ctx = pw.chromium.launch_persistent_context('', viewport={'width': 1280, 'height': 900}, headless=True, device_scale_factor=1)
    page = ctx.new_page()
    page.goto(URL, wait_until='domcontentloaded', timeout=60000)
    page.wait_for_timeout(3500)

    report['app_ready'] = page.evaluate('() => typeof window.ECTaro === "object"')
    report['deck_22'] = page.locator('#ect-deck .ect-card-back').count()

    # 选 focus=general, spread=three
    page.select_option('#ect-focus', 'general')
    page.select_option('#ect-spread', 'three')
    page.wait_for_timeout(300)
    # 点前 3 张
    for i in range(3):
        page.locator('#ect-deck .ect-card-back').nth(i).click()
        page.wait_for_timeout(150)
    # 等自动翻牌 + 动画
    page.wait_for_timeout(2000)

    report['flipped_count'] = page.locator('#ect-card-back.flipped, .ect-card-back.flipped').count()
    report['result_card_count'] = page.locator('.ect-card').count()
    report['css'] = probe_css(page)

    # 截图 deck 翻开区
    try: page.locator('#ect-deck').first.screenshot(path=os.path.join(OUT, 'v106-01-deck-flipped.png'))
    except Exception as e: print('deck shot fail', e)
    # 截图第一张详细解读卡
    try: page.locator('.ect-card').first.screenshot(path=os.path.join(OUT, 'v106-02-result-card.png'))
    except Exception as e: print('card shot fail', e)
    # 整页
    try: page.screenshot(path=os.path.join(OUT, 'v106-03-full-after-flip.png'), full_page=True)
    except Exception as e: print('full shot fail', e)

    ctx.close()

with open(os.path.join(OUT, 'verify-v106-report.json'), 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)
print('REPORT:', json.dumps(report, ensure_ascii=False, indent=2))
print('v10.6 verify done')
