# Intention Category 内容框架

> **适用**：`/{intention-slug}`（如 /calm-mindfulness/）购买承接型 **Hub 页**（WordPress page + Elementor）
> **参照**：[模板-Crystals-for-Condition文章框架.md](模板-Crystals-for-Condition文章框架.md)（内容深度）+ about.js / home-v2.js / Elementor REST API 操作手册.md（UI 视觉）+ [品牌语调配置](../品牌语调配置.md) §4/§5 + [2A-网站结构](../../02-网站规划/2A-网站结构.md) §4.2
> **数据**：[intention-tag-map.md](../../02-网站规划/产品规划/intention-tag-map.md)（8 tag→石种）+ [stone-core-data.md](../../02-网站规划/产品规划/stone-core-data.md)（水晶卡百科字段）+ [product-structure-plan.md](../../02-网站规划/产品规划/product-structure-plan.md) §一 + seed-crystals.json（关键词）
> **技术**：WordPress **page** + **Elementor** + REST `update`（?context=edit，8 页已存在用 updatePage）
> **修订**：2026-06-24 V3（整体重写修复 GBK 乱码；UI 对齐 about/首页；水晶卡用 stone-core-data 百科字段；去 S5；CTA+Related 分开；related 图用 intention heroImage；§5 标准图位清单）

---

## 0. 定位（Intention 是购买 Hub，不是 condition 长文）

| 页面 | 中心 | 形态 | URL |
|---|---|---|---|
| Crystal Meaning（百科） | 水晶 | post，三视角 | `/gemstone/{slug}-meaning/` |
| Condition 页 | 问题 | post，SEO 长文 1200-1800 词 | `/crystals-for-{condition}/` |
| **Intention Page（本文）** | **购买** | **page，Elementor 营销页，内容深度 > 首页** | `/{intention}` |

- **UI 参考首页/about**（不是 condition）：Elementor 营销页视觉 — Hero 全屏图+overlay / 图文左右交替 / 卡片网格(image-box) / CTA banner
- **内容深度 > 首页**（~1300 词，首页概览 ~500 词）；三视角不展开，内链百科
- intention = Hub，condition = Spoke；引导深读到 condition，condition closing 引回 intention

---

## 1. URL 结构

`/{intention-slug}/`（根级 WordPress page）。8 slug：calm-mindfulness / love-relationships / protection-clearing / abundance-success / health-vitality / personal-empowerment / transformation / spiritual-connection

---

## 2. 元信息 + TKD + 技术

| 字段 | 规则 |
|---|---|
| Post Type | WordPress **page**（Elementor） |
| H1 | 主题 Page Title 区输出（实测重复，页面内不写 H1 或加回由 content-v1 定） |
| rank_math_title | `{Intention} Crystals: {Hook}` |
| rank_math_description | 150-160 字符 SERP 摘要 |
| rank_math_focus_keyword | 见 §9 |

技术：8 页已存在（id 16879-16886）→ `updatePage(pageId, data, status)`，POST /wp-json/wp/v2/pages/{id}?context=edit，meta `_elementor_data` + `_elementor_edit_mode:builder` + `_elementor_template_type:wp-page` + `rank_math_*`（TKD，WP REST meta 写，前端 `<title>`/description 验证）。

**Elementor 自身缓存**：REST 改 _data 后前端不刷新（手册§17，非缓存插件），需后台 Elementor→工具→「重新生成文件与数据」。或建全新 page 绕缓存（如 calm-v6）。

---

## 3. 页面框架（8 section，UI 对齐 about/首页）

| # | Section | H | 内容 | 对齐 |
|---|---|---|---|---|
| S1 | Hero | H1 | 全屏背景图(heroImage)+overlay+主张(heroSubtitle)+Shop CTA | about S1 |
| S2 | 意图共鸣 | H2 | 图文左右：A Quick Answer(quickAnswer)+合规锚点 | about S2 |
| S3 | 意图故事 | H2 | 图文反向：Understanding(understanding) | about S3 |
| S4 | 水晶卡 | H2+H3 | image-box 卡：图+名+best_for一句话+链接百科 | about S4 |
| S5 | Shop | H2 | wdProductCategoriesWidget(产品分类) | 首页 |
| S6 | FAQ | H2 | accordion 5-7问（含 scientifically proven + 合规问）| condition M9 |
| S7 | CTA banner | — | 全屏 heroImage+overlay+Find Your X Crystal+Shop | about S8 |
| S8 | Related | H2 | 相关 intention 卡(heroImage)+condition 深读按钮 | 首页 S7 |

水晶卡用 stone-core-data 百科字段（meanings/best_for/chakras/mineral，有依据非手写），或简化为 best_for 一句话 + 链接百科。

---

## 4. S5 产品衔接

`wdProductCategoriesWidget`（elementor-utils，产品分类网格）或 `wdProductsWidget`（产品网格）。B 步扩成按意图 tag 筛选。

---

## 5. 图片配置 / 标准图位清单（8 section）

> 参考 Crystal Meaning §5（key/placement/alt/prompt/size）+ Condition §5 + content-v1.md §6。
> 每页 ~12 图位，通过复用，新生只 hero，其余复用。

| Section | 图位 | 数量 | 内容 | 来源 | 复用策略 |
|---|---|---|---|---|---|
| S1 Hero | 背景图 | 1 | 意图场景（content-v1 §6 Hero：水晶组合+场景基调+禁忌） | **新生** gpt-image-2 | S7 CTA 复用本图 |
| S2 意图共鸣 | 图左 | 1 | crystals[0] closeup | 复用 crystal closeup | 跨意图共享 |
| S3 意图故事 | 图右 | 1 | crystals[1] closeup | 复用 | — |
| S4 水晶卡 | 卡片图 ×6 | 6 | 每水晶 closeup | 复用 crystal-{slug}.webp | 27 张跨页 |
| S5 Shop | 产品图 | N | 产品 | WoodMart 产品自带 | — |
| S6 FAQ | 无 | 0 | — | — | — |
| S7 CTA banner | 背景 | 1 | hero | **复用 S1** | — |
| S8 Related | 卡图 ×3 | 3 | 其他 intention hero | 复用跨 intention | — |

**新生图**（仅 hero）：8 张（每意图 1，按 content-v1 §6 Hero 需求 + 场景禁忌）。已生成 `assets/images/generated/intentions/hero-v1/{slug}.webp`。
**复用图**：27 crystal closeup（跨页）+ hero（S1/S7/S8 Related）+ 产品（Shop 自带）。已上传 WP media 42972-43006。

生图规则：
- hero：每意图 content-v1 §6 Hero prompt（水晶组合+场景+禁忌），1536×864 webp，命名 intention-{slug}-hero.webp
- crystal closeup：27 水晶（每水晶 1，跨页），1024×1024 webp，命名 crystal-{slug}.webp
- 上传 WP media，config image 字段存 WP url
- content-v1.md §6 应与本表一致（每 section 图位明确）

---

## 6. 合规边界（继承 condition §6，8 意图特化）

禁用：heal/cure/treat→support；energy/vibration→presence；"attract/guarantee/100%"→symbolize/represent。

8 意图敏感点：
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
| Calm (calm-mindfulness) | calming crystals | amethyst/lepidolite/howlite/amazonite/selenite/angelite | anxiety/stress/sleep |
| Love (love-relationships) | crystals for love (880) | rose-quartz/moonstone/rhodonite/lapis/aventurine/carnelian | love/self-love/emotional-healing |
| Protection (protection-clearing) | crystals for protection (9900) | black-tourmaline/obsidian/tiger-eye/amethyst/labradorite/hematite | protection/grounding |
| Abundance (abundance-success) | crystals for abundance (1000) | citrine/pyrite/aventurine/tiger-eye/quartz/carnelian | abundance/money/success |
| Health (health-vitality) | crystals for health (1000) | ruby/bloodstone/red-jasper/carnelian/hematite/jade | health/strength/motivation |
| Personal (personal-empowerment) | crystals for confidence (590) | tiger-eye/carnelian/citrine/pyrite/labradorite/quartz | confidence/courage/motivation |
| Transformation (transformation) | crystals for new beginnings (590) | labradorite/moonstone/malachite/lepidolite/serpentine/aventurine | new-beginnings/transformation |
| Spiritual (spiritual-connection) | crystals for spiritual growth | amethyst/quartz/selenite/lapis/labradorite/kyanite | spiritual/meditation/intuition |

---

## 10. 方法论对齐

intention = Elementor 营销页（UI 首页/about，内容深度接近 condition 但更轻），三视角不展开，水晶卡用 stone-core-data 百科字段（有依据，非手写）。比 condition 轻、比首页深。

---

**状态**：V3（整体重写 UTF-8 修复 GBK；§5 标准图位清单完成；8 hero 按 content-v1 已生成 hero-v1/）。
**下一步**：上传 8 hero → 更新 config heroImage → 按 content-v1 定稿 8 config → 铺设。
