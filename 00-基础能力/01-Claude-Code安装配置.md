# Claude Code 安装配置指南

> **AI自动执行安装** | 适用于新电脑或首次安装 | 最后更新: 2026-01-11

---

## 🎯 使用说明

**AI助手请按照以下步骤自动执行安装**:

1. 安装Claude Code
2. 安装3个核心Plugins
3. 安装6个核心MCP
4. 安装80+插件集合
5. 验证安装

---

## 🚀 步骤1: 安装Claude Code

### macOS / Linux / WSL
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### Windows (PowerShell)
```powershell
irm https://claude.ai/install.ps1 | iex
```

**验证版本**: `claude --version` (当前最新: 2.1.4)

---

## 🚀 步骤2: 安装3个核心Plugins

### 2.1 代码简化插件（官方推荐）
```bash
claude plugin marketplace update claude-plugins-official
claude plugin install code-simplifier
```

### 2.2 自动迭代插件（高级，可选）
```bash
claude plugin install ralph-wiggum@anthropics
```

### 2.3 Dev Browser（效率提升200%）
```bash
claude plugin marketplace add sawyerhood/dev-browser
claude plugin install dev-browser@sawyerhood/dev-browser
```

**关于Skills**: Claude Code 2.1.4支持Skills，但通过本地 `~/.claude/skills/` 目录管理，无需单独安装。

---

## 🚀 步骤3: 安装6个核心MCP

### 3.1 网页读取（免费）
```bash
claude mcp add -s user -t http web-reader https://web-reader.xdai.dev
```

### 3.2 联网搜索（免费）
```bash
claude mcp add -s user -t http web-search-prime https://web-search.xdai.dev
```

### 3.3 浏览器自动化（免费）
```bash
claude mcp add -s user playwright -- npx -y "@playwright/mcp@latest"
```

### 3.4 视觉理解（需要API Key）
```bash
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_key -- npx -y "@z_ai/mcp-server"
```

### 3.5 GitHub深度访问（需要API Key）
```bash
claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"
```

### 3.6 YouTube视频字幕提取（免费）⭐
```bash
claude mcp add -s user youtube-transcript -- npx -y @sinco-lab/mcp-youtube-transcript
```

**注意**: 3.4和3.5需要替换为用户的实际API Key

---

## 🚀 步骤4: 安装80+专业插件

**包含**: 核心开发、DevOps、测试、安全、多语言等80+插件

```bash
claude plugin marketplace add https://github.com/wshobson/agents
```

---

## 🚀 步骤4: 验证安装

```bash
# 查看已安装的MCP
claude mcp list

# 查看已安装的Plugins
claude plugin list

# 测试联网搜索（在Claude Code对话中）
"搜索最新的AI技术发展"
```

**预期结果**: 所有MCP显示为 ✓ Connected

---

## 📊 工具清单

| 类别 | 数量 | 用途 |
|------|------|------|
| **Plugins** | 3个 | 代码简化、自动迭代、Dev Browser |
| **MCP** | 6个 | 网页读取、搜索、浏览器、视觉、GitHub、YouTube |
| **插件集合** | 80+ | 全栈开发支持 |
| **Skills** | 自动 | 本地 ~/.claude/skills/ 目录管理 |

**总耗时**: 约8-10分钟
**覆盖场景**: 99%

---

## 🎯 完成标志

当以下命令都能正常工作时：
- ✅ `claude mcp list` 显示所有MCP已连接
- ✅ `claude plugin list` 显示所有Plugins已安装
- ✅ 联网搜索功能正常
- ✅ 插件市场加载正常

**恭喜！Claude Code已完全配置，可以开始使用！**

---

## 🔍 重要说明：Skills vs Plugins vs MCP

### Skills（本地管理）
- **位置**: `~/.claude/skills/`
- **安装方式**: 创建SKILL.md文件到本地目录
- **热加载**: 文件修改后自动生效，无需重启
- **用途**: 自定义工作流和提示词模板

### Plugins（插件市场）
- **安装方式**: `claude plugin install`
- **来源**: 官方marketplace或第三方repo
- **用途**: 打包的功能扩展（可包含5个Skills + 10个斜杠命令）

### MCP（服务器）
- **安装方式**: `claude mcp add`
- **用途**: 外部工具连接（API、数据库、服务等）

**三者关系**: Plugin可以包含Skills和MCP配置，Skills最轻量，MCP最强大。

---

## 🆘 遇到问题?

**直接问我**:
```
"我需要[具体功能]，推荐合适的工具"
"我想创建一个Skill，帮我写代码"
"这个MCP怎么配置？"
"安装失败了怎么办？"
```

**我会自动**:
1. 理解你的需求
2. 推荐合适的工具
3. 提供安装命令
4. 帮你配置和排错

**不需要查文档**！

---

**创建时间**: 2026-01-02
**最后更新**: 2026-01-11
**预计安装时间**: 8-10分钟
**难度等级**: ⭐ 简单（AI自动执行）
