# Claude Code 工具生态

> ** Skills + Plugins + MCP ** 完整指南

**目标**：换台电脑后，按照本文档操作即可搭建完整的Claude Code开发环境

---

## 📋 快速导航

本文档分为5个部分：

1. **[概念扫盲](#1-概念扫盲)** - 这三者是什么关系？
2. **[Claude Skills](#2-claude-skills)** - 工作手册，告诉AI怎么做事
3. **[Plugins插件](#3-plugins插件)** - 专业顾问，提供专业建议
4. **[MCP服务器](#4-mcp服务器)** - 外部工具，连接外部世界
5. **[使用技巧](#5-使用技巧)** - 保持AI高效状态

**深入阅读**：[Claude Skills完全指南](./Claude-Skills完全指南.md) - 82页白皮书

---

## 1. 概念扫盲

### 1.1 用打工人比喻

| 概念 | 比喻 | 作用 | AI如何使用 |
|------|------|------|-----------|
| **Skills** | 📘 工作手册 | 告诉AI"怎么做" | 自动加载相关手册 |
| **Plugins** | 🔌 专业顾问 | 提供专业建议 | 自动调用顾问 |
| **MCP** | 🧰 外部工具 | 连接外部世界 | 自动使用工具 |

---

### 1.2 一个实际例子

**场景：开发Python API**

AI会自动组合使用：

1. **读取Skills手册**
   - → 知道feature-dev开发流程
   - → 知道Python最佳实践

2. **调用Plugins顾问**
   - → python-development插件（Python专家）
   - → code-review-ai插件（审查专家）

3. **使用MCP工具**
   - → web-search（搜索文档）
   - → web-reader（读取网页）

**你不需要手动选择**，AI会自动判断需要什么！

---

### 1.2 三者的核心区别

#### Skills - 工作流程

**特点**：
- ✅ 告诉AI"怎么做"
- ✅ 包含具体步骤和标准
- ✅ 按需自动加载

**例子**：
```
Skills: "如何做代码审查"
→ AI知道：先看架构，再看安全，最后看性能
```

---

#### Plugins - 专业能力

**特点**：
- ✅ 提供专业领域的知识
- ✅ 包含Agent、Skills、Tools
- ✅ AI自动选择合适的Plugin

**例子**：
```
任务: "审查Python代码"
→ AI自动调用: python-development插件
→ 这个插件包含: Python最佳实践 + 性能优化技巧
```

---

#### MCP - 外部连接

**特点**：
- ✅ 连接外部工具和服务
- ✅ 访问网页、数据库、API
- ✅ AI自动调用MCP工具

**例子**：
```
任务: "搜索最新的Django文档"
→ AI自动使用: web-search MCP
→ 连接到搜索引擎 → 获取最新信息
```

---

### 1.4 Claude Code Transcripts 是什么？

**不是插件，不是MCP**，是一个**独立的命令行工具**！

**功能**：导出你和Claude Code的对话记录

**使用方法**：
```bash
# 列出所有会话
uvx claude-code-transcripts

# 生成GitHub Gist分享链接
uvx claude-code-transcripts --gist
```

**作用**：
- 生成精美的HTML报告
- 记录完整的思维链和代码变更
- 技术分享、年终总结

---

### 1.5 何时使用哪个？

| 任务类型 | 主要使用 | 辅助使用 |
|---------|---------|---------|
| **开发功能** | Plugins (feature-dev) | Skills (开发流程) |
| **学习新技术** | MCP (web-search, web-reader) | Plugins (语言专家) |
| **代码审查** | Plugins (code-review-ai) | Skills (审查标准) |
| **自动化测试** | MCP (playwright) | Plugins (测试专家) |
| **导出记录** | Transcripts (手动运行) | - |

---

## 2. Claude Skills

### 2.1 什么是Skills？

**Skills = 工作手册**

就像员工手册，写着：
- 这个任务的标准流程是什么？
- 需要注意哪些问题？
- 有哪些最佳实践？

**特点**：
- 📘 包含工作流程和标准
- 🔄 AI按需自动加载
- 📦 节省Token（只加载需要的部分）

---

### 2.2 Skills的类型

#### 1. 工作流程类
```
示例：feature-dev Skills
→ 告诉AI如何开发功能（7个步骤）
→ 1. 需求分析 → 2. 架构设计 → ... → 7. 发布
```

#### 2. 最佳实践类
```
示例：代码审查 Skills
→ 告诉AI审查时要看什么
→ 安全、性能、可维护性...
```

#### 3. 领域知识类
```
示例：Python异步编程 Skills
→ 告诉AI如何写好异步代码
→ asyncio、并发、性能优化...
```

---

### 2.3 如何使用Skills？

**你不需要手动管理！**

AI会自动：
1. 识别你的任务类型
2. 加载相关的Skills
3. 按照Skills的标准执行

**例子**：
```
你: "帮我审查这段Python代码"

AI自动：
1. 识别任务 → 代码审查
2. 加载Skills → 代码审查标准
3. 调用Plugin → python-development
4. 执行审查 → 按标准检查
```

---

### 2.4 推荐阅读

**完整指南**：[Claude Skills完全指南](./Claude-Skills完全指南.md) - 82页白皮书

**核心章节**：
- 第1章：核心概念（什么是Skills）
- 第3章：技术架构（三层加载机制）
- 第5章：如何创建和使用Skills
- 第6章：真实案例分析
- 第8章：使用场景与最佳实践

---

## 3. Plugins插件

### 3.1 什么是Plugins？

**Plugins = 专业顾问团队**

每个Plugin是一个专业领域的专家包，包含：
- 🤖 Sub Agents（独立的AI助手）
- 📘 Skills（专业知识）
- 🔧 Tools（专用工具）

**特点**：
- 🔌 即插即用，安装后AI自动调用
- 🎯 针对特定领域（Python、前端、安全...）
- 📦 打包了最佳实践和工具

---

### 3.2 插件安装

#### 步骤1：添加官方插件市场

```bash
claude plugin add https://github.com/anthropics/claude-plugins-official
```

或者通过VSCode界面：`Ctrl+Shift+P` → "Claude Code: Add Plugin Market"

#### 步骤2：查看并启用插件

```bash
# 查看可用插件
claude plugin list

# 启用插件
claude plugin enable feature-dev
```

---

### 3.3 推荐插件清单

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
**功能**：AI代码审查

**适合场景**：
- 代码质量检查
- 安全漏洞扫描
- 性能优化建议

---

##### 3. python-development / javascript-typescript
**功能**：语言开发支持

**适合场景**：
- Python或JavaScript/TypeScript开发
- 自动补全和语法检查
- 最佳实践建议

---

##### 4. claude-mem
**功能**：记忆外挂

**适合场景**：
- 长期项目
- 需要记住历史对话的项目

---

### 3.4 插件分类清单

#### 核心开发 (10)
feature-dev, code-review-ai, python-development, javascript-typescript, backend-architect, tdd-orchestrator, debugging-toolkit, rust-pro, golang-pro, c-pro

#### 基础设施 (10)
cicd-automation:deployment-engineer, cicd-automation:terraform-specialist, cloud-infrastructure:cloud-architect, kubernetes-operations:kubernetes-architect, full-stack-orchestration:performance-engineer, observability-monitoring:observability-engineer

#### AI与数据 (7)
llm-application-dev:ai-engineer, data-engineering:data-engineer, database-design:database-architect, ml-ops:mlops-engineer, machine-learning-ops:data-scientist

#### 测试 (5)
unit-testing:test-automator, testing-automation-review:test-automator, performance-testing-review:performance-engineer, application-performance:performance-engineer, debugging-toolkit:debugger

#### 安全 (5)
security-compliance:security-auditor, backend-api-security:backend-security-coder, comprehensive-review:security-auditor, security-scanning:security-auditor

#### 多语言 (9)
python-development, javascript-typescript, golang-pro, rust-pro, c-pro, java-pro, scala-pro, elixir-pro, haskell-pro

#### 文档 (3)
code-documentation:docs-architect, documentation-generation:api-documenter, documentation-generation:tutorial-engineer

#### 代码质量 (5)
code-review-ai:architect-review, code-refactoring:code-reviewer, comprehensive-review:code-reviewer

#### 业务 (7)
business-analytics:business-analyst, payment-processing:payment-integration

#### 前端 (1)
frontend-mobile-development:frontend-developer

---

### 3.5 第三方插件市场

如果官方市场没有找到合适的插件：

| 市场 | 链接 | 特点 |
|------|------|------|
| **Claude Plugins** | https://claude-plugins.dev | 第三方插件 |
| **Claude Marketplaces** | https://claudemarketplaces.com | 插件质量较高 |
| **Awesome Agents** | https://github.com/wshobson/agents | 243个插件，规模最大 |

---

## 4. MCP服务器

### 4.1 什么是MCP？

**MCP = 外部工具箱**

让AI能够：
- 📁 访问本地文件系统
- 🌐 连接网络服务和API
- 🗄️ 查询数据库
- 🛠️ 使用各种开发工具

**特点**：
- 🧰 连接外部工具和服务
- 🔌 标准化的通信协议
- 🤖 AI自动调用MCP工具

---

### 4.2 MCP安装

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

**配置文件位置**：`~/.claude/settings.json`

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

**重启Claude Code**让配置生效

---

### 4.3 推荐MCP清单

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

---

##### 3. zai-mcp-server ⭐
**功能**：视觉理解（UI转代码、OCR、错误诊断）

**主要工具**：
- `ui_to_artifact` - UI截图→代码
- `extract_text_from_screenshot` - OCR文字提取
- `diagnose_error_screenshot` - 错误诊断

---

##### 4. playwright
**功能**：浏览器自动化、E2E测试

**主要工具**：
- `launch_browser` - 启动浏览器
- `navigate` - 导航到URL
- `click` / `fill` - 点击/填写表单
- `screenshot` - 截图

**注意**：首次使用会自动下载浏览器（约100-200MB，需2-5分钟）

---

### 4.4 进阶MCP

#### 5. @magicuidesign/mcp
UI组件库（彩虹按钮、滚动动画等）

#### 6. sequential-thinking
结构化思考、系统设计

#### 7-9. firecrawl / apify / rube
- **firecrawl**: 深度网站爬取
- **apify**: 专业爬虫（Instagram、Google Maps）
- **rube**: 500+应用集成

---

### 4.5 MCP管理

#### 查看MCP列表
```bash
/mcp list
```

#### 禁用/启用MCP
```bash
claude mcp disable <server-name>
claude mcp enable <server-name>
```

#### 删除MCP
```bash
claude mcp remove <服务器名称>
```

---

### 4.6 MCP市场

**国外市场**：
- [Smithery](https://smithery.ai/servers)

**国内市场**：
- [MCP Market](https://mcpmarket.cn/)

---

## 5. 使用技巧

### 5.1 保持Claude聪明的5个技巧

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
```markdown
✅ 总结类任务："用100字以内总结"
✅ 分析类任务："用200字以内分析"
✅ 代码解释："关键点说明，不超过5行"
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
步骤3：只告诉新窗口关键信息
```

---

### 5.2 快速检查清单

使用Claude Code时，定期自查：

- [ ] 当前上下文长度是否超过15万token？
- [ ] Claude反应是否变慢？
- [ ] 是否在同一个窗口完成了多个任务？
- [ ] AI输出是否过于冗长？

**如果任一答案为YES**：
→ 考虑开新窗口或使用 `esc` 回退

---

### 5.3 常见问题处理

#### Q1：Claude开始变慢了怎么办？

**解决方案**（按优先级）：
```
1. 输入 esc 回退
2. 新开窗口
3. git commit + 新窗口
```

---

#### Q2：如何减少上下文消耗？

**3个方法**：
```
方法1：约束输出字数 → "用200字以内说明"
方法2：用子agent做调研 → 调研结果精简后汇报
方法3：定期开新窗口 → 任务完成就换新窗口
```

---

## 📊 总结对比

### Skills vs Plugins vs MCP

| 维度 | Skills | Plugins | MCP |
|------|--------|---------|-----|
| **比喻** | 工作手册 | 专业顾问 | 外部工具 |
| **作用** | 告诉AI怎么做 | 提供专业知识 | 连接外部世界 |
| **AI调用** | 自动加载 | 自动调用 | 自动使用 |
| **典型用途** | 工作流程、标准 | 语言专家、代码审查 | 爬虫、搜索、视觉 |
| **数量** | 按需加载 | 61+个插件 | 9个推荐MCP |
| **管理** | 无需管理 | 安装即可用 | 需要配置 |

---

### 使用建议

| 任务类型 | 首选 | 辅助 |
|---------|------|------|
| **开发功能** | Plugins (feature-dev) | Skills (流程) |
| **学习技术** | MCP (web-search) | Plugins (专家) |
| **代码审查** | Plugins (code-review) | Skills (标准) |
| **自动化测试** | MCP (playwright) | Plugins (测试) |
| **导出记录** | Transcripts (手动) | - |

---

## 🔗 相关资源

### 官方文档
- [Claude Code 官方文档](https://code.claude.com/docs)
- [MCP 官方文档](https://modelcontextprotocol.io)
- [智谱开放平台](https://open.bigmodel.cn)

### 知识库文档
- [Claude Skills完全指南](./Claude-Skills完全指南.md) - 82页白皮书（深入理解Skills）
- [ZRead MCP配置](./ZRead MCP配置.md) - GitHub开源项目深度访问工具
- [UI设计资源](./UI设计资源.md) - aura.build使用指南

---

**最后更新**: 2025-12-31
**版本**: v2.0

**现在你理解Skills、Plugins、MCP的关系了吗？** 🎯
