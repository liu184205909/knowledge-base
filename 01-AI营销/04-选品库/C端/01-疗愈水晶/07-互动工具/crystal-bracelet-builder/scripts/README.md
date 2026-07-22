# T17 Verification Scripts

These scripts verify contracts and installed runtime behavior. They do not create WordPress pages, upload plugins, import production catalog data, or publish content.

## Research-only image mapping

`build_linganshi_image_mapping_review.py` reads the existing 244-row Linganshi workbook and the desktop research-image folder, then writes a separate mapping workbook with a 235-row product master, the retained 244 Variant rows, pending-Variant products and legacy alias/missing-image review. It never copies images or changes the source catalogue workbook. All 235 named images are enabled as temporary local draft assets; production import remains a later gate for complete Variant, category, direction, compatibility, occupancy and pricing data.

`build_linganshi_live_catalog_mapping.py` is the current consolidation entrypoint. It combines the 235 named WebP files, the retained legacy Variant workbook, and the captured current mini-program material response. It writes:

- `data/v3/research/linganshi-image-mapping-review-20260720.xlsx`;
- `data/v3/research/linganshi-235-draft-catalog-20260720.import.csv`;
- `data/v3/research/linganshi-235-media-upload-manifest-20260720.csv`.

The import file intentionally creates draft-only records. A product with no reliable size/price evidence receives one zero-value placeholder Variant so the 235-image audit remains complete without inventing sellable data. WordPress rejects zero-value live Variants, and these rows must not be promoted until English names, weights, occupied lengths, stock, direction and compatibility are reviewed. Re-running the script preserves any WordPress attachment IDs and media URLs already recorded in the media manifest.

`upload_linganshi_draft_media.py` is an idempotent WordPress Media uploader for the manifest. It is dry-run by default and requires both `--execute` and an exact `--confirm-site=<WP_SITE host>` before any external write. It checks for an existing attachment by stable Material key before uploading and checkpoints the manifest after every successful item. Do not execute it against the public site during the local-acceptance stage.

Do not use the older `build_linganshi_catalog_workbook.py` to perform image mapping: its CSV inputs cover only a subset of the existing workbook and rebuilding would discard manually retained Variant rows.

## Local source checks

Run before creating a candidate ZIP:

```powershell
./validate-backend-material-loop.ps1
../data/v3/validate-v3-data-contract.ps1
../data/v3/preflight-approved-production-import.ps1
../frontend/validate-frontend-bundle.ps1
```

`preflight-approved-production-import.ps1` is mandatory before an approved catalog upload. It cross-checks each live Variant against its approved image-provenance and price-review records, and checks every directional Decor against its non-importable, approved orientation review. It does not upload, import, or modify any record.

## Test-site public REST check

After the user manually installs the candidate ZIP once and creates explicit test records in the T17 backend, run:

```powershell
./test-runtime-material-loop.ps1 `
  -BaseUrl 'https://test.example.com' `
  -BeadVariantId 'test-bead-8mm' `
  -DecorVariantId 'test-spacer-2mm' `
  -IncompatibleDecorVariantId 'test-spacer-6mm-only' `
  -IncompatibleBeadVariantId 'test-bead-10mm' `
  -PackagingVariantId 'test-finish-variant' `
  -OfficialDesignProductId 123
```

The script reads only public T17 REST endpoints. It checks material-card fields, a successful server quote, unknown-Variant rejection, optional incompatible-bead-size rejection, and the official-design recipe endpoint. Cart and order snapshot checks require an authenticated WooCommerce test-session and remain a separate integration gate.

## Candidate package

After local source checks pass, create a single candidate package without uploading it:

```powershell
./build-candidate-plugin.ps1 -Version '0.1.10'
```

The package deliberately contains only backend plugin files and the catalog CSV template. It excludes legacy shortcode frontend files, plugin UI assets, and 3D assets. The user installs this candidate manually once on the test site; do not use it as a repeated UI delivery mechanism.

Candidate creation is also hard-blocked while the identified legacy 3D prototype files remain in `build/`. Remove those files manually before any later candidate build; exclusion from the ZIP is not treated as source cleanup.

## Disposable local acceptance data

For the installed runtime check, use only [the explicit local fixture](../data/v3/local-fixtures/README.md) in a local or disposable test instance. It is intentionally outside the production import path and must never be imported to the public site.
