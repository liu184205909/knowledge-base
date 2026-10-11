# -*- coding: utf-8 -*-
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/'

ed728 = open(base + 'after_728_elementor_data.json', encoding='utf-8').read()
pc728 = open(base + 'after_728_post_content.html', encoding='utf-8').read()
ed99 = open(base + 'after_18799_elementor_data.txt', encoding='utf-8').read()

# 预检：写回前再断言一次
assert 'marketplace-icon' not in ed728
assert 'http://rosetoys.org' not in ed728
assert 'http:' not in ed99
assert ed728.count('3791792') >= 1

payload = {
    "opt": {"prefooter_content_type": "", "prefooter_html_block": ""},
    "posts": {
        "728": {"elementor_data": ed728, "post_content": pc728},
        "18799": {"elementor_data": ed99}
    }
}
open(base + 'write_payload.json', 'w', encoding='utf-8').write(json.dumps(payload, ensure_ascii=False))
print('payload ready:', {'728_data': len(ed728), '728_content': len(pc728), '18799_data': len(ed99)})
