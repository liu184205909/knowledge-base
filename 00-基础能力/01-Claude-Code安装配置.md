# Claude Code 安装配置指南

> **AI自动执行安装** | 适用于新电脑或首次安装 | 最后更新: 2026-01-07

---

## 🚀 快速安装（3步）

### 步骤1: 安装80+专业插件

```bash
claude plugin marketplace add https://github.com/wshobson/agents
```

**包含插件**：核心开发、DevOps、测试、安全、多语言等80+插件

---

## ⚠️ 安装建议：断舍离

> **Claude Code开箱即用就很好** - Claude Code之父Boris Cherny

**核心原则**：
- ✅ **够用就好**：5个核心MCP + 80+插件完全够用
- ❌ **避免收集癖**：不要安装大量不知来源的MCP和插件
- 💡 **性能优先**：过多插件会空耗资源

---

### 步骤2: 安装5个核心MCP

#### 2.1 网页读取（免费）
```bash
claude mcp add -s user -t http web-reader https://web-reader.xdai.dev
```

#### 2.2 联网搜索（免费）
```bash
claude mcp add -s user -t http web-search-prime https://web-search.xdai.dev
```

#### 2.3 浏览器自动化（免费）
```bash
claude mcp add -s user playwright -- npx -y "@playwright/mcp@latest"
```

**💡 高级配置：保持浏览器登录状态**

修改 `~/.claude.json`：
```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--user-data-dir=/Users/你的用户名/.claude-playwright-profile"]
    }
  }
}
```

#### 2.4 视觉理解（需要API Key）
```bash
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_key -- npx -y "@z_ai/mcp-server"
```

#### 2.5 GitHub深度访问（需要GLM Coding Plan）
```bash
claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"
```

---

### 步骤3: 验证安装

```bash
# 查看已安装的MCP
claude mcp list

# 测试联网搜索
"搜索最新的AI技术发展"
```

**预期结果**：所有MCP显示为 ✓ Connected

---

## 📊 MCP功能说明

| MCP名称 | 功能 | 是否免费 | 使用场景 |
|---------|------|---------|---------|
| **web-reader** | 读取网页 | ✅ 免费 | 技术文档、文章 |
| **web-search-prime** | 联网搜索 | ✅ 免费 | 搜索最新信息 |
| **playwright** | 浏览器自动化 | ✅ 免费 | 测试、截图 |
| **zai-mcp-server** | 视觉理解 | ⚠️ 需Key | 图片分析、UI转代码 |
| **zread** | GitHub深度访问 | ❌ 付费 | 学习开源项目 |

---

## 🔍 发现更多插件和MCP

### 方法1: MCP官方仓库

**官方地址**: https://github.com/modelcontextprotocol

**热门MCP分类**:
- 🌐 **网页相关**: puppeteer-mcp-server
- 💾 **数据库**: server-postgres、server-sqlite
- 📁 **文件系统**: server-filesystem
- 🔍 **搜索引擎**: server-brave-search

### 方法2: 使用AI助手查找

```bash
"我需要[具体需求]，请推荐合适的MCP服务器并提供安装命令"
```

### 方法3: Dev Browser 插件（强烈推荐）

**安装命令**：
```bash
/plugin marketplace add sawyerhood/dev-browser
/plugin install dev-browser@sawyerhood/dev-browser
```

**核心优势**：
- ✅ 效率提升200%
- ✅ 一次成功率高
- ✅ Token消耗更低
- ✅ 基于A11y Tree，定位更稳定

---

## 📚 相关文档

### 高级工具
- [Schaltwerk多AI协同](../02-AI开发/00-AI开发方式/03-多AI协同-Schaltwerk工具.md)
- [Ralph Wiggum自动迭代](../02-AI开发/00-AI开发方式/06-工具-Ralph%20Wiggum自动迭代插件.md)

### MCP深入
- [MCP基础与工具库](./06-MCP基础与工具库.md)

---

**创建时间**: 2026-01-02
**最后更新**: 2026-01-07
**预计安装时间**: 5-10分钟
**难度等级**: ⭐ 简单（AI自动执行）
