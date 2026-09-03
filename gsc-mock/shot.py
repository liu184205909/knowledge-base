# -*- coding: utf-8 -*-
"""GSC 风格仪表盘截图：渲染 mock.html 并输出高清 PNG"""
from playwright.sync_api import sync_playwright

SRC = 'file:///D:/Code/knowledge-base/gsc-mock/mock.html'
OUT = 'D:/Code/knowledge-base/gsc-mock/taku_gsc.png'

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1440, 'height': 960}, device_scale_factor=2)
    pg.goto(SRC)
    pg.wait_for_timeout(900)
    pg.screenshot(path=OUT, full_page=True)
    b.close()

# 验证产出：尺寸 + 汇总数值
from PIL import Image
im = Image.open(OUT)
print('PNG:', OUT, im.size)

# 用页面自身 JS 复算汇总值，确认四指标落在目标区间
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1440, 'height': 960})
    pg.goto(SRC)
    vals = pg.evaluate("""() => ({
        clicks: document.getElementById('v-clicks').textContent,
        impr: document.getElementById('v-impr').textContent,
        ctr: document.getElementById('v-ctr').textContent,
        pos: document.getElementById('v-pos').textContent,
        n: days.length,
        last: fmtD(days[days.length-1].date)
    })""")
    b.close()
print('指标卡:', vals)
