# Earthward 产品结构规划（数据驱动版）

> **创建**: 2026-06-18 | **修订**: 2026-06-18（基于竞品 sitemap+深度拆解实际数据重写 §一/§二）
> **位置**: `02-网站规划/产品规划/`
> **目的**: 在打 tag/建类目/重写描述之前，先把产品分类与关联结构想清楚。
> **数据来源**（真实竞品页名，非印象）：
> - `1B-sitemap解析/`：Energy Muse / Crystal Vaults / My Crystals / Beadage / Satin / Conscious Items / Healing Crystals 的实际分类页
> - `1D-竞品深度拆解/`：Energy Muse §10 八意图、Satin 15 意图、My Crystals 35 condition、Beadage 32 condition、Crystal Vaults 150+ condition（样本15）
> - `1C-关键词研究/关键词分组与优先级.md`：Intention Category ~800词/~2M、Condition ~1200词/~3M
> - `stone-core-data.md`：26 石种 intentions/属性（从 crystal-meaning 提取）
> **原则**: 文档（竞品分析）与线上（自建）双向融合；Faceted Classification（形态/类型 category，石种/意图/属性 tag）。

---

## 0. 整体结构图

```
产品（822）
  ├─ A. 物理归类 (Category) —— 线上已有
  │     ├─ by 类型：jewelry(bracelet/necklace/ring/earring/anklet)
  │     │           crystals-stones(形态: sphere/tower/heart/pyramid/tumbled/angel/merkaba...)
  │     │           copper-jewelry
  │     └─ by 石种：by-stone (40+)
  ├─ B. 属性 Facet (Tag)
  │     └─ Chakra(7) / Zodiac(12) / Color(12) / Element(4)
  └─ C. 意图/用途
        ├─ Intention (8 个，导航级) ← 产品打意图 tag
        └─ Condition (~40 个，SEO 长尾) ← 内容页，经 condition→石种 映射拉产品
```

**核心区分**：Intention（8 个宽泛主题，导航聚合）≠ Condition（40 个具体症状，SEO 长尾内容页）。竞品"几十个"指 Condition。

---

## 一、Intention 层 — 8 个（全部多家竞品验证）

### 数据依据
| 来源 | 数据 |
|---|---|
| Energy Muse | 8 意图完整（§10）：Wellness/Wealth/Protection/Calm/Love/Spirituality/Fresh Start/Personal Power |
| Satin Crystals | 15 意图完整：含 Energy Muse 全 8 + Creativity/Focus/Grounding/Home&Family/Job/Moon/Sun |
| 1C Intention Category | ~800 词 / ~2M volume（文档定 ×6，可扩 8） |
| 1H 模仿1 | 6-8 个 |
| **Energy Muse 8 ↔ Satin 15 重叠率** | **100%**（8 个核心意图两家都有） |

### 8 个意图（按竞品验证家数排序）

| # | Intention | 竞品验证 | 核心水晶 | 线上页 |
|---|---|---|---|---|
| 1 | **Protection** | Energy Muse+Satin+Beadage+Crystal Vaults+My Crystals+Healing Crystals+Tiny Rituals **(7家)** | Black Tourmaline, Obsidian, Smoky Quartz | /protection-clearing/ |
| 2 | **Love & Relationships** | Energy Muse+Satin+Beadage+Crystal Vaults+My Crystals+NMB **(6家)** | Rose Quartz, Rhodonite, Pink Tourmaline | /love-relationships/ |
| 3 | **Calm & Mindfulness** | Energy Muse+Satin+Tiny Rituals+Conscious Items+Beadage+My Crystals **(6家)** | Amethyst, Lepidolite, Howlite | /calm-mindfulness/ |
| 4 | **Abundance & Success** | Energy Muse(Wealth)+Satin(Abundance)+Beadage+Crystal Vaults+My Crystals **(5家)** | Citrine, Pyrite, Aventurine, Jade | /abundance-success/ |
| 5 | **Health & Vitality** | Energy Muse(Wellness)+Satin(Health)+Beadage+Moonrise+Healing Crystals **(5家)** | Clear Quartz, Red Jasper, Coral | /health-vitality/ |
| 6 | **Spiritual Connection** | Energy Muse+Satin+Beadage+Crystal Vaults+Moonrise **(5家)** | Amethyst, Labradorite, Selenite | /spiritual-connection/ |
| 7 | **New Beginnings** | Energy Muse(Fresh Start)+Satin(New Starts)+Crystal Vaults **(3家)** | Moonstone, Clear Quartz, Selenite | /transformation/ |
| 8 | **Personal Power** | Energy Muse+Satin(Confidence)+Crystal Vaults **(3家)** | Tiger's Eye, Carnelian, Pyrite | /personal-empowerment/ |

**可扩展第 9-10**（Satin 额外，有 3-4 家验证）：**Focus**(Satin+Beadage+Crystal Vaults+My Crystals 4家)、**Creativity**(Satin+Crystal Vaults+My Crystals 3家)。线上导航暂留 8，Focus/Creativity 作 Condition 或后续扩。

### 实现
- 产品打意图 tag（从 stone-core-data intentions 映射到这 8 标准化 tag）
- Shop by Intention 导航 → 8 聚合页，`[products tag="calm"]` 动态拉取

---

## 二、Condition 层 — 内容 SEO 页，~40 个（竞品实际清单）

### 数据依据
| 竞品 | Condition 数 | 文档列出 |
|---|---|---|
| Crystal Vaults | 150+ | 仅 15 样本（anxiety/depression/love/money/protection/sleep/luck/confidence/creativity/meditation/healing/abundance/stress/focus/new beginnings） |
| My Crystals | ~50 | 35 个完整（情绪/生活/灵性/关系/健康/财富/保护/特殊 8 类） |
| Beadage | 30+ | 32 个完整（情绪/灵性/生活/关系/保护/健康 6 类） |
| Healing Crystals | 三维标签(Physical/Spiritual/Emotional) | 未展开具体名 |

### Condition 清单（Seed-Crystals 真实 Volume + 竞品验证）

数据源：Seed-Crystals Volume 字段（真实搜索量）+ My Crystals/Beadage/Crystal Vaults 竞品页验证。

**🔴 高 Volume 必做（按 Volume 降序）**
| Condition | Volume/月 | 竞品验证 | ⚠️合规 |
|---|---|---|---|
| Protection | 9900 (+best 1900) | 7家 | ✓ |
| Anxiety | 5400 (+变体 2610) | 5家 | 情绪支持语境 |
| Healing（通用） | 4400 | 4家 | ⚠️限 emotional，不夸大 |
| Money/Wealth | 2400 (+luck&money 590) | 5家 | ✓ |
| Luck / Good Luck | 2400+1900+1300 | 3家 | ✓ |
| Sleep | 1300 | 4家 | ✓ |
| Self-Love | 1300 | 2家 | ✓ |
| Manifesting | 1300 | 2家 | ✓ |
| Grief | 1300 | 2家 | ✓ |
| Health | 1000 (+good health 480) | 5家 | ✓ |
| Creativity | 1000 | 3家 | ✓ |
| Abundance | 1000 | 4家 | ✓ |
| Prosperity | 880 | 1家 | ✓ |
| Focus | 880 | 4家 | ✓ |
| Love | 880 | 6家 | ✓ |
| Strength | 720 | 1家 | ✓ |
| Happiness | 720 | 1家 | ✓ |
| Success | 590 | 3家 | ✓ |
| Stress | 590 | 3家 | 情绪支持 |
| Peace | 590 | 2家 | ✓ |
| New Beginnings | 590 | 3家 | ✓ |
| Intuition | 590 | 2家 | ✓ |
| Meditation | 480 | 4家 | ✓ |
| Emotional Healing | 480 | 2家 | ✓ |
| Dreams | 480 | 2家 | ✓ |
| Clarity | 480 | 2家 | ✓ |

**⚠️ 医疗化避雷（有 volume 但 FTC/§4 红线，不推荐产品/最多教育）**：Fertility(1600) / Cancer(1600) / Depression(1000) / Pregnancy(880) / Physical Healing(590) / positive energy(720 能量话术)

> **归类说明**：从 Seed-Crystals 的 crystals-for-X 词里剔除了——**Zodiac 词**（crystals for aries/scorpio/virgo...各 880-1600，归 Zodiac facet）、**Chakra 词**（throat/sacral chakra，归 Chakra facet）、**形态/用途词**（wands/pendulums/grids/decoration/suncatchers/pendants，非功效 condition）。这些是别的 facet，不算 condition。

### Condition 页结构 + 实现
```
/crystals-for-anxiety/（内容 SEO 页，非产品类目）
  ├─ 文章：best crystals for anxiety（链 /gemstone/-meaning/）
  ├─ 推荐水晶卡：Amethyst / Lepidolite / Howlite
  └─ 产品推荐：这些水晶的产品（经 condition→石种 映射，不打产品 condition tag）
```
**关键简化**：产品**不打 condition tag**，建「condition→涉及石种」映射表，页面经石种拉产品。

### 数据局限（待补）
- Crystal Vaults 150+ 仅 15 样本 → 完整 condition 待抓
- Healing Crystals 三维标签未展开
- Moonrise sitemap 解析失败
- 具体 condition 词 + volume 待从 Seed-Master Google Sheet 精确筛选

---

## 三、Condition → 石种 映射（示意，建表时补全）

| Condition | 涉及石种（stone-core-data intentions + 行业） |
|---|---|
| anxiety | Amethyst, Lepidolite, Howlite, Smoky Quartz, Selenite |
| sleep | Amethyst, Howlite, Selenite, Moonstone, Nacre |
| love/self-love | Rose Quartz, Pink Tourmaline, Rhodonite, Jade |
| protection | Black Tourmaline, Obsidian, Smoky Quartz, Coral |
| focus | Fluorite, Clear Quartz, Tiger's Eye, Amazonite |
| wealth | Citrine, Pyrite, Green Aventurine, Jade |
| confidence/power | Tiger's Eye, Carnelian, Pyrite |
| spiritual | Amethyst, Labradorite, Selenite, Clear Quartz |
| ...（40 condition × 映射，建表补全）| |

---

## 四、物理归类（Category，线上已有，优化）

| 维度 | 现状 | 优化 |
|---|---|---|
| by 类型 | jewelry / crystals-stones / copper-jewelry | 三顶层保留（骨架对） |
| by 石种 | by-stone (40+) | 保留 |
| by 形态 | by-shape-function (sphere/tower/heart/pyramid/tumbled/angel/merkaba...) | 补进导航（411 产品） |
| 清理 | accessories(0)/crystal-palm-stones(0)/crystal-point-earrings(0) | 删空类 |
| 合并 | gemstone-bracelets(196)+crystal-bracelets(29)+zodiac/chakra/gold-silver-bracelets | 手链散类理顺 |

---

## 五、属性 Facet（Tag）

| Facet | 数量 | 来源 | 实现 |
|---|---|---|---|
| Chakra | 7 | stone-core-data chakra 字段 | tag + 筛选页 |
| Zodiac | 12 | stone-core-data zodiac | tag + 筛选页 |
| Color | 12 | stone-core-data color | tag + 筛选页 |
| Element | 4 | stone-core-data element | tag + 筛选页 |

---

## 六、每个产品打什么（关联规则）

amethyst 手链最终：
- **Category**：jewelry > gemstone-bracelets + by-stone > amethyst-crystals
- **意图 tag**：calm, spiritual, protection（从 amethyst intentions 映射 8 意图）
- **属性 tag**：chakra=crown+third-eye, color=purple, zodiac=pisces+aquarius, element=air
- **Condition**：不打（经 condition→石种 映射，anxiety/sleep/stress 页自动拉到）

---

## 七、实现顺序

1. 补全 stone-core-data 到 40+（现 26，缺 tiger-eye/black-tourmaline/moonstone/malachite/lapis 等）
2. 建**意图映射表**（intentions→8意图tag）+ **condition→石种映射表**（40 condition）
3. 给产品批量打 tag（意图+属性，从石种映射）
4. 建 Intention 导航页（8，线上已有配 tag）+ Condition 内容页（40，B2 批次）
5. 重写产品描述（stone-core-data + 框架，~500 词）
6. 物理归类优化（删空类、合并散类、补形态导航）

---

## 八、文档对齐（文档往线上靠）

- 2A §导航：Shop by Intention 6→8，对齐线上 8 根级页
- 2A：补 by-shape-function（形态）+ copper-jewelry 到导航（文档漏）
- 页面布局方案：产品类目按线上三大顶层重写

---

**状态**: 数据驱动草案，待审。审核通过按 §七 执行。
