#!/usr/bin/env python3
"""Extract & classify slugs for SAMCO + Alaqua."""
import re, json, os
from collections import defaultdict

TMP = os.environ.get('TEMP', 'C:/Users/Dylan/AppData/Local/Temp').replace('\\', '/') + '/'

def load(fn):
    p = TMP + fn
    with open(p, 'r', encoding='utf-8') as f:
        return [l.strip() for l in f if l.strip()]

def slug_root(u):
    m = re.match(r'https?://[^/]+/([^/]+)/?$', u)
    return m.group(1) if m else None

def slug_project(u):
    m = re.match(r'https?://[^/]+/project/([^/]+)/?$', u)
    return m.group(1) if m else None

samco_post = load('samco_post_urls.txt')
samco_project = load('samco_project_urls.txt')
alaqua_post = load('alaqua_post_urls.txt')

samco_post_slugs = sorted(set(filter(None, [slug_root(u) for u in samco_post])))
samco_proj_slugs = sorted(set(filter(None, [slug_project(u) for u in samco_project])))
alaqua_post_slugs = sorted(set(filter(None, [slug_root(u) for u in alaqua_post])))

print(f"SAMCO post: {len(samco_post)} -> {len(samco_post_slugs)} unique")
print(f"SAMCO project: {len(samco_project)} -> {len(samco_proj_slugs)} unique")
print(f"Alaqua post: {len(alaqua_post)} -> {len(alaqua_post_slugs)} unique")

# 非"正式文章"关键词
for label, lst in [('SAMCO post', samco_post_slugs), ('SAMCO project', samco_proj_slugs), ('Alaqua post', alaqua_post_slugs)]:
    drafts = [s for s in lst if 'thank' in s or 'draft' in s or s in {'blog', 'projects', 'faq', 'about', 'careers'}]
    print(f"{label} non-article: {drafts}")

# 保存
with open(TMP + 'slugs.json', 'w', encoding='utf-8') as f:
    json.dump({
        'samco_post': samco_post_slugs,
        'samco_project': samco_proj_slugs,
        'alaqua_post': alaqua_post_slugs,
    }, f, ensure_ascii=False, indent=2)
print("Saved.")
