# 竞品分析 SOP（sitemap 深度研究）

> **适用**：任何品类/行业的竞品深度研究，以及研究之后的本地内容工程落地（第八节）
> **核心原则**：**URL slug 本身就是信息**（页面主题/类型/层级/pSEO 引擎），足够推断架构+内容主题，**不需要读页面正文**
> **操作纪律**（禁子 agent / sample≤20 / 不读正文等）见 memory `competitor-research-toolchain`，不在此重复

---

## 一、流程（5 步）

1. **SERP 发现竞对**：DataForSEO 查品类 3-5 个种子词，每词取 top20-30，过滤大平台（amazon/walmart/homedepot 等）和 OEM 官网，选 10 家独立站；可选再按第六节 Ubersuggest 流量分级排深挖优先级
2. **定位 sitemap**：读 `{domain}/robots.txt` 找 `Sitemap:` 声明（权威来源，不猜 URL）；无声明再试常规路径
3. **完整提取 URL**：Python 全量提取 `<loc>`（递归 sitemap index；大站 >5 万按子文件统计 + 抽样）。**必须全量，不抽样**——sample 对大站只占 0.5-12%，分布必然失真
4. **slug 三维度分析**：LLM 只看统计结果（每类数量 + 样本），不把全部 URL 放进 context
5. **产出对比文档**：10 家对比总表（域名/平台/精确 URL 数/pSEO 引擎/页面类型分布/slug 代表模式）+ 每家三维度分析 + 横向 gap

---

## 二、slug 三维度（方法论核心）

| 维度 | 看什么 | 得出什么 |
|------|--------|---------|
| **路径** | URL 目录层级 | 信息架构 IA（顶级导航/子聚合/页面类型前缀） |
| **模式** | slug 命名规律 | pSEO 引擎 DNA（维度组合） |
| **分布** | 每类 url_count 占比 | 战略重心（产品/内容/pSEO/本地哪个驱动） |

**常见 slug 模式 → pSEO 引擎对照**（跨行业）：

| slug 模式 | pSEO 引擎 | 例子 |
|----------|----------|------|
| `/{属性A}-{属性B}-{核心词}/` | 双属性映射 | `/apple-iphone-15-case/` |
| `/{规格A}/{规格B}/{规格C}/` | 多维规格笛卡尔积 | `/shoes/running/mens/size-10/` |
| `/{实体}-for-{场景}/` | 场景导航 | `/crystals-for-sleep/` |
| `/{实体}-vs-{实体}/` | 对比页 | `/shopify-vs-woocommerce/` |
| `/{实体}-alternatives/` | 替代页 | `/salesforce-alternatives/` |
| `/{地区}/{核心词}/` | 地理 pSEO | `/plumber-chicago-il/` |
| `/location/{州}/{城市}/{服务}/` | 本地服务 | `/services/hvac/new-york/` |

**分布 → 战略重心**：产品页占大头=产品驱动 ｜ 博客/术语库占大头=内容驱动（产品页只转化）｜ pSEO 规格页占大头=pSEO 驱动 ｜ 地理页占大头=本地 SEO 驱动

---

## 三、从 slug 能得到什么（不读页面正文）

信息架构 ｜ 页面类型分布 ｜ pSEO 引擎 ｜ 内容主题矩阵（实体×属性×场景×地区）｜ 战略重心 ｜ 规模与质量信号（分布均衡度；某类页面大量 404 = 堆砌已废弃）｜ 更新重心（`<lastmod>` 分布）｜ 国际化战略（语言分段 sitemap）

> **⚠️ 执行防坑清单（2026-08-22 旅游站项目实战沉淀——每一条都是真实踩坑）**
>
> 1. **页型分布必须做"页型级"不是"目录级"**：只统计一级目录占比（如 trains/ 18%）是打折执行。必须归纳到**统一页型分类**（hub/things-to-do/itinerary/attraction/tour/train/weather/practical/visa/culture/food/**tool**/about 矩阵），且**跨站可对比**——旅游站项目只做了目录级就被用户两次质询，工具页页型因此整类漏掉（竞品 5 个工具子页未进分析，我们 455 页规划零工具页）
> 2. **工具页/交互组件是独立页型，单独扫**：slug 含 calculator/planner/quiz/converter/finder/map/checker/simulator/booking/estimate 的要单独归类；工具是 pSEO 站的高价值页型（AI 抗性强/停留时长/内链枢纽），漏扫=漏掉一整条产品线
> 3. **平台识别后要做 page vs post 判定**（自建 WP 站时）：从 slug 特征+目录结构判定竞品哪些内容用 page（固定层级页）哪些用 post（流式内容+category 聚合）——这个分布直接决定自己站的 WP 架构（page 树 vs post+category 的 URL 与聚合差异）
> 4. **sitemap raw 必须全量存档+聚合结果同时落 JSON**：只存 console 打印或 `urls[:3000]` 截断=复算链断裂（旅游站踩过：三站 d1 聚合只进了终端没进 json，后来被迫重抓）；脚本规范：`{n, urls_all, d1_full, d2_full}` 全进 raw
> 5. **跨词变体归并看意图**：suggest/关键词数据的变体各自显示全量 vol 会虚高 10-20 倍（"great wall how long" 20 个变体每个 49.5K）——分析时必须意图归并后再判量级
> 6. **AI 抗性判读要"答案结构"维度**：单值静态映射词（A=B 查询）与多值决策词（itinerary/对比）在 AIO 时代的命运完全不同——SERP 深查时 AIO 在场率必须分页型统计，不能全站一个平均数
> 7. **一词实测≠词群结论**：单次 SERP 抽查（如 1 个火车词无 AIO）会得出错误品类判断（后实测 16 词 88% 在场）——每个页型至少 8-16 词实测再下结论
> 8. **结论要回写、旧结论要显式推翻**：v1 浅判被 v2 深挖推翻后，正文残留旧判断=文档自相矛盾（旅游站 04 的"Next.js""火车词无 AIO"都踩过）——修订必须在原处标注+版本号，不能只在新节写新结论

---

## 四、平台识别 → sitemap 结构预判

| 平台 | sitemap 特征 | 说明 |
|------|------------|------|
| **Shopify** | `sitemap_products/collections/blogs/pages` 四分段 | 子文件本身就是页面类型分类（天然分组） |
| **BigCommerce** | product/category/brand/page 分段 | 类似 Shopify |
| **WordPress（Yoast/RankMath）** | `sitemap_index.xml` 含 post/page/category | `/{post-type}/{slug}` |
| **Wix/Webflow** | 单文件 | 结构扁平 |
| **自定义 pSEO** | 按维度拆分（`/sitemap-sizes.xml`） | slug 高度规律化 |

> **⚠️ 平台识别踩坑（实战）**：① robots.txt 无 sitemap 声明≠没有 sitemap，但也可能真没有（20 年老站 TCG 连 sitemap 都没有——技术 SEO 原始本身是重要情报：它解释了该站在新词 SERP 隐身）；② XML 转义陷阱：sitemap 可能被 `&lt;loc&gt;` HTML 转义或 CDATA 包裹——正则要兼容三种形态（html.unescape 先行+CDATA 可选组），否则抓到 0 条误判"无 sitemap"；③ 平台记错会污染下游（TCTP 实为 Squarespace 被记成 WP）——curl 看源码标记（generator meta/静态资源域名）确认，不要从 URL 形态推断；④ **`image:loc` 与 `loc` 混块陷阱**：带图片扩展的 sitemap 里 `<url>` 块含 `<image:loc>` 子标签，逐 `<loc>` 正则会失配漏抓（实战漏过整段 post）——必须按 `<url>...</url>` 分块提取块内首个 `<loc>`；⑤ 无代码平台站（Tilda 等）sitemap 结构同样规整，平台识别别只认 WP/Shopify 特征。

---

## 五、外部最佳实践（标注来源）

1. **sitemap 分段 = 内容战略情报**：博客段=内容战略、page 段=商业意图、product 段=收入优先级、category 段=主题权威架构（[LinkedIn](https://www.linkedin.com/pulse/how-reverse-engineer-your-competitors-seo-strategy-ai-akash-sehgal-2uvqc)）
2. **`<lastmod>` 揭示更新重心**：高频更新=战略重心（[Women in Tech SEO](https://www.womenintechseo.com/knowledge/advanced-xml-sitemap-strategies-seo/)）
3. **30K 分块 > 50K 上限**：Google 处理从"几周"变"几天"，竞品已 30K 分块=技术 SEO 成熟（同上）
4. **canonical 弱信号**：sitemap 声明与实际 301/canonical 不一致 = 技术 SEO 缺陷（同上）
5. **URL 结构未必最优**：Direction.com 实测加 topic category 反而降可见度——竞品结构可能是历史包袱，学之前先想（[Direction.com](https://direction.com/site-architecture-and-url-structure/)）
6. **选竞品要混合**：直接竞品 + 更大品牌 + 快速增长 + 内容型 + 排名你目标词的；gap 按业务价值排序（服务页 > use-case > 对比 > 替代）（[LinkedIn](https://www.linkedin.com/pulse/how-reverse-engineer-your-competitors-seo-strategy-ai-akash-sehgal-2uvqc)）

---

## 六、流量数据交叉验证（Ubersuggest MCP）

> slug 分析是**供给侧推断**（建了什么页面）；Ubersuggest 关键词数据是**需求侧验证**（什么在吃流量）。单看 sitemap 只知道"有什么"，交叉才知道"什么有效"。

| Ubersuggest 工具 | 验证什么 | 配合本 SOP 哪步 |
|------|---------|----------------|
| `domain_overview` | 规模分级（关键词数/DA/月流量）+ 24 个月流量趋势 | 步骤 1 竞对筛选：增长站=学习对象，衰退站=切入窗口 |
| `domain_keywords` | 竞品实际吃词 top N（词/排名/流量贡献/落地 URL） | 验证步骤 4 推断的 pSEO 引擎是否真在吃流量 |
| `domain_top_pages` | 哪类页面在吃流量（产品/博客/pSEO） | 修正"分布→战略重心"结论 |
| `backlink_opportunity` | 链到竞品但不链自己的 referring domains | 研究阶段顺产外链建设清单 |

**交叉判读**：
- 有页面无排名 = 无效堆砌（抄结构别抄这个）
- slug 模式 + 对应词有排名 = pSEO 引擎已验证，直接复用
- 吃流量最多的页面类型 ≠ 页面数最多的类型 = 战略重心以流量数据为准（slug 分布只是供给面）
- 流量趋势陡降（如 filterway 2024-09→2026-07 跌 90%）= 竞品衰退，切入窗口

**纪律**：
- SERP 竞对发现**仍只用 DataForSEO**（铁律不变）；volume/KD 主源仍为 SEMrush（Seed-Master），Ubersuggest 是第二交叉源
- 150 次/天全局额度：10 家竞品 × 2-3 查询 ≈ 消耗 20-30 次，研究阶段够用
- 小站常 noData（估算库不覆盖长尾站），属正常非故障；自家站真实数据以 GSC 为准
- 工具配置/额度结构见 memory `ubersuggest-mcp-usage`，不在此重复

---

## 七、方法边界

| 场景 | 方法 |
|------|------|
| 竞品架构 + 内容主题分析 | **本 SOP**（slug 三维度） |
| 流量/关键词验证 | **Ubersuggest MCP**（研究阶段即时交叉验证，见第六节）；SEMrush 主源核对 |
| 单页内容/UX 深拆 | webReader / Playwright |
| backlink / 技术 SEO 审计 | Ubersuggest `backlinks`（快筛）/ Semrush / Screaming Frog（深审） |

**不可替代价值**：不爬全站、不读页面正文，用 URL 结构反推信息架构/pSEO 引擎/内容矩阵/战略重心——成本最低、信息密度最高。

---

## 八、执行层踩坑与纪律（2026-08-22 沉淀，来源：旅游站项目竞品分析全周期复盘）

**执行质量类**：
1. **"最低限度交差"是最大风险**：SOP 写了八个产出维度，执行者容易只做一级目录统计就交差——防坑：执行前把 §三 八维度抄成 checklist 逐项打勾，缺一项就是没做完（不是"做过了"）
2. **被质询后的补救模式要固定**：深挖补做时必须 (a) 回到 raw 重新统计而非凭记忆 (b) 推翻旧结论要在原处显式标注 (c) 补出的维度进文档正文的编号序列（不是塞附录）——否则文档读起来自洽实际矛盾
3. **审查 agent 是标配**：大项目（>10 家竞品/>100 页产出）在竞品研究完成后跑一轮 adversarial 合规审查（对照 SOP 逐项+数据对账+轨迹审计），比人工复核省且抓得准（实测抓出 3 组数字错误+2 个执行缺口）

**数据工具类（竞对数据采集特有）**：
4. **数据源端点先探测后使用**：DFS 的 `keywords_for_domain` 系列实测 HTTP 404（agent 曾误报"可用"导致两轮跑空）——任何新端点先单次探测确认 status_code=20000 再进脚本
5. **Ubersuggest MCP 是 user-scope OAuth，子 agent 不可见**：并行 agent 里用不了，要么主会话先查好喂进 prompt，要么接受替代口径（DFS Labs domain_rank_overview）并标注口径缺口
6. **智谱 1301 审查与地缘词**：竞对关键词数据里的敏感地缘词（Tibet/Taiwan 类）会让 agent 会话被杀——采集脚本层过滤（只计数不落词面），数据落 JSON 而非进对话上下文
7. **429 限流期的断点续跑纪律**：竞对 SERP/关键词批量查询的高峰期限流——任务设计要幂等（断点检查已产出→跳过重做），恢复指令带"先 ls 检查避免重复"；等待时间递增（60s→3min→5min）

**方法沉淀类（竞对判读口径）**：
8. **词群判断最少样本量**：每页型 8-16 词 SERP 实测再下结论（见 §三防坑 7）
9. **SERP 反向观测法**（无域名 top 关键词端点时的替代）：拿 60-100 个代表词跑 SERP 统计每站在场率——观测口径要标注（非全量 top 词），结论可用但精度受限
10. **竞品研究的"研究→生产"闭环**：每个研究结论（页型/词群/写法）必须能指到生产侧的对应物（模板/排产/质检断言）——研究文档里没有"下游指向"的结论等于白研究

---

## 九、研究之后的落地：本地内容工程 → 建站最后一步

> **核心原则**：竞品研究产出引擎/词池/框架后，**内容与建站解耦**。全部产物先本地文件化，建站（WP+Woo）只是最后的"导入"动作。
> **C 端技术栈铁律**：C 端站统一 **WordPress+WooCommerce**（竞品用 Shopify 也不跟随），见 memory `c-end-wp-woo-stack`。

### 8.1 落地顺序（先本地后建站）

| 步骤 | 产物 | 位置 |
|------|------|------|
| 1. 站点结构 | url-map（全站 URL 底册）/nav（IA）/templates（页型骨架） | `structure/` |
| 2. 数据层 | 词池/实体 JSON（机器可读，页面生成的真源） | `data/` |
| 3. pSEO 页面 | HTML（文件名=URL slug） | `pages/{引擎}/` |
| 4. 博客文章 | MD（front matter+四层矩阵） | `posts/{tag}/` |
| 5. **建站（最后）** | WP 装机→REST 批量导入→主题/Rank Math→付款 | 服务器 |

### 8.2 页面契约（HTML）

- **文件名=最终 URL slug**（`hope-morse-code-bracelet.html` → `/hope-morse-code-bracelet/`）
- HTML 头部 META 注释块（title/desc/页型/引擎/优先级）——导入脚本解析用
- 正文从最外层容器开始，**不写 `<html>/<head>` 全页**（导入时套模板）
- 内链绝对相对路径+尾斜杠（与 WP permalink 一致）
- 交互占位用语义标记（如 `<span class="morse-beads" data-code="...">`），不硬编码视觉
- schema 用 `<script type="application/ld+json">` 按页型组合

### 8.3 文章契约（MD）

- 文件名=slug；YAML front matter（title/desc/date/tag/wordcount）
- H1 一次→H2/H3 层级；内链 `[label](/slug/)` 带尾斜杠
- 每篇 ≥1 产品页内链（变现闭环）+ ≥1 姊妹工具站外链（如有）
- 词量按层定（gift guide 1800+/how-to 2000+/科普 1500+）

### 8.4 生产纪律

- **数据驱动**：页面从 data/ JSON 生成内容底座，但每页文字差异化（禁止模板复读换词）
- **事实零错**：码表/数据/价格逐项核对（agent 自检 3 遍）；不编造评价/疗效/承诺
- **agent 分工防冲突**：每 agent 独立目录/独立文件（B1 结构/B2 数据/B3-B5 页面/B6+ 文章各线并行）
- 建站前全量本地质检（死链/码表/schema/词数），**线上验证只做一次**

---

## 内部来源
CLAUDE.md（SERP 纪律/4层SOP）｜ memory `competitor-research-toolchain`（工具链/操作铁律）｜ memory `competitor-research-serp-driven-strict`（5 步铁律）｜ memory `dataforseo-serp-only`（WebSearch 翻车教训）｜ memory `ubersuggest-mcp-usage`（MCP 配置/额度/分工）
