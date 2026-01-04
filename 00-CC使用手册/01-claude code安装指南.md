# Claude Code 自动安装指南

> **AI自动执行安装** | 适用于新电脑或首次安装 | 最后更新: 2026-01-04

claude code 插件说明：

---

## 🏗️ 技术架构说明

本知识库基于 **Claude Code + GLM Coding Plan** 架构，通过智谱AI的GLM-4.7模型驱动。

### 三层架构

```
┌─────────────────────────────────────┐
│   🛠️ 工具层：Claude Code            │
│   - 智能编码工具框架                 │
│   - 插件系统、MCP服务器、IDE集成      │
└──────────────┬──────────────────────┘
               ↓
┌──────────────────────────────────────┐
│   ⚙️ 驱动层：GLM Coding Plan         │
│   - 智谱AI提供的兼容API服务           │
│   - 官方文档: https://docs.bigmodel.cn/cn/coding-plan/tool/claude
│   - 价格优势: 3倍用量，成本仅为国际服务的1/7
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│   🧠 模型层：GLM-4.7                 │
│   - 当前配置模型，性能旗舰版           │
│   - 国内优化: 访问更快更稳定           │
│   - 中文优化: 针对中文场景深度优化     │
└──────────────────────────────────────┘
```

### 🔌 插件与MCP兼容性

由于使用Claude Code框架，所有插件和MCP服务器完全兼容：

- ✅ **Claude Code原生插件** - 80+专业插件完全可用
- ✅ **MCP服务器** - 视觉、搜索、网页读取等通用MCP
- ✅ **IDE插件** - VS Code、Jetbrains、Cursor等
- ✅ **智谱专属MCP** - ZRead GitHub深度访问等



## 🚀 快速安装（3步）

### 步骤1: 安装80+专业插件

```bash
claude plugin marketplace add https://github.com/wshobson/agents
```

**包含插件**：核心开发、DevOps、测试、安全、多语言等80+插件

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

# 测试网页读取
"读取这个网页的内容: https://example.com"
```

**预期结果**：所有MCP显示为 ✓ Connected

---

## 📊 MCP功能说明

| MCP名称 | 功能 | 是否免费 | 使用场景 |
|---------|------|---------|---------|
| **web-reader** | 读取网页 | ✅ 免费 | 读取技术文档、文章、博客 |
| **web-search-prime** | 联网搜索 | ✅ 免费 | 搜索最新信息、技术动态 |
| **playwright** | 浏览器自动化 | ✅ 免费 | 自动化测试、网页交互、截图 |
| **zai-mcp-server** | 视觉理解 | ⚠️ 需API Key | 图片分析、UI转换代码、视频理解 |
| **zread** | GitHub深度访问 | ❌ 需付费套餐 | 深入学习开源项目源码 |



---

## 🔍 发现更多插件和MCP

### 方法1: Claude官方插件市场

**访问地址**: https://github.com/anthropics/courses/tree/main/cursor-course

**搜索技巧**:
1. 在GitHub搜索: `topic:claude-code-plugin`
2. 在GitHub搜索: `topic:claude-code-agent`
3. 浏览官方推荐插件列表

---

### 方法2: MCP官方仓库

**Model Context Protocol官方**: https://github.com/modelcontextprotocol

**推荐MCP服务器**:

**GitHub搜索命令**:
```bash
# 搜索MCP服务器
topic:model-context-protocol

# 搜索特定功能的MCP
mcp browser automation
mcp database
mcp api
```

**热门MCP分类**:
- 🌐 **网页相关**: @modelcontextprotocol/server-puppeteer、@executeautomation/puppeteer-mcp-server
- 💾 **数据库**: @modelcontextprotocol/server-postgres、@modelcontextprotocol/server-sqlite
- 📁 **文件系统**: @modelcontextprotocol/server-filesystem
- 🔍 **搜索引擎**: @modelcontextprotocol/server-brave-search
- 🗄️ **知识库**: @modelcontextprotocol/server-memory

---

### 方法3: 使用AI助手查找插件

**Prompt模板**:

```bash
"我需要[具体需求]

请帮我：
1. 搜索适合的Claude Code插件
2. 或搜索适合的MCP服务器
3. 提供安装命令
4. 说明使用场景

【我的需求】
[描述你的具体需求，例如：
- 处理Excel文件
- 连接MySQL数据库
- 自动化测试
- 代码审查
- 等等...]"
```

**实际示例**:

```bash
# 示例1: 寻找数据库插件
"我需要连接和操作PostgreSQL数据库
请推荐合适的MCP服务器并提供安装命令"

# 示例2: 寻找测试工具
"我需要自动化测试我的Web应用
请推荐合适的插件和MCP服务器"

# 示例3: 寻找开发工具
"我需要更好的代码审查和重构工具
请推荐相关的Claude Code插件"
```

---

### 方法4: 社区资源

**GitHub精选列表**:
- [awesome-claud-code](https://github.com/topics/claude-code) - 社区贡献的插件集合
- [mcp-servers](https://github.com/topics/model-context-protocol) - MCP服务器列表

**关注这些组织**:
- @anthropics - Claude官方
- @modelcontextprotocol - MCP官方
- @wshobson - 知名插件开发者

---

### 方法5: 创建自定义插件

**当现有插件无法满足需求时**:

**Prompt模板**:
```bash
"我想创建一个Claude Code插件来[具体功能]

请帮我：
1. 设计插件架构
2. 编写插件代码
3. 提供安装和测试步骤

【插件需求】
- [详细描述插件功能]
- [期望的输入输出]
- [使用场景]"
```

**参考文档**:
- Claude Code插件开发文档: https://docs.anthropic.com/en/docs/build-with-claude/claude-for-developers
- MCP服务器开发文档: https://modelcontextprotocol.io/introduction

---

## 📋 推荐插件组合

### 入门开发
```bash
# 已包含80+插件
claude plugin marketplace add https://github.com/wshobson/agents
```

### Python开发
- python-development (已包含)
- python-packaging (已包含)
- python-testing-patterns (已包含)

### Web开发
- javascript-typescript (已包含)
- playwright (MCP)
- web-reader (MCP)

### 数据分析
- python-development (已包含)
- @modelcontextprotocol/server-postgres (MCP)
- @modelcontextprotocol/server-sqlite (MCP)

### 自动化测试
- playwright (MCP)
- test-automator (已包含)
- debugging-toolkit (已包含)

---

**创建时间**: 2026-01-02
**最后更新**: 2026-01-04
**预计安装时间**: 5-10分钟
**难度等级**: ⭐ 简单（AI自动执行）
