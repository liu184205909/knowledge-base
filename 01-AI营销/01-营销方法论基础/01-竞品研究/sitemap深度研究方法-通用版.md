# Sitemap 深度研究方法 · 通用版

> **目的**：定义用 sitemap 做竞品深度研究的标准方法——围绕 **slug 路径 / 模式 / 分布** 三维度，**完整读取** sitemap，不读页面正文，反推竞品的信息架构、pSEO 引擎、战略重心。
> **适用**：任何品类 / 行业的竞品架构分析（电商、SaaS、内容站、本地服务、工业 B2B 均可复用）。
> **来源**：本方法整合了内部研究纪律（CLAUDE.md 竞品 SOP + memory 实战踩坑）与外部行业最佳实践（见每节来源标注）。
> **核心原则**：**URL slug 本身就是信息**（页面主题 / 类型 / 层级 / pSEO 引擎），足够推断架构 + 内容主题，**不需要读页面正文**（读页面爆 context 且多余）。

---

## 一、为什么必须完整读取 sitemap（不只 sample）

sample（10–200 URL）对大站只占 0.5%–12%，**无法反映完整 slug 分布**：

- 看不全所有页面类型（长尾类型在 sample 里可能 0 个）
- 分布比例不准（sample 有偏差）
- 识别不出完整的内容主题矩阵
- 识别不出 pSEO 引擎的完整维度组合

**完整读取**（Python 提取全部 URL，或工具统计子文件 url_count）才能：

- 精确页面类型分布（每类 url_count）
- 完整 slug 模式覆盖（所有命名规律）
- 识别长尾 pSEO 维度
- 识别堆砌废弃信号（某类页面 80% 404 = 堆砌已废弃）

> ✅ 明文：行业共识——"competitor sitemaps offer a behind-the-scenes look at their entire content architecture and SEO priorities without requiring a full crawl"（来源：[Women in Tech SEO · Advanced XML Sitemap Strategies](https://www.womenintechseo.com/knowledge/advanced-xml-sitemap-strategies-seo/)）

> 📌 内部纪律：sample 看不全完整 slug 分布，是反复踩坑后的结论。大站的 slug 模式分布（产品页 / 聚合页 / pSEO 落地页 / 博客的比例）必须靠完整统计，不能靠抽样推断。（来源：滤网项目实战，原 `00-sitemap深度研究方法说明.md`）

---

## 二、核心三维度分析

### 维度 1：slug 路径 = 信息架构（IA）

URL 目录层级 = 网站信息架构。

- **路径前缀 = 页面类型**：`/products/` 产品页、`/collections/` 或 `/category/` 聚合页、`/blog/` 内容页、`/{规格}/` pSEO 落地页
- **路径深度 = 层级**：`/services/hvac/new-york-city/` 三层 = 服务 → 类目 → 地区
- **从路径树反推 IA（信息架构图）**——竞品怎么组织内容，什么是顶级导航，什么是子聚合

> ✅ 明文：URL 结构是 pSEO 的地基——"automating URL generation is crucial — but this is only as effective as the plan that's considered before implementation"（来源：[Direction.com · Site Architecture for Programmatic SEO](https://direction.com/site-architecture-and-url-structure/)）

**5 种常见 pSEO URL 结构模板**（来源：Direction.com，跨行业适用）：

| 模板 | URL 模式 | 适用场景 |
|------|---------|---------|
| 地理位置页 | `/location/state/city/service` | 本地服务、连锁、SAB |
| 服务×地区页 | `/services/service-type/location` | 多服务多地区 |
| 提供者页 | `/providers/location/service-type/name` | 医疗、咨询、Marketplace |
| 内容集群 | `/blog/topic/pillar-page` | 内容站、媒体 |
| 电商产品 | `/products/category/subcategory/name` | 电商零售 |

### 维度 2：slug 模式 = pSEO 引擎 DNA

URL slug 命名规律 = pSEO 引擎的维度组合。**slug 模式直接告诉你这个站用什么 pSEO 引擎、覆盖哪些维度**——这是 sitemap 深度研究的核心价值。

**通用 slug 模式分类框架**（跨行业适用）：

| slug 模式 | 揭示的 pSEO 引擎 | 通用例子 |
|----------|----------------|---------|
| `/{属性A}-{属性B}-{核心词}/` | 双属性映射（品牌×型号、品牌×品类） | `/apple-iphone-15-case/` |
| `/{规格A}/{规格B}/{规格C}/` | 多维规格笛卡尔积 | `/shoes/running/mens/size-10/` |
| `/{实体}-for-{场景}/` | 场景导航 | `/crystals-for-sleep/`、`/{工具}-for-{角色}/` |
| `/{实体}-vs-{实体}/` | 对比页 | `/shopify-vs-woocommerce/` |
| `/{实体}-alternatives/` | 替代页 | `/salesforce-alternatives/` |
| `/{地区}/{核心词}/` | 地理 pSEO | `/plumber-chicago-il/` |
| `/{核心词}-{修饰词}/` | 修饰词矩阵 | `/crm-for-small-business/` |

> ✅ 明文：竞品 URL 模式要重点识别以下信号——服务页 vs 博客的产出比例、行业垂直细分、地理定位、对比页（X vs Y）、替代页（alternative to Z）、per-feature 页、pSEO 模式（来源：[LinkedIn · How to Reverse-Engineer Your Competitor's SEO Strategy](https://www.linkedin.com/pulse/how-reverse-engineer-your-competitors-seo-strategy-ai-akash-sehgal-2uvqc)）

### 维度 3：slug 分布 = 战略重心

每类 slug 的数量 = 网站的页面类型权重，揭示战略重心：

- **产品页占大头** → 产品驱动（零售电商典型）
- **博客 / 术语库 / 资源占大头** → 内容驱动（内容营销 + SEO 引流，产品页只转化）
- **pSEO 规格页占大头** → pSEO 驱动（programmatic SEO 大规模铺页）
- **聚合页 / 对比页 / 替代页多** → aggregator / 决策辅助模式
- **地理页占大头** → 本地 SEO 驱动（连锁 / SAB）

> ✅ 明文：sitemap 结构本身是诊断工具——"By examining how a site divides URLs across sitemap files, you can assess: Page type proportions / Language distribution / Freshness distribution / Structural imbalances"（来源：[Women in Tech SEO](https://www.womenintechseo.com/knowledge/advanced-xml-sitemap-strategies-seo/)）

> ✅ 明文：通过 sitemap 分段可以审计"over-representation of low-value page types that could waste crawl budget"——分布不均本身是信号（来源：同上）

---

## 三、从 slug 能得到什么（不读页面正文）

| # | 能得到的洞察 | 怎么从 slug 推 |
|---|------------|--------------|
| 1 | 信息架构 | URL 层级树 |
| 2 | 页面类型分布 | 每类 url_count + 占比 |
| 3 | pSEO 引擎 | slug 模式揭示的维度组合 |
| 4 | 内容主题矩阵 | slug 覆盖的 实体 × 属性 × 场景 × 地区 |
| 5 | 战略重心 | 分布揭示 产品 / 内容 / pSEO / 本地 哪个驱动 |
| 6 | 规模与质量信号 | 总 URL + 分布均衡度（堆砌 vs 精选） |
| 7 | 更新频率与内容重心 | `<lastmod>` 分布揭示哪类内容更新最频繁 |
| 8 | 国际化战略 | 语言 / 地区分段 sitemap（hreflang 实现） |

> ✅ 明文：sitemap 分析还能揭示 lastmod 更新频率、hreflang 国际化分段、category 结构化方式——这些都是"without requiring a full crawl"就能拿到的情报（来源：[Women in Tech SEO](https://www.womenintechseo.com/knowledge/advanced-xml-sitemap-strategies-seo/)）

---

## 四、标准 SOP（5 步流程）

### 第 0 步：发现竞对（前置，不属于 sitemap 分析但决定输入质量）

**用 DataForSEO SERP 查词，不用 WebSearch 泛搜**。

- 查 3–5 个种子词，取 **top20–30**（不只 top10，过滤大平台后真竞品常只剩 2–5 个）
- **过滤大平台**：电商 marketplace（amazon / ebay / etsy / walmart / target / aliexpress / alibaba / temu）+ 社媒 UGC（youtube / reddit / pinterest / facebook / tiktok / quora / medium）+ 百科（wikipedia）
- 按项目对标类型二次筛选（只留真竞品）
- **WebSearch 返回"相关结果"≠ 真实 SERP 排名**，两者不能混用

> 📌 内部纪律：CLAUDE.md "SERP/竞对搜索" 段明确——"必须使用 DataForSEO API，不要用 web_search_prime 或 WebSearch 做竞对搜索""通用搜索工具对 B2B 工业设备搜索极不准确，曾导致竞对完全失效"（来源：CLAUDE.md）
> 📌 内部纪律：memory `competitor-research-serp-driven-strict` 记录的 5 步铁律——serp_check 查词 → top20-30 → 过滤大平台 → 类型二次筛 → 只抓确认的（来源：memory `competitor-research-serp-driven-strict.md`）
> 📌 内部纪律：memory `dataforseo-serp-only` 记录的塔罗翻车教训——WebSearch 泛搜冒充 SERP 分析 → 抓错竞品 + 漏真实强竞品（来源：memory `dataforseo-serp-only.md`）

### 第 1 步：定位 sitemap（robots.txt 驱动，不猜 URL）

```bash
# 先读 robots.txt 找 Sitemap 声明
curl -s https://{domain}/robots.txt | grep -i sitemap
# 常见结果：
# Sitemap: https://{domain}/sitemap_index.xml
# Sitemap: https://{domain}/sitemap.xml
```

- 绝大多数站点在 `robots.txt` 里声明 `Sitemap:` 地址，这是**权威来源**
- 如果 robots.txt 没声明，再尝试 `{domain}/sitemap.xml` / `{domain}/sitemap_index.xml` / `{domain}/sitemap-index.xml`
- **不要猜 sitemap URL**——先 robots.txt 再 fallback

> ✅ 明文：行业标准做法——"Check domain.com/robots.txt or try domain.com/sitemap.xml to locate any site's sitemap"（来源：[Women in Tech SEO](https://www.womenintechseo.com/knowledge/advanced-xml-sitemap-strategies-seo/)、[LinkedIn · Reverse-Engineer Competitor SEO](https://www.linkedin.com/pulse/how-reverse-engineer-your-competitors-seo-strategy-ai-akash-sehgal-2uvqc)）
> 📌 内部纪律：先抓 robots.txt 找 Sitemap 声明拿正确 URL，再 validate（来源：memory `competitor-research-toolchain.md`）

### 第 2 步：完整提取 URL（Python 或工具统计）

#### 方法 A：Python 完整提取（推荐，最灵活）

```python
import requests, re
from collections import Counter

sitemap_url = "https://{domain}/sitemap_index.xml"
headers = {'User-Agent': 'Mozilla/5.0 (...)'}

xml = requests.get(sitemap_url, headers=headers, timeout=30).text

# 若是 sitemap index（含 <sitemap><loc>），递归抓每个子文件
if '<sitemap>' in xml:
    sub_sitemaps = re.findall(r'<loc>(.*?)</loc>', xml)
    all_urls = []
    for sub in sub_sitemaps:
        sub_xml = requests.get(sub, headers=headers, timeout=30).text
        all_urls.extend(re.findall(r'<loc>(.*?)</loc>', sub_xml))
else:
    all_urls = re.findall(r'<loc>(.*?)</loc>', xml)

print(f"总 URL 数: {len(all_urls)}")

# 按 slug 路径前缀/模式分类
def classify(url):
    # 去掉域名，取 path
    path = url.split('/', 3)[-1] if url.startswith('http') else url
    # 按第一段分类（产品/博客/聚合等）
    segments = path.strip('/').split('/')
    return segments[0] if segments else 'root'

dist = Counter(classify(u) for u in all_urls)
for cat, count in dist.most_common():
    sample = [u for u in all_urls if classify(u) == cat][:3]
    print(f"{cat}: {count} ({count/len(all_urls)*100:.1f}%) | 样本: {sample}")
```

**关键原则**：LLM 只看统计结果（每类数 + 3–5 样本 + slug 规律），**不把全部 URL 放 context**（不爆）。

#### 方法 B：`mcp__google-seo-mcp__migration_sitemap_validate`（MCP 工具）

- 能 parse sitemap index 递归计总数 + HEAD-check 样本 URL + 验证 URL 模式
- **sample_size 必须 ≤ 20**（只看 URL 模式，不爆 context）
- **页面类型分布用每个子文件的 url_count**（精确总数，是个数字不占 context），不用大 sample 分类
- Shopify / BigCommerce 的 sitemap 子文件本身就是类型分类：`sitemap_products` = 产品页、`sitemap_collections` = 聚合页、`sitemap_blogs` = 博客、`sitemap_pages` = 其他

> ⚠️ 内部铁律：sample_size 必须 ≤20，绝对不要大 sample（100/500）——多子文件累积返回的 URL 样本会**爆 context 致 agent 失败**（来源：memory `competitor-research-toolchain.md`，HVAC 架构 agent 死于此）
> ⚠️ 内部铁律：独立的 sitemap MCP（`mcp__sitemap__get_sitemap_tree`）实测已断开，**migration_sitemap_validate 是它的替代**（来源：memory `competitor-research-toolchain.md`）

#### 大 sitemap 处理（>5 万 URL）

- 抓 sitemap index 统计子文件 + 抽样 3–5 个子文件完整提取
- Google 单文件上限 50,000 URL / 50MB；大站会用 index 拆成多个子文件
- 行业实践建议单文件控制在 ~30K URL 更利于爬虫处理（来源：[Women in Tech SEO](https://www.womenintechseo.com/knowledge/advanced-xml-sitemap-strategies-seo/)）

#### 反爬处理

- Cloudflare 拦 requests：用 webReader 抓 XML 文本，Python re 解析（**只解析 URL 不读页面正文**）
- webReader 抓 sitemap index（小文件）OK，但抓子 sitemap（大文件）可能报 500——此时降级用 migration_sitemap_validate

> 📌 内部纪律：webReader 抓 sitemap index OK，但抓子 sitemap（products/collections 等大文件）报 500 error，规模数据打折（来源：memory `competitor-research-toolchain.md`，PartSeed 滤网深挖踩过）

### 第 3 步：分类统计 + slug 模式识别

```python
# 进阶分类：不只按第一段，还按 slug 模式正则
def classify_pattern(url):
    path = url.split('/', 3)[-1].strip('/')
    # 识别 pSEO 模式
    if re.search(r'-vs-', path): return 'comparison'
    if re.search(r'-alternatives?$', path): return 'alternative'
    if re.search(r'for-[a-z-]+$', path): return 'use-case'
    if re.match(r'[a-z]{2}-[a-z]{2}/', path): return 'international'
    # 按目录段
    segments = path.split('/')
    return segments[0] if segments else 'root'

pattern_dist = Counter(classify_pattern(u) for u in all_urls)
```

### 第 4 步：slug 三维度分析（产出洞察）

对每个竞品，按维度 1（路径/IA）→ 维度 2（模式/pSEO 引擎）→ 维度 3（分布/战略重心）逐层分析。

### 第 5 步：横向对比 + gap 分析

- 收集 3–5 个竞品 sitemap + 自己的 sitemap 做对比
- 识别内容 gap：竞品覆盖但你没有的页面类型 / slug 模式 / 主题集群
- **不是所有 gap 都值得填**——按业务价值优先级排序（服务页 > use-case 页 > 对比页 > 替代页 > 高意图博客 > 底部漏斗内容）

> ✅ 明文：选竞品要混合——一个直接竞品 + 一个更大品牌 + 一个快速增长竞品 + 一个内容型竞品 + 一个排名你目标词的竞品，加上自己的 sitemap 做 baseline（来源：[LinkedIn · Reverse-Engineer Competitor SEO](https://www.linkedin.com/pulse/how-reverse-engineer-your-competitors-seo-strategy-ai-akash-sehgal-2uvqc)）
> ✅ 明文：内容 gap 按业务价值排序——"not every content gap is worth filling"，优先靠近收入的页面类型（来源：同上）

---

## 五、绝对不做

| ❌ 禁止 | 原因 |
|--------|------|
| webReader 读页面正文做架构分析 | 爆 context + 无必要，曾死 4+ agent |
| 只看 sample（10–200 URL） | 分布不准，违背"完整读取"原则 |
| 编造数字 | Python 统计 = ✅明文，推断标 🟡 |
| 用 WebSearch 泛搜找竞对 | 通用搜索对 B2B / 垂直领域极不准确，曾导致竞对完全失效 |
| sample_size 设 100/500 | 多子文件累积 URL 样本爆 context |
| SendMessage 唤醒已有 agent 补指令 | 累积 context 爆，要改方法直接停掉重派干净 agent |
| 派 general-purpose agent 时不禁止子 agent | agent 会自开子 agent 致并发爆炸（来源：memory `agent-no-subagent-rule.md`） |

> ⚠️ 最高优先级内部铁律：竞品架构分析只用 sitemap URL 结构，绝不 webReader 读页面正文。URL slug 本身就是信息，足够推断架构 + 内容主题；读页面正文会爆 context 且不必要。（来源：memory `competitor-research-toolchain.md`）

---

## 六、产出标准（每竞品一份深度分析）

1. **Python 统计原始表**（类 | url_count | 占比 | 样本 URL）
2. **slug 路径分析**（IA 层级树）
3. **slug 模式分析**（pSEO 引擎 DNA + 真实例子 + 覆盖维度）
4. **slug 分布分析**（页面类型权重 + 战略重心判断）
5. **内容主题矩阵**（覆盖的 实体 × 属性 × 场景 × 地区）
6. **建站可借鉴点**（URL 结构 / slug 规则 / 页面类型组合 / 国际化策略）
7. **横向对比 + gap 清单**（3–5 家对比，按业务价值排序的 gap）

---

## 七、外部最佳实践补充（标注来源）

### 1. sitemap 分段 = 内容战略情报
sitemap 分段方式（按 post / page / product / service / category 拆分）本身就是情报——博客 sitemap 揭示内容营销战略，page sitemap 揭示商业意图页，product/service sitemap 揭示收入优先级，category sitemap 揭示主题权威架构。（来源：[LinkedIn · Reverse-Engineer Competitor SEO](https://www.linkedin.com/pulse/how-reverse-engineer-your-competitors-seo-strategy-ai-akash-sehgal-2uvqc)）

### 2. `<lastmod>` 揭示更新频率与内容重心
检查不同 sitemap 段的 `<lastmod>` 分布，能判断竞品哪类内容更新最频繁——高频更新 = 战略重心；静态 = 维护型内容。注意：过度/不准确的 lastmod 会误导搜索引擎重爬未变内容，浪费 crawl budget。（来源：[Women in Tech SEO](https://www.womenintechseo.com/knowledge/advanced-xml-sitemap-strategies-seo/)）

### 3. 30K URL 分块优于 50K 上限
实测将单 sitemap 从 50K URL 降到 ~30K，Google 处理速度从"几周未处理"变成"几天内全量处理"。大站（50K+ URL）竞品若已采用 30K 分块，说明技术 SEO 成熟度高。（来源：[Women in Tech SEO](https://www.womenintechseo.com/knowledge/advanced-xml-sitemap-strategies-seo/)）

### 4. sitemap 作为 canonical 弱信号
Google 把 sitemap.xml 当作 canonical 的弱信号。当竞品 sitemap 里有 URL 被列为 canonical，但实际有 301 或 rel=canonical 指向别处——这种不一致是技术 SEO 缺陷的信号。审计竞品时值得留意。（来源：[Women in Tech SEO](https://www.womenintechseo.com/knowledge/advanced-xml-sitemap-strategies-seo/)）

### 5. URL 结构 A/B 测试思维
Direction.com 的实战教训：在 permalink 里加 topic category 反而**阻碍**了自然可见度，回退到简化结构后恢复。结论——不要假设 URL 层级越深越好，要测试。竞品的 URL 结构不一定是最优解，可能是历史包袱。（来源：[Direction.com · Site Architecture for Programmatic SEO](https://direction.com/site-architecture-and-url-structure/)）

### 6. AI 批量分类 URL 模式
用 LLM（ChatGPT / Claude）上传 sitemap 文件后，按结构化 prompt 做 URL 分类——10 个维度的分析框架（主题集群、内容模式、商业页优先级、重复博客主题、目标行业、内容 gap、缺失页面、高购买意图主题、快速赢取机会、优先内容路线图）能在几分钟内产出竞品内容地图。（来源：[LinkedIn · Reverse-Engineer Competitor SEO](https://www.linkedin.com/pulse/how-reverse-engineer-your-competitors-seo-strategy-ai-akash-sehgal-2uvqc)）

> ⚠️ 注意：外部方法 #6 让 LLM 直接吃全部 URL——这与内部纪律"LLM 只看统计结果不碰全部 URL"冲突。**内部做法更稳妥**（Python 统计 + LLM 只看聚合结果），适合大站（>1000 URL）；小站 URL 量少时可酌情用外部方法。

### 7. 国际化战略从 sitemap 分段可读
hreflang 通过 XML sitemap 实现是大型多语言站的主流做法。竞品 sitemap 若按语言/地区分段（`/en/` `/es/` `/de/` 或独立子文件），揭示其国际化覆盖范围与重点市场。（来源：[Women in Tech SEO](https://www.womenintechseo.com/knowledge/advanced-xml-sitemap-strategies-seo/)）

---

## 八、工具链速查表

| 环节 | 工具 | 用途 | 备注 |
|------|------|------|------|
| 发现竞对 | DataForSEO SERP（`mcp__google-seo-mcp__serp_check`） | 真实 SERP 排名找竞品 | 不用 WebSearch；详见 memory `dataforseo-serp-only` |
| 定位 sitemap | `curl robots.txt` | 找 Sitemap 声明 | 权威来源，不猜 URL |
| 完整提取 URL | Python requests + re | 提取 `<loc>` 全部 URL | 最灵活；Cloudflare 拦则 webReader 抓 XML 文本 |
| 工具化解析 | `mcp__google-seo-mcp__migration_sitemap_validate` | parse index + HEAD-check + url_count | sample_size ≤ 20；替代已断开的 sitemap MCP |
| 分类统计 | Python `collections.Counter` | 按 slug 路径/模式分类统计 | LLM 只看统计结果 |
| 抓单页内容 | webReader | 仅降级用（架构分析不需要） | 只在确认要看具体页面内容时用 |
| 规模验证 | 后期手动 SEMrush 抽查头部 | 流量验证（非架构分析） | 不在 sitemap 分析阶段做 |

> 📌 内部纪律：竞品研究三工具链不混用——发现竞对用 DataForSEO / sitemap 解析用 migration_sitemap_validate / 抓单页用 webReader 仅降级（来源：memory `competitor-research-toolchain.md`）
> 📌 内部纪律：不要做流量验证——DataForSEO SERP 查出来的竞品能排 top20-30，本身已证明有流量/实力，再花 agent 算单页效率是冗余（来源：memory `competitor-research-toolchain.md`）

---

## 九、常见 CMS / 平台的 sitemap 结构特征

识别竞品用的平台，能快速预判 sitemap 结构：

| 平台 | sitemap 特征 | URL 模式特征 |
|------|------------|------------|
| **Shopify** | `sitemap_products_1.xml` / `sitemap_collections_1.xml` / `sitemap_blogs_1.xml` / `sitemap_pages_1.xml` 分段 | `/products/{slug}` / `/collections/{slug}` / `/blogs/{blog}/{slug}` |
| **BigCommerce** | `sitemap.xml` 含 product / category / brand / page 分段 | 类似 Shopify |
| **WordPress（Yoast）** | `sitemap_index.xml` 含 post / page / category / post_tag 等分段 | `/{post-type}/{slug}` / 根级 `/` |
| **WordPress（RankMath）** | `sitemap_index.xml` 类似 Yoast | 同上 |
| **Wix** | 单一 `sitemap.xml` 或动态生成 | 结构较扁平 |
| **Webflow** | `sitemap.xml` 单文件 | 无固定分段 |
| **自定义 pSEO** | 按维度拆分（`/sitemap-sizes.xml` `/sitemap-brands.xml`） | slug 模式高度规律化 |

> 🟡 推断：Shopify/BigCommerce 的 sitemap 子文件本身就是类型分类——这是平台机制，可作为页面类型分布的天然分组（来源：memory `competitor-research-toolchain.md` 基于实战的归纳）

---

## 十、什么时候用 sitemap 深度研究（vs 其他方法）

| 场景 | 推荐方法 | 为什么 |
|------|---------|--------|
| 竞品架构 + 内容主题分析 | **sitemap 深度研究（本方法）** | URL slug 即信息，不爆 context |
| 竞品流量/关键词验证 | SEMrush / Ahrefs | sitemap 不含流量数据 |
| 竞品单页内容/UX 深拆 | webReader / Playwright | sitemap 只看结构不看内容 |
| 竞品 backlink 分析 | Semrush / Moz | sitemap 不含外链数据 |
| 竞品技术 SEO 审计 | Screaming Frog / Lighthouse | sitemap 只看 URL 不看技术实现 |

**sitemap 深度研究的不可替代价值**：在不爬全站、不读页面正文的前提下，用 URL 结构反推竞品的信息架构、pSEO 引擎、内容矩阵、战略重心——成本最低、信息密度最高、不爆 context。

---

## 附录：关键来源索引

### 内部纪律来源
- `C:\Users\Dylan\.claude\CLAUDE.md` —— SERP/竞对搜索纪律、竞品网站分析 SOP（4 层渐进式）、采集工具优先级
- `memory\competitor-research-toolchain.md` —— 三工具链纪律、sample_size ≤ 20、url_count 做分布、不 SendMessage 唤醒、不读页面正文、sitemap MCP 已断用 migration_sitemap_validate 替代
- `memory\competitor-research-serp-driven-strict.md` —— 竞品研究 5 步铁律（serp_check → top20-30 → 过滤大平台 → 类型二次筛 → 只抓确认的）
- `memory\dataforseo-serp-only.md` —— DataForSEO 只查 SERP、volume 走 Seed-Master、塔罗翻车教训（WebSearch 冒充 SERP）
- `memory\agent-no-subagent-rule.md` —— 派 agent 必须禁止子 agent，否则并发爆炸

### 外部最佳实践来源
- [LinkedIn · How to Reverse-Engineer Your Competitor's SEO Strategy (Akash Sehgal)](https://www.linkedin.com/pulse/how-reverse-engineer-your-competitors-seo-strategy-ai-akash-sehgal-2uvqc) —— 7 步法，sitemap + AI 分析，URL 模式识别维度，gap 优先级框架
- [Direction.com · Site Architecture and URL Structure for Programmatic SEO](https://direction.com/site-architecture-and-url-structure/) —— 5 种 pSEO URL 模板，审计 3 大问题（断链/重复/orphan），URL A/B 测试教训
- [Women in Tech SEO · Advanced XML Sitemap Strategies](https://www.womenintechseo.com/knowledge/advanced-xml-sitemap-strategies-seo/) —— 30K 分块、canonical 弱信号、竞品情报维度、内容分布审计、lastmod 分析、hreflang、orphan page 发现
- [Google Search Central · Build and Submit a Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) —— 官方 sitemap 格式规范
- [Bruce Clay · XML Sitemaps: Why URL Sequencing Matters](https://www.bruceclay.com/blog/xml-sitemaps-why-url-sequencing-matters/) —— priority/changefreq 标签有效性分析

---

> **本说明是 sitemap 深度研究的通用 SOP**。所有竞品架构分析须遵循：完整读取 + slug 路径/模式/分布三维度 + 不读页面正文 + 工具链不混用。适用于任何品类/行业的竞品研究项目。
