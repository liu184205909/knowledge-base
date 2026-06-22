# Claude Code 环境配置

> **运行方式**：本文档配置同时适用于 Claude Code CLI 和 VSCode 插件，共用 `~/.claude/` 下所有配置文件。
>
> - **CLI**：`npm install -g @anthropic-ai/claude-code`

## 必装 MCP

| MCP | 安装命令 | 用途 |
|-----|---------|------|
| zai-mcp-server | `claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY={{API_KEY}} -- npx -y "@z_ai/mcp-server"` | 图片/截图视觉理解 |
| web-search-prime | `claude mcp add -s user -t http web-search-prime https://open.bigmodel.cn/api/mcp/web_search_prime/mcp --header "Authorization: Bearer {{API_KEY}}"` | 联网搜索 |
| web-reader | `claude mcp add -s user -t http web-reader https://open.bigmodel.cn/api/mcp/web_reader/mcp --header "Authorization: Bearer {{API_KEY}}"` | 网页正文抓取 |
| zread | `claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer {{API_KEY}}"` | GitHub 仓库阅读 |
| google-workspace | 见下方 | Google 表格/文档/硬盘/Gmail |
| dataforseo | 见下方 | SEO 关键词/SERP 数据 |
| seoctopus | 见下方 | SEO 关键词聚类/搜索意图检测/网站审计 |
| **web-access** | **见下方（Skill）** | **CDP 浏览器自动化 — JS渲染页面/登录态操作/反爬绕过** |

### Web-Access Skill（浏览器自动化 — 替代 Playwright）

[官方仓库](https://github.com/eze-is/web-access) | v2.5.0 | MIT | 2.8K+ Stars

**定位**：AI Agent 的完整联网能力层。通过 CDP 直连用户日常 Chrome，天然携带登录态，能读取 JS 渲染页面（腾讯文档、小红书、微信公众号等静态抓取无法覆盖的场景）。

```bash
# 安装（推荐 npx skills）
npx skills add eze-is/web-access
# 或手动
git clone https://github.com/eze-is/web-access ~/.claude/skills/web-access
```

**前置配置**（CDP 模式）：

1. 需要 **Node.js 22+**
2. Chrome 地址栏打开 `chrome://inspect/#remote-debugging`
3. 勾选 **"Allow remote debugging for this browser instance"**，可能需重启浏览器
4. 运行环境检查：`node "${CLAUDE_SKILL_DIR}/scripts/check-deps.mjs"`

### Google Workspace MCP

前置条件：[02-Google-Cloud凭证创建指南.md](./02-Google-Cloud凭证创建指南.md)

```bash
claude mcp add -s user google-workspace \
  -e GOOGLE_OAUTH_CLIENT_ID=你的客户端ID \
  -e GOOGLE_OAUTH_CLIENT_SECRET=你的客户端密钥 \
  -e OAUTHLIB_INSECURE_TRANSPORT=1 \
  -e HTTPS_PROXY=http://127.0.0.1:10808 \
  -e HTTP_PROXY=http://127.0.0.1:10808 \
  -- uvx workspace-mcp --tools drive sheets docs gmail --tool-tier extended
```

> Token 过期运行 `python C:\Users\Dylan\tools\refresh_google_token.py` 刷新。

### DataForSEO MCP

[官方仓库](https://github.com/dataforseo/mcp-server-typescript) | 按调用付费（< $0.01/次）

```bash
git clone https://github.com/dataforseo/mcp-server-typescript.git ~/tools/mcp-server-typescript
cd ~/tools/mcp-server-typescript && npm install && npm run build
claude mcp add -s user dataforseo \
  -e DATAFORSEO_USERNAME=你的邮箱 \
  -e DATAFORSEO_PASSWORD=你的API密码 \
  -- node ~/tools/mcp-server-typescript/build/main/main/cli.js
```

### Google SEO MCP（GSC+GA4+100 SEO 工具，已替代轻量 gsc-mcp-server）

[官方仓库 mario-hernandez/google-seo-mcp-claude-code](https://github.com/mario-hernandez/google-seo-mcp-claude-code) | MIT | v0.8.x | 二进制名 `google-seo-mcp` | 装出来的命令就叫 google-seo-mcp（不是另一个工具）

GSC + GA4 + Lighthouse/CrUX/Schema/AEO/迁移 全家桶，102 工具，含 `gsc_quick_wins`/`gsc_traffic_drops`/`gsc_cannibalization`/`cross_opportunity_matrix` 等高阶分析。Google 官方只有 GA4 MCP（裸接口），无官方 GSC MCP；这是当前最全的统一方案。

```bash
# 1. 安装（Python 3.11+，pipx）
pipx install git+https://github.com/mario-hernandez/google-seo-mcp-claude-code
#    → 二进制 C:\Users\Dylan\.local\bin\google-seo-mcp.exe，venv 在 C:\Users\Dylan\pipx\venvs\google-seo-mcp

# 2. 认证（OAuth Desktop，最简）：Cloud Console 建「桌面应用」OAuth client（project 704571210228）
#    下载 client_secret.json 存 C:\Users\Dylan\tools\google-seo-oauth.json
#    client_id/secret 已登记 ~/.env（GOOGLE_SEO_CLIENT_ID/SECRET）

# 3. 注册 MCP（带代理 + DataForSEO env）
#    ⚠️ 路径用正斜杠 / —— git bash 下反斜杠会被吞（C:\Users→C:Users）导致 Status: ✘ Failed to connect
#    DataForSEO 凭证：值取自 ~/.env 的 DFS_API_LOGIN/DFS_API_PASSWORD，字段名映射成 DATAFORSEO_LOGIN/DATAFORSEO_PASSWORD
#    （Mario 的 serp_check/serp_aio_monitor/serp_paa_extractor 后端是 DataForSEO，无此 env 报 credentials_missing）
claude mcp add -s user google-seo-mcp \
  -e GOOGLE_SEO_OAUTH_CLIENT_FILE=C:/Users/Dylan/tools/google-seo-oauth.json \
  -e HTTPS_PROXY=http://127.0.0.1:10808 \
  -e HTTP_PROXY=http://127.0.0.1:10808 \
  -e DATAFORSEO_LOGIN={{DFS_API_LOGIN}} \
  -e DATAFORSEO_PASSWORD={{DFS_API_PASSWORD}} \
  -- C:/Users/Dylan/.local/bin/google-seo-mcp.exe

# 4. 重启 Claude Code → 调 gsc_list_sites 触发首次浏览器登录 lzn184205909@gmail.com（一次覆盖全部站）
```

⚠️ **中国大陆代理补丁（必做）**：Mario 版用 google-auth-httplib2，httplib2 不读 HTTPS_PROXY → API 调用 `WinError 10060` 直连超时。必须 patch `build_http()` 走代理，见 [02-Google-Cloud凭证创建指南.md](./02-Google-Cloud凭证创建指南.md) 第六步补遗。与 google-workspace MCP 不冲突（各管一摊：本 MCP 管 GSC/GA4，workspace-mcp 管 Drive/Sheets/Docs/Gmail）。

### SEOctopus MCP（关键词聚类/SEO 审计）

[官方仓库](https://github.com/AgrimCltv/seoctopus) | 开源免费 | 23 个 SEO 工具

```bash
git clone https://github.com/AgrimCltv/seoctopus.git ~/tools/seoctopus
cd ~/tools/seoctopus && npm install && npm run build
claude mcp add -s user seoctopus -- node ~/tools/seoctopus/dist/index.js
```

**核心工具**（与关键词清洗流程相关）：

| 工具 | 功能 | 典型用法 |
|------|------|---------|
| `keywords_cluster` | Jaccard 词相似度聚类 + 搜索意图检测 | 近重复检测、语义分组验证 |
| `keyword_suggestions` | 关键词建议 | 补充长尾词 |
| `content_gap_analysis` | 内容缺口分析 | 竞品关键词差距 |
| `on_page_audit` | 页面 SEO 审计 | 内容优化 |
| `rank_check` | 排名检查（需 Playwright，可用 web-access 替代） | SERP 排名追踪 |

> `keywords_cluster` 使用 Union-Find + Jaccard 相似度（默认阈值 0.3）自动聚类，同时推断每个聚类的搜索意图（informational/commercial/transactional/navigational）。适合 Seed-* 近重复检测和 Entity 分组交叉验证。
>
> `rank_check` 工具依赖 Playwright，但本项目已有 `web-access` skill 替代浏览器操作，无需安装 Playwright。

---

## Skill 安装

> `npx skills add` 加 `-g` 装全局；`npx clawhub@latest install` 建议 `cd ~/` 后执行。

```bash
# 浏览器 — 详见上方 "Web-Access Skill" 章节
# git clone https://github.com/eze-is/web-access ~/.claude/skills/web-access
git clone https://github.com/liu184205909/tabbit-ai ~/.claude/skills/tabbit-ai

# 文档生成
npx skills add anthropics/skills --skill pdf xlsx docx pptx skill-creator --agent claude-code -y -g

# SEO
npx skills add AgriciDaniel/claude-seo -g
npx skills add Bhanunamikaze/Agentic-SEO-Skill --agent claude-code -y -g
npx skills add aaron-he-zhu/seo-geo-claude-skills -g
npx skills add JeffLi1993/seo-audit-skill -g

# 博客 + 广告 + 内容改写
npx skills add AgriciDaniel/claude-blog -g
npx skills add AgriciDaniel/claude-ads -g
npx skills add AgriciDaniel/claude-repurpose -g

# 营销 + 社媒
npx skills add coreyhaines31/marketingskills --agent claude-code -y -g
npx skills add typefully/agent-skills --agent claude-code -y -g

# WordPress 建站
npx skills.add Automattic/wordpress-agent-skills --agent claude-code -y -g

# 辅助工具
npx skills add thedotmack/claude-mem --agent claude-code -y -g
npx clawhub@latest install image-generation
```

> ⚠️ 第三方 Skill 存在供应链风险，安装前审查源码和 Star 数，优先选官方或高 Star 仓库。

### fable-discipline（执行纪律 — 已移植，非第三方直装）

[源头 FableCodex](https://github.com/baskduf/FableCodex) | AGPL-3.0 | Claude Code 移植版

**定位**：把 Fable 5 的"先检查 → 收集证据 → 用真实工具 → 目标账本 → 审查门禁 → 验证后才完成"执行纪律套到任何多步任务上，防止 AI 假完成（声称完成但没验证/没改对）。源自 Claude 的 `CLAUDE-FABLE-5.md`，FableCodex 是它的 Codex 适配版，本 skill 是**移植回 Claude Code** 的版本——Codex 插件（`codex plugin add`）不能直装 Claude Code，格式和机制都不同。

**位置**：`~/.claude/skills/fable-discipline/SKILL.md`（已就位）

**机制适配**（Codex → Claude Code）：
- goal ledger（`codex_goals.py`）→ **TodoWrite**
- findings gate（`codex_findings.py`）→ 工作区 `.fable/findings.md` + 完成前自查清单
- `apply_patch` → **Edit/Write**；读图 → **zai-mcp**（不用 Read）；Browser → **web-access**

**触发**：说"fable 风格严格执行这个任务"或"先验证再完成，建目标账本"。

### gsc-radar（GSC 数据驱动 SEO 工作流 — 自建）

[配套方法论文档](../01-AI营销/01-营销方法论基础/10-GSC数据驱动SEO深度研究.md) | 基于 google-seo-mcp（必装+代理补丁）

**定位**：GSC 数据驱动的 SEO 自动化，**单 skill 两阶段**。阶段1扫描（quick_wins/ctr_opportunities/content_decay/traffic_drops/cannibalization + 品牌词过滤 → 出「本周优化清单」）；阶段2深挖（针对目标拉 SERP+AI Overview+竞品 top3 → 生成具体改进：改 title/H1/补子主题/内链）。把"发现机会→诊断→生成改进→验证闭环"自动化。

**位置**：`~/.claude/skills/gsc-radar/SKILL.md`（已就位）

**依赖**：google-seo-mcp（上方必装，含中国大陆代理补丁）+ web-reader/web-access（阶段2抓竞品）+ 可选 content-refresher/competitor-analysis（落地刷新/竞品深挖）

**触发**：`/gsc-radar 站点`、"扫一下 X 的机会"、"X 站 SEO 体检"、"深挖这个关键词"、"这个词怎么救"。

---

## Skill 速查

| 场景 | Skill | 触发词 |
|------|-------|--------|
| 浏览器操作/JS渲染/反爬/登录态 | **web-access** | "打开网页" / "去小红书搜" / "读这个PDF" / "帮我登录XX" |
| 博客创作+SEO | **claude-blog** | "写博客" |
| SEO 审计 | **claude-seo** / **Agentic-SEO** / **seo-audit-skill** | "SEO审计" |
| 付费广告审计 | **claude-ads** | "审计广告" |
| 营销策略全家桶 | **marketingskills** | "营销策略" / "定价" |
| 内容改写（1→18平台） | **claude-repurpose** | `/repurpose <URL>` |
| 社媒发布 | **typefully** | "发推文" |
| 办公文档生成 | **pdf/xlsx/docx/pptx** | "生成PDF" |
| 配图 | **image-generation** | "配图" |
| 跨会话记忆 | **claude-mem** | "上次怎么解决的" |
| 多步任务防假完成 / 严格执行 | **fable-discipline** | "fable风格" / "严格执行" / "先验证再完成" / "防假完成" / "建目标账本" |
| GSC 数据驱动 SEO（扫机会+深挖竞品） | **gsc-radar** | "扫一下X的机会" / "X站SEO体检" / "深挖这个关键词" |

### 按需安装（未本地部署，需时再装）

| 场景 | Skill | 安装命令 |
|------|-------|---------|
| 降 AI 味 | **huashu-proofreading** | `npx skills add alchaincyf/huashu-skills -g` |
| 长文转社媒 | **huashu-article-to-x** | 同上（花树包内含） |
| 卡住换思路 | **pua** | `npx skills add tanweai/pua --agent claude-code -y -g` |
| 安全审查第三方 Skill | **skill-vetter** | `npx clawhub@latest install skill-vetter` |
| 飞书自动化 | **lark-\*** | `npx skills add larksuite/lark-skills -g` |

## 备选工具

| 工具 | 说明 | 何时启用 |
|------|------|---------|
| [Nanobrowser](https://github.com/nanobrowser/nanobrowser) | AI 浏览器自动化 Chrome 扩展，多智能体协作，自然语言操控 | 与 web-access 互补，需复杂网页操作时 |
| [CloakBrowser](https://github.com/CloakHQ/CloakBrowser) | Chromium 源码级指纹伪装，过 Cloudflare/reCAPTCHA v3 | 需直接采集强反爬站点时 |
| [BrowserAct](https://github.com/browser-act/skills) | 面向 Agent 的反检测浏览器 + 动态/静态代理池 + 多账号隔离 + 人机接力；官网 browseract.ai（**Stealth 浏览器/代理为付费服务**） | web-access 撞 Cloudflare 强反爬、需 IP 轮换大规模采集、或多账号运营时 |
