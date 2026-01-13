# Claude Code 环境配置

> **AI完整安装指南** | 最后更新: 2026-01-12

---

## 安装清单

- Claude Code主程序
- 3个核心Plugins
- 6个核心MCP(网页读取、搜索、浏览器、视觉、GitHub、YouTube)
- 80+插件集合

---

## 1. 安装Claude Code

### macOS / Linux / WSL
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### Windows
```powershell
irm https://claude.ai/install.ps1 | iex
```

验证: `claude --version` (当前: 2.1.4)

---

## 2. 安装3个核心Plugins

### 2.1 代码简化插件
```bash
claude plugin marketplace update claude-plugins-official
claude plugin install code-simplifier
```

### 2.2 自动迭代插件(可选)
```bash
claude plugin install ralph-wiggum@anthropics
```

### 2.3 Dev Browser
```bash
claude plugin marketplace add sawyerhood/dev-browser
claude plugin install dev-browser@sawyerhood/dev-browser
```

---

## 3. 安装6个核心MCP

### 3.1 网页读取
```bash
claude mcp add -s user -t http web-reader https://web-reader.xdai.dev
```

### 3.2 联网搜索
```bash
claude mcp add -s user -t http web-search-prime https://web-search.xdai.dev
```

### 3.3 浏览器自动化
```bash
claude mcp add -s user playwright -- npx -y "@playwright/mcp@latest"
```

### 3.4 视觉理解(需API Key)
```bash
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_key -- npx -y "@z_ai/mcp-server"
```

### 3.5 GitHub深度访问(需API Key)
```bash
claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"
```

### 3.6 YouTube字幕提取
```bash
claude mcp add -s user youtube-transcript -- npx -y @sinco-lab/mcp-youtube-transcript
```

**注意**: 3.4和3.5需要替换API Key

---

## 4. 安装80+插件集合

```bash
claude plugin marketplace add https://github.com/wshobson/agents
```

---

## 5. 验证安装

```bash
# 查看MCP
claude mcp list

# 查看Plugins
claude plugin list
```

预期结果: 所有MCP显示为 ✓ Connected

---

## 安装总览

| 类别 | 数量 |
|------|------|
| Plugins | 3个 |
| MCP | 6个 |
| 插件集合 | 80+ |

预计耗时: 8-10分钟

---

## Skills简介

**Skills = 模块化能力包 = AI工作手册**

- 固化经验为可复用知识库
- 标准化工作流程(SOP)
- Claude自动识别场景并执行
- 支持持续迭代优化

### Skills vs MCP vs Plugins

| 概念 | 比喻 | 作用 | 使用方式 |
|------|------|------|---------|
| Skills | 📘 工作手册 | 告诉AI"怎么做" | 自动加载 |
| Plugins | 🔌 专业顾问 | 提供专业建议 | 自动调用 |
| MCP | 🧰 外部工具 | 连接外部世界 | 自动使用 |

**关系**: Skills和MCP是互补关系,非替代

### Skills快速开始

**想要了解**:
- Skills开发指南 → 见 [05-Skills完整指南.md](./05-Skills完整指南.md#第一部分-skills开发指南)
- 推荐Skills列表 → 见 [05-Skills完整指南.md](./05-Skills完整指南.md#1-推荐skills清单)
- Skills分享方法 → 见 [05-Skills完整指南.md](./05-Skills完整指南.md#2-skills分享方法)
- 多设备同步 → 见 [05-Skills完整指南.md](./05-Skills完整指南.md#23-多设备同步)

**想要使用**:
- 安装官方Skills → 见 [05-Skills完整指南.md](./05-Skills完整指南.md#11-官方skills-anthropic)
- 安装社区Skills → 见 [05-Skills完整指南.md](./05-Skills完整指南.md#12-社区热门skills)

---

## 相关文档

- [05-Skills完整指南.md](./05-Skills完整指南.md) - Skills完整指南(开发、推荐、分享)
- [02-Agent开发与系统搭建.md](./02-Agent开发与系统搭建.md) - Agent开发与个人系统
- [03-RLM递归思想.md](./03-RLM递归思想.md) - RLM方法论
