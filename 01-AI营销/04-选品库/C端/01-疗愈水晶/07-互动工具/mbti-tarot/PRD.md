# MBTI Tarot Birth Card 工具 PRD（MBTI×塔罗映射工具页）

> **定位**：MBTI 16 型 × 塔罗 Major Arcana 本命大牌映射工具，吃 `mbti tarot card` / `mbti birth card` 长尾词。**第 22 个工具**（继 daily-tarot #19、crystal-bracelet-builder #20、…）。
> **设计文档**：`02-网站规划/MBTI本命塔罗牌-数据层与工具设计.md`（schema/工具形态/文章矩阵设计稿，已审）。
> **竞品研究**：`01-竞品分析/MBTI本命塔罗牌-竞品研究.md`（4 条护城河：Major Arcana 路径 / 双牌映射 / 认知功能栈依据 / 水晶推荐独家）。
> **数据层**：`_shared/mbti-tarot-knowledge.json`（16 型 × 认知栈 × birth_cards primary+growth × 3 水晶 × eastern_anchor × upright_reading × reversed_shadow × shop_cta）+ `_shared/tarot-knowledge.json`（22 Major 牌 archetype/upright/reversed/crystals/eastern_anchors，birth_cards.slug 是外键）。
> **参考工具**：`daily-tarot/`（generate.js + 部署模式 + SEO accordion + 移动端响应式）+ `crystal-bracelet-builder/`（importmap 动态 import 大 JSON，避免内联）。
> **memory 红线**：wp-html-block-js-base64（复杂 JS 必须 Base64 包装）/ generate-js-html-newline-trap（换行用 '\n'）/ shop-cta-no-deadlink-rule（三级降级）/ playwright-chromium-zombie-block（不用 headless 验证）/ tool-related-cta-crosslink（联动改 2 处）/ rankmath-tkd-write-ua-curl（TKD 写入带 UA）。

---

## 1. 定位（SEO 获客 + Shop 转化 + 留存）

### 为什么做 SEO 获客（与 daily-tarot 不同）
- `mbti tarot card` / `mbti birth card` / `tarot card for {type}` 是**有量的细分长尾**（竞品研究 §1）：竞品（QuizExpo / PsyCat Tests / Tarot-by-Four）做的是 Court Cards 红海，Major Arcana 路径几乎无人系统做
- 4 条护城河（设计文档 §1.1）：(1) Major Arcana 22 大牌 archetype 传播力强；(2) 双牌映射（primary+growth）立体解读；(3) 认知功能栈（Ni/Ne/Si/Se/Ti/Te/Fi/Fe）依据；(4) 水晶推荐独家 + 东方锚点（全球 0 竞品）
- 文章矩阵后续铺（16 型 hub + 16×本命牌交叉 ~32 篇），工具是流量入口

### 与 22 工具的流量闭环
```
numerology-calculator（命数）→ mbti-tarot（人格 × 牌）  认知自我线
tarot-birth-card（生日本命牌）→ mbti-tarot（人格本命牌）  本命牌双轨
crystal-quiz（按色选水晶）→ mbti-tarot（按人格选水晶）  水晶自我发现线
mbti-tarot（结果页）→ Shop CTA（3 水晶落地首饰）+ related_types 文章（后续铺）
```
> **判断**：mbti-tarot 作为**第 22 个工具**独立加入 22 工具菜单。与 tarot-birth-card（生日算法）功能不重叠（设计文档 §3.1）：tarot-birth-card 守"生日算法"词，mbti-tarot 守"MBTI 型"词，两工具并存。

---

## 2. URL + TKD

- **URL**：`/tools/mbti-tarot/`（对齐工具 `/tools/` 规范）
- **Title**：`MBTI Tarot Birth Card Calculator: Find Your Major Arcana`（≤60 字符，含主词 mbti tarot + birth card calculator）
- **H1**：`MBTI Tarot: Your Birth Card by Personality Type`（动态，JS 按所选型渲染副标题）
- **rank_math focus_keyword**：`mbti tarot`（主）+ `mbti birth card`（次）
- **部署**：daily-tarot 同款（create-draft.js，parent=**43101** tools 父页），内容 `<!-- wp:html -->` 包裹，CSS 前缀 `emt-`（Earthward MBTI Tarot，避与 daily-tarot `edt-` / 皇冠 `ect-` / 月历 `emc-` / 是与否 `eyn-` 冲突）

---

## 3. 数据源（2 层，全注入前端 0 成本）

### 数据层 1：MBTI 16 型映射（mbti-tarot-knowledge.json）
- **文件**：`_shared/mbti-tarot-knowledge.json`（16 型 × 8 字段）
- **关键字段**：
  - `cognitive_stack`（dominant/auxiliary/tertiary/inferior —— Ni/Ne/Si/Se/Ti/Te/Fi/Fe）
  - `birth_cards.primary` / `birth_cards.growth`（slug + reason，双牌映射）
  - `upright_reading`（该型读本命主牌正位的独特角度，120-180 词）
  - `reversed_shadow`（逆位阴影 + 劣势功能整合邀请，80-120 词）
  - `crystals[3]`（best_overall / best_upright / best_growth，每颗 40-60 词 reason）
  - `eastern_anchor`（藏式/东方文化呼应，60-100 词）
  - `shop_cta`（primary/fallback，三级降级）
  - `related_types` / `related_intentions`（内链用）

### 数据层 2：22 Major 牌（tarot-knowledge.json，单源外键）
- **文件**：`_shared/tarot-knowledge.json`（22 牌全量）
- **关联机制**：mbti-tarot-knowledge 的 `birth_cards.slug` 是外键，运行时从 tarot-knowledge.cards 取牌详情（name/archetype/upright_meaning/reversed_meaning/psychological_lens/eastern_anchors/astrology/recommended_practice/crystals/chakra）
- **优势**：牌义不重复维护（tarot-knowledge 单源），MBTI 视角是叠加层

### 数据层 3：水晶详情（search-data.json，img/shop 三级降级）
- **文件**：`crystal-meaning-search/data/search-data.json`（390 水晶 img/link/shop）
- **关联机制**：mbti-tarot crystals[].slug（`{stone}-meaning`）→ normSlug 去 -meaning → BY_SLUG 查 img/shop
- **预验证**：mbti 涉及 19 个水晶 slug 在 search-data.json 中 100% 命中（开发前已验证）

### 双路径输入（吃 mbti birth card calculator 错位词，设计文档 §3.1）
- **路径 A（主）**：选 MBTI 型（4 步下拉：Energy I/E → Mind N/S → Nature T/F → Tactics J/P）→ 直接出结果
- **路径 B（辅）**：选填生日（month/day/year）→ 算 Tarot Birth Card（数值归约算法，复用 tarot-birth-card 同款）→ 若同时填了 MBTI，输出"双牌融合解读"；若只填生日 → 退化为 tarot-birth-card 算法（避免分流）
- **与 tarot-birth-card 工具的区别**：tarot-birth-card 守"生日算法"词（数值归约），mbti-tarot 守"MBTI 型"词（认知功能栈映射），两工具并存

---

## 4. 工具交互（7 模块，用户选型后渲染）

> 参考：daily-tarot 的"进入即渲染"模式 + crystal-quiz 的"4 步选择"模式。mbti-tarot 是**用户主动选型 → 渲染结果**，非 daily-tarot 的"全站共享"。

### 模块布局（桌面单列自上而下，移动同理）

| # | 模块 | 内容 | 数据源 |
|---|------|------|--------|
| **Input** | MBTI 型选择器（4 步下拉）+ 选填生日 | 4 dichotomy（I/E, N/S, T/F, J/P）+ month/day/year 生日字段 | 用户输入 |
| **Hero** | 结果头（型 + 昵称 + 认知栈 + 双牌缩略）| mbti-tarot `nickname/group/cognitive_stack` + 双牌程序化牌面 | mbti-tarot + tarot-knowledge |
| **M1** | Primary Birth Card（本命主牌大图 + 完整解读）| 主牌程序化牌面 + archetype + upright_meaning + upright_reading（MBTI 视角）+ 认知功能对齐 reason | tarot-knowledge（外键）+ mbti-tarot |
| **M2** | Growth Card（成长牌 + 阴影整合）| 成长牌程序化牌面 + reason + reversed_shadow + recommended_practice | tarot-knowledge（外键）+ mbti-tarot |
| **M3** ⭐ | Crystals（3 颗水晶 + Shop CTA，核心转化）| 3 水晶（best_overall/best_upright/best_growth）+ img + reason + Shop 三级降级 | mbti-tarot crystals + search-data |
| **M4** | Eastern Anchor（东方锚点）| `eastern_anchor` 藏式/东方文化呼应 | mbti-tarot |
| **M5** | Related（延伸阅读 + 认知相近型内链）| related_types（→ 后续 16 型 hub 文章）+ related_intentions（→ intentions 页）| mbti-tarot |

### 交互细节
- **4 步选择器**：每步 2 个大按钮（I/E 第 1 步，N/S 第 2 步，T/F 第 3 步，J/P 第 4 步），选完第 4 步自动渲染结果（无需"提交"按钮）
- **生日选填**：Hero 下方折叠区"Optional: add your birthday for a tarot birth card"，展开后填 month/day/year → 算 Birth Card → 若已选 MBTI，融合解读"Your MBTI card is X, your birthday card is Y — together they..."
- **重置按钮**：Hero 右上角"Try another type" → 回到 Input 模块
- **分享按钮**（Hero 下方）：`Share my MBTI tarot card` → 复制链接 + 社交文案 "My MBTI tarot birth card is {Card}. What's yours?"
- **URL hash 同步**：选完型后 URL 加 `#intj`，可直接分享该型链接（deep link）

### 与 daily-tarot 的交互差异
| 维度 | daily-tarot | mbti-tarot |
|------|-------------|------------|
| 触发 | 进入即渲染（日期种子）| 用户选型（4 步下拉）|
| 共享度 | 全站当天共享 | 每个用户独立选 |
| 深度 | 轻量（单牌+水晶+星象）| 深度（双牌+3 水晶+东方+融合）|
| 回访钩子 | 强（每日定局）| 弱（人格固定，但可分享引流）|
| 用途 | 每日能量仪式感 | 人格自我发现 |

---

## 5. 技术方案（参考 daily-tarot + crystal-bracelet-builder，无 Three.js）

### 部署架构（对齐 daily-tarot wp:html + base64 模式）
```
WP page (parent=43101, slug=mbti-tarot)
  └─ <!-- wp:html --> 块
       ├─ HTML 骨架（emt-* 容器 + 占位 div）
       ├─ <style> 内联 CSS（emt- 前缀）
       ├─ <script type="application/json" id="emt-data">__DATA_ASCII__</script>  ← 16 型精简 + 22 牌精简 + shop slugs（asciiJSON，CJK \uXXXX）
       ├─ <script type="text/plain" id="emt-app">__APP_B64__</script>  ← 应用 JS Base64 包装
       └─ <script>(微型 loader: atob→eval)</script>  ← 解 base64 执行应用 JS
```

### 为什么 base64 包装可执行 JS（皇冠/daily-tarot 已踩坑验证，memory wp-html-block-js-base64）
WP `wp_kses_post` 过滤 `<!-- wp:html -->` 块内的 `<script>`：`&&`→`&#038;&#038;`、`</`→`&lt;/`、非 ASCII 字节破坏 → IIFE 不执行。**解法**：可执行 JS Base64 包装放 `<script type="text/plain" id>` + 微型 `atob→eval` loader。JSON 用 `asciiJSON`（非 ASCII 转 `\uXXXX`）避免字节破坏。

### 数据预加载（build 时注入，避免运行时 Fetch）
```js
// generate.js 构建时
const M = JSON.parse(fs.readFileSync('_shared/mbti-tarot-knowledge.json'));          // 16 型
const TK = JSON.parse(fs.readFileSync('_shared/tarot-knowledge.json'));               // 22 牌
const SD = JSON.parse(fs.readFileSync('crystal-meaning-search/data/search-data.json')); // 390 水晶

// 精简后 asciiJSON 注入 <script type="application/json" id="emt-data">
const DATA = {
  types: /* 16 型精简 */,
  cards: /* 22 牌精简 */,
  by_slug: /* 水晶 img/shop 三级降级 */,
};
const DATA_BLOCK = asciiJSON(DATA);
```

> **注**：设计文档 §3.4 提到 "importmap 动态 import（参考 crystal-bracelet-builder v1）"。但 mbti-tarot 的数据量（16 型 + 22 牌 ≈ 80KB）远小于 crystal-bracelet-builder 的 parts-source.json（含 glb 模型）。daily-tarot 模式（asciiJSON 内联 + base64）已验证可承载 200KB+，且更简单（无需 vendor importmap）。**选 daily-tarot 模式（asciiJSON 内联），不用 importmap**。

### Shop CTA 三级降级（复用 daily-tarot enrichStone + BY_SLUG 模式）
```js
const HEALING = '/product-category/healing-jewelry/';
function getShopUrl(crystalSlug) {
  const sc = BY_SLUG[normSlug(crystalSlug)];
  if (!sc) return HEALING;                              // L3: 兜底 healing-jewelry
  if (sc.shop && sc.shop.startsWith('/product-category/')) return sc.shop;  // L1: category
  if (sc.shop && sc.shop.startsWith('/shop/?s=')) return sc.shop;           // L2: 搜索页
  if (sc.link) return sc.link;                          // L2.5: meaning 页
  return HEALING;                                       // L3
}
```
mbti-tarot-knowledge 的 `shop_cta.primary` 已预配（如 `/product-category/amethyst-crystals/`），但 build 时统一用 search-data 的 shop 字段（三级降级已配好），mbti-tarot 的 shop_cta 作为 reason 文案参考。

### Tarot Birth Card 算法（路径 B 生日双轨，复用 tarot-birth-card 同款）
```js
// 数值归约（Tarot.com 标准）：MM + DD + YYYY + MM + DD → 反复归约到 22 内
function birthCardFromBirthday(m, d, y) {
  var sum = m + d + y + m + d;  // Tarot.com: month + day + year + month + day
  while (sum > 22) {
    sum = String(sum).split('').reduce((a, c) => a + Number(c), 0);
  }
  // sum ∈ [1..22]，映射到 22 Major（0=The Fool，1=The Magician，..., 21=The World，22=The Fool）
  var idx = (sum === 22) ? 0 : sum - 1;  // 22 归到 The Fool（22 大牌循环）
  return CARDS[idx];
}
```

### 渲染流程（运行时，纯前端 0 成本）
```
1. loader atob(emt-app) → eval → 注入 EMT 应用
2. EMT.init():
   a. 渲染 Input 模块（4 步下拉 + 选填生日折叠区）
   b. 监听 4 步选择 → 第 4 步选完触发 renderResult(mbtiType)
   c. renderResult():
      - 从 DATA.types[type] 取 MBTI 数据
      - 从 DATA.card_by_slug[primary.slug] 取主牌详情
      - 从 DATA.card_by_slug[growth.slug] 取成长牌详情
      - enrichStone 3 水晶（BY_SLUG 三级降级）
      - 渲染 Hero + M1 + M2 + M3 + M4 + M5
   d. URL hash 同步：location.hash = type.toLowerCase()
   e. 生日选填：若填了，算 birthCardFromBirthday → 渲染融合段
3. Share 按钮: navigator.share / clipboard API
4. deep link：解析 location.hash → 自动选型 + 渲染
```

### 性能（参考 daily-tarot 200KB HTML）
- 预计 HTML ≈ 100KB（16 型精简 + 22 牌精简 + shop slugs + CSS/JS base64）
- 无 Three.js / 无 SunCalc / 无后端 / 无 LLM → 加载 < 0.5s

---

## 6. 与 22 工具联动（related-tools MAP 新增）

### 新增 MAP 条目（`_shared/related-tools/related-html.js`）
```js
// TOOLS 新增（第 22 个工具）
'mbti-tarot': { t: 'MBTI Tarot', u: '/tools/mbti-tarot/', d: 'Find your MBTI tarot birth card and crystals', i: '🧬' },

// MAP 新增（mbti-tarot 推荐位：本命牌双轨 + 认知自我线）
'mbti-tarot': ['tarot-birth-card', 'numerology-calculator', 'crystal-quiz'],

// 现有工具 MAP 更新（加入 mbti-tarot）
'numerology-calculator': ['tarot-birth-card', 'mbti-tarot', 'chinese-zodiac-checker'],  // 第 2 位改 mbti-tarot
'tarot-birth-card': ['crystal-tarot-reading', 'ai-tarot-chat', 'mbti-tarot'],           // 第 3 位改 mbti-tarot
'crystal-quiz': ['chakra-test', 'mbti-tarot', 'crystal-bracelet-builder'],              // 第 2 位改 mbti-tarot
```

### Code Snippet 同步（`_shared/related-tools/snippet.php`）
`snippet.php` 的 `$tools` + `$map` 数组需与 `related-html.js` 同步（memory tool-related-cta-crosslink：改关系改 related-html.js MAP + snippet.php $map 两处）。mbti-tarot 走 `/tools/` 前缀，wp_footer Code Snippet id=19 自动生效。

### 双向 CTA 文案
| 来源 | CTA 文案 | 目标 |
|------|---------|------|
| numerology 结果页 | "See your MBTI tarot card →" | mbti-tarot |
| tarot-birth-card 结果页 | "Find your MBTI tarot card →" | mbti-tarot |
| crystal-quiz 结果页 | "What does your personality say? →" | mbti-tarot |
| mbti-tarot Hero | "Calculate by birthday →" | tarot-birth-card |

---

## 7. Shop CTA（三级降级，参考 daily-tarot + memory shop-cta-no-deadlink-rule）

### 3 水晶 CTA（M3 模块）
3 水晶（best_overall/best_upright/best_growth）落地 Shop，三级降级（daily-tarot enrichStone + BY_SLUG 模式，build 时三级降级已配好，无需重新绑定）。

### 兜底 CTA（M3 底部 + 页脚）
- `Shop healing jewelry →`（L3 兜底，所有水晶页脚恒显）
- `Read full {Card} guide →`（链向牌义页 `/tarot-{card}-crystals/`，内链强化）

### 预验证（build 时）
开发前已验证 mbti 涉及 19 水晶 slug 在 search-data.json 100% 命中（img/shop/link 全有）。

---

## 8. 合规（self-reflection，禁确定论 / cure / invest / MBTI 商标）

### 核心合规框架（复用塔罗线统一标准 + MBTI 商标）
- **self-reflection framework**：所有牌义/水晶建议用"invites / invites you to notice / a mirror of"框架，禁"will happen / guaranteed / destined / fortune telling"
- **MBTI 商标 disclaimer**（页脚固定 + schema）：`MBTI is a registered trademark of The Myers-Briggs Company. This tool is an independent framework based on Jungian cognitive functions (Ni/Ne/Si/Se/Ti/Te/Fi/Fe), offered for self-reflection and creative exploration — not affiliated with, endorsed by, or sponsored by The Myers-Briggs Company.`
- **禁医疗承诺**：M3 水晶段禁 cure / heal / treat / therapy；用 "traditionally associated with / paired with / a mindful focus for"
- **禁性格诊断**：定位 self-reflection（非 personality diagnosis），与 gentle note 一致
- **禁命运确定论**：M1/M2 牌义禁 "you will / this means you are X"；用 "your type's energy invites / a pattern to notice"

### 高发雷区（MBTI 工具特有）
| 模块 | 高发雷区 | 替代表达 |
|------|---------|---------|
| Input | "Find out who you really are" 确定论 | "A mirror for self-reflection" |
| M1 主牌 | "INTJs are Hermits" 标签化 | "INTJ's dominant function (Ni) resonates with the Hermit archetype" |
| M2 成长牌 | "Your weakness is X" 负面 | "A growth invitation around your inferior function" |
| M3 水晶 | "Wear {水晶} to heal" 医疗 | "{水晶} is traditionally paired with {牌} — a mindful companion" |
| 数据 | 直接称"MBTI 测出你是 X" | "based on Jungian cognitive functions, for self-reflection" |

### 合规前置门（grep 黑名单，build 时）
- Health 黑名单：cure / heal / treat / therapy / prescription
- Finances 黑名单：invest / guaranteed return / wealth
- 确定论黑名单：you will / guaranteed / destined / will happen / personality diagnosis
- 白名单（前置 not/no/not a 排除 self-reflection 否定声明）

---

## 9. SEO accordion（参考 daily-tarot 模式，9 FAQ）

页面底部 SEO accordion（6 段长文 + 9 FAQ），吃 `mbti tarot card` / `mbti birth card calculator` 长尾：

1. What Is an MBTI Tarot Birth Card?
2. How MBTI Types Are Matched to Tarot Cards（认知功能栈说明）
3. Can I Have Two MBTI Tarot Cards?（primary + growth 双牌）
4. MBTI vs Birthday Tarot Birth Cards（与 tarot-birth-card 区别）
5. Which Crystals Match My MBTI Tarot Card?
6. Coming Back: Living With Your MBTI Tarot Card

FAQ（9 问，吃具体长尾）：
- What is an MBTI tarot birth card?
- How is my MBTI type matched to a tarot card?
- Can I have two MBTI tarot cards?
- What's the difference between an MBTI tarot card and a birthday tarot birth card?
- Which crystals go with my MBTI tarot card?
- Is the MBTI tarot mapping scientific?
- Can my MBTI tarot card change?
- What if I don't know my MBTI type?
- Is this tool free?

---

## 10. MBTI 商标 disclaimer（红线，必显）

页脚固定 disclaimer（mbti-tarot-knowledge.json `_meta.mbti_trademark_notice` 已有）：
> MBTI is a registered trademark of The Myers-Briggs Company. This tool is an independent framework based on Jungian cognitive functions (Ni/Ne/Si/Se/Ti/Te/Fi/Fe), offered for self-reflection and creative exploration — not affiliated with, endorsed by, or sponsored by The Myers-Briggs Company. Mapping decisions are our own editorial interpretation and do not represent official MBTI doctrine.

---

## 11. 红线（踩过的坑）

1. **WP wp:html 块复杂 JS 必须 Base64 包装** + 微型 loader atob→eval + JSON asciiJSON \uXXXX（memory wp-html-block-js-base64）
2. **不用 headless Playwright 验证**（zombie 阻塞，用 python -m http.server 真机，memory playwright-chromium-zombie-block）
3. **generate.js 拼 HTML 换行用 '\n' 不用 '\\n'**（memory generate-js-html-newline-trap）
4. **MBTI 商标 disclaimer**（_meta 已有，前端 footer 显示）
5. **Shop CTA 三级降级**（验 /product-category/{stone}-crystals/ 200，不 200 用 /shop/?s={stone}，memory shop-cta-no-deadlink-rule）
6. **水晶 slug -meaning 后缀**（链 meaning 页）
7. **嵌图/WP update 必 context=edit**
8. **TKD 写入带 UA curl/8.0.0**（CF 拦截 Python urllib 默认 UA，memory rankmath-tkd-write-ua-curl）
9. **联动改 2 处**（related-html.js MAP + snippet.php $map，memory tool-related-cta-crosslink）
10. **CJK 字节破坏**：mbti-tarot-knowledge 的 reason/upright_reading/eastern_anchor 含中文，必须 asciiJSON \uXXXX 转义后注入 JSON 块（base64 包装的是 APP_JS，JSON 块单独 asciiJSON 即可，皇冠/daily-tarot 同款）

---

## 12. 部署清单（一气呵成）

| # | 动作 | 状态 |
|---|------|------|
| 1 | 写 PRD（本文件）| ✅ |
| 2 | 写 generate.js（generate 静态 HTML）| ⏳ |
| 3 | 写 seo-content.html（6 段 + 9 FAQ）| ⏳ |
| 4 | 跑 generate.js → mbti-tarot.html | ⏳ |
| 5 | 本地测（python -m http.server 真机验）| ⏳ |
| 6 | create-draft.js 部署 WP（draft 不 publish）| ⏳ |
| 7 | rankmath-tkd.js（UA curl/8.0.0）| ⏳ |
| 8 | mega menu 加 mbti-tarot（cms_block 47990，Tarot 列）| ⏳ |
| 9 | related-html.js MAP + snippet.php $map 加 mbti-tarot（2 处）| ⏳ |
| 10 | sitemap submit | ⏳ |
| 11 | 线上验证（curl /tools/mbti-tarot/ 200 + TKD + mega menu + 联动）| ⏳ |

---

**本 PRD 由设计文档 `02-网站规划/MBTI本命塔罗牌-数据层与工具设计.md`（schema/工具形态/文章矩阵设计稿）+ daily-tarot PRD（部署/SEO/合规模式）合并。下一步 = 写 generate.js → 部署 → 上线。**
