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

**方式1: Playwright MCP（传统方式）**
```bash
claude mcp add -s user playwright -- npx -y "@playwright/mcp@latest"
```

**方式2: agent-browser（推荐，Token节省93%）⭐**

```bash
npm install -g agent-browser
agent-browser install  # 下载Chromium
```

**工作模式**:
1. `agent-browser open <url>` - 打开网页
2. `agent-browser snapshot -i` - 获取页面快照（Refs系统）
3. `agent-browser click @e2` - 点击元素（用@e#引用）
4. `agent-browser fill @e3 "text"` - 填写表单

**配套Skills**: https://link.bytenote.net/note （自然语言操作浏览器，无需编程）

**核心优势**:
- Token节省93%（vs Playwright MCP）
- Refs系统：e1、e2、e3抽象引用，网页改版不影响
- 毫秒级响应（Rust CLI + Node守护进程）
- 多会话隔离（同时登录多账号）

**对比**:
| 维度 | Playwright MCP | agent-browser |
|------|--------------|---------------|
| Token效率 | 低（整个DOM树） | 高（节省93%） |
| 响应速度 | 慢（秒级） | 快（毫秒级） |
| 配置复杂度 | 高（JSON/TOML） | 低（一条命令） |
| 网页改版 | 容易崩溃 | 不影响（Refs抽象） |
| 多会话 | 困难 | 原生支持 |

**应用场景**: 小红书/微信公众号自动发布、网页数据抓取、SEO检查、跨境电商运营

**相关文章**: https://mp.weixin.qq.com/s/vNVSHfjKchDDniWGNdlxjg

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
| MCP | 6个（浏览器自动化有2种方案可选） |
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

## Claude Code v2.1新功能亮点

### 核心新特性(2026-01更新)

**语言设置**: `/config` 配置语言,无需每次说"用中文"

**Skills热重载**: 修改`~/.claude/skills`或`.claude/skills`后保存即生效

**Fork子代理**: Skill可在独立上下文运行,不污染主对话

**/plan命令**: 任意位置输入`/plan`触发计划模式

**会话传送**: `/teleport` 传送到云端,本地和Web无缝切换

**通配符权限**: 支持`*`通配符,减少权限确认疲劳

**Ctrl+O**: 实时显示AI思考过程,及时干预

**MCP动态更新**: MCP服务器可动态更新工具,无需重连

**性能优化**: 启动更快,终端渲染bug修复,内存泄漏修复

---

## 上下文管理最佳实践

### 问题: AI越用越笨?

**症状**:
- 改Bug越改越多
- 写到一半AI开始乱来,忘记之前的方案
- 上下文快满要压缩

**根本原因**: 上下文管理没做好

**Claude Code限制**: 20万token上下文,系统提示占3万

### 实战技巧

#### 1. 出Bug先ESC回退
```bash
# ❌ 错误做法
遇到报错 → 发错误信息给AI → 上下文更长 → AI越改越乱

# ✅ 正确做法
遇到报错 → 双击ESC回退到修改前 → 补充说明"刚才xxx方案有问题" → 重新来
```

#### 2. 上下文快满开新窗口
```bash
# ❌ /compact压缩
# AI记得不全,还要重读代码和文档

# ✅ 直接新开窗口
# 干干净净重新来,比压缩更高效
```

#### 3. 约束AI输出字数

在`CLAUDE.md`中添加:
```markdown
极简篇幅、最小必要语言、非必要不输出
```

**效果**: 代码更简洁,回复更短,上下文消耗直线下降

#### 4. 一次性任务用命令行

```bash
# ❌ 创建临时文件
test.py → 执行 → 删除 (3次上下文消耗)

# ✅ 直接命令行执行
python3 -c "print('test')" (1次上下文消耗)
```

在`CLAUDE.md`中配置:
```markdown
处理一次性任务时,优先用命令行直接执行(如python3 -c),不创建临时文件
```

#### 5. 不同任务用不同配置

**问题**: 写代码要求"极简",写文章时这个约束太干巴

**解决**:
- `CLAUDE.md`: 只写通用规则
- 创建不同Skill: `/code`(编程), `/write`(写作)
- 避免互相干扰

---

## 相关文档

- [05-Skills完整指南.md](./05-Skills完整指南.md) - Skills完整指南(开发、推荐、分享)
- [02-Agent开发与系统搭建.md](./02-Agent开发与系统搭建.md) - Agent开发与个人系统
- [03-RLM递归思想.md](./03-RLM递归思想.md) - RLM方法论
