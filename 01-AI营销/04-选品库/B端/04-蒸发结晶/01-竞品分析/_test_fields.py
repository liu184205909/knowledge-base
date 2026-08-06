# -*- coding: utf-8 -*-
"""检查飞书表的字段。"""
import json
import urllib.request
import urllib.error
import sys
sys.path.insert(0, r"d:/Code/knowledge-base/01-AI营销/04-选品库/B端/04-蒸发结晶/01-竞品分析")
from import_to_feishu import (
    get_tenant_access_token, BASE_TOKEN, TABLE_ID,
)

token = get_tenant_access_token()
print(f"token ok")

# 列出字段
url = (
    f"https://open.feishu.cn/open-apis/bitable/v1/apps/"
    f"{BASE_TOKEN}/tables/{TABLE_ID}/fields"
)
req = urllib.request.Request(
    url,
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json; charset=utf-8",
    },
    method="GET",
)
try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    print(json.dumps(data, ensure_ascii=False, indent=2)[:3000])
except urllib.error.HTTPError as e:
    body = e.read().decode("utf-8") if e.fp else ""
    print(f"HTTP {e.code}: {body}")
