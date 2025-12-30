# MCP 开发工具配置

> **从入门到精通** | 配置指南 | 故障排除

**更新时间**: 2025-12-25
**已安装 MCP 数量**: 9
**配置文件**: `C:\Users\georg\.claude\settings.json`

> 💡 **完整工作流**: [feature-dev-SOP.md](./feature-dev-SOP.md)
> 💡 **插件清单**: [开发插件指南.md](./开发插件指南.md) (61个插件)

---

## 📖 目录

1. [什么是MCP](#什么是mcp)
2. [如何接入MCP工具](#如何接入mcp工具)
3. [如何管理MCP](#如何管理mcp)
4. [9个MCP清单](#9个mcp清单)
5. [技术原理](#技术原理)
6. [使用建议](#使用建议)
7. [故障排除](#故障排除)

---

## 什么是MCP

### MCP (Model Context Protocol)

**定义**：Anthropic推出的开源通信标准

**作用**：让Claude Code能够：
- 📁 直接访问和操作本地文件系统
- 🌐 连接各种API和网络服务
- 🗄️ 查询和操作数据库
- 🛠️ 集成各种开发工具
- 🔧 自动化日常任务

**比喻**：MCP就像是给Claude Code装上了"外挂"，让它能够调用各种外部工具和服务

---

## 如何接入MCP工具

### 方法1：一键安装命令（推荐）

以智谱视觉理解MCP为例：

```bash
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_api_key -- npx -y "@z_ai/mcp-server"
```

**参数说明**：
- `-s user`: 安装到用户级配置
- `--env`: 设置环境变量（API Key）
- `-- npx -y`: 使用npx自动安装

---

### 方法2：手动配置

#### 步骤1：打开配置文件

**可视化插件**：Claude Code VSCode插件查看

**终端命令**：
```bash
/mcp list
```

#### 步骤2：验证安装

如果查看MCP工具发现没有，记得要**重启Claude**之后，重新验证

---

## 如何管理MCP

### 1. 禁用/启用MCP

#### 方法1：命令行快速操作

```bash
# 禁用MCP
claude mcp disable <server-name>

# 举例：禁用fetch
claude mcp disable fetch

# 启用MCP
claude mcp enable <server-name>
```

#### 方法2：命令行交互式操作

**步骤1**：查看MCP列表
```bash
/mcp
```

**步骤2**：通过键盘上下键选择MCP，点击Enter确认

**步骤3**：选择3（禁止/启用），Enter确认

---

### 2. 删除MCP

#### 方法1：命令行删除

```bash
claude mcp remove <服务器名称>

# 举例：删除fetch
claude mcp remove fetch
```

#### 方法2：利用CC Switch管理

CC Switch是一个可视化管理工具，可以图形化管理MCP服务

---

### 3. MCP市场

如果IDE默认的MCP服务市场没有找到合适的工具，可以去：

**国外MCP市场**：
- [Smithery](https://smithery.ai/servers)

**国内MCP市场**：
- [MCP Market](https://mcpmarket.cn/)

---

## 9个MCP清单

| # | MCP 名称 | 类型 | 功能 | 状态 |
|---|---------|------|------|------|
| 1 | **web-reader** | HTTP | 网页读取 | ✅ 运行中 |
| 2 | **web-search-prime** | HTTP | 联网搜索 | ✅ 运行中 |
| 3 | **zai-mcp-server** | stdio | 视觉理解 | ✅ 运行中 |
| 4 | **@magicuidesign/mcp** | stdio | UI 组件库 | ✅ 运行中 |
| 5 | **sequential-thinking** | stdio | 结构化思考 | ✅ 运行中 |
| 6 | **playwright** | stdio | 浏览器自动化 | ✅ 运行中 |
| 7 | **firecrawl** | stdio | 深度爬虫 | ✅ 运行中 |
| 8 | **apify** | stdio | 专业爬虫 | ✅ 运行中 |
| 9 | **rube** | stdio | 500+ 应用集成 | ✅ 运行中 |

---

## 📖 核心 MCP 说明

### 1. web-reader (网页读取)

**功能**: 抓取 URL 内容、提取元数据、获取链接列表

**使用示例**:
```
"读取 https://docs.example.com 的 API 文档"
"总结这个技术文章: [URL]"
```

---

### 2. web-search-prime (联网搜索)

**功能**: 实时搜索、查找技术方案、搜索代码示例

**使用示例**:
```
"搜索最新的 React 19 特性"
"查找 TypeScript 最佳实践"
"如何解决 npm install 权限问题"
```

---

### 3. zai-mcp-server (视觉理解)

**功能**: UI 转代码、OCR、错误诊断、图表解读

**主要工具**:
- `ui_to_artifact` - UI 截图 → 代码
- `extract_text_from_screenshot` - OCR 文字提取
- `diagnose_error_screenshot` - 错误诊断
- `understand_technical_diagram` - 图表解读

**使用示例**:
```
"分析这个 UI 截图并生成 React 代码"
"这个错误是什么意思？[截图]"
"解释这个架构图"
```

---

### 4. @magicuidesign/mcp (UI 组件库)

**功能**: 生成现代 UI 组件（动画、特效、布局）

**组件类型**:
- 布局: bento-grid, dock
- 动画: blur-fade, scroll-progress
- 按钮: rainbow-button, shimmer-button
- 特效: meteors, confetti

**使用示例**:
```
"创建一个彩虹按钮"
"添加滚动进度条动画"
```

---

### 5. sequential-thinking (结构化思考)

**功能**: 结构化分析、系统设计、分步解决问题

**使用示例**:
```
"用结构化思考分析这个架构设计"
"分步骤思考如何优化性能"
```

---

### 6. playwright (浏览器自动化)

**功能**: E2E 测试、UI 自动化、性能测试、数据采集

**主要工具**:
- `launch_browser` - 启动浏览器
- `navigate` - 导航到 URL
- `click` / `fill` - 点击/填写表单
- `screenshot` - 截图
- `close_browser` - 关闭浏览器

**使用示例**:
```
"打开 https://example.com"
"测试用户登录流程"
"监控页面加载性能"
```

**首次使用**: 自动下载浏览器（约 100-200MB，需 2-5 分钟）

---

### 7-9. firecrawl / apify / rube

**firecrawl**: 深度网站爬取
**apify**: 专业爬虫（Instagram、Google Maps）
**rube**: 500+ 应用集成（Notion、Google Sheets、GitHub）

---

## 🔄 MCP 与插件协作

### 系统架构

```
┌─────────────────────────────────────┐
│         Claude Code (GLM-4.7)        │
├─────────────────────────────────────┤
│  Plugins (61)        MCP Servers (9) │
│  - AI Agents (81)    - ZAI (视觉)    │
│  - Skills (47)       - Playwright    │
│  - Tools (44)        - Web Search    │
└─────────────────────────────────────┘
```

### 协作示例

**场景 1: 从设计到实现**
```
1. zai-mcp-server → 分析设计稿
2. @magicuidesign/mcp → 生成 UI 组件
3. javascript-typescript (Plugin) → 实现 React 组件
4. code-review-ai (Plugin) → 代码审查
5. playwright (MCP) → E2E 测试
```

**场景 2: 问题诊断**
```
1. sequential-thinking (MCP) → 结构化分析
2. observability-monitoring (Plugin) → 查看日志
3. zai-mcp-server (MCP) → 分析错误截图
4. application-performance (Plugin) → 性能优化
5. web-search-prime (MCP) → 搜索解决方案
```

---

## 技术原理

### MCP配置文件解析

无论是命令行操作，还是可视化操作，配置最终都保存在 **~/.claude.json** 文件里

### MCP服务器有三种类型

#### 1. 远程HTTP服务器
- 不需要装本地环境
- 使用云服务传输方式
- 适合：API服务、在线工具

#### 2. 远程SSE服务器
- 已废弃，改用HTTPS服务器
- 旧版本MCP使用
- 建议：升级到HTTP服务器

#### 3. 本地stdio服务器（最常用）

**以playwright/mcp工具为例**：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

**工作原理**：
1. Claude Code调用命令：`npx @playwright/mcp@latest`
2. npx自动下载并安装依赖包（包括Playwright）
3. 启动本地MCP服务器
4. Claude Code通过stdio与服务器通信

---

### 环境要求

大多数MCP工具需要以下环境之一：

#### Node.js环境
```bash
# 检查是否安装
node --version

# 安装Node.js
# 访问：https://nodejs.org/
```

**用途**：
- npx命令安装包
- 运行JavaScript/TypeScript的MCP服务器

#### Python环境
```bash
# 检查是否安装
python --version

# 或使用pip
pip --version

# 或使用uvx（推荐）
uvx --version
```

**用途**：
- pip安装Python包
- uvx运行Python工具
- 运行Python的MCP服务器

---

### 配置示例对比

#### HTTP服务器配置
```json
{
  "mcpServers": {
    "web-reader": {
      "url": "https://web-reader.xdai.dev"
    }
  }
}
```

#### stdio服务器配置
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
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

---

## 💡 使用建议

### 1. 自动选择（推荐）

```
✅ 你: "帮我开发一个 FastAPI 项目"
✅ AI: (自动调用 python-development + web-search + ...)
```

### 2. 何时使用 MCP

- **需要外部信息** → web-search, web-reader
- **需要专业分析** → Plugin (code-review, security)
- **需要自动化操作** → playwright
- **需要复杂编排** → Plugin (full-stack-orchestration)

### 3. 渐进式披露

**Skills 按需加载**，节省 Token：
```
你: "优化 Python 异步代码"
→ python-development 插件激活
→ async-python-patterns 技能自动加载
```

---

## 🔧 故障排除

### MCP 无法启动

**解决方案**:
1. 检查网络连接
2. 验证 API Key 有效
3. 查看 Node.js: `node --version`
4. 手动测试: `npx <package-name>`

---

### ❌ 只看到部分 MCP 或 MCP 连接失败

**症状**:
- 配置了 9 个 MCP，但 `/mcp` 命令只显示 1 个
- 部分 MCP 显示 "Failed to connect"
- stdio 类型的 MCP 无法加载

**诊断步骤**:

1. **检查 MCP 健康状态**:
```bash
claude mcp list
```

2. **测试单个 MCP**:
```bash
# 测试 zai-mcp-server 是否能正常运行
npx -y @z_ai/mcp-server --version
```

3. **检查 Node.js 环境**:
```bash
node --version
npx --version
```

**解决方案**:

**方案 1: 重启 Claude Code** ✅ 推荐
```bash
# 1. 完全退出 VSCode
# 2. 重新打开 VSCode
# 3. 等待 10-20 秒让 MCP 服务器启动
# 4. 运行 /mcp list 检查状态
```

**方案 2: 重新安装失败的 MCP**
```bash
# 删除失败的 MCP
claude mcp remove zai-mcp-server

# 重新安装
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_api_key -- npx -y "@z_ai/mcp-server"
```

**方案 3: 手动测试并修复配置**
```bash
# 1. 检查配置文件
cat ~/.claude/settings.json

# 2. 确认环境变量正确
# 3. 检查 stdio MCP 的 command 和 args

# 4. 测试 MCP 是否能启动
npx -y @z_ai/mcp-server
```

**常见原因**:
- ❌ VSCode 未重启，MCP 服务器未启动
- ❌ Node.js 未安装或不在 PATH 中
- ❌ 环境变量 (API Key) 未正确设置
- ❌ stdio MCP 启动超时（首次使用需要下载依赖）
- ❌ 网络问题导致 npx 无法下载包

---

### Playwright 首次卡顿

**原因**: 自动下载浏览器（100-200MB）

**解决**: 耐心等待 2-5 分钟

---

### API 配额耗尽

**解决**:
1. 检查智谱 AI 控制台配额
2. 升级套餐或等待重置
3. 优化调用频率

---

## 📚 相关资源

- [MCP 官方文档](https://modelcontextprotocol.io)
- [Claude Code MCP 指南](https://code.claude.com/docs/en/mcp)
- [Awesome MCP Servers](https://github.com/wong2/awesome-mcp-servers)

---

**最后更新**: 2025-12-25
**版本**: 2.1.0 (新增故障排除)
