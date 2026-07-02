"""Minimal probe: no event callbacks (they can deadlock), goto + evaluate + close ASAP."""
import os, sys
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
URL = "file:///" + os.path.join(HERE, "crystal-bracelet-builder.html").replace("\\", "/")

with sync_playwright() as p:
    b = p.chromium.launch(headless=True, args=["--allow-file-access-from-files","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist","--no-sandbox"])
    pg = b.new_page(viewport={"width":1440,"height":900})
    pg.goto(URL, wait_until="domcontentloaded", timeout=15000)
    pg.wait_for_timeout(2500)
    res = pg.evaluate("""() => {
        const q = s => document.querySelectorAll(s).length;
        const html = id => { const e=document.getElementById(id); return e ? e.innerHTML.length : -1; };
        const errTags = document.querySelectorAll('script[type="module"]');
        return { presets: q('#t17-presets .preset-btn'), beadCards: q('.bead-card'), colorTabs: q('.color-tab'), priceInnerLen: html('t17-price'), seqInnerLen: html('t17-seq'), moduleScripts: errTags.length };
    }""")
    print("RESULT", res)
    b.close()
print("DONE")
