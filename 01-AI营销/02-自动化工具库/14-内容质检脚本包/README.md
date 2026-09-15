# 14-内容质检脚本包

> 2026-09-14 从 01-营销方法论基础/03-内容生产与质检 迁入（工具库是脚本的家）。三脚本对应内容生产 SOP 的质检环节，非一次性。

| 脚本 | 行数 | 功能 | 被引用于 |
|------|------|------|---------|
| `content_analyzer.py` | 283 | 竞品内容元数据抓取 + 分类 + CSV 输出 | 内容生产实操SOP §质检 |
| `content_duplicate_checker.py` | 386 | **simhash 站内重复检测**（重复度 > 阈值则重写） | 内容生产实操SOP / 塔罗重做方案 / 滤网站内容框架（质检门） |
| `content_originality_checker.py` | 371 | 站外原创度检查（对 SERP 竞品跑 N-gram 重合度） | 同上 |

## 用法

```bash
python content_duplicate_checker.py --sitemap https://yoursite.com/sitemap.xml --threshold 0.8
python content_originality_checker.py --url https://yoursite.com/page --competitors comp1.com,comp2.com
python content_analyzer.py --input urls.csv --output analysis.csv
```

依赖：`pip install requests beautifulsoup4`

## 关联

- 质检流程文档：`01-营销方法论基础/03-内容生产与质检/`（生产SOP + EEAT 准入 + 08 存量审计）
- 姊妹包：`13-SEO审计脚本包`（站点/技术层审计）
