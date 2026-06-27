# Chakra Test（T5）

> **URL**：`/chakra-test/`（page 45647）｜**状态**：✅ 已上线（2026-06-27）
> **本质**：14 题问卷测失衡脉轮 → 推荐水晶（7 脉轮 × 2 题，3 级量表）
> **URL 注**：根级，后台改 parent=tools → `/tools/chakra-test/`

---

## 设计（基于竞品调研）

调研 eclecticenergies（#1, 56 题）+ crystals.com（#8, 唯一水晶站）后定：
- **14 题（7 脉轮 × 2）**：比 56 题短（不掉率），比 "few questions" 全（覆盖 7 脉轮）
- **3 级量表** Rarely / Sometimes / Often
- **算分**：每脉轮 2 题和（2-6），blocked = 低分 1-2 个
- **结果**：blocked 脉轮 + 水晶推荐（每脉轮 5 颗）+ 全 7 脉轮条形图表 + 留资（全脉轮报告）

## 差异化（vs 竞品）

| | eclecticenergies #1 | crystals.com #8 | **我们** |
|---|---|---|---|
| 题数 | 56（太长）| few（太薄）| **14（平衡）** |
| 水晶推荐 | ❌ | 每脉轮 2 颗 | **每脉轮 5 颗（390 颗数据）** |
| 导购/留资 | ❌ | shop | shop + 留资 |

## 目录

| 路径 | 内容 |
|------|------|
| `build/generate.js` | 生成成品（14 题问卷 + 算分 + 渲染 + Schema） |
| `build/chakra-test.html` | 成品（28 KB） |

## 数据

- 14 题硬编码（7 脉轮 × 2，root/sacral/solar-plexus/heart/throat/third-eye/crown 各 2）
- 每脉轮水晶：读 `crystal-meaning-search/data/search-data.json` 的 chakras 字段，filter 含该脉轮，取 5 颗（优先有 by-stone shop）

## 算分逻辑

```
每题 Rarely=1 / Sometimes=2 / Often=3
每脉轮 = 该脉轮 2 题分和（2-6）
blocked = 分最低的 1-2 脉轮（第二低 ≤ 最低+1 也算）
推荐 = blocked 脉轮对应 chakra 水晶
```

## 相关

- 规划：[2E-页面工具规划.md §T5](../../02-网站规划/2E-页面工具规划.md)
- 数据源：[crystal-meaning-search/data/search-data.json](../crystal-meaning-search/data/search-data.json)（chakras 字段）
- 待做：URL 移到 `/tools/`（parent=tools）；留资功能接入 Newsletter
