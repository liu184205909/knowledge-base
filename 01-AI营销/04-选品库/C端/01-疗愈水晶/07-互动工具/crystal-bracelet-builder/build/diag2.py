"""深度诊断：3D 场景有对象但画面空白的原因。"""
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
URL = "file:///" + os.path.join(HERE, "prototype.html").replace("\\", "/")

with sync_playwright() as p:
    # try headed mode to see if headless WebGL is the issue
    browser = p.chromium.launch(headless=True, args=["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"])
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(URL, wait_until="networkidle")
    page.wait_for_timeout(3000)

    # Force a render and read back pixel data to confirm WebGL actually drew something
    diag = page.evaluate("""() => {
        const c = document.querySelector('#canvas-wrap canvas');
        const ctx = c.getContext('webgl2') || c.getContext('webgl');
        // read a center pixel
        let pixelInfo = 'no ctx';
        try {
            const px = new Uint8Array(4);
            ctx.readPixels(c.width/2|0, c.height/2|0, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, px);
            pixelInfo = 'center px RGBA=' + Array.from(px).join(',');
        } catch(e) { pixelInfo = 'readPixels err: ' + e.message; }
        // also check via 2d canvas toDataURL sampling (force preserveDrawingBuffer)
        return {
            canvasW: c.width, canvasH: c.height,
            glVendor: ctx ? (ctx.getParameter(ctx.VERSION) + ' | ' + (ctx.getParameter(ctx.UNMASKED_RENDERER_WEBGL) || 'n/a')) : 'no gl',
            pixelInfo,
            beadsLen: window.__T17 ? window.__T17.beads.length : 'no t17',
            // bounding box of a bead mesh projected to screen
            beadScreenPos: (() => {
                if (!window.__T17 || !window.__T17.beads[0]) return null;
                // we can't easily project without camera ref; just report world pos
                const b = window.__T17.beads[0];
                return { x: b.mesh.position.x, y: b.mesh.position.y, z: b.mesh.position.z };
            })()
        };
    }""")
    print("DIAG:", diag)

    page.screenshot(path=os.path.join(HERE, "diag-shot.png"))
    print("saved diag-shot.png")
    browser.close()
