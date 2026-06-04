"""
Capture full-page screenshots of the About Us page at multiple viewports.
Re-verification: checking 8 previously-broken images now render correctly.
"""
import time
from playwright.sync_api import sync_playwright

URL = "https://luckycrystals.org/about/"
OUTPUT_DIR = r"d:\Code\knowledge-base\01-AI营销\04-选品库\C端\01-疗愈水晶手链\02-网站规划\screenshots"

VIEWPORTS = [
    ("desktop", 1920, 1080),
    ("mobile", 375, 812),
]

# The 8 previously problematic images to verify
TARGET_IMAGES = [
    "about-icon-natural-crystals-v1.png",
    "about-icon-cleansing-charged-v1.png",
    "about-icon-velvet-pouch-guide-v1.png",
    "about-icon-returns-guarantee-v1.png",
    "about-community-rose-quartz-v1.png",
    "about-community-black-tourmaline-v1.png",
    "about-community-amethyst-v1.png",
    "about-community-citrine-v1.png",
]

def capture_all():
    with sync_playwright() as p:
        browser = p.chromium.launch()

        for label, w, h in VIEWPORTS:
            print(f"\n--- Capturing {label} ({w}x{h}) ---")
            page = browser.new_page(viewport={"width": w, "height": h})

            page.goto(URL, wait_until="networkidle")
            print("Page loaded (networkidle). Waiting 5s for images...")
            time.sleep(5)

            # Check which target images are present and their natural dimensions
            image_status = page.evaluate("""(targetImages) => {
                const results = [];
                const allImgs = document.querySelectorAll('img');
                allImgs.forEach(img => {
                    const src = img.src || '';
                    targetImages.forEach(name => {
                        if (src.includes(name)) {
                            results.push({
                                name: name,
                                src: src,
                                naturalWidth: img.naturalWidth,
                                naturalHeight: img.naturalHeight,
                                displayedWidth: img.offsetWidth,
                                displayedHeight: img.offsetHeight,
                                complete: img.complete,
                                loaded: img.naturalWidth > 0 && img.naturalHeight > 0,
                                alt: img.alt || '',
                            });
                        }
                    });
                });
                return results;
            }""", TARGET_IMAGES)

            print(f"\nImage status for {label}:")
            found_count = 0
            loaded_count = 0
            for img_info in image_status:
                found_count += 1
                status = "LOADED" if img_info["loaded"] else "BROKEN"
                if img_info["loaded"]:
                    loaded_count += 1
                print(f"  {status}: {img_info['name']}")
                print(f"    natural: {img_info['naturalWidth']}x{img_info['naturalHeight']}, "
                      f"displayed: {img_info['displayedWidth']}x{img_info['displayedHeight']}, "
                      f"complete: {img_info['complete']}")

            missing = [name for name in TARGET_IMAGES
                       if not any(r["name"] == name for r in image_status)]
            if missing:
                print(f"\n  NOT FOUND in DOM: {missing}")

            print(f"\n  Summary: {loaded_count}/{len(TARGET_IMAGES)} images loaded, "
                  f"{len(missing)} not found in DOM")

            # Take full-page screenshot
            fullpath = f"{OUTPUT_DIR}/about_{label}_fullpage_verify.png"
            page.screenshot(path=fullpath, full_page=True)
            print(f"  Full-page screenshot saved: {fullpath}")

            # Also take above-the-fold screenshot
            foldpath = f"{OUTPUT_DIR}/about_{label}_above_fold_verify.png"
            page.screenshot(path=foldpath, full_page=False)
            print(f"  Above-fold screenshot saved: {foldpath}")

            page.close()

        browser.close()
        print("\nDone!")

if __name__ == "__main__":
    capture_all()
