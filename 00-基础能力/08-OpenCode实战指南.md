# OpenCode 实战指南

**创建者**: 花生 × Claude Code
**最后更新**: 2026-01-07
**定位**: OpenCode + oh-my-opencode 开源 AI 编程工具完整指南
**版本**: v1.0

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
| **多 Agent 协作** | ✅ 支持 | ✅ 支持 |
| **MCP 支持** | ✅ 原生支持 | ✅ 通过插件支持 |
| **Skills 支持** | ✅ 原生支持 | ✅ 通过插件支持 |
| **LSP 集成** | ✅ 支持 | ✅ 支持 |
| **网络稳定性** | 国内可能受限 | ✅ 配合国产模型更稳定 |

---

## 📋 目录

1. [快速开始](#1-快速开始)
2. [OpenCode 核心特性](#2-opencode-核心特性)
3. [oh-my-opencode 插件详解](#3-oh-my-opencode-插件详解)
4. [多 Agent 协作机制](#4-多-agent-协作机制)
5. [与 Claude Code 对比](#5-与-claude-code-对比)
6. [使用场景与最佳实践](#6-使用场景与最佳实践)
7. [常见问题](#7-常见问题)
8. [Sources](#8-sources)

---

## 1. 快速开始

### 1.1 系统要求

- **操作系统**: Windows / macOS / Linux
- **Node.js**: v16 或更高版本
- **Bun**: (安装 oh-my-opencode 时需要)

### 1.2 安装 OpenCode

#### 方式 1: 使用 npm（推荐）

```bash
npm install -g opencode-ai
```

#### 方式 2: 使用官方脚本

```bash
curl -fsSL https://opencode.ai/install | bash
```

#### 方式 3: 桌面版

下载地址: https://opencode.ai/download

### 1.3 启动 OpenCode

```bash
# 进入项目目录
cd your-project

# 启动 OpenCode
opencode
```

在 TUI 界面中输入 `/init`，让它扫描你的项目结构。

---

## 2. OpenCode 核心特性

### 2.1 模型支持广泛

**支持的供应商**: 75+ 家

**主流模型**:
- ✅ OpenAI: GPT-4、GPT-4o、GPT-5.2-Codex
- ✅ Anthropic: Claude 3.5、Claude Opus 4.5、Claude Sonnet 4.5
- ✅ Google: Gemini 2.0、Gemini 3 Pro、Gemini 3 Flash
- ✅ 国产模型: GLM-4.7、MiniMax M2.1、DeepSeek
- ✅ 开源模型: Llama 3、Mistral、Qwen 等
- ✅ 本地模型: Ollama、LM Studio

**免费模型**:
- GLM-4.7 (智谱 AI)
- MiniMax M2.1
- 其他多个开源模型

### 2.2 多种使用形态

#### 终端 TUI 模式

```bash
opencode
```

**特点**:
- 赛博朋克风格的"指挥舱"界面
- 所有信息流、代码状态、任务进度可视化
- 适合喜欢终端操作的开发者

#### 桌面 GUI 模式

**特点**:
- 更友好的图形界面
- 功能齐全
- 适合大多数用户

### 2.3 账户登录支持

不仅支持 API 方式接入，还支持账户登录：
- ✅ ChatGPT Pro 账户
- ✅ Claude Pro 账户
- ✅ Gemini Pro 账户
- ✅ Google AI Ultra 账户

**优势**: 如果已有 Pro 订阅，账户登录使用比 API 更划算。

---

## 3. oh-my-opencode 插件详解

> **让 OpenCode 超进化的核心插件** | GitHub 9.2K+ Stars
> 作者烧掉 $24,000 Token 打磨架构

### 3.1 安装 oh-my-opencode

#### 前置条件：安装 Bun

**Windows**:
```powershell
# 以管理员身份打开 PowerShell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**macOS / Linux**:
```bash
curl -fsSL https://bun.sh/install | bash
```

#### 安装插件

```bash
npx oh-my-opencode install
```

安装过程中会询问：
- Claude 订阅情况 → yes / no / max20
- ChatGPT 订阅情况 → yes / no
- Gemini 订阅情况 → yes / no

安装完成后，插件会写入：
- Windows: `%USERPROFILE%\.config\opencode\opencode.json`
- macOS/Linux: `~/.config/opencode/opencode.json`

### 3.2 核心功能

#### 1) 多 Agent 协作系统

**内置专业 Agent**:

| Agent 名称 | 职责 | 适用场景 |
|-----------|------|---------|
| **Oracle** | 架构审查 | 代码设计审查、架构把关 |
| **Librarian** | 文档检索 | 快速查找开发文档、技术资料 |
| **Frontend Engineer** | 前端专项 | UI/UX 设计、前端开发 |
| **Search Agent** | 资料搜索 | 查阅在线文档、资源 |
| **Plan Agent** | 任务规划 | 制定执行计划、路径思考 |

**工作原理**:
- 这些 Agent 在后台并行工作
- 主 Agent 只接收最终结果
- 上下文保持精简，效率拉满

#### 2) 关键词触发模式

| 模式 | 关键词 | 效果 |
|------|--------|------|
| **Ultrawork Mode** | `ultrawork` / `ulw` | 火力全开，多 Agent 并行调度攻克难题 |
| **Think Mode** | `think deeply` / `ultrathink` | 强制 AI 进行长思维链推理 |
| **Librarian Mode** | `search` / `find` / `찾아` / `検索` | 在大规模文档和代码库中精准检索 |
| **Analyze Mode** | `analyze` / `investigate` / `분석` / `調査` | 多阶段专家会诊，深度分析 |

**使用示例**:
```
# 开启火力全开模式
你: "ultrawork 帮我重构这个项目"

# 强制深度思考
你: "ultrathink 这个架构设计有什么问题"

# 检索文档
你: "search React 性能优化最佳实践"

# 深度分析
你: "analyze 这个代码的性能瓶颈"
```

#### 3) AST 感知代码操作

**传统问题**:
- AI 只看文本，不理解代码结构
- 重构变量名时，可能会误伤字符串里的同名文本

**OpenCode 方案**:
- 基于 **AST (抽象语法树)** 重构
- 精准识别代码结构
- 不会误伤字符串、注释中的同名文本

**示例**:
```javascript
// 传统方式: 会把所有 "foo" 都改成 "bar"
const foo = "foo";  // 字符串也会被改 ❌

// AST 方式: 只改变量名，不改字符串
const foo = "foo";  // 字符串保持不变 ✅
```

#### 4) Comment Checker（防过度注释）

**痛点**: AI 喜欢给每行代码都加注释，导致代码冗长

**解决方案**:
- 自动防止 AI 过度注释
- 保持代码简洁
- 只在必要处添加注释

#### 5) 自动会话恢复

**痛点**: 网络中断后，上下文丢失，需要重新开始

**解决方案**:
- 断网重连能接着之前的上下文继续
- 不会因为网络波动导致工作中断

#### 6) 上下文焦虑管理

**问题**: AI 记忆（Context）满了就会"失忆"

**解决方案**:
- 当上下文用量达到 **70%** 或 **85%** 时，自动触发"自动压缩"（Auto Compact）
- 定期整理"记忆"，把陈旧、不重要的对话打包压缩
- 腾出空间给新任务

**优势**:
- ✅ 保证 AI 不会变笨
- ✅ 防止上下文溢出中断任务
- ✅ 长任务也能顺利完成

#### 7) 防代码截断

**痛点**: AI 写长代码写到一半突然停了，出现 `// ...rest of code`

**解决方案**:
- 内置防截断机制
- 强制检查代码中的 TODO 和省略号
- 逼着 AI 必须把代码写完

**效果**: 绝不让代码烂尾

#### 8) LSP 深度集成

**传统 AI 助手问题**:
- 只是在看文本
- 像在 TXT 文件里盲打
- 不知道变量在哪里被引用

**OpenCode 方案**:
- 集成 **LSP (语言服务协议)**
- 像 IDE 一样清晰看到：
  - 函数定义在哪里
  - 谁引用了这个变量
  - 这个类继承自谁
- 不是瞎猜，是精准理解代码结构

### 3.3 内置 MCP 工具

oh-my-opencode 内置了多个实用的 MCP 工具：

**Context7**
- 功能: 查找各种开发文档
- 用途: 快速检索 API 文档、技术规范

**Grep_app**
- 功能: 搜索 GitHub 上的项目代码
- 用途: 查找开源项目中的实际使用案例

**其他工具**:
- 联网搜索 MCP
- 代码审查 Agent
- 极速扫描代码 Agent
- 文档写作 Agent
- 前端设计 Skill
- 视觉内容理解 Agent

---

## 4. 多 Agent 协作机制

### 4.1 传统方式 vs 多 Agent 协作

**传统方式** (一个模型干所有活):
```
用户请求 → AI 自己死磕
         ↓
    像一个厨师同时负责：
    - 切菜
    - 炒菜
    - 端盘子
    - 收银
         ↓
    效率不高，容易出错
```

**多 Agent 协作** (OpenCode + oh-my-opencode):
```
用户请求 → 主控 Agent 识别任务类型
         ↓
    派出专门的 SubAgent:
    - Search Agent: 查阅文档
    - Plan Agent: 规划路径
    - Frontend Engineer: 前端实现
         ↓
    异步并行执行
         ↓
    主控 Agent 汇总结果
```

### 4.2 实战案例

**场景**: 重构一个全栈项目

```bash
你: "ultrawork 帮我重构这个项目"

OpenCode:
1. 识别任务: 需要前后端协同
2. 派出 Plan Agent: 分析项目结构，制定重构计划
3. 并发执行:
   - Frontend Engineer: 重构前端代码
   - Backend Agent: 重构后端代码
4. Oracle: 审查重构后的架构
5. 汇总结果: 生成完整报告

时间: 传统方式 2-3 小时 → 并行协作 10-15 分钟
```

### 4.3 异步执行的优势

**关键**: SubAgent 在后台忙活时，主线程**不会卡顿**

**好处**:
- ✅ 你可以继续喝咖啡
- ✅ 可以处理别的逻辑
- ✅ 不会被等待时间拖累

---

## 5. 与 Claude Code 对比

### 5.1 能力对比

| 维度 | Claude Code | OpenCode + oh-my-opencode | 谁更强？ |
|------|-------------|---------------------------|---------|
| **模型能力** | 顶级模型 | 顶级模型 | 🤝 相当 |
| **多 Agent 协作** | ✅ | ✅ | 🤝 相当 |
| **MCP 支持** | ✅ 原生 | ✅ 通过插件 | 🤝 相当 |
| **Skills 支持** | ✅ 原生 | ✅ 通过插件 | 🤝 相当 |
| **LSP 集成** | ✅ | ✅ | 🤝 相当 |
| **上下文管理** | ✅ | ✅ 自动压缩 | 🤝 相当 |
| **防代码截断** | ✅ | ✅ | 🤝 相当 |

### 5.2 差异化优势

**OpenCode + oh-my-opencode 的独特优势**:

1. **灵活性更高**
   - 可以随时切换模型
   - 日常用便宜的模型，复杂任务再切 Claude
   - 不会被单一供应商锁定

2. **稳定性更好** (配合国产模型)
   - 国内网络基本没断连问题
   - 不需要担心网络问题

3. **成本更低**
   - 完全免费
   - 可以使用免费的 GLM-4.7、MiniMax M2.1
   - 不需要每月订阅费

4. **社区活力更强**
   - 开源社区驱动
   - 更新频繁，几乎每天都有新 commit
   - 问题反馈和修复更快

**Claude Code 的优势**:

1. **开箱即用**
   - 不需要额外配置
   - 不需要安装插件
   - 适合不想折腾的用户

2. **官方支持**
   - Anthropic 官方维护
   - 稳定性有保障
   - 文档完善

3. **与 Claude 深度集成**
   - 最优化 Claude 模型
   - 可能有一些独有功能

### 5.3 兼容性

**OpenCode + oh-my-opencode 完美兼容 Claude Code**:

- ✅ 命令系统
- ✅ SubAgent 机制
- ✅ Skills 格式
- ✅ MCP 协议
- ✅ 钩子机制 (PreToolUse、PostToolUse、UserPromptSubmit、Stop)

**迁移成本**: 几乎为零！

### 5.4 适用人群

**选择 OpenCode + oh-my-opencode 的理由**:
- ✅ 想要控制成本
- ✅ 网络环境受限
- ✅ 想要自由切换模型
- ✅ 喜欢折腾开源工具
- ✅ 想要学习 Agent 开发

**选择 Claude Code 的理由**:
- ✅ 追求开箱即用
- ✅ 不想折腾配置
- ✅ 信任官方产品
- ✅ 预算充足（$20/月）

---

## 6. 使用场景与最佳实践

### 6.1 推荐配置

**王者配置** (效果最好):
- ChatGPT Pro ($20/月)
- Claude Max Pro ($20/月)
- Google AI Ultra ($20/月)
- **总计**: $60/月

**推荐配置** (性价比最高):
- ChatGPT Pro ($20/月)
- Google AI Ultra ($20/月)
- 不订阅 Claude Code
- **总计**: $40/月
- **原因**: Google AI Ultra (Antigravity) 已包含 Claude Opus 4.5

**基础配置** (完全免费):
- 使用系统自带的免费模型
- GLM-4.7、MiniMax M2.1
- **总计**: $0/月

### 6.2 使用场景

#### 场景 1: 新产品 MVP 开发

**推荐**: OpenCode + oh-my-opencode

**原因**:
- 不需要过问那么多细节
- 整体效率很高
- 很快就能得到一个八九不离十的产出

**使用方式**:
```bash
# 启动 OpenCode
opencode

# 使用 ultrawork 模式快速开发
你: "ultrawork 帮我创建一个用户认证系统"
```

#### 场景 2: 成熟项目维护

**推荐**: 根据个人习惯选择

**OpenCode 适合**:
- 快速迭代、小改动
- 不想深入了解项目细节

**传统 IDE + AI 适合**:
- 足够了解项目
- 需要精细控制
- 有自己的工作流

#### 场景 3: 学习 Agent 开发

**推荐**: OpenCode

**原因**:
- 完全开源
- 可以直接看源码学习
- 完美兼容 Claude Code

**学习路径**:
```bash
# 让 OpenCode 自己教自己
你: "帮我制定学习计划"
OpenCode: "建议阅读这些文件..."
```

### 6.3 最佳实践

#### 1) 模型切换策略

**简单任务**:
- 使用 Gemini 3 Flash (快速、便宜)
- 使用 GLM-4.7 (免费)

**中等复杂度**:
- 使用 Claude Sonnet 4.5
- 使用 Gemini 3 Pro

**复杂任务**:
- 使用 Claude Opus 4.5
- 使用 GPT-5.2-Codex
- 开启 `ultrawork` 模式

#### 2) 上下文管理

**监控上下文使用**:
```bash
# 在 OpenCode TUI 中查看当前上下文用量
# 当达到 70% 时，会自动压缩
```

**手动触发压缩**:
```
你: "compact 压缩上下文"
```

#### 3) 多语言协作

**场景**: 需要同时翻译多语言文件

**优势**: OpenCode 会自动并发执行

```bash
你: "把 en.json 翻译成 zh-CN、ja、ko 三个语言"

OpenCode:
- 并发启动 3 个 SubAgent
- 同时翻译 3 个语言
- 时间: 传统方式串行 10 分钟 → 并发 3 分钟
```

#### 4) 防止违规使用

**注意**: 在 OpenCode 中偷偷使用 Claude Code 的能力是**违规**的，可能会被封号！

**安全做法**:
- ✅ 使用 Google AI Ultra 中的 Claude (google/antigravity-claude-opus-4-5-thinking-high)
- ✅ 或者删除 OpenCode 中的 Claude Code 授权

---

## 7. 常见问题

### Q1: OpenCode 对顶级模型的提升有多大？

**A**: 对提升很小，甚至可能没有提升。

**原因**:
1. 顶级模型（GPT-5.2-Codex、Claude Opus 4.5）本来就很强
2. OpenCode 的提升主要来自于：
   - "模型本体不行"的部分（顶级模型不存在）
   - "系统工程/上下文工程"的部分（顶级模型已经很好）
   - Agent 工具和流程（老手自己会配置）

**结论**: 如果你是顶级模型用户 + 老手，OpenCode 可能是"画蛇添足"。

### Q2: 那为什么还推荐 OpenCode？

**A**: 因为对**新手**和**普通模型用户**提升巨大！

**提升效果**:
- ✅ 对 Gemini 3 Flash: 提升大
- ✅ 对 Claude Sonnet 4.5: 提升大
- ✅ 对 GLM-4.7、MiniMax M2.1: 提升显著

**核心价值**:
- **这才是编程类 AI Agent 该有的样子**
- 多角色协作，而不是一个人串行工作
- 免配置，新手友好

### Q3: OpenCode 会替代 Claude Code 吗？

**A**: 不会完全替代，但会成为强有力的竞争对手。

**各有优势**:
- **Claude Code**: 开箱即用、官方支持、省心
- **OpenCode**: 完全免费、灵活性强、社区驱动

**预测**: 两者会长期共存，用户根据需求选择。

### Q4: oh-my-opencode 是必须的吗？

**A**: 强烈推荐安装，但不是必须的。

**单独用 OpenCode**:
- ✅ 已经很不错了
- ❌ 缺少多 Agent 协作
- ❌ 缺少高级功能

**配合 oh-my-opencode**:
- ✅ 超进化
- ✅ 能力媲美 Claude Code
- ✅ 某些方面甚至更好

**建议**: 如果打算试试 OpenCode，一定要带上 oh-my-opencode。

### Q5: 在 OpenCode 中使用 Claude Code 违规吗？

**A**: **是的，违规！**

**原因**: 根据 Claude Code 的协议，在 OpenCode 中偷偷使用 Claude Code 的能力是违规的。

**后果**: 可能会被封号（虽然概率不大，但已有案例）

**安全做法**:
- 使用 Google AI Ultra 中的 Claude
- 或者删除 OpenCode 中的 Claude Code 授权

### Q6: OpenCode 的学习成本高吗？

**A**: 不高，特别是如果你已经熟悉 Claude Code。

**原因**:
- 完美兼容 Claude Code 的命令、Agent、Skills、MCP、钩子
- 迁移成本几乎为零
- 基本无感切换

### Q7: OpenCode 支持中文吗？

**A**: ✅ 完全支持！

**特色**:
- 中文关键词触发: `search`、`find`、`찾아`（韩语）、`検索`（日语）
- 中文界面支持
- 国产模型优化

---

## 8. Sources

### 官方资源

1. **OpenCode GitHub**: https://github.com/opencode-project/opencode (50.2K+ Stars)
2. **OpenCode 官网**: https://opencode.ai/
3. **oh-my-opencode GitHub**: https://github.com/code-yeongyu/oh-my-opencode (9.2K+ Stars)

### 参考文章

1. **《全网吹爆的OpenCode实测：对于顶级模型几乎没用，但我为什么还是推荐它》** - 刘小排
   https://mp.weixin.qq.com/s/cb_KGhZKs1x8FYY5sF9-bg

2. **《OpenCode，像德芙一般丝滑。》** - 易安
   https://mp.weixin.qq.com/s/TOBH1x2Vu8Z_m6VlC8rdYw

3. **《Claude Code最强开源对手！GitHub 50.2k Star了，作者为它烧掉2.4w美元。》** - 袋鼠帝
   https://mp.weixin.qq.com/s/RZDL6UBIfTzICX8GwqSzYw

### 相关工具

- **Claude Code**: https://claude.com/claude-code
- **MCP 协议**: https://modelcontextprotocol.io/

---

## 9. 总结

### 核心观点

**OpenCode + oh-my-opencode 是目前开源界最能打的 AI 编程组合之一。**

**适合人群**:
- ✅ 想要免费替代 Claude Code
- ✅ 想要自由切换模型
- ✅ 网络环境受限
- ✅ 喜欢折腾开源工具
- ✅ 想要学习 Agent 开发

**不适合人群**:
- ❌ 追求开箱即用（建议用 Claude Code）
- ❌ 不想折腾配置（建议用 Claude Code）
- ❌ 已有顶级模型订阅且是老手（提升有限）

### 关键洞察

> **"这才是编程类 AI Agent 该有的样子"**

> **"Claude Skills 的价值，还是被大大低估了"** ✨

### 开始使用

```bash
# 1. 安装 OpenCode
npm install -g opencode-ai

# 2. 安装 Bun (如果还没有)
# Windows:
powershell -c "irm bun.sh/install.ps1 | iex"

# macOS/Linux:
curl -fsSL https://bun.sh/install | bash

# 3. 安装 oh-my-opencode
npx oh-my-opencode install

# 4. 启动 OpenCode
cd your-project
opencode

# 5. 初始化项目
在 TUI 中输入: /init

# 6. 开始使用！
你: "ultrawork 帮我重构这个项目"
```

**完全免费，还要啥自行车？** 🚀

---

**核心理念**: **开源、免费、强大** ⭐
