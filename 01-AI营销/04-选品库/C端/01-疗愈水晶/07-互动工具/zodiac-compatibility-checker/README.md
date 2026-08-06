# Zodiac Compatibility Checker（工具②）

> **URL**：`/tools/zodiac-compatibility-checker/`（page 43246）｜**状态**：✅ 已上线
> **本质**：星座×星座兼容（12×12=78 组矩阵查表渲染）
> **拆分**：2026-06-25 从 Crystal Checker 独立（搜索意图不同：水晶能不能一起戴 vs 两星座关系+推荐水晶）

---

## 数据流

```
data/zodiac-matrix.json (78 组)
        ↓ build/generate.js (内嵌 ZM + 注入 SEO 长文)
build/zodiac-checker.html (成品 116 KB)
        ↓ 部署（wp:html 块包裹）
page 43246 上线
```

### ⚠️ zodiac-matrix.json 的两个来源（待确认当前生效源）

1. `build/generate-matrix.js`：从 `_shared/crystal-attributes.json` 的 Zodiac 字段反向提取 + 占星相位评分生成（字段含 signs/elements/phase/score/band/headline/description/crystals）
2. `04-内容生产/4.zodiac-compatibility/pairing-data.json` 导出子集：含差异化字段（coreChallenge/synergy/communicationPattern）

> 星座配对框架（03-内容策略）记载 zodiac-matrix.json 是 pairing-data.json 的**导出子集**；但磁盘上的 `generate-matrix.js` 是从属性库生成的路径。两者字段集不同。当前 `build/generate.js` 直接读 `data/zodiac-matrix.json` 渲染——**生产环境由哪条路径维护待确认**。详见 [模板-星座配对×水晶框架.md §与工具数据层的关系](../../03-内容策略/内容Brief/模板-星座配对×水晶框架.md)。

---

## 目录

| 路径 | 内容 |
|------|------|
| `data/zodiac-matrix.json` | 78 组星座兼容矩阵 |
| `build/generate.js` | 生成 zodiac-checker.html（原 `generate-zodiac-checker.js`；2026-06-26 重构改为直接读 json，摆脱旧 compatibility-tool.html 依赖） |
| `build/generate-matrix.js` | 从属性库生成 zodiac-matrix.json（原 `zodiac-matrix.js`） |
| `build/zodiac-checker.html` | 成品页面（部署到 43246） |

---

## 相位评分（占星 synastry 传统，非凭空编）

| 相位 | 角度 | 评分 | 定性 |
|------|------|------|------|
| Trine（同元素三合） | 120° | 91 | Powerful Synergy |
| Sextile（互补六合） | 60° | 80 | Natural Allies |
| Conjunction（同星座） | 0° | 76 | Mirror Souls |
| Opposition（对宫） | 180° | 67 | Magnetic Opposites |
| Semi-sextile | 30° | 62 | Gentle Neighbors |
| Quincunx | 150° | 51 | Delicate Balance |
| Square（刑） | 90° | 43 | Growth Through Tension |

水晶推荐：站内 Zodiac 字段反向提取每星座水晶 + 调和水晶（紧张关系 → rose-quartz 柔化；和谐 → quartz 放大）。

---

## 重新生成

```bash
node build/generate-matrix.js   # 重生 data/zodiac-matrix.json（属性库路径）
node build/generate.js          # → build/zodiac-checker.html（116 KB）
```

---

## 相关

- 数据源属性库：[_shared/crystal-attributes.json](../_shared/crystal-attributes.json)
- 配对文章权威源：`04-内容生产/4.zodiac-compatibility/pairing-data.json`
- 框架规格：[模板-互动工具框架.md](../../03-内容策略/内容Brief/模板-互动工具框架.md) 工具②
- 待做：独立 SEO 框架（链 78 篇星座配对文章，另规划）+ 留资集成
