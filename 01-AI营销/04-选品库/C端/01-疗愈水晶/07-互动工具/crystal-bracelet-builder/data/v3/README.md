# T17 v3 首批生产数据包

> 状态：空白生产模板。创建日期：2026-07-12。
> 
> 本目录只承载 v3 的生产候选和导入结构；不会替代 WooCommerce 商品、图片库或价格审批记录。
> Catalog 与报价是后端能力；编辑器 UI 独立部署并仅通过接口读取已批准的 Catalog/报价结果。本数据包不包含 UI 发布物或前端部署配置。

## 数据状态边界

| 数据层 | 文件 | 可否导入生产插件 | 说明 |
|---|---|---:|---|
| 已批准生产数据 | `approved-production-catalog.import.csv` | 是，填完并完成审批后 | 列名与当前 `EW_T17_Catalog::import_catalog()` 完全一致。当前为零记录；0.1.8 起导入器会拒绝缺失或非数字规格/价格/重量/占位长度，而不会静默写入 `0`。 |
| 生产图片溯源 | `material-asset-provenance.production-template.csv` | 否 | 图片、授权、文件哈希和采集日期的审核台账；图片 URL 通过后才回填到生产导入表。 |
| 生产价格审核 | `variant-price-review.production-template.csv` | 否 | 成本、损耗、履约、建议售价与审核结论的唯一准备表；不填入未经审核的价目。 |
| 方向性配饰审核 | `decor-orientation-review.template.csv` | 否 | 花托、吊坠、跑环等结构配件的左右/镜像/旋转、相邻材料与生产注意事项审核表；当前零记录，经审批后回填到生产导入表。 |
| 官方设计登记与配方 | `official-design-registry.template.csv`、`woo-official-design-recipe.template.json` | 否，需在 Woo 产品编辑页写入 meta | 32 个设计槽位，按 v3 基线列出的 7 个主场景分类。每条实际设计须使用已上架 Variant 的有效 JSON 配方。 |
| 遗留暂定候选 | `legacy-provisional-candidates.NOT-FOR-IMPORT.csv` | 否 | 从 v1/v2 静态来源转录的候选 ID 与名称，仅用于迁移核对。它们没有通过图片、规格、库存或价格审核。 |
| 遗留候选审核映射 | `legacy-candidate-to-production-mapping.template.csv` | 否 | 20 条遗留候选与未来生产 Material/Variant 的人工映射台账；所有行初始均为 `production_import_eligible=no`，不可直接导入。 |
| 数据合同与校验 | `data-contract.v3.json`、`validate-v3-data-contract.ps1` | 否 | 机器可读的 CSV/JSON 合同和只读校验，锁定当前 importer 的方向性 Decor 列与生产边界。 |

## 导入前的最小门槛

1. 只将已通过图片、规格、兼容性、库存、价格和生产可行性审核的行放入 `approved-production-catalog.import.csv`。
2. 每个 `material_key`、`variant_key` 必须稳定且全局唯一；不得复用遗留全局珠径逻辑。一个尺寸是一条独立 Variant。
3. `component_type` 仅可为 `bead`、`decor` 或 `finish`；`material_status` 仅可为 `draft` 或 `live`；`variant_status` 仅可为 `draft`、`live` 或 `disabled`。
4. 每个导入行都必须填写且使用非负数值的 `size_mm`、`price`、`weight_g` 与 `occupied_length_mm`。`variant_status=live` 时这四项必须全部大于 `0`；0.1.8 起空白、非数字或不合格 live 值会被导入器拒绝，绝不会再降级为 `0`。
5. `stock_status` 只能为 `instock`、`outofstock` 或 `onbackorder`；留空时导入器默认 `instock`。`stock_quantity` 可留空表示不追踪数量，填写时只能是非负整数。不可用或待确认的 Variant 不应标为 `live`，不以估算库存替代实际库存。
6. 导入后在 WordPress 后台回读 Material/Variant 数量、状态和价格版本；再调用 `/wp-json/ew-t17/v1/catalog` 核对仅返回 `live` 记录。

## 方向性 Decor 合同

方向性是生产与履约事实，不是纯前端视觉。当前 Catalog importer 已持久化、报价并返回方向字段；`approved-production-catalog.import.csv` 使用 30 列合同，其中 `category_slug`、`display_scale`、`compatible_bead_sizes` 和排序字段也是正式录入项。不得把方向或类别塞入 `compatibility`、`shape` 或名称字段。

方向性只先登记在 `decor-orientation-review.template.csv`，并通过 `variant_key` 关联未来已批准的 Decor Variant。该表永远不能直接上传到 Catalog importer。每条通过审核的方向性 Decor 至少需填写：

| 字段 | 合同 | 说明 |
|---|---|---|
| `record_scope` | 固定 `decor_orientation_review_only` | 标明这是一条非生产导入审核记录。 |
| `production_import_eligible` | 固定 `no` | 在插件完整支持前，永远不作为生产导入行。 |
| `schema_version` | `ew-t17-v3-data-contract-2026-07` | 与 `data-contract.v3.json` 对齐。 |
| `variant_key` | 已批准的稳定 Variant ID | 一种物理左右件必须使用不同的 Variant ID。 |
| `orientation_mode` | `none`、`fixed_left`、`fixed_right`、`mirrorable`、`rotatable` | 描述真实生产能力，不描述 CSS 效果。 |
| `mirrored_variant_key` | 左右物理件的对应 Variant ID | 仅 `fixed_left` / `fixed_right` 使用；左右件须相互引用。 |
| `allowed_orientations` | 允许的实际方向集合 | 例如 `left|right`；不可凭前端镜像创建新物料。 |
| `allowed_positions` | `any`、`start`、`end`、`interior` 的受控集合 | 说明其在串珠顺序中的可插入位置；`any` 不可与其他位置同时填写。 |
| `neighbor_constraints` | 可核验的相邻材料/尺寸限制 | 例如必须夹在 8mm 珠之间；未确认就保持空白。 |
| `sequence_orientation_value` | 未来写入序列和订单快照的值 | `fixed_left` / `fixed_right` 可写 `left` / `right`；`rotatable` 应写经生产批准的角度值。 |
| `asset_review_status`、`orientation_review_status`、`approval_status` | 审核状态 | 未完成前不得标记可售。 |

数据库、Catalog importer、REST catalog、报价、官方配方、购物车快照、订单快照和生产摘要已具备方向字段链路。方向审核表是导入前的审批记录，审核通过后将值回填到生产 CSV；它本身永远不能上传。非方向性 Variant 留空时，导入器按 `orientation_mode=none` 与 `allowed_orientations=[none]` 处理。方向性模式只能用于 `decor`；`fixed_left` / `fixed_right` 必须使用独立 Variant ID，并在 `mirrored_variant_key` 中互相引用。

遗留映射表已预留 `target_orientation_mode`、`target_mirrored_variant_key`、`target_allowed_positions` 与 `target_orientation_review_status`；当前 20 条遗留珠子候选全部保持空白，因为它们不是已审核 Decor，也不是生产数据。

运行只读验证：

```powershell
Set-Location 'D:\Code\knowledge-base\01-AI营销\04-选品库\C端\01-疗愈水晶\07-互动工具\crystal-bracelet-builder\data\v3'
.\validate-v3-data-contract.ps1
```

## 官方设计 Woo 写入顺序

1. 在登记表中锁定一个设计槽位，并填入真实 Woo 产品 ID、SKU、英文名称、一个主场景、辅助标签、成品图和 Woo 当前售价。
2. 用 `woo-official-design-recipe.template.json` 生成配方；`sequence` 的每一项必须引用已经 `live` 的 `variant_id`。当前插件只接受 `target_wrist_cm`、`fit_preference` 和 `sequence`。
3. 在 Woo 产品 General 面板设置 `_ew_t17_official_design=yes`、`_ew_t17_customize_enabled=yes`、`_ew_t17_primary_scene`、`_ew_t17_design_version`、`_ew_t17_price_version` 和 `_ew_t17_recipe_json`。
4. 保存后回读产品 meta，并以产品页的 `Customize this design` 和后端报价验证导入的配方。配方、价格表或现货状态变动时，将 `recipe_status` 改为 `needs-price-review` 或 `needs-stock-review`，不能继续宣称已批准。

## 不在本包中填写的业务事实

- 供应商、供应成本、损耗、人工、包装、履约、最终零售价、促销价与目标毛利。
- 生产图片、原始 URL、授权状态、文件哈希和采集日期。
- 实际库存、Woo 产品 ID/SKU、正式英文商品名、成品图与最终可售配方。

这些值均须由运营、采购、素材或生产负责人提供并审批后再进入生产数据。
