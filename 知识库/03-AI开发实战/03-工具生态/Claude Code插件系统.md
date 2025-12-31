# Claude Code 插件清单

> **实用插件安装与使用指南**

---

## 📋 目录

1. [插件市场安装](#插件市场安装)
2. [推荐插件清单](#推荐插件清单)
3. [第三方插件平台](#第三方插件平台)

---

## 插件市场安装

### 1. 添加官方插件市场

```bash
/plugin marketplace add anthropics/claude-code
```

### 2. 浏览并安装插件

```bash
# 查看可用插件
/plugin list

# 安装特定插件
/plugin install feature-dev
```

---

## 推荐插件清单

### 🏆 强烈推荐

#### 1. Feature-Dev ⭐
**类型**：工作流

**功能**：
- Anthropic官方提供的结构化功能开发工作流
- 7阶段开发流程
- 反向面试机制

**适合场景**：
- 中等复杂度功能开发（5-10个文件）
- 需要严格架构规范的项目
- 团队协作项目

**安装**：
```bash
/plugin install feature-dev
```

---

#### 2. Claude-Mem
**类型**：记忆增强

**功能**：
- Claude Code的记忆外挂
- 提供跨会话的持久化记忆能力
- 记住项目上下文和历史决策

**适合场景**：
- 长期项目
- 需要记住历史对话的项目
- 复杂业务逻辑项目

**安装**：
```bash
/plugin install claude-mem
```

---

#### 3. Claude Code Transcripts ⭐ 新增
**类型**：对话记录导出

**功能**：
- 将Claude Code对话记录生成精美的HTML实验报告
- 支持Web和移动端查看
- 可一键生成GitHub Gist分享链接

**适合场景**：
- 技术分享（替代代码截图）
- 年终总结
- Prompt设计复盘
- AI调试过程追踪

**安装**：
```bash
uvx claude-code-transcripts
```

**使用**：
```bash
# 列出所有会话
uvx claude-code-transcripts

# 生成Gist分享链接
uvx claude-code-transcripts --gist
```

---

#### 4. Frontend-Design
**类型**：前端设计

**功能**：
- 自动生成具有独特美学的前端界面
- 提供设计建议和代码生成
- 避免通用AI生成的审美问题

**适合场景**：
- 前端开发项目
- 需要设计感的界面
- 追求美学的项目

**安装**：
```bash
/plugin install frontend-design
```

---

#### 5. superpowers
**类型**：工作流增强

**功能**：
- 将复杂的软件开发流程封装为可组合的"技能（Skills）"
- 极大地增强了Claude Code的自动化与工程化能力

**适合场景**：
- 复杂软件开发流程
- 需要高度自动化的项目
- 工程化要求高的项目

**安装**：
```bash
/plugin install superpowers
```

---

## 第三方插件平台

### 1. claudemarketplaces.com ⭐️ 推荐

**特点**：
- ✅ 插件质量较高
- ✅ 分类清晰

📍 地址：https://claudemarketplaces.com

---

### 2. claude-plugins.dev

📍 地址：https://claude-plugins.dev

---

### 3. GitHub开源项目

#### wshobson/agents ⭐️ 规模最大

**数据**：
- 🔢 总数：243个插件
- ✅ 符合Skills v2.0.0+规范：175个

**特点**：
- ✅ 规模最大，插件最多
- ✅ 100%符合Anthropic 2025年的Skills架构标准

📍 地址：https://github.com/wshobson/agents

---

## 🔗 相关文档

- [Claude Code使用技巧.md](./Claude Code使用技巧.md) - 上下文管理最佳实践
- [MCP开发工具.md](./MCP开发工具.md) - MCP服务器开发指南

---

**创建时间**: 2025-12-31
**当前版本**: v2.0

**通过插件系统，让Claude Code真正成为你的专属AI开发平台！** 🚀
