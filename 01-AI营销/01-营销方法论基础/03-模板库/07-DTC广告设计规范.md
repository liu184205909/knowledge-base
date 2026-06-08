# D2C 广告设计规范

> **定位**：Canva/Figma 叠加模板时使用的设计规范。AI 图片工具负责生成产品底图，本规范负责文字、布局、设计元素的标准。
>
> **配合使用**：先用 `02-自动化工具库/04-图片生成工具/产品页图片提示词.md` 的「场景7：D2C广告素材」生成底图，再用本规范在 Canva/Figma 中叠加设计元素。
>
> **最后更新**：2026-05-22

---

## 品牌风格锚点

设计时参考以下 D2C 品牌的视觉风格：

| 品牌 | 风格特征 | 适合的产品类型 |
|------|---------|-------------|
| **Grüns / AG1** | 深色背景 + 荧光绿/亮色调、功能感 | 健康/保健品 |
| **Rhode** | 极简、裸色调、高级感 | 护肤/美容 |
| **Huel** | 大胆排版、信息密集但有序 | 食品/代餐 |
| **Apple** | 极致留白、产品为王、极简 | 3C/科技 |
| **True Classic** | 粗犷字体、男性化、直接 | 服装/服饰 |
| **Obvi** | 高饱和度、年轻化、活力 | 营养品 |

---

## 排版规范

### 标题层级

| 元素 | 字号权重 | 字体风格 | 示例 |
|------|---------|---------|------|
| **主标题** | 最大、最粗 | 现代无衬线体（Inter / Montserrat / Poppins） | "FEEL BETTER." "BUILT DIFFERENT." "ENERGY. SIMPLIFIED." |
| **副标题** | 中等、中等粗 | 同字体族、Regular/SemiBold | "Premium ingredients. Zero hassle." |
| **CTA 文字** | 紧凑、粗体 | 全大写或首字母大写 | "SHOP NOW" "GET STARTED" |
| **脚注/标签** | 小字号、Light | 灰色调 | "Free shipping over $50" |

### 标题公式

D2C 广告标题的常见模式：

| 模式 | 示例 | 适用场景 |
|------|------|---------|
| **短句动词** | "FEEL BETTER." "LOOK SHARP." | 品牌广告、认知阶段 |
| **功能声明** | "ENERGY. SIMPLIFIED." "SLEEP. RESTORED." | 产品广告、考虑阶段 |
| **对比句** | "LOOK SHARP. MOVE FAST." | 转化广告 |
| **问题式** | "TIRED OF FEELING TIRED?" | 痛点广告 |
| **数字驱动** | "10X YOUR ENERGY." "IN 30 DAYS." | 效果广告 |

### 副标题公式

| 模式 | 示例 |
|------|------|
| 特征 + 无痛点 | "Premium ingredients. Zero hassle." |
| 日常场景 | "Engineered for daily performance." |
| 事实声明 | "Real results. Real simplicity." |
| 对象定位 | "Built for modern routines." |

---

## 广告布局模板

### 模板 A：产品聚焦型（社媒 Feed 广告）

```
┌──────────────────────────┐
│                          │
│     [产品底图占 60%]       │
│                          │
│  ──────────────────────  │
│  大标题（2-4词）           │
│  副标题（1行）             │
│  [CTA 按钮]               │
│  微型信任标签              │
└──────────────────────────┘
```

**适用**：Facebook/Instagram 单图广告

### 模板 B：对比分割型（Story/Reels 广告）

```
┌──────────┬──────────┐
│          │          │
│  产品图   │  标题区   │
│  + 光效   │  副标题   │
│          │  Benefit  │
│          │  列表     │
│          │  [CTA]    │
└──────────┴──────────┘
```

**适用**：Instagram Story、Facebook Story（9:16）

### 模板 C：Hero Banner 型（落地页）

```
┌──────────────────────────────────────┐
│  导航                                  │
├────────────────┬─────────────────────┤
│                │                     │
│  大标题         │    产品图            │
│  副标题         │    （主焦点）         │
│  Benefit 1-3   │                     │
│  [CTA 按钮]    │                     │
│  信任标签       │                     │
│                │                     │
├────────────────┴─────────────────────┤
│  社会证明条（评分 + 评论摘要）          │
└──────────────────────────────────────┘
```

**适用**：Shopify 首页 Hero、落地页顶部

### 模板 D：Benefit 卡片型（轮播广告）

```
┌──────────────────────────┐
│  卡片1     卡片2     卡片3  │
│  ┌─────┐  ┌─────┐  ┌─────┐│
│  │Icon │  │Icon │  │Icon ││
│  │Benefit│ │Benefit│ │Benefit│
│  │Description│ │Description│ │Description│
│  └─────┘  └─────┘  └─────┘│
│                          │
│        产品图             │
│                          │
│     标题 + [CTA]          │
└──────────────────────────┘
```

**适用**：Instagram Carousel、Facebook 多图广告

---

## 设计元素规范

### CTA 按钮样式

| 样式 | 描述 | 适用场景 |
|------|------|---------|
| **实心圆角** | 品牌色背景 + 白色文字 + 大圆角 | 主CTA、最高优先级 |
| **描边圆角** | 透明背景 + 品牌色边框 + 品牌色文字 | 次要CTA |
| **胶囊按钮** | 超大圆角（完全圆角） | 现代D2C品牌 |

**按钮文字**：4-12字符，动作导向

| 好的CTA | 差的CTA |
|---------|---------|
| SHOP NOW | CLICK HERE |
| GET STARTED | LEARN MORE |
| TRY FREE | SUBMIT |
| CLAIM OFFER | CONTINUE |

### 信任标签样式

信任标签放在 CTA 下方或广告底部，小字号、低调：

```
✓ Free shipping over $50    ⭐ 4.8/5 (2,400+ reviews)    ✓ 30-day money back
```

### Benefit Icons

每个 benefit 用 icon + 1行文字表示：

```
⚡ Energy     🧠 Focus     😴 Sleep     💪 Recovery
```

**要求**：icon 风格统一（线性/填充/双色），不要混用不同来源的 icon。

### 社会证明元素

| 元素 | 格式 | 位置 |
|------|------|------|
| 星级评分 | ⭐⭐⭐⭐⭐ 4.8/5 | CTA下方或底部 |
| 评论数量 | "(2,400+ reviews)" | 评分旁 |
| 单条评论 | "Title" — "Short quote" — Name | 底部卡片 |
| 媒体标志 | "As seen in [LOGO] [LOGO] [LOGO]" | 顶部或底部条 |

---

## 配色方案

### 深色方案（最常见于D2C）

| 元素 | 色值 | 说明 |
|------|------|------|
| 背景 | `#0A0A0A` ~ `#1A1A2E` | 深色底 |
| 主标题 | `#FFFFFF` | 纯白 |
| 副标题 | `#A0A0A0` ~ `#B0B0B0` | 浅灰 |
| CTA 按钮 | 品牌色（如 `#00C853` 绿 / `#FF6B35` 橙） | 高对比 |
| 产品光晕 | 品牌色 20% 透明度 | 柔和发光 |

### 浅色方案

| 元素 | 色值 | 说明 |
|------|------|------|
| 背景 | `#FAFAFA` ~ `#F5F0EB` | 暖白/奶油色 |
| 主标题 | `#1A1A1A` | 深灰 |
| 副标题 | `#6B6B6B` | 中灰 |
| CTA 按钮 | 品牌色或 `#1A1A1A` | 深色按钮 |

---

## 广告尺寸规格

| 平台 | 尺寸 | 比例 | 模板推荐 |
|------|------|------|---------|
| Facebook Feed | 1080×1080 | 1:1 | A |
| Facebook Story | 1080×1920 | 9:16 | B |
| Instagram Feed | 1080×1080 | 1:1 | A |
| Instagram Story | 1080×1920 | 9:16 | B |
| Instagram Carousel | 1080×1080 | 1:1 | D |
| Shopify Hero Banner | 1920×800 | ~2.4:1 | C |
| Landing Page Hero | 1440×900 | ~16:10 | C |

---

## 制作工作流

```
步骤1：用 AI 图片工具生成产品底图
    ↓ 使用「场景7：D2C广告素材」prompt
    ↓ 选择需要的尺寸（1:1 / 9:16 / 横版）
步骤2：导入 Canva/Figma
    ↓ 用对应模板叠加设计元素
步骤3：添加文案
    ↓ 主标题 + 副标题 + CTA + 信任标签
步骤4：导出
    ↓ PNG（广告投放）或 WebP（网站用）
    ↓ 多尺寸变体：同一设计 → 1:1 + 9:16 + 横版
```

---

## 参考品牌广告拆解

做广告前，先研究参考品牌的真实广告素材：

| 品牌 | 研究渠道 |
|------|---------|
| AG1 | Facebook Ad Library |
| Grüns | Instagram @gruns |
| Huel | Facebook Ad Library |
| Rhode | Instagram @rhode |
| True Classic | Facebook Ad Library |

**Facebook Ad Library**：https://www.facebook.com/ads/library/ — 免费查看所有品牌的在投广告，是最直接的竞品广告参考工具。
