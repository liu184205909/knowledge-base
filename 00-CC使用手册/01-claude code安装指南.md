# Claude Code 自动安装指南

> **AI自动执行安装** | 适用于新电脑或首次安装 | 最后更新: 2026-01-04

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

### 核心配置文件

**配置位置**: `~/.claude/settings.json` (Windows: `C:\Users\<用户名>\.claude\settings.json`)

**关键配置**:
```json
{
  "env": {
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.7",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-4.7"
  }
}
```

### 🔌 插件与MCP兼容性

由于使用Claude Code框架，所有插件和MCP服务器完全兼容：

- ✅ **Claude Code原生插件** - 80+专业插件完全可用
- ✅ **MCP服务器** - 视觉、搜索、网页读取等通用MCP
- ✅ **IDE插件** - VS Code、Jetbrains、Cursor等
- ✅ **智谱专属MCP** - ZRead GitHub深度访问等

### API配置

- **API Key管理**: https://bigmodel.cn/usercenter/proj-mgmt/apikeys
- **订阅服务**: https://zhipuaishengchan.datasink.sensorsdata.cn/t/rR
- **技术支持**: 关注公众号「花叔」

---

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

## 📋 配置文件说明

**配置文件位置**：`~/.claude/settings.json` (Windows: `C:\Users\<用户名>\.claude\settings.json`)

包含 API 配置、模型设置、所有 MCP 服务器配置。如有问题直接让 AI 自动修复即可。

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

## 🎯 常见使用场景

### 场景1：学习新技术
```
你: "我想学习 FastAPI，帮我了解它的核心概念和最佳实践"

AI 会自动：
1. 使用 web-search 搜索 FastAPI 文档
2. 使用 web-reader 读取详细内容
3. 调用 python-development 插件（Python专家）
4. 整理成易于理解的学习指南
```

### 场景2：开发功能
```
你: "帮我开发一个用户认证功能"

AI 会自动：
1. 使用 feature-dev 插件（功能开发工作流）
2. 使用 web-search 搜索最佳实践
3. 读取相关技术文档
4. 生成代码并解释
```

### 场景3：分析开源项目
```
你: "帮我分析 Next.js 的路由实现原理"

AI 会自动：
1. 使用 zread 搜索 Next.js 仓库
2. 获取仓库结构
3. 读取路由相关源码
4. 分析实现原理并总结
```

---

**创建时间**: 2026-01-02
**最后更新**: 2026-01-04
**预计安装时间**: 5-10分钟
**难度等级**: ⭐ 简单（AI自动执行）
