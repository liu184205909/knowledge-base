# T17 验证与构建脚本

## 本地合同检查

```powershell
./validate-backend-material-loop.ps1
../data/v3/validate-v3-data-contract.ps1
../data/v3/preflight-approved-production-import.ps1
../frontend/validate-frontend-bundle.ps1
```

这些检查只读源码和本地数据，不上传插件、导入 Catalog 或发布页面。

## 公开只读验证

```powershell
./verify-live-post-upgrade.ps1 -BaseUrl 'https://goearthward.com' -VerificationScope Full -RequiredUiMarker 'ew-t17-ui'
```

它验证公开页面、Catalog 和报价；不会创建购物车、订单或写入 WordPress。交易闭环仍需测试环境的管理员验收。

`../woo/` 中的旧 Step-0 脚本已被硬性阻止：它们会重启用已废弃的 Snippet，且不适用于当前插件。没有独立测试站和测试支付方式时，不得执行生产加购、结账、订单或退款测试。

## 候选包

```powershell
./build-candidate-plugin.ps1 -Version '0.1.41'
```

脚本拒绝覆盖同版本 ZIP，也会拒绝遗留 3D 文件。创建候选包不等于上传或部署。

## 研究与草稿素材

`build_linganshi_live_catalog_mapping.py`、`upload_linganshi_draft_media.py` 等脚本只处理研究或草稿素材。它们不能替代英文命名、图片授权、成本、库存和价格审批，也不得直接用于公开站。
