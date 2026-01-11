# MCP基础与工具库

> **Model Context Protocol - AI能力扩展的标准协议**

---

## 📋 目录

1. [什么是MCP](#什么是mcp)
2. [MCP工作原理](#mcp工作原理)
3. [常用MCP工具库](#常用mcp工具库)
4. [MCP安装配置](#mcp安装配置)

---

## 什么是MCP

**MCP (Model Context Protocol)** = 模型上下文协议

是Anthropic开发的开放协议，让AI模型能够：
- ✅ **连接外部工具**：文件系统、数据库、API等
- ✅ **访问实时数据**：网页、搜索、天气等
- ✅ **执行操作**：浏览器控制、代码运行等
- ✅ **标准化接口**：统一的工具调用方式

**官方文档**：https://modelcontextprotocol.io

---

## MCP工作原理

### 架构概述

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Claude    │ ←→  │  MCP Server │ ←→  │  外部工具   │
│   (AI)      │     │  (中间层)   │     │  (API/DB)   │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 核心概念

| 概念 | 说明 |
|------|------|
| **MCP Server** | 提供工具能力的服务端程序 |
| **MCP Client** | 调用MCP Server的客户端（如Claude Code） |
| **Tools** | MCP Server暴露的具体功能 |
| **Resources** | MCP Server提供的数据资源 |

### 工作流程

1. **注册**：MCP Server向Client声明可用工具
2. **调用**：AI决定使用某个工具，发送请求
3. **执行**：MCP Server执行工具，返回结果
4. **处理**：AI处理结果，继续对话

---

## 常用MCP工具库

### 核心开发类

| MCP工具 | 功能 | 场景 |
|---------|------|------|
| **filesystem** | 文件系统操作 | 代码读写、文件管理 |
| **git** | Git版本控制 | 代码提交、分支管理 |
| **github** | GitHub API | Issue、PR、仓库管理 |
| **sqlite** | SQLite数据库 | 本地数据存储 |

### 网络访问类

| MCP工具 | 功能 | 场景 |
|---------|------|------|
| **fetch** | HTTP请求 | API调用、数据获取 |
| **web-search** | 网页搜索 | 信息检索 |
| **playwright** | 浏览器自动化 | 网页截图、表单填写 |

### AI增强类

| MCP工具 | 功能 | 场景 |
|---------|------|------|
| **sequential-thinking** | 结构化思考 | 复杂问题分析 |
| **memory** | 长期记忆 | 上下文保持 |
| **zai-mcp-server** | AI视觉 | 图片分析、截图理解 |

### 营销专用类

| MCP工具 | 功能 | 场景 |
|---------|------|------|
| **image-generation** | 图片生成 | 营销素材 |
| **social-media** | 社媒API | 内容发布 |
| **seo-tools** | SEO分析 | 关键词、排名 |

---

## MCP安装配置

### 前置条件

- Node.js 18+
- Claude Code 已安装

### 配置文件位置

**Windows**：
```
%APPDATA%\Claude\claude_desktop_config.json
```

**macOS**：
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

### 配置示例

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"]
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

### 验证安装

在Claude Code中输入：
```
/mcp
```

查看已连接的MCP服务列表。

---

## 💡 使用技巧

### 1. 按需启用
- 不要一次性启用所有MCP
- 根据当前任务启用需要的工具
- 减少资源占用和冲突

### 2. 权限控制
- filesystem只暴露必要目录
- 避免授权敏感路径
- 定期检查MCP权限

### 3. 错误处理
- MCP调用失败时，检查服务状态
- 查看Claude Code输出日志
- 重启MCP Server尝试

---

## 📚 相关资源

### 官方资源
- [MCP官方文档](https://modelcontextprotocol.io)
- [MCP GitHub仓库](https://github.com/modelcontextprotocol)
- [官方MCP Server列表](https://github.com/modelcontextprotocol/servers)

### 社区资源
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
- [MCP工具开发指南](https://modelcontextprotocol.io/docs/tools/developing)

### 知识库相关
- [01-Claude-Code安装配置.md](01-Claude-Code安装配置.md) - 完整安装指南
- [01-AI营销/03-MCP工具应用/](../01-AI营销/03-MCP工具应用/) - MCP营销应用场景

---

**创建时间**: 2026-01-06
**版本**: v1.0

**MCP让AI从"对话"进化到"行动"！** 🔧

