# 多AI协同开发完全指南

> **并行开发的终极方案** | 从理论到实战 | 2026-01-04

---

## 🎯 这个文档适合你吗？

### 使用场景检查清单

**请先回答以下问题**：

- ✅ 需要开发**3-10个独立功能**
- ✅ 需要**人工Review**代码质量
- ✅ 任务类型**多样**（前端/后端/测试/文档）
- ✅ 希望**图形界面**管理多AI
- ✅ **不熟悉**Git Worktree原理
- ❌ 不需要处理50+个重复性任务
- ❌ 不需要完全无人值守运行

**如果以上大部分符合 → 这篇文档适合你！**

**如果不符**：
- 任务数量>50个？→ 查看[自动化流水线案例](./04-自动化流水线-CSV+MCP系统.md)
- 单一复杂功能？→ 查看[feature-dev开发流程](./02-单AI开发-feature-dev开发流程.md)
- 全栈流水线开发？→ 查看[Vibe-Coding多AI协作](./01-思维方式-Vibe-Coding流水线思维.md)

---

### 与其他方式的区别

| 维度 | 本文档（多AI协同） | 自动化流水线 | feature-dev |
|------|------------------|------------|-------------|
| **任务数量** | 3-10个功能 | 50-151个任务 | 单个复杂功能 |
| **工具** | Schaltwerk（图形界面） | CSV+MCP（命令行） | Claude Code |
| **隔离机制** | Git Worktree自动 | CSV外挂记忆 | Plan模式 |
| **人工干预** | 需要Review | 无需干预 | 每阶段确认 |
| **技术门槛** | 低（图形界面） | 高（需MCP+测试） | 中（需理解流程） |
| **效率提升** | 3-10倍 | 10-15倍 | 质量↑2-3倍 |
| **适合** | 大部分用户 | 高级用户 | 所有用户 |

---

### 🚀 不确定是否适合？

→ 查看 [AI开发方式快速导航](./README.md) 的决策树

---

## 🎯 核心理念

> **一个AI太慢？让10个AI同时干活！**

**传统开发**：
```
需求1 → 开发 → 测试 → 上线
需求2 → 等待 → 开发 → 测试 → 上线
需求3 → 等待 → 等待 → 开发 → 测试 → 上线
总耗时：3倍时间
```

**多AI协同**：
```
需求1 → AI 1 ─┐
需求2 → AI 2 ─┼→ 同时开发 → 同时测试 → 同时上线
需求3 → AI 3 ─┘
总耗时：1倍时间
```

---

## 📊 四种并行方式对比

### 方式0：Cursor/Claude Code多窗口（常见误区）⚠️

**用户常见问题**：
> "我用Cursor打开多个窗口，每个窗口用不同模型，不也实现并行了吗？"
> "我在Claude Code IDE开多个New Session，不也是独立会话吗？"

**致命问题：缺少代码隔离**

```bash
# Cursor多窗口的真实情况
项目目录：my-project/
├─ src/
├─ package.json
└─ tsconfig.json

Cursor窗口1（Claude）：修改 src/user.ts
Cursor窗口2（GPT-4）：修改 src/user.ts  ← 覆盖窗口1的改动！
Cursor窗口3（Gemini）：修改 src/user.ts ← 覆盖窗口2的改动！

→ 💥 三个AI互相覆盖代码
→ ❌ 没有冲突检测
→ ❌ 后面执行的覆盖前面的
→ ❌ 无法回滚和Review
```

**vs Schaltwerk的对比**：

| 维度 | Cursor多窗口 | Schaltwerk | 差距 |
|------|------------|-----------|------|
| **代码隔离** | ❌ 共享同一目录 | ✅ Git Worktree自动隔离 | **致命差距** |
| **冲突处理** | ❌ 手动Git管理（2小时） | ✅ 自动检测+Diff视图（5分钟） | **24倍差距** |
| **并行数量** | ⚠️ 2-3个（再多就乱） | ✅ 3-10个（图形界面） | 3-5倍 |
| **进度监控** | ❌ 切换窗口查看 | ✅ 统一控制面板 | 效率↓ |
| **合并代码** | ❌ 手动解决冲突 | ✅ 一键Merge/Discard | **高风险** |
| **失败处理** | ❌ 手动检查每个窗口 | ✅ 实时显示错误日志 | 难度高 |
| **适用场景** | 2-3个简单任务 | 3-10个复杂任务 | 本质区别 |

**什么时候可以用Cursor多窗口？**

```bash
✅ 适合场景：
- 2-3个简单独立任务（如：写3个独立组件）
- 你熟悉Git Worktree，愿意手动创建隔离环境
- 愿意花2小时管理，换取省5分钟安装工具

❌ 不适合场景：
- 5个以上任务（你会手忙脚乱）
- 任务有依赖关系（需要手动管理顺序）
- 需要大量修改文件（Git冲突噩梦）
- 不熟悉Git Worktree（学习成本高）
```

**如果要手动模拟Schaltwerk（不推荐）**：

```bash
# 你需要手动做Schaltwerk自动做的事：
1. 为每个AI创建Git分支
   git checkout -b feature/task1
   git checkout -b feature/task2
   git checkout -b feature/task3

2. 为每个AI创建Worktree（隔离环境）
   git worktree add ../task1 feature/task1
   git worktree add ../task2 feature/task2
   git worktree add ../task3 feature/task3

3. 打开3个Cursor窗口，分别打开3个目录
   Cursor 1: ../task1
   Cursor 2: ../task2
   Cursor 3: ../task3

4. 手动监控进度、手动解决冲突、手动合并

→ 时间成本：2小时管理 + 1小时开发 = 3小时
vs Schaltwerk：5分钟管理 + 30分钟开发 = 35分钟
```

**结论**：Cursor多窗口 = "手动版Schaltwerk"，但效率差5倍。

---

### 方式1：手动多开终端（Boris Cherny方式）

**特点**：
- 开5-10个终端窗口
- 每个终端运行一个AI
- 用系统通知管理

**优点**：
- ✅ 完全免费
- ✅ 灵活性高
- ✅ 不需要额外工具

**缺点**：
- ❌ 需要手动管理Git冲突
- ❌ 容易混乱
- ❌ 需要一定Git知识

**适合**：高级用户，熟悉Git和终端

---

### 方式2：Schaltwerk自动化（推荐⭐⭐⭐⭐⭐）

**特点**：
- 图形界面管理
- 基于Git Worktree自动隔离
- 同时运行10个AI Agent

**优点**：
- ✅ 零学习成本
- ✅ 自动处理冲突
- ✅ GitHub风格Diff视图
- ✅ 一键合并或销毁

**缺点**：
- ❌ 需要安装工具
- ❌ 仅支持Mac/Windows（Linux待定）

**适合**：所有用户，特别是初学者

---

### 方式3：Vibe-Coding三线并进（方法论）

**特点**：
- 飞书（需求C）→ Claude Code（需求B）→ Cursor（需求A）
- 利用AI生成间隙切换
- 三线并进思维

**优点**：
- ✅ 最大化时间利用
- ✅ 不同抽象层级并行
- ✅ 适合全栈开发

**缺点**：
- ❌ 需要训练多线思维
- ❌ 大脑容易过载
- ❌ 需要手动管理

**适合**：有经验的独立开发者

---

## 🚀 Schaltwerk完整教程

### 安装

**Mac**：
```bash
brew install --cask 2mawi2/tap/schaltwerk
```

**Windows**：
- 下载地址：https://link.bytenote.net/5MHVcn
- 解压后双击安装

### 配置

**第一次启动**：
1. 打开Schaltwerk
2. 自动扫描已安装的CLI（Claude Code/Codex/Gemini）
3. 如未安装，按提示安装对应CLI

### 使用流程

#### 步骤1：写Spec（需求规格）

打开项目，在Schaltwerk中写Spec：

```markdown
## Spec 1: 给登录页加验证码

### 目标
防止暴力破解，提高安全性

### 用户场景
用户登录时需要输入图形验证码

### 成功指标
- 验证码识别成功率 > 90%
- 登录耗时增加 < 2秒

### 技术要求
- 使用Canvas生成验证码
- 后端验证接口
- 失败3次后锁定账号

### 边界情况
- 验证码过期时间
- 刷新验证码限制
- 无障碍访问支持
```

#### 步骤2：配置Agent

为每个Spec配置Agent：

```
Agent 1:
- CLI: Claude Code
- 提示词: 你是前端专家，负责UI和交互
- 分支: feature/login-captcha-frontend

Agent 2:
- CLI: Claude Code
- 提示词: 你是后端专家，负责API和验证逻辑
- 分支: feature/login-captcha-backend

Agent 3:
- CLI: Gemini
- 提示词: 你是测试专家，负责测试用例
- 分支: feature/login-captcha-test
```

#### 步骤3：启动Agent

点击"Start Agent"，Schaltwerk会：
1. 为每个Agent创建Git Worktree（独立工作树）
2. 打开对应终端窗口
3. AI开始并行工作

#### 步骤4：等待完成

你可以：
- ☕ 喝咖啡
- 📱 看进度条
- 👀 观察AI工作

#### 步骤5：Review合并

完成后，Schaltwerk显示Diff视图：
```
Agent 1: ✓ 完成（3个文件）
├─ src/components/Captcha.tsx (新增)
├─ src/pages/Login.tsx (修改)
└─ src/api/auth.ts (修改)

Agent 2: ✓ 完成（2个文件）
├─ src/api/captcha.ts (新增)
└─ server/routes/auth.ts (修改)

Agent 3: ✓ 完成（5个测试）
└─ tests/captcha.test.ts (新增)
```

**操作**：
- ✅ 行就合并（Merge）
- ❌ 不行就销毁（Discard Worktree）

---

## 💡 实战场景

### 场景1：Bug Bash（批量修Bug）

**需求**：同时修复5个Bug

**传统方式**：
```
Bug 1: 修复 → 测试 → 提交 (1小时)
Bug 2: 等待 → 修复 → 测试 → 提交 (1小时)
Bug 3: 等待 → 等待 → 修复 → 测试 → 提交 (1小时)
...
总耗时：5小时
```

**Schaltwerk方式**：
```bash
# 写5个Spec
Spec 1: 修复登录超时Bug
Spec 2: 修复支付失败Bug
Spec 3: 修复数据不一致Bug
Spec 4: 修复UI错位Bug
Spec 5: 修复内存泄漏Bug

# 启动5个Agent（并行）
# 1小时后全部完成

# Review并合并
总耗时：1小时（提速5倍！）
```

---

### 场景2：功能并行开发

**需求**：同时开发3个独立功能

**Spec配置**：
```markdown
## Spec 1: 用户评论功能

### 前端部分
- 评论列表组件
- 评论输入框
- 点赞/回复功能

### 后端部分
- 评论API
- 实时通知
- 内容审核

---

## Spec 2: 数据导出功能

### 功能
- 导出为Excel/CSV
- 支持大数据量（10万+）
- 异步任务+进度条

---

## Spec 3: 搜索优化

### 优化点
- 添加Elasticsearch
- 搜索结果高亮
- 搜索历史记录
```

**Agent配置**：
```
Agent 1 (Claude Code): 评论功能（前端+后端）
Agent 2 (Claude Code): 数据导出功能
Agent 3 (Codex): 搜索优化（需要更深的技术能力）
```

---

### 场景3：Vibe-Coding + Schaltwerk（终极组合）

**场景**：全栈开发一个完整功能

**Vibe-Coding三线**：
```
左屏（飞书）：写下一个需求的Spec
中屏（Schaltwerk Agent 1）：当前需求的前端
右屏（Schaltwerk Agent 2）：上一个需求的后端
```

**工作流**：
```
1. 左屏：写需求C的Spec（5分钟）
2. 中屏：Agent 1在做需求B的前端（AI生成中）
3. 右屏：Agent 2在做需求A的后端（Review代码）

需求A的后端Review完成 → 合并 → 启动Agent 3做需求C
需求B的前端完成 → Review → 启动Agent 4做需求C
需求C的Spec写完 → 启动Agent 5做需求D

→ 永远有3个AI在工作，你在不同抽象层级间切换
```

---

## 🎓 进阶技巧

### 技巧1：合理分配AI

根据任务难度分配不同的AI：

```
简单任务 → Gemini/Claude 3.5（快速便宜）
中等任务 → Claude Code（Sonnet 4.5）
复杂任务 → Claude Code（Opus 4.5）
```

### 技巧2：使用不同的提示词

为不同Agent设置专长：

```markdown
# Agent 1: 前端专家
你是React专家，专注于：
- 组件设计
- 用户体验
- 性能优化
- 使用TypeScript + Tailwind

# Agent 2: 后端专家
你是Node.js专家，专注于：
- API设计
- 数据库优化
- 安全性
- 使用Express + PostgreSQL

# Agent 3: 测试专家
你是测试工程师，专注于：
- 测试覆盖率
- 边界情况
- 性能测试
- 使用Jest + Cypress
```

### 技巧3：设置依赖关系

某些功能有依赖关系：

```bash
# 错误做法：同时启动
Agent 1: 开发API（需要数据库Schema）
Agent 2: 开发数据库Schema
→ Agent 1会失败！

# 正确做法：分批启动
第一批：
- Agent 1: 数据库Schema
- Agent 2: 前端Mock数据

第二批（等第一批完成）：
- Agent 3: API开发
- Agent 4: 前端对接
```

### 技巧4：监控进度

Schaltwerk实时显示每个Agent：
- ✓ 已完成文件数
- 🔄 正在进行的文件
- ⏱️ 预计剩余时间
- 📊 资源占用情况

---

## ⚠️ 常见问题

### Q1: 两个Agent修改了同一个文件怎么办？

**A**: Schaltwerk会自动检测冲突，在Diff视图中标记：

```
⚠️ 冲突文件：src/api/user.ts

Agent 1 的改动：
+ 新增：getUserById()

Agent 2 的改动：
+ 新增：updateUser()

解决方法：
1. 手动合并（保留两部分改动）
2. 选择某一个Agent的版本
3. 重新分配任务（避免同时修改）
```

### Q2: Agent失败了怎么办？

**A**: 有三种处理方式：

```bash
# 方式1：查看错误日志
Schaltwerk显示Agent终端的错误信息
→ 手动修复后重新启动

# 方式2：销毁Worktree
放弃这个Agent的改动
→ 重新分配给其他Agent

# 方式3：切换到手动开发
Schaltwerk打开对应文件夹
→ 你手动完成剩余工作
```

### Q3: 能否同时使用Claude Code和Gemini？

**A**: 可以！Schaltwerk支持任意CLI组合：

```
Agent 1: Claude Code (前端)
Agent 2: Claude Code (后端)
Agent 3: Codex (架构)
Agent 4: Gemini (测试)
Agent 5: Claude Code (文档)
```

### Q4: 如何保证代码质量？

**A**: 三重保障：

```
1. AI自带验证（feature-dev 7阶段）
   - 每个Agent内部遵循开发流程

2. 人工Review（Diff视图）
   - 你最后Review所有改动

3. 自动化测试
   - CI/CD自动运行测试套件
```

---

## 📊 效率对比

| 场景 | 传统开发 | 单AI | Schaltwerk (3-AI) | Schaltwerk (10-AI) |
|------|---------|------|-------------------|-------------------|
| **5个Bug** | 5小时 | 3小时 | 1小时 | 30分钟 |
| **3个功能** | 3天 | 1.5天 | 8小时 | 4小时 |
| **10个任务** | 2周 | 1周 | 2天 | 1天 |
| **提速比** | 1x | 1.7x | 3-5x | 5-10x |

---

## 🔗 相关文档

### 多AI开发进阶路径

**Level 1: 单AI开发**
- [feature-dev开发流程](./02-单AI开发-feature-dev开发流程.md) - 单AI深度开发
- 适用：单一复杂功能
- 效率：质量↑2-3倍

**Level 2: 多AI协同（本文档）⭐ 推荐入门**
- 工具：Schaltwerk
- 适用：3-10个独立功能
- 效率：3-10倍
- 门槛：低（图形界面）

**Level 3: 自动化流水线**
- [自动化流水线案例](./04-自动化流水线-CSV+MCP系统.md) - CSV+MCP系统
- 适用：50-151个重复性任务
- 效率：10-15倍
- 门槛：高（需测试基础）

**Level 4: 流水线思维**
- [Vibe-Coding多AI协作](./01-思维方式-Vibe-Coding流水线思维.md) - 三线并进思维
- 适用：全栈开发
- 效率：10-15倍
- 门槛：中（需训练思维）

### 工具相关
- [01-claude code安装指南](../../00-基础能力/01-Claude-Code安装配置.md) - Schaltwerk工具介绍
- [应用产品开发需求发现指南](../01-产品设计/应用产品开发需求发现指南.md) - 需求发现方法

---

## 📝 总结

### 何时使用多AI协同？

✅ **推荐使用**：
- 3个以上独立任务
- 紧急项目（需要提速）
- 批量Bug修复
- 大型重构

❌ **不推荐使用**：
- 单一简单任务
- 需要深度思考的架构设计
- 学习新技术（会打乱思路）

### 最佳实践

1. **写好Spec**（最重要！）
   - Spec越清晰，AI完成度越高

2. **合理分配任务**
   - 独立任务并行，依赖任务串行

3. **保持Review习惯**
   - AI也会犯错，最后一定要Review

4. **从3个Agent开始**
   - 不要一开始就用10个，循序渐进

---

**创建时间**: 2026-01-04
**当前版本**: v1.0
**文档状态**: ✅ 生产就绪

**让10个AI同时为你工作！** 🚀
