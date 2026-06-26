# Crystal Horoscope（工具③ · 占位）

> **URL**：`/tools/crystal-horoscope/`（主入口）+ 12 星座子页 `/crystal-horoscope/{sign}/`
> **状态**：🔄 规划中（第二阶段，待两个 Checker 留资闭环后启动）
> **本质**：内容型工具（查 JSON 渲染当月运势×水晶），非计算型

---

## 规划要点

- 每月每星座：Crystal of the Month + 四象限运势（Love / Career / Wellness / Spirituality）+ 3 颗 power stones + 月度仪式/冥想
- 留资：本月免费；"Get Next Month Early + Personalized Daily Crystal" → 邮箱订阅
- 12 星座子页用 programmatic SEO（复用 intention/condition 批量页 SOP）
- 每月初批量更新 12 篇（Rank Math updateMeta / WP REST）

## 依据

框架规格见 [模板-互动工具框架.md](../../03-内容策略/内容Brief/模板-互动工具框架.md) 工具② Crystal Horoscope。
竞品：Satin Crystals（目录归档，非真工具）/ astrostyle。

## 待建

- [ ] `data/` 月度内容 JSON 结构
- [ ] `build/` 生成脚本
- [ ] 留资集成
