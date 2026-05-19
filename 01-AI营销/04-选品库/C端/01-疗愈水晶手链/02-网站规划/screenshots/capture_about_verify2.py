"""
Capture full-page screenshots with extended wait time and lazy-load workaround.
Images are very large (2-2.6MB each) so need more time.
Also try scrolling to trigger lazy loading before capture.
"""
import time
from playwright.sync_api import sync_playwright

URL = "https://luckycrystals.org/about/"
OUTPUT_DIR = r"d:\Code\knowledge-base\01-AI营销\04-选品库\C端\01-疗愈水晶手链\02-网站规划\screenshots"

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

def wait_for_images(page, timeout=30):
    """Wait for all target images to have naturalWidth > 0"""
    start = time.time()
    while time.time() - start < timeout:
        loaded = page.evaluate("""(targetImages) => {
            let count = 0;
            const allImgs = document.querySelectorAll('img');
            allImgs.forEach(img => {
                const src = img.src || '';
                targetImages.forEach(name => {
                    if (src.includes(name) && img.naturalWidth > 0) {
                        count++;
                    }
                });
            });
            return count;
        }""", TARGET_IMAGES)
        print(f"  Loaded so far: {loaded}/8 ({time.time()-start:.1f}s)")
        if loaded >= 8:
            return True
        time.sleep(2)
    return False

def capture_all():
    with sync_playwright() as p:
        browser = p.chromium.launch()

        for label, w, h in [("desktop", 1920, 1080), ("mobile", 375, 812)]:
            print(f"\n{'='*60}")
            print(f"Capturing {label} ({w}x{h})")
            print(f"{'='*60}")

            page = browser.new_page(viewport={"width": w, "height": h})

            # Disable lazy loading
            page.goto(URL, wait_until="networkidle")
            print("Page loaded (networkidle).")

            # Scroll through entire page to trigger lazy loading
            print("Scrolling through page to trigger lazy loading...")
            for i in range(20):
                page.evaluate(f"window.scrollTo(0, {(i+1) * 500})")
                time.sleep(0.3)
            page.evaluate("window.scrollTo(0, 0)")
            time.sleep(1)

            # Now wait for images
            print("Waiting for images to load (up to 30s)...")
            success = wait_for_images(page, timeout=30)

            if not success:
                print("  WARNING: Not all images loaded after 30s. Trying to force load...")
                # Try forcing image loads by setting loading attribute
                page.evaluate("""(targetImages) => {
                    const allImgs = document.querySelectorAll('img');
                    allImgs.forEach(img => {
                        const src = img.src || '';
                        targetImages.forEach(name => {
                            if (src.includes(name)) {
                                img.loading = 'eager';
                                // Force reload by toggling src
                                const origSrc = img.src;
                                img.src = '';
                                img.src = origSrc;
                            }
                        });
                    });
                }""", TARGET_IMAGES)
                time.sleep(5)
                success = wait_for_images(page, timeout=15)

            # Final status check
            image_status = page.evaluate("""(targetImages) => {
                const results = [];
                const allImgs = document.querySelectorAll('img');
                allImgs.forEach(img => {
                    const src = img.src || '';
                    targetImages.forEach(name => {
                        if (src.includes(name)) {
                            results.push({
                                name: name,
                                naturalWidth: img.naturalWidth,
                                naturalHeight: img.naturalHeight,
                                displayedWidth: img.offsetWidth,
                                displayedHeight: img.offsetHeight,
                                complete: img.complete,
                                loaded: img.naturalWidth > 0 && img.naturalHeight > 0,
                            });
                        }
                    });
                });
                return results;
            }""", TARGET_IMAGES)

            loaded_count = sum(1 for i in image_status if i["loaded"])
            print(f"\nFinal status for {label}: {loaded_count}/{len(TARGET_IMAGES)} loaded")
            for img_info in image_status:
                status = "OK" if img_info["loaded"] else "BROKEN"
                print(f"  {status}: {img_info['name']} ({img_info['naturalWidth']}x{img_info['naturalHeight']} natural, {img_info['displayedWidth']}x{img_info['displayedHeight']} displayed)")

            # Take full-page screenshot
            fullpath = f"{OUTPUT_DIR}/about_{label}_fullpage_verify.png"
            page.screenshot(path=fullpath, full_page=True)
            print(f"\nFull-page screenshot saved: {fullpath}")

            # Also take above-the-fold screenshot
            foldpath = f"{OUTPUT_DIR}/about_{label}_above_fold_verify.png"
            page.evaluate("window.scrollTo(0, 0)")
            time.sleep(0.5)
            page.screenshot(path=foldpath, full_page=False)
            print(f"Above-fold screenshot saved: {foldpath}")

            page.close()

        browser.close()
        print("\nDone!")

if __name__ == "__main__":
    capture_all()
