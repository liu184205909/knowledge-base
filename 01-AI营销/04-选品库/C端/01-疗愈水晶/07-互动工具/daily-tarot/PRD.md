# Daily Tarot 工具 PRD（每日运势工具页）

> **裁决（2026-07-02）**：原 365 篇日期文章计划**作废**（SERP 证伪：daily tarot 衍生词全是 reading/draw/pull/free/online，无日期长尾；前 10 全是工具页，0 篇日期文章）。改为 **1 个工具页 `/tools/daily-tarot/`**，JS 按日期种子出牌 + 水晶 + 东方时辰。本 PRD 由原文档 `03-内容策略/内容Brief/模板-Tarot-每日运势框架.md`（文章框架，已删）迁移重写。
> **定位**：留存 + Shop 转化，**非 SEO 获客**（daily tarot 通用词红海，新站排不进；用工具承接 18 工具流量做留存 + Shop）。
> **适用**：`/tools/daily-tarot/` 单工具页（对齐 18 工具 `/tools/` 规范，非 tarotap 的 `/fortune/daily` 日期 URL）。
> **参考工具**：`crystal-tarot-draw/`（皇冠塔罗 v10.6，base64 + Shop 三级降级 + related 联动模式）+ `moon-calendar/`（月历，SunCalc 月相 + 每日水晶轮换 + 日期种子模式）。
> **数据源**：`_shared/tarot-knowledge.json`（22 牌，含 `best_daily_wear` 22/22）+ `_shared/moon-knowledge.json`（月相×水晶）+ `04-内容生产/13.tarot/configs/daily-knowledge.json`（365 天星象/东方时辰数据层，见 §3 数据源说明）+ `03-内容策略/星象数据参考-2026-2027.md`（已验证）。

---

## 1. 定位（留存 + Shop 转化，非 SEO 获客）

### 为什么不做 SEO 获客
- `daily tarot` / `tarot of the day` / `today's tarot` 是**通用词红海**：前 10 全是 tarot.com / cafeastrology / astrostyle / lure等高 DA 老站 + 大量 AI 生成站，新站（goearthward DA<20）排不进前 30
- SERP 证伪日期长尾：daily tarot 衍生词全是 reading/draw/pull/free/online，**无 `daily tarot {date}` 日期词搜索量**，365 篇日期文章零 SEO 价值
- 对标竞品（tarot.com / astrostyle）做的是**工具页**（JS 每日更新），不是 365 篇文章——我们跟进工具页形态

### 核心价值：承接 18 工具流量做留存 + Shop
工具的两大作用：

| 作用 | 机制 |
|------|------|
| **留存**（回访钩子）| 每日一牌（全站当天共享同一张牌），用户"明天还想来看"——皇冠塔罗/AI Chat/月历的访客 → 沉淀为日回访用户。历史模块（昨日/前日运势）强化回访习惯 |
| **Shop 转化** | 今日水晶（`best_daily_wear` × 星象调和）→ Shop CTA（三级降级）→ "today's crystal" 天然落地首饰（每日佩戴场景，正是 `best_daily_wear` 字段的设计意图）|

### 与 18 工具的流量闭环
```
皇冠塔罗 crystal-tarot-reading（用户抽牌解读）→ 结果页 "Come back tomorrow for your daily card" CTA → daily-tarot
AI Chat ai-tarot-chat（深度对话）→ 对话结束 "Tomorrow's card is waiting" → daily-tarot
月历 moon-calendar（每日水晶）→ "Today's card + crystal" 交叉 → daily-tarot
daily-tarot（今日牌+水晶）→ "Want a full reading?" → 皇冠塔罗 / AI Chat（深度版）
```
> **判断**：daily-tarot 应作为**第 19 个工具**独立加入 18 工具菜单（非并入皇冠/月历），理由：(1) 皇冠是"用户主动抽牌+提问"的深度解读场景，daily-tarot 是"全站共享+无需操作"的轻量每日钩子，交互逻辑不同；(2) 月历是月相×水晶（无塔罗牌维度），daily-tarot 是塔罗牌×水晶×星象×东方时辰，数据维度不同；(3) 独立 URL 才能被皇冠/AI Chat/月历的 related CTA 链向（related-html.js MAP 需新增 daily-tarot 条目）。并入会丧失独立留存入口。

---

## 2. URL + TKD

- **URL**：`/tools/daily-tarot/`（对齐 18 工具 `/tools/` 规范；**非** `/tarot-daily-{date}/` 日期 URL，也非 tarotap 的 `/fortune/daily`）
- **Title**：`Daily Tarot Reading: Today's Card & Crystal`（≤60 字符，含主词 daily tarot + today's card）
- **H1**：`Today's Tarot: {Card} — {Month D, YYYY}`（动态，JS 按当日牌渲染）
- **rank_math focus_keyword**：`daily tarot reading`（主）+ `today's tarot card`（次）
- **部署**：`_shared/scripts/create-page.js`，parent=**43101**（tools 父页），内容 `<!-- wp:html -->` 包裹，CSS 前缀 `edt-`（Earthward Daily Tarot，避与皇冠 `ect-`/月历 `emc-`/是与否 `eyn-` 冲突）

---

## 3. 数据源（4 层，全部已就绪）

### 数据层 1：22 张大牌（单源，已含每日佩戴水晶）
- **文件**：`_shared/tarot-knowledge.json`（22 牌全量）
- **关键字段**：
  - `crystals.best_daily_wear`（22/22 全有，专为每日佩戴场景设计——天然落地"今日水晶"Shop CTA）
  - `crystals.best_overall`（备用，星象调和时切换）
  - `upright_keywords` / `upright_meaning`（今日牌落点文案源）
  - `psychological_lens`（self-reflection 合规视角）
  - `eastern_anchors.tibetan` / `eastern_lens`（东方锚点，呼应东方时辰模块）
  - `astrology`（牌的星象关联，如 The Fool=Uranus，与当日星象背景交叉）
  - `recommended_practice`（"今日行动"模块源）
- **皇冠塔罗已验证此结构可前端渲染**（见 `crystal-tarot-draw/build/generate.js` `enrichStone()` + `BY_SLUG` 模式）

### 数据层 2：月相 × 水晶（SunCalc 实时计算）
- **文件**：`_shared/moon-knowledge.json`（4 月相×水晶×仪式×intention + 12 星座主题）
- **实时月相**：CDN `suncalc@1.9.0`（月历已验证），`SunCalc.getMoonIllumination(now).phase` → 4 相位归类（new/waxing/full/waning）
- **当日月相星座**：SunCalc 也可算月亮所在星座（月历未用但 API 支持，或简化用 `moon-knowledge.json` 的 `zodiac_themes` 映射）

### 数据层 3：365 天星象 + 东方时辰（daily-knowledge.json，关键复用）⭐
- **文件**：`04-内容生产/13.tarot/configs/daily-knowledge.json`（616KB，365 天数据）
- **来源**：原 365 篇文章计划产物，但**数据层对工具极其有价值**——每天已含工具需要的全部星象+东方时辰数据：
  ```json
  {
    "date": "2026-01-01",
    "moon": { "phase": "Waning Crescent", "zodiac": "Capricorn", "detail": "approaching Jan 19 new moon" },
    "outer_backdrop": "Pluto in Aquarius, Neptune in late Pisces, ...",
    "retrogrades": [],
    "eclipse": null,
    "special_event": null,
    "eastern_hour": { "label": "Chou 丑时 01:00–03:00", "meridian_note": "Liver meridian (肝经) — planning hour" }
  }
  ```
- **复用方式**：工具按当日日期 key（`yyyy-mm-dd`）查 `dates[date]`，取 `moon` / `outer_backdrop` / `retrogrades` / `eclipse` / `special_event` / `eastern_hour` 渲染星象背景模块 + 东方时辰模块
- **作废字段**（文章计划残留，工具不用）：`url`（`/tarot-daily-{date}/` 旧 URL）、`title`（`Daily Tarot Reading for {date}: {card}` 旧文章标题）、`focus_keyword`（旧文章 SEO）。这些字段保留在 json 里不影响工具，但 `_meta` 需更新（见 §9 迁移清单）
- **数据覆盖期**：2026 全年（365 天）。2027 年数据需后续按 `星象数据参考-2026-2027.md` 扩展（或工具在 2026-12-31 后降级为"只出牌+水晶，星象背景显示通用文案"）

### 数据层 4：星象原始参考（验证源）
- **文件**：`03-内容策略/星象数据参考-2026-2027.md`（已交叉核对 NASA/Cafe Astrology/CHANI/Astro-Seek）
- **用途**：daily-knowledge.json 的原始依据；扩展 2027 数据或校验时用

### 日期种子规则（全站当天共享同一张牌）⭐
```js
// 全站访客当天看到同一张牌（非每人随机，对齐裁决"全站共享"）
function getDailyCard(today) {
  const yyyyMmDd = today.toISOString().slice(0, 10); // '2026-07-02'
  let hash = 0;
  for (let i = 0; i < yyyyMmDd.length; i++) {
    hash = (hash * 31 + yyyyMmDd.charCodeAt(i)) >>> 0;
  }
  return TK.cards[hash % 22];
}
```
- **vs 月历的 dayOfYear%390**：月历是水晶轮换（390 库），daily-tarot 是 22 牌轮换；daily-knowledge.json 的 `card` 字段用的是 Fisher-Yates 预分配（16 天/牌，3 牌 17 天），更均匀——工具可二选一：
  - **方案 A（推荐）**：直接读 `daily-knowledge.json` 的 `dates[date].card`（已预分配均匀，且与星象数据同源）
  - **方案 B（降级）**：daily-knowledge.json 无该日期时（如 2027 年），用 hash%22 程序化计算

---

## 4. 工具交互（6 模块，无需用户操作，进入即渲染当日）

> 参考：月历的"进入即渲染当日"模式（非皇冠的"用户抽牌"模式）。daily-tarot 是**全站共享的今日牌**，用户无需抽牌，打开页面即见当日定局。

### 模块布局（桌面单列自上而下，移动同理）

| # | 模块 | 内容 | 数据源 |
|---|------|------|--------|
| **Hero** | 今日牌（大图+牌名+当日能量一句话）| 22 牌 visuals（复用皇冠牌面图或程序化渲染）+ 牌名 + `upright_meaning` 前 100 字 + 当日日期 | tarot-knowledge.json + 日期种子 |
| **M1** | Today's Card Energy（今日牌落点）| 该牌**当日落点**（结合当日星象写，非通用牌意）—— 从 daily-knowledge.json `moon` + `outer_backdrop` 拼装"今日星象如何激活此牌" | tarot `upright_meaning` × daily-knowledge `moon/outer_backdrop` |
| **M2** ⭐ | Today's Crystal（今日水晶 + Shop CTA）| 今日水晶（`best_daily_wear` 正位 / `best_reversed` 逆位）+ reason + img + Shop CTA（三级降级）。**核心转化模块** | tarot `crystals.best_daily_wear` + search-data.json（img/shop） |
| **M3** | Eastern Hour（东方时辰·子午流注）| 当日时辰能量（子时胆经/午时心经…）+ 中医时辰养生建议 + 牌的 `eastern_anchors` 呼应 | daily-knowledge `eastern_hour` + tarot `eastern_anchors` |
| **M4** | Astrological Context（星象背景）| 当日月相（SunCalc 实时）+ 月亮星座 + 行星位（外行星 backdrop）+ 逆行/食相/特殊事件 | daily-knowledge `moon/outer_backdrop/retrogrades/eclipse/special_event` + SunCalc |
| **M5** | History（历史运势·留存钩子）| 昨日 / 前日运势卡片（牌 + 水晶缩略图，可点击查看）—— 强化"明天再来"回访习惯 | daily-knowledge.json `dates[yesterday]` / `dates[dayBeforeYesterday]` |

### 交互细节
- **无操作渲染**：进入页面即 `init()`，按当日日期种子取牌 + 星象 + 水晶 + 时辰，全部前端 JS 渲染（无后端、无 LLM 调用——成本 0）
- **每日自动更新**：用户次日访问自动出新牌（日期种子变化），无需刷新缓存
- **分享按钮**（Hero 下方）：`Share today's card` → 复制链接 `/tools/daily-tarot/` + 社交文案 "My today's tarot card is {Card}. What's yours?"（引流回访）
- **时区**：用 UTC 日期（`toISOString().slice(0,10)`）保证全站同一天同一张牌（避免美东/北京跨日差异）；或用用户本地日期（更直觉但跨时区不同步）——**推荐 UTC**（对齐裁决"全站共享"）
- **历史模块**：仅显示昨日/前日（2 张缩略卡），不做更长历史（避免内容负担 + 防 SEO 重复）

### 与皇冠塔罗的交互差异（重要）
| 维度 | 皇冠塔罗 crystal-tarot-reading | daily-tarot |
|------|------------------------------|-------------|
| 抽牌方式 | 用户主动选牌（focus 必选 + 选满自动翻）| **无抽牌**，日期种子程序化出牌 |
| 牌共享度 | 每个用户独立抽（千人千面）| **全站当天共享**同一张牌 |
| 深度 | 深度解读（牌阵 + 场景 + 多水晶）| 轻量（单牌 + 单水晶 + 星象 + 时辰）|
| 回访钩子 | 弱（用户有需求才抽）| **强**（每日定局，明天再来）|
| 用途 | 解答具体问题 | 每日能量仪式感 |

---

## 5. 技术方案（参考皇冠 + 月历，无 Three.js 需求）

### 部署架构（对齐皇冠 wp:html + base64 模式）
```
WP page (parent=43101, slug=daily-tarot)
  └─ <!-- wp:html --> 块
       ├─ HTML 骨架（edt-* 容器 + 占位 div）
       ├─ <style> 内联 CSS（edt- 前缀）
       ├─ <script type="text/plain" id="edt-data">__EDT_DATA_B64__</script>  ← 22牌+月相+365天数据 asciiJSON→base64
       ├─ <script src="https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.min.js"></script>  ← 月相实时计算
       └─ <script>(微型 loader: atob→eval)</script>  ← 解 base64 执行应用 JS
```

### 为什么 base64 包装可执行 JS（皇冠已踩坑验证）
WP `wp_kses_post` 过滤 `<!-- wp:html -->` 块内的 `<script>`：`&&`→`&#038;&#038;`、`</`→`&lt;/`、非 ASCII 字节破坏 → IIFE 不执行。**解法**（皇冠 v9+ 验证）：可执行 JS Base64 包装放 `<script type="text/plain" id>` + 微型 `atob→eval` loader。JSON 用 `asciiJSON`（非 ASCII 转 `\uXXXX`）避免字节破坏。详见 memory `wp-html-block-js-base64`。

### 数据预加载（build 时注入，避免运行时 fetch）
```js
// generate.js 构建时
const TK = JSON.parse(fs.readFileSync('_shared/tarot-knowledge.json'));          // 22 牌
const MK = JSON.parse(fs.readFileSync('_shared/moon-knowledge.json'));           // 月相
const DK = JSON.parse(fs.readFileSync('04-内容生产/13.tarot/configs/daily-knowledge.json')); // 365 天星象
const SD = JSON.parse(fs.readFileSync('crystal-meaning-search/data/search-data.json'));      // 水晶 img/shop

// 精简后 asciiJSON + base64 注入 <script type="text/plain" id="edt-data">
const DATA = {
  cards: TK.cards.map(c => ({ /* 精简字段: number/slug/name/upright_meaning/crystals.best_daily_wear/eastern_anchors/astrology/... */ })),
  phases: MK.phases,
  dates: DK.dates,  // 365 天星象+时辰
  bySlug: SD.crystals.reduce((m,c)=>{ m[c.slug]={name:c.name,img:c.img,shop:c.shop||('/shop/?s='+c.slug)}; return m;}, {})
};
const DATA_B64 = Buffer.from(asciiJSON(DATA), 'utf8').toString('base64');
```

### Shop CTA 三级降级（复用皇冠 `enrichStone()` 模式）
```js
const HEALING = '/product-category/healing-crystals-jewelry/';  // 兜底
function getShopUrl(crystalSlug) {
  const sc = BY_SLUG[crystalSlug];
  if (!sc) return HEALING;                              // L3: 兜底 healing-jewelry
  if (sc.shop && sc.shop.startsWith('/product-category/')) return sc.shop;  // L1: category（已验证 200）
  if (sc.shop && sc.shop.startsWith('/shop/?s=')) return sc.shop;           // L2: 搜索页
  if (sc.link) return sc.link;                          // L2.5: meaning 页
  return HEALING;                                       // L3
}
// 注意：皇冠/月历 search-data.json 的 shop 字段已预配三级降级（CATEGORY→SEARCH→HEALING），无需重新绑定
```

### 渲染流程（运行时，纯前端 0 成本）
```
1. loader atob(edt-data) → eval → 注入 EDT 应用
2. EDT.init():
   a. today = new Date(); dateKey = today.toISOString().slice(0,10)  // '2026-07-02'
   b. card = DK.dates[dateKey].card  (或 hash%22 降级)
   c. moon = SunCalc.getMoonIllumination(today).phase → 4 相位归类
   d. astrology = DK.dates[dateKey] (outer_backdrop/retrogrades/eclipse/special_event/eastern_hour)
   e. crystal = card.crystals.best_daily_wear (或 best_overall)
   f. renderAll() → 6 模块 HTML
3. Share 按钮: navigator.share / clipboard API
```

### 性能（参考皇冠 163KB / 月历 178KB HTML）
- 预计 HTML ≈ 200KB（22 牌精简 + 365 天星象精简 + 月相 + CSS/JS base64）
- 365 天 `dates` 数据可进一步精简（只保留 `moon.phase/moon.zodiac/outer_backdrop/retrogrades/eclipse/special_event/eastern_hour`，去掉文章残留 `url/title/focus_keyword/weekday/day_of_year`），≈ 150KB
- 无 Three.js / 无 Playwright / 无后端 / 无 LLM → 加载 < 1s

---

## 6. 与 18 工具联动（related-tools MAP 新增）

### 新增 MAP 条目（`_shared/related-tools/related-html.js`）
```js
// TOOLS 新增（第 19 个工具）
'daily-tarot': { t: 'Daily Tarot', u: '/tools/daily-tarot/', d: "Today's tarot card and crystal for the whole community", i: '📅' },

// MAP 新增（daily-tarot 推荐位：深度解读 + 月历呼应 + 星座入口）
'daily-tarot': ['crystal-tarot-reading', 'ai-tarot-chat', 'moon-calendar'],

// 现有工具 MAP 更新（加入 daily-tarot 作为留存钩子）
'crystal-tarot-reading': ['ai-tarot-chat', 'daily-tarot', 'yes-no-tarot'],   // 原第三位 tarot-birth-card → daily-tarot
'ai-tarot-chat': ['crystal-tarot-reading', 'daily-tarot', 'tarot-birth-card'], // 加 daily-tarot
'moon-calendar': ['daily-tarot', 'birthstone-finder', 'crystal-cleansing-timer'], // 加 daily-tarot（日期驱动呼应）
```

### Code Snippet 同步（`_shared/related-tools/snippet.php`）
`snippet.php` 的 `$map` 数组需与 `related-html.js` MAP 同步（memory `tool-related-cta-crosslink`：改关系改 related-html.js MAP + snippet.php $map 两处）。daily-tarot 走 `/tools/` 前缀，wp_footer Code Snippet id=19 自动生效（无需 inject-root-pages.js）。

### 双向 CTA 文案
| 来源 | CTA 文案 | 目标 |
|------|---------|------|
| 皇冠塔罗结果页 | "Come back tomorrow for your daily card →" | daily-tarot |
| AI Chat 对话结束 | "Tomorrow's card is waiting →" | daily-tarot |
| 月历今日水晶 | "Today's card + crystal →" | daily-tarot |
| daily-tarot Hero | "Want a full reading? →" | 皇冠塔罗 / AI Chat |

---

## 7. Shop CTA（三级降级，参考皇冠 + memory shop-cta-no-deadlink-rule）

### 今日水晶 CTA（M2 模块）
今日水晶（`best_daily_wear`）落地 Shop，三级降级：

| 级别 | 触发条件 | URL 模式 | 示例 |
|------|---------|---------|------|
| **L1 category** | 该水晶有 product-category 页（search-data.json `shop` 字段已预配 + HEAD 验证 200）| `/product-category/{stone}-crystals/` | `/product-category/clear-quartz/` |
| **L2 search** | 无 category 但有产品 | `/shop/?s={stone}` | `/shop/?s=moonstone` |
| **L2.5 meaning** | 无产品但有 meaning 页 | `/{stone}-meaning/` | `/moonstone-meaning/` |
| **L3 healing-jewelry** | 全空兜底 | `/product-category/healing-jewelry/` | — |

### 兜底 CTA（M2 底部 + 页脚）
- `Shop healing jewelry →`（L3 兜底，所有水晶页脚恒显）
- `Read full {Card} guide →`（链向牌义页 `/tarot-{card}-crystals/`，内链强化）

### 预验证（build 时）
皇冠已验证 `search-data.json` 的 `shop` 字段三级降级已配好（CATEGORY/SEARCH/HEALING），无需重新绑定。daily-tarot 直接复用 `enrichStone()` 模式。

---

## 8. 合规（self-reflection，禁确定论 / cure / invest）

### 核心合规框架（复用塔罗线统一标准）
- **self-reflection framework**：所有牌义/水晶建议用"invites / invites you to notice / a mirror of"框架，禁"will happen / guaranteed / destined / fortune telling"
- ** Gentle Note 免责**（皇冠塔罗 `gentle_note` 模式）：页面底部固定免责 "Tarot is a tool for self-reflection, not prediction of fixed outcomes. Crystal associations are traditional, not medical claims."
- **禁医疗承诺**：M2 水晶段禁 cure / heal / treat / therapy；用 "traditionally associated with / paired with / a mindful focus for"
- **禁财务承诺**：M4 星象谈财务（如 Jupiter transits）禁 invest now / guaranteed return / wealth
- **禁命运确定论**：M1 牌义禁 "today will / today you will / this means X will happen"；用 "today's energy invites / today's card asks / a question to sit with"

### 高发雷区（每日运势页特有，原文档 §3 + §6 关卡 0 总结）
| 模块 | 高发雷区 | 替代表达 |
|------|---------|---------|
| M1 牌义 | "Today's card is {Card}. It means {通用牌意}" 模板填充 | "Today's card is {Card}. With {当日月相} in {月星座}, this card asks..."（结合星象）|
| M2 水晶 | "Wear {水晶} today" 万能句 | "{水晶} is traditionally paired with {牌} — a mindful companion for {当日主题}" |
| M3 时辰 | 中医时辰禁"治疗/养生确定论" | "In traditional Chinese medicine, {时辰} is associated with {经脉} — a rhythm to notice, not a prescription" |
| M4 星象 | "Mars retrograde will cause X" 确定论 | "Mars retrograde traditionally invites reflection on action — a cue to slow down, not a forecast of events" |

### 合规前置门（grep 黑名单，复用 1F §0A）
build 时对生成文案 grep：
- Health 黑名单：cure / heal / treat / therapy / prescription
- Finances 黑名单：invest / guaranteed / return / wealth / rich
- 确定论黑名单：today will / guaranteed / destined / will happen / fortune

---

## 9. 迁移清单（本次迁移完成的动作）

| # | 动作 | 状态 |
|---|------|------|
| 1 | 新建 `07-互动工具/daily-tarot/PRD.md`（本文件，工具 PRD）| ✅ 本次 |
| 2 | 删除 `03-内容策略/内容Brief/模板-Tarot-每日运势框架.md`（原文章框架，已迁移为工具 PRD）| ✅ 本次 |
| 3 | 更新 `02-网站规划/2A-网站结构.md` §9 + §126 + §350：`每日运势 365/年 /tarot-daily-{date}/` → `每日运势 1 工具页 /tools/daily-tarot/` | ✅ 本次 |
| 4 | 更新 `03-内容策略/内容Brief/模板-Tarot-配对文章框架.md` §426：链接从原"每日运势框架"→ 改为工具 PRD 路径 | ✅ 本次 |
| 5 | 标注 `04-内容生产/13.tarot/configs/daily-knowledge.json` `_meta`：从"365 篇文章数据"→ "daily-tarot 工具星象+东方时辰数据层（文章计划已作废，数据复用）" | ✅ 本次 |
| 6 | 待办（开发阶段）：`_shared/related-tools/related-html.js` + `snippet.php` MAP 加 daily-tarot 条目 | ⏳ 开发时 |

---

## 10. 未决问题（待开发前确认）

1. **2026-12-31 后降级策略**：daily-knowledge.json 只到 2026-12-31。2027 年是否提前扩展？（参考 `星象数据参考-2026-2027.md` 已有 2027 数据，可生成 daily-knowledge-2027.json）或工具降级为"只出牌+水晶，星象/时辰显示通用文案"？
2. **牌面 visuals**：复用皇冠的 22 牌图（程序化水晶六棱牌背）还是为 daily-tarot 单独做"今日牌"大图（1536×864 hero，含日期+牌+水晶，参考原文档 §5 图片规范）？推荐复用皇冠牌面图（零增量）+ 程序化渲染日期/水晶（无图片生成负担）。
3. **时区**：UTC（全站同步）vs 用户本地日期（更直觉）？推荐 UTC（对齐裁决"全站共享同一张牌"）。
4. **是否要邮件订阅钩子**：daily-tarot 是天然留存入口，可加 "Get tomorrow's card in your inbox" 邮件订阅（对齐占星工具规划 §八邮件自动化流）——但这是后续优化，MVP 不做。

---

## 附：与 horoscope 月运边界（不同赛道，无重叠）

| 维度 | daily-tarot（本工具）| horoscope 月运（144 篇文章）|
|------|--------------------|--------------------------|
| 维度 | 每日一牌（不分星座）| 12 星座 × 12 月 |
| 驱动 | 日期种子 × 22 牌 | 星座 × 月份 |
| 形态 | 工具页（JS 动态）| 文章（静态 SEO）|
| 用途 | 留存 + Shop 转化 | SEO 获客（吃 ` horoscope {sign} {month}` 长尾）|
| 数据 | tarot-knowledge.json + daily-knowledge.json | 144 月运文章（已有）|

两者主题词、维度、形态完全不同，无内链竞争。daily-tarot 可在 M4 星象模块链向 horoscope 月运（"Read your {sign} monthly horoscope →"），形成工具→文章流量互通。
