# Bracelet Size Calculator（T1）

> **URL**：`/bracelet-size-calculator/`（page 44469）｜**状态**：✅ 已上线（2026-06-26）
> **本质**：Crystal Bracelet Sizing & Buying Guide（2E §七修订：选购指南 + 计算器模块，教育内容做护城河防 Generative UI）
> **URL 注**：根级，后台改 parent=tools → `/tools/bracelet-size-calculator/`

---

## 结构（2E §七）

Hero + S1 为何尺寸重要 + S2 测量方法（3 图）+ S3 计算器 + S4 珠子尺寸建议 + S5 产品 + S6 FAQ + S7 尺寸反馈 CTA

---

## 计算（纯前端 JS）

手腕周长（cm/inch）+ 松紧（snug/comfort/loose）→ 推荐手链内周长 + 尺寸档（XS-XL）+ 珠子建议

- 加放：snug +1.5cm / comfort +2.0cm / loose +2.7cm
- 尺寸档：<17 XS / 17-18.5 S / 18.5-20 M / 20-21.5 L / 21.5+ XL
- 珠子：手腕 <16 → 6-8mm / 16-18 → 8-10mm / >18 → 10-12mm

---

## 目录

| 路径 | 内容 |
|------|------|
| `build/generate.js` | 生成成品（计算器 + 页面 + Schema） |
| `build/generate-measurement-images.js` | 生 3 张测量图（gpt-image-2，优化 prompt 避手部瑕疵） |
| `build/images/measure-{tape,paper,existing}.webp` | 测量图（base64 内联到 HTML） |
| `build/deploy.js` | 首次建 page + 上传 |
| `build/bracelet-size-calculator.html` | 成品（247 KB，含图 + Schema） |

---

## 测量图生图优化（避免手部 AI 瑕疵）

之前佩戴图有塑料感/畸形，测量图用三大优化避坑：
1. **手腕局部 / 不生整手**（forearm-to-wrist 侧面；existing 图直接无手）
2. **强化真实皮肤**（`visible pores, fine arm hairs, subtle veins, anatomically correct`）
3. **负面指令**（`no plastic skin, no smooth airbrushed skin, no extra fingers, no deformed hands`）

---

## 重新生成 / 部署

```bash
node build/generate-measurement-images.js   # 重生测量图（API 调用，~2-3 分钟）
node build/generate.js                        # → HTML（含 base64 图 + Schema）
# 部署：page 44469 已建，重跑 deploy.js 会 slug 冲突；改用 WP REST update（POST /pages/44469）
```

---

## 相关

- 规划：[2E-页面工具规划.md §T1 + §七](../../02-网站规划/2E-页面工具规划.md)
- 待做：URL 移到 `/tools/`（parent=tools）；S7 尺寸反馈闭环（评价系统接入）
