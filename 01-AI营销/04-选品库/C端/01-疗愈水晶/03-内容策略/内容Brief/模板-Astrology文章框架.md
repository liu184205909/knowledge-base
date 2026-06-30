# Astrology × Crystals 文章框架 v2（双线：交叉蓝海 P0 + 纯占星铺量 P2 + 月相线）

> **适用**：占星事件×水晶交叉页（P0 蓝海）+ 月相仪式页（P0 工具联动）+ 纯占星铺量页（P2 资产积累）
> **竞品依据**（2026-06-29 精读 2 篇 + SERP 全量）：
> - **Energy Muse** "Surviving Mercury Retrograde with Crystals"（~900 词，单层 5 颗水晶 raw stone，**无首饰 CTA / 无 Eastern / 无三视角 / 无 FAQ**）
> - **Crystals.com** "Mercury Retrograde Nov 2025"（~1200 词，4 颗水晶 + 5 ritual bullet，**raw stone 集合页 / 无 schema / 无 Eastern**）
> - SERP 全量：`crystals for mercury retrograde` AIO sources 全是小水晶站（energymuse DA~50 / thecrystalcouncil / newmoonbeginnings / tocrystal / crystalgrids / ravencrystals / crystal-life），**零 Allure/Vogue/Chani 级权威站** = 真蓝海
> - `crystals for saturn return` / `crystals for full moon` / `crystals for eclipse` 同结构（7 词实测全 DA<40 小站）
> **数据**：`_shared/astrology-knowledge.json`（6 事件 × 6 角色水晶 + sign_specific + planets 行星色彩 + zodiac_power_stones + gentle_note + faq_shared_halves 单源）+ crystal-attributes.json（390 颗 Intentions/Chakra）+ 星象数据参考-2026-2027.md（已交叉核对的真实日期）
> **核心策略**：占星主词被 Allure/Vogue/Chani 垄断，**做"crystals for {astrology event}"交叉长尾**（竞品小站合集页低质 + raw stone，goearthward 靠**独立深度页 + 首饰 Shop CTA + Eastern Vedic/西藏调性**差异化）+ **首饰站主场转化**（交叉词意图 = "该用什么水晶" → 天然导向首饰购买）
>
> **6 大差异化**（vs 竞品合集单页）：
> 1. **独立深度页**：每事件独立 1800-2500 词（竞品合集 900-1200 词浅）
> 2. **首饰 Shop CTA**：每水晶链首饰产品（竞品只 raw stone，无购买承接）
> 3. **Eastern Vedic/西藏占星调性**：每篇 ≥2 处 Eastern 锚点（Navagraha 行星 gem / 西藏 sojong 等，对标 goearthward 东方调性）
> 4. **三视角解读**：占星传统 + 心理学锚点 + 水晶 companion（降灵性门槛 + 加深度）
> 5. **FAQ schema**：4-6 题 FAQPage schema（Energy Muse 无 FAQ，schema 直接超车）
> 6. **星座细分**：Mercury Rx in Scorpio/Sagittarius/Pisces 不同水晶（高量长尾，suggest 已证实）

---

## 1. URL + TKD

- **URL 规则**：`/crystals-for-{event-slug}/`（根级 post，无 category base，对齐 2A §一 URL 规则）
  - 示例：`/crystals-for-mercury-retrograde/` `/crystals-for-saturn-return/` `/crystals-for-full-moon/` `/crystals-for-new-moon/` `/crystals-for-eclipse-season/` `/crystals-for-venus-retrograde/`
  - Hub：`/crystals-for-astrology-events/`（汇总页，根级）
- **Title（≤60 字符）**：`{Title}` from knowledge（如 `Crystals for Mercury Retrograde: Stay Grounded & Clear`）
- **H1**：`{h1}` from knowledge
- Primary KW：`crystals for {event}` / `{event} crystals` / `best crystals for {event}`
- Secondary KW：`stones for {event}` / `{event} protection crystals` / `{event} 2026 crystals`
- rank_math 三件套必写（title / description / focus_keyword = `crystals for {event}`）

## 2. 模块结构（13 模块，目标 1800-2500 词）

| # | 模块 | H2 | 词数 | 要点 |
|---|---|---|---|---|
| Intro | Hero + TL;DR | （hero 图 + 导言段）| 100-150 | 事件钩子（"When {event} arrives..."）+ 一句话定位 + 含主关键词 |
| M1 | TL;DR Quick Answer | `{Event} at a Glance` | 80-120 | 速答 + Featured Snippet bait + 3 点 bullet（事件本质 / 期间会发生什么 / 推荐水晶）对标 AIO |
| **M2** | **What It Means** ⭐事件深化 | `What {Event} Actually Means` | 200-300 | **占星背景深化**（事件本质 + 周期/时长 + 传统解读，非泛"chaos time"）|
| **M3** | **What to Expect** ⭐场景化 | `What to Expect During {Event}` | 150-220 | **具体场景 bullet**（从 knowledge.what_to_expect 读，4 点生活场景）|
| **M4** | **Crystal Correspondences** ⭐核心 | `Best Crystals for {Event}` | 400-500 | **6 角色 H3 分层**（best_overall + 5 角色差异于竞品单层 5 颗）+ 四源依据 + 三要素 |
| **M5** | **How to Use / Ritual** ⭐仪式型 | `How to Work with {Event} Crystals` | 150-220 | **具体仪式步骤**（从 ritual_focus 读，非泛"How to Use"）|
| **M6** | **Sign-Specific** ⭐星座细分差异化 | `Crystals by Zodiac Sign for {Event}` | 120-180 | **星座细分水晶**（差异化：竞品无；从 sign_specific 读，无则 OMIT）|
| **M7** | **Three-Perspective** ⭐三视角差异化 | `{Event} Through Three Lenses` | 180-260 | **三视角**：Astrological tradition / Psychological lens / Crystal companion（差异化：竞品单一视角）|
| **M8** | **Eastern Perspective** ⭐护城河 | `{Event} in the Eastern Tradition` | 150-220 | **Eastern 锚点**（Vedic Navagraha + 西藏占星，从 eastern_lens 读，≥2 处锚点）|
| M9 | Shop CTA | `Shop {Event} Crystals` | 80-120 | 首饰 Shop CTA（差异化转化路径）+ 已验证 URL（wc/store 三级降级）|
| M10 | FAQ | `Frequently Asked Questions` | 300-400 | 4-6 题（faq_seed + shared_halves，生成 FAQPage schema）|
| M11 | Related + Closing | `Related Astrology Guides` | 80-120 | 相关事件互链 + Gentle Note 收尾 |
| M12 | Gentle Note | （无 H2，文末小字）| 40-60 | 合规免责（从 gentle_note 读，全站统一口径）|

**篇幅**：交叉线 P0 主力 1800-2500 词；Hub 1200-1500 词

### module_weights：6 事件差异化重心（防模板感）

> 每事件的 M2/M3/M7 内容重心不同，避免 6 篇只换事件名。

| 事件 | M2 重心（占星背景） | M3 场景（what to expect） | M7 心理学锚点 | M8 Eastern |
|---|---|---|---|---|
| Mercury Retrograde | 行星视逆行 + Mercury 司掌域 + re- 前缀传统 | 通讯混乱/技术故障/旧人旧事重现 | cognitive pacing & reflective review | Vedic Budha/buddhi + 西藏 review cycle |
| Saturn Return | 29.5 年周期 + 27-30/58-60 年龄段 + 结构审计 | 责任压力/褪去旧角色/长期方向澄清 | identity consolidation (Erikson) | Vedic Shani/karma + Blue Sapphire + 西藏 karmic ripening |
| Full Moon | 朔望周期 + 日月对冲 + 高潮释放点 | 情绪高涨/隐藏浮现/收尾节点 | emotional processing & closure | 西藏 sojong 净化 + Vedic Purnima |
| New Moon | 新月黑暗 + 播种点 + 与满月成对 | 低能量/向内/澄清想要什么 | intention-setting (implementation intentions) | Vedic Amavasya 祖先 + 西藏 reset |
| Eclipse Season | 节点对齐 + 加速命运 + 转折点 | 突变/真相浮现/加速感 | tolerance for uncertainty & meaning-making | Vedic Rahu/Ketu + 西藏 heightened 期 |
| Venus Retrograde | 18 月周期 + 40 天 + 心回顾季 | 旧爱重现/价值重审/金钱自我价值 | attachment review & self-worth | Vedic Shukra + Diamond |

**页面个性化权重规则（生产硬约束）**：
1. **每篇 M2 必须落到该事件的占星机制**（周期/时长/司掌域，从 knowledge.astrology_meaning 读，非泛"cosmic chaos"）
2. **每篇 M3 场景必须用该事件独有的 what_to_expect 4 点**（禁 6 篇都"emotional intensity / miscommunication"塞满）
3. **每篇 M7 心理学维度必须引用该事件对应概念**（见上表 M7 列）
4. **每篇 M8 Eastern 至少 2 处锚点**（Vedic 行星名 + 西藏/或 Vedic gem + 西藏期）

### M4 Crystal Correspondences 段（核心差异化）

**H3 购买意图分层**（每事件 6 角色，从 knowledge > events[i].crystals 读取）：
```
## Best Crystals for {Event}

### Best Overall Crystal for {Event}
[best_overall — 绑事件核心特质，多源共识最优]

### Best Crystal for {子角色1}   (如 Communication / Patience / Release / Protection)
### Best Crystal for {子角色2}
### Best Crystal for {子角色3}
### Best Crystal for {子角色4}
### Best Crystal to Wear Daily
```
> 角色名随事件变化（Mercury Rx = communication/protection/intuition/grounding；Saturn Return = patience/discipline/release/purpose；Full Moon = release/emotion/clarity/intuition 等），从 crystals 对象 key 动态生成 H3。

**三要素**（每颗水晶段必须含，QC 关卡2 检查）：
1. 绑事件 challenge/meaning（如 Mercury Rx 段含 "retrograde" / "communication"）
2. symbolic support（水晶 Intentions 命中）
3. 具体场景（hold/wear/place + 具体动作，非万能句）

## 3. 合规硬约束（M3 + 全文）

- ❌ 禁 doom 语言：`doom / disaster / cursed / bad luck / misfortune will happen / catastrophe`
- ❌ 禁确定论：`will heal / will attract / guaranteed / destined / meant to / always / never / cure / fix`
- ✅ 用 `invitation to reflect / growth edge / traditionally read as / a time to... / often brings / can surface`
- ✅ 逆行/食相/土星回归 = review season / structural audit / course correction（非 doom period）
- Gentle Note 全站统一（从 knowledge.gentle_note 读）

## 4. FAQ schema（M10）

- 4-6 题（从 faq_seed + 加 2 题 shared_halves：is_doom / can_predict_future）
- 每题 answer 2-4 句，合规口径
- 生成 FAQPage JSON-LD（upload 脚本注入）

## 5. 图片

- **hero 图**：`images/astrology/hero-{event}.webp`（1536×864，事件视觉 + 水晶 graphic，gpt-image-2，**允许画事件符号**如逆行箭头/满月/土星环/食相——但水晶需写实）
- **diagram 图**：`images/astrology/diagram-{event}.webp`（1024×1024，事件×水晶对应图/星座细分图）

## 6. Shop CTA 降级（三级，wc/store 验证）

1. **首选**：`/product-category/{stone}-crystals/`（验证 200）
2. 404 → `/shop/?s={stone}` 产品搜索页
3. 搜索空 → `/product-category/healing-jewelry/`（总首饰类目）
> 验证用 wc/store API（memory shop-cta-no-deadlink-rule）

## 7. 内链

- Hub `/crystals-for-astrology-events/` 互链所有事件
- 事件间互链（Mercury Rx ↔ Venus Rx；Full Moon ↔ New Moon；Eclipse ↔ Full Moon）
- 水晶 meaning 页互链（best_overall 必链）

## 8. 生产工程（复用 tarot/numerology 流水线）

1. `configs/astrology-config.json`（module_weights + gentle_note + faq_shared_halves + cta_validation 引用）
2. `scripts/generate-articles.js`（读 knowledge + config → 13 模块骨架 + `{{AI_*}}` 占位符）
3. AI 填充占位符（BATCH=2，glm 质量门，每批 ≤2 篇避免智谱过载）
4. `scripts/qc-checks.js`（**去AI化硬门禁**：差异化/水晶三要素/确定论禁词=0，非软提示）
5. `scripts/generate-images.js`（gpt-image-2，loadEnv 强制覆盖，NODE_PATH sharp）
6. `scripts/upload-astrology.js`（draft，URL 根级，分类 astrology 建，rank_math + Schema：Article+FAQ+Breadcrumb）
7. `scripts/verify-upload.js`（WP GET 验证 featured+img+schema+**去AI化禁词=0**）
