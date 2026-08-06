# Dream 3 表梳理报告

> **日期**: 2026-07-08
> **数据源**: 用户新建 3 个 dream 表（Google Sheets API 实测）+ 水晶 1B 筛选流程
> **目的**: 盘点 + 梳理 3 表，产出对标启示 + 修正 1C/1E

---

## 一、3 表盘点

| 表名 | ID | 实际内容 | 结构 |
|---|---|---|---|
| **Dream 选品清单** | 1usktu... | ⚠️ **竞品总表模板**（非关键词表）— 6 行竞品域名 + 基础流量，23 列空 | 轨道A（网址/AS/流量） |
| **Dream Top Page** | 15Kcb... | 7 家竞品 Top Pages RAW + CLEAN_TopPages_All | 轨道C（URL/流量%/关键词数） |
| **Dream Top Keywords** | 1ThE4... | 7 家竞品 Top Keywords RAW + CLEAN_TopKeywords_All / CLEAN_TopOpportunity / CLEAN_DreamOpportunity / CLEAN_CrossVerticalOpportunity | 轨道C（Keyword/Pos/Vol/KD/URL） |

> **2026-07-08 表格整理更新**：Dream 专表现以**原始 SEMrush Top Pages / Top Keywords 导出**为 RAW 层；通用 SEMrush 表中重复的 `dreamdictionary` / `dreammoods` 已替换 dream 专表同名 RAW，`dreambible` 已迁入为第 7 家。CLEAN 表由脚本重建，默认不改写 RAW。

### 7 家竞品流量实测（Dream 选品清单，dreambible 2026-07-08 补入）
| 竞品 | AS | Organic Traffic | 评分 |
|---|---|---|---|
| casper.com | 62 | 623K | ⚠️ **错位**（床垫电商，top 全床垫词） |
| dreamdictionary.org | 46 | 231K | 主对标 |
| dreammoods.com | 44 | 189K | 主对标 |
| auntyflo.com | 46 | 155K | **主对标**（杂食深堆） |
| dreaminterpreter.ai | 34 | 42K | AI 工具对标 |
| sleepfy.ai | 12 | 3.5K | 方法论参考（低流量） |

---

## 二、Dream Top Page 梳理（URL 模式 + 流量集中度）

### 7 家 Top Page RAW 行数 + CLEAN
auntyflo **4687** / dreaminterpreter.ai 1984 / casper 1987（错位，CLEAN 后仅 13 行）/ dreambible **516** / dreammoods 236 / dreamdictionary 165 / sleepfy 22。  
CLEAN_TopPages_All：4965 行（API 验证）。

### ⭐ 关键 URL 模式发现（4 家共识 = 赛道事实标准）
**`/dream-dictionary/{symbol}` 被 auntyflo + dreamdictionary.org + dreaminterpreter.ai + dreammoods 4 家共用** — 这是竞品赛道 URL 形态参考,不是本站架构结论；用户搜索验证的是 keyword 意图,不是必须使用该前缀。

| 竞品 | top URL 模式 | 流量集中度 |
|---|---|---|
| dreamdictionary.org | `/dream-dictionary/{symbol}` + `/meaning/{symbol}-dreams` 双轨 | 极集中（首页 42.8%） |
| auntyflo.com | `/dream-dictionary/{symbol}` 单一深堆（4687 页） | **分散健康**（无单页过 1.5%） |
| dreaminterpreter.ai | `/dream-dictionary/definition/{symbol}` | 极端集中（首页 92.4%） |
| dreammoods.com | `/commondreams/{symbol}.html` + `/dreamthemes/{theme}.htm` | 极端集中（首页 97.4%） |
| sleepfy.ai | `/ai-dream-interpreter/` + `/dream-meaning-{symbol}/` | 集中（工具页 45.5%） |

### 对标启示
- **auntyflo 长尾分散模型可复制**（4687 页无单页过 1.5% = 健康长尾矩阵，不依赖域名权威）
- **dreammoods/dreaminterpreter.ai 是域名权威主导**（首页吃 90%+），我们新站学不来
- **类型 hub 验证**：dreammoods `/dreamthemes/{theme}.htm`（pregnancy 424 / snake 404 / wedding 259）吃主题词

---

## 三、Dream Top Keywords 梳理（主题聚类 + 机会词）

### 7 家 Top Keywords RAW 行数 + CLEAN
auntyflo **38668** / casper 41505（错位，CLEAN Keep=469）/ dreaminterpreter.ai 5757 / dreambible **1597** / dreammoods 721 / sleepfy 678 / dreamdictionary 220。  
CLEAN_TopKeywords_All：38313 行；CLEAN_TopOpportunity：11769 行；CLEAN_DreamOpportunity：1443 行；CLEAN_CrossVerticalOpportunity：10326 行（API 验证）。

> ⚠️ 汇总表 `Top keywords` 是 SEMrush 广义 dream 词池（含 American Dream mall / WNBA / Barbie / adidas 香水 / 电影噪音），**不能当竞品证据**，竞品原始 sheet 才是真证据。

### 主题聚类 + 7 家覆盖度
| L1 主题 | 代表词（实测） | 7 家覆盖 |
|---|---|---|
| 字典宽词 | dream interpretation(450K/KD81) / dream dictionary(22K/KD72) | 3 家 |
| AI 工具 | ai dream interpreter(1K/KD22) / dream interpretation ai(1.9K/KD34) | dreaminterpreter.ai + sleepfy **2 家垄断** |
| 动物/灾难 | dreaming apes(18K/KD32) / tornado(4.4K/KD19) / bear(1K/KD18) / black cat(880/KD10) | **仅 auntyflo** |
| 情绪/暴力 | kill someone(480/KD23) / dreamt of death(3.6K/KD28) / shot(2.4K/KD24) | auntyflo + sleepfy |
| **灵性/宗教** | biblical / islam / prophetic / christian | **覆盖薄非 0**（新增 dreambible 后，CLEAN_DreamOpportunity 头部出现 `dream bible` / `islamic dream interpretation` / `christian dream interpretation` / `biblical dream symbols`；机会仍在于头部薄覆盖 + 水晶闭环缺席） |
| **牙齿脱落** | teeth / losing teeth | **覆盖薄非 0**（dreamdictionary /common/teeth-dreams/ 存在但仅 34/月流量，头部被健康大站吃；首发价值仍成立，论据改"竞品薄内容"）⚠️ 2026-07-08 修正原"0 家首发价值确认" |

### ⭐ 三项强证据（印证 1C）
1. **灵性/宗教 = 头部空白、覆盖薄非 0**（dreamdictionary 实测 1317 行低 Vol 长尾，头部 Christian/Biblical/Islam 空白）→ 1C P2 金矿确认（我们 vs 竞品核心差异，⚠️ 2026-07-08 修正原"0 覆盖"表述）
2. **牙齿脱落 = 覆盖薄非 0**（dreamdictionary /common/teeth-dreams/ 存在但仅 34/月流量，头部被健康大站吃）→ 1C P0 甜区首发价值确认（论据改"竞品薄内容 + 头部空"）
3. **AI 工具品牌词 2 家垄断但低 DR** → AIO 入口缝隙确认

### 可抢词 top 10（低 KD + 竞品有量证明 + 竞品 thin）
| # | 词 | Vol | KD | 抢点 |
|---|---|---|---|---|
| 1 | dreaming apes | 18.1K | 32 | auntyflo thin |
| 2 | dreaming tornado | 4.4K | 19 | KD<20 灾难长尾 |
| 3 | dreamt of death | 3.6K | 28 | 灵性切入 |
| 4 | dream symbol snake | 3.6K | 50 | 字典页深做 |
| 5 | dream of been shot | 2.4K | 24 | 情绪 KD 极低 |
| 6 | ai dream interpreter | 1K | 22 | AI 工具缝隙 |
| 7 | bear dream meaning | 1K | 18 | 动物长尾 |
| 8 | dreams of a black cat | 880 | 10 | KD 极低 |
| 9 | dream of burning house | 880 | 31 | 灾难+情绪 |
| 10 | what does my dream mean | 2.4K | 36 | 疑问长尾 |

---

## 四、综合修正（1E + 竞品清单）

### ⚠️ 1E URL 口径修正（2A B 方案裁决）
原 1E 方案 `/{symbol}-dream-meaning/`（根级）被 2A B 方案重新采纳（学塔罗，非 CPT）。本站口径：
- **主词典走 post 根级 `/{symbol}-dream-meaning/`**（2A B 方案；竞品 `/dream-dictionary/{symbol}` 是赛道形态共识非本站架构共识；auntyflo 4687 页深堆验证此结构可承载长尾矩阵）
- **灵性差异页走 Lens 路径** `/{symbol}-dream-biblical-meaning/` + `/-spiritual-meaning/`
- 保留根级 Hub `/crystals-for-dreams/`（变现层）+ `/tools/ai-dream-interpreter/`（工具入口）

### 竞品清单修正
- **casper.com 剔除**（错位 — top 全床垫词，dream 仅 10 行引流；只保留作 CTA 叙事桥接参考）
- **auntyflo 升为主对标**（4687 页长尾分散健康 + 低 KD 动物/灾难池 + 杂食含灵性邻域 angel number 可顺带吃）
- **sleepfy 保持"方法论参考"**（AS 12 / 3.5K 流量低，AIO + Persona 方法论价值 > 流量对标）

### 1C P3 补漏
auntyflo 低 KD 动物/灾难池（apes/tornado/bear/black cat）应显式列入 P3 可抢词 — 1C 原 P3 偏特定动物（crocodile/owl/rat），漏了 auntyflo 已验证有量但 thin 的常见动物。

---

## 五、Dream 选品清单表 澄清

⚠️ **结构错配**：该表是**竞品总表模板**（轨道A：网址/AS/流量），**不是关键词表**（轨道B：Keyword/Volume/KD）。无法在此表跑关键词清洗。

**两种处理**：
- **(A) 若用途是竞品索引**：按轨道A 补全字段（SEMrush 截图/月访问量/渠道拆分/建站平台/Topic Pillar 列），7 家竞品已填基础流量
- **(B) 若想要 dream 关键词 seed 表**：dream 关键词已在 `SEMrush-Seed-Keywords` 的 `Seed-Dreams` 工作表（2,534 条，见 1B 索引）+ 本报告新增"可抢词 top 10 + 灵性/宗教候选 20 词"

> 真正的 dream 关键词主表 = `SEMrush-Seed-Keywords` 的 **Seed-Dreams**（2,534 条），不在 Dream 选品清单表。

---

## 六、下一步

1. **修正 1E URL**（本报告 §四）→ post 根级 `/{symbol}-dream-meaning/` 主轨（2A B 方案）
2. **修正 1C P3**（补 auntyflo 低 KD 动物/灾难池）
3. **补全 Dream 选品清单表**（轨道A 字段）或确认用途
4. **auntyflo 升级深拆**（主对标，低 KD 池 + 杂食邻域）
5. **→ 1H 策略清单**：首发牙齿脱落（P0）+ 对标 auntyflo 低 KD 动物/灾难池（确定性抢量）+ 灵性宗教集群（0 竞品）+ AI 工具入口（AIO 缝隙）

---

*梳理于 2026-07-08 | 数据：3 dream 表 Google API 实测 + 1B 流程 | 修正：1E URL 口径 + 1C P3 + 竞品清单（casper 剔除/auntyflo 升主）*
