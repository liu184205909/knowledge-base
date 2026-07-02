"""Ultra-fast probe: minimal wait, immediate close. Last attempt."""
import os
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
URL = "file:///" + os.path.join(HERE, "crystal-bracelet-builder.html").replace("\\", "/")
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, args=["--allow-file-access-from-files","--no-sandbox","--disable-gpu"])
    pg = b.new_page(viewport={"width":1440,"height":900})
    pg.goto(URL, wait_until="domcontentloaded", timeout=12000)
    pg.wait_for_timeout(1500)
    res = pg.evaluate("() => ({ p: document.querySelectorAll('#t17-presets .preset-btn').length, b: document.querySelectorAll('.bead-card').length, c: document.querySelectorAll('.color-tab').length, price: (document.getElementById('t17-price')||{}).innerHTML.length||0, seq: (document.getElementById('t17-seq')||{}).innerHTML.length||0 })")
    print("ULTRA_RESULT", res)
    b.close()
print("ULTRA_DONE")
