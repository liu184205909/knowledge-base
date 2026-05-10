# Claude Code 环境配置

> 换电脑恢复指南 | 最后更新: 2026-05-10

---

## 恢复步骤

向 Claude Code 发送：

```
请按照 00-基础能力/01-Claude-Code环境配置.md 中的模板，帮我完成环境初始化。
我的智谱 API Key 是：xxx
```

Claude Code 会自动完成：检测依赖 → 创建配置文件 → 安装 MCP → 安装 Skills。

---

## MCP 服务器配置

> `{{API_KEY}}` = 智谱 API Key。通过 `claude mcp add` 安装到用户级。

### 必装 MCP

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

# 文档生成
npx skills add anthropics/skills --skill pdf xlsx docx pptx frontend-design skill-creator --agent claude-code -y -g

# SEO（claude-seo: 19技能+12代理 | Agentic-SEO: 16技能+10代理）
npx skills add AgriciDaniel/claude-seo -g
npx skills add Bhanunamikaze/Agentic-SEO-Skill --agent claude-code -y -g
npx skills add aaron-he-zhu/seo-geo-claude-skills -g

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

### Skill 速查

| 场景 | Skill | 触发词 |
|------|-------|--------|
| 浏览器操作/绕反爬 | **web-access** | "打开网页" / "去小红书搜" |
| 博客创作+SEO | **claude-blog** | "写博客" |
| SEO 审计 | **claude-seo** / **Agentic-SEO** | "SEO审计" |
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

---

## 参考资源

| 资源 | 链接 |
|------|------|
| Google Cloud 凭证配置 | [02-Google-Cloud凭证创建指南.md](./02-Google-Cloud凭证创建指南.md) |
| Skill 设计与自建 | [02-Skill设计与管理.md](./02-Skill设计与管理.md) |
| 官方文档 | [code.claude.com/docs](https://code.claude.com/docs/en) |
