# 模板级依据包 — Crystal Single（水晶单品百科页模板）

> **页面类型**: Crystal Guide 单品百科页 (B1b)
> **模板脚本**: `crystal-single.js`
> **适用范围**: 15 种水晶单品页（Amethyst, Rose Quartz, Clear Quartz, Citrine, Black Tourmaline 等）
> **RLM 引用**: §3.5 模板级依据包 + §2C "先依据后构建"
> **创建日期**: 2026-06-05
> **依据来源**: 从 `amethyst-crystal-single.md` 页面级依据包提炼

---

## 1. 模板 Canonical 字段结构

每个 Crystal Single 实例页必须填写以下 config 字段（对应 `crystal-single.js` 的 Section 结构）：

| Section | Config 字段 | 是否必须 | 模板级说明 |
|---------|------------|---------|-----------|
| S1 Hero | `name`, `subtitle` | ✅ | `name` = 水晶英文名；`subtitle` = 诗意副标题（参考 Crystal Vaults 风格，但必须原创） |
| S2 简介 | `shortDescription` | ✅ | 3-5 句话概述，需覆盖：是什么 + 核心功效 + 适用人群 |
| S3 三视角 | `perspectives.scientific`, `perspectives.spiritual`, `perspectives.psychological` | ✅ | 超越1（差异化核心）：科学+灵性+心理学三视角模型，5/5 竞品无此结构 |
| S4 核心功效 | `benefits[]` | ✅ | 5-7 项功效，每项含 `title` + `description` |
| S5 属性标签 | `attributes.{chakra, zodiac, element, hardness, source, color}` | ✅ | 7维度标签体系（超越3），竞品通常只有 2-3 维 |
| S6 使用场景 | `usageScenes[]` | ✅ | 4 类场景：佩戴/冥想/家居/仪式 |
| S7 搭配推荐 | `pairings[]` | ✅ | 2-3 种搭配水晶，含 `name` + `reason` |
| S8 产品区 | 动态区 — WooCommerce 产品卡 | ✅ | 超越6：百科→产品零跳转设计 |
| S9 FAQ | `faqs[]` | ✅ | 5 条 FAQ，基于竞品高频问题 + 差异化回答 |

---

## 2. 模板级参考竞品（所有 Crystal Single 共用）

| # | 竞品 | 参考维度 | 上游来源 |
|---|------|---------|---------|
| 1 | **Crystal Vaults** | 百科页结构模板：诗意命名 + 多维属性 + 详细功效 + 搭配建议 | 1D-P2-3 + 1B-sitemap-03 |
| 2 | **Tiny Rituals** | SEO 价值验证：博客→产品转化路径 | 1D-P2-1 + 1B-sitemap-01 |
| 3 | **Energy Muse** | 意图×水晶映射 (Shop by Crystal + Shop by Intention) | 1D-P1-1 + 1B-sitemap-02 |
| 4 | **The Crystal Council** | 极简百科 + 产品链接直达 | 1B-sitemap-04 |
| 5 | **Beadage** | 宝石学/矿物学视角（科学性参考） | 1B-sitemap-10 |

> **参考竞品 URL 模板**（实例页填实际 URL）：
> - Crystal Vaults: `crystalvaults.com/crystal-encyclopedia/{crystal}/`
> - Tiny Rituals: `tinyrituals.com/blogs/tiny-rituals/{crystal}-meaning-healing-properties-and-everyday-uses`
> - Energy Muse: `energymuse.com/pages/{crystal}-meaning`
> - The Crystal Council: `thecrystalcouncil.com/crystals/{crystal}`
> - Beadage: `beadage.net/gemstones/{crystal}/`

---

## 3. 模板级采用/规避/差异化规则

### 采用（从竞品学习 — 所有 Crystal Single 共用）

| # | 来源竞品 | 具体做法 | 在 config 中的体现 |
|---|---------|---------|-------------------|
| A1 | Crystal Vaults | 诗意副标题 | `subtitle` 字段 |
| A2 | Crystal Vaults | 多维度属性表（产地/硬度/化学式/脉轮/星座） | `attributes` 字段集 |
| A3 | Tiny Rituals | 核心功效列表 | `benefits` 数组 |
| A4 | Tiny Rituals | 使用场景分类（佩戴/冥想/家居/仪式） | `usageScenes` 数组 |
| A5 | Energy Muse | 水晶搭配推荐 | `pairings` 数组 |
| A6 | 多家竞品 | FAQ | `faqs` 数组 |

### 规避（竞品做法不采用）

| # | 来源竞品 | 不采用的做法 | 原因 |
|---|---------|------------|------|
| R1 | Tiny Rituals | 博客作为百科主体 | 我们用 Elementor 独立页面 |
| R2 | Energy Muse | `/pages/` URL 路径 | 我们用 `/crystal-guide/{crystal}-meaning` |
| R3 | Beadage | 纯矿物学无灵性内容 | 我们三视角全覆盖 |

### 差异化（竞品没做的 — 模板级通用策略）

| # | 策略 | 在 config 中的体现 |
|---|------|-------------------|
| D1 | 超越1: 三视角模型 | `perspectives.scientific` + `perspectives.spiritual` + `perspectives.psychological` |
| D2 | 超越6: 百科→产品直通 | Section 8 产品区（零跳转设计） |
| D3 | 7维度标签体系 | `attributes` 含 chakra/zodiac/element/number 等（竞品通常只有 2-3 维） |
| D4 | 品牌语调 | 温暖专业但不玄学；有科学依据但不过于学术 |

---

## 4. 可复用语调与写作规范

- **语调**: 温暖专业，不玄学。介于 Crystal Vaults 的诗意和 Beadage 的学术之间
- **三视角平衡**: 每个视角 150-250 词，科学视角优先（差异化核心），灵性视角次之，心理学视角收尾
- **功效描述**: 不用"heals"、"cures"等医疗声明；用"supports"、"promotes"、"may help with"
- **SEO 写作**: H1 = `{Crystal Name} Meaning: Healing Properties & Uses`；核心关键词在首段自然出现
- **CTA 风格**: 温和引导，不强推。如"Explore our {crystal} collection"而非"Buy now"

---

## 5. 图片规则（模板级）

| 位置 | 数量 | 规则 |
|------|------|------|
| Hero 图 | 1 | 每种水晶独立 prompt，展示该水晶的标志性外观（如 Amethyst 紫色簇、Rose Quartz 粉色原石） |
| 产品展示图 | 1 | 对应实际产品手链的佩戴效果，禁止通用手链图 |
| 搭配图 | 1 | 该水晶 + 推荐搭配水晶的组合图，需独立 prompt |

> **核心规则**: 15 种水晶 × 3 张图 = 45 张独立图。每张图必须有独立 prompt，禁止共用通用图。Hero 图要体现该水晶的独特颜色和形态。

---

## 6. 模板级上游来源索引

| 上游文档 | 对 Crystal Single 模板的贡献 |
|---------|----------------------------|
| **1D-P2-1** (Tiny Rituals) | 博客→产品转化路径 + 水晶单品 SEO 流量验证模式 |
| **1D-P2-3** (Crystal Vaults) | 诗意命名体系 + 百科页结构模板 |
| **1D-P1-1** (Energy Muse) | Shop by Crystal 导航 + 意图×水晶映射 |
| **1G-用户画像** | 水晶手链用户画像 + 价格区间 |
| **1H-策略清单** | 模仿5(A-Z百科) + 模仿17(诗意命名) + 超越1(三视角) + 超越6(百科+电商融合) |

---

## 7. 实例页最小差异记录模板

每个 Crystal Single 实例页必须填写以下差异记录（从本模板复制后填入）：

```markdown
# 实例页差异记录 — {Crystal Name}

## 基本信息
| 字段 | 值 |
|------|-----|
| canonical URL | /crystal-guide/{crystal}-meaning |
| 主关键词 | {crystal} meaning |
| 搜索量 | {Volume}/月 |
| 竞品关键词覆盖 | {数量} 个 ({竞品} TOP1 验证) |
| 竞品单篇月流量验证 | {流量}/月 ({竞品}) |
| 定位 | {一句话定位} |
| 诗意副标题 | "{原创副标题}" |

## 参考竞品 URL（实际可访问）
| 竞品 | URL | 异常说明 |
|------|-----|---------|
| Crystal Vaults | crystalvaults.com/crystal-encyclopedia/{crystal}/ | ✅ 正常 / ⚠️ {异常} |
| Tiny Rituals | tinyrituals.com/blogs/.../{crystal}-meaning... | ✅ 正常 / ⚠️ {异常} |
| Energy Muse | energymuse.com/pages/{crystal}-meaning | ✅ 正常 / ⚠️ {异常} |
| The Crystal Council | thecrystalcouncil.com/crystals/{crystal} | ✅ 正常 / ⚠️ {异常} |
| Beadage | beadage.net/gemstones/{crystal}/ | ✅ 正常 / ⚠️ {异常} |

## 素材证据（与模板共用的不重复列）
| 素材类型 | 具体内容 | 来源 |
|---------|---------|------|
| 科学事实 | {矿物学信息} | {来源} |
| 产地数据 | {主要产地} | {来源} |
| 词源 | {词源故事} | {来源} |
| 脉轮映射 | {对应脉轮} | {竞品一致率} |
| 星座映射 | {对应星座} | {竞品一致率} |
| 核心功效 | {5-7 项} | {竞品综合} |
| SEO 流量证据 | {流量数据} | {1D来源} |

## 图片是否独立
| 位置 | 独立 prompt | 说明 |
|------|-----------|------|
| Hero 图 | ✅ / ❌ | {描述} |
| 产品展示图 | ✅ / ❌ | {描述} |
| 搭配图 | ✅ / ❌ | {描述} |

## 特殊风险
| 风险 | 说明 | 应对 |
|------|------|------|
| {风险项} | {描述} | {应对方式} |
```

---

## 8. 实例页清单与状态

| # | 水晶 | 实例页差异记录 | 差异记录状态 | 图片状态 |
|---|------|--------------|------------|---------|
| 1 | Amethyst | `amethyst-crystal-single.md` | ✅ 已完成（页面级依据包，待转为差异记录格式） | 待生成 |
| 2 | Rose Quartz | — | ⏸ 待创建 | 待生成 |
| 3 | Clear Quartz | — | ⏸ 待创建 | 待生成 |
| 4 | Citrine | — | ⏸ 待创建 | 待生成 |
| 5 | Black Tourmaline | — | ⏸ 待创建 | 待生成 |
| 6 | Lapis Lazuli | — | ⏸ 待创建 | 待生成 |
| 7 | Carnelian | — | ⏸ 待创建 | 待生成 |
| 8 | Green Aventurine | — | ⏸ 待创建 | 待生成 |
| 9 | Tiger's Eye | — | ⏸ 待创建 | 待生成 |
| 10 | Moonstone | — | ⏸ 待创建 | 待生成 |
| 11 | Sodalite | — | ⏸ 待创建 | 待生成 |
| 12 | Howlite | — | ⏸ 待创建 | 待生成 |
| 13 | Obsidian | — | ⏸ 待创建 | 待生成 |
| 14 | Jade | — | ⏸ 待创建 | 待生成 |
| 15 | Fluorite | — | ⏸ 待创建 | 待生成 |

---

## 9. 2C 开工门槛核对（模板级）

| 门槛条件 | 状态 | 说明 |
|---------|------|------|
| Crystal Single 在页面决策表中已批准进入 B1b | ✅ | 已批准 |
| URL 模板已确定 | ✅ | `/crystal-guide/{crystal}-meaning` |
| 模板级依据包已创建 | ✅ | 本文档 |
| 核心参考竞品已确定（5 家） | ✅ | 见 §2 |
| 实例页差异记录模板已定义 | ✅ | 见 §7 |
| 图片规则已定义 | ✅ | 每种水晶 3 张独立图，见 §5 |
