# evatarot.net — 1D 深度拆解

> SERP「free tarot reading」us：**#3**
> 域名：https://www.evatarot.net/
> 数据源：截图 7 张（en-home/en-free/en-celtic/en-love/en-yesno/en-card-day/home.desktop）+ structure_readable.txt（441 行）+ sitemap。
> 抓取：2026-06-29。

---

## §1 概览

| 项 | 值 |
|---|---|
| 定位 | Free Tarot Reading: Interactive Experience，虚拟大使 Eva Delattre 解读 |
| SERP | #3 |
| sitemap 页数 | 80（2 个 sitemap.xml 各 40，priority 0.0–1.0 avg 0.29） |
| 牌背铺开 | **横向一排铺开**（金棕复古花纹） |
| 牌阵 | 固定 10 牌（含 Celtic Cross） |
| 变现 | 广告 + /psychic-reading 引流 |
| 语言 | 英/法/西/意多语言 |

---

## §2 sitemap 结构（80 页，2 sitemap）

```
evatarot.net/sitemap.xml       (40 页, priority 0.0–1.0)
evatarot.net/sitemap           (40 页, priority 0.0–1.0)
robots.txt                     (IndexRobotsTxtSitemap)
```
priority 两极分化（0.0–1.0），说明对核心占卜页（priority 1.0）与长尾页做了明确权重分配。

---

## §3 选牌交互（用户认可标杆，重点记录）

**截图证据（en-home.desktop.png）+ structure BODY 双重确认：**

1. **牌背铺开方式**：**横向一排整齐铺开**，牌背为**棕色底色 + 金色花纹**复古设计，每张牌背面图案一致，呈长条形横向排列。
2. **选牌引导**：页面顶部明确 `H2: Choose 10 cards from the deck below`，直接告知选 10 张。
3. **三按钮仪式（核心差异化）**：
   - `Shuffle`（洗牌）—— 白色按钮
   - `Cut`（切牌）—— 白色按钮
   - `Validate`（确认翻牌）—— 白色按钮
   - 模拟真实塔罗「洗→切→确认」三段式仪式，给用户**最强掌控感**。
4. **问题输入框**：`Your question... (optional)` —— **可选非必填**，灰色背景。
5. **仪式文案**：抽牌前 `Please read` → "Before drawing the cards, you need to focus and think about a very precise question. Then choose 10 cards and consult the free interpretation."
6. **品牌叙事**：虚拟大使 Eva Delattre（"I am the virtual ambassador"），灵感来自 19 世纪法国术士 Edmond 的手稿；使用 Rider Waite Tarot + 22 Major Arcana。

### 与标杆对照（evatarot 即标杆本身）
- 牌背横向铺开 ✅
- Choose N 引导 ✅（Choose 10 cards）
- 可选问题输入 ✅
- Shuffle ✅ + Cut ✅（用户认可要点：Shuffle/Cut）
- Validate 确认 ✅（用户认可要点）

> 见 memory `tarot-draw-interaction-preference`：用户认可 evatarot 选牌模式（牌背横向铺开 + Choose N 引导 + 可选问题 + Shuffle/Cut + Validate 确认）。

---

## §4 牌阵种类

固定 **10 牌阵**（Major Arcana 22 张里选 10）。导航的占卜类型：
- Tarot（默认 10 牌）
- Love Tarot（/love-tarot/）
- Yes No Tarot（/tarot-yes-no/）
- Psychic Reading（/psychic-reading/）
- Celtic Cross Tarot（/celtic-cross-tarot/）
- Oracle Cards（/oracle-cards/）
- Angel Tarot（/angel-tarot/）
- Daily Tarot（/daily-tarot/）
- Coming soon：Osho Tarot / Chinese Tarot / Egyptian Tarot / 32 cards

**注意**：所有占卜子页（love/yesno/celtic/card-day）的 H2 都是同一个 `Choose 10 cards from the deck below`，说明 evatarot 把 10 牌交互**统一复用**到所有占卜类型，仅解读文案不同。这是「一套交互引擎 + 多套解读」的高效架构。

---

## §5 内容深度

- 牌意/牌阵：以虚拟大使口吻叙述，偏情感共鸣（"help you gain greater clarity"），非结构化牌意库。
- 学习内容：弱（无系统课程/百科）。
- 品牌故事强：Eva Delattre 人设 + Edmond 手稿典故，强化「传承/可信」。

---

## §6 变现

- 广告位
- /psychic-reading/ 引流真人占卜
- 占卜本身免费、无需注册

---

## §7 视觉/布局

- 深紫渐变 + 黑色背景，神秘复古
- 牌背金棕花纹，衬线字体标题
- 布局：logo + 汉堡导航 → 问题框 + 牌背横排 + 三按钮 → 占卜类型推荐区 → 文字说明（Drawing the cards / Shuffling / Free Tarot / Major Arcana / Who am I）→ 页脚标语 "The future does not just happen. You have to prepare for it."

---

## §8 优势 / 劣势

**优势**：选牌仪式感行业最强（横向铺开 + 三按钮）；统一交互引擎复用到所有占卜类型；品牌人设有记忆点。
**劣势**：牌阵单一（都 10 牌）；内容护城河弱（无牌意库/课程）；变现路径浅（仅广告+引流）。

---

## §9 可抄点（对水晶塔罗工具）

1. **横向铺开牌背 + Shuffle/Cut/Validate 三按钮**（用户已认可，直接采用）。
2. **`Choose N cards` 顶部明确引导** + 倒计数。
3. **可选问题输入框（optional）**：降低门槛又不失个性化。
4. **统一交互引擎复用多占卜类型**：一套选牌交互，配多套解读（爱情/是否/每日…），开发高效。
5. **抽牌前仪式文案**："focus and think about a precise question"，强化仪式与信任。
6. **品牌人设**：虚拟大使叙事，可借鉴为「水晶向导」人设。
