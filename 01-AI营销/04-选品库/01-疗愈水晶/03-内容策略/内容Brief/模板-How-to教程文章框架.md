# How-to 教程文章框架 v2（7 篇净化充能激活系列）

> **适用**：`/blog/how-to-{action}-crystals/` 引流层教程文章（7 篇）
> **竞品依据**：crystals.com（旗舰 cleanse 6600 词）/ thatcrystalsite / energymuse / tinyrituals / consciousitems / gemporia（SERP 2026-06-27 抓取对比）
> **数据**：`_shared/cleansing-knowledge.json`（7 methods 单源，工具+文章共用）+ `_shared/crystal-attributes.json`（390 颗 mineral+safety）+ `_shared/mineral-safety-reference.json`（**v2 新增统一校准表**）+ 1.crystal-meaning/
> **v2 升级要点**（基于用户两轮深度审查）：
> 1. **安全优先首屏**：M1/M2/H3《Activate》均前置"不是所有水晶能用水/盐/阳光；最安全通用法 = moonlight/selenite/sound/smoke；不确定先别用水盐"
> 2. **M3 按风险分层**（非平铺）：最安全推荐 → 有条件中间 → 高风险谨慎
> 3. **四概念表防重复**：完整对照表只在 H1 出现一次，H2-H4 局部引用 + 内链回 H1
> 4. **mineral safety 统一校准表**：water/salt/sun/smoke/jewelry-safe 7 列单源，措辞校准（不写"瞬间溶解/强毒性"）
> 5. **HowTo Schema 重构**：6 步通用操作流程，7 方法是 step③ 的选项（不是 7 个顺序步骤）
> 6. **合规转化句式库**：卖点基于体验/仪式/美感/日常提醒/收藏，非功效
> 7. **流量 ROI 资源分配**：H1+H2 投 60% 精力，H6 枢纽 20%，H3/H4/H5/H7 共享 20% 走轻量参数化模板
> 8. **数据快照版本号 + 触发器**：JSON 改动连带触发文章 dateModified 更新 + 复核
> 9. **上线后 KPI 评估（阶段4）+ 维护责任清单**

---

## 0. 批次定位、差异化与资源 ROI 分配

### 为什么做这批

- **流量价值**：How-to 教程是水晶赛道第二大知识流量入口（仅次于 Crystal Meaning），crystals.com 一篇 `how-to-cleanse-crystals` 占据 6600 词旗舰位，长期 SEO 资产
- **竞品最大痛点**：6 家竞品普遍混淆 cleanse / charge / activate / program 四个概念，用户读完仍不知"到底在做什么"——这是我们的差异化切入点
- **独家壁垒**：
  1. **首饰角度**（竞品 0/6 覆盖）：手链/项链佩戴时的具体操作（手链戴哪只手、项链是否要摘、洗澡能否戴），站点主营水晶首饰的天然优势
  2. **cleansing-timer 工具联动**（B4 已建，全行业无）：文章 CTA → 工具选石查 safety + 倒计时
  3. **Eastern 调性**（藏香 / om 音钵 / 瑜伽 / 玉石文化），差异化于西方纯 Wicca/鼠尾草叙事
  4. **三视角**（科学 40% + 灵性 40% + 心理 20%），把竞品纯灵性叙述补上矿物学硬事实

### 7 篇清单与流量 ROI 资源分配

> **资源分配原则**（v2 新增，第二轮第 1 点）：H1+H2 是突围主力（合计 volume 11000，投 60% 精力做深度/配图/外链/更新维护）；H6 是枢纽页（20%，承上启下汇总 + hub 内链）；H3/H4/H5/H7 共享 20% 走轻量参数化模板。H3（720 volume）定位 **"集群完整性补丁"**（让四概念集群闭环），不是"突围主力"——需求小非蓝海，不投入旗舰级资源。

| # | 文章 | 主词 Volume | URL | 优先级 | 角色定位 | 资源投入 | 质量门分级 |
|---|------|-----------|-----|--------|---------|---------|-----------|
| H1 | How to Cleanse Crystals | **6600** 🔥 | `/blog/how-to-cleanse-crystals/` | **P0 旗舰** | 主题集群核心，承接最大流量 | **旗舰级 30%** | 旗舰质量门 |
| H2 | How to Charge Crystals | 4400 | `/blog/how-to-charge-crystals/` | **P0** | 与 H1 配套（用户常一起搜） | **旗舰级 30%** | 旗舰质量门 |
| H6 | How to Use Crystals | 2400 | `/blog/how-to-use-crystals/` | P1 总览 | 新手入门枢纽页，汇总 H1-H5 | **枢纽级 20%** | 枢纽质量门 |
| H3 | How to Activate Crystals | **720** 🔵 | `/blog/how-to-activate-crystals/` | P1 蓝海 | volume 低但竞品覆盖最弱，**集群完整性补丁**（非突围主力） | 轻量 5% | 轻量质量门 |
| H4 | How to Program Crystals | 590 | `/blog/how-to-program-crystals/` | P1 | 与 H3 配套（激活→设定意图） | 轻量 5% | 轻量质量门 |
| H5 | How to Meditate with Crystals | 590 | `/blog/how-to-meditate-with-crystals/` | P1 | 实践入口，导流 chakra-test | 轻量 5% | 轻量质量门 |
| H7 | How to Cleanse a Crystal Bracelet | 长尾 | `/blog/how-to-cleanse-a-crystal-bracelet/` | P2 | 首饰长尾，独家场景，转化强 | 轻量 5% | 轻量质量门 |

**质量门分级**（v2 新增）：
- **旗舰质量门**（H1/H2）：竞品研究 5+ 家深度抓取 + 三轮校验（概念/数据/合规）+ 独家配图全套（hero+分步+首饰场景）+ 外链建设 + 季度更新维护
- **枢纽质量门**（H6）：覆盖广度优先 + hub 内链矩阵完整 + 中等配图 + 半年更新
- **轻量质量门**（H3/H4/H5/H7）：参数化模板生成 + 竞品研究 2-3 家够用 + 配图精简（hero+1分步）+ 按需更新

**生产顺序建议**：**先 H1 MVP 验证**（第一轮第 10 点，不批量）→ H1 验收通过后固化模板 → H2（旗舰）→ H6（枢纽）→ H3/H4/H5/H7（轻量批量化）。

---

## 1. URL + TKD 规则（含 URL 意图错开，防 Schema 双占位）

- **URL**：`/blog/how-to-{action}-crystals/`（H7 例外：`/blog/how-to-cleanse-a-crystal-bracelet/`）
- **Title（SEO，主词靠前）**：
  - H1：`How to Cleanse Crystals: 7 Safe Methods (With Steps & Timer)`
  - H2：`How to Charge Crystals: Meaning, Methods & When to Do It`
  - H3：`How to Activate Crystals: Meaning, Steps & Intentions`
  - H4：`How to Program Crystals: Meaning, Steps & Intentions`
  - H5：`How to Meditate with Crystals: Steps, Stones & Practices`
  - H6：`How to Use Crystals: Beginner's Guide (10 Ways to Start)`
  - H7：`How to Cleanse a Crystal Bracelet: Safe Methods (No Damage)`
- **H1（可读，可与 Title 不同）**：`How to {Action} Crystals{场景限定}`
- **Primary KW**：`how to {action} crystals` / `how to {action} a crystal`（双覆盖单复数）
- **rank_math 三件套必写**（title / description / focus_keyword），description 控制在 155 字符内含主词 + 差异化钩子（"safe methods" / "with timer" / "without damage"）

**URL 意图错开（v2 新增，第二轮第 4 点）**：同站同主题的文章 + 工具都打 HowTo Schema，Google 只选一个富结果（内部竞争）。故 URL 意图必须错开：
- **工具页主攻**："crystal cleansing timer" / "crystal cleansing tool"（交互式操作流程：选石→检查→倒计时）
- **文章页主攻**："how to cleanse crystals"（知识性安全步骤教学）
- **错开验证**：发布前对比两个 URL 的 Title/Primary KW/HowTo step 文本，确保明显不同（详见 §12 Schema 分工）

---

## 2. 模块结构表（7 模块 + 安全优先首屏）

> 三视角分配：**科学 40% + 灵性 40% + 心理 20%**，自然融入正文，不单独标注"科学视角/灵性视角"小标题（参照 Chakra v2 §11 写法）。

| # | 模块 | H2 | 词数 | 内容要点 | 三视角侧重 |
|---|---|---|---|---|---|
| M1 | **Quick Answer（安全优先首屏）** | `Quick Answer: How to {Action} Crystals` | 100-150 | **安全优先速答**（v2 第一轮第 2 点）：① 最安全通用法 = moonlight/selenite plate/sound/smoke；② 不是所有水晶能用水/盐/阳光，不确定先别用水盐；③ 进入方法前一句话"先确认你的石头耐受性" + Featured Snippet bait（3 点 bullet：Safe methods / How long / Safety check） | 中性事实为主 |
| **M2** | **What & Why（安全优先叙事顺序）** ⭐核心差异化 | `What Does "{Action}" a Crystal Mean?` | 300-450 | **v2 安全优先叙事顺序**（第一轮第 2 点）：① 先讲"不是所有水晶能用水/盐/阳光"（安全风险前置）；② 再讲为什么需要这一步（传统/象征）；③ 最后才引概念区分（H1 只深讲本概念 cleanse + 简短区别 charge，见 §3 防重复规则） | 科学（机制）+ 灵性（传统） |
| **M3** | **Step-by-Step Methods（风险分层）** ⭐核心 | `How to {Action} Crystals: {N} Methods (Ranked by Safety)` | 700-1000 | **v2 按风险分层**（第一轮第 4 点）：最安全推荐 → 有条件中间 → 高风险谨慎，每法不同角色定位 + **method-specific safety notes（1-2 句该法特有风险，非每法重复全表）**（第一轮第 5 点降模板感） | 三视角均衡 |
| **M4** | **Crystal Recommendations** | `Best Crystals to {Action}` / `Crystals That Respond Best` | 200-300 | 推荐对应场景的水晶（H1:需常净化的石 / H2:放大类石 / H3:待激活新石）+ Shop 链接（见 §5） | 灵性（属性）+ 转化 |
| **M5** | **Common Mistakes** | `Common Mistakes to Avoid` | 200-300 | 竞品痛点提炼的 5-7 个典型错误（如水洗 selenite / 阳光晒 amethyst / salt 用错）+ 怎么补救 | 科学（矿物损伤事实） |
| **M6** | **Jewelry Angle（穿插全文，非独立附加模块）** ⭐独家 | `{Action}ing Crystal Jewelry (Bracelets & Necklaces)` | 150-250 | **v2 穿插式首饰角度**（第一轮第 9 点）：首饰场景不集中放 M6，而是穿插全文（water 法提"avoid soaking elastic bracelets"、dry salt 提"not ideal for metal chains"、moonlight 提"best no-contact for bracelets/necklaces"）；M6 仅做"佩戴场景汇总 + H7 深入版引导"，不深入 bracelet 材质细节（留 H7，第一轮第 7 点） | 转化（首饰场景） |
| M7 | FAQ | `FAQ About {Action}ing Crystals` | 250-400 | 三层分层（见 §10）+ cleansing-timer 决策卡片 CTA | 信任合规 |

**篇幅目标（v2 校准，第一轮第 1 点）**：
- **H1 旗舰 3000-3800 词**（7 方法 + 风险分层 + 概念总表完整版 + 首饰穿插，原 2500 偏紧不够展开安全优先叙事）
- **H2 旗舰 2800-3400 词**（charge 方法 subset + 顺序链路 + 与 cleanse 区分）
- **H3/H4 轻量 2000-2400 词**（概念区分聚焦本概念 vs 相邻一个，方法少而精）
- **H5 轻量 2000-2400 词**（冥想实践入口）
- **H6 枢纽 2800-3400 词**（覆盖 10 种用法汇总，含 crystal care sequence 总览图）
- **H7 长尾 2000-2400 词**（聚焦手链场景，按材质分方法）

---

## 3. 概念区分表 + 防重复规则（M2 核心，竞品最大痛点）

> **痛点依据**：6 家竞品 H2 对比发现，crystals.com 把 cleanse/charge 混写、energymuse 把 activate 并入 charge、tinyrituals 把 program 说成 activate——用户读完仍混淆。**这是我们最强的差异化信息密度承载点**。

### 3.1 四概念区分完整对照表（**只在 H1 出现一次，H2-H4 不得完整重复**）

> **v2 防重复硬规则（第一轮第 3 点 + 第二轮第 2 点）**：完整四概念对照表只在 H1（或 H6 枢纽总览）出现一次。H2/H3/H4 的 M2 只写"本概念 vs 最易混淆的相邻一个概念"，且必须用**完全不同的措辞和比喻**，然后内链回 H1 看完整对照。避免四篇文章读起来像同一张表抄四遍。

| 概念 | 一句话定义 | 做什么 | 传统目的 | 频率 | 竞品混淆点（我们要澄清） |
|------|----------|--------|---------|------|----------------------|
| **Cleanse**（净化） | 清除"累积的东西" | 重置石头的象征能量状态 | 移除他人经手/负面使用的残留 | 收到新石 / 每月 / 满月 | ≠"洗干净"（水只是其中一法，且不适用所有石） |
| **Charge**（充能） | 补充/恢复能量 | 给石头"充电池" | 让石头恢复"满电"状态可继续使用 | 净化后 / 能量低时 | ≠ Cleanse（先清后充，顺序不可逆；净 ≠ 充） |
| **Activate**（激活） | 唤醒沉睡的石头 | 让石头"开始工作" | 新石首次启用 / 沉睡已久的石重新启用 | 首次 / 长期未用后 | ≠ Program（激活是"开机"，编程是"设指令"；可激活不编程） |
| **Program**（编程/设定意图） | 给石头一个明确任务 | 写入一个具体意图 | 让石头"记住你的目标"作为日常提醒 | 每个新意图 / 周期重设 | ≠ Activate（编程是装软件，激活是开机；编程是主动设定，激活是被动唤醒） |

### 3.2 各篇 M2 概念区分聚焦规则（防重复）

| 文章 | M2 概念区分聚焦 | 措辞/比喻要求（必须与 H1 不同） | 内链回 H1 |
|------|---------------|------------------------------|----------|
| **H1 Cleanse** | **完整四概念对照表（唯一完整版）** + 深讲 Cleanse + 简短区别 Charge（一句） | 用"重置能量状态"叙事 | —（本身是源） |
| **H2 Charge** | 只讲 **Charge vs Cleanse**（顺序："cleanse first, charge second"） | 比喻：清空杯子 → 再倒水（不用 H1 的"电池"比喻） | "For the full four-concept comparison, see How to Cleanse Crystals" |
| **H3 Activate** | 只讲 **Activate vs Program**（"开机 vs 装软件"） | 比喻：新手机首次开机 → 后续才装 app（不用 H1 的"唤醒沉睡"叙事） | 同上 |
| **H4 Program** | 只讲 **Program 前置链路**（Cleanse → Charge → Activate → Program） | 比喻：先洗手 → 再拿干净碗 → 盛饭 → 端上桌（不用 H1/H3 的比喻） | 同上 |
| **H6 Use（枢纽）** | 可放完整 crystal care sequence 流程图（Cleanse→Charge→Activate→Program 顺序图），作为 H1 总表的图形化呈现 | 图形化为主 | 链回 H1 文字版 |

### 3.3 安全优先叙事顺序（v2 第一轮第 2 点，覆盖原"先讲为什么"）

**H1 M2 叙事顺序硬性规定**（不得颠倒）：
1. **第一段（安全风险前置）**："Before any method, know this: not all crystals tolerate water, salt, or sunlight. The safest universal methods — moonlight, selenite plate, sound, or smoke — work for virtually every stone. If you're unsure of your stone's tolerance, start with these and avoid water/salt entirely."
2. **第二段（为什么需要净化）**：传统/象征意义（他人经手残留、月相仪式、正念标记）
3. **第三段（才引概念区分）**：Cleanse vs Charge 简短区分 + 完整四概念表

**H3《Activate》M2 同理**：先讲"new crystal first-use ritual"（新石到家先做什么安全准备：检查耐受性、选择安全净化法、再激活），不过早概念辨析 Activate vs Program（放第三段）。

**合规措辞**：用 "symbolic energy state" / "traditionally believed to" / "many people experience"，不写 "remove negative energy" / "purify negativity"（参见品牌语调 §4.1 + §11 合规转化句式库）。

---

## 4. M3 分步方法（风险分层 + method-specific safety notes + mineral safety 校准表）

### 4.1 M3 风险分层结构（v2 第一轮第 4 点，替代原平铺）

**H1 全 7 法按三层风险分层呈现**（不是平铺 7 个并列方法）：

```
## How to Cleanse Crystals: 7 Methods (Ranked by Safety)

### 🟢 Tier 1 — Safest & Recommended for All Stones（最安全，新手通用）
#### Moonlight — best no-contact method for beginners / bracelets / necklaces
#### Selenite Plate — best for jewelry (no water, no salt, no handling)
#### Sound (Bowl/Bell) — fastest, no water/salt contact

### 🟡 Tier 2 — Conditional, Check Your Stone First（有条件，查耐受性）
#### Smoke (Sage/Palo Santo/Tibetan Incense) — ritual feel, ventilate well
#### Running Water — only for water-tolerant stones (Mohs 6+, non-porous)

### 🔴 Tier 3 — Higher Risk, Use with Caution（高风险，谨慎）
#### Earth Burial — only high-hardness stones, no metal settings
#### Dry Salt — higher risk, not ideal for metal chains / porous stones
```

**每法角色定位（v2 新增，差异化非雷同）**：

| Method | 角色定位（一句话差异化） | 适用场景 |
|--------|----------------------|---------|
| Moonlight | 新手通用首选 / 首饰无接触最佳 | 所有石、所有首饰 |
| Selenite Plate | 首饰无接触（plate/bowl 放置即净化） | 所有石、首饰专长 |
| Sound | 快速不碰水盐（5-10 min） | 所有石、急需用时 |
| Smoke | 仪式感（通风必备） | 所有石、偏好 ritual |
| Running Water | 只耐水石（Mohs 6+，非多孔） | Quartz、Tiger Eye 等硬石 |
| Earth Burial | 高硬度无金属（深接大地 ritual） | Raw stones、Mohs 7+ |
| Dry Salt | 高风险谨慎（金属链/多孔石忌） | 仅 Mohs 7+ raw stones |

### 4.2 每法 H3 卡片结构（v2 降模板感，第一轮第 5 点）

**核心改动**：不再每法重复完整 safety 表，改为 **method-specific safety notes（1-2 句该法特有风险）+ 首饰穿插提示（1 句）**。完整 safety 总表统一放 M3 末尾或独立模块（见 §4.4）。

```markdown
### Moonlight 🟢 Tier 1

**What it does (tradition)**：[灵性传统视角，1-2句，traditionally believed to...]
**How it works (practical)**：[科学/矿物事实视角，1-2句，如月光强度、声音能量级别]
**Best for**：[哪些石 / 哪些场景，含转化引导]

**Method-specific safety notes**（1-2 句该法特有风险）：
- 极低 UV 风险（vs 直射阳光），是所有光法中最安全的之一
- 雨夜注意：放窗台前确认天气，避免石头意外被雨淋（selenite 等忌水）

**Jewelry tip**（首饰穿插，1 句）：moonlight 是手链/项链最佳无接触净化法——整条放着不动，绳子/金属/石头都不受损。

**Steps**：
1. [步骤1]
2. [步骤2]
3. [步骤3]
**How long**：[时长，与 cleansing-timer 数据一致]
```

**句式轮换要求**（避免 7 法同结构）：M3 每个方法卡用 3-4 套句式变体（对齐 Angel-Numbers v2 §3），如 Tier 1 三法分别用"新手友好叙事 / 首饰专长叙事 / 快速场景叙事"开头，避免雷同。

### 4.3 mineral safety 统一校准表（v2 新增，第一轮第 8 点）

> **单源真理**：建 `_shared/mineral-safety-reference.json`，文章调用不临场编。措辞经 mineralogy 校准，避免"瞬间溶解/强毒性"等夸张表述（伤可信度）。

**7 列结构**：`water_safe` / `salt_safe` / `sun_safe` / `smoke_safe` / `jewelry_safe` / `notes` / `source`

**关键矿物措辞校准表**（生产前必须对照，不得临场改写）：

| 矿物 | ❌ 旧措辞（禁用） | ✅ 校准措辞（采用） | source |
|------|----------------|------------------|--------|
| Selenite | "溶于水，瞬间溶解" | "a soft form of gypsum (Mohs 2); can be damaged, scratched, or degraded by prolonged water exposure — keep dry" | mineralogy reference |
| Malachite | "短暂接触即强毒性" | "porous and copper-bearing; commonly kept away from water, salt, and acids in stone-care practice to avoid surface dulling and potential copper compound release" | stone-care reference |
| Amethyst / Rose Quartz | "阳光晒会褪色" | "color may fade with prolonged direct sunlight; indirect light or moonlight is the safer choice for color-sensitive stones" | mineralogy reference |
| Citrine / Clear Quartz / Tiger Eye | （原未提） | "durable stones (Mohs 7) tolerate short indirect sunlight; avoid prolonged direct sun even for durable stones to prevent heat stress" | mineralogy reference |
| Moonlight（光法风险） | "对任何矿物无 UV 风险" | "extremely low intensity vs direct sun (roughly 1/400,000); generally one of the safest light methods for all minerals" | mineralogy reference |
| Calcite / Pyrite / Hematite 等 | 各自校准 | 见 `_shared/mineral-safety-reference.json` 完整 390 颗 | — |

**总 safety 总表模板**（M3 末尾或独立"Crystal Safety Quick Reference"模块，一篇一次，非每法重复）：

| Stone (examples) | Water | Salt | Sun | Smoke | Jewelry-safe | Quick note |
|---|---|---|---|---|---|---|
| Selenite, Malachite, Calcite, Pyrite | ❌ | ❌ | ⚠️ indirect | ✅ | ✅ (no-contact) | porous/soft/copper-bearing — dry methods only |
| Amethyst, Rose Quartz, Citrine, Fluorite | ⚠️ brief | ⚠️ avoid | ❌ fades | ✅ | ✅ | color-sensitive — no direct sun |
| Clear Quartz, Tiger Eye, Garnet, Jade | ✅ brief | ⚠️ avoid metal | ⚠️ short indirect | ✅ | ✅ | durable but avoid prolonged soaking |
| All stones | moonlight ✅ | selenite ✅ | sound ✅ | smoke ✅ | — | universal safe methods |

### 4.4 7 净化方法数据源（H1 用全 7 法；H2-H4 用 subset）

数据源 `_shared/cleansing-knowledge.json`（**与 cleansing-timer 工具单源**，文章 method 名/时长/safety 等级必须与工具一致，人工校验 + 数据快照版本号见 §13）：

| Method | 时长 | 安全等级 | Tier | 适用文章 |
|--------|------|---------|------|---------|
| Moonlight | 8+ hrs | ✅ all | 🟢 Tier 1 | H1/H2/H3 |
| Selenite Plate | 6+ hrs | ✅ all | 🟢 Tier 1 | H1/H2 |
| Sound (Bowl/Bell) | 5-10 min | ✅ all | 🟢 Tier 1 | H1/H2 |
| Smoke (Sage/Palo Santo) | 30-60 sec | ✅ all（需通风） | 🟡 Tier 2 | H1 |
| Running Water | 1 min | ⚠️ Mohs 6+ only | 🟡 Tier 2 | H1 |
| Earth Burial | 24 hrs | ⚠️ Mohs 7+ only | 🔴 Tier 3 | H1 |
| Dry Salt | few hrs | ⚠️ Mohs 7+ only | 🔴 Tier 3 | H1 |

**充能方法（H2 用）**：Moonlight（满月最强）/ Selenite / Sound / Sunlight（仅耐晒石：Citrine/Clear Quartz/Tiger Eye，**amethyst/rose quartz 禁阳光会褪色**）/ Earth / Crystal Cluster（水晶簇充能）。

**激活方法（H3 用）**：Moonlight（首次满月）/ Selenite（放置 24h）/ Sound（音钵唤醒）/ 冥想专注（握石深呼吸设定"启动"意图）。H3 重点前置"new crystal first-use ritual"（第一轮第 2 点）。

**编程方法（H4 用）**：Quiet Space（安静空间）/ Hold & Focus（握石专注意图）/ Repeat Affirmation（重复肯定语）/ Visualize（可视化目标）/ Rest（放置沉淀）。H4 重点前置链路（Cleanse → Charge → Activate → Program）。

### 4.5 Eastern 调性融入点（差异化，每篇至少 1 处自然嵌入）

- Smoke 法 → 提藏香（Tibetan incense）/ 杜松（juniper）/ 雪松（cedar）替代纯 sage（避免文化挪用，泛文化描述）
- Sound 法 → 提 om 音钵（Tibetan singing bowl）/ 颂钵 / 铜磬（站点实卖铜器，天然契合）
- Earth 法 → 提玉石文化"返璞归真"/ 大地冥想（瑜伽 grounding 语境）
- Moonlight 法 → 提满月冥想 / 月相周期 ritual（与 moon-calendar 工具联动）

### 4.6 Smoke 法安全提示（v2 新增，第二轮第 5 点）

Smoke 法 H3 卡片必须包含以下安全提示（method-specific safety notes 强化）：
- **通风**：在通风良好的空间进行，开窗或开启抽风
- **远离儿童宠物**：烟雾、燃烧物、热灰远离儿童、宠物、哮喘/呼吸道敏感人群
- **确认当地规则**：部分公寓/租赁/公共场所禁止室内燃烧，提前确认
- **火源安全**：使用耐火容器（abalone shell / 陶瓷钵），远离易燃物，结束后确认完全熄灭
- **Eastern 替代**：若不便用烟，Tibetan singing bowl（音钵）能达到类似 ritual 感且无烟（站点实卖铜器，天然衔接）

---

## 5. 水晶植入规则（M4，按 Shop CTA 3 级优先验证）

### 选石逻辑（每篇 5-6 颗）

每篇 M4 植入 5-6 颗水晶，按角色分配（对齐 Angel-Numbers v2 §3 水晶内链平衡）：

| 角色 | 数量 | 选择标准 | H1 示例（需常净化的石） |
|------|------|---------|----------------------|
| 主商业水晶（高毛利/主推） | 1 | 站点主推产品线 | Black Tourmaline（佩戴多，常接触汗液需净化） |
| 语义最匹配 | 1 | 本主题最相关 | Selenite（自净化特性，净化主题最佳代言） |
| 价格友好（入门） | 1 | 入门价位 | Clear Quartz（万能放大） |
| 进阶/小众 | 1 | 带动长尾 meaning 流量 | Carnelian / Moonstone |
| 安全警示石 | 1 | 凸显 safety 价值 | Malachite（porous and copper-bearing，干法净化，措辞按 §4.3 校准表） |
| 首饰场景石 | 0-1 | 接 M6 首饰段 | Rose Quartz（手链常戴） |

**水晶描述措辞规则（v2）**：每颗水晶的 safety 提示 + 转化描述必须查 `_shared/mineral-safety-reference.json`（§4.3 校准表）+ 套用 §11.2 合规转化句式库，不临场编。

### Shop CTA 3 级优先（按 `shop-cta-no-deadlink-rule` memory，生产前必验证）

每颗水晶的 Shop 链接按以下优先级判断（**生产时逐颗 REST 验证 status=200，不凭猜测**）：

1. **特定石类目** `/product-category/{stone}-crystals/`（REST 验证 200）→ 跳该类目
2. **该石产品搜索** `/shop/?s={stone}`（返回 ≥1 产品）→ 跳搜索（显示手链/项链/耳环所有形态）
3. **都没有**（搜索返回 0 产品）→ **总类目** `/product-category/healing-crystals-jewelry/`（200 兜底）

**已验证可直接用的总/品类**（200，多石工具复用）：`healing-crystals-jewelry`（本批次主用）/ `crystals-stones`（bracelet）/ `copper-jewelry`（ring）。

**验证方法**：Python urllib + UA（站点 WAF 拒默认 UA），GET category 看 status；shop 搜索 grep product 卡数。

**示例输出**（M4 每颗卡片末尾）：
```markdown
### Selenite
[60-80词描述：自净化特性 + 净化主题相关性 + safety 提示]
[Shop] → /product-category/healing-crystals-jewelry/ （验证：selenite 无独立类目，搜索有产品，但为多石净化主题，统一跳总类目合理）
[Read] → /gemstone/selenite-meaning/
```

---

## 6. 首饰角度（穿插全文，非独立附加模块）

> **壁垒**：站点主营水晶首饰（手链/项链/耳环），竞品多为原石/晶簇站，无首饰佩戴场景实操。这是本批次最强转化差异化。
> **v2 核心改动（第一轮第 9 点）**：首饰角度不再集中放 M6 附加模块，而是**穿插全文**（M3 各法 + M5 错误 + M7 FAQ 自然提及）。M6 仅做"佩戴场景汇总 + H7 深入版引导"，不深入 bracelet 材质/弹力绳/金属链/编织绳细节（留 H7 专篇，第一轮第 7 点 H1/H7 边界硬切）。

### 6.1 首饰角度穿插点表（全文埋点，非 M6 集中）

| 穿插位置 | 文章主题 | 穿插首饰提示（1-2 句，自然融入） |
|---------|---------|------------------------------|
| M3 Moonlight 法 | H1/H2/H3 | "moonlight 是手链/项链最佳无接触净化法——整条放着不动，绳子/金属/石头都不受损（best no-contact for bracelets/necklaces）" |
| M3 Running Water 法 | H1 | "**避免浸泡弹力绳手链**（avoid soaking elastic bracelets）——绳子会老化松弛；金属链手链也忌 prolonged water（防氧化）" |
| M3 Dry Salt 法 | H1 | "**不适合金属链首饰**（not ideal for metal chains）——盐会加速银/铜氧化；弹力绳手链可用 selenite plate 替代" |
| M3 Selenite Plate 法 | H1/H2 | "首饰专长：把手链/项链放 selenite plate 上过夜即可，零接触零风险" |
| M5 Common Mistakes | H1 | 典型错误："戴着弹力绳手链洗澡净化" → 绳子老化 + 肥皂残留；正确做法 selenite plate |
| M7 FAQ | H1/H2 | "Can I cleanse my bracelet without removing it?" → moonlight/selenite/sound 可戴净化，water/smoke/salt 需摘下 |

### 6.2 M6 模块精简定位（v2，不再深入材质细节）

M6 改为 **"佩戴场景汇总 + H7 引导"** 模块（150-200 词）：
- 汇总全文穿插的首饰提示（一段回顾）
- 首饰佩戴通用 tips（戴哪只手传统说法 / 满月夜放窗台 / 新手链首次激活）
- **引导 H7 深入版**："For a deep dive on bracelet materials (elastic cord, metal chain, woven thread) and material-specific methods, see **How to Cleanse a Crystal Bracelet**"
- **不写**：弹力绳老化机制、金属链氧化化学、编织绳吸水特性（这些是 H7 的内容，H1/H7 边界硬切，第一轮第 7 点）

### 6.3 各文章首饰角度侧重（保留主题适配）

**H1 Cleanse**：穿插全文（见 6.1 表），M6 汇总 + 引导 H7
**H2 Charge**：手链戴哪只手（非主导手接收，标 "traditionally"）、满月夜窗台充能、阳光充能褪色风险
**H3/H4 Activate/Program**：新手链首次激活、佩戴时设定意图、一条手链一个意图
**H5 Meditate**：手链转手掌石（worry stone 替代）、项链吊坠放心轮位置
**H7 Cleanse Bracelet**：**整篇都是首饰场景**（M3-M6 都聚焦手链），最细颗粒度，按材质分（弹力绳/金属链/编织绳）

**合规**：首饰场景也守三句话原则 + §11 合规转化句式库，不写 "bracelet will protect you from negative energy"，写 "wear as a daily reminder to..."。

---

## 7. cleansing-timer 工具联动设计（决策卡片 CTA，非普通内链）

### 工具状态（2026-06-28）

- **URL**：`/tools/crystal-cleansing-timer/`（page 待确认，generate.js 已产出 cleansing-timer.html）
- **功能**：选水晶 → safety 检查（water/sun/salt）→ 推荐安全净化方式 → 倒计时 + 步骤 + 下次日期 + 配件 CTA
- **数据单源**：`_shared/cleansing-knowledge.json`（7 methods）+ `_shared/crystal-attributes.json`（390 颗 safety）+ `_shared/mineral-safety-reference.json`（v2 校准表）
- **蓝海依据**：全行业无工具竞品（都是文章），我们把竞品 safety 表变成交互工具（避免损坏水晶是刚需）

### 7.1 决策卡片 CTA（v2 第一轮第 9 点，非普通内链）

**M3 方法段后必加"决策卡片"组件**（不是普通文字内链，是独立视觉卡片）：

```markdown
> 💡 **Not sure if your stone can go in water, salt, or sunlight?**
> Enter your stone name in the **[Crystal Cleansing Timer](/tools/crystal-cleansing-timer/)** →
> instantly check its water/salt/sun safety, get the recommended method, and start a guided countdown timer.
```

**卡片视觉规范**：独立 callout box（浅色背景 + 💡 icon + 标题 + 1-2 句 + CTA 按钮），区别于正文内链。

**决策卡片位置**（v2）：

| 位置 | 卡片类型 | 锚文本重点 |
|------|---------|----------|
| **M3 末（方法分层表后）** | **主决策卡**（必加 H1/H2/H3/H4/H7） | "Not sure which method is safe for your stone? Check safety + start timer" |
| M5（常见错误后） | 二次提醒卡（必加 H1） | "Want to double-check before you start? Verify your stone won't be damaged" |
| M7 FAQ 前（Gentle Note 后） | 底部曝光卡（必加 H1/H2） | 工具卡组件（重复主决策卡，给页面底部二次曝光） |

### 7.2 双向 CTA 设计

**文章 → 工具**（决策卡片，见 7.1）：

工具反向回链（cleansing-timer 工具侧 SEO 折叠长文 `cleansing-timer/build/seo-content.html` 内加"Deep Guides"段）：
- "Read the full guide: **How to Cleanse Crystals**" → `/blog/how-to-cleanse-crystals/`
- "Learn the difference: **How to Charge Crystals**" → `/blog/how-to-charge-crystals/`
- "New stone? **How to Activate Crystals**" → `/blog/how-to-activate-crystals/`

### 7.3 数据一致性要求 + 快照版本号（v2 第二轮第 3 点）

文章 M3 的 method 名 / 时长 / safety 等级 **必须与 `_shared/cleansing-knowledge.json` 一致**（单源真理）。生产前 diff 校验：
- method slug（moonlight/selenite/sound/smoke/water/earth/salt）
- duration_label（如 "Overnight (8+ hours)"）
- safe 等级（all / mohs6+ / mohs7+）
- universal_safe 4 法（moonlight/selenite/sound/smoke 适用所有石）

**数据快照版本号 + 触发器（v2 新增，第二轮第 3 点，防单点故障）**：
- 每篇文章 config 必须记录 `data_snapshot_version`（如 "cleansing-knowledge.json v1.2"）+ `data_verified_date`（如 "2026-06-28"）
- **JSON 改动列为触发器**：任何 method 时长 / safety 等级 / mineral-safety-reference 措辞修改，必须连带触发：
  1. 对应文章 `dateModified` 更新（Rank Math updateMeta）
  2. 文章 M3 该法段落重新复核（数据一致性 diff）
  3. 触发记录写入维护日志（见 §14.5 维护责任清单）
- **否则后果**：工具说 30 秒，文章说 1 分钟，数据不一致伤 safety 可信卖点（核心差异化）
- 校验脚本：`scripts/verify-data-consistency.js`（待建，diff 文章 config snapshot vs 当前 JSON，不一致报警）

---

## 8. 内链规则（≥ Crystal Meaning + condition + intention + cleansing-timer）

每篇内链下限（参照 2A §4.2 博客文章规则）：

| 链接到 | 数量 | 位置 | 锚文本示例 |
|--------|------|------|----------|
| Crystal Single（meaning 页） | ≥3 | 正文首次提及每颗石 | "Selenite, a self-cleansing stone" → /gemstone/selenite-meaning/ |
| Crystals by Condition | ≥1 | M4 推荐区 | "Crystals for Anxiety" → /crystals-for-anxiety/ |
| Intention Page | ≥1 | M4/M6 CTA | "Shop Calm & Mindfulness" → /calm-mindfulness/ |
| **cleansing-timer 工具（决策卡片，非普通内链）** | **≥1（H1/H2/H3/H4/H7）** | **M3 末决策卡片 + M5/M7** | 见 §7.1 决策卡片组件（独立 callout box，非文字内链） |
| **H1 主旗舰（概念完整对照，v2 防重复）** | **≥1（H2/H3/H4 必链）** | **M2 概念区分段末** | "For the full four-concept comparison, see How to Cleanse Crystals" |
| Shop 总类目 | ≥1 | M4/M6 末 | "Shop healing crystal jewelry" → /product-category/healing-crystals-jewelry/ |

**内链防重复规则（v2 第二轮第 2 点）**：H2/H3/H4 的概念区分段只内链 H1 一次（看完整四概念对照），不在本篇重复完整表。H1 ← H2/H3/H4 的回链锚文本必须明确"full comparison / four-concept"意图，避免与 H1 自身概念段重复内容。

**横向互链矩阵**（主题集群内部）：
- H1（Cleanse）↔ H2（Charge）：M2 讲"先清后充"互链
- H3（Activate）↔ H4（Program）：M2 讲"开机 vs 装软件"互链
- H1 ↔ H7（Bracelet）：H1 M6 链 H7 深入版，H7 顶部链 H1 总版
- H6（总览 Use）→ H1-H5 全部（hub 角色，M3 汇总 10 种用法各链专题）

**上限**：正文内链 8-15 个（视篇幅），避免过度。

---

## 9. 图片配置

| 图片类型 | 规格 | 数量 | 内容 |
|---------|------|------|------|
| Hero | 1536×864 | 1 | 主题视觉（如月光下的水晶阵列 / 音钵与水晶 / 手链净化场景） |
| 分步示意图 | 1200×800 | 2-3 | 关键方法步骤图（如 moonlight 放置 / selenite plate 摆放 / smoke 净化） |
| 水晶图 | 复用 390 图库 | 3-5 | M4 推荐水晶图（复用 search-data.json 已有 img） |
| 概念区分图（H1-H4） | 1200×800 | 0-1 | 可选：四概念关系图（Cleanse→Charge→Activate→Program 流程） |
| 首饰场景图（M6） | 1200×800 | 1 | 手链/项链佩戴净化场景（差异化视觉） |

**文件名规范**：`how-to-{action}-crystals-{scene}.jpg`（如 `how-to-cleanse-crystals-moonlight.jpg`）
**Alt 规范**：描述性，含主词（如 "How to cleanse crystals with moonlight overnight"）
**Caption**：一句 ritual 用途说明

**生图脚本**：复用 `9.angel-numbers/scripts/` 同款 generate-images.js 模式（需设 `NODE_PATH` 指向全局 sharp，按 `crystal-scripts-nodepath-sharp` memory）。Hero 图不加 "no text"（数字/水晶 graphic 风格，但 How-to 不需画文字，正常加）。

---

## 10. FAQ 三层分层（M7）

### 第一类：主搜索意图（必含 3-4 问）

- How often should I {action} my crystals?
- What is the best way to {action} crystals?
- How long does it take to {action} a crystal?
- Can I {action} all crystals the same way?（H1 必含，引出 safety 差异化）

### 第二类：高转化意图（必含 2-3 问）

- Which crystals need {action}ing most?（接 M4 推荐）
- Can I {action} my crystal bracelet without removing it?（接 M6 首饰场景）
- Do I need any tools to {action} crystals?（接 cleansing-timer CTA）

### 第三类：信任与合规（必含 2 问）

- Is there scientific evidence that {action}ing crystals does anything?（**中性答**：清洁是真实矿物护理；能量净化是传统信仰，no scientific evidence that crystals store/release energy，但可作为正念仪式）
- Will {action}ing damage my crystal?（引出 safety + cleansing-timer 工具价值）

**选做**（按文章适用性）：
- H1：Can I cleanse crystals with tap water? / Which crystals cannot go in water?（safety 长尾）
- H2：What's the difference between cleansing and charging?（概念区分长尾）
- H3：Do I need to activate a new crystal? / What happens if I don't activate it?
- H4：Can I program a crystal for someone else? / How many intentions can one crystal hold?

**合规要求**：FAQ 答案与 Schema FAQPage 严格一致（不加额外问题）。

---

## 11. 合规（不疗效 claim）+ 合规转化句式库 + 去AI化禁词

### 11.1 合规（遵循品牌语调 §4）

**禁用表达**（本批次重点）：
- ❌ "Cleansing removes negative energy / purifies bad vibes"
- ❌ "Charging amplifies the crystal's healing power"
- ❌ "Activating awakens the crystal's magical properties"
- ❌ "Programming makes the crystal work for you"（绝对化）
- ❌ "This method will protect you from negativity"

**推荐表达**：
- ✅ "Cleansing is traditionally seen as resetting a stone's symbolic energy state"
- ✅ "Many people cleanse new crystals as a way to mark them as their own"
- ✅ "Charging is the ritual of replenishing a stone's symbolic energy after cleansing"
- ✅ "Use crystals as mindfulness reminders, not as medical or professional substitutes"

**固定 Gentle Note**（M7 FAQ 前，全站统一组件）：
> "Crystal cleansing, charging, and activation practices are based on spiritual traditions, symbolism, and personal mindfulness. There is no scientific evidence that crystals store or release energy, but the safety guidance (which stones tolerate water, sun, or salt) is real mineralogy — and the reason a mindful ritual can coexist with caring for your stones."

**safety 事实可硬陈述**（不属于疗效 claim）：selenite 忌 prolonged water exposure、amethyst UV 褪色、malachite 含铜遇水/盐/酸——这些是矿物学事实（措辞按 §4.3 校准表），强化可信度，必须写且标来源。

### 11.2 合规转化句式库（v2 新增，第二轮第 5 点）

> **核心原则**：卖点基于 **体验 / 仪式 / 美感 / 日常提醒 / 收藏**，**非功效**。所有 crystal recommendation + jewelry CTA 必须从句式库选范式，不临场编功效句。

**10+ 合规转化句式范式**（生产时按场景套用）：

| # | 场景 | ❌ 功效句（禁用） | ✅ 合规转化句（采用） |
|---|------|----------------|-------------------|
| 1 | Rose Quartz 推荐 | "Attracts love and romance" | "A rose quartz bracelet many people wear as a **daily reminder to be gentle with themselves**" |
| 2 | Amethyst 推荐 | "Calms anxiety and aids sleep" | "A stone many keep on their nightstand as part of a **wind-down ritual** before bed" |
| 3 | Black Tourmaline 推荐 | "Blocks negative energy / EMF" | "A popular choice for those who like a **grounding touchstone** during a busy workday" |
| 4 | Citrine 推荐 | "Attracts wealth and abundance" | "Often associated with warmth and sunlight — a piece many enjoy as a **bright accent in a collection**" |
| 5 | Clear Quartz 推荐 | "Amplifies healing energy" | "A versatile piece collectors often describe as a **neutral staple** that pairs with any setting" |
| 6 | Selenite 推荐 | "Cleanses other crystals' energy" | "A self-cleansing stone many use as a **display plate to rest other pieces on** — a practical care choice" |
| 7 | Moonstone 推荐 | "Enhances intuition and fertility" | "A stone many choose for its **soft iridescent sheen** and connection to lunar ritual traditions" |
| 8 | 首饰 CTA | "Wear this bracelet for protection" | "Wear it as a **daily reminder of an intention you've set for yourself**" |
| 9 | 净化 ritual | "Removes negativity from your space" | "A **mindful monthly ritual** — a moment to pause, reset, and care for your pieces" |
| 10 | 激活 ritual | "Awakens the crystal's power" | "Marking a new piece as **your own** — a small ceremony that turns an object into a personal keepsake" |
| 11 | 编程 ritual | "Program the crystal to manifest your goals" | "Setting an **intention or affirmation** you'd like to carry with you — the stone becomes a tactile cue for that thought" |
| 12 | 收藏角度 | "Invest in powerful healing stones" | "Build a **thoughtful collection** — each piece chosen for its character, origin story, or place in a ritual practice" |

**句式库使用规则**：
- M4 每颗水晶描述、M6 首饰 CTA、M3 方法 best for 段落 → 从句式库选范式，可微调但不得越界成功效句
- 合规校验脚本扩展：除原有 riskwords，新增"功效句检测"（grep "attracts love/blocks negative/amplifies healing/heals/cures/treats" 等模式，命中即报警）

### 11.3 去AI化禁词

- 禁用：delve / tapestry / realm / journey（叙事）/ unlock your potential / manifest abundance / elevate your vibration
- 化学式大写规范：SiO₂（非 sio₂）/ CaCO₃ / Ag₂S，校验用 `includes('sio₂')` 小写查真违规（按 `validate-riskwords-case-sensitive` memory，不用 /i regex）
- 句式轮换：M3 每个方法卡用 3-4 套句式变体（对齐 Angel-Numbers v2 §3），避免 7 个方法同结构句

### 11.4 三视角自然融入示例

> "Moonlight is reflected sunlight at roughly 1/400,000 the intensity of direct sun — making it one of the safest light methods for color-sensitive stones like amethyst and rose quartz (science). Traditionally, the full moon is considered a meaningful time to reset a stone's symbolic energy (spirituality). For many people, the act of placing crystals under the moonlight also becomes a monthly mindfulness ritual — a moment to pause and set intentions for the cycle ahead (psychology)."

不单独标 "(science)" "(spirituality)"，融在一段里。

---

## 12. Schema 配置（Rank Math）+ HowTo 重构 + 工具/文章分工

### 12.1 Schema 总览

| Schema | 何时配 | 字段 |
|--------|--------|------|
| **Article** | 每篇必配 | headline / datePublished / dateModified / author |
| **FAQPage** | M7（每篇必配） | 问题答案与页面可见 FAQ **严格一致**（同数据块生成页面 + schema，见 12.3） |
| **HowTo** | **H1/H2/H3/H4 必配**（核心差异化） | 6 步通用操作流程（见 12.2），**不是 7 个方法 = 7 步** |
| **BreadcrumbList** | 每篇 | Home > Blog > How to {Action} Crystals |

### 12.2 HowTo Schema 重构（v2 第一轮第 6 点）

**核心改动**：原方案把 7 个方法当成 7 个顺序 step（错误），重构为 **6 步通用操作流程**，7 方法是 **step③ "choose safe cleansing method" 的选项**（不是顺序步骤）。

**H1 HowTo 6 步通用流程**：

| Step | name | text（知识性安全步骤，与工具页 step 文本明显不同） |
|------|------|----------------------------------------------|
| ① | Identify your crystal & jewelry setting | 确认石种（影响耐受性）+ 首饰材质（弹力绳/金属链/编织绳，影响方法选择） |
| ② | Check water / salt / sun tolerance | 查 mineral-safety-reference.json 或 cleansing-timer 工具，确认该石能否接触水/盐/阳光 |
| ③ | Choose a safe cleansing method | **从 7 法中选**（🟢 moonlight/selenite/sound 最安全 → 🟡 smoke/water 有条件 → 🔴 earth/salt 谨慎）；不确定优先无接触法 |
| ④ | Prepare space & materials | 准备空间（通风 if smoke）+ 材料（selenite plate / singing bowl / 耐火容器） |
| ⑤ | Cleanse for recommended time | 按该方法推荐时长（moonlight 8+ hrs / sound 5-10 min / smoke 30-60 sec） |
| ⑥ | Dry / store / charge / wear mindfully | 干燥收纳（water 法后）→ 可选充能 → 佩戴时作为正念提醒 |

**关键字段**：
- `name`：`How to Cleanse Crystals Safely`
- `totalTime`：填最常用方法时长（如 moonlight PT8H）
- `step[]`：6 步（不是 7 步）
- `supply[]` / `tool[]`：可选配件（selenite plate / singing bowl / sage / 耐火容器）
- step③ text 必须明确"7 法是选项之一"，不是"做完 7 步"

### 12.3 FAQ 页面 vs Schema 一致性（v2 第一轮第 6 点）

**FAQ 答案必须与 Schema FAQPage 严格一致**——同数据块生成页面可见 FAQ + Schema，不得手工分写导致不一致。

**实现**：generate-articles.js 从 `faq_picks` config 字段生成同一份 FAQ 数据 → 同时写入页面 HTML（M7）+ Rank Math FAQPage schema。校验脚本 diff 两处文本必须 0 差异。

### 12.4 工具页 vs 文章页 HowTo 分工（v2 第二轮第 4 点，防双占位）

> **问题**：同站同主题的文章 + 工具都打 HowTo，Google 只选一个富结果（内部竞争，互相蚕食）。
> **解决**：切分职责，step 文本明显不同，URL 意图错开（见 §1）。

| 维度 | 工具页 HowTo（cleansing-timer） | 文章页 HowTo（how-to-cleanse-crystals） |
|------|------------------------------|--------------------------------------|
| **主攻 URL/KW** | "crystal cleansing timer" / "tool" | "how to cleanse crystals" |
| **聚焦** | **交互式操作流程**（选石 → 检查 → 倒计时） | **知识性安全步骤教学**（6 步通用流程） |
| **step 文本风格** | 动作指令式（"Enter stone name → Click check → Start timer"） | 知识教学式（"Identify your crystal → Check tolerance → Choose safe method"） |
| **totalTime** | 用户实时倒计时（动态） | 推荐时长（静态 PT8H） |
| **差异化验证** | 发布前对比两 URL 的 HowTo step name+text，确保明显不同（同主题不同 step 文本） | 同左 |

**双占位自查**：发布后在 Google Rich Results Test 对比两 URL，确认 Google 不会因 step 雷同而合并/降权。

---

## 13. 数据层 config 字段设计（含数据快照版本号 + 触发器）

建 `_shared/how-to-config.json`（7 篇配置，参数化生成骨架）。**v2 新增 `data_snapshot` 块**（第二轮第 3 点，防单点故障）：

```json
{
  "article": "H1",
  "slug": "how-to-cleanse-crystals",
  "url": "/blog/how-to-cleanse-crystals/",
  "action": "cleanse",
  "action_gerund": "cleansing",
  "title": "How to Cleanse Crystals: 7 Safe Methods (With Steps & Timer)",
  "h1": "How to Cleanse Crystals",
  "primary_kw": "how to cleanse crystals",
  "secondary_kw": ["how to cleanse a crystal", "cleansing crystals", "crystal cleansing methods"],
  "word_target": 3400,
  "quality_tier": "flagship",
  "concept_focus": "full_comparison + cleanse vs charge（H1 唯一完整四概念表）",
  "methods_used": ["moonlight", "selenite", "sound", "smoke", "water", "earth", "salt"],
  "methods_subset": null,
  "methods_risk_tiers": {
    "tier1_safe": ["moonlight", "selenite", "sound"],
    "tier2_conditional": ["smoke", "water"],
    "tier3_caution": ["earth", "salt"]
  },
  "crystals": {
    "main_commercial": {"slug": "black-tourmaline", "role": "frequent-wear"},
    "semantic_match": {"slug": "selenite", "role": "self-cleansing"},
    "entry_price": {"slug": "clear-quartz", "role": "amplifier"},
    "niche": {"slug": "carnelian", "role": "long-tail"},
    "safety_warning": {"slug": "malachite", "role": "porous-copper-bearing"},
    "jewelry_scene": {"slug": "rose-quartz", "role": "bracelet"}
  },
  "data_snapshot": {
    "cleansing_knowledge_version": "v1.2",
    "mineral_safety_reference_version": "v1.0",
    "crystal_attributes_version": "v1.1",
    "verified_date": "2026-06-28",
    "verified_by": "数据一致性 diff 脚本 + 人工抽检"
  },
  "tool_cta": {
    "enabled": true,
    "tool": "cleansing-timer",
    "cta_type": "decision_card",
    "positions": ["M3-end-decision-card", "M5-end-reminder", "M7-pre-bottom"]
  },
  "jewelry_angle": {
    "enabled": true,
    "mode": "interspersed（穿插全文，非 M6 集中）",
    "insertion_points": ["M3-moonlight", "M3-water", "M3-salt", "M3-selenite", "M5-mistakes", "M7-faq"],
    "m6_role": "summary + H7 deep-dive link（不深入材质细节）"
  },
  "eastern_touch": "Tibetan singing bowl + cedar smoke (avoid sage-only framing)",
  "faq_picks": {
    "intent": ["how often", "best way", "how long", "all same way"],
    "conversion": ["which need most", "bracelet without removing", "tools needed"],
    "trust": ["scientific evidence", "damage risk"]
  },
  "internal_links": {
    "meaning_min": 3,
    "condition": "crystals-for-anxiety",
    "intention": "calm-mindfulness",
    "hub_flagship": null,
    "shop_fallback": "/product-category/healing-crystals-jewelry/"
  },
  "schema": {
    "types": ["Article", "FAQPage", "HowTo", "BreadcrumbList"],
    "howto_structure": "6-step universal flow（非 7 法 = 7 步）",
    "howto_focus": "knowledge safety steps（vs 工具页 interactive flow）"
  },
  "compliance": {
    "avoid": ["removes negative energy", "purifies bad vibes", "amplifies healing power"],
    "phrase_library_version": "v1.0（§11.2 合规转化句式库）"
  }
}
```

**字段说明**：
- `methods_used` 必须是 `_shared/cleansing-knowledge.json` 的 key 子集（单源校验）
- `crystals.*.slug` 必须存在于 `_shared/crystal-attributes.json`（390 颗之一）
- `shop_fallback` 默认 healing-jewelry，生产时按 §5 逐颗验证覆盖
- `tool_cta.enabled` 控制是否加 cleansing-timer 联动
- `quality_tier`：flagship / hub / lightweight，决定资源投入 + 质量门分级（§0）
- `data_snapshot.*`（v2 新增）：记录生产时数据源版本号 + 校验日期，JSON 改动时触发文章更新（见 §7.3 + §14.5）

---

## 14. 生产流程（先 H1 MVP 验证 → 固化模板 → 批量化）+ 阶段4 KPI + 维护责任清单

### 阶段 1：Brief 审核（当前步骤）

1. 本框架文档审核通过（用户确认 7 篇清单 / 模块结构 / 概念区分表 / 差异化角度 / 资源 ROI 分配）
2. 锁定每篇 config 字段（`_shared/how-to-config.json` 7 篇 × 完整配置，含 data_snapshot）

### 阶段 2：H1 MVP 先行验证（v2 第一轮第 10 点，不批量）

> **核心原则**：先产 H1 单篇验证（结构顺 / M2 概念重不重 / M3 模板感 / CTA 位置 / 首饰自然 / Shop 验证 / Schema 稳定 / 图片投入值），**验收通过后再固化模板放大 H2-H7**。不一次性批量 7 篇。

**H1 MVP 验证清单（8 项，全过才固化模板）**：
1. **结构顺**：M1 安全优先首屏 → M2 安全风险前置 → M3 风险分层，叙事流畅不突兀
2. **M2 概念重不重**：完整四概念表只出现一次（H1），后续不重复（自检 grep "四概念" 只命中 M2 一处）
3. **M3 模板感**：7 法卡片句式有 3-4 套变体，非雷同结构；method-specific safety notes 不重复全表
4. **CTA 位置**：决策卡片在 M3 末自然出现，非硬塞；首饰穿插点（§6.1）自然融入
5. **首饰自然**：穿插提示不生硬（water 法提弹力绳 / salt 法提金属链 / moonlight 提无接触）
6. **Shop 验证**：M4 每颗 Shop 链接全 200（Python urllib + UA 实测）
7. **Schema 稳定**：HowTo 6 步通用流程在 Rich Results Test 通过，不与工具页 step 雷同
8. **图片投入值**：hero + 分步图 + 首饰场景图，投入产出比合理（旗舰级才全套，轻量级精简）

**H1 MVP 生产步骤**：
1. **竞品研究**（按 `seo-content-research-competitor-first` memory）：serp_check 主词 + webReader 抓 5+ 竞品文章结构（H2/FAQ/PAA），**不能凭通识写**
2. **数据校验**：diff `_shared/cleansing-knowledge.json` + `mineral-safety-reference.json` 确认 method/时长/safety/措辞一致；逐颗验证 Shop CTA 3 级优先
3. **骨架生成**：generate-articles.js 读 config 产出占位骨架（M1-M7 + FAQ + Schema，含 data_snapshot）
4. **AI workflow 填充**：按 concept_focus / 三视角 / Eastern 调性 / 首饰穿插 / 合规转化句式库填充
5. **合规校验**：riskwords 校验（区分大小写）+ 功效句检测（§11.2）+ Gentle Note + FAQ 中性答
6. **二审**：概念区分准确性（防重复规则）+ cleansing-timer 决策卡片数据一致 + 内链 ≥ 下限 + Shop 全 200 + 首饰穿插点齐全
7. **图片**：generate-images.js 生 hero + 分步图 + 首饰场景图（设 NODE_PATH 全局 sharp）
8. **上传 draft**：WordPress REST + Rank Math updateMeta（含 dateModified + schema）
9. **工具反向回链**：更新 `cleansing-timer/build/seo-content.html` 加本篇 deep guide 链接

### 阶段 3：批次化（H1 MVP 验收通过后，固化模板放大）

10. **固化模板**：H1 验收通过后，把骨架生成 + 校验脚本固化为可复用 SOP
11. H2（旗舰级）→ H6（枢纽级）→ H3/H4/H5/H7（轻量级批量化），按资源 ROI 分级投入（§0）
12. 轻量级分批 5 篇并行（按 `claude-code-yolo-panel-overload` memory 控并发）
13. 全部 publish 后建主题集群 hub（H6 总览页承担 hub 角色 + crystal care sequence 流程图）

### 阶段 4：上线后 KPI 评估（v2 新增，第二轮第 6 点）

> 发布后 **8-12 周**评估，定义迭代触发条件。旗舰级（H1/H2）必跑，轻量级按需。

**KPI 评估表**：

| 维度 | 指标 | 达标线 | 迭代触发条件 |
|------|------|--------|------------|
| **主词排名** | H1/H2 主词 GSC 排名 | 进前 10 | 12 周未进前 20 → 内容深度/外链/TKD 复盘 |
| **工具 CTA CTR** | 文章 → cleansing-timer 点击率 | ≥ 3% | < 1% → 决策卡片位置/文案优化 |
| **首饰类目价值** | M6/M4 首饰段带来的页面转化价值 | 有首饰类目进入 top10 转化页 | 0 转化 → 首饰 CTA 文案/位置调整 |
| **FAQ PAA 命中** | 哪些 FAQ 命中 Google PAA | ≥ 2 问命中 | 0 命中 → FAQ 选词对标 PAA 重写 |
| **Schema 富结果** | HowTo/FAQPage 富结果展示 | 正常展示 | 未展示 → Schema 格式排查 |
| **内链传递** | H6 hub → H1-H5 点击流 | 各篇有 hub 入站流量 | 某篇 0 入站 → hub 内链位置优化 |

**评估工具**：GSC（排名/CTR）+ GA4（CTR/转化/PAA）+ Rich Results Test（Schema）+ 站内点击热图（CTA 位置）。

**迭代触发流程**：KPI 不达标 → 记录到维护日志 → 优先级排序 → 按资源 ROI 决定优化哪些（旗舰优先）。

### 14.5 维护责任清单（v2 新增，第二轮第 7 点）

> **核心问题**：内容上线后多个上游变更会致文章失真/死链，需明确谁定期检查、走什么流程通知文章侧。

**维护责任矩阵**：

| 变更源 | 影响范围 | 责任人 | 检查频率 | 触发流程 |
|--------|---------|--------|---------|---------|
| **Shop 类目改版** | M4/M6 Shop CTA 批量死链（类目 slug 变/下架） | 内容 + 运营 | **月度**跑 Shop CTA 200 检查脚本 | 死链 → 按 §5 3 级优先重新匹配 → 批量更新文章 + dateModified |
| **工具改版**（cleansing-timer） | 工具反向回链失效（URL 变/页面下线） | 工具 + 内容 | 工具发版即查 | 工具 URL 变更 → 通知内容侧 → 更新所有文章决策卡片 CTA 链接 |
| **JSON 数据改动**（cleansing-knowledge / mineral-safety-reference / crystal-attributes） | 文章 M3 数据失真（时长/safety/措辞与工具不一致） | 数据 + 内容 | JSON 改动即触发（§7.3 触发器） | JSON 改动 → 触发器脚本扫描所有引用该数据的文章 → 更新 dateModified + 重新复核 M3 段落 |
| **新专题页上线**（如新 intention/condition/gemstone-meaning） | H6 hub 内链补链机会 | 内容 | 新页上线即查 | 新页上线 → H6 hub M3 汇总段评估是否补链 → 相关文章 M4 评估补 meaning 链 |
| **竞品内容更新** | 旗舰级（H1/H2）内容深度落后 | 内容 | **季度**serp_check + webReader 复查竞品 | 竞品新增深度段落 → 评估是否补强 H1/H2 |

**Shop CTA 200 检查脚本**（待建）：`scripts/check-shop-cta-status.js`，扫描所有 how-to 文章的 Shop 链接，月度跑，输出死链报告。

**JSON 变更通知流程**（§7.3 触发器落地）：
1. 任何人修改 `_shared/*.json` → 在 PR/commit message 标注 `[triggers-article-update]`
2. CI 脚本（或手动）跑 `verify-data-consistency.js` → 扫描 `how-to-config.json` 所有 `data_snapshot` → diff 当前 JSON version vs 文章记录 version
3. 不一致 → 列出受影响文章 → 通知内容侧更新 dateModified + 复核 M3

**维护日志**：建 `_shared/maintenance-log.md`，记录每次维护（日期/变更源/影响文章/处理结果），便于追溯。

---

## 15. 与现有框架的对齐说明（15 节结构对齐 Chakra/Angel v2）

| 维度 | 对齐对象 | 对齐点 |
|------|---------|--------|
| 模块表格式 | Chakra v2 §2 / Angel-Numbers v2 §2 | 7 模块 + H2 + 词数 + 要点列，核心模块 ⭐ 标注 |
| 三视角融入 | Chakra v2 §11 / 品牌语调 §1 | 科学+灵性+心理，不单独标注，融在段落 |
| 合规措辞 | 品牌语调 §4 + Chakra v2 §11 | traditionally / many people / no scientific evidence 三句话框架 + **§11.2 合规转化句式库（v2 独有）** |
| 工具联动 | Chakra v2 §10（chakra-test）/ Element v2 / 互动工具框架 | 双向 CTA + 数据单源 + 校验一致 + **决策卡片 CTA（v2 独有，非普通内链）** |
| 水晶内链平衡 | Angel-Numbers v2 §3 | 5-6 角色分配，避免集中链热门石 |
| Shop CTA | shop-cta-no-deadlink-rule memory | 3 级优先，逐颗 REST 验证 200 |
| 数据层 config | Angel-Numbers v2 §12 | JSON 参数化，单源校验 + **data_snapshot 版本号 + 触发器（v2 独有）** |
| 生产流程 | Angel-Numbers v2 §14 / Chakra v2 | 竞品研究→数据校验→骨架→AI填充→合规校验→二审→图片→上传 + **H1 MVP 先行验证 + 阶段4 KPI + 维护责任清单（v2 独有）** |
| URL 规则 | 2A §二 博客内容页 | `/blog/{slug}` 根级 post + **URL 意图错开防 Schema 双占位（v2 独有）** |
| Schema | Chakra v2 §8 / Angel-Numbers v2 §9 | Article + FAQPage 必配，HowTo 本批次独有（教程类天然适配）+ **6 步通用流程重构 + 工具/文章分工（v2 独有）** |

**本批次独有差异化**（其他框架无，v2 强化）：
1. **概念区分表 + 防重复规则**（M2 §3，竞品最大痛点，完整表只 H1 一次）
2. **首饰角度穿插全文**（§6，站点主营优势，非 M6 集中附加）
3. **cleansing-timer 工具联动 + 决策卡片 CTA**（B4 已建，全行业独有）
4. **HowTo Schema 6 步通用流程**（教程类天然适配，工具/文章分工防双占位）
5. **安全优先首屏叙事**（M1/M2/H3 前置安全风险，v2 独有）
6. **mineral safety 统一校准表**（§4.3，措辞校准避免夸张，v2 独有）
7. **合规转化句式库**（§11.2，12 句范式基于体验非功效，v2 独有）
8. **流量 ROI 资源分配 + 质量门分级**（§0，旗舰/枢纽/轻量三级，v2 独有）
9. **数据快照版本号 + 触发器**（§7.3/§13，防单点故障，v2 独有）
10. **上线后 KPI 评估 + 维护责任清单**（§14 阶段4/§14.5，v2 独有）
