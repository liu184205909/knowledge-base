# 08-DR榜雷达（Ahrefs Top 1M 数据资产 → 跨境谷工具）

> 2026-09-07 建档。数据源：Ahrefs 免费 API `domain-rating-top-domains`（Top 1M 全量，domain/dr/rank 三列，免费不耗 units，单次≤25 万行）。凭证 `~/.env AHREFS_API_KEY`。
> 定位：**只关心一件事——100 万行数据怎么处理成产品和情报**：本地自算 KD + 月度 diff 雷达 + 跨境谷（kuajinggu.com）对外工具。DR 数值本身只作粗筛（可被操纵，不作终判）。

## 文件清单

| 文件 | 作用 |
|------|------|
| `dr_top1m.sqlite` | 本期快照库（99.5 万行 / 64.7MB，rank 索引） |
| `data/dr_top1m_0*.csv` | 原始 4 块 CSV（25MB，月度覆盖） |
| `kd_rank.py` | 两模式：域名排名查询 / `--stdin` 自算 KD（SERP top10 域名→rank 中位数→竞争档） |
| `refresh.sh` | 月度刷新（拉数据+滚动 prev 库） |
| `diff.py` | 月度 diff 引擎（新进榜/跃迁/掉榜，三过滤器，出 MD 月报到 `reports/`） |

## 用法速查

```bash
# 自算 KD（工作流：Ubersuggest serp_analysis 拿 top10 organic 域名 → 喂脚本 → 得竞争档）
printf 'a.com\nb.com\n' | python kd_rank.py --stdin

# 查域名全球排名
python kd_rank.py competitor.com
```

## 关键认知

1. **榜单门槛 DR45**：rank 1=100 → 10万=71 → 100万=45。我方四站+asmag(DR40) 全部不在榜——正常，不是故障
2. **DR 可被操纵**（付费刷制/301 继承等），数值只作粗筛——竞对分析与 Ubersuggest DA 双口径互校（SOP §7.0 档案头）

## 月度雷达承接（数据→报告→业务）

```
每月 1 号 refresh.sh（GH Actions 自动）
  → diff.py --label YYYY-MM（三过滤器：显著性阈值 / 垃圾域名 / [待接]我方词池 SERP 交叉）
  → reports/dr_diff_YYYYMM.md（三张表：高起点新进榜 / 显著跃迁 / 掉榜警报）
  → 判读接续：
     新进榜 ∩ 我方品类词 SERP = 选品/新竞对早期信号
     跃迁域名抽查 → SOP §七b 上升归因
     掉榜域名抽查 → §七b 下降归因（避坑+切入窗口）
```

## 跨境谷工具架构（2026-09-08 三页面+月度管道上线）

**线上三页面**（WP REST 创建，页面内容=自包含 HTML+Base64 JS；构建器 `build_page.py`/`build_checker_page.py`/`build_hub_page.py`）：
| 页面 | slug | 内容 |
|---|---|---|
| 工具箱 hub | `/tools/`（id 34045） | SEO 工具+文本工具两区卡片（已上线/开发中徽章） |
| 权威生态雷达 | `/dr-radar/`（id 34037） | 批量外链验资（可行动输出）+换算表+生态概览+月度雷达占位+FAQ 折叠（details/summary SEO 内容） |
| DR Checker | `/dr-checker/`（id 34041） | Ahrefs 实时 DR 直查+在榜域名附全球排名（限流 8 次/分/IP） |

**Worker**（`dr-radar.lzn184205909.workers.dev`，源码 `worker/`）：`/api`（批量≤200，含 sus 可疑标记）、`/api/stats`（D1 stats 表）、`/api/live`（Ahrefs 直转，AHREFS_API_KEY 为 wrangler secret）。D1：`dr-radar`（2936a004-96f8-4812-878d-b3ffb01fe7ad），dr 表 995,023 行 + stats 表。

**月度管道**（独立仓库 `D:\Code\projects\kuajinggu-dr-radar` → github.com/liu184205909/kuajinggu-dr-radar 私有）：GH Actions `monthly.yml` 每月 1 号 UTC 3:17 自动：①wrangler d1 export 线上库=上期 → ②refresh 拉 4 块 CSV 建新库 → ③diff.py 月报 → ④push_stats.py 重算推 D1 → ⑤全量重导 dr 表（DELETE+批量 INSERT）→ ⑥月报 commit。secrets：AHREFS_API_KEY / CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID。

**踩坑记录**：
- `wrangler d1 execute --file` 走上传+后台异步队列，有竞态会重复写入——**大批量导入禁用**，用 `d1_http_import.py`（HTTP API 同步，1200 行/条 <100KB 语句上限）
- WP 页面 JS 必须 Base64（wpautop 往 script 注 `<p>` 破坏语法）**且含中文时必须 `eval(new TextDecoder().decode(Uint8Array.from(atob(...))))`**——裸 atob 按 latin1 解码 UTF-8 中文会乱码
- **Wordfence 开着会拦 WP REST API**（rest_not_logged_in 401，应用密码失效假象）——跨境谷已关闭；CF 也拦 python urllib 默认 UA（WP 操作用 curl）
- WP 应用密码值含空格，.env 须带引号，读取 `cut -d= -f2- | tr -d '"'`
- GH 建仓用 credential manager 里的凭证（GITHUB_TOKEN 无建仓权限）

kuajinggu.com **不在 Cloudflare**——不动域名 DNS，走 **`*.workers.dev` 免费子域**：

| 层 | 位置 | 说明 |
|---|---|---|
| 前端 | 跨境谷 WP 工具页 | 输入框+结果卡，JS fetch 调 API（CORS 开放） |
| 后端 API | CF Worker（`dr-radar.<子域>.workers.dev`） | 免费 10 万请求/天，自带 HTTPS |
| 数据 | CF D1（SQLite 原生） | 本地 64.7MB 库导入，免费 5GB；月度随 refresh 推新 |
| 真源+diff | 本地（本目录+git） | 重计算在本地，云端只查 |

**月度数据管道**：GH Actions → refresh.sh → diff.py 月报 commit → wrangler 推 D1。
**待用户提供**：CF 账号 API Token（或账号内自建 Worker+D1 后给我 ID）。
**合规**：对外展示以我方自算"全球排名百分位"为主、DR 原值为辅，署名 "Domain Rating by Ahrefs"。

## 第二批：dr-tools Worker + 7 个技术 SEO 工具页（2026-09-08 上线）

**Worker**（`dr-tools.lzn184205909.workers.dev`，源码 `D:\Code\projects\kuajinggu-dr-tools\worker\`，无 D1 纯转发解析）：`/robots-check`（robots 解析+14 AI 爬虫权限对照）、`/headers-check`（六项安全头评分）、`/redirect-trace`（manual 逐跳≤10+环路检测）、`/meta-extract`（title/desc/canonical/OG/hreflang/viewport）、`/sitemap-extract`（index 递归一层+lastmod 月度分布）、`/ai-bot-check`（5 个 UA 实测 robots+首页）、`/query-fanout`（智谱 GLM glm-5.3-flash 生成同义/隐含/子问题各 5 条；key=wrangler secret `ZHIPU_API_KEY`，走 GLM Coding Plan 的 Anthropic 协议 `open.bigmodel.cn/api/anthropic/v1/messages`）。每 IP 12 次/分。

**7 页面**（构建器 `D:\Code\projects\kuajinggu-dr-tools\build_tool_pages.py`，parent=34045，统一 .dt- 前缀组件库+base64 loader+guide+5 条 FAQ）：robots-checker(34315)/security-header-checker(34316)/redirect-tracer(34317)/meta-extractor(34318)/sitemap-extractor(34319)/ai-bot-checker(34320)/query-fanout(34321)。hub 页 34045（22→29 工具）与 seo-tools 列表页 34050 已同步。

**第二批踩坑**：①GLM Anthropic 协议返回 content 数组可能混 thinking 块，取 text 必须按 `type==='text'` 过滤拼接（`content[0].text` 会取空）；②Worker 响应 JSON 中文在本地 git-bash 管道按 GBK 解码会出现 `\udcXX` 假乱码，验证一律 `-o 文件 + python -X utf8`，勿信管道直读；③智谱 1302 限流与当前会话共享 Coding Plan 并发，等 10-15 秒重试即过。

## 内部来源
SOP v4.0 §7.0（DR 档案头）｜memory `dataforseo-serp-only`
