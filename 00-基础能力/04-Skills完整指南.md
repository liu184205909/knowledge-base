# Skills 完整指南

> **推荐 → 使用 → 开发** | Skills模块化能力完整手册

---

## 推荐Skills

**核心原则**: 优先使用现成Skills，需要时再创建

### 官方推荐

| Skill | 功能 | 来源 |
|-------|------|------|
| **Superpowers** | 全流程开发增强 | GitHub 1.6万Star |
| **planning-with-files** | 基于文件的任务规划 | 社区 |
| **skill-creator** | 创建Skills的元Skill | 官方 |

### 社区热门

**文档处理类**:
- `pdf`: PDF合并/拆分/文本提取
- `docsx`: Word合同模板生成
- `pptx`: PPT自动生成+品牌规范

**数据分析类**:
- `xlsx`: 非标表格处理（外贸PI单、财务报表）
- `brand-guidelines`: 品牌设计规范

**研究创作类**:
- `research-to-diagram`: 一句话调研+自动画图
- `article-copilot`: 素材→正文自动化

**个性化AI**:
- `ai-partner`: 基于记忆的AI伴侣

### 获取方式

**方法1: AI帮你安装**
```
"帮我安装Superpowers skill"
```

**方法2: 手动克隆**
```bash
cd ~/.claude/skills
git clone https://github.com/anthropics/superpowers.git
```

---

## 如何使用Skills

### 自动触发

Claude会根据description中的触发关键词自动识别并加载Skill：

```
用户: "帮我分析这个产品"
→ Claude识别到关键词"分析产品"
→ 自动加载product-analysis Skill
→ 执行分析流程
```

### 手动指定

```
"使用pdf skill合并这些文件"
"用research-to-diagram skill画个架构图"
```

### Skills位置

| 位置 | 作用 | 适用场景 |
|-----|------|---------|
| `~/.claude/skills/` | 全局Skills | 所有项目通用 |
| `.claude/skills/` | 项目级Skills | 项目特定需求 |

---

## 什么时候需要创建Skill？

| 信号 | 说明 | 示例 |
|-----|------|------|
| 反复解释同一件事 | 把规则打包成Skill | "每次都要说导出PDF的格式" |
| 需要特定知识/模板 | 固化为Skill | "合同模板、品牌规范" |
| 多流程协同完成 | 用主控Skill串联 | "内容生产流水线" |

**判断标准**:
- ✅ 同一件事解释3次以上
- ✅ 有固定模板/规范可遵循
- ✅ 多步骤流程需要标准化

---

## Skills结构

```
📁 skill-name/
├── SKILL.md           # 核心指令文件（必需）
├── scripts/           # 可执行脚本（可选）
└── references/        # 参考文档（可选）
```

**SKILL.md模板**:

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

## 创建新Skill

### 方式1: 让AI帮你创建（推荐）

```
"帮我创建一个[XX功能]的Skill"
```

AI会自动：
1. 创建skill目录
2. 生成SKILL.md模板
3. 填写description和执行流程

### 方式2: 手动创建

```bash
mkdir -p ~/.claude/skills/my-skill
# 创建SKILL.md，按上面的模板填写
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

**用途**: 代码审查、长时间任务，不污染主对话上下文

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

**核心原则**：
- 单一职责（一个Skill只做一件事）
- SKILL.md保持简洁（<2000 tokens）
- 复杂内容放references/

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

**方法2: 云同步**
将`~/.claude/skills`放入iCloud/OneDrive/坚果云同步文件夹

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

**Q: Skills冲突怎么办？**
- 全局Skills和项目级Skills可以共存
- 项目级Skills优先级更高

---

**总结**: 推荐Skills → 开箱即用 → 需要时再创建 → 持续迭代优化
