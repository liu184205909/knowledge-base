# 07-互动工具（Interactive Tools）

> **定位**：交互式工具产品模块——从数据层 → 视觉层 → 代码实现的完整闭环。区别于 03-内容策略（写文章），这里是**交互工具产品**。
> **结构原则**：按工具分目录，工具内再分 data/engine/build/seo；共享数据独立成层（`_shared/`），历史遗留入 `_archive/`。
> **创建**：2026-06-24（从 03-内容策略 独立）｜**重构**：2026-06-26（按工具拆分目录）｜**更新**：2026-06-27（P0+P1 全完成，9 工具上线）

---

## 工具矩阵（2026-06-27）

| 工具 | URL | page | 状态 | 类型 | 目录 |
|------|-----|------|------|------|------|
| Crystal Compatibility Checker | `/tools/crystal-compatibility-checker/` | 43180 | ✅ | 兼容计算 | [crystal-compatibility-checker/](crystal-compatibility-checker/) |
| Zodiac Compatibility Checker | `/tools/zodiac-compatibility-checker/` | 43246 | ✅ | 兼容计算 | [zodiac-compatibility-checker/](zodiac-compatibility-checker/) |
| Crystal Meaning Search (T2) | `/crystal-meaning-search/` | 44461 | ✅ | 搜索 | [crystal-meaning-search/](crystal-meaning-search/) |
| Bracelet Size Calculator (T1) | `/bracelet-size-calculator/` | 44469 | ✅ | 尺寸计算 | [bracelet-size-calculator/](bracelet-size-calculator/) |
| Ring Size Calculator | `/ring-size-calculator/` | 44471 | ✅ | 尺寸计算 | [ring-size-calculator/](ring-size-calculator/) |
| Chakra Test (T5) | `/tools/chakra-test/` | 45647 | ✅ | 性格测试→水晶 | [chakra-test/](chakra-test/) |
| Element Test | `/tools/element-test/` | 45663 | ✅ | 性格测试→水晶 | [element-test/](element-test/) |
| Crystal Quiz (T6) | `/tools/crystal-quiz/` | 45670 | ✅ | 性格测试→水晶 | [crystal-quiz/](crystal-quiz/) |
| Cleansing Timer (T4) | `/tools/crystal-cleansing-timer/` | 45681 | ✅ | 工具（safety+计时） | [cleansing-timer/](cleansing-timer/) |
| Birthstone Finder (T8) | `/tools/birthstone-finder/` | 45772 | ✅ | 选月→生辰石 | [birthstone-finder/](birthstone-finder/) |
| Moon Phase Calendar (T10) | `/tools/moon-calendar/` | 45777 | ✅ | 月相→水晶 | [moon-calendar/](moon-calendar/) |
| Life Path Calculator | `/tools/numerology-calculator/` | 47687 | ✅ | 生日→Life Path+水晶 | [numerology-calculator/](numerology-calculator/) |

> **P0 + P1 + T8 全部上线（10 工具）**。剩 P2：T7 Crystal Identifier / T9 Bead Converter / T10 Moon Calendar（未做）。

> **Crystal Horoscope 不在此模块**——它是**内容类目**（`/category/zodiac/horoscope/`，156 篇年运 12 + 月运 144 文章），非互动工具。文章在 `04-内容生产/7+8`。

---

## 目录结构

```
07-互动工具/
├── 00-README.md                   本文件（工具矩阵总览）
├── _shared/                       ⭐ 共享数据底座（390颗属性库 + 单源knowledge JSON）
│   ├── crystal-attributes.json    390颗全属性（含safety/overview/mineral/pairings）
│   ├── chakra-knowledge.json      脉轮知识（文章M2+chakra-test共用，待抽）
│   ├── element-knowledge.json     四元素知识（文章M2+element-test共用 ✅）
│   ├── color-knowledge.json       12色知识（文章M2+crystal-quiz共用 ✅）
│   ├── cleansing-knowledge.json   7净化方式（cleansing-timer ✅）
│   └── scripts/extract-crystal-profile.js
├── crystal-compatibility-checker/ 工具① 水晶×水晶兼容（43180）
├── zodiac-compatibility-checker/  工具② 星座×星座兼容（43246）
├── crystal-meaning-search/        T2 水晶含义搜索（44461，根级）
├── bracelet-size-calculator/      T1 手链尺码（44469，根级）
├── ring-size-calculator/          R 戒指尺码（44471，根级）
├── chakra-test/                   T5 脉轮测试（45647，/tools/）
├── element-test/                  元素测试（45663，/tools/）
├── crystal-quiz/                  T6 水晶颜色测试（45670，/tools/）
├── cleansing-timer/               T4 净化计时+safety（45681，/tools/）
└── _archive/                      历史遗留（旧脚本/一次性fix）
```

**URL 规则**：性格测试类（Checker/Zodiac/chakra/element/crystal-quiz/cleansing）挂 tools 父页(43101)→ `/tools/xxx/`；计算/搜索工具（T1/R/T2）根级。

---

## 共享数据层（`_shared/`）

`crystal-attributes.json`（390 颗，全属性 100% + safety 100%）是**全站数据基础设施**。单源 knowledge JSON 让**文章 M2 与工具共用同一数据**（避免不一致）：
- **现消费者**：全部 9 工具 + chakra/color/element/cleansing 文章
- chakra-test（chakras 字段）/ element-test（_shared/element-knowledge）/ crystal-quiz（_shared/color-knowledge）/ cleansing-timer（safety + _shared/cleansing-knowledge）

详见 [_shared/README.md](_shared/README.md)。

---

## 开发路径（性格测试类标准流程）

数据层 → 引擎/逻辑 → 视觉 HTML → 部署（WP page，`<!-- wp:html -->` 包裹防 wpautop）→ SEO 折叠 → （留资待做）。

chakra/element/crystal-quiz/cleansing 走验证流程：**SERP 验证 → 数据层 → 审核 agent → 单源 knowledge → SEO（基于竞品）→ 上线**。

---

## 相关文档

- **框架规格**：[模板-互动工具框架.md](../03-内容策略/内容Brief/模板-互动工具框架.md)（含工具矩阵总览）
- **页面工具规划（T1-T10 分级 + 完成状态）**：[2E-页面工具规划.md](../02-网站规划/2E-页面工具规划.md)
- **站点结构（工具 URL）**：[2A-网站结构.md](../02-网站规划/2A-网站结构.md)
