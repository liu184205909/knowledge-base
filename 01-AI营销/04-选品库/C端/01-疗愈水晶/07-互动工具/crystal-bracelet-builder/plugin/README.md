# EarthWard T17 Bracelet Builder

## Installation

1. Upload `earthward-t17-bracelet-builder-<version>.zip` in WordPress Admin > Plugins > Add New > Upload Plugin.
2. Activate `EarthWard T17 Bracelet Builder`.
3. Do not create a new WordPress page for T17. The existing `/tools/crystal-bracelet-builder/` route remains the only formal tool page; this plugin supplies backend capability only.
4. In T17 Builder > Material Catalog, set the existing `/tools/crystal-bracelet-builder/` page ID and a price version. This is only the target of official-design Customize links; the plugin does not render the editor page or register a builder shortcode.
5. Create one hidden WooCommerce virtual product named `Custom Crystal Bracelet`. Set it purchasable and add its product ID to the T17 Builder settings.
6. Import draft materials with the CSV template, review them, then set both material and variant status to `live`.

## Official Design Product

Each official design is one normal WooCommerce product. In the Product data > General panel, set:

- `T17 official design product`: enabled
- `Allow Customize this design`: enabled
- `Primary scene`: one stable scene key, such as `calm-grounding`
- `Design version` and `Price version`
- `T17 recipe JSON`: a sequence of T17 variant IDs

Example recipe:

```json
{
  "target_wrist_cm": 16,
  "fit_preference": "regular",
  "sequence": [
    {"variant_id":"amethyst-8mm"},
    {"variant_id":"clear-quartz-8mm"},
    {"variant_id":"amethyst-8mm"}
  ]
}
```

The product keeps its standard Woo direct-purchase flow. The extra `Customize this design` button opens the configured builder page with this recipe preloaded.

## Catalog CSV

`assets/catalog-template.csv` is the import contract. Each row is one purchasable variant. `material_key` and `variant_key` are stable, English slugs. Required columns are:

`material_key`, `component_type`, `name_en`, `variant_key`, `size_mm`, `price`, and `occupied_length_mm`.

The importer creates or updates records by stable ID. Use `draft` until price, image source, compatibility, and production fields have been reviewed. Material records are intentionally separate from WooCommerce products.

## Order Boundary

DIY checkout uses the one hidden Woo product only as an order carrier. Before it enters the cart, the server recalculates price from live variant IDs. The resulting recipe and price version are saved as immutable Woo line-item metadata for production and support.

## Future Plugin Updates

From version 0.1.6 onward, use T17 Builder > Release Updates to publish a newer version and the HTTPS URL of its reviewed ZIP. Upload the ZIP to the Media Library first. WordPress will then show the update in its normal Plugins or Updates screen. Automatic updates remain off by default.

The release ZIP must use `earthward-t17-bracelet-builder/` as its top-level directory. The release form is intentionally separate from catalog and Woo product data.

## Post-Deployment Public Check

Run the read-only public verifier after an installation or update:

```powershell
..\scripts\verify-live-post-upgrade.ps1 -BaseUrl 'https://goearthward.com'
```

It checks the public catalog route and page output without credentials or WordPress writes. It intentionally reports an empty catalog and an inaccessible draft preview as waiting/manual items rather than a deployment failure; the administrator checks printed by the script still gate production migration.
