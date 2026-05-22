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
