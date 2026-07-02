"""T17 Step-1 builder verification.

Opens the LOCAL prototype HTML (file://) and screenshots desktop + mobile,
plus exercises core interactions via a mix of UI clicks and JS evaluation.

Self-hosted three.module.min.js loads via importmap from ./vendor; chromium
must be launched with --allow-file-access-from-files for the file:// ES module
imports to resolve.
"""
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(HERE, "crystal-bracelet-builder.html")
URL = "file:///" + HTML.replace("\\", "/")

def shot(page, name):
    p = os.path.join(HERE, name)
    page.screenshot(path=p)
    print("[shot]", name)

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--allow-file-access-from-files",
                "--disable-web-security",
                "--use-gl=angle",
                "--use-angle=swiftshader",
                "--enable-unsafe-swiftshader",
                "--ignore-gpu-blocklist",
            ],
        )

        # ---------- DESKTOP ----------
        ctx = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        page = ctx.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append("PAGEERR: " + str(e)))
        page.on("console", lambda m: errors.append("CONSOLE.%s: %s" % (m.type, m.text)) if m.type == "error" else None)

        page.goto(URL, wait_until="load")
        page.wait_for_timeout(2800)  # Three.js boot + texture pre-render

        # Shot 1: default 6-bead starter mix
        bead_cards = page.locator(".bead-card").count()
        seq = page.locator(".seq-item").count()
        total = page.locator(".price-total span").last.text_content()
        print("[desktop] default: bead cards=%d seq slots=%d total=%s" % (bead_cards, seq, total))
        shot(page, "step1-1-default-desktop.png")

        # Shot 2: purple filter
        page.locator('.color-tab[data-color="purple"]').click()
        page.wait_for_timeout(300)
        purple = page.locator(".bead-card").count()
        print("[desktop] purple filter cards=%d" % purple)
        shot(page, "step1-2-filter-purple-desktop.png")
        page.locator('.color-tab[data-color="all"]').click()
        page.wait_for_timeout(250)

        # Shot 3: add beads
        page.locator('.bead-card[data-bead="amethyst"]').first.click()
        page.wait_for_timeout(150)
        page.locator('.bead-card[data-bead="citrine"]').first.click()
        page.wait_for_timeout(150)
        page.locator('.bead-card[data-bead="malachite"]').first.click()
        page.wait_for_timeout(300)
        seq3 = page.locator(".seq-item").count()
        total3 = page.locator(".price-total span").last.text_content()
        print("[desktop] after 3 adds: slots=%d total=%s" % (seq3, total3))
        shot(page, "step1-3-added-beads-desktop.png")

        # Shot 4: select last + remove
        page.locator(".seq-item").last.click()
        page.wait_for_timeout(150)
        page.locator('#t17-sel-actions [data-action="remove-selected"]').click()
        page.wait_for_timeout(300)
        seq4 = page.locator(".seq-item").count()
        print("[desktop] after remove: slots=%d" % seq4)
        shot(page, "step1-4-removed-desktop.png")

        # Shot 5: replace first slot
        page.locator(".seq-item").first.click()
        page.wait_for_timeout(150)
        name0 = page.locator(".seq-item").first.locator("small").text_content()
        page.locator('.bead-card[data-bead="tiger_eye"]').first.click()
        page.wait_for_timeout(300)
        name1 = page.locator(".seq-item").first.locator("small").text_content()
        print('[desktop] replace first slot: "%s" -> "%s"' % (name0, name1))
        shot(page, "step1-5-replaced-desktop.png")

        # Shot 6: charm + cord + size
        page.locator('.charm-btn[data-charm="lotus"]').first.click()
        page.wait_for_timeout(150)
        page.locator('.cord-btn[data-cord="silver_wire"]').first.click()
        page.wait_for_timeout(150)
        page.locator('.size-btn[data-size="10"]').first.click()
        page.wait_for_timeout(400)
        total6 = page.locator(".price-total span").last.text_content()
        print("[desktop] after charm+silver+10mm: total=%s" % total6)
        shot(page, "step1-6-charm-cord-size-desktop.png")

        # Shot 7: rotate 3D via mouse drag on empty stage area
        canvas = page.locator("#t17-canvas")
        box = canvas.bounding_box()
        page.mouse.move(box["x"] + box["width"] * 0.18, box["y"] + box["height"] * 0.5)
        page.mouse.down()
        page.mouse.move(box["x"] + box["width"] * 0.82, box["y"] + box["height"] * 0.32, steps=14)
        page.mouse.up()
        page.wait_for_timeout(500)
        shot(page, "step1-7-rotated-desktop.png")

        # Shot 8: preset
        page.locator('.preset-btn[data-preset="prosperity"]').first.click()
        page.wait_for_timeout(400)
        seq8 = page.locator(".seq-item").count()
        print("[desktop] after Prosperity preset: slots=%d" % seq8)
        shot(page, "step1-8-preset-desktop.png")

        # add to cart -> console.log
        cart = []
        page.on("console", lambda m: cart.append(m.text) if "[T17] Add to cart" in (m.text or "") else None)
        page.locator("#t17-add-cart").click()
        page.wait_for_timeout(300)
        print("[desktop] add-to-cart console msgs=%d" % len(cart))

        ctx.close()

        # ---------- MOBILE ----------
        mctx = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        mpage = mctx.new_page()
        merrs = []
        mpage.on("pageerror", lambda e: merrs.append("MOB PAGEERR: " + str(e)))
        mpage.goto(URL, wait_until="load")
        mpage.wait_for_timeout(2800)
        shot(mpage, "step1-mobile-top.png")
        mpage.locator("#t17-stage").scroll_into_view_if_needed()
        mpage.wait_for_timeout(600)
        shot(mpage, "step1-mobile-stage.png")
        mpage.locator("#t17-bottom").scroll_into_view_if_needed()
        mpage.wait_for_timeout(400)
        shot(mpage, "step1-mobile-pricing.png")
        mctx.close()

        browser.close()

        print("DONE. desktop errors=%d mobile errors=%d" % (len(errors), len(merrs)))
        for e in errors: print("  ERR:", e)
        for e in merrs: print("  MOB ERR:", e)

if __name__ == "__main__":
    main()
