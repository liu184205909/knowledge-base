# Love & Relationships UI 设计方案 v1

> 对应内容文档: `content-v1.md`  
> 对应最新测试稿: Page ID `43118` / slug `love-relationships-v3`  
> 对应 HTML 原型: `ui-prototype-v1.html`  
> 用途: 在 JS 施工前确认 UI, 避免“边想页面边写 JS”。

## 0. 页面视觉目标

Love & Relationships 页面不能做成普通文章页, 也不能做成神秘玄学页。它应该像一个温柔、可信、可购买的意图入口:

- 情绪: warm, gentle, honest, grounded
- 颜色: Deep Ink / Primary Green / Pale Green 为主, cream / card / gold 为辅, rose 只做轻点缀
- 图片: 真实晶石、自然光、产品感, 不用情侣图、不用强玄学图
- 结构: 清晰导购路径, 不堆长文
- 编辑性: 全部用 Elementor / WoodMart 可编辑组件

## 1. 全局 UI 规则

| 项目 | 规则 |
|---|---|
| 页面宽度 | 大多数 section 使用 boxed 内容宽度 |
| 布局 | Elementor Flexbox Container, 不使用 CSS Grid |
| 字体层级 | Hero H1 最大, 普通 H2 控制在 34-40px |
| 卡片圆角 | 8-12px, 不做过度圆润 |
| 品牌主色 | Deep Ink `#1A1A2E`, Primary Green `#2D6A4F`, Pale Green `#F0F7F4` |
| 品牌辅色 | Cream `#faf8f5`, Card `#f5f0eb`, Gold `#c9a96e` |
| Love 点缀色 | Rose Quartz blush / rose 只能做情绪点缀, 不能替代品牌主色 |
| 背景 | pale green / cream / white 交替, 少量 blush 点缀 |
| CTA | 每屏最多一个强 CTA, 重要 section 可有弱 CTA |
| 图片比例 | Hero 约 1920x900; 卡片图尽量 1:1 或 4:3 |
| 移动端 | 所有多列变单列, 文案优先可读 |

> 修正: UI 原型必须先继承 Earthward 现有品牌色调, 再根据页面主题加轻微 love/rose 情绪。不能每个意图页重新发明一套视觉系统。

## 2. Section UI 方案

### S1 Hero

目的: 第一屏确认页面主题, 给出明确购物入口。

视觉:

- 全宽背景图
- Deep Ink / black overlay
- 居中文案
- H1 + subtitle + 双按钮

内容:

- H1: Love & Relationships Crystals
- Subtitle: Choose crystals as gentle reminders for self-love, honest connection, and the kind of love you want to practice.
- Primary CTA: Shop Love Crystals
- Secondary CTA: Find Your Stone

Elementor 映射:

- Container
- Background Image
- Heading
- Text Editor
- Button x2

移动端:

- H1 缩小到约 32px
- 两个按钮可以上下排列
- Hero 高度不要过高, 避免首屏只剩背景

### S2 Quick Chooser

目的: 帮用户先按“当下需求”分流, 不急着卖产品。

视觉:

- cream 背景
- 4 张白色卡片
- 桌面 4 列, 平板 2 列, 手机 1 列
- 卡片内: 小标题 + 简短说明 + 文字按钮

卡片:

1. Softer with myself
2. Healing after hurt
3. More warmth in love
4. Steadier connection

Elementor 映射:

- Container
- Heading
- Text Editor
- Flexbox 多列 Container
- Heading / Text Editor / Button

移动端:

- 单列卡片
- 每张卡间距 16-20px

### S3 Editorial Story

目的: 给页面情绪和信任感, 但不写成长篇文章。

视觉:

- 白底
- 左文右图
- 图片圆角 10-12px
- 文案宽度不要太满

内容:

- H2: Love begins with what you practice daily
- 约 120-180 words

Elementor 映射:

- Container
- 左侧 Heading + Text Editor
- 右侧 Image

移动端:

- 改为上文下图或上图下文均可
- 文案左对齐比居中更易读

### S4 Featured Love & Relationships Crystals

目的: 告诉用户本页最重要的 4 个晶石入口。

视觉:

- blush 背景
- 4 张晶石卡片
- 图片在上, 标题和一句解释在下
- 卡片白底, 轻边框

晶石:

1. Rose Quartz
2. Rhodonite
3. Ruby
4. Prehnite

Elementor 映射:

- Container
- Heading
- Text Editor
- Flexbox 多列 Container
- Image Box

移动端:

- 单列
- 图片不能太高, 避免滑动压力

### S5 Shop Love & Relationships

目的: 真正导购区。

视觉:

- 白底或非常浅 cream
- 标题 + 简短说明
- WoodMart 产品分类组件
- 不做假产品卡

组件:

- WoodMart Product Categories 或 Products 组件
- 当前测试可用 category ids: `1507,1530,1527,1528`

注意:

- 不使用 WooCommerce shortcode
- 不使用 HTML 写死产品
- 如果分类图不好看, 后续在 WoodMart/产品分类后台改图, 不在页面硬写假图

移动端:

- 组件自动响应式
- 需要预览确认 WoodMart 输出是否拥挤

### S6 Deepen Your Path

目的: 连接 Condition/Post 页面, 同时避免本页抢它们的关键词。

视觉:

- cream 背景
- 3 张内容入口卡片
- 每张卡: 标题 + 说明 + Read Guide

链接:

1. `/crystals-for-love/`
2. `/crystals-for-self-love/`
3. `/crystals-for-emotional-healing/`

Elementor 映射:

- Container
- Heading
- Text Editor
- Flexbox 多列 Container
- Heading / Text Editor / Button

移动端:

- 单列
- 这一区域不放大图, 保持轻量

### S7 FAQ

目的: 合规、答疑、降低误解。

视觉:

- 白底
- 居中标题
- Accordion 宽度不要太满

Elementor 映射:

- Container
- Heading
- Text Editor
- Accordion

内容重点:

- 不承诺水晶改变关系
- 不说吸引特定对象
- 强调 symbolic reminder / intention / daily practice

移动端:

- Accordion 默认折叠
- 问题标题不要太长

### S8 Final CTA

目的: 页面收尾, 再次导向购物。

视觉:

- 背景图 + 深色 overlay
- 居中 H2 + 简短文案 + 单按钮
- 不重复 S1 的全部内容

内容:

- H2: Choose a small reminder for the love you want to practice.
- CTA: Shop Love & Relationships

Elementor 映射:

- Container
- Background Image
- Heading
- Text Editor
- Button

移动端:

- H2 控制在 28-32px
- 背景图主体不要被裁掉

## 3. 最新测试稿需要检查的问题

Page ID: `43118`

优先检查:

1. Hero H1 是否存在且视觉正常。
2. Quick Chooser 卡片是否太像普通信息块, 是否需要更强视觉区分。
3. S4 晶石卡片的 Rose Quartz / Rhodonite / Ruby / Prehnite 图片是否可信、统一。
4. S5 WoodMart 产品分类组件是否真实显示、是否图和类目对得上。
5. 手机端 section 间距、卡片宽度、按钮是否拥挤。
6. 整体是否像“可购买的意图页”, 而不是文章页。

## 4. 后续施工原则

后续版本不重新发明页面, 只根据这个 UI 文档和 HTML 原型修正:

1. 保留 8 section 顺序, 除非人工验收认为某 section 应删。
2. 优先修视觉和组件映射, 不扩写长文。
3. 图片优先使用已上传 WordPress media；本地图片必须先上传后再进 Elementor。
4. 如果 WoodMart 产品分类组件效果不好, 换 WoodMart Products 组件, 仍不使用 shortcode。
5. 仍然创建测试 Draft, 不碰正式 `/love-relationships/`。
