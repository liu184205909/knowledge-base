# The Crystal Council Sitemap解析

> **竞品**: The Crystal Council (thecrystalcouncil.com)
> **1A清单序号**: #4（直接竞品 · PHP自建 · 15,738页）
> **建站平台**: PHP自建
> **Sitemap URL**: https://thecrystalcouncil.com/sitemap.xml
> **解析状态**: 成功（2026-05-20 sitemap-mcp-server 精确解析）
> **解析时间**: 2026-05-20

---

## Sitemap结构

单文件 sitemap.xml，通过 robots.txt 发现：

```
robots.txt
  └── sitemap.xml (15,738 URLs)
```

| 子sitemap | URL | 类型 | 页面数 |
|-----------|-----|------|--------|
| `robots.txt` | https://thecrystalcouncil.com/robots.txt | IndexRobotsTxtSitemap | 0 |
| `sitemap.xml` | https://thecrystalcouncil.com/sitemap.xml | PagesXMLSitemap | **15,738** |

> **注意**：所有 15,738 个 URL 全部在同一个 sitemap.xml 文件中，没有分片。这是 PHP 自建站的典型特征——不像 Shopify/WordPress 那样自动拆分子 sitemap。

### Priority 统计

| 指标 | 值 |
|------|-----|
| 最低 priority | 0.5 |
| 最高 priority | 1.0 |
| 平均 priority | 0.6049 |
| lastmod 覆盖率 | 15,738/15,738 (100%) |

## 页面分类统计（URL路径分析）

> 由于所有 URL 在单一 sitemap 中，以下分类基于 URL 路径前缀手动统计。

| 页面类型 | 路径前缀 | 估算数量 | 说明 |
|---------|---------|---------|------|
| **水晶百科页** | `/crystals/` | ~500+ | 全球最全水晶百科之一 |
| **博客文章** | `/blog/` | ~100+ | 水晶知识+正能量故事 |
| **产品页** | `/shop/` | ~12,000+ | 每个单品独立URL |
| **产品分类页** | `/shop/categories/` | ~100+ | 产品类别导航 |
| **标签页-功效** | `/tags/properties/` | ~120+ | 每个功效2个URL（信息页+产品页） |
| **标签页-星座** | `/tags/zodiacs/` | ~24 | 12星座×2（信息页+产品页） |
| **标签页-脉轮** | `/tags/chakras/` | ~20 | 10脉轮×2 |
| **标签页-颜色** | `/tags/colors/` | ~60+ | 各颜色×2 |
| **标签页-元素** | `/tags/elements/` | ~10+ | 4元素×2 |
| **标签页-行星** | `/tags/planets/` | ~20+ | 行星×2 |
| **标签页-数字** | `/tags/sacred_numbers/` | ~18 | 1-9×2 |
| **促销/活动页** | 根目录独立页 | ~25+ | 黑五、情人节等 |
| **功能页面** | 根目录独立页 | ~18 | about, contact, help, app等 |
| **合计** | — | **15,738** | — |

## 核心页面 URL 清单

### 1. 功能/导航页面（17页）

| URL | 说明 |
|-----|------|
| `/` | 首页 |
| `/shop` | 商城首页 |
| `/shop/all` | 全部产品 |
| `/crystals` | 水晶百科首页 |
| `/blog` | 博客首页 |
| `/crystal-identifier` | 水晶识别工具 |
| `/subscription-box` | 订阅盒子 |
| `/premium` | 高级会员 |
| `/gift-box` | 礼盒 |
| `/gift-card` | 礼品卡 |
| `/about` | 关于我们 |
| `/authenticity` | 真伪认证 |
| `/reviews` | 用户评价 |
| `/contact` | 联系我们 |
| `/live-sales` | 直播销售 |
| `/help` | 帮助中心 |
| `/charity` | 慈善页面 |

### 2. 水晶百科页（500+ 页）

> 全球最完整的水晶/矿物百科之一，按字母A-Z排列

**URL格式**: `/crystals/{crystal-name-slug}`

#### A-B 样本（35个）

| 水晶 | URL |
|------|-----|
| Actinolite | `/crystals/actinolite` |
| Adamite | `/crystals/adamite` |
| Aegirine | `/crystals/aegirine` |
| Afghanite | `/crystals/afghanite` |
| Agni Manitite | `/crystals/agni-manitite-pearl-of-the-divine-fire` |
| Alexandrite | `/crystals/alexandrite` |
| Allophane | `/crystals/allophane` |
| Amazonite | `/crystals/amazonite` |
| Amber | `/crystals/Amber` |
| Amethyst | `/crystals/amethyst` |
| Ametrine | `/crystals/ametrine` |
| Ammonite | `/crystals/ammonite` |
| Angel Aura Quartz | `/crystals/angel-aura-quartz` |
| Angelite | `/crystals/angelite` |
| Apatite | `/crystals/apatite` |
| Apophyllite | `/crystals/apophyllite` |
| Aquamarine | `/crystals/aquamarine` |
| Aragonite | `/crystals/aragonite` |
| Astrophyllite | `/crystals/astrophyllite` |
| Black Tourmaline | `/crystals/black-tourmaline` |
| Bloodstone | `/crystals/bloodstone` |
| Blue Lace Agate | `/crystals/blue-lace-agate` |
| Botswana Agate | `/crystals/botswana-agate` |
| Bumblebee Jasper | `/crystals/bumblebee-jasper` |

#### C-F 样本

| 水晶 | URL |
|------|-----|
| Carnelian | `/crystals/carnelian` |
| Celestite | `/crystals/celestite` |
| Chrysocolla | `/crystals/chrysocolla` |
| Citrine | `/crystals/citrine` |
| Crazy Lace Agate | `/crystals/crazy-lace-agate` |
| Desert Rose Selenite | `/crystals/desert-rose-selenite` |
| Emerald | `/crystals/emerald` |
| Fluorite | `/crystals/fluorite` |
| Flower Agate | `/crystals/flower-agate` |
| Fuchsite | `/crystals/fuchsite` |

#### G-L 样本

| 水晶 | URL |
|------|-----|
| Garnet | `/crystals/garnet` |
| Golden Healer Quartz | `/crystals/golden-healer-quartz` |
| Himalayan Quartz | `/crystals/himalayan-quartz` |
| Howlite | `/crystals/howlite` |
| Jade | `/crystals/jade` |
| K2 | `/crystals/k2` |
| Kambaba Jasper | `/crystals/kambaba-jasper` |
| Kunzite | `/crystals/kunzite` |
| Labradorite | `/crystals/labradorite` |
| Lapis Lazuli | `/crystals/lapis-lazuli` |
| Larimar | `/crystals/larimar` |
| Lepidolite | `/crystals/lepidolite` |

#### M-Z 样本（尾端）

| 水晶 | URL |
|------|-----|
| Malachite | `/crystals/malachite` |
| Moonstone | `/crystals/black-moonstone` |
| Obsidian | `/crystals/mahogany-obsidian` |
| Opal | `/crystals/black-opal` |
| Quartz (多种) | `/crystals/elestial-quartz`, `/crystals/faden-quartz` 等 |
| Rose Quartz | `/crystals/rose-quartz` (估计) |
| Selenite | `/crystals/desert-rose-selenite` |
| Tiger Eye | `/crystals/blue-tiger-eye`, `/crystals/green-tiger-eye` 等 |
| Tourmaline | `/crystals/black-tourmaline`, `/crystals/green-tourmaline`, `/crystals/watermelon-tourmaline` |
| Turquoise | `/crystals/turquoise` (估计) |
| Unakite | `/crystals/unakite` (估计) |
| Variscite | `/crystals/variscite` |
| Zoisite | `/crystals/zoisite` |

### 3. 博客文章（~100篇）

**URL格式**: `/blog/{article-slug}`

#### 水晶知识文章

| 主题 | URL |
|------|-----|
| 水晶清洁 | `/blog/how-to-cleanse-and-care-for-your-crystals` |
| 水晶清洁2 | `/blog/how-to-cleanse-crystals` |
| 水晶发音 | `/blog/how-to-pronounce-crystal-names` |
| 水晶组合 | `/blog/potent-crystal-combinations-for-better-energy` |
| 水晶储存 | `/blog/different-ways-to-store-your-raw-crystals` |
| 水晶旅行 | `/blog/best-crystals-for-safety-and-protection-while-traveling` |
| 水晶睡眠 | `/blog/best-crystal-for-sleep` |
| 水晶新家 | `/blog/crystals-for-a-new-home` |
| 水晶桌面 | `/blog/best-crystals-to-have-on-your-desk-when-working-from-home` |
| 水晶专注 | `/blog/crystals-for-concentration`, `/blog/crystals-for-focus-and-concentration` |
| 水晶同情 | `/blog/crystals-for-compassion` |
| 水晶写作 | `/blog/crystals-for-writer-s-block` |
| 水晶植物 | `/blog/5-stones-for-plant-health` |
| 水晶厨房 | `/blog/kitchen-crystals` |
| 水晶自爱 | `/blog/self-love-crystals` |
| 水晶保护 | `/blog/self-protection-boundaries-crystals` |
| 水晶形状 | `/blog/crystal-shape-glossary` |
| 水晶前世 | `/blog/past-life-crystals` |
| 水晶入门 | `/blog/so-you-re-the-proud-owner-of-a-crystal-now-what` |
| 水晶能量 | `/blog/get-energized-with-crystals` |
| 原石好处 | `/blog/what-are-the-benefits-of-working-with-raw-healing-crystals` |
| 送人选择 | `/blog/tips-for-choosing-a-crystal-for-someone-else` |
| 冥想网格 | `/blog/the-beginners-guide-to-meditation-grids` |
| 完整指南 | `/blog/the-complete-guide-to-crystals-part-1` |
| Labradorite冥想 | `/blog/meditating-with-labradorite-a-how-to-guide` |
| Selenite用途 | `/blog/everyday-selenite-uses` |

#### 月相/占星文章

| 主题 | URL |
|------|-----|
| 月相周期 | `/blog/9-phases-of-the-lunar-cycle` |
| 超级月亮 | `/blog/a-super-moon-on-the-spring-equinox-what-crystals-should-you-carry` |
| 满月水晶 | `/blog/full-moons-crystals` |
| 满月术语 | `/blog/full-moon-glossary` |
| 2022满月 | `/blog/full-moons-of-2022` |
| 新月仪式 | `/blog/new-moon-rituals` |
| 2022新月 | `/blog/new-moons-of-2022` |
| 秋分 | `/blog/reaping-what-we-sow-the-autumnal-equinox` |
| 占星基础 | `/blog/astrology-basics-the-planets` |
| 水逆水晶 | `/blog/mercury-retrograde-crystals-and-healing-stones` |

#### 脉轮文章

| 主题 | URL |
|------|-----|
| 根脉轮 | `/blog/root-chakra-healing-stones`, `/blog/root-chakra-meditation-guide` |
| 骶脉轮 | `/blog/sacral-chakra-healing-stones` |
| 太阳神经丛 | `/blog/solar-plexus-healing-stones` |
| 心轮石 | `/blog/pink-heart-chakra-stones` |

#### 灵性/教程文章

| 主题 | URL |
|------|-----|
| 直觉激活 | `/blog/activating-your-intuition` |
| 超感官 | `/blog/clairvoyance-clairaudience-all-the-clair-s` |
| 蜡烛颜色 | `/blog/candle-color-meanings-what-each-candle-can-do-for-you` |
| 塔罗入门 | `/blog/tarot-cards-for-beginners`, `/blog/tarot-explained` |
| 塔罗牌解读 | `/blog/tarot-explained-death`, `/blog/tarot-explained-justice`, `/blog/tarot-explained-temperance`, `/blog/tarot-explained-the-chariot`, `/blog/tarot-explained-the-hermit`, `/blog/tarot-explained-the-lovers`, `/blog/the-fool`, `/blog/the-magician`, `/blog/the-high-priestess`, `/blog/the-emperor`, `/blog/the-empress` |
| 神圣草药 | `/blog/magical-herbs` |
| Palo Santo | `/blog/palo-santo-holy-wood-is-it-endangered` |
| 烟熏清洁 | `/blog/smoke-cleansing`, `/blog/smoking-rituals` |
| 睡眠方案 | `/blog/restful-sleep-solutions` |
| 新年意图 | `/blog/new-year-new-intentions-new-me` |
| 正念日常 | `/blog/7-ways-to-incorporate-mindfulness-into-your-daily-routine` |
| 风水财位 | `/blog/the-wealth-corner` |
| 精油历史 | `/blog/the-history-of-essential-oils` |
| 睡眠方案 | `/blog/restful-sleep-solutions` |
| 好运秘诀 | `/blog/11-tips-to-bring-good-luck-into-your-home` |

#### 正能量故事（品牌特色内容）

| 主题 | URL |
|------|-----|
| 10岁善举 | `/blog/10-year-old-on-a-mission-to-spread-kindness-to-the-world` |
| 13岁愿望 | `/blog/13-year-old-has-a-wish-to-feed-the-homeless` |
| 童子军救人 | `/blog/boy-scouts-save-woman-from-drowning` |
| 社区善行 | `/blog/construction-class-builds-bus-shelter-to-protect-student-in-wheelchair` |
| 囚犯书籍 | `/blog/couple-sends-books-to-inmates` |
| 教授捐肾 | `/blog/professor-spends-2-years-secretly-improving-his-health-to-donate-kidney-to-colleague` |
| 互助捐肾 | `/blog/two-coworkers-donate-kidney-to-each-other-s-husband` |
| DJ筹款 | `/blog/dj-raises-money-to-help-fix-man-s-truck` |
| 房产改造 | `/blog/realtor-turns-abandoned-property-into-homes-for-the-homeless` |
| 9岁友善 | `/blog/nine-year-old-befriends-bus-driver` |
| 退休教师 | `/blog/retired-teacher-comes-up-with-a-tiktok-school-challenge` |
| 助人系列 | `/blog/georgia-man-changing-lives-1-at-a-time`, `/blog/south-carolina-mechanic-fixes-and-gives-cars-to-those-in-need` 等 |

#### 商业/产品推广文章

| 主题 | URL |
|------|-----|
| 订阅盒子介绍 | `/blog/introducing-the-seeker-box-a-beginners-crystal-subscription-box` |
| 订阅理由 | `/blog/reasons-to-sign-up-for-a-crystal-subscription-box` |
| 免费项链 | `/blog/free-quartz-moon-necklace-with-any-new-subscription` |
| 万圣节抽奖 | `/blog/halloween-500-shopping-spree-raffle` |
| 水晶珠宝定制 | `/blog/now-taking-crystal-jewelry-requests` |
| 正能量新闻序 | `/blog/introduction-positive-news-with-the-crystal-council` |

### 4. 标签页（多维度交叉索引）

> The Crystal Council 最核心的SEO策略：每个标签都有**信息页**和**产品页**两个URL

#### 4.1 功效标签 `/tags/properties/`

**URL格式**:
- 信息页: `/tags/properties/{property-name}`
- 产品页: `/tags/properties/{property-name}/products`

**已确认的功效标签**（部分列表）:

| 功效 | 信息页URL | 产品页URL |
|------|----------|----------|
| PTSD | `/tags/properties/ptsd` | `/tags/properties/ptsd/products` |
| 净化 | `/tags/properties/purification` | `/tags/properties/purification/products` |
| 放松 | `/tags/properties/relaxation` | `/tags/properties/relaxation/products` |
| 决心 | `/tags/properties/resolution` | `/tags/properties/resolution/products` |
| 逆行 | `/tags/properties/retrograde` | `/tags/properties/retrograde/products` |
| 自律 | `/tags/properties/self-discipline` | `/tags/properties/self-discipline/products` |
| 自我发现 | `/tags/properties/self-discovery` | `/tags/properties/self-discovery/products` |
| 自我疗愈 | `/tags/properties/self-healing` | `/tags/properties/self-healing/products` |
| 自爱 | `/tags/properties/self-love` | `/tags/properties/self-love/products` |
| 无私 | `/tags/properties/selflessness` | `/tags/properties/selflessness/products` |
| 目标感 | `/tags/properties/sense-of-purpose` | `/tags/properties/sense-of-purpose/products` |
| 性 | `/tags/properties/sexuality` | `/tags/properties/sexuality/products` |
| 睡眠 | `/tags/properties/sleep` | `/tags/properties/sleep/products` |
| 舒缓 | `/tags/properties/soothing` | `/tags/properties/soothing/products` |
| 觉醒 | `/tags/properties/spiritual-awakening` | `/tags/properties/spiritual-awakening/products` |
| 力量 | `/tags/properties/strength` | `/tags/properties/strength/products` |
| 减压 | `/tags/properties/stress-relief` | `/tags/properties/stress-relief/products` |
| 共时性 | `/tags/properties/synchronicity` | `/tags/properties/synchronicity/products` |
| 转化 | `/tags/properties/transformation` | `/tags/properties/transformation/products` |
| 负能量转化 | `/tags/properties/transmutation-of-negative-energies` | `/tags/properties/transmutation-of-negative-energies/products` |
| 创伤 | `/tags/properties/trauma` | `/tags/properties/trauma/products` |
| 旅行 | `/tags/properties/travel` | `/tags/properties/travel/products` |
| 信任 | `/tags/properties/trust` | `/tags/properties/trust/products` |
| 真相 | `/tags/properties/truth` | `/tags/properties/truth/products` |
| 心愿统一 | `/tags/properties/unity-of-heart-and-will` | `/tags/properties/unity-of-heart-and-will/products` |
| 体重控制 | `/tags/properties/weight-control` | `/tags/properties/weight-control/products` |
| 智慧 | `/tags/properties/wisdom` | `/tags/properties/wisdom/products` |

> 估算约 60+ 个功效标签 × 2（信息+产品）= ~120+ URLs

#### 4.2 星座标签 `/tags/zodiacs/`

| 星座 | 信息页URL | 产品页URL |
|------|----------|----------|
| Aquarius | `/tags/zodiacs/aquarius` | `/tags/zodiacs/aquarius/products` |
| Aries | `/tags/zodiacs/aries` | `/tags/zodiacs/aries/products` |
| Cancer | `/tags/zodiacs/cancer` | `/tags/zodiacs/cancer/products` |
| Capricorn | `/tags/zodiacs/capricorn` | `/tags/zodiacs/capricorn/products` |
| Gemini | `/tags/zodiacs/gemini` | `/tags/zodiacs/gemini/products` |
| Leo | `/tags/zodiacs/leo` | `/tags/zodiacs/leo/products` |
| Libra | `/tags/zodiacs/libra` | `/tags/zodiacs/libra/products` |
| Pisces | `/tags/zodiacs/pisces` | `/tags/zodiacs/pisces/products` |
| Sagittarius | `/tags/zodiacs/sagittarius` | `/tags/zodiacs/sagittarius/products` |
| Scorpio | `/tags/zodiacs/scorpio` | `/tags/zodiacs/scorpio/products` |
| Taurus | `/tags/zodiacs/taurus` | `/tags/zodiacs/taurus/products` |
| Virgo | `/tags/zodiacs/virgo` | `/tags/zodiacs/virgo/products` |

> 12星座 × 2 = 24 URLs

#### 4.3 脉轮标签 `/tags/chakras/`

| 脉轮 | 信息页URL | 产品页URL |
|------|----------|----------|
| Crown | `/tags/chakras/crown` | `/tags/chakras/crown/products` |
| Earth Star | `/tags/chakras/earthstar` | `/tags/chakras/earthstar/products` |
| Etheric | `/tags/chakras/etheric` | `/tags/chakras/etheric/products` |
| Heart | `/tags/chakras/heart` | `/tags/chakras/heart/products` |
| Root | `/tags/chakras/root` | `/tags/chakras/root/products` |
| Sacral | `/tags/chakras/sacral` | `/tags/chakras/sacral/products` |
| Solar Plexus | `/tags/chakras/solar-plexus` | `/tags/chakras/solar-plexus/products` |
| Third Eye | `/tags/chakras/third-eye` | `/tags/chakras/third-eye/products` |
| Throat | `/tags/chakras/throat` | `/tags/chakras/throat/products` |

> 9脉轮 × 2 = 18 URLs（注意：比标准7脉轮多了 Earth Star 和 Etheric 两个高阶脉轮）

#### 4.4 颜色标签 `/tags/colors/`

**已确认的颜色标签**:

| 颜色 | 信息页URL | 产品页URL |
|------|----------|----------|
| Amber | `/tags/colors/amber` | `/tags/colors/amber/products` |
| Black | `/tags/colors/black` | `/tags/colors/black/products` |
| Blood Red | `/tags/colors/blood-red` | `/tags/colors/blood-red/products` |
| Blue | `/tags/colors/blue` | `/tags/colors/blue/products` |
| Brass Yellow | `/tags/colors/brass-yellow` | `/tags/colors/brass-yellow/products` |
| Brown | `/tags/colors/brown` | `/tags/colors/brown/products` |

> 估算约 20-30 个颜色标签 × 2 = ~40-60 URLs

#### 4.5 元素标签 `/tags/elements/`

> 4大元素（Earth, Air, Fire, Water）× 2 = ~8 URLs

#### 4.6 行星标签 `/tags/planets/`

> 各行星 × 2 = ~10-20 URLs

#### 4.7 神圣数字标签 `/tags/sacred_numbers/`

| 数字 | 信息页URL | 产品页URL |
|------|----------|----------|
| 1 | `/tags/sacred_numbers/1` | `/tags/sacred_numbers/1/products` |
| 2 | `/tags/sacred_numbers/2` | `/tags/sacred_numbers/2/products` |
| 3 | `/tags/sacred_numbers/3` | `/tags/sacred_numbers/3/products` |
| 4 | `/tags/sacred_numbers/4` | `/tags/sacred_numbers/4/products` |
| 5 | `/tags/sacred_numbers/5` | `/tags/sacred_numbers/5/products` |
| 6 | `/tags/sacred_numbers/6` | `/tags/sacred_numbers/6/products` |
| 7 | `/tags/sacred_numbers/7` | `/tags/sacred_numbers/7/products` |
| 8 | `/tags/sacred_numbers/8` | `/tags/sacred_numbers/8/products` |
| 9 | `/tags/sacred_numbers/9` | `/tags/sacred_numbers/9/products` |

> 9个数字 × 2 = 18 URLs

#### 标签总索引页

| 标签类型 | 索引URL |
|---------|---------|
| 星座总览 | `/tags/zodiacs` |
| 脉轮总览 | `/tags/chakras` |
| 功效总览 | `/tags/properties` |
| 行星总览 | `/tags/planets` |
| 元素总览 | `/tags/elements` |

### 5. 产品页（~12,000+）

**URL格式**: `/shop/{product-name-slug}`

> 每个**独立单品**都有唯一URL，同一水晶的不同形态（raw, tumbled, sphere, tower, bracelet, necklace, pendant, wire-wrap, skull, egg, palm stone等）各自独立。

#### 产品命名模式

| 模式 | 示例 | 数量级 |
|------|------|--------|
| **水晶+编号** | `/shop/apophyllite-1`, `...-2`, `...-3` ... `...-18` | 单品可达 20+ 个变体 |
| **水晶+形态** | `/shop/angelite-palm-stone`, `...-sphere`, `...-skull`, `...-pendant` | 每种水晶 8-15 种形态 |
| **水晶+饰品** | `/shop/amethyst-bracelet`, `...-necklace`, `...-ring`, `...-earrings` | 饰品类占大量 |
| **水晶+雕刻** | `/shop/orange-calcite-butterfly-1`, `...-alien-head`, `...-goku`, `...-pumpkin` | 卡通/节日雕刻 |
| **raw单品** | `/shop/large-raw-polychrome-jasper-1` | 大量raw标本 |
| **套装/盒子** | `/shop/apprentice-box`, `/shop/anxiety-bracelet` | 订阅和套装 |
| **配件** | `/shop/you-look-like-you-need-a-crystal-coozie`, `/shop/yoga-mat` | 非水晶配件 |

#### 产品分类页 `/shop/categories/`

**已确认分类**:

| 分类 | URL |
|------|-----|
| 配件 | `/shop/categories/accessories` |
| 加购品 | `/shop/categories/addon-item`, `/shop/categories/addon-items` |
| 动物雕刻 | `/shop/categories/animals` |
| 动漫雕刻 | `/shop/categories/anime-carvings` |

### 6. 促销/活动/独立页面（~25页）

| URL | 说明 |
|-----|------|
| `/2025-holiday-crystal-gift-guide` | 2025假日礼物指南 |
| `/black-friday-crystal-sale` | 黑五水晶特卖 |
| `/black-friday-cyber-monday` | 黑五网一 |
| `/valentines-day` | 情人节 |
| `/butterfly-wings` | 蝴蝶翅膀活动 |
| `/empty-magic-crystals` | Magic Crystals活动 |
| `/enchant-popup` | Enchant弹窗 |
| `/coupons` | 优惠券 |
| `/faqs` | FAQ |
| `/app` | App下载 |
| `/ios-eula` | iOS EULA |
| `/ios-privacy-policy` | iOS隐私政策 |
| `/nft` | NFT页面 |
| `/refer-a-friend` | 推荐好友 |
| `/return-policy` | 退换货政策 |
| `/rock-identification-app` | 岩石识别App |
| `/subscriber-mantra` | 订阅者咒语 |
| `/what-crystal-is-this` | 什么水晶（识别） |
| `/yoga-wellness-discount` | 瑜伽健康折扣 |
| `/affirm` | 肯定 |
| `/connect` | 连接 |
| `/magisters-box` | Magisters盒子 |
| `/NW4420-meteorites` | 陨石特辑 |

---

## The Crystal Council 价值评估

### 核心优势

1. **水晶百科数据库最全之一**：500+ 种水晶的独立百科页面，按字母 A-Z 排列，每种水晶有完整的功效、属性、用途描述
2. **7维度标签交叉索引**：功效(60+) x 星座(12) x 脉轮(9) x 颜色(20+) x 元素(4) x 行星(10+) x 神圣数字(9) = 极其丰富的内部链接网
3. **双URL标签系统**：每个标签同时提供信息页和产品页，既满足信息搜索又满足购买需求
4. **单品独立URL策略**：~12,000个产品页，每个单品（包括同一水晶的不同个体）都有独立URL，最大化索引覆盖
5. **品牌差异化内容**：正能量故事系列（10+篇），建立品牌人格和信任
6. **工具引流**：Crystal Identifier（水晶识别工具）+ Rock Identification App，工具型内容获客
7. **订阅盒子**：Seeker Box + Apprentice Box + Magisters Box 多层级订阅

### 页面规模对比

| 指标 | The Crystal Council | Tiny Rituals | Crystal Vaults |
|------|-------------------|--------------|----------------|
| **总页面** | 15,738 | 1,520 | 8,204 |
| **产品页** | ~12,000 | 964 | 5,260 |
| **百科/知识** | 500+ crystals | ~30 crystals | 131 crystal types |
| **博客** | ~100 | 386 | 539 |
| **标签维度** | 7维度 | 5维度 | 30+属性 |
| **建站平台** | PHP自建 | Shopify | WordPress/WooCommerce |

### SEO策略分析

- **内容矩阵乘法**：水晶百科(500) x 标签(7维度, 每个2URL) = 信息覆盖面极广
- **产品页驱动长尾**：每个独立水晶个体都有独特URL，利于抓取"buy [crystal] [form]"类长尾词
- **内链网络**：通过标签系统将500+水晶百科页与产品页交叉关联
- **缺失的内容类型**：没有天使号码（对比Tiny Rituals的70+篇）、没有星座运势日更（对比Astrostyle）、博客更新频率较低

### 数据质量备注

- `lastmod` 覆盖率 100%，全部 15,738 个 URL 都有最后修改时间
- Priority 范围 0.5-1.0，平均 0.605，较为均匀
- URL 中有个别大小写不一致（如 `/crystals/Amber` 和 `/crystals/CandleQuartz`）
- 部分URL有双斜杠问题（如 `//charity`, `//submit-a-review`）
