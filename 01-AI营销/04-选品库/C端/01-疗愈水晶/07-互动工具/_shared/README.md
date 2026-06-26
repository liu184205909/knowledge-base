# _shared — 共享数据底座

> **定位**：全站水晶数据基础设施，**不属于任何单工具**。多个互动工具（及未来工具）共用。
> **原则**：390 颗水晶属性库是全站底座，不绑定 Crystal Checker；未来 Meaning Search / Quiz / Birthstone 都从这里取数，不跨工具文件夹引用。

---

## crystal-attributes.json（390 颗结构化属性库）

| 维度 | 字段 | 覆盖率 |
|------|------|--------|
| Overview | Chakra / Zodiac / Element / Number / Color / Intentions / Best for / Forms | **100%** (390/390) |
| Mineral | Formula / Crystal system / Hardness / Luster / SG / Transparency / Color cause / Origins | 97% (378/390) |
| Safety | Water / Sun / Salt 三档 | **100%** |
| Pairings | 站内 bestWith 搭配 | 99.7% (389/390) |

**独有维度**（竞品裸石站没有）：**Forms（首饰形态 Bracelet/Pendant…）+ Safety（Water/Sun/Salt）**。

### schema
```
overview: Chakra / Zodiac / Element / Number / Color / Intentions / Best for / Forms
mineral:  Formula / Crystal system / Hardness / Luster / SG / Transparency / Color cause / Origins
safety:   Water / Sun / Salt
pairings: [{ slug, name }]
```

### 数据源头
站内 `04-内容生产/1.crystal-meaning/*.json`（390 颗）content HTML 末尾的 `<div class="crystal-profile">` 侧边栏 + "Best Crystals to Pair With" 章节。**不依赖竞品**。

---

## scripts/extract-crystal-profile.js

从 390 json 抽取属性库 → 生成 `crystal-attributes.json`。

```bash
node _shared/scripts/extract-crystal-profile.js
```

---

## 消费者

| 消费者 | 用途 |
|--------|------|
| Crystal Checker `engine/compatibility-engine.js` | pairScore 的 element/chakra/intention/pairing |
| Zodiac Checker `build/generate-matrix.js` | 反向提取每星座水晶 |
| **未来** Crystal Meaning Search（T2） | 按颜色/脉轮/意图筛选 |
| **未来** Crystal Quiz（T6）/ Birthstone Finder（T8） | 推荐逻辑数据源 |
