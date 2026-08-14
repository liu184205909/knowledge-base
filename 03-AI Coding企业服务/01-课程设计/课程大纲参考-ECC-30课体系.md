# 课程大纲参考：ECC 30课体系

> 来源：[Everything Claude Code 三十节课程大纲（掘金）](https://juejin.cn/post/7626235066953383945)
> 采集时间：2026-05-30
> 用途：作为 AI Coding 企业培训课程设计的结构参考

---

## 课程设计理念

### 节奏控制
30 节课分为六个阶段，每阶段有明确的能力目标：

```
第一阶段：认知建立（第1-3课）     → 能说清 ECC 是什么、为什么、怎么组织
第二阶段：组件精讲（第4-11课）    → 能读懂并创建每种核心组件
第三阶段：工作流实战（第12-16课）  → 能在真实项目中跑通完整开发流程
第四阶段：语言与框架（第17-22课）  → 能针对具体技术栈深度使用 ECC
第五阶段：进阶能力（第23-27课）   → 能处理安全、性能、学习等高级主题
第六阶段：综合与创造（第28-30课）  → 能独立设计和贡献 ECC 配置方案
```

### 知识依赖链

```
第一阶段：认知建立
┌─────┐   ┌─────┐   ┌─────┐
│ 1课 │──→│ 2课 │──→│ 3课 │
│ 哲学 │   │ 架构 │   │目录 │
└─────┘   └─────┘   └──┬──┘
                        │
第二阶段：组件精讲       │
┌─────┐   ┌─────┐   ┌──▼──┐   ┌─────┐
│ 4课 │──→│ 5课 │   │ 6课 │──→│ 7课 │
│Rules│   │Rules│   │Agent│   │Agent│
│通用 │   │语言 │   │格式 │   │设计 │
└──┬──┘   └──┬──┘   └──┬──┘   └──┬──┘
   │         │         │         │
┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐
│ 8课 │──→│ 9课 │   │10课 │──→│11课 │
│Skill│   │Skill│   │Hook │   │Scrip│
│结构 │   │编写 │   │事件 │   │底层 │
└──┬──┘   └──┬──┘   └──┬──┘   └──┬──┘
   │         │         │         │
第三阶段：工作流实战     │         │
   ▼         ▼         ▼         ▼
┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐
│12课 │──→│13课 │──→│14课 │──→│15课 │──→│16课 │
│调用 │   │TDD流│   │验证 │   │上下文│   │多代理│
│链   │   │程   │   │循环 │   │管理 │   │编排 │
└─────┘   └─────┘   └─────┘   └─────┘   └─────┘
```

### 每节课的标准收获（可验证成果）

| 课次 | 带走成果 |
|------|---------|
| 1 | 一份五大原则的个人理解笔记 |
| 2 | 一张手绘的组件关系图 |
| 3 | 一次完整的仓库浏览和安装体验 |
| 4 | 能解释 Rules 分层优先级 |
| 5 | 一份为新语言草拟的 Rule 文件 |
| 6 | 能说出 Agent 四个字段各自的作用 |
| 7 | 一个自己创建的 Agent 文件 |
| 8 | 能说出 Skill 和文档的本质区别 |
| 9 | 一个自己编写的 Skill 草稿 |
| 10 | 一个自定义的 Hook 配置 |
| 11 | 一个可运行的 Hook 脚本 |
| 12 | 一张完整的命令调用链流程图 |
| 13 | 一次完整的 TDD RED-GREEN-IMPROVE 体验 |
| 14 | 一次通过验证循环的代码提交 |
| 15 | 能在三种动态上下文间切换使用 |
| 16 | 一个多 Agent 并行编排方案 |
| 17 | 一份你主力后端语言的 ECC 配置 |
| 18 | 一份你主力前端框架的 ECC 配置 |
| 19 | 了解移动端的 ECC 模式 |
| 20 | 一次数据库 Migration 的 ECC 辅助体验 |
| 21 | 一份符合 ECC 规范的 API 设计方案 |
| 22 | 理解微服务/六边形架构的 ECC 支持 |
| 23 | 能列出 5 个 AI 代理特有的攻击向量 |
| 24 | 一次 AgentShield 扫描 + 一个安全 Hook |
| 25 | 从会话中提取出一个 Instinct |
| 26 | 一次 Eval 的设计和运行 |
| 27 | 理解 Agent Harness 构建和 LLM 成本优化 |
| 28 | 了解 Plugin Manifest 和安装 Profile |
| 29 | 体验 ECC 2.0 Dashboard |
| 30 | 一个为真实项目设计的完整 ECC 方案 |

---

## 第一阶段：认知建立（第 1-3 课）

### 第 1 课：设计哲学 — ECC 为什么存在
- **前置条件**：无
- **知识点**：AI Harness 概念、五大核心原则（Agent-First / Test-Driven / Security-First / Immutability / Plan Before Execute）、原则间的内在逻辑链
- **练习**：用一段话写出五大原则的内在逻辑链

### 第 2 课：架构全景 — 六大组件如何协作
- **前置条件**：第 1 课
- **知识点**：六大组件（Rules/Agents/Skills/Commands/Hooks/Scripts）、协作模型、三组关键区分
- **练习**：手绘一张六大组件关系图

### 第 3 课：上手体验 — 安装与目录漫游
- **前置条件**：第 2 课
- **知识点**：安装方式（Plugin/Shell/npx）、目录漫游清单、运行测试
- **练习**：执行安装并运行测试

## 第二阶段：组件精讲（第 4-11 课）

### 第 4-5 课：Rules（通用规则 + 语言规则）
- 分层继承模型：通用 → 语言 → 项目（类似CSS特异性）
- 10个通用规则全景（coding-style/testing/security/git-workflow/performance等）
- 语言特定规则覆盖案例

### 第 6-7 课：Agents（文件格式 + 系统提示词设计）
- Agent 文件结构（frontmatter + Markdown正文）
- 四段式系统提示词：职责声明 → 工作流程 → 输出格式 → 约束条件
- 设计技巧：约束比指令更重要

### 第 8-9 课：Skills（结构 + 编写实战）
- Skill 的本质：给 AI 执行的知识（vs 给人类阅读的文档）
- 标准四段式：When to Use → How It Works → Examples → Anti-Patterns
- 85个编程Skill分布地图

### 第 10-11 课：Hooks + Scripts（事件驱动自动化 + 底层实现）
- 7种Hook事件（PreToolUse/PostToolUse/Stop/SessionStart等）
- 只有PreToolUse能拦截（exit 1）
- Hook脚本标准模式

## 第三阶段：工作流实战（第 12-16 课）

### 第 12 课：调用链追踪
- Command → Skill → Agent → Rules 的完整调用链
- 79个命令分类速览

### 第 13 课：TDD 全流程
- Plan → TDD → Review → Commit 四阶段开发流
- RED → GREEN → IMPROVE 严格循环

### 第 14 课：验证循环
- 测试 → Lint → 类型检查 → 安全检查 → 可提交

### 第 15 课：会话管理
- 上下文窗口管理（安全区0-80% / 危险区80-100%）
- 模型分层选择（Haiku/Sonnet/Opus）
- MCP陷阱（超过10个MCP会将上下文从200K压缩到70K）

### 第 16 课：多代理编排
- 并行 vs 顺序、编排模式（单Agent/并行/多模型/级联）
- 子代理上下文丢失问题

## 第四阶段：语言与框架（第 17-22 课）
- 第17课：后端语言（Python/Go/Rust/Java）
- 第18课：前端框架（React/Next.js/Vue/Nuxt）
- 第19课：移动端（Swift/SwiftUI/Dart/Flutter）
- 第20课：数据库模式（PostgreSQL/ClickHouse/Migration）
- 第21课：API设计（RESTful/后端四层架构）
- 第22课：软件架构（六边形/微服务/ADR）

## 第五阶段：进阶能力（第 23-27 课）
- 第23-24课：安全（AI代理威胁 + 防御机制）
- 第25课：持续学习（Instinct提取与演化）
- 第26课：Eval驱动开发（pass@k指标）
- 第27课：Agent工程与LLM成本优化

## 第六阶段：综合与创造（第 28-30 课）
- 第28课：跨平台适配与插件机制
- 第29课：ECC 2.0 Rust控制面板
- 第30课：综合实战毕业项目（8个阶段A-H交付物清单）

---

## 编程 Skill 覆盖范围

| 领域 | 数量 | 代表 Skill |
|------|------|-----------|
| 核心开发 | 10 | coding-standards, tdd-workflow, api-design, backend-patterns |
| 语言专用 | 28 | python-patterns, golang-patterns, rust-patterns, kotlin-patterns 等 |
| 框架专用 | 19 | django-patterns, springboot-patterns, laravel-patterns, nestjs-patterns 等 |
| 测试验证 | 7 | e2e-testing, eval-harness, verification-loop, benchmark |
| 安全 | 2 | security-review, security-scan |
| DevOps | 4 | docker-patterns, deployment-patterns, github-ops |
| AI/Agent | 11 | agent-harness-construction, cost-aware-llm-pipeline, claude-api |
| 流程工具 | 8 | strategic-compact, codebase-onboarding, git-workflow |

## 建议学习节奏

| 阶段 | 课次 | 建议用时 | 学习方式 |
|------|------|---------|---------|
| 认知建立 | 1-3 | 3天 | 以读为主，画图辅助 |
| 组件精讲 | 4-11 | 8天 | 每课读 + 写一个组件 |
| 工作流实战 | 12-16 | 5天 | 以实操为主 |
| 语言框架 | 17-22 | 6天 | 按自身技术栈选重点 |
| 进阶能力 | 23-27 | 5天 | 深度阅读 + 分析 |
| 综合创造 | 28-30 | 3天 | 综合设计 + 毕业项目 |
| **合计** | **30课** | **约30天** | |
