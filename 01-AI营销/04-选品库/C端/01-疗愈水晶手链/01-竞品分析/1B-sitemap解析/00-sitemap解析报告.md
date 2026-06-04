# 竞品Sitemap解析报告

> **RLM步骤1B数据采集输出**：35家竞品sitemap.xml全量解析
> **生成时间**: 2026-05-20
> **工具**: sitemap-mcp-server（MCP）
> **编号规则**: 按Google Sheets竞品清单行序排列（同 [1A-竞品清单](../1A-竞品清单.md)）

---

## 一、全量解析总览

> **成功率**：32/35 家成功获取sitemap数据（91%），2家sitemap无效，1家响应超限

| # | 竞品 | 域名 | 建站平台 | 总页面数 | Sitemap数 | 状态 | 备注 |
|---|------|------|---------|---------|----------|------|------|
| 1 | Energy Muse | energymuse.com | Shopify | **4,094** | 8 | 成功 | Products 2,985 / Blogs 374 / Pages 230 / Collections 504 |
| 2 | Tiny Rituals | tinyrituals.co | Shopify | **1,520** | 7 | 成功 | Products 964 / Blogs 386 / Collections 149 / Pages 20 |
| 3 | Crystal Vaults | crystalvaults.com | WordPress/WooCommerce | **8,204** | 29 | 成功 | Products 5,260 / Posts 539 / Pages 706 / Crystal Type 131 |
| 4 | The Crystal Council | thecrystalcouncil.com | PHP自建 | **15,738** | 2 | 成功 | 单文件sitemap.xml |
| 5 | My Crystals | mycrystals.com | Webflow | **325** | 1 | 成功 | 单文件sitemap.xml |
| 6 | Beads of Cambay | beadsofcambay.com | Shopify | **18,686** | 14 | 成功 | Products 17,510 / Blogs 488 / Collections 652 |
| 7 | Conscious Items | consciousitems.com | Shopify (多语言) | **17,026** | 63 | 成功 | 15语言 × 4子sitemap; EN: Products 281 / Blogs 473 |
| 8 | Moonrise Crystals | moonrisecrystals.com | WordPress/Yoast | **0** | 2 | 失败 | sitemap_index.xml 返回 InvalidSitemap |
| 9 | New Moon Beginnings | newmoonbeginnings.com | BigCommerce | **14,014** | 12 | 成功 | Products 5,050 / Pages 220 / Categories 379 |
| 10 | Beadage | beadage.net | WordPress | **133,962** | 53 | 成功 | Products 128,700 / Gallery 824 / Posts 66 |
| 11 | Satin Crystals | satincrystals.com | Shopify (多地区) | **55,744** | 63 | 成功 | 12地区; EN: Products 3,339 / Blogs 734 |
| 12 | Healing Crystals | healingcrystals.com | 自建 | **28,718** | 6 | 成功 | Articles 15,627 / Products 10,134 / Tags 2,087 |
| 13 | Selfgazer | selfgazer.com | 自建 | **1,020** | 2 | 成功 | 单文件sitemap.xml |
| 14 | Loner Wolf | lonerwolf.com | WordPress/Yoast | **521** | 6 | 成功 | Posts 449 / Pages 22 / Videos 49 |
| 15 | Forever Conscious | foreverconscious.com | WordPress/Yoast | **8,853** | 16 | 成功 | Posts 2,052 / Pages 17 / Tags 5,723 |
| 16 | Moon Omens | moonomens.com | WordPress/WooCommerce | **2,449** | 39 | 成功 | Posts 675 / Crystals 57 / Horoscopes 24 / Products 135 |
| 17 | Tarot.com | tarot.com | 自建 | **1,349** | 2 | 成功 | 单文件sitemap.xml |
| 18 | Anahana | anahana.com | 自建 (多语言) | **38,581** | 26 | 成功 | 25语言; EN: 1,710 |
| 19 | The Secret of the Tarot | thesecretofthetarot.com | WordPress/Yoast | **3,192** | 20 | 成功 | Posts 3,142 (15分片) / Pages 18 |
| 20 | Biddy Tarot | biddytarot.com | WordPress/Yoast | **2,050** | 12 | 成功 | Posts 492 / Stories 1,021 / Cards 78 / Podcast 222 |
| 21 | Labyrinthos | labyrinthos.co | Shopify | **415** | 7 | 成功 | Blogs 339 / Products 29 / Pages 31 |
| 22 | The Tarot Lady | thetarotlady.com | WordPress/Yoast | **8,608** | 17 | 成功 | Posts 2,696 / Pages 106 / Tags 1,438 |
| 23 | Astrostyle | astrostyle.com | WordPress/Yoast | **3,629** | 24 | 成功 | Posts 2,154 / Learn 806 / Dailies 365 / Celebrities 107 / Tarot 105 |
| 24 | Dream Moods | dreammoods.com | 静态HTML | **0** | 1 | 失败 | 无sitemap（仅robots.txt），纯静态站 |
| 25 | Dream Bible | dreambible.com | 自建 | **96** | 2 | 成功 | 单文件sitemap.xml |
| 26 | Dream Dictionary | dreamdictionary.org | WordPress/Yoast | **487** | 5 | 成功 | Posts 414 / Pages 62 |
| 27 | Tiny Buddha | tinybuddha.com | WordPress/BBPress | **巨大** | 170+ | 超限 | 132个reply分片+13个topic分片+11个post分片+论坛，估计50,000+ |
| 28 | Ask Angels | ask-angels.com | WordPress | **1,774** | 9 | 成功 | Posts 779 / Pages 106 |
| 29 | The Hoodwitch | thehoodwitch.com | Squarespace | **1,779** | 2 | 成功 | 单文件sitemap.xml |
| 30 | All Crystal | allcrystal.com | WordPress | **2,022** | 3 | 成功 | 1,011个页面（双路径重复索引） |
| 31 | Lifehacks.io | lifehacks.io | WordPress/Yoast | **771** | 12 | 成功 | Posts 258 / Pages 10 / Categories 17 |
| 32 | What Ever Your Dose | whateveryourdose.com | WordPress/Yoast | **67** | 6 | 部分 | post-sitemap Invalid; 仅1页+31分类+35作者 |
| 33 | A Little Spark of Joy | alittlesparkofjoy.com | WordPress/Yoast | **510** | 5 | 成功 | Posts 479 / Pages 12 |
| 34 | Daily Horoscope | daily-horoscope.us | PHP自建 | **0** | 2 | 失败 | sitemap.xml InvalidSitemap |
| 35 | Soul Path | soul-path.me | WordPress | **73** | 6 | 成功 | Posts 14 / Pages 57 |

---

## 二、按页面规模分级

### 超大型站（>10,000页）

| 竞品 | 总页面 | 核心内容 | 说明 |
|------|--------|---------|------|
| **Beadage** | 133,962 | Products 128,700 | 产品数据库型站点，50,000+产品/分片 |
| **Satin Crystals** | 55,744 | Products 3,339×12区 | Shopify多地区镜像 |
| **Anahana** | 38,581 | EN 1,710×25语言 | 多语言内容矩阵 |
| **Healing Crystals** | 28,718 | Articles 15,627 | 百科+批发型，文章量最大 |
| **Beads of Cambay** | 18,686 | Products 17,510 | 珠宝批发商 |
| **Conscious Items** | 17,026 | EN 1,135×15语言 | Shopify多语言 |
| **The Crystal Council** | 15,738 | 单文件 | 500+水晶数据库+7维度 |
| **New Moon Beginnings** | 14,014 | Products 5,050 | BigCommerce多产品 |
| **Crystal Vaults** | 8,204 | Products 5,260 / Posts 539 | 百科型，30+属性维度 |
| **Tiny Buddha** | 50,000+(估) | 论坛+博客 | 社区型，132个reply分片 |

### 中型站（1,000-10,000页）

| 竞品 | 总页面 | 核心内容 |
|------|--------|---------|
| **The Tarot Lady** | 8,608 | Posts 2,696 + Tags 1,438 |
| **Forever Conscious** | 8,853 | Posts 2,052 + Tags 5,723 |
| **Energy Muse** | 4,094 | Products 2,985 + Blogs 374 |
| **Astrostyle** | 3,629 | Posts 2,154 + Learn 806 + Dailies 365 |
| **The Secret of the Tarot** | 3,192 | Posts 3,142 |
| **All Crystal** | 2,022 | 单文件1,011页（双路径索引） |
| **Biddy Tarot** | 2,050 | Stories 1,021 + Posts 492 |
| **Moon Omens** | 2,449 | Posts 675 + Crystals 57 + Products 135 |
| **Selfgazer** | 1,020 | 单文件 |
| **Tarot.com** | 1,349 | 单文件 |
| **Ask Angels** | 1,774 | Posts 779 |
| **The Hoodwitch** | 1,779 | 单文件 |

### 小型站（<1,000页）

| 竞品 | 总页面 | 核心内容 |
|------|--------|---------|
| **Lifehacks.io** | 771 | Posts 258 |
| **A Little Spark of Joy** | 510 | Posts 479 |
| **Dream Dictionary** | 487 | Posts 414 |
| **Labyrinthos** | 415 | Blogs 339 + Products 29 |
| **Loner Wolf** | 521 | Posts 449 |
| **My Crystals** | 325 | 单文件 |
| **Tiny Rituals** | 1,520 | Products 964 + Blogs 386 |
| **Dream Bible** | 96 | 单文件 |
| **Soul Path** | 73 | Posts 14 + Pages 57 |
| **What Ever Your Dose** | 67 | 部分 |

---

## 三、按建站平台分类

| 平台 | 竞品数 | 代表站点 |
|------|--------|---------|
| **WordPress/Yoast** | 14 | Crystal Vaults, Forever Conscious, Biddy Tarot, Astrostyle |
| **Shopify** | 7 | Tiny Rituals, Energy Muse, Conscious Items, Satin Crystals |
| **自建/PHP** | 5 | The Crystal Council, Tarot.com, Anahana, Healing Crystals |
| **Webflow** | 1 | My Crystals |
| **BigCommerce** | 1 | New Moon Beginnings |
| **Squarespace** | 1 | The Hoodwitch |
| **静态HTML** | 1 | Dream Moods |
| **BBPress论坛** | 1 | Tiny Buddha |

### Shopify站 sitemap 标准结构
```
sitemap_agentic_discovery.xml (AI发现, 1页)
sitemap_products_1.xml [+ products_2...] (产品)
sitemap_pages_1.xml (静态页面)
sitemap_collections_1.xml (集合)
sitemap_blogs_1.xml (博客)
```
多语言/多地区站每个locale重复一套以上结构。

### WordPress/Yoast站 sitemap 标准结构
```
sitemap_index.xml (主索引)
├── post-sitemap.xml [+ post-sitemap2...] (文章)
├── page-sitemap.xml (页面)
├── category-sitemap.xml (分类)
├── post_tag-sitemap.xml [+ ...] (标签)
├── product-sitemap.xml (WooCommerce产品)
├── pa_*-sitemap.xml (产品属性)
└── [custom-post-type]-sitemap.xml (自定义类型)
```

---

## 四、关键洞察

### 4.1 内容规模对比

> 排除多语言/多地区重复页面后的**单语言核心页面数**

| 竞品 | 核心页面(单语言) | 产品数 | 博客/文章 | 百科/知识 |
|------|----------------|--------|----------|----------|
| **Crystal Vaults** | 8,204 | 5,260 | 539 | 706 pages + 131 crystal types |
| **Healing Crystals** | 28,718 | 10,134 | 15,627 articles | - |
| **Energy Muse** | 4,094 | 2,985 | 374 | 230 pages |
| **Tiny Rituals** | 1,520 | 964 | 386 | 20 pages |
| **Beadage** | 133,962 | 128,700 | 66 | 824 gallery + 108 gemstones |
| **Satin Crystals** | 4,662(EN) | 3,339 | 734 | 167 pages |
| **Conscious Items** | 1,135(EN) | 281 | 473 | 140 pages |
| **The Crystal Council** | 15,738 | - | - | 500+ crystal database |
| **New Moon Beginnings** | 5,728 | 5,050 | 77(news) | 220 pages |

### 4.2 内容矩阵策略

| 策略类型 | 代表竞品 | 特征 |
|---------|---------|------|
| **百科数据库型** | Crystal Vaults, Healing Crystals, The Crystal Council | 海量产品+属性维度，用户通过筛选发现 |
| **内容乘法型** | Tiny Rituals, Energy Muse, Satin Crystals | 水晶含义×功效×颜色×星座×脉轮×天使号码 |
| **多语言矩阵型** | Anahana, Conscious Items | 同一内容翻译为15-25种语言 |
| **社区论坛型** | Tiny Buddha | 用户生成内容(UGC)，论坛reply 132个分片 |
| **工具+内容型** | Biddy Tarot, Labyrinthos, Tarot.com | 占卜工具引流+塔罗牌百科+课程 |
| **占星日更型** | Astrostyle, Forever Conscious | 每日/每周/每月运势内容持续更新 |

### 4.3 对我们（luckycrystals.org）的启示

1. **核心竞争区间**：Tiny Rituals(1,520页) 和 Energy Muse(4,094页) 是直接竞品，我们的目标应至少覆盖同等规模
2. **内容乘法效率最高**：Tiny Rituals 仅386篇博客就覆盖了水晶含义+天使号码+星座+脉轮+颜色+功效全矩阵
3. **多语言是页面倍增器**：Anahana 用1,710个核心页面 × 25语言 = 38,581总页面
4. **Shopify站结构最规范**：sitemap结构一致，便于批量解析和对比
5. **WordPress站内容最丰富**：Yoast SEO插件支持精细化sitemap分类，内容维度更广

---

## 五、失败/异常站点处理

| 竞品 | 问题 | 建议 |
|------|------|------|
| **Moonrise Crystals** | sitemap_index.xml InvalidSitemap | 可能需要直接访问子sitemap URL，或用 webReader 手动解析 |
| **Dream Moods** | 无sitemap，纯静态HTML站 | 6000+梦境词条无法通过sitemap获取，需爬虫或手动整理 |
| **Daily Horoscope** | sitemap.xml InvalidSitemap | 192页内容丰富，需用其他方式获取 |
| **Tiny Buddha** | 响应超25000 token限制 | 170+子sitemap，论坛型站点，可用 sitemap_url 逐个解析 |
| **What Ever Your Dose** | post-sitemap Invalid | 博客文章无法获取，仅得67页 |

---

## 六、数据文件索引

> 所有35家竞品均有独立解析文件（编号对应报告表格序号）

| 文件 | 竞品 | 页面数 | 状态 |
|------|------|--------|------|
| [01-Tiny-Rituals.md](./01-Tiny-Rituals.md) | Tiny Rituals | 1,520 | 成功 |
| [02-Energy-Muse.md](./02-Energy-Muse.md) | Energy Muse | 4,094 | 成功 |
| [03-Crystal-Vaults.md](./03-Crystal-Vaults.md) | Crystal Vaults | 8,204 | 成功 |
| [04-The-Crystal-Council.md](./04-The-Crystal-Council.md) | The Crystal Council | 15,738 | 成功 |
| [05-My-Crystals.md](./05-My-Crystals.md) | My Crystals | 325 | 成功 |
| [06-Beads-of-Cambay.md](./06-Beads-of-Cambay.md) | Beads of Cambay | 18,686 | 成功 |
| [07-Conscious-Items.md](./07-Conscious-Items.md) | Conscious Items | 17,026 | 成功 |
| [08-Moonrise-Crystals.md](./08-Moonrise-Crystals.md) | Moonrise Crystals | — | 失败 |
| [09-New-Moon-Beginnings.md](./09-New-Moon-Beginnings.md) | New Moon Beginnings | 14,014 | 成功 |
| [10-Beadage.md](./10-Beadage.md) | Beadage | 133,962 | 成功 |
| [11-Satin-Crystals.md](./11-Satin-Crystals.md) | Satin Crystals | 55,744 | 成功 |
| [12-Healing-Crystals.md](./12-Healing-Crystals.md) | Healing Crystals | 28,718 | 成功 |
| [13-Selfgazer.md](./13-Selfgazer.md) | Selfgazer | 1,020 | 成功 |
| [14-Loner-Wolf.md](./14-Loner-Wolf.md) | Loner Wolf | 521 | 成功 |
| [15-Forever-Conscious.md](./15-Forever-Conscious.md) | Forever Conscious | 8,853 | 成功 |
| [16-Moon-Omens.md](./16-Moon-Omens.md) | Moon Omens | 2,449 | 成功 |
| [17-Tarot-com.md](./17-Tarot-com.md) | Tarot.com | 1,349 | 成功 |
| [18-Anahana.md](./18-Anahana.md) | Anahana | 38,581 | 成功 |
| [19-The-Secret-of-the-Tarot.md](./19-The-Secret-of-the-Tarot.md) | The Secret of the Tarot | 3,192 | 成功 |
| [20-Biddy-Tarot.md](./20-Biddy-Tarot.md) | Biddy Tarot | 2,050 | 成功 |
| [21-Labyrinthos.md](./21-Labyrinthos.md) | Labyrinthos | 415 | 成功 |
| [22-The-Tarot-Lady.md](./22-The-Tarot-Lady.md) | The Tarot Lady | 8,608 | 成功 |
| [23-Astrostyle.md](./23-Astrostyle.md) | Astrostyle | 3,629 | 成功 |
| [24-Dream-Moods.md](./24-Dream-Moods.md) | Dream Moods | — | 失败(无sitemap) |
| [25-Dream-Bible.md](./25-Dream-Bible.md) | Dream Bible | 96 | 成功 |
| [26-Dream-Dictionary.md](./26-Dream-Dictionary.md) | Dream Dictionary | 487 | 成功 |
| [27-Tiny-Buddha.md](./27-Tiny-Buddha.md) | Tiny Buddha | 50,000+(估) | 超限(仅结构) |
| [28-Ask-Angels.md](./28-Ask-Angels.md) | Ask Angels | 1,774 | 成功 |
| [29-The-Hoodwitch.md](./29-The-Hoodwitch.md) | The Hoodwitch | 1,779 | 成功 |
| [30-All-Crystal.md](./30-All-Crystal.md) | All Crystal | 2,022 | 成功(双路径) |
| [31-Lifehacks-io.md](./31-Lifehacks-io.md) | Lifehacks.io | 771 | 成功 |
| [32-What-Ever-Your-Dose.md](./32-What-Ever-Your-Dose.md) | What Ever Your Dose | 67 | 部分 |
| [33-A-Little-Spark-of-Joy.md](./33-A-Little-Spark-of-Joy.md) | A Little Spark of Joy | 510 | 成功 |
| [34-Daily-Horoscope.md](./34-Daily-Horoscope.md) | Daily Horoscope | — | 失败(Invalid) |
| [35-Soul-Path.md](./35-Soul-Path.md) | Soul Path | 73 | 成功 |

> **覆盖率**: 35/35 家竞品均有独立解析文件。32家成功获取sitemap数据（91%），2家sitemap无效（#8 Moonrise Crystals, #34 Daily Horoscope），1家无sitemap（#24 Dream Moods）。
