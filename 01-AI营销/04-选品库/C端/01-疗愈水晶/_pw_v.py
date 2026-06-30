# -*- coding: utf-8 -*-
import io,sys,time
sys.stdout=io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8')
from playwright.sync_api import sync_playwright
url=f'https://goearthward.com/?_t={int(time.time())}'
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    pg=b.new_page(viewport={'width':1366,'height':800})
    pg.goto(url,wait_until='networkidle',timeout=45000); pg.wait_for_timeout(1500)
    pg.locator('a:has-text("Tools"), li:has-text("Tools")').first.hover(timeout=5000)
    pg.wait_for_timeout(1000)
    info=pg.evaluate('''()=>{const g=document.querySelector('.ew-tm-grid');if(!g)return{found:false};const cs=getComputedStyle(g);const cols=g.querySelectorAll('.ew-tm-col');const firstTop=cols[0]?Math.round(cols[0].getBoundingClientRect().top):0;const sameRow=Array.from(cols).every(c=>Math.round(c.getBoundingClientRect().top)===firstTop);return{display:cs.display,gridCols:cs.gridTemplateColumns,cols:cols.length,sameRow:sameRow,titlesTag:Array.from(g.querySelectorAll('.ew-tm-title')).map(t=>t.tagName)}}''')
    print('验证:',info)
    b.close()
