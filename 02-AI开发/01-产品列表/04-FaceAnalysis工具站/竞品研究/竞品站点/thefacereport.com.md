# 竞品深档：thefacereport.com（Known by One, LLC）

> 我方选型的直接母本（01-清单已解剖 23 工具+定价）。本档补齐 SOP 八节结构。建档 2026-09-09。数据源：[Ubs]=Ubersuggest（2026-09-09）｜[SM]=sitemap.xml（2026-09-09 实抓+01-清单 2026-09-09 抓取）｜[Web]=页面实抓（credits/tools/两个工具页）｜集团=Known by One 五姐妹站。

## 1. 档案头

| 项 | 值 | 来源 |
|----|----|------|
| 月访（2026-08） | 118,667 | [Ubs] |
| 有机词 | 4,904 | [Ubs] |
| DA | 3 | [Ubs] |
| 外链/引用域 | 41/31 | [Ubs] |
| 24 月趋势 | 2026-03 起步（13 访）→ 06 10.1K → 07 65.2K → **08 118.7K，爆发增长** | [Ubs] |
| top 词归属 | how attractive am i 14.8K #1（5,409 访）/ jawline rating 4.4K #2 / attractiveness rater 3.6K #1 / ai attractiveness test 14.8K #2 / am i pretty 12.1K #2 / face rating 9.9K #2 / golden ratio face 8.1K #3——**全落在 /tools/ 页** | [Ubs] |
| URL 总数 | 85（去重 HTML；23 工具+53 指南+9 系统/商业页） | [SM] |
| 平台 | Next.js + Vercel（dpl 参数）+ GA4 + Stripe | [Web] |
| 公司 | Known by One, LLC；姐妹站 5 个（faceshapereport.com / coloranalysislab.com / norwoodreport.com / bodyshapereport.com / photoverdict.com，全部 curl 200 实证） | [Web] |
| 定性 | **增长站=正面学习对象**（17 免费工具矩阵+freemium 报告，6 个月 0→119K） | — |

## 2. 信息架构 IA

```
/ (根 = 品牌门面+主 CTA)
├── /tools ×23
│   ├── 免费分析 17：attractiveness / psl-score / symmetry / golden-ratio / facial-ratios /
│   │   jawline-score / canthal-tilt / eye-shape / face-age / skin-analysis / color-analysis /
│   │   hairstyle-finder / face-shape / side-profile / pupillary-distance(+/ruler) /
│   │   eyebrow-mapping / true-mirror
│   └── 付费 AI 变换 6：studio / glow-up / procedure-preview / hairstyle-pack / time-machine / full-analysis
├── /guides ×53
│   ├── 术语词典：gonial-angle / hunter-eyes / hooded-eyes / nose-shapes / lip-shapes /
│   │   norwood-scale / facial-measurement-norms / negative-canthal-tilt
│   ├── pSEO 三组：{7脸型}-face-hairstyles ×7 ｜ glasses-for-{6脸型}-face ×6 ｜ {12季}-color-palette ×12
│   ├── 改善指南 8：improve-jawline / improve-facial-symmetry / better-cheekbones /
│   │   glow-up-tips / collagen-supplements-face / nasolabial-fold-reduction /
│   │   mewing-results / facial-exercises-symmetry / prettier-face
│   ├── 竞品替代 5：umax / qoves / pfpmaker / areum / faceiqlabs -alternative
│   ├── 文化总纲 2：looksmaxxing / face-shape-hairstyle
│   └── 原创研究 1：face-analysis-study（1,995 脸实测）
├── /pricing /credits /sample-report（商业页）
└── /privacy /terms（法务）
```

## 3. pSEO 引擎

- **核心 = `/tools/{metric}` 工具壳族**：一个 MediaPipe 478-landmark 引擎 × 17 个指标词落地页（每页 3,000 词长内容 12 区块，01-清单 §八有完整模板）。
- **指南 pSEO 三组**：脸型×发型（7）、脸型×眼镜（6）、12 季色盘（12）——**双属性映射** `{属性A}-{属性B}` 模式。
- **竞品替代页** `{brand}-alternative`（5 张）——品牌词截流。
- 代表 URL：`/guides/glasses-for-heart-face`、`/guides/soft-autumn-color-palette`、`/guides/umax-alternative`、`/tools/canthal-tilt`。

## 4. 页型分布

| 页型 | 数量 | 占比 | 说明 |
|------|------|------|------|
| 工具页 | 27（含 6 付费+PD/ruler 子页） | 32% | 全部真 SEO 页，top 词 100% 落于此 |
| 指南/blog post | 51 | 60% | 术语+pSEO+替代页，承接文化大词 |
| 静态 page | 7 | 8% | pricing/credits/sample/legal |

**流量修正**（SOP §3）：页数最多=指南（60%），但吃流量最多=工具页（top20 词全部 /tools/）——**战略重心=工具页**，指南是供给放大器。[Ubs 词级+SM 统计交叉]

## 5. page vs post 判定 → WP 映射

- /tools/ 与 /guides/ 全部为 **page** 形态（固定导航、无日期流）——Next.js 静态路由。我方 WP 映射：tools=独立 page+JS 引擎；guides=pSEO 模板 page（数据层 JSON 驱动差异）；无传统 blog。
- 对比我方原计划"15-20 篇文章走 post"：竞品证明**指南也可 page 化**（无时间性内容），仅"研究/新闻"类需 post。〔推断〕

## 6. 更新重心

sitemap 无 lastmod（标"无 lastmod"）。以流量曲线+词 updated_at 推断动作节奏：2026-03 上线 → 06 前工具矩阵建成 → 07-08 指南层扩张（替代页/色盘词新近更新至 09-06）。〔推断，无 lastmod 佐证〕

## 7. 特有情报

1. **"一扫描多工具"复用架构**：17 免费工具共享同一次 478-landmark 扫描结果（credits 页导航逻辑明示）——工程上=一次推理派生全部指标，边际成本≈0。[Web]
2. **三层变现**：免费工具（SEO）→ $17.49 一次性报告（主锚，7 天无理由退款）→ AI image credits（$9.99/10、$19.99/25、$39.99/60，永不过期；studio/preview=1、hairstyle/time-machine=2、glow-up=5 credits/次）。[Web，01-清单]
3. **集团多站模式**：同一引擎铺 6 站（本体+脸型/色彩/发际线/体型/照片判定）——姐妹站 URL 总数：faceshapereport 21、coloranalysislab 32、norwoodreport 21、bodyshapereport 29、photoverdict 14 页。[SM，全部 robots 定位成功]
4. **信任话术组合**："Runs right in your browser. No upload, no account" + 免费 2 小时自动删除 + "never sold or used for AI training" + Not medical advice + 工具页真实论文 References（Faderani 2024 等）。[Web]
5. **集团姐妹站 pageshapereport.com 已占 face shape 词**（SERP 未现于 top24——姐妹站分工不撞词）。〔观察：faceshapereport.com 未进 face shape detector 前 24〕

## 8. 三清单

### 可抄
1. **17 工具壳×一词族一页**（top20 词全落工具页、6 个月 119K——[Ubs] 词级验证）。
2. **/guides/{brand}-alternative 竞品替代页**（umax-alternative 已排 SERP pos19 且词族多篇新更——[SERP 2026-09-09 umax alternative 词]）。
3. **一次性报告定价带 $17.49+7 天退款**（与我方 side-experiment 定位匹配，无订阅客服循环——[Web]）。

### 可超
1. **face shape detector 22.2K 词缺席前 24**（[SERP 2026-07-23]）——我方 P0 正面机会（01-清单已定 EMD 策略）。
2. canthal tilt 族仅 480/月 test 词 pos2、33.1K 大词未占（[Ubs]）。
3. 姐妹站矩阵锁死其扩张方向（Body Shape/Norwood 已铺）——我方独有空间=age 族（faceage.ai 43K 独占）之外的手势/皮肤/照片质量线。〔推断〕

### 须避
1. **无 lastmod + Next.js 全静态**：停更风险不可观测，且指南 page 化后无 freshness 信号（对照 faceshapedetector 的年份化 blog）——两难，我方按内容性质分治。
2. freemium 报告页无结构化数据富结果（SERP 未见 rating/price rich snippet）——报告页 schema 是增量机会而非照抄。[SERP，观察]

---
*姐妹站待第二轮：faceshapereport/coloranalysislab 等五站的词族分工对照（domain_keywords）与 photoverdict 定位。第一轮可续。*
