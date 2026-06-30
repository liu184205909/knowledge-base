# ifate.com — 1D 深度拆解

> SERP「free tarot reading」us：**#18**
> 域名：https://www.ifate.com/
> 数据源：截图 7 张 + structure_readable.txt（552 行）+ sitemap。
> 抓取：2026-06-29。
> 注：所有占卜子页截图（tarot/tarot-reading/daily-card/love/yes-no/learn）均为 **Cloudflare 验证页**（"Just a moment... Performing security verification"），交互基于 home + sitemap + 导航推断。

---

## §1 概览

| 项 | 值 |
|---|---|
| 定位 | "The #1 site for astrology and tarot since 2007"，塔罗+易经+占星+数字学综合 |
| SERP | #18 |
| sitemap 页数 | **370**（priority 0.2–1.0 avg 0.81，高优先级维护） |
| 牌背铺开 | 占卜子页（被 Cloudflare 挡，未直拍） |
| 牌阵 | Celtic Cross(10) / PPF(3) / Rune / Angel + **Tarot GPT(AI)** |
| 卖点 | **UGC-free**（零用户生成内容，brand-safe）、award-winning I Ching、indie 开发 |
| 变现 | live advisors (Oranum) 引流 + 广告 |
| 媒体背书 | USA Today（"Generation-Z turns to astrology, and sites like iFate.com"） |

---

## §2 sitemap 结构（370 页）

```
ifate.com/sitemap.xml   (370 页, priority 0.2–1.0 avg 0.81, 370 lastmod)
robots.txt
```
priority avg 0.81（最高均权），370 页全 lastmod，SEO 维护最规范之一。

---

## §3 选牌交互（子页被挡，基于 home 推断）

home 截图显示丰富入口（占卜子页被 Cloudflare 挡未直拍）：
- `start this reading` 入口（如 Celtic Cross / The Well rune spread，`tarot-shuffle.html?spread=tcc`）
- home BODY 提到交互逻辑：选 spread → 进 tarot-shuffle 页抽牌

**关键交互线索**（home structure）：
- 占卜通过 `?spread=` 参数选择牌阵（如 tcc = Celtic Cross）
- 抽牌在 tarot-shuffle.html（暗示有 shuffle 环节）

**流派**：参数化 spread 选择 + shuffle 页（具体铺开方式未直拍，需绕过 Cloudflare 补抓）。

---

## §4 牌阵种类 / 占卜类型（最多元之一）

**塔罗**：Free Tarot / Celtic Cross(10) / Yes or No / Love Tarot / Tarot Card of the Day / Tarot Horoscopes / **Tarot Flashcards**（学习卡片）/ **Tarot GPT**（AI 塔罗聊天）
**占星**：Today's Horoscopes / Astro Compatibility / Biorhythms（+ Couples）/ Current Planet Positions / Moon Phase Calendar / Astrology Signs / Birth Chart
**易经**：Free I Ching / Love I Ching / I Ching Horoscopes（award-winning）
**数字学**：Name Numerology
**卢恩**：Runes / Rune Meanings（Past Present & Future 3-rune / One Single Rune / The Well）
**其他**：Angel Card / Magic 8 Ball（+ Love/Balanced 变体）/ Pendulum Dowsing / Divination with Dice
**参考**：Tarot Card Meanings / List of Tarot Spreads / I Ching Meanings / Rune Meanings / Free Tarot E-Book（Pictorial Key to the Tarot）

**亮点**：Tarot GPT（AI 聊天）+ Tarot Flashcards（学习）+ Magic 8 Ball + Dice 占卜，形式最多元。

---

## §5 内容深度（强）

- **insight.ifate.com 博客**（22 页，tarot/runes/numerology/astrology/moon/esoteric 深文）
  - 例：3 Tarot Symbols Nobody Notices / Sky Colors on Tarot Cards / Reading Tarot With Playing Cards / Clarifying Cards / Aetts in Rune Reading / Alu Magic Rune Word
- Tarot Card Meanings / Rune Meanings / I Ching Hexagrams 参考
- List of Tarot Spreads（牌阵百科）
- Free Tarot E-Book

---

## §6 变现

1. **live advisors**（Oranum™ 排名，psychic 直播引流，如 LoveExpert1971 / Jennywithlove）
2. 广告（RAPTIVE 类合作）
3. indie 开发（"hand-crafted with pure HTML, javascript"）

---

## §7 视觉/布局

- home 信息密度高（featured / tarot / astrology / i ching / numerology / biorhythms / runes / live advisors 多板块）
- DAILY PICKS / MOST POPULAR 双内容流
- indie 手作风（pure HTML/JS）

---

## §8 优势 / 劣势

**优势**：占卜类型最多元（塔罗+易经+占星+数字学+卢恩+Magic 8 Ball+Dice）；UGC-free brand-safe（广告主友好）；Tarot GPT + Flashcards 创新；USA Today 背书；370 页 SEO 规范。
**劣势**：SERP #18；Cloudflare 严挡（子页抓取难）；indie 站视觉较朴素；变现靠引流（无强自营）。

---

## §9 可抄点

1. **Tarot GPT（AI 塔罗聊天）**：与 tarotoo AI 同向，是 AI 占卜的另一形态（对话式 vs 抽牌式）。
2. **Tarot Flashcards（学习卡片）**：教育内容，提升新手留存。
3. **占卜类型矩阵**（塔罗+易经+占星+数字学+卢恩+Magic 8 Ball）—— 单站多工具互导流，水晶站可做「塔罗+水晶+脉轮+占星」矩阵。
4. **UGC-free brand-safe 定位**：广告主友好（若考虑广告变现）。
5. **`?spread=` 参数化牌阵**：技术实现高效（一套引擎多牌阵）。
6. **Tarot Card Meanings + List of Spreads + Free E-Book 参考**：内容护城河三件套。
7. **待补抓**：Cloudflare 挡住了子页交互，如需详查 ifate 抽牌铺开方式，需带 UA/cookie 绕过补抓。
