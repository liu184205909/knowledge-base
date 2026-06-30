# -*- coding: utf-8 -*-
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from playwright.sync_api import sync_playwright

errors=[]
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width':414,'height':896})
    page.on('console', lambda m: print('[CONSOLE]', m.type, m.text))
    page.on('pageerror', lambda e: (print('[PAGEERROR]', str(e)), errors.append(str(e))))
    page.goto('https://goearthward.com/tools/tarot-birth-card/', wait_until='networkidle', timeout=60000)
    page.wait_for_timeout(1500)

    info = page.evaluate('''() => ({
      ebcalcType: typeof window.EBCalc,
      h1: (document.querySelector('.ebc-h1')||{}).innerText || null,
      title: document.title,
      dataPresent: !!document.getElementById('ebc-data'),
      appPresent: !!document.getElementById('ebc-app'),
      faqSchema: !!document.querySelector('script[type="application/ld+json"]'),
    })''')
    print('=== LIVE INIT ===', info)

    cases = [
      (5, 5, 1990, 'Justice', 'The High Priestess', '1990-05-05'),
      (2, 5, 1962, 'The Tower', 'The Chariot', '1962-02-05 Tarot.com check'),
      (1, 1, 2000, 'The Fool', 'The Emperor', '2000-01-01'),
    ]
    for (m,d,y,n1,n2,label) in cases:
        page.select_option('#ebc-month', str(m))
        page.select_option('#ebc-day', str(d))
        page.fill('#ebc-year', str(y))
        page.click('#ebc-btn')
        page.wait_for_timeout(1200)
        pair = page.eval_on_selector('.ebc-r-pair','el => el.innerText')
        stones = page.eval_on_selector_all('.ebc-stone-name','els => els.map(e=>e.innerText)')
        readLinks = page.eval_on_selector_all('.ebc-read-link','els => els.map(e=>e.getAttribute("href"))')
        ok = (n1 in pair and n2 in pair)
        print('=== %s [%s] ===' % (label, 'PASS' if ok else 'FAIL'))
        print('  pair:', pair)
        print('  stones:', stones)
        print('  readLinks:', readLinks)

    # 检查 SEO accordion + schema
    seoOpen = page.eval_on_selector_all('details.ebc-seo-details summary','els => els.map(e=>e.innerText)')
    print('=== SEO accordion summaries ===', seoOpen)
    print('=== PAGEERRORS ===', errors)
    browser.close()
