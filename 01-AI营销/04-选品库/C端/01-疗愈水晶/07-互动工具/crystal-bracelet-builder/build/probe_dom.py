"""Fast DOM probe: did APP_JS run at all? (import fail vs WebGL fail)"""
import os, sys
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
URL = "file:///" + os.path.join(HERE, "crystal-bracelet-builder.html").replace("\\", "/")

with sync_playwright() as p:
    b = p.chromium.launch(headless=True, args=["--allow-file-access-from-files","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
    pg = b.new_page(viewport={"width":1440,"height":900})
    errs=[]; cons=[]
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: cons.append(("%s"%(m.type,), (m.text or "")[:200])))
    pg.on("requestfailed", lambda r: errs.append("REQFAIL "+str(r.url)+" :: "+str(r.failure)))
    pg.goto(URL, wait_until="domcontentloaded", timeout=15000)
    pg.wait_for_timeout(3500)
    res = pg.evaluate("""() => {
        const q = s => document.querySelectorAll(s).length;
        const html = id => { const e=document.getElementById(id); return e ? e.innerHTML.length : -1; };
        let gl = 'none';
        const c = document.querySelector('canvas#t17-canvas');
        if (c) { try { const g = c.getContext('webgl2')||c.getContext('webgl'); gl = g ? 'ok' : 'no-ctx'; } catch(e){ gl='err:'+e.message; } }
        return { app: q('#t17-app'), presets: q('#t17-presets .preset-btn'), beadCards: q('.bead-card'), colorTabs: q('.color-tab'), charms: q('.charm-btn'), priceInner: html('t17-price'), seqInner: html('t17-seq'), canvas: q('canvas#t17-canvas'), webgl: gl };
    }""")
    print("DOM:", res)
    print("PAGEERRORS:", errs[:8])
    print("CONSOLE (first 12):")
    for c in cons[:12]: print("  ", c)
    b.close()
print("DONE")
