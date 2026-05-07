# 02-自动化工具库

> 服务于 RLM 营销流程的自动化脚本与工具集合 | 最后更新: 2026-05-07

---

## 工具总览

| 序号 | 工具 | 核心功能 | 脚本文件 |
|------|------|---------|---------|
| **01** | 域名查询 | 批量检测域名可用性，WHOIS 查询 | `domain_checker.py` |
| **02** | 竞品挖掘工具 | 通过 SERP 批量发现竞品独立站（6家免费API轮询+DataForSEO兜底） | `serp_competitor_finder.py` |
| **03** | 竞品分析工具 | Sitemap 解析，还原竞品内容架构 | `sitemap_parser.py` |
| **04** | WordPress建站 | AI 操作 WordPress，Elementor 建站规则 | 文档为主 |
| **05** | 竞品内容分析工具 | 批量抓取 title/H1/H2，输出内容模式报告 | `content_analyzer.py` |
| **06** | WordPress插件 | TranslatePress AI翻译方案等插件调研 | 文档为主 |
| **07** | 图片生成 | AI图片生成，用于社媒配图、信息图、幻灯片配图 | 待建设 |
| **08** | 数据分析工具 | Google Data Studio 数据可视化，SEO/流量仪表盘 | 文档为主 |
| **09** | 短视频工具 | 素材采集/拆解/创作/分发全链路（配合步骤4C音视频再加工） | 文档为主 |
| **10** | SEO数据API | DR/流量/流量渠道获取（DataForSEO + RapidAPI + Apify） | 文档为主 |

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
    ↓ 网站上线后
08-数据分析工具/Data Studio                 ← GSC/GA4 数据可视化，驱动内容迭代
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

**SERP 数据源**：6 家免费 API 轮询 + DataForSEO 付费兜底，详见 [SERP数据源选型方案.md](02-竞品挖掘工具/SERP数据源选型方案.md)

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

## 08 数据分析工具

**文件**：`08-数据分析工具/01-Google-Data-Studio使用指南.md`

**定位**：网站上线后的数据可视化中心，连接 GSC + GA4 + Sheets 搭建 SEO/流量仪表盘。

**核心数据流**：

```
竞品分析数据（CSV）→ Google Sheets → Data Studio 仪表盘
                                        ↑
GSC 搜索排名 ─────────────────────── 原生连接
GA4 流量行为 ─────────────────────── 原生连接
```

**当前状态**：基础文档已创建，等网站上线有数据后补充仪表盘模板和进阶分析。

---

## 10 SEO 数据 API

**文件**：`10-SEO数据API/DR与流量数据获取方案.md`

**定位**：竞品分析阶段（RLM 步骤 1B）批量获取域名权重、流量、流量渠道等指标的 API 方案。

**三层工具组合**：

| 层级 | 工具 | 提供数据 | 状态 |
|------|------|---------|------|
| DR + 反链 + ETV | DataForSEO MCP（已有） | rank、backlinks、referring_domains、etv | 已集成 |
| 流量渠道拆分 | RapidAPI Similarweb API | 6 渠道占比 + Engagement + 关键词 | 待接入 |
| AI流量 + 竞品 | Apify Similarweb Actor | ChatGPT/Perplexity 流量、Top5 竞品 | 按需 |

**详细文档**：[DR与流量数据获取方案.md](10-SEO数据API/DR与流量数据获取方案.md)

---

## 删除历史说明

> 本目录在 2026-04-12 `commit 64ee06e` 中被整体删除，原因是历次文档重构中将文件标注为"已迁移/已整合"但未真正搬移，导致内容逐步流失。2026-04-13 根据 git 日志完整恢复，并补建从未提交过的竞品挖掘和分析脚本。
