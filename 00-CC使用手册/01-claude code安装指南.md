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

### 最终配置文件位置

**唯一配置文件**：`C:\Users\<用户名>\.claude.json`

**包含内容**：
- API配置（env字段）
- 模型设置（alwaysThinkingEnabled）
- 所有MCP服务器配置
- 使用统计和项目配置

### 配置文件优化建议

#### ✅ 推荐做法：合并配置文件

**将 `settings.json` 的内容合并到 `.claude.json`**

```json
// .claude.json 应该包含：
{
  "env": {
    "ANTHROPIC_BASE_URL": "...",
    "ANTHROPIC_AUTH_TOKEN": "...",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.7",
    ...
  },
  "alwaysThinkingEnabled": true,
  "mcpServers": {
    "web-reader": { ... },
    "web-search-prime": { ... },
    ...
  }
}
```

**然后删除**：
- `C:\Users\<用户名>\.claude\settings.json` （已合并）
- `C:\Users\<用户名>\.claude.json.backup` （备份文件）
- `C:\Users\<用户名>\.claude.json.corrupted.*` （损坏文件）

#### ❌ 不建议：移动配置文件

**不要将 `.claude.json` 移动到 `.claude/` 文件夹**
- 原因：Claude Code 默认在用户目录下查找 `.claude.json`
- 移动后可能导致配置无法加载

---

## 🔧 故障排除

### 问题1：MCP连接失败

**web-reader连接失败**：
```bash
claude mcp remove web-reader
claude mcp add -s user -t http web-reader https://web-reader.xdai.dev
```

**其他MCP连接失败**：
1. 检查网络连接
2. 验证API Key（对于需要密钥的MCP）
3. 完全重启 Claude Code
4. 等待 10-20 秒让 MCP 服务器启动

---

### 问题2：MCP未显示在列表中

**解决方案**：
1. ✅ 完全重启 Claude Code（不是重新加载窗口）
2. ✅ 等待 10-20 秒
3. ✅ 检查配置文件 JSON 格式是否正确
4. ✅ 运行 `claude mcp list` 查看状态

---

### 问题3：插件安装后没反应

**检查步骤**：
```bash
# 查看已安装的插件
/plugin list

# 查看插件是否启用
claude plugin enable <plugin-name>
```

---

## 📊 MCP功能对比

| MCP名称 | 功能 | 是否免费 | 使用场景 |
|---------|------|---------|---------|
| **web-reader** | 读取网页 | ✅ 免费 | 读取技术文档、文章 |
| **web-search-prime** | 联网搜索 | ✅ 免费 | 搜索最新信息、技术动态 |
| **zai-mcp-server** | 视觉理解 | ⚠️ 需API Key | 图片分析、UI转换、视频理解 |
| **playwright** | 浏览器自动化 | ✅ 免费 | 自动化测试、网页交互 |
| **zread** | GitHub深度访问 | ❌ 需付费套餐 | 深入学习开源项目源码 |

---

## 💡 推荐安装组合

### 基础版（免费）
```bash
# 1. 插件
claude plugin marketplace add https://github.com/wshobson/agents

# 2. MCP（免费）
claude mcp add -s user -t http web-reader https://web-reader.xdai.dev
claude mcp add -s user -t http web-search-prime https://web-search.xdai.dev
claude mcp add -s user playwright -- npx -y "@playwright/mcp@latest"
```

### 专业版（需要API Key）
```bash
# 基础版 + 视觉理解
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_key -- npx -y "@z_ai/mcp-server"
```

### 完整版（需要付费套餐）
```bash
# 专业版 + GitHub深度访问
claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"
```

---

## 📚 进阶学习（可选）

### 深度学习文档

**如果需要深入学习，可以阅读**：

1. [Claude-Skills完全指南.md](./Claude-Skills完全指南.md) - 82页白皮书
   - Skills 的工作原理
   - 如何创建自定义 Skills
   - 最佳实践和技巧

2. [Claude Code工具生态.md](./Claude Code工具生态.md) - 完整指南
   - Skills/Plugins/MCP 的区别
   - 何时使用哪个工具
   - 使用技巧和最佳实践

3. [UI设计资源.md](./UI设计资源.md) - aura.build使用指南
   - UI设计自动化
   - aura.build 使用教程

**注意**：这些文档适合深入学习，不是安装必需的。

---

## ✅ 安装检查清单

完成安装后，请逐项检查：

- [ ] Claude Code / Cursor 已安装
- [ ] 80+ 插件已安装（`/plugin list` 查看）
- [ ] web-reader MCP 已安装
- [ ] web-search-prime MCP 已安装
- [ ] playwright MCP 已安装
- [ ] zai-mcp-server MCP 已安装（如果需要）
- [ ] zread MCP 已安装（如果需要）
- [ ] 所有MCP在 `claude mcp list` 中显示为 ✓ Connected
- [ ] 能够搜索最新信息
- [ ] 能够读取网页内容
- [ ] API Key 已正确配置（对于需要密钥的MCP）

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
**预计安装时间**: 5-10分钟
**难度等级**: ⭐ 简单（AI自动执行）
