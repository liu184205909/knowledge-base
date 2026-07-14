# T17 Frontend UI Bundle

This directory is the visual delivery layer for T17. It is intentionally separate from the WordPress plugin so layout, copy, 2D rendering, and interaction changes do not require a plugin ZIP upload.

## Deployment boundary

- `t17-builder-fragment.html`: paste the markup into an Elementor HTML widget or the dedicated page HTML block.
- `t17-builder-ui.css` and `t17-builder-ui.js`: upload as page assets or paste through the existing Code Snippets delivery path.
- `t17-builder-config.php`: a small PHP Code Snippet that only exposes runtime URLs and a nonce. It contains no visual markup or price logic.
- The plugin remains responsible for catalog storage, `GET /catalog`, `POST /quote`, Woo add-to-cart, and order snapshots.

The UI expects `window.EW_T17_UI_CONFIG`. The config snippet supplies it at render time. Do not put material prices, recipes, or quote rules into this bundle.

For an official Woo preset that is enabled for customization, link to the existing tool route with `?t17_design=<product-id>`. The page-scoped configuration reads only a positive integer ID; the UI then requests `GET /official-design/<product-id>` and imports the server-validated recipe, packaging, and quote. It never accepts a recipe or price from the URL.

## Local UI fixture

`t17-builder-mock-config.js` is an explicit, non-production fixture for validating the mobile editor before the plugin is installed. It supplies placeholder materials and a local display-only quote, disables Woo add-to-cart, and must never be loaded together with `t17-builder-config.php`. Its values are not approved catalog or sales data.

For local-only validation of the official import path, append `?t17_design=9001` to `preview.html`. This resolves only the placeholder `mockOfficialDesigns[9001]` fixture; it never represents a Woo product or approved preset.

`preview.html` is only a local development-validation artifact. It is not a WordPress page, does not replace `/tools/crystal-bracelet-builder/`, and must not be described or deployed as a new page route. It uses the preserved tray asset only for local visual QA; the page-scoped WordPress config must still receive an approved Media Library URL before frontend deployment.

## Verification

1. Confirm `GET /wp-json/ew-t17/v1/catalog` returns the expected schema.
2. On the existing T17 tool route in the test site, add a live material and verify `POST /quote` changes the displayed total.
3. Add the configuration to the cart and verify Woo stores the server quote snapshot.
4. For purely visual edits, verify the local development fixture at 320, 375, 390, 425, 768, and desktop widths. No plugin upload is needed.

Run `./validate-frontend-bundle.ps1` before replacing the independent frontend fragment on the existing T17 route. The preserved wood tray must be uploaded to the WordPress Media Library and its stable URL placed in the page-scoped config snippet; do not make final presentation depend on a plugin asset URL.
