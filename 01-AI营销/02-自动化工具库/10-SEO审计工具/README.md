# SEO 审计工具

> 最后更新：2026-05-11

---

## 工具清单

| 文件 | 功能 | 架构 | 局限 |
|------|------|------|------|
| `seo_technical_auditor.py` | 技术SEO审计（HTTPS/404/重定向/Canonical/robots.txt/Schema/hreflang/H1/ALT） | 纯脚本 | Core Web Vitals 仅基于页面大小估算；无 JS 执行；无语义分析 |
| `onpage_seo_checker.py` | 页面级SEO检查（URL/Title/Meta/标题层级/内容质量/图片/内链/E-E-A-T） | 纯脚本 | E-E-A-T 仅为简单文本模式匹配；关键词密度为字符串匹配 |
| `keyword_cannibalization_checker.py` | 关键词蚕食检测（从TDK提取关键词，识别多页面竞争） | 纯脚本 | 无语义分析（"best running shoes" vs "top athletic footwear" 无法识别为同义） |

## 推荐商业工具

| 工具 | 定位 | 核心功能 | 价格 | 适用场景 |
|------|------|---------|------|---------|
| **SearchAtlas** | 全能 SEO 平台 | OTTO SEO（AI 自动执行 on-page 优化）、Content Genius（AI 内容生成+优化）、LLM 可见性追踪（监控 ChatGPT/Perplexity 等是否引用你的内容）、关键词研究、反向链接分析、技术审计 | $99-$999/月 | SEO agency、内容站、SaaS 增长团队 |

> SearchAtlas 的 OTTO SEO 是差异化功能——接入网站后自动执行 SEO 优化（标题/描述/Schema/内链建议），减少手动操作。LLM 可见性追踪适合关注 GEO 的项目。

---

## 已安装的 SEO Skill（有功能重叠）

| Skill | 来源 | 架构 | 与本目录脚本重叠 |
|-------|------|------|----------------|
| **claude-seo** | AgriciDaniel/claude-seo (19技能+12代理) | 纯 LLM | 重叠：技术审计、页面检查 |
| **Agentic-SEO** | Bhanunamikaze/Agentic-SEO-Skill (16技能+10代理) | 纯 LLM | 重叠：技术审计、页面检查 |
| **seo-geo-claude-skills** | aaron-he-zhu/seo-geo-claude-skills | 纯 LLM | 部分重叠：SEO + GEO |
| **seo-audit-skill** | JeffLi1993/seo-audit-skill | **Script + LLM 双层** | 重叠：审计，但架构更优 |

## 架构对比

```
当前本目录脚本：  纯脚本 → 无法做语义判断（H1意图、内容质量、价值主张）
已装 SEO Skill：  纯 LLM → 确定性事实可能编造（"robots.txt存在"但实际不存在）
seo-audit-skill：  脚本(确定性) + LLM(语义) → 两者优势结合
```

## 未来整合方向

**目标**：基于 Script + LLM 双层架构（见 [03-Skill设计与管理](../../../00-基础能力/03-Skill设计与管理.md#15-script--llm-双层架构)），将本目录脚本 + 已装 Skill 的优势合并为自建 SEO 审计 Skill。

**整合思路**：

1. **Layer 1（脚本）**：复用 `seo_technical_auditor.py` + `onpage_seo_checker.py` 的确定性检查，输出结构化 JSON
2. **Layer 2（LLM）**：补充现有脚本无法做的语义判断（H1意图匹配、Title价值主张、E-E-A-T深度分析、内容质量评估）
3. **整合 Skill**：从 claude-seo / Agentic-SEO / seo-audit-skill 中提取有用模式，整合为一个自建 SEO 审计 Skill

**优先级**：低。等 SEO 实际项目需要时再启动，避免过早优化。

---

## 架构参考：codex-seo 的 Orchestrator + Specialist + Cache 模式

> 来源：[AgriciDaniel/codex-seo](https://github.com/AgriciDaniel/codex-seo)（230 stars, MIT 协议）— Codex CLI 的 SEO Skill 套件，26 个专项工作流 + 24 个 TOML Agent

### 三层架构

```
┌─────────────────────────────────────────────────────┐
│  Orchestrator（SKILL.md）                           │
│  • 自然语言路由：检测意图 → 选择专项工作流            │
│  • 行业检测：SaaS / Local / E-commerce / Publisher   │
│  • 条件式 Agent 调度（不是所有 agent 都跑）           │
├─────────────────────────────────────────────────────┤
│  Specialist Skills（26 个 seo-* SKILL.md）          │
│  • seo-technical / seo-content / seo-schema / ...   │
│  • 每个 specialist 独立可调用，也可被 orchestrator 编排│
│  • 确定性脚本（scripts/）+ LLM 语义判断 双层         │
├─────────────────────────────────────────────────────┤
│  Shared Cache（.seo-cache/）                        │
│  • site-meta.json       → 域名/行业/业务类型          │
│  • audit-scores.json    → 审计评分汇总               │
│  • pages/{slug}/        → 页面级分析上下文            │
│  • 跨 skill 复用，避免重复 API 调用                  │
└─────────────────────────────────────────────────────┘
```

### 条件式调度逻辑（值得借鉴）

| 条件 | 额外 spawn 的 Agent |
|------|-------------------|
| 行业 == Local | seo-local |
| 行业 == Local AND DataForSEO 可用 | seo-maps |
| Google API 凭证存在 | seo-google |
| 电商信号检测到 | seo-ecommerce |
| 内容策略信号（blog/pillar） | seo-cluster |
| 有 drift 基线 | seo-drift |

### Quality Gates 硬性规则

| 规则 | 阈值 | 动作 |
|------|------|------|
| 位置页数量 | 30+ | WARNING（强制 60%+ 独特内容） |
| 位置页数量 | 50+ | HARD STOP（需用户确认） |
| HowTo Schema | 废弃 | 不推荐（2023.9 起） |
| FAQPage Schema | 受限 | 仅政府和医疗站（2023.8）；商业站已有 → 标记 Info 优先级；新增 → 不推荐 |
| CWV 指标 | 统一 | 一律使用 INP，不再用 FID |

### SEO Health Score 权重

| 类别 | 权重 |
|------|------|
| Content Quality | 23% |
| Technical SEO | 22% |
| On-Page SEO | 20% |
| Schema / Structured Data | 10% |
| Performance (CWV) | 10% |
| AI Search Readiness | 10% |
| Images | 5% |

### 与本目录的差距

| 能力 | 本目录 | codex-seo |
|------|--------|-----------|
| 确定性技术审计 | 有（Python 脚本） | 有（Python 脚本） |
| 语义内容分析 | 无 | 有（LLM + E-E-A-T） |
| GEO / AI 搜索就绪度 | 无 | 有（seo-geo） |
| 跨 skill 共享缓存 | 无 | 有（.seo-cache/） |
| 条件式调度 | 无 | 有 |
| 漂移监控（Drift） | 无 | 有（seo-drift） |

**自建时建议**：优先引入 .seo-cache 共享缓存层和条件式调度逻辑，这两个设计模式的 ROI 最高。
