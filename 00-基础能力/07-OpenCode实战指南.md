# OpenCode 实战指南

**最后更新**: 2026-01-07
**定位**: OpenCode + oh-my-opencode 开源 AI 编程工具完整指南

---

## 🎯 核心价值

> **Claude Code 的最强开源对手，GitHub 50.2K+ Stars，完全免费的 AI 编程神器**

OpenCode 是一个完全开源、免费的 AI 编程助手，配合 oh-my-opencode 插件后，能力媲美甚至超越 Claude Code。

### 为什么选择 OpenCode？

| 特性 | Claude Code | OpenCode + oh-my-opencode |
|------|-------------|---------------------------|
| **开源** | ❌ 闭源 | ✅ 完全开源 |
| **费用** | $20/月 | ✅ 完全免费 |
| **模型支持** | 主要自家模型 | ✅ 75+ 家供应商 |
| **免费模型** | ❌ 无 | ✅ GLM-4.7、MiniMax M2.1 |
| **MCP/Skills** | ✅ 原生支持 | ✅ 通过插件支持 |
| **网络稳定性** | 国内可能受限 | ✅ 配合国产模型更稳定 |

---

## 📋 目录

1. [快速开始](#1-快速开始)
2. [oh-my-opencode 插件](#2-oh-my-opencode-插件)
3. [核心功能](#3-核心功能)
4. [与 Claude Code 对比](#4-与-claude-code-对比)
5. [使用建议](#5-使用建议)
6. [Sources](#6-sources)

---

## 1. 快速开始

### 1.1 系统要求

- **操作系统**: Windows / macOS / Linux
- **Node.js**: v16+
- **Bun**: 安装插件时需要

### 1.2 安装 OpenCode

```bash
# 方式 1: npm 安装（推荐）
npm install -g opencode-ai

# 方式 2: 官方脚本
curl -fsSL https://opencode.ai/install | bash

# 方式 3: 桌面版
# 下载: https://opencode.ai/download
```

### 1.3 安装 oh-my-opencode

**前置：安装 Bun**

```bash
# Windows (PowerShell 管理员)
powershell -c "irm bun.sh/install.ps1 | iex"

# macOS/Linux
curl -fsSL https://bun.sh/install | bash
```

**安装插件**

```bash
npx oh-my-opencode install
```

安装时会询问你的订阅情况（Claude/ChatGPT/Gemini），按需选择。

### 1.4 启动使用

```bash
# 进入项目目录
cd your-project

# 启动 OpenCode
opencode

# 初始化项目
在 TUI 界面输入: /init
```

---

## 2. oh-my-opencode 插件

> **让 OpenCode 超进化的核心插件** | GitHub 9.2K+ Stars
> 作者烧掉 $24,000 Token 打磨架构

### 2.1 多 Agent 协作系统

**内置专业 Agent**:

- **Oracle**: 架构审查、代码设计把关
- **Librarian**: 文档检索、快速查找资料
- **Frontend Engineer**: 前端专项、UI/UX 设计
- **Search Agent**: 资料搜索、查阅文档
- **Plan Agent**: 任务规划、路径思考

**工作原理**: Agent 在后台并行工作，主 Agent 只接收结果，上下文精简，效率拉满。

### 2.2 关键词触发模式

| 模式 | 关键词 | 效果 |
|------|--------|------|
| **Ultrawork Mode** | `ultrawork` / `ulw` | 火力全开，多 Agent 并行攻克难题 |
| **Think Mode** | `think deeply` / `ultrathink` | 强制 AI 进行长思维链推理 |
| **Librarian Mode** | `search` / `find` | 在文档和代码库中精准检索 |
| **Analyze Mode** | `analyze` / `investigate` | 多阶段专家会诊，深度分析 |

---

## 3. 核心功能

### 3.1 模型支持

**75+ 供应商**，包括：
- OpenAI: GPT-4、GPT-5.2-Codex
- Anthropic: Claude 3.5、Claude Opus 4.5
- Google: Gemini 2.0/3 Pro/3 Flash
- 国产模型: GLM-4.7、MiniMax M2.1（免费）
- 开源模型: Llama 3、Mistral、Qwen
- 本地模型: Ollama、LM Studio

### 3.2 AST 感知代码操作

**传统问题**: AI 只看文本，重构变量名时会误伤字符串中的同名文本

**OpenCode 方案**: 基于 AST（抽象语法树）重构，精准识别代码结构

```javascript
// 传统方式: 字符串也会被改 ❌
const foo = "foo";

// AST 方式: 只改变量名，字符串保持不变 ✅
const foo = "foo";
```

### 3.3 上下文焦虑管理

**问题**: AI 记忆（Context）满了会"失忆"

**解决方案**:
- 上下文达到 **70%** 或 **85%** 时自动压缩
- 整理陈旧对话，腾出空间给新任务
- 保证 AI 不会变笨，防止中断

### 3.4 防代码截断

**痛点**: AI 写长代码写到一半突然停，出现 `// ...rest of code`

**解决方案**: 强制检查 TODO 和省略号，逼着 AI 把代码写完，绝不让烂尾。

### 3.5 LSP 深度集成

像 IDE 一样清晰看到代码结构：
- 函数定义在哪里
- 谁引用了这个变量
- 这个类继承自谁

不是瞎猜，是精准理解代码骨架。

### 3.6 内置 MCP 工具

- **Context7**: 查找开发文档
- **Grep_app**: 搜索 GitHub 代码
- **联网搜索**: 实时信息检索
- **代码审查**: 自动审查 Agent
- **文档写作**: 快速生成文档

---

## 4. 与 Claude Code 对比

### 4.1 能力对比

| 维度 | Claude Code | OpenCode + oh-my-opencode |
|------|-------------|---------------------------|
| **模型能力** | 顶级模型 | 顶级模型 |
| **多 Agent 协作** | ✅ | ✅ |
| **MCP/Skills** | ✅ 原生 | ✅ 通过插件 |
| **LSP 集成** | ✅ | ✅ |
| **上下文管理** | ✅ | ✅ 自动压缩 |

**结论**: 能力相当，差异在于使用体验。

### 4.2 各自优势

**OpenCode 优势**:
- ✅ 灵活性高：随时切换模型，不受单一供应商锁定
- ✅ 稳定性好：配合国产模型，国内网络基本无断连
- ✅ 成本更低：完全免费，可用 GLM-4.7、MiniMax M2.1
- ✅ 社区活力强：开源驱动，更新频繁

**Claude Code 优势**:
- ✅ 开箱即用：不需要额外配置
- ✅ 官方支持：Anthropic 维护，稳定性有保障
- ✅ 文档完善：官方文档齐全

### 4.3 兼容性

**完美兼容 Claude Code**:
- ✅ 命令系统
- ✅ SubAgent 机制
- ✅ Skills 格式
- ✅ MCP 协议
- ✅ 钩子机制

**迁移成本**: 几乎为零！

### 4.4 适用人群

**选择 OpenCode**:
- 想要控制成本、免费使用
- 网络环境受限、需要国产模型
- 喜欢折腾开源工具
- 想要学习 Agent 开发

**选择 Claude Code**:
- 追求开箱即用
- 不想折腾配置
- 预算充足（$20/月）

---

## 5. 使用建议

### 5.1 推荐配置

**王者配置**（效果最好）:
- ChatGPT Pro + Claude Max Pro + Google AI Ultra
- 总计: $60/月

**推荐配置**（性价比最高）:
- ChatGPT Pro + Google AI Ultra
- 不订阅 Claude Code（Google AI Ultra 已包含 Claude）
- 总计: $40/月

**基础配置**（完全免费）:
- 使用 GLM-4.7、MiniMax M2.1
- 总计: $0/月

### 5.2 模型切换策略

**简单任务**: Gemini 3 Flash、GLM-4.7（快速、便宜）

**中等复杂度**: Claude Sonnet 4.5、Gemini 3 Pro

**复杂任务**: Claude Opus 4.5、GPT-5.2-Codex，开启 `ultrawork` 模式

### 5.3 使用场景

**新产品 MVP**: OpenCode + oh-my-opencode
- 不需要过问细节
- 整体效率高
- 快速得到产出

**成熟项目维护**: 根据个人习惯
- OpenCode: 快速迭代、小改动
- 传统 IDE: 精细控制、深入了解项目

**学习 Agent 开发**: OpenCode
- 完全开源，可直接看源码
- 完美兼容 Claude Code

### 5.4 防止违规使用

⚠️ **在 OpenCode 中偷偷使用 Claude Code 的能力是违规的，可能会被封号！**

**安全做法**:
- ✅ 使用 Google AI Ultra 中的 Claude
- ✅ 删除 OpenCode 中的 Claude Code 授权

### 5.5 核心洞察

**对顶级模型的提升**: 对 GPT-5.2-Codex、Claude Opus 4.5 用户提升很小

**对新手和普通模型**: 提升巨大！
- ✅ 对 Gemini 3 Flash、Claude Sonnet 4.5 提升大
- ✅ 对 GLM-4.7、MiniMax M2.1 提升显著

**核心价值**:
> **"这才是编程类 AI Agent 该有的样子"**
>
> **"Claude Skills 的价值，还是被大大低估了"** ✨

---

## 6. Sources

### 官方资源

- **OpenCode GitHub**: https://github.com/opencode-project/opencode (50.2K+ Stars)
- **oh-my-opencode GitHub**: https://github.com/code-yeongyu/oh-my-opencode (9.2K+ Stars)
- **OpenCode 官网**: https://opencode.ai/

### 参考文章

1. 刘小排：《全网吹爆的OpenCode实测：对于顶级模型几乎没用，但我为什么还是推荐它》
   https://mp.weixin.qq.com/s/cb_KGhZKs1x8FYY5sF9-bg

2. 易安：《OpenCode，像德芙一般丝滑。》
   https://mp.weixin.qq.com/s/TOBH1x2Vu8Z_m6VlC8rdYw

3. 袋鼠帝：《Claude Code最强开源对手！GitHub 50.2k Star了，作者为它烧掉2.4w美元。》
   https://mp.weixin.qq.com/s/RZDL6UBIfTzICX8GwqSzYw

---

## 开始使用

```bash
# 1. 安装 OpenCode
npm install -g opencode-ai

# 2. 安装 Bun
# Windows: powershell -c "irm bun.sh/install.ps1 | iex"
# macOS/Linux: curl -fsSL https://bun.sh/install | bash

# 3. 安装 oh-my-opencode
npx oh-my-opencode install

# 4. 启动
cd your-project
opencode

# 5. 初始化并开始使用
TUI 界面输入: /init
```

**完全免费，还要啥自行车？** 🚀

---

**核心理念**: **开源、免费、强大** ⭐
