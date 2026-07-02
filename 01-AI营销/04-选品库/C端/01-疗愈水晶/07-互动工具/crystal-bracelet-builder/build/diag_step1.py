"""Minimal diag: can chromium launch + load the file:// page + what does
the console say? Captures page errors and the first console log lines."""
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(HERE, "crystal-bracelet-builder.html")
URL = "file:///" + HTML.replace("\\", "/")

def main():
    print("[diag] URL:", URL)
    print("[diag] HTML exists:", os.path.exists(HTML))
    with sync_playwright() as p:
        print("[diag] launching chromium...")
        browser = p.chromium.launch(
            headless=True,
            args=["--allow-file-access-from-files", "--disable-web-security"],
        )
        print("[diag] chromium launched OK")
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()
        msgs = []
        errs = []
        page.on("console", lambda m: msgs.append(("" if m.type else "?") + ": " + (m.text or "")))
        page.on("pageerror", lambda e: errs.append("PAGEERR: " + str(e)))
        page.on("requestfailed", lambda r: errs.append("REQFAIL: " + str(r.url) + " :: " + str(r.failure)))

        print("[diag] goto...")
        try:
            page.goto(URL, wait_until="domcontentloaded", timeout=15000)
            print("[diag] goto OK")
        except Exception as e:
            print("[diag] goto FAILED:", e)

        page.wait_for_timeout(3000)

        # probe DOM
        title = page.title()
        app = page.locator("#t17-app").count()
        left = page.locator("#t17-left").count()
        cards = page.locator(".bead-card").count()
        canvas = page.locator("#t17-canvas").count()
        seq = page.locator(".seq-item").count()
        print("[diag] title=%s app=%d left=%d bead_cards=%d canvas=%d seq=%d" % (title, app, left, cards, canvas, seq))

        print("[diag] --- console msgs (first 15) ---")
        for m in msgs[:15]: print("   ", m)
        print("[diag] --- errors ---")
        for e in errs[:15]: print("   ", e)

        page.screenshot(path=os.path.join(HERE, "step1-diag.png"))
        print("[diag] screenshot saved: step1-diag.png")
        browser.close()
    print("[diag] DONE")

if __name__ == "__main__":
    main()
