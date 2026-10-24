# TKD 写作规范（类目页与产品页）

> 适用：所有 C 端 WP/Woo 站的**类目页（category/collection）与产品页（SKU）**的 Title tag 与 meta Description 写作。属于 ON PAGE 的一个点；信息类博客页 title 规则见 §4 一并覆盖。执行时逐条对照，每条为硬标准。来源与版本见 §7。

**执行与验收协议（条款卡模式）**：派活抄 §1/§2/§3 中对应页型的公式与规则表进任务书；交付回执逐条标 ✅/不适用/未做；验收跑 §6.4 三断言（无 % 残留 / 长度达标 / 全站唯一），空回执打回。

## 0. 总则（全页型适用）

| # | 条款 | 依据 |
|---|---|---|
| 0.1 | TKD 的 K（meta keywords）**不写**：Google 2009 年官方确认不用于排名，RankMath 默认不输出。TKD 实写 = Title + Description | Google 官方博客（§7-S3） |
| 0.2 | **Title 是排名信号 + 点击文案；Description 不参与排名，只影响 CTR**。预算分配：title 精写，description 按 CTR 文案写 | Google 官方 snippet 文档（§7-S2） |
| 0.3 | 长度操作线：**Title ≤ 60 字符（目标 51-55）**；**Description 140-160 字符**。截断真值是像素宽（桌面约 580-600px）非字符数，字符线是像素线的保守换算；大写字母/宽字符多时按 55 字符卡 | Zyppy 80,959 标题研究：51-55 字符被 Google 改写率最低（约 40%），>70 字符改写率接近 100%，1-5 字符 >96%（§7-S4） |
| 0.4 | **每页 title/description 全站唯一**。两个页面（含两个类目）禁止追同一个主词——先建 keyword map 再写 TKD | Google 官方 title-link 文档（§7-S1）；collection SEO 指南（§7-S9） |
| 0.5 | **核心词前置（front-load）**：主词放 title 前半段；被截断时保住主词 | Zyppy / 各指南一致（§7-S4/S8） |
| 0.6 | **Description 会被 Google 动态改写**（按搜索词取正文片段），写了仍可能不显示；堆砌关键词的 description 会被优先弃用 | Google 官方 snippet 文档（§7-S2） |
| 0.7 | 分词符统一：主分隔 `|`，段内次分隔 `-` 或 `,`。禁装饰符 `~ ! * ★` 与全大写单词、禁 emoji | 惯例 + Google 反 spam 口径 |
| 0.8 | 品牌尾缀 `| Brand` 只放一次；SERP 中 Google 常剥掉尾缀品牌名（站点名已单独展示）——**把预算花在前置词上，不指望品牌尾缀被显示** | Google 官方 title-link 文档"重复站点名会被省略"（§7-S1）；竞品 SERP 实证见 §1.4 |
| 0.9 | Title 与 slug 解耦：slug 用规范名（小写连字符），title 按搜索词面写（词序/复数/大小写 mirror 搜索词） | 竞品分析 SOP 三断言（已定案） |

## 1. 类目页 TKD

### 1.1 Title 公式

```
{核心词} {1-2个修饰词} | {品牌}
```

| 要素 | 规则 |
|---|---|
| 核心词 | 词池该类目的主词**原形**（单复数按搜索量高的形态）；放最前 |
| 修饰词 | 从 {材质属性：Silk/Faux/Dried} {场景属性：Indoor/Outdoor/Front Door} {风格属性：Luxury/Handmade/Lifelike} {季节：Spring/Fall/Christmas} 中选 1-2 个，仅选该类目 SERP 前 10 中真实出现的——**禁自造组合** |
| 季节词 | 只有季节子类目（fall wreaths）才加；全年类目加季节词=错配意图 |
| 品牌尾缀 | `| Brand`，一条竖线，放末尾 |
| 长度 | **50-60 字符为佳**（竞品主流区间 50-57，见 §1.4）；head 词本身极短时允许 35+ 极简型（`主词 \| 品牌`），但优先用属性词补到 50+ |
| 商业修饰词 | `Buy`/`Shop` 等交易词**默认不加**——现代 SERP 中属弱势老公式（现役竞品仅 1/10 使用，见 §1.4）；类目页靠词本身+属性词承接商业意图 |

### 1.2 类目页 Description 公式

```
{钩子句：问题或动词开头} + {1-2个具体卖点：规格范围/工艺/免维护} + {CTA 或季节覆盖}
```

| 规则 | 说明 |
|---|---|
| 长度 140-160 | 竞品现货 124-154 字符（§1.4），全在 160 内 |
| 开头钩子 | 问题式（"Looking for year-round greenery?"）或动词式（"Liven up your décor…"） |
| 卖点具体化 | 写"24-48 inch / handmade / UV-resistant / zero upkeep"这类可验证属性，禁空话（"best quality products"） |
| 次级关键词自然融入 | 1-2 个变体词，不为塞词破坏可读性 |
| CTA 收尾 | 可选（"Shop…" / "Order here!"）；电商类目建议保留 |
| 全站唯一 | 相邻类目禁止复用同一段；突出各自差异（材质/季节/场景） |

### 1.3 类目页意图红线

| # | 红线 |
|---|---|
| 1 | 类目页只接**商业调查/交易词**（artificial wreaths / outdoor silk wreaths）；how to / what is / best X for Y 信息词一律给博客，**禁止用类目页接信息词** |
| 2 | 类目词单复数按词池数据选主形态进 title；另一形态若量级接近，做次级词进 description，不做两页互抢 |
| 3 | 词序 mirror：title 前半段尽量复现搜索词原文顺序（"outdoor artificial wreaths" → "Outdoor Artificial Wreaths…"，不倒装成 "Wreaths for Outdoor Use"）——首页结果 65-85% 在 title 中含目标关键词（Backlinko，经 SEO Sherpa 引述） |

### 1.4 竞品现货对照表（2026-10-17 抓取）

**源码 title（页面 `<title>` 原文）**：

| 站 | 类目页 | 源码 title | 字符数 | 拆解 |
|---|---|---|---|---|
| Nearly Natural | /collections/wreaths | `Artificial Wreaths \| Nearly Natural` | 35 | 主词+品牌（极简型） |
| Balsam Hill | /c/wreaths | `Artificial Spring and Summer Wreaths \| Balsam Hill` | 50 | 主词+双季节属性+品牌 |
| Afloral | /collections/wreaths | `Door Wreaths \| Dried, Artificial, Seasonal \| Afloral` | 52 | 场景词前置+材质属性串+品牌（三段式） |
| Kremp（本地花店对照） | 首页 | `Same-Day Flower Delivery Willow Grove, PA \| Kremp Florist` | 57 | 服务词+地域+品牌——服务型站点打法，品类型站点不套用 |

**SERP 实显 title（"artificial wreaths"，US，Google 渲染后）**：

| 站 | SERP 显示 | 观察 |
|---|---|---|
| balsamhill.com/c/wreaths | `Seasonal Wreaths` | Google 改写成更短标题 |
| nearlynatural.com | `Artificial Wreaths` | 品牌尾缀被剥 |
| afloral.com | `Door Wreaths \| Dried, Artificial, Seasonal` | 品牌尾缀被剥，三段式保留 |
| petals.com | `Buy Seasonal Silk Wreaths and Garlands at Petals` | 老式 Buy…at 公式，10 名中仅此 1 家 |
| mcgeeandco.com | `Faux Wreaths For Indoor/Outdoor Decoration` | 用途修饰型 |
| thesuffolknest.com | `Seasonal Wreaths \| Luxury Artificial Wreaths` | 主词+风格变体（无品牌尾缀） |

**Description 现货**：

| 站 | 原文 | 字符 |
|---|---|---|
| Nearly Natural | Looking for year-round greenery? Check out our artificial wreaths—perfect for every season, crafted with lifelike detail and zero upkeep. | 137 |
| Balsam Hill | Liven up your décor with handcrafted spring and summer wreaths. Perfect for every space - discover your seasonal look today. | 124 |
| Afloral | Adorn your door with a lovely wreath and welcome your friends and family into your home with warmth. Find large and diverse wreaths from spring to winter. | 154 |
| Kremp | Family-owned Kremp Florist provides same-day flower delivery in Willow Grove and Philadelphia, plus nationwide flowers, plants, and gifts. Order here! | 150 |

**正反例（以仿真花站 fall wreaths 类目为例）**：

| 判定 | 示例 | 病因 |
|---|---|---|
| ✅ 正 | `Fall Wreaths & Harvest Décor for Front Doors \| Brand`（52 字符） | 主词前置+场景属性 |
| ✅ 正 | `Artificial Fall Wreaths, Handmade Lifelike Designs \| Brand`（58 字符） | 主词+工艺属性双卖点 |
| ❌ 反 | `Wreaths for Fall, Autumn Wreaths, Fall Decor Wreaths, Buy Fall Wreaths Online`（77 字符） | 同义堆砌+Buy 堆砌（Google 官方反模式）+超长 |
| ❌ 反 | `Best Guide: What to Know Before Buying a Fall Wreath in 2026` | 信息词意图，类目页接错词型 |
| ❌ 反 | `Fall Wreaths \| Brand - Shop Our Huge Selection of Amazing High Quality Products at the Best Prices, Free Shipping!`（114 字符） | 超长必截断+空话卖点+Buy 堆砌 |

## 2. 产品页（SKU）TKD（**v1.1：2026-10-18 扩充修订**——针对 4,935 已导入真实产品〔Darby Creek 全目录〕+ 四竞品自站产品页实抓定稿；v1.1 新增 §2.0/§2.1b/§2.5/§2.6，修订 §2.1/§2.3/§2.4）

### 2.0 三层标题体系（v1.1 新增——产品页特有）

| 层 | 载体 | 服务对象 | 规则 |
|---|---|---|---|
| **Name（产品名）** | Woo 产品标题，前台渲染为 H1 | 落地页转化 + 变体父名 | 按 §2.1 全槽位公式重写；**重写批必须在合并批之后**（`_evrc_base_name`=CSV 原名=合并聚合键，先改 Name=聚合键失效——05-产品/产品优化任务清单 T1 硬规则） |
| **SEO title** | RankMath 单页覆盖（rank_math_title） | SERP 排名 + 点击 | 从 Name 精简派生（可删副段/非核心修饰词，nn 模式），**主词段与 Name 一致，禁换主词词形**；批量覆盖模板 `%title% \| %sitename%` 只做兜底 |
| **变体子 name** | variation 行 name | 购物车/订单/邮件可读性 | 机器生成 `{父Name} - {归一属性值}`；不渲染前台 title/H1，**不占 SEO 预算**（§2.5） |

**title 与 H1 关系——四竞品产品页实抓（2026-10-18，源码级）**：

| 站 | 源码 title | H1 / 产品名 | 关系判定 |
|---|---|---|---|
| Nearly Natural | `24" Mixed Peony Wreath \| Nearly Natural`（40ch） | `24" Artificial Mixed Peony Wreath` | **title 精简式**：删材质词加品牌；H1 完整式——title≠H1 头部站做法 |
| Ling's Moment | `Round Bridesmaid Bouquets in Dusty Rose & Navy \| 1pcs – Ling's Moment`（~70ch） | `Set of 4 \| 7" Bridesmaid Bouquets in Dusty Rose & Navy` | title=类目词形+`\| 1pcs` 变体段；H1=数量展示形——**双词形并吃**（进阶模式见 §2.4） |
| Afloral | `Pink Artificial Rose and Succulent Bouquet - 19" – Afloral`（56ch） | 同名去品牌 | **title=H1+品牌**（色+材质+花材串+产品词-尺寸——与本规范 §2.1 公式同构的模板式正面样本） |
| Darby Creek（数据源站=反面基准） | `Glitter Eucalyptus Faux Botanical Bouquet Bundle - Two Color Options – Darby Creek Trading`（92ch） | 同名全量（更长） | 款式名+花材枚举+营销语超长；desc=bullets 机器拼接——**4,935 导入产品现状即此形态，全量重写** |

**我方定案**：H1=Name 完整式（全槽位）；SEO title 从 Name 精简，首词段与 Name 主词段一致（Google 官方：主标题信号明确防改写，§7-S1）。

### 2.1 SKU 命名与 title 联动（v1.1 修订——槽位制+降级链）

**Name 公式（=H1，不带品牌）**：

```
{尺寸} {材质} {花材} {产品词} - {变体属性}
```

- Nearly Natural 现货：`24" Artificial Mixed Peony Wreath`、`18" Eucalyptus Double Ring Wreath`
- Balsam Hill 现货（属性前置变体）：`Outdoor Radiant Peony Artificial Spring Wreath`
- Afloral 现货（色前置模板式）：`Pink Artificial Rose and Succulent Bouquet - 19"`

**SEO title 公式**：`{Name} | {品牌}`；Name 已近 60ch 时删 Name 中非核心修饰词后拼品牌。

**槽位规则表（每槽带降级链——4,935 行解析率为基线）**：

| 槽位 | 规则 | 降级链（解析不出时） |
|---|---|---|
| 尺寸 | `24"` 或 `24 Inch` 跟搜索词形态；garland 用 `6ft/9ft`；多维尺寸取主维度（wreath 直径/arrangement 高/盆栽盆径） | Name 解析 47% → Attr Size 串抽数值档补至 ~57% → **仍缺则省略槽位，禁造数** |
| 材质 | artificial / faux / silk 三选一按类目词池；**禁 polyester/PE/foam 工艺词**（02-SKU §六 2026-10-18 裁定）；**Real Touch 唯一例外保留**（real touch flowers 2.9K 高端线招牌词） | 缺 → 按类目默认：wreath/arrangement/花种=Artificial，散枝=Silk，植物域 faux 优先复核（02-SKU §6.7 注记） |
| 花材 | 主花 1 个必进，次花材 ≤1；Darby 枚举 ≥3 花材常态取前 2，其余进 desc | 无花材（绿植/器皿）→ 品种词/器型词顶位 |
| 产品词 | **族尾词唯一**；堆叠词只留族判定最高者（优先级：wreath > swag > garland > centerpiece > arrangement > bouquet > bush > spray > stem > branch > planter > vase > tree/plant > bow）——`Bush Spray`/`Centerpiece Arrangement`/`Wreath Base` 等双词尾全砍成单词尾 | — |
| 变体属性（副段） | 色 / Size 档 / Set 数 三选一放 `-` 后；**variable 父名禁含具体变体值**（详 §2.5） | simple 填实值；variable 省略或填首色 |
| 系列名 | **禁进 Name/title**（Garden Bounty / Frosted Fruit / Witches Brew 等 501 行系列名前置全部降级） | 进 desc 首句（"From the Frosted Fruit collection…"式）或长描述 L2 段 |
| 位置/场景词 | `for Staircase / for Front Door` 类不进 title 主段，garland 词族例外（搜索词形本身含位置词时随词序 mirror，§2.1b） | — |

**长度线（v1.1 细化）**：

| 项 | 线 |
|---|---|
| 主词段（尺寸+材质+花材+产品词） | **≤60ch，目标 55**（§0.3 总则对齐） |
| Name 全长（含 `- {变体属性}`） | **≤70ch 硬顶**（Google Shopping 前 ~70 可见 + Amazon 75 硬限，三渠道通吃——v1.0 口径维持） |
| 超预算砍序 | 先砍次花材 → 再砍副段 → **永不砍主词段与产品词**（品牌尾缀溢出区可接受：Google 常剥尾缀，§0.8） |
| 4,935 基线（2026-10-18 实测） | 现 avg 67 / median 63 / max 178；≤70ch 仅 3,138 行（63.6%），71-100 共 1,255 行 + >100 共 542 行 = **1,797 行（36.4%）必重写进线** |
| ASCII 化 | `&amp;` 解码为 `&`（nn/lings 均用 `&`，保留）；`″`→`"`；em/en-dash 副段统一 `-` |

**Title token 齐全度规则**（v1.0 维持）：产品词 SERP 前 10 的 title 普遍包含搜索词全部核心 token（尺寸+花材+材质+产品词），词序可灵活——**齐全度优先于词序**。

### 2.1b 分产品线 title 模板族（v1.1 新增——4,935 产品落地+02-SKU §六词池并吃）

**产品词族量级**（CSV 全量实测 2026-10-18）：stem/spray 1,134 ｜ decor/other 690 ｜ vase/planter 593 ｜ arrangement 590 ｜ wreath 466 ｜ tree/plant 465 ｜ bouquet 391 ｜ garland 178 ｜ bush 165 ｜ bow/ribbon 138 ｜ candle 77 ｜ swag 48。

| 线（量级） | Name 模板 | 旧→新示例（Darby 原名截断） | 词池并吃（02-SKU §六） |
|---|---|---|---|
| **Wreath**（466） | `{尺寸}" {材质} {花材} Wreath - {色}` | `Frosted Fruit - Sugared Apple, Pears… Christmas Holiday Front Door Wreath` → `24" Artificial Apple & Berry Wreath - Red` | door wreaths 12.1K 语义副段承接；berry 720/pine cone 1.9K 进花材槽 |
| **Stem/Spray/Bush**（1,299） | `{枝长}" {材质} {花材} Stem - {色}` ｜ `{花材} Bush x{N} - {色}` | `Wispy Green Seeded Willow Leaf Foliage Faux Everyday Greenery Bush Spray - 25"` → `25" Artificial Willow Bush - Green` | 花种词全池（poppy 590/marigold 320/daisy 390/ranunculus 110/tropical 590——§6.5）；qty 档 x6/x12=批发层 variation 语 |
| **Arrangement/Centerpiece**（590） | `{花材} {材质} Arrangement in {容器} - {尺寸}"` | `Woodland Grandeur - Mixed Real Touch Cedar, Long Needle Pine… Large Centerpiece Arrangement` → `Real Touch Cedar Centerpiece in Bark Boat - 30"` | Real Touch 招牌词保留；含瓶款 `in {容器}` 语=with-vase 词族 |
| **Garland/Swag**（226） | `{长度}ft {材质} {花材} Garland for {位置}` ｜ swag 同构 `{尺寸}" {材质} {花材} Swag - {色}` | `…Christmas Mantle Holiday Garland - 6 Foot` → `6ft Pre-Lit Pine Garland for Staircase` | 位置词直进词序（staircase 5.4K/mantel 2.9K/window 4.4K——§6.1 定案）；pre-lit 74K 词形并吃（§6.4）；teardrop 词形 title 带入不另建页 |
| **Bouquet/婚礼**（391） | `{花材} Wedding Bouquet in {色} - Set of {N}` ｜ boutonniere/corsage 同构 | `Wooden Closed Bud Rose Bouquet Bundle of 8 Wired Stems - Available In 11 Color Options` → `Rose Wedding Bouquet in Burgundy - Set of 8` | wedding boutonniere 8.1K 词形（§6.6）；toss/cascading 形态词进花材前缀；prom 语境=corsage 副段（`Pink Wrist Corsage for Prom` 类） |
| **Vase/Planter**（593） | `{色} {材质} {器型} Vase - {尺寸}"`（器型槽：bud/ceramic/floor/cylinder/centerpiece） | `Geometric Pastel Pink Milk Glass Vase - 3 Size Options` → `Pink Glass Bud Vase - 6"` | vases 词族四类分法 slug 同构（02-SKU §2.2c）；`Set of 3` 副段位 |
| **Tree/Plant**（465） | `{高度} Artificial {品种} Tree - {色/风格}`（植物域 faux 词形优先复核） | — | pre lit 74K/white 27.1K/pencil 22.2K/outdoor 18.1K 全为标题池词（§6.4——SERP 大树语境，小件池接词=意图错配，标题层照进） |
| **Bow/Ribbon/Candle/Decor 等**（905） | `{色} {材质} Bow - {尺寸}"` ｜ 缎带 `{色} {材质} Ribbon {宽}x{码}` ｜ 其余按族同构 | — | burlap 1.3K/twig 1.3K/moss 590 材质前缀语（§6.1）；树外品类（Gift Cards/Live Plants 等 62 行）剔除后不套模板 |

**模板使用规则**：

| # | 规则 |
|---|---|
| 1 | 逐产品按 §2.1 槽位降级链从旧 Name+attrs 机器解析填槽；**槽位双缺（无花材又无尺寸）或 >70ch 的行进人工复核队列**（预估 10-15%） |
| 2 | 同族同款异色/异尺寸合并（simple→variable）后：title 主段相同、副段异——**全站 title 唯一断言（§6.4-C）的差异化要素=副段**，批量生成必带副段差异校验 |
| 3 | 材质/产品词按词池多形态轮换（artificial 22.1%/faux 21.0%/silk 5.3% 底盘），**禁全站单形态**——§5.5 micro-boilerplate 红线 |
| 4 | slug 从新 Name 按产品线模板族派生（02-SKU §3.0：wreath `{材质}-{形态}-in-{色}-{尺寸}`／主模板 `{size}-faux-{species}-{color}`／散枝 `{尺寸}-{描述}-{颜色}`），title/slug 解耦原则见 §0.9；已导 989 个未上线无外链包袱，重刷成本≈0 |
| 5 | 树外品类（T6 剔除项）与本模板族无关；样品盒/礼品卡等非标品不套模板 |

### 2.2 产品词 SERP 现货（"24 inch peony wreath"，2026-10-17）

| 站 | SERP title | 拆解 |
|---|---|---|
| nearlynatural.com/products/24-peony-wreath | `24" Artificial Mixed Peony Wreath` | 尺寸+材质+花材+产品词，33 字符即 No.1 |
| balsamhill.com/p/outdoor-radiant-peony-artificial-spring-wreath | `Outdoor Radiant Peony Artificial Spring Wreath` | 属性前置型 |
| target.com | `Peony Artificial Wreaths \| Northlight 24 Inch` | 类目词+品牌+尺寸 |
| christmascentral.com | `Peony & Mum Artificial Fall Harvest Wreath - 24"` | 花材串+材质+季节+产品词-尺寸 |
| winwardhome.com | `Luxury Faux Peony Wreath 24" Pink` | 品质词+材质+花材+产品词+尺寸+颜色 |
| etsy.com/market/… | `24 Inch Peony Wreath` | 查询词完全镜像 |
| amazon.com（反例） | `Peony Spring Wreath - 24inch Handmade Pink Artificial …` | 超长被截断出省略号 |

### 2.3 产品页 Description 公式（v1.1 修订——竞品 desc 实证锚定）

```
{前 25 字符内含主词的定义句} + {1-2 个可验证卖点} + {变体信息} + CTA
```

| 规则 | 说明 | 实证锚（2026-10-18 实抓） |
|---|---|---|
| 主词前置 | 定义句开头即含 title 主词段（Google 动态改写时优先截取正文段首——desc 被弃时正文首段接棒） | Ling's：`Chiffon round bridesmaid bouquets in dusty rose & navy, 1pcs. Perfect for…`（125ch，材质+产品词+色+数量全在前 60ch） |
| 可验证卖点 | 尺寸实测/Set 数/Real Touch/UV resistant/免维护——**契约包禁词校验联动**（realistic/true-to-color/premium/ready-to-use 禁写，验证解锁前一律不进 desc） | Nearly Natural：`At 24 inches round, this lush peony wreath demands attention…`（钩子+规格式） |
| 变体信息 | 颜色可选项/尺寸档/Set 数——title 放不下的属性回收进 desc | Ling's：`Multiple colors available.` 收尾 |
| 长度 140-160 | 超长=截断浪费；品牌语境/抒情开头挤占前 160ch=半反面 | Afloral 反例：`Embrace faux wedding flower bouquets designed to mirror…` 前 160ch 无任何规格 |
| 禁机器拼接 | **禁 bullets 直拼做 desc**——数据源站 Darby 自己就没写（`Features Available In Purple and Beige Overall Spray Measurements: 17" L x 8" W… Metallic - Darby Creek Trading`，135ch 机器串），4,935 全量需按本公式模板生成+词池轮换 | Darby 反面实证 |
| 关键事实进描述 | Google 官方：商品页 desc 可汇总价格、制造商等关键信息（v1.0 维持）；价格时效数据进 desc 须接受过期失真（§6.2 wc_price 注记） | §7-S2 |
| 禁重复 title | desc 不复述 title，补 title 放不下的属性（v1.0 维持） | — |

### 2.4 H1 与 title 的分工（v1.1 修订）

| 层 | 角色 | 规则 |
|---|---|---|
| Name/H1 | 落地页第一屏 | H1 渲染源=Name 完整式（全槽位）；**前提=主题单产品模板 H1 修复**（现状 H1=主题占位文案 `Great things are on the horizon`——模板不修则 Name 改写收益归零，T18 建站线联动） |
| SEO title | SERP 文案 | 从 Name 精简（nn 模式：删材质词/副段）；首词段=Name 主词段；品牌尾缀 `| Evercombe` |
| 双开头痛 | **禁止一页双模板开头**（v1.0 维持） | 本站实错（§5.3） |
| 双词形并吃（进阶可选） | 类目词形≠产品名词形且双词形均有量时：SEO title 用类目词形、Name 保持规格词形（Ling's 模式：title `Round Bridesmaid Bouquets…` vs H1 `Set of 4 \| 7" Bridesmaid Bouquets`） | 仅 SERP 双词形验证有量时用；默认不用（Shopify 结构产物非主动最优，主标题信号一致性优先——§7-S1） |

### 2.5 变体产品标题分工（v1.1 新增）

| 层 | 规则 | 机制锚（实抓实证） |
|---|---|---|
| **父 Name**（variable 469 个） | §2.1 公式；**色槽=单色款填实色、多色款填首色或省略**；Size 轴款尺寸槽=默认档或省略；**禁 `Available in N Colors` / `N Options` / `Two Color Options` 类营销语**（Darby 父名反面，501 行同类） | Ling's 多色款用具体色名 `in Dusty Rose & Navy`——可行但需色系定案；Darby `Two Color Options Available`=反面 |
| **子变体 name**（1,279 行） | 机器生成 `{父Name} - {归一 Color}` 或 `{父Name} - {Size 档}`（依赖 T10 色归一表 594→~40 + T11 尺寸串抽数值档）；仅购物车/订单/邮件渲染，不进前台 title/H1/SEO | Shopify 同构：variant `name`=父名+` - `+属性值、`public_title`=仅属性值（Darby/lings 产品页 JSON-LD 实证）——Woo 变体 name 对齐该机制即可 |
| **变体独立 SEO** | **不给变体写独立 title/description/focus keyword**；预选变体 URL `?attribute_pa_color=` 不进 sitemap（02-SKU §3.0 既有）；变体属性的可索引性由父页属性筛选器+类目聚合页承接 | 四竞品全部单 URL 单 title（Shopify 生态无变体独立页）；Woo 变体默认不可独立索引 |
| **schema 联动** | Product schema name=父 Name；offers 聚合变体；brand=Evercombe 站级补全（T17——nn 模式：站牌即品牌） | nn/darby/afloral Product schema 实证 |

### 2.6 产品批量线交付断言（v1.1 新增——§6.4 三断言的产品线增量）

| 断言 | 通过线 |
|---|---|
| 长度分档 | Name ≤70ch 行占比 100%（>70 行数=0）；SEO title 主词段 ≤60ch 占比 ≥95% |
| 材质口径 | Name/title 含 polyester/PE/foam 行数=0（02-SKU §六 2026-10-18 裁定；Real Touch 例外白名单） |
| 禁词 | 契约包禁词清单（realistic/true-to-color/premium/ready-to-use…）在 desc 命中=0（validate-riskwords 小写 includes 校验） |
| 系列名清零 | Name 含前置系列名模式（`{词组} - ` 且非属性段）行数=0（基线 501→0） |
| ASCII 化 | Name 含 `&amp;`/`″`/`–`（en-dash）/`—`（em-dash）行数=0 |
| 副段差异 | 同主段异副段族内，副段取值去重后数=变体值数（防模板批量同化撞 §6.4-C 唯一断言） |

## 3. 意图对齐判定表（搜索词型 → 页型与 title 结构）

| 词型 | 例 | 意图 | 承接页型 | Title 结构 | 修饰规则 |
|---|---|---|---|---|---|
| 品类 head 词 | artificial wreaths | 商业调查 | 类目页 | `{核心词} {属性修饰} \| Brand` | 属性词 1-2 个 |
| 品类+属性 | outdoor artificial wreaths；silk flower wreaths | 商业调查 | 类目/子类目 | `{属性} {核心词} …` 属性前置 mirror | 词序照抄搜索词 |
| 季节类目 | fall wreaths；christmas wreaths | 商业调查（季节性） | 季节子类目 | `{季节} {核心词} \| Brand` | 季节词前置 |
| 产品长尾 | 24 inch peony wreath | 交易 | 产品页（类目页可兼收） | `24" Artificial Mixed Peony Wreath` | token 齐全优先 |
| 比较/评估词 | best wreaths for front door；X vs Y | 商业调查 | 博客清单文 | `数字 + Best {核心词} for {场景} ({年份})` | 年份放括号内不放句尾裸挂 |
| How-to 信息词 | how to hang a wreath | 信息 | 博客教程 | `How to {动词短语} ({年份})` 或 `疑问句原样 mirror` | 问题句式 CTR +14.1% |
| 品牌词 | brand + wreaths | 导航 | 品牌类目/首页 | `{Brand} {核心词}` 品牌前置 | 品牌词唯一允许前置的场景 |
| 本地服务词 | flower delivery near me | 本地交易 | 本地落地页/首页 | `{服务} {城市, 州} \| Brand` | 仅服务型业务用（Kremp 打法） |

**镜像三规则**：① 词序 mirror——title 前半段按搜索词原文顺序；② 词形 mirror——单复数照搜索量主形态，US 拼写（décor 可保留原文风格但主词用美式）；③ token 齐全——核心 token 一个不缺，连接词/顺序可调。

## 4. CTR 优化条款（title 的点击层）

| # | 条款 | 实证 |
|---|---|---|
| 4.1 | 信息/清单类 title **数字前置**（`7 Best…`），数字放前 4 词内 | 423 页 A/B 测试胜出模式（§7-S5） |
| 4.2 | 内容类型可用方括号标签：`[Guide] [Data] [Case Study]`，一 title 最多 1 个 | 括号标题点击 +38%（HubSpot/Outbrain 330 万标题研究，NavBoost 与 Backlinko 双源引用一致）（§7-S6） |
| 4.3 | **商业/产品/类目 title 不加品牌以外的内容标签**；4.2 仅限信息词 | 同上（标签意图摩擦） |
| 4.4 | 年份规则：只信息词用；放句中（`2026 Guide to…`）或括号内，**禁止句尾裸挂 `…in 2026`**；商业词一律不加年份 | 423 页测试：末尾年份=静态信号，负向（§7-S5） |
| 4.5 | 非品牌查询的 title **不加自家品牌名**（信息页）；电商产品/类目页品牌尾缀保留（导航价值>摩擦） | 423 页测试：品牌名伤非品牌词 CTR（§7-S5） |
| 4.6 | `vs` 框架（`X vs Y: …`）接评估期搜索 | 同上 |
| 4.7 | 15-40 字符短 title CTR 最高（Backlinko 500 万结果：+36%），但电商属性词装不下——**信息页能短则短，电商页按 §1/§2 公式** | 长度与 CTR 相关性数据（§7-S4/S6） |
| 4.8 | Title 改动是点击杠杆不是排名杠杆：页面先进入 position 1-20 再谈 CTR 优化；一次改完等 4-6 周（与《01-SEO全链路工作流》§CTR 条款衔接） | 423 页测试门槛 + 全链路工作流已定案 |

## 5. 禁忌清单（含本站实错）

| # | 禁忌 | 后果 | 案例/依据 |
|---|---|---|---|
| 5.1 | Title >60 字符（电商 SKU >70） | 必截断；>70 字符 Google 改写率趋近 100% | **本站实错：70 个 title 超 60**（需按 §1/§2 公式重写）；Zyppy 数据（§7-S4） |
| 5.2 | `%sitename%` 等模板变量裸渲染进线上 title | SERP 显示原始变量文本，专业度归零 | **本站实错：%sitename% 裸渲染**——变量在无值上下文不解析；落库断言见 §6.3 |
| 5.3 | 一页双模板开头（双 "What to"） | title 与 H1 模板打架，主标题信号混乱触发改写 | **本站实错：双 What to**（§2.4） |
| 5.4 | 关键词堆砌（同词及变体 ≥3 次） | 视为 spam，Google 弃用自取 | Google 官方反例 `Foobar, foo bar, foobars…`（§7-S1） |
| 5.5 | 全站模板化 title（每页只换一个变量位） | 官方点名"micro boilerplate"触发改写 | Google 官方 title-link 文档（§7-S1） |
| 5.6 | 两个类目追同一个主词 | 自相竞争 | keyword map 前置（§7-S9） |
| 5.7 | Description 堆词复述 title | Google 弃用改取正文 | 官方 snippet 文档（§7-S2） |
| 5.8 | 时效数据进 title（价格/库存/促销） | 过期即失真，官方明确反模式（机票价格反例） | §7-S1 |
| 5.9 | 无意义极短 title（<30 字符仅产品名） | 改写率 >96%（1-5 字符档），中短档 51-55 最稳 | Zyppy（§7-S4）；`24" Peony Wreath` 这类极简仅当带尺寸材质补足字符 |
| 5.10 | `Buy/Shop/Cheap/Online` 堆进类目 title | 老公式，现役竞品 10 中 1；挤占属性词预算 | SERP 实证（§1.4） |
| 5.11 | 类目页接信息词（What to / How to / Best guide 进类目 title） | 意图错配，转化与排名双输 | §3 判定表 |
| 5.12 | ALL CAPS 单词、emoji、装饰符、双感叹号 | spam 观感 | §0.7 |

## 6. RankMath 配置联动

### 6.1 模板与单页覆盖的关系

| 层 | 用法 |
|---|---|
| 全局模板（Titles & Meta → Products / Product Categories） | 只做**兜底**：`%title% \| %sitename%`（产品）、`%term% \| %sitename%`（类目）。任何页面无单页覆盖时才渲染它 |
| 单页 snippet 覆盖 | **类目页与产品页一律逐页手写覆盖**（按 §1/§2 公式），全局模板不承担成品输出 |
| 编辑入口 | 编辑器 RankMath 面板 → General → Edit Snippet；Woo 类目在 产品→分类→编辑页 的 RankMath 字段 |

### 6.2 常用变量表（官方 KB）

| 变量 | 输出 | 注意 |
|---|---|---|
| `%sitename%` | 站点名 | 仅在有站点上下文的页面解析 |
| `%title%` | 文章/产品标题 | 产品页=SKU 名 |
| `%term%` / `%term_description%` | 当前分类术语名/描述 | 类目模板专用 |
| `%wc_price%` | 售价（促销取 sale 价） | 价格时效数据——**禁进 title**，可进 description 且要接受过期失真 |
| `%wc_sku%` `%wc_brand%` `%wc_shortdesc%` | SKU/品牌/简述 | 品牌需在 WooCommerce 设置中启用 |
| `%categories(limit=3 & separator=\|)%` | 分类列表（可限数/分隔/排除 ID） | 长度失控源——用 limit 封顶 |
| `%excerpt%` / `%excerpt_only%` | 摘要（前者无摘要时自动生成/后者返回空） | `%excerpt_only%` 无摘要=空值 |
| `%currentyear%` 等 | 当前日期 | 年份规则见 §4.4 |
| 自定义变量 | `rank_math/vars/register_extra_replacement` 钩子注册（rank-math.php） | 必须带回调 |

### 6.3 变量陷阱与断言

| # | 规则 |
|---|---|
| 1 | 变量仅在对应上下文解析（`%term%` 在非 taxonomy 页=无效）；单页覆盖里用了无值变量 → 裸 `%xxx%` 直接上线（=§5.2 实错根因） |
| 2 | RankMath 类目 TKD 修改后偶有不更新报告（ wordpress.org 支持帖佐证）——保存后**线上 curl 验证渲染值**，不信编辑器预览 |
| 3 | Focus keyword：每页 1 主词（RankMath 允许类目页加多 focus keyword 承接变体，官方 WooCommerce 指南口径）；主词必须与 title 前半段一致 |

### 6.4 交付三断言（每批 TKD 落库必跑）

```bash
# 1) 无变量残留：渲染后页面源码 grep 不到 %word% 模式
curl -s {URL} | grep -oE '%[a-z_]+%|\[[a-z_]+\]'   # 期望空
# 2) 长度达标：title ≤60（SKU ≤70）；description 140-160
# 3) 全站唯一：导出全站 title 列表（WP REST /wp-json/wp/v2/…或RankMath导出）sort | uniq -d 期望空
```

| 断言 | 通过线 |
|---|---|
| A 无残留 | 0 处 `%xxx%` / `[xxx]` 裸文本 |
| B 长度 | title ≤60（产品 ≤70）；description ≤160 |
| C 唯一 | 重复 title 数 = 0；同类目族无互抢主词（keyword map 核对） |

## 7. 版本注记与来源

**版本**：
- v1.0（2026-10-17）首版——全网调研 + 仿真花竞品现货对照定稿；本站实错案例（70 title 超 60 / %sitename% 裸渲染 / 双 What to）锚入 §5。
- **v1.1（2026-10-18）产品页章节扩充修订**——evercombe 4,935 已导入真实产品（Darby Creek Trading 全目录）触发：§2.0 三层标题体系（Name/H1/SEO title/变体子 name 四家实抓锚定）、§2.1 槽位制+降级链（材质工艺词禁令/系列名降级/长度 60-70 分档）、§2.1b 分产品线 title 模板族（8 线 4,935 落地+02-SKU §六词池并吃）、§2.3 desc 竞品实证锚（禁机器拼接）、§2.4 H1 前提=模板 T18 修复、§2.5 变体父子分工（Shopify 机制+我方 Woo 落地）、§2.6 产品批量线交付断言。类目页 §1/总则 §0/意图 §3/CTR §4/禁忌 §5/RankMath §6 未动。

**来源分级**（官方文档 > 行业研究 > 指南/社区）：

| 编号 | 来源 | 级别 | 用途 |
|---|---|---|---|
| S1 | Google Search Central: Control your title links in search results — https://developers.google.com/search/docs/appearance/title-link | 官方文档 | 改写机制/官方 title 建议/堆砌与样板反例 |
| S2 | Google Search Central: Control your snippets in search results — https://developers.google.com/search/docs/appearance/snippet | 官方文档 | description 不排名/改写机制/商品页写法 |
| S3 | Google 官方博客（2009）: Google does not use the keywords meta tag — https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag | 官方文档 | meta keywords 废弃口径 |
| S4 | Zyppy: The Best Title Tag Length for SEO（80,959 标题 / 2,370 站）— https://zyppy.com/seo/meta-title-tag-length | 行业研究 | 580-600px / 51-55 字符改写率最低 / 流量峰值区间 |
| S5 | US Tech Automations: 423-Page Title A/B Test（2026）— https://ustechautomations.com/resources/blog/how-we-ab-tested-423-seo-titles-for-clickthrough-rate-2026 | 行业研究 | 数字前置/括号标签/品牌名/年份 CTR 方向性结论 |
| S6 | HubSpot/Outbrain 330 万标题研究（brackets +38%，经 NavBoost — https://navboost.com/title-tag-ctr 与 Backlinko — https://backlinko.com/hub/seo/organic-ctr 双源交叉） | 行业研究 | 括号/短 title/问题句 CTR 数据 |
| S7 | Hypotenuse: Product Title Optimization（Amazon 75 字符/公式/Google Shopping 前 70 可见）— https://www.hypotenuse.ai/blog/product-title-optimization-how-to-write-product-titles-that-convert | 行业指南 | 产品标题公式 |
| S8 | MonsterInsights: WooCommerce Category SEO — https://www.monsterinsights.com/woocommerce-category-seo-best-practices-for-product-category-pages | 行业指南 | 类目 title/description 规则 |
| S9 | DoubleYourEcommerce: Shopify Collection SEO — https://www.doubleyourecommerce.com/collection-seo | 行业指南 | keyword map/意图/防互抢 |
| S10 | Rank Math KB: Variables in SEO Title & Description — https://rankmath.com/kb/variables-in-seo-title-description | 官方文档（插件） | 变量表/自定义变量/空值行为 |
| S11 | 竞品现货抓取（本库调研，2026-10-17）：webReader 抓 nearlynatural / balsamhill / afloral / kremp 页面源码 title+description；Ubersuggest serp_analysis 抓 "artificial wreaths" 与 "24 inch peony wreath"（US, locId=2840）SERP 实显 title | 一手实证 | §1.4 / §2.2 对照表 |
| S12 | 产品页 v1.1 实抓批（本库调研，2026-10-18）：①四竞品**产品页**源码级实抓（webReader+sitemap）——darbycreektrading（数据源站反面基准）/ nearlynatural（title 精简≠H1）/ lingsmoment（双词形+变体段）/ afloral（模板式正面），含变体 JSON-LD（`name`=父名+属性值 / `public_title`=属性值）与 meta description 全文；②线上 wc/v3 抽样 15 产品（evercombe 已导 989 之 Name/slug/attrs/RankMath 覆盖现状）；③CSV 6,214 行全量统计（长度分布 avg 67/max 178、产品词族 12 族量级、尺寸解析率 47%→57%、色词在名 65%、系列名前置 501 行） | 一手实证 | §2.0 / §2.1 / §2.1b / §2.3 / §2.5 对照表 |

**单源未采纳说明**：CTR 各家精确百分比互有出入（Backlinko +36% 与 HubSpot +38% 口径不同源），本规范只采用方向与区间，不引用单点精确值做决策依据；Google 截断像素上限各家测得 512-650px 不等（Screaming Frog 512 / Google 支持帖 600 / Zyppy 580-600），按保守线 580 执行。


## 产品变体属性纪律（2026-10-19 customneon pa_size 爆炸定案）

全局属性词表（pa_size 等）**只放通用档位**（如 Small (20"/50CM) 级共享值）；**产品专属尺寸规格一律走产品级自定义属性**（attributes 定义 id=0，visible 按需）——禁止把每产品的精确 W×H/Design-N 尺寸灌进全局 term（customneon.live 实证：全走全局=174 terms 爆炸、19 个 "Large" 并存、Design 款式混进尺寸属性）。存量已污染词表冻结不动（变体引用安全、前台不显示、SEO 零影响），增量按本纪律执行。删全局 term 前必核引用数（Woo terms 端点 DELETE 仅支持 force 无 trash）。场景词承接层定案：**post 文+类目页+landing 三层**，产品不做场景变体（Lets Party 5 连 1 图 5 listing 近重复零销量已清理）。
