# 07-互动工具（Interactive Tools）

> **定位**：交互式工具产品模块——从数据层 → 视觉层 → 代码实现的完整闭环。区别于 03-内容策略（写文章），这里是**交互工具产品**。
> **结构原则**：按工具分目录，工具内再分 data/engine/build/seo；共享数据独立成层（`_shared/`），历史遗留入 `_archive/`。
> **创建**：2026-06-24（从 03-内容策略 独立）｜**重构**：2026-06-26（按工具拆分目录，原"按层平铺"结构废弃）

---

## 工具矩阵

| 工具 | URL | page | 状态 | 目录 |
|------|-----|------|------|------|
| **Crystal Compatibility Checker** | `/tools/crystal-compatibility-checker/` | 43180 | ✅ 已上线 | [crystal-compatibility-checker/](crystal-compatibility-checker/) |
| **Zodiac Compatibility Checker** | `/tools/zodiac-compatibility-checker/` | 43246 | ✅ 已上线 | [zodiac-compatibility-checker/](zodiac-compatibility-checker/) |
| **Crystal Meaning Search** | `/crystal-meaning-search/` | 44461 | ✅ 已上线 | [crystal-meaning-search/](crystal-meaning-search/) |
| **Bracelet Size Calculator** | `/bracelet-size-calculator/` | 44469 | ✅ 已上线 | [bracelet-size-calculator/](bracelet-size-calculator/) |
| **Ring Size Calculator** | `/ring-size-calculator/` | 44471 | ✅ 已上线 | [ring-size-calculator/](ring-size-calculator/) |
| **Chakra Test** | `/chakra-test/` | 45647 | ✅ 已上线 | [chakra-test/](chakra-test/) |

> **Crystal Horoscope 不在此模块**——它是**内容类目**（`/category/zodiac/horoscope/`，156 篇年运 12 + 月运 144 文章），非互动工具。文章在 `04-内容生产/7.zodiac-yearly-horoscope` + `8.zodiac-monthly-horoscope`，category 全 horoscope。

> **P0 候选（2E 规划）**：~~T2 Crystal Meaning Search~~ ✅（44461）｜~~T1 Bracelet Size Calculator~~ ✅（44469，2026-06-26）。**P0 工具全部上线。**

---

## 目录结构

```
07-互动工具/
├── 00-README.md                       本文件（工具矩阵总览）
├── _shared/                           ⭐ 共享数据底座（390 颗属性库，多工具复用）
│   ├── crystal-attributes.json
│   └── scripts/extract-crystal-profile.js
├── crystal-compatibility-checker/     工具① 水晶×水晶兼容（page 43180）
│   ├── engine/                        pairScore v2 兼容引擎
│   ├── data/crystal-stones-30.json    30 颗核心水晶
│   ├── build/                         generate.js + crystal-checker.html + seo-content.html
│   ├── seo/SEO框架与内链规划.md
│   └── 视觉组件规范.md
├── zodiac-compatibility-checker/      工具② 星座×星座兼容（page 43246）
│   ├── data/zodiac-matrix.json        78 组矩阵
│   └── build/                         generate.js + generate-matrix.js + zodiac-checker.html
├── crystal-horoscope/                 工具③ 占位（待建）
└── _archive/                          仅 compatibility-tool.html（被 04 补丁引用；一次性脚本 2026-06-26 已删）
```

---

## 共享数据层（`_shared/`）

`crystal-attributes.json`（390 颗）是**全站数据基础设施**，不属于任何单工具：
- 覆盖率：Overview/Chakra/Element/Color/Intentions/Zodiac/Forms/Safety 各 **100%**，Mineral 97%，pairing 99.7%
- 现消费者：Crystal Checker engine、Zodiac generate-matrix
- 未来消费者：Crystal Meaning Search（T2）/ Crystal Quiz（T6）/ Birthstone Finder（T8）

详见 [_shared/README.md](_shared/README.md)。

---

## 开发路径（从数据到上线）

每个工具遵循：数据层 → 引擎/逻辑 → 视觉成品 HTML → 部署上线（WP page）→ 留资集成。

| 阶段 | Crystal Checker | Zodiac Checker |
|------|:-:|:-:|
| 数据层 | ✅ | ✅ |
| 引擎/矩阵 | ✅ pairScore v2 | ✅ 78 组 |
| 视觉成品 HTML | ✅ | ✅ |
| 部署上线 | ✅ page 43180 | ✅ page 43246 |
| 留资集成（邮箱换报告） | ⏳ 待做 | ⏳ 待做 |

---

## 相关文档

- **框架规格**：[模板-互动工具框架.md](../03-内容策略/内容Brief/模板-互动工具框架.md)
- **页面工具规划（T1-T10 分级）**：[2E-页面工具规划.md](../02-网站规划/2E-页面工具规划.md)
- **依据层**：[星座内容调研 §五](../03-内容策略/星座内容调研.md)｜[内容策略 §3.3](../03-内容策略/内容策略.md)
- **站点结构（工具 URL）**：[2A-网站结构.md §互动工具页](../02-网站规划/2A-网站结构.md)
