# Claude Code 环境配置

> 换电脑恢复指南 | 最后更新: 2026-05-06

---

## 恢复步骤

### 唯一需要人工做的事：提供 API Key

向 Claude Code 发送：

```
请按照 00-基础能力/01-Claude-Code环境配置.md 中的模板，帮我完成环境初始化。
我的智谱 API Key 是：xxx
```

Claude Code 会自动完成以下所有操作：

| 操作 | 说明 |
|------|------|
| 检测并安装 Node.js、Git 等依赖 | 缺什么装什么 |
| 创建 `~/.claude/settings.json` | 使用下方模板，填入你的 Key |
| 创建 `~/.claude/CLAUDE.md` | 全局指令文件 |
| 安装 MCP（5 个必装） | 见下方 MCP 配置 |
| 安装 Skills | 见下方 Skill 安装 |

---

## MCP 服务器配置

> 通过 `claude mcp add` 安装到用户级。`{{API_KEY}}` = 智谱 API Key。

| MCP | 安装命令 | 用途 |
|-----|---------|------|
| zai-mcp-server | `claude mcp add -s user zai-mcp-server --env Z_AI_API_KEY={{API_KEY}} -- npx -y "@z_ai/mcp-server"` | 图片/截图视觉理解 |
| web-search-prime | `claude mcp add -s user -t http web-search-prime https://open.bigmodel.cn/api/mcp/web_search_prime/mcp --header "Authorization: Bearer {{API_KEY}}"` | 联网搜索 |
| web-reader | `claude mcp add -s user -t http web-reader https://open.bigmodel.cn/api/mcp/web_reader/mcp --header "Authorization: Bearer {{API_KEY}}"` | 网页正文抓取 |
| zread | `claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer {{API_KEY}}"` | GitHub 仓库阅读 |
| dataforseo | 见下方 DataForSEO 专项配置 | SEO 关键词/SERP 数据 |

> 备用方案（无需 API Key）：`web-search-prime-xdai` → `https://web-search.xdai.dev`，`web-reader-xdai` → `https://web-reader.xdai.dev`

### DataForSEO MCP（必装）

> [官方仓库](https://github.com/dataforseo/mcp-server-typescript) | 按 API 调用付费（单次 < $0.01） | 需要 Node.js >= 20

**前置条件：**

1. 在 [app.dataforseo.com](https://app.dataforseo.com/api-access) 注册账号，获取 API 凭据（用户名 + 自动生成的 API 密码）
2. 克隆并构建 MCP Server：

```bash
git clone https://github.com/dataforseo/mcp-server-typescript.git ~/tools/mcp-server-typescript
cd ~/tools/mcp-server-typescript
npm install && npm run build
```

3. 安装到 Claude Code：

```bash
claude mcp add -s user dataforseo \
  -e DATAFORSEO_USERNAME=你的邮箱 \
  -e DATAFORSEO_PASSWORD=你的API密码 \
  -- node ~/tools/mcp-server-typescript/build/main/main/cli.js
```

> 不设置 `ENABLED_MODULES` 时默认启用全部模块（关键词/SERP/外链/OnPage/域名分析/本地SEO/内容分析/AI优化）。

**安装常见问题：**

| 问题 | 解决方案 |
|------|----------|
| `/mcp` 列表中没有 dataforseo | VSCode 扩展版读取 `~/.claude.json`，将配置写入该文件的 `mcpServers` 字段 |
| 连接状态为 failed | 检查 Node.js >= 20，构建产物存在（重新 `npm run build`） |

---

## Skill 安装

> ⚠️ **安装注意事项**：
> - `npx skills add` 默认装到**项目目录**，必须加 **`-g`** 才装到全局 `~/.claude/skills/`
> - `npx clawhub@latest install` 装到**当前工作目录**，建议 `cd ~/` 后执行
> - Skill 触发原理：Agent 匹配 `description` 中的关键词，显示 `[command-message]xxx skill is loading` 即为成功触发

### 安装命令

**Web Access（首要安装）** — 搜索 + 浏览器 + 登录态 + 社媒发布一体化，通过 CDP 直连 Chrome：

```bash
# Chrome 打开 chrome://inspect/#remote-debugging，勾选 Allow remote debugging
git clone https://github.com/eze-is/web-access ~/.claude/skills/web-access
```

**全部安装命令：**

```bash
# clawhub 来源
npx clawhub@latest install skill-vetter
npx clawhub@latest install image-generation

# skills.sh 来源（全部加 -g 全局安装）
npx skills add anthropics/skills --skill pdf xlsx docx pptx frontend-design skill-creator --agent claude-code -y -g
npx skills add aaron-he-zhu/seo-geo-claude-skills -g
npx skills add AgriciDaniel/claude-seo -g
npx skills add coreyhaines31/marketingskills --agent claude-code -y -g
npx skills add typefully/agent-skills --agent claude-code -y -g
npx skills add AgriciDaniel/claude-blog -g
npx skills add AgriciDaniel/claude-ads -g
npx skills add tanweai/pua --agent claude-code -y -g
npx skills add thedotmack/claude-mem --agent claude-code -y -g
npx skills add Bhanunamikaze/Agentic-SEO-Skill --agent claude-code -y -g
npx skills.add Automattic/wordpress-agent-skills --agent claude-code -y -g
npx skills add alchaincyf/huashu-skills --agent claude-code -y -g

# 验证
npx skills list -g
```

> Skill 探索: [skills.sh](https://skills.sh/) | [agentskills.so](https://agentskills.so) | [clawhub.ai](https://clawhub.ai)

### Skill 速查表

> 按使用场景分类。Skill 不是越多越好，功能相近会冲突，推荐 5-8 个高频使用的。

#### 联网 & 搜索

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| ⭐ **web-access** | 搜索+浏览器+登录态+社媒发布 | "帮我搜索" / "打开网页" / "去小红书搜" | [GitHub](https://github.com/eze-is/web-access) |
| **info-search-knowledge** | 多渠道信息搜索 | "查资料" / "调研" | 花叔 huashu-skills |

#### 内容创作

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| **topic-generation** | 选题方向+标题+大纲 | "选题" / "写什么" | 花叔 huashu-skills |
| **ai-proofreading** | 降AI检测率至30%以下 | "AI味太重" / "更自然" | 花叔 huashu-skills |
| **article-to-x** | 长文转微博/小红书 | "转微博" / "发小红书" | 花叔 huashu-skills |
| **claude-blog** | 博客创作+SEO+AEO | "写博客" / "博客大纲" | [GitHub](https://github.com/AgriciDaniel/claude-blog) ⭐432 |
| **copywriting** | 文案撰写 | "写文案" / "产品描述" | marketingskills |
| **product-analysis** *(自建)* | 产品评估(100分制) | "分析产品" | 自建 |

#### 视频创作

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| **video-outline-generation** | 视频脚本大纲 | "视频大纲" / "策划视频" | 花叔 huashu-skills |
| **video-script-collaborial** | 脚本口语化 | "口语化" / "像说话一样" | 花叔 huashu-skills |
| **video-thumbnail-check** | 封面/CTR检查 | "封面" / "点击率" | 花叔 huashu-skills |

#### SEO & 流量

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| **claude-seo** | 19技能+12代理，E-E-A-T/Schema/PDF报告 | "SEO审计" / "分析SEO" | [GitHub](https://github.com/AgriciDaniel/claude-seo) ⭐4.3k |
| **seo** (Agentic-SEO) | 16技能+10代理+33脚本 | "SEO分析" / "Core Web Vitals" | [GitHub](https://github.com/Bhanunamikaze/Agentic-SEO-Skill) |
| **seo-geo** | GEO生成优化 | "GEO优化" | seo-geo-claude-skills |

#### 广告投放

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| **claude-ads** | 付费广告审计(186项检查) | "审计广告" / "广告策略" | [GitHub](https://github.com/AgriciDaniel/claude-ads) |
| **typefully** | 社媒发布(X/LinkedIn/Threads等) | "发推文" / "排期帖子" | [GitHub](https://github.com/typefully/agent-skills) |

#### 营销策略

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| **marketingskills** | 34个营销技能全家桶 | "营销策略" / "定价" / "launch" | [GitHub](https://github.com/coreyhaines31/marketingskills) ⭐19.7k |
| **content-strategy** | 内容规划 | "内容策略" / "内容规划" | marketingskills |
| **afa-dtc-skills** 📦 | DTC全链路增长(30模块+Hub路由) | "/afa" | [GitHub](https://github.com/afadtc/afa-dtc-skills) |

> 📦 **储备**（未安装）：afa-dtc-skills — 独立站操盘10年沉淀，30个模块覆盖市场洞察/广告投放/CRO/留存扩张。与我方SEO内容驱动体系互补。许可证 CC BY-NC 4.0（个人免费）。

#### 调试 & 记忆

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| **pua** | 卡住时强制换思路 | "不行啊" / "原地打转" / "/pua" | [GitHub](https://github.com/tanweai/pua) |
| **mem-search** (claude-mem) | 跨会话长期记忆 | "上次怎么解决的" | [GitHub](https://github.com/thedotmack/claude-mem) |
| **make-plan** | 制定执行计划 | "制定计划" | claude-mem |
| **do** | 执行计划 | "执行计划" | claude-mem |
| **superpowers-zh** | 编码纪律约束（14核心+6中文Skill） | 自动激活 | [GitHub](https://github.com/jnMetaCode/superpowers-zh) ⭐178k |

#### 文档 & 设计

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| **pdf/xlsx/docx/pptx** | 办公文档生成 | "生成PDF" / "创建Excel" | [anthropics/skills](https://github.com/anthropics/skills) |
| **frontend-design** | 前端审美约束 | "设计网页" / "落地页" | [anthropics/skills](https://github.com/anthropics/skills) |
| **image-generation** | 多模型配图(GPT/Gemini/FLUX/MJ) | "配图" / "插图" | [clawhub](https://clawhub.ai/ivangdavila/image-generation) |
| **skill-creator** | 自建 Skill | "创建skill" | [anthropics/skills](https://github.com/anthropics/skills) |
| **skill-vetter** | 安装前安全审查 | — | [clawhub](https://clawhub.ai/spclaudehome/skill-vetter) |

#### 其他

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| **wordpress-block-theming** | WordPress主题(Automattic官方) | — | [GitHub](https://github.com/Automattic/wordpress-agent-skills) |
| **personal-material-search** | 个人素材库搜索 | "真实经历" / "找例子" | 花叔 huashu-skills |

---

## 参考资源

| 资源 | 链接 |
|------|------|
| claude-code-best-practice | [GitHub](https://github.com/shanraisshan/claude-code-best-practice) |
| 官方文档 | [code.claude.com/docs](https://code.claude.com/docs/en) |
| Skill 设计与自建 | [02-Skill设计与管理](./02-Skill设计与管理.md) |
