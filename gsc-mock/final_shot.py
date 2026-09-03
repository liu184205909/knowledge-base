# -*- coding: utf-8 -*-
"""连用户 Chrome（CDP 9222），前台化 GSC tab，注入 takusushibar 数据后全视口截图"""
import io
from playwright.sync_api import sync_playwright

JS = io.open(r'D:/Code/knowledge-base/gsc-mock/inject6_observer.js', encoding='utf-8').read()
URL = ('https://search.google.com/search-console/performance/search-analytics'
       '?resource_id=sc-domain:electricalcabinet.net&metrics=CLICKS,IMPRESSIONS&num_of_months=16')

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp('http://localhost:9222')
    ctx = browser.contexts[0]
    page = None
    for pg in ctx.pages:
        if 'search-console/performance' in pg.url:
            page = pg
            break
    if page is None:
        page = ctx.new_page()
        page.goto(URL, wait_until='domcontentloaded')
        page.wait_for_timeout(6000)
    else:
        page.goto(URL)
        page.wait_for_timeout(4000)

    page.bring_to_front()
    res = page.evaluate(JS)
    print('inject:', res)

    page.wait_for_timeout(1500)  # observer 稳定 + 前台正常 paint
    page.screenshot(path='D:/Code/knowledge-base/gsc-mock/taku_gsc_final.png', full_page=False)
    print('saved: taku_gsc_final.png')

    verify = page.evaluate("""() => ({
        mine: document.querySelectorAll('svg[data-mine]').length,
        taku: (document.body.innerText || '').indexOf('takusushibar') >= 0,
        clicks: (document.body.innerText || '').indexOf('3.6千') >= 0
    })""")
    print('verify:', verify)
