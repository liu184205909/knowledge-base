# 13-SEO 审计脚本包

> 2026-09-14 从 01-营销方法论基础/04-SEO全链路与审计 迁入（工具库是脚本的家）。三脚本均为成型可复用工具，非一次性。

| 脚本 | 行数 | 功能 | 被引用于 |
|------|------|------|---------|
| `seo_technical_auditor.py` | 527 | sitemap 加载 → robots.txt 检查 → 逐页技术审计 → 报告生成 | 04/01-SEO全链路工作流、05-SEO测量危机（漂移监控复用其检查逻辑，见工作流第 IV 部分） |
| `onpage_seo_checker.py` | 669 | On-page 要素批量检查（Title/Meta/H1/结构） | 04/01-SEO全链路工作流 |
| `keyword_cannibalization_checker.py` | 369 | 关键词蚕食检测（多页面竞争同一查询） | 04/01-SEO全链路工作流 |

## 用法

```bash
python seo_technical_auditor.py --sitemap https://yoursite.com/sitemap.xml
python onpage_seo_checker.py --urls urls.txt
python keyword_cannibalization_checker.py --domain yoursite.com
```

依赖：`pip install requests beautifulsoup4`
