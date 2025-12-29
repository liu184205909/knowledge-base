# ZRead MCP（开源仓库 MCP）配置指南

> **ZRead MCP Server** - 基于模型上下文协议的开源仓库内容获取能力

**更新时间**: 2025-01-27  
**文档来源**: [智谱AI开放文档](https://docs.bigmodel.cn/cn/coding-plan/mcp/zread-mcp-server)

---

## 📖 目录

1. [功能简介](#功能简介)
2. [前置准备](#前置准备)
3. [配置步骤](#配置步骤)
4. [功能说明](#功能说明)
5. [使用示例](#使用示例)
6. [故障排除](#故障排除)
7. [额度说明](#额度说明)

---

## 功能简介

**ZRead MCP** 为 Code Agent 提供开源仓库的深度访问能力：

- 📚 **文档搜索** - 搜索 GitHub 仓库的文档、代码与注释
- 📁 **仓库结构** - 获取仓库目录结构和文件列表
- 💻 **代码读取** - 读取指定文件的完整代码内容

---

## 前置准备

### 1. 获取 API Key

1. 访问 [智谱开放平台](https://open.bigmodel.cn)
2. 登录并获取您的 **API Key**
3. 确保已开通 **GLM Coding Plan** 套餐

> ⚠️ **注意**: ZRead MCP 是 GLM Coding Plan 用户的专属功能

---

## 配置步骤

### 方法1：一键安装命令（推荐）

```bash
claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"
```

**替换说明**: 将 `your_api_key` 替换为您在智谱开放平台获取的实际 API Key

---

### 方法2：手动配置

#### 步骤1：找到配置文件

**Cursor 配置文件位置**:
- Windows: `C:\Users\<用户名>\.cursor\mcp.json` 或 `~/.cursor/mcp.json`
- macOS/Linux: `~/.cursor/mcp.json`

如果配置文件不存在，需要手动创建。

#### 步骤2：编辑配置文件

打开配置文件，添加以下内容：

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

**替换说明**: 将 `your_api_key` 替换为您的实际 API Key

#### 步骤3：重启 Cursor

1. 完全退出 Cursor
2. 重新打开 Cursor
3. 等待 MCP 服务器连接（约 10-20 秒）

---

### 方法3：与其他 MCP 共存配置

如果已有其他 MCP 配置，在现有配置中添加：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
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

---

## 功能说明

ZRead MCP 提供三个核心工具：

### 1. `search_doc` - 文档搜索

**功能**: 搜索 GitHub 仓库的知识文档、新闻、最近的 issue、PR 和贡献者

**使用场景**:
- 快速了解开源库的核心概念
- 查找常见问题和解决方案
- 了解项目最新动态

---

### 2. `get_repo_structure` - 获取仓库结构

**功能**: 获取 GitHub 仓库的目录结构和文件列表

**使用场景**:
- 了解项目模块拆分
- 掌握目录组织方式
- 评估项目结构合理性

---

### 3. `read_file` - 读取文件

**功能**: 读取 GitHub 仓库中指定文件的完整代码内容

**使用场景**:
- 深入分析实现细节
- 学习核心代码逻辑
- 进行二次开发

---

## 使用示例

### 示例1：快速上手开源库

```
你: "帮我了解 fastapi 这个开源库，包括它的核心概念和安装方法"

AI 会：
1. 使用 search_doc 搜索 fastapi 的文档
2. 使用 get_repo_structure 获取仓库结构
3. 整理核心概念、安装步骤和代码组织方式
```

---

### 示例2：排查 Issue

```
你: "我在使用 react-router 时遇到了路由问题，帮我查找是否有类似的问题和解决方案"

AI 会：
1. 使用 search_doc 搜索 react-router 的 issue
2. 查找相关的问题讨论和解决方案
3. 提供修复建议
```

---

### 示例3：深入源码分析

```
你: "帮我分析 next.js 的路由实现，读取核心路由文件的代码"

AI 会：
1. 使用 get_repo_structure 找到路由相关文件
2. 使用 read_file 读取核心路由实现代码
3. 分析代码逻辑和设计模式
```

---

### 示例4：依赖库调研

```
你: "我想引入 axios 作为 HTTP 客户端，帮我评估一下这个库的质量和维护情况"

AI 会：
1. 使用 search_doc 查看项目活跃度和最近更新
2. 使用 get_repo_structure 分析代码组织
3. 使用 read_file 查看核心实现
4. 提供评估报告
```

---

## 故障排除

### 问题1：访问令牌无效

**错误信息**: "访问令牌无效" 或 "Invalid token"

**解决方案**:
1. ✅ 确认 API Key 是否正确复制（不要有多余空格）
2. ✅ 检查 API Key 是否已激活
3. ✅ 确认 API Key 是否有足够的余额
4. ✅ 检查 Authorization header 格式是否正确：
   ```json
   "Authorization": "Bearer your_api_key"
   ```
   注意：Bearer 后面有一个空格

---

### 问题2：连接超时

**错误信息**: "Connection timeout" 或 "无法连接 MCP 服务器"

**解决方案**:
1. ✅ 检查网络连接是否正常
2. ✅ 确认防火墙设置未阻止访问
3. ✅ 验证服务器 URL 是否正确：
   ```
   https://open.bigmodel.cn/api/mcp/zread/mcp
   ```
4. ✅ 尝试在浏览器访问上述 URL（需要认证，可能返回错误，但能验证网络连接）

---

### 问题3：仓库访问失败

**错误信息**: "无法搜索或读取指定仓库内容"

**解决方案**:
1. ✅ 确认仓库是否存在且为**公开（开源）**仓库
2. ✅ 检查仓库名称格式是否正确：`owner/repo`
   - ✅ 正确: `vercel/next.js`
   - ❌ 错误: `vercel-next.js` 或 `https://github.com/vercel/next.js`
3. ✅ 访问 [zread.ai](https://zread.ai) 确认此仓库是否被收录支持

---

### 问题4：MCP 未显示在工具列表中

**症状**: 配置后重启 Cursor，但在 `/mcp list` 中看不到 zread

**解决方案**:
1. ✅ **完全重启 Cursor**（不是重新加载窗口）
2. ✅ 等待 10-20 秒让 MCP 服务器启动
3. ✅ 检查配置文件格式是否正确（JSON 语法）
4. ✅ 验证配置文件路径是否正确
5. ✅ 查看 Cursor 日志中是否有错误信息

---

### 问题5：配置文件位置不确定

**解决方案**:

1. **查找配置文件**:
   ```bash
   # Windows PowerShell
   Get-ChildItem -Path $env:USERPROFILE -Filter "*.json" -Recurse -Depth 2 | Where-Object { $_.FullName -like "*cursor*" -or $_.FullName -like "*mcp*" }
   
   # macOS/Linux
   find ~ -name "*.json" -path "*cursor*" -o -name "*mcp*" 2>/dev/null
   ```

2. **查看 Cursor 设置**:
   - 打开 Cursor
   - 查看 Settings → MCP 相关配置
   - 或查看帮助文档中关于配置文件位置的说明

---

## 额度说明

### 套餐额度

ZRead MCP 的调用额度与其他 MCP 共享：

| 套餐 | 额度（每月） | 说明 |
|------|------------|------|
| **Lite** | 100 次 | 联网搜索 + 网页读取 + ZRead MCP 合计 |
| **Pro** | 1,000 次 | 联网搜索 + 网页读取 + ZRead MCP 合计 |
| **Max** | 4,000 次 | 联网搜索 + 网页读取 + ZRead MCP 合计 |

### 视觉理解 MCP

视觉理解 MCP 使用单独的额度：
- 共享套餐的 **5 小时最大 prompt 资源池**
- 达到上限后会在 **5 小时周期后恢复额度**

---

## 📚 相关资源

- [智谱AI开放文档 - ZRead MCP](https://docs.bigmodel.cn/cn/coding-plan/mcp/zread-mcp-server)
- [模型上下文协议 (MCP) 官方文档](https://modelcontextprotocol.io)
- [智谱开放平台](https://open.bigmodel.cn)
- [zread.ai](https://zread.ai) - 查看支持的开源仓库

---

## 💡 使用技巧

1. **精确指定仓库**: 使用 `owner/repo` 格式，避免 URL 格式
2. **先搜索再读取**: 先用 `search_doc` 了解概览，再用 `read_file` 深入细节
3. **查看仓库结构**: 在阅读代码前，先用 `get_repo_structure` 了解项目布局
4. **组合使用**: 结合其他 MCP（如 web-search）获取更全面的信息

---

**配置完成后，您就可以让 AI 助手深入理解任何开源项目了！** 🚀

