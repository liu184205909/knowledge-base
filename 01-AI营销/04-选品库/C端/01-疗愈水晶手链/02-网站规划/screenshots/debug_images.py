"""
Debug: check actual image URLs, response status, and console errors.
"""
import time
from playwright.sync_api import sync_playwright

URL = "https://luckycrystals.org/about/"
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

def debug():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1920, "height": 1080})

        # Collect console errors
        console_errors = []
        page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type in ["error", "warning"] else None)

        # Collect failed requests
        failed_requests = []
        page.on("requestfailed", lambda req: failed_requests.append(f"{req.url} - {req.failure}"))

        page.goto(URL, wait_until="networkidle")
        time.sleep(5)

        # Get actual img src URLs for target images
        image_urls = page.evaluate("""(targetImages) => {
            const results = [];
            const allImgs = document.querySelectorAll('img');
            allImgs.forEach(img => {
                const src = img.src || '';
                targetImages.forEach(name => {
                    if (src.includes(name)) {
                        results.push({
                            name: name,
                            src: src,
                            srcset: img.srcset || '',
                            currentSrc: img.currentSrc || '',
                        });
                    }
                });
            });
            return results;
        }""", TARGET_IMAGES)

        print("=== Image URLs ===")
        for img in image_urls:
            print(f"\n  {img['name']}:")
            print(f"    src: {img['src']}")
            print(f"    currentSrc: {img['currentSrc']}")
            print(f"    srcset: {img['srcset']}")

        # Try to fetch each image URL directly
        print("\n=== Direct fetch test ===")
        for img in image_urls:
            result = page.evaluate("""async (url) => {
                try {
                    const resp = await fetch(url, {method: 'HEAD'});
                    return {status: resp.status, ok: resp.ok, contentType: resp.headers.get('content-type'), contentLength: resp.headers.get('content-length')};
                } catch(e) {
                    return {error: e.message};
                }
            }""", img["src"])
            print(f"  {img['name']}: {result}")

        print("\n=== Console Errors ===")
        for err in console_errors:
            print(f"  {err}")

        print("\n=== Failed Requests ===")
        for req in failed_requests:
            print(f"  {req}")

        # Also check background images in CSS for these sections
        bg_images = page.evaluate("""() => {
            const elements = document.querySelectorAll('[style*="background"]');
            const results = [];
            elements.forEach(el => {
                const style = el.getAttribute('style') || '';
                if (style.includes('about-')) {
                    results.push({
                        tag: el.tagName,
                        style: style.substring(0, 300),
                        className: el.className,
                    });
                }
            });
            return results;
        }""")

        print("\n=== Elements with background-image containing 'about-' ===")
        for bg in bg_images:
            print(f"  <{bg['tag']} class='{bg['className']}'> style: {bg['style']}")

        browser.close()

if __name__ == "__main__":
    debug()
