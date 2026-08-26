# 内容生产实操 SOP

> **定位**：从 Brief 到发布的完整操作清单。只管"做什么"，不管"为什么"。
> **理论依据**：`03-SEO与GEO/01-内容质量标准.md`（906 行，需要理解原理时查）
> **决策骨架**：执行版 §3.3（gate / 门槛 / 路由）

---

## 1. 写作前

### 1.1 SERP 分析 → 文章框架（5 步，不可跳过）
1. 查目标词 SERP top 10（`serp_check` 或 webReader）
2. 分析文章类型（百科 / 对比 / 教程 / 选购指南）
3. 合并 H2/H3 结构（找共识 = 基本盘）
4. 找共同缺口（它们都没写的 = 差异化机会）
5. 产出文章框架（H1/H2/H3 骨架，存 `03-内容策略/文章框架/`）

### 1.2 Brief 锁定（7 门槛全过才能开写）
- [ ] 关键词 + 意图 + 数据来源已声明
- [ ] Volume / KD / CPC 已标注
- [ ] 2-3 篇竞品内容已复核
- [ ] URL + 承接页面已确定
- [ ] 内链规则已规划
- [ ] DREAM 至少 1 项差异化
- [ ] **差异化资产清单**（2026-08-26 增补）：列出本篇 3-5 个竞品 top10 没有的具体信息点（5-to-7 Rule 前置到 Brief），每点标注来源分级（官方文档 / 实测库 / 工厂经验 / 推断）。无 ≥3 项资产 → 降级为 800 字短文或并入 hub 页，不立独立 URL

### 1.3 DREAM 5 维快速检查
| 维度 | 检查 |
|------|------|
| D 需求 | H2 是否说明了"为什么需要" |
| R 理由 | 是否给出"为什么选这个" |
| E 证据 | 是否有数据/案例/来源 |
| A 优势 | 是否展示具体差异化 |
| M 动机 | 是否给"现在行动"的理由 |

---

## 2. 写作中

### 2.1 写作原则
- **answer-first**：每段第一句 = 核心结论
- **独立可提取段落**：每段离开上下文也能读懂（不用"它""这个"开头）；答案和证据在同一段
- **5-to-7 Rule**：每篇提供 5-7 个竞品 top 10 没有的信息点

### 2.2 避免 AI 写作特征（前 4 条必查，第 5 条句式级扫描）
1. ❌ Pub Test 失败（读起来像"任何博客都能发"）
2. ❌ First 10% 冗余（开头是废话引入，应直接进结论）
3. ❌ Kill List 命中（delve / leverage / tapestry / navigate / unveil）——**语境限定**（2026-08-26 增补）：仅限动词/修辞用法；工程名词合法用法豁免（铰链杠杆 "hinge leverage"、固化时间 "cure time"、化工 "cures"、工艺确定性 "guarantee one dye lot"）。机械扫描命中后人工复核语境再判
4. ❌ Human Sandwich 缺失（没有真人语气夹击 AI 段落）
5. ❌ **句式级特征**命中 ≥2（Kill List 管词汇层，本条管句法层）：①段首定义句——连续段落以 "X is a..." 类句式开头 ②三段式排比——"not only A, but also B, and C" ③段末总结废话——"X plays a crucial role in..." ④句长节奏单一——全篇 15-20 词中长句无长短交替 ⑤零自然瑕疵——通篇无碎片句/反问/语气词。命中超标按 §2.3 技术表改写

### 2.3 六大去 AI 化技术
| 技术 | 操作 |
|------|------|
| First 10% Deletion | 删开头冗余，直接进结论（quick-answer blockquote 是落地形式） |
| Kill List | 扫描禁用词（合规向 heal/cure/guarantee + AI 风格向 delve/leverage/tapestry） |
| Human Sandwich | AI 客观段之间夹入"真实体验 / 个人观察 / 品牌故事" |
| Pub Test | 读出来像不像真人写的 |
| High-Low | 信息密度交替（深分析段 → 简明要点段） |
| Anti-Pattern | 用反例 prompt 让 AI 避开模板 |

> 项目级禁用词清单见项目 `03-内容策略/品牌语调配置.md §4`

---

## 3. 写作后

### 3.1 Commodity Content 自检（AI prompt，Marie Haynes 原版）
```
What are 10 concepts discussed in this page?
For each, tell me whether this topic has been widely written about online.
Does this content add anything truly uniquely interesting?
Be brutally honest, don't flatter me.
```

### 3.2 规模化内容风险自查（命中 ≥3 个需重设计多样性）
- [ ] 规模化对比页 `/blog/[A]-vs-[B]`（横跨所有组合）
- [ ] 术语页 `/glossary/[term]`（程序化多语言版本）
- [ ] "Best X for Y" 清单（affiliate 起源）
- [ ] 自推清单（自己排第一，无真实测评）
- [ ] 竞品替代页 `/blog/[competitor]-alternatives`
- [ ] 程序化地理/语言页（无真实物理地点）
- [ ] FAQ 农场（一页一问）
- [ ] 离题内容（与业务无关的高搜索量内容）

### 3.3 事实核查三级风控（2026-08-26 增补）

> "事实零错（数据/价格逐项核对）"生产纪律的操作落地。发布前逐段扫描，标记所有事实性声明并分级：

| 等级 | 声明类型 | 处置 |
|------|---------|------|
| 🔴 高风险 | 统计数据（% / 数字）、研究引用（"研究表明"）、医疗/功效声明 | **不核实不发布**——找到原始来源或删除/改写 |
| 🟡 中风险 | 产品规格、价格对比、第三方评测结论 | 核实但不阻塞；价格改区间或加"截至 X 年 X 月"标注 |
| 🟢 低风险 | 常识性描述、方法论论述 | 免核 |

**配套写作纪律**（挂在 §2.1）：AI 初稿中所有数据引用处必须带 `【需要核实数据】` 标记，§3.3 核查完成后标记统一清除——残留标记 = 未完成核查，不得进 §4。**标记格式注记**（2026-08-26 增补）：英文斜体 `*(pending verification)*` 为等效标记；验收 grep 两种格式都要扫（`grep -ri "pending verification\|需要核实数据" 文章/` 返回 0 行）。

### 3.4 编辑完成检查清单
- [ ] 关键词与意图匹配
- [ ] 内链 3-5 条指向已有页面
- [ ] Meta 三件套（Title / Description / H1）含目标关键词
- [ ] 无 CJK 残留 + 无合规禁用词
- [ ] **事实核查标记清零**（2026-08-26 增补，发布硬门）：`grep -ri "pending verification" 文章/` 返回 0 行——🔴 高风险数据（下单级尺寸/价格/SKU）残留标记即阻塞发布，处置三选一：对真源台账核实 → 改区间表述 → 删该数据行（宁删勿存疑）

---

## 4. 发布前

### 4.1 质检路由
| 内容类型 | EEAT | 站外原创 | 站内重复 | GEO | Schema |
|---------|------|---------|---------|-----|--------|
| 百科/科普 | ✅ 标准 | ⬜ 可选 | ✅ 必做 | ✅ 必做 | ⬜ 可选 |
| 对比/选购 | ✅ 加强 | ✅ 必做 | ✅ 必做 | ⬜ 可选 | ⬜ 可选 |
| 教程/How-to | ✅ 标准 | ⬜ 可选 | ✅ 必做 | ⬜ 可选 | ⬜ 可选 |
| 转化型 | ✅ 轻量 | ⬜ 跳过 | ✅ 必做 | ⬜ 跳过 | ✅ 必做 |

### 4.2 工具命令速查
```bash
# 站内重复检测（SimHash 指纹比对）
python content_duplicate_checker.py --sitemap https://yoursite.com/sitemap.xml --threshold 0.8

# 站外原创性检测（与竞品 N-gram 重合度）
python content_originality_checker.py --url https://yoursite.com/page --competitors comp1.com,comp2.com

# 竞品内容分析（批量提取 title/meta/H1/H2）
python content_analyzer.py --input urls.csv --output analysis.csv
```

### 4.3 发布前检查
- [ ] URL 规则一致
- [ ] Meta 三件套完整
- [ ] 内链双向确认
- [ ] 图片已上传 + alt 完整
- [ ] 分类 / 标签正确

---

## 5. 发布后

### 5.1 上线验证
- [ ] HTTP 200 + canonical 正确
- [ ] 无 CJK 残留（grep head / title / description）
- [ ] Schema 校验（Google Rich Results Test）
- [ ] 内链生效（打开文章看链接）
- [ ] 动态区接真实数据

### 5.2 GSC 监控（上线 4 周后）
- 收录状态（`site:` 搜索 / URL Inspection）
- 排名信号（position 4-15 = striking distance 机会）
- 掉量检测（GSC Insights → Trending down pages）
- CTR 异常（高曝光低 CTR → 标题/meta 问题）

### 5.3 更新处置三选一（2026-08-26 增补——§5.2 检测出问题后的处置规则）

| 信号 | 处置 | 动作 |
|------|------|------|
| 排名稳定但停滞（striking distance 4-15 位） | **A 小幅更新** | 刷新过时数据/补充新角度/优化标题 → 改 `dateModified` → GSC URL Inspection → Request Indexing 触发重爬 |
| 排名下滑或内容质量不足 | **B 大幅重写**（50%+ 内容） | 重新走 §1 SERP 分析（SERP 可能已变）→ 重写 → 同 A 触发重爬 |
| 零流量 + 内容薄 | **C 合并/下线** | 与主题相近文章合并，旧 URL 301 到合并目标；无合并价值直接下线 |

> 判断依据：内容是否还有搜索需求（有 → A/B，无 → C）。三类信号都要**先复查 SERP 现状**再动手——排名下滑可能是 SERP 格式变了（新增 AIO/视频），此时重写内容不如改格式。
