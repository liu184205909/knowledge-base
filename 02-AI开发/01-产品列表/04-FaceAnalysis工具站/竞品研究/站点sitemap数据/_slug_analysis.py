# -*- coding: utf-8 -*-
"""slug 三维度分析：路径结构 / 命名模式 / 页型分布（SOP §3-4）
输入：同目录 {domain}_sitemap_raw.json（sitemap定位器产出）
输出：{domain}_slug_stats.json + 控制台汇总
"""
import json, sys, re, os
from collections import Counter
from urllib.parse import urlparse

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
BASE = os.path.dirname(os.path.abspath(__file__))

TOOL_PAT = re.compile(r'(test|calculator|detector|analyzer|analyser|checker|finder|rater|rating|guesser|scan|measure|mapper|quiz|scale|tool|analyz)', re.I)
BLOG_PAT = re.compile(r'(/blog/|/guides/|/guide/|/articles?/|/news/|/resources/|/learning-center/)', re.I)
ARCHIVE_PAT = re.compile(r'(/tag/|/tags/|/category/|/categories/|/author/|/page/\d+|/feed)', re.I)
ASSET_EXT = re.compile(r'\.(pdf|jpg|jpeg|png|gif|webp|svg|mp4|webm|css|js|xml|zip|ico|json|txt)$', re.I)

def page_type(url):
    path = urlparse(url).path
    slug = path.rstrip('/').split('/')[-1] if path.rstrip('/') else ''
    depth_seg = [s for s in path.split('/') if s]
    if ARCHIVE_PAT.search(path):
        return 'archive_tech'
    if TOOL_PAT.search(slug) or TOOL_PAT.search(path):
        return 'tool'
    if BLOG_PAT.search(path):
        return 'blog_post'
    return 'static_page_or_hub'

def depth_of(url):
    path = urlparse(url).path
    segs = [s for s in path.split('/') if s]
    return len(segs)

def first_seg(url):
    path = urlparse(url).path
    segs = [s for s in path.split('/') if s]
    return '/' + segs[0] if segs else '/ (root)'

def main():
    files = sorted(f for f in os.listdir(BASE) if f.endswith('_sitemap_raw.json'))
    summary = {}
    for fn in files:
        domain = fn.replace('_sitemap_raw.json', '')
        with open(os.path.join(BASE, fn), encoding='utf-8') as fh:
            data = json.load(fh)
        urls = data.get('page_urls', [])
        clean = [u for u in urls if not ASSET_EXT.search(urlparse(u).path) and '?' not in u]
        clean = sorted(set(clean))
        types = Counter(page_type(u) for u in clean)
        depths = Counter(depth_of(u) for u in clean)
        topdirs = Counter(first_seg(u) for u in clean)
        summary[domain] = {
            'url_total': len(clean),
            'page_types': dict(types),
            'depth_dist': dict(sorted(depths.items())),
            'top_level_dirs': dict(topdirs.most_common(15)),
            'discovered_via': data.get('discovered_via'),
            'sample_urls': clean[:10],
        }
        with open(os.path.join(BASE, f'{domain}_slug_stats.json'), 'w', encoding='utf-8') as fh:
            json.dump(summary[domain], fh, ensure_ascii=False, indent=1)
    # 控制台汇总表
    print(f"{'domain':38s} {'total':>5s} {'tool':>5s} {'blog':>5s} {'static':>6s} {'arch':>5s} {'via':>6s}")
    for d, s in summary.items():
        pt = s['page_types']
        print(f"{d:38s} {s['url_total']:5d} {pt.get('tool',0):5d} {pt.get('blog_post',0):5d} {pt.get('static_page_or_hub',0):6d} {pt.get('archive_tech',0):5d} {s['discovered_via'] or '?':>6s}")

if __name__ == '__main__':
    main()
