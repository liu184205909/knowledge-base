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
| google-seo-mcp | 见下方 | 唯一保留的 GSC/GA4 综合 SEO MCP：DataForSEO SERP 与诊断 |
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

### Google SEO MCP（唯一保留的 GSC/GA4 综合 SEO MCP）

[官方仓库 mario-hernandez/google-seo-mcp-claude-code](https://github.com/mario-hernandez/google-seo-mcp-claude-code) | MIT | v0.8.5（2026-05-04） | 二进制名 `google-seo-mcp` | 装出来的命令就叫 google-seo-mcp（不是另一个工具）

GSC + GA4 + Lighthouse/CrUX/Schema/AEO/迁移 全家桶，100+ 工具，含 `gsc_quick_wins`/`gsc_traffic_drops`/`gsc_cannibalization`/`cross_opportunity_matrix` 等高阶分析。它也是 `gsc-radar` 的唯一数据层：把 GSC 排名机会与 GA4 行为/关键事件连起来，并复用 DataForSEO 做 SERP 验证。Google 官方只有 GA4 MCP（裸接口），无官方 GSC MCP；这是当前唯一保留的 GSC/GA4 综合 SEO MCP。

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

**类目速查**（google-seo-mcp 14 大类；具体工具数随版本变，用 `get_capabilities` 动态查）：

| 类别 | 用途 |
|---|---|
| GSC (12) | 第一方搜索数据：quick_wins / ctr / decay / drops / cannibalization / inspect / sitemap |
| GA4 (14) | 流量行为：落地页健康 / 异常检测 / 渠道归因 / 新老访客 |
| Cross (6) | ⭐ GSC×GA4 跨域：opportunity_matrix / seo_to_revenue_attribution |
| SERP (4) | DataForSEO：check / aio_monitor / paa_extractor / competitor_intersect |
| CrUX (3) | Core Web Vitals 真实用户数据 |
| Lighthouse (5) | Lab 性能审计 |
| Schema (3) | 结构化数据提取/校验/推荐 |
| AEO (3) | AI 搜索优化：AI 爬虫 robots / llms.txt |
| Migration (29) | 网站迁移全家桶（301/预渲染/hreflang/索引恢复） |
| Logs (7) | 抓取预算 / 蜘蛛陷阱 / bot 占比 |
| History (3) | 快照对比（save/list/diff） |
| 其余 | Suggest/Trends/Indexing/IndexNow/系统 |

### SEOctopus（不作为常驻 MCP）

2026-07-11 已复核。本机克隆源为 [itsjwill/seoctopus](https://github.com/itsjwill/seoctopus)，不是旧文档中的 `AgrimCltv/seoctopus`；上游只有 2 次提交，最后一次为 2026-02-12，且没有发布版本。本机也未配置其独立的 GSC/GA4 OAuth。

它的 23 个工具中，`keywords_cluster`（Jaccard 聚类/意图推断）、`audit_page`、`competitive_content_gap` 和基于 Playwright 的 `rank_check` 对一次性本地研究有价值；但它与 Google SEO MCP 重叠地读取 GSC/GA4，并会引入第二套 OAuth、Playwright 和本地 SQLite 状态。水晶项目的主链路是“GSC 机会 → SERP 验证 → GA4 工具/商店转化”，应由 `google-seo-mcp + gsc-radar + web-access` 完成。

**因此：不要安装或注册 SEOctopus MCP。** 删除清单为 `C:\Users\Dylan\tools\seoctopus`（目录删除须人工执行）；若未来确有大批关键词的离线 Jaccard 聚类需求，重建为独立本地工具，而不是恢复为第二个 MCP。

---

## Skill 安装

> `npx skills add` 加 `-g` 装全局；`npx clawhub@latest install` 建议 `cd ~/` 后执行。**装前必须过 [03-Skill §5.1 判断框架](./03-Skill设计与管理.md#51-判断框架装不装新-skill)**——避免装回来刚清理掉的"通用知识冒充动作"类 skill。

**真源**：`~/.claude/skills/`。Codex 侧 `~/.agents/skills` 是 symlink 自动同步。新 skill 只装真源，别往 `~/.agents/skills/` 放实体。

### 白名单安装源（11 个）

```bash
# 文件处理（Anthropic 官方）
npx skills add anthropics/skills --skill pdf xlsx docx --agent claude-code -y -g

# 联网（CDP 浏览器自动化）— 详见上方 "Web-Access Skill" 章节
git clone https://github.com/eze-is/web-access ~/.claude/skills/web-access

# 防护（fable-discipline）/ 开发（frontend-design / wordpress-block-theming）
# 已就位，非 npx 安装，见各自专节

# SEO（gsc-radar 自建 / analytics-tracking）
# gsc-radar 见上方专节；analytics-tracking 按需 npx skills add

# 记忆（claude-mem，含 mem-search + knowledge-agent）
npx skills add thedotmack/claude-mem --agent claude-code -y -g
```

> ⚠️ 第三方 Skill 存在供应链风险，安装前审查源码和 Star 数，优先选官方或高 Star 仓库。
> **已删 skill 备份在 `~/.claude/skills-disabled-20260705/`**，恢复任一个：`mv ~/.claude/skills-disabled-20260705/<name> ~/.claude/skills/`

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

## Claude Design 平替（UI 设计）

> [Claude Design](https://claude.ai/design) 是 Anthropic Labs 的**闭源网页产品**（需原生 Claude 账号），产出设计稿 + handoff bundle。本节用开源组件在智谱壳子 CLI 侧复现其核心能力——**审美决策 + 品牌视觉系统 → 生产级代码**，无需注册任何服务。

### 两件套角色分工

| 组件 | 角色 | 产出 | 状态 |
|------|------|------|------|
| **frontend-design** skill | 审美决策（怎么设计才好看） | bold aesthetic 方向 + 生产级代码 | ✅ 已就位 |
| **DESIGN.md** | 品牌视觉系统（这个项目长什么样） | 颜色/字体/组件 token | ✅ 索引已 clone |

两者职责互补：skill 管「设计哲学」，DESIGN.md 管「项目具象」。端到端覆盖「**审美 → 系统 → 代码**」全链路，无需第三个 MCP。

> 原 Magic MCP（21st.dev）因注册不可用已放弃。组件生成这一环 Claude Code 自身就能胜任——配合 frontend-design 的审美指令直接产出 HTML/CSS/JS/React 代码。未来做 React 项目时可补装 shadcn/ui MCP（见下方可选扩展）。

---

### 组件 1：frontend-design skill（审美决策）

[源头 anthropics/claude-code/plugins/frontend-design](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) | ISC | 已就位 `~/.claude/skills/frontend-design/SKILL.md`

**核心指令**：拒绝「AI slop」审美（Inter 字体 / 紫色渐变 / 卡片布局套路），每次设计前先选定一个 **bold aesthetic direction**（极简 / 极繁 / 复古未来 / 有机自然 / 奢华精致 / 玩具感 / 编辑杂志风 / 粗野主义 等），再用生产级代码执行。支持 HTML/CSS/JS、React、Vue 全栈。

**为什么需要**：Claude Code 默认产出套路化 UI（Inter 字体 + 紫渐变 + 居中卡片），被社区戏称「AI slop」。本 skill 强制每次设计选不同方向，产出有记忆点的界面。

**与 Claude Design 网页产品的区别**：Claude Design 是闭源网页产品，产出设计稿；本 skill 是 CLI 内的审美指令包，产出直接是生产级代码。两者底层是同一套设计哲学。

**触发**：用户要求建网页/组件/页面/应用时自动触发；或显式说「用 frontend-design 风格做」「做个有设计感的 UI」。

---

### 组件 2：DESIGN.md 工作流（品牌视觉系统）

[索引库 VoltAgent/awesome-claude-design](https://github.com/VoltAgent/awesome-claude-design) | 已 clone 到 `~/tools/awesome-claude-design/` | 模板托管在 [getdesign.md](https://getdesign.md/)

**定位**：`DESIGN.md` 是单个纯文本 markdown 文件，描述品牌的视觉语言（颜色 token / 字体 scale / 组件样式 / 布局原则 / 阴影层级 / Do's & Don'ts / 响应式 / agent prompt），AI agent 能直接执行。概念由 Google Stitch 提出，VoltAgent 整理成 68 个知名品牌的设计系统索引（Stripe / Linear / Vercel / Notion / Figma / Apple / Nike / Spotify 等）。

**DESIGN.md 的 9 个标准段落**（Claude 读取时各取所需）：

| # | 段落 | Claude 用途 |
|---|------|------------|
| 1 | Visual Theme & Atmosphere | 设定整体调性、密度、氛围 |
| 2 | Color Palette & Roles | 生成带语义名的 CSS 变量 + hex |
| 3 | Typography Rules | 构建 type scale + 选 Google Fonts 替代 |
| 4 | Component Stylings | 生成 button/input/card/nav 含各状态 |
| 5 | Layout Principles | 间距 scale、栅格、留白节奏 |
| 6 | Depth & Elevation | 阴影 token + 层级 |
| 7 | Do's and Don'ts | 生成新页面时的护栏 |
| 8 | Responsive Behavior | 断点、触控目标、折叠行为 |
| 9 | Agent Prompt Guide | 嵌入生成 SKILL.md 的可复用 prompt |

**使用流程**：

```bash
# 1. 浏览索引 ~/tools/awesome-claude-design/，挑匹配调性的品牌
#    疗愈水晶 → Notion（温暖极简）/ Clay（有机形状）/ Airbnb（温暖珊瑚）

# 2. 从 getdesign.md 下载对应 DESIGN.md
#    例如 https://getdesign.md/notion/design-md → 下载 DESIGN.md

# 3. 丢进项目根目录
cp ~/Downloads/DESIGN.md /path/to/project/DESIGN.md

# 4. 让 Claude Code 生成 UI（frontend-design skill 自动遵循 DESIGN.md tokens）
```

---

### 两件套配合实战

以「为疗愈水晶站做一个高转化落地页」为例：

```bash
# 步骤 1：选设计系统（DESIGN.md）
# 浏览 ~/tools/awesome-claude-design/，挑 Notion（温暖极简）或 Clay（有机形状）
# 从 getdesign.md 下载，丢进项目根目录

# 步骤 2：触发生成
# "用 frontend-design 风格，基于项目根的 DESIGN.md，做一个疗愈水晶落地页"
# → skill 选定 bold aesthetic（如「有机自然 + 温暖编辑风」）
# → 严格遵循 DESIGN.md 的颜色/字体/组件 token
# → 产出生产级 HTML/CSS/JS（或 React/Vue，按需指定）
```

**关键**：frontend-design skill 会自动读取项目根的 DESIGN.md 作为视觉系统 source of truth；DESIGN.md 未覆盖的决策回退到 skill 的 bold aesthetic 原则。两者协同，无需手动协调。

---

### 可选扩展：shadcn/ui MCP（React 项目时启用）

[官方文档](https://ui.shadcn.com/docs/registry/mcp) | [开源 server Jpisnice/shadcn-ui-mcp-server](https://github.com/Jpisnice/shadcn-ui-mcp-server) | 完全免费、免注册、免 API key

**定位**：让 Claude Code 访问 shadcn/ui v4 组件库（blocks/demos/metadata），生成标准化 React + Tailwind 组件。shadcn 是 Anthropic 官方推荐的 React 组件库，Claude Code 有原生 skills 支持（[ui.shadcn.com/docs/skills](https://ui.shadcn.com/docs/skills)）。

**何时启用**：当前 WordPress 项目用不上（纯 HTML/CSS 场景由 frontend-design 覆盖）。**未来做 React 项目时**补装——不替代两件套，而是**补充**标准化 React 组件实现层。

```bash
# 参考 https://ui.shadcn.com/docs/registry/mcp 最新配置
# 或社区开源版：npx -y @jpisnice/shadcn-ui-mcp-server
```

---

## Skill 速查

> **当前白名单（11 个，2026-07-05）**。完整管理规则、判断框架和已删黑名单见 [03-Skill设计与管理.md §5](./03-Skill设计与管理.md#5-skill-管理办法)。

| 场景 | Skill | 触发词 |
|------|-------|--------|
| 浏览器操作/JS渲染/反爬/登录态 | **web-access** | "打开网页" / "去小红书搜" / "读这个PDF" / "帮我登录XX" |
| 办公文档生成 | **pdf / xlsx / docx** | "生成PDF" / "做个Excel" / "导出Word" |
| 多步任务防假完成 / 严格执行 | **fable-discipline** | "fable风格" / "严格执行" / "先验证再完成" / "防假完成" / "建目标账本" |
| GSC 数据驱动 SEO（扫机会+深挖竞品） | **gsc-radar** | "扫一下X的机会" / "X站SEO体检" / "深挖这个关键词" |
| GA4/GTM 埋点实施 | **analytics-tracking** | "配GA4" / "GTM埋点" / "设转化追踪" / "加事件" |
| UI 设计（Claude Design 平替，详见专节） | **frontend-design** + DESIGN.md | "做个UI" / "建网页" / "有设计感的界面" / "用frontend-design风格" |
| WordPress FSE 主题开发 | **wordpress-block-theming** | "改WP主题" / "建WP站" / "主题模板" |
| 跨会话记忆 | **mem-search** / **knowledge-agent** | "上次怎么解决的" / "建知识库" |

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
