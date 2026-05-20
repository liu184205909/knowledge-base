# 竞品Sitemap解析报告

> **RLM步骤1B数据采集输出**：竞品sitemap.xml批量解析结果
> **生成时间**: 2026-05-18
> **数据来源**: 14家竞品sitemap.xml抓取（8家成功，6家失败）
> **工具**: MCP webReader + 手动解析
> **编号规则**: 按 [1A-竞品清单](../1A-竞品清单.md) 中的1A清单序号排列

---

## 一、抓取结果总览

> **编号规则**：#号对应1A竞品清单中的序号，成功获取sitemap的8家按1A序号排列。

| 1A# | 竞品 | 域名 | 建站平台 | Sitemap类型 | 总页面数(估) | 状态 |
|-----|------|------|---------|------------|------------|------|
| 1 | Tiny Rituals | tinyrituals.co | Shopify | Sitemap Index (5子sitemap) | ~1000 | 成功 |
| 2 | Energy Muse | energymuse.com | Shopify | Sitemap Index (6子sitemap) | ~350 | 成功 |
| 4 | Crystal Vaults | crystalvaults.com | WordPress/Yoast | Sitemap Index (30+子sitemap) | ~800 | 成功(替代路径) |
| 6 | My Crystals | mycrystals.com | Webflow | 单文件sitemap | ~250 | 成功 |
| 7 | Conscious Items | consciousitems.com | Shopify | 多语言Sitemap (EN 5子sitemap) | ~400 | 成功 |
| 8 | Moonrise Crystals | moonrisecrystals.com | WordPress/Yoast | Sitemap Index (19子sitemap) | ~500 | 成功 |
| 10 | Beadage | beadage.net | WordPress | Sitemap Index (6子sitemap) | ~250 | 成功 |
| 11 | Satin Crystals | satincrystals.com | Shopify | 多地区Sitemap (12地区x5子) | ~600 | 成功 |
| 3 | Healing Crystals | healingcrystals.com | 未知 | - | - | 失败(404) |
| 5 | The Crystal Council | thecrystalcouncil.com | PHP自建 | - | - | 失败(响应过大) |
| 9 | New Moon Beginnings | newmoonbeginnings.com | BigCommerce | - | - | 失败(响应过大) |
| 13 | Selfgazer | selfgazer.com | 未知 | - | - | 失败(响应过大) |
| - | Mindbodygreen | mindbodygreen.com | 未知 | - | - | 失败(404) |
| - | Mindvalley | mindvalley.com | 未知 | - | - | 失败(403) |

**关键发现**：
- 8/14家成功获取完整sitemap，覆盖了4种主流建站平台
- Shopify站（4家）sitemap结构最规范，均使用标准Sitemap Index
- WordPress站（3家）使用Yoast SEO插件生成sitemap，子sitemap分类最细
- Crystal Vaults通过替代路径（`/page-sitemap.xml`和`/sitemap_index.xml`）成功获取，拥有30+子sitemap、800+页面，是水晶百科内容最丰富的竞品
- Webflow站（1家）使用单文件sitemap，URL结构最RESTful
- 失败原因主要集中在：无sitemap文件(404)、响应体过大、访问被拒(403)

---

## 二、逐家Sitemap分析

> 详细解析存放在本目录下，文件名中的编号对应1A竞品清单序号。

| 1A# | 竞品 | 状态 | 建站平台 | 总页面(估) | 详细文件 |
|-----|------|------|---------|-----------|---------|
| 1 | Tiny Rituals | 成功 | Shopify | ~1000 | [01-Tiny-Rituals.md](./01-Tiny-Rituals.md) |
| 2 | Energy Muse | 成功 | Shopify | ~350 | [02-Energy-Muse.md](./02-Energy-Muse.md) |
| 4 | Crystal Vaults | 成功(替代路径) | WordPress/Yoast | ~800 | [04-Crystal-Vaults.md](./04-Crystal-Vaults.md) |
| 6 | My Crystals | 成功 | Webflow | ~250 | [06-My-Crystals.md](./06-My-Crystals.md) |
| 7 | Conscious Items | 成功 | Shopify | ~400 | [07-Conscious-Items.md](./07-Conscious-Items.md) |
| 8 | Moonrise Crystals | 成功 | WordPress/Yoast | ~500 | [08-Moonrise-Crystals.md](./08-Moonrise-Crystals.md) |
| 10 | Beadage | 成功 | WordPress | ~250 | [10-Beadage.md](./10-Beadage.md) |
| 11 | Satin Crystals | 成功 | Shopify | ~600 | [11-Satin-Crystals.md](./11-Satin-Crystals.md) |
| 3 | Healing Crystals | 失败(404) | 未知 | - | — |
| 5 | The Crystal Council | 失败(响应过大) | PHP自建 | - | — |
| 9 | New Moon Beginnings | 失败(响应过大) | BigCommerce | - | — |
| 13 | Selfgazer | 失败(响应过大) | 未知 | - | — |
| - | Mindbodygreen | 失败(404) | 未知 | - | — |
| - | Mindvalley | 失败(403) | 未知 | - | — |

---

## 三、按页面类型横向汇总

> **用途**：直接对接2B页面决策表，提供每个页面类型的竞品具体URL对比。
> **图例**：`-` 表示该竞品无此类型页面（或sitemap中未发现）；URL省略域名前缀。

### 3.1 品牌信任类页面

| 页面类型 | Energy Muse | Moonrise Crystals | Conscious Items | Satin Crystals | Beadage | My Crystals | Crystal Vaults |
|---------|------------|-------------------|----------------|---------------|---------|------------|--------------|
| **About Us** | `/pages/our-story` `/pages/about-us` | `/about/` `/my-journey/` | `/pages/new-about-us` `/pages/about-us-and-our-mission` | `/pages/about` | `/about/about-beadage/` | `/about` | `/about-crystal-vaults/` |
| **Contact** | `/pages/contacts` | `/contact/` | `/pages/contact-us` | `/pages/contact` | `/contact/` | `/contact` | `/contact-us/` |
| **FAQ / Help Center** | `/pages/faq` (总) + 8个子FAQ页 | - | `/pages/help-center` | `/pages/frequently-asked-questions` | - | - | - |
| **Ethical Sourcing** | `/pages/ethically-sourcing-crystals` | `/ethical-sourcing-journal/` `/ethical-lapidary/` `/ethical-mining/` `/ethical-crystals/` `/carbon-footprint-sustainability/` | - | - | - | - | - |
| **Testimonials / Reviews** | `/pages/press` | `/feel-loved-crystal-stories/` | `/pages/all-reviews` `/pages/conscious-reviews` | `/pages/testimonials` | - | - | - |
| **VIP / Affiliate** | - | - | `/pages/crystal-affiliate` `/pages/ambassador-program` | `/pages/vip` | - | - | - |
| **Mission** | - | - | `/pages/we-are-planting-hope` | - | - | - | - |

### 3.2 水晶知识体系页面

| 页面类型 | Energy Muse | Moonrise Crystals | Conscious Items | Satin Crystals | Beadage | My Crystals | Crystal Vaults |
|---------|------------|-------------------|----------------|---------------|---------|------------|--------------|
| **Crystal Guide Index / Crystal Meanings** | `/pages/meaning` (总索引) + ~60个单品含义页 | `/crystal-learning-center/` `/complete-guide-to-crystals/` | `/pages/about-crystals` `/pages/crystals-and-their-meanings` `/pages/crystals-meaning` | `/pages/crystal-meanings` `/pages/crystal-meanings-2` + ~40个单品含义页 | `/gemstones/` (总索引) + ~60个宝石页 | `/meaning/[crystal-name]` (~150个水晶) | `/crystal-encyclopedia/` (100+个百科页) |
| **Crystal Single (百科单品页)** | `/pages/amethyst-meaning` `/pages/rose-quartz-meaning` 等~60个 | (通过WooCommerce产品属性页实现) | - | `/pages/amethyst-meaning` `/pages/rose-quartz-meaning` 等~40个 | `/gemstones/amethyst/` `/gemstones/rose-quartz/` 等~60个 | `/meaning/amethyst` `/meaning/rose-quartz` 等~150个 | `/crystal-encyclopedia/amethyst` `/crystal-encyclopedia/rose-quartz` 等~100个 |
| **Crystal Shapes Guide** | `/pages/a-guide-to-crystal-shapes` | - | `/pages/crystals-and-their-shapes` | `/pages/crystal-pyramid-meaning` `/pages/tumbled-stones-meaning-and-healing-benefits` | - | `/crystal-shapes-guide` `/buy/[shape-type]` (~12个) | - |
| **Crystal Care Guide** | - | - | `/pages/how-to-clean-and-energize-crystals` | `/pages/crystal-care` `/pages/crystal-healing-information` `/pages/crystal-healing-tutorials` | - | - | - |
| **Crystal Beginners Guide** | `/pages/crystals-for-beginners` | `/learn-about-crystals/` `/choosing-crystals/` | `/pages/how-to-choose-the-right-crystal-for-you` `/pages/what-to-do-with-your-new-crystal` | `/pages/guide-to-choosing-crystals` | `/learn/` | - | - |

### 3.3 按意图/属性筛选页面

| 页面类型 | Energy Muse | Moonrise Crystals | Conscious Items | Satin Crystals | Beadage | My Crystals | Crystal Vaults |
|---------|------------|-------------------|----------------|---------------|---------|------------|--------------|
| **Shop by Intention / Condition** | `/pages/shop-by-intention` (总) `/pages/protection-crystals` `/pages/shop-by-wealth-success` 等8个子页 | `/crystals-emotional-healing/` `/crystals-world-healing/` `/crystals-spiritual-healing/` `/crystals-physical-healing/` | `/pages/intentions` `/pages/by-intention` | `/pages/shop-by-intention` `/pages/abundance-crystals` `/pages/calming-crystals` 等8个子页 | `/gemstones/uses/abundance/` `/gemstones/uses/anxiety/` `/gemstones/uses/protection/` 等30+个 | `/use/best-crystals-for-[condition]` (~50个) | `/crystal-reference-guide/crystals-for-anxiety` 等~150+个功效页 |
| **Shop by Color** | - | `/crystals-by-color/` | `/pages/black-gemstones` ~ `/pages/clear-colorless-gemstones` (12个) | `/pages/shop-by-color` | `/gemstones/colors/black/` `/gemstones/colors/blue/` 等12个 | `/color/[color-name]` (~35个) | `/shop-crystals-by-color/` `/crystal-colors-explained/` `/red-explained` ~ `/brown-explained` (12+个) |
| **Shop by Chakra** | `/pages/root-chakra` `/pages/sacral-chakra` `/pages/solar-plexus-chakra` `/pages/healing-the-4th-heart-chakra` | `/crystals-by-chakra/` | `/pages/chakra-practice-guide` | `/pages/chakra-guide` `/pages/chakra-balancing` `/pages/chakra-tutorial` `/pages/healing-the-1st-root-chakra` ~ `/pages/healing-the-7th-crown-chakra` (7个) | `/chakra-stones/` | `/chakra-crystals` | `/root-chakra-explained` ~ `/crown-chakra-explained` (7个) + `/crystals-for-the-[chakra]-chakra` (7个) |
| **Shop by Zodiac** | `/pages/crystals-for-astrology` | `/crystals-by-zodiac/` | `/pages/zodiac-collections` `/pages/zodiac-birthstones` | `/pages/astrology-crystals-directory` | - | `/zodiacs/[sign]` (12个) | `/aquarius-crystals` ~ `/capricorn-crystals` (12个) |
| **Shop by Stone / Crystal** | (通过Collections实现) | (通过WooCommerce `pa_crystal-type` 属性归档页实现) | `/pages/by-crystal` `/pages/stone-collections` | (通过Collections实现) | (通过 `/gemstones/` 目录实现) | (通过 `/meaning/` 目录实现) | (通过 `/crystal-encyclopedia/` 百科目录实现) |
| **Crystal Horoscope** | `/pages/crystal-horoscope` `/pages/your-weekly-crystal-reading` | - | `/pages/crystal-horoscope` `/pages/weekly-horoscope` | `/pages/archive-of-monthly-crystal-horoscope-reports` | - | - | - |

### 3.4 互动工具与内容页面

| 页面类型 | Energy Muse | Moonrise Crystals | Conscious Items | Satin Crystals | Beadage | My Crystals | Crystal Vaults |
|---------|------------|-------------------|----------------|---------------|---------|------------|--------------|
| **Crystal Quiz / Crystal Test** | `/pages/crystal-test` `/pages/crystal-identifier` `/pages/what-crystals-do-you-need-quiz` | - | `/pages/quiz-best-crystal` `/pages/quiz-best-crystal-for-me` `/pages/protection-quiz` `/pages/quiz-gift` | - | - | `/crystal-quiz` `/crystal-identification` | - |
| **Blog** | `/pages/blog-all` | (通过 `post` sitemap，数百篇) | `/pages/birthstones-by-month` `/pages/smudging-for-beginners` 等(混合在Pages中) | (通过blogs sitemap) | (通过 `post` sitemap) | - | (通过 `post-sitemap`) |
| **Shipping / Returns** | (在FAQ子页中: `/pages/faq-shipping-delivery` `/pages/faq-returns-exchanges`) | `/shipping-delivery/` | `/pages/shipping-methods` `/pages/refund-policy` | `/pages/shipping-policy` `/pages/return-policy` | - | - | - |
| **Birthstones** | - | - | `/pages/zodiac-birthstones` `/pages/birthstones-by-month` | `/pages/birthstones` | `/birthstones/` | `/birthstone-guide` `/crystals-by-month` | - |
| **Gemstone by Origin** | - | - | `/pages/mexican-gemstones` `/pages/brazilian-gemstones` `/pages/indian-gemstones` `/pages/sri-lanka-gemstones` `/pages/australian-gemstones` | - | - | - | - |
| **Jewelry Size Guide** | - | - | - | `/pages/jewelry-size-guide` `/pages/necklace-guide` `/pages/ring-guide` `/pages/earrings-guide` `/pages/anklet-guide` `/pages/cufflinks-guide` | - | - | - |
| **Printable Cards** | - | - | - | - | `/printable-meanings/` + 60个宝石卡片 | - | - |
| **Glossary** | - | - | - | - | `/glossary/` + 100+术语页 | - | - |
| **Ebook / Digital Product** | - | - | - | - | - | `/ebook-guide` | - |
| **Subscription Box** | - | - | - | - | - | `/box` `/crystal-subscription-box` | - |
| **Crystal Oracle / 占卜** | - | - | - | - | - | - | `/crystal-oracle/` |
| **I-Ching** | - | - | - | - | - | - | `/crystal-i-ching/` |
| **Magical Herbs** | - | - | - | - | - | - | `/magical-herbs/` + 30+子页 |
| **Goddess Crystals** | - | - | - | - | - | - | `/goddess-crystals/` + 40+子页 |
| **Crystal Moon Astrology** | - | - | - | - | - | - | `/crystal-moon-astrology/` + 27月宿页 |
| **Medicine Wheel** | - | - | - | - | - | - | `/medicine-wheel/` |
| **Spirit Guides** | - | - | - | - | - | - | `/spirit-guides/` |
| **Crystal Courses** | - | - | - | - | - | - | `/crystal-courses/` |

---

## 四、未获取sitemap的竞品处理建议

| 竞品 | 失败原因 | 建议处理方式 | 数据替代方案 |
|------|---------|------------|------------|
| **Tiny Rituals** (tinyrituals.co) | ~~超时/SSL错误~~ → **已解决** | Shopify站，sitemap 实际完全可访问；首次 MCP webReader 超时为工具问题，手动浏览器验证+blog sitemap抓取成功 | 数据已完整整合，见 [01-Tiny-Rituals.md](./01-Tiny-Rituals.md) |
| **Crystal Vaults** (crystalvaults.com) | ~~404 Not Found~~ → **已解决** | 通过替代路径 `/page-sitemap.xml` + `/sitemap_index.xml` 成功获取，见[04-Crystal-Vaults.md](./04-Crystal-Vaults.md) | 数据已完整整合到本报告 |
| **The Crystal Council** (thecrystalcouncil.com) | 响应过大(761K tokens) | 尝试分批读取sitemap或将sitemap下载到本地后分段解析 | 可通过网站导航手动整理 |
| **New Moon Beginnings** (newmoonbeginnings.com) | 响应过大(118K tokens) | BigCommerce站，尝试下载sitemap到本地后用脚本解析 | 可通过 `/sitemap.xml` 本地下载处理 |
| **Healing Crystals** (healingcrystals.com) | 404 Not Found | 尝试其他sitemap路径如 `/sitemap_index.xml`、`/sitemap/` | 网站导航手动整理 |
| **Mindbodygreen** (mindbodygreen.com) | 404 Not Found | 大型媒体站，非直接竞品，可能使用非标准sitemap路径 | 非核心竞品，可跳过 |
| **Selfgazer** (selfgazer.com) | 响应过大(27K tokens) | 下载sitemap到本地后解析 | 网站规模不大，可手动整理 |
| **Mindvalley** (mindvalley.com) | 403 Forbidden | 明确禁止访问，尊重robots.txt | 非核心竞品，可跳过 |

### 优先级建议

1. **已完成**：~~Tiny Rituals~~ — 手动浏览器验证+blog sitemap抓取成功（见 [01-Tiny-Rituals.md](./01-Tiny-Rituals.md)）
2. **中优先级**：The Crystal Council、New Moon Beginnings — sitemap存在但需本地处理
3. **低优先级**：Selfgazer、Healing Crystals — 非核心竞品或规模较小
4. **可跳过**：Mindbodygreen、Mindvalley — 非直接竞品
5. **已完成**：~~Crystal Vaults~~ — 通过替代路径成功获取（见 [04-Crystal-Vaults.md](./04-Crystal-Vaults.md)）

---

## 五、关键洞察与结论

### 5.1 页面类型覆盖率

| 页面类型 | 8家竞品中有此类型的竞品数 | 覆盖率 | 说明 |
|---------|----------------------|--------|------|
| About Us | 8/8 | 100% | 所有竞品必备 |
| Contact | 8/8 | 100% | 所有竞品必备 |
| Crystal Meanings Index | 8/8 | 100% | 核心内容页，所有竞品都有 |
| Crystal Single (单品百科) | 7/8 | 88% | 除Conscious Items外都有独立百科页 |
| Shop by Intention / Condition | 8/8 | 100% | 核心筛选维度（Crystal Vaults有150+页） |
| Shop by Color | 7/8 | 88% | 仅Energy Muse无独立颜色页 |
| Shop by Chakra | 8/8 | 100% | 全部覆盖 |
| Shop by Zodiac | 7/8 | 88% | 除Beadage外都有独立星座页 |
| Crystal Quiz | 3/8 | 38% | Energy Muse/Conscious Items/My Crystals |
| Ethical Sourcing | 2/8 | 25% | 仅Energy Muse和Moonrise有专门页面 |
| FAQ / Help Center | 3/8 | 38% | Energy Muse/Conscious Items/Satin Crystals |
| Crystal Shapes Guide | 4/8 | 50% | 较常见的指南内容 |
| Blog | 7/8 | 88% | 除My Crystals外均有博客 |
| Birthstones | 4/8 | 50% | 跨竞品常见 |
| Crystal Oracle / 占卜 | 1/8 | 13% | 仅Crystal Vaults |
| Magical Herbs / Goddess | 1/8 | 13% | 仅Crystal Vaults |

### 5.2 URL结构模式对比

| 竞品 | 页面URL模式 | 产品URL模式 | 评价 |
|------|-----------|-----------|------|
| Energy Muse | `/pages/[slug]` | `/products/[slug]` | Shopify标准，SEO友好 |
| Moonrise Crystals | `/[slug]/` (扁平) | `/product/[slug]/` | WordPress扁平结构，根级页面权重高 |
| Conscious Items | `/pages/[slug]` | `/products/[slug]` | Shopify标准，页面数量最多(110+) |
| Satin Crystals | `/pages/[slug]` | `/products/[slug]` | Shopify标准，多地区支持 |
| Beadage | `/gemstones/[slug]/` `/gemstones/uses/[slug]/` | `/shop/[slug]` | 内容站结构，分类路径清晰 |
| My Crystals | `/meaning/[crystal]` `/use/[condition]` `/color/[color]` | `/shop/[slug]` | RESTful风格，URL语义最强 |
| Crystal Vaults | `/crystal-encyclopedia/[name]` `/crystal-reference-guide/crystals-for-[x]` `/[sign]-crystals` | `/product/[slug]` | 百科型结构，内容深度最高 |

### 5.3 独特页面（差异化内容）

| 竞品 | 独特页面 | 差异化价值 |
|------|---------|-----------|
| **Energy Muse** | Crystal Test/Identifier/Quiz x3、Press页 | 互动工具矩阵最完善 |
| **Moonrise Crystals** | Ethical Sourcing五件套、产品属性归档页(10种) | 伦理采购是核心差异化定位 |
| **Conscious Items** | Gemstone by Origin(5国)、Gemstone by Color(12色)、Quiz x4 | 页面矩阵最全，覆盖维度最广 |
| **Satin Crystals** | Jewelry Size Guide x6、Chakra Tutorial x7、VIP页 | 教程体系最完善，多地区覆盖 |
| **Beadage** | Printable Cards x60、Glossary x100+ | 工具型内容站，可打印资源独特 |
| **My Crystals** | Crystal Subscription Box、Ebook Guide | 订阅制模式，数字化产品 |
| **Crystal Vaults** | Crystal Oracle、I-Ching、Medicine Wheel、Magical Herbs(30+)、Goddess Crystals(40+)、Crystal Moon Astrology(27月宿)、Spirit Guides、Crystal Courses | 内容深度最高，百科+灵性工具矩阵最独特，150+"Crystals for X"功效页覆盖最广 |
