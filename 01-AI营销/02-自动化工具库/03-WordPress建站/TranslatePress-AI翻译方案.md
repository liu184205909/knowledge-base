# TranslatePress + AI 翻译方案

> **WordPress 多语言站点的 AI 翻译解决方案** | 最后更新：2026-05-22

---

## 背景

TranslatePress 是 WordPress 主流多语言插件，通过可视化界面翻译页面内容。官方翻译引擎依赖 Google Translate/DeepL 等，按字数收费。多个开发者通过扩展 TranslatePress 接口，接入了更低成本的 AI 翻译 API。

**技术原理**：TranslatePress 提供 `TRP_Machine_Translator` PHP 类作为翻译引擎接口，通过继承该类并重写翻译方法，可以替换为任意 AI API（OpenAI、DeepSeek、Gemini 等）。

---

## 方案对比

| 维度 | 方案一：官方 AI | 方案二：CoolPlugins | 方案三：Hollis Ho 开源 |
|------|---------------|-------------------|---------------------|
| **名称** | TranslatePress AI | AI Translation for TranslatePress | DeepSeek AI Translate for TranslatePress |
| **价格** | Pro 版 €99/年（含 AI 翻译） | 免费 | 免费（需自备 API Key） |
| **翻译引擎** | DeepL + Google + Microsoft | Yandex Translate + Chrome 内置 AI | DeepSeek API |
| **翻译质量** | 高（多引擎切换） | 中（依赖 Yandex/Chrome） | 高（DeepSeek 模型） |
| **适用场景** | 商业项目，预算充足 | 轻量使用，零成本 | 自有 DeepSeek API，追求性价比 |
| **维护者** | TranslatePress 官方 | CoolPlugins 团队 | Hollis Ho（个人开发者） |
| **链接** | [translatepress.com](https://translatepress.com/) | [WordPress 插件库](https://wordpress.org/plugins/automatic-translate-addon-for-translatepress/) | [GitHub](https://github.com/hollisho/deepseek-ai-translate-for-translatepress) |

---

## 方案详解

### 方案一：TranslatePress AI（官方）

TranslatePress Pro 版内置 AI 翻译功能，支持 DeepL、Google Translate、Microsoft Translator 三个引擎切换。

- **优点**：官方维护稳定，翻译质量高，多引擎冗余
- **缺点**：Pro 版 €99/年，翻译字数受套餐限制
- **适用**：正式商业项目，不想折腾技术细节

### 方案二：CoolPlugins 免费插件

插件名：`automatic-translate-addon-for-translatepress`

- **翻译引擎**：Yandex Translate（免费额度）、Chrome 内置 AI Translation API
- **安装**：WordPress 后台搜索 "AI Translation for TranslatePress" 直接安装
- **优点**：零成本，安装即用
- **缺点**：翻译质量依赖 Yandex，中文支持一般；Chrome AI 需要浏览器支持
- **适用**：预算为零的测试/小项目

### 方案三：Hollis Ho 开源方案（推荐研究）

基于 DeepSeek API 的开源实现，通过继承 `TRP_Machine_Translator` 类实现自定义翻译引擎。

- **GitHub**：[hollisho/deepseek-ai-translate-for-translatepress](https://github.com/hollisho/deepseek-ai-translate-for-translatepress)
- **翻译引擎**：DeepSeek API（可替换为 OpenAI、Gemini 等）
- **成本**：DeepSeek API 极低（约 ¥1/百万 token）

**技术实现要点**：

```php
// 核心思路：继承 TRP_Machine_Translator，重写翻译方法
class DeepSeek_Machine_Translator extends TRP_Machine_Translator {
    public function get_batches( $strings ) {
        // 将待翻译字符串分批发送给 DeepSeek API
        // 解析返回结果，返回翻译文本
    }
}
```

1. 继承 `TRP_Machine_Translator` PHP 类
2. 在 `get_batches()` 方法中调用 DeepSeek API
3. 处理 API 响应，返回翻译结果给 TranslatePress
4. 注册为 TranslatePress 的翻译引擎
5. TranslatePress 的可视化编辑器自动使用新引擎

**可扩展**：将 DeepSeek 替换为 OpenAI/Gemini 只需修改 API 调用部分，整体架构不变。

---

## 待研究事项

- [ ] 方案三本地安装测试，验证翻译质量
- [ ] 对比三种方案的实际翻译效果（同一段内容）
- [ ] 评估 DeepSeek vs OpenAI vs Gemini 的翻译质量与成本
- [ ] 确认是否需要修改以支持 Elementor 动态内容的翻译
- [ ] 研究与 TranslatePress 的缓存机制兼容性

---

## 翻译质量优化流程：机器铺底 + AI 二次精修

> 机器翻译的问题是：没有品类语境、没有 SEO 意识、没有品牌调性。
> 这个流程解决的是"翻译完之后怎么让内容像本地人写的"。

### 整体流程

```text
步骤1：机器翻译铺底（TranslatePress 批量翻译）
    ↓ 全站内容获得初始翻译版本
步骤2：确定优先优化的页面（首页、产品页、核心博客）
    ↓
步骤3：AI 逐页精修（带品类词 + SEO + 品牌调性）
    ↓
步骤4：在 TranslatePress 可视化编辑器中替换
    ↓
步骤5：用 E-E-A-T 质检工具评估关键页面
    ↓ 上线
```

### 步骤详解

#### 步骤 1：机器翻译铺底

用 TranslatePress 的任意方案（DeepL/DeepSeek/Google）完成全站翻译。

**目标**：快速让网站在目标语言中"可用"，不是最终版。

#### 步骤 2：确定优先优化的页面

不需要一次优化全站，按优先级分批：

| 优先级 | 页面类型 | 原因 |
|--------|----------|------|
| P0 | 首页、核心产品页 | 转化入口，用户第一印象 |
| P1 | About Us、Trust 页面 | 建立信任 |
| P2 | Top 10 博客文章（按流量排序） | SEO 流量入口 |
| P3 | 剩余博客和辅助页面 | 长尾流量 |

#### 步骤 3：AI 逐页精修

对每个页面的翻译文本，用 Claude / ChatGPT 做本地化优化。

**精修提示词模板**：

```text
你是一个专业的 [目标语言] 本地化文案专家，熟悉 [目标市场] 的 [品类] 市场。

请将以下机器翻译的文案优化为符合以下要求的 [目标语言] 文案：

原始英文：
[粘贴英文原文]

机器翻译（[目标语言]）：
[粘贴机器翻译结果]

优化要求：
1. 使用目标市场的本地品类术语（如日语用「パワーストーン」而非直译，法语用「lithothérapie」）
2. 语气要符合目标市场消费者的阅读习惯（不是教科书式翻译）
3. 保留 SEO 关键词的自然嵌入
4. 去掉明显的翻译腔和生硬表达
5. 保持品牌调性一致：[填写品牌调性描述]
6. 篇幅与原文相当，不要大幅增减

直接输出优化后的 [目标语言] 文案，不需要解释。
```

**各市场品类词参考**：

| 市场 | 核心品类词 | 次要词 |
|------|-----------|--------|
| 日本 | パワーストーン（Power Stone） | 天然石ブレスレット、ヒーリングクリスタル、水晶ブレスレット |
| 法国 | lithothérapie | bracelet en pierre naturelle, pierre de guérison, cristal de guérison |
| 德国 | Heilsteine | Natursteinarmband, Heilsteinarmband, Edelsteinarmband |
| 西班牙 | Piedras de sanación | Pulsera de cristales, terapia con cristales, piedra natural |

#### 步骤 4：TranslatePress 中替换

1. WordPress 后台 → TranslatePress → 翻译编辑器
2. 切换到目标语言
3. 逐条找到需要修改的文本块
4. 粘贴 AI 优化后的文案
5. 保存

> TranslatePress 支持随时修改已发布的翻译，不会影响页面结构或 URL。

#### 步骤 5：E-E-A-T 质检

对精修后的关键页面，用 `02-自动化工具库/06-内容质检工具/EEAT-内容质量评估.md` 做一次质检，确保不会因为翻译质量问题导致同质化评分偏高。

### 注意事项

1. **不要全站一次性精修** — 按优先级分批，P0 先做，验证转化效果后再推 P1/P2
2. **关注本地搜索词** — 精修时重点检查品类词是否用了目标市场的实际搜索词（用 SEMrush 验证）
3. **产品名保留英文** — 如 "Amethyst Crystal Bracelet" 在日语中可以写「アメジストブレスレット」，但品牌名保持英文
4. **不要翻译所有页面** — 低流量/低价值的页面保持机器翻译即可，精力集中在转化入口页面
