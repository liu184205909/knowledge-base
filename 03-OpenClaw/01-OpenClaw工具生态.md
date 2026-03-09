# OpenClaw 工具生态

> **OpenClaw增强工具** - 桌面管理、必装Skills、网页抓取、自动化工作流
> **最后更新**：2026-03-09

---

## 一、OpenClaw Manager - 桌面管理工具

> 项目地址：https://github.com/miaoxworld/openclaw-manager

**定位**：基于 Tauri 2.0 + React + Rust 构建的跨平台桌面管理工具

### 1.1 核心功能

| 功能 | 说明 |
|------|------|
| **仪表盘** | 实时监控服务状态、端口、内存、运行时间 |
| **AI模型配置** | 支持 14+ AI 提供商（Claude、GPT、DeepSeek、Gemini等） |
| **消息渠道** | Telegram、飞书、Discord、Slack、微信、钉钉等 |
| **快捷操作** | 一键启动/停止/重启/诊断 |

### 1.2 安装

下载对应平台安装包：macOS(.dmg)、Windows(.msi/.exe)、Linux(.deb/.AppImage)

---

## 二、必装Skills推荐

> 来源：从ClawHub 13000+ skills中精选 | 参考：[awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills)

### 2.1 安全提醒

ClawHub存在恶意skills风险（ClawHavoc事件1184个恶意skills），建议：
- 安装前用**skill-vetter**审查
- 优先选择官方/知名作者
- 检查GitHub stars和活跃度

### 2.2 7个必装Skills

| Skill | 作用 | 安装命令 |
|-------|------|----------|
| **skill-vetter** | 安全审查，装任何skill前必装 | `clawhub install skill-vetter` |
| **agent-browser** | Vercel Labs无头浏览器，19600+ stars | `npm install -g agent-browser` |
| **agent-reach** | 多平台内容访问（Twitter/YouTube/GitHub等） | 见Claude Code环境配置 |
| **self-improving-agent** | Agent自我学习进化 | `clawhub install self-improving-agent` |
| **find-skills** | 搜索和安装skills | `npx skills find` |
| **github** | 官方GitHub管理skill | `npx clawhub@latest install github` |
| **obsidian** | 访问Obsidian笔记库 | `npx clawhub@latest install obsidian` |

### 2.3 核心Skills详解

**skill-vetter** - 安全审查
```
四步审查流程：
1. 查来源（作者信誉、GitHub活跃度、Star数量）
2. 代码审查（数据外泄、credential访问、eval()调用）
3. 权限范围分析
4. 风险评级（LOW/MEDIUM/HIGH/EXTREME）
```

**agent-browser** - 无头浏览器
- 基于accessibility-tree快照，比CSS选择器更稳定
- 支持截图、PDF、网络拦截、视频录制

**self-improving-agent** - 自我进化
- 记录到 `.learnings` 目录
- LEARNINGS.md记改进，ERRORS.md记错误
- 有价值的学习可提取为新skill

---

## 三、Scrapling - 最强外挂

> GitHub 2.3万+ stars | 项目地址：https://github.com/D4Vinci/Scrapling

**定位**：智能网页抓取工具，OpenClaw的最佳搭档

### 3.1 核心功能

| 功能 | 说明 |
|------|------|
| **StealthyFetcher** | 模拟最新浏览器指纹，绕过防爬拦截 |
| **智能自适应** | 网站改版也能自动重新定位数据 |
| **断点记忆** | 断网/断电后无缝接力继续工作 |
| **低内存占用** | 旧笔记本/入门服务器都能跑 |

### 3.2 状态

作者正在把Scrapling做成OpenClaw的Skill插件，目前可独立作为Python库使用。

