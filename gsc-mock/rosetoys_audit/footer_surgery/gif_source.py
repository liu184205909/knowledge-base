# -*- coding: utf-8 -*-
# 找前台 popup http gif 的渲染源：对照 18799 _elementor_data 渲染产物
import json, re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/'

# 1. 前台那段 http gif 的上下文（widget data-id 归属）
raw = open(base + 'prod1.html', encoding='utf-8', errors='replace').read()
m = re.search(r'src="http://rosetoys\.org[^"]*\.gif[^"]*"', raw)
print('gif at', m.start())
# 归属 widget data-id：往前最近 data-id
did = re.findall(r'data-id="([0-9a-f]+)"', raw[:m.start()])
print('nearest data-ids before:', did[-3:])
# 18799 模板内 data-id 全集
d = json.load(open(base + 'recon18799.json', encoding='utf-8'))
ed = d['meta']['_elementor_data']
ids = re.findall(r'"id":\s*"([0-9a-f]+)"', ed)
print('18799 element ids:', ids)
# element cache
ec = d['meta'].get('_elementor_element_cache')
if ec:
    print('element_cache len:', len(str(ec)))
    hits = re.findall(r'http://rosetoys\.org[^"\']*', str(ec))
    print('http in element_cache:', hits[:5])
# ed 里图片 URL 全量
urls = re.findall(r'https?://[^"\\ ]+', ed)
print('urls in _elementor_data:', urls)
