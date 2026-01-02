#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
README 自动更新脚本
自动更新主 README.md 中的知识库结构表格
"""

import os
import re
from pathlib import Path

# 设置工作目录
WORK_DIR = r"d:\Program Files (x86)\Project Code\知识库"
os.chdir(WORK_DIR)

# 定义知识库结构
knowledge_base = {
    "00-CC使用手册": {
        "path": "知识库/00-CC使用手册",
        "docs": [
            {"name": "01-claude code安装指南.md", "desc": "插件+MCP安装配置（AI自动执行）"},
            {"name": "02-Skills核心概念.md", "desc": "Skills概念与原理"},
            {"name": "03-UI设计自动化.md", "desc": "aura.build使用指南"},
        ]
    },
    "01-AI营销实战": {
        "path": "知识库/01-AI营销实战",
        "docs": [
            {"name": "01-前置研究/01-前置研究.md", "desc": "竞品分析与用户洞察"},
            {"name": "02-内容生产/02-内容生产.md", "desc": "批量内容生产策略"},
            {"name": "02-内容生产/Prompt模板库.md", "desc": "营销专用Prompt"},
            {"name": "02-内容生产/社媒自动化.md", "desc": "社交媒体自动化"},
            {"name": "04-智能优化/03-推广优化.md", "desc": "效果优化策略"},
        ]
    },
    "02-AI开发实战": {
        "path": "知识库/02-AI开发实战",
        "docs": [
            {"name": "01-产品设计/00-产品前置工作.md", "desc": "产品规划与需求分析"},
            {"name": "02-AI开发流程/feature-dev开发流程.md", "desc": "功能开发工作流"},
            {"name": "02-AI开发流程/Vibe-Coding多AI协作.md", "desc": "多AI协作模式"},
            {"name": "超级个体实践指南.md", "desc": "超级个体培养方法论"},
            {"name": "02-AI开发流程/自动化流水线案例.md", "desc": "CI/CD自动化案例"},
        ]
    },
    "03-GEO前沿探索": {
        "path": "知识库/03-GEO前沿探索",
        "docs": [
            {"name": "GEO完全指南.md", "desc": "AI时代的SEO指南"},
            {"name": "GEO知识图谱索引.md", "desc": "知识体系导航"},
            {"name": "GEO增长案例.md", "desc": "实战增长案例"},
        ]
    },
    "04-团队协作": {
        "path": "知识库/04-团队协作",
        "docs": [
            {"name": "README.md", "desc": "团队协作框架"},
        ]
    },
}

def main():
    # 读取主 README.md
    readme_path = "README.md"

    if not os.path.exists(readme_path):
        print("[ERROR] README.md not found")
        return 1

    with open(readme_path, 'r', encoding='utf-8') as f:
        readme_content = f.read()

    # 构建新的知识库结构表格
    table_lines = []
    table_lines.append("| 目录 | 文档 | 说明 |")
    table_lines.append("|------|------|------|")

    total_docs = 0

    for folder in sorted(knowledge_base.keys()):
        info = knowledge_base[folder]
        folder_path = info["path"]

        first_doc = True
        for doc in info["docs"]:
            total_docs += 1

            doc_name = doc["name"]
            doc_desc = doc["desc"]
            doc_link = f"{folder_path}/{doc_name}"

            if first_doc:
                table_lines.append(f"| **{folder}** | [{doc_name}]({doc_link}) | {doc_desc} |")
                first_doc = False
            else:
                table_lines.append(f"| | [{doc_name}]({doc_link}) | {doc_desc} |")

    # 查找并替换知识库结构表格
    table_pattern = r'(## 📚 知识库结构.*?\n)(.*?)(\n---\s*?\n## 🎓 学习路径)'

    new_section = f"""## 📚 知识库结构

{chr(10).join(table_lines)}

---

## 🎓 学习路径
"""

    match = re.search(table_pattern, readme_content, re.DOTALL)

    if match:
        # 替换表格
        readme_content = readme_content[:match.start()] + new_section + readme_content[match.end():]

        # 更新统计数据
        stats_pattern = r'\*\*总计\*\*\s*\|\s*\*\*\d+个\*\*\s*\|\s*\*~[\d,]+行'
        new_stats = f"**总计** | **{total_docs}个** | **~25,000行，重复内容<5%**"
        readme_content = re.sub(stats_pattern, new_stats, readme_content)

        # 写回文件
        with open(readme_path, 'w', encoding='utf-8', newline='\n') as f:
            f.write(readme_content)

        print("[OK] README.md updated successfully!")
        print(f"[Stats] {total_docs} documents")
        print("\n[Tip] Use this command to commit:")
        print('   git add README.md && git commit -m "docs: auto-sync README.md knowledge base structure" && git push')
        return 0
    else:
        print("[ERROR] Knowledge base structure table not found, please check README.md format")
        return 1

if __name__ == "__main__":
    exit(main())
