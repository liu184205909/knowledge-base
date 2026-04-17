# Claude Code 环境配置

> 最后更新: 2026-04-17

---

## 1. 全局 CLAUDE.md

**路径**: `~/.claude/CLAUDE.md`（项目级 > 全局级）

配置项：语言偏好（中文）、交互原则、工作方式（Read→Edit→Write）、技能触发规则。

---

## 2. MCP 安装

> 将 `your_api_key` 替换为智谱AI API Key。

| MCP | 用途 |
|-----|------|
| `zai-mcp-server` | 图片/截图视觉理解 |
| `web-search-prime` | 联网搜索 |
| `web-reader` | 抓取网页正文 |
| `zread` | 读取 GitHub 仓库 |

> **浏览器自动化**: 由 Web Access Skill 提供（CDP 直连 Chrome，含登录态），无需单独安装 Playwright MCP。

```bash
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_api_key -- npx -y "@z_ai/mcp-server"
claude mcp add -s user -t http web-search-prime https://open.bigmodel.cn/api/mcp/web_search_prime/mcp --header "Authorization: Bearer your_api_key"
claude mcp add -s user -t http web-reader https://open.bigmodel.cn/api/mcp/web_reader/mcp --header "Authorization: Bearer your_api_key"
claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"
```

**备用（无需 API Key）**:
```bash
claude mcp add -s user -t http web-reader-xdai https://web-reader.xdai.dev
claude mcp add -s user -t http web-search-prime-xdai https://web-search.xdai.dev
```

**验证**: `claude mcp list` — 预期所有项显示 ✓ Connected

---

## 3. Skills 安装

> **Skill 的安装目录、设计原则、完整目录及协作模式，请查看 [01-Skill设计与管理](./01-Skill设计与管理.md)**。

简要说明：
- Skills 必须安装到 `~/.claude/skills/` 目录，禁止在项目目录下安装
- 首要安装 **Web Access Skill**（搜索+浏览器+社媒发布一体化）
- 建议控制在 **30 个以内**，功能相近的合并而非拆分
