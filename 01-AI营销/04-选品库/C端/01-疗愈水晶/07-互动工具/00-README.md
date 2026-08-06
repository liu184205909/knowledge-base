# 07-互动工具（Interactive Tools）

交互式工具产品模块（数据→逻辑→HTML→WP部署）。区别于 03-内容策略（写文章）。按工具分目录，共享数据归 `_shared/`。

## 工具矩阵（14 工具全部上线）

| 工具 | URL | page | 类型 |
|------|-----|------|------|
| Crystal Compatibility Checker | `/tools/crystal-compatibility-checker/` | 43180 | 兼容计算 |
| Zodiac Compatibility Checker | `/tools/zodiac-compatibility-checker/` | 43246 | 兼容计算 |
| Crystal Meaning Search | `/crystal-meaning-search/` | 44461 | 搜索 |
| Bracelet Size Calculator | `/bracelet-size-calculator/` | 44469 | 尺寸 |
| Ring Size Calculator | `/ring-size-calculator/` | 44471 | 尺寸 |
| Chakra Test | `/tools/chakra-test/` | 45647 | 性格→水晶 |
| Element Test | `/tools/element-test/` | 45663 | 性格→水晶 |
| Crystal Quiz | `/tools/crystal-quiz/` | 45670 | 性格→水晶 |
| Cleansing Timer | `/tools/crystal-cleansing-timer/` | 45681 | safety+计时 |
| Birthstone Finder | `/tools/birthstone-finder/` | 45772 | 选月→生辰石 |
| Moon Phase Calendar | `/tools/moon-calendar/` | 45777 | 月相→水晶 |
| Life Path Calculator | `/tools/numerology-calculator/` | 47687 | 生日→Life Path |
| Chinese Zodiac Checker | `/tools/chinese-zodiac-checker/` | 47972 | 生日→生肖 |
| Crystal Tarot Reading | `/tools/crystal-tarot-reading/` | 48050 | 塔罗抽牌 |

剩 T7 Crystal Identifier（推迟，AI 图片识别）/ T9 Bead Converter（不做）。Crystal Horoscope 是内容类目（`/category/zodiac/horoscope/`，156 篇），非工具。

## 目录结构

```
07-互动工具/
├── _shared/                       共享数据底座
│   ├── crystal-attributes.json    390颗全属性+safety（全站基础设施）
│   ├── {chakra/element/color/cleansing/numerology/chinese-zodiac}-knowledge.json   文章M2+工具单源共用
│   └── scripts/                   create-page.js / update-page.js（WP部署）
├── <tool>/build/                  每工具自包含：generate.js + seo-content.html → .html
└── _archive/                      历史遗留
```

- **URL 规则**：测试/计算类挂 tools 父页(43101)→`/tools/xxx/`；早期搜索/尺寸工具根级
- **部署**：`<!-- wp:html -->` 包裹防 wpautop；safeJSON 只转义 `</`，不加非 ASCII 转义（见 memory [[generate-js-html-newline-trap]]）

## 相关文档

- [2E-页面工具规划.md](../02-网站规划/2E-页面工具规划.md)（T1-T10 分级 + 完成状态）
- [模板-互动工具框架.md](../03-内容策略/内容Brief/模板-互动工具框架.md)
