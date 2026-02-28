# Ralph Wiggum：Claude Code 官方自动迭代插件

> **"让 Claude 不断尝试，直到成功为止"**

---

## 📋 文档定位

**Ralph Wiggum 是什么？**
- 官方 Claude Code 插件
- 自动循环执行：执行 → 失败 → 分析 → 再执行 → 成功
- 基于停止钩子（Stop Hook）机制实现

**与其他工具的关系：**
- **vs feature-dev**：feature-dev 是开发流程（8阶段 SOP），Ralph Wiggum 是自动化工具
- **vs 自动化流水线**：自动化流水线处理多任务批处理，Ralph Wiggum 处理单任务多次迭代
- **vs Schaltwerk**：Schaltwerk 管理多 AI 并行，Ralph Wiggum 管理 AI 自动重试

**核心价值：**
- ✅ **自动循环**：无需手动复制错误信息重新提问
- ✅ **智能理解**：Claude 能理解错误并自动调整策略
- ✅ **可控制**：设置最大迭代次数，避免无限循环
- ✅ **可观测**：实时查看每次迭代的执行过程

**核心理念：从传统流程到自动闭环**

**传统流程**（人工驱动）：
```
人类发现问题 → 写需求 → AI写代码 → 人类验证
```

**Ralph Wiggum 流程**（AI 自动闭环）：
```
AI自动发现问题 → 自动修复 → 自动写文档 → 自动写代码
→ 自动测试 → 自动重构 → 再测试 → 通过后自动提交
```

**真实案例**：OpenClaw 作者 Peter Steinberger 曾在一天内提交 **627 次代码**，平均每 2 分钟一次。这不是人手敲代码，而是 AI 驱动的自动化流水线在工作。每个循环 1-2 分钟，人类只定目标和边界，AI 自己完成闭环。

---

## 🎯 适用场景

### 最佳场景 ⭐

1. **Bug 修复**
   ```bash
   /ralph-loop "修复测试失败的 bug"
   ```
   - 场景：测试失败，需要反复修改代码
   - 优势：Claude 会自动分析错误日志，修改代码，重新运行测试

2. **补充测试**
   ```bash
   /ralph-loop "为 src/auth.ts 添加完整的单元测试"
   ```
   - 场景：需要逐步完善测试覆盖率
   - 优势：Claude 会不断添加测试用例，直到覆盖所有分支

3. **依赖迁移**
   ```bash
   /ralph-loop "将项目从 Webpack 5 迁移到 Vite"
   ```
   - 场景：大规模重构，需要多次尝试
   - 优势：Claude 会逐步解决迁移过程中的问题

4. **代码重构**
   ```bash
   /ralph-loop "重构 src/user.ts，提高代码可读性"
   ```
   - 场景：需要多轮迭代优化代码
   - 优势：Claude 会不断优化，直到满足质量标准

### 不适用场景 ❌

1. **需要人工决策的任务**
   - 例如：技术选型、架构设计
   - 原因：需要人工判断，AI 无法自动决策

2. **创意性任务**
   - 例如：设计 UI、撰写文案
   - 原因：没有明确的"成功"标准

3. **一次性任务**
   - 例如：读取文件、生成代码
   - 原因：不需要循环，直接执行即可

---

## 🔧 技术原理

### Stop Hook 机制

**什么是 Stop Hook？**
- Claude Code 退出前的拦截机制
- 类似于"临终遗言"：Claude 想要退出时，hook 会被触发
- Hook 可以修改 Claude 的行为，让它继续工作

**工作流程：**
```
用户: /ralph-loop "修复 bug"
  ↓
Claude: 执行任务（尝试1）
  ↓
Claude: "我已完成" → 尝试退出
  ↓
Stop Hook: 检查任务是否真正完成
  ↓
Hook: 未完成 → 阻止退出 → Claude 继续尝试
  ↓
Claude: 分析失败原因，调整策略
  ↓
Claude: 执行任务（尝试2）
  ↓
...（循环直到成功或达到最大次数）
```

**关键实现：**
- Hook 检查"完成承诺"（completion promise）
- 只有当 Claude 实现了承诺的目标，才允许退出
- 否则，Hook 会引导 Claude 继续尝试

---

## 📦 安装方法

### 前置要求

- ✅ 已安装 Claude Code
- ✅ 已配置 Claude Code API Key
- ✅ 项目已初始化 Git 仓库

### 安装步骤

1. **克隆 Ralph Wiggum 仓库**
   ```bash
   git clone https://github.com/anthropics/ralph-wiggum.git
   cd ralph-wiggum
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置 Claude Code Hooks**

   在项目根目录创建 `.claude/hooks.json`：
   ```json
   {
     "hooks": {
       "pre-stop": "node /path/to/ralph-wiggum/index.js"
     }
   }
   ```

   或者使用命令行配置：
   ```bash
   claude hooks set pre-stop "node /path/to/ralph-wiggum/index.js"
   ```

4. **验证安装**
   ```bash
   /ralph-loop "测试安装"
   ```

   如果看到 "Ralph Wiggum is running" 提示，说明安装成功。

---

## 🚀 使用方法

### 基础用法

```bash
/ralph-loop "任务描述"
```

**示例：**
```bash
/ralph-loop "修复所有失败的测试"
```

Claude 会：
1. 运行测试，查看失败情况
2. 分析错误原因
3. 修改代码
4. 重新运行测试
5. 如果还有失败，重复步骤 2-4
6. 直到所有测试通过

### 高级参数

```bash
/ralph-loop "任务描述" --completion-promise "完成标准" --max-iterations N
```

**参数说明：**

1. **`--completion-promise`（完成承诺）**
   - 定义"成功"的标准
   - Claude 必须实现这个承诺才能退出
   - 示例：
     ```bash
     /ralph-loop "添加测试" --completion-promise "所有函数都有单元测试"
     ```

2. **`--max-iterations`（最大迭代次数）**
   - 限制最大尝试次数
   - 避免无限循环
   - 默认值：50
   - 示例：
     ```bash
     /ralph-loop "优化代码" --max-iterations 10
     ```

### 实战示例

#### 示例 1：修复 Bug

```bash
/ralph-loop "修复测试失败的 bug" --completion-promise "所有测试通过"
```

**Claude 的执行过程：**
```
尝试1：运行测试 → 失败 → 分析日志
尝试2：修改代码 → 运行测试 → 仍然失败 → 调整策略
尝试3：再次修改 → 运行测试 → 成功！✅
```

#### 示例 2：补充测试

```bash
/ralph-loop "为 src/utils.ts 添加单元测试" --completion-promise "测试覆盖率 > 80%" --max-iterations 20
```

**Claude 的执行过程：**
```
尝试1：添加基础测试 → 覆盖率 40% → 继续添加
尝试2：添加边界测试 → 覆盖率 60% → 继续添加
尝试3：添加异常测试 → 覆盖率 85% → 成功！✅
```

#### 示例 3：依赖迁移

```bash
/ralph-loop "将项目从 Webpack 迁移到 Vite" --completion-promise "项目可以正常运行" --max-iterations 100
```

**Claude 的执行过程：**
```
尝试1：安装 Vite → 配置文件冲突 → 修改配置
尝试2：修改配置 → 构建错误 → 调整插件
尝试3：调整插件 → 运行成功 → 验证功能
尝试4：功能验证 → 成功！✅
```

---

## 💡 最佳实践

### 1. 明确完成标准

**❌ 不好的示例：**
```bash
/ralph-loop "优化代码"
```
- 问题：没有明确的"完成"标准
- 结果：Claude 可能无限优化，或者提前退出

**✅ 好的示例：**
```bash
/ralph-loop "优化代码" --completion-promise "代码复杂度 < 10，所有测试通过"
```
- 明确：具体的质量指标
- 结果：Claude 知道何时停止

### 2. 设置合理的迭代次数

**场景 1：简单任务**
```bash
/ralph-loop "修复测试" --max-iterations 10
```
- 简单任务不需要太多迭代

**场景 2：复杂任务**
```bash
/ralph-loop "迁移项目" --max-iterations 100
```
- 复杂任务需要更多尝试

**场景 3：不确定时**
```bash
/ralph-loop "重构代码" --max-iterations 50
```
- 使用默认值（50次）

### 3. 结合 feature-dev 流程

**在 feature-dev 的哪个阶段使用 Ralph Wiggum？**

- **阶段 5（测试）**：自动执行"测试 → 修复 → 再测试"循环
  ```bash
  /ralph-loop "运行测试并修复所有失败"
  ```

- **阶段 7（代码审查）**：自动执行"审查 → 修复 → 再审查"循环
  ```bash
  /ralph-loop "修复所有 linter 错误"
  ```

- **阶段 8（复盘）**：不适用（需要人工分析）

### 4. 监控执行过程

**实时查看迭代日志：**
```bash
# Ralph Wiggum 会在控制台输出每次迭代的过程
[迭代 1] 尝试修复测试...
[迭代 1] 测试失败：Expected 42, got 40
[迭代 2] 修改代码...
[迭代 2] 测试通过！✅
```

**如果卡住了：**
```bash
# 按 Ctrl+C 停止循环
# 分析问题，调整任务描述
# 重新运行
```

---

## 🔄 与其他工具的对比

### Ralph Wiggum vs feature-dev

| 维度 | Ralph Wiggum | feature-dev |
|------|-------------|-------------|
| **定位** | 自动化工具 | 开发流程（SOP） |
| **适用** | 单任务多次迭代 | 完整功能开发（8阶段） |
| **人工参与** | 低（自动化） | 高（需要决策） |
| **典型场景** | Bug 修复、补充测试 | 新功能开发 |

**关系：**
- Ralph Wiggum 是 feature-dev 的**加速器**
- 在 feature-dev 的**阶段 5（测试）**和**阶段 7（代码审查）**中使用
- feature-dev 提供框架，Ralph Wiggum 提供自动化

### Ralph Wiggum vs 自动化流水线

| 维度 | Ralph Wiggum | 自动化流水线 |
|------|-------------|-------------|
| **处理方式** | 单任务多次迭代 | 多任务批处理 |
| **并行度** | 串行（一次一个任务） | 并行（多个任务同时） |
| **适用** | 需要反复尝试的任务 | 重复性任务（50-151个） |
| **示例** | 修复 1 个 bug | 批量生成 100 个组件 |

**关系：**
- 互补关系，不是竞争
- Ralph Wiggum：深度迭代（1个任务，多次尝试）
- 自动化流水线：广度批处理（100个任务，一次性）

### Ralph Wiggum vs Schaltwerk

| 维度 | Ralph Wiggum | Schaltwerk |
|------|-------------|------------|
| **功能** | AI 自动重试 | 多 AI 管理 |
| **并行方式** | 串行（1个AI循环） | 并行（多个AI同时） |
| **隔离** | 不需要（同一环境） | 必须（Git Worktree） |
| **适用** | 单任务深度迭代 | 多任务并行开发 |

**关系：**
- 可以**结合使用**
- Schaltwerk 管理 3 个 AI 并行开发
- 每个 AI 使用 Ralph Wiggum 自动迭代
- 效果：3x 并行 + 自动循环 = 超级效率

---

## ⚠️ 注意事项

### 1. 避免无限循环

**问题：**
如果任务描述不清晰，Claude 可能永远无法完成

**解决方案：**
```bash
# 设置最大迭代次数
/ralph-loop "任务" --max-iterations 20
```

### 2. 明确完成标准

**问题：**
Claude 不知道何时停止，可能提前退出或无限优化

**解决方案：**
```bash
# 使用 --completion-promise 明确标准
/ralph-loop "优化代码" --completion-promise "测试通过，无 linter 错误"
```

### 3. 监控资源消耗

**问题：**
每次迭代都会调用 API，可能消耗大量 token

**解决方案：**
- 设置合理的 `--max-iterations`
- 监控 API 使用量
- 复杂任务考虑手动执行

### 4. 不要过度依赖

**问题：**
Ralph Wiggum 不是万能的，有些任务需要人工决策

**解决方案：**
- 明确哪些任务适合自动化（Bug 修复、补充测试）
- 哪些任务需要人工（架构设计、技术选型）

---

## 📚 参考资源

- **官方仓库**：https://github.com/anthropics/ralph-wiggum
- **介绍文章**：https://mp.weixin.qq.com/s/1DhUqeQlZOi4_Mt7hWysZw
- **实测文章**：https://mp.weixin.qq.com/s/IL9mg0X82KDuhA8mKzFShA
- **Claude Code 文档**：https://docs.claude.com/en/docs/claude-code

---

## 🎓 总结

**Ralph Wiggum 的核心价值：**
- ✅ 自动化循环：解放双手，让 AI 自己尝试
- ✅ 智能调整：Claude 能理解错误并调整策略
- ✅ 可控性：设置最大次数，避免无限循环
- ✅ 易集成：与 feature-dev、自动化流水线、Schaltwerk 互补

**何时使用 Ralph Wiggum？**
- ✅ Bug 修复、补充测试、依赖迁移、代码重构
- ❌ 技术选型、架构设计、创意任务

**如何高效使用？**
- ✅ 明确完成标准（`--completion-promise`）
- ✅ 设置合理次数（`--max-iterations`）
- ✅ 结合 feature-dev 流程（阶段 5、7）
- ✅ 监控执行过程，及时调整

---

**最后提醒：**
> Ralph Wiggum 是工具，不是银弹。它能让 AI 更高效，但不能替代人工决策。
> 明确场景、合理使用、监控过程，才能发挥最大价值。
