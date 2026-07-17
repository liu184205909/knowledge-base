# T17 Local Acceptance Fixtures

`t17-v3-local-acceptance-catalog.csv` is a deliberately fake, non-production catalog for a disposable local or test WordPress instance. Every name starts with `Fixture`, its source is `local-development-fixture-not-for-sale`, and its values are only test values.

It is outside `approved-production-catalog.import.csv`, is not read by the production preflight, and must never be imported to the public site or copied into a production catalog. It exists so the administrator can exercise the REST catalog, server quote, mixed Variant sizes, incompatible Decor size validation, packaging, and Woo snapshot path after manually installing the candidate ZIP.

For a local acceptance instance only, import the CSV through **T17 Builder > Material Catalog**. It intentionally uses `live` records because public REST quote tests resolve only live Variants. Afterwards run:

```powershell
../../scripts/test-runtime-material-loop.ps1 `
  -BaseUrl 'https://local-test.example' `
  -BeadVariantId 'fixture-clear-8mm' `
  -DecorVariantId 'fixture-spacer-2mm' `
  -IncompatibleDecorVariantId 'fixture-spacer-2mm' `
  -IncompatibleBeadVariantId 'fixture-clear-6mm' `
  -PackagingVariantId 'fixture-elastic-cord-1mm'
```

Do not supply this fixture to the production import preflight or use it for a Woo product, checkout, public catalog, official design, price list, or media library.
