# -*- coding: utf-8 -*-
import io, sys, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from playwright.sync_api import sync_playwright

HTML_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tarot-birth-card.html')

errors=[]
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width':414,'height':896})
    page.on('console', lambda m: print('[CONSOLE]', m.type, m.text))
    page.on('pageerror', lambda e: (print('[PAGEERROR]', str(e)), errors.append(str(e))))
    page.goto('file:///' + HTML_PATH.replace('\\','/'), wait_until='networkidle', timeout=30000)
    page.wait_for_timeout(800)

    info = page.evaluate('''() => ({
      ebcalcType: typeof window.EBCalc,
      calcFn: window.EBCalc ? typeof window.EBCalc.calc : 'no-EBCalc',
      h1: (document.querySelector('.ebc-h1')||{}).innerText || null,
      btnText: (document.querySelector('#ebc-btn')||{}).innerText || null,
      dataLen: (document.getElementById('ebc-data')||{}).textContent ? document.getElementById('ebc-data').textContent.length : 0,
    })''')
    print('=== INIT INFO ===', info)

    # 多个生日测试
    cases = [
      # (month, day, year, expected_card1, expected_card2, label)
      (5, 5, 1990, 11, 2, '1990-05-05'),
      (1, 1, 2000, 22, 4, '2000-01-01 (Fool+Emperor)'),
      (2, 5, 1962, 16, 7, '1962-02-05 Tarot.com=Tower(16)+Chariot(7)'),
      (8, 3, 1971, 2, 2, '1971-08-03 (same HP)'),
      (10, 31, 1999, 15, 6, '1999-10-31 (Devil+Lovers)'),
      (6, 15, 1985, 8, 8, '1985-06-15 (same Strength)'),
    ]
    names={0:'The Fool',1:'The Magician',2:'The High Priestess',3:'The Empress',4:'The Emperor',5:'The Hierophant',6:'The Lovers',7:'The Chariot',8:'Strength',9:'The Hermit',10:'Wheel of Fortune',11:'Justice',12:'The Hanged Man',13:'Death',14:'Temperance',15:'The Devil',16:'The Tower',17:'The Star',18:'The Moon',19:'The Sun',20:'Judgment',21:'The World',22:'The Fool'}
    for (m,d,y,ec1,ec2,label) in cases:
        page.select_option('#ebc-month', str(m))
        page.select_option('#ebc-day', str(d))
        page.fill('#ebc-year', str(y))
        page.click('#ebc-btn')
        page.wait_for_timeout(700)
        pair = page.eval_on_selector('.ebc-r-pair','el => el.innerText')
        step = page.eval_on_selector('.ebc-r-step','el => el.innerText')
        stones = page.eval_on_selector_all('.ebc-stone-name','els => els.map(e=>e.innerText)')
        readLinks = page.eval_on_selector_all('.ebc-read-link','els => els.map(e=>e.getAttribute("href"))')
        shopLinks = page.eval_on_selector_all('.ebc-stone-shop','els => els.map(e=>e.getAttribute("href"))')
        got1 = names[ec1]; got2 = names[ec2]
        ok = (pair.strip() == (got1+' & '+got2).strip()) or (ec1==ec2 and got1 in pair)
        status = 'PASS' if ok else 'FAIL'
        print('=== %s [%s] ===' % (label, status))
        print('  pair:', pair)
        print('  step:', step[:200])
        print('  stones:', stones)
        print('  readLinks:', readLinks)
        print('  shopLinks:', shopLinks)
        print('  expected: Card1=%d(%s) Card2=%d(%s)' % (ec1,got1,ec2,got2))

    print('=== PAGEERRORS ===', errors)
    browser.close()
