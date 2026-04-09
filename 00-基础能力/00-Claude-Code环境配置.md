# Claude Code 环境配置

> AI 自动配置指南 | 最后更新: 2026-04-09

---

## 安装清单

- [x] 全局 CLAUDE.md 配置
- [x] 5 个核心 MCP（视觉、搜索、网页读取、GitHub、浏览器）
- [x] Agent Reach（多平台联网）
- [x] Skills（前端设计、文档处理、联网、记忆等）

---

## 1. 全局 CLAUDE.md

**路径**: `~/.claude/CLAUDE.md`

**优先级**: 项目级 `.claude/CLAUDE.md` > 全局级 `~/.claude/CLAUDE.md`

核心配置项：语言偏好（中文）、交互原则（可控/准确/高效）、工作方式（Read→Edit→Write）、技能触发规则。详见 `~/.claude/CLAUDE.md` 文件本身。

---

## 2. 安装 MCP

将 `your_api_key` 替换为实际的智谱AI API Key。

| MCP | 用途 |
|-----|------|
| `zai-mcp-server` | 视觉理解，识别图片/截图内容 |
| `web-search-prime` | 联网搜索，返回网页标题、URL、摘要 |
| `web-reader` | 抓取指定 URL 的网页正文 |
| `zread` | 读取 GitHub 仓库文档、目录结构、源码 |
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
claude mcp add -s user -t http web-reader-xdai https://web-reader.xdai.dev
claude mcp add -s user -t http web-search-prime-xdai https://web-search.xdai.dev
```

### Agent Reach（多平台联网）

装完后 Agent 可直接调用小红书、B站、YouTube、Twitter 等平台内容。

**GitHub**: [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach)

```bash
# 让 Claude Code 读取安装文档并执行
帮我安装 Agent Reach：
https://raw.githubusercontent.com/Panniantong/agent-reach/main/docs/install.md

# 验证
agent-reach doctor
```

---

## 3. 安装 Skills

Skills 是社区贡献的 AI 能力模块，推荐"少而精"，装太多反而影响效果。

### 安全审查（第一个装）

| Skill | 用途 | 安装来源 |
|-------|------|----------|
| **Skill Vetter** | 安装前安全审查，防恶意投毒。ClawHub 上 10000+ Skill 鱼龙混杂，装前先扫一遍 | [clawhub.ai](https://clawhub.ai/spclaudehome/skill-vetter) |

### 核心必装

| Skill | 用途 | 安装来源 |
|-------|------|----------|
| **Frontend Design** | 解决AI前端审美问题，禁止烂大街字体和紫色渐变，强制先定美学方向 | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design) |
| **办公四件套** (pdf/xlsx/docx/pptx) | 规范化文档生成，自带排版模板和代码模板，不用从零瞎搞 | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills) |
| **Skill-Creator** | 元工具：帮你自己造Skill，从消费者变成创造者 | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/skill-creator) |
| **self-improving-agent** | 自我进化，捕获错误和纠正指令，记住习惯偏好，越用越聪明 | [clawhub.ai](https://clawhub.ai/pskoett/self-improving-agent) |

### 联网 & 信息获取

| Skill | 用途 | 安装来源 |
|-------|------|----------|
| **Web Access** | 联网搜索+浏览器操控，支持小红书/B站等站内内容，带登录态，自动沉淀操作经验 | [eze-is/web-access](https://github.com/eze-is/web-access) |
| **Tavily Search** | AI优化的联网搜索，返回精简高相关结果，专为Agent设计 | [tavily-ai/skills](https://github.com/tavily-ai/skills) |
| **last30days** | 抓10+海外社区（Reddit/X/YouTube/HN等）最近30天真实讨论和参与度数据，选品/竞品分析神器 | [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) |
| **agent-browser** | 自动化浏览器操作：打开页面→识别元素→点击/输入→拉回结果（Vercel出品） | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) |
| **summarize** | 信息压缩，长文/视频/播客转录压成几百字要点，快速判断值不值得细看 | [skills.sh](https://skills.sh/steipete/clawdis/summarize) |

### 调试 & 记忆

| Skill | 用途 | 安装来源 |
|-------|------|----------|
| **PUA** | 专治AI摆烂，四级压力升级+自动选方法论，卡住时 `/pua` 强制换思路 | [tanweai/pua](https://github.com/tanweai/pua) |
| **Claude-mem** | 长期记忆持久化，跨会话记忆注入，三层索引省Token，带本地Web管理界面 | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) |

### 远程操控（按需选装）

| Skill | 用途 | 安装来源 |
|-------|------|----------|
| **Claude-to-IM** | 桥接飞书，手机远程操控电脑上的Claude Code，无需公网IP/内网穿透 | [op7418/Claude-to-IM-skill](https://github.com/op7418/Claude-to-IM-skill) |

### SEO & 关键词分析（出海核心）

| Skill 库 | 包含技能 | 安装来源 |
|----------|---------|----------|
| **seo-geo-claude-skills** | 20个SEO/GEO技能：关键词研究、竞品分析、SERP分析、内容差距分析、反向链接分析、技术SEO检查、排名追踪、Schema生成等。零依赖免API Key，支持中文触发词 | [aaron-he-zhu/seo-geo-claude-skills](https://github.com/aaron-he-zhu/seo-geo-claude-skills) ⭐899 |
| **claude-seo** | 19个子技能+12个子代理：技术SEO、页面分析、E-E-A-T内容质量、Schema、GEO/AEO优化、反向链接、本地SEO、PDF报告生成 | [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) ⭐4.3k |
| **Agentic-SEO-Skill** | 16个子技能+10个代理+33个脚本：技术SEO、竞品对比、hreflang国际SEO，输出结构化报告 | [Bhanunamikaze/Agentic-SEO-Skill](https://github.com/Bhanunamikaze/Agentic-SEO-Skill) ⭐300+ |

### 营销全家桶（内容+社媒+广告+CRO）

| Skill 库 | 包含技能 | 安装来源 |
|----------|---------|----------|
| **marketingskills** | 31个营销技能：SEO审计、AI搜索优化(AEO/GEO)、程序化SEO、文案写作、社媒内容、邮件序列、B2B冷邮件、落地页CRO、广告创意、付费广告、A/B测试、Schema标记、竞品对比页、定价策略、产品发布、推荐计划、流失预防等 | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) ⭐19.7k |
| **claude-blog** | 博客内容创作生态系统：文章生成、内容简报、内容管理，同时优化Google排名和AI引用（SEO+AEO） | [AgriciDaniel/claude-blog](https://github.com/AgriciDaniel/claude-blog) ⭐432 |
| **claude-ads** | 付费广告审计优化：186项检查覆盖Google/Meta/YouTube/LinkedIn/TikTok/Microsoft广告，免费替代广告代理 | [AgriciDaniel/claude-ads](https://github.com/AgriciDaniel/claude-ads) |

### 建站 & 电商

| Skill | 用途 | 安装来源 |
|-------|------|----------|
| **wordpress-agent-skills** | WordPress官方(Automattic)出品，教AI正确构建WordPress主题和站点 | [Automattic/wordpress-agent-skills](https://github.com/Automattic/wordpress-agent-skills) |
| **Shopify三件套** | shopify-setup（连接店铺）、shopify-products（产品管理/批量导入）、shopify-content（页面/博客/SEO元数据） | [jezweb/claude-skills](https://github.com/jezweb/claude-skills) |
| **shopifyql-skill** | ShopifyQL分析查询编写、执行和调试，构建报告和客户分群 | [devkindhq/shopifyql-skill](https://github.com/devkindhq/shopifyql-skill) |

### 邮件营销

| Skill | 用途 | 安装来源 |
|-------|------|----------|
| **email-marketing-bible** | 5.5万字知识库、908个来源、44位专家贡献、19个行业手册，装完后Claude变成邮件营销专家 | [CosmoBlk/email-marketing-bible](https://github.com/CosmoBlk/email-marketing-bible) |

### 自建创作链 Skills（本地自建，社区无替代）

> 路径: `~/.claude/skills/<skill-name>/SKILL.md`

以下 10 个自建 Skill 覆盖内容创作、视频创作、产品分析三条核心工作链。均为中文原生，在 GitHub 社区中搜索对比后确认无对应替代品。

#### 内容创作链：选题 → 写作 → 降AI味 → 配图

| Skill | 用途 | 触发词 |
|-------|------|--------|
| **topic-generation** | 生成3-4个文章选题方向，含标题、大纲、工作量评估、受众分析 | "选题"、"写什么"、"创作灵感" |
| **article-to-x** | 长文转社媒短文（微博/小红书），3种开头风格 | "转微博"、"发小红书"、"精简" |
| **ai-proofreading** | 三遍审校降AI检测率至30%以下（内容→风格→细节） | "AI味太重"、"降低AI检测率"、"更像人写的" |
| **image-generation** | 自动配图+上传ImgBB图床生成Markdown链接 | "配图"、"插图"、"生成图片" |

> **社区对比**: 英文社区有 `content-creator`（davila7）、`content-strategy`（coreyhaines31/marketingskills 内已安装），但都面向英文 SEO 内容，不具备中文选题/降AI味/小红书转写能力。

#### 视频创作链：策划 → 脚本 → 封面检查

| Skill | 用途 | 触发词 |
|-------|------|--------|
| **video-outline-generation** | 生成2-3个视频脚本大纲，含标题建议、缩略图设计、完整结构 | "视频大纲"、"视频策划"、"拍视频" |
| **video-script-collaborial** | 视频脚本口语化审校，4遍流程替换书面化表达 | "口语化"、"太书面了"、"像说话一样" |
| **video-thumbnail-check** | 基于MrBeast策略检查标题/缩略图/钩子，优化CTR | "缩略图"、"点击率"、"封面图" |

> **社区对比**: 英文社区有 [claude-youtube](https://github.com/AgriciDaniel/claude-youtube)（14个子命令覆盖YouTube全流程）、[claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit)（AI配音+Remotion渲染），但全部 YouTube 专用/英文，不具备中文口语化转换和中国平台适配。如内容也发 YouTube 可补充安装 claude-youtube。

#### 产品分析链：选品 → 素材 → 信息搜索

| Skill | 用途 | 触发词 |
|-------|------|--------|
| **product-analysis** | 100分制快速产品评估（市场潜力/差异化/竞争优势/风险） | "分析产品"、"评估产品" |
| **personal-material-search** | 搜索个人真实经历素材库（1800+条），增加内容可信度 | "真实经历"、"找例子"、"素材库" |
| **info-search-knowledge** | 多渠道信息搜索验证，保存到知识库，优先权威科技媒体 | "最新信息"、"搜索资料"、"查资料" |

> **社区对比**: 社区有 `competitive-teardown`（alirezarezvani/claude-skills，12维度竞品分析）、`market-researcher`（VoltAgent，TAM/SAM/SOM市场评估）、[amazon-product-research-skill](https://clawhub.ai/kevinzhangqi/amazon-product-research-skill)（Amazon专用选品），可按需补充安装。但通用的中文出海选品框架仍然是空白。

### 安装方法

**方法一（推荐）**: 把安装地址发给 Claude Code，说"帮我安装这个 Skill"

**方法二（命令行）**:
```bash
# ClawHub 上的 Skill
npx clawhub@latest install skill-vetter

# Anthropic 官方
npx skills add anthropics/skills --skill pdf xlsx docx pptx frontend-design skill-creator --agent claude-code -y

# SEO & 关键词分析（推荐全装）
npx skills add aaron-he-zhu/seo-geo-claude-skills
npx skills add AgriciDaniel/claude-seo

# 营销全家桶
npx skills add coreyhaines31/marketingskills

# 博客内容
npx skills add AgriciDaniel/claude-blog

# 广告审计
npx skills add AgriciDaniel/claude-ads

# 其他工具
npx skills add vercel-labs/agent-browser@agent-browser -g -y
```

> **重要**: Skill 不是装越多越好。每个吃上下文，功能相近的会打架。只装高频使用的 5-8 个。
>
> Skill 探索平台: [skills.sh](https://skills.sh/) | [agentskills.so](https://agentskills.so) | [clawhub.ai](https://clawhub.ai)

---

## 4. 验证安装

```bash
claude mcp list          # 预期: 所有项显示 ✓ Connected
npx skills list -g       # 查看已安装的全局 Skills
```

---

## 相关文档

- [03-Skills使用指南.md](./03-Skills使用指南.md)
