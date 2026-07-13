# T17 P0 Research Data Package

Status: `research-only`, created 2026-07-13.

This directory is a handoff package for later catalog, image, price, and official-design review. It is not an importer input and must not be copied into `../approved-production-catalog.import.csv` without material, image, cost, compatibility, and approval review.

## Two independent data lines

1. **Material data line**: beads, decor, cord, and packaging source/image/specification/price/production-review records. These feed the T17 independent material library only. A material or Variant is never a normal Woo product.
2. **Official Design Product data line**: complete, user-facing official design candidates for users who do not know how to combine materials. Only after a separate approval may one become a Woo Official Design Product that supports direct purchase or import into the editor.

The lines must not be substituted for one another. A competitor material, a material-library item, or a user design-gallery work does not automatically become a Woo product. This P0 package is research and audit preparation only and must not create or modify Woo products.

Files:

- `source-access-status-20260713.csv`: availability of every requested research source.
- `material-source-acquisition-ledger-20260713.csv`: visible material/image evidence and collection limits.
- `competitor-price-standardized-20260713.csv`: public competitor price evidence, normalized by unit where possible.
- `variant-price-review.research-candidates-20260713.csv`: a research-only copy shaped like the future price review table.
- `official-design-candidates-20260713.csv`: 32 non-production official-design slots.

Evidence labels:

- `verified-public`: text and/or image URL was visible on a public page in a read-only browser session.
- `visible-not-obtained`: a material was visible, but no direct original image file or product-level price was obtained.
- `access-not-available`: a source could not be read without a supported public or authorized route.
- `pending-user-input`: the source link was supplied but requires the user to provide an accessible export, screenshot, or authorized browser page.

No competitor image is an Earthward production image. Every candidate requires source/use review and an owned, supplier-authorized, or explicitly licensed replacement before production use.
