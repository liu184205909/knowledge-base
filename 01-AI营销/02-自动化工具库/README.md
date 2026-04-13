# 02-自动化工具库

> 服务于 RLM 营销流程的自动化脚本与工具集合 | 最后更新: 2026-04-13

---

## 工具总览

| 序号 | 工具 | 核心功能 | 脚本文件 |
|------|------|---------|---------|
| **01** | 域名查询 | 批量检测域名可用性，WHOIS 查询 | `domain_checker.py` |
| **02** | 竞品挖掘工具 | 通过 SERP 批量发现竞品独立站 | `serp_competitor_finder.py` |
| **03** | 竞品分析工具 | Sitemap 解析，还原竞品内容架构 | `sitemap_parser.py` |
| **04** | WordPress建站 | AI 操作 WordPress，Elementor 建站规则 | 文档为主 |
| **05** | 竞品内容分析工具 | 批量抓取 title/H1/H2，输出内容模式报告 | `content_analyzer.py` |

---

## 标准工作流

### 1. 宏观流程拆解

| 阶段 | 工具 / 环节 | 核心目标 |
|------|------------|---------|
| 步骤1 | `02-竞品挖掘工具` | SERP批量拉竞品 |
| 步骤2 | `03-竞品分析工具` | Sitemap解析网站结构 |
| 步骤3 | `01-域名查询` / `04-WordPress建站` | 域名选择 + 建站 |
| 步骤4 | `SEMrush + AI` | 关键词数据获取与分析 |

### 2. 核心脚本执行链路

```text
02-竞品挖掘工具/serp_competitor_finder.py   ← SERP 批量拉竞品
    ↓ competitor_urls.txt
03-竞品分析工具/sitemap_parser.py           ← Sitemap 解析内容架构
    ↓ blog_urls.csv
05-竞品内容分析工具/content_analyzer.py     ← 批量抓取 title/H1/H2，输出内容模式报告
```

---

## 环境依赖

```bash
pip install requests beautifulsoup4 lxml pandas googlesearch-python tqdm
```

---

## 01 域名查询

**文件**：`01-域名查询/domain_checker.py`

```bash
# 安装依赖
pip install python-whois

# 批量检测域名
python 01-域名查询/domain_checker.py
```

输出：`domain_availability_with_whois.csv`（域名可用性 + 注册信息）

---

## 02 竞品挖掘工具

**文件**：`02-竞品挖掘工具/serp_competitor_finder.py`

**原理**：搜索目标关键词，过滤 Amazon/Reddit 等大平台，只保留独立站竞品。

```bash
# 单个关键词
python 02-竞品挖掘工具/serp_competitor_finder.py --keyword "gel blaster gun"

# 批量关键词（每行一个）
python 02-竞品挖掘工具/serp_competitor_finder.py --file keywords.txt

# 调整抓取页数（默认3页）
python 02-竞品挖掘工具/serp_competitor_finder.py --keyword "xxx" --pages 5
```

输出：`competitor_urls.txt`（一行一个竞品 URL）

---

## 03 竞品分析工具（Sitemap 解析）

**文件**：`03-竞品分析工具/sitemap_parser.py`

**原理**：自动发现并解析竞品 sitemap.xml，支持 sitemap index 嵌套，按 URL pattern 分类内容。

```bash
# 单个竞品（自动发现 sitemap）
python 03-竞品分析工具/sitemap_parser.py --url https://competitor.com

# 直接指定 sitemap.xml
python 03-竞品分析工具/sitemap_parser.py --url https://competitor.com/sitemap.xml

# 批量（接 02 的输出）
python 03-竞品分析工具/sitemap_parser.py --file 02-竞品挖掘工具/competitor_urls.txt
```

输出：
- `sitemap_results/<domain>_sitemap_report.md`：内容架构分析（目录结构、URL 深度）
- `sitemap_results/<domain>_blog_urls.csv`：博客 URL 列表，供 05 使用

---

## 04 WordPress 建站

**文件**：`04-WordPress建站/` 下均为文档，无脚本。

| 文档 | 内容 |
|------|------|
| `AI操作WordPress.md` | Claude Code 操作 WP 的完整指南 |
| `ELE建站规则.md` | Elementor 页面建设规范 |
| `Elementor数据库存储格式.md` | Elementor 数据库结构参考 |

---

## 05 竞品内容分析工具

**文件**：`05-竞品内容分析工具/content_analyzer.py`

**原理**：批量抓取竞品文章的 title/meta/H1/H2，自动分类为「选购指南/教程/科普/产品页」等类型，生成跨竞品内容模式报告。

```bash
# 接 03 的输出（推荐）
python 05-竞品内容分析工具/content_analyzer.py \
  --input 03-竞品分析工具/sitemap_results/<domain>_blog_urls.csv

# 自定义 URL 列表（txt，每行一个）
python 05-竞品内容分析工具/content_analyzer.py --input my_urls.txt

# 限速（避免被封）
python 05-竞品内容分析工具/content_analyzer.py --input urls.csv --concurrency 3 --delay 2

# 调试（只跑前20条）
python 05-竞品内容分析工具/content_analyzer.py --input urls.csv --limit 20
```

输出：
- `results/content_pattern_report_<时间>.md`：内容类型分布 + 各竞品对比 + 内容空白
- `results/articles_detail_<时间>.csv`：所有文章原始数据

---

## 删除历史说明

> 本目录在 2026-04-12 `commit 64ee06e` 中被整体删除，原因是历次文档重构中将文件标注为"已迁移/已整合"但未真正搬移，导致内容逐步流失。2026-04-13 根据 git 日志完整恢复，并补建从未提交过的竞品挖掘和分析脚本。
