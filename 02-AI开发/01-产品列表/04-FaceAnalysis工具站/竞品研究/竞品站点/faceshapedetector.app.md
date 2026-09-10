# 竞品深档：faceshapedetector.app

> 本 niche 当前流量最大的垂直工具站。建档 2026-09-09。数据源：[Ubs]=Ubersuggest（overview/serp，2026-09-09）｜[SM]=sitemap.xml 实抓（2026-09-09，raw 留档 `站点sitemap数据/`）｜[Rob]=robots.txt 实抓｜[Web]=页面实抓。

## 1. 档案头

| 项 | 值 | 来源 |
|----|----|------|
| 月访（2026-08） | **258,742** | [Ubs] |
| 有机词 | 7,057 | [Ubs] |
| DA | 18 | [Ubs] |
| 外链/引用域 | 1,066/255（follow 172 / nofollow 894） | [Ubs] |
| 24 月趋势 | 2025-10 起步（8 访）→ 2026-06 27.3K → 07 156.3K → **08 258.7K，爆发增长** | [Ubs] |
| top 词归属 | face shape 90.5K #1（19,419 访）/ face shape detector 22.2K #1 / what is my face shape 14.8K #1 / what face shape do i have 12.1K #1 / how to determine face shape 5.4K #2 | [Ubs] |
| URL 总数 | **213**（去重 HTML，SOP §1 步骤 3 口径；另有独立 image-sitemap.xml 未计） | [SM] |
| 平台 | Next.js（`/_next/static/`）+ jsdelivr CDN，无 generator meta，非 WP | [Web] |
| 定性 | **增长站=头号学习对象**（EMD 起家→全面部特征 pSEO 矩阵） | — |

## 2. 信息架构 IA

```
/ (根 = face shape detector 主工具，吃 face shape 90.5K 大词)
├── /{feature}-shapes/{type}/        ← 核心 pSEO：特征×类型笛卡尔积（7 大特征族）
│   ├── face-shapes/×7 (diamond heart oblong oval round square triangle)
│   ├── eye-shapes/×8 (close-set deep-set downturned monolid protruding round upturned wide-set)
│   ├── eyebrow-shapes/×6 / forehead-shapes/×6 / jawline-shapes/×6 / lip-shapes/×7
│   ├── nose-shapes/×12+ (aquiline bulbous button celestial flat-wide fleshy greek hawk hooked nubian roman snub)
│   ├── skin-undertones/×4 / kibbe-body-types/×13
│   └── color-analysis/seasons/×21 (12 季体系+4 母季+变体)
├── /{feature}-shape-detector        ← 工具页族：eye/eyebrow/forehead/jawline/lip/nose/skin-tone detector
├── {product}-shade-finder           ← 美妆场景工具族：foundation/concealer/lipstick/blush/eyeshadow
├── /{accessory}-for-face-shape      ← 场景导航页：glasses/sunglasses/earrings/makeup/beard/hairstyles(women)
├── /blog/ ×33                       ← how-to 教程（2026 年份化标题：mens-hairstyles-round-face-2026）
├── 零散功能页：/attractiveness-test /golden-ratio-face /how-old-do-i-look /face-symmetry-test
│   /celebrity-look-alike-finder /face-comparison /blur-face /age-calculator-by-photo
│   /eye-distance-calculator /face-analyzer /body-shape-calculator /kibbe-body-type-test
├── /embed-widget                    ← B2B 嵌入产品
└── /faq /contact /privacy /terms /cookie-policy
```

顶级导航推断（按 URL 权重）：Face Shape 工具（根）→ 各特征 detector → 类型库 → 场景配饰页 → blog。根页优先级 1，hub 页 0.95，类型页 0.8-0.9（sitemap priority 明文）。[SM]

## 3. pSEO 引擎（核心 DNA）

**引擎 = 一个 face landmark 检测 × 特征维度全集展开**。三层：

1. **`/{feature}-shapes/{type}` 单属性枚举页**（≈81 页）：每个面部特征（脸/眼/眉/额/颌/唇/鼻/肤色冷暖）各建 4-13 张类型页。代表 URL：
   - `/nose-shapes/roman-vs-aquiline-nose`（**同族对比页变体**——枚举内再衍生 vs 页）
   - `/kibbe-body-types/flamboyant-gamine`（Kibbe 体型体系 13 类全铺）
   - `/color-analysis/seasons/bright-spring`
2. **`{product}-shade-finder` 交叉页**（5 页）：肤色分析 × 美妆产品（foundation/concealer/lipstick/blush/eyeshadow）——特征结果变现导向
3. **`/{accessory}-for-face-shape` 场景页**（6 页）：脸型 × 造型决策（glasses/sunglasses/earrings/beard/makeup/hairstyle）

模式对照（SOP §3）：单属性枚举 = `/{属性A}/{属性B}/` 路径化；shade-finder = `{实体}-for-{场景}` 变体；blog 标题带年份（freshness 模式）。[SM]

## 4. 页型分布（页型级判定，机器统计+人工复核）

| 页型 | 数量 | 占比 | 判据 |
|------|------|------|------|
| 工具页（detector/finder/test/calculator/analyzer/comparison） | 41 | 19% | slug 明文工具词 |
| 类型库页（`{feature}-shapes/{type}` 枚举） | ≈81 | 38% | 静态科普+内链到工具，实质=类目页 |
| 场景导航页（for-face-shape 族） | ≈6 | 3% | 脸型→产品决策 |
| blog post | 52 | 24%（脚本判 52，人工复核 33 篇纯文+19 篇带工具引导） | 流式+年份标题 |
| 静态 page（faq/contact/legal/hub） | ≈33 | 16% | 固定导航 |

**真 SEO 页 = 工具页 41 + 类型库 81**（合计 57%），战略重心=工具+类目库双轮，非博客驱动。[SM 统计+复核]

## 5. page vs post 判定 → WP 映射

- 类型库/工具页/场景页 = **page**（固定层级，属"站点结构/数据层 JSON 驱动"——同族页面共用模板，仅 {feature}/{type} 两变量）
- /blog/ = **post**（33 篇，日期流式，年份化标题）
- WP 映射：`/{feature}-shapes/{type}` 用自定义层级 page（face-shapes 为 parent）；工具页为独立 page 挂载 JS 引擎；blog 走 MD→Gutenberg。[推断]

## 6. 更新重心（lastmod 月度分布）

| 2025-10 | 11 | 12 | 2026-01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 |
|---------|----|----|---------|----|----|----|----|----|----|----|----|
| 4 | 8 | 3 | 1 | 3 | 23 | 11 | 2 | 30 | 22 | 47 | 58（截至 09-09） |

**动作日历**：2025-10 上线（4 页）→ 2026-03 建页潮（23）→ 06 起月均 30-58 页持续扩张，**当前正处于建页加速期**（09 月 9 天已 58 页）。流量拐点（06→07 月 27K→156K）**滞后建页潮约 3 个月**——与 SOP §8 时滞先验（3-6 月）一致。[SM，验证级：lastmod×流量曲线上下对齐]

## 7. 特有情报

1. **robots.txt 明确欢迎全部 AI/LLM 爬虫**：GPTBot/OAI-SearchBot/ChatGPT-User/ClaudeBot/Claude-User/Claude-SearchBot/PerplexityBot/Perplexity-User/Google-Extended 全部显式 `Allow: /`（段落标题明写 "AI / LLM crawlers — explicitly allowed"）+ 独立 `image-sitemap.xml`。[Rob 实抓，2026-09-09]——GEO/ChatGPT 流量是刻意经营面，我方必抄。
2. **EMD 根页吃 90.5K 巨词**：域名即主词（faceshapedetector.app），根页 pos1 已 8 个月（词 updated_at 2026-08 起）——EMD 在本 niche 的权重加成持续有效。[Ubs]
3. **扩张路线可复盘**：face shape（主）→ eye/eyebrow/nose/lip/forehead/jawline（特征族）→ skin-undertone → color-analysis（12 季）→ kibbe（体型跨界）→ shade-finder（美妆变现）→ embed-widget（B2B）——"一个引擎吃干榨尽"的顺序模板。[SM，推断]
4. **同域名家族**：faceshapedetector.ai（DA36）/ .us（DA9，.html 静态站）与之并存在同词 SERP——是否同运营者未证实，标待核。.us 站是老式 .html 构建的老 EMD。[SERP，观察]

## 8. 三清单

### 可抄（验证级证据）
1. **`/{feature}-shapes/{type}` 笛卡尔积结构**——81 张类型页+工具页占全站 57%，配合 06-09 月建页潮 3 个月后流量 9 倍增长（27K→259K，[Ubs]+[SM] lastmod 对齐）。我方 V1 十二壳页之外的内容扩张就抄此结构。
2. **robots.txt 全 AI 爬虫 Allow + image-sitemap**——零成本 GEO 基建（[Rob] 实抓明文）。
3. **shade-finder 交叉页**（肤色×美妆产品 5 页）——特征结果向购买决策导流的页面形态（[SM]；变现承接待第二轮实抓验证）。

### 可超
1. **博客薄弱**（33 篇 vs 类型库 81 页）：looksmaxxing 文化词族（hunter eyes 49.5K/mewing 135K/gonial angle 8.1K）它没做——我方指南矩阵可在此超越（词量见 01-清单 §4.2）。
2. **P0 缺口**：canthal tilt/PSL/attractiveness 仅为零散页，无专攻——本词族我方 P0 六件壳页正面对位（[Ubs] serp：canthal tilt calculator 词它未进前 24）。
3. 名人 pSEO 未做（对照 pinkmirror /person/ 结构）——celebrity face shape 词池空位。

### 须避
1. blog 年份化标题批量铺（mens-hairstyles-round-face-2026 型）有 freshness 续命依赖，潮汐品类停更即衰减（对照 attractivenesstest.com 前例）。
2. 外链 nofollow 占 84%（894/1066）——外链结构偏目录/UGC 来源，非可持续护城河（[Ubs]）。

---
*数据日：2026-09-09（Ubs overview/serp + sitemap/robots 实抓）。第一轮可续：①shade-finder 页变现方式实抓 ②faceshapedetector 家族同源性核查 ③domain_keywords 词级四查②。*
