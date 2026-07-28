# EarthWard T17 Bracelet Builder plugin

插件负责 Catalog、REST 报价、Woo DIY 加购和订单快照，并通过 `[ew_t17_bracelet_builder]` 输出 v3 编辑器。正式工具页只使用既有 `/tools/crystal-bracelet-builder/`，不创建新页面。

## 运行边界

- Catalog 素材独立于普通 Woo 商品；只有隐藏的 `Custom Crystal Bracelet` 承载 DIY 订单。
- 服务端按 live Variant 重新报价，并把配方、价格版本和预览快照写入 Woo 订单项。
- 官方设计仍是普通 Woo 商品；启用 Customize 后，工具页通过 `t17_product` 加载服务端配方。
- 发布候选包前必须运行项目根目录的四个本地验证脚本；安装或更新后运行公开只读验证器。

## Catalog 导入

`assets/catalog-template.csv` 是唯一导入合同。每行是一个 Variant；`material_key`、`variant_key` 和 `name_en` 必须稳定。先导入 `draft`，完成图片、价格、兼容性和生产审核后才可设为 `live`。

仅修正文案时，使用 `assets/catalog-labels-template.csv`：它只接受 `material_key,name_en,category_label`，只更新已有素材的用户可见名称与分类标签；不会新建素材，也不会写入价格、库存、图片、履约或 Variant 字段。自动化调用 `POST /wp-json/ew-t17/v1/catalog/labels`，请求体为 `{ "rows": [...] }`，并要求 `manage_woocommerce` 权限。

## 交易验收

公开 REST 和报价成功不等于交易闭环完成。必须在测试环境验证隐藏承载商品的加购、结账、订单快照与退款；不要用真实顾客购物车作为测试环境。
