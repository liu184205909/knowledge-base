# 07-互动工具（Compatibility Checker + Crystal Horoscope）

> **定位**：两个互动工具的**产品开发模块**——从框架规格 → 数据层 → 视觉层 → 代码实现的完整闭环。区别于 03-内容策略（写文章），这里是**交互式工具产品**。
> **创建**：2026-06-24（从 03-内容策略 独立，工具是横切性产品模块）
> **线上状态**：Compatibility Checker 页面已建（page ID 43180，空白待填）；Crystal Horoscope 待建

---

## 两个工具

| 工具 | URL | 本质 | 状态 |
|------|-----|------|------|
| **Crystal Compatibility Checker** | `/tools/crystal-compatibility-checker/` | 计算型（前端JS） | 页面43180已建空白，开发中 |
| **Crystal Horoscope** | `/tools/crystal-horoscope/` | 内容型（查JSON渲染） | 待建 |

---

## 文档结构

```
07-互动工具/
├── 00-README.md（本文件，模块总览）
├── 01-竞品工具调研/       ← 多竞品 UI + 数据层调研（crystalmeaning/cafeastrology/crystalvaults/astroformer/...）
├── 02-数据层/             ← ⭐ 核心：水晶属性库 + 星座12×12矩阵 + 兼容规则 + 冲突清单
├── 03-视觉层/             ← UI 实拍/线框/组件规范
└── 模板-互动工具框架.md   ← 从 03-内容策略/内容Brief 迁移（框架规格层）
```

---

## 开发路径（从框架到上线）

| 步骤 | 内容 | 状态 |
|------|------|------|
| 0 | 框架规格书（URL/页面结构/计算逻辑规则/技术路线/SEO） | ✅ 已完成（见框架文档） |
| 1 | **竞品数据层调研**（多竞品的水晶属性schema/兼容规则/矩阵打分/冲突依据） | 🔄 进行中 |
| 2 | **数据层构建**（⭐ 当前主线） | ⏳ 待做 |
| 3 | 视觉层（UI实拍/组件规范，对齐品牌语调§0.1 + Elementor卡片规范） | ⏳ 待做 |
| 4 | 代码实现（前端JS + WoodMart Code Snippets REST） | ⏳ 待做 |
| 5 | 留资集成（邮箱换完整报告 → Newsletter） | ⏳ 待做 |
| 6 | SEO + 上线（Meta/Schema + 内链） | ⏳ 待做 |

---

## 相关文档

- **框架规格**：[模板-互动工具框架.md](模板-互动工具框架.md)（计划从 03-内容策略/内容Brief 迁入）
- **依据层**：[星座内容调研](../03-内容策略/星座内容调研.md) §五（工具调研）｜[内容策略](../03-内容策略/内容策略.md) §3.3
- **竞品表**：Google Sheets「竟对清单」ID `1zcWFPw7lFq_L6aBpEEpBhU0FKf7uJi6hiQYCVoah_vA`
