# WordPress + Elementor AI建站规则模板

> **放在项目根目录，命名为 `CLAUDE.md`，AI会自动读取遵守**

---

# 两种AI辅助建站方式

| 方式 | 适用场景 | AI操作 | 是否需要JSON文件 |
|------|---------|--------|-----------------|
| **直接写库** | 本地开发（Local） | AI直接写入数据库 | ❌ 不需要 |
| **JSON导入** | 线上网站 | AI生成JSON → 手动导入 | ✅ 需要 |

## 如何选择

```
本地开发？
├── 是 → 直接写库（推荐）
│         Local创建站点 → AI写数据库 → WPvivid部署
└── 否 → JSON导入
          AI生成JSON → 复制到Elementor → 导入
```

---

# 方式1：本地开发流程（Local + AI 建站流程）⭐推荐

共5步：创建站点 → 安装主题插件 → AI写数据库 → 预览测试 → 部署上线



## 第一步：Local创建站点

**操作步骤**：
1. 打开Local → 点击"+"创建新站点
2. 输入站点名称（如：my-product-site）
3. 选择环境（Preferred: PHP 8.x）
4. 设置管理员账号
5. 等待创建完成

**创建后获得**：
- 本地域名：`my-product-site.local`
- WordPress后台：`my-product-site.local/wp-admin`
- 数据库配置：`wp-config.php` 中查看

## 第二步：安装主题和插件

**必需安装**：
- WoodMart主题（多功能主题）
- Elementor Pro（页面编辑器）
- WooCommerce（产品展示，可选）

## 第三步：AI直接写数据库（AI辅助）⭐核心

**AI做的事情**：
1. 根据需求规划页面结构（基于RLM营销方法论）
2. 按照Elementor的规则（数据格式）生成JSON
3. **直接写入WordPress数据库**（直接写入wp_postmeta表）

**技术原理**：
```
AI写入 → wp_postmeta表
         meta_key: _elementor_data
         meta_value: Elementor格式的JSON数据
```

## 第四步：本地预览测试

- 浏览器访问 `xxx.local` 查看效果
- 后台调整内容和样式
- 测试移动端响应式

## 第五步：部署到线上

**使用WPvivid插件**：
1. Local站点 → 安装WPvivid插件
2. WPvivid → 备份 → 下载备份文件
3. 线上服务器 → 安装WordPress + WPvivid
4. WPvivid → 恢复 → 上传备份文件

---

# 方式2：JSON导入流程（线上网站）

## 适用场景
- 已有线上WordPress站点
- 不方便直接操作数据库

## 流程

```
第一步：AI生成JSON（AI辅助）
└→ 描述需求 → AI生成Elementor JSON

第二步：导入Elementor（手动）
└→ 页面 → 用Elementor编辑 → 导入模板
└→ 粘贴JSON → 导入

第三步：调整发布（手动）
└→ 修改内容 → 调整样式 → 发布
```

## 操作步骤

1. **AI生成JSON**
```
你：
1. 先读取 Elementor数据库存储格式.md 了解数据格式
2. 按照文档中的Container结构和Widget格式
3. 生成一个Hero区的Elementor JSON
4. 标题是"XX"，按钮是"立即咨询"

AI：[读取文档后] 按照Elementor格式生成JSON代码...
```

2. **导入Elementor**
   - WordPress后台 → 页面 → 新建
   - 用Elementor编辑
   - 点击"..." → 导入模板
   - 粘贴JSON代码 → 导入

---

# AI写数据库规则

## 必需的Meta字段

创建Elementor页面时，必须同时写入：

| meta_key | meta_value | 说明 |
|----------|------------|------|
| `_elementor_data` | JSON布局数据 | 页面结构 |
| `_elementor_edit_mode` | `builder` | 编辑模式 |
| `_elementor_template_type` | `wp-page` | 模板类型 |
| `_elementor_version` | `3.x.x` | Elementor版本 |

## 数据库配置

Local站点的数据库配置在 `wp-config.php` 中：
```php
define( 'DB_NAME', 'local' );
define( 'DB_USER', 'root' );
define( 'DB_PASSWORD', 'root' );
define( 'DB_HOST', 'localhost' );
$table_prefix = 'wp_';
```

## 技术参考

完整Widget列表、JSON结构、写入方式详见：
→ [Elementor数据库存储格式.md](./Elementor数据库存储格式.md)

---

# 项目概述

- **环境**: Local by Flywheel 本地开发
- **CMS**: WordPress 6.x
- **主题**: WoodMart（多功能主题，支持C端/B端）
- **编辑器**: Elementor Pro（默认）
- **产品展示**: WooCommerce

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
- `wp-content/plugins/**` - 所有插件源码
- `wp-content/uploads/**` - 媒体文件目录
- 任何 WordPress 核心文件

## 唯一允许修改的目录

```
wp-content/themes/woodmart-child/
```

---

# 开发规则

## 5条铁律（违反任何一条 = 不合格）

- [ ] **颜色**：只用全局颜色，禁止硬编码`#FFFFFF`、`rgb()`等
- [ ] **间距**：使用Elementor间距设置（必须是8的倍数）
- [ ] **文字**：项目指定语言，禁止Emoji
- [ ] **响应式**：使用Elementor响应式断点，测试移动端
- [ ] **组件选择**：WoodMart → Elementor Pro → WooCommerce

## 组件选择优先级

```
1. WoodMart Elementor组件（电商/产品专用）⭐优先
2. Elementor Pro组件（通用）
3. WooCommerce组件（产品相关）
```

## 常用模块

| 模块 | 内容 | 常用Widget |
|------|------|------------|
| Hero | 首屏大图+标语 | heading, image, button |
| 特性 | 3列图标卡片 | icon-box, image-box |
| 产品 | 网格展示 | woocommerce-products, image-gallery |
| 评价 | 轮播/卡片 | testimonial, image-carousel |
| 数据 | 统计数字 | counter, progress |
| FAQ | 手风琴 | accordion, toggle |
| CTA | 转化按钮 | call-to-action, button |
| 表单 | 询价入口 | form |

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

## 常用flex属性

| 属性 | 值 |
|------|-----|
| `flex_direction` | `row`, `column` |
| `flex_wrap` | `wrap`, `nowrap` |
| `justify_content` | `flex-start`, `center`, `flex-end`, `space-between` |
| `align_items` | `flex-start`, `center`, `flex-end`, `stretch` |

---

# 禁止操作

- 不改 WordPress 核心文件
- 不改插件源码
- 不执行 `rm -rf`、`git push`
- 不写自定义"支付/表单后端逻辑"（用成熟插件解决）
- **不删除 CLAUDE.md**（核心文档）

---

# 常见问题

**Q: 本地生成的页面能同步到线上吗？**
A: 可以，使用WPvivid备份迁移

**Q: 生成后能修改吗？**
A: 可以，在Elementor编辑器中正常编辑

**Q: 图片从哪里来？**
A: AI使用占位图片，你在Elementor中替换

**Q: AI没有记忆怎么办？**
A: 本文档（CLAUDE.md）放在项目根目录，AI每次开发会自动读取

---

**重要提醒**: 本文档是项目核心文档，请勿删除！
