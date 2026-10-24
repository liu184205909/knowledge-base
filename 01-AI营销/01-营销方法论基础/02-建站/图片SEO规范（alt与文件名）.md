# 图片SEO规范（alt与文件名）

> **定位**：全 C 端站（内容生产线 article-factory、WP 建站/上传线、Elementor 页面线）**图片 on-page 优化唯一真源**——alt 写法四型分流、文件名与 slug 联动、图片全链配套（格式/懒加载/结构化数据/sitemap）、禁忌清单。依据=Google 官方口径 + 电商最佳实践 + 仿真花双竞品实抓 + cushionmill 线上抽检（2026-10-17，来源见 §九）。
>
> **执行与验收协议（条款卡模式——防执行层摘要化，全库统一）**：①**派活=抄卡**——本文档整体即执行卡：产文/建页任务书必须注入 §一四型公式表 + §四禁忌清单全文（禁只写指针"按图片SEO规范"）；②**交付=回执先行**——交付物第一部分=逐条回执表（`✅已做（证据落点）｜不适用（原因）｜未做（原因+补做时点）`），无证据视同未做；③**验收=数表**——对照 §八验收清单逐行核，空行打回，无回执=交付无效。

**版本**：v1.0 | 2026-10-17 | 首版：Google官方+Shopify/imageseo/Perrill四方口径交叉，nearlynatural（Shopify栈）与balsamhill（自建DAM栈）实抓，cushionmill 现状抽检定基线

---

## 一、alt 四型分流公式（核心表）

**总原则**（Google 官方 [G1]）：alt 是图片**最重要**的元数据属性；Google 用 alt 文本 + 计算机视觉 + 页面上下文**三者共同**理解图片主题——alt 是唯一能写"图为什么在这页"的通道。写人能听懂的完整短语，禁词组堆砌。

| 图型 | 公式 | 长度 | 示例（仿真花站） |
|---|---|---|---|
| **1. 类目/页面 hero 图** | 类目关键词 + 场景/核心卖点 | 8–15 词 | `Artificial flowers for outdoor porch decor in full sun, UV resistant faux blooms in planters` |
| **2. 产品图·主图** | 品种/品类词 + 关键属性（尺寸/材质/色） + 特征标签（Real Touch/UV Resistant/Indoor-Outdoor） + 容器（有则写） | 5–12 词 | `48" artificial dracaena silk plant, real touch leaves in black nursery planter` |
| **2b. 产品图·多角度** | 每张差异化：主图写整体，特写写部位，场景图写用途 | 5–12 词/张 | 特写：`close-up of real touch dracaena leaf texture`；场景：`faux dracaena plant styled beside a gray sofa in living room` |
| **3. 内文图（博客/指南）** | 图面内容描述 + 自然含关键词（含不上就放弃） | 5–15 词 | `measuring a window seat edge to edge for custom cushion fit` |
| **4. 装饰图（背景/分隔/花纹）** | **`alt=""`（空属性，必写，禁整个省略）** | — | `alt=""` |
| **4b. 功能图（logo/按钮/链接图）** | 写动作或去向，禁写外观 | 2–6 词 | logo：`alt="CushionMill"`；链接图：`alt="Shop outdoor cushion fabrics"` |
| **4c. 含文字的图（横幅/尺码表）** | 图内文字**逐字**进 alt [S] | 看图内文字 | `alt="Summer sale: 20% off sitewide through July 31"` |

**写法细则**：
- 甜点区 **5–15 词**；Shopify 字段上限 512 字符、推荐 ≤125（屏幕阅读器友好）[I][S]
- 主语前置：先写图里最重要的东西 [I]
- **禁以 "image of / picture of / photo of" 开头**（读屏器自动播报"图片"，属冗余）[S][I]
- 同一张产品图**必须带页面语境差异化**——特写写特写内容，禁复制主图 alt 到全部 8 张（竞品现状见 §五，是我们的超越点）
- 图内有数字信息（尺码/尺寸/刻度）必须进 alt（用户会"读"它）[S]
- AI 生成 alt **必须人工复核**——生成器只看像素，会误解图的目的与场景；主图与品牌关键图一律手写 [S]
- 判断装饰 vs 信息图的唯一测试 [S]：想象图片加载失败——购物者若丢失有用信息=信息图（写 alt）；什么都没丢=装饰图（`alt=""`）

**公式化判断（W3C 三分支 [S]）**：图承载信息→描述内容；图执行动作→描述去向；纯装饰→空属性。

## 二、文件名规范 + slug 联动

| 规则 | 要求 | 说明 |
|---|---|---|
| 格式 | 全小写 + 连字符分词 + 扩展名 `.webp`（首选）/`.jpg` | `artificial-dracaena-48-inch-real-touch.webp` |
| 内容 | = 该图 alt 的 slug 化（去停用词、保属性词） | alt 与文件名**双信号对齐**，二者都给 Google 线索 [G1][I] |
| 禁忌 | 禁 `IMG_1234.jpg` / `DSC00423.JPG` / `image1.jpg` / 无语义 SKU 孤码 / 中文/空格/下划线分词 | Google 官方点名 generic 文件名 [G1] |
| 与 slug 联动 | 产品主图文件名 ⊂ 产品页 slug 词根 | 页面 slug `48-inch-dracaena-real-touch` → 主图 `48-inch-dracaena-real-touch-black-planter.webp`（文件名可略长，补属性） |
| 多角度图 | 基础 slug + 后缀 `-closeup` / `-lifestyle` / `-detail` | 禁 `-final2` / `-copy` / 纯序号 |
| 上传后不可改 | WP 媒体库文件名=URL 一部分，**上传前定名**；改文件名=改 URL=旧外链图裂 | 上传是最后机会 |

**证据**：nearlynatural 全站文件名=产品标题 slug + 品牌词 + SKU 尾码（`artificial-48-dracaena-silk-plant-real-touch-nearly-natural-626653.jpg`）[NN]——Shopify 自动 slug 化的结果，证明"标题即文件名"是大厂默认做法；balsamhill 走 DAM 命名（`FLR-1841003_Spring-in-Bloom-Wreath_22in_SSC.jpeg`）但产品名+尺寸仍在文件名内 [BH]。我们 WP 自控上传，直接 slug 化，无 DAM 包袱。

## 三、图片全链配套（alt 之外）

| 环节 | 规范 | 现有设施（WP+RankMath+Woo 栈） |
|---|---|---|
| 格式 | WebP 优先（AVIF 兼容性次之）；WP/LiteSpeed 自动转 WebP | ✅ 自动；上传源文件仍按 §二命名 |
| 尺寸 | 上传 ≥1500px 长边（Google Images 大图收录线）；**上限 ≤1600px 长边**（站内 srcset 最大渲染档 ~1229×1536，超 1600 纯耗磁盘——evercombe 磁盘批实证 png 大图是字节黑洞 2.67GiB/1,391 张） | ✅ 自动 |
| 生图直出 | 生图/AI 出图**禁 png 直出**：API 支持 size 参数直接出 ≤1600px 小图，不支持则生成后压缩转 `.jpg`（q82-85）或 `.webp`；已生成的 png 本地转换不重生成（2026-10-22 evercombe 生图批修正口径） | 生图批任务书必含本行 |
| 声明宽高 | `<img>` 必带 width/height（防 CLS） | WP 默认带；手写 HTML 时必带 |
| 懒加载 | 首屏图（logo/hero/LCP 图）禁 lazy + 用 `fetchpriority="high"`；首屏以下 `loading="lazy"` | WP 默认全 lazy → **首屏 hero 图需手动豁免**（竞品 nn 首屏导航图用 `fetchpriority="low" loading="eager"` 的反例见 §五） |
| LCP 图 | 每页只 1 张；预加载 `<link rel="preload" as="image">`；避免极端宽高比 [G1] | 建站线自查项 |
| 结构化数据 | Product.image 必填且指向主图；用 ImageObject 时 caption=alt 同文（balsamhill 做法 [BH]）；首选图另可用 `primaryImageOfPage` 或 `og:image` 声明 [G1] | RankMath/Woo Product schema 自动出 image；og:image 自动取 featured |
| 图片 sitemap | `<image:loc>` 条目让 Google 发现内页深处的图；CDN 域图需在 GSC 验证域名 [G1] | ✅ RankMath 自动（cushionmill post-sitemap 实测 537 条 image:loc [CM]），**无需另建** |
| 图注与上下文 | 关键图放正文对应论点旁，配 `<figcaption>`；AI 引擎分析图周围 ~50–100 词判断相关性 [P] | 产文线规则 |

## 四、禁忌清单

| # | 禁忌 | 为什么（依据） |
|---|---|---|
| 1 | **全站/全列表同一句 alt** | Google 无从区分排哪张 [I]；也是竞品偷懒重灾区（§五） |
| 2 | 关键词堆砌（"shoes running shoes best running shoes"式） | Google 官方明确定性为 spam signal [G1][S] |
| 3 | alt=纯 SKU/内部编码（`ZG 42`、`XHR 99`、`IMG00023`） | 对用户与 AI 零语义；cushionmill 实错在案（§六）[CM] |
| 4 | 省略 alt 属性（`<img>` 无 alt） | 比空 alt 更糟——读屏器可能朗读文件路径 [S][I]；**缺失=缺陷，空=决策** [I] |
| 5 | 装饰图写描述性 alt | 制造噪音；正确=`alt=""` [S] |
| 6 | 以 "image of/picture of" 开头 | 冗余 [S][I] |
| 7 | alt 与图面不符（为塞关键词硬写） | 损害信任；AI 时代图不对文会被降权 [P] |
| 8 | 图内文字不进 alt（促销横幅/尺码表） | 信息丢失 [S] |
| 9 | 忽略文件名（维持相机默认名） | 丢掉轻量信号 [G1] |
| 10 | 内文所有配图用同一产品图 alt 复制 | 同 1；内文图须按 §一 型 3 语境化 |
| 11 | 懒加载占位 alt 泄漏（`alt="Loading"`） | balsamhill 实错在案（§五）[BH] |

## 五、竞品现货对照（2026-10-17 实抓）

| 站 | 页面 | 现货做法 | 评价 |
|---|---|---|---|
| nearlynatural.com | /collections/artificial-floor-plants | 产品卡 alt=完整产品标题：`48" Dracaena Silk Plant (Real Touch)`、`4' Artificial Dracaena Plant in Sand Colored Planter (Real Touch)`、`3' Cycas Palm Tree UV Resistant (Indoor/Outdoor)` | ✅ 公式=尺寸+品种+类型+特征标签+容器；❌ **同一产品 8 张轮播图全部复制同一句 alt**（零差异化） |
| nearlynatural.com | 同上 | 导航区块图、footer 信任徽章、内文装饰图全部 `alt=""` | ✅ 装饰图空属性的正确用法 |
| nearlynatural.com | 同上 | 文件名=产品标题 slug+nearly-natural+SKU 尾码 | ✅ 印证 §二 |
| balsamhill.com | /p/spring-in-bloom-artificial-wreath | 主图 alt=`Balsam Hill Spring in Bloom Wreath 22-Inch with Lush Greenery`（品牌+产品+尺寸+特征）；JSON-LD ImageObject 的 caption 与 alt 同文 | ✅ alt/caption/schema 三处同文对齐，值得抄 |
| balsamhill.com | 同上 | 促销横幅 alt=`Save 20% with code HAPPY20`（图内文字逐字进 alt） | ✅ §一 4c 正例 |
| balsamhill.com | 同上 | **14 处 `alt="Loading"`**（懒加载画廊占位）；首屏导航图 `fetchpriority="low"` | ❌ 占位 alt 泄漏实错；首屏低优先级反例 |

**超越点（打法结论）**：两大竞品的共同缺口=多角度图 alt 不差异化。我们按 §一 2b 差异化（特写写部位、场景写用途），每张图多一次长尾命中机会 [I]，即可在同词图片搜索里做出区分度。

## 六、现有站抽检（cushionmill.com，2026-10-17）

| 检查 | 结果 | 处置 |
|---|---|---|
| alt 覆盖率 | 首页 11 img / 类目页 54 img，**0 缺失** | ✅ 基线好，保持 |
| 文件名 | 全部 slug 化（`custom-couch-cushions.webp`） | ✅ 符合 §二 |
| 优秀样本 | `Plush Chenille solid fabric swatch in Beige — indoor cushion upholstery option`（材质+类型+颜色+用途） | 作为布料 swatch 图标准句式推广 |
| **实错 1** | 布料色卡 alt=`ZG 42` / `XHR 99`（内部 SKU 孤码） | 改为 §一 型 2 公式：`Plush chenille fabric swatch in Deep Gray, ZG42 — custom cushion upholstery option`（SKU 可留但禁单独出现） |
| **实错 2** | `cm church pew sizes featured`（内部命名风格泄漏：cm 前缀/featured 后缀无用户语义） | 改为 `church pew cushion size chart — seat width and depth options` |
| **实错 3** | 首页 hero alt 仅 3 词（`custom couch cushions`），无属性无场景 | 按 §一 型 1 补场景卖点 |
| 图片 sitemap | RankMath 自动含 image:loc（post-sitemap 实测 537 条） | ✅ 无需动作 |

## 七、AI 搜索时代增量（GEO 口径）

| 要点 | 口径 | 来源 |
|---|---|---|
| alt 是 AI 可读文本的一部分 | AI 搜索工具从抓取页面的**文本**构建答案，alt 属于该文本；15 张产品图全空=给 AI 留 15 个盲区，写好=15 个额外主题信号 | [I] |
| 对 AEO 重要性=Critical | alt 对传统 SEO 为"高"，对 AI 答案引擎为"关键"——LLM grounding（锚定引用）依赖 | [P] |
| Google 官方定调（防玄学） | AI 功能**不需要**专门标记（llms.txt/内容切片皆非必需）；做好既有图片 SEO 即已覆盖 AI 场景；AI 功能会引用页面相关图片视频 | [G2] |
| 五特质（AEO 版 alt） | Literal（字面）+ Specific（具体）+ Unambiguous（无歧义）+ Entity-rich（含实体名词）+ Contextual（带语境）；弱 `blue sneakers` → 强 `Blue lightweight marathon running sneakers with carbon-fiber plates` | [P] |
| 原创图=AI 信任信号 | 库存图在传统 SEO 能排，但 AI 引擎偏好原创"证据图"；图表/分步图/带标注照片是高表现类型 | [P] |
| 诚实边界 | 无人发布过 alt 对 AI 引用率的硬数据——禁采信"写了 alt 引用翻 X 倍"式营销话术 | [I] |

## 八、验收清单（产文/建页交付必附）

| # | 检查项 | 通过线 |
|---|---|---|
| 1 | 全部 `<img>` 有 alt 属性 | 缺失=0 |
| 2 | 信息图 alt 按 §一 公式（型 1/2/3/4b/4c） | 逐图对表 |
| 3 | 装饰图 `alt=""` | 空属性非省略 |
| 4 | 同产品多角度 alt 差异化 | 禁逐字重复>2 张 |
| 5 | 文件名 slug 化且与 alt 对齐 | §二 |
| 6 | 无禁忌清单 §四 任一项 | 11 项逐条 |
| 7 | 图内文字已进 alt | 横幅/表格类 |
| 8 | 首屏图无 lazy、LCP 图 fetchpriority=high | 建站线 |
| 9 | 内文关键图有上下文+figcaption | 产文线 |

## 九、来源

| 编号 | 来源 | 级别 |
|---|---|---|
| [G1] | Google Search Central《Image SEO Best Practices》developers.google.com/search/docs/appearance/google-images（2026-10-17 抓取全文） | 官方文档 |
| [G2] | Google Search Central《Optimizing for Generative AI Features》developers.google.com/search/docs/fundamentals/ai-optimization-guide | 官方文档 |
| [S] | Shopify 官方博客《Image Alt Text: How to Write It for SEO (2026)》shopify.com/blog/image-alt-text | 平台官方 |
| [I] | ImageSEO《Alt Text SEO & Alt Tag SEO: 2026 Guide》imageseo.io/alt-text-seo | 行业专家分析 |
| [P] | Perrill《Optimizing Images for AI Search Results》(2026-02) perrill.com/optimizing-images-for-ai-search-results | 行业专家分析（带服务推广，数字仅采信 50–100 词上下文一条） |
| [NN] | nearlynatural.com /collections/artificial-floor-plants 实抓（2026-10-17） | 竞品现货 |
| [BH] | balsamhill.com /p/spring-in-bloom-artificial-wreath 实抓（2026-10-17） | 竞品现货 |
| [CM] | cushionmill.com 首页 + /custom-cushions/ + sitemap 抽检（2026-10-17） | 自有站基线 |
