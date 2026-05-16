# Codex 桌面端设置与使用技巧

> 来源：字节笔记本《10分钟Codex桌面端极速入门使用指南》、数字生命卡兹克《Codex更新远程控制》及网络教程整理。
> 下载地址：https://developers.openai.com/codex/app （支持 Mac / Windows）

---

## 一、界面结构速览

Codex 桌面端可拆成 6 个区域理解：

| 区域 | 内容 |
|------|------|
| 左侧 | 项目列表 / 会话线程 / Skills / 自动化 |
| 中间 | 当前 Thread 对话区 |
| 底部 | 输入框 / 模式选择 / 技能调用 |
| 右侧 | Diff / Review / Git 改动面板 |
| 下方 | Terminal 终端区（右上角命令行按钮打开） |
| 顶部 | 项目操作 / 分支切换 |

> Codex 不是编辑器，而是「项目管理器 + Agent 调度台 + Git Review 工具 + 内置终端」。

---

## 二、项目管理的最佳实践

### 2.1 多子项目拆分添加

一个仓库有多个子项目时，**不要把整个根目录丢进去**，而是分别添加：

```
# 错误做法：只加 my-saas/
my-saas/backend
my-saas/admin-web
my-saas/miniapp

# 正确做法：每个子项目独立添加
项目 1：my-saas/backend
项目 2：my-saas/admin-web
项目 3：my-saas/miniapp
```

**原因**：Codex 的 sandbox 围绕项目目录工作，项目太大 Agent 容易跨模块乱改。

### 2.2 用「重命名」做别名

左栏右键项目 → 重命名。实际不会改本地文件夹名，仅作为**显示别名**。可以用它标注所属项目，如：

- `my-saas → 后端-主服务`
- `admin-web → 管理后台`

### 2.3 快速打开项目

- macOS：`Cmd + O`
- Windows：`Ctrl + O`

---

## 三、会话与文件管理技巧

### 3.1 会话标题自动同步

窗口顶部有当前会话的自动总结标题，会同步到左侧菜单。

### 3.2 会话管理操作

标题栏旁下拉菜单可：**置顶会话**、**复制当前工作目录**等。

### 3.3 Diff 面板内联评论（隐藏技巧）

右侧 Diff/Review 面板中，点击行号旁的 `+` 号可以添加 **inline comment**，评论会作为上下文注入到对话中，让 Codex 基于你的评论继续修改。

### 3.4 跨项目参考

子项目独立 + docs 共享：

```
admin-web/
  docs/api.md
  docs/backend-fields.md
```

在会话中说：「请先阅读 docs/api.md，再实现页面。」

---

## 四、Slash Commands 常用命令

输入框输入 `/` 触发：

| 命令 | 用途 |
|------|------|
| `/status` | 查看当前 Thread 上下文长度、是否接近限制 |
| `/plan-mode` | 大任务前打开，先规划不改代码（也可用 `Shift+Tab` 切换） |
| `/review` | 改完代码后先审查再提交 |

---

## 五、权限模式选择

| 模式 | 行为 | 适用场景 |
|------|------|----------|
| **Ask** | 每次修改前手动确认 | 新手 / 敏感项目 |
| **Auto Edit** | 自动修改文件，执行命令前确认 | 日常开发 |
| **Full Auto** | 完全自主运行 | 成熟项目 / 熟练用户 |

---

## 六、Skills 技能系统

输入框中用 `$` 显式调用技能。Codex 预置六大实用技能：

- 设计稿还原（Figma → 代码）
- 项目管理（Linear 集成）
- 云原生部署（Vercel / Netlify / Cloudflare 一键上线）
- 视觉生成（GPT Image 驱动，自动生成素材）
- 文档处理（PDF / Excel / Word）
- API 开发（实时关联 OpenAI 官方文档）

---

## 七、插件系统

Codex 的核心扩展能力，重点插件：

| 插件 | 功能 |
|------|------|
| **Computer Use** | Codex 可用光标操控你的电脑，点击、打字、看屏幕 |
| **内置浏览器** | 直接在 Codex 中预览网页，支持**点击标注评论**（指哪改哪） |
| **Codex for Chrome** | 让 Codex 使用你已登录的浏览器状态操作网站，Tab Group 分离不影响你的浏览 |
| **图片生成** | 集成 gpt-image-2，Coding 时直接生成图片并自动引用到项目 |

### 内置浏览器快捷操作

- 打开内置浏览器：`Ctrl + Shift + B`（Windows）
- 在浏览器页面直接点击 → 添加评论 → Codex 自动根据标注修改

---

## 八、Automations 自动化任务

适合以下场景：
- 检查长时间运行的命令
- 轮询 Slack / GitHub 等连接源
- 按固定节奏执行 review loop
- 每日生成提交摘要

官方内置多种自动化模板，也可自定义创建。

---

## 九、远程控制（手机端）

### 设置步骤

1. 手机更新 ChatGPT App → 出现 Codex 入口
2. 电脑端 Codex → 新 tab「设置 Codex 移动版」→ 点击开始设置
3. 手机扫码授权 → 登录 → 完成安全设置

### 关键设置

连接成功后，**这三个开关必须保持打开**：
- 允许远程任务
- 允许命令审批
- 允许后台运行

### 体验要点

- 手机端与电脑端**实时同步**，消息完全一致
- 手机可：发新任务、查看工作线程、检查输出、批准命令、切换模型
- 所有文件/凭证/权限留在电脑上，手机只是消息路由
- 安全：走安全中继层，不暴露公网 IP，需同一 ChatGPT 账号

---

## 十、通知设置（重要推荐）

进入设置 → Notifications，**强烈建议开启**：

- 任务完成提醒
- 需要确认时提醒
- 后台任务完成提醒

> 多 Agent 同时跑时，不开通知很容易漏掉某个 Agent 卡在 approval。

---

## 十一、第三方 API / 模型配置

### 配置文件位置

- 全局：`~/.codex/config.toml`
- 项目级：`项目目录/.codex/config.toml`

### 示例：接 OpenRouter

```toml
model = "openrouter/anthropic/claude-sonnet-4.5"

[model_providers.openrouter]
name = "OpenRouter"
base_url = "https://openrouter.ai/api/v1"
env_key = "OPENROUTER_API_KEY"
wire_api = "chat"
```

环境变量：

```bash
export OPENROUTER_API_KEY="sk-or-xxx"
```

### 示例：接 Ollama 本地模型

```bash
# 安装并拉取模型
ollama pull qwen2.5-coder:32b
ollama run qwen2.5-coder:32b

# 快速启动 Codex 配套
ollama launch codex
```

---

## 十二、多窗口多项目并行

- 一个窗口跑多个项目，按需切换，切换不会停止其他会话
- 每个 Agent 在独立 Git Worktree 上工作，避免代码冲突
- 可随时查看 diff、添加评论、分段提交

---

## 十三、Terminal 内置终端

右上角命令行按钮打开，无需另开终端窗口。适合：
- 跑本地开发服务（如 `npm run dev`）
- 执行构建/测试命令
- 查看实时日志

---

## 十四、实用快捷操作汇总

| 操作 | 快捷键 / 方式 |
|------|--------------|
| 打开项目 | `Cmd+O` / `Ctrl+O` |
| 切换 Plan Mode | `Shift+Tab` |
| 触发 Slash Commands | 输入 `/` |
| 调用技能 | 输入 `$` |
| 打开内置浏览器 | `Ctrl+Shift+B` |
| 查看上下文状态 | `/status` |
| 代码审查 | `/review` |

---

## 参考来源

- [10分钟Codex桌面端极速入门使用指南 - 字节笔记本](https://mp.weixin.qq.com/s/sGjLotu58XcYAc1nextkdw)
- [Codex更新远程控制 - 数字生命卡兹克](https://mp.weixin.qq.com/s/xAp4UD5UQS3rxTQhwp1FqQ)
- [Complete Beginner's Guide to OpenAI's Codex App - Push To Prod](https://getpushtoprod.substack.com/p/complete-beginners-guide-to-openais)
- [Tips and Tricks for Using Codex - OpenAI Community](https://community.openai.com/t/tips-and-tricks-for-using-codex/1373143)
- [Codex 配置和使用教程 - LINUX DO](https://linux.do/t/topic/2177324)
- [ChatGPT Codex App 功能详解 - csguide.cn](https://csguide.cn/private/how-to-use-codex-app.html)
