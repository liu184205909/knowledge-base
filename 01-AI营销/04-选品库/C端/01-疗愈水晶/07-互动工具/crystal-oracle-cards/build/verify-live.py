# -*- coding: utf-8 -*-
# 线上验证: crystal-oracle-cards (page 48074)
import json
from playwright.sync_api import sync_playwright

URL = 'https://goearthward.com/tools/crystal-oracle-cards/'

def run(label, vw, vh):
    r = {'checks': {}, 'console_errors': []}
    with sync_playwright() as pw:
        b = pw.chromium.launch(headless=True)
        ctx = b.new_context(viewport={'width': vw, 'height': vh})
        page = ctx.new_page()
        page.on('console', lambda m: r['console_errors'].append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: r['console_errors'].append('pageerror: ' + e.message))
        resp = page.goto(URL, wait_until='domcontentloaded', timeout=60000)
        r['checks']['http_200'] = resp.status == 200
        page.wait_for_timeout(1500)
        c = r['checks']
        c['deck_has_backs'] = page.locator('#eoc-deck .eoc-card-back').count() > 0
        c['deck_backs_le_36'] = page.locator('#eoc-deck .eoc-card-back').count() <= 36
        # intent: love
        page.select_option('#eoc-intent', 'love')
        page.wait_for_timeout(400)
        page.click('#eoc-shuffle-btn')
        page.wait_for_timeout(700)
        page.click('#eoc-cut-btn')
        page.wait_for_timeout(1100)
        backs = page.locator('#eoc-deck .eoc-card-back').all()
        backs[3].click()
        page.wait_for_timeout(300)
        c['validate_shown'] = page.evaluate("()=>{const e=document.getElementById('eoc-validate-btn');return e&&e.style.display!=='none';}")
        page.click('#eoc-validate-btn')
        page.wait_for_timeout(1700)
        c['flipped_to_front'] = page.evaluate("""()=>{const e=document.querySelector('#eoc-deck .eoc-card-back.flipped');return e?!!e.querySelector('.eoc-front-name'):false;}""")
        c['result_shown'] = page.evaluate("()=>{const e=document.getElementById('eoc-result');return e&&e.style.display!=='none';}")
        c['has_guidance'] = page.locator('.eoc-guidance').count() > 0
        c['has_shop_cta'] = page.locator('.eoc-cta-primary').count() > 0
        info = page.evaluate("""()=>{const a=document.querySelector('.eoc-cta-primary');const n=document.querySelector('.eoc-card-name');const g=document.querySelector('.eoc-guidance');return {shop:a?a.getAttribute('href'):null,name:n?n.textContent.trim():null,guidance:g?g.textContent.trim().slice(0,80):null};}""")
        c['shop_href'] = info['shop']
        r['crystal_name'] = info['name']
        r['guidance_preview'] = info['guidance']
        # intent: protection + 3-card
        page.select_option('#eoc-intent', 'protection')
        page.wait_for_timeout(500)
        page.select_option('#eoc-spread', 'three')
        page.wait_for_timeout(200)
        page.click('#eoc-shuffle-btn')
        page.wait_for_timeout(700)
        page.click('#eoc-cut-btn')
        page.wait_for_timeout(1100)
        backs3 = page.locator('#eoc-deck .eoc-card-back').all()
        for i in [0, 1, 2]:
            backs3[i].click()
            page.wait_for_timeout(150)
        page.wait_for_timeout(300)
        page.click('#eoc-validate-btn')
        page.wait_for_timeout(1900)
        c['three_result_cards'] = page.locator('.eoc-result .eoc-card').count()
        c['three_has_positions'] = page.locator('.eoc-card-pos').count()
        c['no_literal_bs'] = not page.evaluate("()=>document.body.innerText.includes('\\\\u2726')||document.body.innerText.includes('\\\\n')")
        c['no_console_err'] = len(r['console_errors']) == 0
        c['has_seo_accordion'] = page.locator('.eoc-seo-accordion').count() > 0
        c['has_faq_schema'] = page.evaluate("()=>{const s=[...document.querySelectorAll('script[type=\"application/ld+json\"]')].some(x=>x.textContent.includes('FAQPage'));return s;}")
        b.close()
    return r

out = {}
for label, vw, vh in [('desktop', 1440, 900), ('mobile', 390, 844)]:
    try:
        out[label] = run(label, vw, vh)
    except Exception as e:
        out[label] = {'error': str(e)}

with open('verify-report.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

for label in ['desktop', 'mobile']:
    r = out.get(label, {})
    if 'error' in r:
        print(f'[{label}] FLOW ERROR: {r["error"]}')
        continue
    c = r['checks']
    print(f'[{label}] http200={c["http_200"]} deck={c["deck_has_backs"]} deckLe36={c["deck_backs_le_36"]} validate={c["validate_shown"]} flipped={c["flipped_to_front"]} result={c["result_shown"]} guidance={c["has_guidance"]} shopCta={c["has_shop_cta"]} threeCards={c["three_result_cards"]} threePos={c["three_has_positions"]} noLiteralBs={c["no_literal_bs"]} noConsoleErr={c["no_console_err"]} seoAccordion={c["has_seo_accordion"]} faqSchema={c["has_faq_schema"]}')
    print(f'   love crystal: {r.get("crystal_name")} | shop: {c.get("shop_href")}')
    print(f'   guidance: {r.get("guidance_preview")}')
    if r['console_errors']:
        print(f'   CONSOLE ERRORS: {r["console_errors"][:3]}')
