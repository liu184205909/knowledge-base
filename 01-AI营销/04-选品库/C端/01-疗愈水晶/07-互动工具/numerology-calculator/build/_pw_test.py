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
    page.goto('https://goearthward.com/tools/numerology-calculator/', wait_until='networkidle', timeout=45000)
    page.wait_for_timeout(1200)
    info = page.evaluate('''() => ({
      ewnumType: typeof window.EWNum,
      nCount: (window.EWNum && Array.isArray(window.EWNum.N)) ? 'NA' : 'no-N-prop',
      title: document.title,
      h1: (document.querySelector('.enc-h1')||{}).innerText || null,
      btnText: (document.querySelector('.enc-btn')||{}).innerText || null,
    })''')
    print('=== INFO ===', info)
    page.select_option('#enc-month','5')
    page.select_option('#enc-day','5')
    page.fill('#enc-year','1990')
    page.click('.enc-btn')
    page.wait_for_timeout(1500)
    txt = page.eval_on_selector('#enc-result','el => el.innerText')
    print('=== RESULT INNERTXT ===')
    print(txt)
    html_snip = page.eval_on_selector('#enc-result','el => el.innerHTML.slice(0,600)')
    print('=== RESULT INNERHTML (first 600) ===')
    print(html_snip)
    print('=== PAGEERRORS ===', errors)
    browser.close()
