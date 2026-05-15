# TranslatePress + AI 翻译方案

> **WordPress 多语言站点的 AI 翻译解决方案** | 最后更新：2026-04-17

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
