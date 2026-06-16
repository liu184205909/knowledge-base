# sitemap-mcp-server 工具说明

> Sitemap 快速解析 MCP 工具 | 最后更新: 2026-05-26

---

## 基本信息

| 项目 | 值 |
|------|-----|
| 来源 | [mugoosse/sitemap-mcp-server](https://github.com/mugoosse/sitemap-mcp-server)（MIT 开源） |
| 底层库 | ultimate-sitemap-parser（自动通过 robots.txt 发现 sitemap） |
| 核心能力 | 解析竞品 sitemap → 提取博客/产品等页面 URL → 了解竞品内容策略 |
| venv 路径 | `D:\Tools\sitemap-mcp-server\.venv\Scripts\python.exe` |
| MCP 配置 | `~/.claude.json` → `mcpServers.sitemap` |

## 已知问题与修补

sitemap-mcp-server 0.1.3 与 mcp>=1.25 不兼容（`FastMCP.__init__` 移除了 `version` 参数），已在安装目录 `server.py` 第 156 行修补（移除 `version=` 和 `description=` 两个参数）。**勿用 uvx 重建环境**，否则修补会丢失。

## MCP 配置

已写入 `~/.claude.json` → `mcpServers.sitemap`：

```json
"sitemap": {
  "type": "stdio",
  "command": "D:\\Tools\\sitemap-mcp-server\\.venv\\Scripts\\python.exe",
  "args": ["-m", "sitemap_mcp_server"],
  "env": { "TRANSPORT": "stdio" }
}
```

## 可用工具

| 工具 | 功能 | 典型用法 |
|------|------|---------|
| `get_sitemap_tree` | 获取完整 sitemap 树结构 | 了解竞品有哪些子sitemap |
| `get_sitemap_pages` | 获取页面列表（支持过滤/分页） | 用 `sitemap_url` 指定子sitemap，用 `route` 过滤路径 |
| `get_sitemap_stats` | 获取 sitemap 统计信息 | 快速了解竞品页面总量、子sitemap 数 |
| `parse_sitemap_content` | 直接解析 sitemap XML 内容 | 已有 sitemap 文本时直接解析 |

## 实测结果（2026-05-20）

| 测试站点 | 总页面数 | 博客数 | 产品数 | 耗时 |
|---------|---------|--------|--------|------|
| 目标站点（自站） | 1,441 | 3 | 824 | <5秒 |
| tinyrituals.co（竞品#1） | 1,520 | 386 | 964 | <5秒 |
