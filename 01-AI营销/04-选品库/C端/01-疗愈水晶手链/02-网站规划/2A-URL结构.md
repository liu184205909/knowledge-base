# Earthward URL 结构规范

> **RLM步骤2A输出**：URL结构与命名规则
> **创建**: 2026-06-10
> **数据来源**: [页面布局方案.md](页面布局方案.md) §导航结构与URL + [页面决策表.md](页面决策表.md) v3 URL前缀
> **定位**: 本文档是 Earthward 站点 URL 规则的**唯一权威来源**。页面布局方案中的 URL 规则以本文档为准。

---

## URL 总原则

1. **层级 ≤ 3**（域名后最多 2 层路径）
2. **类目名含关键词**（URL slug 包含目标英文关键词）
3. **产品用 `/products/`**，内容用 `/blog/` 或 Topic 前缀
4. **全部小写**，单词间用 `-` 连接
5. **禁止年份/日期**（避免内容过期信号，月相/运势类除外）
6. **WooCommerce 产品页由系统自动生成**，不手动创建

---

## URL 映射表

### 业务必要页（B1a）

| 页面 | URL | slug 规则 |
|------|-----|----------|
| Home | `/` | — |
| About Us | `/about` | 固定 |
| Contact | `/contact` | 固定 |
| FAQ | `/faq` | 固定 |
| Crystal Guide Index | `/crystal-guide/` | 固定 |
| Shop by Stone | `/crystals/` | 固定（浏览型入口） |
| Ethical Sourcing | `/about/ethical-sourcing` | 固定 |

### 核心 SEO 模板（B1b）

| 页面类型 | URL 模板 | 实例 | slug 规则 |
|---------|---------|------|----------|
| Crystal Single | `/crystals/{slug}-meaning/` | `/crystals/amethyst-meaning` | 水晶英文名小写 |
| Intention Category | `/collections/{intention-slug}` | `/collections/anxiety-relief` | 意图关键词 |

### 内容分类页（B2）

| 页面类型 | URL 模板 | 实例 |
|---------|---------|------|
| Crystals by Condition | `/crystal-guide/crystals-for-{condition}` | `/crystal-guide/crystals-for-anxiety` |
| Crystals by Zodiac(12) | `/crystal-guide/{sign}-crystals` | `/crystal-guide/aries-crystals` |
| Crystals by Chakra(7) | `/crystal-guide/{chakra}-chakra-crystals` | `/crystal-guide/root-chakra-crystals` |
| Crystals by Color(12) | `/crystal-guide/{color}-crystals` | `/crystal-guide/black-crystals` |
| Crystals by Element(4) | `/crystal-guide/{element}-crystals` | `/crystal-guide/fire-crystals` |

### 博客内容页（B2 — v3 新增 Page Type）

| Page Type | URL 前缀 | 实例 |
|-----------|---------|------|
| Zodiac Sign Page(×12) | `/zodiac/{sign}` | `/zodiac/aries` |
| Tarot Card Page(×78) | `/tarot/cards/{slug}` | `/tarot/cards/the-fool` |
| Dream Subject Page(×33) | `/dreams/about/{slug}` | `/dreams/about/teeth-falling-out` |
| Dream Interpretation Page(×35) | `/dreams/interpretation/{slug}` | `/dreams/interpretation/snake-dream` |
| Animal Symbolism Page(×10) | `/animal-symbolism/{slug}` | `/animal-symbolism/butterfly` |
| Astrology Guide Page(×43) | `/astrology/{slug}` | `/astrology/birth-chart` |
| Horoscope Page(×24) | `/horoscope/{slug}` | `/horoscope/daily` |
| Meditation Guide Page(×18) | `/meditation/{slug}` | `/meditation/chakra-meditation` |
| Spiritual Guide Page(×15) | `/spirituality/{slug}` | `/spirituality/spiritual-awakening` |
| Moon Phase Page(×11) | `/moon-phases/{slug}` | `/moon-phases/full-moon` |
| Chinese Zodiac Page(×25) | `/chinese-zodiac/{slug}` | `/chinese-zodiac/year-of-the-dragon` |
| Numerology Page(×19) | `/numerology/{slug}` | `/numerology/life-path-number` |
| Angel Number Page(×126) | `/angel-numbers/{number}` | `/angel-numbers/111` |
| Tarot Reading Guide(×61) | `/tarot/reading/{slug}` | `/tarot/reading/three-card-spread` |
| Blog Article(通用) | `/blog/{slug}` | `/blog/how-to-cleanse-crystals` |
| Category Hub Page | 各主题 `/{topic}/` | `/crystals/`（同 Shop by Stone） |

### 互动工具页（B2/B3）

| 页面 | URL |
|------|-----|
| Crystal Quiz | `/crystal-quiz` |
| Bracelet Size Calculator | `/tools/bracelet-size-calculator` |
| Crystal Meaning Search | `/tools/crystal-meaning-search` |
| Crystal Compatibility Checker | `/tools/crystal-compatibility-checker` |
| Moon Calendar | `/moon-calendar` |
| Crystal Oracle | `/crystal-oracle` |
| Crystal Cleansing Timer | `/tools/crystal-cleansing-timer` |

### 候选/延后页（⏸）

| 页面 | URL | 批次 |
|------|-----|------|
| Birthstone Finder | `/tools/birthstone-finder` | B3 |
| Chakra Test | `/tools/chakra-test` | B3 |
| Angel Numbers(100+) | `/angel-numbers/{number}-meaning` | B4 |
| MBTI×Crystals(16) | `/mbti-crystals/{mbti-type}` | B4 |
| Zodiac Compatibility(144) | `/zodiac-compatibility/{sign1}-{sign2}` | B4 |
| Subscription Box | `/subscription-box` | B4 |

### WooCommerce 模板承接

| 页面 | URL 模板 | 说明 |
|------|---------|------|
| Product Detail | `/products/{product-slug}` | WooCommerce 自动生成 |
| Product Category | `/product-category/{category-slug}` | WooCommerce 自动生成 |

---

## Redirect 规则

| 旧路径 | 重定向到 | 原因 |
|--------|---------|------|
| `/crystal-guide/{crystal}-meaning` | `/crystals/{crystal}-meaning` | B1b Crystal Single 统一到 `/crystals/` |
| `/collections/{crystal}-crystals` | `/crystals/{crystal}-meaning` | 水晶浏览页统一到百科页 |

---

> **维护规则**：页面决策表新增 PT 时，必须同步更新本文档的 URL 映射。以本文档为 URL 权威来源。
