# -*- coding: utf-8 -*-
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/'
data = json.load(open(base + 'before_728_elementor_data.json', encoding='utf-8'))
keep = [s for s in data if s.get('id') == '3791792'][0]

def dump(obj, path=''):
    if isinstance(obj, dict):
        for k, v in obj.items():
            p = f'{path}.{k}'
            if isinstance(v, (dict, list)):
                dump(v, p)
            else:
                sv = str(v)
                if 'rosetoys.org' in sv or 'http:' in sv:
                    print(f'{p} = {sv[:130]}')
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            dump(v, f'{path}[{i}]')

dump(keep, 'KEEP')
print()
print('=== KEEP section settings 原始 ===')
print(json.dumps(keep.get('settings', {}), ensure_ascii=False, indent=1)[:2500])
