# 12-sitemap 定位器

竞品分析 SOP v4.1 §1 步骤 2-3 的工具化。解决两个问题：

1. **robots.txt 没有 `Sitemap:` 声明 / 声明不全** → 自动降级链：robots 声明 → 常见路径探测（`/sitemap.xml` `/sitemap_index.xml` `/wp-sitemap.xml` 等 10 条）→ 全失败标 `none`
2. **全量递归提取** → sitemap index 递归展开（≤10 层），`<loc>` 提取兼容 CDATA / `.gz`，自动排除 `image:loc`

## 用法

```bash
python sitemap_locator.py example.com
python sitemap_locator.py example.com --out "D:/项目/竞品研究/站点sitemap数据"
python sitemap_locator.py example.com --probe-only   # 只定位不提取
```

## 输出

`{domain}_sitemap_raw.json`：

| 字段 | 说明 |
|------|------|
| `discovered_via` | `robots` / `probe`（探测命中）/ `none`（无 sitemap，降级处理） |
| `sitemap_urls` | 定位到的 sitemap 源（robots 可能多条） |
| `sitemap_sources` | 每个源的抓取状态（ok / fetch-error / not-sitemap / cross-domain-skip） |
| `page_urls` | 清洗后 HTML 页面 URL（写入深档的口径） |
| `stats` | loc 总数 / 页面数 / 排除数（参数、资产）/ 语言前缀分布 |

**口径与 SOP §1 步骤 3 一致**：去重后 HTML 页面 URL；排除参数 URL、附件资产（.pdf/.jpg 等）；多语言按独立页统计并给 `lang_prefix` 分布；`none` 时按 SOP 降级（仅目录推断+抽样，不产出 URL 底册）。

## 行为细节

- UA 伪装 Chrome；站内请求间隔 0.5s 防 429；gzip 自动解压
- 跨域 sitemap（CDN/子域分工）：记录 `cross-domain-skip` 不展开，防跑飞
- `?` 参数 URL 一律排除（`/index.php?sitemap=index` 仅用于探测，不进结果）
- Win 编码坑已处理：输出强制 utf-8

## 已知限制

- 个别站点 urllib 挂起（如 rosetoys 类网络环境）→ 降级用 curl 手抓首页 URL 喂 `crawl()`，或 webReader 兜底
- JS 动态渲染的 sitemap 页（极罕见）不支持
