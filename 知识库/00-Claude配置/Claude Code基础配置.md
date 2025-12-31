# 快速开始

> **10分钟上手Claude Code** | 2025-12-31

本文档帮助你快速搭建Claude Code工作环境。

---

## 🚀 3步快速安装

### 步骤1: 安装80+插件（1分钟）

```bash
# 社区插件市场(包含核心开发/DevOps/测试/安全/多语言等80+插件)
claude plugin marketplace add https://github.com/wshobson/agents
```

**推荐插件**:
- feature-dev - 功能开发工作流
- code-review-ai - AI代码审查
- python-development - Python开发
- javascript-typescript - JavaScript/TypeScript开发

---

### 步骤2: 安装5个核心MCP（5分钟）

```bash
# 1. 网页读取(免费)
claude mcp add -s user -t http web-reader https://web-reader.xdai.dev

# 2. 联网搜索(免费)
claude mcp add -s user -t http web-search-prime https://web-search.xdai.dev

# 3. 视觉理解(免费,需API Key)
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_key -- npx -y "@z_ai/mcp-server"

# 4. 浏览器自动化(免费)
claude mcp add -s user playwright -- npx -y "@playwright/mcp@latest"

# 5. GitHub深度访问(需GLM Coding Plan)
claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"
```

**安装后**: 完全重启Claude Code,等待10-20秒让MCP服务器启动。

---

### 步骤3: 验证安装（2分钟）

```bash
# 查看已安装的插件
/plugin list

# 查看已安装的MCP
/mcp list

# 测试联网搜索
"搜索最新的AI技术发展"

# 测试网页读取
"读取这个网页的内容: https://example.com"
```

---

## 💡 插件 vs MCP vs Skills

| 概念 | 作用 | 示例 |
|------|------|------|
| **插件** | 专业顾问 | Python专家、前端顾问、后端架构师 |
| **MCP** | 外部工具 | 网页读取、联网搜索、GitHub访问 |
| **Skills** | 工作手册 | 告诉AI"怎么做"特定任务 |

**使用原则**:
- 需要专业知识 → 插件
- 需要外部数据 → MCP
- 需要工作流程 → Skills

---

## 🔧 常用命令

### 插件管理
```bash
/plugin list                                    # 查看已安装的插件
claude plugin enable <plugin-name>              # 启用插件
claude plugin disable <plugin-name>             # 禁用插件
```

### MCP管理
```bash
/mcp list              # 查看已安装的MCP
claude mcp remove xxx  # 删除MCP
```

---

## ⚠️ 常见问题

**插件/MCP安装后没反应?**
→ 插件: 检查是否启用 `/plugin list`
→ MCP: 完全重启Claude Code + 等待10-20秒

**调用失败?**
→ 检查网络连接
→ 验证API Key(zread/zai-mcp-server需要)

**额度不够?**
→ 免费资源: web-reader/web-search/playwright
→ 付费资源: zread(需GLM Coding Plan)

---

## 🎯 推荐组合

**数字营销必备**: web-reader + web-search
**产品开发必备**: zread + web-reader + web-search + feature-dev
**全功能套装**: 全部5个MCP + 80+插件

---

## 📚 下一步

**深入学习MCP/Plugins**:
- [Claude Code工具生态.md](./Claude%20Code工具生态.md) - 完整指南

**深入学习Skills**:
- [Claude Skills完全指南.md](./Claude-Skills完全指南.md) - 82页白皮书

**实战模板**:
- [Prompt模板库](./实战模板库/Prompt模板库.md) - 15个常用模板

---

**创建时间**: 2025-12-31
**预计阅读时间**: 10分钟
**难度等级**: ⭐ 新手友好
