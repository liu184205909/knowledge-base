# -*- coding: utf-8 -*-
"""连通性测试:只发 2 条记录到飞书,验证字段格式。"""
import sys
import os
sys.path.insert(0, r"d:/Code/knowledge-base/01-AI营销/04-选品库/B端/04-蒸发结晶/01-竞品分析")
from import_to_feishu import (
    get_tenant_access_token, batch_create_records,
)

print("获取 token...")
token = get_tenant_access_token()
print(f"token: {token[:30]}...")

# 测试 2 条
test_records = [
    {
        "竞对": "SAMCO",
        "国别": "外贸",
        "文章类型": "1-解决方案/案例",
        "行业场景": "废水处理",
        "slug": "test-connectivity-samco-001",
        "推断主题": "",
        "备注": "连通性测试",
    },
    {
        "竞对": "Alfa Laval",
        "国别": "国际",
        "文章类型": "2-What-Is/原理",
        "行业场景": "",
        "slug": "test-connectivity-alfa-002",
        "推断主题": "",
        "备注": "连通性测试",
    },
]

print("\n发送 2 条测试记录...")
result = batch_create_records(token, test_records)
import json
print(json.dumps(result, ensure_ascii=False, indent=2)[:2000])
