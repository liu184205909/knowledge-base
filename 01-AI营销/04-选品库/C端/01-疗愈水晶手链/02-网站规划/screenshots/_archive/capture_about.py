"""
Capture full-page screenshots of the About Us page
- Desktop: 1920x1080 viewport, full page scroll
- Mobile: 375x812 viewport, full page scroll
"""
from playwright.sync_api import sync_playwright
import os

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
URL = "https://goearthward.com/about/"

def capture_fullpage(url, output_path, viewport_width, viewport_height, device_label):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': viewport_width, 'height': viewport_height},
            device_scale_factor=2  # Retina quality
        )
        page = context.new_page()

        print(f"[{device_label}] Navigating to {url} ...")
        page.goto(url, wait_until='networkidle', timeout=60000)

        # Wait extra for lazy-loaded images
        page.wait_for_timeout(3000)

        # Scroll through the entire page to trigger lazy loading
        total_height = page.evaluate("document.body.scrollHeight")
        viewport_step = viewport_height - 100
        current_pos = 0
        while current_pos < total_height:
            page.evaluate(f"window.scrollTo(0, {current_pos})")
            page.wait_for_timeout(300)
            current_pos += viewport_step

        # Scroll back to top
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(1000)

        # Take full-page screenshot
        print(f"[{device_label}] Capturing full-page screenshot ({total_height}px total height)...")
        page.screenshot(path=output_path, full_page=True)
        print(f"[{device_label}] Saved to {output_path}")

        # Also capture above-the-fold only
        above_fold_path = output_path.replace('.png', '_above_fold.png')
        page.screenshot(path=above_fold_path, full_page=False, clip={'x': 0, 'y': 0, 'width': viewport_width, 'height': viewport_height})
        print(f"[{device_label}] Above-fold saved to {above_fold_path}")

        # Gather page info for analysis
        page_info = page.evaluate("""() => {
            const sections = [];
            // Check for Elementor sections
            document.querySelectorAll('.elementor-section, section, [data-element_type="section"]').forEach((el, i) => {
                const text = el.innerText.substring(0, 200).trim();
                const hasImg = el.querySelectorAll('img').length > 0;
                sections.push({
                    index: i,
                    hasImages: hasImg,
                    imgCount: el.querySelectorAll('img').length,
                    brokenImgs: Array.from(el.querySelectorAll('img')).filter(img => !img.complete || img.naturalWidth === 0).length,
                    textPreview: text.substring(0, 150),
                    rect: el.getBoundingClientRect()
                });
            });

            const allImgs = Array.from(document.querySelectorAll('img'));
            const brokenImages = allImgs.filter(img => !img.complete || img.naturalWidth === 0);

            const ctas = Array.from(document.querySelectorAll('a[href*="shop"], a[href*="Shop"], .elementor-button'));
            const ctaInfo = ctas.map(a => ({
                text: a.innerText.trim().substring(0, 80),
                href: a.href
            }));

            const hasLoremIpsum = document.body.innerText.includes('Lorem ipsum');

            return {
                title: document.title,
                totalSections: sections.length,
                sections: sections,
                totalImages: allImgs.length,
                brokenImageCount: brokenImages.length,
                brokenImageSrcs: brokenImages.map(img => img.src).slice(0, 10),
                ctaButtons: ctaInfo,
                hasLoremIpsum: hasLoremIpsum,
                bodyTextLength: document.body.innerText.length,
                pageHeight: document.body.scrollHeight
            };
        }""")

        browser.close()
        return page_info


if __name__ == "__main__":
    # Desktop screenshot
    desktop_path = os.path.join(OUTPUT_DIR, "about_desktop_fullpage.png")
    desktop_info = capture_fullpage(URL, desktop_path, 1920, 1080, "Desktop")

    # Mobile screenshot
    mobile_path = os.path.join(OUTPUT_DIR, "about_mobile_fullpage.png")
    mobile_info = capture_fullpage(URL, mobile_path, 375, 812, "Mobile")

    # Print analysis
    import json
    print("\n" + "="*80)
    print("DESKTOP PAGE ANALYSIS")
    print("="*80)
    print(json.dumps(desktop_info, indent=2, ensure_ascii=False))

    print("\n" + "="*80)
    print("MOBILE PAGE ANALYSIS")
    print("="*80)
    print(json.dumps(mobile_info, indent=2, ensure_ascii=False))
