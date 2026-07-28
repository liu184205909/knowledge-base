# T17 v3 数据合同与审批边界

本目录保存本地导入合同、审批模板和研究数据；它不替代线上数据库，也不证明线上记录已完成采购、授权或定价审批。

## 已回读的线上状态（2026-07-25）

- 公开 Catalog：281 个素材、453 个 live Variant，货币为 USD。
- 公开报价：一条真实 Variant 已返回完整服务端报价。
- 目录技术字段完整：图片、价格、占位长度和显示比例均非空；方向包含 `none`、`tangent`、`radial_out`。
- 用户可见名称和分类标签已全部改为英文（281 条事务更新并回读）。仍不可据此宣称“可售准备完成”：全部 Variant 为 `onbackorder`，且授权、成本、库存与审批证据不在公开接口中。

## 本地合同状态

`approved-production-catalog.import.csv`、图片溯源、价格审核和方向审核模板当前均为零数据行。这表示本地审批包尚未回填，不表示线上 Catalog 为空。不要把线上 live 记录反向视为已批准的本地生产数据。

机器合同以 [data-contract.v3.json](data-contract.v3.json) 为准：

- `component_type`：`crystal` 或 `accessory`；旧 `bead` / `decor` 只由导入器兼容映射。
- live Variant 必须有正数的尺寸、价格、占位长度和显示比例；方向只能属于 `accessory`。
- `decor-orientation-review.template.csv` 与价格、图片溯源模板都是审核记录，不能直接导入。

## 对外可售前的最低门槛

1. 为每个 live Variant 保存图片来源/授权、成本、价格版本、库存或明确的按需履约规则。
2. 将方向性 Accessory 的审批结果回填到导入合同，并通过预检。
3. 决定 DIY 手链的履约模式并配置承载商品：当前商品为 virtual，未覆盖地区没有配送方式，不能据此交付实体手链。
4. 提供独立测试站和测试支付方式；在其中验证报价、加购、结账、订单快照和退款。

## 验证

```powershell
./validate-v3-data-contract.ps1
./preflight-approved-production-import.ps1
```

第二个脚本是导入前门禁；两者均不写入 WordPress。
