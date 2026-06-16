#!/usr/bin/env python3
"""
Generate minimal Elementor template for Gemstone Meaning pages.
Architecture: post_content HTML + global CSS (no ACF fields, no Dynamic Tags).
Template: 1 Container + 1 Post Content Widget + Custom CSS.
"""

import json, random, subprocess, base64, os, tempfile

# ─── CSS ──────────────────────────────────────────────────────────────

CSS = """
/* ===== Crystal Meaning Page Styles ===== */

/* Two-column layout */
selector .gemstone-page {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}
@media (max-width: 900px) {
  selector .gemstone-page {
    grid-template-columns: 1fr;
  }
  selector .crystal-profile {
    position: static !important;
    order: -1;
  }
}

/* Typography */
selector .gemstone-main h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.3;
  margin: 0 0 0.5rem 0;
}
selector .gemstone-main h2 {
  font-size: 1.6rem;
  font-weight: 600;
  color: #1a1a2e;
  line-height: 1.3;
  margin: 2.5rem 0 1rem 0;
  padding-left: 16px;
  border-left: 4px solid #2D6A4F;
}
selector .gemstone-main h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 1.5rem 0 0.8rem 0;
}
selector .gemstone-main h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 1rem 0 0.5rem 0;
}
selector .gemstone-main p {
  font-size: 1rem;
  line-height: 1.8;
  color: #444;
  margin: 0 0 1rem 0;
}
selector .gemstone-main ul, selector .gemstone-main ol {
  margin: 0 0 1rem 1.5rem;
}
selector .gemstone-main li {
  font-size: 1rem;
  line-height: 1.8;
  color: #444;
  margin-bottom: 0.4rem;
}
selector .gemstone-main a {
  color: #2D6A4F;
  text-decoration: none;
  border-bottom: 1px solid #95D5B2;
}
selector .gemstone-main a:hover {
  color: #1B4332;
  border-bottom-color: #2D6A4F;
}

/* Subtitle */
selector .gemstone-main .subtitle {
  font-size: 1.1rem;
  color: #666;
  font-style: italic;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

/* Images */
selector .gemstone-main img {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin: 1rem 0;
  display: block;
}

/* Featured image */
selector .gemstone-main .featured-image {
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

/* Quick Answer box */
selector .gemstone-main .quick-answer {
  background: #f0f7f4;
  border-left: 4px solid #2D6A4F;
  padding: 16px 20px;
  border-radius: 0 8px 8px 0;
  margin: 1rem 0;
  font-size: 0.95rem;
  line-height: 1.7;
}

/* Mineral data table */
selector .mineral-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.9rem;
}
selector .mineral-table td {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
selector .mineral-table td:first-child {
  color: #999;
  width: 40%;
  font-weight: 500;
}
selector .mineral-table td:last-child {
  color: #333;
}

/* Benefits grid */
selector .benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 1.5rem 0;
}
@media (max-width: 600px) {
  selector .benefits-grid {
    grid-template-columns: 1fr;
  }
}
selector .benefit-card {
  background: #f8f8f8;
  padding: 18px 20px;
  border-radius: 10px;
  border: 1px solid #eee;
  transition: box-shadow 0.2s;
}
selector .benefit-card:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
selector .benefit-card h4 {
  color: #2D6A4F;
  margin: 0 0 8px 0;
  font-size: 1rem;
}
selector .benefit-card p {
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  color: #666;
}

/* FAQ accordion */
selector .faq-list {
  margin: 1rem 0;
}
selector .faq-list details {
  border-bottom: 1px solid #eee;
  padding: 12px 0;
}
selector .faq-list details:first-child {
  border-top: 1px solid #eee;
}
selector .faq-list summary {
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  color: #1a1a2e;
  padding: 4px 0;
  list-style: none;
  display: flex;
  align-items: center;
}
selector .faq-list summary::before {
  content: '+';
  color: #2D6A4F;
  font-size: 1.3rem;
  margin-right: 10px;
  font-weight: 300;
}
selector .faq-list details[open] summary::before {
  content: '−';
}
selector .faq-list summary::-webkit-details-marker {
  display: none;
}
selector .faq-list details p {
  padding: 8px 0 8px 24px;
  margin: 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.7;
}

/* Safety badges */
selector .safety-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 0.8rem 0;
}
selector .safety-badge {
  padding: 5px 12px;
  border-radius: 14px;
  font-size: 0.8rem;
  font-weight: 500;
}
selector .badge-safe { background: #E8F5E9; color: #2E7D32; }
selector .badge-fades { background: #FFF3E0; color: #E65100; }
selector .badge-avoid { background: #FFEBEE; color: #C62828; }

/* Audio player */
selector .gemstone-main audio {
  width: 100%;
  margin: 1rem 0;
}

/* ===== Sidebar: Crystal Profile Card ===== */
selector .crystal-profile {
  background: #f8f8f8;
  padding: 24px 20px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  position: sticky;
  top: 20px;
  align-self: start;
}
selector .crystal-profile h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 16px 0;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 2px solid #2D6A4F;
}
selector .crystal-profile audio {
  width: 100%;
  margin-bottom: 12px;
}
selector .sidebar-section {
  margin-bottom: 16px;
}
selector .sidebar-section h4 {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999;
  margin: 0 0 8px 0;
  font-weight: 600;
}
selector .sidebar-section dl {
  margin: 0;
}
selector .sidebar-section dt {
  font-size: 0.8rem;
  color: #999;
  display: inline-block;
  width: 45%;
  vertical-align: top;
}
selector .sidebar-section dd {
  font-size: 0.88rem;
  color: #333;
  display: inline-block;
  width: 55%;
  margin: 0 0 4px 0;
  vertical-align: top;
}
selector .sidebar-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 12px 0;
}
selector .sidebar-section .safety-badges {
  margin-top: 4px;
}
selector .cta-button {
  display: block;
  text-align: center;
  padding: 12px 20px;
  background: #2D6A4F;
  color: #fff !important;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  margin-top: 8px;
  border: none !important;
  transition: background 0.2s;
}
selector .cta-button:hover {
  background: #1B4332;
  color: #fff !important;
}
"""

# ─── Elementor Template ───────────────────────────────────────────────

def gen_id():
    return ''.join(random.choices('0123456789abcdef', k=7))

template = [{
    "id": gen_id(),
    "elType": "container",
    "settings": {
        "content_width": "boxed",
        "wd_section_stretch": "stretch",
        "scroll_y": -80,
        "flex_direction": "column",
        "padding": {"unit": "px", "top": "20", "right": "10", "bottom": "40", "left": "10", "isLinked": False},
        "custom_css": CSS,
    },
    "elements": [
        {
            "id": gen_id(),
            "elType": "widget",
            "widgetType": "theme-post-content",
            "settings": {},
            "elements": [],
            "isInner": True,
        }
    ],
    "isInner": False,
}]

# ─── Inject via REST API ──────────────────────────────────────────────
# 凭证从全局 ~/.env（C:\Users\Dylan\.env）读取，与 Node 脚本 elementor-utils.js 共用同一份，禁止硬编码。
_env_path = os.path.join(os.path.expanduser('~'), '.env')
if os.path.exists(_env_path):
    for _line in open(_env_path, encoding='utf-8'):
        _line = _line.strip()
        if _line and not _line.startswith('#') and '=' in _line:
            _k, _v = _line.split('=', 1)
            os.environ.setdefault(_k.strip(), _v.strip().strip("'\""))
user = os.environ.get('WP_USER')
pwd = os.environ.get('WP_APP_PASSWORD')
if not user or not pwd:
    raise SystemExit('缺少 WP_USER / WP_APP_PASSWORD。请写入 D:\\Code\\.env'
                     '（格式 WP_USER=邮箱 / WP_APP_PASSWORD=应用密码）。不要把密码写回本文件。')
auth = base64.b64encode(f'{user}:{pwd}'.encode()).decode()
proxy = os.environ.get('WP_PROXY', 'http://127.0.0.1:10808')
tpl_id = 38571

elementor_data_str = json.dumps(template, ensure_ascii=False)

inject_body = json.dumps({
    "title": "Gemstone Meaning Single v2",
    "status": "publish",
    "meta": {
        "_elementor_data": elementor_data_str,
        "_elementor_edit_mode": "builder",
        "_elementor_template_type": "single-post"
    }
})

tmp = os.path.join(tempfile.gettempdir(), 'elementor_minimal.json')
with open(tmp, 'w', encoding='utf-8') as f:
    f.write(inject_body)

print(f"Template elements: {len(template)}")
print(f"CSS size: {len(CSS)} chars")
print(f"Injection payload: {os.path.getsize(tmp)} bytes")
print(f"Injecting to template ID {tpl_id}...")

result = subprocess.run([
    'curl', '-s', '--proxy', proxy,
    '-X', 'POST',
    f'https://goearthward.com/wp-json/wp/v2/elementor_library/{tpl_id}?context=edit',
    '-H', f'Authorization: Basic {auth}',
    '-H', 'Content-Type: application/json',
    '-d', f'@{tmp}'
], capture_output=True, timeout=60)

resp = json.loads(result.stdout.decode('utf-8'))
ed = resp.get('meta', {}).get('_elementor_data', '')
custom_css_found = 'gemstone-page' in ed if ed else False
print(f"Injected: {'YES (' + str(len(ed)) + ' chars)' if ed else 'NO'}")
print(f"CSS embedded: {custom_css_found}")
os.unlink(tmp)

# Also save CSS to file for reference
css_path = r'd:\Code\knowledge-base\01-AI营销\04-选品库\C端\01-疗愈水晶手链\02-网站规划\crystal-meaning-styles.css'
with open(css_path, 'w', encoding='utf-8') as f:
    f.write(CSS.strip())
print(f"\nCSS saved to: {css_path}")
