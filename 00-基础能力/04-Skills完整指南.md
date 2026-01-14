# Skills 完整指南

> **开发 + 同步 + 推荐** | 当需要创建新Skill时参考

---

## 什么时候需要创建Skill？

| 信号 | 说明 |
|-----|------|
| 反复解释同一件事 | 把规则打包成Skill |
| 需要特定知识/模板 | 固化为Skill |
| 多流程协同完成 | 用主控Skill串联 |

---

## Skills结构

```
📁 skill-name/
├── SKILL.md           # 核心指令文件（必需）
├── scripts/           # 可执行脚本（可选）
└── references/        # 参考文档（可选）
```

---

## SKILL.md模板

```yaml
---
name: skill-name
description: |
  功能描述。使用此技能当用户需要:
  1. 场景1
  2. 场景2

  触发关键词: "关键词1"、"关键词2"

  输出: 产出说明。
---

# Skill名称

## 核心功能
简要说明...

## 执行流程
Step 1: ...
Step 2: ...
```

### Description设计（最重要）

**Description是主要触发机制，必须包含**：
- 功能描述
- 使用场景（1、2、3列表）
- 触发关键词
- 输出说明

```yaml
# ✅ 正确
description: |
  产品分析技能。使用此技能当用户需要:
  1. 分析产品市场潜力
  2. 评估竞争情况

  触发关键词: "分析XX产品"、"评估XX产品"

  输出: 100分制评分报告。

# ❌ 错误
description: Product analysis
```

---

## 高级功能

### 热重载
修改SKILL.md后保存即生效，无需重启。

### Fork子代理
```yaml
---
name: code-review
context: fork  # 独立上下文运行
allowed-tools:
  - Read
  - Grep
---
```

### 语言配置
```yaml
---
name: chinese-assistant
language: chinese  # 用中文回复
---
```

---

## 开发建议

| 阶段 | 时间 | 内容 |
|-----|------|------|
| MVP | 1-2小时 | 单个SKILL.md |
| 增强 | 1-2天 | 添加脚本 |
| 完整 | 1-2周 | 多Skills组合 |

**原则**：
- 单一职责（一个Skill只做一件事）
- SKILL.md保持简洁（<2000 tokens）
- 复杂内容放references/

---

## Skills位置

| 位置 | 作用 |
|-----|------|
| `~/.claude/skills/` | 全局Skills |
| `.claude/skills/` | 项目级Skills |

---

## 创建新Skill

**方式1: 让AI帮你创建**
```
"帮我创建一个[XX功能]的Skill"
```

**方式2: 手动创建**
```bash
mkdir -p ~/.claude/skills/my-skill
# 创建SKILL.md，按上面的模板填写
```

---

## 同步Skills（多电脑）

```bash
# 方法1: Git（推荐）
cd ~/.claude/skills
git init
git remote add origin https://github.com/yourname/my-skills.git
git push -u origin main

# 新电脑克隆
git clone https://github.com/yourname/my-skills.git ~/.claude/skills
```

---

## 推荐Skills

| Skill | 功能 | 来源 |
|-------|------|------|
| **Superpowers** | 全流程开发增强 | GitHub 1.6万Star |
| **planning-with-files** | 基于文件的任务规划 | 社区 |
| **skill-creator** | 创建Skills的元Skill | 官方 |

---

## 常见问题

**Q: Skill不生效？**
- 检查SKILL.md格式（YAML frontmatter）
- 检查description是否包含触发关键词
- 重启Claude Code会话

**Q: 如何调试？**
```
"测试my-skill skill"
```

---

**核心原则**: 不要重复造轮子，优先使用现成Skills，需要时再创建。
