# About Us 页面内容指南

> 高转化 About Us 页面的内容框架。适用于 RLM 步骤 2A/2B。

---

## 核心观念

**About Us 不是"关于我们"，而是"关于客户"——我们如何为客户创造价值。**

---

## 8 个必备要素

| # | 要素 | 做法 | 避坑 |
|---|------|------|------|
| 1 | **有态度的标题** | 传达品牌态度 | ❌ "About Us" ✅ "Our Mission: To Bring Sustainable Comfort to Your Home" |
| 2 | **品牌故事** | 从 3 个角度选 1-2 个：创始人故事 / 使命驱动 / 产品诞生 | 用具体细节，不说空话 |
| 3 | **使命与价值观** | Mission + Vision + Values，用行动证明 | ❌ "致力于高品质" ✅ "每件由工匠手工穿制" |
| 4 | **真实团队** | 创始人照片 + 团队工作场景 | 真实照片远比图库有说服力 |
| 5 | **产品/工艺价值** | 材料来源 + 制作工艺 + 设计哲学 | 具体细节胜过一百句"高质量" |
| 6 | **社会证明** | 真实评价 + 媒体 logo + UGC + 奖项认证 | 第三方声音 > 自卖自夸 |
| 7 | **行动号召** | 主 CTA → 核心产品 / 次 CTA → 关注社媒 | 不要让页面成为死胡同 |
| 8 | **联系方式** | 底部联系方式或链接到 Contact 页 | B2B 有实体店地址极大增强信任 |

---

## 设计要点

| 要点 | 要求 |
|------|------|
| 高质量视觉 | 专业高清图/视频，品牌故事视频效果远超文字 |
| 清晰排版 | 大量留白，标题/副标题/短段落/列表 |
| 品牌一致 | 字体/颜色/语调与全站一致 |
| 移动端优先 | 大多数电商流量来自手机 |

---

## 常见错误

| 错误 | 正确做法 |
|------|---------|
| 全文字没图片 | 图文结合，优先真实图片 |
| 空洞口号 | 具体故事和数据证明 |
| 内容冗长 | 突出重点，简洁有力 |
| 忘记 CTA | 每个页面都有下一步引导 |
| 隐藏页面 | 页头/页脚清晰放置链接 |

---

## 页面结构

```
[有态度的 Hero 标题]
[品牌故事（选 1-2 个角度深入）]
[使命与价值观]
[团队展示]
[产品/工艺价值]
[社会证明]
[CTA：主要 + 次要]
[联系方式]
```

---

## Claude Code Elementor 生成规范

### 页面基础信息

| 项目 | 值 |
|------|---|
| 页面类型 | Elementor Page |
| REST API 端点 | `/wp-json/wp/v2/pages` |
| 模板类型 | `wp-page` |
| 创建方式 | 从零创建 |

### 标准 Section 结构

| Section | 目标 | 推荐 Widget | 关键字段 |
|---------|------|------------|---------|
| **S1: Hero** | 品牌态度传达 | heading, text-editor, button | hero_title（**不能写"About Us"**，必须表达品牌使命或客户价值），hero_subtitle, cta_text, cta_url, hero_image |
| **S2: Brand Story** | 情感连接 | heading, text-editor, image | founder_story 或 brand_origin；**必须包含具体时间、场景、动机，避免空话** |
| **S3: Mission / Vision / Values** | 价值观传达 | icon-box 或 heading + text-editor | 3 列布局，移动端 1 列；`flex_direction: 'row'`，`flex_wrap: 'wrap'`，不用 structure |
| **S4: Team** | 真实感 | image, heading, text-editor | 团队成员照片（**必须真实照片**，不用图库） |
| **S5: Craft / Product Value** | 工艺信任 | image-box 或 image + heading + text-editor | materials, process, quality_proof |
| **S6: Social Proof** | 第三方背书 | image, heading, text-editor | **数据来源：真实评价、媒体 logo、UGC；禁止 AI 虚构** |
| **S7: CTA** | 引导下一步 | heading, text-editor, button | CTA 链接**必须来自站点配置或人工输入** |
| **S8: Contact** | 联系方式 | text-editor, shortcode（如联系表单） | email, address, 社交媒体链接 |

### 数据来源规则

| 内容类型 | 来源 | AI 能否生成 |
|----------|------|-----------|
| 品牌故事 | 创始人真实经历 | 禁止 AI 编造（创始人姓名、成立年份、具体事件） |
| 价值观文案 | 业务输入 | 可辅助润色，需人工确认 |
| 团队照片 | 真实拍摄 | 禁止使用图库照片 |
| 客户评价 | 真实评价素材 | 禁止 AI 虚构 |
| 工艺/材料描述 | 业务输入 | 可辅助组织语言 |
| CTA 链接 | 站点实际 URL | 必须人工确认 |

### 验收清单

- [ ] Hero 标题不是 "About Us"
- [ ] 品牌故事包含具体细节（时间/场景/动机）
- [ ] 所有图片有真实来源
- [ ] 社会证明内容可追溯到真实素材
- [ ] CTA 链接指向正确页面
- [ ] 3 列 Values 在手机端折叠为 1 列
