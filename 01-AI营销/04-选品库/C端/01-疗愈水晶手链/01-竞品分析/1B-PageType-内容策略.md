# Page Type 内容策略升级

> 基于 Seed-Master v3（47,745 条 × 24 列，37 种 Page Type）
> Generated: 2026-06-05

## 总览

| 指标 | 数值 |
|------|------|
| Seed-Master v3 总关键词 | 47,745 |
| Page Type 种类 | 37 |
| 覆盖主题 | 15（12 原始 + Dreams/Enneagram/Animal Symbolism） |
| 竞品证据匹配 | 6,976 (14.6%) |
| 内容缺口（Vol>=500 无竞品证据） | 15,803 条，总流量潜力 40.5M |
| 现有内容清单 | 709 条草案 |

---

## 一、Page Type 优先级矩阵

### HIGH 优先级（11 种，40,750 条关键词）

| Page Type | 关键词 | 实体数 | 总 Volume | 竞品匹配 | 内容缺口 | 缺口 Volume |
|-----------|--------|--------|----------|---------|---------|------------|
| Blog Article | 18,019 | 775 | 17.8M | 1,755 (10%) | 5,459 | 10.3M |
| Astrology Guide Page | 7,493 | 43 | 10.8M | 337 (4%) | 3,690 | 7.9M |
| Category Hub Page | 4,108 | 701 | 9.2M | 1,666 (41%) | 501 | 4.3M |
| Tool / Quiz Page | 1,885 | 45 | 5.7M | 31 (2%) | 879 | 4.0M |
| Zodiac Sign Page | 3,290 | 21 | 5.5M | 133 (4%) | 1,504 | 2.9M |
| Meditation Guide Page | 573 | 18 | 4.9M | 1 (0%) | 241 | 2.5M |
| Horoscope Page | 1,693 | 24 | 4.4M | 42 (2%) | 919 | 2.8M |
| Chinese Zodiac Page | 1,714 | 25 | 2.7M | 2 (0%) | 889 | 2.4M |
| Moon Phase Page | 837 | 11 | 2.0M | 29 (3%) | 397 | 1.7M |
| Local SEO Page | 621 | 48 | 779K | 10 (2%) | 176 | 263K |
| Numerology Page | 517 | 19 | 357K | 18 (3%) | 121 | 182K |

### MEDIUM 优先级（8 种，5,259 条关键词）

| Page Type | 关键词 | 实体数 | 总 Volume | 竞品匹配 | 内容缺口 |
|-----------|--------|--------|----------|---------|---------|
| Tarot Card Page | 839 | 107 | 1.0M | 392 (47%) | 54 |
| Spiritual Guide Page | 1,477 | 15 | 1.0M | 224 (15%) | 389 |
| Dream Subject Page | 883 | 33 | 971K | 883 (100%) | 0 |
| Dream Interpretation Page | 772 | 35 | 822K | 772 (100%) | 0 |
| Birth Chart Page | 276 | 7 | 422K | 13 (5%) | 150 |
| Zodiac Compatibility Page | 305 | 24 | 374K | 18 (6%) | 146 |
| Crystals by Chakra Page | 502 | 14 | 272K | 41 (8%) | 70 |
| Feng Shui Guide Page | 205 | 110 | 103K | 0 (0%) | 37 |

### LOW 优先级（18 种，1,736 条关键词）

Animal Symbolism Page, Angel Number Page, Tarot Reading Guide Page, Crystals by Condition Page, Crystal Single Page, Palmistry Guide Page, Tarot Spread Page, Crystals by Zodiac Page, Lucid Dream Guide Page, Product Page, (Skip), Crystal Guide Index Page, Spirit Animal Page, Calculator Page, Enneagram Guide Page, Crystals by Color Page, Nightmare Guide Page, Shop by Stone Page

---

## 二、Page Type 内容模板定义

### HIGH 优先级模板

#### Blog Article（18,019 条 | 17.8M Volume）

- **页面目标**：覆盖长尾信息型搜索，建立主题权威
- **URL 模式**：`/blog/{slug}`
- **核心结构**：
  1. H1 标题（含主关键词）
  2. 导语摘要（150 字内，含关键词变体）
  3. Table of Contents
  4. 正文 5-8 个 H2 段落（覆盖相关子话题）
  5. CTA → 相关产品/工具推荐
- **SEO 侧重**：Featured Snippet 优化（列表/表格/定义框）
- **字数目标**：1,500-3,000 词
- **Schema**：Article + FAQ + BreadcrumbList
- **新主题覆盖**：Dreams（4 条博客关键词，需新增）
- **首批重点**：Volume > 10K 的 200 条关键词

#### Astrology Guide Page（7,493 条 | 10.8M Volume）

- **页面目标**：astrology 相关深度指南页
- **URL 模式**：`/astrology/{topic-slug}`
- **核心结构**：
  1. H1 标题
  2. 概述（什么是 X）
  3. 详细解释（含图示/表格）
  4. 如何应用（实用指南）
  5. 与水晶的关联推荐
- **字数目标**：2,000-4,000 词
- **Schema**：Article + HowTo
- **首批重点**：top 100 实体的指南页

#### Category Hub Page（4,108 条 | 9.2M Volume）

- **页面目标**：品类集合页，内链中枢
- **URL 模式**：`/{topic}` 或 `/{topic}/{subcategory}`
- **核心结构**：
  1. H1 品类名称
  2. 品类简介（200 词）
  3. 子分类网格（含图片/链接）
  4. 热门文章列表（3-5 篇）
  5. 相关产品推荐
- **字数目标**：800-1,500 词
- **Schema**：CollectionPage + ItemList
- **新主题覆盖**：Dreams（870 条 Category Hub 关键词，需新增大量解梦分类页）
- **首批重点**：总 Volume > 100K 的品类入口

#### Tool / Quiz Page（1,885 条 | 5.7M Volume）

- **页面目标**：互动工具引流 + 留资
- **URL 模式**：`/tools/{tool-name}`
- **核心结构**：
  1. H1 工具名称 + 描述
  2. 互动组件（计算器/测试/日历）
  3. 结果展示 + 个性化解读
  4. CTA → 注册获取完整报告 / 产品推荐
  5. SEO 文案（工具下方的说明文字）
- **技术需求**：前端交互组件
- **Schema**：WebApplication + FAQ
- **新主题覆盖**：Enneagram（15 条 Tool/Quiz，核心为 enneagram test）+ Animal Symbolism（2 条）
- **首批重点**：moon phase calendar, enneagram test, crystal quiz, birth chart calculator

#### Zodiac Sign Page（3,290 条 | 5.5M Volume）

- **页面目标**：每个星座的综合深度页
- **URL 模式**：`/zodiac/{sign}`
- **核心结构**：
  1. H1 `{Sign} Zodiac Sign`
  2. 日期范围 + 基本属性
  3. 性格特征（优势/挑战）
  4. 爱情/事业/健康
  5. 最佳水晶推荐
  6. 兼容星座
- **共需页面**：12 个（每个星座 1 页）+ 扩展页
- **字数目标**：3,000-5,000 词
- **Schema**：Article + FAQ

#### Meditation Guide Page（573 条 | 4.9M Volume）

- **页面目标**：冥想方法深度指南
- **URL 模式**：`/meditation/{technique}`
- **核心结构**：
  1. H1 冥想技巧名称
  2. 什么是 X 冥想
  3. 步骤指南（HowTo Schema）
  4. 好处（科学 + 灵性双视角）
  5. 配合水晶
- **字数目标**：2,000-4,000 词
- **Schema**：Article + HowTo + FAQ

#### Horoscope Page（1,693 条 | 4.4M Volume）

- **页面目标**：每日/每周/每月运势
- **URL 模式**：`/horoscope/{sign}/{daily|weekly|monthly}`
- **核心结构**：
  1. H1 运势标题
  2. 自动生成的运势内容
  3. 爱情/事业/健康分维度
  4. Lucky Crystal 推荐
- **需自动化**：日更内容生成
- **字数目标**：500-1,000 词（自动化）
- **Schema**：Article（自动化发布）

#### Chinese Zodiac Page（1,714 条 | 2.7M Volume）

- **页面目标**：中国生肖深度页
- **URL 模式**：`/chinese-zodiac/{animal}`
- **核心结构**：
  1. H1 `{Animal} Chinese Zodiac`
  2. 年份列表
  3. 性格特征
  4. 五行分析
  5. 兼容性
  6. 2026 运势
  7. Lucky Crystal 推荐
- **共需页面**：12 个（每个生肖 1 页）
- **字数目标**：3,000-5,000 词

#### Moon Phase Page（837 条 | 2.0M Volume）

- **页面目标**：月相信息 + 月相日历
- **URL 模式**：`/moon-phases/{phase}` 或 `/moon-phases/calendar`
- **核心结构**：
  1. H1 月相名称
  2. 当前/下次月相时间
  3. 月相意义（灵性角度）
  4. 仪式建议 + 水晶推荐
  5. 月相日历组件
- **技术需求**：月相日历 API/计算组件
- **Schema**：Article + Event

#### Local SEO Page（621 条 | 779K Volume）

- **页面目标**：本地搜索着陆页
- **URL 模式**：`/{service}-in-{city}`
- **核心结构**：
  1. H1 `{Service} in {City}`
  2. 本地服务描述
  3. 为什么选择我们
  4. CTA 预约/咨询
- **字数目标**：500-1,000 词
- **Schema**：LocalBusiness
- **决策**：暂缓。水晶手链 B2C 不适合本地 SEO，Palmistry 的 "palm reading near me" 可做虚拟化处理

#### Numerology Page（517 条 | 357K Volume）

- **页面目标**：数字学深度页
- **URL 模式**：`/numerology/{topic}`
- **核心结构**：
  1. H1 数字学主题
  2. 主题解释
  3. 计算方法
  4. 意义解读
  5. 与水晶的关联
- **字数目标**：2,000-3,000 词

### MEDIUM 优先级模板

#### Dream Subject Page（883 条 | 971K Volume）**[新主题]**

- **页面目标**：特定梦境主题的解读页
- **URL 模式**：`/dreams/about/{subject}`（如 `/dreams/about/teeth-falling-out`）
- **核心结构**：
  1. H1 `Dreaming About {Subject}: Meaning and Interpretation`
  2. 常见梦境场景描述
  3. 心理学解读
  4. 灵性解读
  5. 不同情境下的含义
  6. 应对建议
- **字数目标**：1,500-2,500 词
- **Schema**：Article + FAQ
- **首批重点**：teeth falling out, flying, falling, snake, water, death, pregnancy

#### Dream Interpretation Page（772 条 | 822K Volume）**[新主题]**

- **页面目标**：解梦综合指南/词典页
- **URL 模式**：`/dreams/{keyword-slug}` 或 `/dream-dictionary/{term}`
- **核心结构**：
  1. H1 解梦关键词标题
  2. 核心含义（3-5 种解读）
  3. 文化/心理学背景
  4. 相关梦境链接
  5. CTA → Dream Decoder Tool
- **字数目标**：1,200-2,000 词
- **首批重点**：dream interpretation, dream dictionary, dream meanings

#### Tarot Card Page（839 条 | 1.0M Volume）

- **页面目标**：每张塔罗牌的深度解读页
- **URL 模式**：`/tarot/cards/{card-name}`
- **核心结构**：
  1. H1 卡牌名称
  2. 正位含义
  3. 逆位含义
  4. 爱情/事业/健康解读
  5. 关联水晶
- **字数目标**：1,500-2,500 词
- **首批重点**：Major Arcana 22 张

#### Spiritual Guide Page（1,477 条 | 1.0M Volume）

- **页面目标**：灵性话题深度指南
- **URL 模式**：`/spirituality/{topic}`
- **核心结构**：同 Astrology Guide Page 模板
- **字数目标**：2,000-3,000 词

#### Birth Chart Page（276 条 | 422K Volume）

- **页面目标**：本命盘相关内容
- **URL 模式**：`/astrology/birth-chart/{topic}`
- **需配合工具**：Birth Chart Calculator
- **字数目标**：2,000-3,000 词

#### Zodiac Compatibility Page（305 条 | 374K Volume）

- **页面目标**：星座配对页
- **URL 模式**：`/zodiac/compatibility/{sign1}-{sign2}`
- **共需页面**：78 对（12×11/2）+ 综合
- **可矩阵化**：模板 × 12×12 自动生成

#### Crystals by Chakra Page（502 条 | 272K Volume）

- **页面目标**：按脉轮推荐水晶
- **URL 模式**：`/chakra/{chakra-name}/crystals`
- **共需页面**：7 个（每个脉轮 1 页）
- **字数目标**：1,500-2,500 词

#### Feng Shui Guide Page（205 条 | 103K Volume）

- **页面目标**：风水指南
- **URL 模式**：`/feng-shui/{topic}`
- **差异化优势**：东方智慧融合（策略清单 差异化4）
- **字数目标**：2,000-3,000 词

---

## 三、新主题内容规划

### Dreams（2,534 条 | 3.1M Volume）

| Page Type | 关键词数 | 内容策略 |
|-----------|---------|---------|
| Category Hub Page | 870 | 解梦分类导航（按类型 A-Z / 按主题） |
| Dream Subject Page | 883 | 具体梦境解读（teeth, flying, snake 等） |
| Dream Interpretation Page | 772 | 综合解梦指南/词典 |
| Blog Article | 4 | 梦境相关博客 |
| Lucid Dream Guide Page | 3 | 清明梦教程 |
| Local SEO Page | 1 | 忽略 |
| Nightmare Guide Page | 1 | 噩梦应对指南 |

**首批建设路径**：
1. `/dreams/` Category Hub → 导航入口
2. 10 个高 Volume Dream Subject Page（teeth, flying, falling, snake, water, death, pregnancy, house, car, cheating）
3. `/dreams/dream-interpretation` 综合指南
4. `/dreams/dream-dictionary` 词典页
5. 后续批量生成 870 个 Category Hub 子页

### Enneagram（18 条 | 1.1M Volume）

| Page Type | 关键词数 | 内容策略 |
|-----------|---------|---------|
| Tool / Quiz Page | 15 | Enneagram 测试工具（核心流量入口） |
| Enneagram Guide Page | 3 | Enneagram 入门指南 |

**首批建设路径**：
1. `/tools/enneagram-test` → 核心工具页（15 条关键词指向此页）
2. `/enneagram/` 入门指南
3. `/enneagram/types` 九种类型概述（后续扩展 9 个独立页）

### Animal Symbolism（194 条 | 519K Volume）

| Page Type | 关键词数 | 内容策略 |
|-----------|---------|---------|
| Animal Symbolism Page | 177 | 具体动物象征页 |
| Category Hub Page | 8 | 动物象征分类导航 |
| Spirit Animal Page | 7 | 灵兽/图腾页 |
| Tool / Quiz Page | 2 | Spirit Animal Quiz |

**首批建设路径**：
1. `/animal-symbolism/` Category Hub
2. 20 个高 Volume Animal Symbolism Page（butterfly, dragon, wolf, eagle, snake, owl, cat, spider 等）
3. `/tools/spirit-animal-quiz` 测试工具
4. 后续批量生成剩余 157 个动物象征页

---

## 四、内容矩阵策略

### 矩阵交叉页（自动化模板）

| 矩阵维度 | 行 | 列 | 目标页数 |
|---------|-----|-----|---------|
| 水晶 × 功效 | 15-30 水晶 | 30-60 功效 | 300-400 |
| 水晶 × 脉轮 | 15 水晶 | 7 脉轮 | 50-70 |
| 水晶 × 星座 | 15 水晶 | 12 星座 | 180 |
| 星座 × 星座配对 | 12 | 12 | 78+综合 |
| 水晶 × 颜色 | 15 水晶 | 7+ 颜色 | 16（已有） |

### 优先级排序逻辑

```
优先级 = f(Volume, KD, MatchRate, PageType_Priority, ContentCost)
```

- **P0（立即执行）**：HIGH PT + Volume > 10K + KD < 70 → ~200 条
- **P1（首批）**：HIGH PT + Volume > 1K → ~800 条
- **P2（第二批）**：MEDIUM PT + Volume > 1K → ~500 条
- **P3（第三批）**：矩阵交叉页（模板化批量生成）
- **P4（持续运营）**：月相/运势自动化 + 长尾博客

---

## 五、与现有内容清单的对接

### 现有 709 条 → Page Type 映射

| 现有内容类型 | 对应 Page Type | 预估条数 |
|------------|---------------|---------|
| 百科 | Crystal Single Page / Category Hub Page | ~200 |
| 博客 | Blog Article | ~300 |
| 指南 | Spiritual Guide Page / Meditation Guide Page / Feng Shui Guide Page | ~100 |
| 星座 | Zodiac Sign Page / Horoscope Page | ~50 |
| 塔罗 | Tarot Card Page | ~30 |
| 脉轮 | Crystals by Chakra Page | ~20 |
| 测试 | Tool / Quiz Page | ~9 |

### 新增内容（覆盖 3 个新主题 + HIGH PT 缺口）

- Dreams 相关：~50 条（首批）
- Enneagram 相关：~5 条
- Animal Symbolism 相关：~30 条
- HIGH PT 未覆盖缺口：~200 条
- **预估新增总计：~285 条**

---

## 六、下一步执行

1. **映射现有 709 条到 Page Type**：脚本匹配 Seed-Master 关键词，填充 Page Type 列
2. **补充 KD/CPC**：从 Seed-Master 回填到内容清单
3. **生成新增内容条目**：3 个新主题 + HIGH PT 缺口
4. **批量 Brief 生成**：按 Page Type 模板自动生成内容 Brief
