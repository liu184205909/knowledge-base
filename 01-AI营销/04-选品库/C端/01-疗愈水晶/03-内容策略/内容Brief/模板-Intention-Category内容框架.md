# Intention Category 内容框架

> **适用**：`/{intention-slug}`（如 /calm-mindfulness/）购买承接型 **Hub 页**（WordPress page + Elementor）
> **参照**：[模板-Crystals-for-Condition文章框架.md](模板-Crystals-for-Condition文章框架.md)（内容深度）+ about.js / elementor-upload.js generateHomepage（**UI 视觉**）+ [品牌语调配置](../品牌语调配置.md) §4/§5 + [2A-网站结构](../../02-网站规划/2A-网站结构.md) §4.2
> **数据**：[intention-tag-map.md](../../02-网站规划/产品规划/intention-tag-map.md)（8 tag→石种）+ [stone-core-data.md](../../02-网站规划/产品规划/stone-core-data.md)（水晶卡百科字段）+ [product-structure-plan.md](../../02-网站规划/产品规划/product-structure-plan.md) §一 + seed-crystals.json（关键词）
> **技术**：WordPress **page** + **Elementor 8 section** + REST `update`（?context=edit，8 页已存在用 updatePage）
> **修订**：2026-06-22 V2（UI 对齐 about/首页；水晶卡用 stone-core-data 百科字段；去 S5；CTA+Related 分开；related 图用 intention heroImage）

---

## 0. 定位（Intention 是购买 Hub，不是 condition 长文）

| 页面 | 中心 | 形态 | URL |
|---|---|---|---|
| Crystal Meaning（百科） | 水晶 | post，三视角 | `/gemstone/{slug}-meaning/` |
| Condition 页 | 问题 | post，SEO 长文 1200-1800 词 | `/crystals-for-{condition}/` |
| **Intention Page（本文）** | **购买** | **page，Elementor 营销页，内容深度 > 首页** | `/{intention}` |

- **UI 参考首页/about**（不是 condition）：Elementor 营销页视觉 —— Hero 全屏图+overlay / 图文左右交替 / 卡片网格 / 场景卡 / CTA banner
- **内容深度 > 首页**（~1300 词，首页概览 ~500 词）；三视角不展开，内链百科
- intention = Hub，condition = Spoke；引导深读到 condition，condition closing 引回 intention

---

## 1. URL 结构

`/{intention-slug}/`（根级 WordPress page，2A §三）。8 slug：calm-mindfulness / love-relationships / protection-clearing / abundance-success / health-vitality / personal-empowerment / transformation / spiritual-connection

> ⚠️ 不用过时 B 套（sleep-calm/anxiety-relief/focus-clarity，已归档 _archive/）。8 tag（calm/love/...）是产品打 tag，≠ 页面 slug。

---

## 2. 元信息 + TKD + 技术

| 字段 | 规则 |
|---|---|
| Post Type | WordPress **page**（Elementor，非 post）|
| H1 | 主题 Page Title 区输出（实测重复，本页不写 H1）|
| rank_math_title | `{Intention} Crystals: {Hook}` |
| rank_math_focus_keyword | 见 §9 |

技术：8 页已存在（id 16879-16886）→ `updatePage(pageId, data, status)`，`POST /wp-json/wp/v2/pages/{id}?context=edit`，meta `_elementor_data`+`_elementor_edit_mode:builder`+`_elementor_template_type:wp-page`，不传 slug/title。**Elementor 自身缓存**：REST 改 _data 后前端不刷新（手册§17，非缓存插件），需后台 Elementor→工具→「重新生成文件与数据」。

---

## 3. 页面框架（V2，8 section，UI 对齐 about/首页）

| # | Section | H | 内容 | 对齐 |
|---|---|---|---|---|
| S1 | Hero | — | 全屏背景图(heroImage)+overlay+主张(heroSubtitle)+Shop CTA | about S1 |
| S2 | 意图共鸣 | H2 | 图文左右：A Quick Answer(quickAnswer)+合规锚点 | about S2 |
| S3 | 意图故事 | H2 | 图文反向：Understanding(understanding 150-250词) | about S3 |
| S4 | 水晶卡 | H2+H3 | 3列卡：图+名+Meanings/Best for/Chakras/Mineral（**stone-core-data**）+Learn link | about S4 |
| S5 | Shop | H2 | wdProductsWidget | 首页 S3 |
| S6 | FAQ | H2 | accordion 5-7问（含 scientifically proven + 合规问）| condition M9 |
| S7 | CTA banner | — | 全屏 heroImage+overlay+Find Your X Crystal+Shop | about S8 |
| S8 | Related | H2 | 相关 intention 卡(heroImage)+condition 深读按钮 | about+首页 |

**V2 调整**：① 去使用场景 S5（best_for 已含场景）② 水晶卡用 stone-core-data（去手写 why/desc）③ S7/S8 CTA+Related 分开 ④ related 图用 intention heroImage。水晶卡字段：name/image/link + meanings/best_for/chakras/mineral（color·hardness）。

---

## 4. S5 产品衔接

`wdProductsWidget(count)`（elementor-utils）暂无意图筛选。B 步扩成按意图 tag 拉（tagsIds）。过渡：石种 category id OR。

---

## 5. 图片配置

| 图 | 来源 |
|---|---|
| heroImage | 生图（generate-intention-images，moleapi gpt-image-2，意图主题场景）|
| 水晶卡图 | 生图 crystal-{slug}.webp（closeup，跨页复用）|
| related 卡图 | 对应 intention heroImage（8 页互填）|

图已上传 WP（media 42972-43006，2026/06）。config image 存 WP url。

---

## 6. 合规边界（继承 condition §6，8 意图特化）

禁用：heal/cure/treat→support；energy/vibration→presence；"attract/guarantee/100%"→symbolize/represent。8 意图敏感点：
- Health（最敏感，禁医疗化）→ "support wellbeing alongside professional care, not a treatment"
- Protection（不挡灾）→ "symbolic grounding anchors, not a substitute for safety"
- Abundance（不致富）→ "represent prosperity intentions, not promises of riches"
- Love（不挽回）→ "support self-love, not a substitute for relationship work"

合规锚点 3 位置：S2 quickAnswer 末 + S6 FAQ 合规问 + footer。

---

## 7. 去AI化

避免 AI 句式（In conclusion/important to note）；具体场景；不对称句长；多水晶描述去模板。

---

## 8. 内链（intention hub，2A §4.2）

S4 → Crystal Meaning 百科；S8 → 相关 intention + condition 深读。每页 5-15 内链。

---

## 9. 八意图清单（关键词 + 选石 + condition 对应）

| Intention (slug) | focus_keyword (volume) | 选石(tag-map) | condition 深读 |
|---|---|---|---|
| Calm (calm-mindfulness) | crystals for calm | amethyst/lepidolite/howlite/amazonite/selenite/angelite | anxiety/stress/sleep |
| Love (love-relationships) | crystals for love (880) | rose-quartz/moonstone/rhodonite/lapis/aventurine/carnelian | love/self-love/emotional-healing |
| Protection (protection-clearing) | crystals for protection (9900) | black-tourmaline/obsidian/tiger-eye/amethyst/labradorite/hematite | protection/grounding |
| Abundance (abundance-success) | crystals for abundance (1000) | citrine/pyrite/aventurine/tiger-eye/quartz/carnelian | abundance/money/success |
| Health (health-vitality) | crystals for health (1000)⚠️ | ruby/bloodstone/red-jasper/carnelian/hematite/jade | health/strength/motivation |
| Personal (personal-empowerment) | crystals for confidence (590) | tiger-eye/carnelian/citrine/pyrite/labradorite/quartz | confidence/courage/motivation |
| Transformation (transformation) | crystals for new beginnings (590) | labradorite/moonstone/malachite/lepidolite/serpentine/aventurine | new-beginnings/transformation |
| Spiritual (spiritual-connection) | crystals for spiritual growth | amethyst/quartz/selenite/lapis/labradorite/kyanite | spiritual/meditation/intuition |

---

## 10. 方法论对齐

intention = Elementor 营销页（UI 首页/about，内容深度接近 condition 但更轻），三视角不展开，水晶卡用 stone-core-data 百科字段（有依据，非手写）。比 condition 轻、比首页深。

---

**状态**：V2（intention-category.js + calm config 已恢复 V2；7 config 待按 calm 模板重建）。下一步：calm 定稿 → 批量 7 config → 框架文档持续校准 → 重铺（清 Elementor 缓存看 V2）。
