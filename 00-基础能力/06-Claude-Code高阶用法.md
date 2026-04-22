# Claude Code 高阶用法

> 来源：花叔《Claude Code从入门到精通》v2.0、Boris Cherny（Claude Code创建者）公开分享、51万行源码分析。仅收录非基础的高阶方法论。

---

## 一、三层模型：时间该花在哪

| 层次 | 内容 | 投入方式 | 回报 |
|------|------|----------|------|
| Prompt | 你说的话 | 每次对话都要投入 | 一次性 |
| Context | CLAUDE.md + 项目文件 | 写一次持续生效 | 复利 |
| Harness | Skills + Hooks + MCP | 搭一次永久运行 | 指数 |

**核心原则**：把时间花在构建 Context 和 Harness 上，而不是优化 Prompt。

---

## 二、CLAUDE.md 编写方法论

### 从护栏开始，不写手册

- Boris 团队的 CLAUDE.md 只有约 2500 tokens（~100行）
- **不要预设**：空文件开始，Claude 犯一次错就加一条规则
- **不要写 Claude 自己能从代码里读出来的东西**（如"这是一个React项目"）
- **不要写废话**（如"遵循最佳实践""写整洁代码"）

### 该写 vs 不该写

| 该写 | 不该写 |
|------|--------|
| Claude 猜不到的 Bash 命令 | 标准语言规范 |
| 与默认不同的代码风格偏好 | 文件逐一描述 |
| 测试命令和偏好的测试框架 | 详细 API 文档全文 |
| 项目架构决策和背景 | 频繁变化的信息 |
| 开发环境的坑（特殊环境变量） | "永远不要做X"（不给替代方案） |
| 常见陷阱和修复方式 | 用 @ 引用大文档（会吃上下文） |

### 反模式

- **不要用 @ 引用大文档**：每次会话都会被完整嵌入。正确做法是给路径："遇到FooBarError时，参阅 docs/troubleshooting.md"
- **不要只说"不要做X"**：Claude 觉得必须做X时会卡住。给替代方案："不要用 --foo-bar，改用 --baz"
- **不要写几千行的百科全书**：CLAUDE.md 太长会挤压干活的上下文空间

### 层级结构

```
~/.claude/CLAUDE.md          ← 全局级：个人通用偏好
./CLAUDE.md                  ← 项目级：检入git，团队共享
./src/CLAUDE.md              ← 子目录级：monorepo模块规则
```

### 迭代飞轮

```
Claude犯错 → 记录到CLAUDE.md → 下次不再犯 → 错误率持续降低
```

- Claude 非常擅长为自己编写规则——告诉它犯了什么错，它自己能写出精确的规则
- 三个月养出来的 CLAUDE.md 是最有价值的 AI 资产

---

## 三、六个常见坑

| 坑 | 表现 | 解法 |
|----|------|------|
| 一个会话什么都塞 | 上下文被塞满，Claude 对每个任务理解都浅 | 一个会话聚焦一个任务，做完 /clear |
| 反复纠正越改越偏 | 花在纠正上的时间比自己动手还多 | 纠正两次不行，果断 /clear 重来 |
| 看着像对的就接受 | 过几天发现边界情况 bug | 每一轮改动都实际运行验证 |
| 过度微操 | 每写一个文件都要看、每改一行都要评论 | 关注结果，让 Claude 完成完整任务 |
| 需求模糊怪 Claude 不懂 | "帮我优化一下""让页面好看点" | 给具体的、可验证的需求 |
| 不写 CLAUDE.md | 每次新会话都要重新解释项目背景 | 写 CLAUDE.md，这是最重要的文件 |

---

## 四、对话技巧（高阶）

### 采访模式

做大功能前，先让 Claude 采访你：

> "我想做一个支付功能，在动手之前，先采访我，问清楚所有你需要知道的事情。"

采访完 → 生成 SPEC.md → **开新会话执行**（采访对话太长会占上下文）

### 三个提问原则

1. **具体**：文件名、行号、函数名、期望行为
2. **指向**：指一个已有的好实现当范本——"像那个一样做"比"做一个漂亮的"有效 100 倍
3. **克制**：一次只做一件事

### Context Engineering

- 上下文太多，模型表现反而变差（Anthropic 工程团队验证）
- 不是给所有信息，而是给对的信息
- Shrivu（Abnormal AI，月消耗数十亿 tokens）：monorepo 新会话光加载基础配置就吃 ~20k tokens
- 管理工具：@ 引用文件、粘贴截图、cat error.log | claude、给 URL

### 会话管理

| 命令 | 用法 |
|------|------|
| /clear | 切换到完全不相关的任务时（Shrivu 建议：不要依赖 /compact） |
| /compact | 不推荐（不透明、容易出错），需要重启就用 /clear |
| /btw | 侧链提问，不污染主对话上下文 |
| Esc × 2 | Claude 改坏了代码，打开回滚菜单 |

---

## 五、多 Agent 协作

### Boris 的日常工作方式

- 本地 5 个 Claude Code 实例（独立 git worktree）+ 云端 5-10 个网页会话
- **同时推进十几个任务**

### Git Worktree 并行

```bash
claude --worktree        # 自动创建隔离的 worktree
claude --worktree --tmux  # 在 Tmux 会话中启动
```

- 每个实例在独立分支、独立目录中工作
- 绝对不要让多个 session 操作同一个分支

### Subagent：独立上下文空间

- 运行在自己独立的上下文窗口中，不消耗主 session 空间
- 在 `.claude/agents/` 下放 .md 文件定义
- 核心价值：**独立上下文**，不是专业分工

### Agent Teams

- Writer/Reviewer 模式：一个写一个审，产出质量肉眼可见提升
- 测试驱动模式：一个写测试一个写实现（AI版TDD）
- Coordinator Mode：Research → Synthesis → Implementation → Verification 四阶段自动编排

---

## 六、TAOR 循环（内部机制）

Claude Code 的核心是 **Think → Act → Observe → Repeat** 循环：

1. **Think**：分析当前状态，决定下一步
2. **Act**：调用工具执行操作
3. **Observe**：读取结果，评估是否完成
4. **Repeat**：未完成则继续

**为什么 Claude 有时"绕弯路"**：它不是直线程序，是实时决策的循环体。每次观察后重新判断下一步。

**为什么给明确的验证标准很重要**：循环需要停止条件。需求模糊 → 不知道什么时候算"做完了" → 不停循环。

### 上下文压缩

- 对话太长时自动压缩成摘要（有损操作）
- 多次压缩后信息损失累积，最早的上下文只剩模糊影子
- **重要约束写进 CLAUDE.md，不要只在对话里说一次**

### 权限系统

| 模式 | 行为 | 分类器漏检率 |
|------|------|-------------|
| Interactive | 每个操作确认 | 0% |
| Auto | 安全操作自动，危险拦截 | 17%（过度主动行为） |
| YOLO | 几乎全部自动 | — |

---

## 七、Feature Flags（源码泄露发现）

未上线功能，代表演进方向：

| Feature | 描述 |
|---------|------|
| **KAIROS** | 始终在线后台助手，监听 GitHub webhook 主动介入 |
| **ULTRAPLAN** | 复杂规划卸载到云端 Opus 4.6，最长30分钟深度思考 |
| **Coordinator Mode** | 四阶段多 Agent 编排器（Research→Synthesis→Implementation→Verification） |
| 交错思维 | 模型在生成过程中穿插推理步骤 |
| 1M 上下文 | 当前默认 200K，已在开发中 |

---

## 八、数据驱动的关键数字

| 数据 | 来源 |
|------|------|
| 93% 的权限请求被用户直接批准 | Anthropic 内部数据 |
| Boris 47天中有46天在用 Claude Code | Boris Cherny |
| 最长单次 session 跑了 1天18小时50分钟 | Boris Cherny |
| 使用 Claude Code 的团队平均提效 2-5 倍 | Anthropic |
| GA 后6个月达到10亿美元年化收入 | 公开数据 |
| Shrivu 团队月消耗数十亿 tokens | Abnormal AI |

---

## 参考来源

- 花叔《Claude Code从入门到精通》v2.0（75页完整版）
- Boris Cherny 公开分享（howborisusesclaudecode.com）
- Anthropic《How Anthropic Teams Use Claude Code》白皮书
- Claude Code v2.1.88 源码泄露分析（51万行）
- Shrivu Shankar（Abnormal AI）CLAUDE.md 方法论
