"""
Detailed structure analysis of the About Us page.
"""
from playwright.sync_api import sync_playwright
import json

URL = "https://goearthward.com/about/"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    page.goto(URL, wait_until='networkidle', timeout=60000)
    page.wait_for_timeout(3000)

    # Get detailed page structure
    info = page.evaluate("""() => {
        // Get all Elementor top-level sections
        const elSections = document.querySelectorAll('.elementor-top-section');
        const sections = [];

        elSections.forEach((sec, i) => {
            const headings = Array.from(sec.querySelectorAll('h1, h2, h3, h4, h5, h6'));
            const headingTexts = headings.map(h => h.innerText.trim()).filter(t => t.length > 0);
            const images = Array.from(sec.querySelectorAll('img'));
            const imgSrcs = images.map(img => ({
                src: img.src.substring(0, 120),
                alt: img.alt,
                loaded: img.complete && img.naturalWidth > 0,
                width: img.naturalWidth,
                height: img.naturalHeight
            }));
            const links = Array.from(sec.querySelectorAll('a'));
            const buttons = links.filter(a => a.querySelector('.elementor-button') || a.classList.contains('elementor-button'));
            const buttonTexts = buttons.map(b => ({
                text: b.innerText.trim(),
                href: b.href
            }));
            const textContent = sec.innerText.trim().substring(0, 500);

            // Background image check
            const bgImages = [];
            sec.querySelectorAll('[style*="background"]').forEach(el => {
                const bg = el.style.backgroundImage || getComputedStyle(el).backgroundImage;
                if (bg && bg !== 'none') bgImages.push(bg.substring(0, 150));
            });

            sections.push({
                index: i,
                headingTexts,
                imageCount: images.length,
                images: imgSrcs,
                buttons: buttonTexts,
                textPreview: textContent.substring(0, 300),
                bgImages,
                rect: sec.getBoundingClientRect()
            });
        });

        // Check for Elementor wrapper
        const hasElementor = !!document.querySelector('.elementor');
        const hasElementorPro = !!document.querySelector('.elementor-pro') || document.querySelector('[data-element_type]') !== null;

        // Check for lorem ipsum anywhere
        const bodyText = document.body.innerText;
        const loremPatterns = ['Lorem ipsum', 'lorem ipsum', 'LOREM IPSUM', 'Dolor sit amet', 'dolor sit amet'];
        const loremFound = loremPatterns.filter(p => bodyText.includes(p));

        // Count visible CTA buttons
        const allCTAs = Array.from(document.querySelectorAll('a[href*="shop"]'));
        const visibleCTAs = allCTAs.filter(a => {
            const rect = a.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        });

        // Check horizontal scroll on mobile viewport
        const scrollWidth = document.documentElement.scrollWidth;
        const clientWidth = document.documentElement.clientWidth;
        const hasHorizontalScroll = scrollWidth > clientWidth + 5;

        return {
            pageTitle: document.title,
            hasElementor,
            elementorSectionCount: elSections.length,
            sections,
            loremFound,
            hasLoremIpsum: loremFound.length > 0,
            bodyTextLength: bodyText.length,
            totalCTALinks: allCTAs.length,
            visibleCTALinks: visibleCTAs.length,
            ctaDetails: allCTAs.map(a => ({
                text: a.innerText.trim().substring(0, 80),
                href: a.href
            })),
            scrollWidth,
            clientWidth,
            hasHorizontalScroll
        };
    }""")

    browser.close()

    print(json.dumps(info, indent=2, ensure_ascii=False))
