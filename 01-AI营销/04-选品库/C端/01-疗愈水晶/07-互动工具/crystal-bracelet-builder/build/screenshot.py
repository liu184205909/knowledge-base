"""T17 prototype 截图（精简版，避免 mouse 序列卡住）。纯 JS 驱动 + 静态截图。"""
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
URL = "file:///" + os.path.join(HERE, "prototype.html").replace("\\", "/")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(URL, wait_until="networkidle")
        page.wait_for_timeout(3000)

        page.screenshot(path=os.path.join(HERE, "shot-1-default.png"))
        print("Shot 1 (default)")

        page.evaluate("window.__T17.selectBead(window.__T17.beads[0])")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(HERE, "shot-2-selected.png"))
        print("Shot 2 (selected)")

        page.evaluate("window.__T17.addBead('malachite')")
        page.evaluate("window.__T17.addBead('tiger_eye')")
        page.evaluate("window.__T17.addBead('citrine')")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(HERE, "shot-4-five-beads.png"))
        print("Shot 4 (5 beads)")

        # zoom via JS camera move (no mouse)
        page.evaluate("window.__T17.scene.children.forEach(c=>{ if(c.isCamera) c.position.multiplyScalar(0.55) })")
        page.wait_for_timeout(500)
        page.screenshot(path=os.path.join(HERE, "shot-6-zoomed.png"))
        print("Shot 6 (zoomed)")

        # angle via JS
        page.evaluate("""() => {
            window.__T17.scene.children.forEach(c => {
                if (c.isCamera) { c.position.set(8, 3, 14); c.lookAt(0,0,0); }
            });
        }""")
        page.wait_for_timeout(500)
        page.screenshot(path=os.path.join(HERE, "shot-7-angle.png"))
        print("Shot 7 (angle)")

        print("errors:", errors if errors else "NONE")
        browser.close()
    print("DONE.")

if __name__ == "__main__":
    main()
