"""
Capture cropped screenshots of the Quality Promise and Community sections.
"""
import time
from playwright.sync_api import sync_playwright

URL = "https://luckycrystals.org/about/"
OUTPUT_DIR = r"d:\Code\knowledge-base\01-AI营销\04-选品库\C端\01-疗愈水晶手链\02-网站规划\screenshots"

def capture_sections():
    with sync_playwright() as p:
        browser = p.chromium.launch()

        for label, w, h in [("desktop", 1920, 1080), ("mobile", 375, 812)]:
            page = browser.new_page(viewport={"width": w, "height": h})
            page.goto(URL, wait_until="networkidle")

            # Scroll through to trigger lazy loading
            for i in range(25):
                page.evaluate(f"window.scrollTo(0, {(i+1) * 500})")
                time.sleep(0.3)
            time.sleep(3)

            # Quality Promise section (icons at ~4526px on desktop, ~7049px on mobile)
            quality_top = 4200 if label == "desktop" else 6700
            quality_height = 900 if label == "desktop" else 2500
            page.evaluate(f"window.scrollTo(0, {quality_top})")
            time.sleep(1)
            quality_path = f"{OUTPUT_DIR}/about_{label}_quality_promise_verify.png"
            page.screenshot(path=quality_path, full_page=False)
            print(f"Saved: {quality_path}")

            # Community section (testimonials at ~5333px desktop, ~9475px mobile)
            community_top = 5200 if label == "desktop" else 9300
            page.evaluate(f"window.scrollTo(0, {community_top})")
            time.sleep(1)
            community_path = f"{OUTPUT_DIR}/about_{label}_community_verify.png"
            page.screenshot(path=community_path, full_page=False)
            print(f"Saved: {community_path}")

            page.close()

        browser.close()
        print("Done!")

if __name__ == "__main__":
    capture_sections()
