# 推荐开源项目收藏

> **优质GitHub项目集合** | 持续更新 | 最后更新：2026-05-15

---

## 分类导航

| 分类 | 数量 | 典型项目 |
|------|------|---------|
| [AI 营销工具](#ai-营销工具) | 8 | Fooocus、MoneyPrinterTurbo、Nanobrowser、CloakBrowser、XHS-Crawler-to-Base |
| [客服与消息自动化](#客服与消息自动化) | 1 | Evolution API |
| [AI 开发工具](#ai-开发工具) | 4 | superpowers-zh、TokenTracker、ccusage |
| [通用效率工具](#通用效率工具) | 8 | ERPNext、PlainApp、Vibe、PDFCraft |

---

## AI 营销工具

> 内容生产、数据采集、素材生成等营销场景

### Fooocus

**GitHub**: https://github.com/lllyasviel/Fooocus

**简介**: 本地部署的 AI 图片生成与编辑工具，基于 Stable Diffusion XL，类似 Midjourney 的体验但完全免费离线运行

**核心功能**: 文生图、图片变体（Vary）、高清放大（Upscale）、局部重绘（Inpaint）、边缘扩展（Outpaint）、图生图（Image Prompt）、人脸替换（FaceSwap）

**特点**:
- 类 Midjourney 体验，无需复杂参数调优，专注 Prompt 即可
- 内置 GPT-2 提示词处理引擎，短提示也能出高质量结果
- 三种预设模式：通用（run.bat）、写实（run_realistic.bat）、动漫（run_anime.bat）
- 自研 Inpaint 算法，效果优于标准 SDXL Inpaint
- 支持自定义 LoRA、Style、模型（兼容 Civitai SDXL 模型）
- 完全离线、开源、免费，无需联网

**系统要求**: 最低 4GB NVIDIA VRAM + 8GB 内存 | Windows/Linux/Mac

**快速使用**:
```bash
# Windows：下载解压后直接运行
run.bat            # 通用模式
run_realistic.bat  # 写实模式（适合商品图）
run_anime.bat      # 动漫模式
```

**电商场景**: 商品图片换背景、扩展边缘、重新生成更清晰的视觉素材、产品图变体生成

**项目状态**: LTS（长期支持），仅修复 Bug，暂无迁移到新架构的计划。如需 Flux 等新模型推荐 WebUI Forge / ComfyUI

**适用场景**: 电商产品图处理、内容创作配图、营销素材生成

---

### Nanobrowser

**GitHub**: https://github.com/nanobrowser/nanobrowser

**简介**: 开源 AI 浏览器自动化 Chrome 扩展，OpenAI Operator 的免费替代品，支持多智能体协作

**核心功能**: 网页自动化操作（点击/填表/滚动/导航）、复杂任务自动拆解、实时纠错重试、批量数据采集

**特点**:
- 多智能体协作：Planner（规划）+ Navigator（执行）+ Validator（验证）
- 支持 OpenAI / Anthropic / Gemini / Ollama / Groq 等多种 LLM
- 本地浏览器运行，不上传数据，隐私安全
- 侧边栏聊天界面，自然语言指令操控浏览器
- 自动翻页、点击分类、滚动加载、遇错自主纠错
- 100% 免费开源（Apache 2.0），近万 Stars

**推荐模型配置**:
| 角色 | 高性能方案 | 性价比方案 | 本地方案 |
|------|-----------|-----------|---------|
| Planner | Claude Sonnet 4 | Claude Haiku | Qwen3-30B (Ollama) |
| Navigator | Claude Haiku 3.5 | Gemini 2.5 Flash | Qwen 2.5 Coder 14B |

**安装**: [Chrome Web Store](https://chromewebstore.google.com/detail/nanobrowser/imbddededgmcgfhfpcjmijokokekbkal) 一键安装，或从 GitHub Release 下载手动加载

**与我们工具的关系**:
- **Web Access（已装）**：轻量网页内容抓取，编程时查资料，Claude Code 内使用
- **Nanobrowser（备选）**：复杂网页自动化（批量采集/自动填表/跨站操作），独立于 Claude 运行
- **CloakBrowser（备选）**：强反爬场景的隐身采集
- 三者互补，非替代关系

**适用场景**: 竞品产品数据批量采集、电商比价、自动化填表、跨网站数据整合

---

### CloakBrowser

**GitHub**: https://github.com/CloakHQ/CloakBrowser

**简介**: Chromium 源码级指纹伪装隐身浏览器，Camoufox 停更后的继任者，4.7k+ Star

**核心功能**: 反检测自动化浏览、Cloudflare/reCAPTCHA 绕过、多账号 Profile 管理

**特点**:
- 57 处 C++ 源码补丁（非 JS 注入），编译进 Chromium 二进制
- reCAPTCHA v3 稳定 0.9+（普通 Playwright 仅 0.1），通过 Cloudflare Turnstile 非交互式挑战
- Drop-in 替换 Playwright/Puppeteer API，只改 import
- `humanize=True` 内置真人行为模拟（贝塞尔曲线鼠标、逐字符输入）
- `geoip=True` 自动从代理 IP 匹配时区和语言
- 内置 Browser Profile Manager，Multilogin/AdsPower 的免费替代

**安装**:
```bash
pip install cloakbrowser    # Python
npm install cloakbrowser    # Node.js
```

**与我们工具的关系**:
- 当前数据采集走 API（DataForSEO/SEMrush），暂不需要反爬
- 备用于未来直接采集有强反爬的竞品电商页面

**适用场景**: 目标站点有 Cloudflare/reCAPTCHA 等强反爬时的自动化采集

---

### XHS-Crawler-to-Base

**GitHub**: https://github.com/xisheng687/xhs-crawler-to-base

**简介**: 轻量级小红书笔记爬虫工具 + Codex Skill，输入笔记链接即可提取标题、正文、互动数据和图片/视频，支持飞书多维表格输出

**核心功能**: 短链接解析、笔记元数据提取（标题/正文/类型/互动数/作者）、图片和视频下载、结构化 JSON 输出、飞书多维表格写入

**特点**:
- **无需登录账号**，只解析公开页面中 `window.__INITIAL_STATE__` 的数据
- 纯 Python 标准库实现，零第三方依赖，开箱即用
- 支持 `xhslink.com` 短链接和 `xiaohongshu.com` 长链接
- 自动下载图片/视频到本地，输出标准化 `records.json`
- 内置 Codex / WorkBuddy Skill，可用自然语言触发采集流程
- 不可见字段标记为"未公开/未抓到"，不编造数据
- MIT 协议

**快速使用**:
```bash
# 单条笔记采集
python3 scripts/crawl_xhs_notes.py \
  --output-dir ./xhs-output/batch-001 \
  "http://xhslink.com/o/example"

# 跳过媒体下载，仅提取元数据
python3 scripts/crawl_xhs_notes.py \
  --output-dir ./xhs-output/batch-001 \
  --skip-media \
  "https://www.xiaohongshu.com/discovery/item/xxxxx"
```

**输出示例**:
```json
{
  "id": "笔记ID",
  "title": "笔记标题",
  "desc": "正文内容",
  "type": "多图",
  "interaction": "点赞数: 145；收藏数: 94；评论数: 498；分享数: 62",
  "author": "作者昵称",
  "imageUrls": ["..."],
  "videoUrls": [],
  "mediaFiles": ["note-id/image-1.jpg"]
}
```

**与现有工具的关系**:
- **Nanobrowser**：通用网页自动化，适合复杂交互采集
- **CloakBrowser**：强反爬场景，修改 Chromium 源码级伪装
- **XHS-Crawler-to-Base**：小红书专用轻量采集，零依赖零配置，适合快速抓取单条/少量笔记

**适用场景**: 小红书竞品笔记分析、爆款内容拆解、笔记素材采集、小红书内容整理归档

---

### MediaCrawler（多平台社媒采集）

**GitHub**: https://github.com/NanmiCoder/MediaCrawler

**简介**: 多平台自媒体数据采集工具，30K+ Stars，支持小红书、抖音、快手、B站、微博、贴吧、知乎等主流平台的公开信息抓取

**核心功能**: 关键词/ID 爬取、二级评论采集、登录态缓存、IP 代理池、视频/图片/评论/点赞数据

**技术原理**: 基于 Playwright 浏览器自动化，无需逆向、不用懂加密，零门槛上手

**特点**:
- **跨平台统一**：一个项目覆盖 7+ 主流社媒平台
- Playwright 驱动，不碰签名算法，门槛低
- 支持登录态缓存 + IP 代理池，应对基础反爬
- 阮一峰周刊推荐项目

**⚠️ 参考价值 > 实用价值**：
- 平台反爬更新快，开源项目作者往往跟不动，跑起来可能有坑
- 小红书有限流机制（关键词搜索返回量有上限）
- 生产环境使用前**务必自行验证稳定性**，不要直接依赖

**与现有工具的关系**:
- **XHS-Crawler-to-Base**：小红书单条/少量笔记零成本快速采集
- **MediaCrawler**：跨平台批量采集，适合多平台选题调研、热点监控
- **Nanobrowser / CloakBrowser**：通用网页自动化，适合更复杂的交互场景

**适用场景**: 多平台社媒选题调研、热点内容监控、竞品内容矩阵分析、AI 训练数据采集

**延伸参考（微信公众号采集）**：
MediaCrawler 不覆盖公众号。如需公众号文章采集，GitHub 上可参考：
- **`jooooock/wechat-article-exporter`**（推荐，详见下方专节）
- `wonderfulsuccess/weixin_crawler`（稳定运行 4 年，全历史文章）
- `wnma3mz/wechat_articles_spider`（支持阅读数/点赞/评论）
- `striver-ing/wechat-spider`（免安装，双击即用）

---

### wechat-article-exporter（公众号全量采集 — 推荐）

**GitHub**: https://github.com/wechat-article-exporter/wechat-article-exporter | **在线版**: https://down.mptext.top | Nuxt 3 + Cloudflare Workers

**简介**: 抓取**任意**微信公众号的全量历史文章（非仅自有账号），含正文/图片/阅读量/点赞/收藏/评论数据。基于微信公众平台后台 `searchbiz` / `appmsgpublish` API，无需逆向加密，开箱即用。

**核心能力**:
- **任意账号全量**：通过公众平台搜索接口，无需登录目标账号即可拉取其历史所有文章
- **元数据完整**：阅读量 / 点赞 / 收藏 / 评论数 / 发布时间全部抓取
- **评论抓取**：需一次性配置 cookie（公众平台后台抓包），之后自动复用
- **导出格式**：Markdown / HTML / JSON

**两种用法**:

| 方式 | 入口 | 适用场景 |
|------|------|---------|
| **在线版**（推荐先试） | https://down.mptext.top | 临时/少量账号（如 5-15 个对标号），开箱即用，无需部署 |
| **本地部署** | Docker（端口 3000，需 Chromium）或 Node 22+ | 长期/大规模批量采集，避免在线版限流 |

**本地部署命令**（参考，**当前未装**，因 GitHub 从 bash 不可达）:
```bash
git clone https://github.com/jooooock/wechat-article-exporter
cd wechat-article-exporter
# 方式1：Docker
docker-compose up -d   # http://localhost:3000
# 方式2：Node（需 22+）
pnpm install && pnpm dev
```

**实战记录（2026-06-29）**:
- 当前需求：抓 13 个玄学对标公众号（白桃星座/Alex大叔/同道大叔/艾菲爾老師/灏泽异谈等）做内容分析
- 决策：**13 个账号用在线版 `down.mptext.top` 完全够用，不本地部署**
- 本地部署 GitHub 网络阻塞（直连/proxy 10808/kkgithub mirror 全 timeout），折腾性价比低
- 在线版用法：打开网站 → 输入公众号名 → 选目标账号 → 设抓取范围 → 导出 Markdown

**与现有采集工具的关系**:
- **MediaCrawler**：跨平台社媒（小红书/抖音/B站等），不覆盖公众号
- **wechat-article-exporter**：公众号专精，能拉任意账号全量历史
- **web-access skill**：登录态页面单篇/单列表抓取，无法批量
- 三者互补：MediaCrawler 管社媒矩阵，本工具管公众号矩阵，web-access 管单点登录态

**适用场景**: 玄学/占星/水晶对标公众号内容分析、爆款标题拆解、竞品选题挖掘、公众号矩阵监控

---

### RedFox（商业 API 备选）

**官网**: https://redfox.hk/

**简介**: 跨平台公开数据 API 商业服务，一个 Key 打通抖音、小红书、公众号、视频号、快手、B站、微博等 10+ 平台，字段统一，按量计费

**特点**:
- 一个 API Key 全平台统一字段（标题/点赞/评论/转发/发布时间标准化）
- 按量计费无月费，调多少算多少
- **Skill 生态**：50+ 采集分析技能开源在 GitHub，可装进 Claude Code / Codex，自然语言调数据
- 不用自己维护爬虫、登录态、反爬升级

**定位**：当开源方案（MediaCrawler 等）维护成本过高或字段不统一时，作为付费替代。**先用 400 积分免费额度跑通验证，再决定是否长期使用**。

---

### video-use

**GitHub**: https://github.com/browser-use/video-use

**简介**: Claude Code Skill，用自然语言剪辑视频，自动去口癖、加字幕、调色，完全免费开源

**核心功能**: 自动剪辑、去口头禅、自动调色、烧录字幕、音频淡入淡出、动画叠加、渲染自评

**特点**:
- 来自 browser-use 团队，Claude Code 原生 Skill
- LLM 不看视频帧，通过音频转录（12KB 文本）+ 按需视觉合成图剪辑，节省 token
- 支持 ElevenLabs Scribe 逐词时间戳 + 说话人分离
- 渲染后自动自评（画面跳变、音频爆音、字幕遮挡），不通过则自动修复
- 会话持久化（project.md），支持中断续剪

**依赖**: Python、ffmpeg、ElevenLabs API Key（可选）

**快速使用**:
```bash
git clone https://github.com/browser-use/video-use
cd video-use
ln -s "$(pwd)" ~/.claude/skills/video-use
pip install -e .
brew install ffmpeg
```
然后进入素材文件夹，对 Claude Code 说：`将这些素材剪辑成一条发布视频`

**适用场景**: 短视频制作、播客剪辑、口播去口癖、自媒体内容生产

---

### MoneyPrinterTurbo

**GitHub**: https://github.com/harry0703/MoneyPrinterTurbo

**简介**: 基于 AI 大模型一键生成高清短视频的开源工具，86.8K+ Stars，输入主题或关键词即可自动完成文案、素材、字幕、配乐、合成全流程

**特点**:
- 双尺寸输出：竖屏 9:16 适配抖音/小红书/Shorts，横屏 16:9 适配 YouTube/B站
- 批量生成多个版本，挑最满意的一条
- 视频素材来自 Pexels、Pixabay 等无版权站点，也支持本地素材
- 接入十几种大模型：OpenAI、DeepSeek、通义千问、Gemini、文心一言、MiniMax 等

**快速使用**:
```bash
git clone https://github.com/harry0703/MoneyPrinterTurbo.git
cd MoneyPrinterTurbo
docker-compose up  # 访问 http://127.0.0.1:8501
```

**适用场景**: 自媒体批量短视频生产、产品宣传视频、知识科普视频、社媒内容矩阵运营

---

### free-llm-api-resources

**GitHub**: https://github.com/cheahjs/free-llm-api-resources

**简介**: 汇总所有可通过 API 合法免费使用的 LLM 推理资源，21K+ Stars，排除不合规/逆向接口

**核心价值**: 零成本调用主流大模型 API，用于 N8N 工作流、自动化脚本、原型验证

**亮点资源**:

| 分类 | 平台 | 免费额度 | 备注 |
|------|------|---------|------|
| 永久免费 | Google AI Studio (Gemini) | 25万 token/分钟 | 官方渠道，个人项目首选 |
| 永久免费 | Groq (Llama 3.1 8B) | 14,400次请求/天 | 极低延迟，对响应速度敏感的场景 |
| 试用赠金 | Baseten | $30 额度 | 按算力计费，赠金最高档 |
| 试用赠金 | AI21 / Upstage | 各 $10，3个月有效 | 适合不紧不慢做实验 |
| 试用赠金 | Scaleway | 100万免费 token | 支持 Qwen3、Llama 3.3 70B |

**特点**:
- 覆盖 Llama、Qwen、DeepSeek、Gemini、Mistral、Phi 等主流系列
- 每个服务商的速率限制、注意事项均标注清楚
- 400+ 次提交持续更新，社区活跃

**适用场景**: N8N/自动化脚本调 LLM、原型验证、零成本内容批量生成

---

### BuilderPulse

**GitHub**: https://github.com/builderpulse/builderpulse

**简介**: 每日精选 AI 创业者资讯报告，通过 GitHub 仓库每日自动发布，帮独立开发者和创业者快速获取行业动态

**核心功能**: 每日 AI 创业新闻精选、趋势分析、工具与产品推荐

**特点**:
- 全自动内容生成，每日定时发布
- 覆盖 AI 创业、独立开发、SaaS 等领域
- 通过 GitHub Issues/Releases 分发，订阅方便
- 可作为行业信息源，辅助选题和趋势判断

**适用场景**: 行业信息获取、选题灵感、趋势追踪

---

## 客服与消息自动化

> WhatsApp/社媒消息集成、AI 智能客服、客户沟通自动化

### Evolution API

**GitHub**: https://github.com/evolution-foundation/evolution-api

**简介**: 开源自托管 WhatsApp 消息中枢平台，基于 TypeScript 开发，支持扫码关联 WhatsApp 账号后实现 7x24 自动回复、AI 智能客服、业务流程自动化

**核心功能**:
- **双连接模式**: 免费 Baileys（WhatsApp Web 协议）+ 官方 WhatsApp Cloud API，灵活适配不同规模
- **多服务集成**: 原生对接 Typebot（对话机器人）、Chatwoot（客服系统）、OpenAI（AI 能力）、RabbitMQ/Kafka（消息队列）
- **企业级架构**: 高并发、媒体存储（S3/MinIO）、WebSocket 实时推送
- **自动化流程**: 订单确认通知、物流追踪推送、弃购挽回、关键词触发回复、客户分层标签

**特点**:
- 完全开源免费（仅服务器成本），替代官方 API 节省 90%+ 费用
- 扫码即可关联设备，部署简单
- 对接 AI 后可实现多语言自动翻译、智能问答、客户意图识别
- 所有对话可接入 CRM/BI 系统，数据资产沉淀

**与我们的关系**:
- **当前阶段（B2C 独立站）**: 独立站上线后用于海外客户 WhatsApp 沟通、询盘回复、售后客服
- **潜在业务（外贸服务）**: 可基于此搭建 WhatsApp AI 智能客服服务，面向国内外贸/跨境卖家
- 与 Chatwoot + OpenAI 组合后可实现完整的 AI 客服工作流

**适用场景**: 外贸客户询盘、独立站售后客服、订单确认通知、弃购挽回、物流追踪

---

## AI 开发工具

> AI 编程辅助、Prompt 工程、Skill 设计、Token 用量追踪

### superpowers-zh

**GitHub**: https://github.com/jnMetaCode/superpowers-zh

**简介**: 178K Stars 的 `superpowers` 中文本地化版本。编码纪律型 Skill 集合，核心理念："AI 缺的不是能力而是纪律"

**核心功能**: 14 个核心 Skill + 6 个中文本地化 Skill，覆盖代码规范、测试纪律、安全审查、架构决策

**特点**:
- 自动上下文激活（根据项目语言、文件类型自动触发）
- 强调纪律 > 能力：不教 AI 怎么写代码，而是约束 AI 怎么交付代码
- 与本知识库 `02-Skill设计与管理.md` 的"三层结构（触发→执行→验收）"理念高度一致

**快速使用**:
```bash
npx superpowers-zh
```

**适用场景**: AI 编码纪律强化、Skill 设计参考、团队代码规范自动化

---

### system_prompts_leaks

**GitHub**: https://github.com/asgeirtj/system_prompts_leaks

**简介**: 收集主流 AI 产品系统提示词的开放仓库，涵盖 ChatGPT、Claude、Gemini、Grok、Codex、Perplexity 等，40K+ Stars

**核心价值**:
- 按产品分类收录完整的 system prompt，持续更新
- 学习顶级 AI 公司如何设计"好的 AI 行为"
- 为自建 Skill/System Prompt 提供设计参考

**关键设计模式**（从泄露的 prompt 中提炼）:

| 模式 | 说明 | 典型产品 |
|------|------|---------|
| 人格与生产分离 | 人格描述和行为规范独立维护 | ChatGPT（GPT-5） |
| 权限分层 | 工具调用需要显式授权 | Claude Code |
| 安全边界条件触发 | 遇特定输入时切换安全模式 | Claude、Gemini |
| 多 Agent 协作 | 不同角色分工协作 | Codex |
| 迭代式输出控制 | 分步骤输出而非一次性生成 | Perplexity |

**适用场景**: Skill/System Prompt 设计参考、Prompt 工程学习、AI 行为研究

---

### TokenTracker（已安装）

**GitHub**: https://github.com/mm7894215/TokenTracker

**简介**: 带 Web Dashboard 的 Vibe Coding token 用量追踪工具，覆盖 CLI + IDE 类 AI 编程工具，一行命令安装

**核心功能**: token 用量统计、成本估算、Rate limit 实时进度条、GitHub 风格热力图、按模型/项目归因分析

**特点**:
- 本地优先（Local-first），只传 token 计数，不传提示词或响应内容
- 自动注入 SessionEnd Hook（Claude Code、Codex、Gemini CLI）
- 被动读取 SQLite/JSONL（Cursor、Roo Code、Zed Agent、Goose 等）
- 覆盖 16 个工具：Claude Code、Codex、Cursor、Gemini CLI、OpenCode、Kiro、Roo Code 等
- Dashboard 热力图 + 成本饼图 + 项目柱状图 + rate limit 进度条
- 依赖 LiteLLM 定价库，新模型定价 1-3 天内更新

**安装运行**:
```bash
npx tokentracker-cli          # 首次安装 + 同步历史 + 启动 Dashboard
npx tokentracker-cli serve --port 7860 --no-open  # 指定端口启动
npx tokentracker-cli wrapped --year 2026          # 年度用量报告
npx tokentracker-cli status                       # 查看状态
```

**实测记录（2026-05-26）**:
- 版本：0.24.6，首次即检测到 4.99 亿 tokens（2 个 provider）
- 自动注入 Hooks：Claude Code / Codex / Gemini CLI / OpenCode
- 本机 Wrapped 2026：499.53M tokens / 2,063 会话 / 13 活跃天 / glm-5.1 占 72%
- 端口 7680 在 Windows 上可能 EACCES，建议用 `serve --port 7860`
- Cursor 数据读取需 sqlite3 CLI 加入 PATH（当前跳过）
- 数据目录：`C:\Users\Dylan\.tokentracker\tracker\queue.jsonl`

**适用场景**: Vibe Coding token 成本追踪、多工具用量对比、Rate limit 监控

---

### ccusage

**GitHub**: https://github.com/ryoppippi/ccusage

**简介**: 纯命令行的 Coding Agent CLI token 用量与成本报表工具，Unix 哲学——专注一件事做好

**核心功能**: 日/周/月/会话维度的 token 消耗报表，JSON 导出

**特点**:
- 纯命令行，无 Web 界面，轻量快速
- 覆盖 15 个 CLI 工具：Claude Code、Codex、OpenCode、Amp、Droid、Goose、Kimi、Qwen、Copilot CLI、Gemini CLI 等
- 与 TokenTracker 互补：ccusage 看日常消耗，TokenTracker 做可视化深度分析

**安装运行**:
```bash
npx ccusage@latest
```

**适用场景**: 快速查看 token 消耗、命令行报表、脚本集成

---

## 通用效率工具

> 日常办公、设备互联、内容处理等非 AI 场景

### ERPNext

**GitHub**: https://github.com/frappe/erpnext

**简介**: 100%免费开源的企业资源计划系统（ERP）

**核心功能**: 财务、销售、采购、库存、制造、人力资源、客户关系、项目管理

**特点**:
- 用户友好且可定制
- 低代码/无代码构建器
- API优先设计
- 多子公司、多币种支持

**适用场景**: 中小型企业资源管理

---

### PlainApp

**GitHub**: https://github.com/plainhub/plain-app

**简介**: 用浏览器远程控制安卓手机的开源工具，手机变自托管服务器，无需数据线。替代 QtScrcpy/AirDroid 的免费方案。

**核心功能**: 文件管理、收发短信、查看通讯录/通话记录、屏幕镜像（支持声音）、P2P聊天与跨网文件传输、DLNA/Chromecast投屏

**特点**:
- 无云、无账号、无广告，数据本地或端到端加密（XChaCha20-Poly1305）
- 4.1K+ star，Google Play 下载超百万
- 纯浏览器访问，免安装客户端
- 内置 Markdown 笔记、RSS 阅读器、番茄钟等实用工具
- 支持跨网穿透，不限于同一局域网

**适用场景**: 手机电脑互传文件、无线投屏、短信电脑端管理、隐私优先的设备互联

---

### Telegram-Drive

**GitHub**: https://github.com/caamer20/Telegram-Drive

**简介**: 把 Telegram 账号变成无限、安全的私人云盘，开源跨平台桌面应用

**核心功能**: 无限云存储、媒体流播放、PDF阅读器、拖拽上传、文件夹管理、缩略图预览

**特点**:
- 利用 Telegram API，将 "Saved Messages" 和私有 Channel 作为文件夹
- 媒体文件可直接流式播放，无需下载
- 高性能虚拟滚动，数千文件即时加载
- 隐私优先：API 密钥和数据留在本地，无第三方服务器
- 自动更新（Windows/macOS/Linux）
- 2.5K+ Stars，MIT 协议

**技术栈**: Tauri (Rust) + React + TypeScript + TailwindCSS + Vite

**适用场景**: 个人轻量化资料存储、多端文件同步、替代付费网盘

**备注**: 适合个人场景；团队场景建议群晖等 NAS 方案。另有 VPN 优化版本：[Telegram-Drive-ForVPNs](https://github.com/caamer20/Telegram-Drive-ForVPNs)

---

### Vibe

**GitHub**: https://github.com/thewh1teagle/vibe

**简介**: 跨平台本地语音转录利器，基于 OpenAI Whisper 模型实现全离线音频/视频转录

**核心功能**: 音频转录、视频转录、实时转录、多语言识别、说话人分离

**特点**:
- 全离线处理，数据本地完成，隐私安全
- 支持100+种语言，可翻译为英文
- 全格式兼容（MP4/MP3/MKV等），导出SRT/VTT/PDF等
- GPU加速（Nvidia/AMD/Intel），转录速度提升3-5倍
- 支持视频网站链接解析、麦克风/系统音频实时转录
- AI增强拓展（Claude API、Ollama本地分析）
- 跨平台（Windows/macOS/Linux）

**适用场景**: 会议记录、视频字幕、语音笔记、内容转录

---

### Voicebox

**GitHub**: https://github.com/jamiepine/voicebox

**简介**: 本地优先的开源语音克隆桌面应用，免费版 ElevenLabs，支持声音克隆、文本转语音、音频后期处理与多轨叙事编辑，全程不上云

**核心功能**: 声音克隆、文本转语音（TTS）、多轨叙事编辑、音频后期处理、本地API服务

**特点**:
- 17.4K+ star
- 全本地运行，隐私安全，无需联网
- 基于 Tauri (Rust) + React 构建，跨平台（macOS/Windows/Linux）
- 支持多种语音引擎（Qwen3-TTS等）
- 提供本地 API 接口，可二次集成
- 几秒音频样本即可克隆声音
- GPU加速（CUDA/Metal/XPU），CPU兼容运行

**系统要求**: 8GB+内存（推荐16GB），5GB+存储空间

**快速使用**:
```bash
# 开发部署
git clone https://github.com/jamiepine/voicebox.git
cd voicebox
just setup
just dev

# API 调用示例
curl -X POST http://localhost:17493/generate \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world", "profile_id": "abc123", "language": "en"}'
```

**适用场景**: 视频配音、有声书制作、播客制作、语音克隆、内容创作

---

### ebook2audiobook

**GitHub**: https://github.com/DrewThomasson/ebook2audiobook

**简介**: 将电子书一键转换为有声读物的开源工具，支持1100+种语言

**核心功能**:
- 电子书转有声书（支持epub、pdf、mobi、txt等20+格式）
- 语音克隆（可上传自己的声音样本）
- 智能章节划分
- 多语言支持（1100+种语言）

**特点**:
- 全离线处理，隐私安全
- 跨平台支持（Windows/macOS/Linux）
- GPU加速，转换速度快
- 输出m4b格式，包含完整章节信息

**快速使用**:
```bash
# 克隆项目
git clone https://github.com/DrewThomasson/ebook2audiobook.git
cd ebook2audiobook

# Linux/macOS
./ebook2audiobook.sh

# Windows
ebook2audiobook.cmd
```

**适用场景**: 碎片化学习、通勤听书、技术文档转音频

---

### Fluent-M3U8

**GitHub**: https://github.com/zhiyiYo/Fluent-M3U8

**简介**: 跨平台M3U8流媒体下载工具

**特点**:
- 跨平台（Windows/macOS/Linux）
- 多线程并发下载
- 支持AES-128-CBC解密
- 批量任务管理

**适用场景**: 视频下载和流媒体处理

---

### PDFCraft

**GitHub**: https://github.com/PDFCraftTool/pdfcraft

**简介**: 浏览器本地运行的 PDF 工具箱，90+ 工具 + 可视化工作流自动化编辑器，5.9K+ Stars

**核心功能**: OCR 文字识别、PDF 对比（差异高亮）、表单创建与填写、格式转换全家桶（Word/Excel/PPT/EPUB/Markdown 互转）、合并/拆分/压缩/水印/加密

**核心亮点——工作流自动化（Beta）**:
- 可视化拖拽节点界面，把多个 PDF 操作串成流水线（如 OCR → 合并 → 加水印 → 压缩，一键跑完）
- 23+ 预设模板，支持批量处理、保存复用、格式兼容性校验
- 类似 n8n 的"搭积木"思路，但专注 PDF 场景

**特点**:
- 完全浏览器本地运行（WebAssembly），文件不上传服务器，隐私最高
- Next.js 15 + TypeScript + Tailwind CSS，支持 Docker（约800MB）/Vercel/Netlify 部署
- 9 种语言支持（含中文）
- 与同类对比：Stirling-PDF 老牌但笨重（2GB）、无可视化工作流；补丁丁仅 Windows

**同类对比**:

| 对比项 | PDFCraft | Stirling-PDF | 补丁丁 |
|--------|----------|--------------|--------|
| 处理方式 | 浏览器本地WASM | 服务端Docker | 纯Windows桌面 |
| 工作流 | ✅ 可视化拖拽+模板 | ⚠️ 简单队列 | ❌ 无 |
| 工具数量 | 90+ | 60+ | 偏深度编辑 |
| Docker大小 | ~800MB | ~2GB | 仅Windows |

**快速使用**:
```bash
# Docker 部署（推荐）
docker pull ghcr.io/pdfcrafttool/pdfcraft:latest
docker run -d -p 8080:80 --name pdfcraft ghcr.io/pdfcrafttool/pdfcraft:latest

# 在线使用（无需注册）
# https://pdfcraft.devtoolcafe.com/en/
```

**适用场景**: 客户报告 PDF 处理、批量合同 OCR、SEO 审计报告合并压缩、格式转换

**来源**: [开源先锋 - 90+工具，还带工作流自动化，这款开源PDF新秀火了!](https://mp.weixin.qq.com/s/vqOxDZErXKACmNDjR-9vxg)

---

**最后更新**: 2026-06-14
