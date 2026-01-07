# Claude Skills 核心概念

**创建者**: 花生 × Claude Code
**最后更新**: 2026-01-07
**版本**: v6.0（精简版）

---

## 🎯 核心价值

> **Claude Skills = 个人经验的固化和标准化工作的 SOP**

- ✅ **经验固化**：将实战经验固化成可复用的知识库
- ✅ **标准SOP**：将工作流程标准化，确保每次执行符合标准
- ✅ **AI自动执行**：Claude自动识别场景，按标准执行
- ✅ **持续迭代**：随着经验积累，不断优化Skills

---

## 1. 一句话定义

**Skills 是模块化的能力包，包含指令、元数据和可选资源（脚本、模板），让 Claude 在需要时自动加载和使用。**

通俗理解：Skills 就像是给 Claude 准备的"工作手册库"：
- 平时只知道手册目录（低成本）
- 需要时才打开具体章节（按需加载）
- 包含详细步骤和工具脚本（完整指导）

---

## 2. 技术架构

### 2.1 文件结构

```
📁 skill-name/
├── SKILL.md           # 核心指令文件（必需）
├── scripts/           # 可执行脚本（可选）
├── references/        # 参考文档（可选）
└── assets/            # 模板和资源（可选）
```

### 2.2 三层加载机制（渐进式披露）

| 层级 | 内容 | Tokens | 加载时机 |
|------|------|--------|---------|
| **Level 1** | 元数据（name, description） | ~100 | 启动时加载 |
| **Level 2** | 指令（SKILL.md正文） | 2,000-5,000 | 匹配时加载 |
| **Level 3** | 资源（脚本、参考文档） | 无限制 | 按需加载 |

**核心优势**：
- 可安装数十个Skills但启动时<1,000 tokens
- 避免不必要的token消耗
- 只有脚本输出进入Context

---

## 3. 如何创建 Skills

### 3.1 SKILL.md 模板

```yaml
---
name: my-skill
description: |
  简洁描述这个技能的作用和使用场景
  包含触发关键词和使用说明
---

# Skill 名称

## 核心功能
简要说明这个技能做什么...

## 快速开始
### 基础用法
最简单的使用方式...

### 高级用法
复杂场景的说明，见 [ADVANCED.md](references/ADVANCED.md)

## 示例
展示一个实际使用案例...
```

### 3.2 Description 设计要点

```yaml
# ❌ 太简短
description: Code review

# ✅ 清晰具体
description: |
  Review code for security vulnerabilities, performance issues.
  Use when user asks to review code, check for bugs.
  Includes scripts for linting, security scanning.
```

**包含要素**：核心功能 + 触发场景 + 关键词 + 可用工具

---

## 4. 典型应用场景

| 场景 | 示例 | 价值 |
|------|------|------|
| **企业标准化** | 客户支持、代码审查 | 标准化流程，质量一致 |
| **研发实验** | 实验前咨询、实验后沉淀 | 避免踩坑，知识共享 |
| **开发工作流** | 测试生成、部署检查 | 自动化检查，减少错误 |

---

## 5. 开发最佳实践

### 5.1 核心原则

**自然语言优先**：
- Skills核心优势在于用自然语言连接工作流
- 你只需告诉AI"我想达成什么目标"，AI自己规划步骤

**渐进式披露**：
```markdown
# SKILL.md - 保持简洁 (<2000 tokens)

## Quick Start
Basic instructions...

## Advanced Usage
For complex scenarios, see [ADVANCED.md](references/ADVANCED.md)
```

**脚本优于生成代码**：
- Token消耗低（仅输出消耗）
- 确定性强（预先测试过）
- 可复用性高

### 5.2 单一职责原则

```
✅ 拆分为多个 Skills:
skills/
├── code-review/         # 只负责代码审查
├── test-generation/     # 只负责测试生成
└── documentation/       # 只负责文档生成
```

### 5.3 版本管理

```bash
git add skills/my-skill/
git commit -m "feat(my-skill): add new feature"
```

---

## 6. Skills 的真实价值

### 三大核心优势

**1. 零代码、自然语言编写**
- 入门门槛极低，智能上限极高
- 纯自然语言编写，非技术人员可用

**2. 突破预设限制**
- 能在统一对话框接收各类数据
- AI自主调用其他Skill或编写转换脚本
- 动态应对边缘问题

**3. 多Skills自由联用**
- N个Skills可以应对远超N的应用场景
- 示例：brand-guidelines + pptx = 符合品牌规范的PPT

### 创业机会

| 开发方式 | 周期 | 成本 | 智能上限 |
|---------|------|------|---------|
| 传统开发 | 数周 | 高 | 受限 |
| **Skills方式** | 几小时 | 极低 | 直逼通用Agent |

---

## 7. 什么时候应该用 Skills？

### 信号1：反复解释同一件事
"帮我写技术文档" → "不对，格式是这样的..." → "代码示例要这个模板..."

**解决方案**：把这些规则打包成一个Skill

### 信号2：需要特定知识/模板
技术文档写作需要代码规范、术语表、模板

**解决方案**：通用Agent + 垂直知识 = 场景Context

### 信号3：多流程协同完成
竞品分析 = 检索数据 + 数据分析 + 制作PPT

**解决方案**：多个Skill模块，智能调用

---

## 8. Skills vs MCP vs Plugins

| 概念 | 比喻 | 作用 | AI如何使用 |
|------|------|------|-----------|
| **Skills** | 📘 工作手册 | 告诉AI"怎么做" | 自动加载相关手册 |
| **Plugins** | 🔌 专业顾问 | 提供专业建议 | 自动调用顾问 |
| **MCP** | 🧰 外部工具 | 连接外部世界 | 自动使用工具 |

**关系**：
- MCP = AI时代的API标准 = 工具连接器
- Skills = 工作流标准化 = 可以通过MCP挂载外部工具
- Skills和MCP**不是替代关系**，Skills是MCP的补充

---

## Sources

- [Claude Skills are awesome - Simon Willison](https://simonwillison.net/2025/Oct/16/claude-skills/)
- [Skills Deep Dive - Lee Han Chung](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)
- [Agent Skills终极指南 - 一泽Eze](https://mp.weixin.qq.com/s/dXtz1BZm5oCWfPdKDFLDgw)
- [Extending Claude's capabilities - Anthropic](https://claude.com/blog/extending-claude-capabilities-with-skills-mcp-servers)
- [Agent Skills Overview - Anthropic Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)

---

**核心理念**: **Claude Skills 的价值，还是被大大低估了** ✨
