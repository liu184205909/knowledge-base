# MCP 开发工具配置

> **MCP安装与管理指南**

---

## 📋 目录

1. [如何安装MCP](#如何安装mcp)
2. [如何管理MCP](#如何管理mcp)
3. [推荐MCP清单](#推荐mcp清单)
4. [故障排除](#故障排除)

---

## 如何安装MCP

### 方法1：一键安装命令（推荐）

**示例：安装智谱视觉理解MCP**

```bash
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_api_key -- npx -y "@z_ai/mcp-server"
```

**参数说明**：
- `-s user`: 安装到用户级配置
- `--env`: 设置环境变量（API Key）
- `-- npx -y`: 使用npx自动安装

**其他安装示例**：

```bash
# Playwright（浏览器自动化）
claude mcp add -s user playwright -- npx -y @playwright/mcp@latest

# Sequential Thinking（结构化思考）
claude mcp add -s user sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking

# Web Reader（网页读取）
claude mcp add -s user -t http web-reader https://web-reader.xdai.dev
```

---

### 方法2：手动配置

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

## 如何管理MCP

### 1. 查看MCP列表

```bash
/mcp list
```

### 2. 禁用/启用MCP

```bash
# 禁用MCP
claude mcp disable <server-name>

# 启用MCP
claude mcp enable <server-name>
```

**示例**：
```bash
claude mcp disable fetch
claude mcp enable fetch
```

### 3. 删除MCP

```bash
claude mcp remove <服务器名称>
```

**示例**：
```bash
claude mcp remove fetch
```

---

## 推荐MCP清单

### 核心MCP（强烈推荐）

#### 1. web-reader
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

#### 2. web-search-prime
**功能**：联网搜索、实时信息

**安装**：
```bash
claude mcp add -s user -t http web-search-prime https://web-search.xdai.dev
```

**使用场景**：
```
"搜索最新的 React 19 特性"
"查找 TypeScript 最佳实践"
"如何解决 npm install 权限问题"
```

---

#### 3. zai-mcp-server ⭐
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

**使用场景**：
```
"分析这个UI截图并生成React代码"
"这个错误是什么意思？[截图]"
"解释这个架构图"
```

---

#### 4. playwright
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
- `close_browser` - 关闭浏览器

**使用场景**：
```
"打开 https://example.com 并截图"
"测试用户登录流程"
"监控页面加载性能"
```

**注意**：首次使用会自动下载浏览器（约100-200MB，需2-5分钟）

---

### 进阶MCP

#### 5. @magicuidesign/mcp
**功能**：生成现代UI组件

**安装**：
```bash
claude mcp add -s user magicuidesign -- npx -y @magicuidesign/mcp
```

**组件类型**：
- 布局：bento-grid, dock
- 动画：blur-fade, scroll-progress
- 按钮：rainbow-button, shimmer-button
- 特效：meteors, confetti

**使用场景**：
```
"创建一个彩虹按钮"
"添加滚动进度条动画"
```

---

#### 6. sequential-thinking
**功能**：结构化思考、系统设计

**安装**：
```bash
claude mcp add -s user sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
```

**使用场景**：
```
"用结构化思考分析这个架构设计"
"分步骤思考如何优化性能"
```

---

#### 7. firecrawl
**功能**：深度网站爬取

**安装**：
```bash
claude mcp add -s user firecrawl --env FIRECRAWL_API_KEY=your_key -- npx -y @firecrawl/firecrawl-mcp
```

**使用场景**：
```
"爬取整个网站的内容"
"提取网站所有产品信息"
```

---

#### 8. apify
**功能**：专业爬虫（Instagram、Google Maps等）

**安装**：
```bash
claude mcp add -s user apify -- npx -y apify-mcp
```

**使用场景**：
```
"抓取Instagram上的公开数据"
"获取Google Maps的商家信息"
```

---

#### 9. rube
**功能**：500+应用集成（Notion、Google Sheets、GitHub）

**安装**：
```bash
claude mcp add -s user rube --env RUBE_API_KEY=your_key -- npx -y rube-mcp
```

**使用场景**：
```
"将数据从GitHub同步到Notion"
"自动化Google Sheets的数据更新"
```

---

## MCP市场

如果默认市场没有找到合适的工具：

**国外市场**：
- [Smithery](https://smithery.ai/servers)

**国内市场**：
- [MCP Market](https://mcpmarket.cn/)

---

## 故障排除

### 问题1：MCP连接失败

**症状**：
- 配置了MCP，但 `/mcp` 只显示部分
- 部分MCP显示"Failed to connect"

**解决方案**：

**方法1：重启Claude Code** ✅ 推荐
```
1. 完全退出VSCode
2. 重新打开VSCode
3. 等待10-20秒
4. 运行 /mcp list 检查
```

**方法2：重新安装失败的MCP**
```bash
# 删除
claude mcp remove zai-mcp-server

# 重新安装
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_api_key -- npx -y "@z_ai/mcp-server"
```

**方法3：手动测试**
```bash
# 测试MCP是否能正常运行
npx -y @z_ai/mcp-server

# 检查Node.js环境
node --version
npx --version
```

---

### 问题2：Playwright首次卡顿

**原因**：自动下载浏览器（100-200MB）

**解决**：耐心等待2-5分钟

---

### 问题3：API Key无效

**检查清单**：
1. ✅ API Key是否正确复制（不要有多余空格）
2. ✅ API Key是否已激活
3. ✅ API Key是否有足够余额
4. ✅ 环境变量格式是否正确：`"Z_AI_API_KEY": "your_key"`

---

### 问题4：Node.js未安装

**检查**：
```bash
node --version
```

**安装**：访问 https://nodejs.org/

---

## 🔗 相关文档

- [MCP服务器配置.md](./MCP服务器配置.md) - ZRead MCP配置指南
- [Claude Code使用技巧.md](./Claude Code使用技巧.md) - 保持AI高效状态
- [Claude Code插件清单](./Claude Code插件系统.md) - 推荐插件

---

**最后更新**: 2025-12-31
**版本**: v3.0

**通过MCP扩展Claude Code的能力边界！** 🚀
