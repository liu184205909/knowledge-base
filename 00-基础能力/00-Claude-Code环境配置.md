# Claude Code 环境配置

> **AI完整安装指南** | 最后更新: 2026-02-02

---

## 安装清单

- ✅ Claude Code主程序
- ✅ **全局CLAUDE.md配置** ⭐ **第一步必须配置**
- ✅ 6个核心MCP(网页读取、搜索、浏览器、视觉、GitHub、YouTube)
- 80+插件集合（可选）

> **重要**: CLAUDE.md配置是环境配置的基础，建议在安装完Claude Code主程序后**立即配置**，确保AI行为符合你的预期。

---

## 1. 配置全局CLAUDE.md ⭐ **必须配置**

**配置文件路径**: `~/.claude/CLAUDE.md`

**配置优先级**: 项目级 `.claude/CLAUDE.md` > 全局级 `~/.claude/CLAUDE.md` > 默认行为

### 配置模板

**复制以下内容到 `~/.claude/CLAUDE.md`**:

```markdown
# Claude Code 全局配置

## 核心目标
- **可控**: 所有操作需用户确认，不主动执行危险操作
- **准确**: 理解需求后再执行，避免假设和猜测
- **高效**: 选择合适的工具和流程，快速完成任务

## 交流规范
- **主要语言**: 中文(简体)，代码注释用中文
- **回答风格**: 简洁直接，避免冗长废话
- **交互原则**: 不确定时主动询问，复杂任务先展示计划

## 工作方式
- **流程**: 需求确认 → 方案设计 → 执行操作 → 完成反馈
- **代码**: 读取优先，编辑优先（用Edit避免Write重写），关键逻辑添加中文注释
- **工具**: Glob/Grep搜索，Read/Edit/Write操作

## 苏格拉底式需求梳理
**自动触发**: 用户说"开发"、"实现"、"做一个"，任务超过3个步骤
**不触发**: 简单操作、明确指定任务、用户说"直接开始"
```

---

## 2. 安装6个核心MCP

### 2.1 网页读取
```bash
claude mcp add -s user -t http web-reader https://web-reader.xdai.dev
```

### 2.2 联网搜索
```bash
claude mcp add -s user -t http web-search-prime https://web-search.xdai.dev
```

### 2.3 浏览器自动化

**方案对比**：

| 方案 | Token节省 | 适用场景 | 环境支持 |
|------|----------|---------|---------|
| **Agent Browser** | 93% ↓ | 日常浏览、快速操作 | 仅CLI |
| **Playwright MCP** | 基准 | 测试、复杂流程 | CLI+VSCode |
| **DevTools MCP** | 基准 | 调试、性能分析 | 仅CLI |

**快速选择**：
- 日常浏览 → Agent Browser
- 调试分析 → DevTools MCP
- 复杂流程/VSCode → Playwright MCP

---

**方式1: Playwright MCP（推荐）**
```bash
claude mcp add -s user playwright -- npx -y "@playwright/mcp@latest"
```

**优势**: 跨环境支持（CLI + VSCode），Windows兼容性好，稳定成熟

**反检测配置**（触发验证码时）：
```javascript
Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
```

---

**方式2: agent-browser（仅CLI）**

⚠️ **Windows兼容性问题**（2026-01-26测试）：Chromium下载停滞，暂不可用

**核心优势**（网络良好环境）: Token节省93%，Refs系统稳定，毫秒级响应

**GitHub**: [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser)

---

**方式3: browser-use **



### 2.4 视觉理解（需替换API Key）
```bash
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_key -- npx -y "@z_ai/mcp-server"
```

### 2.5 GitHub深度访问（需替换API Key）
```bash
claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"
```

### 2.6 官方插件仓库（可选）

Anthropic 官方维护的插件目录（7.2k stars），包含高质量插件：

```bash
# 添加官方插件仓库
/plugin marketplace add anthropics/claude-plugins-official
/plugin install <plugin-name>@claude-plugins-official
```

**热门官方插件**：
- `ralph-loop` - AI自我迭代开发（已在技巧3介绍）
- `code-review` - 代码审查
- `feature-dev` - 功能开发工作流
- `pr-review-toolkit` - PR审查工具包
- `security-guidance` - 安全指导
- `frontend-design` - 前端设计

> 💡 **提示**：大多数情况下内置Subagents已够用，按需安装插件即可。完整列表：https://github.com/anthropics/claude-plugins-official

---

## 3. 安装80+插件集合（可选）

```bash
claude plugin marketplace add https://github.com/wshobson/agents
```

---

## 4. 验证安装

```bash
# 查看MCP
claude mcp list

# 查看Plugins
claude plugin list
```

预期结果: 所有MCP显示为 ✓ Connected

---

## 高级工作流最佳实践

### 技巧1：极致的并行操作 ⭐⭐⭐⭐⭐

**同时启动3-5个git worktrees，每个worktree运行独立的Claude会话**

```bash
# 创建多个worktrees
git worktree add ../project-a feature-a
git worktree add ../project-b feature-b
git worktree add ../project-c feature-c

# 设置shell别名快速切换
alias za="cd ../project-a"
alias zb="cd ../project-b"
alias zc="cd ../project-c"
```

**用途**: 不同任务间秒切、专用分析worktree、并行处理多个功能

---

### 技巧2：优先进入plan模式 ⭐⭐⭐⭐⭐

**处理复杂任务时**：先在计划阶段倾注精力，争取让Claude一键完成实现

**执行受阻时**：立即切回plan模式重排计划

**双Claude协作**：Claude 1写计划，Claude 2像主任工程师一样审阅
---

### 技巧3：Ralph Loop - AI自我迭代开发 ⭐⭐⭐

**功能**：让AI反复尝试直到完成任务，适合明确的开发任务

**安装**：
```bash
claude plugin install ralph-loop@claude-plugins-official
```

**基本用法**：
```bash
/ralph-loop "实现所有故事" --max-iterations 100
```

**后台运行**（推荐使用tmux）：
```bash
tmux new -s ralph
/ralph-loop "任务描述" --max-iterations 100
# Ctrl+B D 分离会话
tmux attach -t ralph  # 重连查看进度
```

**GUI工具**：Ralph Desktop（可视化界面，免配置）
- 下载：https://github.com/liuxiaopai-ai/ralph-desktop/releases/latest

---

## 相关文档

- [03-Skills完整指南](./03-Skills/README.md) - Skills完整指南(开发、推荐、分享)
- [01-RLM递归思想.md](./01-RLM递归思想.md) - RLM方法论
- [02-去除AI编程UI味儿的实战方法.md](./02-去除AI编程UI味儿的实战方法.md) - 实战方法
- [05-Claude-Code第三方API配置.md](./05-Claude-Code第三方API配置.md) - 第三方API接入
