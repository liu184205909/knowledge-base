# Chakra Crystals 文章框架 v2（7 脉轮）

> **适用**：`/{chakra}-chakra-crystals/` 变现层分类页（root / sacral / solar-plexus / heart / throat / third-eye / crown，共 7 篇）
> **竞品依据**：tinyrituals.co（11 颗 + What Else）、energymuse.com、solacely.co、7chakracolors.com
> **数据**：spoke-data.json（**每脉轮固定 12 颗**）+ crystal-attributes.json + 1.crystal-meaning/
> **v2 升级**（基于 8.5/10 审阅）：篇幅现实化 + 合规标准化 + 转化字段 + 需求对照表 + 差异化 + Schema + 图片规范

---

## 1. URL + TKD
- URL：`/{chakra}-chakra-crystals/`（根级，2A §二）
- **Title（SEO，主词靠前 + 合规）**：`Best {Chakra} Chakra Crystals: Stones for Balance, Energy & Mindful Rituals`
- **H1（可读，可与 Title 不同）**：`Best Crystals and Stones for the {Chakra}`
- Primary KW：`{chakra} chakra crystals` / `{chakra} chakra stones`（双覆盖）
- rank_math 三件套必写（title/description/focus_keyword）

## 2. 模块结构 + 词数分配（目标 2200-3000 词）

| # | 模块 | H2 | 词数 | 内容要点 |
|---|---|---|---|---|
| M1 | Quick Answer | `Quick Answer: Best Crystals for the {Chakra}` | 80-120 | 1-2句答 + 推荐前3颗 + 合规锚点 |
| M2 | Understanding | `Understanding the {Chakra} ({梵名})` | 200-300 | 脉轮解剖：位置/功能/失衡/元素/颜色（原创深化，非抄）|
| M3 | Crystal List | `12 Best Crystals for the {Chakra}` | 900-1200 | **固定12颗**，H3 字段卡片 + 60-80词描述 |
| **M4** | **How to Choose** ⭐核心转化 | `How to Choose by Your {Chakra} Need` | 250-350 | **需求对照表**（Need\|Crystals\|Why）|
| M5 | How to Use | `How to Use {Chakra} Crystals` | 250-350 | 使用方式×产品形态（商业化）+ where to place |
| **M6** | **Beyond Crystals** ⭐差异化 | `Beyond Crystals: Other Ways to Balance` | 200-300 | 非水晶辅助（**每篇独特**，见 §9）|
| M7 | FAQ | `FAQ About {Chakra} Crystals` | 400-600 | 7-8问（含 scientifically proven 合规问）|
| M8 | Shop + Closing | `Shop {Chakra} Crystals` + 内链 | 150-250 | 产品链接 + 三类内链 |

**篇幅目标**：2200-3000 词。核心页（root/heart/third-eye）3000+，其余 2200-2600。**不为压词数牺牲结构**（FAQ/M4 对长尾有价值）。

## 3. M3 字段卡片（12 颗固定，加转化字段）

```
### {Name}
- **Chakra**: {本脉轮}（+ 其他关联脉轮）
- **Color**: {overview.Color}
- **Element**: {overview.Element}
- **Best for**: {overview['Best for']}              ← 核心转化
- **Best way to use**: {wear / meditate / place / carry}  ← 核心转化（新增）
- **Zodiac**: {overview.Zodiac}                    ← 次要，可降级
- **Affirmation**: "{AI生成1句肯定语}"
{AI 60-80词描述：矿物事实 + 灵性传统 + 心理/正念，三视角，原创不抄 meaning 页}
[图] + 内链到 /gemstone/{slug}-meaning/（锚文本自然变化，如"Black Tourmaline meaning"）
```

**字段优先级**：Best for + Best way to use > Chakra/Color/Element > Zodiac（Zodiac 有搜索价值但贴转化弱，空间紧可降级）。

## 4. M4 需求对照表（核心转化模块）

放 M3 之后（先认识水晶，再按需求筛选，购买路径自然）。表格式：

| Need | Best Crystals | Why |
|---|---|---|
| Grounding | Hematite, Smoky Quartz, Red Jasper | Traditionally linked with stability and body awareness |
| Protection | Black Tourmaline, Obsidian, Onyx | Often used as symbolic protection stones |
| Confidence | Garnet, Tiger's Eye, Bloodstone | Associated with courage, vitality, and action |

让用户快速找到购买方向。每篇按本脉轮 sub-需求分组（root: grounding/protection/confidence；heart: love/self-love/forgiveness 等）。

## 5. M5 商业化（使用方式 × 产品形态）

每种使用方式自然对应产品形态（不强行卖货，引向决策）：
- **佩戴** → bracelets / necklaces / rings（日常提醒）
- **冥想** → palm stones / tumbled / worry stones
- **摆放** → towers / raw stones / clusters（房间/工作台）
- **chakra placement** → flat stones / small tumbled（放脉轮位置）

例句：「Choose a bracelet for a daily reminder, a tumbled stone for meditation, or a raw stone to place in your room.」

## 6. 内链（三类 + 横向，正文上下文为主）

1. **每颗 → meaning 页**：锚文本自然变化（"Black Tourmaline meaning" / "learn what hematite does"），非统一
2. **脉轮横向**：正文上下文内链（非仅末尾列表）—— heart 提 throat（情绪表达相关）、third eye 链 crown、solar plexus 链 sacral
3. **上层 hub**：/gemstones/、chakra stones、chakra colors、chakra healing guide（未来页）
4. **字段二次利用**：Color/Element/Zodiac 字段 → 横向聚合页内链（如 purple 字段链 /purple-crystals/）
5. **工具联动**：见 §10

## 7. 图片策略

每颗水晶图规范：
- **文件名**：`{slug}-{chakra}-chakra-crystal.jpg`（如 black-tourmaline-root-chakra-crystal.jpg）
- **Alt**：`{Name} crystal for {chakra} {用途}`（如 Black tourmaline crystal for root chakra grounding）
- **Caption**：一句 ritual 常见用途

**资源有限时优先级**：① hero 图 ② M3 重点 3-5 颗图 ③ Shop 图（不必每颗都配独立图）。

## 8. Schema（Rank Math 配置）

| Schema | 何时配 |
|---|---|
| **Article + FAQ** | **每篇必配**（M7 FAQ → FAQPage）|
| **Breadcrumb** | 根级分类页 + hub 结构 |
| **ItemList** | M3「12 Best Crystals」列表 |
| **Product** | **仅** M8 有真实商品卡片（价格/库存/评分）时；无真实数据不用 |

## 9. 差异化（每篇 M6 Beyond Crystals 独特，避免模板化）

| 脉轮 | M6 Beyond Crystals 重点（原创，独家信息密度）|
|---|---|
| Root | 赤脚走路、山式、根茎蔬菜、鼓声、慢呼吸 |
| Sacral | 舞蹈、创意日志、开髋瑜伽、水仪式、橙色食物 |
| Solar Plexus | 核心呼吸法、晨间阳光、战士式、目标设定、黄色食物 |
| Heart | 慈心冥想、开胸瑜伽、玫瑰油、感恩练习、绿色食物 |
| Throat | 哼唱、诵经、日志、颈伸展、蓝色食物/草本茶 |
| Third Eye | 梦日志、屏幕休息、交替鼻孔呼吸、暗处静冥想 |
| Crown | 静默、祈祷式反思、冥想、数字极简、柔和呼吸 |

M2 脉轮解剖也原创深化（非抄竞品）——这两块是差异化承载点，重点投入。

## 10. 工具联动（Chakra Test，已建 /tools/chakra-test/）

双向 CTA + 数据校验一致：
- **文章→工具**：M2 末 + M5 前，CTA锚文本「Not sure which chakra to focus on? **Take the free Chakra Test** ↗」→ /tools/chakra-test/
- **工具→文章**：Chakra Test 的 7 个结果分别链 `/{chakra}-chakra-crystals/`
- **数据源**：Chakra Test 题目/脉轮特质内嵌在 `chakra-test/build/generate.js`（CHAKRAS/QUESTIONS 常量）；文章 M2 脉轮知识（位置/功能/失衡/对应元素颜色）独立写。两者需人工校验一致（理想可抽 `_shared/chakra-knowledge.json` 共用，当前内嵌够用）
- **落地状态（2026-06-27）**：工具→文章 CTA 已上线——chakra-test 结果区每脉轮加「Read the {Chakra} Crystals Guide →」链 `/{chakra}-chakra-crystals/`（7 篇，page 45647 已部署）。文章→工具 CTA 待文章产出时加（M2末/M5前锚文本「Take the Chakra Test」）
- 锚文本规范：文章→工具用「Take the Chakra Test」；工具→文章用「{Chakra} Crystals Guide」（如 Root Chakra Crystals Guide）

## 11. Writing & Compliance Rules（合规标准化）

- **禁医学声明**：cure / treat / heal anxiety / remove trauma / 暗示确定疗效
- **合规措辞**（模板层统一）：
  - ✅ "traditionally associated with..."
  - ✅ "often used in mindfulness practices"
  - ✅ "may support a sense of..."
  - ✅ "many people use it as a symbolic reminder to..."
  - ❌ "Amethyst heals anxiety and opens the third eye"
- **免责声明**（固定模块/全站统一组件，**非隐含 FAQ**）：用 "traditionally believed to" / "no scientific evidence that crystals directly treat disease, but many use them as meditation, intention-setting, and self-awareness tools"
- **FAQ "Are chakra crystals scientifically proven?"**：每篇必保留，中性答（降健康声明风险）
- **描述原创**：不抄 meaning 页内容，针对本脉轮意图重写

## 12. SEO Enhancements
- Title 主词靠前（{chakra} chakra crystals 在前）
- FAQ Schema（M7）+ ItemList（M3）
- rank_math 三件套
- 12 颗数量固定（N 一致，内链锚文本统一）

## 13. 模板化风险防控
7 篇同结构是参数化必然，但**每篇强制注入差异化信息密度**：
- M2 脉轮解剖原创（非换关键词）
- M4 对照表按本脉轮真实需求（数据原创）
- M6 Beyond Crystals 每篇独特（§9）
- 描述针对本脉轮意图（非通用）
