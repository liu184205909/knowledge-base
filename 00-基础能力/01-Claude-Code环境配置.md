# Claude Code 环境配置

> **运行方式**：本文档配置同时适用于 Claude Code CLI 和 VSCode 插件，共用 `~/.claude/` 下所有配置文件。
>
> - **CLI**：`npm install -g @anthropic-ai/claude-code`
> - **权限模式**：`settings.json` 设置 `"permissions": { "defaultMode": "bypassPermissions" }` 全局免确认

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

### GSC MCP（选配 — 网站上线后安装）

```bash
claude mcp add gsc -- npx -y gsc-mcp-server
# 需配置: GSC_AUTH_MODE=oauth, GSC_OAUTH_SECRETS_FILE=路径, GSC_SITE_URL=sc-domain:域名
```

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
# 浏览器（CDP 直连 Chrome，需开启 chrome://inspect 远程调试）
git clone https://github.com/eze-is/web-access ~/.claude/skills/web-access
git clone https://github.com/liu184205909/tabbit-ai ~/.claude/skills/tabbit-ai

# 文档生成
npx skills add anthropics/skills --skill pdf xlsx docx pptx frontend-design skill-creator --agent claude-code -y -g

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

# 中文技能包（选题/降AI味/视频等）
npx skills add alchaincyf/huashu-skills -g

# 辅助工具
npx skills add tanweai/pua --agent claude-code -y -g
npx skills add thedotmack/claude-mem --agent claude-code -y -g
npx skills.add Automattic/wordpress-agent-skills --agent claude-code -y -g
npx clawhub@latest install skill-vetter image-generation
```

> ⚠️ 第三方 Skill 存在供应链风险，安装前用 `skill-vetter` 审查，优先选官方或高 Star 仓库。

---

## Skill 速查

| 场景 | Skill | 触发词 |
|------|-------|--------|
| 浏览器操作/绕反爬 | **web-access** | "打开网页" / "去小红书搜" |
| 博客创作+SEO | **claude-blog** | "写博客" |
| SEO 审计 | **claude-seo** / **Agentic-SEO** / **seo-audit-skill** | "SEO审计" |
| 付费广告审计 | **claude-ads** | "审计广告" |
| 营销策略全家桶 | **marketingskills** | "营销策略" / "定价" |
| 内容改写（1→18平台） | **claude-repurpose** | `/repurpose <URL>` |
| 社媒发布 | **typefully** | "发推文" |
| 降 AI 味 | **ai-proofreading** | "AI味太重" |
| 长文转社媒 | **article-to-x** | "转微博" / "发小红书" |
| 办公文档生成 | **pdf/xlsx/docx/pptx** | "生成PDF" |
| 配图 | **image-generation** | "配图" |
| 卡住换思路 | **pua** | "不行啊" / "/pua" |
| 跨会话记忆 | **claude-mem** | "上次怎么解决的" |
| 安全审查 | **skill-vetter** | 安装前检查 |

## 备选工具

| 工具 | 说明 | 何时启用 |
|------|------|---------|
| [Nanobrowser](https://github.com/nanobrowser/nanobrowser) | AI 浏览器自动化 Chrome 扩展，多智能体协作，自然语言操控 | 与 web-access 互补，需复杂网页操作时 |
| [CloakBrowser](https://github.com/CloakHQ/CloakBrowser) | Chromium 源码级指纹伪装，过 Cloudflare/reCAPTCHA v3 | 需直接采集强反爬站点时 |
