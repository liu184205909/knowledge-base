# Claude Code 工具生态

> **插件系统 + MCP服务器 + 使用技巧** 完整指南

**核心理念**：换台电脑后，按照本文档操作即可搭建完整的Claude Code开发环境

---

## 📋 文档结构

本文档分为4个部分，建议按顺序阅读：

1. **[Claude Code插件系统](#1-claude-code插件系统)** - 插件安装、推荐清单
2. **[MCP服务器](#2-mcp服务器)** - MCP安装、推荐清单
3. **[使用技巧](#3-使用技巧)** - 保持AI高效状态
4. **[ZRead MCP配置](#4-zread-mcp配置)** - 开源仓库访问（可选）

---

## 1. Claude Code插件系统

### 1.1 什么是插件系统？

**Claude Code Plugin System** 是官方推出的插件生态，让AI能够：
- 📦 **插件（Plugins）**：打包最佳实践和工具集
- 🎯 **技能（Skills）**：特定任务的专家级知识
- 🤖 **子代理（Sub Agents）**：独立的AI助手处理复杂任务
- 🔧 **Hooks**：在特定事件触发自定义操作

**使用方式**：AI会根据任务自动调用，无需手动选择

---

### 1.2 插件安装

#### 步骤1：添加官方插件市场

```bash
claude plugin add https://github.com/anthropics/claude-plugins-official
```

或者通过VSCode界面：`Ctrl+Shift+P` → "Claude Code: Add Plugin Market"

#### 步骤2：安装推荐插件

```bash
# 查看可用插件
claude plugin list

# 启用插件
claude plugin enable feature-dev
```

---

### 1.3 推荐插件清单

#### 核心插件（强烈推荐）

##### 1. feature-dev ⭐
**功能**：完整的功能开发工作流

**适合场景**：
- 中等复杂度功能开发（5-10个文件）
- 需要严格架构规范的项目
- 团队协作项目

**安装**：
```bash
claude plugin enable feature-dev
```

---

##### 2. code-review-ai
**功能**：AI代码审查，自动发现问题和优化点

**适合场景**：
- 代码质量检查
- 安全漏洞扫描
- 性能优化建议

**安装**：
```bash
claude plugin enable code-review-ai
```

---

##### 3. python-development / javascript-typescript
**功能**：语言开发支持

**适合场景**：
- Python或JavaScript/TypeScript开发
- 自动补全和语法检查
- 最佳实践建议

**安装**：
```bash
# Python开发
claude plugin enable python-development

# JavaScript/TypeScript开发
claude plugin enable javascript-typescript
```

---

##### 4. claude-mem
**功能**：Claude Code的记忆外挂

**适合场景**：
- 长期项目
- 需要记住历史对话的项目
- 复杂业务逻辑项目

**安装**：
```bash
claude plugin enable claude-mem
```

---

### 1.4 第三方插件市场

如果官方市场没有找到合适的插件：

| 市场 | 链接 | 特点 |
|------|------|------|
| **Claude Plugins** | https://claude-plugins.dev | 第三方插件 |
| **Claude Marketplaces** | https://claudemarketplaces.com | 插件质量较高 |
| **Awesome Agents** | https://github.com/wshobson/agents | 243个插件，规模最大 |

---

### 1.5 插件分类清单

#### 核心开发 (10)
- feature-dev, code-review-ai, python-development, javascript-typescript, rust-pro, golang-pro, c-pro, backend-architect, tdd-orchestrator, debugging-toolkit

#### 基础设施 (10)
- cicd-automation:deployment-engineer, cicd-automation:terraform-specialist, cloud-infrastructure:cloud-architect, kubernetes-operations:kubernetes-architect, incident-response:incident-responder, full-stack-orchestration:performance-engineer, observability-monitoring:observability-engineer, deployment-strategies:deployment-engineer, git-pr-workflows:code-reviewer

#### AI与数据 (7)
- llm-application-dev:ai-engineer, data-engineering:data-engineer, database-design:database-architect, ml-ops:mlops-engineer, machine-learning-ops:data-scientist

#### 测试 (5)
- unit-testing:test-automator, testing-automation-review:test-automator, performance-testing-review:performance-engineer, application-performance:performance-engineer, debugging-toolkit:debugger

#### 安全 (5)
- security-compliance:security-auditor, backend-api-security:backend-security-coder, comprehensive-review:security-auditor, security-scanning:security-auditor

#### 多语言 (9)
- python-development, javascript-typescript, golang-pro, rust-pro, c-pro, java-pro, scala-pro, clojure-pro, haskell-pro, elixir-pro

#### 文档 (3)
- code-documentation:docs-architect, documentation-generation:api-documenter, documentation-generation:tutorial-engineer

#### 代码质量 (5)
- code-review-ai:architect-review, code-refactoring:code-reviewer, comprehensive-review:code-reviewer

#### 业务 (7)
- business-analytics:business-analyst, payment-processing:payment-integration

#### 前端 (1)
- frontend-mobile-development:frontend-developer

---

## 2. MCP服务器

### 2.1 什么是MCP？

**MCP (Model Context Protocol)** 是Anthropic推出的开源通信标准

**作用**：让Claude Code能够：
- 📁 直接访问和操作本地文件系统
- 🌐 连接各种API和网络服务
- 🗄️ 查询和操作数据库
- 🛠️ 集成各种开发工具

---

### 2.2 MCP安装

#### 方法1：一键安装命令（推荐）

**示例：安装智谱视觉理解MCP**

```bash
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_api_key -- npx -y "@z_ai/mcp-server"
```

**参数说明**：
- `-s user`: 安装到用户级配置
- `--env`: 设置环境变量（API Key）
- `-- npx -y`: 使用npx自动安装

---

#### 方法2：手动配置

**步骤1：找到配置文件**

配置文件位置：`~/.claude/settings.json`

**步骤2：编辑配置文件**

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "zai-mcp-server": {
      "command": "npx",
      "args": ["-y", "@z_ai/mcp-server"],
      "env": {
        "Z_AI_API_KEY": "your_api_key"
      }
    }
  }
}
```

**步骤3：重启Claude Code**

完全退出并重新打开VSCode，等待10-20秒让MCP服务器启动

---

### 2.3 推荐MCP清单

#### 核心MCP（强烈推荐）

##### 1. web-reader
**功能**：网页读取、提取元数据

**安装**：
```bash
claude mcp add -s user -t http web-reader https://web-reader.xdai.dev
```

**使用场景**：
```
"读取 https://docs.example.com 的 API 文档"
"总结这个技术文章: [URL]"
```

---

##### 2. web-search-prime
**功能**：联网搜索、实时信息

**安装**：
```bash
claude mcp add -s user -t http web-search-prime https://web-search.xdai.dev
```

**使用场景**：
```
"搜索最新的 React 19 特性"
"查找 TypeScript 最佳实践"
```

---

##### 3. zai-mcp-server ⭐
**功能**：视觉理解（UI转代码、OCR、错误诊断）

**安装**：
```bash
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_api_key -- npx -y "@z_ai/mcp-server"
```

**主要工具**：
- `ui_to_artifact` - UI截图→代码
- `extract_text_from_screenshot` - OCR文字提取
- `diagnose_error_screenshot` - 错误诊断
- `understand_technical_diagram` - 图表解读

---

##### 4. playwright
**功能**：浏览器自动化、E2E测试

**安装**：
```bash
claude mcp add -s user playwright -- npx -y @playwright/mcp@latest
```

**主要工具**：
- `launch_browser` - 启动浏览器
- `navigate` - 导航到URL
- `click` / `fill` - 点击/填写表单
- `screenshot` - 截图

**注意**：首次使用会自动下载浏览器（约100-200MB，需2-5分钟）

---

### 2.4 进阶MCP

#### 5. @magicuidesign/mcp
UI组件库（彩虹按钮、滚动动画等）

**安装**：
```bash
claude mcp add -s user magicuidesign -- npx -y @magicuidesign/mcp
```

---

#### 6. sequential-thinking
结构化思考、系统设计

**安装**：
```bash
claude mcp add -s user sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
```

---

#### 7-9. firecrawl / apify / rube
- **firecrawl**: 深度网站爬取
- **apify**: 专业爬虫（Instagram、Google Maps）
- **rube**: 500+应用集成

---

### 2.5 MCP管理

#### 查看MCP列表
```bash
/mcp list
```

#### 禁用/启用MCP
```bash
# 禁用
claude mcp disable <server-name>

# 启用
claude mcp enable <server-name>
```

#### 删除MCP
```bash
claude mcp remove <服务器名称>
```

---

### 2.6 MCP市场

如果默认市场没有找到合适的工具：

**国外市场**：
- [Smithery](https://smithery.ai/servers)

**国内市场**：
- [MCP Market](https://mcpmarket.cn/)

---

## 3. 使用技巧

### 3.1 保持Claude聪明的5个技巧

#### 技巧1：多用子agent（调研任务）

**什么时候用**：
- 需要调研代码库
- 需要搜索资料
- 需要分析大量文件

**操作步骤**：
```
1. 开启新的Claude Code窗口（子agent）
2. 在新窗口中完成调研任务
3. 只将关键结论汇报给主窗口
4. 关闭子窗口
```

---

#### 技巧2：约束AI输出字数

**操作方法**：

在Prompt中加上字数限制：

```markdown
✅ 总结类任务："用100字以内总结"
✅ 分析类任务："用200字以内分析"
✅ 代码解释："关键点说明，不超过5行"
✅ 列举类任务："列出Top 5，每项不超过20字"
```

---

#### 技巧3：任务完成就开新窗口

**操作流程**：
```
任务A完成 → git commit → 新开窗口 → 任务B
```

**为什么这样做**：
- ✅ 每个任务上下文干净
- ✅ Claude保持聪明状态
- ✅ 代码已保存，安全
- ✅ 新窗口免费，无成本

---

#### 技巧4：多用 `esc` 回退

**什么时候用**：
- 完成一个主要阶段后
- 感觉Claude反应变慢时
- 准备开始新任务时

**操作**：
```
输入：esc
效果：Claude退出当前模式，上下文得到清理
```

**为什么比 `/compact` 好**：
- ✅ 不会丢失重要信息
- ✅ 不会改变对话语境
- ✅ 更安全可靠

---

#### 技巧5：识别变笨信号

**5个变笨信号**：
1. Claude反应明显变慢
2. 重复性错误增加
3. 遗忘之前的对话
4. 输出质量下降
5. 上下文超过15万token

**立即行动**：
```
步骤1：git commit 保存当前成果
步骤2：新开Claude Code窗口
步骤3：只告诉新窗口：
   - 当前任务目标
   - 关键文件路径
   - 剩余待解决问题
```

---

### 3.2 快速检查清单

使用Claude Code时，定期自查：

- [ ] 当前上下文长度是否超过15万token？
- [ ] Claude反应是否变慢？
- [ ] 是否在同一个窗口完成了多个任务？
- [ ] AI输出是否过于冗长？

**如果任一答案为YES**：
→ 考虑开新窗口或使用 `esc` 回退

---

### 3.3 常见问题处理

#### Q1：Claude开始变慢了怎么办？

**解决方案**（按优先级）：
```
1. 输入 esc 回退
2. 新开窗口
3. git commit + 新窗口
```

**避免**：
```
❌ 不要使用 /compact（可能丢失细节）
```

---

#### Q2：如何减少上下文消耗？

**3个方法**：
```
方法1：约束输出字数
        "用200字以内说明"

方法2：用子agent做调研
        调研结果精简后汇报

方法3：定期开新窗口
        任务完成就换新窗口
```

---

## 4. ZRead MCP配置

### 4.1 什么是ZRead MCP？

**ZRead MCP** 为 Claude Code 提供开源仓库的深度访问能力：

- 📚 **文档搜索** - 搜索 GitHub 仓库的文档、代码与注释
- 📁 **仓库结构** - 获取仓库目录结构和文件列表
- 💻 **代码读取** - 读取指定文件的完整代码内容

---

### 4.2 前置准备

#### 获取 API Key

1. 访问 [智谱开放平台](https://open.bigmodel.cn)
2. 登录并获取您的 **API Key**
3. 确保已开通 **GLM Coding Plan** 套餐

> ⚠️ **注意**: ZRead MCP 是 GLM Coding Plan 用户的专属功能

---

### 4.3 配置步骤

#### 方法1：一键安装命令（推荐）

```bash
claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"
```

**替换说明**: 将 `your_api_key` 替换为您在智谱开放平台获取的实际 API Key

---

#### 方法2：手动配置

**步骤1：找到配置文件**

**Cursor 配置文件位置**:
- Windows: `C:\Users\<用户名>\.cursor\mcp.json`
- macOS/Linux: `~/.cursor/mcp.json`

如果配置文件不存在，需要手动创建。

**步骤2：编辑配置文件**

```json
{
  "mcpServers": {
    "zread": {
      "type": "http",
      "url": "https://open.bigmodel.cn/api/mcp/zread/mcp",
      "headers": {
        "Authorization": "Bearer your_api_key"
      }
    }
  }
}
```

**步骤3：重启 IDE**

1. 完全退出 Cursor/VSCode
2. 重新打开
3. 等待 MCP 服务器连接（约 10-20 秒）

---

### 4.4 功能说明

ZRead MCP 提供三个核心工具：

#### 1. `search_doc` - 文档搜索
**功能**: 搜索 GitHub 仓库的知识文档、新闻、最近的 issue、PR 和贡献者

**使用场景**:
- 快速了解开源库的核心概念
- 查找常见问题和解决方案
- 了解项目最新动态

---

#### 2. `get_repo_structure` - 获取仓库结构
**功能**: 获取 GitHub 仓库的目录结构和文件列表

**使用场景**:
- 了解项目模块拆分
- 掌握目录组织方式
- 评估项目结构合理性

---

#### 3. `read_file` - 读取文件
**功能**: 读取 GitHub 仓库中指定文件的完整代码内容

**使用场景**:
- 深入分析实现细节
- 学习核心代码逻辑
- 进行二次开发

---

### 4.5 使用示例

#### 示例1：快速上手开源库
```
你: "帮我了解 fastapi 这个开源库，包括它的核心概念和安装方法"

AI 会：
1. 使用 search_doc 搜索 fastapi 的文档
2. 使用 get_repo_structure 获取仓库结构
3. 整理核心概念、安装步骤和代码组织方式
```

---

#### 示例2：排查 Issue
```
你: "我在使用 react-router 时遇到了路由问题，帮我查找是否有类似的问题和解决方案"

AI 会：
1. 使用 search_doc 搜索 react-router 的 issue
2. 查找相关的问题讨论和解决方案
3. 提供修复建议
```

---

#### 示例3：深入源码分析
```
你: "帮我分析 next.js 的路由实现，读取核心路由文件的代码"

AI 会：
1. 使用 get_repo_structure 找到路由相关文件
2. 使用 read_file 读取核心路由实现代码
3. 分析代码逻辑和设计模式
```

---

### 4.6 故障排除

#### 问题1：访问令牌无效

**错误信息**: "访问令牌无效" 或 "Invalid token"

**解决方案**:
1. ✅ 确认 API Key 是否正确复制（不要有多余空格）
2. ✅ 检查 API Key 是否已激活
3. ✅ 确认 API Key 是否有足够的余额
4. ✅ 检查 Authorization header 格式是否正确

---

#### 问题2：仓库访问失败

**错误信息**: "无法搜索或读取指定仓库内容"

**解决方案**:
1. ✅ 确认仓库是否存在且为**公开（开源）**仓库
2. ✅ 检查仓库名称格式是否正确：`owner/repo`
   - ✅ 正确: `vercel/next.js`
   - ❌ 错误: `vercel-next.js`
3. ✅ 访问 [zread.ai](https://zread.ai) 确认此仓库是否被收录支持

---

### 4.7 额度说明

ZRead MCP 的调用额度与其他 MCP 共享：

| 套餐 | 额度（每月） | 说明 |
|------|------------|------|
| **Lite** | 100 次 | 联网搜索 + 网页读取 + ZRead MCP 合计 |
| **Pro** | 1,000 次 | 联网搜索 + 网页读取 + ZRead MCP 合计 |
| **Max** | 4,000 次 | 联网搜索 + 网页读取 + ZRead MCP 合计 |

---

## 📊 总结对比

### 插件 vs MCP

| 维度 | 插件（Plugins） | MCP服务器 |
|------|---------------|-----------|
| **定位** | AI工作流和专业知识 | 外部工具和服务集成 |
| **自动调用** | ✅ AI自动选择 | ✅ AI自动调用 |
| **典型用途** | 代码审查、测试、文档生成 | 爬虫、视觉理解、浏览器自动化 |
| **数量** | 61+个插件 | 9个推荐MCP |
| **配置难度** | 简单（一条命令） | 中等（需要API Key或配置） |

### 使用建议

- **开发任务** → 优先使用插件（feature-dev、code-review-ai等）
- **需要外部信息** → 使用MCP（web-search、web-reader）
- **需要专业分析** → 使用插件（python-development、security-auditor）
- **需要自动化操作** → 使用MCP（playwright、firecrawl）
- **组合使用** → 插件 + MCP 协作完成复杂任务

---

## 🔗 相关资源

- [Claude Code 官方文档](https://code.claude.com/docs)
- [MCP 官方文档](https://modelcontextprotocol.io)
- [智谱开放平台](https://open.bigmodel.cn)

---

**最后更新**: 2025-12-31
**版本**: v1.0

**通过本文档，快速搭建完整的Claude Code开发环境！** 🚀
