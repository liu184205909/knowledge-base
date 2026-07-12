# 知识库项目指引

## 范围与入口

- 当前主线是 `01-AI营销/04-选品库/C端/01-疗愈水晶` 的 Earthward 水晶站；先读 `00-项目简报.md`，再按其中索引加载具体页面、内容或数据文档。
- 默认只读 `00-基础能力` 与 `01-AI营销`；除非用户明确扩展范围，不进入 B 端/其他 C 端选品、`02-AI开发`、`03-社群知识沉淀`、`04-AI Coding企业服务`。
- 文档是项目事实与方法论，Skill/MCP/CLI 是动作和数据层；不要用通用 Skill 覆盖已有的定制工作流。

## 网站与数据操作

- Earthward 为 WordPress + WooCommerce + Elementor + WoodMart。网站内容/代码写入优先 WordPress REST API；保留 URL、SEO meta、Elementor 数据和既有页面结构，不能用浏览器直接保存页面。
- Google Drive/Sheets/GTM/GA4 操作前先读 `00-基础能力/02-Google-Cloud凭证创建指南.md`。先列出现有实体和查重，写入后回读；GTM 改动需创建具名版本并确认 live 版本。
- SEO 数据链路固定为 `google-seo-mcp + gsc-radar`；不恢复 SEOctopus 为常驻 MCP。GTM/GA4 Admin 写入使用 Workspace 凭证，Google SEO MCP 保持只读分析。

## 交付标准

- 内容、SEO 与页面决策遵循项目文档中的证据等级、合规与验收门槛；能核验的写具体，不能核验的降级为概述。
- 修改知识库文档时保持其责任边界：字段/Schema、写作框架和上传/验证规则不要混写。提交前只检查与本次修改直接相关的链接、格式和事实。
