# Claude Code 自动安装指南

> **AI自动执行安装** | 适用于新电脑或首次安装 | 最后更新: 2026-01-04



## 🚀 快速安装（3步）

### 步骤1: 安装80+专业插件

```bash
claude plugin marketplace add https://github.com/wshobson/agents
```

**包含插件**：核心开发、DevOps、测试、安全、多语言等80+插件

---

## ⚠️ 安装建议：断舍离

> **Claude Code开箱即用就很好** - Claude Code之父Boris Cherny

**核心原则**：
- ✅ **够用就好**：5个核心MCP + 80+插件完全够用
- ❌ **避免收集癖**：不要安装大量不知来源的MCP和插件
- 💡 **性能优先**：过多插件会空耗资源，降低响应速度

**Claude Code团队使用方式各不相同，没有"最佳实践"**
- 找到最适合自己的配置才是最好的
- 基础功能用到极致比黑魔法更有效

---

### 步骤2: 安装5个核心MCP

#### 2.1 网页读取（免费）
```bash
claude mcp add -s user -t http web-reader https://web-reader.xdai.dev
```

#### 2.2 联网搜索（免费）
```bash
claude mcp add -s user -t http web-search-prime https://web-search.xdai.dev
```

#### 2.3 浏览器自动化（免费）
```bash
claude mcp add -s user playwright -- npx -y "@playwright/mcp@latest"
```

**💡 高级配置：保持浏览器登录状态**

如果你需要频繁访问需要登录的网站（如 GitHub、内部系统），可以配置浏览器保持登录状态：

修改 `~/.claude.json`，在 playwright 配置中添加 `--user-data-dir` 参数：

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest",
        "--user-data-dir=/Users/你的用户名/.claude-playwright-profile"
      ]
    }
  }
}
```

**效果**：浏览器的 Cookies、LocalStorage、登录态会保存在指定目录，下次启动时自动复用，无需重复登录。

#### 2.4 视觉理解（需要API Key）
```bash
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_key -- npx -y "@z_ai/mcp-server"
```

#### 2.5 GitHub深度访问（需要GLM Coding Plan）
```bash
claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"
```

---

### 步骤3: 验证安装

```bash
# 查看已安装的MCP
claude mcp list

# 测试联网搜索
"搜索最新的AI技术发展"

# 测试网页读取
"读取这个网页的内容: https://example.com"
```

**预期结果**：所有MCP显示为 ✓ Connected

---

## 📊 MCP功能说明

| MCP名称 | 功能 | 是否免费 | 使用场景 |
|---------|------|---------|---------|
| **web-reader** | 读取网页 | ✅ 免费 | 读取技术文档、文章、博客 |
| **web-search-prime** | 联网搜索 | ✅ 免费 | 搜索最新信息、技术动态 |
| **playwright** | 浏览器自动化 | ✅ 免费 | 自动化测试、网页交互、截图 |
| **zai-mcp-server** | 视觉理解 | ⚠️ 需API Key | 图片分析、UI转换代码、视频理解 |
| **zread** | GitHub深度访问 | ❌ 需付费套餐 | 深入学习开源项目源码 |



---

## 🚀 高级工具：Schaltwerk（多AI协同管理）

### 什么是Schaltwerk？

> **同时运行10个AI Agent并行开发同一个项目**

Schaltwerk是一个基于**Git Worktree**的AI Agent管理平台，让你可以：
- 同时启动10个AI Agent处理不同任务
- 每个Agent在完全隔离的"平行宇宙"中工作
- 自动处理Git分支冲突
- GitHub风格Diff视图Review

### 核心特性

**自动隔离**：
- 基于Git Worktree创建独立工作树
- 每个Agent互不干扰，文件系统完全隔离
- 你不需要了解Git原理，图形界面一键操作

**并行开发**：
```
Agent A：修Bug
Agent B：写新功能
Agent C：重构文档
...
同时进行，互不干扰
```

**智能合并**：
- GitHub风格Diff视图
- 行就合并，不行就销毁平行宇宙
- 自动处理最繁琐的隔离工作

### 安装使用

**Mac安装**：
```bash
brew install --cask 2mawi2/tap/schaltwerk
```

**其他平台**：
- 下载地址：https://link.bytenote.net/5MHVcn

**使用流程**：
```
1. 写Spec（需求规格）
2. 配置Agent（选择AI、设置提示词）
3. 启动多个Agent（一键Start）
4. 喝咖啡（等待完成）
5. Review合并（Diff视图）
```

### 与其他工作流的对比

| 维度 | Schaltwerk | Vibe-Coding | feature-dev |
|------|-----------|-------------|-------------|
| **类型** | 工具软件 | 工作流程 | 开发SOP |
| **并行方式** | 10个AI自动并行 | 3个AI手动切换 | 1个AI串行 |
| **隔离机制** | Git Worktree自动 | 手动切换 | Plan模式 |
| **难度** | 零学习成本 | 需要训练思维 | 需要理解流程 |

### 推荐使用场景

✅ **非常适合**：
- 多功能并行开发（3个以上功能）
- 多Bug同时修复
- 大规模重构
- **与Vibe-Coding结合使用**（最佳实践）

❌ **不推荐**：
- 简单单任务
- 学习Git Worktree原理
- 需要深度代码审查

### 与Vibe-Coding结合使用

**Vibe-Coding + Schaltwerk = 完美组合**：

```
Vibe-Coding的"三线并进"思维
↓
Schaltwerk的"自动隔离"工具
↓
你只需要：写Spec → 喝咖啡 → Review
```

**实战示例**：
```bash
# 1. 在Schaltwerk中写3个Spec
Spec 1: 给登录页加验证码
Spec 2: 优化数据库查询
Spec 3: 更新API文档

# 2. 配置3个Agent（都用Claude Code）
Agent 1: 专注功能开发
Agent 2: 专注性能优化
Agent 3: 专注文档更新

# 3. 一键Start，3个Agent同时开始

# 4. 喝咖啡等待

# 5. Diff视图Review，合并所有改动
```

---

## 🔄 高级工具：Ralph Wiggum（自动迭代插件）

### 什么是Ralph Wiggum？

> **让 Claude 不断尝试，直到成功为止**

Ralph Wiggum 是官方 Claude Code 插件，基于 **Stop Hook 机制**实现自动循环：
- 执行 → 失败 → 分析 → 再执行 → 成功
- 无需手动复制错误信息重新提问
- 适合 Bug 修复、补充测试、依赖迁移等需要反复尝试的任务

### 核心特性

**自动循环**：
```
尝试1：运行测试 → 失败 → 分析错误日志
尝试2：修改代码 → 运行测试 → 仍然失败 → 调整策略
尝试3：再次修改 → 运行测试 → 成功！✅
```

**智能理解**：
- Claude 能理解错误信息并自动调整策略
- 不需要人工干预，直到成功或达到最大次数

**可控制**：
```bash
/ralph-loop "修复测试" --completion-promise "所有测试通过" --max-iterations 10
```

### 安装使用

**前置要求**：
- ✅ 已安装 Claude Code
- ✅ 已配置 API Key
- ✅ 项目已初始化 Git 仓库

**安装步骤**：

1. **克隆 Ralph Wiggum 仓库**
   ```bash
   git clone https://github.com/anthropics/ralph-wiggum.git
   cd ralph-wiggum
   npm install
   ```

2. **配置 Claude Code Hooks**

   在项目根目录创建 `.claude/hooks.json`：
   ```json
   {
     "hooks": {
       "pre-stop": "node /path/to/ralph-wiggum/index.js"
     }
   }
   ```

   或使用命令行：
   ```bash
   claude hooks set pre-stop "node /path/to/ralph-wiggum/index.js"
   ```

3. **验证安装**
   ```bash
   /ralph-loop "测试安装"
   ```

### 使用示例

**场景1：修复 Bug**
```bash
/ralph-loop "运行测试并修复所有失败的测试" --completion-promise "所有测试通过"
```

**场景2：补充测试**
```bash
/ralph-loop "为 src/auth.ts 添加单元测试" --completion-promise "测试覆盖率 > 80%"
```

**场景3：代码重构**
```bash
/ralph-loop "重构 src/user.ts，提高代码可读性" --max-iterations 20
```

### 推荐使用场景

✅ **非常适合**：
- **Bug 修复**：自动执行"测试→修复→再测试"循环
- **补充测试**：不断添加测试用例，直到覆盖所有分支
- **依赖迁移**：逐步解决迁移过程中的问题
- **代码重构**：多轮迭代优化代码，直到满足质量标准

❌ **不推荐**：
- 需要人工决策的任务（架构设计、技术选型）
- 创意性任务（UI设计、文案撰写）
- 一次性任务（读取文件、生成代码）

### 与其他工具的对比

| 维度 | Ralph Wiggum | Schaltwerk | 自动化流水线 |
|------|-------------|-----------|-------------|
| **功能** | AI 自动重试 | 多 AI 管理 | 多任务批处理 |
| **并行方式** | 串行（1个AI循环） | 并行（多个AI同时） | 并行（多个任务同时） |
| **适用** | 单任务多次迭代 | 多任务并行开发 | 重复性任务（50+个） |
| **难度** | 中（需理解 Stop Hook） | 低（图形界面） | 高（需MCP+测试） |

### 详细文档

📖 **完整文档**：[06-工具-Ralph Wiggum自动迭代插件.md](../../02-AI开发实战/AI开发方式/06-工具-Ralph%20Wiggum自动迭代插件.md)

**包含内容**：
- 技术原理（Stop Hook 机制详解）
- 高级参数说明（`--completion-promise`、`--max-iterations`）
- 最佳实践和注意事项
- 与 feature-dev 流程的集成
- 更多实战示例

---

## 🔍 发现更多插件和MCP

### 方法1: Claude官方插件市场

**访问地址**: https://github.com/anthropics/courses/tree/main/cursor-course

**搜索技巧**:
1. 在GitHub搜索: `topic:claude-code-plugin`
2. 在GitHub搜索: `topic:claude-code-agent`
3. 浏览官方推荐插件列表

---

### 方法2: MCP官方仓库

**Model Context Protocol官方**: https://github.com/modelcontextprotocol

**推荐MCP服务器**:

**GitHub搜索命令**:
```bash
# 搜索MCP服务器
topic:model-context-protocol

# 搜索特定功能的MCP
mcp browser automation
mcp database
mcp api
```

**热门MCP分类**:
- 🌐 **网页相关**: @modelcontextprotocol/server-puppeteer、@executeautomation/puppeteer-mcp-server
- 💾 **数据库**: @modelcontextprotocol/server-postgres、@modelcontextprotocol/server-sqlite
- 📁 **文件系统**: @modelcontextprotocol/server-filesystem
- 🔍 **搜索引擎**: @modelcontextprotocol/server-brave-search
- 🗄️ **知识库**: @modelcontextprotocol/server-memory

---

### 方法3: 使用AI助手查找插件

**Prompt模板**:

```bash
"我需要[具体需求]

请帮我：
1. 搜索适合的Claude Code插件
2. 或搜索适合的MCP服务器
3. 提供安装命令
4. 说明使用场景

【我的需求】
[描述你的具体需求，例如：
- 处理Excel文件
- 连接MySQL数据库
- 自动化测试
- 代码审查
- 等等...]"
```

**实际示例**:

```bash
# 示例1: 寻找数据库插件
"我需要连接和操作PostgreSQL数据库
请推荐合适的MCP服务器并提供安装命令"

# 示例2: 寻找测试工具
"我需要自动化测试我的Web应用
请推荐合适的插件和MCP服务器"

# 示例3: 寻找开发工具
"我需要更好的代码审查和重构工具
请推荐相关的Claude Code插件"
```

---

### 方法4: 社区资源

**GitHub精选列表**:
- [awesome-claud-code](https://github.com/topics/claude-code) - 社区贡献的插件集合
- [mcp-servers](https://github.com/topics/model-context-protocol) - MCP服务器列表

**关注这些组织**:
- @anthropics - Claude官方
- @modelcontextprotocol - MCP官方
- @wshobson - 知名插件开发者

---

### 方法5: 创建自定义插件

**当现有插件无法满足需求时**:

**Prompt模板**:
```bash
"我想创建一个Claude Code插件来[具体功能]

请帮我：
1. 设计插件架构
2. 编写插件代码
3. 提供安装和测试步骤

【插件需求】
- [详细描述插件功能]
- [期望的输入输出]
- [使用场景]"
```

**参考文档**:
- Claude Code插件开发文档: https://docs.anthropic.com/en/docs/build-with-claude/claude-for-developers
- MCP服务器开发文档: https://modelcontextprotocol.io/introduction

---

## 📋 推荐插件组合

### 入门开发
```bash
# 已包含80+插件
claude plugin marketplace add https://github.com/wshobson/agents
```

### Python开发
- python-development (已包含)
- python-packaging (已包含)
- python-testing-patterns (已包含)

### Web开发
- javascript-typescript (已包含)
- playwright (MCP)
- web-reader (MCP)

### 数据分析
- python-development (已包含)
- @modelcontextprotocol/server-postgres (MCP)
- @modelcontextprotocol/server-sqlite (MCP)

### 自动化测试
- playwright (MCP)
- test-automator (已包含)
- debugging-toolkit (已包含)

---

**创建时间**: 2026-01-02
**最后更新**: 2026-01-04
**预计安装时间**: 5-10分钟
**难度等级**: ⭐ 简单（AI自动执行）
