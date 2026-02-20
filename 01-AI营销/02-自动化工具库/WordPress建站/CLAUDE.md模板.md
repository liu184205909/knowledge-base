# WordPress AI建站规则模板

> **放在项目根目录，命名为 `CLAUDE.md`，AI会自动读取遵守**
>
> 核心用途：指导AI帮你完成WordPress建站（WoodMart + Elementor方案）

---

## 项目概述

- **环境**: Local by Flywheel 本地开发
- **CMS**: WordPress 6.x
- **主题**: WoodMart（多功能主题，支持C端/B端）
- **编辑器**: Elementor Pro（默认）
- **产品展示**: WooCommerce

> WoodMart + WooCommerce 不限于电商，B端产品展示同样适用

---

## 环境要求

- PHP 7.3+
- memory_limit: 128M
- post_max_size: 64M
- upload_max_filesize: 64M
- max_execution_time: 180

---

# 硬性边界（必须遵守）

## 绝对禁止修改

- `wp-admin/` - WordPress 后台核心
- `wp-includes/` - WordPress 核心功能
- `wp-config.php` - 站点配置
- `wp-content/plugins/**` - 所有插件源码（用后台配置，不改代码）
- `wp-content/uploads/**` - 媒体文件目录
- 任何 WordPress 核心文件

## 唯一允许修改的目录

```
wp-content/themes/woodmart-child/
```

仅限WoodMart子主题目录，其他一律不碰。

> WoodMart主题设置通过WP Admin后台配置，不直接改源码

---

# 工作方式

## 开发规则检查清单（每次开发必读）

### 开发前 (2分钟)

确认本次任务需要的组件类型：

| 任务类型 | 优先选择 |
|---------|---------|
| 产品展示 | WoodMart Elementor组件 |
| 通用布局 | Elementor Pro组件 |
| 购物功能 | WooCommerce组件 |
| 表单/CTA | Elementor Pro组件 |

### 开发中（每个Section完成后检查）

**5条铁律 - 违反任何一条 = 不合格，必须重做**：

- [ ] **颜色**：只用WoodMart全局颜色或Elementor全局颜色，禁止硬编码`#FFFFFF`、`rgb()`等
- [ ] **间距**：使用Elementor间距设置（必须是8的倍数），不用硬编码像素值
- [ ] **文字**：项目指定语言（如英文、简体中文），禁止Emoji
- [ ] **响应式**：使用Elementor响应式断点，测试移动端效果
- [ ] **组件选择**：优先WoodMart组件 → Elementor Pro组件 → WooCommerce组件

### 开发后（提交前最终检查）

1. 检查是否有硬编码颜色
2. 检查移动端显示效果
3. 检查是否有未使用的临时文件

---

## 媒体与图片规则

### 图片位置决策表

| 图片类型 | 位置 | 原因 |
|---------|------|------|
| Logo、品牌图标 | 媒体库 | 通过主题设置引用 |
| 产品图片 | 媒体库 | WooCommerce标准流程 |
| 文章配图/封面 | 媒体库 | 内容层面，需缩略图 |
| 客户评价头像 | 媒体库 | 内容会更新 |
| Banner/Hero背景 | 媒体库 | 便于管理替换 |

**简单记忆**：所有图片统一走媒体库

### 图片规范

- **格式**：WebP优先，JPG/PNG备选
- **尺寸**：Hero背景1920x1080，产品图800x800，缩略图400x400
- **压缩**：上传前压缩，单张不超过200KB

---

## 每次修改前

1. **给出计划**: 要改哪些文件、改什么、为什么
2. **等待确认**: 重要修改需用户同意

## 每次修改后

1. **改动清单**: 列出所有修改的内容
2. **验证步骤**: 说明如何在本地确认效果

## 任务完成后

**清理临时产物** - 任务完成后必须删除：
- 测试页面（如有）
- 临时草稿
- 未使用的媒体文件

**原则**：只保留最终交付物，不留中间产物

---

# Elementor开发规则

## Container结构（Elementor 3.16+）

```json
{
  "elType": "container",
  "settings": {
    "flex_direction": "row",
    "flex_wrap": "wrap",
    "justify_content": "center",
    "align_items": "center"
  },
  "elements": [...]
}
```

## 组件选择优先级

```
1. WoodMart Elementor组件（电商/产品专用）⭐优先
2. Elementor Pro组件（通用）
3. WooCommerce组件（产品相关）
```

## Elementor Pro组件

| 模块 | Widget | 用途 |
|------|--------|------|
| 标题 | heading | 各级标题 |
| 图片 | image | 单张图片 |
| 按钮 | button | CTA按钮 |
| 图标卡片 | icon-box | 特性展示 |
| 图片卡片 | image-box | 图文卡片 |
| 评价 | testimonial | 客户评价 |
| 表单 | form | 询价/联系表单 |
| 计数器 | counter | 数据统计 |
| 手风琴 | accordion | FAQ |
| 轮播 | image-carousel | 图片轮播 |

## WoodMart Elementor组件（80+）

**产品展示类**：
| 组件 | 用途 |
|------|------|
| Products | 产品网格/列表 |
| Products Carousel | 产品轮播 |
| Product Categories | 产品分类 |
| Products Brands | 品牌展示 |
| Product Grid | 产品网格 |

**功能类**：
| 组件 | 用途 |
|------|------|
| AJAX Search | 实时搜索 |
| Advanced Filters | 高级筛选 |
| Shopping Cart | 购物车 |
| Wishlist | 收藏夹 |
| Compare | 产品对比 |
| Stock Progress | 库存进度条 |

**布局类**：
| 组件 | 用途 |
|------|------|
| Banner | 横幅广告 |
| Info Box | 信息盒子 |
| Team Member | 团队成员 |
| Instagram | Instagram展示 |
| 3D View | 3D产品展示 |

## WooCommerce组件

| 组件 | 用途 |
|------|------|
| woocommerce-products | 产品列表 |
| woocommerce-product-add-to-cart | 加购按钮 |
| woocommerce-product-price | 产品价格 |
| woocommerce-product-images | 产品图片 |
| woocommerce-cart | 购物车 |
| woocommerce-checkout | 结账 |

## 颜色规范

- 在WoodMart主题设置中配置全局颜色
- Elementor中引用主题颜色
- 避免硬编码颜色值

---

# 页面模板

WoodMart提供88+演示模板，导入方式：
```
WoodMart → Install Required Plugins → Import Demo
```

选择Elementor版本的演示模板

---

# 部署规则

## 本地开发
```
WPvivid导出 → 上传服务器 → 导入备份
```

## 线上网站
```
AI生成JSON → 导入Elementor → 发布
```

## 推送到生产环境

**只推送**:
- WoodMart子主题（如有自定义）
- 必需的插件配置

**不推送**:
- WordPress 核心文件
- wp-config.php
- uploads/（媒体文件单独处理）

---

# 安全原则

**目录隔离 > 权限配置**

通过只在WoodMart后台配置和Elementor编辑器工作，自然避免误操作核心文件。

**插件配置在后台做**

表单、支付、商城等功能用成熟插件（WooCommerce、WPForms等），在WP Admin后台配置。

**小步快跑，随时可回滚**

每次改动小而完整，出问题容易定位和恢复。

---

# 禁止操作

- 不改 WordPress 核心文件
- 不改插件源码
- 不执行 `rm -rf`、`git push`
- 不修改数据库（除非明确要求写入Elementor数据）
- 不写自定义"支付/表单后端逻辑"（用成熟插件解决）
- **不删除 CLAUDE.md**（核心文档）

---

# 常见问题

**Q: 需要创建新页面怎么办？**
A: 在WordPress后台创建页面，使用Elementor编辑，选择合适的WoodMart模板。

**Q: 图片应该放哪里？**
A: 所有图片统一通过媒体库上传。

**Q: 如何确保符合设计规范？**
A: 开发前查阅WoodMart主题设置，使用全局颜色和字体，开发后用5条铁律自查。

**Q: WooCommerce相关的开发AI能做什么？**
A: AI负责页面布局和Elementor配置，商品管理、支付配置、物流设置等在WP Admin后台操作。

---

**重要提醒**: 本文档是项目核心文档，请勿删除！
