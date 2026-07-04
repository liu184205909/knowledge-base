# TranslatePress 翻译规则与术语表（DeepSeek 引擎输入）

> **用途**：Earthward（goearthward.com）多语言站点的翻译质量根基。本文档是 DeepSeek（或任意 LLM）翻译引擎 `system prompt` 的权威输入，所有自动翻译必须遵循。
> **配套文档**：`TranslatePress-AI翻译方案.md`（引擎选型与部署）、`品牌语调配置.md`（调性权威源）。
> **最后更新**：2026-07-03

---

## 0. 为什么需要这份文档

传统 NMT（DeepL/Google）翻译的"不准"来自品类术语不本地化（"healing crystal" 直译，不用日语「パワーストーン」、法语「lithothérapie」）。
LLM（DeepSeek）的优势恰恰是**能在 prompt 里注入规则、术语、调性**——这是换 LLM 唯一的实质增值。不写规则，LLM 翻译质量不如 DeepL。

**本文档 = 引擎 prompt 的固化输入**。规则不固化，翻译质量随每次请求漂移，无法规模化。

---

## 1. 目标语言清单（13 种翻译目标）

站点已通过 TranslatePress 配置以下语言（hreflang 已确认）：

| 代码 | 语言 | 文字方向 | 备注 |
|------|------|---------|------|
| en-US | 英语（原生） | LTR | 源语言，不翻译 |
| de-DE | 德语 | LTR | 性别、复合词、敬语 Sie/du |
| es-ES | 西班牙语 | LTR | |
| fr-FR | 法语 | LTR | 阴阳性、vous/tu |
| it-IT | 意大利语 | LTR | |
| ja | 日语 | LTR | 敬语、片假名外来词、「パワーストーン」品类词 |
| ko-KR | 韩语 | LTR | 敬语阶称 |
| zh-TW | 中文（繁体） | LTR | 繁体字，台港澳用语 |
| nl-NL | 荷兰语 | LTR | |
| pl-PL | 波兰语 | LTR | |
| id-ID | 印尼语 | LTR | |
| pt-BR | 葡萄牙语（巴西） | LTR | 巴西用法，非欧洲葡语 |
| ar | 阿拉伯语 | **RTL** | 右起排版，需镜像 UI |

**特化注意（§8 详述）**：阿拉伯语 RTL 布局、日韩敬语阶称、德法语人称/阴阳性、中文繁简与本地用语。

---

## 2. 原文净化（翻译前置层，最关键）

> **铁律：垃圾进，垃圾出。** 翻译前必须先识别并修复英文原文的问题，否则错误被复制到 13 种语言。

### 2.1 已知原文问题（2026-07-03 首页抽样）

| 问题类型 | 示例（首页实测） | 处理 |
|---------|----------------|------|
| **乱码/错字** | "Prokchion"、"Potitiviby"、"Forlify"、"Virion"、"Thher Powver"、"illumine" | 翻译引擎识别到非常规英文词时，标记 `needs_review`，不强行翻译 |
| **品牌名残留** | 首页 testimonials 4 处 "Lucky Crystals"（应为 Earthward） | 见 §4.2 不译品牌词，强制替换 |
| **中式英语/直译腔** | "diamond" 指水晶（应为 crystal）、"a whispering stone" | 引擎按品类语境校正 |
| **医疗/绝对化表述** | 残留的 cure/heal/protect from harmful energy | 按 §5 禁用词替换 |

### 2.2 引擎侧净化规则（写入 prompt）

```
翻译前先评估原文质量：
1. 遇到非常规英文词（拼写错误、占位符乱码如"Prokchion"），不要臆测翻译，
   该字符串标记 [[NEEDS_SOURCE_FIX]] 原样返回。
2. 遇到 "Lucky Crystals" 一律视为 "Earthward" 处理（已知品牌名残留 bug）。
3. "diamond" 在水晶品类语境下指 "crystal/stone"，按品类词翻译。
4. 原文含 cure/heal/guarantee 等禁用词时，按 §5 替换表改写后再译。
```

> **根治建议**：英文原文本身的乱码和品牌残留应在源头修复（修首页 testimonials 区和产品描述），而非依赖翻译层兜底。本层是"在源头修好之前"的护栏。

---

## 3. 术语表 Glossary

### 3.1 品类核心词（13 语言映射）

> 这是**各市场真实搜索词**，不是字典直译。下方表格基于各市场水晶/疗愈品类的实际用语；标注 ⚠️ 的需用 SEMrush / Google Suggest 二次验证（参考 `seo-demand-validation-three-sources` 记忆的三源验证法）后再定稿。

| 英文（源） | de 德 | es 西 | fr 法 | ja 日 | ko 韩 | it 意 | zh-TW 繁中 |
|-----------|-------|-------|-------|-------|-------|-------|-----------|
| healing crystals | Heilsteine | piedras de sanación | lithothérapie / pierres de guérison | パワーストーン | 파워스톤 | pietre curative | 能量水晶 / 礦石 |
| crystal jewelry | Kristallschmuck | joyería de cristales | bijoux en cristal | クリスタルジュエリー | 크리스탈 주얼리 | gioielli in cristallo | 水晶飾品 |
| crystal bracelet | Heilsteinarmband / Natursteinarmband | pulsera de cristales | bracelet en pierre naturelle | 天然石ブレスレット | 천연석 팔찌 | bracciale in pietra naturale | 礦石手鍊 / 水晶手鍊 |
| gemstone | Edelstein | piedra preciosa | pierre précieuse | ジェムストーン / 宝石 | 보석 | pietra preziosa | 寶石 |
| amethyst | Amethyst | amatista | améthyste | アメジスト | 자수정 | ametista | 紫水晶 |
| rose quartz | Rosenquarz | cuarzo rosa | quartz rose | ローズクォーツ | 장미석 / 로즈쿼츠 | quarzo rosa | 粉水晶 / 薔薇石英 |

| 英文（源） | nl 荷 | pl 波 | id 印尼 | pt-BR 巴西葡 | ar 阿拉伯语（RTL） |
|-----------|-------|-------|---------|-------------|------------------|
| healing crystals | geneeskrachtige stenen | kamienie lecznicze | batu kristal / batu energi | pedras de cura / litoterapia | أحجار الشفاء |
| crystal jewelry | kristallen sieraden | biżuteria z kryształów | perhiasan kristal | joias de cristal | مجوهرات الكريستال |
| crystal bracelet | armband van natuursteen | bransoletka z kamienia | gelang batu alam | pulseira de cristais | سوار من الأحجار الطبيعية |
| gemstone | edelsteen | kamień szlachetny | batu permata | pedra preciosa | حجر كريم |
| amethyst | amethist | ametyst | batu kecubung | ametista | جمشت |
| rose quartz | rozenkwarts | różowy kwarc | kuarsa mawar ⚠️ | quartzo rosa | الكوارتز الوردي |

**使用规则**（写入 prompt）：
- 上述品类词为**强制映射**，遇到源词必须用对应译法，不得自由发挥或字典直译。
- 同一源词在一种语言里有多个候选时（如 fr "healing crystals" = lithothérapie 或 pierres de guérison），按上下文选：**品类总称/类目页用本地品类词（lithothérapie），具体产品描述用描述性译法（pierres de guérison）**。

> **代码真源说明**：本表为方法论 + 候选词库。引擎实际生效的术语表以 `earthward-deepseek-translatepress.php` 的 `default_glossary()` 为准（每个源词取单一译法，如 de crystal bracelet 取 `Natursteinarmband`、fr healing crystals 取 `pierres de guérison`、id rose quartz 取 `kuarsa mawar`）。定稿改词优先改代码（或用 `earthward_deepseek_glossary` filter 覆盖），本表随之同步。所有 ⚠️ 标注的词待 SEMrush 验证（参考 `seo-demand-validation-three-sources`）。

### 3.2 石种名术语表

**数据源**：390 颗水晶 JSON 位于 `1.crystal-meaning/`（含 crystal-profile 全属性，参考记忆 `tool-data-layer-390-crystals`、`crystal-content-recovery`）。

**方法论**（不穷举，给扩展流程）：
1. 从 390 颗 JSON 抽取 `name` 字段作为英文源词。
2. **Top 30 高频石种**（覆盖首页/Shop/Intention 页 90% 出现）必须人工审定 13 语言译法，写入术语表。
3. 其余 360 颗：用 DeepSeek 批量生成 13 语言译法 → 抽样校验 → 入库。
4. **校验原则**：
   - 优先用各市场**矿物学通用名**（拉丁学名的本地音译），不用直译。
   - 日韩优先用片假名/外来词音译（Amethyst → アメジスト/자수정），这是当地水晶市场惯例。
   - 阿拉伯语用矿物学标准译名（参考维基百科阿语版）。

**Top 10 石种示例**（完整 30 颗待补，需 SEMrush 验证搜索量）：

| 英文 | ja | fr | de | es | zh-TW |
|------|----|----|----|----|------|
| Clear Quartz | クリアクォーツ | quartz clair | Bergkristall | cuarzo transparente | 白水晶 |
| Citrine | シトリン | citrine | Citrin | citrino | 黃水晶 |
| Black Tourmaline | ブラックトルマリン | tourmaline noire | schwarzer Turmalin | turmalina negra | 黑碧璽 / 黑電氣石 |
| Smoky Quartz | スモーキークォーツ | quartz fumé | Rauchquarz | cuarzo ahumado | 茶水晶 / 煙水晶 |
| Moonstone | ムーンストーン | pierre de lune | Mondstein | piedra lunar | 月光石 |
| Labradorite | ラブラドライト | labradorite | Labradorit | labradorita | 拉長石 |
| Selenite | セレナイト | sélénite | Selenit | selenita | 雪花石膏 / 月光石膏 |
| Carnelian | カーネリアン | cornaline | Karneol | cornalina | 紅玉髓 |
| Obsidian | オブシディアン | obsidienne | Obsidian | obsidiana | 黑曜石 |

> ⚠️ 中文译名注意：大陆矿物学界用「碧璽/電氣石」「黃玉」等，台港水晶消费市场常用「碧璽/紫黃晶」等通俗名。zh-TW 目标取**台港消费市场通俗名**，非学界规范名。

### 3.3 不译品牌词（强制保留英文）

以下词汇**任何语言下保持英文原文**，不得翻译：

- **品牌名**：Earthward（含已知 bug "Lucky Crystals" 一律校正为 Earthward）
- **域名/URL**：goearthward.com
- **Tagline**：`Return to what's real.`（品牌口号，部分场景保留英文原句作为品牌识别，不译；若需本地化则按 §4.1 品牌调性意译）
- **产品系列名/SKU**：保留英文（如 Energy Bracelet 系列名在非英语页面可保留 "Energy Bracelet" 或加注本地词，不强制全译）
- **石种英文名的二次提及**：在已给出本地译法的段落里，括注英文原名（如「アメジスト（Amethyst）」）便于国际客户对照

### 3.4 玄学/灵性术语（统一译法）

| 英文 | 译法原则 | ja 示例 | fr 示例 |
|------|---------|---------|---------|
| chakra | 各语言音译或本地化术语（不直译"轮"） | チャクラ | chakra |
| aura | 音译 | オーラ | aura |
| cleansing（水晶净化） | 描述性译法，非"清洗" | 浄化 | purification / nettoyage énergétique |
| intention（意图设定） | 意图/愿望 | インテンション / 意図 | intention |
| manifest / manifestation | 显化（按品牌调性，不夸大） | 顕現化 / マニフェスト | manifestation |
| grounding | 接地/稳定（描述性） | グラウンディング | ancrage |
| vibration / frequency | 能量频率（描述性） | 波動 / ヴァイブレーション | vibration / fréquence |
| full moon | （月相净化场景）满月 | 満月 | pleine lune |

> ⚠️ 玄学术语是**合规风险区**。按品牌语调配置 §4，"magic/supernatural power" 禁用，改为 "meaningful ritual / symbolic intention"。术语表里的玄学词全部走"描述性/传统语境"译法，不暗示超自然力量。

---

## 4. 品牌调性（翻译时必须维持）

> **权威源**：`品牌语调配置.md` §0、§1。本节为翻译场景的提炼，遇冲突以品牌语调配置为准。

### 4.1 调性关键词

**沉稳、自然、有方向感、道德采购、真实 / 温和、可信、灵性但不玄乎**。

翻译时语气对标：**像懂水晶的朋友和向导，不像夸张销售员**。不硬推、不恐吓、不绝对化。

### 4.2 各语言调性落地

- **日韩**：用敬体（日语「です/ます」、韩语「-습니다/-ㅂ니다」或「-해요」视场景）。语气柔和但不卑微。
- **德语**：用 Sie（尊称）还是 du 取决于场景——品牌叙事/About 用 du（亲近感），政策/FAQ 用 Sie。**全站统一**：品牌内容统一用 **du**（Earthward 定位年轻灵性群体）。
- **法语**：用 tu（亲近），与德语策略一致。
- **阿拉伯语**：正式现代标准阿拉伯语（MSA），不用方言。语气保持庄重温和。

### 4.3 三句话安全表达框架（涉及功效时）

源语言标准结构（品牌语调配置 §4.2），译文必须保留三段式：

```
1. 传统/文化语境："Rose Quartz has been used for centuries as a symbol of unconditional love."
2. 个人体验/意图设定："Many people carry it as a gentle reminder to practice self-compassion."
3. 证据边界："While crystals cannot replace professional care, they can be a meaningful part of your mindfulness practice."
```

翻译时不得压缩第 3 句（证据边界）——这是合规护盾，缺了就是医疗宣称。

---

## 5. 禁用词清单（医疗/合规红线，强制替换）

> **权威源**：`品牌语调配置.md` §4-5。FTC + Google 医疗信息 + 社交平台审核三重要求。

### 5.1 禁用词 → 替换词（翻译时若源文含禁用词，按替换词翻译）

| ❌ 禁用 | ✅ 替换 |
|--------|--------|
| heal / cure / treat（疾病语境） | support / accompany / serve as a reminder |
| "cure anxiety" | "support a sense of calm" |
| attract wealth / guarantee fortune | symbolize abundance / represent prosperity intentions |
| change destiny / alter fate | mark meaningful transitions / support personal growth |
| scientifically proven to heal | traditionally associated with / many people report |
| 100% guaranteed / absolutely will | known for / commonly used for / traditionally believed |
| replace medical treatment | complement your wellness routine |
| purify negative energy / remove bad luck | support energetic balance / promote a sense of renewal |
| magic / supernatural power | meaningful ritual / symbolic intention |

### 5.2 销售页禁用表达（Trust Bar / Testimonials）

- 不译入虚构数据："4.9/5 Stars"、"10,000+ Happy Customers"（如源文有，译文用描述性信任信号替代：Genuine Natural Crystals / Ethically Sourced / 30-Day Returns）
- 不译入 "Verified Buyer — [Name]"（改为使用场景格式：For Calm Evenings / For Stressful Workdays）
- 不译入 "White sage — Native American tradition"（文化挪用风险，改为 "Smoke purification — a practice found in traditions across many cultures"）

> **引擎实现**：翻译输出后自动扫描禁用词正则，命中则标记 `compliance_violation` 重翻或人工审。

---

## 6. SEO 意图保留

每个页面的 focus keyword 翻译时必须保留搜索意图，不能译成同义但零搜索量的词。

**流程**：
1. 翻译前，页面已有的 Rank Math focus keyword 作为源 SEO 词。
2. 引擎按 §3.1 品类核心词表将其译为**目标市场真实搜索词**。
3. 关键 SEO 词（品类总称、产品类目）翻译后，用 SEMrush / Google Suggest 验证目标语言搜索量（参考 `DataForSEO只查SERP` 记忆：词量/KD 看 Seed-Master Sheet）。
4. 验证失败的换用更高搜索量的本地品类词。

**优先级**：P0 页面（首页/核心产品/Top10 博客）的 focus keyword 必须 SEO 验证；P2-P3 长尾页可接受品类词表直译。

---

## 7. HTML 结构保护（最易翻车的工程坑）

> TranslatePress 按 HTML 字符串片段翻译。翻译引擎**只译文本节点，必须保留所有标签和占位符原样**。

### 7.1 必须原样保留（不得翻译/改写）

| 类型 | 示例 | 规则 |
|------|------|------|
| HTML 标签 | `<b>`、`</strong>`、`<a href="...">` | 标签名、属性、属性值不译，只译标签之间的文本 |
| 短代码 | `[contact-form-7 id="123"]`、`[woocommerce_checkout]` | 整体原样保留 |
| 变量占位符 | `%s`、`{$variable}`、`{{name}}`、`{count}` | 原样保留，位置可在句中调整以符合目标语序 |
| 注释 | `<!-- wp:html -->`、`<!-- /wp:paragraph -->` | Gutenberg 块注释原样保留 |
| URL/链接 | `https://...`、`/shop/...` | 不译 |
| 数据属性 | `data-product_id="123"`、`data-trp-*` | 不译 |
| 价格/货币 | `$32.00`、`€38` | 数字格式按目标市场本地化（德语 `32,00 €`、日语 `￥3,200`），但货币代码不译 |

### 7.2 工程校验（质检门必跑）

```
对每条翻译：
1. 原文与译文的 HTML 标签数量必须一致（<b> 数、<a> 数等）。
2. 原文与译文的占位符集合必须一致（%s / {$var} / {{x}} 一个不能少）。
3. 原文与译文的 Gutenberg 注释块必须一一对应。
不满足则标记 structural_error，回退重翻或人工。
```

> 这条直接对应记忆 `wp-html-block-js-base64` 的 WP 部署陷阱家族——HTML/JS 在 WP 翻译层同样脆弱，必须用结构校验兜底。

---

## 8. 各语言特化规则

### 8.1 阿拉伯语（ar，RTL）
- 文字方向右起，但 HTML 标签、变量、URL 不受影响（保持原样）。
- 数字用西方数字（0-9），不用阿拉伯-印度数字。
- 货币符号位置适配 RTL。
- 翻译后前端需 RTL 布局校验（TranslatePress 自动处理 `dir="rtl"`，但自定义 CSS/图片方向需检查）。

### 8.2 日语（ja）
- 敬体统一（です/ます）。
- 外来词优先片假名音译（水晶品类市场惯例）。
- 标点用全角（、。「」），不用半角。
- 句末语气词柔和（〜ですね / 〜おすすめします）。

### 8.3 韩语（ko）
- 敬语阶称统一：品牌内容用 합쇼체（-ㅂ니다）或 해요체（-해요），全站一致。
- 石种名优先汉字词（자수정=紫水晶）或音译（로즈쿼츠）。

### 8.4 德语（de）
- 称呼统一 **du**（品牌叙事/产品/博客），政策页可用 Sie。
- 复合词正确连写（Heilsteinarmband 不是 Heil Stein Armband）。
- 阴阳性正确（der Stein / die Steine）。

### 8.5 法语（fr）
- 称呼统一 **tu**（与德语策略一致）。
- 阴阳性、形容词性数配合正确。

### 8.6 中文繁体（zh-TW）
- 用**台港消费市场通俗用语**，非大陆规范名、非简体。
- 标点用全角繁体惯例（「」引号、，。、）。
- 不用大陆用语（如"视频"→"影片"、"软件"→"軟體"），用台港用语。

### 8.7 葡萄牙语（pt-BR）
- **巴西葡语**，非欧洲葡语（você 称呼、词尾 -l → -i 等）。

---

## 9. Few-shot 样本（prompt 注入）

给引擎 2-3 个高质量翻译对，让模型对齐风格。样本取自已人工校过的 P0 页面文案。

**样本 1（产品描述，英→日）**：
```
源（英）：Rose Quartz is known as the stone of unconditional love, often used as a gentle reminder to practice self-compassion.
译（日）：ローズクォーツは無条件の愛の石として知られ、自分自身への思いやりを忘れないための、やさしい存在です。
```

**样本 2（信任信号，英→法）**：
```
源（英）：Every crystal should feel beautiful, but it should also come with clear sourcing, care guidance, and realistic expectations.
译（法）：Chaque cristal doit être magnifique, mais aussi s'accompagner d'une origine claire, de conseils d'entretien et d'attentes réalistes.
```

**样本 3（禁用词改写，英→德）**：
```
源（英，含禁用词）：This crystal will cure anxiety and remove all negative energy.
译（德，已改写）：Dieser Kristall kann dich als Teil deiner Selbstfürsorge dabei unterstützen, mehr innere Ruhe zu finden.
（注：cure → unterstützen bei / support；remove negative energy → innere Ruhe finden / find inner calm）
```

---

## 10. 引擎 Prompt 组装说明

DeepSeek 引擎的 `system prompt` 按以下结构组装（引擎子类实现时使用）：

```
你是 Earthward（goearthward.com）多语言站点的专业本地化翻译引擎。
严格遵循以下规则翻译，不得自由发挥。

【目标语言】{target_language}（代码 {target_code}，方向 {ltr/rtl}）

【品牌调性】
沉稳、自然、温和、可信、灵性但不玄乎。像懂水晶的朋友，不像销售员。
{各语言特化：如德语用 du、日语です/ます、阿拉伯语 MSA 等}

【术语表】（强制映射，遇源词必须用指定译法）
{注入 §3.1 品类核心词表 + §3.2 石种名表（目标语言列）}
{注入 §3.3 不译品牌词：Earthward / goearthward.com / Return to what's real.}
{注入 §3.4 玄学术语译法}

【禁用词】（源文含禁用词时按替换词翻译）
{注入 §5.1 替换表}

【结构保护】（最高优先级）
只译 HTML 文本节点，标签/短代码/占位符 %s {$var} {{x}} /注释/URL 原样保留。
价格货币按目标市场本地化格式。

【原文净化】
遇非常规英文词（拼写错误/乱码如"Prokchion"）→ 标记 [[NEEDS_SOURCE_FIX]] 原样返回。
遇 "Lucky Crystals" → 视为 "Earthward"。
"diamond" 在水晶品类语境 → 按 crystal/stone 处理。

【三句话框架】涉及功效时保留：传统语境 + 个人体验 + 证据边界（第3句不得压缩）。

【Few-shot 样本】
{注入 §9 的 2-3 个翻译对}

【输出要求】
直接输出译文数组，与输入字符串数组一一对应。不解释、不增删内容、篇幅相当。
```

**User prompt**（每次翻译请求）：
```
将以下 {n} 个字符串从英语翻译为 {target_language}。
保留所有 HTML 标签和占位符原样。按术语表和禁用词规则处理。
输入数组：{strings_json}
输出：对应译文 JSON 数组。
```

**批翻策略**：一次请求发 20-50 个 string（全页上下文），比单 string 翻译质量高且 API 调用少（成本下降）。引擎 `get_batches()` 按字符数分批，单批 ≤ 8000 token。

---

## 11. 翻译质检门（翻译后自动跑）

| 检查项 | 方法 | 失败处理 |
|--------|------|---------|
| HTML 结构对齐 | 标签数/占位符集合比对 | 标记 `structural_error` 重翻 |
| 禁用词扫描 | 正则匹配 §5 清单 | 标记 `compliance_violation` 重翻或人工 |
| 术语译法 | 检查源词是否用了指定译法 | 标记 `glossary_mismatch` 重翻 |
| 原文残留 | 扫描译文中是否残留未译英文（非品牌词） | 标记 `untranslated` |
| 篇幅异常 | 译文长度 < 原文 50% 或 > 200% | 标记 `length_anomaly` 人工审 |
| RTL 适配（仅 ar） | 检查 dir 属性、数字格式 | 前端布局校验 |

---

## 12. 维护与迭代

- **术语表增长**：TranslatePress 可视化编辑器里人工改过的翻译，每月回填进 §3 术语表 + §9 few-shot 样本。glossary 越用越准。
- **SEO 词验证**：每季度用 SEMrush 验证 §3.1 品类词在 13 个市场的搜索量，替换低量词。
- **质检报告驱动**：每月统计质检门标记类型，某类失败率高 → 补 prompt 规则或术语词条。
- **新增语言**：按 §3.1 表格新增一列 + §8 特化规则 + SEMrush 验证品类词。

---

## 附：交付物清单

1. ✅ 本规则文档（引擎 prompt 输入）
2. ✅ DeepSeek 引擎子类 PHP 代码：同目录 `earthward-deepseek-translatepress.php`（继承 `TRP_Machine_Translator`，注入本规则、JSON mode 稳定解析、HTML 结构校验、13 语言术语表、原文净化、语言代码适配、合规禁用词替换）
3. ⏳ 石种术语表 Top 30 × 13 语言完整版（从 390 颗 JSON 扩展，当前插件内置 Top 6 示范）
4. ⏳ 翻译质检门独立脚本（结构校验已内置引擎，独立批量扫描脚本待补）

---

## 附 2：部署方式与验证清单

### 部署（二选一）

- **A. 独立插件**：把 `earthward-deepseek-translatepress.php` 打成 zip → 后台「插件 → 添加新插件 → 上传插件」→ 启用。
- **B. mu-plugin**：上传到 `wp-content/mu-plugins/earthward-deepseek-translatepress.php`（始终启用，不依赖激活按钮）。

> ⚠️ **不要用 Code Snippets 部署**：实测该站 Code Snippets 的 snippet 在前端请求不执行（疑似前置 Cloudflare/主机层缓存或 safe mode），TranslatePress 翻译请求虽走 admin-ajax，但引擎类需在 `plugins_loaded` 阶段被 filter 注册，Code Snippets 在该时机的覆盖性不可靠。

### 配置步骤

1. 后台 `Settings → TranslatePress → Automatic Translation`
2. 「Automatic Translation」开关打开
3. 「Translation Engine」选 `DeepSeek (Earthward 定制)`
4. 填入 DeepSeek API Key（`~/.env` 已有 `DEEPSEEK_API_KEY`）
5. 保存

### 部署前验证清单（因未读站点 TranslatePress 源码，以下需实测）

| 验证项 | 方法 |
|--------|------|
| PHP 语法 | 部署后看 WP 是否白屏；或 `php -l` 本地校验 |
| 4 个 filter 名准确 | 后台切换引擎是否出现 `DeepSeek (Earthward 定制)` 选项；选中后 API Key 输入框是否出现 |
| 父类方法签名 | `verify_request_parameters` / `machine_translation_codes` / `machine_translator_logger` / `settings['default-language']` 是否与当前 TP 3.2.3 兼容（hollisho 用同样接口，预期兼容） |
| 翻译链路 | 配置后访问 `/ja/` 等语言首页，看是否触发翻译；TranslatePress → 翻译编辑器看译文是否落库 |

### 翻译质量验证（P0）

部署后先翻译 1 个 P0 页面（如首页或 About），人工评审：
- 品类词是否用了术语表的本地品类词（如日语「パワーストーン」）而非直译
- 禁用词是否被替换（cure → support 类）
- HTML 标签/占位符是否完整（结构校验日志）
- 乱码原文（Prokchion 等）是否原样保留待修
- 调性是否「温和可信不夸张」
