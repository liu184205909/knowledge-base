# Claude Code 环境配置

> **AI完整安装指南** | 最后更新: 2026-02-02

---

## 安装清单

- ✅ Claude Code主程序
- ✅ **全局CLAUDE.md配置** ⭐ **第一步必须配置**
- 4个核心Plugins (代码简化、自动迭代、Dev Browser、Superpowers)
- 6个核心MCP(网页读取、搜索、浏览器、视觉、GitHub、YouTube)
- 80+插件集合

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

## 2. 安装4个核心Plugins

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

### 2.4 Superpowers - AI编程工作流系统 ⭐

让AI编程助手像高级工程师一样工作（TDD驱动、系统性调试、证据胜过声明）

**安装**:
```bash
claude plugin marketplace add obra/superpowers-marketplace
claude plugin install superpowers@superpowers-marketplace
```

**主要命令**:
- `/superpowers:brainstorm` - 交互式设计优化
- `/superpowers:write-plan` - 创建实施计划
- `/superpowers:execute-plan` - 批量执行计划

**详细指南**: [05-Superpowers-AI编程工作流系统.md](./05-Superpowers-AI编程工作流系统.md)

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

**方式3: Dev Browser Plugin（仅CLI）**

⚠️ **Windows兼容性问题**（2026-01-26测试）：`lsof`命令不存在，暂不可用

待版本稳定后再测试

### 3.4 视觉理解（需替换API Key）
```bash
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_key -- npx -y "@z_ai/mcp-server"
```

### 3.5 GitHub深度访问（需替换API Key）
```bash
claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"
```

### 3.6 YouTube字幕提取
```bash
claude mcp add -s user youtube-transcript -- npx -y @sinco-lab/mcp-youtube-transcript
```

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

### 技巧3：持续打磨CLAUDE.md ⭐⭐⭐⭐⭐

**每次修正错误后**：对Claude说"更新你的CLAUDE.md，避免再犯"

**进阶技巧**：让Claude为每个项目维护笔记目录，项目级别的规则管理

---

### 技巧4：善用自动化Bug修复 ⭐⭐⭐⭐

**场景**：遇到测试失败或错误时，直接把错误信息抛给Claude，让它分析并修复

```bash
# 直接粘贴错误信息
Test failed: Expected 200 but got 500
Error: Cannot read property 'id' of undefined
```

---

### 技巧5：充分利用终端环境 ⭐⭐⭐⭐

**核心价值**：Claude Code是"有终端的AI"，比Web版强大得多

**优势**：可以直接读写文件、运行命令和脚本、访问数据库、调试代码

---

### 技巧6：使用专业Subagents ⭐⭐⭐⭐⭐

**核心思想**：遇到专业任务时，使用专门优化的AI agents

**可用专业agents**：code-reviewer、debugger、test-automator、backend-architect、frontend-developer、security-auditor

**使用方法**：Claude会自动识别任务类型并调用专业agent

---

### 技巧7：数据驱动的决策 ⭐⭐⭐

**场景**：需要基于数据做决策时，让Claude分析数据，提供决策建议

```bash
> "分析过去30天的用户留存数据，找出流失原因"
```

---

### 技巧8：利用MCP扩展能力 ⭐⭐⭐⭐

**核心MCP**：playwright（浏览器自动化）、web-reader（网页读取）、web-search（联网搜索）、zread（GitHub深度访问）、youtube-transcript（YouTube字幕提取）

---

### 技巧9：Ralph Loop - AI自我迭代开发 ⭐⭐⭐

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
