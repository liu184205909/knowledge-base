# -*- coding: utf-8 -*-
# 线上验证: yes-no-tarot + draw-tarot-cards
import json
from playwright.sync_api import sync_playwright

TOOLS = [
    {'key':'eyn','url':'https://goearthward.com/tools/yes-no-tarot/','prefix':'eyn','has_verdict':True,
     'deck':'eyn-deck','shuffle':'eyn-shuffle-btn','cut':'eyn-cut-btn','reset':'eyn-reset-btn',
     'count':'eyn-count','single':'single','three':'three','verdict':'eyn-verdict',
     'result':'eyn-result','meaning':'eyn-meaning','stone':'eyn-stone-card','cta':'eyn-cta-primary','big':'eyn-verdict-big'},
    {'key':'efd','url':'https://goearthward.com/tools/draw-tarot-cards/','prefix':'efd','has_verdict':False,
     'deck':'efd-deck','shuffle':'efd-shuffle-btn','cut':'efd-cut-btn','reset':'efd-reset-btn',
     'count':'efd-count','single':'1','three':'3','verdict':None,
     'result':'efd-result','meaning':'efd-meaning','stone':'efd-stone-card','cta':'efd-cta-primary','big':None},
]

def run(cfg):
    pfx=cfg['prefix']
    r={'url':cfg['url'],'checks':{},'console_errors':[]}
    with sync_playwright() as pw:
        b=pw.chromium.launch(headless=True)
        ctx=b.new_context(viewport={'width':1440,'height':900})
        page=ctx.new_page()
        page.on('console',lambda m: r['console_errors'].append(m.text) if m.type=='error' else None)
        page.on('pageerror',lambda e: r['console_errors'].append('pageerror: '+e.message))
        resp=page.goto(cfg['url'],wait_until='domcontentloaded',timeout=60000)
        r['checks']['http_200']=resp.status==200
        page.wait_for_timeout(1500)  # 等JS执行+牌背渲染
        # 22牌
        r['checks']['deck_22']=page.locator(f'#{cfg["deck"]} .{pfx}-card-back').count()==22
        # 抽牌流程(单牌)
        page.select_option(f'#{cfg["count"]}',cfg['single'])
        page.wait_for_timeout(150)
        page.click(f'#{cfg["shuffle"]}')
        page.wait_for_timeout(600)
        page.click(f'#{cfg["cut"]}')
        page.wait_for_timeout(1000)
        backs=page.locator(f'#{cfg["deck"]} .{pfx}-card-back').all()
        backs[2].click()
        page.wait_for_timeout(1500)
        r['checks']['flipped']=page.evaluate(f'''()=>{{const e=document.querySelector('#{cfg["deck"]} .{pfx}-card-back.flipped');return e?!!e.querySelector('.{pfx}-front-face'):false;}}''')
        r['checks']['result_shown']=page.evaluate(f'''()=>{{const e=document.getElementById('{cfg["result"]}');return e&&e.style.display!=='none';}}''')
        r['checks']['has_meaning']=page.locator(f'.{pfx}-meaning').count()>0
        r['checks']['has_stones']=page.locator(f'.{pfx}-stone-card').count()>0
        r['checks']['has_cta']=page.locator(f'.{cfg["cta"]}').count()>0
        if cfg['has_verdict']:
            r['checks']['verdict_shown']=page.evaluate(f'''()=>{{const e=document.getElementById('{cfg["verdict"]}');return e&&e.style.display!=='none';}}''')
            r['verdict_label']=page.evaluate(f'''()=>{{const b=document.querySelector('.{cfg["big"]}');return b?b.textContent.trim():'';}}''')
            r['checks']['verdict_valid']=r['verdict_label'] in ('Yes','No','Maybe')
        # 0字面反斜杠(页面渲染后可见文本)
        r['checks']['no_literal_bs']=not page.evaluate('()=>document.body.innerText.includes("\\\\u2726")||document.body.innerText.includes("\\\\n")')
        r['checks']['no_console_err']=len(r['console_errors'])==0
        b.close()
    return r

for cfg in TOOLS:
    try:
        r=run(cfg)
        c=r['checks']
        line=f'[{cfg["key"]}] {r["url"]} | http200={c["http_200"]} deck22={c["deck_22"]} flipped={c["flipped"]} result={c["result_shown"]} meaning={c["has_meaning"]} stones={c["has_stones"]} cta={c["has_cta"]} noLiteralBs={c["no_literal_bs"]} noConsoleErr={c["no_console_err"]}'
        if cfg['has_verdict']:
            line+=f' | verdict={r["verdict_label"]} valid={c["verdict_valid"]}'
        print(line)
        if r['console_errors']:
            print(f'   CONSOLE ERRORS: {r["console_errors"][:3]}')
    except Exception as e:
        print(f'[{cfg["key"]}] FLOW ERROR: {e}')
