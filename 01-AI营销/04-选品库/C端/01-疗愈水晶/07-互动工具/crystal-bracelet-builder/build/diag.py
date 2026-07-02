import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
URL = "file:///" + os.path.join(HERE, "prototype.html").replace("\\", "/")

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    logs = []; errs = []
    pg.on("console", lambda m: logs.append(f"[{m.type}] {m.text}"))
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL, wait_until="networkidle")
    pg.wait_for_timeout(3000)

    info = pg.evaluate("""() => ({
        hasThree: typeof THREE !== 'undefined',
        threeVer: typeof THREE !== 'undefined' ? THREE.REVISION : null,
        hasOrbit: typeof THREE !== 'undefined' && typeof THREE.OrbitControls !== 'undefined',
        canvasCount: document.querySelectorAll('canvas').length,
        canvasW: (() => { const c = document.querySelector('#canvas-wrap canvas'); return c ? c.width : null; })(),
        canvasH: (() => { const c = document.querySelector('#canvas-wrap canvas'); return c ? c.height : null; })(),
        canvasStyleW: (() => { const c = document.querySelector('#canvas-wrap canvas'); return c ? c.style.width : null; })(),
        beadsLen: window.__T17 ? window.__T17.beads.length : 'no __T17',
        sceneChildren: window.__T17 ? window.__T17.scene.children.length : null,
        ringRotation: window.__T17 ? window.__T17.scene.children.find(o => o.type==='Group') ? 'group exists' : 'no group' : null,
        wrapW: (() => { const w = document.getElementById('canvas-wrap'); const r = w.getBoundingClientRect(); return r.width; })(),
        wrapH: (() => { const w = document.getElementById('canvas-wrap'); const r = w.getBoundingClientRect(); return r.height; })()
    })""")
    print("DIAGNOSTICS:", info)
    print()
    print("=== console logs (first 30) ===")
    for l in logs[:30]:
        print(l)
    print("=== page errors ===")
    for e in errs:
        print(e)
    b.close()
