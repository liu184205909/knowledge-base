# Claude Code 环境配置

> **AI完整安装指南** | 最后更新: 2026-01-12

---

## 环境说明

**Claude Code 有两个运行环境**：

| 环境 | 说明 | 功能完整度 |
|------|------|-----------|
| **CLI 版本** | 命令行工具 | 100% 功能支持 |
| **VSCode 扩展** | Cursor/VSCode 插件 | 部分功能不支持 |

**功能差异**：
- ✅ **跨环境支持**: MCP 服务器、核心编辑功能
- ❌ **仅 CLI 支持**: AskUserQuestion、agent-browser、Dev Browser plugin

**当前环境判断**：
- 如果你使用 Cursor / VSCode → VSCode 扩展环境
- 如果你终端运行 `claude` → CLI 环境

---

## 安装清单

- ✅ Claude Code主程序
- ✅ **全局CLAUDE.md配置** ⭐ **第一步必须配置**
- 4个核心Plugins (代码简化、自动迭代、Dev Browser、Superpowers)
- 6个核心MCP(网页读取、搜索、浏览器、视觉、GitHub、YouTube)
- 80+插件集合

> **重要**: CLAUDE.md配置是环境配置的基础，建议在安装完Claude Code主程序后**立即配置**，确保AI行为符合你的预期。

---

## 1. 配置全局CLAUDE.md ⭐ **必须配置**

**核心价值**: 统一AI行为规则，跨电脑同步个性化配置，在VSCode版中享受CLI版的智能功能

**配置文件路径**: `~/.claude/CLAUDE.md`

**配置优先级**: 项目级 `.claude/CLAUDE.md` > 全局级 `~/.claude/CLAUDE.md` > 默认行为

### 配置模板参考

**复制以下内容到 `~/.claude/CLAUDE.md`**:

```markdown
# Claude Code 全局配置

## 核心目标
- **可控**: 所有操作需用户确认,不主动执行危险操作
- **准确**: 理解需求后再执行,避免假设和猜测
- **高效**: 选择合适的工具和流程,快速完成任务

---

## 🎯 苏格拉底式需求梳理（默认启用）

**自动触发条件**: 用户说"开发"、"实现"、"做一个"，任务超过3个步骤，或涉及未知技术栈

**不触发条件**: 简单单步操作（如"修复bug"）、明确指定任务、用户说"直接开始"

**提问方向**: 技术选型、安全风险、需求对齐、功能边界、界面交互、性能考虑、可维护性

---

## 交流规范
- **主要语言**: 中文(简体)，代码注释用中文
- **回答风格**: 简洁直接，避免冗长废话
- **交互原则**: 不确定时主动询问，复杂任务先展示计划，完成后简洁说明结果

---

## 工作方式
- **任务执行流程**: 需求确认 → 方案设计 → 执行操作 → 完成反馈
- **代码操作**: 读取优先，编辑优先（用Edit避免Write重写），关键逻辑添加中文注释
- **错误处理**: 重试3次，报告错误并提供解决方案
- **性能考虑**: 超过1000行文件分段处理，批量操作分批执行

---

## 技术决策
- **文件搜索**: 优先用Glob/Grep，不用bash find/grep
- **文件操作**: 用Read/Edit/Write，不用cat/sed/echo
- **代码质量**: 可读性优先，模块化设计，职责单一
- **安全意识**: 指出不安全的代码实践

---

**优先级**: 项目级 `.claude/CLAUDE.md` > 全局级 > 默认行为
```

---

## 2. 安装3个核心Plugins

### 2.1 代码简化插件
```bash
claude plugin marketplace update claude-plugins-official
claude plugin install code-simplifier
```

### 2.2 自动迭代插件(可选)
```bash
claude plugin install ralph-wiggum@anthropics
```

### 2.3 Dev Browser
```bash
claude plugin marketplace add sawyerhood/dev-browser
claude plugin install dev-browser@sawyerhood/dev-browser
```

### 2.4 Superpowers - AI编程工作流系统 ⭐

让AI编程助手像高级工程师一样工作（TDD驱动、系统性调试、证据胜过声明）

**安装**:
```bash
claude plugin marketplace add obra/superpowers-marketplace
claude plugin install superpowers@superpowers-marketplace
```

**主要命令**:
- `/superpowers:brainstorm` - 交互式设计优化
- `/superpowers:write-plan` - 创建实施计划
- `/superpowers:execute-plan` - 批量执行计划

**详细指南**: [05-Superpowers-AI编程工作流系统.md](./05-Superpowers-AI编程工作流系统.md)

---

## 3. 安装6个核心MCP

### 3.1 网页读取
```bash
claude mcp add -s user -t http web-reader https://web-reader.xdai.dev
```

### 3.2 联网搜索
```bash
claude mcp add -s user -t http web-search-prime https://web-search.xdai.dev
```

### 3.3 浏览器自动化

**方案对比总览**：

| 方案 | Token节省 | 适用场景 | 稳定性 | 环境支持 | 核心优势 |
|------|----------|---------|-------|---------|---------|
| **Agent Browser** | 93% ↓ | 日常浏览、快速操作 | 较新 | 仅CLI | 轻量、省token |
| **Playwright MCP** | 基准 | 测试、复杂流程 | 成熟 | CLI+VSCode | 跨环境、完整 |
| **DevTools MCP** | 基准 | 调试、性能分析 | 成熟 | 仅CLI | Chrome调试协议 |

**快速选择指南（省流版）**：

```
看看网页 → Agent Browser
填表、截图 → Agent Browser
性能分析 → DevTools MCP
调试、逆向 → DevTools MCP
网络请求 → DevTools MCP
测试、跑全流程 → Playwright MCP
VSCode环境 → Playwright MCP
```

**场景适配原则**（用户实战经验）：
> "三款工具的核心差异在于场景适配，没有绝对优劣。日常轻量操作选Agent Browser，调试分析选DevTools MCP，复杂流程测试选Playwright MCP。"
> — 实战产品说（湖北）

---

**环境差异说明**：
- ✅ **Playwright MCP**: CLI + VSCode 扩展都支持
- ❌ **agent-browser**: 仅 CLI 支持
- ❌ **Dev Browser Plugin**: 仅 CLI 支持

---

**方式1: Playwright MCP（推荐）**
```bash
claude mcp add -s user playwright -- npx -y "@playwright/mcp@latest"
```

**优势**:
- ✅ 跨环境支持（CLI + VSCode 扩展）
- ✅ Windows 兼容性好
- ✅ 稳定成熟

**反检测配置**（触发验证码时使用）：

```javascript
// 使用browser_evaluate隐藏自动化特征
Object.defineProperty(navigator, 'webdriver', {
  get: () => undefined
});
```

**建议**：严格反爬虫网站（微信、知乎等）使用真实浏览器+手动操作

---

### 用户实战经验与常见问题

#### 实际应用场景（来自用户反馈）

**内容自动化**：
- **自动写文发文**：推荐 Playwright MCP（金九渊 上海）

**数据采集**：
- **有头爬虫**：Playwright MCP二开，指纹抹除更新（Peki麦 浙江）
- **前端测试**：Antigravity + Chrome（蓝星空 北京）

**逆向分析**：
- **逆向工程**：DevTools MCP（阿康 河南）

**浏览器复用**：
- **Playwright MCP Bridge扩展**：可替代cdp端口，直接复用浏览器实例（罗汉果子 新疆、Kan 天津）

#### 用户关注点（高频问题）

**反检测技术**：
- ❓ 哪个方案能绕开Cloudflare检测？（李响 四川）
- ❓ 如何防封号？（haSmo 广东）
- 💭 回应：都用自动化了，还在乎封不封号？😂（wifi密码6个8 广东）

**验证码处理**：
- ❓ 哪款可以自动化做图形化验证？（际遇。 安徽）

**工具咨询**：
- ❓ craftagent好用吗？（金九渊 上海）
- ✅ 好用（刘小排r 作者）

**CLI版本对比**：
- 💡 CLI是最高效最省token的，Playwright也有CLI版本，只是还不清楚和Vercel家的相比怎么样（Kan 天津）

#### 技术补充

**Playwright MCP扩展**：
- Chrome商店搜索：Playwright MCP Bridge浏览器扩展
- 功能：替代cdp端口作用，复用浏览器实例，无需额外维护状态

**相关文章**：
- [Playwright MCP/Skills/Dev Browser：AI自动化测试的坑我全踩过](https://mp.weixin.qq.com/s/N3RKHP3Eb8ZDVPMQlgjqKA)
- [Claude Code 浏览器自动化方案，怎么选？](https://mp.weixin.qq.com/s/-iMQpiWzLRm4L73PZeMYAQ)

---

**方式2: agent-browser（仅CLI）**

⚠️ **Windows兼容性问题**（2026-01-26测试）：Chromium下载停滞（172.8 MB），网络ECONNRESET错误，暂不可用

**核心优势**（网络良好环境）:
- Token节省93%（vs Playwright MCP）
- Refs系统：e1、e2、e3抽象引用，网页改版不影响
- 毫秒级响应（Rust CLI + Node守护进程）

**相关文章**: https://mp.weixin.qq.com/s/vNVSHfjKchDDniWGNdlxjg
**GitHub**: [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser)

---

**方式3: Dev Browser Plugin（仅CLI）**

⚠️ **Windows兼容性问题**（2026-01-26测试）：`lsof`命令不存在，浏览器进程意外关闭，暂不可用

待版本稳定后再测试

**相关文章**: [Playwright MCP/Skills/Dev Browser：AI自动化测试的坑我全踩过](https://mp.weixin.qq.com/s/N3RKHP3Eb8ZDVPMQlgjqKA)

### 3.4 视觉理解（需替换API Key）
```bash
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_key -- npx -y "@z_ai/mcp-server"
```

### 3.5 GitHub深度访问（需替换API Key）
```bash
claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"
```

### 3.6 YouTube字幕提取
```bash
claude mcp add -s user youtube-transcript -- npx -y @sinco-lab/mcp-youtube-transcript
```

---

## 4. 安装80+插件集合

```bash
claude plugin marketplace add https://github.com/wshobson/agents
```

---

## 5. 验证安装

```bash
# 查看MCP
claude mcp list

# 查看Plugins
claude plugin list
```

预期结果: 所有MCP显示为 ✓ Connected

---

## 相关文档

- [03-Skills完整指南](./03-Skills/README.md) - Skills完整指南(开发、推荐、分享)
- [01-RLM递归思想.md](./01-RLM递归思想.md) - RLM方法论
- [02-去除AI编程UI味儿的实战方法.md](./02-去除AI编程UI味儿的实战方法.md) - 实战方法
