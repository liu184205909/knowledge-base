# AI 订阅地区差价与 API 反代灰产调研

> 调研时间：2026-05-29
> 信息来源：LINUX DO 社区、GitHub 公开仓库、OpenTheRank 价格追踪、知乎/B站教程、新浪财经调查报告、UniFuncs 深度调查

---

## 一、背景

OpenAI（ChatGPT）、Anthropic（Claude）、Google（Gemini）等 AI 服务在不同国家/地区采用差异化定价。这套定价体系被部分用户利用，通过「地区差价 + 虚拟支付 + API 反代」形成一条灰色产业链，以远低于官方价格获取 AI 服务。

---

## 二、核心环节

整条链路分为两个核心环节：**低价开通订阅** + **API 反代共享**。

### 环节 1：低价开通 AI 订阅

#### 2.1.1 地区差价现状（2026 年 5 月数据）

以 ChatGPT Plus 为例，全球 App Store 价格差异显著：

| 排名 | 地区 | 月费（USD） | 对比美国 | 风险 |
|------|------|------------|---------|------|
| 1 | 土耳其 | $10.97 | -45% | 中 |
| 2 | 菲律宾 | $16.16 | -19% | 低 |
| 3 | 巴基斯坦 | $17.58 | -12% | 中 |
| 4 | 加拿大 | $18.18 | -9% | 低 |
| 5 | 日本 | $18.86 | -6% | 低 |
| - | 美国（基准） | $19.99 | 0% | - |
| - | 墨西哥 | $22.95 | +15% | 低 |
| - | 英国 | $26.79 | +34% | 低 |
| - | 丹麦 | $27.85 | +39% | 低 |

> 数据来源：[OpenTheRank ChatGPT 各国价格对比](https://opentherank.com/zh/ai-pricing/chatgpt/)

**关键发现：**
- 土耳其是最便宜的 ChatGPT 订阅地区（$10.97/月），比美国便宜 45%
- 墨西哥在 App Store 渠道反而是 +15%，但网页端 Stripe 结算配合 promo code 可达约 4.6 折
- 印度 Pro 版异常便宜（$110.70 vs 美国 $200），存在更大的套利空间

#### 2.1.2 六种常见低价开通方式

| 方式 | 原理 | 成本 | 成功率 | 风险 |
|------|------|------|--------|------|
| **土耳其区 Apple ID + 礼品卡** | 切换到土耳其 App Store，用土区礼品卡支付 | ~$10.97/月 | 中 | Apple 可检测跨区行为封号 |
| **墨西哥 Stripe + promo code** | 在 ChatGPT 网页端用墨西哥代理，通过脚本生成 Stripe 链接 + promo code 支付 | ~37 美元/4席位 | 高（需墨西哥代理） | 违反 OpenAI ToS |
| **虚拟信用卡（Safepal/Bybit/Bitget Fiat24）** | 用加密货币钱包的虚拟 Visa/Mastercard 支付 | 20 美元标价 + 手续费 | 中（约 40-50%，绑 Apple Pay 提升成功率） | 银行可能拒绝虚拟卡 |
| **PayPal 协议授权** | 利用 Stripe Checkout → PayPal billing agreement 链路重放 | 取决于地区 | 高 | 支付欺诈风险 |
| **代充服务** | 第三方代开（闲鱼/淘宝/海鲜市场） | 150-250 元人民币 | 高 | 账号归属不在自己手里，随时被回收 |
| **Google Play 商店** | 安卓用户通过 Google Play 内购订阅 | 取决于地区 | 中 | Google 可检测跨区 |

#### 2.1.3 墨西哥 Stripe 链路详解（聊天记录中的方法）

这是聊天记录中 ALiko 分享的核心方法：

**工具链：**
- 墨西哥代理 IP（注册和操作时使用）
- Safepal 钱包（瑞士 IBAN，虚拟 Visa 卡）
- Stripe checkout 脚本（生成支付长链接）
- iPhone + Apple Pay（最终支付终端）

**操作步骤：**
1. 用墨西哥代理注册 ChatGPT 账号
2. 在 Safepal 办理 Fiat24 虚拟卡（瑞士 IBAN，用护照开通）
3. 将虚拟卡绑定到 iPhone Apple Pay
4. 在 chatgpt.com 页面的浏览器 Console 中运行 Stripe 镾接生成脚本：
   - 脚本获取当前 session 的 accessToken
   - 调用 `POST /backend-api/payments/checkout`
   - 构造包含 `promo_code: "thinkiamx"` + `country: "MX"` + `currency: "MXN"` 的 payload
   - 生成 Stripe Checkout 长链接
5. 将 Stripe 链接发送到 iPhone，用 Apple Pay 完成支付
6. 开通 2 席位 ChatGPT Team，配合 promo code 约 4.6 折

**成本计算：**
- 2 组账号 = 4x Pro 席位 ≈ 37 美元/月
- 折算单个 Pro 约 9.25 美元/月（原价 200 美元）

---

### 环节 2：API 反代共享

拿到 AI 订阅的凭证后，通过反代将 AI 服务转成标准 API，分发给多人或多种工具使用。

#### 2.2.1 反代工具生态

| 工具 | 功能 | GitHub 星级 | 说明 |
|------|------|-----------|------|
| **Sub2API** | AI API 网关平台（订阅配额分发 + 计费 + 拼车） | 极高（23.8k） | 一站式中转服务，内置支付系统、Web 管理后台，适合搭站运营 |
| **CLIProxyAPI (CPA)** | 全平台 OAuth 反代（Codex/Claude/Gemini/Grok/Antigravity） | 极高 | 聊天记录中的"cpa"，Go 编写，20+ 衍生项目 |
| **copilot-api** (ericc-ch) | GitHub Copilot → OpenAI/Anthropic 兼容 API | 高 | Node.js，一条命令跑起来 |
| **copilot-api-plus** (imbuxiangnan) | Copilot 转 OpenAI/Anthropic API，增强版 | 中 | 支持多账号池、负载均衡 |
| **anti-api** (ink1ling) | Antigravity/Codex/Copilot → 兼容 API | 中 | 多平台统一反代 |
| **aliko-dd/copilot-api** | Docker 封装的 Copilot 反代 | - | 聊天记录中 ALiko 分享的 Docker 镜像 |
| **OctoProxy** | Kiro 专用反代 | - | 专注 Kiro → Claude Code 场景 |
| **kiro-rs** | Kiro 反代 Rust 实现 | - | 配合 kiro-account-manager 管理多账号 |

#### 2.2.2 反代部署方式

**方式一：Sub2API — 一站式 API 网关（适合搭站运营/拼车）**

Sub2API 是目前 GitHub 星标最高（23.8k）的 AI 中转项目，定位比 CPA 更上层 — 不仅是反代，而是完整的 **API 网关 + 计费 + 用户管理平台**。

```bash
# Docker Compose 一键部署
mkdir -p sub2api-deploy && cd sub2api-deploy
curl -sSL https://raw.githubusercontent.com/Wei-Shaw/sub2api/main/deploy/docker-deploy.sh | bash
docker compose up -d
```

Sub2API 核心能力：
- **多上游账号管理** — 支持 OAuth（Codex/Claude/Gemini/Grok/Antigravity）和 API Key
- **API Key 分发** — 为每个用户生成独立的 API Key，平台统一鉴权
- **精确计费** — Token 级别用量追踪和成本计算，内置费率设置
- **智能调度** — 账号选择、粘性会话、负载均衡
- **内置支付系统** — 支持 EasyPay、支付宝、微信、Stripe，用户自助充值
- **Web 管理后台** — Vue 3 前端，监控、管理、用户管理一站式
- **拼车共享** — 多人共享订阅配额，分摊成本
- **简易模式** — `RUN_MODE=simple` 跳过计费，适合个人使用
- **移动端 App** — sub2api-mobile，iOS/Android 管理

> Sub2API vs CPA：CPA 是底层反代工具，Sub2API 是上层运营平台。可以理解为 CPA ≈ Nginx，Sub2API ≈ API Gateway + CMS。

**方式二：CLIProxyAPI（CPA）— 聊天记录中的"cpa"**

CPA 是目前最主流、生态最完整的反代工具，用 Go 编写，支持 OpenAI Codex、Claude Code、Gemini CLI、Grok、Antigravity 等全平台 OAuth 登录和多账号负载均衡。

```bash
# Docker 部署
docker run -d \
  --name cpa \
  -p 3210:3210 \
  -v ~/.cpa:/root/.cpa \
  ghcr.io/router-for-me/cliproxyapi:latest

# 或直接下载二进制
# https://github.com/router-for-me/CLIProxyAPI/releases
```

CPA 核心能力：
- **全平台 OAuth 登录**：Codex / Claude / Gemini / Grok / Antigravity / Kimi / Vertex AI
- **多账号池轮询负载均衡**（round-robin）
- **模型映射**：可将 `claude-opus-4.5` 映射到 `claude-sonnet-4` 等替代模型
- **流式 / 非流式 / WebSocket** 三种响应模式
- **Function calling / Tools** 支持
- **多模态输入**（文本 + 图片）
- **Management API** 供面板管理
- **Go SDK** 可嵌入其他项目
- 周边生态丰富（管理面板、用量统计、配额监控等 20+ 衍生项目）

**方式二：copilot-api（aliko-dd Docker 版）**

聊天记录中 ALiko 分享的 Docker 镜像，基于 copilot-api 封装：

```bash
docker pull ghcr.io/aliko-dd/copilot-api:latest
docker run -d \
  --name copilot-api \
  --restart always \
  -p 4141:4141 \
  -e VERBOSE=true \
  -e RATE_LIMIT=1 \
  -e TIMEOUT=600000 \
  -v /www/wwwroot/copilot-api/data:/data \
  ghcr.io/aliko-dd/copilot-api:latest
```

**方式三：copilot-api（Node.js 原版）**

```bash
npm install -g copilot-api
copilot-api start --claude-code  # 一键接入 Claude Code
```

**反代后端后台管理界面功能：**
- 协议/类型/目标模型/真实模型映射（如请求 Claude Opus 4.7，实际路由到 GPT-5.5）
- Token 消耗统计（输入/输出/缓存/思考）
- 多用户会话管理
- 请求日志和监控
- Codex 5h/7d 配额追踪和剩余量显示

#### 2.2.3 反代使用场景

| 场景 | 说明 |
|------|------|
| **Claude Code 接入 Copilot** | 用 GitHub Copilot 订阅（$19/月）反代出 Claude 模型给 Claude Code 用，套娃省钱 |
| **Kiro 白嫖 Claude** | 利用 AWS Kiro IDE 的免费 550 积分额度，反代 Claude 模型 |
| **Codex API 反代** | 用 ChatGPT Team 的 Codex 配额转成标准 OpenAI API |
| **多账号池** | 堆多个订阅账号做负载均衡，绕过单号速率限制 |
| **模型映射欺骗** | 请求头写一个模型名，实际路由到另一个（比如用便宜的 GPT 替代贵的 Claude） |

---

## 三、完整链路图

```
┌─────────────────────────────────────────────────────────────┐
│                    低价订阅获取                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  墨西哥/土耳其/印尼代理  ──→  注册 ChatGPT 账号            │
│         │                                                   │
│         ▼                                                   │
│  Safepal/Bybit 虚拟卡  ──→  绑定 Apple Pay                 │
│         │                                                   │
│         ▼                                                   │
│  Stripe Checkout 脚本   ──→  生成支付长链接                 │
│         │                     (含 promo code)                │
│         ▼                                                   │
│  iPhone Apple Pay       ──→  完成支付                       │
│         │                                                   │
│         ▼                                                   │
│  获取凭证（RT/AT/邮箱密码）                                 │
│         │                                                   │
│    ┌────┴─────────────────┐                                 │
│    ▼                      ▼                                 │
│  成品号               凭证号 (JSON)                         │
│  (邮箱+密码)          (AT/RT Token)                        │
│  可登网页/APP          仅 API/反代                          │
│    │                      │                                 │
│    ▼                      ▼                                 │
│  直接使用            卡密兑换系统                            │
│  或取码登录          (购买卡密→兑换JSON)                    │
│                           │                                 │
│                           ▼                                 │
│                    API 反代共享                              │
│                    CPA / Sub2API                             │
│                       │                                     │
│                       ├──→ 暴露 OpenAI 兼容 API             │
│                       ├──→ 暴露 Anthropic 兼容 API          │
│                       └──→ 模型映射 / 负载均衡              │
│                                                             │
│  使用端：                                                    │
│  ├── Claude Code (配 ANTHROPIC_API_KEY)                     │
│  ├── Cursor / Windsurf                                     │
│  ├── NextChat / ChatGPT-Next-Web                           │
│  └── 任意 OpenAI 兼容客户端                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 四、灰色产业链全景：账号生产与分销

### 4.1 账号生产端

批量注册是整个产业链的上游。根据 LINUX DO 社区的实测数据：

| 注册方式 | 成本/个 | 成功率 | 24h 存活率 | 说明 |
|----------|--------|--------|-----------|------|
| 机器批量注册 | ~1 元 | ~3% | ~2% | 成本最低但存活率极低 |
| 半自动注册（邮箱别名） | ~0 元 | ~13% | 较低 | 1 个 Gmail 可注册 7 个 GPT 账号 |
| 人工+Camoufox 浏览器注册 | ~3.5 元 | 较高 | 中等 | 反检测浏览器 + 手动辅助 |
| 完整自动化链路注册 | ~5 元 | 高 | 较低 | Gpt-Agreement-Payment 等工具 |

**"1 元一个号"的真相：**

聊天记录中提到的"1 元一个号"，指的是机器批量注册的 ChatGPT 普通免费账号（非 Plus/Pro）。这类账号：
- 由注册机自动批量生成（只需邮箱，无需手机号）
- 成本约 0.5-1 元/个（主要是代理 IP 和域名的摊薄成本）
- **质量极差** — 无 Plus 订阅、无 API 额度、24h 封号率极高
- 主要用途是堆"号池"给反代工具用，单个号用完即弃

**批量注册工具链：**

| 工具 | 说明 |
|------|------|
| Gpt-Agreement-Payment | 端到端自动化：注册 + Stripe 支付 + PayPal 授权 + Codex OAuth |
| HChaoHui/registration_chatgpt | Node.js 批量注册，基于 Pandora-Next |
| kookeey 代理 + 指纹浏览器 | 代理 IP 池 + 反指纹浏览器，提高注册成功率 |
| Cloudflare catch-all 邮箱 | 自建域名 + CF Worker 批量接收 OTP |

### 4.2 分销渠道

账号从生产端到最终用户，经过多层分销：

```
注册机（生产）→ 批发商 → 平台零售商 → 最终用户
     ↓             ↓            ↓
   ~1元/个      ~3-5元/个    ~10-50元/个
```

#### 4.2.1 主流购买渠道

| 渠道 | 账号类型 | 价格区间 | 特点 |
|------|---------|---------|------|
| **淘宝/拼多多** | Plus 独享号 | 150-200 元/月 | 平台担保，但关键词已被屏蔽，需私聊 |
| **闲鱼** | 普号/Plus 号 | 10-50 元/个 | 二手交易，需看卖家信誉，有 Lv2 门槛 |
| **专业发卡平台** | 各类账号 | 5-200 元 | 自动发货，24/7 售卖 |
| **Telegram 群组** | 批发普号/Team 号 | 1-10 元/个（普号） | 无担保，依赖信誉，骗子多 |
| **QQ 群/微信群** | 代充/拼车 | 30-118 元/月 | 社群信任交易，拼车模式常见 |
| **自建商城** | Plus/API/Team | 36-350 元 | 支持支付宝/微信，自动发货 |
| **API 中转站** | API 调用 | 按量计费 | 聚合多账号池，暴露 OpenAI 兼容接口 |

#### 4.2.2 价格参考表（2026 年 5 月）

| 账号/服务类型 | 最低价 | 常见价 | 官方原价 |
|-------------|--------|--------|---------|
| ChatGPT 普通免费号 | 0.45 元 | 1-5 元 | 0（免费注册） |
| ChatGPT Plus 成品号（AT，质保 1 天） | 6 元 | 10-15 元 | $19.99（~144 元） |
| ChatGPT Plus 成品号（质保 30 天） | 58 元 | 75-120 元 | $19.99 |
| ChatGPT Plus 凭证号（RT，JSON） | 6 元 | 8-30 元 | $19.99 |
| ChatGPT Plus 共享（5人） | 36 元/月 | 36-50 元/月 | ~29 元/人 |
| ChatGPT Plus 代充续费 | 118 元 | 145-188 元/月 | $19.99 |
| ChatGPT Pro 代充 | 200-300 元 | 300-400 元/月 | $200（~1440 元） |
| ChatGPT Team 2 席位 | 35 元 | 200-300 元 | $40（~288 元） |
| GPT-5.5/Claude API 访问 | ~1 美元/天 | 几十元/月 | 官方 API 按量计费 |
| Codex API 反代 | 按量 | 50-100 元/月 | Codex 包含在 Pro/Team 中 |

> 注：据新浪财经报道，有中国学生从闲鱼/淘宝购买 GPT-5.4/5.5 和 Claude 的 API 访问权限，价格比官方便宜 96%-97%。有人每天消耗超 1 亿 tokens 仅花费约 1 美元。

### 4.3 账号产品三大类型：成品号 vs 凭证号 vs 卡密

灰色市场上的 ChatGPT Plus/Pro 账号产品，按照**交付形式和使用方式**可分为三大类：

#### 4.3.1 产品分类总览

| 类型 | 交付物 | 能否登网页/APP | 能否用于反代 | 典型价格 |
|------|--------|--------------|------------|---------|
| **成品号** | 邮箱 + 密码 + 验证码 | **能** | 不能（无 Token） | 15-75 元/月 |
| **凭证号（JSON）** | JSON 文件（含 AT/RT） | **不能** | **能**（CPA/Sub2API） | 6-30 元 |
| **卡密兑换** | 兑换码 → 到指定网站提取 JSON | 不能 | 能（提取后导入反代） | 6-10 元 |

#### 4.3.2 成品号（邮箱账密号）

成品号是最传统的产品形态 — 卖家给你一个**已开通 Plus/Pro 的 ChatGPT 账号**，你直接登录使用。

**交付格式：**
```
email@outlook.com----password----client-id----refresh-token
```

| 字段 | 说明 |
|------|------|
| `email@outlook.com` | 登录邮箱（多为 Outlook/Hotmail 微软邮箱） |
| `password` | 登录密码 |
| `client-id` | 微软 OAuth 应用的 Client ID（用于 OAuth 流程） |
| `refresh-token` | 微软 OAuth 的 Refresh Token |

**商品描述实例：**

> "成品号可登网页 image 2 画图：使用邮箱取码功能，得邮箱登录GPT官网后，回来取验证码登录网页。不能使用 sub2，cpa。注意事项：登录 codex 需要手机号，可以自己接码。AT】Plus 邮箱账密格式｜codex 需自行接码 x1"

**关键特征：**
- **可以登录 ChatGPT 网页版和 APP** — 直接用邮箱密码登录
- **可以使用 DALL-E 图片生成** — 即商品描述中的"image 2 画图"
- **不能用于 CPA/Sub2API 反代** — 没有适配的 JSON 凭证格式
- **登录 Codex 需要手机号验证** — OpenAI 风控要求"一号一绑"，需要自备接码
- **邮箱取码** — 卖家提供邮箱访问权限（通常是微软 Outlook），登录 GPT 时需到邮箱取验证码
- **多为 AT 号** — 标注"AT"意味着只有 access_token，约 10 天过期（"周抛"）
- **质保** — 通常质保 1-3 天，贵的质保 30 天

**"登录 Codex 需要手机号"的背景：**

2026 年 5 月，OpenAI 加强了风控：
- **一号一绑** — 一个手机号只能绑定一个 ChatGPT 账号
- Codex 登录强制要求手机号验证
- 大陆和香港手机号不被支持
- 需要通过接码平台（如 5sim、sms-activate 等）获取海外手机号
- **Plus 付费用户**风控相对宽松，免费用户更容易触发验证

#### 4.3.3 凭证号（JSON Token 号）

凭证号是专为**反代工具**设计的产品 — 卖家不给你邮箱密码，只给一个 JSON 文件。

**交付格式（JSON 文件）：**
```json
{
  "user": {"id": "user_xxx", "email": "xxx@outlook.com"},
  "refresh_token": "eyJhbGciOiJSUzI1NiI...",
  "access_token": "eyJhbGciOiJSUzI1NiI...",
  "expires_in": 864000,
  "token_type": "Bearer"
}
```

**商品描述实例：**

> "gpt 印尼渠道 非日抛 带RT(质保首登) x1。下单后发放兑换卡密，发货形式为 CPA+SUB2 JSON。不会用的别买！！！！！带 RT，无需接码 带 RT，无需接码 带 RT，无需接码。卡密兑换地址：https://gpt.dasaobi.top/"

**关键特征：**
- **不能登录 ChatGPT 网页版和 APP** — 只有 Token，没有邮箱密码
- **只能用于 CPA / Sub2API 反代** — JSON 文件直接导入
- **带 RT = 无需接码** — RT 可自动刷新 AT，不需要手机号验证
- **带 RT = 非日抛/非周抛** — 只要账号不被封，RT 持续有效
- **多为印尼渠道** — 通过印尼地区低价开通 Plus，成本更低
- **质保首登** — 只保证首次导入成功，后续被封不赔

#### 4.3.4 卡密兑换系统

卡密兑换是凭证号的一种**分销模式** — 用户买到的是兑换码（卡密），需要到指定网站兑换成 JSON 文件。

**流程：**
```
购买卡密 → 访问兑换网站 → 输入卡密 → 下载 JSON 文件 → 导入 CPA/Sub2API
```

**典型兑换平台：**

| 平台 | URL | 说明 |
|------|-----|------|
| 打扫币 | https://gpt.dasaobi.top/ | 聊天记录中的兑换地址 |
| 度偶 | https://chat.duou.ai/download/ | 度偶 AI 专卖店 |
| KEDAYA | https://gpt.kedaya.xyz/ | 支持批量提取 |
| NFXW | https://json.nloop.cc/ | 附带 CPA↔Sub2API 格式转换 |

**卡密兑换系统的优势（对卖家）：**
- 批量发卡密，不用逐一发送 JSON 文件
- 可控制兑换次数和有效期
- 便于售后管理（卡密可追踪）
- 可集成到自动发卡平台（链动小铺等）

**卡密兑换系统的风险（对买家）：**
- 兑换网站随时可能关停
- 卡密过期后无法兑换
- 卖家跑路后无法获取 JSON

#### 4.3.5 印尼渠道

聊天记录和搜索结果中反复出现的"印尼渠道"是目前最主要的低价 Plus 号来源：

| 特征 | 说明 |
|------|------|
| **注册地区** | 印度尼西亚 |
| **邮箱类型** | 多为 Outlook/Hotmail（微软邮箱） |
| **定价** | Plus 号约 6-15 元/个（批发更低至 1 元） |
| **质量** | 5 月 13 日后几乎所有印尼渠道被 OpenAI 批量封禁 |
| **质保** | 通常质保 1-3 天（"质保首登"= 只保首次成功） |
| **标注** | "非日抛"= 不是当天就废；"带 RT"= 包含 refresh_token |

**渠道波动规律：**
- 月初是 OpenAI 集中清理风控用户的时间
- 5 月 13 日曾发生全渠道封禁事件
- 周初（北美周一/周二）清理概率更高
- 新渠道出来后通常稳定 1-2 周再被批量封禁

---

### 4.4 凭证体系：RT 号 vs AT 号

在了解了账号产品的三大类型后，以下是整个反代产业链中最核心的技术区分 — **RT（refresh_token）** 和 **AT（access_token）**。聊天记录中提到的**"周抛"**和**"日抛"**概念，都指向这两种凭证类型。

#### 4.4.1 RT 与 AT 的区别

| 属性 | refresh_token (RT) | access_token (AT) |
|------|-------------------|-------------------|
| **有效期** | ~10 天，可自动续期 | ~10 天，不可续期 |
| **能否刷新** | 可以自动刷新出新的 AT | **不能**，到期即失效 |
| **在 CPA 中的表现** | 自动轮换 AT，长期可用 | 到期即废，需手动换号 |
| **别名** | "RT 号"、"长抛号" | **"周抛号"** |
| **价格** | 较贵（卖家标注"带 RT"） | 较便宜（AT 号，卖家标注"非 RT"） |
| **适用工具** | CPA / Sub2API 均可 | 仅适合短期使用 |

**核心差异一句话总结：**
- **RT 号**：买一次，CPA 自动续命，能用很久（直到账号本身被封）
- **AT 号**：10 天后凭证过期，无法刷新，直接报废 — 这就是聊天记录中提到的**"周抛"**

#### 4.4.2 凭证文件格式

卖家发货的凭证是 **JSON 文件**，格式大致如下：

```json
{
  "user": {
    "id": "user_xxxxxxxx",
    "email": "example@gmail.com",
    "name": "John Doe"
  },
  "refresh_token": "eyJhbGciOiJSUzI1NiI...",
  "access_token": "eyJhbGciOiJSUzI1NiI...",
  "expires_in": 864000,
  "token_type": "Bearer"
}
```

**关键说明：**
- 文件是 JSON 格式，不是账号密码，不能用于登录 ChatGPT 网页版或 APP
- CPA/Sub2API 直接导入这个 JSON 文件即可反代
- RT 号文件中包含 `refresh_token` 字段；AT 号只有 `access_token`，缺少 `refresh_token`

#### 4.4.3 商品描述解读

聊天记录中的卖家商品描述：

> "GPT plus rt凭证 ChatGPTplus凭证 json文件！json文件！json文件！不能登录GPT网页版和APP端 带rt，带rt，带rt，非at号 非sub2,cpa用户请勿下单"

逐句解读：

| 描述 | 含义 |
|------|------|
| "json文件！json文件！json文件！" | 发货物是 JSON 凭证文件，强调三遍，不是账号密码 |
| "不能登录GPT网页版和APP端" | 凭证仅用于 API/反代，无法用于网页和手机 APP |
| "带rt，带rt，带rt" | 包含 refresh_token，可自动续期，不是"周抛" |
| "非at号" | 明确不是只有 access_token 的短期号 |
| "非sub2,cpa用户请勿下单" | RT 号价格更高，如果用 Sub2API 或 CPA 则买更便宜的 AT 号即可 |

#### 4.4.4 凭证类型与使用场景对照

| 使用场景 | 推荐凭证类型 | 原因 |
|---------|------------|------|
| CPA 长期自建反代 | **RT 号** | CPA 自动刷新 AT，长期稳定运行 |
| Sub2API 搭站运营 | **RT 号** | 多用户依赖，不能断 |
| 临时测试/短期使用 | AT 号（"周抛"） | 成本低，用完即弃 |
| 号池堆量（50+ 号） | AT 号 | 单个成本低，批量消耗，挂了就换 |

#### 4.4.5 闭环：从"1 元一个号"到"周抛"到"卡密"

至此，聊天记录中的所有概念全部串联：

```
批量注册（1元/个）→ 提取凭证（AT/RT）→ 分销 → 用户使用
       ↓                                    ↓
   AT 号（周抛，10天过期）           RT 号（长期可用，自动续期）
       ↓                                    ↓
   成本低，号池消耗品               价格贵，个人反代首选

产品分流：
   成品号（邮箱+密码）→ 直接登录网页/APP → Codex 需手机接码
   凭证号（JSON Token）→ 导入 CPA/Sub2API → 反代 API
   卡密兑换 → 到指定网站提取 JSON → 导入反代

渠道波动：
   印尼渠道（主力）→ OpenAI 月初/周初集中封禁 → 新渠道周期约 1-2 周
```

- **"1 元一个号"** = 批量注册的 free 号，提取凭证后 AT 号 10 天报废
- **"日抛"** = 当天就废的极低质量号（通常 AT 号）
- **"周抛"** = AT 号（access_token），约一周失效，用完丢弃
- **"非日抛"** = 不是当天就废，通常指带 RT 的号
- **"带 RT"** = 包含 refresh_token 的凭证，CPA 可自动续命，长期可用
- **"成品号"** = 邮箱密码号，可登录网页版，但不能用于反代
- **"凭证号"** = JSON 文件，只能用于 CPA/Sub2API 反代
- **"卡密"** = 兑换码，到指定网站换 JSON 文件
- **"印尼渠道"** = 通过印尼地区低价开通的 Plus 号，目前市场主力
- **"质保首登"** = 只保证首次导入成功，后续被封不赔
- **"需接码"** = 登录 Codex 需要手机号验证，OpenAI 一号一绑

---

### 4.5 灰色产业链角色分工

根据新浪财经《赛博套利时代：AI黄牛的灰色生意经》和 UniFuncs 深度调查，整条产业链角色如下：

| 角色 | 职能 | 利润来源 |
|------|------|---------|
| **注册机运营者** | 批量注册账号 | 卖号给批发商，~1 元/个 |
| **支付通道商** | 提供虚拟卡/代付服务 | 开卡费 + 交易手续费 |
| **API 中转站运营者** | 搭建反代，聚合号池 | 按量收费，差价利润 90%+ |
| **拼车组织者** | 组织多人共享一个 Plus | 每人收 30-50 元，5 人赚 50-100% |
| **代充服务商** | 帮用户充值官方订阅 | 每单赚 20-50 元 |
| **平台零售商** | 淘宝/闲鱼/发卡平台卖号 | 差价利润，批量出单 |
| **终端用户** | 以低价使用 AI 服务 | 省钱 |

### 4.6 号池运营模式

反代工具的核心是"号池"（Account Pool），运营模式如下：

```
┌────────────────────────────────────────────┐
│              号池运营架构                    │
├────────────────────────────────────────────┤
│                                            │
│  批量账号 (50-500个)                        │
│    ├── 普号 (1元/个，消耗品)                │
│    ├── Plus 号 (150元/月，主力)             │
│    └── Team 号 (37美元/月，高端)            │
│                                            │
│  反代服务 (copilot-api / anti-api)          │
│    ├── 负载均衡：轮询/随机/最少使用          │
│    ├── 自动换号：封号自动踢出号池            │
│    ├── 模型映射：请求 Claude → 路由 GPT     │
│    └── 速率控制：单号限速，池化提速          │
│                                            │
│  对外接口                                   │
│    ├── OpenAI 兼容 API (localhost:4141)     │
│    └── Anthropic 兼容 API                   │
│                                            │
│  使用端                                     │
│    ├── Claude Code                         │
│    ├── Cursor / Windsurf                   │
│    └── 任意 OpenAI 客户端                   │
│                                            │
└────────────────────────────────────────────┘
```

**一个典型的号池配置（聊天记录中的方案）：**
- 2 组 ChatGPT Team 账号（墨西哥价 ~37 美元/月）
- 每组 2 席位 = 4x Pro 配额
- Docker copilot-api 反代
- 对外暴露 OpenAI/Anthropic 兼容 API
- 足够 1 个开发者日常重度使用

---

## 五、相关项目与资源

### 5.1 反代工具

| 项目 | 链接 | 说明 |
|------|------|------|
| Sub2API | https://github.com/Wei-Shaw/sub2api | AI API 网关平台，23.8k star，内置支付/计费/拼车，适合搭站运营 |
| CLIProxyAPI (CPA) | https://github.com/router-for-me/CLIProxyAPI | 聊天记录中的"cpa"，Go 编写，全平台 OAuth 反代，生态最完整 |
| copilot-api | https://github.com/ericc-ch/copilot-api | Node.js Copilot → OpenAI/Anthropic API |
| copilot-api-plus | https://github.com/imbuxiangnan-cyber/copilot-api-plus | 增强版，支持多账号池 |
| anti-api | https://github.com/ink1ling/anti-api | 多平台统一反代 |
| Gpt-Agreement-Payment | https://github.com/DanOps-1/Gpt-Agreement-Payment | 聊天记录中的项目，完整自动化链路 |

### 5.2 价格追踪

| 资源 | 链接 | 说明 |
|------|------|------|
| OpenTheRank | https://opentherank.com/zh/ai-pricing/chatgpt/ | ChatGPT 各国价格实时对比 |

### 5.3 社区讨论

| 平台 | 说明 |
|------|------|
| LINUX DO (linux.do) | 中文圈主要讨论阵地，教程和实操反馈最多 |
| QQ 群 1028722105 | Gpt-Agreement-Payment 项目交流群 |
| 知乎 / B站 | 有大量 ChatGPT 低价开通教程 |

---

## 六、风险与法律问题

### 6.1 各环节风险

| 环节 | 风险 | 严重程度 |
|------|------|---------|
| 跨区注册 Apple ID | Apple 封号、礼品卡作废 | 中 |
| 虚拟信用卡支付 | 银行拒绝交易、卡被冻结 | 中 |
| Stripe 支付链路重放 | 违反 OpenAI ToS，账号被封 | 高 |
| Promo code 滥用 | OpenAI 可追溯并批量封号 | 高 |
| API 反代共享 | 违反 ToS，可能导致 IP/账号被拉黑 | 高 |
| 模型映射欺骗 | 欺诈行为，可能涉及法律风险 | 极高 |
| 代充服务 | 资金安全无保障，账号随时被回收 | 高 |

### 6.2 可能涉及的法律

- **美国 CFAA**（计算机欺诈和滥用法）— 未经授权访问计算机系统
- **欧盟 GDPR** — 数据处理合规
- **中国刑法第 285/286/287 条** — 非法侵入计算机信息系统、破坏计算机信息系统、利用计算机实施金融诈骗
- **支付欺诈** — Stripe/PayPal 支付链路重放可能构成支付欺诈

### 6.3 OpenAI 的反制措施

根据 Gpt-Agreement-Payment 项目的反欺诈实证数据：
- **IP 精确指纹检测** — 字符串级 IP 指纹追踪
- **批次关联延迟封禁** — 同批次注册账号 24 小时存活率约 2%
- **probe 层 vs ban 层分离** — 先探测再延迟封禁
- **Stripe runtime 指纹漂移检测** — `runtime.version` / `js_checksum` 等参数定期更新

---

## 七、实际可用方案对比

> 以下方案按"成本 × 功能 × 稳定性"综合排序，供参考。

### 7.1 方案总览

| 方案 | 月成本 | 可用模型 | 额度/限制 | 稳定性 | 合规性 |
|------|--------|---------|----------|--------|--------|
| **买 Plus 号 + CPA 自建反代** | 150 元 | GPT-5/Codex/全系列 | 单号足够个人用 | 中（号可能被封） | 灰 |
| **买 free 号堆号池 + CPA** | 30-50 元（含损耗） | GPT-3.5 级别 | 无高级功能 | 低（号经常废） | 灰 |
| **直接用中转站 API** | 按量，几十元 | 取决于中转站 | 按量计费 | 取决于平台 | 灰 |
| **Sub2API 搭站 + 买号池** | 150-300 元 | 全系列 | 多号负载均衡 | 中（Sub2API 更易被标记） | 灰 |
| **GitHub Copilot + CPA** | $19/月 | Copilot 限定模型 | Copilot 额度限制 | 高 | 基本合规 |
| **Google AI Studio** | 免费 | Gemini 系列 | 速率限制 | 高 | 合规 |
| **DeepSeek / Qwen** | 免费或低价 | 国产模型 | 价格极低 | 高 | 合规 |
| **OpenRouter** | 按量付费 | 聚合多模型 | 价格透明 | 高 | 合规 |
| **Cursor Pro** | $20/月 | Cursor 限定 | 编程场景 | 高 | 合规 |

### 7.2 "买号 + 反代"实操要点

如果选择"买号 + CPA 反代"方案，以下是 LINUX DO 社区实测的关键经验：

**号的选择：**

| 号的类型 | 价格 | 适合场景 | 注意事项 |
|---------|------|---------|---------|
| Free 号（0.55-1 元） | 最低 | 只需基础对话 | 到手存活率 10-30%，无高级功能，不值得 |
| Free 号（带手机验证，3-5 元） | 低 | 基础对话，稍稳定 | 存活 1-4 周，仍无 Codex/GPT-5 |
| **Plus RT 号（150+ 元/月）** | 中 | **个人反代首选** | 有 RT 凭证，CPA 自动续命，长期可用 |
| Plus AT 号（较便宜） | 中低 | 短期/测试 | "周抛"，10 天过期，需定期更换 |
| Pro 号（300-400 元/月） | 高 | 重度使用 | 功能最全但反代场景下 1-2 周易封 |

**反代工具选择：**

| 工具 | 封号风险 | 说明 |
|------|---------|------|
| **CPA** | 较低 | 社区反馈 Pro 号 + CPA + 新加坡 IP 能"一直苟" |
| Sub2API | 较高 | 使用人数多、特征明显，OpenAI 更容易标记 |

**降低封号风险的关键因素：**
- 出口 IP 质量：机房 IP 优于数据中心 IP，家宽/伪家宽最优
- 使用频率：不要高强度持续调用，模拟正常使用节奏
- 号的来源：淘宝代充成品号 > 自己注册号 > 批量号
- 工具选择：CPA 的流量特征比 Sub2API 更不容易被识别

### 7.3 中转站直接使用（免自建）

如果不想自己部署反代，可以直接用现成的中转站 API：

| 中转站 | 特点 | 价格水平 |
|--------|------|---------|
| Sub2API 官方赞助商（PinCC/PackyCode 等） | 基于官方 Sub2API 搭建，相对稳定 | 官方价 2-4 折 |
| PPToken | 1 元 = 1 美元额度，GPT 模型 0.16 倍率 | 官方价约 0.22 折 |
| AICodeMirror | Claude/Codex/Gemini 中转 | 官方价 2-38% |
| CloseAI | 企业级 OpenAI 代理 | 比官方便宜约 70% |
| dudu 公益站 | GPT 0.01 价格，社区维护 | 极低（但稳定性无保障） |

> 注意：中转站的安全性无法保证。你的 API Key、对话内容、代码都可能被中转站记录。**不要在中转站上传敏感信息或商业代码。**

### 7.4 完全合规的低成本方案

| 方案 | 成本 | 说明 |
|------|------|------|
| **Volcengine (火山引擎)** | 免费额度 500 万 token/日 | 字节跳动旗下，Seed-Code 等模型 |
| **DeepSeek API** | 极低 | 国产模型，编程能力接近 GPT-4 |
| **Qwen (通义千问)** | 免费/低价 | 阿里旗下，编程能力不错 |
| **Google AI Studio** | 免费额度 | Gemini 模型，有速率限制 |
| **Together AI / Fireworks** | 按量付费 | 开源模型推理，成本极低 |

---

## 八、结论

1. **地区差价套利** 是真实存在的现象，OpenAI/Apple 的定价策略天然创造了套利空间
2. **API 反代** 技术门槛低，Docker 一键部署，工具链成熟（CPA 适合自用，Sub2API 适合搭站）
3. **风险不容忽视** — OpenAI 的反欺诈机制持续升级，批量 free 号存活率极低
4. **买号 + CPA 反代** 是当前社区最流行的低成本方案，但封号风险始终存在
5. **中转站 API** 是最省事的方案，但存在数据安全和隐私风险

---

> **声明：** 本文档仅用于安全研究和行业调研目的，不构成任何操作建议。文中提及的任何方法如果违反相关平台的服务条款或当地法律，使用者需自行承担全部法律责任。
