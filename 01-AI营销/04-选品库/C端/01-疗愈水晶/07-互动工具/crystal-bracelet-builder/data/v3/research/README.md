# T17 P0 Research Data Package

Status: `research-only`, created 2026-07-13.

This directory is a handoff package for later catalog, image, price, and official-design review. It is not an importer input and must not be copied into `../approved-production-catalog.import.csv` without material, image, cost, compatibility, and approval review.

## Three independent P0 data lines

1. **P0-A Material data line**: beads, decor, cord, and packaging source/image/specification/price/production-review records. These feed the T17 independent material library only. A material or Variant is never a normal Woo product.
2. **P0-B Official Design Product data line**: complete, user-facing official-design, template, or designer-finished-work research samples for users who do not know how to combine materials. A record must separately show its direct source/evidence, complete-image state, scene/tags, visible price, wrist or wear information, recipe evidence, and whether it can be rebuilt from approved Earthward Variants. Only after a separate approval may one become a Woo Official Design Product that supports direct purchase or import into the editor.
3. **P0-C Price and review data line**: public competitor prices normalized by unit plus Earthward's research-only price-review candidates. Competitor prices validate a range only; they are never Earthward final retail prices.

The lines must not be substituted for one another. A competitor material, a material-library item, a competitor preset, or a user design-gallery work does not automatically become a Woo product. This P0 package is research and audit preparation only and must not create or modify Woo products.

Files:

- `source-access-status-20260713.csv`: availability of every requested research source.
- `material-source-acquisition-ledger-20260713.csv`: visible material/image evidence and collection limits.
- `competitor-price-standardized-20260713.csv`: public competitor price evidence, normalized by unit where possible.
- `variant-price-review.research-candidates-20260713.csv`: a research-only copy shaped like the future price review table.
- `official-design-candidates-20260713.csv`: 32 internal scene/name research slots. These are not yet verified complete-design samples and must not be counted as rebuildable official presets.
- `P0-数据线边界与字段说明-20260713.md`: the P0-A/P0-B/P0-C boundary, status vocabulary, and required handoff fields.
- `国内素材去重与变体规则-20260714.md`: mandatory distinction between raw visible cards, material styles, size/price variants, and mapped image assets. Read this before reporting any deduplicated domestic-material count.
- `珠了个珠-设计广场采集与Woo预设转化规则-20260714.md`: treats Design Plaza works as Earthward preset candidates, keeps source recipes/prices separate from Earthward cost and retail calculation, and requires a newly rendered Earthward image before Woo review.
- `domestic-design-square-zhulegezhu-20260714.csv`: one research row per visible Design Plaza work; this is the preset-candidate index, not a Woo import.
- `domestic-design-square-zhulegezhu-components-20260714.csv`: one row per ingredient in a verified Design Plaza recipe; displayed source prices are retained as competitor evidence only.
- `P0-Annflora-可视素材目录-20260713.md`: a visual, remote-image index of the public Annflora material catalogue; it does not download or license competitor imagery.
- `overseas-visual-evidence/annflora-crystal-weave-20260713/`: local research copy of 90 publicly accessible Annflora image files mapped to 234 catalogue variants in `annflora-catalog-manifest-20260713.csv`. This is competitor research evidence only, never a production-asset source.
- `overseas-visual-evidence/moonarq-studio-20260713/`: local research copy of 82 publicly accessible MoonArq catalogue images mapped one-to-one to its public 82-variant Next.js catalogue in `moonarq-catalog-manifest-20260713.csv`. This is competitor research evidence only, never a production-asset source.
- `overseas-material-master-normalized-20260714.csv`: **primary browsing table**. One row per source material/style, with category, name, colour/family, form, all observed sizes and their prices, plus local image filename(s). Use this first.
- `overseas-material-size-prices-normalized-20260714.csv`: **price-detail table**. One row per actual source size/grade variant; repeated material names are intentional because size and price differ. It contains no duplicate source variant IDs.
- `overseas-competitors/01-myastris-data/`: complete MyAstris Wayback handoff, containing the 140-row RSC catalogue, 229 deduplicated size rows, 140 local research images, and collection notes. This is the folder template for later overseas competitors.

For the overseas visual research tables, `*-catalog-manifest-*.csv` is a download-audit record only: it maps every source variant to the local image file and records download status/bytes. It is not the primary material catalogue.

`overseas-competitors/` is the source-isolated comparison package: each competitor has its own numbered folder containing its tables, images, and notes. `00-collection-index-20260714.csv` reports collection completeness and must be read before comparing or filtering rows.

Evidence labels:

- `verified-public`: text and/or image URL was visible on a public page in a read-only browser session.
- `visible-not-obtained`: a material was visible, but no direct original image file or product-level price was obtained.
- `access-not-available`: a source could not be read without a supported public or authorized route.
- `pending-user-input`: the source link was supplied but requires the user to provide an accessible export, screenshot, or authorized browser page.

No competitor image is an Earthward production image. Every candidate requires source/use review and an owned, supplier-authorized, or explicitly licensed replacement before production use.
