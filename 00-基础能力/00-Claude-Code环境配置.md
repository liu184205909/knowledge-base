# Claude Code 环境配置

> AI 自动配置指南，人也可以快速了解 | 最后更新: 2026-02-20

---

## 核心理念

**传统流程**（人工驱动）：人类发现问题 → 写需求 → AI写代码 → 人类验证

**自动闭环流程**（AI驱动）：AI自动发现问题 → 自动修复 → 自动写文档 → 自动写代码 → 自动测试 → 自动重构 → 通过后自动提交

**目标**：从"人盯着AI"进化到"AI自己闭环"。

---

## 安装清单

- ✅ 全局 CLAUDE.md 配置（**第一步必须配置**）
- ✅ 5个核心 MCP（视觉、搜索、网页读取、GitHub、浏览器）+ Agent Reach（多平台联网）
- ✅ Skills（营销、文档处理）

---

## 1. 配置全局 CLAUDE.md

**路径**: `~/.claude/CLAUDE.md`

**优先级**: 项目级 `.claude/CLAUDE.md` > 全局级 `~/.claude/CLAUDE.md`

将以下内容写入 `~/.claude/CLAUDE.md`:

```markdown
# Claude Code 全局配置

## 核心目标
- **可控**: 所有操作需用户确认，不主动执行危险操作
- **准确**: 理解需求后再执行，避免假设和猜测
- **高效**: 选择合适的工具和流程，快速完成任务

## 交流规范
- **主要语言**: 中文(简体)，代码注释用中文
- **回答风格**: 简洁直接，避免冗长废话
- **交互原则**: 不确定时主动询问，复杂任务先展示计划

## 工作方式
- **流程**: 需求确认 → 方案设计 → 执行操作 → 完成反馈
- **代码**: 读取优先，编辑优先（用Edit避免Write重写），关键逻辑添加中文注释
- **工具**: Glob/Grep搜索，Read/Edit/Write操作

## 苏格拉底式需求梳理
**自动触发**: 用户说"开发"、"实现"、"做一个"，任务超过3个步骤
**不触发**: 简单操作、明确指定任务、用户说"直接开始"
```

---

## 2. 安装 MCP

将 `your_api_key` 替换为实际的智谱AI API Key。

| MCP | 用途 |
|-----|------|
| `zai-mcp-server` | 视觉理解，识别图片/截图内容 |
| `web-search-prime` | 联网搜索，返回网页标题、URL、摘要 |
| `web-reader` | 抓取指定 URL 的网页正文、元数据、链接 |
| `zread` | 读取 GitHub 仓库文档、目录结构、源码文件 |
| `playwright` | 浏览器自动化，模拟点击/填表/截图 |

```bash
# 视觉理解
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_api_key -- npx -y "@z_ai/mcp-server"

# 联网搜索
claude mcp add -s user -t http web-search-prime https://open.bigmodel.cn/api/mcp/web_search_prime/mcp --header "Authorization: Bearer your_api_key"

# 网页读取
claude mcp add -s user -t http web-reader https://open.bigmodel.cn/api/mcp/web_reader/mcp --header "Authorization: Bearer your_api_key"

# GitHub 仓库读取
claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"

# 浏览器自动化
claude mcp add -s user playwright -- npx -y "@playwright/mcp@latest"
```

**备用（无需 API Key）**:
```bash
# 备用网页读取
claude mcp add -s user -t http web-reader-xdai https://web-reader.xdai.dev

# 备用联网搜索
claude mcp add -s user -t http web-search-prime-xdai https://web-search.xdai.dev
```

### Agent Reach（多平台联网工具）

帮你把 AI Agent 联网所需的工具选型和配置全部做完，装完后 Agent 直接调用上游工具。

**GitHub**: [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach)  让AI去安装

#### 支持的平台

| 类别 | 平台 |
|------|------|
| 零配置即用 | 网页阅读、YouTube/B站、RSS订阅、全网搜索(Exa) |
| 简单配置 | GitHub、Twitter/X、Reddit |
| 需Docker/MCP | 小红书、抖音、微信公众号、LinkedIn |

#### 安装

```bash
# 将以下内容发给 Claude Code，让它读取并执行安装
帮我安装 Agent Reach：
https://raw.githubusercontent.com/Panniantong/agent-reach/main/docs/install.md
```

```bash
# 验证安装
agent-reach doctor
```

#### 可插拔架构

每个渠道独立文件，可随时替换：

- `web.py` - 网页读取（可换 Firecrawl/Crawl4AI）
- `twitter.py` - Twitter（可换官方 API）
- `youtube.py` - YouTube（可换 YouTube API/Whisper）

---

## 3. 安装 Skills

Skills 是社区贡献的 AI 能力模块，通过 `npx skills` 一键安装。

| Skill | 用途 |
|-------|------|
| `seo-audit` | SEO 审计、技术 SEO 诊断 |
| `copywriting` | 营销文案写作 |
| `content-strategy` | 内容策略规划 |
| `social-content` | 社交媒体内容 |
| `email-sequence` | 邮件序列/滴灌营销 |
| `pdf` / `xlsx` / `docx` / `pptx` | 读取和处理对应格式文件 |

```bash
# AI 营销相关
npx skills add coreyhaines31/marketingskills --skill seo-audit copywriting content-strategy social-content email-sequence --agent claude-code -y

# 文档处理（PDF/Excel/Word/PPT）
npx skills add <owner/doc-skills-repo> --skill pdf xlsx docx pptx --agent claude-code -y
```

---

## 4. 验证安装

```bash
# 验证 MCP（预期: 所有项显示 ✓ Connected）
claude mcp list

# 验证 Skills
npx skills list
```

---

## 相关文档

- [03-Skills使用指南.md](./03-Skills使用指南.md)
- [05-Claude-Code第三方API配置.md](./05-Claude-Code第三方API配置.md)
