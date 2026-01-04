# Claude Skills 完全指南

**创建者**: 花生 × Claude Code
**最后更新**: 2026-01-02
**定位**: Skills 核心概念与原理

---

## 🎯 核心价值

> **Claude Skills = 个人经验的固化和标准化工作的 SOP**

- ✅ **经验固化**：将你的实战经验、最佳实践固化成可复用的知识库
- ✅ **标准 SOP**：将工作流程标准化，确保每次执行都符合标准
- ✅ **AI 自动执行**：Claude 自动识别场景，按标准执行，无需重复沟通
- ✅ **持续迭代**：随着经验积累，不断优化 Skills，形成正向循环

---

## 📋 目录

1. [核心概念](#1-核心概念)
2. [技术架构](#2-技术架构)
3. [如何创建 Skills](#3-如何创建-skills)
4. [典型应用场景](#4-典型应用场景)
5. [最佳实践](#5-最佳实践)
6. [注意事项](#6-注意事项)
7. [附录：Skills、Plugins、MCP 对比](#附录skills-plugins-mcp-对比)

---

## 1. 核心概念

### 1.1 一句话定义

**Skills 是模块化的能力包，包含指令、元数据和可选资源（脚本、模板），让 Claude 在需要时自动加载和使用。**

### 1.2 通俗理解

想象你在给新员工做入职培训：
- ❌ **传统方式**：每次都重复讲解相同的工作流程
- ✅ **Skills 方式**：准备好工作手册，需要时自己翻阅

Skills 就像是给 Claude 准备的"工作手册库"：
- 平时只知道手册目录（低成本）
- 需要时才打开具体章节（按需加载）
- 包含详细步骤和工具脚本（完整指导）

### 1.3 技术定义

**Skills 是文件系统驱动的能力扩展机制**：

```
📁 skill-name/
├── SKILL.md           # 核心指令文件（YAML frontmatter + Markdown）
├── scripts/           # 可执行脚本（Python/Bash）
├── references/        # 参考文档
└── assets/            # 模板和资源文件
```

---

## 2. 技术架构

### 2.1 三层加载机制（Progressive Disclosure）

这是 Skills 最核心的设计理念：**分阶段、按需加载**

#### Level 1: 元数据（Metadata）- 总是加载

**内容**：SKILL.md 的 YAML frontmatter

```yaml
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents.
             Use when working with PDF files or when the user mentions PDFs.
---
```

**加载时机**：启动时加载到系统提示
**Token 成本**：~100 tokens/Skill
**作用**：让 Claude 知道有哪些 Skills 可用，什么时候该用

#### Level 2: 指令内容（Content）- 需要时加载

**内容**：SKILL.md 的 Markdown 正文

```markdown
# PDF Processing Skill

## Quick Start
To extract text from a PDF:
1. Run: python scripts/extract.py input.pdf
2. Output will be in output.txt

## Advanced Usage
For complex scenarios, see [ADVANCED.md](references/ADVANCED.md)
```

**加载时机**：Claude 识别到需要此 Skill 时
**Token 成本**：~2,000 tokens
**作用**：提供具体操作步骤

#### Level 3: 附加资源（Resources）- 按需加载

**内容**：详细文档、脚本、模板

**加载时机**：指令中引用时才加载
**Token 成本**：按需（+3,000~10,000 tokens）
**作用**：提供深度参考资料

### 2.2 架构优势

| 优势 | 说明 | 实际效果 |
|------|------|---------|
| **可扩展性** | 可安装数十个 Skills | 启动时 <1,000 tokens |
| **性能优化** | 按需加载详细内容 | 避免不必要的 token 消耗 |
| **灵活性** | 支持脚本和模板 | 适应复杂场景 |

---

## 3. 如何创建 Skills

### 3.1 基础结构

```
skill-name/
├── SKILL.md           # 核心指令文件（必需）
├── scripts/           # 可执行脚本（可选）
├── references/        # 参考文档（可选）
└── assets/            # 模板和资源（可选）
```

### 3.2 SKILL.md 模板

```yaml
---
name: my-skill
description: 简洁描述这个技能的作用和使用场景
              包含触发关键词和使用说明
---

# Skill 名称

## 核心功能
简要说明这个技能做什么...

## 使用场景
- 场景1：具体描述
- 场景2：具体描述

## 快速开始
### 基础用法
最简单的使用方式...

### 高级用法
复杂场景的说明，见 [ADVANCED.md](references/ADVANCED.md)

## 可用工具
- 工具1：说明
- 工具2：说明

## 示例
展示一个实际使用案例...
```

### 3.3 Description 设计要点

**目标**：帮助 AI 准确匹配用户意图

```yaml
# ❌ 太简短
description: Code review

# ❌ 太泛化
description: Review code for quality and bugs

# ✅ 清晰具体
description: |
  Review code for security vulnerabilities, performance issues, and style compliance.
  Use when user asks to review code, check for bugs, or validate security.
  Includes scripts for linting, security scanning, and complexity analysis.
```

**包含要素**：
- ✅ 核心功能
- ✅ 触发场景
- ✅ 关键词
- ✅ 可用工具

### 3.4 AI 自动创建

> **提示**：直接告诉 AI 你的需求，AI 会自动生成完整的 Skill 结构

**示例**：
```
你: "帮我创建一个Python代码审查的Skill"

AI会自动：
1. 创建文件结构
2. 生成 SKILL.md
3. 编写审查脚本
4. 提供使用说明
```

---

## 4. 典型应用场景

### 4.1 企业标准化工作流

**场景**：
- 客户支持工单处理
- 数据分析和报告生成
- 代码规范审查

**价值**：
- 标准化工作流程
- 减少重复沟通
- 确保质量一致

### 4.2 研发实验知识管理

**场景**：
- 实验前咨询（/advise）
- 实验后沉淀（/retrospective）

**价值**：
- 避免重复踩坑
- 快速复用经验
- 团队知识共享

### 4.3 开发工作流优化

**场景**：
- 代码审查流程
- 测试生成标准
- 部署检查清单

**价值**：
- 自动化检查
- 提高代码质量
- 减少人为错误

> **AI 可以根据你的具体需求，自动创建相应场景的 Skill**

---

## 5. 最佳实践

### 5.1 渐进式披露（Progressive Disclosure）

**原则**：只在需要时才引用详细文档

```markdown
# SKILL.md - 保持简洁

## Quick Start
Basic instructions for common cases...

## Advanced Usage
For complex scenarios, see [ADVANCED.md](references/ADVANCED.md)

## API Reference
Full API docs: [API_DOCS.md](references/API_DOCS.md)
```

**效果**：
- 基础任务：仅加载 SKILL.md（<2,000 tokens）
- 复杂任务：额外加载 ADVANCED.md（+3,000 tokens）

### 5.2 脚本优先于生成代码

**为什么**：
- 脚本代码不进入上下文（仅输出消耗 token）
- 确定性强（预先测试过）
- 可复用性高

```markdown
# ❌ 让 AI 每次生成代码
## Data Processing
Use pandas to process the CSV file and generate statistics.

# ✅ 提供预置脚本
## Data Processing
Run the analysis script:
```bash
python scripts/analyze_data.py input.csv --output report.json
```
```

### 5.3 模块化设计

**单一职责**：
- ❌ 一个 Skill 做所有事情
- ✅ 多个 Skills 各司其职

```
skills/
├── code-review/          # 代码审查
├── test-generation/      # 测试生成
├── documentation/        # 文档生成
└── deployment/           # 部署流程
```

**组合使用**：
```
User: "审查代码并生成测试"
Claude:
  1. 触发 code-review skill
  2. 触发 test-generation skill
  3. 组合两者完成任务
```

### 5.4 持续迭代

**流程**：
1. 创建基础版本
2. 实际使用测试
3. 收集反馈
4. 优化改进
5. 重复循环

**关键**：Skills 是活的文档，需要持续优化。

---

## 6. 注意事项

### 6.1 安全建议

- ✅ 只使用可信的 Skills
- ✅ 审查第三方 Skills 的代码
- ✅ 不要硬编码敏感信息
- ✅ 使用环境变量存储密钥

### 6.2 使用建议

- ✅ 优先使用官方 Skills
- ✅ 建立内部审查流程
- ✅ 版本控制和文档
- ✅ 定期更新维护

### 6.3 性能优化

- ✅ 保持 SKILL.md 简洁
- ✅ 使用渐进式披露
- ✅ 提供预置脚本
- ✅ 避免冗余内容

---

## 附录：Skills、Plugins、MCP 对比

### A.1 三大核心概念对比

| 概念 | 比喻 | 作用 | AI如何使用 |
|------|------|------|-----------|
| **Skills** | 📘 工作手册 | 告诉AI"怎么做" | 自动加载相关手册 |
| **Plugins** | 🔌 专业顾问 | 提供专业建议 | 自动调用顾问 |
| **MCP** | 🧰 外部工具 | 连接外部世界 | 自动使用工具 |

### A.2 核心区别详解

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

### A.3 实际协作示例

**场景：开发Python API**

AI会自动组合使用：
1. **读取Skills手册** → 知道Python最佳实践
2. **调用Plugins顾问** → python-development插件（Python专家）
3. **使用MCP工具** → web-search（搜索文档）、web-reader（读取网页）

**你不需要手动选择**，AI会自动判断需要什么！

### A.4 何时使用哪个？

| 任务类型 | 主要使用 | 辅助使用 |
|---------|---------|---------|
| **开发功能** | Plugins (feature-dev) | Skills (开发流程) |
| **学习新技术** | MCP (web-search) | Plugins (语言专家) |
| **代码审查** | Plugins (code-review) | Skills (审查标准) |
| **自动化测试** | MCP (playwright) | Plugins (测试专家) |

### A.5 相关文档

- [Claude Code自动安装指南](./Claude%20Code自动安装指南.md) - 快速安装配置
- [UI设计资源](./UI设计资源.md) - aura.build使用指南
- [GitHub - anthropics/skills](https://github.com/anthropics/skills)

---

## Sources

- [Claude Skills are awesome, maybe a bigger deal than MCP - Simon Willison](https://simonwillison.net/2025/Oct/16/claude-skills/)
- [Claude Agent Skills: A First Principles Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)
- [How We Use Claude Code Skills to Run 1,000+ ML Experiments a Day - Sionic AI](https://huggingface.co/blog/sionic-ai/claude-code-skills-training)
- [Extending Claude's capabilities with skills and MCP servers](https://claude.com/blog/extending-claude-capabilities-with-skills-mcp-servers)
- [Skills explained: How Skills compares to prompts, Projects, MCP, and subagents](https://claude.com/blog/skills-explained)
- [Equipping agents for the real world with Agent Skills - Anthropic Engineering](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Agent Skills Overview - Anthropic Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)

---

**核心理念**：**所有工作流都值得用 Skills 重写一遍！** 🚀
