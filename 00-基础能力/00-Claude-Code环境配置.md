# Claude Code 环境配置

> 最后更新: 2026-04-17

---

## 1. 全局 CLAUDE.md

**路径**: `~/.claude/CLAUDE.md`（项目级 > 全局级）

配置项：语言偏好（中文）、交互原则、工作方式（Read→Edit→Write）、技能触发规则。

---

## 2. 首要安装：Web Access Skill

> **优先级最高**，建议优先安装。

**Web Access** 是一个通用联网 Skill，让 Agent 拥有搜索、阅读、浏览器操作（点击/填表/上传/发布）的完整能力，并复用你 Chrome 的登录态，支持 Sub-Agent 并行、自动经验沉淀。

**安装方式**：把下面这段话发给 Agent：

```
帮我安装 web-access skill，仓库地址是 https://github.com/eze-is/web-access。
这个 skill 原为 Claude Code 设计，安装前请先理解其核心原理和工作逻辑，
再结合你的 Agent 架构与电脑环境进行适配，使其真正融入当前环境，而非生硬移植。
```

**前置条件**：
- 安装 Chrome 浏览器并更新到最新版本
- Chrome 地址栏输入 `chrome://inspect/#remote-debugging`，勾选 `Allow remote debugging for this browser instance`

**使用方式**：
- 安装后直接下达联网任务即可，Agent 会自动加载 Skill
- 示例：`帮我查xx`、`打开xx`、`帮我在xx平台写xx`
- Agent 操作浏览器时 Chrome 会弹窗提示，点击"允许"即可
- 推荐使用大参数多模态模型（Claude、Kimi K2.5），效果最佳

**GitHub**: https://github.com/eze-is/web-access

---

## 3. MCP 安装

> 将 `your_api_key` 替换为智谱AI API Key。

| MCP | 用途 |
|-----|------|
| `zai-mcp-server` | 图片/截图视觉理解 |
| `web-search-prime` | 联网搜索 |
| `web-reader` | 抓取网页正文 |
| `zread` | 读取 GitHub 仓库 |
| `playwright` | 浏览器自动化 |

```bash
claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY=your_api_key -- npx -y "@z_ai/mcp-server"
claude mcp add -s user -t http web-search-prime https://open.bigmodel.cn/api/mcp/web_search_prime/mcp --header "Authorization: Bearer your_api_key"
claude mcp add -s user -t http web-reader https://open.bigmodel.cn/api/mcp/web_reader/mcp --header "Authorization: Bearer your_api_key"
claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"
claude mcp add -s user playwright -- npx -y "@playwright/mcp@latest"
```

**备用（无需 API Key）**:
```bash
claude mcp add -s user -t http web-reader-xdai https://web-reader.xdai.dev
claude mcp add -s user -t http web-search-prime-xdai https://web-search.xdai.dev
```

---

## 3. Skills 安装

> Skill 不是越多越好，功能相近会冲突，推荐 5-8 个高频使用的。

### ⚠️ 安装位置说明

**Skills 必须安装到用户目录**，`npx clawhub@latest install` 会将 Skill 写入**当前工作目录**，需确保不在项目目录下执行。
- ✅ 正确路径：`~/.claude/skills/<skill-name>/SKILL.md`
- ❌ 错误：在项目目录下运行，会在项目里误创建 `skills/` 和 `.clawhub/`

### 安全 & 基础

| Skill | 用途 | 来源 |
|-------|------|------|
| **Skill Vetter** | 安装前安全审查 | [clawhub](https://clawhub.ai/spclaudehome/skill-vetter) |
| **Frontend Design** | 前端审美约束 | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design) |
| **办公四件套** (pdf/xlsx/docx/pptx) | 文档生成 | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills) |
| **Skill-Creator** | 自建 Skill | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/skill-creator) |
| **self-improving-agent** | 自我进化/记忆偏好 | [clawhub](https://clawhub.ai/pskoett/self-improving-agent) |

### 联网 & 信息

| Skill | 用途 | 来源 |
|-------|------|------|
| ⭐ **Web Access** | **首要安装**，搜索+浏览器+登录态+社媒发布 | [eze-is/web-access](https://github.com/eze-is/web-access) |
| **Tavily Search** | AI优化搜索（Web Access 未安装时的备选） | [tavily-ai/skills](https://github.com/tavily-ai/skills) |
| **last30days** | 海外社区讨论数据（选品/竞品） | [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) |
| **summarize** | 长文/视频摘要 | [skills.sh](https://skills.sh/steipete/clawdis/summarize) |

### 调试 & 记忆

| Skill | 用途 | 来源 |
|-------|------|------|
| **PUA** | 卡住时 `/pua` 强制换思路 | [tanweai/pua](https://github.com/tanweai/pua) |
| **Claude-mem** | 跨会话长期记忆 | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) |

### SEO & 营销

| Skill | 用途 | 来源 |
|-------|------|------|
| **seo-geo-claude-skills** | 20个SEO/GEO技能，零依赖 | [GitHub](https://github.com/aaron-he-zhu/seo-geo-claude-skills) ⭐899 |
| **claude-seo** | 19技能+12代理，E-E-A-T/Schema/PDF报告 | [GitHub](https://github.com/AgriciDaniel/claude-seo) ⭐4.3k |
| **Agentic-SEO-Skill** | 16技能+10代理+33脚本 | [GitHub](https://github.com/Bhanunamikaze/Agentic-SEO-Skill) ⭐300+ |
| **marketingskills** | 34个营销技能全家桶 | [GitHub](https://github.com/coreyhaines31/marketingskills) ⭐19.7k |
| **typefully/agent-skills** | 社媒发布(X/LinkedIn/Threads等) | [GitHub](https://github.com/typefully/agent-skills) |
| **claude-blog** | 博客创作+SEO+AEO | [GitHub](https://github.com/AgriciDaniel/claude-blog) ⭐432 |
| **claude-ads** | 付费广告审计(186项检查) | [GitHub](https://github.com/AgriciDaniel/claude-ads) |

### 建站 & 电商

| Skill | 用途 | 来源 |
|-------|------|------|
| **wordpress-agent-skills** | WordPress主题/站点(Automattic官方) | [GitHub](https://github.com/Automattic/wordpress-agent-skills) |
| **Shopify三件套** | 店铺连接+产品管理+内容SEO | [GitHub](https://github.com/jezweb/claude-skills) |
| **shopifyql-skill** | ShopifyQL查询/报告/客户分群 | [GitHub](https://github.com/devkindhq/shopifyql-skill) |

### 邮件 & 配图

| Skill | 用途 | 来源 |
|-------|------|------|
| **email-marketing-bible** | 5.5万字邮件营销知识库 | [GitHub](https://github.com/CosmoBlk/email-marketing-bible) |
| **image-generation** | 多模型配图(GPT/Gemini/FLUX/MJ) | [clawhub](https://clawhub.ai/ivangdavila/image-generation) |

> **配图备选**: [deapi-ai/claude-code-skills](https://github.com/deapi-ai/claude-code-skills)（$0.002/张起） | [free-image-generation-skill](https://clawhub.ai/mrilaikram/free-image-generation-skill)（免费，稳定性一般）

### 远程操控（按需）

| Skill | 用途 | 来源 |
|-------|------|------|
| **Claude-to-IM** | 飞书桥接，手机远程操控 | [GitHub](https://github.com/op7418/Claude-to-IM-skill) |

---

## 4. 中文创作链（花叔 huashu-skills，备用）

> 来源: [alchaincyf/huashu-skills](https://github.com/alchaincyf/huashu-skills) | 路径: `~/.claude/skills/<skill-name>/SKILL.md`

| Skill | 用途 | 触发词 |
|-------|------|--------|
| **topic-generation** | 选题方向+标题+大纲 | "选题"/"写什么" |
| **article-to-x** | 长文转微博/小红书 | "转微博"/"发小红书" |
| **ai-proofreading** | 降AI检测率至30%以下 | "AI味太重" |
| **image-generation** | 配图+上传ImgBB | "配图"/"插图" |
| **video-outline-generation** | 视频脚本大纲 | "视频大纲" |
| **video-script-collaborial** | 脚本口语化 | "口语化" |
| **video-thumbnail-check** | 封面/CTR检查 | "缩略图"/"点击率" |
| **personal-material-search** | 个人素材库搜索 | "真实经历" |
| **info-search-knowledge** | 多渠道信息搜索 | "查资料" |
| **product-analysis** *(自建)* | 产品评估(100分制) | "分析产品" |

> ⚠️ 本地 `image-generation` 与 ClawHub 版同名冲突：英文配图用 ClawHub 版，中文配图用本地版。

---

## 5. 安装命令汇总

> ⚠️ **clawhub 命令必须在 `~/` 下执行**，避免 skills 误装在项目目录。

```bash
# === MCP 验证 ===
claude mcp list          # 预期: 所有项 ✓ Connected

# === Skills 安装（clawhub 来源）===
# CLAWHUB_WORKDIR 指定安装目录，确保 skills 装到 ~/.claude/skills/
$env:CLAWHUB_WORKDIR="$HOME\.claude"    # Windows PowerShell
# export CLAWHUB_WORKDIR="$HOME/.claude"  # Mac/Linux
npx clawhub@latest install skill-vetter
npx clawhub@latest install image-generation

# === Skills 安装（skills.sh 来源）===
npx skills add anthropics/skills --skill pdf xlsx docx pptx frontend-design skill-creator --agent claude-code -y
npx skills add aaron-he-zhu/seo-geo-claude-skills
npx skills add AgriciDaniel/claude-seo
npx skills add coreyhaines31/marketingskills --agent claude-code -y
npx skills add typefully/agent-skills
npx skills add AgriciDaniel/claude-blog
npx skills add AgriciDaniel/claude-ads
npx skills add alchaincyf/huashu-skills --agent claude-code -y

# === 验证 ===
npx skills list -g
```

> Skill 探索: [skills.sh](https://skills.sh/) | [agentskills.so](https://agentskills.so) | [clawhub.ai](https://clawhub.ai)

---

## 6. 自建 Skill

**三原则**：① 重复3次以上才值得固化 ② 单一职责方便组合 ③ 使用中持续迭代

**存放路径**：`~/.claude/skills/<name>/SKILL.md`

```yaml
---
name: my-skill
description: |
  技能描述。触发关键词: "xxx"、"yyy"
---

# 技能名称

## 使用场景
- 场景1

## 工作流程
1. 步骤1
2. 步骤2

## 输出格式
- 输出格式说明
```

---

## 7. 多 Skills 协作

| 模式 | 适用场景 | 特点 |
|------|---------|------|
| **主控 Skill** ⭐ | 固定流程（内容生产、发布） | 一次配置，标准化，可复用 |
| **会话指定** | 探索性/一次性任务 | 灵活，直接在对话中指定 |
| **混合模式** ⭐⭐ | 大部分场景（推荐默认） | 固定流程自动化 + 灵活环节手动 |

**选择决策树**：
```
需要频繁重复执行？
├─ 是 → 主控 Skill 模式
└─ 否
    ├─ 需要灵活探索？ → 会话指定模式
    └─ 核心流程固定？ → 混合模式（推荐默认）
```

**最佳实践**：
- 某操作重复 3 次以上 → 立即创建 Skill
- <10 个 Skill：会话指定；10-30 个：创建主控 Skill；>30 个：混合模式
- 每个 Skill 单一职责 + 明确输入/输出格式，方便串联
