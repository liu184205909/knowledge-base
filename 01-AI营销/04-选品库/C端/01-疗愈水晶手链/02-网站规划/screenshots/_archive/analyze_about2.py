"""
Detailed structure analysis v2 - use broader selectors.
"""
from playwright.sync_api import sync_playwright
import json

URL = "https://luckycrystals.org/about/"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    page.goto(URL, wait_until='networkidle', timeout=60000)
    page.wait_for_timeout(3000)

    info = page.evaluate("""() => {
        // Try multiple section selectors
        const selectors = [
            '.elementor-section-wrap > .elementor-element',
            '.elementor > .elementor-section',
            '[data-element_type="section"]',
            '.elementor-section',
            'section',
            '.elementor-section-wrap > div'
        ];

        let foundSelector = null;
        let elements = [];
        for (const sel of selectors) {
            const els = document.querySelectorAll(sel);
            if (els.length > 0) {
                foundSelector = sel;
                elements = Array.from(els);
                break;
            }
        }

        // If still no sections found, try to analyze by top-level containers
        if (elements.length === 0) {
            const main = document.querySelector('main') || document.querySelector('#main') || document.querySelector('.site-main') || document.querySelector('#content');
            if (main) {
                elements = Array.from(main.children);
                foundSelector = 'main > *';
            }
        }

        const sections = [];
        elements.forEach((sec, i) => {
            const headings = Array.from(sec.querySelectorAll('h1, h2, h3, h4'));
            const headingTexts = headings.map(h => ({tag: h.tagName, text: h.innerText.trim()})).filter(h => h.text.length > 0);
            const images = Array.from(sec.querySelectorAll('img'));
            const imgInfo = images.map(img => ({
                src: img.src.substring(0, 150),
                alt: img.alt || '(no alt)',
                loaded: img.complete && img.naturalWidth > 0,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight
            }));
            const links = Array.from(sec.querySelectorAll('a'));
            const ctaLinks = links.filter(a => a.href.includes('shop'));
            const buttons = links.filter(a =>
                a.classList.contains('elementor-button') ||
                a.querySelector('.elementor-button') ||
                a.classList.contains('button') ||
                a.classList.contains('wp-block-button__link')
            );
            const textPreview = sec.innerText.trim().substring(0, 400);

            const rect = sec.getBoundingClientRect();
            if (rect.height > 20) {  // Skip invisible/empty elements
                sections.push({
                    index: i,
                    tag: sec.tagName,
                    classes: sec.className.substring(0, 200),
                    headingTexts,
                    imageCount: images.length,
                    images: imgInfo.slice(0, 5),
                    ctaLinks: ctaLinks.map(a => ({text: a.innerText.trim().substring(0, 80), href: a.href})),
                    buttons: buttons.map(b => ({text: b.innerText.trim().substring(0, 80), href: b.href})),
                    textPreview: textPreview.substring(0, 300),
                    top: Math.round(rect.top + window.scrollY),
                    height: Math.round(rect.height),
                    width: Math.round(rect.width),
                    visible: rect.width > 0 && rect.height > 0
                });
            }
        });

        // Check for broken images
        const allImgs = Array.from(document.querySelectorAll('img'));
        const brokenImgs = allImgs.filter(img => !img.complete || img.naturalWidth === 0);

        // Check for CSS background images
        const bgImgElements = Array.from(document.querySelectorAll('*')).filter(el => {
            const bg = getComputedStyle(el).backgroundImage;
            return bg && bg !== 'none' && bg.includes('url');
        });

        return {
            usedSelector: foundSelector,
            totalElementsFound: elements.length,
            visibleSections: sections.length,
            sections,
            totalImages: allImgs.length,
            brokenImages: brokenImgs.map(img => ({src: img.src.substring(0, 150), alt: img.alt})),
            cssBackgroundImages: bgImgElements.length,
            pageHeight: document.documentElement.scrollHeight
        };
    }""")

    browser.close()

    print(json.dumps(info, indent=2, ensure_ascii=False))
