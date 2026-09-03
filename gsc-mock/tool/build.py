# -*- coding: utf-8 -*-
"""GSC 截图生成工具：config.json + template.html -> playwright 渲染 -> PNG
用法: python build.py [config.json] [输出.png]
"""
import io
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent
cfg_path = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / 'config.json'
out_path = Path(sys.argv[2]) if len(sys.argv) > 2 else HERE / f"{json.loads(io.open(cfg_path, encoding='utf-8').read())['domain'].replace('.', '_')}_gsc.png"

cfg = io.open(cfg_path, encoding='utf-8').read()

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1440, 'height': 1010}, device_scale_factor=1.75)
    pg.add_init_script(f'window.__CFG__ = {cfg};')
    pg.goto((HERE / 'template.html').as_uri())
    pg.wait_for_function('window.__RENDER_OK__ > 0', timeout=15000)
    pg.wait_for_timeout(700)  # 字体渲染稳定
    pg.screenshot(path=str(out_path), full_page=False)
    # 验证：图标字体是否加载（未加载会显示 ligature 单词）
    checks = pg.evaluate("""() => ({
        render: window.__RENDER_OK__ || 0,
        fontLoaded: document.fonts.check("20px 'Material Symbols Outlined'"),
        hscroll: document.documentElement.scrollWidth > 1440
    })""")
    b.close()

print('saved:', out_path)
print('checks:', checks)
if not checks['fontLoaded']:
    print('!! Material Symbols 字体未加载，图标会显示为单词')
    sys.exit(1)
