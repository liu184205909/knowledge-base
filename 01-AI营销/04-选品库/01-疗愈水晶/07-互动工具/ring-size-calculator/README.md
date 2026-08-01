# Ring Size Calculator（R）

> **URL**：`/ring-size-calculator/`（page 44471）｜**状态**：✅ 已上线（2026-06-26）
> **本质**：Crystal Ring Sizing & Buying Guide（独立于 T1 bracelet——不同搜索意图）
> **URL 注**：根级，后台改 parent=tools → `/tools/ring-size-calculator/`

---

## 为何独立（不与 bracelet tab 合一）

- `ring size calculator` 与 `bracelet size calculator` 是**不同搜索意图/关键词** → 独立页各自主关键词 + 各自 HowTo Schema
- 戒指独特价值：**国际尺码转换表**（US / EU / 港度 HK / CN），tab 合一装不下
- 2A 一致（每工具一页）

---

## 双方式计算器

- **方式 1**：手指周长 mm（纸条量）→ 内径 = 周长/π → US 号
- **方式 2**：现有戒指内径 mm → US 号
- **输出**：US + EU + 港度 HK + CN + 内径/内周长 mm + Shop 链接

---

## 尺码表

US 含半号（3–13）/ EU 44–69 / 港度 HK 6–26 / CN 4–14 / 内径 14.0–22.2mm / 内周长 44.0–69.7mm。
S4 转换表显示 11 行整号；计算器查表含半号（更精确）。

---

## 目录

| 路径 | 内容 |
|------|------|
| `build/generate.js` | 生成成品（双方式计算器 + 转换表 + Schema） |
| `build/generate-ring-images.js` | 生 3 张测量图（gpt-image-2，优化 prompt） |
| `build/images/measure-{finger,ring,sizer}.webp` | 测量图（base64 内联） |
| `build/deploy.js` | 首次建 page + 上传 |
| `build/ring-size-calculator.html` | 成品（397 KB） |

---

## 测量图优化（避手部瑕疵，同 T1 范式）

- finger：手指局部特写 + 真实皮肤（pores/fingerprint/nail）
- ring / sizer：**无手**（戒指+尺子 / 测量器+尺子）

---

## 相关

- 规划：戒指为 T1 的扩展（独立页决策，非 2E 原列）
- 待做：URL 移到 `/tools/`（parent=tools）
