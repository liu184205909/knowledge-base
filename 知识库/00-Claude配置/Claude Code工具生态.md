# Claude Code工具生态

> **Skills + Plugins + MCP** | 完整指南 | v3.1 | 2025-12-31

**核心理念**：Claude Skills = 个人经验的固化和标准化工作的SOP

---

## 🚀 快速开始（3步搭建完整环境）

### 第1步: 安装80+专业插件（1分钟）

```bash
claude plugin marketplace add https://github.com/wshobson/agents
```

**包含插件**：核心开发、DevOps、测试、安全、多语言等80+插件

---

### 第2步: 安装5个核心MCP（5分钟）

```bash
# 1. 网页读取（免费）
claude mcp add -s user -t http web-reader https://web-reader.xdai.dev

# 2. 联网搜索（免费）
claude mcp add -s user -t http web-search-prime https://web-search.xdai.dev

# 3. 视觉理解（免费）
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_key -- npx -y "@z_ai/mcp-server"

# 4. 浏览器自动化（免费）
claude mcp add -s user playwright -- npx -y "@playwright/mcp@latest"

# 5. GitHub深度访问（需GLM Coding Plan）
claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"
```

---

### 第3步: 学习基础知识（15分钟）

**📘 快速入门系列**（推荐新手）：
- [Skills快速入门](./快速开始/Skills快速入门.md) - 5分钟
- [MCP快速入门](./快速开始/MCP快速入门.md) - 5分钟
- [Plugins快速入门](./快速开始/Plugins快速入门.md) - 5分钟

**📊 完全指南**（深度学习）：
- [Claude-Skills完全指南.md](./Claude-Skills完全指南.md) - 82页白皮书
- [ZRead MCP配置.md](./ZRead%20MCP配置.md) - GitHub深度访问
- [UI设计资源.md](./UI设计资源.md) - aura.build使用指南

**🎯 实战模板**（直接复制使用）：
- [Prompt模板库](./实战模板库/Prompt模板库.md) - 15个常用模板
- [通用方法论](./通用方法论.md) - 竞品分析与用户洞察

---

## 📖 核心概念

### 用打工人比喻

| 概念 | 比喻 | 作用 | AI如何使用 |
|------|------|------|-----------|
| **Skills** | 📘 工作手册 | 告诉AI"怎么做" | 自动加载相关手册 |
| **Plugins** | 🔌 专业顾问 | 提供专业建议 | 自动调用顾问 |
| **MCP** | 🧰 外部工具 | 连接外部世界 | 自动使用工具 |

---

### 一个实际例子

**场景：开发Python API**

AI会自动组合使用：
1. **读取Skills手册** → 知道Python最佳实践
2. **调用Plugins顾问** → python-development插件（Python专家）
3. **使用MCP工具** → web-search（搜索文档）、web-reader（读取网页）

**你不需要手动选择**，AI会自动判断需要什么！

---

## 🎯 三大核心区别

### Skills - 工作流程

**特点**：
- ✅ 告诉AI"怎么做"
- ✅ 包含具体步骤和标准
- ✅ 按需自动加载

**例子**：
```
Skills: "如何做代码审查"
→ AI知道：先看架构，再看安全，最后看性能
```

---

### Plugins - 专业能力

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

---

### MCP - 外部连接

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

---

## 💡 何时使用哪个？

| 任务类型 | 主要使用 | 辅助使用 |
|---------|---------|---------|
| **开发功能** | Plugins (feature-dev) | Skills (开发流程) |
| **学习新技术** | MCP (web-search) | Plugins (语言专家) |
| **代码审查** | Plugins (code-review) | Skills (审查标准) |
| **自动化测试** | MCP (playwright) | Plugins (测试专家) |
| **导出记录** | Transcripts (手动) | - |

---

## 🔧 推荐的核心插件

### 必装插件（5个）

1. **feature-dev** ⭐⭐⭐⭐⭐
   - 完整的功能开发工作流
   - 适合：中等复杂度功能（5-10个文件）

2. **code-review-ai** ⭐⭐⭐⭐⭐
   - AI代码审查
   - 适合：代码质量检查、安全扫描

3. **python-development** ⭐⭐⭐⭐⭐
   - Python开发支持
   - 适合：Python项目、最佳实践

4. **javascript-typescript** ⭐⭐⭐⭐⭐
   - JavaScript/TypeScript开发支持
   - 适合：前端项目、Node.js项目

5. **backend-architect** ⭐⭐⭐⭐
   - 后端架构设计
   - 适合：API设计、微服务架构

---

## 📚 更多资源

### 快速入门系列
- [Skills快速入门](./快速开始/Skills快速入门.md) - 5分钟上手
- [MCP快速入门](./快速开始/MCP快速入门.md) - 5分钟上手
- [Plugins快速入门](./快速开始/Plugins快速入门.md) - 5分钟上手

### 深度学习
- [Claude-Skills完全指南.md](./Claude-Skills完全指南.md) - 82页白皮书
- [ZRead MCP配置.md](./ZRead%20MCP配置.md)
- [UI设计资源.md](./UI设计资源.md)

### 实战模板
- [Prompt模板库](./实战模板库/Prompt模板库.md) - 15个常用模板
- [通用方法论](./通用方法论.md) - 竞品分析与用户洞察

---

## ⚡ 保持AI高效的5个技巧

### 技巧1: 多用子agent（调研任务）

**什么时候用**：
- 需要调研代码库
- 需要搜索资料
- 需要分析大量文件

**操作步骤**：
1. 开启新的Claude Code窗口（子agent）
2. 在新窗口中完成调研任务
3. 只将关键结论汇报给主窗口

---

### 技巧2: 约束AI输出字数

**操作方法**：
```markdown
✅ 总结类任务："用100字以内总结"
✅ 分析类任务："用200字以内分析"
✅ 代码解释："关键点说明，不超过5行"
```

---

### 技巧3: 任务完成就开新窗口

**操作流程**：
```
任务A完成 → git commit → 新开窗口 → 任务B
```

**为什么这样做**：
- ✅ 每个任务上下文干净
- ✅ Claude保持聪明状态
- ✅ 代码已保存，安全

---

### 技巧4: 多用 `esc` 回退

**什么时候用**：
- 完成一个主要阶段后
- 感觉Claude反应变慢时
- 准备开始新任务时

**操作**：
```
输入：esc
效果：Claude退出当前模式，上下文得到清理
```

---

### 技巧5: 识别变笨信号

**5个变笨信号**：
1. Claude反应明显变慢
2. 重复性错误增加
3. 遗忘之前的对话
4. 输出质量下降
5. 上下文超过15万token

**立即行动**：
```
步骤1：git commit 保存当前成果
步骤2：新开Claude Code窗口
步骤3：只告诉新窗口关键信息
```

---

## 📋 快速检查清单

使用Claude Code时，定期自查：
- [ ] 当前上下文长度是否超过15万token？
- [ ] Claude反应是否变慢？
- [ ] 是否在同一个窗口完成了多个任务？
- [ ] AI输出是否过于冗长？

**如果任一答案为YES**：
→ 考虑开新窗口或使用 `esc` 回退

---

## 🔗 相关文档

### 知识库文档
- [Claude Skills完全指南](./Claude-Skills完全指南.md) - 深入理解Skills
- [通用方法论](./通用方法论.md) - 竞品分析与用户洞察
- [Prompt模板库](./实战模板库/Prompt模板库.md) - 直接复制使用

### 应用场景
- [../01-AI营销实战/](../01-AI营销实战/) - 数字营销实战
- [../02-AI开发实战/](../02-AI开发实战/) - AI辅助开发
- [../03-GEO前沿探索/](../03-GEO前沿探索/) - AI搜索优化

---

**最后更新**: 2025-12-31
**版本**: v3.1（精简版）
**维护状态**: ✅ 已优化

---

**现在你理解Skills、Plugins、MCP的关系了吗？** 🎯
