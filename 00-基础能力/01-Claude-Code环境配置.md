# Claude Code 环境配置

## 必装 MCP

| MCP | 安装命令 | 用途 |
|-----|---------|------|
| zai-mcp-server | `claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY={{API_KEY}} -- npx -y "@z_ai/mcp-server"` | 图片/截图视觉理解 |
| web-search-prime | `claude mcp add -s user -t http web-search-prime https://open.bigmodel.cn/api/mcp/web_search_prime/mcp --header "Authorization: Bearer {{API_KEY}}"` | 联网搜索 |
| web-reader | `claude mcp add -s user -t http web-reader https://open.bigmodel.cn/api/mcp/web_reader/mcp --header "Authorization: Bearer {{API_KEY}}"` | 网页正文抓取 |
| zread | `claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer {{API_KEY}}"` | GitHub 仓库阅读 |
| google-workspace | 见下方 | Google 表格/文档/硬盘/Gmail |
| dataforseo | 见下方 | SEO 关键词/SERP 数据 |

### Google Workspace MCP

**前置条件**：详见 [02-Google-Cloud凭证创建指南.md](./02-Google-Cloud凭证创建指南.md)（创建项目、启用 API、配置 OAuth、中国大陆代理补丁）。

```bash
claude mcp add -s user google-workspace \
  -e GOOGLE_OAUTH_CLIENT_ID=你的客户端ID \
  -e GOOGLE_OAUTH_CLIENT_SECRET=你的客户端密钥 \
  -e OAUTHLIB_INSECURE_TRANSPORT=1 \
  -e HTTPS_PROXY=http://127.0.0.1:10808 \
  -e HTTP_PROXY=http://127.0.0.1:10808 \
  -- uvx workspace-mcp --tools drive sheets docs gmail --tool-tier core
```

> Token 过期时运行 `python C:\Users\Dylan\tools\refresh_google_token.py` 刷新（中国大陆必须）。

### DataForSEO MCP

> [官方仓库](https://github.com/dataforseo/mcp-server-typescript) | 按 API 调用付费（单次 < $0.01） | Node.js >= 20

```bash
# 1. 注册账号获取 API 凭据：app.dataforseo.com/api-access
# 2. 构建服务
git clone https://github.com/dataforseo/mcp-server-typescript.git ~/tools/mcp-server-typescript
cd ~/tools/mcp-server-typescript && npm install && npm run build
# 3. 安装
claude mcp add -s user dataforseo \
  -e DATAFORSEO_USERNAME=你的邮箱 \
  -e DATAFORSEO_PASSWORD=你的API密码 \
  -- node ~/tools/mcp-server-typescript/build/main/main/cli.js
```

### GSC MCP（选配 — 网站上线后安装）

```bash
claude mcp add gsc -- npx -y gsc-mcp-server
# 需配置环境变量: GSC_AUTH_MODE=oauth, GSC_OAUTH_SECRETS_FILE=路径, GSC_SITE_URL=sc-domain:域名
```

---

## Skill 安装

> `npx skills add` 加 `-g` 装全局；`npx clawhub@latest install` 建议 `cd ~/` 后执行。

### 核心安装

```bash
# Web Access — CDP 直连真实 Chrome（首要安装）
# Chrome 打开 chrome://inspect/#remote-debugging，勾选 Allow remote debugging
git clone https://github.com/eze-is/web-access ~/.claude/skills/web-access

# Tabbit AI — 通过 CDP 操控 Tabbit 浏览器内置 AI 聊天（依赖 web-access）
git clone https://github.com/liu184205909/tabbit-ai ~/.claude/skills/tabbit-ai

# 文档生成
npx skills add anthropics/skills --skill pdf xlsx docx pptx frontend-design skill-creator --agent claude-code -y -g

# SEO（claude-seo: 19技能+12代理 | Agentic-SEO: 16技能+10代理）
npx skills add AgriciDaniel/claude-seo -g
npx skills add Bhanunamikaze/Agentic-SEO-Skill --agent claude-code -y -g
npx skills add aaron-he-zhu/seo-geo-claude-skills -g

# SEO 审计工具（Script+LLM双层架构，与上面SEO Skill有功能重叠，留作架构参考）
npx skills add JeffLi1993/seo-audit-skill -g

# 博客 + 广告
npx skills add AgriciDaniel/claude-blog -g
npx skills add AgriciDaniel/claude-ads -g

# 营销策略 + 社媒发布
npx skills add coreyhaines31/marketingskills --agent claude-code -y -g
npx skills add typefully/agent-skills --agent claude-code -y -g

# 花叔中文技能包（选题/降AI味/视频/搜索等）
npx skills add alchaincyf/huashu-skills -g

# 调试辅助 + 记忆
npx skills add tanweai/pua --agent claude-code -y -g
npx skills add thedotmack/claude-mem --agent claude-code -y -g

# 其他
npx skills.add Automattic/wordpress-agent-skills --agent claude-code -y -g
npx clawhub@latest install skill-vetter
npx clawhub@latest install image-generation

# 验证
npx skills list -g
```

### ⚠️ 第三方 Skill 安全提醒

> Snyk ToxicSkills 审计（2026.02）：3984 个公开 Skill 中，**13.4% 含 critical issue**，**36.8% 含至少一种安全问题**，确认 **76 个恶意 Skill**。（来源：[Snyk Blog](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/)）

**风险**：Skill 可捆绑脚本、注入上下文、在触发时执行真实动作（上传 env、外传代码、插入恶意命令）— 性质等同于 npm 供应链风险。

**安全措施**：
1. 安装前用 `skill-vetter` 审查（已配置）
2. 优先使用 Anthropic 官方或高 Star 仓库的 Skill
3. 审查 Skill 内的 `scripts/` 目录，确认无可疑命令
4. 公司级使用应建立 Skill 白名单和沙箱执行权限

---

### Skill 速查

| 场景 | Skill | 触发词 |
|------|-------|--------|
| 浏览器操作/绕反爬 | **web-access** | "打开网页" / "去小红书搜" |
| 博客创作+SEO | **claude-blog** | "写博客" |
| SEO 审计 | **claude-seo** / **Agentic-SEO** / **seo-audit-skill** | "SEO审计" |
| 付费广告审计 | **claude-ads** | "审计广告" |
| 营销策略全家桶 | **marketingskills** | "营销策略" / "定价" |
| 社媒发布 | **typefully** | "发推文" |
| 降 AI 味 | **ai-proofreading** | "AI味太重" |
| 长文转社媒 | **article-to-x** | "转微博" / "发小红书" |
| 办公文档生成 | **pdf/xlsx/docx/pptx** | "生成PDF" |
| 配图 | **image-generation** | "配图" |
| 卡住换思路 | **pua** | "不行啊" / "/pua" |
| 跨会话记忆 | **claude-mem** | "上次怎么解决的" |
| 安全审查 | **skill-vetter** | 安装前检查 |

> Skill 探索: [skills.sh](https://skills.sh/) | [agentskills.so](https://agentskills.so) | [clawhub.ai](https://clawhub.ai)

### CLI 工具（钉钉/飞书）

```bash
# 钉钉 Workspace CLI — 163条命令，14个产品（聊天/文档/表格/日历/OA等）
# 仓库: https://github.com/DingTalk-Real-AI/dingtalk-workspace-cli
npm install -g dingtalk-workspace-cli
dws auth login                    # OAuth 登录（浏览器扫码）
dws pat authorize                 # PAT 授权（聊天/文档等需要）
# 可选：安装 Agent Skills 到 ~/.claude/skills/dws/
dws skill install

# 飞书 CLI — 飞书开放平台命令行工具
# 仓库: https://github.com/larksuite/cli
# 安装方式见仓库 README
```

> dws 常用命令速查：`dws chat message list --group <conversationId> --limit 50` 读群聊 | `dws doc read --node <docId>` 读文档 | `dws aitable record query --base-id <id> --table-id <id> --limit 50` 读多维表

### 备选工具（未安装）

| 工具 | 说明 | 适用场景 | 何时启用 |
|------|------|---------|---------|
| [Nanobrowser](https://github.com/nanobrowser/nanobrowser) | AI 浏览器自动化 Chrome 扩展，多智能体协作（Planner+Navigator+Validator），自然语言操控浏览器 | 复杂网页自动化（翻页/点击/填表） | 与 web-access 互补，需复杂网页操作时安装 |
| [CloakBrowser](https://github.com/CloakHQ/CloakBrowser) | Chromium C++ 源码级指纹伪装（57 处补丁），过 Cloudflare/reCAPTCHA v3（0.9+），兼容 Playwright API | 需直接采集有强反爬的站点 | 当前数据走 API（SERP/SEMrush），暂不需要；备用于未来直接采集竞品电商页面 |

---

## 参考资源

| 资源 | 链接 |
|------|------|
| Google Cloud 凭证配置 | [02-Google-Cloud凭证创建指南.md](./02-Google-Cloud凭证创建指南.md) |
| Skill 设计与自建 | [02-Skill设计与管理.md](./02-Skill设计与管理.md) |
| 官方文档 | [code.claude.com/docs](https://code.claude.com/docs/en) |
