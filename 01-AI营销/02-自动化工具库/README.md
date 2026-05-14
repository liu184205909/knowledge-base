# 02-自动化工具库

> 服务于 RLM 营销流程的自动化脚本与工具集合 | 最后更新: 2026-05-14

---

## 工具总览

| 序号 | 工具 | 核心功能 | 脚本文件 |
|------|------|---------|---------|
| **01** | 域名查询 | 批量检测域名可用性，WHOIS 查询 | `domain_checker.py` |
| **02** | 竞品研究工具 | 人工 Google 搜索竞品 + SEMrush 数据采集 + Sitemap 解析网站结构 | `semrush_to_sheets.py` `sitemap_parser.py`（`serp_competitor_finder.py` 已退役） |
| **03** | WordPress 建站 | AI 操作 WordPress，Elementor 建站规则 | 文档为主 |
| **04** | 竞品内容分析工具 | 内容模式分析 + 站内重复检测 + 站外原创性检测 | `content_analyzer.py` `content_duplicate_checker.py` `content_originality_checker.py` |
| **05** | WordPress 插件 | TranslatePress AI 翻译方案等插件调研 | 文档为主 |
| **06** | 数据分析工具 | Google Data Studio 数据可视化，SEO/流量仪表盘 | 文档为主 |
| **07** | 短视频工具 | 素材采集/拆解/创作/分发全链路（配合步骤4C音视频再加工） | 文档为主 |
| **08** | SEMrush 数据采集 | 竞品 AS/流量/截图批量采集（已整合到 02-竞品研究工具） | `semrush_to_sheets.py`（在02下） |
| **09** | SEO 审计工具 | 技术SEO审计 + On-Page SEO评分 + 关键词蚕食检测 | `seo_technical_auditor.py` `onpage_seo_checker.py` `keyword_cannibalization_checker.py` |
| **10** | 用户洞察工具 | 采集 Reddit/竞品评论 → 分类分析 → 选题/痛点/购买意向挖掘 | `reddit_comment_collector.py` `comment_insight_analyzer.py` |
| **11** | GEO 可见性检查 | 7维度检查品牌在 AI 生态中的可见性信号（Reddit/Quora/评价站/Wikipedia/媒体/竞品对比） | `geo_visibility_checker.py` |

---

## 标准工作流

### 1. 竞品研究阶段（建站前）

```text
人工 Google 搜索（排除语法过滤大平台）     ← 筛选 ~40 个竞品域名
    ↓
02-竞品研究工具/semrush_to_sheets.py       ← SEMrush 数据采集（AS/流量/截图 → Google Sheets）
02-竞品研究工具/sitemap_parser.py          ← Sitemap 解析内容架构
    ↓ blog_urls.csv
04-竞品内容分析工具/content_analyzer.py    ← 批量抓取 title/H1/H2，输出内容模式报告
```

### 2. 建站阶段

```text
01-域名查询/domain_checker.py              ← 域名可用性检测
    ↓
03-WordPress建站/                          ← 建站指南 + Elementor 操作手册
```

### 3. 运营优化阶段（建站后）

```text
04-竞品内容分析工具/content_duplicate_checker.py      ← 站内重复内容检测
04-竞品内容分析工具/content_originality_checker.py    ← 站外原创性检测
09-SEO审计工具/seo_technical_auditor.py               ← 技术SEO审计
09-SEO审计工具/onpage_seo_checker.py                  ← On-Page SEO评分
09-SEO审计工具/keyword_cannibalization_checker.py     ← 关键词蚕食检测
11-GEO可见性检查/geo_visibility_checker.py            ← GEO可见性检查（选品评估 + 定期监测）
```

### 4. 数据驱动阶段（有流量后）

```text
06-数据分析工具/                            ← Data Studio 仪表盘
10-用户洞察工具/comment_insight_analyzer.py  ← 评论/反馈分析 → 驱动下一轮内容
11-GEO可见性检查/geo_visibility_checker.py  ← 定期跑 GEO 可见性，跟踪变化趋势
```

---

## 环境依赖

```bash
# 竞品研究 + 内容分析 + SEO审计（核心）
pip install requests beautifulsoup4 lxml pandas tqdm

# 域名查询
pip install python-whois

# GEO 可见性检查（需要 DataForSEO API 凭证）
# 复用 DataForSEO MCP 配置的账号
# export DFS_API_LOGIN=your_login
# export DFS_API_PASSWORD=your_password
```

---

## 01 域名查询

**文件**：`01-域名查询/domain_checker.py`

```bash
pip install python-whois
python 01-域名查询/domain_checker.py
```

输出：`domain_availability_with_whois.csv`（域名可用性 + 注册信息）

---

## 02 竞品研究工具

### 2A 竞品挖掘：人工 Google 搜索（已替代 serp_competitor_finder.py）

**原理**：人工使用 Google 搜索 + 排除语法过滤大平台，直接筛选竞品。

**搜索排除语法**（直接复制使用）：
```
关键词 -amazon.com -ebay.com -etsy.com -walmart.com -pinterest.com -reddit.com -youtube.com -facebook.com -tiktok.com -wikipedia.org -quora.com -target.com -aliexpress.com -alibaba.com
```

> `serp_competitor_finder.py` 已退役，文件保留在目录中不再使用。详见 [竞品研究工具使用指南.md](02-竞品研究工具/竞品研究工具使用指南.md)

### 2B Sitemap 解析：`sitemap_parser.py`

**原理**：自动发现并解析竞品 sitemap.xml，支持 sitemap index 嵌套，按 URL pattern 分类内容。

```bash
# 单个竞品（自动发现 sitemap）
python 02-竞品研究工具/sitemap_parser.py --url https://competitor.com

# 直接指定 sitemap.xml
python 02-竞品研究工具/sitemap_parser.py --url https://competitor.com/sitemap.xml

# 批量（接 2A 的输出）
python 02-竞品研究工具/sitemap_parser.py --file competitor_urls.txt
```

输出：
- `sitemap_results/<domain>_sitemap_report.md`：内容架构分析
- `sitemap_results/<domain>_blog_urls.csv`：博客 URL 列表，供 04 使用

---

## 03 WordPress 建站

**文件**：`03-WordPress建站/` 下以文档为主，含 1 个 Node.js 脚本。

| 文档 | 内容 | 适用阶段 |
|------|------|---------|
| `Elementor REST API 操作手册.md` | Elementor 模板创建 + Flexbox 布局 + Widget 列表 + 踩坑清单 | RLM 步骤 2B/2C（核心页面） |
| `Gutenberg博客文章REST-API上传指南.md` | 博客文章通过 `wp-json/wp/v2/posts` 发布，Gutenberg Block HTML 格式 | RLM 步骤 3（博客文章） |
| `elementor-upload.js` | Homepage V3 页面生成与上传脚本 | RLM 步骤 2B/2C |
| `页面内容指南/` | 各类页面的内容框架（RLM 步骤 2A/2B 引用） | RLM 步骤 2A/2B |

> **分工原则**：核心页面（首页/产品页/Landing Page）用 Elementor；博客文章（教程/指南/科普）用 Gutenberg。

---

## 04 竞品内容分析工具

### 4A 内容模式分析：`content_analyzer.py`

批量抓取竞品文章的 title/meta/H1/H2，自动分类为「选购指南/教程/科普/产品页」等类型，生成跨竞品内容模式报告。

```bash
python 04-竞品内容分析工具/content_analyzer.py \
  --input 02-竞品研究工具/sitemap_results/<domain>_blog_urls.csv

# 限速（避免被封）
python 04-竞品内容分析工具/content_analyzer.py --input urls.csv --concurrency 3 --delay 2

# 调试（只跑前20条）
python 04-竞品内容分析工具/content_analyzer.py --input urls.csv --limit 20
```

### 4B 站内重复检测：`content_duplicate_checker.py`

基于 SimHash 算法比对所有页面，找出站内重复/近似的页面对。

```bash
# 从 sitemap 检测
python 04-竞品内容分析工具/content_duplicate_checker.py \
  --input https://yoursite.com/sitemap.xml

# 从本地文件检测
python 04-竞品内容分析工具/content_duplicate_checker.py --input urls.csv

# 调整重复阈值（汉明距离，默认10，越小越严格）
python 04-竞品内容分析工具/content_duplicate_checker.py --input sitemap.xml --threshold 8
```

输出：
- `results/duplicate_report_<domain>_<time>.md`：重复内容报告（按严重程度分级）
- `results/duplicate_pairs_<domain>_<time>.csv`：重复对详情

### 4C 站外原创性检测：`content_originality_checker.py`

基于 N-gram（trigram）比对目标页面与竞品内容的重合度，输出段落级原创性评分。

```bash
python 04-竞品内容分析工具/content_originality_checker.py \
  --target https://yoursite.com/blog/article \
  --competitors competitor_urls.txt

# 调整 N-gram 大小（增大则比对更严格）
python 04-竞品内容分析工具/content_originality_checker.py \
  --target URL --competitors urls.txt --ngram 4
```

输出：
- `results/originality_<domain>_<time>.md`：原创性报告（含段落级分析）
- `results/originality_paragraphs_<domain>_<time>.csv`：段落级对比 CSV

---

## 05 WordPress 插件

**文件**：`05-WordPress插件/TranslatePress-AI翻译方案.md`

TranslatePress AI 翻译方案调研，含 API 成本对比、自动翻译流程。

---

## 06 数据分析工具

**文件**：`06-数据分析工具/01-Google-Data-Studio使用指南.md`

网站上线后的数据可视化中心，连接 GSC + GA4 + Sheets 搭建 SEO/流量仪表盘。

**核心数据流**：

```
竞品分析数据（CSV）→ Google Sheets → Data Studio 仪表盘
                                        ↑
GSC 搜索排名 ─────────────────────── 原生连接
GA4 流量行为 ─────────────────────── 原生连接
```

---

## 07 短视频工具

**文件**：`07-短视频工具/短视频工具与自动化流程.md`

素材采集/拆解/创作/分发全链路，配合 RLM 步骤 4D 音视频再加工。

---

## 08 SEMrush 数据采集

> 原 `08-SEO数据API` 目录已整合到 `02-竞品研究工具/`，详见 [竞品研究工具使用指南.md](02-竞品研究工具/竞品研究工具使用指南.md)

竞品分析阶段（RLM 步骤 1B）批量获取 AS、Organic Traffic、截图等数据，自动写入 Google Sheets。

**前置条件**：Tabbit 带 `--remote-debugging-port=9222 --remote-allow-origins=*` 启动，并已登录 semrush.com

```bash
python 02-竞品研究工具/semrush_to_sheets.py              # 全量查询
python 02-竞品研究工具/semrush_to_sheets.py --start 4    # 从第4行开始
python 02-竞品研究工具/semrush_to_sheets.py --limit 5    # 只查前5个
python 02-竞品研究工具/semrush_to_sheets.py --dry-run    # 只提取不写回 Sheets
```

| 写入字段 | 列号 | 数据来源 |
|---------|------|---------|
| AS（Authority Score） | E | SEMrush 自动采集 |
| Organic Traffic | F | SEMrush 自动采集 |
| SEMrush 截图 | G | SEMrush 自动采集 |
| 月访问量 + 渠道拆分 | G-M | traffic.cv（手动） |

---

## 09 SEO 审计工具

### 9A 技术 SEO 审计：`seo_technical_auditor.py`

检查 HTTPS、404、重定向链、Canonical、robots.txt、结构化数据、Hreflang、孤岛页面等。

```bash
# 从 sitemap 审计全站
python 09-SEO审计工具/seo_technical_auditor.py \
  --input https://yoursite.com/sitemap.xml

# 从本地文件
python 09-SEO审计工具/seo_technical_auditor.py --input urls.csv

# 限制数量（调试用）
python 09-SEO审计工具/seo_technical_auditor.py --input sitemap.xml --limit 50
```

输出：
- `results/technical_audit_<domain>_<time>.md`：技术 SEO 审计报告（含健康评分）
- `results/technical_issues_<domain>_<time>.csv`：问题清单 CSV

### 9B On-Page SEO 检查：`onpage_seo_checker.py`

评估页面的 Title/Meta/H标签/内容/图片/内链/E-E-A-T，满分 100 分。

```bash
# 检查单个页面
python 09-SEO审计工具/onpage_seo_checker.py --input https://yoursite.com/blog/article

# 检查多个页面（带关键词）
python 09-SEO审计工具/onpage_seo_checker.py --input sitemap.xml --keyword "crystal healing"

# 从本地 URL 文件
python 09-SEO审计工具/onpage_seo_checker.py --input urls.txt --keyword "target keyword"
```

输出：
- `results/onpage_seo_report_<time>.md`：各页面评分详情
- `results/onpage_seo_scores_<time>.csv`：评分汇总 CSV

### 9C 关键词蚕食检测：`keyword_cannibalization_checker.py`

提取每个页面的目标关键词，找出多个页面竞争同一关键词的情况。

```bash
# 从 sitemap 检测
python 09-SEO审计工具/keyword_cannibalization_checker.py \
  --input https://yoursite.com/sitemap.xml

# 从本地文件
python 09-SEO审计工具/keyword_cannibalization_checker.py --input urls.csv
```

输出：
- `results/cannibalization_<domain>_<time>.md`：蚕食检测报告（按优先级分级）
- `results/cannibalized_keywords_<domain>_<time>.csv`：重叠关键词详情

---

## 10 用户洞察工具

> **核心理念**：不等自己的网站/频道积累评论，直接去 Reddit/Amazon/YouTube 采集竞品和行业的用户反馈，驱动内容选题和产品策略。

### 10A Reddit 评论采集：`reddit_comment_collector.py`

基于 Reddit `.json` 端点（详见 [Reddit的JSON功法](10-用户洞察工具/Reddit的JSON功法.md)），无需 API 密钥，采集帖子 + 评论，输出为分析工具可直接使用的 CSV。

```bash
# 采集整个 subreddit
python 10-用户洞察工具/reddit_comment_collector.py \
  --subreddit crystalhealing --sort hot --limit 15

# 搜索关键词（跨 subreddit）
python 10-用户洞察工具/reddit_comment_collector.py \
  --search "crystal bracelet healing"

# 搜索限定 subreddit
python 10-用户洞察工具/reddit_comment_collector.py \
  --search "crystal meaning" --subreddit crystals

# 采集单个帖子
python 10-用户洞察工具/reddit_comment_collector.py \
  --post "https://www.reddit.com/r/.../comments/xxx/"
```

输出：`results/reddit_<关键词>_<时间>.csv`（可直接传给 10B 分析）

### 10B 评论洞察分析：`comment_insight_analyzer.py`

对评论数据进行智能分析：自动分类（问题/购买意向/抱怨/功能建议/合作询盘/地域需求）、提取选题信号、挖掘痛点、筛选高价值线索。

**标准用法（接 10A 的输出）**：

```bash
# 分析 Reddit 采集结果
python 10-用户洞察工具/comment_insight_analyzer.py \
  --input results/reddit_crystalhealing_20260509.csv \
  --source "Reddit r/crystalhealing"

# 分析其他来源的 CSV（列名: text/comment/content/body）
python 10-用户洞察工具/comment_insight_analyzer.py \
  --input amazon_reviews.csv --source "竞品Amazon评论"

# 分析纯文本（每行一条）
python 10-用户洞察工具/comment_insight_analyzer.py \
  --input youtube_comments.txt --source "竞品YouTube评论"
```

输出：
- `results/comment_insight_<time>.md`：洞察报告（分类分布 + 高价值评论 + 选题建议 + 痛点 + 地域需求）
- `results/comments_classified_<time>.csv`：每条评论的分类结果
- `results/content_topics_<time>.csv`：选题建议清单

### 完整工作流

```text
10A reddit_comment_collector.py   ← 采集竞品/行业评论
    ↓ results/reddit_xxx.csv
10B comment_insight_analyzer.py   ← 分类分析，输出洞察
    ↓ 选题建议 + 痛点 + 购买意向
→ 驱动 RLM 步骤 3 内容策略
→ 驱动产品设计（用户痛点 → 产品改进）
→ 驱动市场验证（地域需求 → 优先本地化）
```

**更多数据源**：YouTube 评论可通过 DataForSEO MCP 直接获取（`serp_youtube_video_comments_live_advanced`），Amazon 评论可用 Apify Actor 采集，分析环节统一用 10B。

---

## 踩坑记录：全自动 SEO 为什么行不通

> 以下经验来自 2025-2026 年的实操验证，记录于此避免重蹈覆辙。

### 已验证失效的做法

| 做法 | 实操结果 | 失效原因 |
|------|---------|---------|
| **全自动程序化目录站** | 做了 4 个，3 个完全死掉，1 个仅剩 Bing 零星流量且无法变现 | 批量生成的低质量内容无法通过 Google 质量评估，无真实用户价值 |
| **自动批量外链** | 上一个时代的产物，现在无任何效果 | Google 已能识别并忽略批量制造的低质量外链，甚至可能导致惩罚 |
| **AI 一键生成完整长文** | 多种模型尝试，反复炒剩饭、句式逻辑混乱、前后衔接断裂 | 大篇幅一次性输出时 AI 难以保持质量一致性 |

### 正确的自动化边界

```text
✅ 适合自动化的环节（工具库已覆盖）：
   - 竞品数据采集与分析（02/04）
   - SEO 技术审计与评分（09）
   - 用户评论采集与分类（10）
   - 关键词数据批量获取（02 semrush_to_sheets.py）
   - GEO 可见性信号检查（11）

❌ 不适合自动化的环节：
   - 内容写作（应逐段人工打磨，参见 05-指令库/指令9-10）
   - 外链建设（应走真实合作与内容价值驱动）
   - 用户需求理解（必须人工判断）
```

### 核心教训

**老老实实调研用户、分析需求、满足需求，才是正经的生意逻辑。** 自动化工具的价值是提效（帮人更快地完成数据采集和分析），而不是替代人对用户需求的理解和内容质量的把控。

---

## 11 GEO 可见性检查

> 详细文档见 [11-GEO可见性检查/README.md](11-GEO可见性检查/README.md)

### 11A 可见性信号采集：`geo_visibility_checker.py`

7 维度检查品牌在 AI 生态中的可见性信号：AI Overview、Reddit、Quora、评价网站、Wikipedia、媒体报道、竞品对比。

**前置条件**：DataForSEO API 凭证（复用 MCP 配置账号）

```bash
export DFS_API_LOGIN=your_login
export DFS_API_PASSWORD=your_password

# 基本用法
python 11-GEO可见性检查/geo_visibility_checker.py \
  --brand "Crystal Healing" \
  --domain "crystalhealing.com" \
  --keywords "healing crystal bracelet"

# 带竞品
python 11-GEO可见性检查/geo_visibility_checker.py \
  --brand "Crystal Healing" \
  --domain "crystalhealing.com" \
  --keywords "healing crystal bracelet" "crystal bracelet meaning" \
  --competitors "Energy Muse" "Tiny Rituals"
```

输出：
- `results/geo_visibility_<brand>_<time>.md`：可读报告
- `results/geo_visibility_<brand>_<time>.json`：结构化数据（供 Layer 2 分析）

### 11B Layer 2 分析（Claude Code）

将 JSON 交给 Claude Code，自动生成可见性评分 + 差距分析 + 行动建议 → 写入 Google Sheets。

---

## 删除历史说明

> 本目录在 2026-04-12 `commit 64ee06e` 中被整体删除，原因是历次文档重构中将文件标注为"已迁移/已整合"但未真正搬移，导致内容逐步流失。2026-04-13 根据 git 日志完整恢复，并补建从未提交过的竞品挖掘和分析脚本。
> 2026-05-09 合并原 02-竞品挖掘工具 和 03-竞品分析工具 为 02-竞品研究工具；新增 04-竞品内容分析工具 2 个检测脚本；新增 09-SEO审计工具（技术审计 + On-Page + 关键词蚕食）；新增 10-用户洞察工具。
> 2026-05-14 新增 11-GEO可见性检查（7维度 AI 生态可见性信号采集 + Layer 2 LLM 分析）。
