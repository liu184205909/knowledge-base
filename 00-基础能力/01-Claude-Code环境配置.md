# Claude Code 环境配置

> 换电脑恢复指南 | 最后更新: 2026-05-06

---

## 恢复步骤

### 唯一需要人工做的事：提供 API Key

向 Claude Code 发送：

```
请按照 00-基础能力/01-Claude-Code环境配置.md 中的模板，帮我完成环境初始化。
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

> 通过 `claude mcp add` 安装到用户级。`{{API_KEY}}` = 智谱 API Key。

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

3. 安装到 Claude Code：

```bash
claude mcp add -s user dataforseo \
  -e DATAFORSEO_USERNAME=你的邮箱 \
  -e DATAFORSEO_PASSWORD=你的API密码 \
  -- node ~/tools/mcp-server-typescript/build/main/main/cli.js
```

> 不设置 `ENABLED_MODULES` 时默认启用全部模块（关键词/SERP/外链/OnPage/域名分析/本地SEO/内容分析/AI优化）。

**安装常见问题：**

| 问题 | 解决方案 |
|------|----------|
| `/mcp` 列表中没有 dataforseo | VSCode 扩展版读取 `~/.claude.json`，将配置写入该文件的 `mcpServers` 字段 |
| 连接状态为 failed | 检查 Node.js >= 20，构建产物存在（重新 `npm run build`） |

---

## 参考资源

| 资源 | 链接 |
|------|------|
| claude-code-best-practice | [GitHub](https://github.com/shanraisshan/claude-code-best-practice) |
| 官方文档 | [code.claude.com/docs](https://code.claude.com/docs/en) |
| Skills 完整列表 | [01-Skill设计与管理](./01-Skill设计与管理.md) |
