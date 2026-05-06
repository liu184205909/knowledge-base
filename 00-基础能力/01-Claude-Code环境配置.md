# Claude Code 环境配置


向 Claude Code 发送：

```
请按照 00-基础能力/00-Claude-Code环境配置.md 中的模板，帮我完成环境初始化。
我的智谱 API Key 是：xxx
```

Claude Code 会自动完成以下所有操作：

| 操作 | 说明 |
|------|------|
| 检测并安装 Node.js、Git 等依赖 | 缺什么装什么 |
| 创建 `~/.claude/settings.json` | 使用下方模板，填入你的 Key |
| 创建 `~/.claude/CLAUDE.md` | 全局指令文件 |
| 安装 MCP（5 个必装） | 见下方详细配置 |
| 安装 Skills | 按 [01-Skill设计与管理](./01-Skill设计与管理.md) 自动安装 |

---

## MCP 服务器配置

> 通过 `claude mcp add` 安装到用户级，不在 settings.json 内。`{{API_KEY}}` = 智谱 API Key。

| MCP | 安装命令 | 用途 |
|-----|---------|------|
| zai-mcp-server | `claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY={{API_KEY}} -- npx -y "@z_ai/mcp-server"` | 图片/截图视觉理解 |
| web-search-prime | `claude mcp add -s user -t http web-search-prime https://open.bigmodel.cn/api/mcp/web_search_prime/mcp --header "Authorization: Bearer {{API_KEY}}"` | 联网搜索 |
| web-reader | `claude mcp add -s user -t http web-reader https://open.bigmodel.cn/api/mcp/web_reader/mcp --header "Authorization: Bearer {{API_KEY}}"` | 网页正文抓取 |
| zread | `claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer {{API_KEY}}"` | GitHub 仓库阅读 |
| dataforseo | 见下方 DataForSEO 专项配置 | SEO 关键词/SERP 数据 |

> 备用方案（无需 API Key）：`web-search-prime-xdai` → `https://web-search.xdai.dev`，`web-reader-xdai` → `https://web-reader.xdai.dev`

### DataForSEO MCP（必装）

> [官方仓库](https://github.com/dataforseo/mcp-server-typescript) | 按 API 调用付费（单次 < $0.01） | 需要 Node.js >= 20

**前置条件：**

1. 在 [app.dataforseo.com](https://app.dataforseo.com/api-access) 注册账号，获取 API 凭据（用户名 + 自动生成的 API 密码）
2. 克隆并构建 MCP Server：

```bash
git clone https://github.com/dataforseo/mcp-server-typescript.git ~/tools/mcp-server-typescript
cd ~/tools/mcp-server-typescript
npm install && npm run build
```

3. 安装到 Claude Code（Windows 用 `set`，Linux/Mac 用 `export`）：

```bash
claude mcp add -s user dataforseo \
  -e DATAFORSEO_USERNAME=你的邮箱 \
  -e DATAFORSEO_PASSWORD=你的API密码 \
  -e ENABLED_MODULES=KEYWORDS_DATA,SERP \
  -- node ~/tools/mcp-server-typescript/build/main/main/cli.js
```

**启用模块说明：**

| 模块名 | 功能 | 建议场景 |
|--------|------|----------|
| `KEYWORDS_DATA` | 关键词搜索量、CPC、竞争度、趋势 | 关键词研究（必装） |
| `SERP` | Google/YouTube/Bing 搜索结果、视频信息、字幕 | 竞品分析、内容研究（必装） |
| `BACKLINKS` | 外链分析、域名权重 | 外链建设 |
| `ONPAGE` | 页面审计、Lighthouse、重复内容 | 技术SEO |
| `DATAFORSEO_LABS` | 关键词研究、竞品对比、市场分析 | 深度分析 |
| `DOMAIN_ANALYTICS` | 域名技术栈、Whois | 域名调研 |
| `BUSINESS_DATA` | Google Business、评论、问答 | 本地SEO |
| `CONTENT_ANALYSIS` | 内容情感分析、评分分布 | 内容优化 |
| `AI_OPTIMIZATION` | AI引用追踪、LLM提及分析 | GEO优化 |

> 不设置 `ENABLED_MODULES` 时默认启用全部模块。

**可用工具列表（KEYWORDS_DATA + SERP 模块）：**

| 工具 | 功能 | 典型用途 |
|------|------|----------|
| `kw_data_google_ads_search_volume` | 关键词月搜索量、CPC、竞争度 | 关键词价值评估 |
| `kw_data_google_ads_locations` | 查询可用的地理位置列表 | 地区定向 |
| `kw_data_google_trends_explore` | Google Trends 趋势（搜索/新闻/YouTube/图片/购物） | 趋势分析 |
| `kw_data_google_trends_categories` | Google Trends 分类列表 | 分类筛选 |
| `kw_data_dfs_trends_explore` | DataForSEO 自有趋势数据 | 趋势探索 |
| `kw_data_dfs_trends_subregion_interests` | 地区关注度分布 | 地域分析 |
| `kw_data_dfs_trends_demography` | 人群画像（年龄/性别） | 受众分析 |
| `serp_locations` | SERP 可用地理位置查询 | 地区验证 |
| `serp_organic_live_advanced` | Google 自然搜索 SERP 实时数据 | 排名追踪 |
| `serp_youtube_locations` | YouTube SERP 地理位置 | YouTube地区设置 |
| `serp_youtube_organic_live_advanced` | YouTube 搜索结果 | 视频SEO |
| `serp_youtube_video_info_live_advanced` | YouTube 视频详情 | 视频分析 |
| `serp_youtube_video_comments_live_advanced` | YouTube 视频评论 | 评论分析 |
| `serp_youtube_video_subtitles_live_advanced` | YouTube 视频字幕 | 内容提取 |

**安装常见问题：**

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| `/mcp` 列表中没有 dataforseo | VSCode 扩展版 Claude Code 读取 `~/.claude.json`，不读取 `~/.claude/settings.json` | 将配置写入 `~/.claude.json` 的 `mcpServers` 字段（见下方手动配置） |
| 手动测试环境变量报错 `'DATAFORSEO_USERNAME' 不是内部或外部命令` | Windows CMD 不支持 Linux 风格的 `VAR=value command` 语法 | 使用 `set DATAFORSEO_USERNAME=xxx && node cli.js`，或用 PowerShell：`$env:DATAFORSEO_USERNAME="xxx"; node cli.js` |
| MCP Server 启动后无工具 | `ENABLED_MODULES` 值包含无效模块名 | 检查模块名拼写，可用值：`AI_OPTIMIZATION, SERP, KEYWORDS_DATA, ONPAGE, DATAFORSEO_LABS, BACKLINKS, BUSINESS_DATA, DOMAIN_ANALYTICS, CONTENT_ANALYSIS` |
| 连接状态为 failed | Node.js 版本 < 20 或构建产物不存在 | 运行 `node --version` 确认 >= 20，重新 `npm run build` |

**手动配置（`~/.claude.json`）：**

> 如果 `claude mcp add` 命令不生效（VSCode 扩展版），需手动编辑 `C:\Users\<用户名>\.claude.json`（Windows）或 `~/.claude.json`（Mac/Linux），在 `mcpServers` 中添加：

```json
"dataforseo": {
  "command": "node",
  "args": ["C:\\Users\\<用户名>\\tools\\mcp-server-typescript\\build\\main\\main\\cli.js"],
  "env": {
    "DATAFORSEO_USERNAME": "你的邮箱",
    "DATAFORSEO_PASSWORD": "你的API密码",
    "ENABLED_MODULES": "KEYWORDS_DATA,SERP"
  },
  "type": "stdio"
}
```

### 管理命令

```bash
claude mcp list              # 查看已安装
claude mcp remove <name>     # 移除
```

---

## 配置模板

> 以下模板供 Claude Code 参考，**不需要手动操作**。

### settings.json 模板

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "language": "chinese",
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": [
      "Edit(*)", "Write(*)",
      "Bash(npm run *)", "Bash(git *)", "Bash(npx *)",
      "mcp__*", "Agent(*)"
    ],
    "deny": ["Read(.env)", "Read(./secrets/**)"]
  },
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "{{API_KEY}}",
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-5.1",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5-turbo",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-5-turbo",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "enabledPlugins": {
    "glm-plan-usage@zai-coding-plugins": true,
    "glm-plan-bug@zai-coding-plugins": true
  }
}
```

### CLAUDE.md 模板

```markdown
# 全局指令
- 始终使用中文回复
- 工作方式：Read → Edit → Write，优先编辑已有文件
- 禁止在项目目录下安装 Skills
- 提交信息使用中文，格式：`类型: 简述`
```

---

## 配置文件速查

| 文件 | 路径 | 说明 |
|------|------|------|
| settings.json | `~/.claude/settings.json` | API、权限、环境变量 |
| CLAUDE.md | `~/.claude/CLAUDE.md` | 全局指令 |
| Skills | `~/.claude/skills/` | 技能目录 |
| Commands | `~/.claude/commands/` | 自定义指令 |
| Agents | `~/.claude/agents/` | 自定义智能体 |

> Windows 下 `~` = `C:\Users\<用户名>\`

---

## 常用指令速查

| 指令 | 说明 | 场景 |
|------|------|------|
| `/compact` | 压缩上下文 | 50% context 时触发 |
| `/context` | 查看 token 用量 | 随时查看 |
| `/plan` | 规划模式 | 复杂任务先规划 |
| `/focus` | 只看最终结果 | 信任模型时 |
| `/rewind` | 回退状态 | 出错时 |
| `/resume` | 恢复会话 | 中断后继续 |

### 关键习惯

| 习惯 | 说明 |
|------|------|
| 50% 时手动 `/compact` | 提前压缩，保留更多关键信息 |
| 给 Claude 验证手段 | 后端→运行测试；前端→Chrome 控制 |
| 单文件单提交 | git 历史干净 |

---

## 参考资源

| 资源 | 链接 |
|------|------|
| claude-code-best-practice | [GitHub](https://github.com/shanraisshan/claude-code-best-practice) |
| 官方文档 | [code.claude.com/docs](https://code.claude.com/docs/en) |
| Skills 完整列表 | [01-Skill设计与管理](./01-Skill设计与管理.md) |
