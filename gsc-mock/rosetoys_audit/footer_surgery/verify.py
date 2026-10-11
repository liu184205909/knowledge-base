# -*- coding: utf-8 -*-
# 前台验证：三类页面 footer 指标
import re, sys, io, subprocess
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

pages = {
    'home': 'https://rosetoys.org/',
    'post': 'https://rosetoys.org/what-is-a-rose-toy/',
    'cat': 'https://rosetoys.org/product-category/rose-toys/rose-vibrator/',
    'prod': 'https://rosetoys.org/product/m-382-school-one-piece-swimsuits/',
}

for name, url in pages.items():
    fn = base + f'after_{name}.html'
    subprocess.run(['curl', '-s', '-A', UA, '-H', 'X-LiteSpeed-Purge: public', '-o', fn, url], check=True)
    raw = open(fn, encoding='utf-8', errors='replace').read()
    fs = raw.find('<footer'); fe = raw.find('</footer>')
    foot = raw[fs:fe] if fs >= 0 and fe > fs else ''
    # prefooter 段（footer 前 12KB 窗口）
    pre_win = raw[max(0, fs-13000):fs]
    metrics = {
        'total_kb': round(len(raw)/1024, 1),
        'footer_kb': round(len(foot)/1024, 1),
        '728_count': len(re.findall(r'data-elementor-id="728"', raw)),
        'wd_prefooter_div': 'wd-prefooter' in raw,
        'prefooter_728_copy': 'wd-prefooter' in pre_win and 'data-elementor-id="728"' in pre_win,
        'marketplace_icon': len(re.findall(r'marketplace-icon', raw)),
        'footer_http_refs': len(re.findall(r'(?:src|href)="http://rosetoys\.org', foot)),
        'camping_bg': len(re.findall(r'camping-footer-bg', raw)),
        'logo_https': 'https://rosetoys.org/wp-content/uploads/2023/12/logo-no-background.png' in foot,
        'policy_links': all(x in foot for x in ['privacy-policy', 'refund', 'term-of-service']),
        'social_icons': foot.count('wd-social-icon'),
        'widgets_in_footer': len(re.findall(r'elementor-widget ', foot)),
    }
    print(f'== {name} ==')
    for k, v in metrics.items():
        print(f'   {k}: {v}')
    print()
