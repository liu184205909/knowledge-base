"""
Capture individual sections of the About page to verify image rendering.
Focus on Quality Promise section (4 icons) and Community section (4 product images).
"""
import time
from playwright.sync_api import sync_playwright

URL = "https://goearthward.com/about/"
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

def capture_sections():
    with sync_playwright() as p:
        browser = p.chromium.launch()

        for label, w, h in [("desktop", 1920, 1080), ("mobile", 375, 812)]:
            print(f"\n=== {label} ({w}x{h}) ===")
            page = browser.new_page(viewport={"width": w, "height": h})
            page.goto(URL, wait_until="networkidle")

            # Scroll through to trigger lazy loading
            for i in range(20):
                page.evaluate(f"window.scrollTo(0, {(i+1) * 500})")
                time.sleep(0.3)
            page.evaluate("window.scrollTo(0, 0)")
            time.sleep(3)

            # Verify images loaded
            loaded = page.evaluate("""(targetImages) => {
                let count = 0;
                const allImgs = document.querySelectorAll('img');
                allImgs.forEach(img => {
                    const src = img.src || '';
                    targetImages.forEach(name => {
                        if (src.includes(name) && img.naturalWidth > 0) count++;
                    });
                });
                return count;
            }""", TARGET_IMAGES)
            print(f"  Images loaded: {loaded}/8")

            # Find and screenshot the Quality Promise section
            quality_section = page.evaluate("""() => {
                const headings = document.querySelectorAll('h2, h3');
                for (const h of headings) {
                    if (h.textContent.includes('Quality Promise') || h.textContent.includes('quality promise')) {
                        // Walk up to find the section container
                        let el = h.closest('section, div.elementor-section, div.e-con');
                        if (el) {
                            const box = el.getBoundingClientRect();
                            return {found: true, top: box.top + window.scrollY, left: box.left, width: box.width, height: box.height, text: h.textContent.trim()};
                        }
                    }
                }
                return {found: false};
            }""")
            print(f"  Quality Promise section: {quality_section}")

            # Find and screenshot the Community section
            community_section = page.evaluate("""() => {
                const headings = document.querySelectorAll('h2, h3');
                for (const h of headings) {
                    const txt = h.textContent.toLowerCase();
                    if (txt.includes('community') || txt.includes('crystal lovers') || txt.includes('join the')) {
                        let el = h.closest('section, div.elementor-section, div.e-con');
                        if (el) {
                            const box = el.getBoundingClientRect();
                            return {found: true, top: box.top + window.scrollY, left: box.left, width: box.width, height: box.height, text: h.textContent.trim()};
                        }
                    }
                }
                return {found: false};
            }""")
            print(f"  Community section: {community_section}")

            # List all headings to find section names
            all_headings = page.evaluate("""() => {
                return Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
                    tag: h.tagName,
                    text: h.textContent.trim().substring(0, 80)
                }));
            }""")
            print(f"\n  All headings on page:")
            for hd in all_headings:
                print(f"    {hd['tag']}: {hd['text']}")

            # Get bounding boxes for the 8 target images specifically
            img_boxes = page.evaluate("""(targetImages) => {
                const results = [];
                const allImgs = document.querySelectorAll('img');
                allImgs.forEach(img => {
                    const src = img.src || '';
                    targetImages.forEach(name => {
                        if (src.includes(name) && img.naturalWidth > 0) {
                            const box = img.getBoundingClientRect();
                            results.push({
                                name: name,
                                top: box.top + window.scrollY,
                                left: box.left,
                                width: box.width,
                                height: box.height,
                                naturalWidth: img.naturalWidth,
                                naturalHeight: img.naturalHeight,
                                displayed: box.width > 0 && box.height > 0,
                            });
                        }
                    });
                });
                return results;
            }""", TARGET_IMAGES)

            print(f"\n  Image bounding boxes ({label}):")
            for ib in img_boxes:
                visible = "VISIBLE" if ib['displayed'] else "HIDDEN"
                print(f"    {visible}: {ib['name']}")
                print(f"      position: top={ib['top']:.0f}px, left={ib['left']:.0f}px")
                print(f"      displayed size: {ib['width']:.0f}x{ib['height']:.0f}px")
                print(f"      natural size: {ib['naturalWidth']}x{ib['naturalHeight']}px")

            page.close()

        browser.close()
        print("\nDone!")

if __name__ == "__main__":
    capture_sections()
