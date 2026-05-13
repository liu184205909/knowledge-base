# Product Detail Page 页面内容指南

> 高转化产品详情页的卖点提炼和 UX 设计要点。适用于 RLM 步骤 2A/2B。
> 来源：张友兵、Budai Media、Shopify Blog

---

## 核心观念

**产品详情页是数字货架上的产品陈列。** 用户停下来、审视、决定是否购买。

核心任务不是罗列参数，而是让用户确信"这就是我需要的"。卖点不在于数量，而在于精准组合（不超过 5 个）。

---

## FABE 法则

| 步骤 | 回答 | 示例（GORE-TEX 外套） |
|------|------|----------------------|
| **F** Features | 这是什么？ | 面料采用 GORE-TEX |
| **A** Advantages | 比别的好在哪？ | 100% 防水同时透气 |
| **B** Benefits | 对我有什么用？ | 暴雨徒步内部干爽，不会感冒 |
| **E** Evidence | 你怎么证明？ | 暴雨实拍视频、SGS 认证 |

### "So What?" 诊断

- **新手** — 只罗列 F → 用户"那又怎样？"
- **老手** — 强调 B → 用户感受到利益
- **高手** — F+A 支撑 → B 击中痛点 → E 锁定成交

> **B（利益）是最重要的环节。** 用户买的是产品能解决的问题。

---

## 卖点三分类

### 1. 通用型（品类基础）

用户的基本期望，不说减分，说了不加分。用 Icon/短句陈列，不需要 FABE 展开。

### 2. 独特型（USP 差异化）

用户选择你的核心理由。**用 FABE 浓墨重彩地写**，放在首屏/核心区域。

### 3. 保障型（风险逆转）

不直接促成购买，但**防止用户在付款时流失**。放在 CTA 附近反复出现。

### 组合策略

```
排列顺序：独特型 → 保障型 → 通用型
数量：不超过 5 个（独特型 2-3 + 保障型 1-2 + 通用型 0-1）
展开程度：独特型 FABE 完整 / 保障型 重点 B+E / 通用型 参数表一笔带过
```

---

## 产品页 UX 要点

### 图片与视频

| 要素 | 要求 |
|------|------|
| 产品图 | 多角度、可放大、高清，不同体型模特展示 |
| 产品视频 | 与图片并列，展示运动/使用状态 |
| 图片画廊 | 横向滑动，不破坏页面结构 |

### 布局

| 技巧 | 说明 |
|------|------|
| 项目符号 | bullet list 展示特性，不用长段落 |
| 手风琴折叠 | FAQ/参数折叠隐藏 |
| 图标提示 | 物流/退换/信任用小图标 |
| 面包屑 | Home > Category > Product |

### CTA 优化

| 要素 | 要求 |
|------|------|
| 位置 | 紧跟尺码/颜色选择 |
| 文案 | 说明点击后获得什么 |
| 支付方式 | CTA 下方显示分期选项 |
| 物流信息 | CTA 下方显示配送时效 |
| 移动端 | Sticky CTA 始终可见 |

### 交叉销售

- "Complete the Look" 而非 "You May Also Like"
- 推荐**互补**商品，放 CTA 之后

### 社会证明

- UGC 真实客户照片
- "How to Use" 使用指南
- 评价按肤质/体型等分类筛选
- 从评论中提取 FAQ

---

## 常见错误

| 错误 | 正确做法 |
|------|---------|
| 只列 Features 不说 Benefits | 每个卖点落到"对用户的价值" |
| 卖点堆砌超过 5 个 | 精选 5 个以内，重点展开 |
| 通用型卖点放最前 | 独特型优先 |
| 保障型藏太深 | 放 CTA 附近 |
| 图片模糊/角度单一 | 多角度高清图 + 视频 |

---

## 页面结构

```
[面包屑导航]
[首屏：产品主图/视频 + 核心卖点 + 价格 + CTA]
[尺码/颜色选择 + "尺码合适"链接]
[CTA + 分期付款 + 物流信息]
[独特型卖点 1-2：FABE展开]
[产品细节图/视频]
[用户评价（分类筛选 + UGC + FAQ）]
[交叉销售]
[保障型卖点]
[通用型 / 参数表（折叠）]
[底部 sticky CTA（移动端）]
```

---

## Claude Code Elementor 生成规范

### 页面基础信息

| 项目 | 值 |
|------|---|
| 页面类型 | Elementor Page（产品 Landing Page 风格）或 WooCommerce Product |
| REST API 端点 | Elementor: `/wp-json/wp/v2/pages`；WooCommerce: `/wp-json/wc/v3/products` |
| 模板类型 | `wp-page`（Elementor 页面）或 WooCommerce 原生产品 |
| 创建方式 | 先区分用途再创建 |

### 两种用途区分

| 用途 | 说明 | 实现方式 |
|------|------|---------|
| **A. 产品 Landing Page** | 单品推广页，用于广告/社媒引流 | Elementor Page，完整视觉布局 |
| **B. WooCommerce 产品页** | 电商正式产品详情页 | WooCommerce Product + 主题模板 |

> 如果目标是 B，不应通过 Elementor REST API 创建普通 Page，而应操作 WooCommerce 产品数据。

### 产品 Landing Page 标准 Section 结构

| Section | 目标 | 推荐 Widget | 关键字段 |
|---------|------|------------|---------|
| **S1: Hero 产品首屏** | 第一印象 + 核心卖点 | heading, text-editor, button, image | product_name, core_benefit, price, cta_text, cta_url, main_product_image |
| **S2: 独特型卖点（FABE）** | 选择理由 | image-box, heading, text-editor | 2-3 个核心 USP，每个用 FABE 展开 |
| **S3: 产品细节** | 深度展示 | image, heading, text-editor, image-gallery | detail_images, materials, process |
| **S4: Social Proof** | 购买信心 | image, heading, text-editor, testimonial | 真实评价 + UGC 图片；**禁止 AI 虚构** |
| **S5: Complete the Look** | 提升客单价 | image-box, button | 互补产品推荐（非同类产品） |
| **S6: 保障型卖点** | 消除顾虑 | icon-box, heading, text-editor | 退换政策、质保、物流时效；**放在 CTA 附近** |
| **S7: FAQ（折叠）** | 解答疑虑 | accordion | 尺码、材质、养护、退换等常见问题 |
| **S8: Final CTA** | 底部转化 | heading, button, text-editor | 与首屏 CTA 一致 |

### WooCommerce 产品必填字段（用途 B）

```
product_name          # 产品名称
price                 # 售价
regular_price         # 原价（划线价）
sale_price            # 促销价
description           # 长描述
short_description     # 短描述
images                # 产品图库（至少 3 张）
categories            # 产品分类 ID
attributes            # 颜色/尺码等属性
sku                   # SKU 编码
stock_status          # 库存状态
```

### 数据来源规则

| 内容类型 | 来源 | AI 能否生成 |
|----------|------|-----------|
| 产品名称/价格/SKU | WooCommerce 数据 | **禁止 AI 编造** |
| 库存/运费 | 业务配置 | **禁止 AI 编造** |
| 核心卖点文案 | 产品资料 + FABE 框架 | AI 可辅助组织 |
| 产品图片 | Media Library | 必须提供 media ID |
| 用户评价 | 真实评价 | **禁止 AI 虚构** |
| 交叉销售产品 | WooCommerce 关联产品 | 必须来自实际数据 |
| 退换/质保政策 | 业务实际政策 | **禁止 AI 编造** |

### 验收清单

- [ ] 卖点不超过 5 个（独特型 2-3 + 保障型 1-2）
- [ ] 价格与 WooCommerce 数据一致
- [ ] 评价来自真实素材
- [ ] 保障型卖点出现在 CTA 附近
- [ ] 交叉销售推荐互补产品（非同类）
- [ ] FAQ 使用 accordion 折叠（不占大量空间）
